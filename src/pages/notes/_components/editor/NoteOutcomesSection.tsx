/**
 * Confirmed outcomes, under the note they came from.
 *
 * The section only ever shows what a human confirmed, so it is a record rather
 * than a suggestion. Three things it does that the proposal card does not:
 *
 *  - **Completing is instant and undoable.** The tick lands before the request
 *    does, and the toast carries the undo, because the cost of a mis-click is
 *    "I thought I had done that".
 *  - **Adding by hand works exactly as well as extraction.** Most obligations
 *    are typed, not extracted, and a feature that only functions when the AI
 *    fires is one people stop trusting. Manual items start `open`: the
 *    confirmation gate exists for what the model produced.
 *  - **An orphaned anchor says so.** When the paragraph a task came from has
 *    been rewritten, clicking it must not jump somewhere plausible-but-wrong.
 *    "The source text has changed" is the honest answer, and the obligation
 *    survives regardless.
 */

import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, Circle, CornerDownLeft, ListChecks, Plus, Scale } from 'lucide-react';
import { toast } from 'sonner';
import {
  confirmedOf,
  useNoteOutcomes,
  useOutcomesStore,
} from '@/pages/notes/_hooks/use-outcomes-store';
import { getActiveEditor } from '@/pages/notes/_lib/editorBridge';
import {
  dueBucket,
  dueToneClass,
  formatDue,
  isOrphaned,
  ownerLabel,
} from '@/pages/notes/_lib/outcomes';
import type { Note } from '@/pages/notes/_lib/types';
import type { Outcome } from '@/pages/notes/_lib/apiClient';
import { cn } from '@/lib/utils';

export default function NoteOutcomesSection({ note }: { note: Note }) {
  const outcomes = useNoteOutcomes(note.id);
  const loadForNote = useOutcomesStore((s) => s.loadForNote);

  useEffect(() => {
    void loadForNote(note.id);
  }, [note.id, loadForNote]);

  const confirmed = useMemo(() => confirmedOf(outcomes), [outcomes]);
  const tasks = confirmed.filter((o) => o.kind === 'task');
  const decisions = confirmed.filter((o) => o.kind === 'decision');

  return (
    <section className="mx-10 mb-10 mt-6 space-y-4" aria-label="Outcomes from this note">
      <Group
        icon={ListChecks}
        title="Tasks"
        kind="task"
        noteId={note.id}
        items={tasks}
        placeholder="Add a task…"
      />
      <Group
        icon={Scale}
        title="Decisions"
        kind="decision"
        noteId={note.id}
        items={decisions}
        placeholder="Record a decision…"
      />
    </section>
  );
}

interface GroupProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  kind: Outcome['kind'];
  noteId: string;
  items: Outcome[];
  placeholder: string;
}

function Group({ icon: Icon, title, kind, noteId, items, placeholder }: GroupProps) {
  const createManual = useOutcomesStore((s) => s.createManual);
  const [draft, setDraft] = useState('');
  const [saving, setSaving] = useState(false);

  const add = async () => {
    const text = draft.trim();
    if (!text || saving) return;
    setSaving(true);
    const created = await createManual(noteId, { kind, text });
    setSaving(false);
    if (created) setDraft('');
  };

  // An empty decisions group with no history is noise on every note; the task
  // group always shows, because its input is the manual-capture path.
  if (items.length === 0 && kind === 'decision' && !draft) return null;

  return (
    <div>
      <h3 className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-[var(--text-5)]">
        <Icon aria-hidden className="h-3 w-3" />
        {title}
        {items.length > 0 && <span className="font-normal">({items.length})</span>}
      </h3>

      <ul className="divide-y divide-[var(--line-soft)] overflow-hidden rounded-[14px] border border-[var(--line-soft)] bg-[var(--paper)]">
        {items.map((outcome) => (
          <OutcomeRow key={outcome.id} outcome={outcome} />
        ))}
        <li className="flex items-center gap-2 px-4 py-2">
          <Plus aria-hidden className="h-3 w-3 shrink-0 text-[var(--text-5)]" />
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                void add();
              }
            }}
            placeholder={placeholder}
            aria-label={placeholder}
            className="flex-1 bg-transparent text-sm text-[var(--ink)] placeholder:text-[var(--text-5)] focus:outline-none"
          />
          {draft && (
            <button
              type="button"
              data-command-exempt="commits the inline draft in this group; the same key Enter already does"
              onClick={() => void add()}
              className="plat-btn-ghost shrink-0 !h-6 !gap-1 !px-2.5 !text-[11px]"
            >
              <CornerDownLeft className="h-3 w-3" /> Add
            </button>
          )}
        </li>
      </ul>
    </div>
  );
}

function OutcomeRow({ outcome }: { outcome: Outcome }) {
  const complete = useOutcomesStore((s) => s.complete);
  const reopen = useOutcomesStore((s) => s.reopen);

  const done = outcome.status === 'done';
  const bucket = dueBucket(outcome.dueAt);
  const due = formatDue(outcome);
  const orphaned = isOrphaned(outcome);

  const onToggle = async () => {
    if (done) {
      await reopen(outcome.id);
      return;
    }
    await complete(outcome.id);
    toast.success('Done', {
      description: outcome.text,
      action: { label: 'Undo', onClick: () => void reopen(outcome.id) },
    });
  };

  const goToSource = () => {
    const editor = getActiveEditor();
    const quote = outcome.anchor?.quote;
    if (!editor || !quote || orphaned || !editor.scrollToSource(quote)) {
      toast('The source text has changed', {
        description: 'This item no longer matches a sentence in the note. It is still yours.',
      });
    }
  };

  return (
    <li className="flex flex-wrap items-center gap-x-2.5 gap-y-1 px-4 py-2">
      <button
        type="button"
        data-command-exempt="completes this one row; the palette form would need an outcome argument the note view does not have"
        onClick={() => void onToggle()}
        aria-label={done ? `Reopen: ${outcome.text}` : `Complete: ${outcome.text}`}
        className="shrink-0 text-[var(--text-4)] transition-colors hover:text-[var(--ok-fg)]"
      >
        {done ? (
          <CheckCircle2 className="h-4 w-4 text-[var(--ok-fg)]" />
        ) : (
          <Circle className="h-4 w-4" />
        )}
      </button>

      <button
        type="button"
        data-command-exempt="scrolls the note to this row's source sentence; navigation within the open note"
        onClick={goToSource}
        className={cn(
          'min-w-0 flex-1 truncate text-left text-sm hover:underline',
          done ? 'text-[var(--text-5)] line-through' : 'text-[var(--ink)]',
        )}
        title={orphaned ? 'The source text has changed' : outcome.anchor?.quote}
      >
        {outcome.text}
      </button>

      {outcome.owedBy && (
        <span className="plat-pill plat-pill-mute shrink-0 !px-1.5 !py-0.5 !text-[10px] !font-medium">
          {ownerLabel(outcome.owedBy)}
        </span>
      )}

      {due && (
        <span className={cn('shrink-0 text-[11px]', done ? 'text-[var(--text-5)]' : dueToneClass(bucket))}>
          {due}
        </span>
      )}

      {orphaned && (
        <span className="shrink-0 text-[10px] italic text-[var(--text-5)]">source text changed</span>
      )}
    </li>
  );
}
