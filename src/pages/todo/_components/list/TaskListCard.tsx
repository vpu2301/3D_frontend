import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MoreHorizontal, ChevronRight, ChevronDown } from 'lucide-react';
import type { Task } from '@/pages/todo/_lib/types';
import {
  useTodoStore,
  selectProjectsMap,
  selectListsMap,
} from '@/pages/todo/_hooks/use-todo-store';
import { parseQuickAdd } from '@/pages/todo/_lib/nlParse';
import TaskRow from './TaskRow';
import { cn } from '@/lib/utils';

interface Props {
  /** Card title shown in the header. */
  title: string;
  /** Optional link target for the card title. */
  href?: string;
  tasks: Task[];
  /** Defaults applied to tasks created via this card's add bar. */
  defaults?: { projectId?: string | null; listId?: string | null };
  /** Optional empty-state message. */
  emptyMessage?: string;
  className?: string;
}

export default function TaskListCard({
  title,
  href,
  tasks,
  defaults,
  emptyMessage,
  className,
}: Props) {
  const projectsMap = useTodoStore(selectProjectsMap);
  const listsMap = useTodoStore(selectListsMap);
  const createTask = useTodoStore((s) => s.createTask);
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);

  const open = tasks.filter((t) => !t.completed);
  const completed = tasks.filter((t) => t.completed);

  const submit = async () => {
    if (!value.trim()) {
      setAdding(false);
      return;
    }
    const parsed = parseQuickAdd(value, {
      projects: Object.values(projectsMap),
      lists: Object.values(listsMap),
    });
    if (!parsed.title) return;
    await createTask({
      title: parsed.title,
      dueAt: parsed.dueAt,
      priority: parsed.priority ?? 3,
      tags: parsed.tags,
      projectId: parsed.projectId ?? defaults?.projectId ?? undefined,
      listId: parsed.listId ?? defaults?.listId ?? undefined,
      estimate: parsed.estimate,
    });
    setValue('');
  };

  return (
    <div
      className={cn(
        'flex w-80 shrink-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md',
        className,
      )}
    >
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex min-w-0 items-baseline gap-2">
          {href ? (
            <Link
              to={href}
              className="truncate text-base font-medium text-gray-900 hover:underline"
            >
              {title}
            </Link>
          ) : (
            <h3 className="truncate text-base font-medium text-gray-900">{title}</h3>
          )}
          <span className="shrink-0 text-[11px] text-gray-400">{open.length}</span>
        </div>
        <button
          type="button"
          className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
          aria-label="More"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      {/* Add task inline */}
      <div className="px-3 pb-2">
        {adding ? (
          <input
            autoFocus
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => {
              if (!value.trim()) setAdding(false);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') submit();
              else if (e.key === 'Escape') {
                setAdding(false);
                setValue('');
              }
            }}
            placeholder='Add a task — try "tomorrow 3pm !1 #work"'
            className="h-9 w-full rounded-full border border-[#8fc4e4] bg-white px-4 text-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-[#8fc4e4]"
          />
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex w-full items-center gap-2 rounded-full px-4 py-2 text-left text-sm font-medium text-[#1a73e8] transition-colors hover:bg-[#dde9f4]"
          >
            <Plus className="h-4 w-4" /> Add a task
          </button>
        )}
      </div>

      <div className="max-h-[60vh] flex-1 overflow-y-auto">
        {open.length === 0 && completed.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-8 text-center text-xs text-gray-500">
            <p>{emptyMessage ?? 'No tasks yet.'}</p>
          </div>
        ) : (
          <>
            {open.map((task) => (
              <TaskRow key={task.id} task={task} showProject={false} showList={false} />
            ))}
            {completed.length > 0 && (
              <>
                <button
                  type="button"
                  onClick={() => setShowCompleted((s) => !s)}
                  className="flex w-full items-center gap-1 border-t border-gray-50 px-5 py-2 text-left text-[11px] text-gray-500 transition-colors hover:bg-gray-50"
                >
                  {showCompleted ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                  Completed ({completed.length})
                </button>
                {showCompleted &&
                  completed.map((task) => (
                    <TaskRow key={task.id} task={task} showProject={false} showList={false} />
                  ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
