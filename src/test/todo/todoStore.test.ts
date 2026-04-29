import { describe, it, expect, beforeEach } from 'vitest';
import {
  useTodoStore,
  todayTasks,
  upcomingTasks,
  deriveTodoTags,
} from '@/pages/todo/_hooks/use-todo-store';
import { todoStorage } from '@/pages/todo/_lib/storage';

beforeEach(async () => {
  await todoStorage.clearAll();
  useTodoStore.setState({ tasks: {}, projects: {}, lists: {}, smartLists: {}, loaded: false });
});

const day = 86_400_000;

describe('useTodoStore — load + seed', () => {
  it('seeds tasks, projects, lists, smart lists on first load', async () => {
    await useTodoStore.getState().load();
    const state = useTodoStore.getState();
    expect(Object.keys(state.tasks).length).toBeGreaterThanOrEqual(20);
    expect(Object.keys(state.projects).length).toBe(3);
    expect(Object.keys(state.lists).length).toBe(4);
    expect(Object.keys(state.smartLists).length).toBeGreaterThanOrEqual(4);
  });

  it('does not re-seed', async () => {
    await useTodoStore.getState().load();
    const before = Object.keys(useTodoStore.getState().tasks).length;
    useTodoStore.setState({ loaded: false });
    await useTodoStore.getState().load();
    expect(Object.keys(useTodoStore.getState().tasks).length).toBe(before);
  });
});

describe('useTodoStore — CRUD', () => {
  it('creates and updates a task', async () => {
    await useTodoStore.getState().load();
    const t = await useTodoStore.getState().createTask({ title: 'hello' });
    expect(useTodoStore.getState().tasks[t.id].title).toBe('hello');
    await useTodoStore.getState().updateTask(t.id, { title: 'updated' });
    expect(useTodoStore.getState().tasks[t.id].title).toBe('updated');
  });

  it('toggles completion and records activity', async () => {
    await useTodoStore.getState().load();
    const t = await useTodoStore.getState().createTask({ title: 'a' });
    await useTodoStore.getState().toggleComplete(t.id);
    expect(useTodoStore.getState().tasks[t.id].completed).toBe(true);
    expect(useTodoStore.getState().tasks[t.id].activity[0].type).toBe('completed');
    await useTodoStore.getState().toggleComplete(t.id);
    expect(useTodoStore.getState().tasks[t.id].completed).toBe(false);
  });

  it('trashes and restores', async () => {
    await useTodoStore.getState().load();
    const t = await useTodoStore.getState().createTask({});
    await useTodoStore.getState().trashTask(t.id);
    expect(useTodoStore.getState().tasks[t.id].trashed).toBe(true);
    await useTodoStore.getState().restoreTask(t.id);
    expect(useTodoStore.getState().tasks[t.id].trashed).toBe(false);
  });
});

describe('useTodoStore — recurrence', () => {
  it('spawns the next occurrence on completion of a recurring task', async () => {
    await useTodoStore.getState().load();
    const dueAt = Date.now() - 3600_000;
    const t = await useTodoStore.getState().createTask({
      title: 'standup',
      dueAt,
      recurrence: { freq: 'daily', interval: 1 },
    });
    const before = Object.keys(useTodoStore.getState().tasks).length;
    await useTodoStore.getState().toggleComplete(t.id);
    const after = Object.keys(useTodoStore.getState().tasks).length;
    expect(after).toBe(before + 1);
    const newTask = Object.values(useTodoStore.getState().tasks).find(
      (x) => x.title === 'standup' && !x.completed,
    );
    expect(newTask).toBeDefined();
  });
});

describe('useTodoStore — tags', () => {
  it('adds a normalized tag and dedupes', async () => {
    await useTodoStore.getState().load();
    const t = await useTodoStore.getState().createTask({});
    await useTodoStore.getState().addTag(t.id, 'WORK');
    await useTodoStore.getState().addTag(t.id, 'work');
    expect(useTodoStore.getState().tasks[t.id].tags).toEqual(['work']);
  });
});

describe('useTodoStore — smart lists', () => {
  it('upserts and updates task ids', async () => {
    await useTodoStore.getState().load();
    await useTodoStore.getState().upsertSmartList({
      id: 'sl_test',
      name: 'Test',
      definition: 'test',
      isAiCurated: false,
      taskIds: [],
    });
    await useTodoStore.getState().setSmartListTasks('sl_test', ['a', 'b']);
    expect(useTodoStore.getState().smartLists['sl_test'].taskIds).toEqual(['a', 'b']);
  });
});

describe('todayTasks helper', () => {
  it('returns overdue + due-today tasks, excluding subtasks and trashed', async () => {
    await useTodoStore.getState().load();
    const tasks = Object.values(useTodoStore.getState().tasks);
    const today = todayTasks(tasks);
    // Should include the seeded overdue/today tasks but not subtasks
    expect(today.some((t) => t.title.toLowerCase().includes('friday update'))).toBe(true);
    expect(today.every((t) => !t.parentId)).toBe(true);
  });
});

describe('upcomingTasks helper', () => {
  it('returns due tasks within the window and expands recurrence', async () => {
    await useTodoStore.getState().load();
    const tasks = Object.values(useTodoStore.getState().tasks);
    const out = upcomingTasks(tasks, Date.now(), Date.now() + 14 * day);
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((u) => u.dueAt >= Date.now())).toBe(true);
  });
});

describe('deriveTodoTags', () => {
  it('counts tags excluding trashed', async () => {
    await useTodoStore.getState().load();
    const tasks = Object.values(useTodoStore.getState().tasks);
    const tags = deriveTodoTags(tasks);
    expect(tags.length).toBeGreaterThan(0);
    expect(tags[0].count).toBeGreaterThan(0);
  });
});
