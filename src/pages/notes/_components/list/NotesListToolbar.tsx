import { useState } from 'react';
import { ArrowUpDown, Filter, Bell, Link2, Calendar as CalendarIcon } from 'lucide-react';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import { cn } from '@/lib/utils';
import type { NoteListSort } from '@/pages/notes/_lib/types';

const SORT_LABELS: Record<NoteListSort['by'], string> = {
  updated: 'Modified',
  created: 'Created',
  title: 'Title',
  manual: 'Manual',
};

export default function NotesListToolbar() {
  const { sort, setSort, filter, setFilter, resetFilter } = useNotesUiStore();
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const hasFilter =
    !!filter.hasReminder ||
    !!filter.linkedToDoc ||
    !!filter.linkedToEvent ||
    !!filter.notebookId ||
    !!filter.tag;

  return (
    /*
     * No search box here.
     *
     * FE-3 §1: one search entry point for the whole module. This panel used to
     * carry its own, which meant a professional had to work out which of two
     * boxes to use and why they disagreed — the list one filtered the loaded
     * page, the palette one asked the server. `Cmd+K` is now the only way in,
     * and `searchGates.test.ts` fails the build if a second one reappears.
     */
    <div className="border-b border-[var(--line-soft)] px-3 py-2">
      <div className="flex items-center gap-1">
        <div className="relative">
          <button
            data-command-exempt="list sort, filter and search controls; they change what this panel shows, not the corpus"
            type="button"
            onClick={() => {
              setSortOpen((o) => !o);
              setFilterOpen(false);
            }}
            className="flex items-center gap-1 rounded-[8px] px-2 py-1 text-[11px] text-[var(--text-2)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          >
            <ArrowUpDown className="h-3 w-3" />
            {SORT_LABELS[sort.by]}
          </button>
          {sortOpen && (
            <div
              className="absolute left-0 top-full z-20 mt-1 w-36 rounded-[12px] border border-[var(--line)] bg-white p-1 shadow-lg"
              onMouseLeave={() => setSortOpen(false)}
            >
              {(Object.keys(SORT_LABELS) as NoteListSort['by'][]).map((b) => (
                <button
            data-command-exempt="list sort, filter and search controls; they change what this panel shows, not the corpus"
                  key={b}
                  type="button"
                  onClick={() => {
                    setSort({ ...sort, by: b });
                    setSortOpen(false);
                  }}
                  className={cn(
                    'block w-full rounded-[8px] px-2 py-1 text-left text-xs text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)]',
                    sort.by === b && 'bg-[rgba(20,22,26,0.06)] font-semibold text-[var(--ink)]',
                  )}
                >
                  {SORT_LABELS[b]}
                </button>
              ))}
              <div className="my-1 border-t border-[var(--line-soft)]" />
              <button
            data-command-exempt="list sort, filter and search controls; they change what this panel shows, not the corpus"
                type="button"
                onClick={() => {
                  setSort({ ...sort, dir: sort.dir === 'asc' ? 'desc' : 'asc' });
                  setSortOpen(false);
                }}
                className="block w-full rounded-[8px] px-2 py-1 text-left text-xs text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)]"
              >
                {sort.dir === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            data-command-exempt="list sort, filter and search controls; they change what this panel shows, not the corpus"
            type="button"
            onClick={() => {
              setFilterOpen((o) => !o);
              setSortOpen(false);
            }}
            className={cn(
              'flex items-center gap-1 rounded-[8px] px-2 py-1 text-[11px] transition-colors',
              hasFilter
                ? 'bg-[rgba(20,22,26,0.06)] font-semibold text-[var(--ink)]'
                : 'text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]',
            )}
          >
            <Filter className="h-3 w-3" />
            Filter
            {hasFilter && <span className="ml-0.5">·</span>}
          </button>
          {filterOpen && (
            <div
              className="absolute left-0 top-full z-20 mt-1 w-44 rounded-[12px] border border-[var(--line)] bg-white p-1 shadow-lg"
              onMouseLeave={() => setFilterOpen(false)}
            >
              <FilterToggle
                icon={Bell}
                label="Has reminder"
                checked={!!filter.hasReminder}
                onChange={(v) => setFilter({ ...filter, hasReminder: v })}
              />
              <FilterToggle
                icon={Link2}
                label="Linked to a doc"
                checked={!!filter.linkedToDoc}
                onChange={(v) => setFilter({ ...filter, linkedToDoc: v })}
              />
              <FilterToggle
                icon={CalendarIcon}
                label="Linked to an event"
                checked={!!filter.linkedToEvent}
                onChange={(v) => setFilter({ ...filter, linkedToEvent: v })}
              />
              {hasFilter && (
                <>
                  <div className="my-1 border-t border-[var(--line-soft)]" />
                  <button
            data-command-exempt="list sort, filter and search controls; they change what this panel shows, not the corpus"
                    type="button"
                    onClick={() => {
                      resetFilter();
                      setFilterOpen(false);
                    }}
                    className="block w-full rounded-[8px] px-2 py-1 text-left text-xs text-[var(--bad-fg)] hover:bg-[rgba(179,56,46,0.07)]"
                  >
                    Clear filters
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterToggle({
  icon: Icon,
  label,
  checked,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
            data-command-exempt="list sort, filter and search controls; they change what this panel shows, not the corpus"
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'flex w-full items-center gap-2 rounded-[8px] px-2 py-1 text-left text-xs text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)]',
        checked && 'bg-[rgba(20,22,26,0.06)] font-semibold text-[var(--ink)]',
      )}
    >
      <Icon className="h-3 w-3" />
      <span className="flex-1">{label}</span>
      {checked && <span className="text-[var(--ink)]">✓</span>}
    </button>
  );
}
