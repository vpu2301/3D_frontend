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
        'flex w-full items-center gap-3 rounded-[10px] py-2 pl-4 pr-3 text-left text-[13.5px] font-medium transition-colors',
        active
          ? 'bg-[rgba(20,22,26,0.07)] text-[var(--ink)]'
          : 'text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]',
      )}
    >
      <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-[var(--ink)]' : 'text-[var(--text-4)]')} />
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            'shrink-0 rounded-full px-1.5 text-[10px] font-medium leading-tight',
            badgeColor === 'red'
              ? 'bg-[var(--bad-fg)] text-white'
              : 'text-[var(--text-5)]',
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
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-[var(--line-soft)]">
      <div className="px-4 pt-3 pb-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => setNewOpen((o) => !o)}
            className="plat-btn w-full justify-center"
          >
            <Plus className="h-4 w-4" /> New
          </button>
          {newOpen && (
            <div
              className="absolute left-0 top-full z-20 mt-1 w-48 rounded-[12px] border border-[var(--line)] bg-white p-1 shadow-lg"
              onMouseLeave={() => setNewOpen(false)}
            >
              <button
                type="button"
                onClick={onNewFolder}
                className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left text-[13px] text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
              >
                <FolderPlus className="h-3.5 w-3.5 text-[var(--text-4)]" /> New folder
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewOpen(false);
                  // Bubble to the upload trigger via a custom event the dropzone listens to.
                  window.dispatchEvent(new CustomEvent('drive:upload'));
                }}
                className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left text-[13px] text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
              >
                <UploadIcon className="h-3.5 w-3.5 text-[var(--text-4)]" /> Upload file
              </button>
              <div className="my-1 border-t border-[var(--line-soft)]" />
              <button
                type="button"
                onClick={() => {
                  setNewOpen(false);
                  navigate('/docs');
                }}
                className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left text-[13px] text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
              >
                <FileText className="h-3.5 w-3.5 text-[var(--text-4)]" /> New doc (in Docs)
              </button>
              <button
                type="button"
                onClick={() => {
                  setNewOpen(false);
                  navigate('/notes');
                }}
                className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left text-[13px] text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
              >
                <StickyNote className="h-3.5 w-3.5 text-[var(--text-4)]" /> New note (in Notes)
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3">
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

        <div className="plat-eyebrow mb-1.5 mt-6 flex items-center justify-between px-4">
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

        <div className="plat-eyebrow mb-1.5 mt-6 px-4">Fix &amp; manage</div>
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
      <div className="border-t border-[var(--line-soft)] px-5 py-3">
        <div className="flex items-center justify-between text-[11px] text-[var(--text-4)]">
          <span className="truncate">{formatBytes(stored)} of {formatBytes(MOCK_STORAGE_BUDGET)}</span>
          <span>{pct.toFixed(1)}%</span>
        </div>
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[var(--sand-deep)]">
          <div className="h-full bg-[var(--ink)]" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </aside>
  );
}
