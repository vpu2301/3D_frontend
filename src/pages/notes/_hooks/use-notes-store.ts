/**
 * Notes store — HTTP against the `notes_app` service.
 *
 * The public API is deliberately unchanged from the mock-era store: every
 * consumer (`NotesHome/List/Editor/TopBar/Trash/Daily/Graph/MiniRail/
 * QuickCapture`) kept compiling through the swap. Only the internals moved from
 * browser-local persistence to `apiClient`.
 *
 * Three rules the internals follow, because they are what makes an optimistic
 * store over a versioned API behave:
 *
 *  1. **Every mutation is optimistic, then reconciled with the response.** The
 *     server's note is the truth — in particular its `version`, which is the
 *     `baseVersion` of the next patch. On failure the previous note is put back
 *     and a toast fires; a silent rollback looks like the app ate the edit.
 *  2. **One PATCH per note in flight at a time.** Two concurrent patches from
 *     the same base version means the second is a guaranteed 409. Patches are
 *     serialised per note id through `chains`.
 *  3. **A 409 is not an error to swallow.** `VersionConflictError` carries the
 *     server's copy; it replaces the local note and the user is told. Server
 *     wins, no merge (ADR 0002).
 *
 * **Loading is paginated, in two movements.** `load()` fetches one keyset page
 * and paints; a background pass then follows `nextCursor` to exhaustion, and the
 * list's scroll sentinel can pull pages ahead of it through the same cursor.
 * First paint therefore does not wait for the corpus, but the corpus still
 * arrives — which it must, because the smart-view predicates, tag counts and
 * client-side sorting are computed over `notes` as a complete map. A list that
 * became one page would make those views quietly lie.
 *
 * Pages are merged by id and never overwrite a note already in the map, so a
 * note edited while a later page is in flight cannot be clobbered by an older
 * server copy, and a note that moves position mid-scroll cannot appear twice.
 */

import { create } from 'zustand';
import type { JSONContent } from '@tiptap/react';
import { toast } from 'sonner';
import { explainError, reportError } from '@/pages/notes/_lib/errors';
import type {
  Note,
  Notebook,
  NoteLink,
  Reminder,
  SmartView,
  TagInfo,
} from '@/pages/notes/_lib/types';
import { clearLegacyNotesStores, newId } from '@/pages/notes/_lib/storage';
import {
  VersionConflictError,
  notesApi,
  type ServerNote,
} from '@/pages/notes/_lib/apiClient';
import { deriveTitle, deriveFullText, extractInlineTags } from '@/pages/notes/_lib/backlinks';
import { notesApiBlocker } from '@/auth/apiFetch';

export const SMART_VIEWS: SmartView[] = [
  {
    id: 'open-tasks',
    name: 'Open tasks',
    description: 'Notes containing unchecked tasks',
    predicate: (note) => hasOpenTasks(note),
  },
  {
    id: 'decisions-this-week',
    name: 'Decisions this week',
    description: 'Notes tagged "decision" updated in the last 7 days',
    predicate: (note) =>
      note.tags.includes('decision') && Date.now() - note.updatedAt < 7 * 86_400_000,
  },
  {
    id: 'meetings-no-followups',
    name: 'Meetings without follow-ups',
    description: 'Meeting notes with no linked action-items note',
    predicate: (note) =>
      note.tags.includes('meeting') && !(note.links ?? []).some((l) => l.type === 'note'),
  },
];

function hasOpenTasks(note: Note): boolean {
  const walk = (n: any): boolean => {
    if (!n) return false;
    if (n.type === 'taskItem' && !n.attrs?.checked) return true;
    if (n.content) for (const c of n.content) if (walk(c)) return true;
    return false;
  };
  return walk(note.content);
}

interface NotesState {
  notes: Record<string, Note>;
  notebooks: Record<string, Notebook>;
  loaded: boolean;
  loading: boolean;
  /** Set when the corpus could not be loaded — the UI renders this, not an empty list. */
  loadError: string | null;

  /** Keyset cursor for the next page of active notes, null when exhausted. */
  cursor: string | null;
  /** A page is in flight — the list shows its sentinel as loading. */
  loadingMore: boolean;
  /** Every active note has arrived; smart-view counts are trustworthy from here. */
  fullyLoaded: boolean;
  /** Total active notes, from the first page's `total`. */
  total: number;

  load: () => Promise<void>;
  reload: () => Promise<void>;
  /** Pull the next keyset page. Driven by the list's scroll sentinel. */
  loadMore: () => Promise<void>;

  createNote: (init?: Partial<Note>) => Promise<Note>;
  updateNote: (id: string, patch: Partial<Note>) => Promise<void>;
  saveContent: (id: string, content: JSONContent) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  trashNote: (id: string) => Promise<void>;
  restoreNote: (id: string) => Promise<void>;
  emptyTrash: () => Promise<void>;
  togglePin: (id: string) => Promise<void>;
  setTags: (id: string, tags: string[]) => Promise<void>;
  addTag: (id: string, tag: string) => Promise<void>;
  removeTag: (id: string, tag: string) => Promise<void>;
  moveToNotebook: (id: string, notebookId: string | null) => Promise<void>;
  setSortIndex: (id: string, index: number) => Promise<void>;

  addLink: (noteId: string, link: NoteLink) => Promise<void>;
  removeLink: (noteId: string, type: NoteLink['type'], targetId: string) => Promise<void>;

  addReminder: (noteId: string, dueAt: number, location?: string) => Promise<Reminder>;
  dismissReminder: (noteId: string, reminderId: string) => Promise<void>;

  acceptSuggestedTag: (id: string, tag: string) => Promise<void>;
  dismissSuggestedTag: (id: string, tag: string) => Promise<void>;
  setSuggestedTags: (id: string, tags: string[]) => Promise<void>;

  createNotebook: (name: string, color?: string) => Promise<Notebook>;
  renameNotebook: (id: string, name: string) => Promise<void>;
  deleteNotebook: (id: string) => Promise<void>;

  /** Resolve or create the daily note for today. Idempotent server-side. */
  ensureDailyNote: () => Promise<Note>;

  /**
   * Force a version row: called on editor blur and route change so a writing
   * session always ends on something restorable, while the 300 ms autosaves in
   * between coalesce into roughly one version per minute.
   */
  checkpoint: (id: string) => Promise<void>;

  /** Replace one note from the server — used after a conflict or an agent write. */
  refreshNote: (id: string) => Promise<void>;

  /**
   * Last-chance save on `beforeunload`. Fire-and-forget with `keepalive`, since
   * the page is already going away and there is nothing left to await into.
   */
  flushSync: (id: string, content: JSONContent) => void;

  clearAll: () => Promise<void>;
}

/**
 * Per-note patch chains. Keyed by note id; each entry is the tail of that
 * note's in-flight promise chain, so patches queue instead of racing.
 */
const chains = new Map<string, Promise<unknown>>();

function enqueue<T>(id: string, task: () => Promise<T>): Promise<T> {
  const previous = chains.get(id) ?? Promise.resolve();
  const next = previous.then(task, task);
  // Keep the chain alive but never let a rejection poison the next task.
  chains.set(
    id,
    next.catch(() => undefined),
  );
  return next;
}

/**
 * Notes per keyset page.
 *
 * Sized so the first page fills the list panel several times over — the user
 * never sees the sentinel on a normal-length workspace — while staying small
 * enough that first paint does not wait on a corpus.
 */
const PAGE_SIZE = 50;

/**
 * The background completion pass, exposed so a caller can wait for the whole
 * corpus rather than poll `fullyLoaded`. Nothing in the UI awaits it — the list
 * is usable from the first page — but the tests do, and so would any future
 * view that genuinely cannot render a partial corpus.
 */
let corpusCompletion: Promise<void> | null = null;

export function whenCorpusLoaded(): Promise<void> {
  return corpusCompletion ?? Promise.resolve();
}

/** Bootstrapping that must happen once per page load, before the first request. */
let bootstrapped: Promise<void> | null = null;

function bootstrap(): Promise<void> {
  bootstrapped ??= clearLegacyNotesStores();
  return bootstrapped;
}

export const useNotesStore = create<NotesState>((set, get) => {
  /** Write a server note into the map, dropping any temp entry it replaces. */
  const absorb = (note: ServerNote, replacesId?: string) =>
    set((s) => {
      const notes = { ...s.notes };
      if (replacesId && replacesId !== note.id) delete notes[replacesId];
      notes[note.id] = note;
      return { notes };
    });

  const putLocal = (note: Note) => set((s) => ({ notes: { ...s.notes, [note.id]: note } }));

  const dropLocal = (id: string) =>
    set((s) => {
      const { [id]: _removed, ...rest } = s.notes;
      return { notes: rest };
    });

  /**
   * Optimistic patch: apply locally, PATCH with the stored `baseVersion`,
   * reconcile. `checkpointFlag` forces a version row server-side.
   */
  const patch = async (id: string, changes: Partial<Note>, checkpointFlag = false) => {
    const current = get().notes[id];
    if (!current) return;
    // A note that has not been created server-side yet has nothing to patch
    // against; its creation carries the fields instead.
    if (isTempId(id)) return;

    const optimistic: Note = { ...current, ...changes, updatedAt: Date.now() };
    putLocal(optimistic);

    await enqueue(id, async () => {
      const base = get().notes[id];
      const baseVersion = base?.version ?? current.version;
      try {
        const saved = await notesApi.patch(id, changes, baseVersion, checkpointFlag);
        absorb(saved);
      } catch (error) {
        if (error instanceof VersionConflictError) {
          absorb(error.serverNote);
          toast.error('Note was updated elsewhere', {
            description: 'Your copy was replaced with the server version.',
          });
          return;
        }
        putLocal(current);
        reportError(error, { title: 'Could not save the note' });
        throw error;
      }
    });
  };

  /**
   * Merge a page in without touching notes already held.
   *
   * Two properties fall out of this, both of which the pagination needs: a note
   * cannot appear twice (the map is keyed by id), and a page that was in flight
   * while the user edited cannot overwrite the newer local copy with the older
   * server one.
   */
  const mergePage = (items: ServerNote[]) =>
    set((s) => {
      const notes = { ...s.notes };
      for (const note of items) if (!notes[note.id]) notes[note.id] = note;
      return { notes };
    });

  /**
   * One page at a time, whoever asked. The scroll sentinel and the background
   * completion share this promise, so the two can never fetch the same cursor
   * and produce a gap by both advancing it.
   */
  let pageInFlight: Promise<void> | null = null;

  const fetchNextPage = (): Promise<void> => {
    if (pageInFlight) return pageInFlight;
    const cursor = get().cursor;
    if (!cursor) return Promise.resolve();

    set({ loadingMore: true });
    pageInFlight = (async () => {
      try {
        const page = await notesApi.list({ include: 'content', limit: PAGE_SIZE, cursor });
        mergePage(page.items);
        set({ cursor: page.nextCursor, fullyLoaded: page.nextCursor === null });
      } catch {
        // The cursor is left in place: a page that failed is a page the next
        // scroll or the background pass retries, not a hole in the corpus.
      } finally {
        set({ loadingMore: false });
        pageInFlight = null;
      }
    })();
    return pageInFlight;
  };

  /**
   * Finish the corpus behind the first paint: the remaining active pages, then
   * the trash. Trash is last because nothing on the default route needs it, and
   * it is fetched whole because it is small by construction.
   */
  const completeLoad = async (): Promise<void> => {
    // Bounded for the same reason `listAll` is: a server that keeps handing
    // back a cursor must not spin the tab forever.
    for (let page = 0; page < 200 && get().cursor; page++) {
      const before = get().cursor;
      await fetchNextPage();
      if (get().cursor === before) break; // the page failed; stop rather than loop
    }
    if (!get().fullyLoaded) return;
    try {
      mergePage(await notesApi.listAll({ include: 'content', trashed: true }));
    } catch {
      /* the trash view reloads on its own if this failed */
    }
  };

  return {
    notes: {},
    notebooks: {},
    loaded: false,
    loading: false,
    loadError: null,
    cursor: null,
    loadingMore: false,
    fullyLoaded: false,
    total: 0,

    load: async () => {
      if (get().loaded || get().loading) return;
      await get().reload();
    },

    reload: async () => {
      set({ loading: true, loadError: null, fullyLoaded: false, cursor: null });
      await bootstrap();

      // Failing here with the actual reason beats letting every request 401 or,
      // worse, fetch the SPA's own HTML and fail to parse it as JSON.
      const blocker = notesApiBlocker();
      if (blocker) {
        set({ loading: false, loaded: false, loadError: blocker });
        return;
      }

      try {
        // One page, then paint. `total` comes back with it, so the list can say
        // how many notes exist before it holds them all.
        const [notebookList, first] = await Promise.all([
          notesApi.notebooks(),
          notesApi.list({ include: 'content', limit: PAGE_SIZE }),
        ]);

        const notes: Record<string, Note> = {};
        for (const n of first.items) notes[n.id] = n;
        const notebooks: Record<string, Notebook> = {};
        for (const nb of notebookList) notebooks[nb.id] = nb;

        set({
          notes,
          notebooks,
          loaded: true,
          loading: false,
          loadError: null,
          cursor: first.nextCursor,
          total: first.total,
          fullyLoaded: first.nextCursor === null,
        });

        // The rest arrives behind the paint. Nothing awaits it: the list is
        // already usable, and the views that need the whole corpus say so by
        // reading `fullyLoaded`.
        corpusCompletion = completeLoad();
      } catch (error) {
        const friendly = explainError(error);
        set({ loading: false, loadError: `${friendly.title}. ${friendly.description}` });
      }
    },

    loadMore: async () => {
      await fetchNextPage();
    },

    createNote: async (init) => {
      const now = Date.now();
      // A temp id keeps the editor and the list usable during the round trip;
      // the create response's real UUID replaces it (Sprint 1 §6.2).
      const temp: Note = {
        id: newId('tmp'),
        content: { type: 'doc', content: [{ type: 'paragraph' }] },
        notebookId: null,
        tags: [],
        pinned: false,
        trashed: false,
        reminders: [],
        links: [],
        version: 0,
        createdAt: now,
        updatedAt: now,
        ...init,
      };
      putLocal(temp);

      try {
        const created = await notesApi.create(init ?? {});
        absorb(created, temp.id);
        return created;
      } catch (error) {
        dropLocal(temp.id);
        reportError(error, { title: 'Could not create the note' });
        throw error;
      }
    },

    updateNote: async (id, changes) => {
      await patch(id, changes);
    },

    saveContent: async (id, content) => {
      const current = get().notes[id];
      if (!current) return;
      // The server extracts `#tags` on save too; doing it locally as well means
      // the chip appears in the tag row on the keystroke rather than after the
      // round trip. The server's answer wins on reconcile either way.
      const inline = extractInlineTags({ ...current, content });
      const tags = Array.from(new Set([...current.tags, ...inline]));
      const changes: Partial<Note> =
        tags.length === current.tags.length ? { content } : { content, tags };
      await patch(id, changes);
    },

    /**
     * There is no per-note purge on the server — trash is emptied wholesale
     * (`DELETE /v1/trash`). `deleteNote` therefore trashes, and `emptyTrash` is
     * the destructive one.
     */
    deleteNote: async (id) => {
      await get().trashNote(id);
    },

    trashNote: async (id) => {
      const current = get().notes[id];
      if (!current || isTempId(id)) return;
      putLocal({ ...current, trashed: true, pinned: false });
      try {
        absorb(await notesApi.trash(id));
      } catch (error) {
        putLocal(current);
        reportError(error, { title: 'Could not move the note to trash' });
      }
    },

    restoreNote: async (id) => {
      const current = get().notes[id];
      if (!current || isTempId(id)) return;
      putLocal({ ...current, trashed: false });
      try {
        absorb(await notesApi.restore(id));
      } catch (error) {
        putLocal(current);
        reportError(error, { title: 'Could not restore the note' });
      }
    },

    emptyTrash: async () => {
      const before = get().notes;
      const trashedIds = Object.values(before)
        .filter((n) => n.trashed)
        .map((n) => n.id);
      if (trashedIds.length === 0) return;

      set((s) => {
        const notes = { ...s.notes };
        for (const id of trashedIds) delete notes[id];
        return { notes };
      });

      try {
        await notesApi.emptyTrash();
        toast.success(`Deleted ${trashedIds.length} note${trashedIds.length === 1 ? '' : 's'}`);
      } catch (error) {
        set({ notes: before });
        reportError(error, { title: 'Could not empty the trash' });
      }
    },

    /**
     * The server enforces the cap of five pinned notes silently, so there is no
     * local `PIN_LIMIT` check: the response is the answer, and reconciling it
     * un-pins the optimistic guess if the cap was hit.
     */
    togglePin: async (id) => {
      const current = get().notes[id];
      if (!current || isTempId(id)) return;
      putLocal({ ...current, pinned: !current.pinned });
      try {
        absorb(await notesApi.togglePin(id));
      } catch (error) {
        putLocal(current);
        reportError(error, { title: 'Could not change the pin' });
      }
    },

    setTags: async (id, tags) => {
      const current = get().notes[id];
      if (!current || isTempId(id)) return;
      const normalised = Array.from(new Set(tags.map((t) => t.toLowerCase())));
      putLocal({ ...current, tags: normalised });
      try {
        absorb(await notesApi.setTags(id, normalised));
      } catch (error) {
        putLocal(current);
        reportError(error, { title: 'Could not update tags' });
      }
    },

    addTag: async (id, tag) => {
      const current = get().notes[id];
      if (!current) return;
      const t = tag.toLowerCase().replace(/[^a-z0-9-]/g, '-');
      if (!t || current.tags.includes(t)) return;
      await get().setTags(id, [...current.tags, t]);
    },

    removeTag: async (id, tag) => {
      const current = get().notes[id];
      if (!current) return;
      await get().setTags(
        id,
        current.tags.filter((t) => t !== tag),
      );
    },

    moveToNotebook: async (id, notebookId) => {
      const current = get().notes[id];
      if (!current || isTempId(id)) return;
      putLocal({ ...current, notebookId });
      try {
        absorb(await notesApi.moveToNotebook(id, notebookId));
      } catch (error) {
        putLocal(current);
        reportError(error, { title: 'Could not move the note' });
      }
    },

    /** 204, no note back — the optimistic value stands unless the call fails. */
    setSortIndex: async (id, index) => {
      const current = get().notes[id];
      if (!current || isTempId(id)) return;
      putLocal({ ...current, sortIndex: index });
      try {
        await notesApi.setSortIndex(id, index);
      } catch (error) {
        putLocal(current);
        reportError(error, { title: 'Could not reorder' });
      }
    },

    addLink: async (noteId, link) => {
      const current = get().notes[noteId];
      if (!current || isTempId(noteId)) return;
      if (current.links.some((l) => l.type === link.type && l.targetId === link.targetId)) return;

      putLocal({ ...current, links: [...current.links, link] });
      try {
        const saved = await notesApi.addLink(noteId, link);
        const latest = get().notes[noteId];
        if (!latest) return;
        putLocal({
          ...latest,
          links: [
            ...latest.links.filter((l) => !(l.type === link.type && l.targetId === link.targetId)),
            saved as NoteLink,
          ],
        });
      } catch (error) {
        putLocal(current);
        reportError(error, { title: 'Could not add the link' });
      }
    },

    removeLink: async (noteId, type, targetId) => {
      const current = get().notes[noteId];
      if (!current || isTempId(noteId)) return;
      putLocal({
        ...current,
        links: current.links.filter((l) => !(l.type === type && l.targetId === targetId)),
      });
      try {
        await notesApi.removeLink(noteId, type, targetId);
      } catch (error) {
        putLocal(current);
        reportError(error, { title: 'Could not remove the link' });
      }
    },

    /**
     * Reminders are their own rows server-side and mirror to the real Calendar
     * Mirror service, so there is no fabricated `cal_mock_…` id any more:
     * `calendarEventId` arrives null and the badge says "Mirroring…" until the
     * mirror has run.
     */
    addReminder: async (noteId, dueAt, location) => {
      const current = get().notes[noteId];
      if (!current) throw new Error('note not found');
      if (isTempId(noteId)) throw new Error('note is still being created');

      const reminder = await notesApi
        .createReminder(noteId, dueAt, location)
        .catch((error: unknown) => {
          reportError(error, { title: 'Could not set the reminder' });
          throw error;
        });

      const latest = get().notes[noteId] ?? current;
      putLocal({ ...latest, reminders: [...latest.reminders, reminder] });
      return reminder;
    },

    dismissReminder: async (noteId, reminderId) => {
      const current = get().notes[noteId];
      if (!current) return;
      putLocal({
        ...current,
        reminders: current.reminders.map((r) =>
          r.id === reminderId ? { ...r, dismissed: true } : r,
        ),
      });
      try {
        await notesApi.patchReminder(reminderId, { dismissed: true });
      } catch (error) {
        putLocal(current);
        reportError(error, { title: 'Could not dismiss the reminder' });
      }
    },

    acceptSuggestedTag: async (id, tag) => {
      const current = get().notes[id];
      if (!current) return;
      const remaining = (current.suggestedTags ?? []).filter((t) => t !== tag);
      const tags = current.tags.includes(tag) ? current.tags : [...current.tags, tag];
      // Two dedicated endpoints rather than one generic patch, so run them in
      // order and let the second response be the one that lands.
      await get().setTags(id, tags);
      await get().setSuggestedTags(id, remaining);
    },

    dismissSuggestedTag: async (id, tag) => {
      const current = get().notes[id];
      if (!current) return;
      await get().setSuggestedTags(
        id,
        (current.suggestedTags ?? []).filter((t) => t !== tag),
      );
    },

    setSuggestedTags: async (id, tags) => {
      const current = get().notes[id];
      if (!current || isTempId(id)) return;
      putLocal({ ...current, suggestedTags: tags });
      try {
        absorb(await notesApi.setSuggestedTags(id, tags));
      } catch {
        // Suggestions are advisory; a failure here is not worth a toast.
        putLocal(current);
      }
    },

    createNotebook: async (name, color) => {
      const nb = await notesApi.createNotebook(name, color).catch((error: unknown) => {
        reportError(error, { title: 'Could not create the notebook' });
        throw error;
      });
      set((s) => ({ notebooks: { ...s.notebooks, [nb.id]: nb } }));
      return nb;
    },

    renameNotebook: async (id, name) => {
      const current = get().notebooks[id];
      if (!current) return;
      set((s) => ({ notebooks: { ...s.notebooks, [id]: { ...current, name } } }));
      try {
        const saved = await notesApi.renameNotebook(id, name);
        set((s) => ({ notebooks: { ...s.notebooks, [id]: saved } }));
      } catch (error) {
        set((s) => ({ notebooks: { ...s.notebooks, [id]: current } }));
        reportError(error, { title: 'Could not rename the notebook' });
      }
    },

    deleteNotebook: async (id) => {
      const before = { notebooks: get().notebooks, notes: get().notes };
      set((s) => {
        const { [id]: _removed, ...notebooks } = s.notebooks;
        const notes = { ...s.notes };
        // The server re-parents its notes; mirror that locally so the list does
        // not show a notebook that no longer exists.
        for (const note of Object.values(notes)) {
          if (note.notebookId === id) notes[note.id] = { ...note, notebookId: null };
        }
        return { notebooks, notes };
      });

      try {
        await notesApi.deleteNotebook(id);
      } catch (error) {
        set(before);
        reportError(error, { title: 'Could not delete the notebook' });
      }
    },

    ensureDailyNote: async () => {
      const note = await notesApi.ensureDaily().catch((error: unknown) => {
        reportError(error, { title: "Could not open today's note" });
        throw error;
      });
      absorb(note);
      return note;
    },

    checkpoint: async (id) => {
      const current = get().notes[id];
      if (!current || isTempId(id)) return;
      await enqueue(id, async () => {
        const base = get().notes[id];
        if (!base) return;
        try {
          absorb(await notesApi.patch(id, { content: base.content }, base.version, true));
        } catch (error) {
          if (error instanceof VersionConflictError) {
            absorb(error.serverNote);
            return;
          }
          // A failed checkpoint costs a restore point, not data — the last
          // autosave already landed. Not worth interrupting the user.
        }
      });
    },

    refreshNote: async (id) => {
      if (isTempId(id)) return;
      try {
        absorb(await notesApi.get(id));
      } catch {
        /* the note may have been purged; the map entry is harmless */
      }
    },

    flushSync: (id, content) => {
      const current = get().notes[id];
      if (!current || isTempId(id)) return;
      // No await, no error handling: the tab is unloading. Either the keepalive
      // request reaches the server or the last 300 ms of typing is lost, and
      // there is no third option to code for.
      void notesApi.patch(id, { content }, current.version, true, true).catch(() => undefined);
    },

    clearAll: async () => {
      chains.clear();
      set({
        notes: {},
        notebooks: {},
        loaded: false,
        loading: false,
        loadError: null,
        cursor: null,
        loadingMore: false,
        fullyLoaded: false,
        total: 0,
      });
    },
  };
});

/** Client-minted placeholder id, live only until the create response lands. */
export function isTempId(id: string): boolean {
  return id.startsWith('tmp_');
}

export const selectNotesMap = (s: NotesState) => s.notes;
export const selectNotebooksMap = (s: NotesState) => s.notebooks;

/**
 * Tag list, from the server (`GET /v1/tags`) — name, count and a colour chosen
 * by the same hash the mock used, so nothing changes visually.
 *
 * Kept as a hook rather than a store slice because the sidebar is the only
 * consumer and it wants a refetch on note changes, not a cached slice.
 */
export async function fetchTags(): Promise<TagInfo[]> {
  return notesApi.tags();
}

export { deriveTitle, deriveFullText };
