import { create } from 'zustand';
import type { NoteListSort, NoteListFilter, NotesViewMode } from '@/pages/notes/_lib/types';
import type { PaletteMode } from '@/pages/notes/_lib/commands';

/**
 * There is deliberately no `query` here any more.
 *
 * It used to drive the list panel's own search box. FE-3 §1 collapsed search to
 * one entry point, so the query lives in the search page's URL — which is also
 * what makes a search shareable and a saved view reproducible. A query in this
 * store is how a second search box grows back.
 */
interface UiState {
  selectedNoteId: string | null;
  setSelectedNoteId: (id: string | null) => void;

  sort: NoteListSort;
  setSort: (s: NoteListSort) => void;

  filter: NoteListFilter;
  setFilter: (f: NoteListFilter) => void;
  resetFilter: () => void;

  viewMode: NotesViewMode;
  setViewMode: (v: NotesViewMode) => void;

  selectedIds: string[];
  toggleSelected: (id: string) => void;
  clearSelection: () => void;

  aiSidebarOpen: boolean;
  setAiSidebarOpen: (v: boolean) => void;

  /** Which tab the ask panel shows. Agent is hidden unless its flag is on. */
  aiPanelTab: 'ask' | 'agent';
  setAiPanelTab: (tab: 'ask' | 'agent') => void;

  /**
   * Text the inline "Ask…" action handed over, for the panel to answer about.
   *
   * Same handoff shape as `pendingSourceQuote`: the panel may not be mounted
   * when the bubble menu fires, so the selection is parked here and whoever
   * consumes it clears it. Holding it as durable state instead would mean a
   * question asked an hour later silently carried a stale paragraph as context.
   */
  aiPendingSelection: string | null;
  askAboutSelection: (text: string) => void;
  clearAiPendingSelection: () => void;

  quickCaptureOpen: boolean;
  setQuickCaptureOpen: (v: boolean) => void;

  /** Active smart view id, if any */
  smartViewId: string | null;
  setSmartViewId: (id: string | null) => void;

  /**
   * Surfaces the command palette can raise. They live in the UI store rather
   * than in each component's `useState` because a command runs from the palette,
   * from a shortcut and from a button, and all three have to open the same
   * sheet — a local `useState` is reachable from exactly one of them.
   */
  paletteOpen: boolean;
  paletteMode: PaletteMode;
  openPalette: (mode?: PaletteMode) => void;
  closePalette: () => void;
  setPaletteMode: (mode: PaletteMode) => void;

  shortcutsOpen: boolean;
  setShortcutsOpen: (v: boolean) => void;

  historyOpen: boolean;
  setHistoryOpen: (v: boolean) => void;

  settingsOpen: boolean;
  setSettingsOpen: (v: boolean) => void;

  reminderOpen: boolean;
  setReminderOpen: (v: boolean) => void;

  emptyTrashOpen: boolean;
  setEmptyTrashOpen: (v: boolean) => void;

  /**
   * A source sentence to scroll to once the note's editor is ready.
   *
   * Open Items navigates to a note and wants it opened *at* the obligation's
   * sentence, but the editor does not exist yet when the click happens. So the
   * quote is left here and the editor consumes it on mount — a handoff, not
   * state: whoever reads it clears it.
   */
  pendingSourceQuote: string | null;
  setPendingSourceQuote: (quote: string | null) => void;
}

export const useNotesUiStore = create<UiState>((set) => ({
  selectedNoteId: null,
  setSelectedNoteId: (id) => set({ selectedNoteId: id }),

  sort: { by: 'updated', dir: 'desc' },
  setSort: (s) => set({ sort: s }),

  filter: {},
  setFilter: (f) => set({ filter: f }),
  resetFilter: () => set({ filter: {} }),

  viewMode: 'split',
  setViewMode: (v) => set({ viewMode: v }),

  selectedIds: [],
  toggleSelected: (id) =>
    set((s) => ({
      selectedIds: s.selectedIds.includes(id)
        ? s.selectedIds.filter((x) => x !== id)
        : [...s.selectedIds, id],
    })),
  clearSelection: () => set({ selectedIds: [] }),

  aiSidebarOpen: false,
  setAiSidebarOpen: (v) => set({ aiSidebarOpen: v }),

  aiPanelTab: 'ask',
  setAiPanelTab: (tab) => set({ aiPanelTab: tab }),

  aiPendingSelection: null,
  // Asking about a selection always lands on the Ask tab: the user picked text
  // and asked a question about it, which is not a request to run an agent.
  askAboutSelection: (text) =>
    set({ aiPendingSelection: text, aiSidebarOpen: true, aiPanelTab: 'ask' }),
  clearAiPendingSelection: () => set({ aiPendingSelection: null }),

  quickCaptureOpen: false,
  setQuickCaptureOpen: (v) => set({ quickCaptureOpen: v }),

  smartViewId: null,
  setSmartViewId: (id) => set({ smartViewId: id }),

  paletteOpen: false,
  paletteMode: 'root',
  openPalette: (mode = 'root') => set({ paletteOpen: true, paletteMode: mode }),
  closePalette: () => set({ paletteOpen: false }),
  setPaletteMode: (mode) => set({ paletteOpen: true, paletteMode: mode }),

  shortcutsOpen: false,
  setShortcutsOpen: (v) => set({ shortcutsOpen: v }),

  historyOpen: false,
  setHistoryOpen: (v) => set({ historyOpen: v }),

  settingsOpen: false,
  setSettingsOpen: (v) => set({ settingsOpen: v }),

  reminderOpen: false,
  setReminderOpen: (v) => set({ reminderOpen: v }),

  emptyTrashOpen: false,
  setEmptyTrashOpen: (v) => set({ emptyTrashOpen: v }),

  pendingSourceQuote: null,
  setPendingSourceQuote: (quote) => set({ pendingSourceQuote: quote }),
}));
