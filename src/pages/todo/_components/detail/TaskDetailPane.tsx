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

const PRIORITY_COLOR = ['', 'bg-[var(--bad-fg)]', 'bg-[var(--warn-fg)]', 'bg-[var(--text-5)]', 'bg-[var(--text-5)]'];
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
    <aside className="flex h-full w-[420px] shrink-0 flex-col border-l border-[var(--line-soft)]">
      <div className="flex items-center justify-between border-b border-[var(--line-soft)] px-4 py-3">
        <div className="flex min-w-0 items-center gap-2 text-xs text-[var(--text-4)]">
          {task.sourceModule && (
            <button
              type="button"
              onClick={() => {
                if (task.sourceModule === 'notes') navigate(`/notes/${task.sourceId}`);
                else if (task.sourceModule === 'docs') navigate(`/docs/${task.sourceId}`);
                else if (task.sourceModule === 'calendar') navigate('/calendar');
              }}
              className="plat-pill plat-pill-mute !px-2 !py-0.5 !text-[10px] !font-medium transition-colors hover:!text-[var(--ink)]"
            >
              from {task.sourceModule} ↗
            </button>
          )}
          {task.completed && <span style={{ color: 'var(--ok-fg)' }}>Completed</span>}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded-[6px] p-1 text-[var(--text-4)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
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
            'w-full rounded-[10px] border border-transparent bg-transparent px-2 py-1 text-lg font-semibold text-[var(--ink)] transition-colors placeholder:text-[var(--text-5)] hover:border-[var(--line)] focus:border-[var(--ink)] focus:bg-white focus:outline-none',
            task.completed && 'text-[var(--text-5)] line-through',
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
                className="flex items-center gap-1.5 rounded-[10px] border border-[var(--line)] px-2 py-1 text-xs text-[var(--text-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
              >
                <span className={cn('h-1.5 w-1.5 rounded-full', PRIORITY_COLOR[task.priority])} />
                {PRIORITY_LABEL[task.priority]}
                <ChevronDown className="h-3 w-3" />
              </button>
              {priorityOpen && (
                <div
                  className="absolute right-0 top-full z-20 mt-1 w-32 rounded-[12px] border border-[var(--line-soft)] bg-white p-1 shadow-lg"
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
                        'flex w-full items-center gap-1.5 rounded-[8px] px-2 py-1 text-left text-xs transition-colors hover:bg-[rgba(20,22,26,0.05)]',
                        task.priority === p && 'bg-[rgba(20,22,26,0.06)] font-semibold',
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
                <span className="plat-pill plat-pill-mute !px-2 !py-0.5 !text-[11px] !font-medium">
                  {new Date(task.dueAt).toLocaleString(undefined, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              ) : (
                <span className="text-xs italic text-[var(--text-5)]">No due date</span>
              )}
              {task.dueAt && (
                <button
                  type="button"
                  onClick={() => updateTask(task.id, { dueAt: undefined })}
                  className="rounded-[6px] p-0.5 text-[var(--text-5)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
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
              className="h-7 w-full rounded-[10px] border border-[var(--line)] bg-white px-2 text-xs text-[var(--ink)] transition-colors placeholder:text-[var(--text-5)] focus:border-[var(--ink)] focus:outline-none"
            />
          </div>

          {/* Project */}
          <Row label="Project">
            <div className="relative">
              <button
                type="button"
                onClick={() => setProjectOpen((o) => !o)}
                className="flex items-center gap-1 rounded-[10px] border border-[var(--line)] px-2 py-1 text-xs text-[var(--text-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
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
                  className="absolute right-0 top-full z-20 mt-1 w-44 rounded-[12px] border border-[var(--line-soft)] bg-white p-1 shadow-lg"
                  onMouseLeave={() => setProjectOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setProject(task.id, null);
                      setList(task.id, null);
                      setProjectOpen(false);
                    }}
                    className="block w-full rounded-[8px] px-2 py-1 text-left text-xs transition-colors hover:bg-[rgba(20,22,26,0.05)]"
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
                          'flex w-full items-center gap-1.5 rounded-[8px] px-2 py-1 text-left text-xs transition-colors hover:bg-[rgba(20,22,26,0.05)]',
                          task.projectId === p.id && 'bg-[rgba(20,22,26,0.06)] font-semibold',
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
                className="rounded-[10px] border border-[var(--line)] bg-white px-2 py-1 text-xs text-[var(--ink)]"
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
                  className="plat-pill plat-pill-mute group !gap-0.5 !px-1.5 !py-0.5 !text-[10px] !font-medium"
                >
                  <Hash className="h-2.5 w-2.5" />
                  {t}
                  <button
                    type="button"
                    onClick={() => removeTag(task.id, t)}
                    className="ml-0.5 text-[var(--text-5)] opacity-0 transition-opacity group-hover:opacity-100"
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
                className="h-6 w-20 rounded-full border border-[var(--line)] bg-white px-2 text-[11px] text-[var(--ink)] transition-colors placeholder:text-[var(--text-5)] focus:border-[var(--ink)] focus:outline-none"
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
              className="h-7 w-24 rounded-[10px] border border-[var(--line)] bg-white px-2 text-xs text-[var(--ink)] transition-colors placeholder:text-[var(--text-5)] focus:border-[var(--ink)] focus:outline-none"
            />
          </Row>

          {/* Recurrence */}
          <Row label="Repeat">
            <div className="relative">
              <button
                type="button"
                onClick={() => setRecurOpen((o) => !o)}
                className="flex items-center gap-1 rounded-[10px] border border-[var(--line)] px-2 py-1 text-xs text-[var(--text-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
              >
                <Repeat className="h-3 w-3" />
                {task.recurrence ? describeRecurrence(task.recurrence) : 'No repeat'}
                <ChevronDown className="h-3 w-3" />
              </button>
              {recurOpen && (
                <div
                  className="absolute right-0 top-full z-20 mt-1 w-44 rounded-[12px] border border-[var(--line-soft)] bg-white p-1 shadow-lg"
                  onMouseLeave={() => setRecurOpen(false)}
                >
                  <button type="button" onClick={() => setRecur(undefined)} className="block w-full rounded-[8px] px-2 py-1 text-left text-xs transition-colors hover:bg-[rgba(20,22,26,0.05)]">No repeat</button>
                  <button type="button" onClick={() => setRecur({ freq: 'daily', interval: 1 })} className="block w-full rounded-[8px] px-2 py-1 text-left text-xs transition-colors hover:bg-[rgba(20,22,26,0.05)]">Daily</button>
                  <button type="button" onClick={() => setRecur({ freq: 'weekly', interval: 1, byday: ['mo','tu','we','th','fr'] })} className="block w-full rounded-[8px] px-2 py-1 text-left text-xs transition-colors hover:bg-[rgba(20,22,26,0.05)]">Every weekday</button>
                  <button type="button" onClick={() => setRecur({ freq: 'weekly', interval: 1 })} className="block w-full rounded-[8px] px-2 py-1 text-left text-xs transition-colors hover:bg-[rgba(20,22,26,0.05)]">Weekly</button>
                  <button type="button" onClick={() => setRecur({ freq: 'monthly', interval: 1 })} className="block w-full rounded-[8px] px-2 py-1 text-left text-xs transition-colors hover:bg-[rgba(20,22,26,0.05)]">Monthly</button>
                  <button type="button" onClick={() => setRecur({ freq: 'yearly', interval: 1 })} className="block w-full rounded-[8px] px-2 py-1 text-left text-xs transition-colors hover:bg-[rgba(20,22,26,0.05)]">Yearly</button>
                </div>
              )}
            </div>
          </Row>
        </div>

        {/* Subtasks */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <div className="plat-eyebrow">
              Subtasks ({subtasks.filter((t) => t.completed).length}/{subtasks.length})
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onBreakDown}
                disabled={breakingDown}
                className="plat-btn-ghost !h-7 !gap-1 !px-3 !text-[11px] disabled:opacity-50"
              >
                {breakingDown ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                Break down with AI
              </button>
              <button
                type="button"
                onClick={onAddSubtask}
                className="plat-btn-ghost !h-7 !gap-1 !px-3 !text-[11px]"
              >
                <Plus className="h-3 w-3" /> Subtask
              </button>
            </div>
          </div>
          {subtasks.length === 0 ? (
            <div className="rounded-[12px] border border-dashed border-[var(--line)] px-3 py-4 text-center text-xs italic text-[var(--text-5)]">
              No subtasks yet.
            </div>
          ) : (
            <div className="plat-list">
              {subtasks.map((s) => (
                <TaskRow key={s.id} task={s} showProject={false} showList={false} />
              ))}
            </div>
          )}
        </div>

        {/* Attachments */}
        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between">
            <div className="plat-eyebrow">
              Attachments ({task.attachments.length})
            </div>
            <div className="relative">
              <button
                type="button"
                onClick={() => setAttachOpen((o) => !o)}
                className="plat-btn-ghost !h-7 !gap-1 !px-3 !text-[11px]"
              >
                <Paperclip className="h-3 w-3" /> Attach
                <ChevronDown className="h-3 w-3" />
              </button>
              {attachOpen && (
                <div
                  className="absolute right-0 top-full z-20 mt-1 w-40 rounded-[12px] border border-[var(--line-soft)] bg-white p-1 shadow-lg"
                  onMouseLeave={() => setAttachOpen(false)}
                >
                  {(['doc', 'note', 'drive', 'event'] as AttachmentType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => onAttachLink(t)}
                      className="flex w-full items-center gap-1.5 rounded-[8px] px-2 py-1 text-left text-xs transition-colors hover:bg-[rgba(20,22,26,0.05)]"
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
            <div className="rounded-[12px] border border-dashed border-[var(--line)] px-3 py-3 text-center text-xs italic text-[var(--text-5)]">
              Link a Doc, Note, Drive file, or Calendar event.
            </div>
          ) : (
            <ul className="overflow-hidden rounded-[12px] border border-[var(--line-soft)]">
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
                    className="group flex items-center justify-between gap-2 border-b border-[var(--line-soft)] px-3 py-2 text-xs transition-colors last:border-b-0 hover:bg-[rgba(20,22,26,0.02)]"
                  >
                    <button
                      type="button"
                      onClick={() => navigate(route)}
                      className="flex min-w-0 items-center gap-1.5 text-[var(--text-2)] transition-colors hover:text-[var(--ink)]"
                    >
                      <Icon className="h-3 w-3" style={{ color: 'var(--text-4)' }} />
                      <span className="truncate">{a.label ?? a.targetId}</span>
                      <span className="plat-eyebrow !text-[9px]">
                        {a.type}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => removeAttachment(task.id, a.type, a.targetId)}
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <X className="h-3 w-3 text-[var(--text-5)] transition-colors hover:text-[var(--bad-fg)]" />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Activity */}
        <div className="mt-6">
          <div className="plat-eyebrow mb-2">Activity</div>
          <ul className="space-y-2">
            {task.activity.map((a) => (
              <li key={a.id} className="flex items-start gap-2 text-[11px]">
                <div className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--text-5)]" />
                <div>
                  <div className="capitalize text-[var(--text-2)]">{a.type}</div>
                  <div className="text-[10px] text-[var(--text-4)]">{new Date(a.at).toLocaleString()}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-[var(--line-soft)] px-4 py-2">
        <button
          type="button"
          onClick={() => {
            if (confirm('Move this task to trash?')) {
              trash(task.id);
              onClose();
            }
          }}
          className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs transition-colors hover:bg-[rgba(179,56,46,0.08)]"
          style={{ color: 'var(--bad-fg)' }}
        >
          <Trash2 className="h-3.5 w-3.5" /> Trash
        </button>
        <div className="text-[10px] text-[var(--text-5)]">
          Created {new Date(task.createdAt).toLocaleDateString()}
        </div>
      </div>
    </aside>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <div className="plat-eyebrow w-[80px] shrink-0">{label}</div>
      <div className="flex flex-1 items-center justify-between">{children}</div>
    </div>
  );
}
