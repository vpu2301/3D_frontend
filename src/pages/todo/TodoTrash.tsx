import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react';
import TodoLayout from '@/pages/todo/_components/shared/TodoLayout';
import TodoMiniRail from '@/pages/todo/_components/sidebar/TodoMiniRail';
import { useTodoStore, selectTasksMap } from '@/pages/todo/_hooks/use-todo-store';

export default function TodoTrash() {
  const load = useTodoStore((s) => s.load);
  const tasksMap = useTodoStore(selectTasksMap);
  const restore = useTodoStore((s) => s.restoreTask);
  const remove = useTodoStore((s) => s.permanentlyDelete);

  useEffect(() => {
    load();
  }, [load]);

  const trashed = useMemo(
    () =>
      Object.values(tasksMap)
        .filter((t) => t.trashed)
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [tasksMap],
  );

  return (
    <TodoLayout>
      <div className="flex flex-1 overflow-hidden">
        <TodoMiniRail />
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <Link to="/todo" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:underline">
              <ArrowLeft className="h-3 w-3" /> Back to Todo
            </Link>
            <h1 className="mt-1 text-2xl font-light text-gray-900">Trash</h1>
            <p className="text-xs text-gray-500">Soft-deleted tasks. Restore or delete forever.</p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {trashed.length === 0 ? (
              <div className="rounded-md border border-gray-200 bg-white py-16 text-center">
                <Trash2 className="mx-auto mb-3 h-7 w-7 text-gray-300" />
                <p className="text-sm text-gray-500">Trash is empty.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
                {trashed.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 last:border-0"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-gray-900">{t.title}</div>
                      <div className="text-[11px] text-gray-500">
                        Trashed {new Date(t.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => restore(t.id)}
                        className="flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-50"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Restore
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Permanently delete "${t.title}"?`)) remove(t.id);
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
    </TodoLayout>
  );
}
