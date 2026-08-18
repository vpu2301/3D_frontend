import { useState, useRef, useEffect } from 'react';
import { Plus, Sparkles } from 'lucide-react';
import {
  useTodoStore,
  selectProjectsMap,
  selectListsMap,
} from '@/pages/todo/_hooks/use-todo-store';
import { parseQuickAdd } from '@/pages/todo/_lib/nlParse';
import { estimateTask } from '@/pages/docs/_lib/mockAi';
import type { ParsedTask, Task } from '@/pages/todo/_lib/types';
import { cn } from '@/lib/utils';

interface Props {
  /** Default project for new tasks captured here. */
  defaultProjectId?: string | null;
  defaultListId?: string | null;
  defaultDueAt?: number;
  placeholder?: string;
  autoFocus?: boolean;
}

const PRIORITY_DOT_COLOR = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-gray-400'];

export default function QuickAddBar({
  defaultProjectId,
  defaultListId,
  defaultDueAt,
  placeholder = 'Add a task — try "draft launch comms tomorrow 2pm !1 #comms +q2-launch ~30m"',
  autoFocus = true,
}: Props) {
  const projectsMap = useTodoStore(selectProjectsMap);
  const listsMap = useTodoStore(selectListsMap);
  const tasksMap = useTodoStore((s) => s.tasks);
  const createTask = useTodoStore((s) => s.createTask);
  const setSuggestedEstimate = useTodoStore((s) => s.setSuggestedEstimate);
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState('');
  const [preview, setPreview] = useState<ParsedTask | null>(null);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  useEffect(() => {
    if (!value.trim()) {
      setPreview(null);
      return;
    }
    setPreview(
      parseQuickAdd(value, {
        projects: Object.values(projectsMap),
        lists: Object.values(listsMap),
      }),
    );
  }, [value, projectsMap, listsMap]);

  const submit = async () => {
    if (!value.trim()) return;
    const parsed = parseQuickAdd(value, {
      projects: Object.values(projectsMap),
      lists: Object.values(listsMap),
    });
    if (!parsed.title) return;
    const task = await createTask({
      title: parsed.title,
      dueAt: parsed.dueAt ?? defaultDueAt,
      priority: (parsed.priority ?? 3),
      tags: parsed.tags,
      projectId: parsed.projectId ?? defaultProjectId ?? undefined,
      listId: parsed.listId ?? defaultListId ?? undefined,
      estimate: parsed.estimate,
    });
    setValue('');
    // Async — auto-estimate if user didn't provide one (fire-and-forget; mock failures silently swallowed)
    if (!parsed.estimate) {
      (async () => {
        try {
          const history = Object.values(tasksMap).map(taskToMeta);
          const r = await estimateTask(taskToMeta(task), history);
          if (r.confidence >= 0.4) {
            await setSuggestedEstimate(task.id, r.minutes);
          }
        } catch {
          /* mock failure */
        }
      })();
    }
  };

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 transition-colors focus-within:border-violet-400 focus-within:bg-white focus-within:ring-1 focus-within:ring-violet-400">
        <Plus className="h-4 w-4 text-gray-400" />
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              submit();
            } else if (e.key === 'Escape') {
              setValue('');
            }
          }}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
        {preview && preview.title && (
          <button
            type="button"
            onClick={submit}
            className="rounded-md bg-violet-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-violet-700"
          >
            Add
          </button>
        )}
      </div>
      {preview && preview.title && (
        <ParsePreview parsed={preview} />
      )}
    </div>
  );
}

function ParsePreview({ parsed }: { parsed: ParsedTask }) {
  const projectsMap = useTodoStore(selectProjectsMap);
  const listsMap = useTodoStore(selectListsMap);
  const project = parsed.projectId ? projectsMap[parsed.projectId] : null;
  const list = parsed.listId ? listsMap[parsed.listId] : null;
  const has = parsed.dueAt || parsed.priority || parsed.tags.length || project || list || parsed.estimate || parsed.assignee;
  if (!has) return null;
  return (
    <div className="mt-1.5 flex flex-wrap items-center gap-1 text-[11px] text-gray-500">
      <Sparkles className="h-3 w-3 text-violet-500" />
      <span className="font-medium">Parsed:</span>
      {parsed.dueAt && (
        <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-blue-700">
          due {new Date(parsed.dueAt).toLocaleString(undefined, { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
      {parsed.priority && (
        <span className="inline-flex items-center gap-0.5 rounded-full bg-gray-100 px-1.5 py-0.5">
          <span className={cn('h-1.5 w-1.5 rounded-full', PRIORITY_DOT_COLOR[parsed.priority])} />
          P{parsed.priority}
        </span>
      )}
      {project && (
        <span className="rounded-full bg-gray-100 px-1.5 py-0.5">
          +{project.name}
        </span>
      )}
      {list && (
        <span className="rounded-full bg-gray-100 px-1.5 py-0.5">
          {'>'}{list.name}
        </span>
      )}
      {parsed.tags.map((t) => (
        <span key={t} className="rounded-full bg-gray-100 px-1.5 py-0.5">
          #{t}
        </span>
      ))}
      {parsed.estimate !== undefined && (
        <span className="rounded-full bg-gray-100 px-1.5 py-0.5">
          ~{parsed.estimate >= 60 ? `${Math.round(parsed.estimate / 60)}h` : `${parsed.estimate}m`}
        </span>
      )}
      {parsed.assignee && (
        <span className="rounded-full bg-gray-100 px-1.5 py-0.5">
          @{parsed.assignee}
        </span>
      )}
    </div>
  );
}

function taskToMeta(t: Task) {
  return {
    id: t.id,
    title: t.title,
    completed: t.completed,
    dueAt: t.dueAt,
    scheduledAt: t.scheduledAt,
    priority: t.priority,
    estimate: t.estimate,
    projectId: t.projectId ?? null,
    listId: t.listId ?? null,
    tags: t.tags,
    parentId: t.parentId ?? null,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}
