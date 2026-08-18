import { useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import {
  Pin,
  CheckSquare,
  Hash,
  ListChecks,
} from 'lucide-react';
import {
  useNotesStore,
  selectNotesMap,
  SMART_VIEWS,
} from '@/pages/notes/_hooks/use-notes-store';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import { deriveTitle, deriveSnippet } from '@/pages/notes/_lib/backlinks';
import type { Note } from '@/pages/notes/_lib/types';
import { cn } from '@/lib/utils';
import NotesListToolbar from './NotesListToolbar';

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

function matchesQuery(note: Note, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  if (deriveTitle(note).toLowerCase().includes(needle)) return true;
  if (deriveSnippet(note, 600).toLowerCase().includes(needle)) return true;
  if (note.tags.some((t) => t.includes(needle))) return true;
  return false;
}

export default function NotesList() {
  const notesMap = useNotesStore(selectNotesMap);
  const notebooks = useNotesStore((s) => s.notebooks);
  const {
    sort,
    filter,
    query,
    smartViewId,
    selectedNoteId,
    setSelectedNoteId,
  } = useNotesUiStore();
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

    if (query) arr = arr.filter((n) => matchesQuery(n, query));

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
  }, [notes, sort, filter, query, smartViewId, params, location.pathname]);

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

  return (
    <div className="flex h-full w-[360px] shrink-0 flex-col border-r border-gray-200 bg-white">
      <div className="px-5 pt-5 pb-2">
        <h1 className="text-2xl font-light text-gray-900">
          {scopeLabel} <span className="text-gray-400">({list.length})</span>
        </h1>
      </div>

      <NotesListToolbar />

      <div className="flex-1 overflow-y-auto">
        {list.length === 0 ? (
          <div className="px-4 py-12 text-center text-sm text-gray-500">No notes here yet.</div>
        ) : (
          list.map((note) => {
            const active = (selectedNoteId ?? params.id) === note.id;
            const tasks = countOpenTasks(note);
            const title = deriveTitle(note);
            const snippet = deriveSnippet(note);
            return (
              <button
                type="button"
                key={note.id}
                onClick={() => onSelect(note.id)}
                className={cn(
                  'flex w-full flex-col gap-1 border-b border-gray-100 px-4 py-2.5 text-left transition-colors',
                  active ? 'bg-[#dde9f4]' : 'hover:bg-gray-50',
                )}
              >
                <div className="flex items-center gap-1.5">
                  {note.pinned && <Pin className="h-3 w-3 fill-amber-500 text-amber-500" />}
                  <span className="flex-1 truncate text-sm font-medium text-gray-900">
                    {title}
                  </span>
                  <span className="shrink-0 text-[10px] text-gray-400">
                    {formatRelative(note.updatedAt)}
                  </span>
                </div>
                <div className="line-clamp-2 text-xs text-gray-500">{snippet || ' '}</div>
                {(note.tags.length > 0 || tasks.total > 0) && (
                  <div className="mt-1 flex flex-wrap items-center gap-1">
                    {tasks.total > 0 && (
                      <span
                        className={cn(
                          'flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                          tasks.open === 0
                            ? 'bg-green-50 text-green-700'
                            : 'bg-amber-50 text-amber-700',
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
                        className="flex items-center gap-0.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600"
                      >
                        <Hash className="h-2.5 w-2.5" />
                        {t}
                      </span>
                    ))}
                    {note.tags.length > 4 && (
                      <span className="text-[10px] text-gray-400">+{note.tags.length - 4}</span>
                    )}
                  </div>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
