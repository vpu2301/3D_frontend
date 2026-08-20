/**
 * The confirmation surface — the one that decides whether this product works.
 *
 * Every choice here is aimed at one number: the thirty seconds between finishing
 * a meeting note and having confirmed obligations.
 *
 *  - **In the note, under the body.** A modal interrupts; this waits. The user
 *    reviews when they look up, which is exactly the moment they would otherwise
 *    have closed the note and let P1 win again.
 *  - **Pre-checked, except low confidence.** The common case is "yes, all of
 *    those". Making someone tick four correct boxes to accept four correct items
 *    is how a good feature becomes an ignored one. The uncertain ones are left
 *    unticked, so the human's attention goes where it is worth something.
 *  - **One primary action.** `Confirm 4` is one click and one request. Editing
 *    happens inline and rides along in the same call — a patch-then-confirm per
 *    row is six round trips and the goal is gone.
 *  - **Hovering a row lights up the sentence it came from.** This is the trust
 *    mechanism. An obligation a lawyer cannot trace is a liability, not a
 *    convenience, and BE-1 stores the verbatim quote for exactly this.
 *  - **Nothing is written until confirmed.** The header says "Found", not
 *    "Added", because `proposed` is not an obligation.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Check, Loader2, Sparkles, X } from 'lucide-react';
import {
  proposalsOf,
  useNoteOutcomes,
  useOutcomesStore,
} from '@/pages/notes/_hooks/use-outcomes-store';
import { getActiveEditor } from '@/pages/notes/_lib/editorBridge';
import {
  dueToneClass,
  dueBucket,
  isLowConfidence,
  KIND_LABELS,
  ownerLabel,
  toDateInputValue,
  fromDateInputValue,
} from '@/pages/notes/_lib/outcomes';
import {
  dismissProposalCard,
  isProposalCardDismissed,
} from '@/lib/notesProposalDismissals';
import type { Note } from '@/pages/notes/_lib/types';
import type { Outcome, OutcomeEdit } from '@/pages/notes/_lib/apiClient';
import { cn } from '@/lib/utils';

interface Props {
  note: Note & { version?: number };
}

/** Edits made in the card, keyed by outcome id, sent with the confirm call. */
type EditMap = Record<string, OutcomeEdit>;

export default function NoteProposalCard({ note }: Props) {
  const outcomes = useNoteOutcomes(note.id);
  const confirmBatch = useOutcomesStore((s) => s.confirmBatch);
  const reject = useOutcomesStore((s) => s.reject);
  const loadForNote = useOutcomesStore((s) => s.loadForNote);
  const extracting = useOutcomesStore((s) => Boolean(s.extracting[note.id]));

  const proposals = useMemo(() => proposalsOf(outcomes), [outcomes]);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [edits, setEdits] = useState<EditMap>({});
  const [cursor, setCursor] = useState(0);
  const [busy, setBusy] = useState(false);
  const [dismissedAt, setDismissedAt] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const version = note.version ?? 0;

  useEffect(() => {
    void loadForNote(note.id);
  }, [note.id, loadForNote]);

  // Pre-check on arrival. Low-confidence rows start unticked: those are the ones
  // worth a human's eyes, and pre-accepting them is how a wrong obligation gets
  // into a client matter.
  //
  // Keyed on the *count*, not on `proposals`: the array is a fresh object on
  // every store change, and depending on it would reset the user's ticks and
  // their half-typed edits on each keystroke elsewhere in the app.
  useEffect(() => {
    setSelected(new Set(proposals.filter((p) => !isLowConfidence(p)).map((p) => p.id)));
    setEdits({});
    setCursor(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [note.id, proposals.length]);

  useEffect(() => {
    setDismissedAt(null);
  }, [note.id]);

  const dismissed = dismissedAt === version || isProposalCardDismissed(note.id, version);

  const highlight = useCallback((quote: string | null) => {
    getActiveEditor()?.highlightSource(quote);
  }, []);

  // The highlight belongs to the card: leaving it lit after the card unmounts
  // would leave a stray wash on the document with nothing explaining it.
  useEffect(() => () => highlight(null), [highlight]);

  const toggle = (id: string) =>
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const editRow = (id: string, edit: OutcomeEdit) =>
    setEdits((current) => ({ ...current, [id]: { ...current[id], ...edit } }));

  const onConfirm = async () => {
    const ids = proposals.filter((p) => selected.has(p.id)).map((p) => p.id);
    if (ids.length === 0) return;
    setBusy(true);
    highlight(null);
    // Only the edits for rows actually being confirmed — an edit on a row the
    // user then unticked is not a change they asked to save.
    const payload = ids
      .filter((id) => edits[id])
      .map((id) => ({ id, ...edits[id] }));
    await confirmBatch(ids, payload);
    setBusy(false);
  };

  const onDiscard = async () => {
    setBusy(true);
    highlight(null);
    await reject(proposals.map((p) => p.id));
    setBusy(false);
  };

  const onDismiss = useCallback(() => {
    highlight(null);
    dismissProposalCard(note.id, version);
    setDismissedAt(version);
  }, [note.id, version, highlight]);

  /**
   * `j`/`k` move, `Space` toggles, `Enter` confirms, `Esc` dismisses.
   *
   * Scoped to the card rather than the window: `j` is a letter, and a global
   * binding for it would make the note below unwritable.
   */
  const onKeyDown = (event: React.KeyboardEvent) => {
    const target = event.target as HTMLElement;
    // Inside a date or name field the keys mean what they normally mean.
    if (target.tagName === 'INPUT') {
      if (event.key === 'Escape') (target as HTMLInputElement).blur();
      return;
    }

    if (event.key === 'j' || event.key === 'ArrowDown') {
      event.preventDefault();
      setCursor((c) => Math.min(c + 1, proposals.length - 1));
    } else if (event.key === 'k' || event.key === 'ArrowUp') {
      event.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (event.key === ' ') {
      event.preventDefault();
      const row = proposals[cursor];
      if (row) toggle(row.id);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      void onConfirm();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      onDismiss();
    }
  };

  // Moving the cursor previews the row's source, so the keyboard path proves
  // provenance exactly as the mouse path does.
  useEffect(() => {
    const row = proposals[cursor];
    if (row && containerRef.current?.contains(document.activeElement)) {
      highlight(row.anchor?.quote ?? null);
    }
  }, [cursor, proposals, highlight]);

  if (extracting) {
    return (
      <div className="mx-10 mt-6 flex items-center gap-2 rounded-[12px] border border-dashed border-[var(--line)] px-4 py-3 text-xs text-[var(--text-4)]">
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
        Reading this note for tasks and decisions…
      </div>
    );
  }

  if (proposals.length === 0 || dismissed) return null;

  const selectedCount = proposals.filter((p) => selected.has(p.id)).length;

  return (
    <section
      ref={containerRef}
      tabIndex={0}
      onKeyDown={onKeyDown}
      aria-label="Suggestions found in this note"
      className="mx-10 mt-6 overflow-hidden rounded-[14px] border border-[var(--line-soft)] bg-[var(--paper)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(20,22,26,0.15)]"
    >
      <header className="flex items-center gap-2 border-b border-[var(--line-soft)] px-4 py-2.5">
        <Sparkles aria-hidden className="h-3.5 w-3.5 text-[var(--text-4)]" />
        <h2 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--text-3)]">
          Found in this note
        </h2>
        <span className="ml-auto text-[11px] text-[var(--text-4)]">
          {proposals.length} suggestion{proposals.length === 1 ? '' : 's'} · nothing saved yet
        </span>
      </header>

      <ul className="divide-y divide-[var(--line-soft)]">
        {proposals.map((proposal, index) => (
          <ProposalRow
            key={proposal.id}
            proposal={proposal}
            checked={selected.has(proposal.id)}
            focused={index === cursor}
            edit={edits[proposal.id]}
            onToggle={() => toggle(proposal.id)}
            onFocusRow={() => setCursor(index)}
            onEdit={(edit) => editRow(proposal.id, edit)}
            onHover={(on) => highlight(on ? (proposal.anchor?.quote ?? null) : null)}
          />
        ))}
      </ul>

      <footer className="flex flex-wrap items-center gap-2 border-t border-[var(--line-soft)] px-4 py-2.5">
        <button
          type="button"
          data-command-exempt="confirms the rows ticked in this card; the palette form is note.confirm-proposals, which confirms them all"
          disabled={busy || selectedCount === 0}
          onClick={onConfirm}
          className="plat-btn !h-8 !gap-1.5 !px-4 !text-xs"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
          Confirm {selectedCount}
        </button>
        <button
          type="button"
          data-command-exempt="discards this note's proposals; scoped to the card that is showing them"
          disabled={busy}
          onClick={onDiscard}
          className="plat-btn-ghost !h-8 !gap-1.5 !px-3.5 !text-xs disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" /> Discard all
        </button>
        <button
          type="button"
          data-command-exempt="hides the card for this note version without deciding anything"
          onClick={onDismiss}
          className="rounded-full px-2.5 py-1.5 text-xs text-[var(--text-4)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
        >
          Later
        </button>
        <span className="ml-auto hidden text-[11px] text-[var(--text-5)] sm:inline">
          j/k move · space toggles · enter confirms · hover shows the source
        </span>
      </footer>
    </section>
  );
}

interface RowProps {
  proposal: Outcome;
  checked: boolean;
  focused: boolean;
  edit: OutcomeEdit | undefined;
  onToggle: () => void;
  onFocusRow: () => void;
  onEdit: (edit: OutcomeEdit) => void;
  onHover: (on: boolean) => void;
}

function ProposalRow({
  proposal,
  checked,
  focused,
  edit,
  onToggle,
  onFocusRow,
  onEdit,
  onHover,
}: RowProps) {
  const dueAt = edit?.dueAt !== undefined ? edit.dueAt : proposal.dueAt;
  const owedBy = edit?.owedBy !== undefined ? edit.owedBy : proposal.owedBy;
  const bucket = dueBucket(dueAt);
  const uncertain = isLowConfidence(proposal);

  return (
    <li
      onMouseEnter={() => {
        onFocusRow();
        onHover(true);
      }}
      onMouseLeave={() => onHover(false)}
      className={cn(
        'flex flex-wrap items-center gap-x-3 gap-y-1.5 px-4 py-2 transition-colors',
        focused && 'bg-[rgba(20,22,26,0.04)]',
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        aria-label={`Confirm: ${proposal.text}`}
        className="h-3.5 w-3.5 shrink-0 accent-[#14161a]"
      />

      <span
        className={cn(
          'shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium',
          proposal.kind === 'task'
            ? 'bg-[var(--sand)] text-[var(--text-2)]'
            : 'bg-[var(--sand-deep)] text-[var(--ink)]',
        )}
      >
        {KIND_LABELS[proposal.kind]}
      </span>

      <span className="min-w-0 flex-1 text-sm text-[var(--ink)]">{proposal.text}</span>

      {/*
        Inline edit, not a dialog. The model gets the gist and the human fixes
        the detail — a modal between those two steps is the whole cost of the
        feature paid again on every row.
      */}
      <input
        value={owedBy ?? ''}
        placeholder="who?"
        aria-label={`Owner for: ${proposal.text}`}
        onChange={(event) => onEdit({ owedBy: event.target.value || null })}
        className="w-24 shrink-0 rounded-[10px] border border-transparent bg-[var(--sand)] px-2 py-0.5 text-[11px] text-[var(--text-2)] placeholder:text-[var(--text-5)] hover:border-[var(--line)] focus:border-[var(--ink)] focus:outline-none"
      />

      <input
        type="date"
        value={toDateInputValue(dueAt)}
        aria-label={`Due date for: ${proposal.text}`}
        onChange={(event) => onEdit({ dueAt: fromDateInputValue(event.target.value) })}
        className={cn(
          'w-32 shrink-0 rounded-[10px] border border-transparent bg-[var(--sand)] px-2 py-0.5 text-[11px] hover:border-[var(--line)] focus:border-[var(--ink)] focus:outline-none',
          dueToneClass(bucket),
        )}
      />

      {proposal.owedBy && (
        <span className="sr-only">Owed by {ownerLabel(proposal.owedBy)}</span>
      )}

      {uncertain && (
        <span
          title="The model was unsure about this one, so it is not pre-selected."
          className="shrink-0 rounded-full bg-[var(--sand)] px-1.5 py-0.5 text-[10px] text-[var(--text-4)]"
        >
          check this
        </span>
      )}

      {proposal.dueText && dueAt === null && (
        <span className="shrink-0 text-[10px] text-[var(--text-5)]">“{proposal.dueText}”</span>
      )}
    </li>
  );
}
