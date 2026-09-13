/**
 * The briefing trust loop: what the user writes reaches the call, and what
 * reached the call is what the detail view shows afterwards.
 *
 * The bug this closes was "I wrote it, the agent ignored it", so the load
 * bearing assertions are about the text surviving intact — a 1,800-character
 * paste with its line breaks, a rejected purpose explained in the server's own
 * words, and the stored briefing rendered verbatim.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { CallDetail } from '@/lib/api/voice';
import type { PincerError } from '@/lib/pincerClient';
import {
  MAX_TASK_CHARS,
  briefingError,
  briefingExamples,
  briefingSentNote,
  callBackPurpose,
  charCount,
  clampBriefing,
  followUpPurpose,
  truncatedToast,
} from '@/pages/telephony/_lib/briefing';
import { failureLabel, failureTitle } from '@/pages/telephony/_lib/voiceMeta';

const initiateMutate = vi.fn();
const toastFn = vi.fn();

vi.mock('@/lib/capabilities', () => ({
  // FE10: operator features with no backend show only when the capability is declared; tests declare it.
  useCapabilities: () => ({ caps: {}, isLoading: false, isOff: () => false, isDeclared: () => true }),
  useHealth: () => ({ data: undefined }),
}));
vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: toastFn }) }));

vi.mock('@/lib/api/voice', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api/voice')>();
  return {
    ...actual,
    useContacts: () => ({ data: [] }),
    useInitiateCall: () => ({ mutate: initiateMutate, isPending: false }),
    useScheduleAppointment: () => ({ mutate: vi.fn(), isPending: false }),
    useScheduleCall: () => ({ mutate: vi.fn(), isPending: false }),
  };
});

const { default: StartCallModal } = await import('@/pages/telephony/_components/voice/StartCallModal');
const { default: CallDetailBody } = await import('@/pages/telephony/_components/voice/CallDetailBody');

const renderAt = (ui: React.ReactNode) => render(<MemoryRouter>{ui}</MemoryRouter>);

const openComposer = async () => {
  const user = userEvent.setup();
  renderAt(<StartCallModal onClose={vi.fn()} initialMode="now" initialNumber="+4930111222" />);
  return user;
};

const purposeField = () => screen.getByLabelText(/^Purpose \*$/i) as HTMLTextAreaElement;
const callButton = () => screen.getByRole('button', { name: /^(Call|Dialing…)$/ });

beforeEach(() => {
  initiateMutate.mockClear();
  toastFn.mockClear();
});

describe('briefing rules mirror the server', () => {
  it('refuses a purpose the API would refuse, in the API’s words', () => {
    expect(briefingError('Talk', 'task')).toBe(
      'Purpose too short — tell the agent concretely what to do on this call.',
    );
    // Whitespace is never a briefing.
    expect(briefingError('          ', 'task')).not.toBeNull();
    expect(briefingError('Ask when they close today', 'task')).toBeNull();
  });

  it('checks the topic against the appointment flow’s own minimum', () => {
    // The backend composes the task around the topic, so 3 chars is its gate.
    expect(briefingError('Kickoff', 'topic')).toBeNull();
    expect(briefingError('ab', 'topic')).toContain('what the appointment is about');
  });

  it('keeps the head of an over-long paste and reports the cut', () => {
    const long = 'x'.repeat(MAX_TASK_CHARS + 500);
    const { value, truncated } = clampBriefing(long);
    expect(truncated).toBe(true);
    expect(value).toHaveLength(MAX_TASK_CHARS);
    expect(clampBriefing('short').truncated).toBe(false);
  });

  it('writes follow-up and call-back stubs a person can send as-is', () => {
    expect(followUpPurpose('Warehouse rollout', 'Rückruf am Freitag (Fri 21 Aug)')).toBe(
      'Follow-up on: Warehouse rollout. Rückruf am Freitag (Fri 21 Aug)',
    );
    expect(followUpPurpose('Invoice 114', null)).toBe('Follow-up on: Invoice 114.');
    expect(callBackPurpose('Anna Weber', 'x'.repeat(400))).toHaveLength(
      'Return call for Anna Weber: '.length + 200,
    );
  });
});

describe('purpose field', () => {
  it('holds an 1,800-character paste whole, with its line breaks, and counts it', async () => {
    const user = await openComposer();
    const pasted = Array.from({ length: 60 }, (_, i) => `Line ${i + 1}: ${'detail '.repeat(3)}`).join('\n').slice(0, 1800);

    await user.click(purposeField());
    await user.paste(pasted);

    expect(purposeField().value).toBe(pasted);
    expect(purposeField().value).toHaveLength(1800);
    expect(purposeField().value.split('\n').length).toBeGreaterThan(10);
    // The counter appears once the ceiling is in sight.
    expect(screen.getByText(`1,800 / ${MAX_TASK_CHARS.toLocaleString('en-US')}`)).toBeInTheDocument();
  });

  it('truncates an over-long paste and says so rather than dropping the tail quietly', async () => {
    const user = await openComposer();

    await user.click(purposeField());
    await user.paste('y'.repeat(MAX_TASK_CHARS + 300));

    expect(purposeField().value).toHaveLength(MAX_TASK_CHARS);
    expect(toastFn).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Purpose truncated to 2,000 characters' }),
    );
  });

  it('disables the call for an 8-character purpose and explains why', async () => {
    const user = await openComposer();

    await user.type(purposeField(), 'Call mum');
    await user.tab();

    expect(callButton()).toBeDisabled();
    expect(
      screen.getByText('Purpose too short — tell the agent concretely what to do on this call.'),
    ).toBeInTheDocument();
    expect(initiateMutate).not.toHaveBeenCalled();
  });

  it('sends the purpose verbatim and confirms how much of it went', async () => {
    const user = await openComposer();
    const purpose = 'Ask when they close today and whether Saturday needs an appointment.';

    await user.click(purposeField());
    await user.paste(purpose);
    await user.click(callButton());

    expect(initiateMutate).toHaveBeenCalledWith(
      expect.objectContaining({ purpose, target_number: '+4930111222' }),
      expect.anything(),
    );

    // The success toast answers "did my text actually go?".
    const [, handlers] = initiateMutate.mock.calls[0];
    handlers.onSuccess({ call_sid: 'CA9' });
    expect(toastFn).toHaveBeenCalledWith(
      expect.objectContaining({ description: expect.stringContaining(`briefing sent (${purpose.length} chars)`) }),
    );
  });

  it('puts a 422 on the field, verbatim, instead of a toast', async () => {
    const user = await openComposer();

    await user.click(purposeField());
    await user.paste('Ask them about the thing');
    await user.click(callButton());

    const [, handlers] = initiateMutate.mock.calls[0];
    const err = Object.assign(new Error('Purpose too short — tell the agent concretely what to do on this call.'), {
      status: 422,
    }) as PincerError;
    handlers.onError(err);

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Purpose too short — tell the agent concretely what to do on this call.',
    );
    expect(toastFn).not.toHaveBeenCalledWith(expect.objectContaining({ title: 'Call failed' }));
    expect(purposeField()).toHaveFocus();
  });

  it('shows the do/don’t examples without blocking an unusual briefing', async () => {
    const user = await openComposer();

    expect(screen.getByText(/too vague — the agent needs a concrete goal/)).toBeInTheDocument();

    await user.click(purposeField());
    await user.paste('Recite the alphabet backwards, then hang up without saying goodbye.');
    expect(callButton()).toBeEnabled();
  });
});

describe('briefing panel', () => {
  const base: CallDetail = {
    call_sid: 'CA1',
    direction: 'outbound',
    status: 'completed',
    from_number: '+4930999',
    to_number: '+4930111222',
    started_at: '2026-08-20T09:00:00Z',
    ended_at: '2026-08-20T09:03:00Z',
    duration_seconds: 180,
    briefing: {
      task: 'Ask when they close today.\nIf they close before 18:00, ask about Saturday.',
      source: 'dashboard',
      target_name: 'Anna Weber',
    },
    transcript: [
      { speaker: 'system', text: '[BRIEFING] Ask when they close today.', confidence: 1, state: 'briefing', timestamp: '' },
      { speaker: 'agent', text: 'Guten Tag!', confidence: 1, state: '', timestamp: '' },
    ],
    actions: [],
  };

  it('shows the stored briefing verbatim, with its source and line breaks', () => {
    renderAt(<CallDetailBody detail={{ ...base, outcome: { outcome: 'completed', task_result: 'They close at 17:00.' } }} />);

    expect(screen.getByText(/Ask when they close today\./)).toBeInTheDocument();
    expect(screen.getByText('from the dashboard')).toBeInTheDocument();
    const body = screen.getByText(/If they close before 18:00/);
    expect(body.className).toContain('whitespace-pre-wrap');
  });

  it('reports the task result as the adherence signal', () => {
    renderAt(<CallDetailBody detail={{ ...base, outcome: { outcome: 'completed', task_result: 'They close at 17:00.' } }} />);
    expect(screen.getByText('They close at 17:00.')).toBeInTheDocument();
  });

  it('flags a completed call that produced no result', () => {
    renderAt(<CallDetailBody detail={base} />);
    expect(screen.getByText('No task result was extracted — check the transcript.')).toBeInTheDocument();
  });

  it('passes no judgement on a call that never happened', () => {
    renderAt(<CallDetailBody detail={{ ...base, failure_code: 'no_answer' }} />);
    expect(screen.queryByText(/No task result was extracted/)).toBeNull();
    expect(screen.getByText(/nothing to judge the briefing against/)).toBeInTheDocument();
  });

  it('renders the older calls without a briefing as a stated absence', () => {
    renderAt(<CallDetailBody detail={{ ...base, briefing: null }} />);
    expect(screen.getByText('No briefing recorded (older call)')).toBeInTheDocument();
  });

  it('draws the [BRIEFING] transcript line as a divider, not as speech', async () => {
    const user = userEvent.setup();
    renderAt(<CallDetailBody detail={base} />);

    const divider = screen.getByRole('button', { name: /agent briefed/i });
    expect(screen.queryByText('[BRIEFING] Ask when they close today.')).toBeNull();

    await user.click(divider);
    expect(screen.getAllByText('Ask when they close today.').length).toBeGreaterThan(0);
  });
});

describe('briefing_lost and the two UI languages', () => {
  it('names the failure and takes the blame off the user', () => {
    expect(failureLabel('briefing_lost')).toBe('briefing lost (system)');
    const en = failureTitle('briefing_lost');
    expect(en).toContain('did not reach the call');
    expect(en).toContain('system error');
    expect(failureTitle('briefing_lost', 'de')).toContain('Systemfehler');
    // Anything without an explanation still shows its code, never a guess.
    expect(failureTitle('no_answer')).toBe('Failure code: no_answer');
  });

  it('speaks German where the UI does', () => {
    expect(briefingError('kurz', 'task', 'de')).toContain('Auftrag zu kurz');
    expect(truncatedToast('de')).toContain('gekürzt');
    expect(briefingSentNote(312, 'de')).toBe('Auftrag gesendet (312 Zeichen)');
    expect(briefingSentNote(312, 'en')).toBe('briefing sent (312 chars)');
    expect(charCount(1743, 'de')).toBe('1.743 / 2.000');
    expect(charCount(1743, 'en')).toBe('1,743 / 2,000');
    expect(briefingExamples('de').some((e) => !e.good)).toBe(true);
    expect(followUpPurpose('Rollout', null, 'de')).toBe('Nachfassen zu: Rollout.');
  });
});

