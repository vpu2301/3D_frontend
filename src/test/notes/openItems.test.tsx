/**
 * O7, O8, O9 and O12 — the page that answers P2.
 *
 * The three tabs are three server queries, and the assertions here are mostly
 * about that: that each tab asks the right question, that the counts on them are
 * the summary's rather than a tally, and that clicking a row lands on the
 * sentence the obligation came from.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import NotesOpenItems from '@/pages/notes/NotesOpenItems';
import { useOutcomesStore } from '@/pages/notes/_hooks/use-outcomes-store';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import { setFetcher, resetFetcher } from '@/pages/notes/_lib/apiClient';
import { FakeNotesServer } from './fakeNotesServer';

const navigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return { ...actual, useNavigate: () => navigate };
});

vi.mock('sonner', () => ({
  toast: Object.assign(() => undefined, {
    error: () => undefined,
    success: () => undefined,
    warning: () => undefined,
  }),
  // `NotesLayout` mounts the toaster; the mock has to carry it or the whole
  // page fails to render for a reason that has nothing to do with the test.
  Toaster: () => null,
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

// The rail renders the sidebar badge from the same store, which is the point of
// mounting the whole page rather than an extracted list.
let server: FakeNotesServer;

beforeEach(async () => {
  server = new FakeNotesServer();
  setFetcher(server.fetcher);
  navigate.mockClear();
  useOutcomesStore.getState().reset();
  useNotesUiStore.setState({ pendingSourceQuote: null });
  await useNotesStore.getState().clearAll();
});

afterEach(() => resetFetcher());

const day = (offset: number) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  date.setHours(12, 0, 0, 0);
  return date.getTime();
};

function renderPage(search = '') {
  return render(
    <MemoryRouter initialEntries={[`/notes/open${search}`]}>
      <NotesOpenItems />
    </MemoryRouter>,
  );
}

describe('O7 — each tab is its own server question', () => {
  it('asks for what I owe, grouped by when it is due', async () => {
    const note = server.addNote({ title: 'Müller meeting' });
    server.addOutcome({ noteId: note.id, status: 'open', owedBy: 'me', text: 'Late thing', dueAt: day(-3) });
    server.addOutcome({ noteId: note.id, status: 'open', owedBy: 'me', text: 'Today thing', dueAt: day(0) });
    server.addOutcome({ noteId: note.id, status: 'open', owedBy: 'me', text: 'Soon thing', dueAt: day(3) });
    server.addOutcome({ noteId: note.id, status: 'open', owedBy: 'me', text: 'Far thing', dueAt: day(30) });
    server.addOutcome({ noteId: note.id, status: 'open', owedBy: 'me', text: 'Undated thing' });
    // Not mine, and not confirmed — neither belongs in this tab. The texts are
    // deliberately unlike any tab label, so a match cannot come from the chrome.
    server.addOutcome({ noteId: note.id, status: 'open', owedBy: 'Müller', text: 'Belongs to Müller' });
    server.addOutcome({ noteId: note.id, status: 'proposed', owedBy: 'me', text: 'Still a suggestion' });

    renderPage();

    await screen.findByText('Late thing');
    expect(server.calls.some((c) => c.includes('owedBy=me') && c.includes('status=open'))).toBe(true);

    for (const heading of ['Overdue (1)', 'Today (1)', 'This week (1)', 'Later (1)', 'No date (1)']) {
      expect(screen.getByText(heading)).toBeInTheDocument();
    }
    expect(screen.queryByText('Belongs to Müller')).not.toBeInTheDocument();
    expect(screen.queryByText('Still a suggestion')).not.toBeInTheDocument();
  });

  it('asks a different question on the promised-to-me tab', async () => {
    const note = server.addNote({});
    server.addOutcome({
      noteId: note.id,
      status: 'open',
      owedBy: 'Müller',
      owedTo: 'me',
      text: 'Expert opinion from Müller',
    });
    server.addOutcome({ noteId: note.id, status: 'open', owedBy: 'me', text: 'Draft the reply' });

    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Draft the reply');

    await user.click(screen.getByRole('tab', { name: /Promised to me/ }));

    expect(await screen.findByText('Expert opinion from Müller')).toBeInTheDocument();
    expect(screen.queryByText('Draft the reply')).not.toBeInTheDocument();
    expect(server.calls.some((c) => c.includes('owedTo=me'))).toBe(true);
  });

  it('groups the unconfirmed queue by note, because reviewing happens a note at a time', async () => {
    const first = server.addNote({ title: 'Monday call' });
    const second = server.addNote({ title: 'Tuesday call' });
    server.addOutcome({ noteId: first.id, text: 'From Monday' });
    server.addOutcome({ noteId: second.id, text: 'From Tuesday' });

    const user = userEvent.setup();
    renderPage();
    await waitFor(() => expect(server.calls.length).toBeGreaterThan(0));
    await user.click(screen.getByRole('tab', { name: /Unconfirmed/ }));

    expect(await screen.findByText('From Monday')).toBeInTheDocument();
    // The title appears twice per group — as its heading and on the row's chip.
    expect(screen.getAllByText(/Monday call/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Tuesday call/).length).toBeGreaterThan(0);
    expect(server.calls.some((c) => c.includes('status=proposed'))).toBe(true);
  });
});

describe('O11 — the counts on the tabs come from the summary', () => {
  it('shows the server’s numbers, not the length of what was rendered', async () => {
    const note = server.addNote({});
    server.addOutcome({ noteId: note.id, status: 'open', owedBy: 'me', text: 'Mine' });
    server.addOutcome({ noteId: note.id, status: 'proposed', text: 'Waiting' });

    renderPage();
    await screen.findByText('Mine');

    expect(server.calls).toContain('GET /v1/outcomes/summary');
    const tab = screen.getByRole('tab', { name: /Unconfirmed/ });
    // 1 unconfirmed, from `summary.unconfirmed` — the rendered list has none,
    // because this tab is not open.
    await waitFor(() => expect(within(tab).getByText('1')).toBeInTheDocument());
  });
});

describe('O8 — a row opens its note at the sentence', () => {
  it('hands the quote over and navigates', async () => {
    const note = server.addNote({ title: 'Meeting' });
    server.addOutcome({
      noteId: note.id,
      status: 'open',
      owedBy: 'me',
      text: 'File the extension',
      anchor: { quote: 'Wir beantragen eine Fristverlängerung.', state: 'anchored' },
    });

    const user = userEvent.setup();
    renderPage();
    await user.click(await screen.findByText('File the extension'));

    expect(useNotesUiStore.getState().pendingSourceQuote).toBe(
      'Wir beantragen eine Fristverlängerung.',
    );
    expect(navigate).toHaveBeenCalledWith(`/notes/${note.id}`);
  });

  it('does not offer a jump for an orphaned anchor', async () => {
    const note = server.addNote({});
    server.addOutcome({
      noteId: note.id,
      status: 'open',
      owedBy: 'me',
      text: 'Older obligation',
      anchor: { quote: 'a sentence that was rewritten', state: 'orphaned' },
    });

    const user = userEvent.setup();
    renderPage();
    await user.click(await screen.findByText('Older obligation'));

    // The note still opens — the obligation is real — but nothing pretends to
    // know where it came from.
    expect(useNotesUiStore.getState().pendingSourceQuote).toBeNull();
    expect(navigate).toHaveBeenCalledWith(`/notes/${note.id}`);
  });
});

describe('O9 — completing from the list', () => {
  it('ticks immediately and tells the server', async () => {
    const note = server.addNote({});
    const outcome = server.addOutcome({
      noteId: note.id,
      status: 'open',
      owedBy: 'me',
      text: 'Send the papers',
    });

    const user = userEvent.setup();
    renderPage();
    await user.click(await screen.findByLabelText('Complete: Send the papers'));

    await waitFor(() => expect(server.outcomes.get(outcome.id)!.status).toBe('done'));
  });

  it('bulk-completes a shift-selected range', async () => {
    const note = server.addNote({});
    const rows = ['One', 'Two', 'Three'].map((text) =>
      server.addOutcome({ noteId: note.id, status: 'open', owedBy: 'me', text, dueAt: day(1) }),
    );

    const user = userEvent.setup();
    renderPage();
    await screen.findByText('One');

    // `fireEvent` rather than `userEvent`: the modifier has to be on the click
    // event itself, which is what the range-select reads.
    fireEvent.click(screen.getByText('One'), { shiftKey: true });
    expect(await screen.findByText('1 selected')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Three'), { shiftKey: true });
    expect(await screen.findByText('3 selected')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Mark done' }));

    await waitFor(() => {
      for (const row of rows) expect(server.outcomes.get(row.id)!.status).toBe('done');
    });
  });
});

describe('O12 — the empty states say three different things', () => {
  it('celebrates an empty "I owe"', async () => {
    renderPage();
    expect(await screen.findByText('Nothing open')).toBeInTheDocument();
  });

  it('explains an empty "promised to me"', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nothing open');
    await user.click(screen.getByRole('tab', { name: /Promised to me/ }));
    expect(await screen.findByText('Nobody owes you anything')).toBeInTheDocument();
  });

  it('explains an empty review queue', async () => {
    const user = userEvent.setup();
    renderPage();
    await screen.findByText('Nothing open');
    await user.click(screen.getByRole('tab', { name: /Unconfirmed/ }));
    expect(await screen.findByText('Nothing waiting')).toBeInTheDocument();
  });
});
