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
    <div className="fixed bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 rounded-[14px] border border-[var(--line-soft)] bg-white px-3 py-2 shadow-[0_8px_24px_rgba(20,22,26,0.1)]">
      <span className="px-1 text-sm font-semibold text-[var(--ink)]">{selectedDocIds.length} selected</span>
      <div className="h-4 w-px bg-[var(--line)]" />
      <button
        type="button"
        onClick={onStar}
        className="flex items-center gap-1 rounded-[8px] px-2 py-1 text-sm text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
      >
        <Star className="h-3.5 w-3.5" /> Star
      </button>
      <div className="relative">
        <button
          type="button"
          onClick={() => setMoveOpen((o) => !o)}
          className="flex items-center gap-1 rounded-[8px] px-2 py-1 text-sm text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
        >
          <FolderInput className="h-3.5 w-3.5" /> Move
        </button>
        {moveOpen && (
          <div className="absolute bottom-full left-0 mb-1 w-44 rounded-[12px] border border-[var(--line-soft)] bg-white p-1 shadow-[0_8px_24px_rgba(20,22,26,0.1)]">
            <button
              type="button"
              onClick={() => onMove(null)}
              className="block w-full rounded-[8px] px-2 py-1 text-left text-sm text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
            >
              No folder
            </button>
            {Object.values(folders).map((f) => (
              <button
                type="button"
                key={f.id}
                onClick={() => onMove(f.id)}
                className="block w-full rounded-[8px] px-2 py-1 text-left text-sm text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
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
        className="flex items-center gap-1 rounded-[8px] px-2 py-1 text-sm text-[var(--bad-fg)] hover:bg-[rgba(179,56,46,0.07)]"
      >
        <Trash2 className="h-3.5 w-3.5" /> Trash
      </button>
      <div className="h-4 w-px bg-[var(--line)]" />
      <button
        type="button"
        onClick={clearSelection}
        className="rounded-[8px] p-1 text-[var(--text-3)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
        aria-label="Clear selection"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
