/**
 * S2, S5, S6 and S14 — the search page as a person meets it.
 *
 * The load-bearing assertion is S6: an empty result set must never render as an
 * empty page. BE-2 retries a query that matched nothing with the semantic leg
 * alone and labels it `closest`; if the UI shows those without the label, or
 * shows a blank page instead of them, the sprint's central claim about memory is
 * broken in the one moment a user is most likely to give up.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import NotesSearch from '@/pages/notes/NotesSearch';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
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

let server: FakeNotesServer;

beforeEach(async () => {
  server = new FakeNotesServer();
  setFetcher(server.fetcher);
  navigate.mockClear();
  await useNotesStore.getState().clearAll();
});

afterEach(() => resetFetcher());

function renderSearch(search = '') {
  return render(
    <MemoryRouter initialEntries={[`/notes/search${search}`]}>
      <NotesSearch />
    </MemoryRouter>,
  );
}

describe('S2 — arriving from the palette', () => {
  it('runs the query in the URL and puts the caret after it', async () => {
    const note = server.addNote({ title: 'Fristverlängerung' });
    server.searchResults = [
      { noteId: note.id, title: 'Fristverlängerung', snippet: 'die <b>Frist</b> läuft' },
    ];

    renderSearch('?q=Frist');

    const input = (await screen.findByLabelText('Search every note')) as HTMLInputElement;
    expect(input.value).toBe('Frist');
    expect(input.selectionStart).toBe('Frist'.length);
    expect(document.activeElement).toBe(input);

    expect(await screen.findByText('Fristverlängerung')).toBeInTheDocument();
  });

  it('sends the bare string, not a DSL query, when nothing is narrowed', async () => {
    server.searchResults = [];
    renderSearch('?q=Gutachten');
    await waitFor(() => expect(server.searchRequests).toHaveLength(1));
    const body = server.searchRequests[0] as Record<string, unknown>;
    expect(body.q).toBe('Gutachten');
    // Sending both is a 422 by contract; the client must pick one.
    expect(body.query).toBeUndefined();
  });
});

describe('S6 — an empty result set is never an empty page', () => {
  it('labels the server’s semantic fallbacks rather than showing nothing', async () => {
    const note = server.addNote({ title: 'Besprechung Weber' });
    server.searchClosest = true;
    server.searchResults = [
      { noteId: note.id, title: 'Besprechung Weber', snippet: 'Termin mit Herrn Weber' },
    ];

    renderSearch('?q=irgendwas+halb+erinnertes');

    expect(await screen.findByText('Similar matches')).toBeInTheDocument();
    expect(
      screen.getByText(/Nothing contains those exact words/i),
    ).toBeInTheDocument();
    expect(screen.getByText('Besprechung Weber')).toBeInTheDocument();
  });

  it('says so plainly when even the fallback found nothing', async () => {
    server.searchResults = [];
    renderSearch('?q=zzzz');
    expect(await screen.findByText(/by words or by meaning/i)).toBeInTheDocument();
  });

  it('invites a fragment before anything is typed', async () => {
    renderSearch();
    expect(await screen.findByText(/Type a fragment of what you remember/i)).toBeInTheDocument();
  });
});

describe('S5 — narrowing', () => {
  it('switches to the DSL and carries the clause', async () => {
    const user = userEvent.setup();
    server.searchResults = [];
    renderSearch('?q=Frist');
    await waitFor(() => expect(server.searchRequests).toHaveLength(1));

    await user.click(screen.getByRole('button', { name: /Has an attachment/ }));

    await waitFor(() => expect(server.searchRequests.length).toBeGreaterThan(1));
    const body = server.searchRequests.at(-1) as { query?: { all?: unknown[] }; q?: string };
    expect(body.q).toBeUndefined();
    expect(JSON.stringify(body.query)).toContain('hasAttachment');
    // The text the user typed survives the narrowing.
    expect(JSON.stringify(body.query)).toContain('Frist');
  });

  it('marks an active chip so the narrowing is visible', async () => {
    const user = userEvent.setup();
    renderSearch('?q=Frist');
    const chip = screen.getByRole('button', { name: /Has open items/ });
    expect(chip).toHaveAttribute('aria-pressed', 'false');
    await user.click(chip);
    expect(chip).toHaveAttribute('aria-pressed', 'true');
  });
});

describe('the retrieval mode is a hidden option', () => {
  it('is not on screen until the options are opened', async () => {
    const user = userEvent.setup();
    renderSearch('?q=Frist');
    expect(screen.queryByRole('button', { name: 'Exact words' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Options' }));
    expect(screen.getByRole('button', { name: 'Exact words' })).toBeInTheDocument();
  });

  it('sends the chosen mode through the DSL', async () => {
    const user = userEvent.setup();
    server.searchResults = [];
    renderSearch('?q=Frist');
    await user.click(screen.getByRole('button', { name: 'Options' }));
    await user.click(screen.getByRole('button', { name: 'Exact words' }));

    await waitFor(() => {
      const body = server.searchRequests.at(-1) as { query?: unknown };
      expect(JSON.stringify(body.query)).toContain('"mode":"fts"');
    });
  });
});

describe('S14 — the result list is navigable from the keyboard', () => {
  it('moves with the arrows and opens with Enter', async () => {
    const user = userEvent.setup();
    const first = server.addNote({ title: 'One' });
    const second = server.addNote({ title: 'Two' });
    server.searchResults = [
      { noteId: first.id, title: 'One', snippet: 'a' },
      { noteId: second.id, title: 'Two', snippet: 'b' },
    ];

    renderSearch('?q=x');
    await screen.findByText('One');

    (screen.getByLabelText('Search every note') as HTMLInputElement).focus();
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(navigate).toHaveBeenCalledWith(`/notes/${second.id}`);
  });
});

describe('S11 — saving the search that is on screen', () => {
  it('stores the exact query the page is running', async () => {
    const user = userEvent.setup();
    server.searchResults = [];
    renderSearch('?q=Fristverl%C3%A4ngerung');
    await waitFor(() => expect(server.searchRequests).toHaveLength(1));

    await user.click(screen.getByRole('button', { name: /Has open items/ }));
    await waitFor(() => expect(server.searchRequests.length).toBeGreaterThan(1));

    await user.click(screen.getByRole('button', { name: /Save this search/ }));

    await waitFor(() => expect(server.savedViews.size).toBe(1));
    const saved = [...server.savedViews.values()][0] as { query: unknown; name: string };
    // Exactly the DSL the page ran — same clauses, so the view reproduces the
    // same rows rather than approximating them.
    expect(JSON.stringify(saved.query)).toContain('Fristverlängerung');
    expect(JSON.stringify(saved.query)).toContain('hasOutcome');
  });
});
