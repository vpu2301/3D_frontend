import { create } from 'zustand';
import type { DriveItem, Space, Permission, FileVersion, ActivityEntry } from '@/pages/drive/_lib/types';
import { driveStorage, newId } from '@/pages/drive/_lib/storage';
import { buildDriveSeed } from '@/pages/drive/_lib/seed';

const SEED_FLAG = 'seed:v1';
const ME: string = 'user_me';
const MAX_VERSIONS = 10;

interface DriveState {
  items: Record<string, DriveItem>;
  spaces: Record<string, Space>;
  loaded: boolean;

  load: () => Promise<void>;

  // ---- Items (files + folders) ----
  createFolder: (name: string, parentId: string | null, options?: { color?: string; emoji?: string }) => Promise<DriveItem>;
  createFile: (
    name: string,
    parentId: string | null,
    init: Partial<DriveItem>,
    blobDataUrl?: string,
  ) => Promise<DriveItem>;

  /**
   * Adopt a Docs- or Notes-originated entity into the Drive index without
   * duplicating its content. Idempotent — does nothing if already adopted.
   */
  adoptVirtual: (sourceModule: 'docs' | 'notes', sourceId: string, name: string, parentId?: string | null) => Promise<DriveItem>;

  updateItem: (id: string, patch: Partial<DriveItem>) => Promise<void>;
  rename: (id: string, name: string) => Promise<void>;
  move: (id: string, toFolderId: string | null) => Promise<void>;
  toggleStar: (id: string) => Promise<void>;
  trash: (id: string) => Promise<void>;
  restore: (id: string) => Promise<void>;
  permanentlyDelete: (id: string) => Promise<void>;

  addTag: (id: string, tag: string) => Promise<void>;
  removeTag: (id: string, tag: string) => Promise<void>;
  setTags: (id: string, tags: string[]) => Promise<void>;
  acceptSuggestedTag: (id: string, tag: string) => Promise<void>;
  dismissSuggestedTag: (id: string, tag: string) => Promise<void>;
  setSuggestedTags: (id: string, tags: string[]) => Promise<void>;

  setShared: (id: string, perms: Permission[]) => Promise<void>;
  setSummary: (id: string, summary: { oneLine: string; extended: string }) => Promise<void>;

  /**
   * Append a new version to a file (used when re-uploading). Caps the version
   * list at MAX_VERSIONS, keeping the newest first.
   */
  appendVersion: (id: string, version: FileVersion) => Promise<void>;
  restoreVersion: (id: string, versionId: string) => Promise<void>;

  appendActivity: (id: string, entry: Omit<ActivityEntry, 'id' | 'at'>) => Promise<void>;

  getBlob: (blobKey: string) => Promise<string | undefined>;
  putBlob: (blobKey: string, dataUrl: string) => Promise<void>;

  // ---- Spaces ----
  upsertSpace: (space: Space) => Promise<void>;
  deleteSpace: (id: string) => Promise<void>;
  setSpaceFiles: (id: string, fileIds: string[]) => Promise<void>;

  clearAll: () => Promise<void>;
}

export const useDriveStore = create<DriveState>((set, get) => ({
  items: {},
  spaces: {},
  loaded: false,

  load: async () => {
    if (get().loaded) return;
    const flag = await driveStorage.getMeta<string>(SEED_FLAG);
    if (!flag) {
      const { items, spaces } = buildDriveSeed();
      await Promise.all([
        ...items.map((i) => driveStorage.putItem(i)),
        ...spaces.map((s) => driveStorage.putSpace(s)),
      ]);
      await driveStorage.setMeta(SEED_FLAG, '1');
    }
    const [itemsList, spacesList] = await Promise.all([
      driveStorage.listItems(),
      driveStorage.listSpaces(),
    ]);
    const items: Record<string, DriveItem> = {};
    for (const i of itemsList) items[i.id] = i;
    const spaces: Record<string, Space> = {};
    for (const s of spacesList) spaces[s.id] = s;
    set({ items, spaces, loaded: true });
  },

  createFolder: async (name, parentId, options) => {
    const now = Date.now();
    const folder: DriveItem = {
      id: newId('drive'),
      name,
      type: 'folder',
      parentId,
      ownerId: ME,
      sharedWith: [],
      starred: false,
      trashed: false,
      tags: [],
      color: options?.color,
      emoji: options?.emoji,
      createdAt: now,
      updatedAt: now,
    };
    await driveStorage.putItem(folder);
    set((s) => ({ items: { ...s.items, [folder.id]: folder } }));
    return folder;
  },

  createFile: async (name, parentId, init, blobDataUrl) => {
    const now = Date.now();
    const id = newId('drive');
    let blobKey: string | undefined;
    if (blobDataUrl) {
      blobKey = `blob_${id}_${now}`;
      await driveStorage.putBlob(blobKey, blobDataUrl);
    }
    const file: DriveItem = {
      id,
      name,
      type: 'file',
      parentId,
      ownerId: ME,
      sharedWith: [],
      starred: false,
      trashed: false,
      tags: [],
      createdAt: now,
      updatedAt: now,
      blobKey,
      activity: [{ id: newId('act'), at: now, by: ME, kind: 'uploaded' }],
      ...init,
    };
    await driveStorage.putItem(file);
    set((s) => ({ items: { ...s.items, [file.id]: file } }));
    return file;
  },

  adoptVirtual: async (sourceModule, sourceId, name, parentId = null) => {
    const existing = Object.values(get().items).find(
      (i) => i.sourceModule === sourceModule && i.sourceId === sourceId,
    );
    if (existing) return existing;
    const now = Date.now();
    const item: DriveItem = {
      id: sourceId,
      name,
      type: 'file',
      parentId,
      ownerId: ME,
      sharedWith: [],
      starred: false,
      trashed: false,
      tags: [],
      createdAt: now,
      updatedAt: now,
      sourceModule,
      sourceId,
    };
    await driveStorage.putItem(item);
    set((s) => ({ items: { ...s.items, [item.id]: item } }));
    return item;
  },

  updateItem: async (id, patch) => {
    const cur = get().items[id];
    if (!cur) return;
    const next: DriveItem = { ...cur, ...patch, updatedAt: Date.now() };
    await driveStorage.putItem(next);
    set((s) => ({ items: { ...s.items, [id]: next } }));
  },

  rename: async (id, name) => {
    await get().updateItem(id, { name });
  },

  move: async (id, toFolderId) => {
    const cur = get().items[id];
    if (!cur) return;
    if (id === toFolderId) return;
    // Prevent moving a folder into itself or its descendants
    if (cur.type === 'folder' && toFolderId) {
      const items = get().items;
      let p: string | null | undefined = toFolderId;
      while (p) {
        if (p === id) return;
        p = items[p]?.parentId;
      }
    }
    await get().updateItem(id, { parentId: toFolderId });
  },

  toggleStar: async (id) => {
    const cur = get().items[id];
    if (!cur) return;
    await get().updateItem(id, { starred: !cur.starred });
  },

  trash: async (id) => {
    await get().updateItem(id, { trashed: true });
  },
  restore: async (id) => {
    await get().updateItem(id, { trashed: false });
  },

  permanentlyDelete: async (id) => {
    const cur = get().items[id];
    if (!cur) return;
    if (cur.blobKey) await driveStorage.deleteBlob(cur.blobKey);
    if (cur.versions) {
      for (const v of cur.versions) if (v.blobKey) await driveStorage.deleteBlob(v.blobKey);
    }
    await driveStorage.deleteItem(id);
    set((s) => {
      const { [id]: _, ...rest } = s.items;
      return { items: rest };
    });
  },

  addTag: async (id, tag) => {
    const cur = get().items[id];
    if (!cur) return;
    const t = tag.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (!t || cur.tags.includes(t)) return;
    await get().updateItem(id, { tags: [...cur.tags, t] });
  },
  removeTag: async (id, tag) => {
    const cur = get().items[id];
    if (!cur) return;
    await get().updateItem(id, { tags: cur.tags.filter((t) => t !== tag) });
  },
  setTags: async (id, tags) => {
    await get().updateItem(id, { tags: Array.from(new Set(tags.map((t) => t.toLowerCase()))) });
  },
  acceptSuggestedTag: async (id, tag) => {
    const cur = get().items[id];
    if (!cur) return;
    const remaining = (cur.suggestedTags ?? []).filter((t) => t !== tag);
    const tags = cur.tags.includes(tag) ? cur.tags : [...cur.tags, tag];
    await get().updateItem(id, { suggestedTags: remaining, tags });
  },
  dismissSuggestedTag: async (id, tag) => {
    const cur = get().items[id];
    if (!cur) return;
    await get().updateItem(id, {
      suggestedTags: (cur.suggestedTags ?? []).filter((t) => t !== tag),
    });
  },
  setSuggestedTags: async (id, tags) => {
    await get().updateItem(id, { suggestedTags: tags });
  },

  setShared: async (id, perms) => {
    await get().updateItem(id, { sharedWith: perms });
  },

  setSummary: async (id, summary) => {
    await get().updateItem(id, { summary });
  },

  appendVersion: async (id, version) => {
    const cur = get().items[id];
    if (!cur) return;
    const versions = [version, ...(cur.versions ?? [])].slice(0, MAX_VERSIONS);
    await get().updateItem(id, { versions });
  },
  restoreVersion: async (id, versionId) => {
    const cur = get().items[id];
    if (!cur) return;
    const v = (cur.versions ?? []).find((x) => x.id === versionId);
    if (!v) return;
    // Promote the chosen version's blob to current
    await get().updateItem(id, { blobKey: v.blobKey, size: v.size });
    await get().appendActivity(id, { by: ME, kind: 'restored', detail: `Restored version from ${new Date(v.uploadedAt).toLocaleString()}` });
  },

  appendActivity: async (id, entry) => {
    const cur = get().items[id];
    if (!cur) return;
    const activity = [{ id: newId('act'), at: Date.now(), ...entry }, ...(cur.activity ?? [])].slice(0, 50);
    await get().updateItem(id, { activity });
  },

  getBlob: async (blobKey) => driveStorage.getBlob(blobKey),
  putBlob: async (blobKey, dataUrl) => driveStorage.putBlob(blobKey, dataUrl),

  upsertSpace: async (space) => {
    await driveStorage.putSpace(space);
    set((s) => ({ spaces: { ...s.spaces, [space.id]: space } }));
  },
  deleteSpace: async (id) => {
    await driveStorage.deleteSpace(id);
    set((s) => {
      const { [id]: _, ...rest } = s.spaces;
      return { spaces: rest };
    });
  },
  setSpaceFiles: async (id, fileIds) => {
    const cur = get().spaces[id];
    if (!cur) return;
    const next: Space = { ...cur, fileIds, lastComputedAt: Date.now() };
    await driveStorage.putSpace(next);
    set((s) => ({ spaces: { ...s.spaces, [id]: next } }));
  },

  clearAll: async () => {
    await driveStorage.clearAll();
    set({ items: {}, spaces: {}, loaded: false });
  },
}));

export const selectItemsMap = (s: DriveState) => s.items;
export const selectSpacesMap = (s: DriveState) => s.spaces;

/** Build the full ancestor chain of a folder id, root-first. */
export function ancestorChain(items: Record<string, DriveItem>, id: string | null): DriveItem[] {
  const out: DriveItem[] = [];
  let cur = id ? items[id] : undefined;
  while (cur) {
    out.unshift(cur);
    cur = cur.parentId ? items[cur.parentId] : undefined;
  }
  return out;
}

/** Tag aggregation across files, excluding trashed. */
export function deriveDriveTags(items: DriveItem[]): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const i of items) {
    if (i.trashed) continue;
    for (const t of i.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function totalStoredBytes(items: DriveItem[]): number {
  return items
    .filter((i) => i.type === 'file' && !i.trashed && !i.sourceModule)
    .reduce((sum, i) => sum + (i.size ?? 0), 0);
}
