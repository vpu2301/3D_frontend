/**
 * Call threads (S14): the thread list, the detail page and the rules the
 * acceptance criteria pin down — the glyph sequence of a retry chain, the
 * rolling summary's state line, commitment ordering, which status moves the
 * UI is even allowed to offer, and what a purged call looks like.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { PincerError } from '@/lib/pincerClient';
import type { Thread, ThreadDetail } from '@/lib/api/voice';

const navigate = vi.fn();
const patchMutate = vi.fn();

/** The harness thread from §7: attempt → retry → success. */
const THREAD: ThreadDetail = {
  id: 'th_1',
  subject: 'Warehouse rollout kick-off',
  status: 'open',
  contact_name: 'Anna Weber',
  contact_number: '+4930111222',
  language: 'de',
  call_count: 3,
  created_at: '2026-08-17T09:00:00Z',
  updated_at: '2026-08-19T15:30:00Z',
  state_line: 'Stand: wartet auf Rückruf am Freitag.',
  expired_commitment_count: 1,
  rolling_summary:
    'Erster Versuch: niemand erreicht.\nZweiter Versuch: Anna war im Termin.\nStand: wartet auf Rückruf am Freitag.',
  summary_updated_after_call: 3,
  commitments: [
    { who: 'agent', what: 'Unterlagen per Mail schicken', due_at: '2026-08-30T10:00:00Z', status: 'open' },
    { who: 'callee', what: 'Rückruf am Freitag', due_at: '2026-08-18T10:00:00Z', status: 'expired' },
    { who: 'user', what: 'Angebot freigeben', due_at: null, status: 'done' },
  ],
  calls: [
    {
      call_sid: 'CA1', direction: 'outbound', status: 'completed', from_number: '+4930999',
      to_number: '+4930111222', started_at: '2026-08-17T09:00:00Z', ended_at: '2026-08-17T09:00:20Z',
      duration_seconds: 20, failure_code: 'no_answer', thread_attach_kind: 'origin',
      task_result: 'Nobody picked up.',
    },
    {
      call_sid: 'CA2', direction: 'outbound', status: 'completed', from_number: '+4930999',
      to_number: '+4930111222', started_at: '2026-08-18T09:00:00Z', ended_at: '2026-08-18T09:01:00Z',
      duration_seconds: 60, thread_attach_kind: 'retry', task_result: 'Anna was in a meeting.',
      transcript_purged: true,
    },
    {
      call_sid: 'CA3', direction: 'inbound', status: 'completed', from_number: '+4930111222',
      to_number: '+4930999', started_at: '2026-08-19T15:00:00Z', ended_at: '2026-08-19T15:09:00Z',
      duration_seconds: 540, thread_attach_kind: 'inbound_matched', task_result: 'Agreed to call back Friday.',
    },
  ],
};

const LIST: Thread[] = [
  {
    id: 'th_1', subject: THREAD.subject, status: 'open', contact_name: 'Anna Weber',
    contact_number: '+4930111222', call_count: 3, created_at: THREAD.created_at,
    updated_at: THREAD.updated_at, state_line: THREAD.state_line, expired_commitment_count: 1,
  },
  {
    id: 'th_2', subject: 'Invoice 2026-114', status: 'resolved', contact_name: null,
    contact_number: '+4915112233', call_count: 1, created_at: '2026-08-10T09:00:00Z',
    updated_at: '2026-08-11T09:00:00Z', state_line: 'Paid, nothing open.',
  },
];

let thread: ThreadDetail = THREAD;
let threadError: PincerError | null = null;
let listError: PincerError | null = null;
let lastThreadQuery: unknown = null;

const err = (message: string, status: number) =>
  Object.assign(new Error(message), { status }) as PincerError;

vi.mock('@/lib/capabilities', () => ({
  // FE10: operator features with no backend show only when the capability is declared; tests declare it.
  useCapabilities: () => ({ caps: {}, isLoading: false, isOff: () => false, isDeclared: () => true }),
  useHealth: () => ({ data: undefined }),
}));
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => navigate };
});

vi.mock('@/lib/api/voice', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api/voice')>();
  return {
    ...actual,
    useThreads: (params: unknown) => {
      lastThreadQuery = params;
      return {
        data: listError ? undefined : { threads: LIST, total: LIST.length },
        isLoading: false,
        isError: !!listError,
        error: listError,
        refetch: vi.fn(),
      };
    },
    useThread: () => ({
      data: threadError ? undefined : thread,
      isLoading: false,
      isError: !!threadError,
      error: threadError,
    }),
    usePatchThread: () => ({ mutate: patchMutate, isPending: false }),
    useAssignCall: () => ({ mutate: vi.fn(), isPending: false }),
    useMergeThreads: () => ({ mutate: vi.fn(), isPending: false }),
    useCallDetail: () => ({ data: undefined, isLoading: true }),
    useCallHistoryAll: () => ({ calls: [], isLoading: false }),
    useContacts: () => ({ data: [] }),
    useInitiateCall: () => ({ mutate: vi.fn(), isPending: false }),
    useScheduleAppointment: () => ({ mutate: vi.fn(), isPending: false }),
    useScheduleCall: () => ({ mutate: vi.fn(), isPending: false }),
  };
});

const { default: ThreadsView } = await import('@/pages/telephony/_components/threads/ThreadsView');
const { default: ThreadDetailView } = await import('@/pages/telephony/_components/threads/ThreadDetailView');

const renderAt = (ui: React.ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>);

beforeEach(() => {
  thread = THREAD;
  threadError = null;
  listError = null;
  navigate.mockClear();
  patchMutate.mockClear();
});

describe('threads list', () => {
  it('shows the matter, where it stands and the past-due dot', () => {
    renderAt(<ThreadsView />);

    expect(screen.getByText('Warehouse rollout kick-off')).toBeInTheDocument();
    expect(screen.getByText('Stand: wartet auf Rückruf am Freitag.')).toBeInTheDocument();
    expect(screen.getByText('3 calls')).toBeInTheDocument();
    expect(screen.getByTitle('1 commitment past due')).toBeInTheDocument();
    // Legacy single-call threads look like every other row.
    expect(screen.getByText('Invoice 2026-114')).toBeInTheDocument();
    expect(screen.getByText('1 call')).toBeInTheDocument();
  });

  it('defaults to work in flight and can ask for the past-due ones', async () => {
    const user = userEvent.setup();
    renderAt(<ThreadsView />);

    expect(lastThreadQuery).toMatchObject({ status: ['open', 'resolved'], expiredOnly: false });

    await user.click(screen.getByLabelText(/has expired commitments/i));
    expect(lastThreadQuery).toMatchObject({ expiredOnly: true });
  });

  it('reads a backend without the threads API as absence, not failure', () => {
    listError = err('Not Found', 404);
    const onShowAllCalls = vi.fn();
    renderAt(<ThreadsView onShowAllCalls={onShowAllCalls} />);

    expect(screen.getByText(/does not group calls into threads yet/i)).toBeInTheDocument();
    expect(screen.queryByText('Not Found')).toBeNull();
    expect(screen.getByRole('button', { name: /show all calls/i })).toBeInTheDocument();
  });

  it('still shows a real failure, with the address that could not be reached', () => {
    listError = err('Could not reach the Pincer backend at localhost:8080/api/voice/threads — bad url', 0);
    renderAt(<ThreadsView />);

    expect(screen.getByText(/Could not reach the Pincer backend at localhost:8080/)).toBeInTheDocument();
  });

  it('opens the thread on row click', async () => {
    const user = userEvent.setup();
    renderAt(<ThreadsView />);

    await user.click(screen.getByText('Warehouse rollout kick-off'));
    expect(navigate).toHaveBeenCalledWith('/telephony/threads/th_1');
  });
});

describe('thread detail', () => {
  it('renders the retry chain in order, with the heuristic disclosed', () => {
    renderAt(<ThreadDetailView threadId="th_1" />);

    const glyphs = screen.getAllByLabelText(/first call|retry|inbound match|follow-up|assigned/);
    expect(glyphs.map((g) => g.textContent)).toEqual(['●', '↻', '⇠']);
    // §6: the owner must be told the inbound match was a guess.
    expect(screen.getByLabelText('inbound match')).toHaveAttribute(
      'title',
      expect.stringContaining('heuristic'),
    );
  });

  it('shows the rolling summary as text, with the state line emphasised', () => {
    renderAt(<ThreadDetailView threadId="th_1" />);

    const state = screen.getByText('Stand: wartet auf Rückruf am Freitag.');
    expect(state.className).toContain('font-semibold');
    expect(screen.getByText('Erster Versuch: niemand erreicht.').className).not.toContain('font-semibold');
    expect(screen.getByText('updated after call 3')).toBeInTheDocument();
  });

  it('puts expired commitments first and strikes the done ones', () => {
    renderAt(<ThreadDetailView threadId="th_1" />);

    const rows = screen.getAllByRole('row').filter((r) => within(r).queryByText(/Rückruf|Unterlagen|Angebot/));
    expect(rows.map((r) => r.textContent?.match(/Rückruf|Unterlagen|Angebot/)?.[0])).toEqual([
      'Rückruf',
      'Unterlagen',
      'Angebot',
    ]);
    expect(screen.getByText('Angebot freigeben').className).toContain('line-through');
  });

  it('renders the retention stub for a purged call instead of an error', async () => {
    const user = userEvent.setup();
    renderAt(<ThreadDetailView threadId="th_1" />);

    // The second call is the purged one.
    await user.click(screen.getByText('Anna was in a meeting.'));
    expect(await screen.findByText('Transcript removed per retention policy')).toBeInTheDocument();
  });

  it('offers only the transitions the API accepts', () => {
    const { unmount } = renderAt(<ThreadDetailView threadId="th_1" />);
    expect(screen.getByRole('button', { name: 'Mark resolved' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Reopen' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'Close thread' })).toBeNull();
    unmount();

    thread = { ...THREAD, status: 'resolved' };
    const second = renderAt(<ThreadDetailView threadId="th_1" />);
    expect(screen.getByRole('button', { name: 'Reopen' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close thread' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Mark resolved' })).toBeNull();
    second.unmount();

    thread = { ...THREAD, status: 'closed' };
    renderAt(<ThreadDetailView threadId="th_1" />);
    for (const label of ['Mark resolved', 'Reopen', 'Close thread']) {
      expect(screen.queryByRole('button', { name: label })).toBeNull();
    }
    // …and a closed thread offers no follow-up either.
    expect(screen.queryByRole('button', { name: /follow-up call/i })).toBeNull();
  });

  it('renames through the API rather than in place', async () => {
    const user = userEvent.setup();
    renderAt(<ThreadDetailView threadId="th_1" />);

    await user.click(screen.getByRole('button', { name: /rename thread/i }));
    const field = screen.getByLabelText('Thread subject');
    await user.clear(field);
    await user.type(field, 'Warehouse rollout — phase 2{Enter}');

    expect(patchMutate).toHaveBeenCalledWith(
      { id: 'th_1', subject: 'Warehouse rollout — phase 2' },
      expect.anything(),
    );
  });

  it('sends a status move to the API and leaves the chip to the server', async () => {
    const user = userEvent.setup();
    renderAt(<ThreadDetailView threadId="th_1" />);

    await user.click(screen.getByRole('button', { name: 'Mark resolved' }));
    expect(patchMutate).toHaveBeenCalledWith({ id: 'th_1', status: 'resolved' }, expect.anything());
    // Nothing was forced locally: the chip still says what the server said.
    expect(screen.getAllByText('open').length).toBeGreaterThan(0);
  });

  it('answers a dead deep link with a way back, not a stack trace', () => {
    threadError = err('Thread not found', 404);
    renderAt(<ThreadDetailView threadId="gone" />);

    expect(screen.getByText('This thread does not exist.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /back to threads/i })).toBeInTheDocument();
  });

  it('carries the thread into a follow-up, and lets it be taken back out', async () => {
    const user = userEvent.setup();
    renderAt(<ThreadDetailView threadId="th_1" />);

    await user.click(screen.getByRole('button', { name: /follow-up call/i }));
    expect(await screen.findByText(/in thread:/i)).toBeInTheDocument();
    expect(screen.getAllByText('Warehouse rollout kick-off').length).toBeGreaterThan(1);

    await user.click(
      screen.getByLabelText('Do not attach this call to Warehouse rollout kick-off'),
    );
    expect(screen.getByText('This call will start its own thread.')).toBeInTheDocument();
  });
});
