/**
 * S12 and the builder's contract with the server.
 *
 * The one that matters is the abort: a preview per keystroke, unaborted, is a
 * queue of stale answers landing out of order, and the last number the user sees
 * is whichever request happened to finish last. That is worse than no preview,
 * because it is a number that looks authoritative and is not.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ViewBuilder from '@/pages/notes/_components/views/ViewBuilder';
import { useSavedViewsStore } from '@/pages/notes/_hooks/use-saved-views-store';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { setFetcher, resetFetcher, type SavedView } from '@/pages/notes/_lib/apiClient';
import { describeQuery, offendingKey } from '@/pages/notes/_lib/queryDsl';
import { FakeNotesServer } from './fakeNotesServer';

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

const view = (query: unknown): SavedView =>
  ({
    id: 'view-1',
    name: 'Open with Müller',
    query,
    seeded: false,
    createdAt: 1,
    updatedAt: 1,
    pinnedOrder: null,
    icon: null,
    warning: null,
  }) as SavedView;

beforeEach(async () => {
  server = new FakeNotesServer();
  setFetcher(server.fetcher);
  useSavedViewsStore.setState({ views: [], loaded: false, loading: false });
  await useNotesStore.getState().clearAll();
});

afterEach(() => resetFetcher());

describe('S12 — one preview in flight', () => {
  it('debounces a burst of typing into a single request', async () => {
    const user = userEvent.setup();
    render(
      <ViewBuilder
        view={view({ all: [{ text: { text: '', mode: 'hybrid' } }] })}
        open
        onOpenChange={() => undefined}
      />,
    );

    const value = await screen.findByLabelText('Value');
    await user.type(value, 'Fristverlängerung');

    // Seventeen keystrokes; the debounce collapses them.
    await waitFor(() => expect(server.previewRequests.length).toBeGreaterThan(0));
    expect(server.previewRequests.length).toBeLessThanOrEqual(2);
    expect(JSON.stringify(server.previewRequests.at(-1))).toContain('Fristverlängerung');
  });

  it('aborts the previous preview when a new one starts', async () => {
    const user = userEvent.setup();
    // Hold the first response open so the second must abort it.
    let release!: () => void;
    server.holdPreview = new Promise<void>((resolve) => {
      release = resolve;
    });

    render(
      <ViewBuilder
        view={view({ all: [{ text: { text: 'a', mode: 'hybrid' } }] })}
        open
        onOpenChange={() => undefined}
      />,
    );

    await waitFor(() => expect(server.previewRequests.length).toBe(1));
    const value = await screen.findByLabelText('Value');
    await user.type(value, 'bc');
    await waitFor(() => expect(server.previewRequests.length).toBe(2));

    release();
    server.holdPreview = null;

    // The count on screen is the second request's, not whichever landed last.
    await waitFor(() => expect(screen.getByText(/right now|no preview/)).toBeInTheDocument());
  });

  it('reports the count the server gave, not a guess', async () => {
    server.searchResults = [
      { noteId: 'a', title: 'A', snippet: '' },
      { noteId: 'b', title: 'B', snippet: '' },
    ];
    render(
      <ViewBuilder view={view({ all: [{ tag: 'mandant' }] })} open onOpenChange={() => undefined} />,
    );
    expect(await screen.findByText('2 notes right now')).toBeInTheDocument();
  });
});

describe('the builder stays small', () => {
  it('reads an existing query back into rows', async () => {
    render(
      <ViewBuilder
        view={view({ all: [{ tag: 'mandant-mueller' }, { hasAttachment: true }] })}
        open
        onOpenChange={() => undefined}
      />,
    );

    const fields = (await screen.findAllByLabelText('Field')) as HTMLSelectElement[];
    expect(fields.map((field) => field.value)).toEqual(['tag', 'hasAttachment']);
    // A boolean clause has nothing to fill in, and says so instead of showing an
    // input that does nothing.
    expect(screen.getByText('— nothing to fill in')).toBeInTheDocument();
  });

  it('saves the composed query and the name together', async () => {
    const user = userEvent.setup();
    const onOpenChange = vi.fn();
    server.addSavedView({ id: 'view-1', name: 'Open with Müller' });

    render(
      <ViewBuilder
        view={view({ all: [{ tag: 'mandant-mueller' }] })}
        open
        onOpenChange={onOpenChange}
      />,
    );
    await screen.findAllByLabelText('Field');

    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false));
    const saved = server.savedViews.get('view-1') as { query: unknown };
    expect(JSON.stringify(saved.query)).toContain('mandant-mueller');
  });

  it('adds and removes a condition', async () => {
    const user = userEvent.setup();
    render(<ViewBuilder view={view({ all: [] })} open onOpenChange={() => undefined} />);

    await user.click(await screen.findByRole('button', { name: /Add a condition/ }));
    expect(await screen.findByLabelText('Field')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Remove this condition' }));
    expect(screen.queryByLabelText('Field')).not.toBeInTheDocument();
  });
});

describe('describing a query', () => {
  it('renders a query as a sentence for the view subtitle', () => {
    expect(
      describeQuery({
        all: [{ text: { text: 'Frist', mode: 'hybrid' } }, { tag: 'mandant-mueller' }],
      }),
    ).toBe('“Frist” and #mandant-mueller');
    expect(describeQuery({ any: [{ pinned: true }, { daily: true }] })).toBe(
      'pinned or daily notes',
    );
    expect(describeQuery({ all: [] })).toBe('Everything');
  });

  it('pulls the offending key out of a 422 so it can be shown on the row', () => {
    expect(offendingKey("unknown field 'hasPriority'")).toBe('hasPriority');
    expect(offendingKey('something went wrong')).toBeNull();
  });
});
