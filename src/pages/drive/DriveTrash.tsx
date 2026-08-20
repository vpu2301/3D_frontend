import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react';
import DriveLayout from '@/pages/drive/_components/shared/DriveLayout';
import DriveMiniRail from '@/pages/drive/_components/sidebar/DriveMiniRail';
import { useDriveStore, selectItemsMap } from '@/pages/drive/_hooks/use-drive-store';
import { classifyFile, fileKindIcon, fileKindColor } from '@/pages/drive/_lib/fileTypes';
import { cn } from '@/lib/utils';

export default function DriveTrash() {
  const load = useDriveStore((s) => s.load);
  const itemsMap = useDriveStore(selectItemsMap);
  const restore = useDriveStore((s) => s.restore);
  const remove = useDriveStore((s) => s.permanentlyDelete);

  useEffect(() => {
    load();
  }, [load]);

  const trashed = useMemo(
    () =>
      Object.values(itemsMap)
        .filter((i) => i.trashed)
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [itemsMap],
  );

  return (
    <DriveLayout>
      <div className="flex flex-1 overflow-hidden">
        <DriveMiniRail />
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-[var(--line-soft)] px-6 py-4">
            <p className="plat-crumb">3days.drive / trash</p>
            <Link to="/drive" className="mt-1.5 inline-flex items-center gap-1 text-xs text-[var(--text-4)] transition-colors hover:text-[var(--ink)]">
              <ArrowLeft className="h-3 w-3" /> Back to Drive
            </Link>
            <h1 className="mt-1 text-[26px] leading-tight">Trash</h1>
            <p className="mt-1 text-xs text-[var(--text-4)]">Soft-deleted items. Restore or delete forever.</p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {trashed.length === 0 ? (
              <div className="plat-panel py-16 text-center">
                <Trash2 className="mx-auto mb-3 h-7 w-7 text-[var(--text-5)]" />
                <p className="text-sm text-[var(--text-4)]">Trash is empty.</p>
              </div>
            ) : (
              <div className="plat-list">
                {trashed.map((it) => {
                  const kind = it.type === 'folder' ? null : classifyFile(it);
                  const Icon = it.type === 'folder' ? null : fileKindIcon(kind!);
                  return (
                    <div
                      key={it.id}
                      className="flex items-center justify-between gap-4 border-b border-[var(--line-soft)] px-4 py-3 last:border-0"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        {it.type === 'folder' ? (
                          <span className="text-base">{it.emoji ?? '📁'}</span>
                        ) : (
                          Icon && <Icon className={cn('h-4 w-4', fileKindColor(kind!))} />
                        )}
                        <span className="truncate text-sm font-medium text-[var(--ink)]">{it.name}</span>
                        <span className="shrink-0 text-xs text-[var(--text-4)]">
                          · {new Date(it.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => restore(it.id)}
                          className="plat-btn-ghost h-8"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Restore
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Permanently delete "${it.name}"?`)) remove(it.id);
                          }}
                          className="flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-[var(--bad-fg)] transition-colors hover:bg-[rgba(179,56,46,0.07)]"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete forever
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
    </DriveLayout>
  );
}
