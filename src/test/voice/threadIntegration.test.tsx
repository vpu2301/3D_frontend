/**
 * Threads are additive (S14 §4): the flat call table, the call detail, the
 * inbox and the nav each gain one thread-shaped affordance without losing
 * anything they had.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { CallDetail, Thread } from '@/lib/api/voice';

const navigate = vi.fn();

const CALL: CallDetail = {
  call_sid: 'CA2',
  direction: 'outbound',
  status: 'completed',
  from_number: '+4930999',
  to_number: '+4930111222',
  started_at: '2026-08-18T09:00:00Z',
  ended_at: '2026-08-18T09:01:00Z',
  duration_seconds: 60,
  thread_id: 'th_1',
  thread_subject: 'Warehouse rollout kick-off',
  transcript: [{ speaker: 'agent', text: 'Guten Tag', confidence: 1, state: 'delivered', timestamp: '2026-08-18T09:00:01Z' }],
  actions: [],
};

const THREAD = {
  id: 'th_1',
  subject: 'Warehouse rollout kick-off',
  status: 'open',
  contact_name: 'Anna Weber',
  contact_number: '+4930111222',
  call_count: 3,
  created_at: '2026-08-17T09:00:00Z',
  updated_at: '2026-08-19T15:30:00Z',
  rolling_summary: 'Stand: wartet.',
  commitments: [],
  calls: [
    { ...CALL, call_sid: 'CA1', thread_attach_kind: 'origin' },
    { ...CALL, call_sid: 'CA2', thread_attach_kind: 'retry' },
    { ...CALL, call_sid: 'CA3', thread_attach_kind: 'inbound_matched' },
  ],
};

const OVERDUE: Thread[] = [
  { id: 'th_1', subject: 'Warehouse rollout kick-off', status: 'open', contact_name: null, contact_number: '+49301', call_count: 3, created_at: '', updated_at: '', expired_commitment_count: 2 },
  { id: 'th_2', subject: 'Invoice 2026-114', status: 'open', contact_name: null, contact_number: '+49302', call_count: 1, created_at: '', updated_at: '', expired_commitment_count: 1 },
];

let overdue: Thread[] = OVERDUE;

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return { ...actual, useNavigate: () => navigate };
});

vi.mock('@/lib/api/voice', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api/voice')>();
  return {
    ...actual,
    useCallDetail: () => ({ data: CALL, isLoading: false }),
    useThread: () => ({ data: THREAD, isLoading: false, isError: false }),
    useThreads: () => ({ data: { threads: overdue, total: overdue.length }, isLoading: false, isError: false, refetch: vi.fn() }),
    useActiveCalls: () => ({ data: [] }),
    usePendingApprovals: () => ({ approvals: [] }),
    useUnreadMessageCount: () => 0,
    useVoiceConnected: () => true,
    // FE0: the rail reads the status for capability gating (nothing off here).
    useVoiceStatus: () => ({ data: undefined, isLoading: false }),
    // FE1: the attention badge derives from history + unread messages.
    useCallHistoryAll: () => ({ calls: [], isLoading: false, isError: false }),
    useMessages: () => ({ data: { messages: [], total: 0, unread: 0 }, isLoading: false }),
  };
});

const { default: TranscriptModal } = await import('@/pages/telephony/_components/voice/TranscriptModal');
const { default: TelephonyMiniRail } = await import('@/pages/telephony/_components/sidebar/TelephonyMiniRail');

const renderAt = (ui: React.ReactNode) => render(<QueryClientProvider client={new QueryClient()}><MemoryRouter>{ui}</MemoryRouter></QueryClientProvider>);

beforeEach(() => {
  overdue = OVERDUE;
  navigate.mockClear();
});

describe('call detail inside a thread', () => {
  const nav = { threadId: 'th_1', subject: 'Warehouse rollout kick-off', index: 2, total: 3 };

  it('shows the breadcrumb and where the call sits', () => {
    renderAt(<TranscriptModal callSid="CA2" open onClose={vi.fn()} threadNav={nav} />);

    expect(screen.getByTitle('Open thread: Warehouse rollout kick-off')).toHaveAttribute(
      'href',
      '/telephony/threads/th_1',
    );
    expect(screen.getByText('· call 2/3')).toBeInTheDocument();
  });

  it('walks the thread with the arrow keys and the buttons', async () => {
    const user = userEvent.setup();
    const onPrev = vi.fn();
    const onNext = vi.fn();
    renderAt(
      <TranscriptModal callSid="CA2" open onClose={vi.fn()} threadNav={{ ...nav, onPrev, onNext }} />,
    );

    await user.click(screen.getByLabelText('Previous call in thread'));
    expect(onPrev).toHaveBeenCalled();

    await user.keyboard('{ArrowRight}');
    expect(onNext).toHaveBeenCalled();

    // …but not while someone is typing in the transcript search.
    onNext.mockClear();
    await user.click(screen.getByPlaceholderText(/search/i));
    await user.keyboard('{ArrowRight}');
    expect(onNext).not.toHaveBeenCalled();
  });

  it('has no thread chrome for a threadless call', () => {
    renderAt(<TranscriptModal callSid="CA2" open onClose={vi.fn()} />);
    expect(screen.queryByText(/call 2\/3/)).toBeNull();
    expect(screen.queryByLabelText('Next call in thread')).toBeNull();
  });
});

describe('nav badge for overdue matters', () => {
  it('counts open threads with something past due, and names the top ones', () => {
    renderAt(<TelephonyMiniRail />);

    const badge = screen.getByTitle(/^Past due: Warehouse rollout kick-off, Invoice 2026-114$/);
    expect(badge).toHaveTextContent('2');
  });

  it('disappears when nothing is past due', () => {
    overdue = [];
    renderAt(<TelephonyMiniRail />);
    expect(screen.queryByTitle(/^Past due:/)).toBeNull();
  });
});
