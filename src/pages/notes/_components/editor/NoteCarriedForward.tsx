/**
 * Overdue obligations, at the top of today's note.
 *
 * The daily note is the one page a person opens without being asked to, so it
 * is the right place to put the thing they would otherwise not see. This is a
 * *view* of outcomes owed by the user and already overdue — it does not carry
 * anything forward in the sense of copying it, because an obligation that
 * existed once should not become two rows because a day passed.
 *
 * It renders only on the daily note, and only when there is something overdue.
 * A permanent empty panel at the top of every day is how a useful reminder
 * becomes furniture.
 */

import { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Circle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import { useOutcomesStore } from '@/pages/notes/_hooks/use-outcomes-store';
import { notesApi, type Outcome } from '@/pages/notes/_lib/apiClient';
import { formatDue, ownerLabel } from '@/pages/notes/_lib/outcomes';
import type { Note } from '@/pages/notes/_lib/types';

const MAX_ROWS = 8;

export default function NoteCarriedForward({ note }: { note: Note }) {
  const complete = useOutcomesStore((s) => s.complete);
  const byId = useOutcomesStore((s) => s.byId);
  const setPendingSource = useNotesUiStore((s) => s.setPendingSourceQuote);
  const navigate = useNavigate();
  const [ids, setIds] = useState<string[] | null>(null);

  useEffect(() => {
    if (!note.daily) return;
    let cancelled = false;
    notesApi
      .outcomes({ owedBy: 'me', status: 'open', overdue: true, limit: MAX_ROWS })
      .then((page) => {
        if (cancelled) return;
        useOutcomesStore.setState((s) => {
          const next = { ...s.byId };
          for (const outcome of page.items) next[outcome.id] = outcome;
          return { byId: next };
        });
        setIds(page.items.map((item) => item.id));
      })
      .catch(() => {
        // A failed roll-up shows nothing rather than an empty "all clear" panel,
        // which would be the one wrong thing to say here.
        if (!cancelled) setIds([]);
      });
    return () => {
      cancelled = true;
    };
  }, [note.daily, note.id]);

  if (!note.daily || !ids || ids.length === 0) return null;

  const rows = ids.map((id) => byId[id]).filter((row): row is Outcome => Boolean(row));
  // The heading counts what the server returned as overdue — it is that query's
  // answer, not a number this component worked out. Rows ticked in the last few
  // seconds stay visible, struck through, so the undo is still within reach; the
  // panel disappears only once none of them is open any more.
  if (rows.every((row) => row.status !== 'open')) return null;

  const open = (outcome: Outcome) => {
    if (outcome.anchor?.quote && outcome.anchor.state !== 'orphaned') {
      setPendingSource(outcome.anchor.quote);
    }
    navigate(`/notes/${outcome.noteId}`);
  };

  return (
    <section
      aria-label="Overdue from earlier notes"
      className="mx-10 mt-4 overflow-hidden rounded-[14px] border border-[var(--line-soft)] bg-[var(--paper)]"
    >
      <header className="flex items-center gap-2 border-b border-[var(--line-soft)] px-4 py-2.5">
        <AlertTriangle aria-hidden className="h-3.5 w-3.5 text-[var(--bad-fg)]" />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--bad-fg)]">
          Overdue ({rows.length})
        </h2>
      </header>
      <ul className="divide-y divide-[var(--line-soft)]">
        {rows.map((outcome) => {
          const done = outcome.status !== 'open';
          return (
            <li key={outcome.id} className="flex items-center gap-2.5 px-4 py-1.5">
              <button
                type="button"
                data-command-exempt="completes this overdue row from today's note; one row, no selection"
                onClick={() => void complete(outcome.id)}
                disabled={done}
                aria-label={`Complete: ${outcome.text}`}
                className="shrink-0 text-[var(--text-4)] transition-colors hover:text-[var(--ok-fg)] disabled:opacity-40"
              >
                {done ? (
                  <CheckCircle2 className="h-4 w-4 text-[var(--ok-fg)]" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
              </button>
              <button
                type="button"
                data-command-exempt="opens the note this obligation came from; navigation"
                onClick={() => open(outcome)}
                className={
                  done
                    ? 'min-w-0 flex-1 truncate text-left text-sm text-[var(--text-5)] line-through'
                    : 'min-w-0 flex-1 truncate text-left text-sm text-[var(--ink)] hover:underline'
                }
              >
                {outcome.text}
              </button>
              {outcome.owedTo && (
                <span className="plat-pill plat-pill-mute shrink-0 !px-1.5 !py-0.5 !text-[10px] !font-medium">
                  for {ownerLabel(outcome.owedTo)}
                </span>
              )}
              <span className="shrink-0 text-[11px] text-[var(--bad-fg)]">{formatDue(outcome)}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
