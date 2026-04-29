import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Search } from 'lucide-react';
import DriveLayout from '@/pages/drive/_components/shared/DriveLayout';
import DriveMiniRail from '@/pages/drive/_components/sidebar/DriveMiniRail';
import FileCard from '@/pages/drive/_components/list/FileCard';
import FilePreview from '@/pages/drive/_components/preview/FilePreview';
import { useDriveStore, selectItemsMap } from '@/pages/drive/_hooks/use-drive-store';
import { useDriveUiStore } from '@/pages/drive/_hooks/use-drive-ui-store';
import { semanticFileSearch } from '@/pages/docs/_lib/mockAi';
import { classifyFile } from '@/pages/drive/_lib/fileTypes';
import type { DriveItem, RankedFile } from '@/pages/drive/_lib/types';

export default function DriveSearch() {
  const load = useDriveStore((s) => s.load);
  const itemsMap = useDriveStore(selectItemsMap);
  const { query, setQuery, previewId, setPreviewId } = useDriveUiStore();
  const [ranked, setRanked] = useState<RankedFile[]>([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    load();
  }, [load]);

  const allFiles = useMemo(
    () =>
      Object.values(itemsMap)
        .filter((i) => i.type === 'file' && !i.trashed)
        .map((i) => ({
          id: i.id,
          name: i.name,
          kind: classifyFile(i),
          size: i.size ?? 0,
          tags: i.tags,
          parentId: i.parentId,
          updatedAt: i.updatedAt,
          ownerId: i.ownerId,
          extractedText: i.extractedText,
          summary: i.summary?.oneLine,
        })),
    [itemsMap],
  );

  useEffect(() => {
    if (!query.trim()) {
      setRanked([]);
      return;
    }
    let cancelled = false;
    setRunning(true);
    semanticFileSearch(query, allFiles)
      .then((r) => {
        if (!cancelled) setRanked(r);
      })
      .finally(() => {
        if (!cancelled) setRunning(false);
      });
    return () => {
      cancelled = true;
    };
  }, [query, allFiles]);

  const onOpen = (item: DriveItem) => {
    if (item.type === 'file') setPreviewId(item.id);
  };

  return (
    <DriveLayout>
      <div className="flex flex-1 overflow-hidden">
        <DriveMiniRail />
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-gray-100 px-6 py-4">
            <Link to="/drive" className="text-xs text-gray-500 hover:underline">← Back to Drive</Link>
            <h1 className="mt-1 flex items-center gap-2 text-2xl font-light text-gray-900">
              <Sparkles className="h-5 w-5 text-blue-500" /> Search
            </h1>
            <div className="relative mt-3 max-w-2xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Try "the deck I showed last month" or "screenshots from Berlin"'
                className="h-10 w-full rounded-md border border-gray-200 bg-white pl-9 pr-3 text-sm focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {!query.trim() ? (
              <p className="text-sm text-gray-500">Type to search across {allFiles.length} files.</p>
            ) : running ? (
              <p className="text-sm text-gray-500">Searching…</p>
            ) : ranked.length === 0 ? (
              <p className="text-sm text-gray-500">No matches.</p>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {ranked.map((r) => {
                  const item = itemsMap[r.fileId];
                  if (!item) return null;
                  return (
                    <div key={r.fileId} className="flex flex-col">
                      <FileCard item={item} onOpen={onOpen} />
                      <div className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">
                        <Sparkles className="h-2.5 w-2.5" />
                        {r.reason}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </div>
      {previewId && (
        <FilePreview
          itemId={previewId}
          siblings={ranked.map((r) => r.fileId)}
          onClose={() => setPreviewId(null)}
        />
      )}
    </DriveLayout>
  );
}
