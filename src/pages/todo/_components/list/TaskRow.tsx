import { useState } from 'react';
import {
  Circle,
  CheckCircle2,
  Calendar as CalendarIcon,
  Hash,
  Folder,
  Repeat,
  Paperclip,
  StickyNote,
  FileText,
  CalendarClock,
  HardDrive,
  Sparkles,
  Plus,
  X,
} from 'lucide-react';
import type { Task } from '@/pages/todo/_lib/types';
import { useTodoStore, selectProjectsMap, selectListsMap } from '@/pages/todo/_hooks/use-todo-store';
import { useTodoUiStore } from '@/pages/todo/_hooks/use-todo-ui-store';
import { describeRecurrence } from '@/pages/todo/_lib/recurrence';
import { cn } from '@/lib/utils';

interface Props {
  task: Task;
  /** Optional override for the displayed due date (used for expanded recurrences). */
  effectiveDueAt?: number;
  showProject?: boolean;
  showList?: boolean;
  /** Optional source-module info for "from: <source>" chip. */
  showSourceChip?: boolean;
  showSubtaskProgress?: boolean;
  className?: string;
}

const PRIORITY_COLOR: Record<number, string> = {
  1: 'text-red-500',
  2: 'text-orange-500',
  3: 'text-yellow-500',
  4: 'text-gray-400',
};

function formatDue(ts: number): string {
  const d = new Date(ts);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const sevenDaysOut = new Date(today);
  sevenDaysOut.setDate(sevenDaysOut.getDate() + 7);
  if (ts < today.getTime()) {
    const diff = Math.round((today.getTime() - ts) / 86_400_000);
    return diff === 0 ? 'overdue' : `${diff}d overdue`;
  }
  if (ts < tomorrow.getTime())
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (ts < sevenDaysOut.getTime())
    return d.toLocaleDateString(undefined, { weekday: 'short' });
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

const ATTACHMENT_ICON = {
  doc: FileText,
  note: StickyNote,
  drive: HardDrive,
  event: CalendarClock,
} as const;

const SOURCE_ICON = {
  notes: StickyNote,
  docs: FileText,
  calendar: CalendarClock,
} as const;

export default function TaskRow({
  task,
  effectiveDueAt,
  showProject,
  showList,
  showSourceChip = true,
  showSubtaskProgress = true,
  className,
}: Props) {
  const toggle = useTodoStore((s) => s.toggleComplete);
  const tasksMap = useTodoStore((s) => s.tasks);
  const projectsMap = useTodoStore(selectProjectsMap);
  const listsMap = useTodoStore(selectListsMap);
  const acceptEst = useTodoStore((s) => s.acceptSuggestedEstimate);
  const dismissEst = useTodoStore((s) => s.dismissSuggestedEstimate);
  const { selectedTaskId, setSelectedTaskId, setDetailOpen } = useTodoUiStore();
  const isSelected = selectedTaskId === task.id;

  const dueAt = effectiveDueAt ?? task.dueAt;
  const isOverdue = dueAt !== undefined && dueAt < Date.now() && !task.completed;
  const isToday = dueAt !== undefined && (() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return dueAt >= start.getTime() && dueAt < start.getTime() + 86_400_000;
  })();

  const subtasks = Object.values(tasksMap).filter((t) => t.parentId === task.id && !t.trashed);
  const subDone = subtasks.filter((t) => t.completed).length;

  const project = task.projectId ? projectsMap[task.projectId] : null;
  const list = task.listId ? listsMap[task.listId] : null;

  const open = () => {
    setSelectedTaskId(task.id);
    setDetailOpen(true);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e) => {
        if (e.key === 'Enter') open();
        else if (e.key === ' ') {
          e.preventDefault();
          toggle(task.id);
        }
      }}
      className={cn(
        'group flex cursor-pointer items-start gap-2.5 border-b border-gray-100 px-3 py-2 text-sm transition-colors',
        isSelected ? 'bg-violet-50/60' : 'hover:bg-gray-50',
        task.completed && 'opacity-60',
        className,
      )}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          toggle(task.id);
        }}
        className={cn(
          'mt-0.5 shrink-0 rounded-full transition-colors',
          task.completed ? 'text-emerald-500' : PRIORITY_COLOR[task.priority],
        )}
        aria-label={task.completed ? 'Mark uncompleted' : 'Complete task'}
      >
        {task.completed ? (
          <CheckCircle2 className="h-4 w-4" />
        ) : (
          <Circle className="h-4 w-4" strokeWidth={1.5} />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-start gap-2">
          <span
            className={cn(
              'flex-1 truncate text-gray-900',
              task.completed && 'line-through text-gray-500',
            )}
          >
            {task.title}
          </span>
        </div>

        {(task.tags.length > 0 ||
          dueAt ||
          (showProject && project) ||
          (showList && list) ||
          task.recurrence ||
          task.estimate ||
          task.attachments.length > 0 ||
          (showSubtaskProgress && subtasks.length > 0) ||
          (showSourceChip && task.sourceModule) ||
          task.suggestedEstimate) && (
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
            {dueAt && (
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5',
                  isOverdue ? 'bg-red-50 text-red-700' : isToday ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-600',
                )}
              >
                <CalendarIcon className="h-2.5 w-2.5" />
                {formatDue(dueAt)}
              </span>
            )}
            {task.recurrence && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-gray-600">
                <Repeat className="h-2.5 w-2.5" />
                {describeRecurrence(task.recurrence)}
              </span>
            )}
            {task.estimate && (
              <span className="rounded-full bg-gray-100 px-1.5 py-0.5">
                ~{task.estimate >= 60 ? `${Math.round((task.estimate / 60) * 10) / 10}h` : `${task.estimate}m`}
              </span>
            )}
            {showProject && project && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-gray-600">
                <Folder className="h-2.5 w-2.5" style={project.color ? { color: project.color } : undefined} />
                {project.emoji ? `${project.emoji} ` : ''}
                {project.name}
              </span>
            )}
            {showList && list && (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-gray-600">
                {list.emoji ? `${list.emoji} ` : ''}
                {list.name}
              </span>
            )}
            {task.tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="inline-flex items-center gap-0.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-gray-600"
              >
                <Hash className="h-2.5 w-2.5" />
                {t}
              </span>
            ))}
            {task.attachments.slice(0, 3).map((a, i) => {
              const Icon = ATTACHMENT_ICON[a.type];
              return (
                <span
                  key={`${a.type}-${a.targetId}-${i}`}
                  className="inline-flex items-center gap-0.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-gray-600"
                  title={a.label ?? a.targetId}
                >
                  <Icon className="h-2.5 w-2.5" />
                  <span className="max-w-[100px] truncate">{a.label ?? a.targetId}</span>
                </span>
              );
            })}
            {showSubtaskProgress && subtasks.length > 0 && (
              <span className="rounded-full bg-gray-100 px-1.5 py-0.5">
                {subDone}/{subtasks.length}
              </span>
            )}
            {showSourceChip && task.sourceModule && (
              <span className="inline-flex items-center gap-0.5 rounded-full border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-blue-700">
                {(() => {
                  const Icon = SOURCE_ICON[task.sourceModule];
                  return <Icon className="h-2.5 w-2.5" />;
                })()}
                from {task.sourceModule}
              </span>
            )}
            {task.suggestedEstimate !== undefined && (
              <span className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700">
                <Sparkles className="h-2.5 w-2.5" />
                Estimate ~{task.suggestedEstimate >= 60 ? `${Math.round(task.suggestedEstimate / 60)}h` : `${task.suggestedEstimate}m`}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    acceptEst(task.id);
                  }}
                  className="ml-0.5 hover:underline"
                >
                  <Plus className="h-2.5 w-2.5" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    dismissEst(task.id);
                  }}
                  className="text-blue-400 hover:text-blue-700"
                >
                  <X className="h-2.5 w-2.5" />
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
