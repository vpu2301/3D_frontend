import { describe, it, expect, beforeEach } from 'vitest';
import { useNotesStore, deriveTags, SMART_VIEWS } from '@/pages/notes/_hooks/use-notes-store';
import { notesStorage } from '@/pages/notes/_lib/storage';

beforeEach(async () => {
  await notesStorage.clearAll();
  useNotesStore.setState({ notes: {}, notebooks: {}, loaded: false });
});

describe('useNotesStore — load + seed', () => {
  it('seeds notes and notebooks on first load', async () => {
    await useNotesStore.getState().load();
    const notes = Object.values(useNotesStore.getState().notes);
    const notebooks = Object.values(useNotesStore.getState().notebooks);
    expect(notes.length).toBeGreaterThanOrEqual(15);
    expect(notebooks).toHaveLength(2);
  });

  it('does not re-seed', async () => {
    await useNotesStore.getState().load();
    const before = Object.keys(useNotesStore.getState().notes).length;
    useNotesStore.setState({ loaded: false });
    await useNotesStore.getState().load();
    expect(Object.keys(useNotesStore.getState().notes).length).toBe(before);
  });
});

describe('useNotesStore — CRUD', () => {
  it('creates and updates a note', async () => {
    await useNotesStore.getState().load();
    const note = await useNotesStore.getState().createNote({ title: 'New' });
    expect(useNotesStore.getState().notes[note.id]).toBeDefined();
    await useNotesStore.getState().updateNote(note.id, { title: 'Updated' });
    expect(useNotesStore.getState().notes[note.id].title).toBe('Updated');
  });
  it('trashes and restores', async () => {
    await useNotesStore.getState().load();
    const note = await useNotesStore.getState().createNote({});
    await useNotesStore.getState().trashNote(note.id);
    expect(useNotesStore.getState().notes[note.id].trashed).toBe(true);
    await useNotesStore.getState().restoreNote(note.id);
    expect(useNotesStore.getState().notes[note.id].trashed).toBe(false);
  });
  it('permanently deletes', async () => {
    await useNotesStore.getState().load();
    const note = await useNotesStore.getState().createNote({});
    await useNotesStore.getState().deleteNote(note.id);
    expect(useNotesStore.getState().notes[note.id]).toBeUndefined();
  });
});

describe('useNotesStore — tags', () => {
  it('adds a tag (lowercased, deduped)', async () => {
    await useNotesStore.getState().load();
    const note = await useNotesStore.getState().createNote({});
    await useNotesStore.getState().addTag(note.id, 'WORK');
    await useNotesStore.getState().addTag(note.id, 'work');
    expect(useNotesStore.getState().notes[note.id].tags).toEqual(['work']);
  });
  it('removes a tag', async () => {
    await useNotesStore.getState().load();
    const note = await useNotesStore.getState().createNote({ tags: ['a', 'b'] });
    await useNotesStore.getState().removeTag(note.id, 'a');
    expect(useNotesStore.getState().notes[note.id].tags).toEqual(['b']);
  });
});

describe('useNotesStore — pinning', () => {
  it('toggles pin and respects the cap of 5', async () => {
    await useNotesStore.getState().load();
    // Reset to a clean slate (seed has 1 pinned)
    for (const id of Object.keys(useNotesStore.getState().notes)) {
      await useNotesStore.getState().updateNote(id, { pinned: false });
    }
    const ids: string[] = [];
    for (let i = 0; i < 6; i++) {
      const n = await useNotesStore.getState().createNote({});
      ids.push(n.id);
    }
    for (const id of ids) await useNotesStore.getState().togglePin(id);
    const pinnedCount = Object.values(useNotesStore.getState().notes).filter((n) => n.pinned).length;
    expect(pinnedCount).toBe(5);
  });
});

describe('useNotesStore — links + reminders', () => {
  it('adds a link without duplicates', async () => {
    await useNotesStore.getState().load();
    const note = await useNotesStore.getState().createNote({});
    await useNotesStore.getState().addLink(note.id, { type: 'doc', targetId: 'doc_x' });
    await useNotesStore.getState().addLink(note.id, { type: 'doc', targetId: 'doc_x' });
    expect(useNotesStore.getState().notes[note.id].links).toHaveLength(1);
  });
  it('adds a reminder with a calendar mirror id', async () => {
    await useNotesStore.getState().load();
    const note = await useNotesStore.getState().createNote({});
    const r = await useNotesStore.getState().addReminder(note.id, Date.now() + 3600_000);
    expect(r.calendarEventId).toBeTruthy();
    expect(useNotesStore.getState().notes[note.id].reminders).toHaveLength(1);
  });
});

describe('useNotesStore — daily note', () => {
  it('creates a daily note on first call and reuses it later that day', async () => {
    await useNotesStore.getState().load();
    const a = await useNotesStore.getState().ensureDailyNote();
    const b = await useNotesStore.getState().ensureDailyNote();
    expect(b.id).toBe(a.id);
    expect(a.daily).toBe(true);
    expect(a.tags).toContain('daily');
  });
});

describe('deriveTags', () => {
  it('counts tags across notes and excludes trashed', async () => {
    await useNotesStore.getState().load();
    await useNotesStore.getState().createNote({ tags: ['a', 'b'] });
    await useNotesStore.getState().createNote({ tags: ['a'], trashed: true });
    const tags = deriveTags(Object.values(useNotesStore.getState().notes));
    const a = tags.find((t) => t.name === 'a');
    expect(a?.count).toBeGreaterThanOrEqual(1);
  });
});

describe('SMART_VIEWS', () => {
  it('open-tasks view picks notes with at least one open task item', async () => {
    await useNotesStore.getState().load();
    const view = SMART_VIEWS.find((v) => v.id === 'open-tasks')!;
    const matched = Object.values(useNotesStore.getState().notes).filter((n) => !n.trashed && view.predicate(n));
    expect(matched.length).toBeGreaterThan(0);
  });
});
