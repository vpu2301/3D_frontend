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
          <div className="border-b border-gray-100 px-6 py-4">
            <Link to="/drive" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:underline">
              <ArrowLeft className="h-3 w-3" /> Back to Drive
            </Link>
            <h1 className="mt-1 text-2xl font-light text-gray-900">Trash</h1>
            <p className="text-xs text-gray-500">Soft-deleted items. Restore or delete forever.</p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {trashed.length === 0 ? (
              <div className="rounded-md border border-gray-200 bg-white py-16 text-center">
                <Trash2 className="mx-auto mb-3 h-7 w-7 text-gray-300" />
                <p className="text-sm text-gray-500">Trash is empty.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
                {trashed.map((it) => {
                  const kind = it.type === 'folder' ? null : classifyFile(it);
                  const Icon = it.type === 'folder' ? null : fileKindIcon(kind!);
                  return (
                    <div
                      key={it.id}
                      className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 last:border-0"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        {it.type === 'folder' ? (
                          <span className="text-base">{it.emoji ?? '📁'}</span>
                        ) : (
                          Icon && <Icon className={cn('h-4 w-4', fileKindColor(kind!))} />
                        )}
                        <span className="truncate text-sm text-gray-900">{it.name}</span>
                        <span className="shrink-0 text-xs text-gray-500">
                          · {new Date(it.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => restore(it.id)}
                          className="flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-50"
                        >
                          <RotateCcw className="h-3.5 w-3.5" /> Restore
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Permanently delete "${it.name}"?`)) remove(it.id);
                          }}
                          className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs text-red-600 hover:bg-red-50"
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
