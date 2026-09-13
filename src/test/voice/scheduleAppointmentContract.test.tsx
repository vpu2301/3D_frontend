/**
 * The appointment call must be posted in the shape /api/voice/schedule declares.
 *
 * Before this test the modal sent `target_name`, `timeframe_start`,
 * `timeframe_end`, `create_meet_link` and an `attendees` ARRAY, while the
 * endpoint requires `contact_name` and reads `timeframe`, `location_or_meet`
 * and a comma-joined `attendees` string — so every appointment call came back
 * 422 on a missing required field. Nothing caught it because the hook is
 * mocked everywhere it is exercised, which is exactly what a hand-written
 * request type buys you (F0 cut list §3).
 *
 * So this asserts against the contract itself rather than a copy of it: the
 * body may carry no key the component does not declare, and must carry every
 * key it marks required.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import spec from '@/lib/api/generated/openapi.json';

const appointmentMutate = vi.fn();

vi.mock('@/lib/capabilities', () => ({
  useCapabilities: () => ({ caps: {}, isLoading: false, isOff: () => false, isDeclared: () => true }),
  useHealth: () => ({ data: undefined }),
}));
vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: vi.fn() }) }));

vi.mock('@/lib/api/voice', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api/voice')>();
  return {
    ...actual,
    useContacts: () => ({ data: [] }),
    useInitiateCall: () => ({ mutate: vi.fn(), isPending: false }),
    useScheduleCall: () => ({ mutate: vi.fn(), isPending: false }),
    useScheduleAppointment: () => ({ mutate: appointmentMutate, isPending: false }),
  };
});

const { default: StartCallModal } = await import('@/pages/telephony/_components/voice/StartCallModal');

const COMPONENT = (spec as any).components.schemas.ScheduleAppointmentIn;

beforeEach(() => appointmentMutate.mockClear());

describe('POST /api/voice/schedule', () => {
  it('sends only fields the contract declares, and every field it requires', async () => {
    const user = userEvent.setup();
    render(<StartCallModal onClose={vi.fn()} initialMode="appointment" initialNumber="+4930111222" />);

    await user.type(screen.getByLabelText(/topic/i), 'Quarterly review');
    await user.click(screen.getByRole('button', { name: /call & book/i }));

    expect(appointmentMutate).toHaveBeenCalled();
    const body = appointmentMutate.mock.calls[0][0] as Record<string, unknown>;

    const declared = Object.keys(COMPONENT.properties);
    expect(declared).toContain('contact_name');
    expect(Object.keys(body).filter((k) => !declared.includes(k))).toEqual([]);
    for (const key of COMPONENT.required as string[]) {
      expect(body[key], `required field "${key}"`).toBeTruthy();
    }
    // The two the old body got wrong, spelled out so a revert is loud.
    expect(body).not.toHaveProperty('timeframe_start');
    expect(body).not.toHaveProperty('target_name');
  });
});
