import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, StickyNote, Trash2 } from 'lucide-react';
import NotesLayout from '@/pages/notes/_components/shared/NotesLayout';
import NotesMiniRail from '@/pages/notes/_components/sidebar/NotesMiniRail';
import { useNotesStore, selectNotesMap } from '@/pages/notes/_hooks/use-notes-store';
import { deriveTitle } from '@/pages/notes/_lib/backlinks';

export default function NotesTrash() {
  const load = useNotesStore((s) => s.load);
  const notesMap = useNotesStore(selectNotesMap);
  const restore = useNotesStore((s) => s.restoreNote);
  const remove = useNotesStore((s) => s.deleteNote);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, [load]);

  const trashed = useMemo(
    () =>
      Object.values(notesMap)
        .filter((n) => n.trashed)
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [notesMap],
  );

  return (
    <NotesLayout>
      <div className="flex flex-1 overflow-hidden">
        <NotesMiniRail />
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-gray-100 px-8 pt-6 pb-4">
            <h1 className="text-2xl font-light text-gray-900">
              Trash <span className="text-gray-400">({trashed.length})</span>
            </h1>
            <p className="mt-1 text-xs text-gray-500">Soft-deleted notes. Restore or delete forever.</p>
          </div>
          <div className="flex-1 overflow-y-auto px-8 py-5">
            {trashed.length === 0 ? (
              <div className="rounded-md border border-gray-200 bg-white py-16 text-center">
                <Trash2 className="mx-auto mb-3 h-7 w-7 text-gray-300" />
                <p className="text-sm text-gray-500">Trash is empty.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
                {trashed.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 last:border-0"
                  >
                    <button
                      type="button"
                      onClick={() => navigate(`/notes/${n.id}`)}
                      className="flex min-w-0 items-center gap-2.5 text-left hover:underline"
                    >
                      <StickyNote className="h-4 w-4 shrink-0 text-gray-500" />
                      <span className="truncate text-sm text-gray-900">{deriveTitle(n)}</span>
                      <span className="shrink-0 text-xs text-gray-500">
                        · trashed {new Date(n.updatedAt).toLocaleDateString()}
                      </span>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => restore(n.id)}
                        className="flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Restore
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Permanently delete "${deriveTitle(n)}"?`)) remove(n.id);
                        }}
                        className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete forever
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </NotesLayout>
  );
}
