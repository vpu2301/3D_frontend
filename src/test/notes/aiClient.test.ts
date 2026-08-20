/**
 * The real AI client. Replaces the tests that once covered the Docs mock.
 *
 * What matters here is the wire behaviour the mock never had: SSE framing that
 * survives a frame split across reads, 402 carrying a reset time, the budget
 * warning header arriving on an otherwise-successful response, and the agent
 * turn ending at `approval_required` rather than running the write.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  extractTasks,
  extractDecisions,
  suggestTags,
  suggestLinks,
  answerOverNotes,
  agentChat,
  onBudgetWarning,
  spendSummary,
  BudgetExceededError,
  AiError,
  setFetcher,
  resetFetcher,
  type AgentEvent,
} from '@/pages/notes/_lib/aiClient';

vi.mock('@/auth/apiFetch', () => ({
  apiFetch: () => {
    throw new Error('tests must go through setFetcher');
  },
  NOTES_API_URL: '',
}));

interface Recorded {
  path: string;
  body: unknown;
}

let recorded: Recorded[] = [];

function jsonFetcher(payload: unknown, init: ResponseInit = {}) {
  return async (path: string, requestInit: RequestInit = {}) => {
    recorded.push({ path, body: requestInit.body ? JSON.parse(String(requestInit.body)) : undefined });
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
      ...init,
    });
  };
}

/** An SSE response whose frames arrive in the given chunks, boundaries included. */
function sseFetcher(chunks: string[], init: ResponseInit = {}) {
  return async (path: string, requestInit: RequestInit = {}) => {
    recorded.push({ path, body: requestInit.body ? JSON.parse(String(requestInit.body)) : undefined });
    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        for (const chunk of chunks) controller.enqueue(encoder.encode(chunk));
        controller.close();
      },
    });
    return new Response(stream, {
      status: 200,
      headers: { 'Content-Type': 'text/event-stream' },
      ...init,
    });
  };
}

beforeEach(() => {
  recorded = [];
});

afterEach(() => {
  resetFetcher();
});

describe('the five extraction and suggestion calls', () => {
  it('extractTasks unwraps { tasks }', async () => {
    setFetcher(jsonFetcher({ tasks: [{ text: 'Send the comms' }] }));
    const tasks = await extractTasks('- [ ] Send the comms');
    expect(tasks).toEqual([{ text: 'Send the comms' }]);
    expect(recorded[0]).toEqual({
      path: '/v1/ai/extract-tasks',
      body: { text: '- [ ] Send the comms' },
    });
  });

  it('extractDecisions unwraps { decisions }', async () => {
    setFetcher(jsonFetcher({ decisions: [{ text: 'Ship it' }] }));
    expect(await extractDecisions('We decided to ship it')).toEqual([{ text: 'Ship it' }]);
  });

  it('suggestTags sends content and existing tags', async () => {
    setFetcher(jsonFetcher({ tags: ['q2-planning'] }));
    expect(await suggestTags('Q2 kickoff', ['meeting'])).toEqual(['q2-planning']);
    expect(recorded[0].body).toEqual({ content: 'Q2 kickoff', existingTags: ['meeting'] });
  });

  it('suggestLinks sends the note id, not the note body', async () => {
    setFetcher(jsonFetcher({ suggestions: [] }));
    await suggestLinks('note-1', [{ type: 'doc', targetId: 'doc_x', label: 'X' }]);
    expect(recorded[0].body).toMatchObject({ noteId: 'note-1' });
  });
});

describe('answerOverNotes', () => {
  it('streams chunks and emits citations', async () => {
    setFetcher(
      sseFetcher([
        'event: chunk\ndata: {"chunk":"Hello "}\n\n',
        'event: chunk\ndata: {"chunk":"world"}\n\n',
        'event: citations\ndata: {"citations":[{"noteId":"n1","title":"Decisions log"}]}\n\n',
        'event: done\ndata: {}\n\n',
      ]),
    );

    let acc = '';
    const citations: string[] = [];
    for await (const part of answerOverNotes('what about diff-accept', [{ id: 'n1' }])) {
      acc += part.chunk;
      part.citations?.forEach((c) => citations.push(c.noteId));
    }

    expect(acc).toBe('Hello world');
    expect(citations).toEqual(['n1']);
  });

  it('reassembles a frame split across two reads', async () => {
    // The realistic failure the old hand-rolled parser had to handle: a network
    // read boundary in the middle of a `data:` line.
    setFetcher(sseFetcher(['event: chunk\ndata: {"chunk":"split', ' me"}\n\n', 'event: done\ndata: {}\n\n']));

    let acc = '';
    for await (const part of answerOverNotes('q', [{ id: 'n1' }])) acc += part.chunk;

    expect(acc).toBe('split me');
  });

  it('sends a note id and a scope — never note bodies', async () => {
    setFetcher(sseFetcher(['event: done\ndata: {}\n\n']));
    for await (const _ of answerOverNotes('q', [{ id: 'n1' }], undefined, 'all')) void _;
    expect(recorded[0].body).toEqual({ question: 'q', noteId: 'n1', scope: 'all' });
  });

  it('turns an SSE error event into an AiError', async () => {
    setFetcher(
      sseFetcher(['event: error\ndata: {"error":"ai_failed","message":"provider exploded"}\n\n']),
    );

    await expect(async () => {
      for await (const _ of answerOverNotes('q', [{ id: 'n1' }])) void _;
    }).rejects.toThrow('provider exploded');
  });
});

describe('budget handling', () => {
  it('throws BudgetExceededError with the reset time on a 402', async () => {
    setFetcher(async () =>
      new Response(JSON.stringify({ error: 'budget_exceeded' }), {
        status: 402,
        headers: { 'X-AI-Budget-Reset-At': '1800000000000' },
      }),
    );

    const error = await extractTasks('x').catch((e) => e);
    expect(error).toBeInstanceOf(BudgetExceededError);
    expect((error as BudgetExceededError).resetAt).toBe(1_800_000_000_000);
  });

  it('notifies warning subscribers from the header on a successful response', async () => {
    const seen: number[] = [];
    const unsubscribe = onBudgetWarning((ratio) => seen.push(ratio));

    setFetcher(
      jsonFetcher({ tags: [] }, { headers: { 'X-AI-Budget-Warning': '0.85' } }),
    );
    await suggestTags('text', []);

    expect(seen).toEqual([0.85]);
    unsubscribe();

    await suggestTags('text', []);
    expect(seen).toEqual([0.85]); // unsubscribed
  });

  it('surfaces a non-budget failure as an AiError with the server code', async () => {
    setFetcher(async () =>
      new Response(JSON.stringify({ error: 'ai_disabled', message: 'AI is off' }), { status: 403 }),
    );

    const error = await extractTasks('x').catch((e) => e);
    expect(error).toBeInstanceOf(AiError);
    expect((error as AiError).code).toBe('ai_disabled');
  });
});

describe('agentChat', () => {
  it('yields the turn protocol and stops at approval_required', async () => {
    setFetcher(
      sseFetcher([
        'event: session\ndata: {"sessionId":"s1"}\n\n',
        'event: chunk\ndata: {"chunk":"I will tag them."}\n\n',
        'event: approval_required\ndata: {"actionId":"a1","tool":"set_tags","input":{"tags":["meeting"]},"explanation":"why"}\n\n',
      ]),
    );

    const events: AgentEvent[] = [];
    for await (const event of agentChat('tag my meeting notes')) events.push(event);

    expect(events.map((e) => e.event)).toEqual(['session', 'chunk', 'approval_required']);
    const approval = events[2] as Extract<AgentEvent, { event: 'approval_required' }>;
    expect(approval.actionId).toBe('a1');
    expect(approval.input).toEqual({ tags: ['meeting'] });
  });

  it('passes an existing session id so the conversation continues', async () => {
    setFetcher(sseFetcher(['event: done\ndata: {"costUsd":0,"toolCalls":0}\n\n']));
    for await (const _ of agentChat('hi', 's1')) void _;
    expect(recorded[0].body).toEqual({ message: 'hi', sessionId: 's1' });
  });
});

describe('spendSummary', () => {
  it('reads the range from the query string', async () => {
    setFetcher(jsonFetcher({ costUsd: 0.42, calls: 3, byKind: { answer: 3 } }));
    const summary = await spendSummary('7d');
    expect(summary.costUsd).toBe(0.42);
    expect(recorded[0].path).toBe('/v1/agent/actions/summary?range=7d');
  });
});
