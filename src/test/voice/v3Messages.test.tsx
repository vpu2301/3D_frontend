/**
 * The messages inbox (S12 §11). Two things here are not cosmetic: unverified
 * name/number stay visible, and "call back" prefills rather than dials.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { InboundMessage } from '@/lib/api/voice';

const markRead = vi.fn();

const MESSAGES: InboundMessage[] = [
  {
    id: 'm1',
    call_sid: 'CA1',
    caller_name: 'Anna Weber',
    caller_number: '+4930123456',
    matter: 'Wants a quote for the warehouse rollout; asks for a call back before Friday.',
    urgency: 'urgent',
    name_unverified: true,
    number_unverified: false,
    delivery_state: 'delivered',
    created_at: new Date(Date.now() - 5 * 60_000).toISOString(),
    read_at: null,
    call: { inbound_intent: 'message', duration_seconds: 96 },
  },
  {
    id: 'm2',
    call_sid: 'CA2',
    caller_name: null,
    caller_number: null,
    matter: 'Asked whether you take on private clients.',
    urgency: 'normal',
    number_unverified: true,
    created_at: new Date(Date.now() - 3 * 3_600_000).toISOString(),
    read_at: new Date().toISOString(),
    call: { inbound_intent: 'question' },
  },
];

vi.mock('@/lib/api/voice', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api/voice')>();
  return {
    ...actual,
    useVoiceConnected: () => true,
    useMessages: () => ({
      data: { messages: MESSAGES, total: 2, unread: 1 },
      isLoading: false,
      isError: false,
      error: null,
      refetch: vi.fn(),
      isRefetching: false,
    }),
    useMarkRead: () => ({ mutate: markRead }),
  };
});

// The real modal drags in contacts, toasts and the call mutation; this only
// needs to know what it was opened with.
vi.mock('@/pages/telephony/_components/voice/StartCallModal', () => ({
  default: (props: { initialNumber?: string; initialMode?: string; initialPurpose?: string }) => (
    <div data-testid="start-call-modal" data-mode={props.initialMode} data-number={props.initialNumber}>
      {props.initialPurpose}
    </div>
  ),
}));

const { default: MessagesView } = await import('@/pages/telephony/_components/voice/MessagesView');

const renderInbox = () =>
  render(
    <MemoryRouter>
      <MessagesView />
    </MemoryRouter>,
  );

beforeEach(() => markRead.mockClear());

describe('messages inbox', () => {
  it('lists messages newest first with unread weight and the unread count', () => {
    renderInbox();
    const rows = screen.getAllByTestId('message-row');
    expect(rows).toHaveLength(2);
    expect(rows[0]).toHaveAttribute('data-unread', 'true');
    expect(rows[1]).toHaveAttribute('data-unread', 'false');
    expect(screen.getByText('1 unread')).toBeInTheDocument();
  });

  it('flags what the caller never confirmed', () => {
    renderInbox();
    // One dot for the unverified name, one for the unverified number.
    expect(screen.getAllByTestId('unverified-dot')).toHaveLength(2);
    expect(screen.getAllByTitle(/not confirmed on the call/i)).toHaveLength(2);
  });

  it('shows urgency and intent so an urgent message is not just another row', () => {
    renderInbox();
    expect(screen.getByTitle('Marked urgent by the caller')).toBeInTheDocument();
    expect(screen.getByText('message')).toBeInTheDocument();
    expect(screen.getByText('question')).toBeInTheDocument();
  });

  it('marks read on open — reading the matter IS reading the message', async () => {
    const user = userEvent.setup();
    renderInbox();
    await user.click(screen.getAllByTestId('message-row')[0]);
    await screen.findByTestId('message-drawer');
    expect(markRead).toHaveBeenCalledWith('m1');
  });

  it('does not re-mark a message that was already read', async () => {
    const user = userEvent.setup();
    renderInbox();
    await user.click(screen.getAllByTestId('message-row')[1]);
    await screen.findByTestId('message-drawer');
    expect(markRead).not.toHaveBeenCalled();
  });

  it('prefills the call form with the callback number — and does not dial', async () => {
    const user = userEvent.setup();
    renderInbox();
    await user.click(screen.getAllByTestId('message-row')[0]);
    await user.click(await screen.findByTestId('message-call-back'));

    const modal = await screen.findByTestId('start-call-modal');
    expect(modal).toHaveAttribute('data-number', '+4930123456');
    expect(modal).toHaveAttribute('data-mode', 'now');
    expect(modal.textContent).toContain('warehouse rollout');
  });

  it('offers no callback when the receptionist never got a number', async () => {
    const user = userEvent.setup();
    renderInbox();
    await user.click(screen.getAllByTestId('message-row')[1]);
    expect(await screen.findByTestId('message-call-back')).toBeDisabled();
  });
});
