/**
 * A4, A5 and A12 — the ask panel as a person meets it.
 *
 * The claims under test are the ones the mock could never have exercised: a
 * stopped answer keeps what arrived and says it is incomplete, a spent budget
 * gets its own state with the reset time rather than a generic failure, and
 * model output reaches the screen as characters rather than as markup.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AskTab from '@/pages/notes/_components/ai/AskTab';
import { setFetcher, resetFetcher } from '@/pages/notes/_lib/aiClient';

vi.mock('@/auth/apiFetch', () => ({
  apiFetch: () => {
    throw new Error('tests must go through setFetcher');
  },
  canReachNotesApi: () => true,
  NOTES_API_URL: '',
}));

vi.mock('sonner', () => ({
  toast: Object.assign(() => undefined, {
    error: () => undefined,
    success: () => undefined,
    warning: () => undefined,
  }),
}));

/**
 * A fetcher backed by an SSE body that stays open until the test closes it, so
 * assertions can be made against a stream that is still running.
 *
 * It honours `init.signal` the way real `fetch` does — erroring the body stream
 * on abort. That fidelity is the whole point: the production abort path depends
 * on `fetch` tearing down the body, and a double that quietly ignored the
 * signal would let a broken abort pass its own test.
 */
function controllableSse() {
  const encoder = new TextEncoder();
  let controller: ReadableStreamDefaultController<Uint8Array>;
  let cancelled = false;

  const stream = new ReadableStream<Uint8Array>({
    start(c) {
      controller = c;
    },
    cancel() {
      cancelled = true;
    },
  });

  const fetcher = async (_path: string, init: RequestInit = {}) => {
    const signal = init.signal;
    if (signal) {
      if (signal.aborted) cancelled = true;
      signal.addEventListener('abort', () => {
        cancelled = true;
        try {
          controller.error(new DOMException('The operation was aborted.', 'AbortError'));
        } catch {
          /* already closed */
        }
      });
    }
    return new Response(stream, { status: 200 });
  };

  return {
    fetcher,
    push: (frame: string) => controller.enqueue(encoder.encode(frame)),
    close: () => controller.close(),
    wasCancelled: () => cancelled,
  };
}

function renderPanel() {
  return render(
    <MemoryRouter>
      <AskTab />
    </MemoryRouter>,
  );
}

async function ask(user: ReturnType<typeof userEvent.setup>, question: string) {
  await user.type(screen.getByLabelText(/ask a question/i), question);
  await user.click(screen.getByRole('button', { name: /^ask$/i }));
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  resetFetcher();
  vi.useRealTimers();
});

describe('A4 — abort keeps the partial answer and marks it', () => {
  it('stops the stream, cancels the request, and retains what arrived', async () => {
    const sse = controllableSse();
    setFetcher(sse.fetcher);

    const user = userEvent.setup();
    renderPanel();
    await ask(user, 'what did I decide');

    sse.push('event: chunk\ndata: {"chunk":"We decided to "}\n\n');
    await screen.findByText(/We decided to/);

    await user.click(screen.getByRole('button', { name: /stop generating/i }));

    // The partial survives — it is real text the model produced.
    expect(screen.getByText(/We decided to/)).toBeTruthy();
    // …and it is labelled, so nobody reads a half answer as a whole one.
    await screen.findByText(/stopped before it finished/i);
    // The connection is released, which is what stops the provider billing.
    await waitFor(() => expect(sse.wasCancelled()).toBe(true));
  });

  it('offers Ask again rather than resuming the dead stream', async () => {
    const sse = controllableSse();
    setFetcher(sse.fetcher);

    const user = userEvent.setup();
    renderPanel();
    await ask(user, 'q');
    sse.push('event: chunk\ndata: {"chunk":"partial"}\n\n');
    await screen.findByText('partial');
    await user.click(screen.getByRole('button', { name: /stop generating/i }));

    // No reconnect: a half-answer resumed from new context is a different
    // answer wearing the first one's opening sentence.
    await screen.findByRole('button', { name: /ask again/i });
  });

  it('aborts the in-flight request when the panel unmounts', async () => {
    const sse = controllableSse();
    setFetcher(sse.fetcher);

    const user = userEvent.setup();
    const view = renderPanel();
    await ask(user, 'q');
    sse.push('event: chunk\ndata: {"chunk":"x"}\n\n');
    await screen.findByText('x');

    view.unmount();
    await waitFor(() => expect(sse.wasCancelled()).toBe(true));
  });
});

describe('A5 — a spent budget is its own state', () => {
  it('names the reset time instead of failing generically', async () => {
    const resetAt = Date.UTC(2026, 6, 30, 6, 0, 0);
    setFetcher(async () =>
      new Response(JSON.stringify({ error: 'budget_exceeded' }), {
        status: 402,
        headers: { 'X-AI-Budget-Reset-At': String(resetAt) },
      }),
    );

    const user = userEvent.setup();
    renderPanel();
    await ask(user, 'q');

    const expected = new Date(resetAt).toLocaleTimeString(undefined, {
      hour: '2-digit',
      minute: '2-digit',
    });
    const alert = await screen.findByText(/budget is spent/i);
    expect(alert.textContent).toContain(expected);
    // Writing still works, and the panel says so rather than implying an outage.
    expect(alert.textContent).toMatch(/writing and saving are unaffected/i);
  });
});

describe('a mid-stream error renders under what arrived', () => {
  it('keeps the partial text and shows the failure inline', async () => {
    const sse = controllableSse();
    setFetcher(sse.fetcher);

    const user = userEvent.setup();
    renderPanel();
    await ask(user, 'q');

    sse.push('event: chunk\ndata: {"chunk":"Half an answer"}\n\n');
    await screen.findByText('Half an answer');
    sse.push('event: error\ndata: {"error":"provider_error","message":"the provider dropped"}\n\n');
    sse.close();

    // A stream that dies silently looks like the model stopped thinking.
    await screen.findByText(/the provider dropped/i);
    expect(screen.getByText('Half an answer')).toBeTruthy();
  });
});

describe('A12 — model output is never rendered as HTML', () => {
  it('renders an injected img tag as visible characters', async () => {
    const payload = '<img src=x onerror="window.__xss=1">';
    const sse = controllableSse();
    setFetcher(sse.fetcher);

    const user = userEvent.setup();
    const { container } = renderPanel();
    await ask(user, 'q');

    sse.push(`event: chunk\ndata: ${JSON.stringify({ chunk: payload })}\n\n`);
    sse.push('event: done\ndata: {}\n\n');
    sse.close();

    await screen.findByText(payload);
    // The tag is text, not a node — and nothing executed.
    expect(container.querySelector('img')).toBeNull();
    expect((window as unknown as { __xss?: number }).__xss).toBeUndefined();
  });
});

describe('A13 — provenance is on every answer', () => {
  it('shows the provider and region the server reported', async () => {
    const sse = controllableSse();
    setFetcher(sse.fetcher);

    const user = userEvent.setup();
    renderPanel();
    await ask(user, 'q');

    sse.push('event: chunk\ndata: {"chunk":"answer"}\n\n');
    sse.push(
      'event: meta\ndata: {"provider":"Anthropic","model":"claude-opus-5","region":"EU"}\n\n',
    );
    sse.push('event: done\ndata: {}\n\n');
    sse.close();

    await screen.findByText('Anthropic · EU');
    expect(screen.getByText('claude-opus-5')).toBeTruthy();
  });

  it('says so rather than guessing when the server reports nothing', async () => {
    const sse = controllableSse();
    setFetcher(sse.fetcher);

    const user = userEvent.setup();
    renderPanel();
    await ask(user, 'q');
    sse.push('event: chunk\ndata: {"chunk":"answer"}\n\n');
    sse.push('event: done\ndata: {}\n\n');
    sse.close();

    // Defaulting to "Anthropic · EU" because it usually is would be the single
    // most damaging thing this footer could do.
    await screen.findByText(/provider not reported/i);
  });
});

describe('the panel shows progress before the first token', () => {
  it('acknowledges the question immediately', async () => {
    const sse = controllableSse();
    setFetcher(sse.fetcher);

    const user = userEvent.setup();
    renderPanel();
    await ask(user, 'q');

    // First token can be ~1.5 s against a real provider; the mock's 200 ms
    // trained everyone to expect otherwise.
    await screen.findByText(/searching your notes/i);
  });
});
