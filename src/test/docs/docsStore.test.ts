import { describe, it, expect, beforeEach } from 'vitest';
import { useDocsStore } from '@/pages/docs/_hooks/use-docs-store';
import { docsStorage } from '@/pages/docs/_lib/storage';

beforeEach(async () => {
  await docsStorage.clearAll();
  useDocsStore.setState({ docs: {}, folders: {}, loaded: false });
});

describe('useDocsStore — load + seed', () => {
  it('seeds 10 docs and 3 folders on first load', async () => {
    await useDocsStore.getState().load();
    const docs = Object.values(useDocsStore.getState().docs);
    const folders = Object.values(useDocsStore.getState().folders);
    expect(docs.length).toBe(10);
    expect(folders.length).toBe(3);
  });

  it('does not re-seed on subsequent loads', async () => {
    await useDocsStore.getState().load();
    const before = Object.keys(useDocsStore.getState().docs).length;
    useDocsStore.setState({ loaded: false });
    await useDocsStore.getState().load();
    const after = Object.keys(useDocsStore.getState().docs).length;
    expect(after).toBe(before);
  });
});

describe('useDocsStore — CRUD', () => {
  it('creates a doc', async () => {
    await useDocsStore.getState().load();
    const doc = await useDocsStore.getState().createDoc({ title: 'Test' });
    expect(doc.title).toBe('Test');
    expect(useDocsStore.getState().docs[doc.id]).toBeDefined();
  });

  it('updates a doc', async () => {
    await useDocsStore.getState().load();
    const doc = await useDocsStore.getState().createDoc({ title: 'A' });
    await useDocsStore.getState().updateDoc(doc.id, { title: 'B' });
    expect(useDocsStore.getState().docs[doc.id].title).toBe('B');
  });

  it('moves a doc to trash and restores it', async () => {
    await useDocsStore.getState().load();
    const doc = await useDocsStore.getState().createDoc({ title: 'A' });
    await useDocsStore.getState().trashDoc(doc.id);
    expect(useDocsStore.getState().docs[doc.id].trashed).toBe(true);
    await useDocsStore.getState().restoreDoc(doc.id);
    expect(useDocsStore.getState().docs[doc.id].trashed).toBe(false);
  });

  it('permanently deletes a doc', async () => {
    await useDocsStore.getState().load();
    const doc = await useDocsStore.getState().createDoc({ title: 'A' });
    await useDocsStore.getState().deleteDoc(doc.id);
    expect(useDocsStore.getState().docs[doc.id]).toBeUndefined();
  });

  it('stars and unstars a doc', async () => {
    await useDocsStore.getState().load();
    const doc = await useDocsStore.getState().createDoc({ title: 'A' });
    await useDocsStore.getState().starDoc(doc.id, true);
    expect(useDocsStore.getState().docs[doc.id].starred).toBe(true);
    await useDocsStore.getState().starDoc(doc.id, false);
    expect(useDocsStore.getState().docs[doc.id].starred).toBe(false);
  });

  it('duplicates a doc with new id and (copy) suffix', async () => {
    await useDocsStore.getState().load();
    const doc = await useDocsStore.getState().createDoc({ title: 'Original' });
    const dup = await useDocsStore.getState().duplicateDoc(doc.id);
    expect(dup).toBeDefined();
    expect(dup!.id).not.toBe(doc.id);
    expect(dup!.title).toBe('Original (copy)');
  });
});

describe('useDocsStore — folders', () => {
  it('creates a folder', async () => {
    await useDocsStore.getState().load();
    const folder = await useDocsStore.getState().createFolder('New folder');
    expect(folder.name).toBe('New folder');
    expect(useDocsStore.getState().folders[folder.id]).toBeDefined();
  });

  it('renames a folder', async () => {
    await useDocsStore.getState().load();
    const folder = await useDocsStore.getState().createFolder('Old');
    await useDocsStore.getState().renameFolder(folder.id, 'New');
    expect(useDocsStore.getState().folders[folder.id].name).toBe('New');
  });

  it('deleting a folder re-parents its docs to root', async () => {
    await useDocsStore.getState().load();
    const folder = await useDocsStore.getState().createFolder('Tmp');
    const doc = await useDocsStore.getState().createDoc({ folderId: folder.id });
    await useDocsStore.getState().deleteFolder(folder.id);
    expect(useDocsStore.getState().folders[folder.id]).toBeUndefined();
    expect(useDocsStore.getState().docs[doc.id].folderId).toBeNull();
  });

  it('moves a doc between folders', async () => {
    await useDocsStore.getState().load();
    const a = await useDocsStore.getState().createFolder('A');
    const b = await useDocsStore.getState().createFolder('B');
    const doc = await useDocsStore.getState().createDoc({ folderId: a.id });
    await useDocsStore.getState().moveDoc(doc.id, b.id);
    expect(useDocsStore.getState().docs[doc.id].folderId).toBe(b.id);
  });
});

describe('useDocsStore — snapshots', () => {
  it('captures a snapshot of current content', async () => {
    await useDocsStore.getState().load();
    const doc = await useDocsStore.getState().createDoc({ title: 'A' });
    await useDocsStore.getState().takeSnapshot(doc.id);
    const after = useDocsStore.getState().docs[doc.id];
    expect(after.snapshots).toHaveLength(1);
    expect(after.snapshots[0].title).toBe('A');
  });

  it('caps snapshots at 20', async () => {
    await useDocsStore.getState().load();
    const doc = await useDocsStore.getState().createDoc({ title: 'A' });
    for (let i = 0; i < 25; i++) {
      await useDocsStore.getState().takeSnapshot(doc.id);
    }
    expect(useDocsStore.getState().docs[doc.id].snapshots).toHaveLength(20);
  });

  it('restores content from a snapshot', async () => {
    await useDocsStore.getState().load();
    const doc = await useDocsStore.getState().createDoc({ title: 'Original' });
    await useDocsStore.getState().takeSnapshot(doc.id);
    const snapId = useDocsStore.getState().docs[doc.id].snapshots[0].id;

    await useDocsStore.getState().updateDoc(doc.id, { title: 'Edited' });
    expect(useDocsStore.getState().docs[doc.id].title).toBe('Edited');

    await useDocsStore.getState().restoreSnapshot(doc.id, snapId);
    expect(useDocsStore.getState().docs[doc.id].title).toBe('Original');
  });
});

describe('useDocsStore — comments', () => {
  it('adds, replies, and resolves a comment', async () => {
    await useDocsStore.getState().load();
    const doc = await useDocsStore.getState().createDoc();
    await useDocsStore.getState().addComment(doc.id, 'thread-1', '0-5', 'Hello');
    expect(useDocsStore.getState().docs[doc.id].comments).toHaveLength(1);
    expect(useDocsStore.getState().docs[doc.id].comments[0].replies).toHaveLength(1);

    await useDocsStore.getState().replyToComment(doc.id, 'thread-1', 'And again');
    expect(useDocsStore.getState().docs[doc.id].comments[0].replies).toHaveLength(2);

    await useDocsStore.getState().resolveComment(doc.id, 'thread-1', true);
    expect(useDocsStore.getState().docs[doc.id].comments[0].resolved).toBe(true);
  });
});

describe('useDocsStore — persistence', () => {
  it('round-trips through indexeddb', async () => {
    await useDocsStore.getState().load();
    const doc = await useDocsStore.getState().createDoc({ title: 'Persist me' });
    // simulate fresh app boot
    useDocsStore.setState({ docs: {}, folders: {}, loaded: false });
    await useDocsStore.getState().load();
    expect(useDocsStore.getState().docs[doc.id]).toBeDefined();
    expect(useDocsStore.getState().docs[doc.id].title).toBe('Persist me');
  });

  it('exportAll + importAll preserves data', async () => {
    await useDocsStore.getState().load();
    await useDocsStore.getState().createDoc({ title: 'A' });
    const data = useDocsStore.getState().exportAll();
    expect(data.docs.length).toBeGreaterThan(0);

    await useDocsStore.getState().clearAll();
    expect(Object.keys(useDocsStore.getState().docs)).toHaveLength(0);

    await useDocsStore.getState().importAll(data);
    expect(Object.values(useDocsStore.getState().docs).some((d) => d.title === 'A')).toBe(true);
  });
});
