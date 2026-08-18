import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Inbox,
  Sun,
  CalendarDays,
  Star,
  CircleCheck,
  ListTodo,
  ChevronDown,
  ChevronRight,
  Plus,
  Folder,
  Trash2,
  Sparkles,
} from 'lucide-react';
import {
  useTodoStore,
  selectTasksMap,
  selectProjectsMap,
  selectListsMap,
} from '@/pages/todo/_hooks/use-todo-store';
import { cn } from '@/lib/utils';

type NavRowProps = {
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  iconStyle?: React.CSSProperties;
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
};

function NavRow({ icon: Icon, iconStyle, label, count, active, onClick }: NavRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-r-full py-2 pl-5 pr-4 text-left text-sm transition-colors',
        active ? 'bg-[#dde9f4] text-gray-900' : 'text-gray-700 hover:bg-gray-100',
      )}
    >
      <Icon className="h-4 w-4 shrink-0 text-gray-500" style={iconStyle} />
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && count > 0 && (
        <span className="shrink-0 text-[10px] font-medium leading-tight text-gray-400">
          {count}
        </span>
      )}
    </button>
  );
}

function SectionHeader({
  label,
  open,
  onToggle,
  onAdd,
  addTitle,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
  onAdd: () => void;
  addTitle: string;
}) {
  return (
    <div className="mt-4 mb-1 flex items-center gap-1 pl-5 pr-2">
      <button
        type="button"
        onClick={onToggle}
        className="flex flex-1 items-center gap-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400 transition-colors hover:text-gray-600"
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {label}
      </button>
      <button
        type="button"
        onClick={onAdd}
        title={addTitle}
        className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
      >
        <Plus className="h-3 w-3" />
      </button>
    </div>
  );
}

export default function TodoMiniRail() {
  const tasksMap = useTodoStore(selectTasksMap);
  const projectsMap = useTodoStore(selectProjectsMap);
  const listsMap = useTodoStore(selectListsMap);
  const createProject = useTodoStore((s) => s.createProject);
  const createList = useTodoStore((s) => s.createList);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  const [listsOpen, setListsOpen] = useState(true);
  const [projectsOpen, setProjectsOpen] = useState(true);

  const tasks = Object.values(tasksMap);
  const dayStart = (() => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); })();
  const dayEnd = dayStart + 86_400_000;

  const inboxCount = tasks.filter(
    (t) => !t.trashed && !t.completed && !t.parentId && !t.projectId && !t.listId && !t.dueAt,
  ).length;

  const todayCount = tasks.filter((t) => {
    if (t.trashed || t.completed || t.parentId) return false;
    return (
      (t.dueAt && t.dueAt >= dayStart && t.dueAt < dayEnd) ||
      (t.scheduledAt && t.scheduledAt >= dayStart && t.scheduledAt < dayEnd)
    );
  }).length;

  const starredCount = tasks.filter(
    (t) => !t.trashed && !t.completed && !t.parentId && t.priority <= 2,
  ).length;

  const projects = Object.values(projectsMap)
    .filter((p) => !p.archived)
    .sort((a, b) => a.name.localeCompare(b.name));

  const looseLists = Object.values(listsMap).filter((l) => !l.archived && !l.projectId);

  const onNewProject = async () => {
    const name = window.prompt('Project name');
    if (!name?.trim()) return;
    const p = await createProject(name.trim());
    navigate(`/todo/project/${p.id}`);
  };

  const onNewList = async () => {
    const name = window.prompt('List name');
    if (!name?.trim()) return;
    const l = await createList(name.trim(), undefined);
    navigate(`/todo/list/${l.id}`);
  };

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-gray-100 bg-white">
      <div className="px-3 pt-5 pb-3">
        <button
          type="button"
          onClick={() => document.dispatchEvent(new CustomEvent('todo:new-task'))}
          className="flex w-full items-center gap-2 rounded-full bg-[#bdd8ec] px-4 py-2.5 text-sm font-medium text-gray-800 transition-colors hover:bg-[#a5c8e0]"
        >
          <Plus className="h-4 w-4" /> New task
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto pb-4 pr-3">
        <NavRow
          icon={Inbox}
          label="My Tasks"
          count={inboxCount || undefined}
          active={path === '/todo' || path === '/todo/all'}
          onClick={() => navigate('/todo')}
        />
        <NavRow
          icon={Sun}
          label="Today"
          count={todayCount || undefined}
          active={path === '/todo/today'}
          onClick={() => navigate('/todo/today')}
        />
        <NavRow
          icon={CalendarDays}
          label="Upcoming"
          active={path === '/todo/upcoming'}
          onClick={() => navigate('/todo/upcoming')}
        />
        <NavRow
          icon={Star}
          label="Starred"
          count={starredCount || undefined}
          active={path === '/todo/starred'}
          onClick={() => navigate('/todo/starred')}
        />
        <NavRow
          icon={CircleCheck}
          label="Completed"
          active={path === '/todo/completed'}
          onClick={() => navigate('/todo/completed')}
        />

        <SectionHeader
          label="Lists"
          open={listsOpen}
          onToggle={() => setListsOpen(!listsOpen)}
          onAdd={onNewList}
          addTitle="New list"
        />
        {listsOpen &&
          looseLists.map((list) => (
            <NavRow
              key={list.id}
              icon={ListTodo}
              iconStyle={{ color: list.color ?? '#6b7280' }}
              label={list.emoji ? `${list.emoji} ${list.name}` : list.name}
              active={path === `/todo/list/${list.id}`}
              onClick={() => navigate(`/todo/list/${list.id}`)}
            />
          ))}

        <SectionHeader
          label="Projects"
          open={projectsOpen}
          onToggle={() => setProjectsOpen(!projectsOpen)}
          onAdd={onNewProject}
          addTitle="New project"
        />
        {projectsOpen &&
          projects.map((project) => (
            <NavRow
              key={project.id}
              icon={Folder}
              iconStyle={{ color: project.color ?? '#6b7280' }}
              label={project.emoji ? `${project.emoji} ${project.name}` : project.name}
              active={path === `/todo/project/${project.id}`}
              onClick={() => navigate(`/todo/project/${project.id}`)}
            />
          ))}

        <div className="mt-4">
          <NavRow
            icon={Trash2}
            label="Trash"
            active={path === '/todo/trash'}
            onClick={() => navigate('/todo/trash')}
          />
        </div>
      </nav>

      <div className="border-t border-gray-100 px-3 py-3">
        <button
          type="button"
          onClick={() => document.dispatchEvent(new CustomEvent('todo:ask-ai'))}
          className="flex w-full items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
        >
          <Sparkles className="h-4 w-4 text-violet-500" />
          Ask AI
        </button>
      </div>
    </aside>
  );
}
