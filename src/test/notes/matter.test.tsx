/**
 * S8, S9, S10, S13 — the matter page.
 *
 * The two claims worth testing are structural rather than visual: the page
 * assembles from **one** request, and it is complete when the AI is not there.
 * A firm that never switches AI on is the firm this feature has to work for —
 * P3 is archaeology, and archaeology is solved by the five factual sections.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import NotesMatter from '@/pages/notes/NotesMatter';
import NotesMiniRail from '@/pages/notes/_components/sidebar/NotesMiniRail';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useSavedViewsStore } from '@/pages/notes/_hooks/use-saved-views-store';
import { setFetcher, resetFetcher } from '@/pages/notes/_lib/apiClient';
import { prepareMeetingDocument } from '@/pages/notes/_lib/prepareMeeting';
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
  useSavedViewsStore.setState({ views: [], loaded: false, loading: false });
  await useNotesStore.getState().clearAll();
});

afterEach(() => resetFetcher());

function seedMatter(overrides: Record<string, unknown> = {}) {
  const noteId = server.addNote({ title: 'Besprechung 4. August' }).id;
  const matter = {
    key: 'mandant-mueller',
    label: 'mandant-mueller',
    kind: 'tag' as const,
    noteCount: 7,
    openTasks: 2,
    lastActivityAt: 1_700_000_000_000,
  };
  server.matterRows = [matter];
  server.matterViews.set('mandant-mueller', {
    matter,
    openObligations: {
      mine: [
        {
          id: 'o1',
          noteId,
          kind: 'task',
          text: 'Fristverlängerung beantragen',
          owedBy: 'me',
          dueAt: null,
          dueText: null,
        },
      ],
      theirs: [
        {
          id: 'o2',
          noteId,
          kind: 'task',
          text: 'Gutachten liefern',
          owedBy: 'Müller',
          dueAt: null,
          dueText: null,
        },
      ],
    },
    recentDecisions: [
      { id: 'd1', noteId, kind: 'decision', text: 'Vergleich abgelehnt', dueAt: null },
    ],
    notes: [{ id: noteId, title: 'Besprechung 4. August', snippet: 'Sachstand…', updatedAt: 1 }],
    documents: [
      { id: 'a1', noteId, filename: 'Vertrag_Mueller.pdf', mime: 'application/pdf', sizeBytes: 20480, createdAt: 1 },
    ],
    upcoming: [{ reminderId: 'r1', noteId, dueAt: 1_800_000_000_000, calendarEventId: null }],
    summary: { text: 'Der Mandant hat das Vergleichsangebot abgelehnt.', generated: true, stale: false, model: 'x' },
    ...overrides,
  });
  return { matter, noteId };
}

function renderMatter() {
  return render(
    <MemoryRouter initialEntries={['/notes/matter/mandant-mueller']}>
      <Routes>
        <Route path="/notes/matter/:key" element={<NotesMatter />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('S8 — six sections, one request', () => {
  it('assembles the whole page from a single matter call', async () => {
    seedMatter();
    renderMatter();

    await screen.findByText('Fristverlängerung beantragen');

    for (const heading of [
      'Open items',
      'Recent decisions',
      'Summary',
      'Notes',
      'Documents',
      'Upcoming',
    ]) {
      expect(screen.getByLabelText(heading)).toBeInTheDocument();
    }

    // One request for the page's content. Six sections must not be six spinners.
    const matterCalls = server.calls.filter((call) => call.startsWith('GET /v1/matters/'));
    expect(matterCalls).toHaveLength(1);
  });

  it('puts the facts above the generated paragraph', async () => {
    seedMatter();
    renderMatter();
    await screen.findByText('Fristverlängerung beantragen');

    const order = [...document.querySelectorAll('section[aria-label]')].map((section) =>
      section.getAttribute('aria-label'),
    );
    expect(order.indexOf('Summary')).toBeGreaterThan(order.indexOf('Open items'));
    expect(order.indexOf('Summary')).toBeGreaterThan(order.indexOf('Recent decisions'));
    expect(order.indexOf('Summary')).toBeLessThan(order.indexOf('Notes'));
  });

  it('labels the summary as written by the model, and folds it away', async () => {
    const user = userEvent.setup();
    seedMatter();
    renderMatter();

    await screen.findByText(/written by the model/i);
    await user.click(screen.getByRole('button', { name: 'Hide' }));
    expect(
      screen.queryByText('Der Mandant hat das Vergleichsangebot abgelehnt.'),
    ).not.toBeInTheDocument();
  });
});

describe('S9 — the page is complete without AI', () => {
  it('renders every factual section when the summary is absent', async () => {
    seedMatter({ summary: null });
    renderMatter();

    await screen.findByText('Fristverlängerung beantragen');
    expect(screen.getByText('Vergleich abgelehnt')).toBeInTheDocument();
    expect(screen.getByText('Vertrag_Mueller.pdf')).toBeInTheDocument();

    // No section, no spinner, no apology — the paragraph simply is not there.
    expect(screen.queryByLabelText('Summary')).not.toBeInTheDocument();
    expect(screen.queryByText(/AI (is )?(off|unavailable|disabled)/i)).not.toBeInTheDocument();
  });

  it('says when a cached summary predates the latest changes', async () => {
    seedMatter({
      summary: { text: 'Ein älterer Stand.', generated: true, stale: true, model: 'x' },
    });
    renderMatter();
    expect(await screen.findByText(/Written before the latest changes/i)).toBeInTheDocument();
  });
});

describe('S10 — prepare for a meeting', () => {
  it('creates a note carrying the matter and the open obligations', async () => {
    const user = userEvent.setup();
    seedMatter();
    renderMatter();
    await screen.findByText('Fristverlängerung beantragen');

    await user.click(screen.getByRole('button', { name: /Prepare for a meeting/ }));

    await waitFor(() => expect(server.calls).toContain('POST /v1/notes'));
    const created = [...server.notes.values()].find((note) =>
      String(note.title ?? '').startsWith('Preparation'),
    )!;
    // Linked to the matter by the tag it is a projection of.
    expect(created.tags).toContain('mandant-mueller');

    const document = JSON.stringify(created.content);
    expect(document).toContain('Fristverlängerung beantragen');
    expect(document).toContain('Gutachten liefern');
    expect(document).toContain('Vergleich abgelehnt');
    expect(document).toContain('taskItem');
    expect(navigate).toHaveBeenCalledWith(`/notes/${created.id}`);
  });

  it('opens a writable note even when nothing is outstanding', () => {
    const empty = prepareMeetingDocument({
      matter: { key: 'k', label: 'Quiet matter', kind: 'tag', noteCount: 3, openTasks: 0 },
      openObligations: { mine: [], theirs: [] },
      recentDecisions: [],
      notes: [],
      documents: [],
      upcoming: [],
      summary: null,
    } as never);

    expect(JSON.stringify(empty)).toContain('Nothing outstanding on Quiet matter');
    // Ends on an empty paragraph: somewhere for the caret to land.
    expect(empty.content?.at(-1)).toEqual({ type: 'paragraph' });
  });

  it('carries the owner and the due date into the checklist line', () => {
    const document = prepareMeetingDocument({
      matter: { key: 'k', label: 'M', kind: 'tag', noteCount: 3, openTasks: 1 },
      openObligations: {
        mine: [{ id: '1', noteId: 'n', kind: 'task', text: 'Send it', owedBy: 'me', dueAt: null, dueText: null }],
        theirs: [],
      },
      recentDecisions: [],
      notes: [],
      documents: [],
      upcoming: [],
      summary: null,
    } as never);
    expect(JSON.stringify(document)).toContain('Send it — Me');
  });
});

describe('S13 — matters need no configuration', () => {
  it('lists them in the rail for a corpus that only ever used tags', async () => {
    seedMatter();
    render(
      <MemoryRouter initialEntries={['/notes']}>
        <NotesMiniRail />
      </MemoryRouter>,
    );

    // Nothing was set up: the row exists because the server promoted a tag the
    // user already had.
    expect(await screen.findByText('Matters')).toBeInTheDocument();
    const rail = screen.getByText('Matters').closest('div')!.parentElement!;
    expect(within(rail).getByText('mandant-mueller')).toBeInTheDocument();
  });

  it('shows no matters section at all when the server offers none', async () => {
    server.matterRows = [];
    render(
      <MemoryRouter initialEntries={['/notes']}>
        <NotesMiniRail />
      </MemoryRouter>,
    );
    await waitFor(() => expect(server.calls).toContain('GET /v1/matters'));
    expect(screen.queryByText('Matters')).not.toBeInTheDocument();
  });
});
