import { Star, Trash2, FolderInput, X } from 'lucide-react';
import { useState } from 'react';
import { useDocsStore } from '@/pages/docs/_hooks/use-docs-store';
import { useDocsUiStore } from '@/pages/docs/_hooks/use-docs-ui-store';

export default function BulkActionBar() {
  const { selectedDocIds, clearSelection } = useDocsUiStore();
  const folders = useDocsStore((s) => s.folders);
  const star = useDocsStore((s) => s.starDoc);
  const trash = useDocsStore((s) => s.trashDoc);
  const move = useDocsStore((s) => s.moveDoc);
  const [moveOpen, setMoveOpen] = useState(false);

  if (selectedDocIds.length === 0) return null;

  const onStar = async () => {
    for (const id of selectedDocIds) await star(id, true);
    clearSelection();
  };
  const onTrash = async () => {
    for (const id of selectedDocIds) await trash(id);
    clearSelection();
  };
  const onMove = async (folderId: string | null) => {
    for (const id of selectedDocIds) await move(id, folderId);
    clearSelection();
    setMoveOpen(false);
  };

  return (
    <div className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
      <span className="px-1 text-sm font-medium">{selectedDocIds.length} selected</span>
      <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />
      <button
        type="button"
        onClick={onStar}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
      >
        <Star className="h-3.5 w-3.5" /> Star
      </button>
      <div className="relative">
        <button
          type="button"
          onClick={() => setMoveOpen((o) => !o)}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <FolderInput className="h-3.5 w-3.5" /> Move
        </button>
        {moveOpen && (
          <div className="absolute bottom-full left-0 mb-1 w-44 rounded-md border bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <button
              type="button"
              onClick={() => onMove(null)}
              className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              No folder
            </button>
            {Object.values(folders).map((f) => (
              <button
                type="button"
                key={f.id}
                onClick={() => onMove(f.id)}
                className="block w-full rounded px-2 py-1 text-left text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                {f.name}
              </button>
            ))}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={onTrash}
        className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950"
      >
        <Trash2 className="h-3.5 w-3.5" /> Trash
      </button>
      <div className="h-4 w-px bg-zinc-300 dark:bg-zinc-700" />
      <button
        type="button"
        onClick={clearSelection}
        className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        aria-label="Clear selection"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
