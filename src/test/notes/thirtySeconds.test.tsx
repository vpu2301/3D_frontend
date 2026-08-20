/**
 * O6 — the 30-second goal, measured rather than asserted.
 *
 * **What this measures and what it does not.** It scripts the path from "the
 * meeting note is finished" to "the obligations are confirmed" over a 900-word
 * German fixture, and counts the two things that actually determine the elapsed
 * time: how many discrete actions the user performs, and how many round trips
 * the app makes. It does not measure seconds — jsdom has no rendering, no
 * network latency and no human, so a stopwatch here would produce a number that
 * looks like evidence and is not. The timed run belongs in a browser harness,
 * and until one exists this is the honest half of the claim.
 *
 * The budget: **four actions and one request.** Reviewing four proposals, fixing
 * one date, and confirming. At the pace of an unhurried desk user — call it four
 * seconds an action including reading — that is inside thirty seconds with room
 * to spare. Every action added to this path is a regression against the sprint's
 * acceptance criterion, and this test is where it shows up.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoteProposalCard from '@/pages/notes/_components/editor/NoteProposalCard';
import { useOutcomesStore } from '@/pages/notes/_hooks/use-outcomes-store';
import { setActiveEditor, type ActiveEditor } from './testDoubles';
import { setFetcher, resetFetcher } from '@/pages/notes/_lib/apiClient';
import { FakeNotesServer } from './fakeNotesServer';
import { GERMAN_MEETING_NOTE, GERMAN_MEETING_PROPOSALS } from './fixtures/germanMeeting';
import type { Note } from '@/pages/notes/_lib/types';

vi.mock('sonner', () => ({
  toast: Object.assign(() => undefined, {
    error: () => undefined,
    success: () => undefined,
    warning: () => undefined,
  }),
}));

vi.mock('@/auth/apiFetch', () => ({
  notesApiBlocker: () => null,
  canReachNotesApi: () => true,
  apiFetch: () => {
    throw new Error('tests must go through setFetcher');
  },
  NotAuthenticatedError: class NotAuthenticatedError extends Error {},
  NOTES_API_URL: '',
  NOTES_API_CONFIGURED: true,
}));

/** The budget this sprint is accountable to. */
const ACTION_BUDGET = 4;
const REQUEST_BUDGET = 1;

let server: FakeNotesServer;

beforeEach(() => {
  server = new FakeNotesServer();
  setFetcher(server.fetcher);
  useOutcomesStore.getState().reset();
  localStorage.removeItem('notes:dismissed-proposals:v1');
});

afterEach(() => {
  resetFetcher();
  setActiveEditor(null);
});

function editorFor(noteId: string): ActiveEditor {
  return {
    noteId,
    getJSON: () => ({ type: 'doc' }),
    getSelectedText: () => '',
    focus: () => undefined,
    blur: () => undefined,
    flush: async () => undefined,
    highlightSource: () => undefined,
    scrollToSource: () => true,
  };
}

describe('O6 — from a finished meeting note to confirmed obligations', () => {
  it('costs four actions and one request on a 900-word German note', async () => {
    const user = userEvent.setup();

    // The note is finished and the server has already extracted — which is the
    // premise of the goal: the proposals are waiting when the user looks up,
    // because BE-1 runs on the first idle period after writing stops.
    const note = server.addNote({
      title: 'Besprechung Mandat Müller',
      content: GERMAN_MEETING_NOTE.content,
    });
    expect(GERMAN_MEETING_NOTE.wordCount).toBeGreaterThan(850);

    for (const proposal of GERMAN_MEETING_PROPOSALS) {
      server.addOutcome({ noteId: note.id, ...proposal });
    }

    setActiveEditor(editorFor(note.id));
    render(<NoteProposalCard note={{ id: note.id, version: 1 } as unknown as Note} />);
    await screen.findByText('Found in this note');

    const callsBefore = server.calls.length;
    let actions = 0;

    // Action 1 — the one item that is not theirs to promise: untick it.
    await user.click(screen.getByLabelText('Confirm: Gutachten zur Schadenshöhe liefern'));
    actions++;

    // Actions 2–3 — the model read "bis Ende der Woche" and left no date; the
    // user fixes it in place, with no dialog between them and the fix.
    const due = screen.getByLabelText(
      'Due date for: Fristverlängerung beim Landgericht beantragen',
    ) as HTMLInputElement;
    await user.clear(due);
    actions++;
    await user.type(due, '2026-08-08');
    actions++;

    // Action 4 — confirm the set.
    await user.click(screen.getByRole('button', { name: /Confirm 3/ }));
    actions++;

    await waitFor(() => {
      const confirmed = [...server.outcomes.values()].filter((o) => o.status === 'open');
      expect(confirmed).toHaveLength(3);
    });

    const requests = server.calls.length - callsBefore;

    // The measurement, recorded here so a regression names itself.
    expect(actions).toBeLessThanOrEqual(ACTION_BUDGET);
    // One confirm-batch. A per-item confirm, or a patch-then-confirm, is four
    // round trips instead of one and the goal is gone.
    expect(server.calls.filter((c) => c === 'POST /v1/outcomes/confirm-batch')).toHaveLength(1);
    expect(requests).toBeLessThanOrEqual(REQUEST_BUDGET + 1); // + the summary refresh

    // The edit arrived with the confirmation, not before it.
    expect(server.calls.filter((c) => c.startsWith('PATCH /v1/outcomes/'))).toHaveLength(0);
    const withDate = [...server.outcomes.values()].find((o) =>
      o.text.startsWith('Fristverlängerung'),
    )!;
    expect(withDate.dueAt).not.toBeNull();

    // And the one that was not the user's to confirm is still waiting, not lost.
    const untouched = [...server.outcomes.values()].find((o) =>
      o.text.startsWith('Gutachten'),
    )!;
    expect(untouched.status).toBe('proposed');
  });

  it('costs two actions when the model got everything right', async () => {
    const user = userEvent.setup();
    const note = server.addNote({ content: GERMAN_MEETING_NOTE.content });
    for (const proposal of GERMAN_MEETING_PROPOSALS.slice(0, 3)) {
      server.addOutcome({ noteId: note.id, ...proposal, confidence: 0.95 });
    }

    setActiveEditor(editorFor(note.id));
    render(<NoteProposalCard note={{ id: note.id, version: 1 } as unknown as Note} />);
    await screen.findByText('Found in this note');

    // Read, then confirm. That is the whole path when nothing needs fixing —
    // which is the case the pre-checked default exists for.
    await user.click(screen.getByRole('button', { name: /Confirm 3/ }));

    await waitFor(() =>
      expect([...server.outcomes.values()].every((o) => o.status === 'open')).toBe(true),
    );
    expect(server.calls.filter((c) => c === 'POST /v1/outcomes/confirm-batch')).toHaveLength(1);
  });

  it('is reachable entirely from the keyboard, at the same cost', async () => {
    const user = userEvent.setup();
    const note = server.addNote({ content: GERMAN_MEETING_NOTE.content });
    for (const proposal of GERMAN_MEETING_PROPOSALS) {
      server.addOutcome({ noteId: note.id, ...proposal, confidence: 0.95 });
    }

    setActiveEditor(editorFor(note.id));
    render(<NoteProposalCard note={{ id: note.id, version: 1 } as unknown as Note} />);
    await screen.findByText('Found in this note');

    screen.getByRole('region', { name: /Suggestions found in this note/i }).focus();
    // j j j space — untick the third — then enter.
    await user.keyboard('jj ');
    await user.keyboard('{Enter}');

    await waitFor(() => {
      const confirmed = [...server.outcomes.values()].filter((o) => o.status === 'open');
      expect(confirmed).toHaveLength(GERMAN_MEETING_PROPOSALS.length - 1);
    });
  });
});
