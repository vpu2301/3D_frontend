/**
 * Autosave, flush and the truthful save state — the trust surface's engine.
 *
 * It lives apart from `NoteEditor` because it is the part with rules, and rules
 * that are worth stating are worth testing without mounting ProseMirror:
 *
 *  1. **Typing debounces to one PATCH.** Twenty keystrokes in five seconds are
 *     one request, not twenty. The store serialises per note id on top of this,
 *     so even a burst that outruns the debounce cannot overlap.
 *  2. **Blur, leaving the note and Cmd+S flush unconditionally**, with
 *     `checkpoint=true`. Not guarded on "is anything dirty": autosaves coalesce
 *     into roughly one version per minute, so the last one may have left no
 *     version row, and this flush is what makes the live document restorable.
 *     Restating an unchanged note is a no-op server-side.
 *  3. **"Saved" means the server said so.** `savedAt` moves only on a resolved
 *     write, and it is seeded from the note's own `updatedAt` so a freshly
 *     opened note reports the truth rather than a save this session never made.
 *  4. **A failure is offered a retry**, holding the exact document that failed.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { JSONContent } from '@tiptap/react';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';

export const SAVE_DEBOUNCE_MS = 300;

export type SaveStatus = 'saved' | 'saving' | 'error';

export interface NoteAutosave {
  status: SaveStatus;
  /** Ms epoch of the last server-confirmed write. */
  savedAt: number;
  /** Called on every document change; debounced into one PATCH. */
  schedule: (content: JSONContent) => void;
  /** Force the pending save through and write a checkpoint. Rejects on failure. */
  flush: (content?: JSONContent) => Promise<void>;
  /** Re-send the document whose save failed. */
  retry: () => Promise<void>;
}

export function useNoteAutosave(noteId: string | null): NoteAutosave {
  const saveContent = useNotesStore((s) => s.saveContent);
  const checkpoint = useNotesStore((s) => s.checkpoint);
  const updatedAt = useNotesStore((s) => (noteId ? s.notes[noteId]?.updatedAt : undefined));

  const [status, setStatus] = useState<SaveStatus>('saved');
  const [savedAt, setSavedAt] = useState<number>(() => updatedAt ?? Date.now());

  const timer = useRef<number | null>(null);
  /** The document as of the last save attempt — what `retry` re-sends. */
  const lastAttempt = useRef<JSONContent | null>(null);

  // Switching notes starts a fresh session: the previous note's failure state
  // and retry payload must not follow the user into the next document.
  useEffect(() => {
    lastAttempt.current = null;
    setStatus('saved');
    setSavedAt(updatedAt ?? Date.now());
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = null;
    };
    // `updatedAt` is deliberately not a dependency: it changes on every save,
    // and re-seeding the indicator from it would fight the state set below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [noteId]);

  const write = useCallback(
    async (id: string, content: JSONContent) => {
      try {
        await saveContent(id, content);
        // Only now is "saved" true. Setting it optimistically is how an app
        // ends up claiming a write that 500'd.
        setSavedAt(Date.now());
        setStatus('saved');
      } catch (error) {
        setStatus('error');
        throw error;
      }
    },
    [saveContent],
  );

  const schedule = useCallback(
    (content: JSONContent) => {
      if (!noteId) return;
      setStatus('saving');
      lastAttempt.current = content;
      if (timer.current) window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => {
        timer.current = null;
        void write(noteId, content).catch(() => undefined);
      }, SAVE_DEBOUNCE_MS);
    },
    [noteId, write],
  );

  const flush = useCallback(
    async (content?: JSONContent) => {
      if (!noteId) return;
      if (timer.current) {
        window.clearTimeout(timer.current);
        timer.current = null;
      }
      try {
        if (content) {
          lastAttempt.current = content;
          await saveContent(noteId, content);
        }
        await checkpoint(noteId);
        setSavedAt(Date.now());
        setStatus('saved');
      } catch (error) {
        setStatus('error');
        // Rethrown so Cmd+S can tell the user the truth rather than claiming a
        // save it did not make.
        throw error;
      }
    },
    [noteId, saveContent, checkpoint],
  );

  const retry = useCallback(async () => {
    if (!noteId || !lastAttempt.current) return;
    setStatus('saving');
    await write(noteId, lastAttempt.current).catch(() => undefined);
  }, [noteId, write]);

  /**
   * Memoised because callers put this object in effect dependency arrays.
   *
   * Every callback above is already a stable `useCallback`, but a fresh wrapper
   * object each render makes the whole thing look changed. `NoteEditor` depends
   * on it to register itself in the editor bridge, and that registration
   * notifies a `useSyncExternalStore` subscriber — so an identity that changes
   * every render is a render → register → notify → render loop, which React
   * ends by unmounting the tree. Identity now changes only when the save state
   * genuinely does.
   */
  return useMemo(
    () => ({ status, savedAt, schedule, flush, retry }),
    [status, savedAt, schedule, flush, retry],
  );
}
