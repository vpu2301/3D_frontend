/**
 * Sprint 6's honesty rule, made testable.
 *
 * The rule is that a calendar write that failed is NOT a booked appointment.
 * The tempting UI — green timeline, "invitations sent", a calendar button that
 * 404s — is exactly what this panel must never render, because the operator's
 * whole reason for opening it is to find out whether someone is expected in a
 * room at 14:00. So the failure path is asserted as hard as the happy path.
 *
 * The clock is pinned to Europe/Berlin by vitest.config.ts, which is what makes
 * the 12:00Z → 02:00 PM assertion below mean anything.
 */
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import type { AppointmentDetail } from '@/lib/api/voice';
import AppointmentPanel from '@/pages/telephony/_components/voice/AppointmentPanel';

const BOOKED: AppointmentDetail = {
  status: 'invitations_sent',
  agreed_datetime: '2026-08-25T12:00:00Z',
  duration_minutes: 30,
  calendar_event_link: 'https://calendar.example/event/abc',
  retry_count: 0,
  topic: 'Kick-off for the warehouse rollout',
  candidates: [
    { start: '2026-08-25T08:00:00Z' },
    { start: '2026-08-25T12:00:00Z', accepted: true },
    { start: '2026-08-26T09:00:00Z' },
  ],
  attendees: ['anna@example.com', 'tom@example.com'],
};

describe('AppointmentPanel — booked', () => {
  it('shows the agreed slot, the slots that were offered, and the calendar link', () => {
    render(<AppointmentPanel appointment={BOOKED} />);

    // 12:00Z is 14:00 in Berlin, which jsdom's en-US locale renders as 02:00 PM.
    expect(screen.getByText(/Aug 25 · 02:00 PM \(30 min\)/)).toBeInTheDocument();
    expect(screen.getByText('Slots offered (3)')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /open calendar event/i })).toHaveAttribute(
      'href',
      'https://calendar.example/event/abc',
    );
    expect(screen.getByText('anna@example.com, tom@example.com')).toBeInTheDocument();
    expect(screen.queryByText(/not booked/i)).not.toBeInTheDocument();
  });
});

describe('AppointmentPanel — calendar write failed', () => {
  const FAILED: AppointmentDetail = {
    status: 'failed',
    agreed_datetime: '2026-08-25T12:00:00Z',
    duration_minutes: 30,
    calendar_event_link: null,
    retry_count: 0,
    calendar_error: 'Google Calendar rejected the insert: insufficient permissions on the target calendar.',
    follow_up: 'Owner notified by email; the slot is held in the call record only.',
  };

  it('says the slot is not booked and repeats the backend reason verbatim', () => {
    render(<AppointmentPanel appointment={FAILED} />);

    expect(screen.getByText('Calendar write failed')).toBeInTheDocument();
    expect(
      screen.getAllByText(/insufficient permissions on the target calendar/i).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText(/Owner notified by email/)).toBeInTheDocument();
    expect(screen.getByText(/The slot is not booked/)).toBeInTheDocument();
  });

  it('offers no calendar link there is nothing behind', () => {
    render(<AppointmentPanel appointment={FAILED} />);
    expect(screen.queryByRole('link', { name: /open calendar event/i })).not.toBeInTheDocument();
  });
});

describe('AppointmentPanel — retries', () => {
  it('summarises re-dials when the backend sends no per-attempt history', () => {
    render(
      <AppointmentPanel
        appointment={{
          status: 'no_slot',
          agreed_datetime: null,
          duration_minutes: 30,
          calendar_event_link: null,
          retry_count: 2,
          max_retries: 2,
        }}
      />,
    );
    expect(screen.getByText('None agreed')).toBeInTheDocument();
    expect(screen.getByText(/Re-dialed 2 times of 2 allowed/)).toBeInTheDocument();
  });

  it('lists each attempt when it does', () => {
    render(
      <AppointmentPanel
        appointment={{
          status: 'proposed',
          agreed_datetime: null,
          duration_minutes: null,
          calendar_event_link: null,
          retry_count: 1,
          attempts: [
            { attempt: 1, at: '2026-08-24T09:00:00Z', outcome: 'no_answer' },
            { attempt: 2, at: '2026-08-24T15:00:00Z', outcome: 'in_progress' },
          ],
        }}
      />,
    );
    expect(screen.getByText('#1')).toBeInTheDocument();
    expect(screen.getByText(/no answer/)).toBeInTheDocument();
    expect(screen.getByText(/in progress/)).toBeInTheDocument();
  });
});
