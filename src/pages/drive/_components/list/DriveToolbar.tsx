import { useState, useRef } from 'react';
import {
  LayoutGrid,
  List as ListIcon,
  ArrowDownAZ,
  Filter,
  ChevronDown,
  Plus,
  Sparkles,
  Upload as UploadIcon,
  Search,
  X,
} from 'lucide-react';
import { useDriveUiStore } from '@/pages/drive/_hooks/use-drive-ui-store';
import { useDriveStore } from '@/pages/drive/_hooks/use-drive-store';
import { FILE_KIND_LABELS } from '@/pages/drive/_lib/fileTypes';
import type { FileKind } from '@/pages/drive/_lib/types';
import { cn } from '@/lib/utils';

interface Props {
  folderId: string | null;
  onUploadClick: () => void;
}

export default function DriveToolbar({ folderId, onUploadClick }: Props) {
  const {
    viewMode, setViewMode,
    sortBy, sortDir, setSort,
    filter, setFilter, resetFilter,
    query, setQuery, semanticMode, setSemanticMode,
    setDriveAiOpen, driveAiOpen,
  } = useDriveUiStore();
  const createFolder = useDriveStore((s) => s.createFolder);
  const [sortOpen, setSortOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);

  const hasFilter = !!(filter.kind || filter.starred || filter.sharedWithMe || filter.tag);

  const onNewFolder = async () => {
    setNewOpen(false);
    const name = window.prompt('Folder name?');
    if (!name) return;
    await createFolder(name.trim(), folderId ?? 'drive_root');
  };

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 px-6 py-3">
      <div className="relative flex-1 min-w-[260px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={semanticMode ? 'Search semantically — "the deck I showed last month"' : 'Search by keyword…'}
          className="h-9 w-full rounded-md border border-gray-200 bg-white pl-9 pr-24 text-sm text-gray-900 placeholder:text-gray-400 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
        />
        <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rounded p-1 text-gray-400 hover:bg-gray-100"
              aria-label="Clear"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setSemanticMode(!semanticMode)}
            className={cn(
              'flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-medium',
              semanticMode ? 'bg-blue-50 text-blue-700' : 'text-gray-500 hover:bg-gray-100',
            )}
            title={semanticMode ? 'Semantic search ON' : 'Keyword search'}
          >
            <Sparkles className="h-3 w-3" />
            {semanticMode ? 'AI' : 'Keyword'}
          </button>
        </div>
      </div>

      {/* Sort */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setSortOpen((o) => !o);
            setFilterOpen(false);
            setNewOpen(false);
          }}
          className="flex h-9 items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 text-xs text-gray-700 hover:bg-gray-50"
        >
          <ArrowDownAZ className="h-3.5 w-3.5" />
          {sortBy[0].toUpperCase() + sortBy.slice(1)}
          <ChevronDown className="h-3 w-3" />
        </button>
        {sortOpen && (
          <div
            className="absolute right-0 top-full z-20 mt-1 w-40 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
            onMouseLeave={() => setSortOpen(false)}
          >
            {(['name', 'modified', 'created', 'size', 'type'] as const).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => {
                  setSort(b, sortDir);
                  setSortOpen(false);
                }}
                className={cn(
                  'block w-full rounded px-2 py-1 text-left text-xs hover:bg-gray-100',
                  sortBy === b && 'bg-gray-100 font-medium',
                )}
              >
                {b[0].toUpperCase() + b.slice(1)}
              </button>
            ))}
            <div className="my-1 border-t border-gray-100" />
            <button
              type="button"
              onClick={() => {
                setSort(sortBy, sortDir === 'asc' ? 'desc' : 'asc');
                setSortOpen(false);
              }}
              className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-gray-100"
            >
              {sortDir === 'asc' ? 'Ascending ↑' : 'Descending ↓'}
            </button>
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setFilterOpen((o) => !o);
            setSortOpen(false);
            setNewOpen(false);
          }}
          className={cn(
            'flex h-9 items-center gap-1 rounded-md border border-gray-200 px-2.5 text-xs text-gray-700 hover:bg-gray-50',
            hasFilter && 'border-blue-300 bg-blue-50 text-blue-700',
          )}
        >
          <Filter className="h-3.5 w-3.5" />
          Filter
          {hasFilter && <span>·</span>}
        </button>
        {filterOpen && (
          <div
            className="absolute right-0 top-full z-20 mt-1 w-52 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
            onMouseLeave={() => setFilterOpen(false)}
          >
            <div className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Type</div>
            {Object.entries(FILE_KIND_LABELS).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setFilter({ ...filter, kind: filter.kind === (k as FileKind) ? undefined : (k as FileKind) });
                }}
                className={cn(
                  'block w-full rounded px-2 py-1 text-left text-xs hover:bg-gray-100',
                  filter.kind === (k as FileKind) && 'bg-gray-100 font-medium',
                )}
              >
                {label}
              </button>
            ))}
            <div className="my-1 border-t border-gray-100" />
            {hasFilter && (
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
            )}
          </div>
        )}
      </div>

      {/* View mode */}
      <div className="flex h-9 items-center rounded-md border border-gray-200">
        <button
          type="button"
          onClick={() => setViewMode('grid')}
          className={cn(
            'rounded-l-md px-2 py-1.5 text-gray-600 hover:bg-gray-50',
            viewMode === 'grid' && 'bg-gray-100 text-gray-900',
          )}
          aria-label="Grid view"
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setViewMode('list')}
          className={cn(
            'rounded-r-md px-2 py-1.5 text-gray-600 hover:bg-gray-50',
            viewMode === 'list' && 'bg-gray-100 text-gray-900',
          )}
          aria-label="List view"
        >
          <ListIcon className="h-4 w-4" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => setDriveAiOpen(!driveAiOpen)}
        className={cn(
          'flex h-9 items-center gap-1 rounded-md px-3 text-sm font-medium',
          driveAiOpen ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-50 text-blue-700 hover:bg-blue-100',
        )}
        title="Ask AI across Drive (⌘J)"
      >
        <Sparkles className="h-3.5 w-3.5" /> Ask AI
      </button>

      <button
        type="button"
        onClick={onUploadClick}
        className="flex h-9 items-center gap-1 rounded-md border border-gray-200 px-3 text-sm text-gray-700 hover:bg-gray-50"
      >
        <UploadIcon className="h-4 w-4" />
        Upload
      </button>

      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setNewOpen((o) => !o);
            setSortOpen(false);
            setFilterOpen(false);
          }}
          className="flex h-9 items-center gap-1 rounded-md bg-gray-900 px-3 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" /> New
        </button>
        {newOpen && (
          <div
            className="absolute right-0 top-full z-20 mt-1 w-48 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
            onMouseLeave={() => setNewOpen(false)}
          >
            <button type="button" onClick={onNewFolder} className="block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100">
              New folder
            </button>
            <button
              type="button"
              onClick={() => {
                setNewOpen(false);
                window.location.assign('/docs');
              }}
              className="block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100"
            >
              New doc (in Docs)
            </button>
            <button
              type="button"
              onClick={() => {
                setNewOpen(false);
                window.location.assign('/notes');
              }}
              className="block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100"
            >
              New note (in Notes)
            </button>
            <div className="my-1 border-t border-gray-100" />
            <button
              type="button"
              onClick={() => {
                setNewOpen(false);
                onUploadClick();
              }}
              className="block w-full rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100"
            >
              Upload file
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
