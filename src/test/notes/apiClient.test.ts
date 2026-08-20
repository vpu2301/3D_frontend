/**
 * Contract edges of the Notes API client — the places where the server's shape
 * and the store's expectations do not line up on their own.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  notesApi,
  setFetcher,
  resetFetcher,
  NotesApiError,
  VersionConflictError,
  GraphTooLargeError,
} from '@/pages/notes/_lib/apiClient';
import { FakeNotesServer } from './fakeNotesServer';

vi.mock('@/auth/apiFetch', () => ({
  apiFetch: () => {
    throw new Error('tests must go through setFetcher');
  },
  NOTES_API_URL: '',
}));

let server: FakeNotesServer;
/** The last request body the client sent — the fake server records only paths. */
let lastBody: string | null = null;

beforeEach(() => {
  server = new FakeNotesServer();
  lastBody = null;
  setFetcher((path, init) => {
    if (init?.body) lastBody = String(init.body);
    return server.fetcher(path, init);
  });
});

afterEach(() => {
  resetFetcher();
});

describe('note normalisation', () => {
  it('gives a snippet-only list row an empty doc rather than undefined content', async () => {
    // Every consumer indexes into `note.content`; a list fetched without
    // `include=content` would otherwise hand TipTap `undefined`.
    server.addNote({ title: 'A' });
    const page = await notesApi.list();
    expect(page.items[0].content).toEqual({ type: 'doc', content: [{ type: 'paragraph' }] });
    expect(page.items[0].snippet).toBe('server snippet');
  });

  it('defaults the collection fields the wire may omit', async () => {
    setFetcher(async () =>
      new Response(
        JSON.stringify({ id: 'n1', version: 1, createdAt: 0, updatedAt: 0, pinned: false, trashed: false }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      ),
    );
    const note = await notesApi.get('n1');
    expect(note.tags).toEqual([]);
    expect(note.links).toEqual([]);
    expect(note.reminders).toEqual([]);
  });
});

describe('listAll', () => {
  it('follows every cursor', async () => {
    for (let i = 0; i < 45; i++) server.addNote({ title: `n${i}` });
    const all = await notesApi.listAll({}, 10);
    expect(all).toHaveLength(45);
  });

  it('stops rather than spinning if the server keeps handing back a cursor', async () => {
    // A server bug must not become a browser that never stops fetching.
    let calls = 0;
    setFetcher(async () => {
      calls += 1;
      return new Response(
        JSON.stringify({
          items: [{ id: `n${calls}`, version: 1, createdAt: 0, updatedAt: 0, pinned: false, trashed: false }],
          nextCursor: 'always',
          total: 9999,
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } },
      );
    });

    const all = await notesApi.listAll();
    expect(all).toHaveLength(100);
    expect(calls).toBe(100);
  });
});

describe('payload whitelisting', () => {
  it('drops fields `NoteCreateIn` does not accept', async () => {
    // Sending `id`, `links`, `reminders` or `version` is a 422 on the real
    // service, and the store's optimistic note has all of them.
    await notesApi.create({
      id: 'tmp_local',
      title: 'Real',
      tags: ['a'],
      version: 7,
      links: [{ type: 'note', targetId: 'x' }],
      reminders: [],
      createdAt: 1,
      updatedAt: 2,
    } as never);

    expect(server.calls).toContain('POST /v1/notes');
    expect(Object.keys(JSON.parse(lastBody!)).sort()).toEqual(['tags', 'title']);
  });

  it('drops the same fields from a patch envelope', async () => {
    const note = server.addNote({});
    await notesApi.patch(note.id, { title: 'x', version: 9, createdAt: 1 } as never, note.version);
    expect(JSON.parse(lastBody!)).toEqual({ patch: { title: 'x' }, baseVersion: 1 });
  });
});

describe('error mapping', () => {
  it('maps 409 to VersionConflictError carrying the server note', async () => {
    const note = server.addNote({ title: 'Server copy' });
    server.notes.get(note.id)!.version = 5;

    const error = await notesApi.patch(note.id, { title: 'Mine' }, 1).catch((e) => e);

    expect(error).toBeInstanceOf(VersionConflictError);
    expect((error as VersionConflictError).serverNote.title).toBe('Server copy');
    expect((error as VersionConflictError).serverNote.version).toBe(5);
  });

  it('maps 413 on the graph to GraphTooLargeError', async () => {
    setFetcher(async () =>
      new Response(
        JSON.stringify({ error: 'graph_too_large', message: '900 notes exceed the 500-node limit.' }),
        { status: 413, headers: { 'Content-Type': 'application/json' } },
      ),
    );

    const error = await notesApi.graph().catch((e) => e);
    expect(error).toBeInstanceOf(GraphTooLargeError);
    expect((error as GraphTooLargeError).message).toContain('500-node limit');
  });

  it('carries status, code and requestId on an ordinary failure', async () => {
    setFetcher(async () =>
      new Response(JSON.stringify({ error: 'not_found', message: 'gone', requestId: 'req-9' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const error = await notesApi.get('missing').catch((e) => e);
    expect(error).toBeInstanceOf(NotesApiError);
    expect((error as NotesApiError).status).toBe(404);
    expect((error as NotesApiError).code).toBe('not_found');
    expect((error as NotesApiError).requestId).toBe('req-9');
  });

  it('treats a 204 as a successful empty result', async () => {
    const note = server.addNote({});
    await expect(notesApi.setSortIndex(note.id, 3)).resolves.toBeUndefined();
    expect(server.notes.get(note.id)!.sortIndex).toBe(3);
  });
});

describe('query building', () => {
  it('omits undefined and empty params', async () => {
    await notesApi.list({ q: '', tag: undefined, trashed: false, include: 'content' });
    const call = server.calls.find((c) => c.startsWith('GET /v1/notes?'))!;
    expect(call).not.toContain('q=');
    expect(call).not.toContain('tag=');
    expect(call).toContain('trashed=false');
    expect(call).toContain('include=content');
  });

  it('joins link-candidate types into one param', async () => {
    setFetcher(async (path) => {
      expect(path).toContain('types=note%2Cdoc');
      return new Response('[]', { status: 200, headers: { 'Content-Type': 'application/json' } });
    });
    await notesApi.linkCandidates('q', { types: ['note', 'doc'] });
  });
});

describe('export', () => {
  it('returns the server-rendered Markdown as text', async () => {
    const note = server.addNote({ title: 'Exported' });
    await expect(notesApi.exportMarkdown(note.id)).resolves.toBe('# Exported\n');
  });
});
