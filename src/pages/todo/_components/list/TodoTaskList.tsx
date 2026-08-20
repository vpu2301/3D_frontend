import { useState, useMemo, useRef, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import {
  Plus,
  Sparkles,
  Star,
  Calendar,
  Circle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Tag,
} from 'lucide-react';
import {
  useTodoStore,
  selectTasksMap,
  selectProjectsMap,
  selectListsMap,
} from '@/pages/todo/_hooks/use-todo-store';
import { useTodoUiStore } from '@/pages/todo/_hooks/use-todo-ui-store';
import { cn } from '@/lib/utils';
import type { Task } from '@/pages/todo/_lib/types';

const DAY = 86_400_000;

function getDayStart() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function formatDue(ts: number): { label: string; overdue: boolean } {
  const dayStart = getDayStart();
  const diff = Math.floor((ts - dayStart) / DAY);
  if (diff < 0) return { label: 'Overdue', overdue: true };
  if (diff === 0) return { label: 'Today', overdue: false };
  if (diff === 1) return { label: 'Tomorrow', overdue: false };
  if (diff < 7) {
    const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return { label: names[new Date(ts).getDay()], overdue: false };
  }
  const d = new Date(ts);
  return {
    label: `${d.toLocaleString('default', { month: 'short' })} ${d.getDate()}`,
    overdue: false,
  };
}

const PRIORITY_DOT: Record<number, string> = {
  1: 'bg-[var(--bad-fg)]',
  2: 'bg-[var(--warn-fg)]',
  3: '',
  4: '',
};

// ─── Task Row ───────────────────────────────────────────────────────────────

interface TaskRowProps {
  task: Task;
  listName?: string;
  projectName?: string;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onStar: (id: string) => void;
  selected: boolean;
}

function TaskRow({ task, listName, projectName, onToggle, onSelect, onStar, selected }: TaskRowProps) {
  const label = listName ?? projectName;
  const due = task.dueAt ? formatDue(task.dueAt) : null;
  const dot = PRIORITY_DOT[task.priority];

  return (
    <div
      onClick={() => onSelect(task.id)}
      className={cn(
        'group flex cursor-pointer items-start gap-3 border-b border-[var(--line-soft)] px-4 py-2.5 transition-colors last:border-b-0',
        selected ? 'bg-[rgba(20,22,26,0.06)]' : 'hover:bg-[rgba(20,22,26,0.02)]',
        task.completed && 'opacity-55',
      )}
    >
      {/* Checkbox */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onToggle(task.id); }}
        className="mt-0.5 shrink-0"
        title={task.completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {task.completed ? (
          <CheckCircle2 className="h-[18px] w-[18px] text-[var(--ink)]" />
        ) : (
          <Circle className="h-[18px] w-[18px] text-[var(--text-5)] transition-colors hover:text-[var(--ink)]" />
        )}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          {dot && <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', dot)} />}
          <span
            className={cn(
              'truncate text-sm text-[var(--ink)]',
              task.completed && 'text-[var(--text-5)] line-through',
            )}
          >
            {task.title}
          </span>
        </div>

        {(due || label) && (
          <div className="mt-0.5 flex items-center gap-2">
            {due && (
              <span
                className={cn('text-xs', due.overdue && 'font-semibold')}
                style={{ color: due.overdue ? 'var(--bad-fg)' : 'var(--text-4)' }}
              >
                {due.label}
              </span>
            )}
            {label && (
              <span className="plat-pill plat-pill-mute !px-1.5 !py-0.5 !text-[10px] !font-medium">
                {label}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Star */}
      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onStar(task.id); }}
        className={cn(
          'mt-0.5 shrink-0 transition-opacity',
          task.priority <= 2 ? 'opacity-100' : 'opacity-0 group-hover:opacity-100',
        )}
        title={task.priority <= 2 ? 'Unstar' : 'Star'}
      >
        <Star
          className={cn(
            'h-4 w-4',
            task.priority <= 2
              ? 'fill-amber-400 text-amber-400'
              : 'text-[var(--text-5)] hover:text-amber-400',
          )}
        />
      </button>
    </div>
  );
}

// ─── Inline Add Form ─────────────────────────────────────────────────────────

interface AddFormProps {
  onAdd: (title: string) => void;
  onCancel: () => void;
}

function AddForm({ onAdd, onCancel }: AddFormProps) {
  const [title, setTitle] = useState('');
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => { ref.current?.focus(); }, []);

  const submit = () => { if (title.trim()) onAdd(title.trim()); };

  return (
    <div className="mx-4 mb-3 rounded-[12px] border border-[var(--line)] bg-white p-3 shadow-sm">
      <input
        ref={ref}
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit();
          if (e.key === 'Escape') onCancel();
        }}
        className="w-full bg-transparent text-sm outline-none placeholder:text-[var(--text-5)]"
      />
      <div className="mt-2.5 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)]"
          >
            <Calendar className="h-3 w-3" /> Date
          </button>
          <button
            type="button"
            className="flex items-center gap-1 rounded-full px-2 py-1 text-xs text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)]"
          >
            <Tag className="h-3 w-3" /> List
          </button>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full px-3 py-1 text-xs text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={!title.trim()}
            className="plat-btn !h-7 !px-4 !text-xs"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Section ─────────────────────────────────────────────────────────────────

interface SectionProps {
  title: string;
  tasks: Task[];
  listsMap: Record<string, { name: string }>;
  projectsMap: Record<string, { name: string }>;
  onToggle: (id: string) => void;
  onSelect: (id: string) => void;
  onStar: (id: string) => void;
  selectedId: string | null;
  defaultOpen?: boolean;
}

function Section({
  title, tasks, listsMap, projectsMap,
  onToggle, onSelect, onStar, selectedId, defaultOpen = true,
}: SectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  if (tasks.length === 0) return null;

  return (
    <div className="mb-5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="plat-eyebrow mb-2 flex items-center gap-2 px-6 py-1 transition-colors hover:text-[var(--text-3)]"
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {title}
        <span>{tasks.length}</span>
      </button>

      {open && (
      <div className="plat-list mx-4">
      {tasks.map((task) => (
          <TaskRow
            key={task.id}
            task={task}
            listName={task.listId ? listsMap[task.listId]?.name : undefined}
            projectName={task.projectId ? projectsMap[task.projectId]?.name : undefined}
            onToggle={onToggle}
            onSelect={onSelect}
            onStar={onStar}
            selected={selectedId === task.id}
          />
        ))}
      </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

type ViewKind =
  | 'inbox' | 'today' | 'upcoming' | 'starred'
  | 'completed' | 'list' | 'project' | 'tag';

export default function TodoTaskList() {
  const location = useLocation();
  const params = useParams<{ id?: string; tag?: string }>();

  const tasksMap = useTodoStore(selectTasksMap);
  const projectsMap = useTodoStore(selectProjectsMap);
  const listsMap = useTodoStore(selectListsMap);
  const createTask = useTodoStore((s) => s.createTask);
  const toggleComplete = useTodoStore((s) => s.toggleComplete);
  const setPriority = useTodoStore((s) => s.setPriority);

  const { setSelectedTaskId, setDetailOpen, selectedTaskId, setTriageOpen, askOpen, setAskOpen } =
    useTodoUiStore();

  const [addOpen, setAddOpen] = useState(false);

  const path = location.pathname;
  const tasks = Object.values(tasksMap);

  // Listen for sidebar "New task" button
  useEffect(() => {
    const h = () => setAddOpen(true);
    document.addEventListener('todo:new-task', h);
    return () => document.removeEventListener('todo:new-task', h);
  }, []);

  // Listen for sidebar "Ask AI" button
  useEffect(() => {
    const h = () => setAskOpen(true);
    document.addEventListener('todo:ask-ai', h);
    return () => document.removeEventListener('todo:ask-ai', h);
  }, [setAskOpen]);

  const view: ViewKind = useMemo(() => {
    if (path === '/todo' || path === '/todo/all') return 'inbox';
    if (path === '/todo/today') return 'today';
    if (path === '/todo/upcoming') return 'upcoming';
    if (path === '/todo/starred') return 'starred';
    if (path === '/todo/completed') return 'completed';
    if (path.startsWith('/todo/list/')) return 'list';
    if (path.startsWith('/todo/project/')) return 'project';
    if (path.startsWith('/todo/tag/')) return 'tag';
    return 'inbox';
  }, [path]);

  const viewTitle = useMemo(() => {
    if (view === 'inbox') return 'My Tasks';
    if (view === 'today') return 'Today';
    if (view === 'upcoming') return 'Upcoming';
    if (view === 'starred') return 'Starred';
    if (view === 'completed') return 'Completed';
    if (view === 'list' && params.id) return listsMap[params.id]?.name ?? 'List';
    if (view === 'project' && params.id) {
      const p = projectsMap[params.id];
      return p ? `${p.emoji ? p.emoji + ' ' : ''}${p.name}` : 'Project';
    }
    if (view === 'tag' && params.tag) return `#${decodeURIComponent(params.tag)}`;
    return 'Tasks';
  }, [view, params, listsMap, projectsMap]);

  type SectionData = { title: string; tasks: Task[]; collapsed?: boolean };

  const sections: SectionData[] = useMemo(() => {
    const dayStart = getDayStart();
    const dayEnd = dayStart + DAY;

    const active = (t: Task) => !t.trashed && !t.completed && !t.parentId;

    if (view === 'inbox') {
      const inbox = tasks.filter((t) => active(t) && !t.projectId && !t.listId && !t.dueAt);
      const overdue = tasks.filter((t) => active(t) && t.dueAt && t.dueAt < dayStart);
      const dueToday = tasks.filter(
        (t) => active(t) && t.dueAt && t.dueAt >= dayStart && t.dueAt < dayEnd,
      );
      const scheduled = tasks.filter((t) => active(t) && t.dueAt && t.dueAt >= dayEnd);

      return [
        { title: 'My Tasks', tasks: inbox.sort((a, b) => b.createdAt - a.createdAt) },
        { title: 'Overdue', tasks: overdue.sort((a, b) => (a.dueAt ?? 0) - (b.dueAt ?? 0)) },
        { title: 'Due today', tasks: dueToday.sort((a, b) => (a.dueAt ?? 0) - (b.dueAt ?? 0)) },
        { title: 'Scheduled', tasks: scheduled.sort((a, b) => (a.dueAt ?? 0) - (b.dueAt ?? 0)) },
      ].filter((s) => s.tasks.length > 0);
    }

    if (view === 'today') {
      const today = tasks
        .filter((t) => {
          if (!active(t)) return false;
          return (
            (t.dueAt && t.dueAt >= dayStart && t.dueAt < dayEnd) ||
            (t.scheduledAt && t.scheduledAt >= dayStart && t.scheduledAt < dayEnd)
          );
        })
        .sort((a, b) => (a.dueAt ?? a.scheduledAt ?? 0) - (b.dueAt ?? b.scheduledAt ?? 0));
      const overdue = tasks
        .filter((t) => active(t) && t.dueAt && t.dueAt < dayStart)
        .sort((a, b) => (a.dueAt ?? 0) - (b.dueAt ?? 0));
      return [
        { title: 'Overdue', tasks: overdue },
        { title: 'Today', tasks: today },
      ].filter((s) => s.tasks.length > 0);
    }

    if (view === 'upcoming') {
      const weekEnd = dayEnd + 6 * DAY;
      const twoWeeksEnd = dayEnd + 13 * DAY;
      const future = tasks.filter((t) => active(t) && t.dueAt && t.dueAt >= dayEnd);
      return [
        {
          title: 'Tomorrow',
          tasks: future.filter((t) => t.dueAt! < dayEnd + DAY).sort((a, b) => a.dueAt! - b.dueAt!),
        },
        {
          title: 'This week',
          tasks: future
            .filter((t) => t.dueAt! >= dayEnd + DAY && t.dueAt! < weekEnd)
            .sort((a, b) => a.dueAt! - b.dueAt!),
        },
        {
          title: 'Next week',
          tasks: future
            .filter((t) => t.dueAt! >= weekEnd && t.dueAt! < twoWeeksEnd)
            .sort((a, b) => a.dueAt! - b.dueAt!),
        },
        {
          title: 'Later',
          tasks: future.filter((t) => t.dueAt! >= twoWeeksEnd).sort((a, b) => a.dueAt! - b.dueAt!),
        },
      ].filter((s) => s.tasks.length > 0);
    }

    if (view === 'starred') {
      const starred = tasks.filter((t) => active(t) && t.priority <= 2);
      return [
        {
          title: 'Urgent',
          tasks: starred.filter((t) => t.priority === 1).sort((a, b) => a.order - b.order),
        },
        {
          title: 'High priority',
          tasks: starred.filter((t) => t.priority === 2).sort((a, b) => a.order - b.order),
        },
      ].filter((s) => s.tasks.length > 0);
    }

    if (view === 'completed') {
      const done = tasks
        .filter((t) => !t.trashed && t.completed && !t.parentId)
        .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
      return [{ title: 'Completed', tasks: done }];
    }

    if (view === 'list' && params.id) {
      const active2 = tasks.filter((t) => !t.trashed && !t.completed && !t.parentId && t.listId === params.id);
      const done = tasks.filter((t) => !t.trashed && t.completed && !t.parentId && t.listId === params.id);
      return [
        { title: viewTitle, tasks: active2.sort((a, b) => a.order - b.order) },
        { title: 'Completed', tasks: done.sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0)), collapsed: true },
      ].filter((s) => s.tasks.length > 0);
    }

    if (view === 'project' && params.id) {
      const active2 = tasks.filter((t) => !t.trashed && !t.completed && !t.parentId && t.projectId === params.id);
      const done = tasks.filter((t) => !t.trashed && t.completed && !t.parentId && t.projectId === params.id);
      return [
        { title: 'Tasks', tasks: active2.sort((a, b) => a.order - b.order) },
        { title: 'Completed', tasks: done.sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0)), collapsed: true },
      ].filter((s) => s.tasks.length > 0);
    }

    if (view === 'tag' && params.tag) {
      const tag = decodeURIComponent(params.tag);
      const tagged = tasks.filter((t) => !t.trashed && !t.completed && !t.parentId && t.tags.includes(tag));
      return [{ title: `#${tag}`, tasks: tagged }];
    }

    return [];
  }, [view, tasks, params, viewTitle]);

  const activeCount = useMemo(
    () =>
      sections
        .filter((s) => s.title !== 'Completed')
        .reduce((n, s) => n + s.tasks.length, 0),
    [sections],
  );

  const onToggle = (id: string) => toggleComplete(id);

  const onSelect = (id: string) => {
    setSelectedTaskId(id);
    setDetailOpen(true);
  };

  const onStar = (id: string) => {
    const t = tasksMap[id];
    if (!t) return;
    setPriority(id, t.priority <= 2 ? 3 : 1);
  };

  const onAdd = async (title: string) => {
    const dayStart = getDayStart();
    await createTask({
      title,
      listId: view === 'list' ? params.id : undefined,
      projectId: view === 'project' ? params.id : undefined,
      dueAt:
        view === 'today'
          ? (() => { const d = new Date(); d.setHours(17, 0, 0, 0); return d.getTime(); })()
          : undefined,
      scheduledAt: view === 'today' ? dayStart : undefined,
    });
    setAddOpen(false);
  };

  const showAddTrigger = view !== 'completed';

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--line-soft)] px-6 pt-5 pb-4">
        <div>
          <p className="plat-crumb">3days.todo</p>
          <h1 className="mt-1.5 text-[22px]">{viewTitle}</h1>
          {activeCount > 0 && (
            <p className="mt-0.5 text-xs" style={{ color: 'var(--text-5)' }}>
              {activeCount} task{activeCount !== 1 ? 's' : ''}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          {view !== 'completed' && (
            <button
              type="button"
              onClick={() => setTriageOpen(true)}
              className="plat-btn !h-8 !px-4 !text-xs"
            >
              <Sparkles className="h-3.5 w-3.5" /> AI triage
            </button>
          )}
          <button
            type="button"
            onClick={() => setAskOpen(!askOpen)}
            className="plat-btn-ghost !h-8 !px-4"
          >
            <Sparkles className="h-3.5 w-3.5" style={{ color: 'var(--text-4)' }} /> Ask AI
          </button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto py-3">
        {/* Add task trigger */}
        {showAddTrigger && !addOpen && (
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="group mx-4 mb-3 flex items-center gap-3 rounded-[10px] px-3 py-2 text-sm text-[var(--text-4)] transition-colors hover:bg-[rgba(20,22,26,0.04)] hover:text-[var(--ink)]"
          >
            <Plus className="h-4 w-4 transition-colors group-hover:text-[var(--ink)]" />
            Add a task
          </button>
        )}

        {/* Inline add form */}
        {addOpen && <AddForm onAdd={onAdd} onCancel={() => setAddOpen(false)} />}

        {/* Task sections */}
        {sections.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="plat-item-icon mb-3 !h-14 !w-14">
              <CheckCircle2 className="h-7 w-7" style={{ color: 'var(--text-4)' }} />
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>
              All clear
            </p>
            <p className="mt-1 text-xs" style={{ color: 'var(--text-5)' }}>
              {view === 'today' ? 'Nothing due today' : 'No tasks here yet'}
            </p>
          </div>
        ) : (
          sections.map((section) => (
            <Section
              key={section.title}
              title={section.title}
              tasks={section.tasks}
              listsMap={listsMap}
              projectsMap={projectsMap}
              onToggle={onToggle}
              onSelect={onSelect}
              onStar={onStar}
              selectedId={selectedTaskId}
              defaultOpen={!section.collapsed}
            />
          ))
        )}
      </div>
    </div>
  );
}
