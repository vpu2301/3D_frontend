/**
 * Receptionist panel, policy panel and the actions timeline. The load-bearing
 * assertions: open/closed uses the business timezone, the blocklist rejects a
 * bad number with the server's own sentence, the policy panel warns in `off`
 * mode, and anything run with approvals off is disclosed.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { BusinessProfile, CallAction, ReceptionistStats, VoicePolicy } from '@/lib/api/voice';

const addMutate = vi.fn();
const removeMutate = vi.fn();

const PROFILE: BusinessProfile = {
  enabled: true,
  name: 'Kanzlei Weber & Partner',
  languages: ['de', 'en'],
  timezone: 'Europe/Berlin',
  hours: { mon: [{ open: '09:00', close: '17:00' }], sat: [] },
  services_count: 6,
  faq_count: 14,
  booking: { enabled: true, duration_minutes: 30 },
  transfer: { enabled: false },
  after_hours: 'message',
};

const STATS: ReceptionistStats = {
  answered: 128,
  intents: { question: 51, message: 34, appointment: 22, human: 12, unknown: 6, after_hours: 3 },
  booking_conversion: 0.61,
  transfer_rate: 0.09,
  messages_taken: 34,
  busy_capacity: 0,
  silent_hangups: 0,
};

let profile: unknown = PROFILE;
let stats: ReceptionistStats = STATS;
let policy: VoicePolicy = {
  global_mode: 'verbal',
  overrides: [{ tool: 'payments.refund', mode: 'user', reason: 'money leaves the company' }],
  write_budget: { limit: 5, used: 1, window: 'per call' },
  tiers: [
    { tool: 'calendar.read_events', tier: 'R' },
    { tool: 'calendar.create_event', tier: 'W' },
    { tool: 'payments.refund', tier: 'X' },
  ],
};

vi.mock('@/lib/api/voice', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api/voice')>();
  return {
    ...actual,
    useReceptionistProfile: () => ({ data: profile, isLoading: false }),
    useReceptionistStats: () => ({ data: stats, isLoading: false, isError: false }),
    useBlocklist: () => ({
      data: [{ number: '+4930999999', reason: 'abusive', source: 'suggested' }],
      isLoading: false,
      isError: false,
    }),
    useAddToBlocklist: () => ({ mutate: addMutate, isPending: false, isError: false, error: null }),
    useRemoveFromBlocklist: () => ({ mutate: removeMutate }),
    useVoicePolicy: () => ({ data: policy, isLoading: false, isError: false }),
  };
});

const { default: ReceptionistPanel } = await import(
  '@/pages/telephony/_components/voice/ReceptionistPanel'
);
const { default: PolicyPanel } = await import('@/pages/telephony/_components/voice/PolicyPanel');
const { default: CallActionsTimeline } = await import(
  '@/pages/telephony/_components/voice/CallActionsTimeline'
);

beforeEach(() => {
  profile = PROFILE;
  stats = STATS;
  addMutate.mockClear();
  removeMutate.mockClear();
});

describe('receptionist profile', () => {
  it('computes open/closed in the business timezone, not the browser one', () => {
    // 07:30 UTC Monday is 09:30 in Berlin, whatever zone the runner is in.
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-17T07:30:00Z'));
    render(<ReceptionistPanel />);
    expect(screen.getByTestId('receptionist-open-state')).toHaveAttribute('data-open', 'true');
    expect(screen.getByText('Open now')).toBeInTheDocument();
    expect(screen.getByText('09:00 – 17:00')).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('flips across the hours boundary', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-08-17T15:30:00Z')); // 17:30 Berlin
    render(<ReceptionistPanel />);
    expect(screen.getByTestId('receptionist-open-state')).toHaveAttribute('data-open', 'false');
    vi.useRealTimers();
  });

  it('says one quiet line when the receptionist is off', () => {
    profile = { enabled: false };
    render(<ReceptionistPanel />);
    expect(screen.getByText(/Receptionist not configured/i)).toBeInTheDocument();
    expect(screen.queryByTestId('receptionist-panel')).toBeNull();
  });

  it('shows booking, transfer and what it knows', () => {
    render(<ReceptionistPanel />);
    expect(screen.getByText('on · 30 min slots')).toBeInTheDocument();
    expect(screen.getByText('off')).toBeInTheDocument();
    expect(screen.getByText('6 services · 14 FAQs')).toBeInTheDocument();
  });
});

describe('receptionist stats', () => {
  it('renders ratios as percentages and the intent mix', () => {
    render(<ReceptionistPanel />);
    expect(screen.getByText('61%')).toBeInTheDocument();
    expect(screen.getByText('9%')).toBeInTheDocument();
    expect(screen.getByText('128')).toBeInTheDocument();
  });

  it('hides the failure signals when they are zero, and shows them in amber when not', () => {
    const { unmount } = render(<ReceptionistPanel />);
    expect(screen.queryByText(/hit capacity/)).toBeNull();
    unmount();

    stats = { ...STATS, busy_capacity: 2, silent_hangups: 1 };
    render(<ReceptionistPanel />);
    expect(screen.getByText('2 hit capacity')).toBeInTheDocument();
    expect(screen.getByText('1 silent hangups')).toBeInTheDocument();
  });
});

describe('blocklist', () => {
  it('rejects a non-E.164 number client-side with the same sentence the server sends', async () => {
    const user = userEvent.setup();
    render(<ReceptionistPanel />);

    await user.type(screen.getByLabelText('Number to block'), '030123456');
    await user.click(screen.getByRole('button', { name: 'Block' }));

    expect(screen.getByRole('alert').textContent).toContain('international format');
    expect(addMutate).not.toHaveBeenCalled();
  });

  it('sends a valid number with its reason', async () => {
    const user = userEvent.setup();
    render(<ReceptionistPanel />);

    await user.type(screen.getByLabelText('Number to block'), '+4930123456');
    await user.type(screen.getByLabelText('Reason'), 'abusive');
    await user.click(screen.getByRole('button', { name: 'Block' }));

    expect(addMutate).toHaveBeenCalledWith(
      { number: '+4930123456', reason: 'abusive' },
      expect.anything(),
    );
  });

  it('confirms before unblocking', async () => {
    const user = userEvent.setup();
    render(<ReceptionistPanel />);

    await user.click(screen.getByLabelText('Unblock +4930999999'));
    expect(removeMutate).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Unblock' }));
    expect(removeMutate).toHaveBeenCalledWith('+4930999999');
  });
});

describe('tool policy panel', () => {
  it('explains the mode in a sentence and groups the tools by tier', () => {
    render(<PolicyPanel />);
    expect(screen.getByText(/asks the caller out loud/i)).toBeInTheDocument();
    expect(screen.getByText('payments.refund', { selector: 'td' })).toBeInTheDocument();
    expect(screen.getByText(/Dangerous — money, deletion, irreversible/)).toBeInTheDocument();
    expect(screen.getByText('5 writes per call')).toBeInTheDocument();
    expect(screen.queryByTestId('policy-off-banner')).toBeNull();
    // Read-only in v1, and it says so rather than implying an editor.
    expect(screen.getByText(/configured via server settings/i)).toBeInTheDocument();
  });

  it('warns in the off mode with the doctor’s wording', () => {
    policy = { ...policy, global_mode: 'off' };
    render(<PolicyPanel />);
    expect(screen.getByTestId('policy-off-banner')).toBeInTheDocument();
    expect(screen.getByText('Autonomous writes during calls are enabled')).toBeInTheDocument();
    policy = { ...policy, global_mode: 'verbal' };
  });
});

describe('actions timeline v2', () => {
  const ACTIONS: CallAction[] = [
    {
      action_type: 'tool_call',
      tool_name: 'calendar.create_event',
      input_summary: 'Tue 14:00, 30 min',
      output_summary: 'created',
      user_confirmed: true,
      timestamp: '2026-08-20T09:10:00Z',
      tier: 'W',
      approval_mode: 'verbal',
    },
    {
      action_type: 'tool_call',
      tool_name: 'payments.refund',
      input_summary: '€84,50',
      output_summary: '',
      user_confirmed: false,
      timestamp: '2026-08-20T09:11:00Z',
      tier: 'X',
      approval_mode: 'user',
      deny_reason: 'user_denied',
    },
    {
      action_type: 'tool_call',
      tool_name: 'crm.update_contact',
      input_summary: 'new email',
      output_summary: 'ok',
      user_confirmed: null,
      timestamp: '2026-08-20T09:12:00Z',
      tier: 'W',
      approval_mode: 'off',
    },
  ];

  it('shows tier and gate per action, and the deny reason as a sentence', () => {
    render(<CallActionsTimeline actions={ACTIONS} />);
    const rows = screen.getAllByTestId('call-action-row');
    expect(rows).toHaveLength(3);
    expect(rows[1]).toHaveAttribute('data-denied', 'true');
    expect(screen.getByTestId('deny-reason').textContent).toMatch(/You denied this action/i);
    expect(screen.getByText('verbal')).toBeInTheDocument();
    expect(screen.getByText('you')).toBeInTheDocument();
  });

  it('discloses everything executed with approvals off', () => {
    render(<CallActionsTimeline actions={ACTIONS} />);
    const block = screen.getByTestId('autonomy-disclosure');
    expect(block.textContent).toContain('Executed autonomously during this call');
    expect(block.textContent).toContain('crm.update_contact');
    // The denied and the verbally-confirmed actions are NOT in the block.
    expect(block.textContent).not.toContain('payments.refund');
    expect(block.textContent).not.toContain('calendar.create_event');
  });

  it('renders no disclosure block when nothing ran autonomously', () => {
    render(<CallActionsTimeline actions={ACTIONS.slice(0, 2)} />);
    expect(screen.queryByTestId('autonomy-disclosure')).toBeNull();
  });
});
