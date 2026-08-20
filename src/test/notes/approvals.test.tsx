/**
 * A8, A9 and A11 — the approval path.
 *
 * The one that matters most is A9. Silently applying a diff computed against a
 * base that has since moved is the worst outcome this UI can produce: it is a
 * wrong edit to a client matter, made by a machine, that nobody saw happen.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ApprovalCard from '@/pages/notes/_components/ai/ApprovalCard';
import {
  useApprovalsStore,
  __resetApprovalPolling,
  APPROVAL_POLL_MS,
  type PendingApproval,
} from '@/pages/notes/_hooks/use-approvals-store';
import { setFetcher, resetFetcher } from '@/pages/notes/_lib/apiClient';

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

vi.mock('sonner', () => ({
  toast: Object.assign(() => undefined, {
    error: () => undefined,
    success: () => undefined,
    warning: () => undefined,
  }),
}));

const APPROVAL: PendingApproval = {
  actionId: 'a1',
  tool: 'update_note',
  input: { noteId: 'n1', body: 'after' },
  explanation: 'Adds the deadline you mentioned.',
  noteId: 'n1',
  noteTitle: 'Mandat Weber',
  costUsd: 0.004,
  diff: { before: 'line one\nline two', after: 'line one\nline two changed' },
};

interface Call {
  path: string;
  method: string;
  body: unknown;
}

let calls: Call[] = [];

/** Routes the few endpoints the store touches; everything else 404s loudly. */
function server(handlers: Record<string, () => Response>) {
  return async (path: string, init: RequestInit = {}) => {
    calls.push({
      path,
      method: init.method ?? 'GET',
      body: init.body ? JSON.parse(String(init.body)) : undefined,
    });
    const key = `${init.method ?? 'GET'} ${path.split('?')[0]}`;
    const handler = handlers[key];
    if (!handler) return new Response(JSON.stringify({ error: 'not_found' }), { status: 404 });
    return handler();
  };
}

function ok(payload: unknown) {
  return () => new Response(JSON.stringify(payload), { status: 200 });
}

const emptyPending = ok({ items: [], nextCursor: null });

function renderCard(approval: PendingApproval = APPROVAL, onDecided?: (a: boolean) => void) {
  return render(
    <MemoryRouter>
      <ApprovalCard approval={approval} onDecided={onDecided} />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  calls = [];
  __resetApprovalPolling();
});

afterEach(() => {
  resetFetcher();
  __resetApprovalPolling();
  vi.useRealTimers();
});

describe('A8 — approve, reject, expire', () => {
  it('applies once under a double-click', async () => {
    setFetcher(
      server({
        'POST /v1/agent/actions/a1/approve': ok({ result: {}, resumed: true }),
        'GET /v1/agent/actions': emptyPending,
      }),
    );

    const user = userEvent.setup();
    renderCard();

    const approve = screen.getByRole('button', { name: /approve/i });
    // Two clicks as fast as the user can manage them.
    await Promise.all([user.click(approve), user.click(approve)]);

    await waitFor(() =>
      expect(calls.filter((c) => c.path.endsWith('/approve'))).toHaveLength(1),
    );
  });

  it('records the reason with a rejection', async () => {
    setFetcher(
      server({
        'POST /v1/agent/actions/a1/reject': ok({ result: {}, resumed: true }),
        'GET /v1/agent/actions': emptyPending,
      }),
    );

    const user = userEvent.setup();
    renderCard();

    // First click opens the reason field; the second sends it.
    await user.click(screen.getByRole('button', { name: /reject/i }));
    await user.type(screen.getByLabelText(/why are you rejecting/i), 'wrong client');
    await user.click(screen.getByRole('button', { name: /reject/i }));

    await waitFor(() => {
      const reject = calls.find((c) => c.path.endsWith('/reject'));
      expect(reject?.body).toEqual({ reason: 'wrong client' });
    });
  });

  it('renders an elapsed countdown as expired and refuses to act', () => {
    setFetcher(server({ 'GET /v1/agent/actions': emptyPending }));
    renderCard({ ...APPROVAL, expiresAt: Date.now() - 1000 });

    expect(screen.getByText('expired')).toBeTruthy();
    expect(screen.queryByRole('button', { name: /approve/i })).toBeNull();
    expect(screen.getByText(/no longer actionable/i)).toBeTruthy();
  });

  it('counts down in hours while the offer stands', () => {
    setFetcher(server({ 'GET /v1/agent/actions': emptyPending }));
    renderCard({ ...APPROVAL, expiresAt: Date.now() + 5 * 3_600_000 + 30 * 60_000 });

    expect(screen.getByText(/expires in 5h/)).toBeTruthy();
    expect(screen.getByRole('button', { name: /approve/i })).toBeTruthy();
  });
});

describe('A9 — a stale base is never written', () => {
  it('handles the 409, refetches, and applies nothing', async () => {
    let resumed = false;
    setFetcher(
      server({
        'POST /v1/agent/actions/a1/approve': () =>
          new Response(JSON.stringify({ error: 'stale_base' }), { status: 409 }),
        'GET /v1/agent/actions': emptyPending,
      }),
    );

    const user = userEvent.setup();
    renderCard(APPROVAL, () => {
      resumed = true;
    });

    await user.click(screen.getByRole('button', { name: /approve/i }));

    // The user is told, in terms that name the cause and the remedy.
    await screen.findByText(/the note changed — please review this again/i);
    expect(screen.getByText(/nothing was written/i)).toBeTruthy();

    // The agent turn is not resumed: nothing happened, so there is nothing to
    // continue from.
    expect(resumed).toBe(false);

    // And the list is refetched so the next look is at current state.
    await waitFor(() =>
      expect(calls.filter((c) => c.method === 'GET' && c.path.startsWith('/v1/agent/actions'))).not
        .toHaveLength(0),
    );
  });

  it('fires onDecided only when a write actually landed', async () => {
    const decisions: boolean[] = [];
    setFetcher(
      server({
        'POST /v1/agent/actions/a1/approve': ok({ result: {}, resumed: true }),
        'GET /v1/agent/actions': emptyPending,
      }),
    );

    const user = userEvent.setup();
    renderCard(APPROVAL, (approved) => decisions.push(approved));
    await user.click(screen.getByRole('button', { name: /approve/i }));

    await waitFor(() => expect(decisions).toEqual([true]));
  });
});

describe('the card shows the change before it happens', () => {
  it('renders a line-level diff with counts and the target note', () => {
    setFetcher(server({ 'GET /v1/agent/actions': emptyPending }));
    renderCard();

    expect(screen.getByText('+1')).toBeTruthy();
    expect(screen.getByText('−1')).toBeTruthy();
    expect(screen.getByText('line two changed')).toBeTruthy();
    // The note is named and linked, so "which file is this touching" is answered.
    expect(screen.getByRole('link', { name: /Mandat Weber/ })).toBeTruthy();
  });

  it('says so rather than showing an empty diff when there is no preview', () => {
    setFetcher(server({ 'GET /v1/agent/actions': emptyPending }));
    renderCard({ ...APPROVAL, diff: undefined });

    // An empty green/red block would read as "this changes nothing".
    expect(screen.getByText(/no preview available/i)).toBeTruthy();
  });

  it('has no remember-my-choice affordance', () => {
    setFetcher(server({ 'GET /v1/agent/actions': emptyPending }));
    renderCard();

    // It would recreate auto-approval without its governance.
    expect(screen.queryByRole('checkbox')).toBeNull();
    expect(screen.queryByText(/remember|always|don't ask/i)).toBeNull();
  });
});

describe('A11 — polling matches the API and pauses when hidden', () => {
  it('polls every 30 s and stops when the tab is hidden', async () => {
    vi.useFakeTimers();
    setFetcher(
      server({
        'GET /v1/agent/actions': ok({ items: [], nextCursor: null }),
      }),
    );

    const unsubscribe = useApprovalsStore.getState().subscribe();
    await vi.advanceTimersByTimeAsync(0);
    const afterMount = calls.length;
    expect(afterMount).toBe(1); // an immediate first read

    await vi.advanceTimersByTimeAsync(APPROVAL_POLL_MS);
    expect(calls.length).toBe(afterMount + 1);

    // Hide the tab. A background tab polling forever is how a laptop fan
    // becomes the product's most memorable feature.
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));

    const whileHidden = calls.length;
    await vi.advanceTimersByTimeAsync(APPROVAL_POLL_MS * 3);
    expect(calls.length).toBe(whileHidden);

    // Coming back refreshes at once rather than waiting out the interval.
    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    await vi.advanceTimersByTimeAsync(0);
    expect(calls.length).toBe(whileHidden + 1);

    unsubscribe();
    const afterUnsubscribe = calls.length;
    await vi.advanceTimersByTimeAsync(APPROVAL_POLL_MS * 2);
    expect(calls.length).toBe(afterUnsubscribe);
  });

  it('exposes exactly what the API returned as pending', async () => {
    setFetcher(
      server({
        'GET /v1/agent/actions': ok({
          items: [
            {
              id: 'a1',
              kind: 'agent_write',
              toolName: 'update_note',
              toolInput: { noteId: 'n1' },
              status: 'pending',
              costUsd: 0.01,
              createdAt: Date.now(),
              userId: 'u1',
            },
          ],
          nextCursor: null,
        }),
      }),
    );

    await useApprovalsStore.getState().refresh();
    const pending = useApprovalsStore.getState().pending;
    expect(pending).toHaveLength(1);
    expect(pending[0].actionId).toBe('a1');
    expect(pending[0].tool).toBe('update_note');
  });

  it('asks the server only for pending rows', async () => {
    setFetcher(server({ 'GET /v1/agent/actions': emptyPending }));
    await useApprovalsStore.getState().refresh();
    expect(calls[0].path).toContain('status=pending');
  });

  it('keeps the previous list when a poll fails', async () => {
    setFetcher(
      server({
        'GET /v1/agent/actions': ok({
          items: [
            {
              id: 'a1',
              kind: 'agent_write',
              toolName: 'update_note',
              status: 'pending',
              costUsd: 0,
              createdAt: Date.now(),
              userId: 'u1',
            },
          ],
          nextCursor: null,
        }),
      }),
    );
    await useApprovalsStore.getState().refresh();
    expect(useApprovalsStore.getState().pending).toHaveLength(1);

    // A count that flickers to zero on a network blip lies in the reassuring
    // direction, which is the worse direction for a pending write.
    setFetcher(async () => {
      throw new Error('network down');
    });
    await useApprovalsStore.getState().refresh();
    expect(useApprovalsStore.getState().pending).toHaveLength(1);
  });
});
