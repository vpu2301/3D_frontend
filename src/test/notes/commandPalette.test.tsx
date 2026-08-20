/**
 * The palette as the user meets it.
 *
 * The registry is unit-tested next door; this asserts the two claims that are
 * about the *surface* rather than the actions — that Cmd+K opens onto recent
 * notes (so the quick switcher needs no second shortcut), and that a command
 * chosen from the list actually runs.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import NotesCommandPalette from '@/pages/notes/_components/command/NotesCommandPalette';
import { useGlobalShortcuts } from '@/pages/notes/_hooks/use-notes-commands';
import NotesShortcutSheet from '@/pages/notes/_components/command/NotesShortcutSheet';
import { useNotesStore, whenCorpusLoaded } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import { setFetcher, resetFetcher } from '@/pages/notes/_lib/apiClient';
import { NOTE_COMMANDS } from '@/pages/notes/_lib/commands';
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
const store = () => useNotesStore.getState();
const ui = () => useNotesUiStore.getState();

beforeEach(async () => {
  server = new FakeNotesServer();
  setFetcher(server.fetcher);
  navigate.mockClear();
  await store().clearAll();
  useNotesUiStore.setState({ paletteOpen: false, paletteMode: 'root', selectedNoteId: null });
});

afterEach(() => {
  resetFetcher();
});

/**
 * The palette plus the global key handler, which is how `NotesLayout` mounts
 * them. Opening on Cmd+K is the registry's `view.palette` command bound by that
 * handler, so a test that rendered only the palette would be testing half of
 * the pairing.
 */
function Shell() {
  useGlobalShortcuts();
  return <NotesCommandPalette />;
}

function renderPalette() {
  return render(
    <MemoryRouter>
      <Shell />
    </MemoryRouter>,
  );
}

describe('the command palette', () => {
  it('opens on Cmd+K showing recent notes, so three letters and Enter is the switcher', async () => {
    const user = userEvent.setup();
    server.addNote({ title: 'Quarterly close' });
    server.addNote({ title: 'Müller mandate' });
    await store().load();
    await whenCorpusLoaded();

    renderPalette();
    await user.keyboard('{Meta>}k{/Meta}');

    await waitFor(() => expect(ui().paletteOpen).toBe(true));
    expect(await screen.findByText('Recent notes')).toBeInTheDocument();
    expect(screen.getByText('Quarterly close')).toBeInTheDocument();
  });

  it('filters notes as you type and opens the one you pick', async () => {
    const user = userEvent.setup();
    const target = server.addNote({ title: 'Müller mandate' });
    server.addNote({ title: 'Quarterly close' });
    await store().load();
    await whenCorpusLoaded();

    renderPalette();
    await user.keyboard('{Meta>}k{/Meta}');
    const input = await screen.findByPlaceholderText(/Search notes/i);
    await user.type(input, 'mül');

    await waitFor(() => expect(screen.queryByText('Quarterly close')).not.toBeInTheDocument());
    await user.click(screen.getByText('Müller mandate'));

    expect(navigate).toHaveBeenCalledWith(`/notes/${target.id}`);
    expect(ui().paletteOpen).toBe(false);
  });

  it('lists commands under the notes and runs the one chosen', async () => {
    const user = userEvent.setup();
    server.addNote({ title: 'Anything' });
    await store().load();

    renderPalette();
    await user.keyboard('{Meta>}k{/Meta}');
    const input = await screen.findByPlaceholderText(/Search notes/i);
    await user.type(input, 'today');

    await user.click(await screen.findByText("Today's note"));

    await waitFor(() => expect(navigate).toHaveBeenCalled());
    expect(server.calls).toContain('POST /v1/notes/daily');
  });

  it('steps into and back out of a sub-mode without a dead end', async () => {
    const user = userEvent.setup();
    server.addNotebook('Mandates');
    server.addNote({ title: 'Anything' });
    await store().load();

    renderPalette();
    await user.keyboard('{Meta>}k{/Meta}');
    const input = await screen.findByPlaceholderText(/Search notes/i);
    await user.type(input, 'notebooks');
    await user.click(await screen.findByText('Notebooks…'));

    expect(await screen.findByPlaceholderText(/Go to a notebook/i)).toBeInTheDocument();
    // Backspace on an empty query is the way back.
    await user.keyboard('{Backspace}');
    expect(await screen.findByPlaceholderText(/Search notes/i)).toBeInTheDocument();
  });

  it('closes on a second Cmd+K', async () => {
    const user = userEvent.setup();
    await store().load();
    renderPalette();

    await user.keyboard('{Meta>}k{/Meta}');
    await waitFor(() => expect(ui().paletteOpen).toBe(true));
    await user.keyboard('{Meta>}k{/Meta}');
    await waitFor(() => expect(ui().paletteOpen).toBe(false));
  });
});

describe('the shortcut sheet', () => {
  it('lists every bound shortcut in the registry, and nothing else', async () => {
    render(
      <MemoryRouter>
        <NotesShortcutSheet />
      </MemoryRouter>,
    );
    useNotesUiStore.setState({ shortcutsOpen: true });

    const sheet = await screen.findByRole('dialog');
    for (const command of NOTE_COMMANDS.filter((c) => c.shortcut)) {
      // `getAllByText`: the sheet's own title happens to be a command label too.
      expect(within(sheet).getAllByText(command.label).length, command.id).toBeGreaterThan(0);
    }
    // A command with no binding has no business in a shortcut sheet.
    for (const command of NOTE_COMMANDS.filter((c) => !c.shortcut)) {
      expect(within(sheet).queryAllByText(command.label), command.id).toEqual([]);
    }
  });
});
