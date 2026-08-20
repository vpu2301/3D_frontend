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
    <div className="flex flex-wrap items-center gap-2 border-b border-[var(--line-soft)] px-6 py-3">
      <div className="relative flex-1 min-w-[260px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-5)]" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={semanticMode ? 'Search semantically — "the deck I showed last month"' : 'Search by keyword…'}
          className="h-9 w-full rounded-[10px] border border-[var(--line)] bg-white pl-9 pr-24 text-sm text-[var(--ink)] placeholder:text-[var(--text-5)] focus:border-[var(--ink)] focus:outline-none"
        />
        <div className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="rounded-[8px] p-1 text-[var(--text-5)] hover:bg-[rgba(20,22,26,0.05)]"
              aria-label="Clear"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setSemanticMode(!semanticMode)}
            className={cn(
              'flex items-center gap-1 rounded-[8px] px-2 py-1 text-[11px] font-medium',
              semanticMode
                ? 'bg-[rgba(20,22,26,0.07)] text-[var(--ink)]'
                : 'text-[var(--text-4)] hover:bg-[rgba(20,22,26,0.05)]',
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
          className="flex h-9 items-center gap-1 rounded-[10px] border border-[var(--line)] bg-white px-2.5 text-xs text-[var(--text-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
        >
          <ArrowDownAZ className="h-3.5 w-3.5" />
          {sortBy[0].toUpperCase() + sortBy.slice(1)}
          <ChevronDown className="h-3 w-3" />
        </button>
        {sortOpen && (
          <div
            className="absolute right-0 top-full z-20 mt-1 w-40 rounded-[12px] border border-[var(--line)] bg-white p-1 shadow-lg"
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
                  'block w-full rounded-[8px] px-2 py-1.5 text-left text-xs text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)]',
                  sortBy === b && 'bg-[rgba(20,22,26,0.06)] font-semibold text-[var(--ink)]',
                )}
              >
                {b[0].toUpperCase() + b.slice(1)}
              </button>
            ))}
            <div className="my-1 border-t border-[var(--line-soft)]" />
            <button
              type="button"
              onClick={() => {
                setSort(sortBy, sortDir === 'asc' ? 'desc' : 'asc');
                setSortOpen(false);
              }}
              className="block w-full rounded-[8px] px-2 py-1.5 text-left text-xs text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)]"
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
            'flex h-9 items-center gap-1 rounded-[10px] border border-[var(--line)] px-2.5 text-xs text-[var(--text-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]',
            hasFilter && 'border-[var(--ink)] bg-[rgba(20,22,26,0.06)] text-[var(--ink)]',
          )}
        >
          <Filter className="h-3.5 w-3.5" />
          Filter
          {hasFilter && <span>·</span>}
        </button>
        {filterOpen && (
          <div
            className="absolute right-0 top-full z-20 mt-1 w-52 rounded-[12px] border border-[var(--line)] bg-white p-1 shadow-lg"
            onMouseLeave={() => setFilterOpen(false)}
          >
            <div className="plat-eyebrow px-2 pb-1.5 pt-2">Type</div>
            {Object.entries(FILE_KIND_LABELS).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => {
                  setFilter({ ...filter, kind: filter.kind === (k as FileKind) ? undefined : (k as FileKind) });
                }}
                className={cn(
                  'block w-full rounded-[8px] px-2 py-1.5 text-left text-xs text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)]',
                  filter.kind === (k as FileKind) && 'bg-[rgba(20,22,26,0.06)] font-semibold text-[var(--ink)]',
                )}
              >
                {label}
              </button>
            ))}
            <div className="my-1 border-t border-[var(--line-soft)]" />
            {hasFilter && (
              <button
                type="button"
                onClick={() => {
                  resetFilter();
                  setFilterOpen(false);
                }}
                className="block w-full rounded-[8px] px-2 py-1.5 text-left text-xs text-[var(--bad-fg)] hover:bg-[rgba(179,56,46,0.07)]"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* View mode */}
      <div className="flex h-9 items-center overflow-hidden rounded-[10px] border border-[var(--line)]">
        <button
          type="button"
          onClick={() => setViewMode('grid')}
          className={cn(
            'px-2 py-1.5 text-[var(--text-4)] transition-colors hover:text-[var(--ink)]',
            viewMode === 'grid' && 'bg-[rgba(20,22,26,0.06)] text-[var(--ink)]',
          )}
          aria-label="Grid view"
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => setViewMode('list')}
          className={cn(
            'px-2 py-1.5 text-[var(--text-4)] transition-colors hover:text-[var(--ink)]',
            viewMode === 'list' && 'bg-[rgba(20,22,26,0.06)] text-[var(--ink)]',
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
          'flex h-9 items-center gap-1 rounded-full px-3.5 text-[12.5px] font-semibold transition-colors',
          driveAiOpen
            ? 'bg-[var(--ink)] text-white'
            : 'border border-[var(--line)] text-[var(--text-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]',
        )}
        title="Ask AI across Drive (⌘J)"
      >
        <Sparkles className="h-3.5 w-3.5" /> Ask AI
      </button>

      <button
        type="button"
        onClick={onUploadClick}
        className="plat-btn-ghost"
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
          className="plat-btn px-4"
          style={{ height: 36 }}
        >
          <Plus className="h-4 w-4" /> New
        </button>
        {newOpen && (
          <div
            className="absolute right-0 top-full z-20 mt-1 w-48 rounded-[12px] border border-[var(--line)] bg-white p-1 shadow-lg"
            onMouseLeave={() => setNewOpen(false)}
          >
            <button type="button" onClick={onNewFolder} className="block w-full rounded-[8px] px-2 py-1.5 text-left text-[13px] text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]">
              New folder
            </button>
            <button
              type="button"
              onClick={() => {
                setNewOpen(false);
                window.location.assign('/docs');
              }}
              className="block w-full rounded-[8px] px-2 py-1.5 text-left text-[13px] text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
            >
              New doc (in Docs)
            </button>
            <button
              type="button"
              onClick={() => {
                setNewOpen(false);
                window.location.assign('/notes');
              }}
              className="block w-full rounded-[8px] px-2 py-1.5 text-left text-[13px] text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
            >
              New note (in Notes)
            </button>
            <div className="my-1 border-t border-[var(--line-soft)]" />
            <button
              type="button"
              onClick={() => {
                setNewOpen(false);
                onUploadClick();
              }}
              className="block w-full rounded-[8px] px-2 py-1.5 text-left text-[13px] text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
            >
              Upload file
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
