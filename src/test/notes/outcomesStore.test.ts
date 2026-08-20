/**
 * O2, O3, O9, O10 — the outcome lifecycle against a fake service.
 *
 * The assertions that matter here are about *how many requests* and *what the
 * user sees while they are in flight*, because that is where the 30-second goal
 * is won or lost, and about the `proposed` gate, because that is what makes the
 * feature usable on client material at all.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { useOutcomesStore, proposalsOf, confirmedOf } from '@/pages/notes/_hooks/use-outcomes-store';
import { setFetcher, resetFetcher } from '@/pages/notes/_lib/apiClient';
import { FakeNotesServer } from './fakeNotesServer';

const toasts = { error: vi.fn(), success: vi.fn(), plain: vi.fn() };
vi.mock('sonner', () => ({
  toast: Object.assign((...args: unknown[]) => toasts.plain(...args), {
    error: (...args: unknown[]) => toasts.error(...args),
    success: (...args: unknown[]) => toasts.success(...args),
    warning: () => undefined,
  }),
}));

vi.mock('@/auth/apiFetch', () => ({
  notesApiBlocker: () => null,
  canReachNotesApi: () => true,
  apiFetch: () => {
    throw new Error('tests must go through setFetcher');
  },
  NotAuthenticatedError: class NotAuthenticatedError extends Error {},
  NOTES_API_URL: '',
  NOTES_API_CONFIGURED: true,
}));

let server: FakeNotesServer;
const store = () => useOutcomesStore.getState();
const forNote = (noteId: string) =>
  Object.values(store().byId).filter((outcome) => outcome.noteId === noteId);

beforeEach(() => {
  server = new FakeNotesServer();
  setFetcher(server.fetcher);
  toasts.error.mockClear();
  toasts.success.mockClear();
  store().reset();
});

afterEach(() => resetFetcher());

function noteWithProposals(count: number, init: Array<Record<string, unknown>> = []) {
  const note = server.addNote({ title: 'Meeting' });
  for (let i = 0; i < count; i++) {
    server.addOutcome({
      noteId: note.id,
      text: `Proposal ${i}`,
      anchor: { quote: `sentence ${i}`, state: 'anchored' },
      ...init[i],
    });
  }
  return note;
}

describe('loading a note', () => {
  it('brings back proposals and confirmed items in one request', async () => {
    const note = noteWithProposals(2);
    server.addOutcome({ noteId: note.id, text: 'Already mine', status: 'open' });

    await store().loadForNote(note.id);

    const outcomes = forNote(note.id);
    expect(proposalsOf(outcomes)).toHaveLength(2);
    expect(confirmedOf(outcomes)).toHaveLength(1);
    expect(server.calls.filter((c) => c.startsWith('GET /v1/outcomes?'))).toHaveLength(1);
  });

  it('does not re-request a note it already holds', async () => {
    const note = noteWithProposals(1);
    await store().loadForNote(note.id);
    const before = server.calls.length;
    await store().loadForNote(note.id);
    expect(server.calls.length).toBe(before);
  });
});

describe('O2 — confirming is one action and one request', () => {
  it('confirms the whole set in a single confirm-batch call', async () => {
    const note = noteWithProposals(4);
    await store().loadForNote(note.id);
    const ids = proposalsOf(forNote(note.id)).map((p) => p.id);

    await store().confirmBatch(ids);

    expect(server.calls.filter((c) => c === 'POST /v1/outcomes/confirm-batch')).toHaveLength(1);
    // No per-item confirm sneaking in behind it.
    expect(server.calls.filter((c) => c.includes('/confirm') && !c.includes('batch'))).toHaveLength(
      0,
    );
    expect(forNote(note.id).every((o) => o.status === 'open')).toBe(true);
  });

  it('shows the rows as confirmed before the server answers', async () => {
    const note = noteWithProposals(2);
    await store().loadForNote(note.id);
    const ids = proposalsOf(forNote(note.id)).map((p) => p.id);

    // Hold the response open and look at the store mid-flight.
    let release!: () => void;
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const real = server.fetcher;
    setFetcher(async (path, init) => {
      if (path.includes('confirm-batch')) await gate;
      return real(path, init);
    });

    const pending = store().confirmBatch(ids);
    expect(forNote(note.id).every((o) => o.status === 'open')).toBe(true);
    release();
    await pending;
  });

  it('rolls the rows back and says so when the call fails', async () => {
    const note = noteWithProposals(3);
    await store().loadForNote(note.id);
    const ids = proposalsOf(forNote(note.id)).map((p) => p.id);

    server.failNext = { path: '/v1/outcomes/confirm-batch', status: 500, error: 'boom' };
    await store().confirmBatch(ids);

    expect(forNote(note.id).every((o) => o.status === 'proposed')).toBe(true);
    expect(toasts.error).toHaveBeenCalled();
  });

  it('keeps the rest when one id fails, and puts that one back', async () => {
    const note = noteWithProposals(3);
    await store().loadForNote(note.id);
    const ids = proposalsOf(forNote(note.id)).map((p) => p.id);
    // Already confirmed elsewhere: the server reports it in `failed[]`.
    server.outcomes.get(ids[1])!.status = 'open';
    server.outcomes.get(ids[1])!.confirmedAt = 1;
    // …but the client still believes it is proposed.
    useOutcomesStore.setState((s) => ({
      byId: { ...s.byId, [ids[1]]: { ...s.byId[ids[1]], status: 'proposed' } },
    }));

    const result = await store().confirmBatch(ids);

    expect(result?.confirmed).toHaveLength(2);
    expect(result?.failed).toHaveLength(1);
    expect(toasts.error).toHaveBeenCalled();
  });
});

describe('O3 — edits ride along with the confirmation', () => {
  it('sends the edits in the same call, with no patch beforehand', async () => {
    const note = noteWithProposals(2);
    await store().loadForNote(note.id);
    const ids = proposalsOf(forNote(note.id)).map((p) => p.id);
    const due = new Date(2026, 7, 15, 12).getTime();

    await store().confirmBatch(ids, [{ id: ids[0], owedBy: 'Müller', dueAt: due }]);

    expect(server.calls.filter((c) => c.startsWith('PATCH /v1/outcomes/'))).toHaveLength(0);
    const edited = server.outcomes.get(ids[0])!;
    expect(edited.owedBy).toBe('Müller');
    expect(edited.dueAt).toBe(due);
    expect(edited.status).toBe('open');
  });
});

describe('the proposed gate', () => {
  it('never lets a proposal into an open query', async () => {
    const note = noteWithProposals(2);
    await store().loadForNote(note.id);
    expect(confirmedOf(forNote(note.id))).toHaveLength(0);
  });

  it('discarding removes them without confirming anything', async () => {
    const note = noteWithProposals(2);
    await store().loadForNote(note.id);
    const ids = proposalsOf(forNote(note.id)).map((p) => p.id);

    await store().reject(ids);

    expect(forNote(note.id)).toHaveLength(0);
    expect([...server.outcomes.values()].every((o) => o.status === 'dropped')).toBe(true);
  });
});

describe('O9 — complete and undo', () => {
  it('ticks before the request lands and refreshes the roll-up after it', async () => {
    const note = server.addNote({});
    const outcome = server.addOutcome({ noteId: note.id, status: 'open', owedBy: 'me' });
    await store().loadForNote(note.id);

    await store().complete(outcome.id);

    expect(store().byId[outcome.id].status).toBe('done');
    // The badge is the server's number, so every mutation re-asks for it rather
    // than adjusting a local count.
    expect(server.calls).toContain('GET /v1/outcomes/summary');
  });

  it('reopens, which is what the toast undo does', async () => {
    const note = server.addNote({});
    const outcome = server.addOutcome({ noteId: note.id, status: 'open' });
    await store().loadForNote(note.id);

    await store().complete(outcome.id);
    await store().reopen(outcome.id);

    expect(store().byId[outcome.id].status).toBe('open');
    expect(server.outcomes.get(outcome.id)!.status).toBe('open');
  });

  it('puts the tick back when the server refuses', async () => {
    const note = server.addNote({});
    const outcome = server.addOutcome({ noteId: note.id, status: 'open' });
    await store().loadForNote(note.id);

    server.failNext = { method: 'POST', path: '/v1/outcomes/', status: 500, error: 'boom' };
    await store().complete(outcome.id);

    expect(store().byId[outcome.id].status).toBe('open');
    expect(toasts.error).toHaveBeenCalled();
  });
});

describe('O10 — a hand-written obligation', () => {
  it('is created with origin manual and is open immediately', async () => {
    const note = server.addNote({});
    await store().loadForNote(note.id);

    const created = await store().createManual(note.id, { kind: 'task', text: 'Call the client' });

    expect(created?.origin).toBe('manual');
    // The confirmation gate exists for what the model produced, not for what the
    // user typed themselves.
    expect(created?.status).toBe('open');
    expect(confirmedOf(forNote(note.id))).toHaveLength(1);
  });

  it('behaves identically thereafter', async () => {
    const note = server.addNote({});
    await store().loadForNote(note.id);
    const created = await store().createManual(note.id, { kind: 'task', text: 'Call the client' });

    await store().complete(created!.id);
    expect(store().byId[created!.id].status).toBe('done');

    await store().patch(created!.id, { owedBy: 'me' });
    expect(store().byId[created!.id].owedBy).toBe('me');
  });
});

describe('extraction', () => {
  it('absorbs the proposals it created and says when there were none', async () => {
    const note = server.addNote({});
    server.nextExtraction = [
      { text: 'Send the file', anchor: { quote: 'send the file', state: 'anchored' } },
    ];

    const result = await store().extract(note.id);

    expect(result?.outcomes).toHaveLength(1);
    expect(proposalsOf(forNote(note.id))).toHaveLength(1);

    server.nextExtraction = [];
    await store().extract(note.id);
    expect(toasts.plain).toHaveBeenCalled();
  });
});

describe('the summary belongs to the server', () => {
  it('is fetched, not computed', async () => {
    const note = server.addNote({});
    server.addOutcome({ noteId: note.id, status: 'open', owedBy: 'me', dueAt: 1 });
    server.addOutcome({ noteId: note.id, status: 'proposed' });

    await store().refreshSummary();

    expect(server.calls).toContain('GET /v1/outcomes/summary');
    expect(store().summary?.mine.open).toBe(1);
    expect(store().summary?.unconfirmed).toBe(1);
  });

  it('hides the badge rather than inventing a zero when the roll-up fails', async () => {
    server.failNext = { path: '/v1/outcomes/summary', status: 500, error: 'boom' };
    await store().refreshSummary();
    expect(store().summary).toBeNull();
  });
});
