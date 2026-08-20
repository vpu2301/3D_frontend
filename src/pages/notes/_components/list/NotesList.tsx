import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Pin, CheckSquare, Hash, ListChecks, Loader2, Sun, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { useNotesStore, selectNotesMap, SMART_VIEWS } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import { useCommandRunner } from '@/pages/notes/_hooks/use-notes-commands';
import { selectOpenCountsByNote, useOutcomesStore } from '@/pages/notes/_hooks/use-outcomes-store';
import { Skeleton } from '@/components/ui/skeleton';
import { deriveTitle, deriveSnippet } from '@/pages/notes/_lib/backlinks';
import type { Note } from '@/pages/notes/_lib/types';
import { cn } from '@/lib/utils';
import NotesListToolbar from './NotesListToolbar';
import NoteSwipeRow from './NoteSwipeRow';

/**
 * This panel no longer searches.
 *
 * It used to run its own `GET /v1/notes?q=` against a box in its toolbar, which
 * made two search boxes in one module with two different behaviours. FE-3 §1
 * collapses that to one entry point — `Cmd+K`, then the full search page — so
 * what is left here is scope (notebook, tag, smart view), filters and sort, all
 * evaluated over the loaded corpus.
 */

function formatRelative(ts: number): string {
  const diff = Date.now() - ts;
  const m = 60_000;
  const h = 3_600_000;
  const d = 86_400_000;
  if (diff < m) return 'just now';
  if (diff < h) return `${Math.floor(diff / m)}m ago`;
  if (diff < d) return `${Math.floor(diff / h)}h ago`;
  if (diff < 7 * d) return `${Math.floor(diff / d)}d ago`;
  return new Date(ts).toLocaleDateString();
}

function countOpenTasks(note: Note): { open: number; total: number } {
  let open = 0;
  let total = 0;
  const walk = (n: any) => {
    if (!n) return;
    if (n.type === 'taskItem') {
      total++;
      if (!n.attrs?.checked) open++;
    }
    if (n.content) for (const c of n.content) walk(c);
  };
  walk(note.content);
  return { open, total };
}

export default function NotesList() {
  const notesMap = useNotesStore(selectNotesMap);
  const notebooks = useNotesStore((s) => s.notebooks);
  const loading = useNotesStore((s) => s.loading);
  const loadError = useNotesStore((s) => s.loadError);
  const loadMore = useNotesStore((s) => s.loadMore);
  const loadingMore = useNotesStore((s) => s.loadingMore);
  const fullyLoaded = useNotesStore((s) => s.fullyLoaded);
  const togglePin = useNotesStore((s) => s.togglePin);
  const trashNote = useNotesStore((s) => s.trashNote);
  const restoreNote = useNotesStore((s) => s.restoreNote);
  const run = useCommandRunner();
  const sentinelRef = useRef<HTMLDivElement>(null);
  // "3 open" on a row. Built from rows the server returned as `status=open` —
  // there is no per-note count endpoint — so it is a hint on a row and never a
  // number the user acts on. The numbers that matter live in `summary`.
  const outcomesById = useOutcomesStore((s) => s.byId);
  const loadOpenIndex = useOutcomesStore((s) => s.loadOpenIndex);
  const openCounts = useMemo(
    () => selectOpenCountsByNote({ byId: outcomesById } as never),
    [outcomesById],
  );

  useEffect(() => {
    void loadOpenIndex();
  }, [loadOpenIndex]);
  const { sort, filter, smartViewId, selectedNoteId, setSelectedNoteId } = useNotesUiStore();
  const navigate = useNavigate();
  const params = useParams<{ id?: string; tag?: string }>();
  const location = useLocation();

  const notes = useMemo(() => Object.values(notesMap), [notesMap]);

  const list = useMemo(() => {
    let arr = notes.filter((n) => !n.trashed);

    const isNotebookRoute = location.pathname.startsWith('/notes/notebook/');
    const isTagRoute = location.pathname.startsWith('/notes/tag/');

    if (isNotebookRoute && params.id) {
      arr = arr.filter((n) => n.notebookId === params.id);
    } else if (isTagRoute && params.tag) {
      const tag = decodeURIComponent(params.tag);
      arr = arr.filter((n) => n.tags.includes(tag));
    } else {
      if (filter.notebookId) arr = arr.filter((n) => n.notebookId === filter.notebookId);
      if (filter.tag) arr = arr.filter((n) => n.tags.includes(filter.tag!));
    }

    if (smartViewId) {
      const view = SMART_VIEWS.find((v) => v.id === smartViewId);
      if (view) arr = arr.filter(view.predicate);
    }

    if (filter.hasReminder) arr = arr.filter((n) => n.reminders.some((r) => !r.dismissed));
    if (filter.linkedToDoc) arr = arr.filter((n) => n.links.some((l) => l.type === 'doc'));
    if (filter.linkedToEvent) arr = arr.filter((n) => n.links.some((l) => l.type === 'event'));

    const pinned = arr.filter((n) => n.pinned);
    const rest = arr.filter((n) => !n.pinned);
    const cmp = (a: Note, b: Note) => {
      if (sort.by === 'updated') return b.updatedAt - a.updatedAt;
      if (sort.by === 'created') return b.createdAt - a.createdAt;
      if (sort.by === 'title') return deriveTitle(a).localeCompare(deriveTitle(b));
      if (sort.by === 'manual') return (a.sortIndex ?? 0) - (b.sortIndex ?? 0);
      return 0;
    };
    pinned.sort(cmp);
    rest.sort(cmp);
    if (sort.dir === 'asc') {
      pinned.reverse();
      rest.reverse();
    }
    return [...pinned, ...rest];
  }, [notes, sort, filter, smartViewId, params, location.pathname]);

  const scopeLabel = useMemo(() => {
    if (smartViewId) {
      const v = SMART_VIEWS.find((v) => v.id === smartViewId);
      return v?.name ?? 'Smart view';
    }
    if (location.pathname.startsWith('/notes/notebook/') && params.id) {
      const nb = notebooks[params.id];
      return nb ? nb.name : 'Notebook';
    }
    if (location.pathname.startsWith('/notes/tag/') && params.tag) {
      return `#${decodeURIComponent(params.tag)}`;
    }
    return 'All notes';
  }, [smartViewId, location.pathname, params, notebooks]);

  const onSelect = (id: string) => {
    setSelectedNoteId(id);
    navigate(`/notes/${id}`);
  };

  /**
   * Swipe left trashes. Trash is reversible, so the confirmation is an undo in
   * the toast rather than a dialog in the way — a gesture that has to be
   * confirmed is slower than the menu it was meant to replace.
   */
  const onSwipeTrash = (note: Note) => {
    void trashNote(note.id);
    if ((selectedNoteId ?? params.id) === note.id) navigate('/notes');
    toast.success(`Moved “${deriveTitle(note)}” to trash`, {
      action: { label: 'Undo', onClick: () => void restoreNote(note.id) },
    });
  };

  const onSwipePin = (note: Note) => {
    void togglePin(note.id);
  };

  /**
   * Keyset pagination.
   *
   * The endpoint has been keyset-paginated since Sprint 1 and nothing had ever
   * used it. A sentinel below the last row asks for the next page as it comes
   * into view, so a workspace that outgrows the first page keeps scrolling
   * rather than stopping at 50 — and because the store merges pages by id, a
   * note inserted mid-scroll cannot show up twice.
   *
   * `rootMargin` fires it a screen early, so the pages land before the user
   * reaches the bottom.
   */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || fullyLoaded) return;
    // jsdom and older Safari have no IntersectionObserver; the store's
    // background pass still completes the corpus, so this is an enhancement.
    if (typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) void loadMore();
      },
      { rootMargin: '400px' },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [fullyLoaded, loadMore, list.length]);

  return (
    <div className="flex h-full w-[360px] shrink-0 flex-col border-r border-[var(--line-soft)]">
      <div className="px-5 pt-5 pb-3">
        <p className="plat-crumb">3days.notes</p>
        <h1 className="mt-1.5 flex items-baseline gap-2 text-[22px]">
          {scopeLabel}{' '}
          <span className="text-[15px] font-normal" style={{ color: 'var(--text-5)' }}>
            {list.length}
          </span>
        </h1>
      </div>

      <NotesListToolbar />

      <div className="flex-1 overflow-y-auto" data-notes-list tabIndex={-1}>
        {loadError ? (
          <div
            className="m-4 rounded-[12px] border p-3 text-xs"
            style={{ borderColor: 'rgba(179,56,46,0.25)', background: '#fdf3f2', color: 'var(--bad-fg)' }}
          >
            {loadError}
          </div>
        ) : loading && notes.length === 0 ? (
          <ListSkeleton />
        ) : list.length === 0 ? (
          <EmptyState run={run} />
        ) : (
          list.map((note) => {
            const active = (selectedNoteId ?? params.id) === note.id;
            const tasks = countOpenTasks(note);
            const openOutcomes = openCounts[note.id] ?? 0;
            const title = deriveTitle(note);
            // The server's `snippet` renders Markdown properly; the local
            // derivation is the fallback for a note whose content is loaded.
            const snippet = note.snippet ?? deriveSnippet(note);
            return (
              <NoteSwipeRow
                key={note.id}
                pinned={note.pinned}
                onPin={() => onSwipePin(note)}
                onTrash={() => onSwipeTrash(note)}
              >
                <button
                  type="button"
                  data-notes-list-row
                  data-active={active}
                  data-command-exempt="selects a note; the command form is nav.find-note"
                  onClick={() => onSelect(note.id)}
                  className={cn(
                    // Opaque: the swipe panels sit behind the row and must only
                    // be visible through the gap the gesture opens.
                    'flex w-full flex-col gap-1 border-b border-[var(--line-soft)] px-4 py-2.5 text-left transition-colors',
                    active ? 'bg-[rgba(20,22,26,0.06)]' : 'hover:bg-[rgba(20,22,26,0.03)]',
                  )}
                >
                  <div className="flex items-center gap-1.5">
                    {note.pinned && <Pin className="h-3 w-3 fill-amber-500 text-amber-500" />}
                    <span className="flex-1 truncate text-sm font-medium text-[var(--ink)]">
                      {title}
                    </span>
                    <span className="shrink-0 text-[10px]" style={{ color: 'var(--text-5)' }}>
                      {formatRelative(note.updatedAt)}
                    </span>
                  </div>
                  <div className="line-clamp-2 text-xs" style={{ color: 'var(--text-4)' }}>
                    {snippet || ' '}
                  </div>
                  {(note.tags.length > 0 || tasks.total > 0 || openOutcomes > 0) && (
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      {openOutcomes > 0 && (
                        <span className="plat-pill plat-pill-mute !px-1.5 !py-0.5 !text-[10px]">
                          {openOutcomes} open
                        </span>
                      )}
                      {tasks.total > 0 && (
                        <span
                          className={cn(
                            'plat-pill !px-1.5 !py-0.5 !text-[10px]',
                            tasks.open === 0 ? 'plat-pill-ok' : 'plat-pill-warn',
                          )}
                        >
                          {tasks.open === 0 ? (
                            <CheckSquare className="h-2.5 w-2.5" />
                          ) : (
                            <ListChecks className="h-2.5 w-2.5" />
                          )}
                          {tasks.total - tasks.open}/{tasks.total}
                        </span>
                      )}
                      {note.tags.slice(0, 4).map((t) => (
                        <span
                          key={t}
                          className="plat-pill plat-pill-mute !gap-0.5 !px-1.5 !py-0.5 !text-[10px] !font-medium"
                        >
                          <Hash className="h-2.5 w-2.5" />
                          {t}
                        </span>
                      ))}
                      {note.tags.length > 4 && (
                        <span className="text-[10px]" style={{ color: 'var(--text-5)' }}>
                          +{note.tags.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              </NoteSwipeRow>
            );
          })
        )}

        {/* The keyset sentinel. Rendered inside the scroller so it is what the
            observer sees coming, and only while pages remain. */}
        {!fullyLoaded && !loadError && list.length > 0 && (
          <div ref={sentinelRef} className="flex items-center justify-center gap-2 py-4">
            {loadingMore && (
              <>
                <Loader2 className="h-3 w-3 animate-spin" style={{ color: 'var(--text-5)' }} />
                <span className="text-[11px]" style={{ color: 'var(--text-5)' }}>
                  Loading more…
                </span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * A skeleton rather than a spinner: the list's shape is known before its content
 * is, and showing it means the panel does not jump when the notes land.
 */
function ListSkeleton() {
  return (
    <div className="space-y-3 px-4 py-3" aria-busy="true" aria-label="Loading notes">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <Skeleton className="h-3.5 w-1/2" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

/**
 * The day-one story (P10), not an illustration.
 *
 * An empty workspace's problem is not that it looks bare, it is that the user
 * does not know what to do first. So the empty state is two actions — start
 * today's note, or bring existing notes in — rather than a drawing of a folder.
 */
function EmptyState({ run }: { run: (id: string) => void }) {
  return (
    <div className="px-5 py-10 text-center">
      <p className="text-sm" style={{ color: 'var(--text-1)' }}>
        Nothing here yet.
      </p>
      <p className="mt-1 text-xs" style={{ color: 'var(--text-4)' }}>
        Start with today, or bring what you already have.
      </p>
      <div className="mt-4 flex flex-col gap-2">
        <button
          type="button"
          data-command="note.daily"
          onClick={() => run('note.daily')}
          className="plat-btn !h-9 justify-center"
        >
          <Sun className="h-3.5 w-3.5" /> Today's note
        </button>
        {/* Import lands with BE-5. It is shown disabled rather than hidden so the
            answer to "can I bring my notes in" is visible from day one. */}
        <button
          type="button"
          disabled
          data-command-exempt="import ships in BE-5; disabled placeholder, no action to run yet"
          title="Import arrives with the migration tooling (BE-5)"
          className="plat-btn-ghost justify-center opacity-50"
        >
          <Upload className="h-3.5 w-3.5" /> Import…
        </button>
      </div>
    </div>
  );
}
