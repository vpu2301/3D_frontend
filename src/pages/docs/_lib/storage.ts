import { get, set, del, keys, createStore } from 'idb-keyval';
import type { Doc, Folder } from '@/pages/docs/_lib/types';

const docsStore = createStore('ai-docs-docs', 'kv');
const foldersStore = createStore('ai-docs-folders', 'kv');
const metaStore = createStore('ai-docs-meta', 'kv');

export const docsStorage = {
  async getDoc(id: string): Promise<Doc | undefined> {
    return get<Doc>(id, docsStore);
  },
  async putDoc(doc: Doc): Promise<void> {
    return set(doc.id, doc, docsStore);
  },
  async deleteDoc(id: string): Promise<void> {
    return del(id, docsStore);
  },
  async listDocs(): Promise<Doc[]> {
    const ks = await keys(docsStore);
    const docs = await Promise.all(ks.map((k) => get<Doc>(k as string, docsStore)));
    return docs.filter((d): d is Doc => Boolean(d));
  },

  async getFolder(id: string): Promise<Folder | undefined> {
    return get<Folder>(id, foldersStore);
  },
  async putFolder(folder: Folder): Promise<void> {
    return set(folder.id, folder, foldersStore);
  },
  async deleteFolder(id: string): Promise<void> {
    return del(id, foldersStore);
  },
  async listFolders(): Promise<Folder[]> {
    const ks = await keys(foldersStore);
    const folders = await Promise.all(ks.map((k) => get<Folder>(k as string, foldersStore)));
    return folders.filter((f): f is Folder => Boolean(f));
  },

  async getMeta<T>(key: string): Promise<T | undefined> {
    return get<T>(key, metaStore);
  },
  async setMeta<T>(key: string, value: T): Promise<void> {
    return set(key, value, metaStore);
  },

  async clearAll(): Promise<void> {
    const dks = await keys(docsStore);
    const fks = await keys(foldersStore);
    const mks = await keys(metaStore);
    await Promise.all([
      ...dks.map((k) => del(k as string, docsStore)),
      ...fks.map((k) => del(k as string, foldersStore)),
      ...mks.map((k) => del(k as string, metaStore)),
    ]);
  },
};

export function newId(prefix = 'id'): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}
