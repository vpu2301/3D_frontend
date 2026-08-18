import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Calendar as CalendarIcon,
  Folder,
  Hash,
  Sparkles,
  Plus,
  Trash2,
  Repeat,
  Paperclip,
  StickyNote,
  FileText,
  CalendarClock,
  HardDrive,
  ChevronDown,
  Loader2,
} from 'lucide-react';
import {
  useTodoStore,
  selectProjectsMap,
  selectListsMap,
  selectTasksMap,
} from '@/pages/todo/_hooks/use-todo-store';
import { useTodoUiStore } from '@/pages/todo/_hooks/use-todo-ui-store';
import { parseDate } from '@/pages/todo/_lib/nlParse';
import { describeRecurrence } from '@/pages/todo/_lib/recurrence';
import { breakDownTask } from '@/pages/docs/_lib/mockAi';
import type { Priority, Task, RecurrenceRule, Attachment, AttachmentType } from '@/pages/todo/_lib/types';
import TaskRow from '@/pages/todo/_components/list/TaskRow';
import { cn } from '@/lib/utils';

const PRIORITY_COLOR = ['', 'bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-gray-400'];
const PRIORITY_LABEL = ['', 'P1', 'P2', 'P3', 'P4'];

const ATTACHMENT_ICON = {
  doc: FileText,
  note: StickyNote,
  drive: HardDrive,
  event: CalendarClock,
} as const;

export default function TaskDetailPane({ taskId, onClose }: { taskId: string; onClose: () => void }) {
  const tasksMap = useTodoStore(selectTasksMap);
  const projectsMap = useTodoStore(selectProjectsMap);
  const listsMap = useTodoStore(selectListsMap);
  const updateTask = useTodoStore((s) => s.updateTask);
  const setPriority = useTodoStore((s) => s.setPriority);
  const setProject = useTodoStore((s) => s.setProject);
  const setList = useTodoStore((s) => s.setList);
  const addTag = useTodoStore((s) => s.addTag);
  const removeTag = useTodoStore((s) => s.removeTag);
  const setRecurrence = useTodoStore((s) => s.setRecurrence);
  const trash = useTodoStore((s) => s.trashTask);
  const createTask = useTodoStore((s) => s.createTask);
  const addAttachment = useTodoStore((s) => s.addAttachment);
  const removeAttachment = useTodoStore((s) => s.removeAttachment);
  const navigate = useNavigate();

  const task = tasksMap[taskId];
  const [title, setTitle] = useState(task?.title ?? '');
  const [dueInput, setDueInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [breakingDown, setBreakingDown] = useState(false);
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [recurOpen, setRecurOpen] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);

  useEffect(() => {
    if (task) setTitle(task.title);
  }, [task?.id, task?.title]);

  if (!task) return null;

  const subtasks = Object.values(tasksMap)
    .filter((t) => t.parentId === task.id && !t.trashed)
    .sort((a, b) => a.order - b.order);

  const project = task.projectId ? projectsMap[task.projectId] : null;
  const list = task.listId ? listsMap[task.listId] : null;

  const onTitleBlur = () => {
    if (title.trim() && title !== task.title) updateTask(task.id, { title: title.trim() });
  };

  const onParseDue = () => {
    if (!dueInput.trim()) return;
    const d = parseDate(dueInput);
    if (d) {
      updateTask(task.id, { dueAt: d.getTime() });
      setDueInput('');
    } else {
      alert('Could not parse — try "tomorrow at 3pm" or an ISO datetime');
    }
  };

  const onAddSubtask = async () => {
    const name = window.prompt('Subtask title?');
    if (!name) return;
    await createTask({
      title: name.trim(),
      parentId: task.id,
      priority: task.priority,
      projectId: task.projectId,
      listId: task.listId,
      order: (subtasks[subtasks.length - 1]?.order ?? 0) + 1,
    });
  };

  const onBreakDown = async () => {
    setBreakingDown(true);
    try {
      const subs = await breakDownTask({
        id: task.id,
        title: task.title,
        completed: task.completed,
        priority: task.priority,
        tags: task.tags,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      });
      let order = (subtasks[subtasks.length - 1]?.order ?? 0) + 1;
      for (const sub of subs) {
        await createTask({
          title: sub.title,
          parentId: task.id,
          priority: task.priority,
          projectId: task.projectId,
          listId: task.listId,
          estimate: sub.estimate,
          order: order++,
        });
      }
    } catch {
      alert('Mock AI failed — try again.');
    } finally {
      setBreakingDown(false);
    }
  };

  const setRecur = (rule: RecurrenceRule | undefined) => {
    setRecurrence(task.id, rule);
    setRecurOpen(false);
  };

  const onAttachLink = (type: AttachmentType) => {
    const targetId = window.prompt(`${type} id to attach?`);
    if (!targetId) return;
    const label = window.prompt(`${type} label (optional)?`) ?? targetId;
    addAttachment(task.id, { type, targetId, label });
    setAttachOpen(false);
  };

  return (
    <aside className="flex h-full w-[420px] shrink-0 flex-col border-l border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
        <div className="flex min-w-0 items-center gap-2 text-xs text-gray-500">
          {task.sourceModule && (
            <button
              type="button"
              onClick={() => {
                if (task.sourceModule === 'notes') navigate(`/notes/${task.sourceId}`);
                else if (task.sourceModule === 'docs') navigate(`/docs/${task.sourceId}`);
                else if (task.sourceModule === 'calendar') navigate('/calendar');
              }}
              className="inline-flex items-center gap-1 rounded-full border border-blue-200 bg-blue-50 px-2 py-0.5 font-medium text-blue-700 hover:bg-blue-100"
            >
              from {task.sourceModule} ↗
            </button>
          )}
          {task.completed && <span className="text-emerald-600">Completed</span>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 text-gray-500 hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={onTitleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          }}
          className={cn(
            'w-full rounded-md border border-transparent bg-transparent text-lg font-semibold text-gray-900 placeholder:text-gray-400 hover:border-gray-200 focus:border-violet-400 focus:bg-white focus:outline-none',
            task.completed && 'line-through text-gray-500',
          )}
          placeholder="Task title"
        />

        <div className="mt-3 space-y-2 text-sm">
          {/* Priority */}
          <Row label="Priority">
            <div className="relative">
              <button
                type="button"
                onClick={() => setPriorityOpen((o) => !o)}
                className="flex items-center gap-1.5 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', PRIORITY_COLOR[task.priority])} />
                {PRIORITY_LABEL[task.priority]}
                <ChevronDown className="h-3 w-3" />
              </button>
              {priorityOpen && (
                <div
                  className="absolute right-0 top-full z-20 mt-1 w-32 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
                  onMouseLeave={() => setPriorityOpen(false)}
                >
                  {[1, 2, 3, 4].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => {
                        setPriority(task.id, p as Priority);
                        setPriorityOpen(false);
                      }}
                      className={cn(
                        'flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-xs hover:bg-gray-100',
                        task.priority === p && 'bg-gray-100 font-medium',
                      )}
                    >
                      <span className={cn('h-1.5 w-1.5 rounded-full', PRIORITY_COLOR[p])} />
                      P{p}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Row>

          {/* Due date */}
          <Row label="Due">
            <div className="flex items-center gap-1">
              {task.dueAt ? (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">
                  {new Date(task.dueAt).toLocaleString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              ) : (
                <span className="text-xs italic text-gray-400">No due date</span>
              )}
              {task.dueAt && (
                <button
                  type="button"
                  onClick={() => updateTask(task.id, { dueAt: undefined })}
                  className="rounded p-0.5 text-gray-400 hover:bg-gray-100"
                  aria-label="Clear due"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          </Row>
          <div className="ml-[80px]">
            <input
              value={dueInput}
              onChange={(e) => setDueInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') onParseDue();
              }}
              placeholder='"tomorrow at 3pm" or ISO'
              className="h-7 w-full rounded-md border border-gray-200 bg-white px-2 text-xs focus:border-violet-400 focus:outline-none"
            />
          </div>

          {/* Project */}
          <Row label="Project">
            <div className="relative">
              <button
                type="button"
                onClick={() => setProjectOpen((o) => !o)}
                className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
              >
                <Folder
                  className="h-3 w-3"
                  style={project?.color ? { color: project.color } : undefined}
                />
                {project ? (
                  <>
                    {project.emoji ? `${project.emoji} ` : ''}
                    {project.name}
                  </>
                ) : (
                  'No project'
                )}
                <ChevronDown className="h-3 w-3" />
              </button>
              {projectOpen && (
                <div
                  className="absolute right-0 top-full z-20 mt-1 w-44 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
                  onMouseLeave={() => setProjectOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setProject(task.id, null);
                      setList(task.id, null);
                      setProjectOpen(false);
                    }}
                    className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-gray-100"
                  >
                    No project
                  </button>
                  {Object.values(projectsMap)
                    .filter((p) => !p.archived)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setProject(task.id, p.id);
                          setProjectOpen(false);
                        }}
                        className={cn(
                          'flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-xs hover:bg-gray-100',
                          task.projectId === p.id && 'bg-gray-100 font-medium',
                        )}
                      >
                        <span className="h-2 w-2 rounded-full" style={{ backgroundColor: p.color ?? '#6b7280' }} />
                        {p.emoji ? `${p.emoji} ` : ''}
                        {p.name}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </Row>

          {/* List */}
          {project && (
            <Row label="List">
              <select
                value={task.listId ?? ''}
                onChange={(e) => setList(task.id, e.target.value || null)}
                className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs"
              >
                <option value="">No list</option>
                {Object.values(listsMap)
                  .filter((l) => l.projectId === project.id)
                  .map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.emoji ? `${l.emoji} ` : ''}
                      {l.name}
                    </option>
                  ))}
              </select>
            </Row>
          )}

          {/* Tags */}
          <Row label="Tags">
            <div className="flex flex-wrap items-center gap-1">
              {task.tags.map((t) => (
                <span
                  key={t}
                  className="group inline-flex items-center gap-0.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-[11px] text-gray-700"
                >
                  <Hash className="h-2.5 w-2.5" />
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTag(task.id, t)}
                    className="ml-0.5 text-gray-400 opacity-0 hover:text-red-500 group-hover:opacity-100"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && tagInput.trim()) {
                    addTag(task.id, tagInput.trim());
                    setTagInput('');
                  }
                }}
                placeholder="add tag…"
                className="h-6 w-20 rounded-full border border-gray-200 bg-white px-2 text-[11px] focus:border-violet-400 focus:outline-none"
              />
            </div>
          </Row>

          {/* Estimate */}
          <Row label="Estimate">
            <input
              type="number"
              min={0}
              value={task.estimate ?? ''}
              onChange={(e) => updateTask(task.id, { estimate: e.target.value ? Number(e.target.value) : undefined })}
              placeholder="minutes"
              className="h-7 w-24 rounded-md border border-gray-200 bg-white px-2 text-xs focus:border-violet-400 focus:outline-none"
            />
          </Row>

          {/* Recurrence */}
          <Row label="Repeat">
            <div className="relative">
              <button
                type="button"
                onClick={() => setRecurOpen((o) => !o)}
                className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-xs hover:bg-gray-50"
              >
                <Repeat className="h-3 w-3" />
                {task.recurrence ? describeRecurrence(task.recurrence) : 'No repeat'}
                <ChevronDown className="h-3 w-3" />
              </button>
              {recurOpen && (
                <div
                  className="absolute right-0 top-full z-20 mt-1 w-44 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
                  onMouseLeave={() => setRecurOpen(false)}
                >
                  <button type="button" onClick={() => setRecur(undefined)} className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-gray-100">No repeat</button>
                  <button type="button" onClick={() => setRecur({ freq: 'daily', interval: 1 })} className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-gray-100">Daily</button>
                  <button type="button" onClick={() => setRecur({ freq: 'weekly', interval: 1, byday: ['mo','tu','we','th','fr'] })} className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-gray-100">Every weekday</button>
                  <button type="button" onClick={() => setRecur({ freq: 'weekly', interval: 1 })} className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-gray-100">Weekly</button>
                  <button type="button" onClick={() => setRecur({ freq: 'monthly', interval: 1 })} className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-gray-100">Monthly</button>
                  <button type="button" onClick={() => setRecur({ freq: 'yearly', interval: 1 })} className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-gray-100">Yearly</button>
                </div>
              )}
            </div>
          </Row>
        </div>

        {/* Subtasks */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Subtasks ({subtasks.filter((t) => t.completed).length}/{subtasks.length})
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onBreakDown}
                disabled={breakingDown}
                className="flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
              >
                {breakingDown ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                Break down with AI
              </button>
              <button
                type="button"
                onClick={onAddSubtask}
                className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-[11px] text-gray-700 hover:bg-gray-50"
              >
                <Plus className="h-3 w-3" /> Subtask
              </button>
            </div>
          </div>
          {subtasks.length === 0 ? (
            <div className="rounded-md border border-dashed border-gray-200 px-3 py-4 text-center text-xs italic text-gray-400">
              No subtasks yet.
            </div>
          ) : (
            <div className="overflow-hidden rounded-md border border-gray-200 bg-white">
              {subtasks.map((s) => (
                <TaskRow key={s.id} task={s} showProject={false} showList={false} />
              ))}
            </div>
          )}
        </div>

        {/* Attachments */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <div className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Attachments ({task.attachments.length})
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setAttachOpen((o) => !o)}
                className="flex items-center gap-1 rounded-md border border-gray-200 px-2 py-1 text-[11px] text-gray-700 hover:bg-gray-50"
              >
                <Paperclip className="h-3 w-3" /> Attach
                <ChevronDown className="h-3 w-3" />
              </button>
              {attachOpen && (
                <div
                  className="absolute right-0 top-full z-20 mt-1 w-40 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
                  onMouseLeave={() => setAttachOpen(false)}
                >
                  {(['doc', 'note', 'drive', 'event'] as AttachmentType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onAttachLink(t)}
                      className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-xs hover:bg-gray-100"
                    >
                      {(() => {
                        const Icon = ATTACHMENT_ICON[t];
                        return <Icon className="h-3 w-3" />;
                      })()}
                      {t === 'doc' ? 'Doc' : t === 'note' ? 'Note' : t === 'drive' ? 'Drive file' : 'Event'}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          {task.attachments.length === 0 ? (
            <div className="rounded-md border border-dashed border-gray-200 px-3 py-3 text-center text-xs italic text-gray-400">
              Link a Doc, Note, Drive file, or Calendar event.
            </div>
          ) : (
            <ul className="space-y-1">
              {task.attachments.map((a, i) => {
                const Icon = ATTACHMENT_ICON[a.type];
                const route =
                  a.type === 'doc'
                    ? `/docs/${a.targetId}`
                    : a.type === 'note'
                      ? `/notes/${a.targetId}`
                      : a.type === 'drive'
                        ? `/drive/file/${a.targetId}`
                        : '/calendar';
                return (
                  <li
                    key={`${a.type}-${a.targetId}-${i}`}
                    className="group flex items-center justify-between gap-2 rounded-md border border-gray-100 px-2 py-1.5 text-xs hover:bg-gray-50"
                  >
                    <button
                      type="button"
                      onClick={() => navigate(route)}
                      className="flex min-w-0 items-center gap-1.5 hover:text-blue-700"
                    >
                      <Icon className="h-3 w-3 text-gray-500" />
                      <span className="truncate">{a.label ?? a.targetId}</span>
                      <span className="text-[10px] uppercase tracking-wider text-gray-400">
                        {a.type}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAttachment(task.id, a.type, a.targetId)}
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-3 w-3 text-gray-400 hover:text-red-500" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Activity */}
        <div className="mt-6">
          <div className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Activity</div>
          <ul className="space-y-2">
            {task.activity.map((a) => (
              <li key={a.id} className="flex items-start gap-2 text-[11px]">
                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <div>
                  <div className="capitalize text-gray-700">{a.type}</div>
                  <div className="text-[10px] text-gray-500">{new Date(a.at).toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-gray-200 px-4 py-2">
        <button
          type="button"
          onClick={() => {
            if (confirm('Move this task to trash?')) {
              trash(task.id);
              onClose();
            }
          }}
          className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-3.5 w-3.5" /> Trash
        </button>
        <div className="text-[10px] text-gray-400">
          Created {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </div>
    </aside>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-[80px] shrink-0 text-xs uppercase tracking-wider text-gray-500">{label}</div>
      <div className="flex flex-1 items-center justify-between">{children}</div>
    </div>
  );
}
