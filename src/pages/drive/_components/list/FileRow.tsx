import { useState } from 'react';
import { Star, Users, MoreVertical, Pencil, Share2, Trash2 } from 'lucide-react';
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
  const d = 86_400_000;
  if (diff < d) return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return new Date(ts).toLocaleDateString();
}

export default function FileRow({ item, onOpen }: Props) {
  const { selectedIds, toggleSelected, setShareTargetId } = useDriveUiStore();
  const star = useDriveStore((s) => s.toggleStar);
  const trash = useDriveStore((s) => s.trash);
  const rename = useDriveStore((s) => s.rename);
  const [menuOpen, setMenuOpen] = useState(false);
  const selected = selectedIds.includes(item.id);
  const isFolder = item.type === 'folder';
  const kind = isFolder ? null : classifyFile(item);
  const Icon = isFolder ? folderIcon() : fileKindIcon(kind!);
  const tone = !isFolder ? fileKindColor(kind!) : '';

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(item)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') onOpen(item);
      }}
      draggable
      onDragStart={(e) => e.dataTransfer.setData('text/drive-id', item.id)}
      className={cn(
        'group grid cursor-pointer grid-cols-[20px_minmax(0,2fr)_minmax(0,2fr)_120px_100px_28px] items-center gap-3 border-b border-gray-100 px-3 py-2 text-sm transition-colors hover:bg-gray-50',
        selected && 'bg-blue-50',
      )}
    >
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleSelected(item.id);
        }}
        className={cn(
          'h-4 w-4 rounded border transition-opacity',
          selected
            ? 'border-blue-500 bg-blue-500'
            : 'border-gray-300 opacity-0 group-hover:opacity-100',
        )}
        aria-label={selected ? 'Deselect' : 'Select'}
      >
        {selected && (
          <svg viewBox="0 0 16 16" className="h-full w-full fill-white">
            <path d="M6.5 11.5L3 8l1-1 2.5 2.5L11.5 4.5l1 1z" />
          </svg>
        )}
      </button>

      <div className="flex min-w-0 items-center gap-2.5">
        {isFolder && item.emoji ? (
          <span className="text-base leading-none">{item.emoji}</span>
        ) : (
          <Icon
            className={cn('h-4 w-4 shrink-0', isFolder ? '' : tone)}
            style={isFolder ? { color: item.color ?? '#6b7280' } : undefined}
            strokeWidth={1.5}
          />
        )}
        <span className="truncate text-gray-900">{item.name}</span>
        {item.starred && <Star className="h-3 w-3 shrink-0 fill-yellow-400 text-yellow-400" />}
        {item.sharedWith.length > 0 && <Users className="h-3 w-3 shrink-0 text-gray-400" />}
      </div>

      <div className="truncate text-xs text-gray-500">
        {item.summary?.oneLine ?? (isFolder ? '—' : '—')}
      </div>

      <div className="text-xs text-gray-500">{formatDate(item.updatedAt)}</div>

      <div className="text-xs text-gray-500">{isFolder ? '—' : formatBytes(item.size)}</div>

      <div className="relative">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setMenuOpen((o) => !o);
          }}
          className="rounded p-1 text-gray-400 opacity-0 hover:bg-gray-100 hover:text-gray-700 group-hover:opacity-100"
          aria-label="More"
        >
          <MoreVertical className="h-4 w-4" />
        </button>
        {menuOpen && (
          <div
            className="absolute right-0 top-full z-20 mt-1 w-44 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
            onClick={(e) => e.stopPropagation()}
            onMouseLeave={() => setMenuOpen(false)}
          >
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                star(item.id);
              }}
              className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-gray-700 hover:bg-gray-100"
            >
              <Star className="h-3.5 w-3.5" />
              {item.starred ? 'Unstar' : 'Star'}
            </button>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false);
                const next = window.prompt('Rename', item.name);
                if (next && next.trim()) rename(item.id, next.trim());
              }}
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
    </div>
  );
}
