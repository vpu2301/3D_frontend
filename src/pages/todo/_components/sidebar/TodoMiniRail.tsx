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
        'flex w-full items-center gap-3 rounded-[10px] px-3 py-2 text-left text-[13.5px] transition-colors',
        active
          ? 'bg-[rgba(20,22,26,0.07)] font-semibold text-[var(--ink)]'
          : 'font-medium text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]',
      )}
    >
      <Icon
        className="h-4 w-4 shrink-0"
        style={{ color: active ? 'var(--ink)' : 'var(--text-4)', ...iconStyle }}
      />
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && count > 0 && (
        <span
          className="shrink-0 text-[10px] font-medium leading-tight"
          style={{ color: 'var(--text-5)' }}
        >
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
    <div className="mt-4 mb-1 flex items-center gap-1 pl-3 pr-2">
      <button
        type="button"
        onClick={onToggle}
        className="plat-eyebrow flex flex-1 items-center gap-1 transition-colors hover:text-[var(--text-3)]"
      >
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {label}
      </button>
      <button
        type="button"
        onClick={onAdd}
        title={addTitle}
        className="rounded-[6px] p-1 transition-colors hover:bg-[rgba(20,22,26,0.05)]"
        style={{ color: 'var(--text-5)' }}
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
    <aside className="flex h-full w-60 shrink-0 flex-col border-r border-[var(--line-soft)]">
      <div className="px-3 pt-5 pb-3">
        <button
          type="button"
          onClick={() => document.dispatchEvent(new CustomEvent('todo:new-task'))}
          className="plat-btn !h-9 w-full justify-center"
        >
          <Plus className="h-4 w-4" /> New task
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
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

      <div className="border-t border-[var(--line-soft)] px-3 py-3">
        <button
          type="button"
          onClick={() => document.dispatchEvent(new CustomEvent('todo:ask-ai'))}
          className="plat-btn-ghost w-full justify-center"
        >
          <Sparkles className="h-4 w-4" style={{ color: 'var(--text-4)' }} />
          Ask AI
        </button>
      </div>
    </aside>
  );
}
