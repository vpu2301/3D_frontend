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
        'plat-list flex w-80 shrink-0 flex-col',
        className,
      )}
    >
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <div className="flex min-w-0 items-baseline gap-2">
          {href ? (
            <Link
              to={href}
              className="truncate text-[15.5px] font-semibold text-[var(--ink)] hover:underline"
            >
              {title}
            </Link>
          ) : (
            <h3 className="truncate text-[15.5px] text-[var(--ink)]">{title}</h3>
          )}
          <span className="shrink-0 text-[11px] text-[var(--text-5)]">{open.length}</span>
        </div>
        <button
          type="button"
          className="rounded-full p-1.5 text-[var(--text-5)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
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
            className="h-9 w-full rounded-[10px] border border-[var(--line)] bg-white px-3 text-sm text-[var(--ink)] transition-colors placeholder:text-[var(--text-5)] focus:border-[var(--ink)] focus:outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex w-full items-center gap-2 rounded-[10px] px-3 py-2 text-left text-sm font-medium text-[var(--text-4)] transition-colors hover:bg-[rgba(20,22,26,0.04)] hover:text-[var(--ink)]"
          >
            <Plus className="h-4 w-4" /> Add a task
          </button>
        )}
      </div>

      <div className="max-h-[60vh] flex-1 overflow-y-auto">
        {open.length === 0 && completed.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-8 text-center text-xs text-[var(--text-4)]">
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
                  className="flex w-full items-center gap-1 border-t border-[var(--line-soft)] px-4 py-2 text-left text-[11px] text-[var(--text-4)] transition-colors hover:bg-[rgba(20,22,26,0.02)] hover:text-[var(--ink)]"
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
