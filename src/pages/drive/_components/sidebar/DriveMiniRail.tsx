import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  HardDrive,
  Clock,
  Star,
  Users,
  Network,
  Trash2,
  Plus,
  Sparkles,
  ChevronDown,
  ChevronRight,
  FolderPlus,
  Upload as UploadIcon,
  FileText,
  StickyNote,
} from 'lucide-react';
import {
  useDriveStore,
  selectItemsMap,
  selectSpacesMap,
  totalStoredBytes,
} from '@/pages/drive/_hooks/use-drive-store';
import { formatBytes, MOCK_STORAGE_BUDGET } from '@/pages/drive/_lib/fileTypes';
import { cn } from '@/lib/utils';

interface NavRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count?: number;
  badgeColor?: 'red' | 'gray';
  active?: boolean;
  onClick: () => void;
}

function NavRow({ icon: Icon, label, count, badgeColor, active, onClick }: NavRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-r-full py-2 pl-5 pr-4 text-left text-sm transition-colors',
        active ? 'bg-[#dde9f4] text-gray-900' : 'text-gray-700 hover:bg-gray-100',
      )}
    >
      <Icon className="h-4 w-4 shrink-0 text-gray-500" />
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            'shrink-0 rounded-full px-1.5 text-[10px] font-medium leading-tight',
            badgeColor === 'red' ? 'bg-red-500 text-white' : 'text-gray-500',
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export default function DriveMiniRail() {
  const itemsMap = useDriveStore(selectItemsMap);
  const spacesMap = useDriveStore(selectSpacesMap);
  const createFolder = useDriveStore((s) => s.createFolder);
  const navigate = useNavigate();
  const location = useLocation();

  const [newOpen, setNewOpen] = useState(false);
  const [spacesOpen, setSpacesOpen] = useState(true);

  const items = Object.values(itemsMap);
  const stored = totalStoredBytes(items);
  const pct = Math.min(100, Math.max(0.5, (stored / MOCK_STORAGE_BUDGET) * 100));

  const starredCount = items.filter((i) => i.starred && !i.trashed).length;
  const sharedCount = items.filter((i) => i.sharedWith.length > 0 && !i.trashed).length;
  const trashedCount = items.filter((i) => i.trashed).length;

  const path = location.pathname;
  const isActive = (href: string) => {
    if (href === '/drive') {
      return (
        path === '/drive' ||
        path.startsWith('/drive/folder/') ||
        path.startsWith('/drive/file/')
      );
    }
    return path === href;
  };

  const onNewFolder = async () => {
    setNewOpen(false);
    const name = window.prompt('Folder name?');
    if (!name) return;
    const m = path.match(/^\/drive\/folder\/([^/]+)/);
    const parentId = m ? m[1] : 'drive_root';
    const f = await createFolder(name.trim(), parentId);
    navigate(`/drive/folder/${f.id}`);
  };

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-white">
      <div className="px-4 pt-3 pb-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => setNewOpen((o) => !o)}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#bdd8ec] px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-[#a5c8e0]"
          >
            <Plus className="h-4 w-4" /> New
          </button>
          {newOpen && (
            <div
              className="absolute left-0 top-full z-20 mt-1 w-48 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
              onMouseLeave={() => setNewOpen(false)}
            >
              <button
                type="button"
                onClick={onNewFolder}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100"
              >
                <FolderPlus className="h-3.5 w-3.5 text-gray-500" /> New folder
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewOpen(false);
                  // Bubble to the upload trigger via a custom event the dropzone listens to.
                  window.dispatchEvent(new CustomEvent('drive:upload'));
                }}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100"
              >
                <UploadIcon className="h-3.5 w-3.5 text-gray-500" /> Upload file
              </button>
              <div className="my-1 border-t border-gray-100" />
              <button
                type="button"
                onClick={() => {
                  setNewOpen(false);
                  navigate('/docs');
                }}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100"
              >
                <FileText className="h-3.5 w-3.5 text-gray-500" /> New doc (in Docs)
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewOpen(false);
                  navigate('/notes');
                }}
                className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-gray-100"
              >
                <StickyNote className="h-3.5 w-3.5 text-gray-500" /> New note (in Notes)
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-3">
        <div className="space-y-0.5">
          <NavRow
            icon={HardDrive}
            label="My Drive"
            active={isActive('/drive')}
            onClick={() => navigate('/drive')}
          />
          <NavRow
            icon={Clock}
            label="Recent"
            active={isActive('/drive/recent')}
            onClick={() => navigate('/drive/recent')}
          />
          <NavRow
            icon={Star}
            label="Starred"
            count={starredCount}
            active={isActive('/drive/starred')}
            onClick={() => navigate('/drive/starred')}
          />
          <NavRow
            icon={Users}
            label="Shared"
            count={sharedCount}
            active={isActive('/drive/shared')}
            onClick={() => navigate('/drive/shared')}
          />
        </div>

        <div className="mb-1.5 mt-6 flex items-center justify-between px-5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          <button
            type="button"
            onClick={() => setSpacesOpen((o) => !o)}
            className="flex items-center gap-1"
          >
            {spacesOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            Smart spaces
          </button>
        </div>
        {spacesOpen && (
          <div className="space-y-0.5">
            <NavRow
              icon={Sparkles}
              label="All spaces"
              active={path === '/drive/spaces'}
              onClick={() => navigate('/drive/spaces')}
            />
            {Object.values(spacesMap).map((sp) => (
              <NavRow
                key={sp.id}
                icon={Network}
                label={sp.name}
                count={sp.fileIds.length}
                active={path === `/drive/spaces/${sp.id}`}
                onClick={() => navigate(`/drive/spaces/${sp.id}`)}
              />
            ))}
          </div>
        )}

        <div className="mb-1.5 mt-6 px-5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Fix &amp; manage
        </div>
        <div className="space-y-0.5">
          <NavRow
            icon={Trash2}
            label="Trash"
            count={trashedCount}
            active={isActive('/drive/trash')}
            onClick={() => navigate('/drive/trash')}
          />
        </div>
      </div>

      {/* Storage footer */}
      <div className="border-t border-gray-100 px-5 py-3">
        <div className="flex items-center justify-between text-[11px] text-gray-500">
          <span className="truncate">{formatBytes(stored)} of {formatBytes(MOCK_STORAGE_BUDGET)}</span>
          <span>{pct.toFixed(1)}%</span>
        </div>
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-gray-100">
          <div className="h-full bg-[#8fc4e4]" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </aside>
  );
}
