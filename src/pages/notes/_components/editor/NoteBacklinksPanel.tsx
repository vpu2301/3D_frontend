import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Link2, StickyNote, FileText, CalendarClock } from 'lucide-react';
import {
  useNotesStore,
  selectNotesMap,
} from '@/pages/notes/_hooks/use-notes-store';
import { computeBacklinks } from '@/pages/notes/_lib/backlinks';
import type { Note } from '@/pages/notes/_lib/types';

const TYPE_ICON = {
  note: StickyNote,
  doc: FileText,
  event: CalendarClock,
} as const;

export default function NoteBacklinksPanel({ note }: { note: Note }) {
  const notesMap = useNotesStore(selectNotesMap);
  const navigate = useNavigate();
  const backlinks = useMemo(() => {
    const all = computeBacklinks(Object.values(notesMap));
    return all.get(`note:${note.id}`) ?? [];
  }, [notesMap, note.id]);

  const outgoing = note.links;

  if (backlinks.length === 0 && outgoing.length === 0) return null;

  return (
    <div className="mx-10 mt-12 mb-8 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm">
      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-gray-500">
        <Link2 className="h-3.5 w-3.5" /> Linked references
      </div>

      {outgoing.length > 0 && (
        <div className="mb-3">
          <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-gray-400">
            Outgoing
          </div>
          <ul className="space-y-1">
            {outgoing.map((l, i) => {
              const Icon = TYPE_ICON[l.type];
              const route =
                l.type === 'note'
                  ? `/notes/${l.targetId}`
                  : l.type === 'doc'
                    ? `/docs/${l.targetId}`
                    : `/calendar?event=${l.targetId}`;
              return (
                <li key={`${l.type}-${l.targetId}-${i}`}>
                  <Link
                    to={route}
                    className="flex items-center gap-2 rounded px-2 py-1 text-gray-700 hover:bg-white"
                  >
                    <Icon className="h-3.5 w-3.5 text-gray-400" />
                    <span className="truncate">{l.label ?? l.targetId}</span>
                    <span className="text-[10px] uppercase tracking-wider text-gray-400">
                      {l.type}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {backlinks.length > 0 && (
        <div>
          <div className="mb-1 text-[10px] font-medium uppercase tracking-wider text-gray-400">
            Backlinks ({backlinks.length})
          </div>
          <ul className="space-y-1">
            {backlinks.map((b) => (
              <li key={b.fromNoteId}>
                <button
                  type="button"
                  onClick={() => navigate(`/notes/${b.fromNoteId}`)}
                  className="flex w-full items-start gap-2 rounded px-2 py-1.5 text-left text-gray-700 hover:bg-white"
                >
                  <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-500" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{b.fromNoteTitle}</div>
                    <div className="line-clamp-1 text-[11px] text-gray-500">{b.snippet}</div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
