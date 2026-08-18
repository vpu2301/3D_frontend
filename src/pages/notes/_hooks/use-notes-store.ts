import { create } from 'zustand';
import type { JSONContent } from '@tiptap/react';
import type { Note, Notebook, Reminder, NoteLink, TagInfo, SmartView } from '@/pages/notes/_lib/types';
import { notesStorage, newId } from '@/pages/notes/_lib/storage';
import { buildNotesSeed } from '@/pages/notes/_lib/seed';
import { computeBacklinks, deriveTitle, deriveFullText, extractInlineTags, type Backlink } from '@/pages/notes/_lib/backlinks';

const SEED_FLAG = 'seed:v1';
const PIN_LIMIT = 5;

const TAG_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1',
];

function pickTagColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return TAG_COLORS[hash % TAG_COLORS.length];
}

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
      note.tags.includes('meeting') &&
      !(note.links ?? []).some((l) => l.type === 'note'),
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

  load: () => Promise<void>;

  createNote: (init?: Partial<Note>) => Promise<Note>;
  updateNote: (id: string, patch: Partial<Note>) => Promise<void>;
  saveContent: (id: string, content: JSONContent) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  trashNote: (id: string) => Promise<void>;
  restoreNote: (id: string) => Promise<void>;
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

  /** Resolve or create the daily note for today. */
  ensureDailyNote: () => Promise<Note>;

  clearAll: () => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: {},
  notebooks: {},
  loaded: false,

  load: async () => {
    if (get().loaded) return;
    const flag = await notesStorage.getMeta<string>(SEED_FLAG);
    if (!flag) {
      const { notes, notebooks } = buildNotesSeed();
      await Promise.all([
        ...notes.map((n) => notesStorage.putNote(n)),
        ...notebooks.map((nb) => notesStorage.putNotebook(nb)),
      ]);
      await notesStorage.setMeta(SEED_FLAG, '1');
    }
    const [notesList, notebookList] = await Promise.all([
      notesStorage.listNotes(),
      notesStorage.listNotebooks(),
    ]);
    const notes: Record<string, Note> = {};
    for (const n of notesList) notes[n.id] = n;
    const notebooks: Record<string, Notebook> = {};
    for (const nb of notebookList) notebooks[nb.id] = nb;
    set({ notes, notebooks, loaded: true });
  },

  createNote: async (init) => {
    const now = Date.now();
    const note: Note = {
      id: newId('note'),
      content: { type: 'doc', content: [{ type: 'paragraph' }] },
      notebookId: null,
      tags: [],
      pinned: false,
      trashed: false,
      reminders: [],
      links: [],
      createdAt: now,
      updatedAt: now,
      ...init,
    };
    await notesStorage.putNote(note);
    set((s) => ({ notes: { ...s.notes, [note.id]: note } }));
    return note;
  },

  updateNote: async (id, patch) => {
    const cur = get().notes[id];
    if (!cur) return;
    const next: Note = { ...cur, ...patch, updatedAt: Date.now() };
    await notesStorage.putNote(next);
    set((s) => ({ notes: { ...s.notes, [id]: next } }));
  },

  saveContent: async (id, content) => {
    const cur = get().notes[id];
    if (!cur) return;
    // Re-extract inline tags whenever content changes; merge into stored tags
    // (preserving order of explicit tags first, then newly-discovered ones).
    const next: Note = { ...cur, content, updatedAt: Date.now() };
    const inline = extractInlineTags(next);
    const merged = Array.from(new Set([...cur.tags, ...inline]));
    next.tags = merged;
    await notesStorage.putNote(next);
    set((s) => ({ notes: { ...s.notes, [id]: next } }));
  },

  deleteNote: async (id) => {
    await notesStorage.deleteNote(id);
    set((s) => {
      const { [id]: _, ...rest } = s.notes;
      return { notes: rest };
    });
  },

  trashNote: async (id) => {
    await get().updateNote(id, { trashed: true, pinned: false });
  },
  restoreNote: async (id) => {
    await get().updateNote(id, { trashed: false });
  },

  togglePin: async (id) => {
    const cur = get().notes[id];
    if (!cur) return;
    if (!cur.pinned) {
      const pinnedCount = Object.values(get().notes).filter((n) => n.pinned && !n.trashed).length;
      if (pinnedCount >= PIN_LIMIT) {
        // No-op silently or could surface a toast; we silently cap.
        return;
      }
    }
    await get().updateNote(id, { pinned: !cur.pinned });
  },

  setTags: async (id, tags) => {
    await get().updateNote(id, {
      tags: Array.from(new Set(tags.map((t) => t.toLowerCase()))),
    });
  },
  addTag: async (id, tag) => {
    const cur = get().notes[id];
    if (!cur) return;
    const t = tag.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (!t || cur.tags.includes(t)) return;
    await get().updateNote(id, { tags: [...cur.tags, t] });
  },
  removeTag: async (id, tag) => {
    const cur = get().notes[id];
    if (!cur) return;
    await get().updateNote(id, { tags: cur.tags.filter((t) => t !== tag) });
  },
  moveToNotebook: async (id, notebookId) => {
    await get().updateNote(id, { notebookId });
  },
  setSortIndex: async (id, index) => {
    await get().updateNote(id, { sortIndex: index });
  },

  addLink: async (noteId, link) => {
    const cur = get().notes[noteId];
    if (!cur) return;
    if (cur.links.some((l) => l.type === link.type && l.targetId === link.targetId)) return;
    await get().updateNote(noteId, { links: [...cur.links, link] });
  },
  removeLink: async (noteId, type, targetId) => {
    const cur = get().notes[noteId];
    if (!cur) return;
    await get().updateNote(noteId, {
      links: cur.links.filter((l) => !(l.type === type && l.targetId === targetId)),
    });
  },

  addReminder: async (noteId, dueAt, location) => {
    const cur = get().notes[noteId];
    if (!cur) throw new Error('note not found');
    const reminder: Reminder = {
      id: newId('rem'),
      noteId,
      dueAt,
      location,
      // Mock calendar mirror — calendar module would consume this.
      calendarEventId: `cal_mock_${newId('e').slice(2, 10)}`,
      dismissed: false,
    };
    await get().updateNote(noteId, { reminders: [...cur.reminders, reminder] });
    return reminder;
  },
  dismissReminder: async (noteId, reminderId) => {
    const cur = get().notes[noteId];
    if (!cur) return;
    await get().updateNote(noteId, {
      reminders: cur.reminders.map((r) => (r.id === reminderId ? { ...r, dismissed: true } : r)),
    });
  },

  acceptSuggestedTag: async (id, tag) => {
    const cur = get().notes[id];
    if (!cur) return;
    const remaining = (cur.suggestedTags ?? []).filter((t) => t !== tag);
    const tags = cur.tags.includes(tag) ? cur.tags : [...cur.tags, tag];
    await get().updateNote(id, { suggestedTags: remaining, tags });
  },
  dismissSuggestedTag: async (id, tag) => {
    const cur = get().notes[id];
    if (!cur) return;
    await get().updateNote(id, {
      suggestedTags: (cur.suggestedTags ?? []).filter((t) => t !== tag),
    });
  },
  setSuggestedTags: async (id, tags) => {
    await get().updateNote(id, { suggestedTags: tags });
  },

  createNotebook: async (name, color) => {
    const nb: Notebook = {
      id: newId('nb'),
      name,
      color: color ?? TAG_COLORS[Object.keys(get().notebooks).length % TAG_COLORS.length],
      createdAt: Date.now(),
    };
    await notesStorage.putNotebook(nb);
    set((s) => ({ notebooks: { ...s.notebooks, [nb.id]: nb } }));
    return nb;
  },
  renameNotebook: async (id, name) => {
    const cur = get().notebooks[id];
    if (!cur) return;
    const next = { ...cur, name };
    await notesStorage.putNotebook(next);
    set((s) => ({ notebooks: { ...s.notebooks, [id]: next } }));
  },
  deleteNotebook: async (id) => {
    await notesStorage.deleteNotebook(id);
    set((s) => {
      const { [id]: _, ...rest } = s.notebooks;
      return { notebooks: rest };
    });
    // Re-parent notes to none
    for (const note of Object.values(get().notes)) {
      if (note.notebookId === id) await get().updateNote(note.id, { notebookId: null });
    }
  },

  ensureDailyNote: async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayMs = today.getTime();
    // Look for an existing daily note from today.
    for (const note of Object.values(get().notes)) {
      if (note.daily && note.createdAt >= todayMs && !note.trashed) {
        return note;
      }
    }
    const dateLabel = today.toLocaleDateString(undefined, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
    return await get().createNote({
      title: `Daily note — ${dateLabel}`,
      daily: true,
      tags: ['daily'],
      content: {
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: dateLabel }] },
          { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: "Today's intent" }] },
          { type: 'paragraph' },
          { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Tasks' }] },
          { type: 'taskList', content: [{ type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph' }] }] },
          { type: 'heading', attrs: { level: 3 }, content: [{ type: 'text', text: 'Notes' }] },
          { type: 'paragraph' },
        ],
      },
    });
  },

  clearAll: async () => {
    await notesStorage.clearAll();
    set({ notes: {}, notebooks: {}, loaded: false });
  },
}));

export const selectNotesMap = (s: NotesState) => s.notes;
export const selectNotebooksMap = (s: NotesState) => s.notebooks;

/** Derive tag info (name, color, count) from current notes. */
export function deriveTags(notes: Note[]): TagInfo[] {
  const counts = new Map<string, number>();
  for (const n of notes) {
    if (n.trashed) continue;
    for (const t of n.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count, color: pickTagColor(name) }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function selectBacklinks(notes: Note[]): Map<string, Backlink[]> {
  return computeBacklinks(notes);
}

export { deriveTitle, deriveFullText };
