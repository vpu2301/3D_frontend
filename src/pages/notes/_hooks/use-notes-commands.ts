/**
 * The bridge between the registry in `_lib/commands.ts` and React.
 *
 * `useCommandContext()` assembles the context a command runs against;
 * `useCommandRunner()` gives any component a `run('note.pin')`; and
 * `useGlobalShortcuts()` — mounted exactly once, in `NotesLayout` — binds every
 * registry entry that declares a shortcut.
 *
 * Nothing here decides what an action is or what it is bound to. That is the
 * registry's job, and keeping the decision in one place is what makes the
 * palette, the shortcut sheet and the key handler incapable of drifting apart.
 */

import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';
import { proposalsOf, useOutcomesStore } from '@/pages/notes/_hooks/use-outcomes-store';
import {
  NOTE_COMMANDS,
  getCommand,
  matchesShortcut,
  type CommandContext,
} from '@/pages/notes/_lib/commands';
import { getActiveEditor, subscribeActiveEditor } from '@/pages/notes/_lib/editorBridge';
import { exportNoteAsMarkdown } from '@/pages/notes/_lib/exportNote';

/** Re-renders whichever component asks whenever the open editor changes. */
export function useActiveEditor() {
  return useSyncExternalStore(subscribeActiveEditor, getActiveEditor, () => null);
}

/**
 * Move focus to the note list — the Escape destination.
 *
 * Queried from the DOM rather than held as a ref, because the caller (the
 * palette, or a key handler in the layout) is not an ancestor of the list and
 * threading a ref up and back down through the router would be worse.
 */
function focusNoteList(): void {
  const list = document.querySelector<HTMLElement>('[data-notes-list]');
  if (!list) return;
  const target =
    list.querySelector<HTMLElement>('[data-notes-list-row][data-active="true"]') ??
    list.querySelector<HTMLElement>('[data-notes-list-row]');
  (target ?? list).focus();
}

export function useCommandContext(): CommandContext {
  const navigate = useNavigate();
  const notes = useNotesStore((s) => s.notes);
  const notebooksMap = useNotesStore((s) => s.notebooks);
  const createNote = useNotesStore((s) => s.createNote);
  const ensureDailyNote = useNotesStore((s) => s.ensureDailyNote);
  const togglePin = useNotesStore((s) => s.togglePin);
  const moveToNotebook = useNotesStore((s) => s.moveToNotebook);
  const trashNote = useNotesStore((s) => s.trashNote);
  const addTag = useNotesStore((s) => s.addTag);
  const extract = useOutcomesStore((s) => s.extract);
  const confirmBatch = useOutcomesStore((s) => s.confirmBatch);
  const outcomesById = useOutcomesStore((s) => s.byId);

  const ui = useNotesUiStore();
  const editor = useActiveEditor();

  // The note a command acts on is the one being edited, which is not always the
  // one the list has highlighted — the palette can be opened from anywhere.
  const activeId = editor?.noteId ?? ui.selectedNoteId;
  const note = activeId ? (notes[activeId] ?? null) : null;

  const notebooks = useMemo(
    () => Object.values(notebooksMap).sort((a, b) => a.name.localeCompare(b.name)),
    [notebooksMap],
  );

  /** Proposals held for a note, so `note.confirm-proposals` can gate itself. */
  const proposalsForNote = useCallback(
    (noteId: string) =>
      proposalsOf(Object.values(outcomesById).filter((outcome) => outcome.noteId === noteId)),
    [outcomesById],
  );

  return useMemo(
    () => ({
      navigate,
      note,
      notebooks,
      editor,
      actions: {
        createNote,
        ensureDailyNote,
        togglePin,
        moveToNotebook,
        trashNote,
        addTag,
        exportNote: exportNoteAsMarkdown,
        extractOutcomes: async (noteId: string) => {
          await extract(noteId);
        },
        confirmAllProposals: async (noteId: string) => {
          const ids = proposalsForNote(noteId).map((proposal) => proposal.id);
          if (ids.length === 0) return 0;
          const result = await confirmBatch(ids);
          return result?.confirmed.length ?? 0;
        },
        proposalCount: (noteId: string) => proposalsForNote(noteId).length,
      },
      ui: {
        setSelectedNoteId: ui.setSelectedNoteId,
        aiSidebarOpen: ui.aiSidebarOpen,
        setAiSidebarOpen: ui.setAiSidebarOpen,
        setQuickCaptureOpen: ui.setQuickCaptureOpen,
        setSmartViewId: ui.setSmartViewId,
        setFilter: ui.setFilter,
      },
      palette: {
        open: ui.openPalette,
        close: ui.closePalette,
        setMode: ui.setPaletteMode,
      },
      openShortcuts: () => ui.setShortcutsOpen(true),
      openHistory: () => ui.setHistoryOpen(true),
      openSettings: () => ui.setSettingsOpen(true),
      openReminder: () => ui.setReminderOpen(true),
      openEmptyTrash: () => ui.setEmptyTrashOpen(true),
      focusList: focusNoteList,
      toast: {
        success: (message, options) => toast.success(message, options),
        error: (message, options) => toast.error(message, options),
      },
    }),
    [
      navigate,
      note,
      notebooks,
      editor,
      createNote,
      ensureDailyNote,
      togglePin,
      moveToNotebook,
      trashNote,
      addTag,
      extract,
      confirmBatch,
      proposalsForNote,
      ui,
    ],
  );
}

/** `run('note.pin')` — the only way a component should perform a registry action. */
export function useCommandRunner(): (id: string) => void {
  const ctx = useCommandContext();
  return useCallback(
    (id: string) => {
      const command = getCommand(id);
      if (!command) {
        // A typo'd id is a bug that would otherwise be a button that does
        // nothing, which is much harder to notice than a console error.
        console.error(`[notes] unknown command "${id}"`);
        return;
      }
      if (command.enabled && !command.enabled(ctx)) return;
      void command.run(ctx);
    },
    [ctx],
  );
}

/** True when the keystroke landed in something the user is typing into. */
function inTextField(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName;
  return tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable === true;
}

function inEditor(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  return Boolean(el?.closest?.('.ProseMirror'));
}

/**
 * Bind every shortcut the registry declares. Mounted once, by `NotesLayout`.
 *
 * Two guards, both of which exist because a global handler that is too eager is
 * worse than no handler:
 *
 *  - Bare keys (`?`) are ignored while the user is typing, or they land in the
 *    document instead of opening a help sheet.
 *  - `editorOnly` commands (Escape, Cmd+Enter) fire only from inside the
 *    document, because everywhere else those keys already mean "close this
 *    dialog" and "submit this form".
 */
export function useGlobalShortcuts(): void {
  const ctx = useCommandContext();
  const paletteOpen = useNotesUiStore((s) => s.paletteOpen);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // While the palette is open it owns the keyboard; the only binding that
      // still applies is the one that closes it, which cmdk handles itself.
      if (paletteOpen) return;

      for (const command of NOTE_COMMANDS) {
        if (!command.shortcut) continue;
        if (!matchesShortcut(event, command.shortcut)) continue;

        const bare = !command.shortcut.includes('mod');
        if (bare && !command.editorOnly && inTextField(event.target)) continue;
        if (command.editorOnly && !inEditor(event.target)) continue;
        if (command.enabled && !command.enabled(ctx)) continue;

        event.preventDefault();
        void command.run(ctx);
        return;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [ctx, paletteOpen]);
}
