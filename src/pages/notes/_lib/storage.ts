import { get, set, del, keys, createStore } from 'idb-keyval';
import type { Note, Notebook } from './types';

// Re-export shared utilities so callers can import everything from one place.
export { newId, docsStorage } from '@/pages/docs/_lib/storage';

const notesStore = createStore('ai-notes-notes', 'kv');
const notebooksStore = createStore('ai-notes-notebooks', 'kv');
const metaStore = createStore('ai-notes-meta', 'kv');

export const notesStorage = {
  async getNote(id: string): Promise<Note | undefined> {
    return get<Note>(id, notesStore);
  },
  async putNote(note: Note): Promise<void> {
    return set(note.id, note, notesStore);
  },
  async deleteNote(id: string): Promise<void> {
    return del(id, notesStore);
  },
  async listNotes(): Promise<Note[]> {
    const ks = await keys(notesStore);
    const notes = await Promise.all(ks.map((k) => get<Note>(k as string, notesStore)));
    return notes.filter((n): n is Note => Boolean(n));
  },

  async getNotebook(id: string): Promise<Notebook | undefined> {
    return get<Notebook>(id, notebooksStore);
  },
  async putNotebook(notebook: Notebook): Promise<void> {
    return set(notebook.id, notebook, notebooksStore);
  },
  async deleteNotebook(id: string): Promise<void> {
    return del(id, notebooksStore);
  },
  async listNotebooks(): Promise<Notebook[]> {
    const ks = await keys(notebooksStore);
    const list = await Promise.all(ks.map((k) => get<Notebook>(k as string, notebooksStore)));
    return list.filter((n): n is Notebook => Boolean(n));
  },

  async getMeta<T>(key: string): Promise<T | undefined> {
    return get<T>(key, metaStore);
  },
  async setMeta<T>(key: string, value: T): Promise<void> {
    return set(key, value, metaStore);
  },

  async clearAll(): Promise<void> {
    const nks = await keys(notesStore);
    const bks = await keys(notebooksStore);
    const mks = await keys(metaStore);
    await Promise.all([
      ...nks.map((k) => del(k as string, notesStore)),
      ...bks.map((k) => del(k as string, notebooksStore)),
      ...mks.map((k) => del(k as string, metaStore)),
    ]);
  },
};
