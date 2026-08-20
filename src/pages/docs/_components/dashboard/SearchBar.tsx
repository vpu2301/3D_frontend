import { Search, X } from 'lucide-react';
import { useDocsUiStore } from '@/pages/docs/_hooks/use-docs-ui-store';

export default function SearchBar() {
  const { query, setQuery } = useDocsUiStore();
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-5)]" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search documents…"
        className="h-9 w-full rounded-[10px] border border-[var(--line-soft)] bg-[var(--sand)] py-1.5 pl-9 pr-9 text-sm text-[var(--ink)] placeholder:text-[var(--text-5)] focus:border-[var(--ink)] focus:bg-white focus:outline-none"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-[6px] p-1 text-[var(--text-4)] hover:bg-[rgba(20,22,26,0.06)]"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
