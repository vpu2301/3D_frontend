import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  useNotesStore,
  SMART_VIEWS,
  isTempId,
  whenCorpusLoaded,
} from '@/pages/notes/_hooks/use-notes-store';
import { setFetcher, resetFetcher } from '@/pages/notes/_lib/apiClient';
import { FakeNotesServer } from './fakeNotesServer';

// The store reports failures through `sonner`; assert on the calls rather than
// rendering a toaster.
const toasts = { error: vi.fn(), success: vi.fn(), warning: vi.fn() };
vi.mock('sonner', () => ({
  toast: Object.assign((...args: unknown[]) => toasts.success(...args), {
    error: (...args: unknown[]) => toasts.error(...args),
    success: (...args: unknown[]) => toasts.success(...args),
    warning: (...args: unknown[]) => toasts.warning(...args),
  }),
}));

// `notesApiBlocker()` reads the base URL and Pincer auth out of the
// environment; the fake server does not care about the credential, only that
// the store believes it has one.
vi.mock('@/auth/apiFetch', () => ({
  notesApiBlocker: () => null,
  canReachNotesApi: () => true,
  apiFetch: () => {
    throw new Error('tests must go through setFetcher');
  },
  // `errors.ts` does an `instanceof` against this, so the mock has to provide
  // it — an undefined right-hand side throws a TypeError inside every toast.
  NotAuthenticatedError: class NotAuthenticatedError extends Error {},
  NOTES_API_URL: '',
  NOTES_API_CONFIGURED: true,
}));

let server: FakeNotesServer;
const store = () => useNotesStore.getState();

beforeEach(async () => {
  server = new FakeNotesServer();
  setFetcher(server.fetcher);
  toasts.error.mockClear();
  toasts.success.mockClear();
  await store().clearAll();
});

afterEach(() => {
  resetFetcher();
});

describe('load', () => {
  it('loads notebooks plus both active and trashed notes', async () => {
    server.addNotebook('Work');
    server.addNote({ title: 'Active' });
    server.addNote({ title: 'Gone', trashed: true });

    await store().load();
    // The trash arrives behind the first paint, so this is what "loaded"
    // eventually means rather than what it means at the first render.
    await whenCorpusLoaded();

    const notes = Object.values(store().notes);
    expect(notes).toHaveLength(2);
    expect(notes.filter((n) => n.trashed)).toHaveLength(1);
    expect(Object.values(store().notebooks)).toHaveLength(1);
    expect(store().loaded).toBe(true);
  });

  it('paints the first page without waiting for the corpus', async () => {
    for (let i = 0; i < 250; i++) server.addNote({ title: `Note ${i}` });

    await store().load();

    // `load()` resolved on one page: the list is on screen while the rest is
    // still arriving. That is the whole point of the two-movement load.
    expect(store().loaded).toBe(true);
    expect(Object.keys(store().notes).length).toBeLessThan(250);
    expect(store().fullyLoaded).toBe(false);
    expect(store().total).toBe(250);
  });

  it('follows nextCursor until the corpus is exhausted', async () => {
    // Smart views and tag counts are computed over the whole map, so a partial
    // load would make them quietly wrong.
    for (let i = 0; i < 250; i++) server.addNote({ title: `Note ${i}` });

    await store().load();
    await whenCorpusLoaded();

    expect(Object.keys(store().notes)).toHaveLength(250);
    expect(store().fullyLoaded).toBe(true);
    const listCalls = server.calls.filter((c) => c.startsWith('GET /v1/notes?'));
    expect(listCalls.length).toBeGreaterThan(2);
  });

  it('loadMore and the background pass never fetch the same cursor twice', async () => {
    for (let i = 0; i < 250; i++) server.addNote({ title: `Note ${i}` });

    await store().load();
    // The scroll sentinel firing while the background pass is mid-page is the
    // race that would otherwise skip a page and leave a hole in the list.
    await Promise.all([store().loadMore(), store().loadMore(), whenCorpusLoaded()]);

    const ids = Object.keys(store().notes);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toHaveLength(250);
  });

  it('requests full content, not just snippets', async () => {
    server.addNote({ title: 'A' });
    await store().load();
    expect(server.calls.some((c) => c.includes('include=content'))).toBe(true);
    expect(Object.values(store().notes)[0].content).toBeDefined();
  });

  it('surfaces a load failure instead of showing an empty workspace', async () => {
    server.failNext = { path: '/v1/notebooks', status: 500, error: 'boom' };
    await store().load();
    expect(store().loaded).toBe(false);
    expect(store().loadError).toContain('forced boom');
  });

  it('does not reload once loaded', async () => {
    server.addNote({});
    await store().load();
    const before = server.calls.length;
    await store().load();
    expect(server.calls.length).toBe(before);
  });
});

describe('createNote', () => {
  it('shows a temp note immediately and swaps in the server id', async () => {
    await store().load();
    const created = await store().createNote({ title: 'New' });

    expect(isTempId(created.id)).toBe(false);
    expect(store().notes[created.id]).toBeDefined();
    // No orphan temp entry left behind.
    expect(Object.keys(store().notes).filter(isTempId)).toHaveLength(0);
    expect(created.version).toBe(1);
  });

  it('drops the temp note and toasts when creation fails', async () => {
    await store().load();
    server.failNext = { method: 'POST', path: '/v1/notes', status: 500, error: 'nope' };

    await expect(store().createNote({ title: 'Doomed' })).rejects.toThrow();
    expect(Object.keys(store().notes)).toHaveLength(0);
    expect(toasts.error).toHaveBeenCalled();
  });
});

describe('updateNote', () => {
  it('sends the stored version as baseVersion and absorbs the new one', async () => {
    const note = server.addNote({ title: 'One' });
    await store().load();
    expect(store().notes[note.id].version).toBe(1);

    await store().updateNote(note.id, { title: 'Two' });

    expect(store().notes[note.id].title).toBe('Two');
    expect(store().notes[note.id].version).toBe(2);

    // The next patch must use the *new* version, or it is a guaranteed 409.
    await store().updateNote(note.id, { title: 'Three' });
    expect(store().notes[note.id].title).toBe('Three');
    expect(store().notes[note.id].version).toBe(3);
  });

  it('serialises concurrent patches to one note', async () => {
    const note = server.addNote({ title: 'Start' });
    await store().load();

    // Fired together from the same base version: without per-note queueing the
    // second would race the first and 409.
    await Promise.all([
      store().updateNote(note.id, { title: 'A' }),
      store().updateNote(note.id, { title: 'B' }),
    ]);

    expect(store().notes[note.id].version).toBe(3);
    expect(toasts.error).not.toHaveBeenCalled();
  });

  it('replaces the local note with the server copy on a 409', async () => {
    const note = server.addNote({ title: 'Local' });
    await store().load();

    // Somebody else wrote to the note; our stored version is now stale.
    const remote = server.notes.get(note.id)!;
    remote.title = 'Written elsewhere';
    remote.version = 9;

    await store().updateNote(note.id, { title: 'Mine' });

    expect(store().notes[note.id].title).toBe('Written elsewhere');
    expect(store().notes[note.id].version).toBe(9);
    expect(toasts.error).toHaveBeenCalledWith(
      'Note was updated elsewhere',
      expect.objectContaining({ description: expect.any(String) }),
    );
  });

  it('rolls back and toasts on a non-conflict failure', async () => {
    const note = server.addNote({ title: 'Keep me' });
    await store().load();
    server.failNext = { method: 'PATCH', status: 500, error: 'server_down' };

    await expect(store().updateNote(note.id, { title: 'Lost' })).rejects.toThrow();

    expect(store().notes[note.id].title).toBe('Keep me');
    expect(toasts.error).toHaveBeenCalled();
  });
});

describe('saveContent', () => {
  it('merges inline #tags found in the content', async () => {
    const note = server.addNote({ tags: ['existing'] });
    await store().load();

    await store().saveContent(note.id, {
      type: 'doc',
      content: [{ type: 'paragraph', content: [{ type: 'text', text: 'about #product' }] }],
    });

    expect(store().notes[note.id].tags).toEqual(['existing', 'product']);
  });
});

describe('trash', () => {
  it('trashes through DELETE and unpins', async () => {
    const note = server.addNote({ pinned: true });
    await store().load();

    await store().trashNote(note.id);

    expect(store().notes[note.id].trashed).toBe(true);
    expect(store().notes[note.id].pinned).toBe(false);
    expect(server.calls).toContain(`DELETE /v1/notes/${note.id}`);
  });

  it('deleteNote trashes rather than purging — there is no per-note purge', async () => {
    const note = server.addNote({});
    await store().load();

    await store().deleteNote(note.id);

    expect(store().notes[note.id]).toBeDefined();
    expect(store().notes[note.id].trashed).toBe(true);
  });

  it('emptyTrash removes every trashed note locally and on the server', async () => {
    server.addNote({ title: 'live' });
    server.addNote({ title: 'dead', trashed: true });
    await store().load();
    await whenCorpusLoaded();

    await store().emptyTrash();

    expect(Object.values(store().notes)).toHaveLength(1);
    expect(server.calls).toContain('DELETE /v1/trash');
  });

  it('restores a trashed note', async () => {
    const note = server.addNote({ trashed: true });
    await store().load();
    await whenCorpusLoaded();
    await store().restoreNote(note.id);
    expect(store().notes[note.id].trashed).toBe(false);
  });
});

describe('togglePin', () => {
  it('reconciles the server\'s silent cap of five instead of guessing locally', async () => {
    const ids = Array.from({ length: 6 }, () => server.addNote({}).id);
    await store().load();

    for (const id of ids) await store().togglePin(id);

    const pinned = Object.values(store().notes).filter((n) => n.pinned);
    expect(pinned).toHaveLength(5);
    // The sixth attempt was refused by the server, and the optimistic guess was
    // corrected rather than left showing a pin that does not exist.
    expect(store().notes[ids[5]].pinned).toBe(false);
  });
});

describe('tags', () => {
  it('adds through the dedicated endpoint, lowercased and deduped', async () => {
    const note = server.addNote({});
    await store().load();

    await store().addTag(note.id, 'WORK');
    await store().addTag(note.id, 'work');

    expect(store().notes[note.id].tags).toEqual(['work']);
    expect(server.calls.filter((c) => c === `PUT /v1/notes/${note.id}/tags`)).toHaveLength(1);
  });

  it('removes a tag', async () => {
    const note = server.addNote({ tags: ['a', 'b'] });
    await store().load();
    await store().removeTag(note.id, 'a');
    expect(store().notes[note.id].tags).toEqual(['b']);
  });

  it('accepting a suggestion promotes it and drops it from the suggestions', async () => {
    const note = server.addNote({ suggestedTags: ['meeting', 'q2'] });
    await store().load();

    await store().acceptSuggestedTag(note.id, 'meeting');

    expect(store().notes[note.id].tags).toContain('meeting');
    expect(store().notes[note.id].suggestedTags).toEqual(['q2']);
  });
});

describe('links', () => {
  it('adds a link once and skips duplicates', async () => {
    const note = server.addNote({});
    await store().load();

    await store().addLink(note.id, { type: 'doc', targetId: 'doc_x', label: 'X' });
    await store().addLink(note.id, { type: 'doc', targetId: 'doc_x', label: 'X' });

    expect(store().notes[note.id].links).toHaveLength(1);
    expect(server.calls.filter((c) => c.includes('/links'))).toHaveLength(1);
  });

  it('removes a link', async () => {
    const note = server.addNote({ links: [{ type: 'doc', targetId: 'doc_x' }] });
    await store().load();
    await store().removeLink(note.id, 'doc', 'doc_x');
    expect(store().notes[note.id].links).toHaveLength(0);
  });
});

describe('reminders', () => {
  it('creates a reminder with no calendar id yet — the mirror fills it in', async () => {
    const note = server.addNote({});
    await store().load();

    const reminder = await store().addReminder(note.id, 1_800_000_000_000, 'Room 2');

    // The mock used to fabricate `cal_mock_…` here, which made an
    // unmirrored reminder look mirrored.
    expect(reminder.calendarEventId).toBeNull();
    expect(reminder.location).toBe('Room 2');
    expect(store().notes[note.id].reminders).toHaveLength(1);
  });

  it('dismisses a reminder', async () => {
    const note = server.addNote({});
    await store().load();
    const reminder = await store().addReminder(note.id, 1_800_000_000_000);

    await store().dismissReminder(note.id, reminder.id);

    expect(store().notes[note.id].reminders[0].dismissed).toBe(true);
    expect(server.calls).toContain(`PATCH /v1/reminders/${reminder.id}`);
  });
});

describe('ensureDailyNote', () => {
  it('is idempotent — the server owns one-per-day', async () => {
    await store().load();
    const a = await store().ensureDailyNote();
    const b = await store().ensureDailyNote();

    expect(b.id).toBe(a.id);
    expect(a.daily).toBe(true);
    expect(server.notes.size).toBe(1);
  });
});

describe('F14 — the daily note is one note', () => {
  it('stays one note under ten concurrent opens', async () => {
    await store().load();

    const notes = await Promise.all(
      Array.from({ length: 10 }, () => store().ensureDailyNote()),
    );

    // The old client-side "scan the map for today's daily" could produce one
    // note per tab whenever the map was only partly loaded. The server owns
    // one-per-(owner, date), so ten calls resolve to one row.
    expect(new Set(notes.map((n) => n.id)).size).toBe(1);
    expect([...server.notes.values()].filter((n) => n.daily)).toHaveLength(1);
  });
});

describe('checkpoint', () => {
  it('forces a version row', async () => {
    const note = server.addNote({});
    await store().load();

    await store().checkpoint(note.id);

    expect(server.calls.some((c) => c.includes('checkpoint=true'))).toBe(true);
  });

  it('stays silent on failure — a lost restore point is not lost data', async () => {
    const note = server.addNote({});
    await store().load();
    server.failNext = { method: 'PATCH', status: 500, error: 'nope' };

    await expect(store().checkpoint(note.id)).resolves.toBeUndefined();
    expect(toasts.error).not.toHaveBeenCalled();
  });
});

describe('notebooks', () => {
  it('creates, renames and deletes, re-parenting notes on delete', async () => {
    const nb = server.addNotebook('Work');
    server.addNote({ notebookId: nb.id });
    await store().load();

    const created = await store().createNotebook('Personal');
    expect(store().notebooks[created.id]).toBeDefined();

    await store().renameNotebook(nb.id, 'Client work');
    expect(store().notebooks[nb.id].name).toBe('Client work');

    await store().deleteNotebook(nb.id);
    expect(store().notebooks[nb.id]).toBeUndefined();
    expect(Object.values(store().notes).every((n) => n.notebookId !== nb.id)).toBe(true);
  });
});

describe('SMART_VIEWS', () => {
  it('open-tasks matches notes with an unchecked task item', async () => {
    server.addNote({
      title: 'With tasks',
      content: {
        type: 'doc',
        content: [
          {
            type: 'taskList',
            content: [
              { type: 'taskItem', attrs: { checked: false }, content: [{ type: 'paragraph' }] },
            ],
          },
        ],
      },
    });
    server.addNote({ title: 'Plain' });
    await store().load();

    const view = SMART_VIEWS.find((v) => v.id === 'open-tasks')!;
    const matched = Object.values(store().notes).filter((n) => !n.trashed && view.predicate(n));

    expect(matched).toHaveLength(1);
    expect(matched[0].title).toBe('With tasks');
  });
});
