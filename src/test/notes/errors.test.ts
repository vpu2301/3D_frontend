/**
 * §6 — errors are legible.
 *
 * The failure this guards against is not a crash; it is a toast that says
 * `{"error":"budget_exhausted"}` and leaves both the user and support with
 * nothing to do. Every branch here is "what does the person actually see, and
 * can support find this request in the log afterwards".
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NotesApiError, VersionConflictError, onSessionExpired } from '@/pages/notes/_lib/apiClient';
import { explainError, reportError, supportDetails } from '@/pages/notes/_lib/errors';
import { setFetcher, resetFetcher, notesApi } from '@/pages/notes/_lib/apiClient';

const toasts = { error: vi.fn(), success: vi.fn(), warning: vi.fn() };
vi.mock('sonner', () => ({
  toast: Object.assign((...args: unknown[]) => toasts.success(...args), {
    error: (...args: unknown[]) => toasts.error(...args),
    success: (...args: unknown[]) => toasts.success(...args),
    warning: (...args: unknown[]) => toasts.warning(...args),
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

beforeEach(() => {
  toasts.error.mockClear();
});

/** A Response-alike with the headers the client reads. */
function response(status: number, body: unknown, headers: Record<string, string> = {}) {
  return {
    status,
    ok: status < 400,
    headers: { get: (name: string) => headers[name] ?? null },
    json: async () => body,
    text: async () => JSON.stringify(body),
  } as unknown as Response;
}

describe('a code becomes a sentence', () => {
  it('maps a known code instead of showing it', () => {
    const friendly = explainError(
      new NotesApiError(402, 'budget_exhausted', 'budget_exhausted', 'req-1'),
    );
    expect(friendly.title).toBe("Today's AI budget is spent");
    expect(friendly.description).not.toContain('budget_exhausted');
    expect(friendly.requestId).toBe('req-1');
  });

  it('falls back to the server sentence, never to the JSON body', () => {
    const friendly = explainError(
      new NotesApiError(400, 'unmapped_thing', 'The title is too long.', 'req-2', {
        raw: 'body',
      }),
    );
    expect(friendly.description).toBe('The title is too long.');
    expect(friendly.description).not.toContain('{');
  });

  it('says how long to wait on a 429', () => {
    const friendly = explainError(
      new NotesApiError(429, 'rate_limited', 'slow down', 'req-3', null, 30),
    );
    expect(friendly.retryAfter).toBe(30);
    expect(friendly.description).toContain('30 second');
  });

  it('names the network rather than blaming the note', () => {
    expect(explainError(new TypeError('Failed to fetch')).title).toMatch(/could not reach/i);
  });

  it('produces one copyable support string', () => {
    const details = supportDetails(new NotesApiError(500, 'internal', 'boom', 'req-9'));
    expect(details).toContain('500 internal');
    expect(details).toContain('requestId req-9');
  });
});

describe('401 and 403 are handled by the dialog, not a toast', () => {
  it('does not toast an auth failure', () => {
    reportError(new NotesApiError(401, 'unauthorized', 'nope', 'req-4'));
    expect(toasts.error).not.toHaveBeenCalled();
  });

  it('toasts everything else', () => {
    reportError(new NotesApiError(500, 'internal', 'boom', 'req-5'));
    expect(toasts.error).toHaveBeenCalledTimes(1);
  });

  it('notifies the session listener from the client, whatever the caller was doing', async () => {
    const seen: number[] = [];
    const unsubscribe = onSessionExpired((status) => seen.push(status));
    setFetcher(async () => response(401, { error: 'unauthorized', message: 'nope' }));

    await notesApi.get('any-id').catch(() => undefined);

    expect(seen).toEqual([401]);
    unsubscribe();
    resetFetcher();
  });
});

describe('a conflict is not an error to swallow', () => {
  it('carries the server note and reads as a refresh, not a failure', () => {
    const serverNote = { id: 'n1', version: 7 } as never;
    const friendly = explainError(new VersionConflictError(serverNote, 'req-6'));
    expect(friendly.title).toMatch(/changed elsewhere/i);
    expect(friendly.isAuth).toBe(false);
  });
});

describe('Retry-After survives the client', () => {
  it('is parsed off the response, not guessed', async () => {
    setFetcher(async () =>
      response(429, { error: 'rate_limited', message: 'slow down' }, { 'Retry-After': '12' }),
    );

    const error = await notesApi.get('any-id').catch((e) => e);
    expect(error).toBeInstanceOf(NotesApiError);
    expect((error as NotesApiError).retryAfter).toBe(12);
    resetFetcher();
  });
});
