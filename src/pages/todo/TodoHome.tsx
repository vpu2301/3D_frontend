import { useEffect, useMemo } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Sparkles, RefreshCw } from 'lucide-react';
import TodoLayout from '@/pages/todo/_components/shared/TodoLayout';
import TodoMiniRail from '@/pages/todo/_components/sidebar/TodoMiniRail';
import QuickAddBar from '@/pages/todo/_components/quick-add/QuickAddBar';
import TaskRow from '@/pages/todo/_components/list/TaskRow';
import TaskListCard from '@/pages/todo/_components/list/TaskListCard';
import TaskDetailPane from '@/pages/todo/_components/detail/TaskDetailPane';
import TriagePanel from '@/pages/todo/_components/ai/TriagePanel';
import TodoAskSidebar from '@/pages/todo/_components/ai/TodoAskSidebar';
import DailyPlanCard from '@/pages/todo/_components/today/DailyPlanCard';
import {
  useTodoStore,
  selectTasksMap,
  selectProjectsMap,
  selectListsMap,
  selectSmartListsMap,
  upcomingTasks,
} from '@/pages/todo/_hooks/use-todo-store';
import { useTodoUiStore } from '@/pages/todo/_hooks/use-todo-ui-store';
import { populateSmartList } from '@/pages/docs/_lib/mockAi';
import type { Task } from '@/pages/todo/_lib/types';

type ViewKind = 'kanban' | 'today' | 'upcoming' | 'starred' | 'completed' | 'list' | 'project' | 'tag' | 'smart';

export default function TodoHome() {
  const load = useTodoStore((s) => s.load);
  const tasksMap = useTodoStore(selectTasksMap);
  const projectsMap = useTodoStore(selectProjectsMap);
  const listsMap = useTodoStore(selectListsMap);
  const smartLists = useTodoStore(selectSmartListsMap);
  const setSmartListTasks = useTodoStore((s) => s.setSmartListTasks);
  const upsertSmartList = useTodoStore((s) => s.upsertSmartList);

  const params = useParams<{ id?: string; tag?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const {
    detailOpen,
    selectedTaskId,
    setDetailOpen,
    setSelectedTaskId,
    triageOpen,
    setTriageOpen,
    askOpen,
    setAskOpen,
  } = useTodoUiStore();

  useEffect(() => {
    load();
  }, [load]);

  const view: ViewKind = useMemo(() => {
    const p = location.pathname;
    if (p === '/todo' || p === '/todo/all') return 'kanban';
    if (p === '/todo/today') return 'today';
    if (p === '/todo/upcoming') return 'upcoming';
    if (p === '/todo/starred') return 'starred';
    if (p === '/todo/completed') return 'completed';
    if (p.startsWith('/todo/list/')) return 'list';
    if (p.startsWith('/todo/project/')) return 'project';
    if (p.startsWith('/todo/tag/')) return 'tag';
    if (p.startsWith('/todo/smart/')) return 'smart';
    return 'kanban';
  }, [location.pathname]);

  const tasks = Object.values(tasksMap);

  // Cmd+J — open AI surface (triage on Inbox/kanban, ask on others)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        if (view === 'kanban') setTriageOpen(true);
        else setAskOpen(!askOpen);
      } else if (e.key === 'Escape' && detailOpen) {
        setDetailOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view, askOpen, detailOpen, setTriageOpen, setAskOpen, setDetailOpen]);

  const recomputeSmart = async () => {
    const sl = params.id ? smartLists[params.id] : null;
    if (!sl) return;
    const ids = await populateSmartList(
      sl.definition,
      tasks.map(taskMeta),
    );
    await setSmartListTasks(sl.id, ids);
  };

  const onCreateSmart = async () => {
    const definition = window.prompt('Smart list definition — e.g., "tasks tagged urgent due this week"');
    if (!definition) return;
    const name = window.prompt('Name?', definition.slice(0, 40)) ?? definition.slice(0, 40);
    const ids = await populateSmartList(definition, tasks.map(taskMeta));
    const id = `smart_custom_${Date.now()}`;
    await upsertSmartList({
      id,
      name,
      definition,
      isAiCurated: true,
      taskIds: ids,
      lastComputedAt: Date.now(),
    });
    navigate(`/todo/smart/${id}`);
  };

  // Single-card view content (everything except kanban)
  const singleCardContent: Task[] | null = useMemo(() => {
    if (view === 'kanban') return null;
    if (view === 'today') {
      const start = new Date();
      start.setHours(0, 0, 0, 0);
      const end = start.getTime() + 86_400_000;
      return tasks
        .filter(
          (t) =>
            !t.trashed &&
            !t.parentId &&
            (!t.completed || (t.completedAt ?? 0) >= start.getTime()) &&
            ((t.dueAt && t.dueAt < end) ||
              (t.scheduledAt && t.scheduledAt < end && t.scheduledAt >= start.getTime())),
        )
        .sort((a, b) => (a.dueAt ?? 0) - (b.dueAt ?? 0));
    }
    if (view === 'upcoming') {
      const start = Date.now();
      const end = start + 14 * 86_400_000;
      return upcomingTasks(tasks, start, end).map((u) => u.task);
    }
    if (view === 'starred') {
      return tasks
        .filter((t) => !t.trashed && !t.completed && !t.parentId && t.priority <= 2)
        .sort((a, b) => a.priority - b.priority);
    }
    if (view === 'completed') {
      return tasks
        .filter((t) => !t.trashed && t.completed && !t.parentId)
        .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0));
    }
    if (view === 'list' && params.id) {
      return tasks
        .filter((t) => !t.trashed && !t.parentId && t.listId === params.id)
        .sort((a, b) => a.order - b.order);
    }
    if (view === 'project' && params.id) {
      return tasks
        .filter((t) => !t.trashed && !t.parentId && t.projectId === params.id)
        .sort((a, b) => a.order - b.order);
    }
    if (view === 'tag' && params.tag) {
      const tag = decodeURIComponent(params.tag);
      return tasks.filter((t) => !t.trashed && !t.completed && !t.parentId && t.tags.includes(tag));
    }
    if (view === 'smart' && params.id) {
      const sl = smartLists[params.id];
      const ids = new Set(sl?.taskIds ?? []);
      return tasks.filter((t) => !t.trashed && ids.has(t.id));
    }
    return [];
  }, [view, tasks, params, smartLists]);

  // Kanban cards (default /todo) — Inbox + each project + each loose list, plus a Today card if non-empty
  const kanbanCards = useMemo(() => {
    if (view !== 'kanban') return [];
    type Card = {
      key: string;
      title: string;
      href?: string;
      tasks: Task[];
      defaults?: { projectId?: string | null; listId?: string | null };
      emptyMessage?: string;
    };
    const cards: Card[] = [];

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = start.getTime() + 86_400_000;

    const inboxTasks = tasks
      .filter((t) => !t.trashed && !t.parentId && !t.projectId && !t.listId && !t.dueAt)
      .sort((a, b) => b.createdAt - a.createdAt);
    cards.push({
      key: 'inbox',
      title: 'Inbox',
      tasks: inboxTasks,
      emptyMessage: 'Capture a thought above. AI triage (⌘J) will sort the rest.',
    });

    const todayTasks = tasks.filter(
      (t) =>
        !t.trashed &&
        !t.parentId &&
        (!t.completed || (t.completedAt ?? 0) >= start.getTime()) &&
        ((t.dueAt && t.dueAt < end) ||
          (t.scheduledAt && t.scheduledAt < end && t.scheduledAt >= start.getTime())),
    );
    if (todayTasks.length > 0) {
      cards.push({
        key: 'today',
        title: 'Today',
        href: '/todo/today',
        tasks: todayTasks.sort((a, b) => (a.dueAt ?? 0) - (b.dueAt ?? 0)),
      });
    }

    for (const p of Object.values(projectsMap)
      .filter((x) => !x.archived)
      .sort((a, b) => a.name.localeCompare(b.name))) {
      const ts = tasks
        .filter((t) => t.projectId === p.id && !t.trashed && !t.parentId)
        .sort((a, b) => a.order - b.order);
      if (ts.length === 0) continue;
      cards.push({
        key: `project:${p.id}`,
        title: p.name,
        href: `/todo/project/${p.id}`,
        tasks: ts,
        defaults: { projectId: p.id },
      });
    }

    for (const l of Object.values(listsMap).filter((x) => !x.projectId && !x.archived)) {
      const ts = tasks
        .filter((t) => t.listId === l.id && !t.trashed && !t.parentId)
        .sort((a, b) => a.order - b.order);
      if (ts.length === 0) continue;
      cards.push({
        key: `list:${l.id}`,
        title: l.name,
        href: `/todo/list/${l.id}`,
        tasks: ts,
        defaults: { listId: l.id },
      });
    }

    return cards;
  }, [view, tasks, projectsMap, listsMap]);

  const singleCardTitle = useMemo(() => {
    if (view === 'today') return 'Today';
    if (view === 'upcoming') return 'Upcoming';
    if (view === 'starred') return 'Starred';
    if (view === 'completed') return 'Completed';
    if (view === 'list' && params.id) return listsMap[params.id]?.name ?? 'List';
    if (view === 'project' && params.id) return projectsMap[params.id]?.name ?? 'Project';
    if (view === 'tag' && params.tag) return `#${decodeURIComponent(params.tag)}`;
    if (view === 'smart' && params.id) {
      const sl = smartLists[params.id];
      return sl ? `${sl.emoji ? `${sl.emoji} ` : ''}${sl.name}` : 'Smart list';
    }
    return '';
  }, [view, params, listsMap, projectsMap, smartLists]);

  const todayIds = useMemo(() => {
    if (view !== 'today') return [];
    return (singleCardContent ?? []).filter((t) => !t.completed).map((t) => t.id);
  }, [view, singleCardContent]);

  return (
    <TodoLayout>
      <div className="flex flex-1 overflow-hidden">
        <TodoMiniRail />
        <main className="flex flex-1 flex-col overflow-hidden bg-white">
          <div className="flex items-center justify-between gap-3 border-b border-gray-100 px-6 pt-4 pb-3">
            <div>
              {view === 'kanban' ? (
                <>
                  <h1 className="text-2xl font-light text-gray-900">
                    My tasks{' '}
                    <span className="text-gray-400">
                      ({kanbanCards.reduce(
                        (n, c) => n + c.tasks.filter((t) => !t.completed).length,
                        0,
                      )})
                    </span>
                  </h1>
                  <p className="text-xs text-gray-500">
                    {kanbanCards.length} list{kanbanCards.length === 1 ? '' : 's'}
                  </p>
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-light text-gray-900">
                    {singleCardTitle}{' '}
                    <span className="text-gray-400">
                      ({(singleCardContent ?? []).length})
                    </span>
                  </h1>
                </>
              )}
            </div>
            <div className="flex items-center gap-1">
              {view === 'smart' && (
                <button
                  type="button"
                  onClick={recomputeSmart}
                  className="flex h-9 items-center gap-1 rounded-full border border-gray-200 bg-white px-3 text-xs text-gray-700 hover:bg-gray-50"
                >
                  <RefreshCw className="h-3.5 w-3.5" /> Recompute
                </button>
              )}
              {view === 'kanban' && (
                <button
                  type="button"
                  onClick={() => setTriageOpen(true)}
                  className="flex h-9 items-center gap-1 rounded-full bg-[#bdd8ec] px-3 text-xs font-medium text-gray-800 hover:bg-[#a5c8e0]"
                  title="Process Inbox with AI (⌘J)"
                >
                  <Sparkles className="h-3.5 w-3.5" /> AI triage
                </button>
              )}
              <button
                type="button"
                onClick={() => setAskOpen(!askOpen)}
                className="flex h-9 items-center gap-1 rounded-full bg-[#dde9f4] px-3 text-xs font-medium text-gray-800 hover:bg-[#bdd8ec]"
                title="Ask across tasks (⌘J)"
              >
                <Sparkles className="h-3.5 w-3.5" /> Ask AI
              </button>
              <button
                type="button"
                onClick={onCreateSmart}
                className="flex h-9 items-center gap-1 rounded-full border border-gray-200 bg-white px-3 text-xs text-gray-700 hover:bg-gray-50"
              >
                + Smart list
              </button>
            </div>
          </div>

          {view === 'today' && <DailyPlanCard todayTaskIds={todayIds} />}

          {view === 'kanban' ? (
            <div className="flex-1 overflow-x-auto overflow-y-auto">
              <div className="flex min-w-max gap-4 p-6">
                {kanbanCards.map((c) => (
                  <TaskListCard
                    key={c.key}
                    title={c.title}
                    href={c.href}
                    tasks={c.tasks}
                    defaults={c.defaults}
                    emptyMessage={c.emptyMessage}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6 py-6">
              <QuickAddBar
                defaultProjectId={view === 'project' ? params.id : undefined}
                defaultListId={view === 'list' ? params.id : undefined}
                defaultDueAt={
                  view === 'today'
                    ? (() => {
                        const d = new Date();
                        d.setHours(17, 0, 0, 0);
                        return d.getTime();
                      })()
                    : undefined
                }
              />
              <div className="mt-4 flex-1 overflow-y-auto rounded-lg border border-gray-200 bg-white">
                {(singleCardContent ?? []).length === 0 ? (
                  <div className="px-4 py-12 text-center text-sm text-gray-500">
                    No tasks here yet.
                  </div>
                ) : (
                  (singleCardContent ?? []).map((task) => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      effectiveDueAt={task.dueAt ?? task.scheduledAt}
                      showProject={view !== 'project' && view !== 'list'}
                      showList={view !== 'list'}
                    />
                  ))
                )}
              </div>
            </div>
          )}
        </main>

        {detailOpen && selectedTaskId && (
          <TaskDetailPane
            taskId={selectedTaskId}
            onClose={() => {
              setDetailOpen(false);
              setSelectedTaskId(null);
            }}
          />
        )}

        {askOpen && <TodoAskSidebar />}
      </div>

      {triageOpen && <TriagePanel />}
    </TodoLayout>
  );
}

function taskMeta(t: Task) {
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
