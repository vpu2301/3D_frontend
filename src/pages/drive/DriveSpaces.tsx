import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Network, Plus, RefreshCw, Sparkles, Trash2 } from 'lucide-react';
import DriveLayout from '@/pages/drive/_components/shared/DriveLayout';
import DriveMiniRail from '@/pages/drive/_components/sidebar/DriveMiniRail';
import FileCard from '@/pages/drive/_components/list/FileCard';
import FilePreview from '@/pages/drive/_components/preview/FilePreview';
import { useDriveStore, selectItemsMap, selectSpacesMap } from '@/pages/drive/_hooks/use-drive-store';
import { useDriveUiStore } from '@/pages/drive/_hooks/use-drive-ui-store';
import { populateSpace } from '@/pages/docs/_lib/mockAi';
import { classifyFile } from '@/pages/drive/_lib/fileTypes';
import type { DriveItem, Space } from '@/pages/drive/_lib/types';

export default function DriveSpaces() {
  const load = useDriveStore((s) => s.load);
  const itemsMap = useDriveStore(selectItemsMap);
  const spacesMap = useDriveStore(selectSpacesMap);
  const upsertSpace = useDriveStore((s) => s.upsertSpace);
  const setSpaceFiles = useDriveStore((s) => s.setSpaceFiles);
  const deleteSpace = useDriveStore((s) => s.deleteSpace);
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { previewId, setPreviewId } = useDriveUiStore();

  useEffect(() => {
    load();
  }, [load]);

  const fileMetas = useMemo(
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

  const space: Space | null = id ? spacesMap[id] ?? null : null;

  const onCreate = async () => {
    const definition = window.prompt(
      'Describe the Space — e.g. "design review materials" or "files about Acme"',
    );
    if (!definition) return;
    const name = window.prompt('Space name?', definition.slice(0, 40)) ?? definition.slice(0, 40);
    const ids = await populateSpace(definition, fileMetas);
    const newSpace: Space = {
      id: `space_custom_${Date.now()}`,
      name,
      definition,
      isAiCurated: true,
      fileIds: ids,
      lastComputedAt: Date.now(),
    };
    await upsertSpace(newSpace);
    navigate(`/drive/spaces/${newSpace.id}`);
  };

  const onRecompute = async () => {
    if (!space) return;
    const ids = await populateSpace(space.definition, fileMetas);
    await setSpaceFiles(space.id, ids);
  };

  const onDelete = async () => {
    if (!space) return;
    if (!confirm(`Delete space "${space.name}"?`)) return;
    await deleteSpace(space.id);
    navigate('/drive/spaces');
  };

  const onOpen = (item: DriveItem) => {
    if (item.type === 'file') setPreviewId(item.id);
  };

  return (
    <DriveLayout>
      <div className="flex flex-1 overflow-hidden">
        <DriveMiniRail />
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-[var(--line-soft)] px-6 py-4">
            <p className="plat-crumb">3days.drive / spaces</p>
            <Link to="/drive" className="mt-1.5 inline-flex items-center gap-1 text-xs text-[var(--text-4)] transition-colors hover:text-[var(--ink)]">
              <ArrowLeft className="h-3 w-3" /> Back to Drive
            </Link>
            <h1 className="mt-1 flex items-center gap-2 text-[26px] leading-tight">
              <Network className="h-5 w-5 text-[var(--text-4)]" /> Smart Spaces
            </h1>
            <p className="mt-1 text-xs text-[var(--text-4)]">
              AI-curated collections — files can appear in multiple spaces. Definitions are
              re-runnable.
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {space ? (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h2 className="text-[19px] leading-tight">
                      {space.emoji ? `${space.emoji} ` : ''}
                      {space.name}
                    </h2>
                    <p className="mt-1 text-xs italic text-[var(--text-4)]">"{space.definition}"</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={onRecompute}
                      className="plat-btn-ghost"
                    >
                      <RefreshCw className="h-3.5 w-3.5" /> Recompute
                    </button>
                    {!space.isAiCurated || space.id.startsWith('space_custom_') ? (
                      <button
                        type="button"
                        onClick={onDelete}
                        className="flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-semibold text-[var(--bad-fg)] transition-colors hover:bg-[rgba(179,56,46,0.07)]"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete space
                      </button>
                    ) : null}
                  </div>
                </div>
                <SpaceFileGrid fileIds={space.fileIds} itemsMap={itemsMap} onOpen={onOpen} />
              </div>
            ) : (
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-[18px] leading-tight">All spaces</h2>
                  <button type="button" onClick={onCreate} className="plat-btn">
                    <Plus className="h-4 w-4" /> New space (AI)
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {Object.values(spacesMap).map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => navigate(`/drive/spaces/${s.id}`)}
                      className="rounded-[12px] border border-[var(--line-soft)] bg-white p-4 text-left transition-colors hover:border-[var(--ink)]"
                    >
                      <div className="mb-1 flex items-center gap-2 text-[15px] font-semibold text-[var(--ink)]">
                        {s.emoji ? <span>{s.emoji}</span> : <Sparkles className="h-4 w-4 text-[var(--text-4)]" />}
                        {s.name}
                      </div>
                      <div className="line-clamp-2 text-xs italic text-[var(--text-4)]">"{s.definition}"</div>
                      <div className="mt-2 text-[11px] text-[var(--text-5)]">{s.fileIds.length} files</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      {previewId && (
        <FilePreview
          itemId={previewId}
          siblings={space?.fileIds.filter((id) => itemsMap[id]?.type === 'file') ?? []}
          onClose={() => setPreviewId(null)}
        />
      )}
    </DriveLayout>
  );
}

function SpaceFileGrid({
  fileIds,
  itemsMap,
  onOpen,
}: {
  fileIds: string[];
  itemsMap: Record<string, DriveItem>;
  onOpen: (i: DriveItem) => void;
}) {
  const items = fileIds.map((id) => itemsMap[id]).filter(Boolean) as DriveItem[];
  if (items.length === 0) {
    return <div className="py-8 text-sm text-[var(--text-4)]">No matching files. Try recomputing.</div>;
  }
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => (
        <FileCard key={item.id} item={item} onOpen={onOpen} />
      ))}
    </div>
  );
}
