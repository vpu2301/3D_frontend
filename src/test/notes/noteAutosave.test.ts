/**
 * F3, F4, F5 — the autosave contract.
 *
 * These assert the three things whose failure loses somebody's typing: that a
 * burst of keystrokes is one request, that leaving a note writes a restore
 * point whether or not anything changed, and that a 409 leaves the queue able
 * to save again rather than 409-ing forever.
 */

import { useEffect } from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useNoteAutosave, SAVE_DEBOUNCE_MS } from '@/pages/notes/_hooks/use-note-autosave';
import { useNotesStore, whenCorpusLoaded } from '@/pages/notes/_hooks/use-notes-store';
import { setFetcher, resetFetcher } from '@/pages/notes/_lib/apiClient';
import { FakeNotesServer } from './fakeNotesServer';

vi.mock('sonner', () => ({
  toast: Object.assign(() => undefined, {
    error: () => undefined,
    success: () => undefined,
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
const store = () => useNotesStore.getState();

const doc = (text: string) => ({
  type: 'doc',
  content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
});

beforeEach(async () => {
  server = new FakeNotesServer();
  setFetcher(server.fetcher);
  await store().clearAll();
});

afterEach(() => {
  resetFetcher();
  vi.useRealTimers();
});

function patchCalls(): string[] {
  return server.calls.filter((c) => c.startsWith('PATCH /v1/notes/'));
}

describe('F3 — a burst of typing is one PATCH', () => {
  it('coalesces 20 keystrokes in 5 s into a single request', async () => {
    vi.useFakeTimers();
    const note = server.addNote({ title: 'Draft' });
    await store().load();
    await whenCorpusLoaded();

    const { result } = renderHook(() => useNoteAutosave(note.id));

    for (let i = 0; i < 20; i++) {
      act(() => result.current.schedule(doc(`keystroke ${i}`)));
      // Faster than the debounce, so each one cancels the last.
      act(() => {
        vi.advanceTimersByTime(SAVE_DEBOUNCE_MS - 50);
      });
    }
    expect(patchCalls()).toHaveLength(0);
    expect(result.current.status).toBe('saving');

    await act(async () => {
      vi.advanceTimersByTime(SAVE_DEBOUNCE_MS);
      await vi.runOnlyPendingTimersAsync();
    });
    vi.useRealTimers();

    await waitFor(() => expect(patchCalls()).toHaveLength(1));
    // The one request that survived carries the last keystroke, not the first.
    expect(JSON.stringify(store().notes[note.id].content)).toContain('keystroke 19');
  });

  it('reports "saved" only once the server has confirmed', async () => {
    const note = server.addNote({});
    await store().load();
    const { result } = renderHook(() => useNoteAutosave(note.id));

    act(() => result.current.schedule(doc('hello')));
    expect(result.current.status).toBe('saving');

    await waitFor(() => expect(result.current.status).toBe('saved'));
    expect(result.current.savedAt).toBeGreaterThan(0);
  });
});

describe('F3 — flush writes a checkpoint', () => {
  it('sends checkpoint=true on blur and leaving the note', async () => {
    const note = server.addNote({});
    await store().load();
    const { result } = renderHook(() => useNoteAutosave(note.id));

    await act(async () => {
      await result.current.flush(doc('final sentence'));
    });

    expect(server.calls.some((c) => c.includes('checkpoint=true'))).toBe(true);
  });

  it('flushes even when nothing was typed, because the last autosave may have left no version', async () => {
    const note = server.addNote({});
    await store().load();
    const { result } = renderHook(() => useNoteAutosave(note.id));

    // No `schedule()` at all: this is the "blurred without editing" case, which
    // must still produce a restore point.
    await act(async () => {
      await result.current.flush();
    });

    expect(server.calls.some((c) => c.includes('checkpoint=true'))).toBe(true);
  });

  it('cancels the pending debounce rather than letting it fire afterwards', async () => {
    const note = server.addNote({});
    await store().load();
    const { result } = renderHook(() => useNoteAutosave(note.id));

    act(() => result.current.schedule(doc('typed')));
    await act(async () => {
      await result.current.flush(doc('typed'));
    });

    const afterFlush = patchCalls().length;
    await new Promise((resolve) => setTimeout(resolve, SAVE_DEBOUNCE_MS * 2));
    expect(patchCalls()).toHaveLength(afterFlush);
  });

  it('rejects on failure so Cmd+S cannot claim a save it did not make', async () => {
    const note = server.addNote({});
    await store().load();
    const { result } = renderHook(() => useNoteAutosave(note.id));

    server.failNext = { method: 'PATCH', status: 500, error: 'boom' };
    let caught: unknown;
    // Caught inside `act` so React still flushes the state update the rejection
    // caused — an `act` that itself rejects swallows the re-render.
    await act(async () => {
      await result.current.flush(doc('will fail')).catch((error) => {
        caught = error;
      });
    });

    expect(caught).toBeTruthy();
    expect(result.current.status).toBe('error');
  });
});

describe('F4 — patches never overlap for one note', () => {
  it('serialises two saves issued back to back', async () => {
    const note = server.addNote({});
    await store().load();

    // Both are dispatched before either resolves; the second must wait for the
    // first, or it patches from a base version the server has already moved on
    // from and 409s.
    await Promise.all([
      store().saveContent(note.id, doc('first')),
      store().saveContent(note.id, doc('second')),
    ]);

    expect(server.notes.get(note.id)!.version).toBe(3);
    expect(server.calls.filter((c) => c.includes('409'))).toHaveLength(0);
  });
});

describe('F5 — a conflict rebases rather than wedging', () => {
  it('replaces the local note and the next edit saves cleanly', async () => {
    const note = server.addNote({});
    await store().load();

    // Something else writes the note, so the store's stored version is stale.
    const remote = server.notes.get(note.id)!;
    remote.version += 1;
    remote.content = doc('changed elsewhere');

    await store().saveContent(note.id, doc('my edit'));

    // Server won: the local copy is the server's, at the server's version.
    expect(store().notes[note.id].version).toBe(remote.version);
    expect(JSON.stringify(store().notes[note.id].content)).toContain('changed elsewhere');

    // And the queue is not wedged — the next edit lands.
    await store().saveContent(note.id, doc('my second edit'));
    expect(JSON.stringify(store().notes[note.id].content)).toContain('my second edit');
  });
});

describe('the save indicator is truthful', () => {
  it('seeds from the note updatedAt rather than claiming a save this session made', async () => {
    const note = server.addNote({});
    await store().load();
    const { result } = renderHook(() => useNoteAutosave(note.id));
    expect(result.current.savedAt).toBe(store().notes[note.id].updatedAt);
  });

  it('offers a retry that re-sends the document that failed', async () => {
    const note = server.addNote({});
    await store().load();
    const { result } = renderHook(() => useNoteAutosave(note.id));

    server.failNext = { method: 'PATCH', status: 500, error: 'boom' };
    act(() => result.current.schedule(doc('important')));
    await waitFor(() => expect(result.current.status).toBe('error'));

    await act(async () => {
      await result.current.retry();
    });

    expect(result.current.status).toBe('saved');
    expect(JSON.stringify(store().notes[note.id].content)).toContain('important');
  });
});

/**
 * The regression this file exists for as much as any contract above.
 *
 * `NoteEditor` flushes on unmount from an effect cleanup. When that effect
 * depended on the whole `autosave` object, a completed save moved `savedAt`,
 * which changed the object's identity, which re-ran the cleanup, which flushed
 * again — two PATCHes per turn until the service answered 429. One click into a
 * note was enough to reach the sixty-a-minute per-user limit.
 *
 * The invariant that makes such an effect safe is that the callbacks keep their
 * identity across a save. Assert that, and assert the loop itself is gone.
 */
describe('a completed save cannot re-trigger the effects that caused it', () => {
  it('keeps flush stable across a save, so a cleanup keyed on it fires once', async () => {
    const note = server.addNote({});
    await store().load();

    const seen: Array<() => unknown> = [];
    const cleanups: number[] = [];
    const { result, rerender } = renderHook(() => {
      const autosave = useNoteAutosave(note.id);
      const { flush } = autosave;
      seen.push(flush);
      useEffect(
        () => () => {
          cleanups.push(1);
          void flush(doc('leaving')).catch(() => undefined);
        },
        [flush],
      );
      return autosave;
    });

    await act(async () => {
      await result.current.flush(doc('typed'));
    });
    const afterFlush = patchCalls().length;

    // The save landed and the indicator moved...
    expect(result.current.status).toBe('saved');
    // ...but every render saw the same `flush`, so the cleanup never ran.
    expect(new Set(seen).size).toBe(1);
    expect(cleanups).toHaveLength(0);

    // And nothing arrives after the fact: no second flush, no third.
    rerender();
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, SAVE_DEBOUNCE_MS * 3));
    });
    expect(patchCalls()).toHaveLength(afterFlush);
  });

  it('stays inside the per-user request budget for a flush', async () => {
    const note = server.addNote({});
    await store().load();
    const before = patchCalls().length;
    const { result } = renderHook(() => useNoteAutosave(note.id));

    await act(async () => {
      await result.current.flush(doc('one edit'));
    });

    // Exactly the content save and its checkpoint. The loop produced these two
    // over and over; the count is the assertion.
    expect(patchCalls().length - before).toBe(2);
  });
});
