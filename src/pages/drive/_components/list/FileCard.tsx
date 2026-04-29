import { useState } from 'react';
import {
  MoreVertical,
  Star,
  Users,
  Trash2,
  Pencil,
  Share2,
  FolderInput,
  Sparkles,
} from 'lucide-react';
import type { DriveItem } from '@/pages/drive/_lib/types';
import { classifyFile, fileKindIcon, fileKindColor, formatBytes, folderIcon } from '@/pages/drive/_lib/fileTypes';
import { useDriveStore } from '@/pages/drive/_hooks/use-drive-store';
import { useDriveUiStore } from '@/pages/drive/_hooks/use-drive-ui-store';
import { cn } from '@/lib/utils';

interface Props {
  item: DriveItem;
  onOpen: (item: DriveItem) => void;
}

function formatDate(ts: number): string {
  const diff = Date.now() - ts;
  const m = 60_000;
  const h = 3_600_000;
  const d = 86_400_000;
  if (diff < m) return 'just now';
  if (diff < h) return `${Math.floor(diff / m)}m ago`;
  if (diff < d) return `${Math.floor(diff / h)}h ago`;
  if (diff < 7 * d) return `${Math.floor(diff / d)}d ago`;
  return new Date(ts).toLocaleDateString();
}

export default function FileCard({ item, onOpen }: Props) {
  const star = useDriveStore((s) => s.toggleStar);
  const trash = useDriveStore((s) => s.trash);
  const rename = useDriveStore((s) => s.rename);
  const { selectedIds, toggleSelected, setShareTargetId } = useDriveUiStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const selected = selectedIds.includes(item.id);
  const isFolder = item.type === 'folder';
  const kind = isFolder ? null : classifyFile(item);
  const Icon = isFolder ? folderIcon() : fileKindIcon(kind!);
  const iconColor = isFolder
    ? item.color ?? '#6b7280'
    : undefined;
  const tone = !isFolder ? fileKindColor(kind!) : '';

  const onRename = () => {
    setMenuOpen(false);
    const next = window.prompt('Rename', item.name);
    if (next && next.trim()) rename(item.id, next.trim());
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(item);
        }
      }}
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/drive-id', item.id)}
      className={cn(
        'group relative flex cursor-pointer flex-col overflow-hidden rounded-md border bg-white transition-all hover:border-blue-400',
        selected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-gray-200',
      )}
    >
      <div className="relative flex h-28 items-center justify-center bg-gray-50">
        {isFolder && item.emoji ? (
          <span className="text-4xl">{item.emoji}</span>
        ) : (
          <Icon
            className={cn('h-10 w-10', isFolder ? '' : tone)}
            style={isFolder ? { color: iconColor } : undefined}
            strokeWidth={1.4}
          />
        )}
        {item.suggestedTags && item.suggestedTags.length > 0 && (
          <div className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
            <Sparkles className="h-2.5 w-2.5" />
            {item.suggestedTags.length} tag suggestions
          </div>
        )}
      </div>
      <div className="flex items-start gap-2 px-3 py-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="truncate text-sm font-medium text-gray-900">{item.name}</span>
            {item.starred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
            {item.sharedWith.length > 0 && <Users className="h-3 w-3 text-gray-400" />}
          </div>
          <div className="text-[11px] text-gray-500">
            {isFolder
              ? `Folder · ${formatDate(item.updatedAt)}`
              : `${formatBytes(item.size)} · ${formatDate(item.updatedAt)}`}
          </div>
          {item.summary?.oneLine && (
            <div className="mt-0.5 line-clamp-2 text-[11px] italic text-gray-500">
              {item.summary.oneLine}
            </div>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSelected(item.id);
        }}
        className={cn(
          'absolute left-2 top-2 z-10 h-4 w-4 rounded border bg-white transition-opacity',
          selected
            ? 'border-blue-500 bg-blue-500 opacity-100'
            : 'border-gray-300 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto',
        )}
        aria-label={selected ? 'Deselect' : 'Select'}
      >
        {selected && (
          <svg viewBox="0 0 16 16" className="h-full w-full fill-white">
            <path d="M6.5 11.5L3 8l1-1 2.5 2.5L11.5 4.5l1 1z" />
          </svg>
        )}
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          star(item.id);
        }}
        className={cn(
          'absolute right-1.5 top-1.5 z-10 rounded bg-white/90 p-1 backdrop-blur transition-opacity hover:bg-gray-100',
          item.starred ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto',
        )}
        aria-label={item.starred ? 'Unstar' : 'Star'}
      >
        <Star className={cn('h-3.5 w-3.5', item.starred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500')} />
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setMenuOpen((o) => !o);
        }}
        className="absolute bottom-1.5 right-1.5 rounded p-1 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-700 group-hover:opacity-100"
        aria-label="More actions"
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {menuOpen && (
        <div
          className="absolute bottom-9 right-2 z-20 w-44 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
          onClick={(e) => e.stopPropagation()}
          onMouseLeave={() => setMenuOpen(false)}
        >
          <button
            type="button"
            onClick={onRename}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            <Pencil className="h-3.5 w-3.5" /> Rename
          </button>
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              setShareTargetId(item.id);
            }}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
          <div className="my-1 border-t border-gray-100" />
          <button
            type="button"
            onClick={() => {
              setMenuOpen(false);
              trash(item.id);
            }}
            className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-3.5 w-3.5" /> Move to trash
          </button>
        </div>
      )}
    </div>
  );
}
