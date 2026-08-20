/**
 * The bridge between the open editor and everything outside it.
 *
 * The command palette has to be able to save, quote a selection and hand focus
 * back to the document, but it is mounted in `NotesLayout` — several levels
 * above `NoteEditor` and on routes where no editor exists at all. Threading a
 * ref down through four components to express "whatever is currently being
 * edited" would put editor plumbing in the props of every page.
 *
 * So the editor registers itself here on mount and deregisters on unmount, and
 * exactly one editor is ever active: `/notes` renders one editing pane.
 *
 * The registration is deliberately a small interface rather than the TipTap
 * instance. Callers can save, focus, read the selection and read the document;
 * they cannot reach into the schema. That keeps this from becoming a second,
 * ad-hoc editor API.
 */

import type { JSONContent } from '@tiptap/react';

export interface ActiveEditor {
  /** The note being edited — callers use it to scope a command to this note. */
  noteId: string;
  /** The live document, which may be newer than the store's copy mid-debounce. */
  getJSON: () => JSONContent;
  /** Plain text of the current selection, `''` when nothing is selected. */
  getSelectedText: () => string;
  focus: () => void;
  blur: () => void;
  /**
   * Force the pending autosave through and write a checkpoint version.
   * Resolves once the server has confirmed, so callers can honestly say
   * "saved" rather than "sent".
   */
  flush: () => Promise<void>;

  /**
   * Light up the sentence an outcome came from, or clear with null. This is
   * how a proposal proves where it came from (FE-2 §1) — the editor owns the
   * document, so the highlight has to be asked for rather than drawn.
   */
  highlightSource: (quote: string | null) => void;

  /**
   * Scroll to that sentence. Returns false when the quote is no longer in the
   * note, so the caller can say "the source text changed" instead of leaving
   * the page where it was and looking broken.
   */
  scrollToSource: (quote: string) => boolean;
}

let active: ActiveEditor | null = null;
const listeners = new Set<() => void>();

export function setActiveEditor(editor: ActiveEditor | null): void {
  active = editor;
  for (const listener of listeners) listener();
}

/**
 * Deregister, but only if `noteId` is still the active one.
 *
 * React mounts the next editor before unmounting the previous one when the
 * route changes, so an unconditional clear on unmount would wipe the editor
 * that had just registered.
 */
export function clearActiveEditor(noteId: string): void {
  if (active?.noteId === noteId) setActiveEditor(null);
}

export function getActiveEditor(): ActiveEditor | null {
  return active;
}

export function subscribeActiveEditor(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Flush whatever is open. Safe to call when nothing is. */
export async function flushActiveEditor(): Promise<void> {
  await active?.flush();
}
