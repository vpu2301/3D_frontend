/**
 * The note's label, editable in place.
 *
 * Titles stay *derived* by default (first H1, else first line) because notes
 * are capture-oriented and nobody should have to name a thought before writing
 * it. Clicking here sets an explicit `title`, which `deriveTitle()` prefers
 * over anything in the content; clearing the field drops back to derivation
 * rather than leaving the note stuck on a stale name.
 */

import { useEffect, useRef, useState } from 'react';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { deriveTitle } from '@/pages/notes/_lib/backlinks';
import type { Note } from '@/pages/notes/_lib/types';
import { cn } from '@/lib/utils';

export default function NoteTitleRow({ note }: { note: Note }) {
  const updateNote = useNotesStore((s) => s.updateNote);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const displayed = deriveTitle(note);
  const explicit = note.title?.trim() ?? '';

  // Switching notes while the field is open must not carry the draft across.
  useEffect(() => {
    setEditing(false);
  }, [note.id]);

  useEffect(() => {
    if (!editing) return;
    const input = inputRef.current;
    if (!input) return;
    input.focus();
    input.select();
  }, [editing]);

  const start = () => {
    // Seeded with what is on screen, so an edit starts from the derived title
    // instead of an empty field the user has to retype.
    setDraft(explicit || displayed);
    setEditing(true);
  };

  const commit = () => {
    setEditing(false);
    const next = draft.trim();
    if (next === explicit) return;
    // Typing the derived title verbatim would otherwise pin it: the note would
    // keep that name after its first line changed.
    if (!explicit && next === displayed) return;
    void updateNote(note.id, { title: next });
  };

  if (editing) {
    return (
      <div className="mx-10 mt-4">
        <label htmlFor="note-title-field" className="sr-only">
          Note title
        </label>
        <input
          id="note-title-field"
          ref={inputRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              commit();
            } else if (e.key === 'Escape') {
              e.preventDefault();
              setEditing(false);
            }
          }}
          placeholder="Untitled"
          className="plat-display w-full rounded-[10px] border border-[var(--line)] bg-white px-2 py-1 text-[30px] tracking-tight text-[var(--ink)] placeholder:text-[var(--text-5)] focus:border-[var(--ink)] focus:outline-none"
        />
        <p className="mt-1 px-2 text-[11px]" style={{ color: 'var(--text-5)' }}>
          Enter to save · Esc to cancel · empty follows the first line again
        </p>
      </div>
    );
  }

  return (
    <div className="mx-10 mt-4">
      <button
            data-command-exempt="starts inline title editing; the title is derived text, not a stored decision"
        type="button"
        onClick={start}
        title="Click to rename"
        className={cn(
          'group flex w-full items-center gap-2 rounded-[10px] px-2 py-1 text-left transition-colors hover:bg-[rgba(20,22,26,0.04)]',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(20,22,26,0.15)]',
        )}
      >
        <span
          className={cn(
            'plat-display min-w-0 flex-1 truncate text-[30px] tracking-tight',
            displayed === 'Untitled' ? 'text-[var(--text-5)]' : 'text-[var(--ink)]',
          )}
        >
          {displayed}
        </span>
        <span className="plat-eyebrow shrink-0 opacity-0 transition-opacity group-hover:opacity-100">
          Rename
        </span>
      </button>
    </div>
  );
}
