import { create } from 'zustand';
import type {
  Task,
  Project,
  List,
  SmartList,
  Priority,
  RecurrenceRule,
  Reminder,
  Attachment,
  ActivityEntry,
  TaskId,
} from '@/pages/todo/_lib/types';
import { todoStorage, newId } from '@/pages/todo/_lib/storage';
import { buildTodoSeed } from '@/pages/todo/_lib/seed';
import { nextOccurrence, expandRecurrence } from '@/pages/todo/_lib/recurrence';

const SEED_FLAG = 'seed:v1';

interface TodoState {
  tasks: Record<string, Task>;
  projects: Record<string, Project>;
  lists: Record<string, List>;
  smartLists: Record<string, SmartList>;
  loaded: boolean;

  load: () => Promise<void>;

  // ---- Tasks ----
  createTask: (init?: Partial<Task>) => Promise<Task>;
  updateTask: (id: string, patch: Partial<Task>) => Promise<void>;
  toggleComplete: (id: string) => Promise<void>;
  trashTask: (id: string) => Promise<void>;
  restoreTask: (id: string) => Promise<void>;
  permanentlyDelete: (id: string) => Promise<void>;
  setPriority: (id: string, priority: Priority) => Promise<void>;
  setDueAt: (id: string, dueAt: number | undefined) => Promise<void>;
  setProject: (id: string, projectId: string | null) => Promise<void>;
  setList: (id: string, listId: string | null) => Promise<void>;
  addTag: (id: string, tag: string) => Promise<void>;
  removeTag: (id: string, tag: string) => Promise<void>;
  setEstimate: (id: string, estimate: number | undefined) => Promise<void>;
  acceptSuggestedEstimate: (id: string) => Promise<void>;
  dismissSuggestedEstimate: (id: string) => Promise<void>;
  setSuggestedEstimate: (id: string, minutes: number) => Promise<void>;

  setRecurrence: (id: string, rule: RecurrenceRule | undefined) => Promise<void>;
  reorderWithin: (parentSelector: { listId?: string; projectId?: string; parentId?: string }, orderedIds: string[]) => Promise<void>;

  addReminder: (taskId: string, remindAt: number) => Promise<Reminder>;
  dismissReminder: (taskId: string, reminderId: string) => Promise<void>;

  addAttachment: (taskId: string, att: Attachment) => Promise<void>;
  removeAttachment: (taskId: string, type: Attachment['type'], targetId: string) => Promise<void>;

  appendActivity: (id: string, entry: Omit<ActivityEntry, 'id' | 'at'>) => Promise<void>;

  // ---- Projects + Lists ----
  createProject: (name: string, init?: Partial<Project>) => Promise<Project>;
  updateProject: (id: string, patch: Partial<Project>) => Promise<void>;
  archiveProject: (id: string) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  createList: (name: string, projectId?: string, init?: Partial<List>) => Promise<List>;
  updateList: (id: string, patch: Partial<List>) => Promise<void>;
  deleteList: (id: string) => Promise<void>;

  // ---- Smart Lists ----
  upsertSmartList: (sl: SmartList) => Promise<void>;
  setSmartListTasks: (id: string, taskIds: string[]) => Promise<void>;
  deleteSmartList: (id: string) => Promise<void>;

  clearAll: () => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  tasks: {},
  projects: {},
  lists: {},
  smartLists: {},
  loaded: false,

  load: async () => {
    if (get().loaded) return;
    const flag = await todoStorage.getMeta<string>(SEED_FLAG);
    if (!flag) {
      const seed = buildTodoSeed();
      await Promise.all([
        ...seed.tasks.map((t) => todoStorage.putTask(t)),
        ...seed.projects.map((p) => todoStorage.putProject(p)),
        ...seed.lists.map((l) => todoStorage.putList(l)),
        ...seed.smartLists.map((s) => todoStorage.putSmartList(s)),
      ]);
      await todoStorage.setMeta(SEED_FLAG, '1');
    }
    const [taskList, projectList, listList, smartList] = await Promise.all([
      todoStorage.listTasks(),
      todoStorage.listProjects(),
      todoStorage.listLists(),
      todoStorage.listSmartLists(),
    ]);
    const tasks: Record<string, Task> = {};
    for (const t of taskList) tasks[t.id] = t;
    const projects: Record<string, Project> = {};
    for (const p of projectList) projects[p.id] = p;
    const lists: Record<string, List> = {};
    for (const l of listList) lists[l.id] = l;
    const smartLists: Record<string, SmartList> = {};
    for (const s of smartList) smartLists[s.id] = s;
    set({ tasks, projects, lists, smartLists, loaded: true });
  },

  createTask: async (init) => {
    const t: Task = {
      id: newId('task'),
      title: 'Untitled',
      completed: false,
      reminders: [],
      priority: 3,
      tags: [],
      attachments: [],
      activity: [{ id: newId('act'), type: 'created', at: Date.now() }],
      order: Date.now(),
      trashed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...init,
    };
    await todoStorage.putTask(t);
    set((s) => ({ tasks: { ...s.tasks, [t.id]: t } }));
    return t;
  },

  updateTask: async (id, patch) => {
    const cur = get().tasks[id];
    if (!cur) return;
    const next: Task = { ...cur, ...patch, updatedAt: Date.now() };
    await todoStorage.putTask(next);
    set((s) => ({ tasks: { ...s.tasks, [id]: next } }));
  },

  toggleComplete: async (id) => {
    const cur = get().tasks[id];
    if (!cur) return;
    const wasCompleted = cur.completed;
    const completed = !wasCompleted;
    await get().updateTask(id, {
      completed,
      completedAt: completed ? Date.now() : undefined,
      activity: [
        { id: newId('act'), type: completed ? 'completed' : 'uncompleted', at: Date.now() },
        ...cur.activity,
      ].slice(0, 50),
    });
    // Spawn next occurrence on completion of a recurring task.
    if (completed && cur.recurrence && cur.dueAt) {
      const nextDue = nextOccurrence(cur.recurrence, cur.dueAt, cur.dueAt);
      if (nextDue) {
        const { id: _id, completedAt, completed: _c, activity, ...rest } = cur;
        await get().createTask({
          ...rest,
          dueAt: nextDue,
          completed: false,
          completedAt: undefined,
          activity: [{ id: newId('act'), type: 'created', at: Date.now() }],
        });
      }
    }
  },

  trashTask: async (id) => {
    await get().updateTask(id, { trashed: true });
  },
  restoreTask: async (id) => {
    await get().updateTask(id, { trashed: false });
  },
  permanentlyDelete: async (id) => {
    await todoStorage.deleteTask(id);
    set((s) => {
      const { [id]: _, ...rest } = s.tasks;
      return { tasks: rest };
    });
  },

  setPriority: async (id, priority) => {
    await get().updateTask(id, { priority });
  },
  setDueAt: async (id, dueAt) => {
    await get().updateTask(id, { dueAt });
  },
  setProject: async (id, projectId) => {
    await get().updateTask(id, { projectId });
  },
  setList: async (id, listId) => {
    await get().updateTask(id, { listId });
  },
  addTag: async (id, tag) => {
    const cur = get().tasks[id];
    if (!cur) return;
    const t = tag.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (!t || cur.tags.includes(t)) return;
    await get().updateTask(id, { tags: [...cur.tags, t] });
  },
  removeTag: async (id, tag) => {
    const cur = get().tasks[id];
    if (!cur) return;
    await get().updateTask(id, { tags: cur.tags.filter((x) => x !== tag) });
  },
  setEstimate: async (id, estimate) => {
    await get().updateTask(id, { estimate });
  },
  acceptSuggestedEstimate: async (id) => {
    const cur = get().tasks[id];
    if (!cur || cur.suggestedEstimate === undefined) return;
    await get().updateTask(id, { estimate: cur.suggestedEstimate, suggestedEstimate: undefined });
  },
  dismissSuggestedEstimate: async (id) => {
    await get().updateTask(id, { suggestedEstimate: undefined });
  },
  setSuggestedEstimate: async (id, minutes) => {
    await get().updateTask(id, { suggestedEstimate: minutes });
  },

  setRecurrence: async (id, rule) => {
    await get().updateTask(id, { recurrence: rule });
  },

  reorderWithin: async (sel, orderedIds) => {
    const tasks = get().tasks;
    const toUpdate: Task[] = [];
    orderedIds.forEach((id, index) => {
      const t = tasks[id];
      if (!t) return;
      const matches =
        (sel.parentId === undefined || t.parentId === sel.parentId) &&
        (sel.listId === undefined || t.listId === sel.listId) &&
        (sel.projectId === undefined || t.projectId === sel.projectId);
      if (matches && t.order !== index + 1) {
        toUpdate.push({ ...t, order: index + 1, updatedAt: Date.now() });
      }
    });
    await Promise.all(toUpdate.map((t) => todoStorage.putTask(t)));
    if (toUpdate.length) {
      set((s) => {
        const next = { ...s.tasks };
        for (const t of toUpdate) next[t.id] = t;
        return { tasks: next };
      });
    }
  },

  addReminder: async (taskId, remindAt) => {
    const cur = get().tasks[taskId];
    if (!cur) throw new Error('task not found');
    const r: Reminder = {
      id: newId('rem'),
      taskId,
      remindAt,
      dismissed: false,
    };
    await get().updateTask(taskId, { reminders: [...cur.reminders, r] });
    return r;
  },
  dismissReminder: async (taskId, reminderId) => {
    const cur = get().tasks[taskId];
    if (!cur) return;
    await get().updateTask(taskId, {
      reminders: cur.reminders.map((r) => (r.id === reminderId ? { ...r, dismissed: true } : r)),
    });
  },

  addAttachment: async (taskId, att) => {
    const cur = get().tasks[taskId];
    if (!cur) return;
    if (cur.attachments.some((a) => a.type === att.type && a.targetId === att.targetId)) return;
    await get().updateTask(taskId, { attachments: [...cur.attachments, att] });
  },
  removeAttachment: async (taskId, type, targetId) => {
    const cur = get().tasks[taskId];
    if (!cur) return;
    await get().updateTask(taskId, {
      attachments: cur.attachments.filter((a) => !(a.type === type && a.targetId === targetId)),
    });
  },

  appendActivity: async (id, entry) => {
    const cur = get().tasks[id];
    if (!cur) return;
    const activity = [
      { id: newId('act'), at: Date.now(), ...entry },
      ...cur.activity,
    ].slice(0, 50);
    await get().updateTask(id, { activity });
  },

  createProject: async (name, init) => {
    const p: Project = {
      id: newId('proj'),
      name,
      archived: false,
      linkedDocIds: [],
      linkedNoteIds: [],
      linkedFileIds: [],
      createdAt: Date.now(),
      ...init,
    };
    await todoStorage.putProject(p);
    set((s) => ({ projects: { ...s.projects, [p.id]: p } }));
    return p;
  },
  updateProject: async (id, patch) => {
    const cur = get().projects[id];
    if (!cur) return;
    const next: Project = { ...cur, ...patch };
    await todoStorage.putProject(next);
    set((s) => ({ projects: { ...s.projects, [id]: next } }));
  },
  archiveProject: async (id) => {
    await get().updateProject(id, { archived: true });
  },
  deleteProject: async (id) => {
    await todoStorage.deleteProject(id);
    set((s) => {
      const { [id]: _, ...rest } = s.projects;
      return { projects: rest };
    });
    // Re-parent tasks to no project
    for (const t of Object.values(get().tasks)) {
      if (t.projectId === id) await get().updateTask(t.id, { projectId: null, listId: null });
    }
  },

  createList: async (name, projectId, init) => {
    const l: List = {
      id: newId('list'),
      name,
      projectId,
      archived: false,
      createdAt: Date.now(),
      ...init,
    };
    await todoStorage.putList(l);
    set((s) => ({ lists: { ...s.lists, [l.id]: l } }));
    return l;
  },
  updateList: async (id, patch) => {
    const cur = get().lists[id];
    if (!cur) return;
    const next: List = { ...cur, ...patch };
    await todoStorage.putList(next);
    set((s) => ({ lists: { ...s.lists, [id]: next } }));
  },
  deleteList: async (id) => {
    await todoStorage.deleteList(id);
    set((s) => {
      const { [id]: _, ...rest } = s.lists;
      return { lists: rest };
    });
  },

  upsertSmartList: async (sl) => {
    await todoStorage.putSmartList(sl);
    set((s) => ({ smartLists: { ...s.smartLists, [sl.id]: sl } }));
  },
  setSmartListTasks: async (id, taskIds) => {
    const cur = get().smartLists[id];
    if (!cur) return;
    const next: SmartList = { ...cur, taskIds, lastComputedAt: Date.now() };
    await todoStorage.putSmartList(next);
    set((s) => ({ smartLists: { ...s.smartLists, [id]: next } }));
  },
  deleteSmartList: async (id) => {
    await todoStorage.deleteSmartList(id);
    set((s) => {
      const { [id]: _, ...rest } = s.smartLists;
      return { smartLists: rest };
    });
  },

  clearAll: async () => {
    await todoStorage.clearAll();
    set({ tasks: {}, projects: {}, lists: {}, smartLists: {}, loaded: false });
  },
}));

export const selectTasksMap = (s: TodoState) => s.tasks;
export const selectProjectsMap = (s: TodoState) => s.projects;
export const selectListsMap = (s: TodoState) => s.lists;
export const selectSmartListsMap = (s: TodoState) => s.smartLists;

/** Aggregate tags across non-trashed tasks. */
export function deriveTodoTags(tasks: Task[]): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const t of tasks) {
    if (t.trashed) continue;
    for (const tag of t.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Tasks visible "today" — overdue + due-today + scheduled today, not subtasks. */
export function todayTasks(tasks: Task[], reference: number = Date.now()): Task[] {
  const start = new Date(reference);
  start.setHours(0, 0, 0, 0);
  const startMs = start.getTime();
  const endMs = startMs + 86_400_000;
  return tasks.filter(
    (t) =>
      !t.trashed &&
      !t.parentId &&
      (!t.completed || (t.completedAt ?? 0) >= startMs) &&
      (
        // due today
        (t.dueAt && t.dueAt >= startMs && t.dueAt < endMs) ||
        // overdue (only show if not completed)
        (!t.completed && t.dueAt && t.dueAt < startMs) ||
        // scheduled today
        (t.scheduledAt && t.scheduledAt >= startMs && t.scheduledAt < endMs)
      ),
  );
}

/** Tasks visible in upcoming window. Returns the concrete + recurrence-expanded due dates. */
export function upcomingTasks(
  tasks: Task[],
  fromMs: number,
  toMs: number,
): { task: Task; dueAt: number }[] {
  const out: { task: Task; dueAt: number }[] = [];
  for (const t of tasks) {
    if (t.trashed || t.completed || t.parentId) continue;
    if (t.dueAt && t.dueAt >= fromMs && t.dueAt <= toMs) {
      out.push({ task: t, dueAt: t.dueAt });
    }
    if (t.recurrence && t.dueAt) {
      const occurrences = expandRecurrence(t.recurrence, t.dueAt, fromMs, toMs);
      for (const o of occurrences) {
        if (o !== t.dueAt) out.push({ task: t, dueAt: o });
      }
    }
  }
  return out.sort((a, b) => a.dueAt - b.dueAt);
}
