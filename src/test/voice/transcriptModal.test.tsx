/**
 * The full-screen call view has to be the whole record of the call: what the
 * agent was told, how the call went, what came of it, what it cost, and the
 * transcript as evidence for all of it. The side panel had grown past it.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { CallDetail } from '@/lib/api/voice';

/** Shaped after a real payload from /api/voice/calls/{sid}. */
const CALL: CallDetail = {
  call_sid: 'CA111058af4247fe7d0107badcc7b2cce9',
  direction: 'inbound',
  status: 'completed',
  from_number: '+4930111222',
  to_number: '+4930999',
  started_at: '2026-08-21T12:27:13Z',
  ended_at: '2026-08-21T12:28:13Z',
  duration_seconds: 60,
  failure_code: 'none',
  failure_description: 'Completed normally',
  language: 'en',
  cost_total_usd: 0.182515,
  briefing: {
    task: 'Ask about the flower delivery complaint and offer a replacement.',
    source: 'dashboard',
    target_name: '',
  },
  analytics: {
    agent_speech_ms: 30_000,
    caller_speech_ms: 23_000,
    silence_ms: 19_000,
    overlap_ms: 0,
    interruptions: 4,
    talk_ratio: 30 / 53,
    method: 'estimated',
    sentiment: 'negative',
    sentiment_trajectory: 'stable',
    sentiment_rationale: 'Caller expressed dissatisfaction with flower quality.',
    sentiment_reason: '',
  },
  cost: {
    engine: 'conversation_relay',
    language: 'en',
    duration_seconds: 60,
    twilio_usd: 0.0685,
    stt_seconds: 0,
    stt_usd: 0,
    tts_characters: 0,
    tts_usd: 0,
    llm_input_tokens: 37_050,
    llm_output_tokens: 191,
    llm_usd: 0.114015,
    total_usd: 0.182515,
  },
  outcome: {
    outcome: 'complaint',
    task_result: 'Replacement offered and declined.',
    key_facts: ['Order arrived wilted'],
  },
  latency: {
    turns: 6,
    p50_ms: 820,
    p95_ms: 1400,
    stages_p50: { stt: 220, llm_ttft: 380, tts: 220, total: 820 },
  },
  transcript: [
    { speaker: 'system', text: '[BRIEFING] Ask about the flower delivery complaint.', confidence: 1, state: 'briefing', timestamp: '2026-08-21T12:27:13Z' },
    { speaker: 'caller', text: 'Hello.', confidence: 1, state: 'greeting', timestamp: '2026-08-21T12:27:15Z' },
    { speaker: 'agent', text: 'How can I assist you today?', confidence: 1, state: 'greeting', timestamp: '2026-08-21T12:27:17Z' },
  ],
  actions: [],
};

vi.mock('@/lib/capabilities', () => ({
  // FE10: operator features with no backend show only when the capability is declared; tests declare it.
  useCapabilities: () => ({ caps: {}, isLoading: false, isOff: () => false, isDeclared: () => true }),
  useHealth: () => ({ data: undefined }),
}));
vi.mock('@/lib/api/voice', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/api/voice')>();
  return { ...actual, useCallDetail: () => ({ data: CALL, isLoading: false }) };
});

const { default: TranscriptModal } = await import('@/pages/telephony/_components/voice/TranscriptModal');

const open = () =>
  render(
    <MemoryRouter>
      <TranscriptModal callSid={CALL.call_sid} open onClose={vi.fn()} />
    </MemoryRouter>,
  );

describe('the call, in full', () => {
  it('carries the briefing the agent was given', () => {
    open();
    expect(screen.getByText('Briefing')).toBeInTheDocument();
    expect(screen.getByText(/Ask about the flower delivery complaint and offer a replacement\./)).toBeInTheDocument();
    expect(screen.getByText('from the dashboard')).toBeInTheDocument();
  });

  it('carries how the call went, sentiment and rationale included', () => {
    open();
    expect(screen.getByText('How the call went')).toBeInTheDocument();
    expect(screen.getByText(/Agent 57%/)).toBeInTheDocument();
    expect(screen.getByText(/4 interruptions/)).toBeInTheDocument();
    expect(screen.getByText('Negative')).toBeInTheDocument();
    expect(screen.getByText(/dissatisfaction with flower quality/)).toBeInTheDocument();
    // Estimated timing stays labelled as estimated in here too.
    expect(screen.getAllByText('≈').length).toBeGreaterThan(0);
  });

  it('carries what came of it', () => {
    open();
    // Twice on purpose: as the briefing's adherence line, and as the outcome.
    expect(screen.getAllByText(/Replacement offered and declined\./)).toHaveLength(2);
    expect(screen.getByText('Order arrived wilted')).toBeInTheDocument();
  });

  it('carries the cost breakdown the totals were hiding', () => {
    open();
    const panel = screen.getByText('Cost').closest('section') as HTMLElement;
    expect(within(panel).getByText('Carrier')).toBeInTheDocument();
    expect(within(panel).getByText(/37,050 \/ 191/)).toBeInTheDocument();
    expect(within(panel).getByText('Total')).toBeInTheDocument();
    // The four components and the total, not just one number on the header.
    expect(within(panel).getByText('$0.183')).toBeInTheDocument();
    expect(within(panel).getByText('$0.114')).toBeInTheDocument();
  });

  it('shows the briefing transcript line as a divider, not as speech', async () => {
    const user = userEvent.setup();
    open();

    expect(screen.queryByText(/^\[BRIEFING\]/)).toBeNull();
    const divider = screen.getByRole('button', { name: /agent briefed/i });
    await user.click(divider);
    expect(screen.getByText('Ask about the flower delivery complaint.')).toBeInTheDocument();
  });

  it('still is a transcript reader: search filters the lines', async () => {
    const user = userEvent.setup();
    open();

    expect(screen.getByText('Hello.')).toBeInTheDocument();
    await user.type(screen.getByPlaceholderText(/search/i), 'assist');
    expect(screen.queryByText('Hello.')).toBeNull();
    expect(screen.getByText(/How can I/)).toBeInTheDocument();
  });
});
