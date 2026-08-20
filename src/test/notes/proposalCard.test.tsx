/**
 * O1, O4 and O5 — the confirmation surface as a person meets it.
 *
 * The claims under test are the ones the sprint says decide whether the product
 * works: proposals are pre-checked except the uncertain ones, hovering proves
 * where an item came from, editing happens inline and rides along in the same
 * confirm call, and the whole thing is reachable without a mouse.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoteProposalCard from '@/pages/notes/_components/editor/NoteProposalCard';
import { useOutcomesStore } from '@/pages/notes/_hooks/use-outcomes-store';
import { setActiveEditor, setFetcher, type ActiveEditor } from './testDoubles';
import { resetFetcher } from '@/pages/notes/_lib/apiClient';
import { FakeNotesServer } from './fakeNotesServer';
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

let server: FakeNotesServer;
let highlighted: Array<string | null>;

const note = (id: string, version = 3): Note =>
  ({
    id,
    version,
    content: { type: 'doc', content: [] },
    tags: [],
    links: [],
    reminders: [],
    pinned: false,
    trashed: false,
    notebookId: null,
    createdAt: 1,
    updatedAt: 1,
  }) as unknown as Note;

/** A stand-in editor that records what the card asked it to light up. */
function fakeEditor(noteId: string): ActiveEditor {
  return {
    noteId,
    getJSON: () => ({ type: 'doc' }),
    getSelectedText: () => '',
    focus: () => undefined,
    blur: () => undefined,
    flush: async () => undefined,
    highlightSource: (quote) => highlighted.push(quote),
    scrollToSource: () => true,
  };
}

beforeEach(() => {
  server = new FakeNotesServer();
  setFetcher(server.fetcher);
  highlighted = [];
  // jsdom's localStorage shim in this setup has no `clear`; removing the one
  // key the card writes is enough and does not depend on the shim's shape.
  localStorage.removeItem('notes:dismissed-proposals:v1');
  useOutcomesStore.getState().reset();
});

afterEach(() => {
  resetFetcher();
  setActiveEditor(null);
});

async function renderCard(noteId: string, version = 3) {
  setActiveEditor(fakeEditor(noteId));
  const view = render(<NoteProposalCard note={note(noteId, version)} />);
  await screen.findByText('Found in this note');
  return view;
}

describe('O1 — proposals arrive pre-checked, except the uncertain ones', () => {
  it('ticks the confident ones and leaves the doubtful one for a human', async () => {
    const target = server.addNote({});
    server.addOutcome({ noteId: target.id, text: 'File the extension', confidence: 0.95 });
    server.addOutcome({ noteId: target.id, text: 'Send the papers', confidence: 0.88 });
    server.addOutcome({ noteId: target.id, text: 'Maybe something', confidence: 0.3 });

    await renderCard(target.id);

    const boxes = screen.getAllByRole('checkbox') as HTMLInputElement[];
    expect(boxes.filter((box) => box.checked)).toHaveLength(2);
    expect(screen.getByLabelText('Confirm: Maybe something')).not.toBeChecked();
    // The primary action counts what it will actually do.
    expect(screen.getByRole('button', { name: /Confirm 2/ })).toBeInTheDocument();
  });

  it('says nothing has been saved yet, because nothing has', async () => {
    const target = server.addNote({});
    server.addOutcome({ noteId: target.id, text: 'A task' });
    await renderCard(target.id);
    expect(screen.getByText(/nothing saved yet/i)).toBeInTheDocument();
  });

  it('stays dismissed for this note version and comes back for the next one', async () => {
    const target = server.addNote({});
    server.addOutcome({ noteId: target.id, text: 'A task' });

    const { unmount } = await renderCard(target.id, 3);
    await userEvent.click(screen.getByRole('button', { name: 'Later' }));
    expect(screen.queryByText('Found in this note')).not.toBeInTheDocument();
    unmount();

    // Same version: still gone, even after a remount.
    render(<NoteProposalCard note={note(target.id, 3)} />);
    await waitFor(() =>
      expect(screen.queryByText('Found in this note')).not.toBeInTheDocument(),
    );

    // The user wrote more, so there is something new to look at.
    render(<NoteProposalCard note={note(target.id, 4)} />);
    expect(await screen.findByText('Found in this note')).toBeInTheDocument();
  });
});

describe('O4 — hovering proves where an item came from', () => {
  it('lights up that row’s sentence and clears it on the way out', async () => {
    const target = server.addNote({});
    server.addOutcome({
      noteId: target.id,
      text: 'File the extension',
      anchor: { quote: 'Wir beantragen eine Fristverlängerung.', state: 'anchored' },
    });
    await renderCard(target.id);

    const row = screen.getByText('File the extension').closest('li')!;
    await userEvent.hover(row);
    expect(highlighted.at(-1)).toBe('Wir beantragen eine Fristverlängerung.');

    await userEvent.unhover(row);
    expect(highlighted.at(-1)).toBeNull();
  });
});

describe('O5 — the whole review works from the keyboard', () => {
  it('moves, toggles, edits a date and confirms without a mouse', async () => {
    const user = userEvent.setup();
    const target = server.addNote({});
    server.addOutcome({ noteId: target.id, text: 'First', confidence: 0.9 });
    server.addOutcome({ noteId: target.id, text: 'Second', confidence: 0.9 });

    await renderCard(target.id);
    const card = screen.getByRole('region', { name: /Suggestions found in this note/i });
    card.focus();

    // j moves to the second row, space unticks it.
    await user.keyboard('j');
    await user.keyboard(' ');
    expect(screen.getByLabelText('Confirm: Second')).not.toBeChecked();
    expect(screen.getByLabelText('Confirm: First')).toBeChecked();

    // Editing the date is an inline field, reachable by tab, with no dialog.
    const date = screen.getByLabelText('Due date for: First') as HTMLInputElement;
    await user.clear(date);
    await user.type(date, '2026-08-15');

    card.focus();
    await user.keyboard('{Enter}');

    await waitFor(() => {
      const confirmed = [...server.outcomes.values()].filter((o) => o.status === 'open');
      expect(confirmed).toHaveLength(1);
      expect(confirmed[0].text).toBe('First');
    });
  });

  it('escape puts the card away without deciding anything', async () => {
    const user = userEvent.setup();
    const target = server.addNote({});
    server.addOutcome({ noteId: target.id, text: 'Untouched' });

    await renderCard(target.id);
    screen.getByRole('region', { name: /Suggestions/i }).focus();
    await user.keyboard('{Escape}');

    expect(screen.queryByText('Found in this note')).not.toBeInTheDocument();
    // Still proposed. Dismissing is not deciding.
    expect([...server.outcomes.values()].every((o) => o.status === 'proposed')).toBe(true);
  });
});

describe('O3 in the card — an inline edit reaches the server with the confirmation', () => {
  it('sends the edited owner in the confirm-batch body, with no prior patch', async () => {
    const user = userEvent.setup();
    const target = server.addNote({});
    server.addOutcome({ noteId: target.id, text: 'Deliver the report', confidence: 0.9 });

    await renderCard(target.id);
    const owner = screen.getByLabelText('Owner for: Deliver the report');
    await user.clear(owner);
    await user.type(owner, 'Müller');
    await user.click(screen.getByRole('button', { name: /Confirm 1/ }));

    await waitFor(() => {
      const row = [...server.outcomes.values()][0];
      expect(row.status).toBe('open');
      expect(row.owedBy).toBe('Müller');
    });
    expect(server.calls.filter((c) => c.startsWith('PATCH /v1/outcomes/'))).toHaveLength(0);
  });
});

describe('discarding', () => {
  it('drops every proposal and leaves nothing confirmed', async () => {
    const user = userEvent.setup();
    const target = server.addNote({});
    server.addOutcome({ noteId: target.id, text: 'One' });
    server.addOutcome({ noteId: target.id, text: 'Two' });

    await renderCard(target.id);
    await user.click(screen.getByRole('button', { name: /Discard all/ }));

    await waitFor(() =>
      expect(screen.queryByText('Found in this note')).not.toBeInTheDocument(),
    );
    expect([...server.outcomes.values()].every((o) => o.status === 'dropped')).toBe(true);
  });
});

describe('O12 — no proposals means no card', () => {
  it('renders nothing at all rather than an empty panel', async () => {
    const target = server.addNote({});
    setActiveEditor(fakeEditor(target.id));
    const { container } = render(<NoteProposalCard note={note(target.id)} />);
    await waitFor(() => expect(useOutcomesStore.getState().loadedNotes[target.id]).toBe(true));
    expect(within(container).queryByText(/Found in this note/)).not.toBeInTheDocument();
  });
});
