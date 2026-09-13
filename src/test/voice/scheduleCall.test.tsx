/**
 * Scheduling a call in minutes, not only on a date.
 *
 * "In 20 minutes" is how someone thinks about a call they want to make
 * shortly; a date picker makes them do clock arithmetic, and at 23:50 it
 * makes them get the date right too.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { fromLocalInput, leadTimeLabel, stampIn } from '@/pages/telephony/_lib/planned';

const toastFn = vi.fn();
const scheduleMutate = vi.fn();

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
    useInitiateCall: () => ({ mutate: vi.fn(), isPending: false }),
    useScheduleAppointment: () => ({ mutate: vi.fn(), isPending: false }),
    useScheduleCall: () => ({ mutate: scheduleMutate, isPending: false }),
  };
});

const { default: StartCallModal } = await import('@/pages/telephony/_components/voice/StartCallModal');

const NOW = new Date('2026-08-21T22:40:00');

beforeEach(() => {
  toastFn.mockClear();
  scheduleMutate.mockClear();
  vi.useFakeTimers({ shouldAdvanceTime: true });
  vi.setSystemTime(NOW);
});

afterEach(() => vi.useRealTimers());

describe('when a scheduled call goes out', () => {
  it('turns minutes from now into a local stamp, across midnight', () => {
    expect(stampIn(20, NOW)).toBe('2026-08-21 23:00');
    // 23:50 + 20 min is tomorrow — the arithmetic a date picker leaves to you.
    expect(stampIn(20, new Date('2026-08-21T23:50:00'))).toBe('2026-08-22 00:10');
    expect(stampIn(120, NOW)).toBe('2026-08-22 00:40');
  });

  it('reads a datetime-local value the way the store keeps it', () => {
    expect(fromLocalInput('2026-08-22T09:15')).toBe('2026-08-22 09:15');
  });

  it('says how far off a moment is, in the units a person would use', () => {
    expect(leadTimeLabel('2026-08-21 22:55', NOW)).toBe('in 15 min');
    expect(leadTimeLabel('2026-08-22 00:20', NOW)).toBe('in 1 h 40 min');
    expect(leadTimeLabel('2026-08-22 00:40', NOW)).toBe('in 2 h');
    expect(leadTimeLabel('2026-08-21 22:00', NOW)).toBe('overdue');
    expect(leadTimeLabel('not a date', NOW)).toBe('');
  });
});

describe('the composer', () => {
  /**
   * The modal opens on "Call now"; the scheduled variants live behind the
   * chevron beside it, so switching mode is two clicks, not one pill.
   */
  const openLater = async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<StartCallModal onClose={vi.fn()} initialMode="now" initialNumber="+4930111222" />);
    await user.click(screen.getByRole('button', { name: /change call type/i }));
    await user.click(screen.getByRole('menuitem', { name: /schedule a call/i }));
    return user;
  };

  it('opens on "Call now" and offers the rest behind one chevron', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<StartCallModal onClose={vi.fn()} initialNumber="+4930111222" />);

    // One control, not three pills: the default is the instant call.
    expect(screen.getByTestId('call-mode')).toHaveTextContent('Call now');
    for (const gone of [/^schedule a call$/i, /^schedule appointment$/i]) {
      expect(screen.queryByRole('button', { name: gone })).not.toBeInTheDocument();
    }

    await user.click(screen.getByRole('button', { name: /change call type/i }));
    const items = screen.getAllByRole('menuitem').map((el) => el.textContent);
    expect(items).toHaveLength(3);
    expect(items[0]).toMatch(/Call now/);
    expect(items[1]).toMatch(/Schedule a call/);
    expect(items[2]).toMatch(/Schedule appointment/);
  });

  it('moves the button to whatever the menu picked', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<StartCallModal onClose={vi.fn()} initialNumber="+4930111222" />);

    await user.click(screen.getByRole('button', { name: /change call type/i }));
    await user.click(screen.getByRole('menuitem', { name: /schedule appointment/i }));

    expect(screen.getByTestId('call-mode')).toHaveTextContent('Schedule appointment');
    // …and the form under it is the appointment form.
    expect(screen.getByRole('button', { name: 'Today' })).toBeInTheDocument();
  });

  it('offers minutes, not only a date', async () => {
    await openLater();

    for (const label of ['in 5 min', 'in 15 min', 'in 30 min', 'in 1 hour', 'in 2 hours']) {
      expect(screen.getByRole('button', { name: label })).toBeInTheDocument();
    }
    // …and the exact moment is spelled out, so nobody has to trust the chip.
    expect(screen.getByText(/dials at 2026-08-21 22:55 · in 15 min/)).toBeInTheDocument();
    // The guardrails that apply then are named, because they still apply.
    expect(screen.getByText(/do-not-call list still apply/)).toBeInTheDocument();
  });

  it('asks the backend for the call in minutes, not as a date', async () => {
    const user = await openLater();

    await user.click(screen.getByRole('button', { name: 'in 30 min' }));
    await user.click(screen.getByLabelText(/^Purpose \*$/i));
    await user.paste('Ask whether the delivery arrived and confirm the address.');
    await user.click(screen.getByRole('button', { name: /^schedule call$/i }));

    // Minutes go over the wire as minutes: the server does the arithmetic
    // against its own clock, so a slow form cannot drift the moment.
    expect(scheduleMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        target_number: '+4930111222',
        run_in_minutes: 30,
        purpose: expect.stringContaining('Ask whether the delivery arrived'),
      }),
      expect.anything(),
    );
    expect(scheduleMutate.mock.calls[0][0]).not.toHaveProperty('at');
  });

  it('still takes an exact time when that is what you mean', async () => {
    const user = await openLater();

    await user.click(screen.getByRole('button', { name: 'pick a time' }));
    const field = screen.getByLabelText('Date and time for the call');
    await user.type(field, '2026-08-22T09:15');
    await user.click(screen.getByLabelText(/^Purpose \*$/i));
    await user.paste('Confirm the Friday appointment before the office opens.');
    await user.click(screen.getByRole('button', { name: /^schedule call$/i }));

    expect(scheduleMutate).toHaveBeenCalledWith(
      expect.objectContaining({ at: '2026-08-22 09:15' }),
      expect.anything(),
    );
    expect(scheduleMutate.mock.calls[0][0]).not.toHaveProperty('run_in_minutes');
  });

  it('confirms with the moment the server settled on', async () => {
    const user = await openLater();

    await user.click(screen.getByLabelText(/^Purpose \*$/i));
    await user.paste('Ask about the invoice that was due last week.');
    await user.click(screen.getByRole('button', { name: /^schedule call$/i }));

    const [, handlers] = scheduleMutate.mock.calls[0];
    handlers.onSuccess({
      id: 7,
      target_number: '+4930111222',
      target_name: '',
      purpose: 'Ask about the invoice that was due last week.',
      language: '',
      thread_id: '',
      next_run_at: '2026-08-21T20:55:00+00:00',
      timezone: 'Europe/Berlin',
    });
    // The server's time, not the browser's guess at it.
    expect(toastFn).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Call scheduled', description: expect.stringContaining('+4930111222') }),
    );
  });

  it('puts a refused purpose on the field and a refused moment in a toast', async () => {
    const user = await openLater();

    await user.click(screen.getByLabelText(/^Purpose \*$/i));
    await user.paste('Ask about the invoice that was due last week.');
    await user.click(screen.getByRole('button', { name: /^schedule call$/i }));

    const [, handlers] = scheduleMutate.mock.calls[0];
    handlers.onError(
      Object.assign(new Error('That moment has already passed.'), { status: 422 }),
    );
    expect(await screen.findByRole('alert')).toHaveTextContent('That moment has already passed.');
  });

  it('will not schedule without a moment or a purpose', async () => {
    const user = await openLater();

    const submit = () => screen.getByRole('button', { name: /^schedule call$/i });
    expect(submit()).toBeDisabled(); // no purpose yet

    await user.click(screen.getByLabelText(/^Purpose \*$/i));
    await user.paste('Ask about the delivery that never arrived.');
    expect(submit()).toBeEnabled();

    await user.click(screen.getByRole('button', { name: 'pick a time' }));
    expect(submit()).toBeDisabled(); // …and now no time
  });

  it('lets an appointment be booked for today, not only tomorrow', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<StartCallModal onClose={vi.fn()} initialMode="appointment" initialNumber="+4930111222" />);

    expect(screen.getByRole('button', { name: 'Today' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Today' }));
    // The resolved window is printed back as a concrete date, not as the
    // preset's name — "today" meaning today is obvious, "next week" is not.
    expect(screen.getByText(/Aug 21/)).toBeInTheDocument();
  });
});
