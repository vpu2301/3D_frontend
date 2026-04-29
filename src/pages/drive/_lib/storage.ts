import { get, set, del, keys, createStore } from 'idb-keyval';
import type { DriveItem, Space } from './types';

// Re-export shared utilities so callers can import everything from one place.
export { newId } from '@/pages/docs/_lib/storage';

const itemsStore = createStore('ai-drive-items', 'kv');
const blobsStore = createStore('ai-drive-blobs', 'kv');
const spacesStore = createStore('ai-drive-spaces', 'kv');
const metaStore = createStore('ai-drive-meta', 'kv');

export const driveStorage = {
  async getItem(id: string): Promise<DriveItem | undefined> {
    return get<DriveItem>(id, itemsStore);
  },
  async putItem(item: DriveItem): Promise<void> {
    return set(item.id, item, itemsStore);
  },
  async deleteItem(id: string): Promise<void> {
    return del(id, itemsStore);
  },
  async listItems(): Promise<DriveItem[]> {
    const ks = await keys(itemsStore);
    const list = await Promise.all(ks.map((k) => get<DriveItem>(k as string, itemsStore)));
    return list.filter((x): x is DriveItem => Boolean(x));
  },

  async getBlob(blobKey: string): Promise<string | undefined> {
    return get<string>(blobKey, blobsStore);
  },
  async putBlob(blobKey: string, dataUrl: string): Promise<void> {
    return set(blobKey, dataUrl, blobsStore);
  },
  async deleteBlob(blobKey: string): Promise<void> {
    return del(blobKey, blobsStore);
  },
  async listBlobKeys(): Promise<string[]> {
    return (await keys(blobsStore)) as string[];
  },

  async getSpace(id: string): Promise<Space | undefined> {
    return get<Space>(id, spacesStore);
  },
  async putSpace(space: Space): Promise<void> {
    return set(space.id, space, spacesStore);
  },
  async deleteSpace(id: string): Promise<void> {
    return del(id, spacesStore);
  },
  async listSpaces(): Promise<Space[]> {
    const ks = await keys(spacesStore);
    const list = await Promise.all(ks.map((k) => get<Space>(k as string, spacesStore)));
    return list.filter((s): s is Space => Boolean(s));
  },

  async getMeta<T>(key: string): Promise<T | undefined> {
    return get<T>(key, metaStore);
  },
  async setMeta<T>(key: string, value: T): Promise<void> {
    return set(key, value, metaStore);
  },

  async clearAll(): Promise<void> {
    const iks = await keys(itemsStore);
    const bks = await keys(blobsStore);
    const sks = await keys(spacesStore);
    const mks = await keys(metaStore);
    await Promise.all([
      ...iks.map((k) => del(k as string, itemsStore)),
      ...bks.map((k) => del(k as string, blobsStore)),
      ...sks.map((k) => del(k as string, spacesStore)),
      ...mks.map((k) => del(k as string, metaStore)),
    ]);
  },
};

export function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('FileReader error'));
    reader.readAsDataURL(file);
  });
}
