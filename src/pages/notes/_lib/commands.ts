/**
 * The action registry — one array, and the only place an action in /notes is
 * defined.
 *
 * The command palette renders it, the global key handler binds it, and the
 * shortcut sheet is generated from it, so the three can never disagree about
 * what exists or what it is bound to. A button that performs an action must
 * call the command from here rather than duplicating its body: the test
 * `commandCoverage.test.ts` fails the build on a button that does neither
 * (`data-command`) nor declares itself exempt (`data-command-exempt`).
 *
 * The registry deliberately holds no state and imports no React. It is a list
 * of descriptions plus a `run` that takes everything it needs as a context, so
 * it can be asserted over in a plain unit test.
 */

import {
  ArrowLeft,
  Bell,
  Bookmark,
  Briefcase,
  CheckCheck,
  FileDown,
  FileText,
  Folder,
  Hash,
  History,
  Keyboard,
  ListChecks,
  Network,
  Pin,
  PinOff,
  Plus,
  Quote,
  Save,
  Search,
  Settings2,
  Sparkles,
  StickyNote,
  Sun,
  Trash2,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import type { JSONContent } from '@tiptap/react';
import type { Note, Notebook } from '@/pages/notes/_lib/types';
import type { ActiveEditor } from '@/pages/notes/_lib/editorBridge';

/** What the palette is currently listing. */
export type PaletteMode =
  | 'root'
  | 'notes'
  | 'notebooks'
  | 'tags'
  | 'matters'
  | 'views'
  | 'move'
  | 'tag';

export type CommandGroup = 'create' | 'note' | 'navigate' | 'workspace' | 'view';

export const GROUP_LABELS: Record<CommandGroup, string> = {
  create: 'Create',
  note: 'This note',
  navigate: 'Go to',
  workspace: 'Workspace',
  view: 'View',
};

/**
 * Everything a command is allowed to touch. Passed in rather than imported so
 * the registry stays a pure module and each command's dependencies are visible
 * in its signature.
 */
export interface CommandContext {
  navigate: (to: string) => void;
  /** The note in the editor, or null on a route without one. */
  note: Note | null;
  notebooks: Notebook[];
  editor: ActiveEditor | null;
  /** Store actions. Only the ones commands need — not the whole store. */
  actions: {
    createNote: (init?: Partial<Note>) => Promise<Note>;
    ensureDailyNote: () => Promise<Note>;
    togglePin: (id: string) => Promise<void>;
    moveToNotebook: (id: string, notebookId: string | null) => Promise<void>;
    trashNote: (id: string) => Promise<void>;
    addTag: (id: string, tag: string) => Promise<void>;
    exportNote: (note: Note) => Promise<void>;
    /** BE-1 extraction — proposals only; nothing becomes an obligation here. */
    extractOutcomes: (noteId: string) => Promise<void>;
    /** Confirm every proposal on the note. The card's button confirms the ticked ones. */
    confirmAllProposals: (noteId: string) => Promise<number>;
    /** How many proposals this note is currently showing, for `enabled`. */
    proposalCount: (noteId: string) => number;
  };
  ui: {
    setSelectedNoteId: (id: string | null) => void;
    /** Read so `view.ai` can toggle rather than only open. */
    aiSidebarOpen: boolean;
    setAiSidebarOpen: (v: boolean) => void;
    setQuickCaptureOpen: (v: boolean) => void;
    setSmartViewId: (id: string | null) => void;
    setFilter: (f: Record<string, never>) => void;
  };
  palette: {
    open: (mode?: PaletteMode) => void;
    close: () => void;
    setMode: (mode: PaletteMode) => void;
  };
  /** Opens the `?` sheet. Its own command lives in the registry like any other. */
  openShortcuts: () => void;
  /** Opens the version-history sheet for the current note. */
  openHistory: () => void;
  /** Opens the AI usage / settings panel. */
  openSettings: () => void;
  /** Opens the reminder composer, which the editor owns because it inserts a node. */
  openReminder: () => void;
  /** Opens the empty-trash confirmation, which lives on the trash page. */
  openEmptyTrash: () => void;
  /** Puts focus back on the note list — the Escape path out of the editor. */
  focusList: () => void;
  toast: {
    success: (message: string, options?: { description?: string }) => void;
    error: (message: string, options?: { description?: string }) => void;
  };
}

export interface NoteCommand {
  /** Stable id. Also what a button's `data-command` attribute must match. */
  id: string;
  label: string;
  group: CommandGroup;
  icon: LucideIcon;
  /** Extra words the palette's fuzzy match should consider. */
  keywords?: string[];
  /** Normalised shortcut, e.g. `mod+n`. `mod` is ⌘ on macOS and Ctrl elsewhere. */
  shortcut?: string;
  /**
   * When false the command is hidden from the palette and its shortcut is
   * inert. Note-scoped commands are disabled with no note open.
   */
  enabled?: (ctx: CommandContext) => boolean;
  /**
   * Only fires from the keyboard when the editor has focus. Escape and
   * Cmd+Enter mean something else everywhere else in the app, and stealing them
   * globally breaks dialogs.
   */
  editorOnly?: boolean;
  run: (ctx: CommandContext) => void | Promise<void>;
}

const withNote = (ctx: CommandContext) => Boolean(ctx.note);

/** Create-and-focus, which is the whole point: no dialog, no notebook prompt. */
async function createAndOpen(ctx: CommandContext, init?: Partial<Note>): Promise<void> {
  try {
    const note = await ctx.actions.createNote(init ?? {});
    ctx.ui.setSelectedNoteId(note.id);
    ctx.navigate(`/notes/${note.id}`);
  } catch {
    /* the store already toasted */
  }
}

/** A one-blockquote document holding `text` — the Cmd+Enter "quote this" shape. */
export function quoteDocument(text: string): JSONContent {
  return {
    type: 'doc',
    content: [
      {
        type: 'blockquote',
        content: [{ type: 'paragraph', content: [{ type: 'text', text }] }],
      },
      { type: 'paragraph' },
    ],
  };
}

export const NOTE_COMMANDS: NoteCommand[] = [
  // ── create ──────────────────────────────────────────────────────────────
  {
    id: 'note.new',
    label: 'New note',
    group: 'create',
    icon: Plus,
    shortcut: 'mod+n',
    keywords: ['create', 'add', 'blank'],
    run: (ctx) => createAndOpen(ctx),
  },
  {
    id: 'note.daily',
    label: "Today's note",
    group: 'create',
    icon: Sun,
    shortcut: 'mod+d',
    keywords: ['daily', 'journal', 'today'],
    run: async (ctx) => {
      try {
        const note = await ctx.actions.ensureDailyNote();
        ctx.ui.setSelectedNoteId(note.id);
        ctx.navigate(`/notes/${note.id}`);
      } catch {
        /* toasted in the store */
      }
    },
  },
  {
    id: 'capture.quick',
    label: 'Quick capture',
    group: 'create',
    icon: Zap,
    shortcut: 'mod+shift+n',
    keywords: ['jot', 'inbox', 'scratch'],
    run: (ctx) => {
      ctx.palette.close();
      ctx.ui.setQuickCaptureOpen(true);
    },
  },
  {
    id: 'note.quote',
    label: 'New note from selection',
    group: 'create',
    icon: Quote,
    shortcut: 'mod+enter',
    editorOnly: true,
    keywords: ['quote', 'excerpt', 'split'],
    enabled: (ctx) => Boolean(ctx.editor?.getSelectedText()),
    run: async (ctx) => {
      const text = ctx.editor?.getSelectedText().trim();
      if (!text) return;
      await createAndOpen(ctx, { content: quoteDocument(text) });
    },
  },

  // ── this note ───────────────────────────────────────────────────────────
  {
    id: 'note.save',
    label: 'Save now',
    group: 'note',
    icon: Save,
    shortcut: 'mod+s',
    keywords: ['flush', 'checkpoint', 'write'],
    enabled: withNote,
    run: async (ctx) => {
      // People press Cmd+S whether or not autosave exists. Swallowing it and
      // showing nothing is how a tool teaches distrust, so this really does
      // wait for the server before it claims anything.
      if (!ctx.editor) return;
      try {
        await ctx.editor.flush();
        ctx.toast.success('Saved', { description: 'A restore point was written.' });
      } catch {
        ctx.toast.error('Could not save', { description: 'Your text is still here — try again.' });
      }
    },
  },
  {
    id: 'note.pin',
    label: 'Pin / unpin note',
    group: 'note',
    icon: Pin,
    keywords: ['favourite', 'favorite', 'top'],
    enabled: withNote,
    run: (ctx) => {
      if (ctx.note) void ctx.actions.togglePin(ctx.note.id);
    },
  },
  {
    id: 'note.tag',
    label: 'Add a tag…',
    group: 'note',
    icon: Hash,
    keywords: ['label', 'hashtag'],
    enabled: withNote,
    run: (ctx) => ctx.palette.setMode('tag'),
  },
  {
    id: 'note.move',
    label: 'Move to notebook…',
    group: 'note',
    icon: Folder,
    keywords: ['file', 'notebook', 'organise', 'organize'],
    enabled: withNote,
    run: (ctx) => ctx.palette.setMode('move'),
  },
  {
    id: 'note.history',
    label: 'Version history',
    group: 'note',
    icon: History,
    keywords: ['versions', 'restore', 'undo', 'revert'],
    enabled: withNote,
    run: (ctx) => {
      ctx.palette.close();
      ctx.openHistory();
    },
  },
  {
    id: 'note.export',
    label: 'Export note as Markdown',
    group: 'note',
    icon: FileDown,
    keywords: ['download', 'md', 'leave', 'backup'],
    enabled: withNote,
    run: async (ctx) => {
      if (!ctx.note) return;
      ctx.palette.close();
      await ctx.actions.exportNote(ctx.note);
    },
  },
  {
    id: 'note.trash',
    label: 'Move note to trash',
    group: 'note',
    icon: Trash2,
    keywords: ['delete', 'archive', 'remove'],
    enabled: withNote,
    run: async (ctx) => {
      if (!ctx.note) return;
      ctx.palette.close();
      await ctx.actions.trashNote(ctx.note.id);
      ctx.navigate('/notes');
    },
  },
  {
    id: 'note.extract',
    label: 'Find tasks and decisions in this note',
    group: 'note',
    icon: Sparkles,
    keywords: ['extract', 'obligations', 'todo', 'scan'],
    enabled: withNote,
    run: async (ctx) => {
      if (!ctx.note) return;
      ctx.palette.close();
      await ctx.actions.extractOutcomes(ctx.note.id);
    },
  },
  {
    id: 'note.confirm-proposals',
    label: 'Confirm all suggestions in this note',
    group: 'note',
    icon: CheckCheck,
    keywords: ['accept', 'obligations', 'batch'],
    enabled: (ctx) => Boolean(ctx.note) && ctx.actions.proposalCount(ctx.note!.id) > 0,
    run: async (ctx) => {
      if (!ctx.note) return;
      ctx.palette.close();
      const count = await ctx.actions.confirmAllProposals(ctx.note.id);
      if (count > 0) {
        ctx.toast.success(`Confirmed ${count}`, { description: 'They are in Open items now.' });
      }
    },
  },
  {
    id: 'note.reminder',
    label: 'Add a reminder',
    group: 'note',
    icon: Bell,
    keywords: ['remind', 'calendar', 'due'],
    enabled: withNote,
    run: (ctx) => {
      ctx.palette.close();
      ctx.openReminder();
    },
  },

  // ── go to ───────────────────────────────────────────────────────────────
  {
    id: 'nav.find-note',
    label: 'Find a note…',
    group: 'navigate',
    icon: Search,
    keywords: ['switch', 'open', 'jump', 'goto'],
    run: (ctx) => ctx.palette.setMode('notes'),
  },
  {
    id: 'nav.search',
    label: 'Search every note…',
    group: 'navigate',
    icon: FileText,
    keywords: ['full text', 'volltext', 'grep', 'find in', 'fragment'],
    run: (ctx) => {
      // The one search entry point. The palette hands the query over; it does
      // not run a search of its own (FE-3 §1).
      ctx.palette.close();
      ctx.navigate('/notes/search');
    },
  },
  {
    id: 'nav.open-items',
    label: 'Open items',
    group: 'navigate',
    icon: ListChecks,
    keywords: ['owe', 'obligations', 'tasks', 'due', 'promised', 'unconfirmed'],
    run: (ctx) => {
      ctx.palette.close();
      ctx.navigate('/notes/open');
    },
  },
  {
    id: 'nav.all',
    label: 'All notes',
    group: 'navigate',
    icon: StickyNote,
    run: (ctx) => {
      ctx.palette.close();
      ctx.ui.setSmartViewId(null);
      ctx.ui.setFilter({});
      ctx.navigate('/notes');
    },
  },
  {
    id: 'nav.matters',
    label: 'Matters…',
    group: 'navigate',
    icon: Briefcase,
    keywords: ['client', 'mandant', 'case', 'matter', 'project'],
    run: (ctx) => ctx.palette.setMode('matters'),
  },
  {
    id: 'nav.views',
    label: 'Saved views…',
    group: 'navigate',
    icon: Bookmark,
    keywords: ['view', 'saved', 'standing query', 'filter'],
    run: (ctx) => ctx.palette.setMode('views'),
  },
  {
    id: 'nav.notebooks',
    label: 'Notebooks…',
    group: 'navigate',
    icon: Folder,
    run: (ctx) => ctx.palette.setMode('notebooks'),
  },
  {
    id: 'nav.tags',
    label: 'Tags…',
    group: 'navigate',
    icon: Hash,
    run: (ctx) => ctx.palette.setMode('tags'),
  },
  {
    id: 'nav.graph',
    label: 'Graph',
    group: 'navigate',
    icon: Network,
    keywords: ['links', 'network', 'map'],
    run: (ctx) => {
      ctx.palette.close();
      ctx.navigate('/notes/graph');
    },
  },
  {
    id: 'nav.trash',
    label: 'Trash',
    group: 'navigate',
    icon: Trash2,
    keywords: ['deleted', 'bin', 'restore'],
    run: (ctx) => {
      ctx.palette.close();
      ctx.navigate('/notes/trash');
    },
  },
  {
    id: 'nav.settings',
    label: 'AI usage & settings',
    group: 'navigate',
    icon: Settings2,
    keywords: ['budget', 'provider', 'preferences'],
    run: (ctx) => {
      ctx.palette.close();
      ctx.openSettings();
    },
  },
  {
    id: 'nav.back-to-list',
    label: 'Back to the list',
    group: 'navigate',
    icon: ArrowLeft,
    shortcut: 'escape',
    editorOnly: true,
    keywords: ['escape', 'leave', 'close editor'],
    run: (ctx) => {
      ctx.editor?.blur();
      ctx.focusList();
    },
  },

  // ── workspace ───────────────────────────────────────────────────────────
  {
    id: 'trash.empty',
    label: 'Empty the trash',
    group: 'workspace',
    icon: Trash2,
    keywords: ['purge', 'delete forever', 'permanently'],
    run: (ctx) => {
      // Navigates first: a destructive confirmation should appear over the
      // thing it is about to destroy, not over an unrelated note.
      ctx.palette.close();
      ctx.navigate('/notes/trash');
      ctx.openEmptyTrash();
    },
  },

  // ── view ────────────────────────────────────────────────────────────────
  {
    id: 'view.ai',
    label: 'Ask across your notes',
    group: 'view',
    icon: Sparkles,
    // FE-5 §4 names `Cmd+J`. It replaces `mod+shift+i`, which nobody could
    // guess and which cost three keys to reach the module's main AI surface.
    shortcut: 'mod+j',
    keywords: ['ask', 'ai', 'assistant', 'chat', 'agent'],
    run: (ctx) => {
      ctx.palette.close();
      // A toggle, as the old label promised: pressing it again from inside the
      // panel should put it away rather than re-open what is already open.
      ctx.ui.setAiSidebarOpen(!ctx.ui.aiSidebarOpen);
    },
  },
  {
    id: 'view.shortcuts',
    label: 'Keyboard shortcuts',
    group: 'view',
    icon: Keyboard,
    shortcut: '?',
    keywords: ['help', 'keys', 'bindings'],
    run: (ctx) => {
      ctx.palette.close();
      ctx.openShortcuts();
    },
  },
  {
    id: 'view.palette',
    label: 'Command palette',
    group: 'view',
    icon: Zap,
    shortcut: 'mod+k',
    keywords: ['commands', 'actions'],
    run: (ctx) => ctx.palette.open('root'),
  },
];

/** Icon shown for the pin command when the note is already pinned. */
export const UNPIN_ICON = PinOff;

export const COMMANDS_BY_ID: Record<string, NoteCommand> = Object.fromEntries(
  NOTE_COMMANDS.map((c) => [c.id, c]),
);

export function getCommand(id: string): NoteCommand | undefined {
  return COMMANDS_BY_ID[id];
}

// ── shortcut matching & display ───────────────────────────────────────────

const isMac = () =>
  typeof navigator !== 'undefined' && /mac|iphone|ipad/i.test(navigator.platform || navigator.userAgent);

/** Parse `mod+shift+n` into its parts once, at match time. */
export function matchesShortcut(event: KeyboardEvent, shortcut: string): boolean {
  const parts = shortcut.toLowerCase().split('+');
  const key = parts[parts.length - 1];
  const wantMod = parts.includes('mod');
  const wantShift = parts.includes('shift');
  const wantAlt = parts.includes('alt');

  const mod = event.metaKey || event.ctrlKey;
  if (wantMod !== mod) return false;
  if (wantAlt !== event.altKey) return false;

  // `?` is Shift+/ on most layouts and Shift-less on others, so it is matched on
  // the produced character rather than on the modifier.
  if (key === '?') return event.key === '?';
  if (wantShift !== event.shiftKey) return false;

  if (key === 'enter') return event.key === 'Enter';
  if (key === 'escape') return event.key === 'Escape';
  return event.key.toLowerCase() === key;
}

/** `mod+shift+n` → `⌘⇧N` on macOS, `Ctrl+Shift+N` elsewhere. */
export function formatShortcut(shortcut: string): string {
  const mac = isMac();
  return shortcut
    .split('+')
    .map((part) => {
      switch (part) {
        case 'mod':
          return mac ? '⌘' : 'Ctrl';
        case 'shift':
          return mac ? '⇧' : 'Shift';
        case 'alt':
          return mac ? '⌥' : 'Alt';
        case 'enter':
          return mac ? '↵' : 'Enter';
        case 'escape':
          return 'Esc';
        default:
          return part.toUpperCase();
      }
    })
    .join(mac ? '' : '+');
}

// ── fuzzy matching, used by the palette for both notes and commands ───────

/**
 * Subsequence match with a small score: consecutive hits and word-start hits
 * rank above scattered ones. Deliberately not a library — this runs over a few
 * thousand titles on every keystroke and the whole implementation is 20 lines.
 * Returns null when `query` is not a subsequence of `text`.
 */
export function fuzzyScore(text: string, query: string): number | null {
  if (!query) return 0;
  const haystack = text.toLowerCase();
  const needle = query.toLowerCase();

  let score = 0;
  let from = 0;
  let previous = -2;
  for (const char of needle) {
    const at = haystack.indexOf(char, from);
    if (at === -1) return null;
    if (at === previous + 1) score += 3;
    if (at === 0 || /[\s\-_/#[]/.test(haystack[at - 1] ?? '')) score += 2;
    score += 1;
    previous = at;
    from = at + 1;
  }
  // A short match on a short string is a better match than the same match
  // buried in a long one.
  return score - haystack.length * 0.01;
}
