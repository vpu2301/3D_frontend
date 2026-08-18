import { useEffect } from 'react';
import TodoLayout from '@/pages/todo/_components/shared/TodoLayout';
import TodoMiniRail from '@/pages/todo/_components/sidebar/TodoMiniRail';
import TodoTaskList from '@/pages/todo/_components/list/TodoTaskList';
import TaskDetailPane from '@/pages/todo/_components/detail/TaskDetailPane';
import TodoAskSidebar from '@/pages/todo/_components/ai/TodoAskSidebar';
import TriagePanel from '@/pages/todo/_components/ai/TriagePanel';
import { useTodoStore } from '@/pages/todo/_hooks/use-todo-store';
import { useTodoUiStore } from '@/pages/todo/_hooks/use-todo-ui-store';

export default function TodoHome() {
  const load = useTodoStore((s) => s.load);
  const {
    detailOpen, selectedTaskId, setDetailOpen, setSelectedTaskId,
    triageOpen, askOpen, setAskOpen,
  } = useTodoUiStore();

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setAskOpen(!askOpen);
      } else if (e.key === 'Escape') {
        if (detailOpen) { setDetailOpen(false); setSelectedTaskId(null); }
        else if (askOpen) setAskOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [askOpen, detailOpen, setAskOpen, setDetailOpen, setSelectedTaskId]);

  return (
    <TodoLayout>
      <div className="flex flex-1 overflow-hidden">
        <TodoMiniRail />
        <TodoTaskList />
        {detailOpen && selectedTaskId && (
          <TaskDetailPane
            taskId={selectedTaskId}
            onClose={() => { setDetailOpen(false); setSelectedTaskId(null); }}
          />
        )}
        {askOpen && <TodoAskSidebar />}
      </div>
      {triageOpen && <TriagePanel />}
    </TodoLayout>
  );
}
