/**
 * Citations are the feature (FE-5 §4).
 *
 * An answer a lawyer cannot trace is a liability, not a convenience — the same
 * argument that put the source quote behind every proposal in FE-2. A chip that
 * merely names a note is decoration; a chip that opens the note *at the cited
 * passage* is the thing that lets someone check the machine's work in two
 * seconds, which is what makes the answer usable in a file.
 *
 * An id the client cannot resolve renders **disabled** rather than broken. A
 * chip that navigates to a 404 teaches the user that citations are unreliable,
 * and one bad experience there discredits every correct citation after it.
 */

import { useNavigate } from 'react-router-dom';
import { FileText, StickyNote } from 'lucide-react';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import type { Citation } from '@/pages/notes/_lib/aiClient';
import { cn } from '@/lib/utils';

export default function CitationChips({ citations }: { citations: Citation[] }) {
  const navigate = useNavigate();
  const notes = useNotesStore((s) => s.notes);
  const setPendingSourceQuote = useNotesUiStore((s) => s.setPendingSourceQuote);

  if (citations.length === 0) return null;

  return (
    <ul className="mt-2 flex flex-wrap gap-1">
      {citations.map((citation, index) => {
        const isDocument = Boolean(citation.documentId);
        // A note citation resolves if the note is in the corpus this client
        // loaded. A document citation is trusted: FE-4 owns that viewer and the
        // notes store knows nothing about ingested files either way.
        const resolvable = isDocument || Boolean(notes[citation.noteId]);

        const label = isDocument
          ? `${citation.title || 'Document'}${citation.page ? ` · p.${citation.page}` : ''}`
          : citation.title || notes[citation.noteId]?.title || 'Note';

        const open = () => {
          if (isDocument) {
            navigate(`/drive/preview/${citation.documentId}${citation.page ? `?page=${citation.page}` : ''}`);
            return;
          }
          // The snippet is the passage the model cited. Parking it here makes
          // the editor scroll to it on mount — the same handoff Open Items uses
          // to land on an obligation's sentence.
          if (citation.snippet) setPendingSourceQuote(citation.snippet);
          navigate(`/notes/${citation.noteId}`);
        };

        return (
          <li key={`${citation.noteId}-${citation.documentId ?? ''}-${index}`}>
            <button
              data-command-exempt="opens the source behind one citation in an answer; scoped to that answer"
              type="button"
              onClick={open}
              disabled={!resolvable}
              title={
                resolvable
                  ? citation.snippet || `Open ${label}`
                  : 'The source for this citation is not available in this workspace'
              }
              aria-label={
                resolvable ? `Open source: ${label}` : `Source unavailable: ${label}`
              }
              className={cn(
                'inline-flex max-w-[16rem] items-center gap-1 truncate rounded-full border px-2 py-0.5 text-[10px] font-medium transition-colors',
                resolvable
                  ? 'border-[var(--line)] bg-[var(--paper)] text-[var(--text-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]'
                  : 'cursor-not-allowed border-transparent bg-[var(--sand-deep)] text-[var(--text-5)] line-through',
              )}
            >
              {isDocument ? (
                <FileText aria-hidden className="h-2.5 w-2.5 shrink-0" />
              ) : (
                <StickyNote aria-hidden className="h-2.5 w-2.5 shrink-0" />
              )}
              {/* Server-supplied text, rendered as text. */}
              <span className="truncate">{label}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}
