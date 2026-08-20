/**
 * Open items — the answer to P2, "what do I owe?"
 *
 * One page, three tabs, no configuration. The question a lawyer asks on a Monday
 * morning has exactly three shapes — what I owe, what I am owed, what I have not
 * yet checked — and each is one server query. There is deliberately no filter
 * builder: this page exists to answer a question fast, not to compose one.
 *
 * Everything numeric here comes from the server. The tab counts are the
 * summary's, the due grouping is the server's own facet boundaries mirrored in
 * `dueBucket`, and the sidebar badge reads `summary.mine.overdue`. A count
 * tallied over whatever rows happen to be loaded is a number that goes quietly
 * wrong the first time the list paginates, and this is the one number people
 * would act on.
 *
 * What this page is not, per FE-2 §5: it has no priorities, no projects, no
 * sub-tasks, no dependencies, no recurrence, no assignees-as-users, no board and
 * no Gantt. An outcome is text, a person as free text, a due date and a status.
 * Anything more is a task manager, and a bad one inside a notes app helps nobody.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  CheckCircle2,
  Circle,
  Hash,
  Inbox,
  PartyPopper,
  StickyNote,
} from 'lucide-react';
import NotesLayout from '@/pages/notes/_components/shared/NotesLayout';
import NotesMiniRail from '@/pages/notes/_components/sidebar/NotesMiniRail';
import { Skeleton } from '@/components/ui/skeleton';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import { useOutcomesStore } from '@/pages/notes/_hooks/use-outcomes-store';
import { notesApi, type Outcome, type OutcomeFilters } from '@/pages/notes/_lib/apiClient';
import type { Note } from '@/pages/notes/_lib/types';
import { deriveTitle } from '@/pages/notes/_lib/backlinks';
import { reportError } from '@/pages/notes/_lib/errors';
import {
  DUE_BUCKET_LABELS,
  dueBucket,
  dueToneClass,
  formatDue,
  groupByDue,
  KIND_LABELS,
  ownerLabel,
} from '@/pages/notes/_lib/outcomes';
import { cn } from '@/lib/utils';

type TabId = 'mine' | 'theirs' | 'unconfirmed';

const TABS: Array<{ id: TabId; label: string; filters: OutcomeFilters }> = [
  { id: 'mine', label: 'I owe', filters: { owedBy: 'me', status: 'open' } },
  { id: 'theirs', label: 'Promised to me', filters: { owedTo: 'me', status: 'open' } },
  { id: 'unconfirmed', label: 'Unconfirmed', filters: { status: 'proposed' } },
];

const PAGE_LIMIT = 200;

export default function NotesOpenItems() {
  const [params, setParams] = useSearchParams();
  const tab = (params.get('tab') as TabId) ?? 'mine';
  const tag = params.get('tag');

  const notes = useNotesStore((s) => s.notes);
  const loadNotes = useNotesStore((s) => s.load);
  const summary = useOutcomesStore((s) => s.summary);
  const refreshSummary = useOutcomesStore((s) => s.refreshSummary);
  const complete = useOutcomesStore((s) => s.complete);
  const byId = useOutcomesStore((s) => s.byId);

  const [ids, setIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  /**
   * The anchor of a shift-range, as a position in the *rendered* order.
   *
   * Positions rather than ids, because the rendered order is the grouped order
   * — "select from here to there" means what the user can see, and looking the
   * anchor back up by id in the flat query order would extend the wrong range.
   */
  const lastClicked = useRef<number | null>(null);

  useEffect(() => {
    void loadNotes();
    void refreshSummary();
  }, [loadNotes, refreshSummary]);

  const active = TABS.find((t) => t.id === tab) ?? TABS[0];

  // The query, re-run whenever the question changes. The store absorbs the rows
  // so a completion elsewhere updates this list without a refetch; the ids are
  // kept here because *which* rows answer this question is the server's answer,
  // not something to re-derive.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setSelected(new Set());
    notesApi
      .outcomes({ ...active.filters, tag: tag ?? undefined, limit: PAGE_LIMIT })
      .then((page) => {
        if (cancelled) return;
        useOutcomesStore.setState((s) => {
          const next = { ...s.byId };
          for (const outcome of page.items) next[outcome.id] = outcome;
          return { byId: next };
        });
        setIds(page.items.map((item) => item.id));
      })
      .catch((error) => {
        if (!cancelled) reportError(error, { title: 'Could not load open items' });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [active, tag]);

  const rows = useMemo(
    () => ids.map((id) => byId[id]).filter((outcome): outcome is Outcome => Boolean(outcome)),
    [ids, byId],
  );

  /**
   * Shift-click extends from the last click, the way every list has since 1984.
   * `order` is the rendered sequence, handed in by whichever grouping is on
   * screen, so the range is what the user sees between the two clicks.
   */
  const onRowSelect = useCallback((id: string, index: number, shiftKey: boolean, order: string[]) => {
    const anchor = lastClicked.current;
    setSelected((current) => {
      const next = new Set(current);
      if (shiftKey && anchor !== null && anchor !== index) {
        const [start, end] = anchor < index ? [anchor, index] : [index, anchor];
        for (const rowId of order.slice(start, end + 1)) next.add(rowId);
        return next;
      }
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    lastClicked.current = index;
  }, []);

  const completeSelected = async () => {
    const chosen = [...selected];
    setSelected(new Set());
    await Promise.all(chosen.map((id) => complete(id)));
  };

  const counts: Record<TabId, number | null> = {
    mine: summary?.mine.open ?? null,
    theirs: summary?.theirs.open ?? null,
    unconfirmed: summary?.unconfirmed ?? null,
  };

  return (
    <NotesLayout>
      <div className="flex flex-1 overflow-hidden">
        <NotesMiniRail />
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-[var(--line-soft)] px-8 pt-6">
            <p className="plat-crumb">3days.notes</p>
            <h1 className="mt-1.5 text-[22px]">Open items</h1>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-4)' }}>
              Obligations from your notes. Confirmed ones only — nothing here was written by the
              model alone.
            </p>

            <div role="tablist" aria-label="Open items" className="mt-4 flex gap-1">
              {TABS.map((entry) => (
                <button
                  key={entry.id}
                  type="button"
                  role="tab"
                  aria-selected={entry.id === tab}
                  data-command-exempt="switches between the three questions this page answers; the page itself is nav.open-items"
                  onClick={() => setParams(tag ? { tab: entry.id, tag } : { tab: entry.id })}
                  className={cn(
                    'rounded-t-[10px] px-3 py-1.5 text-sm transition-colors',
                    entry.id === tab
                      ? 'border-b-2 border-[var(--ink)] font-semibold text-[var(--ink)]'
                      : 'border-b-2 border-transparent text-[var(--text-4)] hover:text-[var(--ink)]',
                  )}
                >
                  {entry.label}
                  {counts[entry.id] !== null && (
                    <span className="ml-1.5 text-xs" style={{ color: 'var(--text-5)' }}>
                      {counts[entry.id]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <MatterChips
            active={tag}
            onPick={(next) =>
              setParams(next ? { tab, tag: next } : { tab })
            }
          />

          {selected.size > 0 && (
            <div className="flex items-center gap-2 border-b border-[var(--line-soft)] px-8 py-2">
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>
                {selected.size} selected
              </span>
              <button
                type="button"
                data-command-exempt="completes the rows selected on this page; a palette form would have no selection to act on"
                onClick={() => void completeSelected()}
                className="plat-btn !h-7 !px-3.5 !text-[11px]"
              >
                Mark done
              </button>
              <button
                type="button"
                data-command-exempt="clears this page's selection"
                onClick={() => setSelected(new Set())}
                className="rounded-full px-2 py-1 text-xs transition-colors hover:bg-[rgba(20,22,26,0.04)]"
                style={{ color: 'var(--text-4)' }}
              >
                Clear
              </button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-8 py-4">
            {loading ? (
              <div className="space-y-3" aria-busy="true">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-9 w-full" />
                ))}
              </div>
            ) : rows.length === 0 ? (
              <EmptyState tab={tab} filtered={Boolean(tag)} />
            ) : tab === 'unconfirmed' ? (
              <ByNote rows={rows} notes={notes} selected={selected} onSelect={onRowSelect} />
            ) : (
              <ByDue rows={rows} notes={notes} selected={selected} onSelect={onRowSelect} />
            )}
          </div>
        </main>
      </div>
    </NotesLayout>
  );
}

/**
 * Matter filter. The chips are `summary.byTag` — the server's own tally, so the
 * filter offers exactly the matters that actually have obligations, and the
 * numbers on them are not a client-side count.
 */
function MatterChips({ active, onPick }: { active: string | null; onPick: (tag: string | null) => void }) {
  const summary = useOutcomesStore((s) => s.summary);
  const tags = summary?.byTag ?? [];
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5 border-b border-[var(--line-soft)] px-8 py-2">
      <button
        type="button"
        data-command-exempt="clears the matter filter on this page"
        onClick={() => onPick(null)}
        className={cn(
          'rounded-full px-2.5 py-0.5 text-[11px] transition-colors',
          active === null
            ? 'bg-[rgba(20,22,26,0.06)] font-semibold text-[var(--ink)]'
            : 'bg-[var(--sand-deep)] text-[var(--text-3)] hover:bg-[rgba(20,22,26,0.08)]',
        )}
      >
        All matters
      </button>
      {tags.slice(0, 12).map((entry) => (
        <button
          key={entry.value}
          type="button"
          data-command-exempt="filters this page to one matter; an argument, not an action"
          onClick={() => onPick(entry.value === active ? null : entry.value)}
          className={cn(
            'flex items-center gap-0.5 rounded-full px-2.5 py-0.5 text-[11px] transition-colors',
            entry.value === active
              ? 'bg-[rgba(20,22,26,0.06)] font-semibold text-[var(--ink)]'
              : 'bg-[var(--sand-deep)] text-[var(--text-3)] hover:bg-[rgba(20,22,26,0.08)]',
          )}
        >
          <Hash className="h-2.5 w-2.5" />
          {entry.value}
          <span className="opacity-60">{entry.count}</span>
        </button>
      ))}
    </div>
  );
}

interface ListProps {
  rows: Outcome[];
  notes: Record<string, Note>;
  selected: Set<string>;
  onSelect: (id: string, index: number, shiftKey: boolean, order: string[]) => void;
}

function ByDue({ rows, notes, selected, onSelect }: ListProps) {
  const groups = useMemo(() => groupByDue(rows), [rows]);
  // The rendered order across every group — what a shift-range spans.
  const order = groups.flatMap((group) => group.items.map((item) => item.id));
  return (
    <div className="space-y-5">
      {groups.map((group) => (
        <section key={group.bucket}>
          <h2
            className="plat-eyebrow mb-2"
            style={group.bucket === 'overdue' ? { color: 'var(--bad-fg)' } : undefined}
          >
            {DUE_BUCKET_LABELS[group.bucket]} ({group.items.length})
          </h2>
          <ul className="plat-list">
            {group.items.map((outcome) => (
              <Row
                key={outcome.id}
                outcome={outcome}
                notes={notes}
                index={order.indexOf(outcome.id)}
                order={order}
                selected={selected.has(outcome.id)}
                onSelect={onSelect}
              />
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

/** Unconfirmed is grouped by note, because reviewing happens a note at a time. */
function ByNote({ rows, notes, selected, onSelect }: ListProps) {
  const groups = useMemo(() => {
    const map = new Map<string, Outcome[]>();
    for (const row of rows) {
      const list = map.get(row.noteId) ?? [];
      list.push(row);
      map.set(row.noteId, list);
    }
    return [...map.entries()];
  }, [rows]);

  const order = groups.flatMap(([, items]) => items.map((item) => item.id));

  return (
    <div className="space-y-5">
      {groups.map(([noteId, items]) => {
        const note = notes[noteId];
        return (
          <section key={noteId}>
            <h2 className="plat-eyebrow mb-2 flex items-center gap-1.5">
              <StickyNote aria-hidden className="h-3 w-3" />
              {note ? deriveTitle(note) : 'Another note'} ({items.length})
            </h2>
            <ul className="plat-list">
              {items.map((outcome) => (
                <Row
                  key={outcome.id}
                  outcome={outcome}
                  notes={notes}
                  index={order.indexOf(outcome.id)}
                  order={order}
                  selected={selected.has(outcome.id)}
                  onSelect={onSelect}
                />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function Row({
  outcome,
  notes,
  index,
  order,
  selected,
  onSelect,
}: {
  outcome: Outcome;
  notes: ListProps['notes'];
  index: number;
  order: string[];
  selected: boolean;
  onSelect: ListProps['onSelect'];
}) {
  const navigate = useNavigate();
  const complete = useOutcomesStore((s) => s.complete);
  const reopen = useOutcomesStore((s) => s.reopen);
  const setPendingSource = useNotesUiStore((s) => s.setPendingSourceQuote);

  const note = notes[outcome.noteId];
  const done = outcome.status === 'done';
  const proposed = outcome.status === 'proposed';
  const due = formatDue(outcome);

  const open = () => {
    // The note opens *at the sentence*, which is the difference between "here is
    // a task" and "here is where this came from".
    if (outcome.anchor?.quote && outcome.anchor.state !== 'orphaned') {
      setPendingSource(outcome.anchor.quote);
    }
    navigate(`/notes/${outcome.noteId}`);
  };

  return (
    <li
      className={cn(
        'flex flex-wrap items-center gap-x-2.5 gap-y-1 border-b border-[var(--line-soft)] px-4 py-2 transition-colors last:border-b-0',
        selected ? 'bg-[rgba(20,22,26,0.06)]' : 'hover:bg-[rgba(20,22,26,0.03)]',
      )}
    >
      <button
        type="button"
        data-command-exempt="completes this row; the page's own bulk action covers the multi-select case"
        disabled={proposed}
        onClick={(event) => {
          if (event.shiftKey) {
            onSelect(outcome.id, index, true, order);
            return;
          }
          void (done ? reopen(outcome.id) : complete(outcome.id));
        }}
        aria-label={done ? `Reopen: ${outcome.text}` : `Complete: ${outcome.text}`}
        className="shrink-0 transition-colors disabled:opacity-30"
        style={{ color: done ? 'var(--ok-fg)' : 'var(--text-5)' }}
      >
        {done ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
      </button>

      {proposed && (
        <span className="plat-pill plat-pill-warn shrink-0 !px-1.5 !py-0.5 !text-[10px]">
          {KIND_LABELS[outcome.kind]} · not confirmed
        </span>
      )}

      <button
        type="button"
        data-command-exempt="opens the source note at this row's sentence; navigation"
        onClick={(event) => (event.shiftKey ? onSelect(outcome.id, index, true, order) : open())}
        className={cn(
          'min-w-0 flex-1 truncate text-left text-sm hover:underline',
          done ? 'text-[var(--text-5)] line-through' : 'text-[var(--ink)]',
        )}
      >
        {outcome.text}
      </button>

      {note && (
        <span
          className="hidden shrink-0 items-center gap-1 text-[11px] sm:flex"
          style={{ color: 'var(--text-5)' }}
        >
          <StickyNote className="h-3 w-3" />
          {deriveTitle(note)}
        </span>
      )}

      {outcome.owedBy && (
        <span className="plat-pill plat-pill-mute shrink-0 !px-1.5 !py-0.5 !text-[10px] !font-medium">
          {ownerLabel(outcome.owedBy)}
        </span>
      )}

      {due && (
        <span
          className={cn(
            'shrink-0 text-[11px]',
            done ? 'text-[var(--text-5)]' : dueToneClass(dueBucket(outcome.dueAt)),
          )}
        >
          {due}
        </span>
      )}
    </li>
  );
}

/**
 * Three empty states, because they mean three different things and a single
 * "nothing here" would be useless in all of them.
 */
function EmptyState({ tab, filtered }: { tab: TabId; filtered: boolean }) {
  if (filtered) {
    return (
      <Empty
        icon={Hash}
        title="Nothing open for this matter"
        body="Clear the filter to see everything else."
      />
    );
  }
  if (tab === 'unconfirmed') {
    return (
      <Empty
        icon={CheckCircle2}
        title="Nothing waiting"
        body="Every suggestion has been confirmed or discarded. New ones appear here as you write."
      />
    );
  }
  if (tab === 'theirs') {
    return (
      <Empty
        icon={Inbox}
        title="Nobody owes you anything"
        body="Obligations addressed to you appear here once a note records them."
      />
    );
  }
  return (
    <Empty
      icon={PartyPopper}
      title="Nothing open"
      body="Everything you have confirmed is done. Write a note and the next obligations find their way here."
    />
  );
}

function Empty({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="plat-list py-16 text-center">
      <Icon aria-hidden className="mx-auto mb-3 h-7 w-7" style={{ color: 'var(--text-5)' }} />
      <p className="text-sm font-semibold" style={{ color: 'var(--text-2)' }}>
        {title}
      </p>
      <p className="mx-auto mt-1 max-w-sm text-xs" style={{ color: 'var(--text-4)' }}>
        {body}
      </p>
    </div>
  );
}
