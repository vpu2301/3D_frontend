import { get, set, del, keys, createStore } from 'idb-keyval';
import type { Task, Project, List, SmartList } from './types';

export { newId } from '@/pages/docs/_lib/storage';

const tasksStore = createStore('ai-todo-tasks', 'kv');
const projectsStore = createStore('ai-todo-projects', 'kv');
const listsStore = createStore('ai-todo-lists', 'kv');
const smartListsStore = createStore('ai-todo-smart', 'kv');
const metaStore = createStore('ai-todo-meta', 'kv');

export const todoStorage = {
  async getTask(id: string): Promise<Task | undefined> {
    return get<Task>(id, tasksStore);
  },
  async putTask(task: Task): Promise<void> {
    return set(task.id, task, tasksStore);
  },
  async deleteTask(id: string): Promise<void> {
    return del(id, tasksStore);
  },
  async listTasks(): Promise<Task[]> {
    const ks = await keys(tasksStore);
    const list = await Promise.all(ks.map((k) => get<Task>(k as string, tasksStore)));
    return list.filter((x): x is Task => Boolean(x));
  },

  async putProject(p: Project): Promise<void> {
    return set(p.id, p, projectsStore);
  },
  async deleteProject(id: string): Promise<void> {
    return del(id, projectsStore);
  },
  async listProjects(): Promise<Project[]> {
    const ks = await keys(projectsStore);
    const list = await Promise.all(ks.map((k) => get<Project>(k as string, projectsStore)));
    return list.filter((p): p is Project => Boolean(p));
  },

  async putList(l: List): Promise<void> {
    return set(l.id, l, listsStore);
  },
  async deleteList(id: string): Promise<void> {
    return del(id, listsStore);
  },
  async listLists(): Promise<List[]> {
    const ks = await keys(listsStore);
    const list = await Promise.all(ks.map((k) => get<List>(k as string, listsStore)));
    return list.filter((l): l is List => Boolean(l));
  },

  async putSmartList(s: SmartList): Promise<void> {
    return set(s.id, s, smartListsStore);
  },
  async deleteSmartList(id: string): Promise<void> {
    return del(id, smartListsStore);
  },
  async listSmartLists(): Promise<SmartList[]> {
    const ks = await keys(smartListsStore);
    const list = await Promise.all(ks.map((k) => get<SmartList>(k as string, smartListsStore)));
    return list.filter((s): s is SmartList => Boolean(s));
  },

  async getMeta<T>(key: string): Promise<T | undefined> {
    return get<T>(key, metaStore);
  },
  async setMeta<T>(key: string, value: T): Promise<void> {
    return set(key, value, metaStore);
  },

  async clearAll(): Promise<void> {
    const stores = [tasksStore, projectsStore, listsStore, smartListsStore, metaStore];
    for (const s of stores) {
      const ks = await keys(s);
      await Promise.all(ks.map((k) => del(k as string, s)));
    }
  },
};
