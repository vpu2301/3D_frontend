import { Search, X } from 'lucide-react';
import { useDocsUiStore } from '@/pages/docs/_hooks/use-docs-ui-store';

export default function SearchBar() {
  const { query, setQuery } = useDocsUiStore();
  return (
    <div className="relative w-full">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search documents…"
        className="h-9 w-full rounded-full border border-transparent bg-[#f1f3f4] py-1.5 pl-9 pr-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#8fc4e4] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#8fc4e4]"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:bg-gray-100"
          aria-label="Clear search"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
