import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Inbox,
  Sun,
  Calendar as CalendarIcon,
  ListTodo,
  CheckCircle2,
  Crosshair,
  Plus,
  Sparkles,
  ChevronDown,
  ChevronRight,
  Folder,
  FolderPlus,
  ListPlus,
  Trash2,
} from 'lucide-react';
import {
  useTodoStore,
  selectTasksMap,
  selectProjectsMap,
  selectListsMap,
  selectSmartListsMap,
} from '@/pages/todo/_hooks/use-todo-store';
import { cn } from '@/lib/utils';

interface NavRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  count?: number;
  badgeColor?: 'red' | 'gray';
  active?: boolean;
  onClick: () => void;
}

function NavRow({ icon: Icon, label, count, badgeColor, active, onClick }: NavRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-r-full py-2 pl-5 pr-4 text-left text-sm transition-colors',
        active ? 'bg-[#dde9f4] text-gray-900' : 'text-gray-700 hover:bg-gray-100',
      )}
    >
      <Icon className="h-4 w-4 shrink-0 text-gray-500" />
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className={cn(
            'shrink-0 rounded-full px-1.5 text-[10px] font-medium leading-tight',
            badgeColor === 'red' ? 'bg-red-500 text-white' : 'text-gray-500',
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}

export default function TodoMiniRail() {
  const tasksMap = useTodoStore(selectTasksMap);
  const projectsMap = useTodoStore(selectProjectsMap);
  const listsMap = useTodoStore(selectListsMap);
  const smartLists = useTodoStore(selectSmartListsMap);
  const createProject = useTodoStore((s) => s.createProject);
  const createList = useTodoStore((s) => s.createList);
  const createTask = useTodoStore((s) => s.createTask);
  const navigate = useNavigate();
  const location = useLocation();

  const [listsOpen, setListsOpen] = useState(true);
  const [smartOpen, setSmartOpen] = useState(true);

  const tasks = Object.values(tasksMap);
  const inboxCount = tasks.filter(
    (t) => !t.trashed && !t.completed && !t.parentId && !t.projectId && !t.listId && !t.dueAt,
  ).length;
  const todayCount = tasks.filter((t) => {
    if (t.trashed || t.completed || t.parentId || !t.dueAt) return false;
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return t.dueAt < start.getTime() + 86_400_000;
  }).length;
  const starredCount = tasks.filter(
    (t) => !t.trashed && !t.completed && !t.parentId && t.priority <= 2,
  ).length;
  const trashedCount = tasks.filter((t) => t.trashed).length;

  const path = location.pathname;
  const onPath = (...arr: string[]) => arr.includes(path);

  const onCreate = async () => {
    await createTask({});
    navigate('/todo');
  };

  const onNewProject = async () => {
    const name = window.prompt('Project name?');
    if (!name) return;
    const p = await createProject(name.trim());
    navigate(`/todo/project/${p.id}`);
  };

  const onNewList = async () => {
    const name = window.prompt('List name?');
    if (!name) return;
    const l = await createList(name.trim());
    navigate(`/todo/list/${l.id}`);
  };

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col bg-white">
      <div className="px-4 pt-3 pb-4">
        <button
          type="button"
          onClick={onCreate}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-[#bdd8ec] px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-[#a5c8e0]"
        >
          <Plus className="h-4 w-4" /> Create
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-3">
        <div className="space-y-0.5">
          <NavRow
            icon={Inbox}
            label="All tasks"
            count={inboxCount}
            active={onPath('/todo')}
            onClick={() => navigate('/todo')}
          />
          <NavRow
            icon={Sun}
            label="Today"
            count={todayCount}
            active={onPath('/todo/today')}
            onClick={() => navigate('/todo/today')}
          />
          <NavRow
            icon={CalendarIcon}
            label="Upcoming"
            active={onPath('/todo/upcoming')}
            onClick={() => navigate('/todo/upcoming')}
          />
          <NavRow
            icon={ListTodo}
            label="Starred"
            count={starredCount}
            active={onPath('/todo/starred')}
            onClick={() => navigate('/todo/starred')}
          />
          <NavRow
            icon={Crosshair}
            label="Focus"
            active={onPath('/todo/focus')}
            onClick={() => navigate('/todo/focus')}
          />
          <NavRow
            icon={CheckCircle2}
            label="Completed"
            active={onPath('/todo/completed')}
            onClick={() => navigate('/todo/completed')}
          />
        </div>

        {Object.keys(smartLists).length > 0 && (
          <>
            <div className="mb-1.5 mt-6 flex items-center justify-between px-5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              <button
                type="button"
                onClick={() => setSmartOpen((o) => !o)}
                className="flex items-center gap-1"
              >
                {smartOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
                Smart
              </button>
            </div>
            {smartOpen && (
              <div className="space-y-0.5">
                {Object.values(smartLists).map((sl) => (
                  <NavRow
                    key={sl.id}
                    icon={Sparkles}
                    label={sl.name}
                    count={sl.taskIds.length}
                    active={path === `/todo/smart/${sl.id}`}
                    onClick={() => navigate(`/todo/smart/${sl.id}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <div className="mb-1.5 mt-6 flex items-center justify-between px-5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          <button
            type="button"
            onClick={() => setListsOpen((o) => !o)}
            className="flex items-center gap-1"
          >
            {listsOpen ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            Lists
          </button>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={onNewList}
              title="New list"
              className="rounded p-0.5 hover:bg-gray-200"
            >
              <ListPlus className="h-3 w-3" />
            </button>
            <button
              type="button"
              onClick={onNewProject}
              title="New project"
              className="rounded p-0.5 hover:bg-gray-200"
            >
              <FolderPlus className="h-3 w-3" />
            </button>
          </div>
        </div>
        {listsOpen && (
          <div className="space-y-0.5">
            {Object.values(projectsMap)
              .filter((p) => !p.archived)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((p) => {
                const count = tasks.filter(
                  (t) => t.projectId === p.id && !t.completed && !t.trashed && !t.parentId,
                ).length;
                return (
                  <NavRow
                    key={p.id}
                    icon={Folder}
                    label={p.name}
                    count={count}
                    active={path === `/todo/project/${p.id}`}
                    onClick={() => navigate(`/todo/project/${p.id}`)}
                  />
                );
              })}
            {Object.values(listsMap)
              .filter((l) => !l.projectId && !l.archived)
              .map((l) => {
                const count = tasks.filter(
                  (t) => t.listId === l.id && !t.completed && !t.trashed && !t.parentId,
                ).length;
                return (
                  <NavRow
                    key={l.id}
                    icon={ListTodo}
                    label={l.name}
                    count={count}
                    active={path === `/todo/list/${l.id}`}
                    onClick={() => navigate(`/todo/list/${l.id}`)}
                  />
                );
              })}
          </div>
        )}

        <div className="mb-1.5 mt-6 px-5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Fix &amp; manage
        </div>
        <div className="space-y-0.5">
          <NavRow
            icon={Trash2}
            label="Trash"
            count={trashedCount}
            active={onPath('/todo/trash')}
            onClick={() => navigate('/todo/trash')}
          />
        </div>
      </div>
    </aside>
  );
}
