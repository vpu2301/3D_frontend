/**
 * Regression cover for the outcome card.
 *
 * The backend writes `commitments` as `[{who, what, when}]` and
 * `follow_up_suggestions` as `[{tool, reason, draft_args}]` (see
 * pincer/voice/outcome.py). The panel used to type both as `string[]` and drop
 * the raw item straight into JSX — React refuses to render an object as a
 * child, which threw during render and blanked the whole app the moment a call
 * with a structured outcome was opened. These tests pin the real shape.
 */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import type { CallDetail } from '@/lib/api/voice';
import { parseOutcome } from '@/pages/telephony/_components/voice/CallOutcomePanel';

function outcomeAction(payload: unknown) {
  return {
    action_type: 'outcome',
    tool_name: '',
    input_summary: '',
    output_summary: JSON.stringify(payload),
    user_confirmed: null,
    timestamp: '2026-08-19T10:03:00Z',
  };
}

/** Exactly what pincer/voice/outcome.py serialises. */
const BACKEND_PAYLOAD = {
  outcome: 'completed',
  task_result: 'Termin gebucht.',
  key_facts: ['Dienstag 14:00 Uhr'],
  commitments: [{ who: 'agent', what: 'Bestätigung per E-Mail senden', when: '2026-08-20T09:00:00Z' }],
  follow_up_suggestions: [
    { tool: 'calendar_create_event', reason: 'Termin im Kalender eintragen', draft_args: {} },
  ],
  language: 'de',
};

const detail: CallDetail = {
  call_sid: 'CA123',
  direction: 'outbound',
  status: 'completed',
  from_number: '+4915112345678',
  to_number: '+4930987654',
  started_at: '2026-08-19T10:00:00Z',
  ended_at: '2026-08-19T10:03:20Z',
  duration_seconds: 200,
  transcript: [
    { speaker: 'agent', text: 'Guten Tag, hier ist Pincer.', confidence: 0.98, state: 'greeting', timestamp: '2026-08-19T10:00:01Z' },
    { speaker: 'caller', text: 'Hallo, ja bitte.', confidence: 0.74, state: 'greeting', timestamp: '2026-08-19T10:00:05Z' },
  ],
  actions: [outcomeAction(BACKEND_PAYLOAD)],
};

vi.mock('@/lib/api/voice', async (orig) => {
  const actual = await orig<typeof import('@/lib/api/voice')>();
  return { ...actual, useCallDetail: () => ({ data: detail, isLoading: false }) };
});

// Imported after the mock so the modal picks it up.
const { default: TranscriptModal } = await import(
  '@/pages/telephony/_components/voice/TranscriptModal'
);

describe('parseOutcome', () => {
  it('normalises the backend object shape', () => {
    const parsed = parseOutcome(outcomeAction(BACKEND_PAYLOAD))!;
    expect(parsed.commitments).toEqual([
      { who: 'agent', what: 'Bestätigung per E-Mail senden', when: '2026-08-20T09:00:00Z' },
    ]);
    expect(parsed.follow_up_suggestions).toEqual([
      { tool: 'calendar_create_event', reason: 'Termin im Kalender eintragen' },
    ]);
  });

  it('still accepts bare strings from older records', () => {
    const parsed = parseOutcome(
      outcomeAction({ outcome: 'partial', commitments: ['Ruft zurück'], follow_up_suggestions: ['Nachfassen'] }),
    )!;
    expect(parsed.commitments).toEqual([{ who: '', what: 'Ruft zurück', when: null }]);
    expect(parsed.follow_up_suggestions).toEqual([{ tool: '', reason: 'Nachfassen' }]);
  });

  it('drops junk instead of passing objects through to JSX', () => {
    const parsed = parseOutcome(
      outcomeAction({ outcome: 'completed', commitments: 'not-a-list', follow_up_suggestions: [{}] }),
    )!;
    expect(parsed.commitments).toEqual([]);
    expect(parsed.follow_up_suggestions).toEqual([]);
  });
});

describe('TranscriptModal with a structured outcome', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>;
  beforeEach(() => { errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {}); });
  afterEach(() => { errorSpy.mockRestore(); });

  it('renders the transcript and the outcome card without throwing', () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    render(
      <QueryClientProvider client={qc}>
        <TranscriptModal callSid="CA123" open onClose={() => {}} />
      </QueryClientProvider>,
    );

    expect(screen.getByText('Guten Tag, hier ist Pincer.')).toBeInTheDocument();
    expect(screen.getByText('Dienstag 14:00 Uhr')).toBeInTheDocument();
    expect(screen.getByText('Bestätigung per E-Mail senden')).toBeInTheDocument();
    expect(screen.getByText('Agent:')).toBeInTheDocument();
    expect(screen.getByText('Termin im Kalender eintragen')).toBeInTheDocument();
    expect(screen.getByText('calendar_create_event')).toBeInTheDocument();

    // The bug surfaced only as a console error before React tore the tree down.
    expect(errorSpy).not.toHaveBeenCalled();
  });
});

/**
 * The card expands in place: collapsed it answers "how did it go", expanded it
 * adds the facts the summary leaves out and the actions that act on it.
 */
describe('outcome card expansion', () => {
  const renderModal = () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
      <QueryClientProvider client={qc}>
        <TranscriptModal callSid="CA123" open onClose={() => {}} />
      </QueryClientProvider>,
    );
  };

  it('keeps the headline answer collapsed, and hides the rest behind one control', () => {
    renderModal();

    // Outcome, summary, facts, promises and next steps read without expanding.
    expect(screen.getByText('Termin gebucht.')).toBeInTheDocument();
    expect(screen.getByText('Dienstag 14:00 Uhr')).toBeInTheDocument();
    expect(screen.getByText('Bestätigung per E-Mail senden')).toBeInTheDocument();

    // The rest is not on screen yet.
    expect(screen.queryByText('Copy summary')).toBeNull();
    expect(screen.queryByText('Turn latency')).toBeNull();
    expect(screen.getByTestId('outcome-expand')).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows the call facts and the summary actions once expanded', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByTestId('outcome-expand'));

    expect(screen.getByTestId('outcome-expand')).toHaveAttribute('aria-expanded', 'true');
    // Facts about the call itself…
    expect(screen.getByText('Length')).toBeInTheDocument();
    expect(screen.getByText('Turn latency')).toBeInTheDocument();
    expect(screen.getByText('Tool calls')).toBeInTheDocument();
    // …and the three things you can do with the summary.
    expect(screen.getByRole('button', { name: /copy summary/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /email it/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /with ai/i })).toBeInTheDocument();
  });

  it('collapses again', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByTestId('outcome-expand'));
    await user.click(screen.getByTestId('outcome-expand'));

    expect(screen.queryByText('Copy summary')).toBeNull();
  });
});

/**
 * Follow-up actions live behind one "…" control that opens upwards: the block
 * sits at the foot of a scrolling rail.
 */
describe('follow-up menu', () => {
  const renderModal = () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
      <QueryClientProvider client={qc}>
        <TranscriptModal callSid="CA123" open onClose={() => {}} />
      </QueryClientProvider>,
    );
  };

  it('keeps the options behind the menu until it is opened', async () => {
    const user = userEvent.setup();
    renderModal();

    expect(screen.getByText('Follow up on this call')).toBeInTheDocument();
    expect(screen.queryByRole('menuitem')).toBeNull();

    await user.click(screen.getByRole('button', { name: /follow-up options/i }));
    const menu = screen.getByRole('menu');
    expect(menu).toHaveAttribute('data-direction', 'up');
    expect(menu.className).toContain('plat-menu-up');

    expect(screen.getByRole('menuitem', { name: /book a follow-up appointment/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /call again now/i })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /create follow-up task/i })).toBeInTheDocument();
    // …and the marks, in their own section.
    expect(screen.getByText('Mark this call')).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: /escalate/i })).toBeInTheDocument();
  });

  it('says which options are real and which are still local', async () => {
    const user = userEvent.setup();
    renderModal();
    await user.click(screen.getByRole('button', { name: /follow-up options/i }));

    expect(screen.getAllByText('real')).toHaveLength(2);
    expect(screen.getByText(/saved in this browser/i)).toBeInTheDocument();
  });

  it('marks the call, shows the mark, and lets it be cleared again', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: /follow-up options/i }));
    await user.click(screen.getByRole('menuitem', { name: /resolved/i }));
    expect(screen.queryByRole('menu')).toBeNull(); // choosing closes it

    await user.click(screen.getByRole('button', { name: /follow-up options/i }));
    expect(screen.getByRole('menuitem', { name: /resolved/i }).textContent).toContain('✓');

    // Choosing it again clears it — a mis-tagged call must be able to go back.
    await user.click(screen.getByRole('menuitem', { name: /resolved/i }));
    await user.click(screen.getByRole('button', { name: /follow-up options/i }));
    expect(screen.getByRole('menuitem', { name: /resolved/i }).textContent).not.toContain('✓');
  });

  it('closes on Escape without closing the transcript behind it', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole('button', { name: /follow-up options/i }));
    await user.keyboard('{Escape}');

    expect(screen.queryByRole('menu')).toBeNull();
    expect(screen.getByText('Guten Tag, hier ist Pincer.')).toBeInTheDocument();
  });
});

/**
 * Two layout regressions from the real app: the per-line copy button was pinned
 * to the far right of a full-width row, far from the line it belonged to; and
 * the rail overflowed its own width, putting a scrollbar under every pane.
 */
describe('transcript layout', () => {
  const renderModal = () => {
    const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
    return render(
      <QueryClientProvider client={qc}>
        <TranscriptModal callSid="CA123" open onClose={() => {}} />
      </QueryClientProvider>,
    );
  };

  it('anchors each copy button to the text of its own line', () => {
    renderModal();

    const buttons = screen.getAllByLabelText('Copy line');
    expect(buttons.length).toBeGreaterThan(0);
    for (const btn of buttons) {
      // Inside the text column, next to the words it copies.
      const textCell = btn.closest('.min-w-0');
      expect(textCell, 'copy button must live with the line text').not.toBeNull();
      expect(textCell!.textContent!.trim().length).toBeGreaterThan(0);
    }
    // The row is the hover target, so the icon has one obvious owner.
    const row = buttons[0].closest('.group')!;
    expect(row.className).toContain('hover:bg-');
  });

  it('never lets a vertical pane scroll sideways', () => {
    renderModal();

    // The dialog is portalled, so look in the document, not the container.
    const panes = [...document.body.querySelectorAll('.overflow-y-auto')];
    expect(panes.length).toBeGreaterThan(0);
    for (const pane of panes) {
      expect(pane.className, 'a vertical pane must clip horizontally').toContain('overflow-x-hidden');
    }
  });
});
