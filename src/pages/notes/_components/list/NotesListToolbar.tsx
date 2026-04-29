import { useState } from 'react';
import { Search, X, ArrowUpDown, Filter, Bell, Link2, Calendar as CalendarIcon } from 'lucide-react';
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
  const { query, setQuery, sort, setSort, filter, setFilter, resetFilter } = useNotesUiStore();
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  const hasFilter =
    !!filter.hasReminder ||
    !!filter.linkedToDoc ||
    !!filter.linkedToEvent ||
    !!filter.notebookId ||
    !!filter.tag;

  return (
    <div className="border-b border-gray-100 px-3 py-2">
      <div className="relative">
        <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search notes…"
          className="h-8 w-full rounded-full border border-transparent bg-[#f1f3f4] pl-8 pr-7 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#8fc4e4] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8fc4e4]"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-400 hover:bg-gray-100"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      <div className="mt-2 flex items-center gap-1">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setSortOpen((o) => !o);
              setFilterOpen(false);
            }}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] text-gray-700 hover:bg-gray-100"
          >
            <ArrowUpDown className="h-3 w-3" />
            {SORT_LABELS[sort.by]}
          </button>
          {sortOpen && (
            <div
              className="absolute left-0 top-full z-20 mt-1 w-36 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
              onMouseLeave={() => setSortOpen(false)}
            >
              {(Object.keys(SORT_LABELS) as NoteListSort['by'][]).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => {
                    setSort({ ...sort, by: b });
                    setSortOpen(false);
                  }}
                  className={cn(
                    'block w-full rounded px-2 py-1 text-left text-xs hover:bg-gray-100',
                    sort.by === b && 'bg-gray-100 font-medium',
                  )}
                >
                  {SORT_LABELS[b]}
                </button>
              ))}
              <div className="my-1 border-t border-gray-100" />
              <button
                type="button"
                onClick={() => {
                  setSort({ ...sort, dir: sort.dir === 'asc' ? 'desc' : 'asc' });
                  setSortOpen(false);
                }}
                className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-gray-100"
              >
                {sort.dir === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
              </button>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setFilterOpen((o) => !o);
              setSortOpen(false);
            }}
            className={cn(
              'flex items-center gap-1 rounded-md px-2 py-1 text-[11px]',
              hasFilter ? 'bg-[#dde9f4] text-[#1a73e8]' : 'text-gray-700 hover:bg-gray-100',
            )}
          >
            <Filter className="h-3 w-3" />
            Filter
            {hasFilter && <span className="ml-0.5">·</span>}
          </button>
          {filterOpen && (
            <div
              className="absolute left-0 top-full z-20 mt-1 w-44 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
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
                  <div className="my-1 border-t border-gray-100" />
                  <button
                    type="button"
                    onClick={() => {
                      resetFilter();
                      setFilterOpen(false);
                    }}
                    className="block w-full rounded px-2 py-1 text-left text-xs text-red-600 hover:bg-red-50"
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
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        'flex w-full items-center gap-2 rounded px-2 py-1 text-left text-xs hover:bg-gray-100',
        checked && 'bg-gray-100 font-medium',
      )}
    >
      <Icon className="h-3 w-3" />
      <span className="flex-1">{label}</span>
      {checked && <span className="text-[#1a73e8]">✓</span>}
    </button>
  );
}
