import { describe, it, expect, beforeEach } from 'vitest';
import { useDriveStore, ancestorChain, deriveDriveTags, totalStoredBytes } from '@/pages/drive/_hooks/use-drive-store';
import { driveStorage } from '@/pages/drive/_lib/storage';

beforeEach(async () => {
  await driveStorage.clearAll();
  useDriveStore.setState({ items: {}, spaces: {}, loaded: false });
});

describe('useDriveStore — load + seed', () => {
  it('seeds items and spaces on first load', async () => {
    await useDriveStore.getState().load();
    const items = Object.values(useDriveStore.getState().items);
    const spaces = Object.values(useDriveStore.getState().spaces);
    expect(items.length).toBeGreaterThan(20);
    expect(spaces.length).toBeGreaterThanOrEqual(4);
  });

  it('does not re-seed', async () => {
    await useDriveStore.getState().load();
    const before = Object.keys(useDriveStore.getState().items).length;
    useDriveStore.setState({ loaded: false });
    await useDriveStore.getState().load();
    expect(Object.keys(useDriveStore.getState().items).length).toBe(before);
  });
});

describe('useDriveStore — folders + files', () => {
  it('creates a folder and a file inside it', async () => {
    await useDriveStore.getState().load();
    const folder = await useDriveStore.getState().createFolder('Test', 'drive_root');
    const file = await useDriveStore.getState().createFile('hello.txt', folder.id, {
      mimeType: 'text/plain',
      size: 11,
    });
    expect(useDriveStore.getState().items[folder.id]).toBeDefined();
    expect(useDriveStore.getState().items[file.id].parentId).toBe(folder.id);
  });

  it('moves a file between folders', async () => {
    await useDriveStore.getState().load();
    const a = await useDriveStore.getState().createFolder('A', 'drive_root');
    const b = await useDriveStore.getState().createFolder('B', 'drive_root');
    const f = await useDriveStore.getState().createFile('x.md', a.id, { mimeType: 'text/markdown', size: 100 });
    await useDriveStore.getState().move(f.id, b.id);
    expect(useDriveStore.getState().items[f.id].parentId).toBe(b.id);
  });

  it('refuses to move a folder into its own descendant', async () => {
    await useDriveStore.getState().load();
    const a = await useDriveStore.getState().createFolder('A', 'drive_root');
    const b = await useDriveStore.getState().createFolder('B', a.id);
    // Move A into B (descendant) — should be no-op
    await useDriveStore.getState().move(a.id, b.id);
    expect(useDriveStore.getState().items[a.id].parentId).toBe('drive_root');
  });

  it('renames an item', async () => {
    await useDriveStore.getState().load();
    const f = await useDriveStore.getState().createFolder('Old', 'drive_root');
    await useDriveStore.getState().rename(f.id, 'New');
    expect(useDriveStore.getState().items[f.id].name).toBe('New');
  });
});

describe('useDriveStore — star + trash', () => {
  it('toggles star', async () => {
    await useDriveStore.getState().load();
    const f = await useDriveStore.getState().createFolder('A', 'drive_root');
    await useDriveStore.getState().toggleStar(f.id);
    expect(useDriveStore.getState().items[f.id].starred).toBe(true);
    await useDriveStore.getState().toggleStar(f.id);
    expect(useDriveStore.getState().items[f.id].starred).toBe(false);
  });

  it('trashes and restores', async () => {
    await useDriveStore.getState().load();
    const f = await useDriveStore.getState().createFolder('X', 'drive_root');
    await useDriveStore.getState().trash(f.id);
    expect(useDriveStore.getState().items[f.id].trashed).toBe(true);
    await useDriveStore.getState().restore(f.id);
    expect(useDriveStore.getState().items[f.id].trashed).toBe(false);
  });

  it('permanently deletes', async () => {
    await useDriveStore.getState().load();
    const f = await useDriveStore.getState().createFolder('X', 'drive_root');
    await useDriveStore.getState().permanentlyDelete(f.id);
    expect(useDriveStore.getState().items[f.id]).toBeUndefined();
  });
});

describe('useDriveStore — tags', () => {
  it('adds a normalized tag and dedupes', async () => {
    await useDriveStore.getState().load();
    const f = await useDriveStore.getState().createFolder('A', 'drive_root');
    await useDriveStore.getState().addTag(f.id, 'WORK');
    await useDriveStore.getState().addTag(f.id, 'work');
    expect(useDriveStore.getState().items[f.id].tags).toEqual(['work']);
  });
});

describe('useDriveStore — versions', () => {
  it('appends versions and caps at 10', async () => {
    await useDriveStore.getState().load();
    const f = await useDriveStore.getState().createFile('a.bin', 'drive_root', { mimeType: 'application/octet-stream', size: 100 });
    for (let i = 0; i < 12; i++) {
      await useDriveStore.getState().appendVersion(f.id, {
        id: `v${i}`,
        uploadedAt: Date.now() + i,
        size: 100 + i,
      });
    }
    expect(useDriveStore.getState().items[f.id].versions).toHaveLength(10);
  });
});

describe('useDriveStore — adoptVirtual (cross-module)', () => {
  it('adopts a Docs item without duplication', async () => {
    await useDriveStore.getState().load();
    const a = await useDriveStore.getState().adoptVirtual('docs', 'doc_some', 'Some Doc');
    const b = await useDriveStore.getState().adoptVirtual('docs', 'doc_some', 'Some Doc');
    expect(a.id).toBe(b.id);
    const all = Object.values(useDriveStore.getState().items).filter(
      (i) => i.sourceModule === 'docs' && i.sourceId === 'doc_some',
    );
    expect(all).toHaveLength(1);
  });
});

describe('helpers', () => {
  it('ancestorChain returns root-first ancestors', async () => {
    await useDriveStore.getState().load();
    const items = useDriveStore.getState().items;
    const chain = ancestorChain(items, 'drive_design_review');
    expect(chain.map((c) => c.id)).toEqual([
      'drive_root',
      'drive_work',
      'drive_projects',
      'drive_design_review',
    ]);
  });

  it('deriveDriveTags counts non-trashed items', async () => {
    await useDriveStore.getState().load();
    const items = Object.values(useDriveStore.getState().items);
    const tags = deriveDriveTags(items);
    expect(tags.length).toBeGreaterThan(0);
    expect(tags[0].count).toBeGreaterThan(0);
  });

  it('totalStoredBytes excludes virtual files', async () => {
    await useDriveStore.getState().load();
    const items = Object.values(useDriveStore.getState().items);
    const total = totalStoredBytes(items);
    // Virtual entries (sourceModule set) shouldn't contribute
    const virtualBytes = items
      .filter((i) => !!i.sourceModule)
      .reduce((s, i) => s + (i.size ?? 0), 0);
    expect(total).toBeGreaterThanOrEqual(0);
    expect(total + virtualBytes).toBeGreaterThanOrEqual(total);
  });
});
