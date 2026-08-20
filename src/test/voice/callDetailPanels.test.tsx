/**
 * The v2 call-detail surfaces, end to end through the transcript modal:
 * appointment panel, latency panel, the language-switch divider, and the
 * approval state on follow-up suggestions.
 *
 * This is the integration cover for "the new fields are optional": the same
 * component renders a v1-shaped detail (no appointment, no latency, no
 * language) and a v2-shaped one, and neither throws. The v1 case is the one
 * that matters in production today — most backends have not caught up yet.
 */
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi } from 'vitest';
import type { CallDetail } from '@/lib/api/voice';

const V1_ONLY: CallDetail = {
  call_sid: 'CA-v1',
  direction: 'outbound',
  status: 'completed',
  from_number: '+4915112345678',
  to_number: '+4930987654',
  started_at: '2026-08-19T10:00:00Z',
  ended_at: '2026-08-19T10:03:20Z',
  duration_seconds: 200,
  transcript: [{ speaker: 'agent', text: 'Hello, Pincer here.', confidence: 0.98, state: 'final', timestamp: '2026-08-19T10:00:01Z' }],
  actions: [],
};

const V2: CallDetail = {
  ...V1_ONLY,
  call_sid: 'CA-v2',
  language: 'de',
  failure_code: null,
  cost_total_usd: 0.0412,
  outcome: {
    outcome: 'confirmed',
    task_result: 'Termin für Dienstag bestätigt.',
    key_facts: ['Dienstag 14:00 Uhr'],
    commitments: [],
    follow_up_suggestions: [
      { tool: 'send_email', reason: 'Bestätigung senden' },
      { tool: 'crm_update', reason: 'CRM aktualisieren' },
      { tool: 'calendar_create_event', reason: 'Termin eintragen' },
    ],
  },
  latency: {
    turns: 2,
    p50_ms: 940,
    p95_ms: 1810,
    stages_p50: { stt: 210, llm_ttft: 420, tts: 300, total: 930 },
    per_turn: [
      { turn: 1, stt_ms: 200, llm_ttft_ms: 400, tts_ms: 290, total_ms: 890 },
      { turn: 2, stt_ms: 230, llm_ttft_ms: 450, tts_ms: 320, total_ms: 1_000 },
    ],
  },
  appointment: {
    status: 'invitations_sent',
    agreed_datetime: '2026-08-25T12:00:00Z',
    duration_minutes: 30,
    calendar_event_link: 'https://calendar.example/event/abc',
    retry_count: 0,
  },
  transcript: [
    { speaker: 'agent', text: 'Hello, Pincer here.', confidence: 0.98, state: 'final', timestamp: '2026-08-19T10:00:01Z' },
    { speaker: 'system', text: '{"event":"language_switch","from":"en","to":"de","reason":"caller request"}', confidence: 1, state: 'final', timestamp: '2026-08-19T10:00:20Z' },
    { speaker: 'agent', text: 'Gerne auf Deutsch.', confidence: 0.97, state: 'final', timestamp: '2026-08-19T10:00:22Z' },
  ],
  actions: [
    // Suggested and carried out.
    { action_type: 'tool_call', tool_name: 'send_email', input_summary: 'Bestätigung', output_summary: 'sent', user_confirmed: true, timestamp: '2026-08-19T10:02:00Z' },
    // Suggested and refused.
    { action_type: 'tool_call', tool_name: 'crm_update', input_summary: 'Lead', output_summary: '', user_confirmed: false, timestamp: '2026-08-19T10:02:30Z' },
    // calendar_create_event was suggested but never called → pending.
  ],
};

let detail: CallDetail = V2;

vi.mock('@/lib/api/voice', async (orig) => {
  const actual = await orig<typeof import('@/lib/api/voice')>();
  return { ...actual, useCallDetail: () => ({ data: detail, isLoading: false }) };
});

const { default: TranscriptModal } = await import(
  '@/pages/telephony/_components/voice/TranscriptModal'
);

function renderModal() {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <MemoryRouter>
      <QueryClientProvider client={qc}>
        <TranscriptModal callSid={detail.call_sid} open onClose={() => {}} />
      </QueryClientProvider>
    </MemoryRouter>,
  );
}

describe('call detail with the v2 fields', () => {
  it('renders the language-switch SYSTEM entry as a divider, not a speaker line', () => {
    detail = V2;
    renderModal();

    expect(screen.getByText('switched to Deutsch at caller request')).toBeInTheDocument();
    // The raw JSON payload must never reach the reader.
    expect(screen.queryByText(/language_switch/)).not.toBeInTheDocument();
    // Both halves of the conversation still render.
    expect(screen.getByText('Hello, Pincer here.')).toBeInTheDocument();
    expect(screen.getByText('Gerne auf Deutsch.')).toBeInTheDocument();
  });

  it('shows the appointment, latency and cost the v2 API added', () => {
    detail = V2;
    renderModal();

    expect(screen.getByRole('link', { name: /open calendar event/i })).toBeInTheDocument();
    expect(screen.getByText('Turn latency')).toBeInTheDocument();
    expect(screen.getByText(/p50 940 ms/)).toBeInTheDocument();
    expect(screen.getByText('$0.041')).toBeInTheDocument();
  });

  it('marks each follow-up suggestion executed, denied or pending', () => {
    detail = V2;
    renderModal();

    // Scoped to the suggestion row: the actions rail below carries its own
    // ✓/✗ marks for the same tool calls.
    const markFor = (reason: string) =>
      screen.getByText(reason).closest('li')?.textContent ?? '';

    expect(markFor('Bestätigung senden')).toContain('✓ executed');
    expect(markFor('CRM aktualisieren')).toContain('✗ denied');
    expect(markFor('Termin eintragen')).toContain('pending');
  });

  it('renders a v1-shaped call — no new fields at all — without inventing any', () => {
    detail = V1_ONLY;
    renderModal();

    expect(screen.getByText('Hello, Pincer here.')).toBeInTheDocument();
    expect(screen.queryByText('Turn latency')).not.toBeInTheDocument();
    expect(screen.queryByText('Appointment')).not.toBeInTheDocument();
    expect(screen.queryByText(/^\$/)).not.toBeInTheDocument();
  });
});

/**
 * v3 adds the inbound half of the story: why the caller rang, and — for the
 * two intents that produce something the owner has to act on — a way to get
 * from the call to that thing.
 */
describe('call detail with the v3 inbound fields', () => {
  const INBOUND_MESSAGE: CallDetail = {
    ...V1_ONLY,
    call_sid: 'CA-v3-msg',
    direction: 'inbound',
    inbound_intent: 'message',
  };

  const INBOUND_BOOKING: CallDetail = {
    ...V1_ONLY,
    call_sid: 'CA-v3-book',
    direction: 'inbound',
    inbound_intent: 'appointment',
    appointment: {
      status: 'calendar_created',
      agreed_datetime: '2026-08-25T12:00:00Z',
      duration_minutes: 30,
      calendar_event_link: null,
      retry_count: 0,
    },
  };

  it('chips the intent and links a message-intent call to its inbox entry', () => {
    detail = INBOUND_MESSAGE;
    renderModal();

    expect(screen.getByText('message')).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /open in inbox/i });
    expect(link).toHaveAttribute('href', '/telephony/messages');
  });

  it('renders the v2 appointment panel for an INBOUND booking, not just outbound ones', () => {
    detail = INBOUND_BOOKING;
    renderModal();

    expect(screen.getByText('appointment')).toBeInTheDocument();
    expect(screen.getByText('Appointment')).toBeInTheDocument();
    // …and no inbox link: nothing was left for the owner to read.
    expect(screen.queryByRole('link', { name: /open in inbox/i })).toBeNull();
  });

  it('says nothing about intent on an outbound call', () => {
    detail = V1_ONLY;
    renderModal();
    expect(screen.queryByRole('link', { name: /open in inbox/i })).toBeNull();
  });
});
