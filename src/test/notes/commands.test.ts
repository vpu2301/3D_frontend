/**
 * The registry's behaviour, asserted without React.
 *
 * `commands.ts` takes its whole world as a context argument precisely so this
 * file can exist: every command can be run against a fake context and observed,
 * which is what makes F17 ("creating a note asks nothing") a test rather than a
 * claim.
 */

import { describe, it, expect, vi, type Mock } from 'vitest';
import {
  NOTE_COMMANDS,
  formatShortcut,
  fuzzyScore,
  getCommand,
  matchesShortcut,
  quoteDocument,
  type CommandContext,
} from '@/pages/notes/_lib/commands';
import type { Note } from '@/pages/notes/_lib/types';

const note: Note = {
  id: 'note-1',
  content: { type: 'doc', content: [{ type: 'paragraph' }] },
  notebookId: null,
  tags: [],
  pinned: false,
  trashed: false,
  reminders: [],
  links: [],
  createdAt: 1,
  updatedAt: 1,
} as Note;

/**
 * A context whose every hook is a spy. Anything a command touches shows up as a
 * call, which is how "asks no questions" is checked: the question-asking
 * members simply must not be called.
 */
function fakeContext(overrides: Partial<CommandContext> = {}) {
  const created = { ...note, id: 'created-1' };
  const ctx = {
    navigate: vi.fn(),
    note,
    notebooks: [],
    editor: null,
    actions: {
      createNote: vi.fn(async () => created),
      ensureDailyNote: vi.fn(async () => created),
      togglePin: vi.fn(async () => undefined),
      moveToNotebook: vi.fn(async () => undefined),
      trashNote: vi.fn(async () => undefined),
      addTag: vi.fn(async () => undefined),
      exportNote: vi.fn(async () => undefined),
    },
    ui: {
      setSelectedNoteId: vi.fn(),
      setAiSidebarOpen: vi.fn(),
      setQuickCaptureOpen: vi.fn(),
      setSmartViewId: vi.fn(),
      setFilter: vi.fn(),
    },
    palette: { open: vi.fn(), close: vi.fn(), setMode: vi.fn() },
    openShortcuts: vi.fn(),
    openHistory: vi.fn(),
    openSettings: vi.fn(),
    openReminder: vi.fn(),
    openEmptyTrash: vi.fn(),
    focusList: vi.fn(),
    toast: { success: vi.fn(), error: vi.fn() },
    ...overrides,
  } as unknown as CommandContext;
  // Every hook is a spy, so a command's effects are readable as calls.
  return ctx as unknown as CommandContext & {
    navigate: Mock;
    actions: Record<keyof CommandContext['actions'], Mock>;
    ui: Record<keyof CommandContext['ui'], Mock>;
    palette: Record<keyof CommandContext['palette'], Mock>;
    toast: Record<keyof CommandContext['toast'], Mock>;
    openReminder: Mock;
  };
}

function key(init: Partial<KeyboardEvent> & { key: string }): KeyboardEvent {
  return {
    metaKey: false,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    ...init,
  } as KeyboardEvent;
}

describe('F17 — creating a note asks nothing', () => {
  it('note.new creates, selects and navigates, with no dialog and no prompt', async () => {
    const ctx = fakeContext();
    await getCommand('note.new')!.run(ctx);

    expect(ctx.actions.createNote).toHaveBeenCalledWith({});
    expect(ctx.ui.setSelectedNoteId).toHaveBeenCalledWith('created-1');
    expect(ctx.navigate).toHaveBeenCalledWith('/notes/created-1');

    // The whole point: nothing was asked. No notebook picker, no title prompt,
    // no type chooser, no palette sub-mode.
    expect(ctx.palette.setMode).not.toHaveBeenCalled();
    expect(ctx.actions.moveToNotebook).not.toHaveBeenCalled();
    expect(ctx.actions.addTag).not.toHaveBeenCalled();
    expect(ctx.openReminder).not.toHaveBeenCalled();
  });

  it('creates with no notebook and no tags, because filing is optional forever', async () => {
    const ctx = fakeContext();
    await getCommand('note.new')!.run(ctx);
    const [init] = ctx.actions.createNote.mock.calls[0];
    expect(init.notebookId).toBeUndefined();
    expect(init.tags).toBeUndefined();
  });

  it('note.daily goes through the idempotent server endpoint, not a local scan', async () => {
    const ctx = fakeContext();
    await getCommand('note.daily')!.run(ctx);
    expect(ctx.actions.ensureDailyNote).toHaveBeenCalledTimes(1);
    expect(ctx.navigate).toHaveBeenCalledWith('/notes/created-1');
  });
});

describe('note.quote — Cmd+Enter', () => {
  it('is disabled with nothing selected', () => {
    const ctx = fakeContext({ editor: { getSelectedText: () => '' } as never });
    expect(getCommand('note.quote')!.enabled!(ctx)).toBe(false);
  });

  it('creates a note holding the selection as a blockquote', async () => {
    const ctx = fakeContext({
      editor: { getSelectedText: () => '  the sentence that mattered  ' } as never,
    });
    await getCommand('note.quote')!.run(ctx);

    const [init] = ctx.actions.createNote.mock.calls[0];
    expect(init.content).toEqual(quoteDocument('the sentence that mattered'));
    expect(init.content.content[0].type).toBe('blockquote');
    // A trailing paragraph, so the caret has somewhere to go.
    expect(init.content.content[1].type).toBe('paragraph');
  });
});

describe('note.save — Cmd+S', () => {
  it('waits for the flush before confirming', async () => {
    const order: string[] = [];
    const ctx = fakeContext({
      editor: {
        flush: async () => {
          order.push('flush');
        },
      } as never,
    });
    ctx.toast.success = vi.fn(() => order.push('toast'));

    await getCommand('note.save')!.run(ctx);
    expect(order).toEqual(['flush', 'toast']);
  });

  it('says so when the flush fails rather than claiming a save', async () => {
    const ctx = fakeContext({
      editor: {
        flush: async () => {
          throw new Error('nope');
        },
      } as never,
    });

    await getCommand('note.save')!.run(ctx);
    expect(ctx.toast.error).toHaveBeenCalled();
    expect(ctx.toast.success).not.toHaveBeenCalled();
  });
});

describe('note-scoped commands', () => {
  it('are disabled with no note open', () => {
    const ctx = fakeContext({ note: null });
    for (const command of NOTE_COMMANDS.filter((c) => c.group === 'note')) {
      expect(command.enabled?.(ctx) ?? true, command.id).toBe(false);
    }
  });
});

describe('shortcut matching', () => {
  it('treats mod as ⌘ or Ctrl', () => {
    expect(matchesShortcut(key({ key: 'n', metaKey: true }), 'mod+n')).toBe(true);
    expect(matchesShortcut(key({ key: 'n', ctrlKey: true }), 'mod+n')).toBe(true);
    expect(matchesShortcut(key({ key: 'n' }), 'mod+n')).toBe(false);
  });

  it('does not fire a plain binding for its shifted form', () => {
    expect(matchesShortcut(key({ key: 'n', metaKey: true, shiftKey: true }), 'mod+n')).toBe(false);
    expect(matchesShortcut(key({ key: 'n', metaKey: true, shiftKey: true }), 'mod+shift+n')).toBe(
      true,
    );
  });

  it('matches ? on the produced character, because its modifier varies by layout', () => {
    expect(matchesShortcut(key({ key: '?', shiftKey: true }), '?')).toBe(true);
    expect(matchesShortcut(key({ key: '?' }), '?')).toBe(true);
    expect(matchesShortcut(key({ key: '/', shiftKey: true }), '?')).toBe(false);
  });

  it('matches the named keys', () => {
    expect(matchesShortcut(key({ key: 'Escape' }), 'escape')).toBe(true);
    expect(matchesShortcut(key({ key: 'Enter', metaKey: true }), 'mod+enter')).toBe(true);
  });

  it('renders a binding the same way the shortcut sheet will', () => {
    // Platform-dependent, so assert the shape rather than the exact glyphs.
    expect(formatShortcut('mod+shift+n')).toMatch(/N$/);
    expect(formatShortcut('escape')).toBe('Esc');
  });
});

describe('fuzzy matching', () => {
  it('matches a subsequence and rejects a non-match', () => {
    expect(fuzzyScore('Client meeting notes', 'cmn')).not.toBeNull();
    expect(fuzzyScore('Client meeting notes', 'zzz')).toBeNull();
  });

  it('ranks a consecutive, word-start match above a scattered one', () => {
    const tight = fuzzyScore('meeting', 'mee')!;
    const scattered = fuzzyScore('my example entry', 'mee')!;
    expect(tight).toBeGreaterThan(scattered);
  });

  it('treats an empty query as a match, so the palette opens on recents', () => {
    expect(fuzzyScore('anything', '')).toBe(0);
  });
});

describe('the registry as a whole', () => {
  it('covers every action FE-1 §4 names', () => {
    const required = [
      'note.new',
      'note.daily',
      'nav.find-note',
      'nav.search',
      'note.pin',
      'note.tag',
      'note.move',
      'note.trash',
      'note.export',
      'note.history',
      'note.save',
      'nav.notebooks',
      'nav.tags',
      'nav.trash',
      'nav.settings',
      'view.shortcuts',
    ];
    for (const id of required) expect(getCommand(id), id).toBeDefined();
  });

  it('binds the shortcuts the sprint specifies', () => {
    expect(getCommand('note.new')!.shortcut).toBe('mod+n');
    expect(getCommand('note.daily')!.shortcut).toBe('mod+d');
    expect(getCommand('note.save')!.shortcut).toBe('mod+s');
    expect(getCommand('nav.back-to-list')!.shortcut).toBe('escape');
    expect(getCommand('note.quote')!.shortcut).toBe('mod+enter');
    expect(getCommand('view.palette')!.shortcut).toBe('mod+k');
    expect(getCommand('view.shortcuts')!.shortcut).toBe('?');
  });

  it('keeps Escape and Cmd+Enter scoped to the editor', () => {
    expect(getCommand('nav.back-to-list')!.editorOnly).toBe(true);
    expect(getCommand('note.quote')!.editorOnly).toBe(true);
  });
});
