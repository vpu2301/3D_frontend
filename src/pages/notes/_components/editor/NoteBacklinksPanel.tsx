/**
 * Linked references (Sprint 2 §4.2).
 *
 * Backlinks come from `GET /v1/notes/{id}/backlinks` rather than a scan over the
 * loaded notes map: the server extracts links on save, so its answer covers the
 * whole corpus — including notes this session never loaded.
 *
 * Refetches when the note's own content changes, because editing a link on
 * *this* note is the common way the other side's backlink set changes.
 */

import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Link2, StickyNote, FileText, CalendarClock } from 'lucide-react';
import { notesApi, type Backlink } from '@/pages/notes/_lib/apiClient';
import { isTempId } from '@/pages/notes/_hooks/use-notes-store';
import type { Note } from '@/pages/notes/_lib/types';

const TYPE_ICON = {
  note: StickyNote,
  doc: FileText,
  event: CalendarClock,
} as const;

/** How long a save has to be the last one before the backlink set is re-read. */
const REFETCH_SETTLE_MS = 1_500;

export default function NoteBacklinksPanel({ note }: { note: Note }) {
  const navigate = useNavigate();
  const [backlinks, setBacklinks] = useState<Backlink[]>([]);
  /** The note the last fetch was for — "is this a new note or a new save?". */
  const fetchedFor = useRef<string | null>(null);

  useEffect(() => {
    // A note that only exists client-side has no server links yet.
    if (isTempId(note.id)) {
      setBacklinks([]);
      return;
    }
    let cancelled = false;
    // Opening a note fetches at once; a *save* on the note already open waits
    // for the typing to settle. `version` moves on every 300 ms autosave, so
    // keying the fetch on it alone spends one request per keystroke burst
    // against a per-user budget of sixty a minute — and a backlink set that is
    // a second behind the last word typed is behind nothing a reader can see.
    const delay = fetchedFor.current === note.id ? REFETCH_SETTLE_MS : 0;
    fetchedFor.current = note.id;
    const timer = window.setTimeout(() => {
      notesApi
        .backlinks(note.id)
        .then((rows) => {
          if (!cancelled) setBacklinks(rows);
        })
        .catch(() => {
          if (!cancelled) setBacklinks([]);
        });
    }, delay);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [note.id, note.version]);

  const outgoing = note.links ?? [];

  if (backlinks.length === 0 && outgoing.length === 0) return null;

  return (
    <div className="mx-10 mb-8 mt-12 overflow-hidden rounded-[14px] border border-[var(--line-soft)] bg-[var(--paper)] text-sm">
      <div className="plat-eyebrow flex items-center gap-1.5 border-b border-[var(--line-soft)] px-4 py-2.5">
        <Link2 className="h-3.5 w-3.5" /> Linked references
      </div>

      {outgoing.length > 0 && (
        <div>
          <div className="plat-eyebrow px-4 pb-1.5 pt-2.5">
            Outgoing
          </div>
          <ul className="divide-y divide-[var(--line-soft)] border-t border-[var(--line-soft)]">
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
                    className="flex items-center gap-2 px-4 py-2 text-[var(--text-2)] transition-colors hover:bg-[rgba(20,22,26,0.03)]"
                  >
                    <Icon className="h-3.5 w-3.5 text-[var(--text-4)]" />
                    <span className="truncate">{l.label ?? l.targetId}</span>
                    <span className="plat-eyebrow ml-auto">
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
          <div className="plat-eyebrow px-4 pb-1.5 pt-2.5">
            Backlinks ({backlinks.length})
          </div>
          <ul className="divide-y divide-[var(--line-soft)] border-t border-[var(--line-soft)]">
            {backlinks.map((b) => (
              <li key={b.fromNoteId}>
                <button
            data-command-exempt="follows one backlink; navigation within the note, like a link"
                  type="button"
                  onClick={() => navigate(`/notes/${b.fromNoteId}`)}
                  className="flex w-full items-start gap-2 px-4 py-2.5 text-left text-[var(--text-2)] transition-colors hover:bg-[rgba(20,22,26,0.03)]"
                >
                  <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--text-4)]" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium text-[var(--ink)]">{b.fromNoteTitle}</div>
                    <div className="line-clamp-1 text-[11px] text-[var(--text-4)]">{b.snippet}</div>
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
