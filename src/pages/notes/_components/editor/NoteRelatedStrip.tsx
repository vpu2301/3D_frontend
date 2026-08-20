/**
 * Related notes — the mechanism that makes not filing survivable.
 *
 * Up to five notes the server found similar by embedding, with anything already
 * linked (in either direction) and the note itself excluded. It is the quiet
 * half of P5: the connection surfaces without anyone having tagged anything, so
 * the user never pays for the filing decision FE-1 removed.
 *
 * Collapsed by default and silent when empty. It is a peripheral affordance —
 * the moment it takes vertical space away from the document on every note, it
 * has stopped being cheap.
 */

import { useEffect, useState } from 'react';
import { ChevronDown, ChevronRight, Waypoints } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import { notesApi, type RelatedNote } from '@/pages/notes/_lib/apiClient';
import type { Note } from '@/pages/notes/_lib/types';

export default function NoteRelatedStrip({ note }: { note: Note }) {
  const [related, setRelated] = useState<RelatedNote[]>([]);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const setSelectedNoteId = useNotesUiStore((s) => s.setSelectedNoteId);

  useEffect(() => {
    let cancelled = false;
    setOpen(false);
    notesApi
      .relatedNotes(note.id)
      .then((rows) => {
        if (!cancelled) setRelated(rows);
      })
      .catch(() => {
        // Silent: this is a suggestion, and a failed suggestion is no suggestion.
        if (!cancelled) setRelated([]);
      });
    return () => {
      cancelled = true;
    };
  }, [note.id]);

  if (related.length === 0) return null;

  return (
    <section className="mx-10 mb-10" aria-label="Related notes">
      <button
        type="button"
        data-command-exempt="folds the related strip open; a display preference on this note"
        onClick={() => setOpen((current) => !current)}
        className="plat-eyebrow flex items-center gap-1.5 transition-colors hover:text-[var(--text-3)]"
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        <Waypoints aria-hidden className="h-3 w-3" />
        Related ({related.length})
      </button>

      {open && (
        <ul className="mt-1.5 divide-y divide-[var(--line-soft)] overflow-hidden rounded-[14px] border border-[var(--line-soft)] bg-[var(--paper)]">
          {related.map((entry) => (
            <li key={entry.noteId}>
              <button
                type="button"
                data-command-exempt="opens a related note; navigation"
                onClick={() => {
                  setSelectedNoteId(entry.noteId);
                  navigate(`/notes/${entry.noteId}`);
                }}
                className="w-full px-4 py-2.5 text-left transition-colors hover:bg-[rgba(20,22,26,0.03)]"
              >
                <span className="block truncate text-sm text-[var(--ink)]">
                  {entry.title || 'Untitled'}
                </span>
                {entry.snippet && (
                  <span className="mt-0.5 line-clamp-1 block text-xs text-[var(--text-4)]">
                    {entry.snippet}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
