import { useEffect, useMemo, useState } from 'react';
import {
  FolderOpen,
  LayoutGrid,
  List as ListIcon,
  ArrowDownAZ,
} from 'lucide-react';
import DocsLayout from '@/pages/docs/_components/shared/DocsLayout';
import DocsMiniRail from '@/pages/docs/_components/sidebar/DocsMiniRail';
import TemplateStrip from '@/pages/docs/_components/dashboard/TemplateStrip';
import DocCard from '@/pages/docs/_components/dashboard/DocCard';
import DocRow from '@/pages/docs/_components/dashboard/DocRow';
import SearchBar from '@/pages/docs/_components/dashboard/SearchBar';
import BulkActionBar from '@/pages/docs/_components/dashboard/BulkActionBar';
import { useDocsStore, selectDocsMap } from '@/pages/docs/_hooks/use-docs-store';
import { useDocsUiStore } from '@/pages/docs/_hooks/use-docs-ui-store';
import { toPlainText } from '@/pages/docs/_lib/export';
import { cn } from '@/lib/utils';
import type { Doc } from '@/pages/docs/_lib/types';

type RailFilter = 'all' | 'starred' | 'recent' | 'shared';
type SortMode = 'recent' | 'az';

function matchesQuery(doc: Doc, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  if (doc.title.toLowerCase().includes(needle)) return true;
  if (doc.summary?.toLowerCase().includes(needle)) return true;
  return toPlainText(doc.content).toLowerCase().includes(needle);
}

const FILTER_TITLE: Record<RailFilter, string> = {
  all: 'All docs',
  starred: 'Starred',
  recent: 'Recent',
  shared: 'Shared with me',
};

export default function DocsDashboard() {
  const load = useDocsStore((s) => s.load);
  const loaded = useDocsStore((s) => s.loaded);
  const docsMap = useDocsStore(selectDocsMap);
  const docs = useMemo(() => Object.values(docsMap), [docsMap]);
  const folders = useDocsStore((s) => s.folders);

  const { viewMode, setViewMode, query } = useDocsUiStore();

  const [filter, setFilter] = useState<RailFilter>('all');
  const [sortMode, setSortMode] = useState<SortMode>('recent');
  const [folderId, setFolderId] = useState<string | null>(null);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    let list = docs.filter((d) => !d.trashed);
    if (filter === 'starred') list = list.filter((d) => d.starred);
    if (filter === 'shared') list = list.filter((d) => d.shared);
    if (folderId) list = list.filter((d) => d.folderId === folderId);
    if (query) list = list.filter((d) => matchesQuery(d, query));

    let effectiveSort = sortMode;
    if (filter === 'recent') effectiveSort = 'recent';

    if (effectiveSort === 'az') list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    else list = [...list].sort((a, b) => b.updatedAt - a.updatedAt);
    return list;
  }, [docs, filter, folderId, query, sortMode]);

  const folderName = folderId && folders[folderId] ? folders[folderId].name : null;
  const heading = folderName ?? FILTER_TITLE[filter];

  return (
    <DocsLayout>
      <div className="flex flex-1 overflow-hidden">
        <DocsMiniRail
          filter={filter}
          onFilterChange={setFilter}
          folderId={folderId}
          onFolderChange={setFolderId}
        />
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Page heading */}
          <div className="border-b border-[var(--line-soft)] px-8 pt-6 pb-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <div className="plat-crumb">3days.docs</div>
                <h1 className="mt-1.5 text-[26px] font-semibold tracking-[-0.03em] text-[var(--ink)]">
                  {heading}{' '}
                  <span className="text-[var(--text-5)]">({filtered.length})</span>
                </h1>
              </div>
              <div className="w-72">
                <SearchBar />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Templates strip (only when on All / Recent without a folder) */}
            {!folderId && (filter === 'all' || filter === 'recent') && !query && (
              <section className="border-b border-[var(--line-soft)] px-8 py-5">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-[15px] font-semibold text-[var(--ink)]">Start a new document</h2>
                </div>
                <TemplateStrip />
              </section>
            )}

            {/* Recent documents */}
            <section className="px-8 py-5">
              <div className="mb-4 flex items-center justify-end gap-1">
                {/* View mode */}
                <div className="flex h-8 items-center gap-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'rounded-[10px] p-1.5 transition-colors',
                      viewMode === 'grid'
                        ? 'bg-[rgba(20,22,26,0.06)] text-[var(--ink)]'
                        : 'text-[var(--text-4)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]',
                    )}
                    aria-label="Grid view"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'rounded-[10px] p-1.5 transition-colors',
                      viewMode === 'list'
                        ? 'bg-[rgba(20,22,26,0.06)] text-[var(--ink)]'
                        : 'text-[var(--text-4)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]',
                    )}
                    aria-label="List view"
                  >
                    <ListIcon className="h-4 w-4" />
                  </button>
                </div>

                {/* Sort */}
                <button
                  type="button"
                  onClick={() => setSortMode((m) => (m === 'recent' ? 'az' : 'recent'))}
                  className={cn(
                    'rounded-[10px] p-1.5 transition-colors',
                    sortMode === 'az'
                      ? 'bg-[rgba(20,22,26,0.06)] text-[var(--ink)]'
                      : 'text-[var(--text-4)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]',
                  )}
                  aria-label="Sort A-Z"
                  title={sortMode === 'az' ? 'Sort by recent' : 'Sort A-Z'}
                >
                  <ArrowDownAZ className="h-4 w-4" />
                </button>
              </div>

              {!loaded ? (
                <div className="flex items-center justify-center py-20 text-sm text-[var(--text-3)]">
                  Loading…
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-[12px] bg-[var(--sand)] text-[var(--ink)]">
                    <FolderOpen className="h-7 w-7" />
                  </div>
                  <h3 className="text-base font-semibold text-[var(--ink)]">No documents</h3>
                  <p className="mt-1 max-w-sm text-sm text-[var(--text-3)]">
                    {query
                      ? 'No matches for your search. Try a different term.'
                      : 'Pick a template above to get started.'}
                  </p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                  {filtered.map((d) => (
                    <DocCard key={d.id} doc={d} />
                  ))}
                </div>
              ) : (
                <div className="overflow-hidden rounded-[14px] border border-[var(--line-soft)] bg-white">
                  <div className="plat-eyebrow grid grid-cols-[20px_minmax(0,1fr)_140px_140px_28px] items-center gap-3 border-b border-[var(--line-soft)] bg-[var(--sand)] px-4 py-2.5">
                    <span />
                    <span>Name</span>
                    <span>Owner</span>
                    <span>Last opened</span>
                    <span />
                  </div>
                  {filtered.map((d) => (
                    <DocRow key={d.id} doc={d} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>

      <BulkActionBar />
    </DocsLayout>
  );
}
