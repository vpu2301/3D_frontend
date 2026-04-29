import { create } from 'zustand';
import type { JSONContent } from '@tiptap/react';
import type { Doc, Folder, Snapshot, CommentThread, CommentReply } from '@/pages/docs/_lib/types';
import { docsStorage, newId } from '@/pages/docs/_lib/storage';
import { buildSeed } from '@/pages/docs/_lib/seed';

const SEED_FLAG = 'seed:v1';
const MAX_SNAPSHOTS = 20;

interface DocsState {
  docs: Record<string, Doc>;
  folders: Record<string, Folder>;
  loaded: boolean;
  load: () => Promise<void>;

  createDoc: (init?: Partial<Doc>) => Promise<Doc>;
  updateDoc: (id: string, patch: Partial<Doc>) => Promise<void>;
  deleteDoc: (id: string) => Promise<void>;
  restoreDoc: (id: string) => Promise<void>;
  trashDoc: (id: string) => Promise<void>;
  duplicateDoc: (id: string) => Promise<Doc | undefined>;

  starDoc: (id: string, value: boolean) => Promise<void>;
  moveDoc: (id: string, folderId: string | null) => Promise<void>;

  saveContent: (id: string, content: JSONContent, title?: string) => Promise<void>;
  takeSnapshot: (id: string) => Promise<void>;
  restoreSnapshot: (docId: string, snapshotId: string) => Promise<void>;

  createFolder: (name: string, parentId?: string | null) => Promise<Folder>;
  renameFolder: (id: string, name: string) => Promise<void>;
  deleteFolder: (id: string) => Promise<void>;

  addComment: (docId: string, threadId: string, anchor: string, body: string) => Promise<void>;
  replyToComment: (docId: string, threadId: string, body: string) => Promise<void>;
  resolveComment: (docId: string, threadId: string, resolved: boolean) => Promise<void>;

  exportAll: () => { docs: Doc[]; folders: Folder[] };
  importAll: (data: { docs: Doc[]; folders: Folder[] }) => Promise<void>;
  clearAll: () => Promise<void>;
}

function wordCount(content: JSONContent): number {
  let count = 0;
  const walk = (n: JSONContent | undefined) => {
    if (!n) return;
    if (n.type === 'text' && n.text) {
      count += n.text.trim().split(/\s+/).filter(Boolean).length;
    }
    if (n.content) for (const c of n.content) walk(c);
  };
  walk(content);
  return count;
}

export const useDocsStore = create<DocsState>((set, get) => ({
  docs: {},
  folders: {},
  loaded: false,

  load: async () => {
    if (get().loaded) return;
    const seedFlag = await docsStorage.getMeta<string>(SEED_FLAG);
    if (!seedFlag) {
      const { docs, folders } = buildSeed();
      await Promise.all([
        ...docs.map((d) => docsStorage.putDoc(d)),
        ...folders.map((f) => docsStorage.putFolder(f)),
      ]);
      await docsStorage.setMeta(SEED_FLAG, '1');
    }
    const [allDocs, allFolders] = await Promise.all([
      docsStorage.listDocs(),
      docsStorage.listFolders(),
    ]);
    const docs: Record<string, Doc> = {};
    for (const d of allDocs) docs[d.id] = d;
    const folders: Record<string, Folder> = {};
    for (const f of allFolders) folders[f.id] = f;
    set({ docs, folders, loaded: true });
  },

  createDoc: async (init) => {
    const now = Date.now();
    const doc: Doc = {
      id: newId('doc'),
      title: 'Untitled',
      content: { type: 'doc', content: [{ type: 'paragraph' }] },
      starred: false,
      trashed: false,
      shared: false,
      folderId: null,
      createdAt: now,
      updatedAt: now,
      snapshots: [],
      comments: [],
      ...init,
    };
    await docsStorage.putDoc(doc);
    set((s) => ({ docs: { ...s.docs, [doc.id]: doc } }));
    return doc;
  },

  updateDoc: async (id, patch) => {
    const current = get().docs[id];
    if (!current) return;
    const next: Doc = { ...current, ...patch, updatedAt: Date.now() };
    await docsStorage.putDoc(next);
    set((s) => ({ docs: { ...s.docs, [id]: next } }));
  },

  deleteDoc: async (id) => {
    await docsStorage.deleteDoc(id);
    set((s) => {
      const { [id]: _, ...rest } = s.docs;
      return { docs: rest };
    });
  },

  restoreDoc: async (id) => {
    await get().updateDoc(id, { trashed: false });
  },

  trashDoc: async (id) => {
    await get().updateDoc(id, { trashed: true });
  },

  duplicateDoc: async (id) => {
    const src = get().docs[id];
    if (!src) return;
    const { id: _omit, ...rest } = src;
    return await get().createDoc({
      ...rest,
      title: `${src.title} (copy)`,
      starred: false,
      snapshots: [],
      comments: [],
    });
  },

  starDoc: async (id, value) => {
    await get().updateDoc(id, { starred: value });
  },

  moveDoc: async (id, folderId) => {
    await get().updateDoc(id, { folderId });
  },

  saveContent: async (id, content, title) => {
    const current = get().docs[id];
    if (!current) return;
    const next: Doc = {
      ...current,
      content,
      title: title ?? current.title,
      updatedAt: Date.now(),
    };
    await docsStorage.putDoc(next);
    set((s) => ({ docs: { ...s.docs, [id]: next } }));
  },

  takeSnapshot: async (id) => {
    const current = get().docs[id];
    if (!current) return;
    const snap: Snapshot = {
      id: newId('snap'),
      takenAt: Date.now(),
      content: current.content,
      title: current.title,
      wordCount: wordCount(current.content),
    };
    const snapshots = [snap, ...current.snapshots].slice(0, MAX_SNAPSHOTS);
    await get().updateDoc(id, { snapshots });
  },

  restoreSnapshot: async (docId, snapshotId) => {
    const current = get().docs[docId];
    if (!current) return;
    const snap = current.snapshots.find((s) => s.id === snapshotId);
    if (!snap) return;
    await get().updateDoc(docId, { content: snap.content, title: snap.title });
  },

  createFolder: async (name, parentId = null) => {
    const folder: Folder = {
      id: newId('folder'),
      name,
      parentId,
      createdAt: Date.now(),
    };
    await docsStorage.putFolder(folder);
    set((s) => ({ folders: { ...s.folders, [folder.id]: folder } }));
    return folder;
  },

  renameFolder: async (id, name) => {
    const current = get().folders[id];
    if (!current) return;
    const next: Folder = { ...current, name };
    await docsStorage.putFolder(next);
    set((s) => ({ folders: { ...s.folders, [id]: next } }));
  },

  deleteFolder: async (id) => {
    await docsStorage.deleteFolder(id);
    set((s) => {
      const { [id]: _, ...rest } = s.folders;
      return { folders: rest };
    });
    // Re-parent any docs in this folder to root
    const docs = get().docs;
    for (const d of Object.values(docs)) {
      if (d.folderId === id) await get().updateDoc(d.id, { folderId: null });
    }
  },

  addComment: async (docId, threadId, anchor, body) => {
    const current = get().docs[docId];
    if (!current) return;
    const reply: CommentReply = {
      id: newId('reply'),
      author: 'You',
      body,
      createdAt: Date.now(),
    };
    const thread: CommentThread = {
      id: threadId,
      anchor,
      replies: [reply],
      resolved: false,
      createdAt: Date.now(),
    };
    const comments = [...current.comments, thread];
    await get().updateDoc(docId, { comments });
  },

  replyToComment: async (docId, threadId, body) => {
    const current = get().docs[docId];
    if (!current) return;
    const comments = current.comments.map((t) =>
      t.id === threadId
        ? {
            ...t,
            replies: [
              ...t.replies,
              {
                id: newId('reply'),
                author: 'You',
                body,
                createdAt: Date.now(),
              },
            ],
          }
        : t,
    );
    await get().updateDoc(docId, { comments });
  },

  resolveComment: async (docId, threadId, resolved) => {
    const current = get().docs[docId];
    if (!current) return;
    const comments = current.comments.map((t) => (t.id === threadId ? { ...t, resolved } : t));
    await get().updateDoc(docId, { comments });
  },

  exportAll: () => ({
    docs: Object.values(get().docs),
    folders: Object.values(get().folders),
  }),

  importAll: async (data) => {
    await Promise.all([
      ...data.docs.map((d) => docsStorage.putDoc(d)),
      ...data.folders.map((f) => docsStorage.putFolder(f)),
    ]);
    const docs: Record<string, Doc> = { ...get().docs };
    for (const d of data.docs) docs[d.id] = d;
    const folders: Record<string, Folder> = { ...get().folders };
    for (const f of data.folders) folders[f.id] = f;
    set({ docs, folders });
  },

  clearAll: async () => {
    await docsStorage.clearAll();
    set({ docs: {}, folders: {}, loaded: false });
  },
}));

/**
 * Returns the docs map. Callers should `Object.values(...)` inside their
 * render — subscribing to a fresh array would break Zustand's snapshot check.
 */
export const selectDocsMap = (state: DocsState) => state.docs;
