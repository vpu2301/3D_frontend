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
          <div className="border-b border-[var(--line-soft)] px-6 pt-5 pb-4">
            <Link
              to="/todo"
              className="inline-flex items-center gap-1 text-xs text-[var(--text-4)] transition-colors hover:text-[var(--ink)]"
            >
              <ArrowLeft className="h-3 w-3" /> Back to Todo
            </Link>
            <p className="plat-crumb mt-2">3days.todo</p>
            <h1 className="mt-1.5 text-[22px]">Trash</h1>
            <p className="mt-0.5 text-xs text-[var(--text-5)]">
              Soft-deleted tasks. Restore or delete forever.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {trashed.length === 0 ? (
              <div className="plat-list py-16 text-center">
                <Trash2 className="mx-auto mb-3 h-7 w-7" style={{ color: 'var(--text-5)' }} />
                <p className="text-sm text-[var(--text-4)]">Trash is empty.</p>
              </div>
            ) : (
              <div className="plat-list">
                {trashed.map((t) => (
                  <div
                    key={t.id}
                    className="flex items-center justify-between gap-4 border-b border-[var(--line-soft)] px-4 py-3 transition-colors last:border-b-0 hover:bg-[rgba(20,22,26,0.02)]"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-[var(--ink)]">{t.title}</div>
                      <div className="text-[11px] text-[var(--text-4)]">
                        Trashed {new Date(t.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => restore(t.id)}
                        className="plat-btn-ghost !h-7 !px-3 !text-xs"
                      >
                        <RotateCcw className="h-3.5 w-3.5" /> Restore
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Permanently delete "${t.title}"?`)) remove(t.id);
                        }}
                        className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors hover:bg-[rgba(179,56,46,0.08)]"
                        style={{ color: 'var(--bad-fg)' }}
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
