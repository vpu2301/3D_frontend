import { useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Plus,
  FileText,
  Star,
  Clock,
  Users,
  Folder,
  FolderPlus,
  Trash2,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useDocsStore, selectDocsMap } from '@/pages/docs/_hooks/use-docs-store';
import { useDocsUiStore } from '@/pages/docs/_hooks/use-docs-ui-store';
import { cn } from '@/lib/utils';

type Filter = 'all' | 'starred' | 'recent' | 'shared';

interface NavRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count?: number;
  active?: boolean;
  onClick: () => void;
}

function NavRow({ icon: Icon, label, count, active, onClick }: NavRowProps) {
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
        <span className="shrink-0 text-[10px] font-medium leading-tight text-gray-500">
          {count}
        </span>
      )}
    </button>
  );
}

interface Props {
  /** Active filter for the dashboard */
  filter?: Filter;
  onFilterChange?: (f: Filter) => void;
  /** Active folder filter (null = all folders) */
  folderId?: string | null;
  onFolderChange?: (id: string | null) => void;
}

export default function DocsMiniRail({
  filter = 'all',
  onFilterChange,
  folderId = null,
  onFolderChange,
}: Props) {
  const docsMap = useDocsStore(selectDocsMap);
  const folders = useDocsStore((s) => s.folders);
  const createDoc = useDocsStore((s) => s.createDoc);
  const createFolder = useDocsStore((s) => s.createFolder);
  const navigate = useNavigate();
  const location = useLocation();

  const [foldersOpen, setFoldersOpen] = useState(true);

  const docs = useMemo(() => Object.values(docsMap), [docsMap]);
  const totalCount = docs.filter((d) => !d.trashed).length;
  const starredCount = docs.filter((d) => !d.trashed && d.starred).length;
  const sharedCount = docs.filter((d) => !d.trashed && d.shared).length;
  const trashedCount = docs.filter((d) => d.trashed).length;

  const onTrashRoute = location.pathname === '/docs/trash';
  const onDashboard = location.pathname === '/docs';

  const goDashboard = () => {
    if (!onDashboard) navigate('/docs');
  };

  const onNew = async () => {
    const d = await createDoc({});
    navigate(`/docs/${d.id}`);
  };

  const onNewFolder = async () => {
    const name = window.prompt('Folder name?');
    if (!name) return;
    await createFolder(name.trim());
  };

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-white">
      <div className="px-4 pt-3 pb-4">
        <button
          type="button"
          onClick={onNew}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#bdd8ec] px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-[#a5c8e0]"
        >
          <Plus className="h-4 w-4" /> Create doc
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-3">
        <div className="space-y-0.5">
          <NavRow
            icon={FileText}
            label="All docs"
            count={totalCount}
            active={onDashboard && filter === 'all' && !folderId && !onTrashRoute}
            onClick={() => {
              onFilterChange?.('all');
              onFolderChange?.(null);
              goDashboard();
            }}
          />
          <NavRow
            icon={Clock}
            label="Recent"
            active={onDashboard && filter === 'recent' && !folderId}
            onClick={() => {
              onFilterChange?.('recent');
              onFolderChange?.(null);
              goDashboard();
            }}
          />
          <NavRow
            icon={Star}
            label="Starred"
            count={starredCount}
            active={onDashboard && filter === 'starred' && !folderId}
            onClick={() => {
              onFilterChange?.('starred');
              onFolderChange?.(null);
              goDashboard();
            }}
          />
          <NavRow
            icon={Users}
            label="Shared with me"
            count={sharedCount}
            active={onDashboard && filter === 'shared' && !folderId}
            onClick={() => {
              onFilterChange?.('shared');
              onFolderChange?.(null);
              goDashboard();
            }}
          />
        </div>

        <div className="mb-1.5 mt-6 flex items-center justify-between px-5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          <button
            type="button"
            onClick={() => setFoldersOpen((o) => !o)}
            className="flex items-center gap-1"
          >
            {foldersOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            Folders
          </button>
          <button
            type="button"
            onClick={onNewFolder}
            className="rounded p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="New folder"
            title="New folder"
          >
            <FolderPlus className="h-3.5 w-3.5" />
          </button>
        </div>
        {foldersOpen && (
          <div className="space-y-0.5">
            {Object.values(folders).length === 0 ? (
              <div className="px-5 py-1 text-[11px] text-gray-400">No folders yet</div>
            ) : (
              Object.values(folders)
                .sort((a, b) => a.name.localeCompare(b.name))
                .map((f) => {
                  const count = docs.filter((d) => !d.trashed && d.folderId === f.id).length;
                  return (
                    <NavRow
                      key={f.id}
                      icon={Folder}
                      label={f.name}
                      count={count}
                      active={onDashboard && folderId === f.id}
                      onClick={() => {
                        onFolderChange?.(f.id);
                        goDashboard();
                      }}
                    />
                  );
                })
            )}
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
            active={onTrashRoute}
            onClick={() => navigate('/docs/trash')}
          />
        </div>
      </div>
    </aside>
  );
}
