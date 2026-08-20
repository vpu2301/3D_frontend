import { useState, useRef } from 'react';
import { Hash, Plus, X } from 'lucide-react';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesTags } from '@/pages/notes/_hooks/use-notes-tags';
import type { Note } from '@/pages/notes/_lib/types';

export default function NoteTagsRow({ note }: { note: Note }) {
  const addTag = useNotesStore((s) => s.addTag);
  const removeTag = useNotesStore((s) => s.removeTag);
  // Autocomplete over the tenant's whole tag vocabulary (`GET /v1/tags`), not
  // just the tags on loaded notes.
  const { tags: allTags } = useNotesTags();
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const candidates = value
    ? allTags
        .map((t) => t.name)
        .filter((t) => t.startsWith(value.toLowerCase()) && !note.tags.includes(t))
    : [];

  const commit = (tag: string) => {
    if (!tag.trim()) return;
    addTag(note.id, tag.trim().toLowerCase());
    setValue('');
    setAdding(false);
  };

  return (
    <div className="mx-10 mt-3 flex flex-wrap items-center gap-1">
      {note.tags.map((t) => (
        <span
          key={t}
          className="plat-pill plat-pill-mute group !gap-0.5 !px-2 !py-0.5 !text-[11px] !font-medium"
        >
          <Hash className="h-2.5 w-2.5" />
          {t}
          <button
            data-command-exempt="tag chip control on this note; the palette form is note.tag"
            type="button"
            onClick={() => removeTag(note.id, t)}
            className="ml-0.5 text-[var(--text-5)] opacity-0 transition-opacity hover:text-[var(--bad-fg)] group-hover:opacity-100"
            aria-label={`Remove tag ${t}`}
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </span>
      ))}
      {adding ? (
        <div className="relative">
          <input
            ref={inputRef}
            value={value}
            autoFocus
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => {
              setAdding(false);
              setValue('');
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') commit(value);
              else if (e.key === 'Escape') {
                setAdding(false);
                setValue('');
              }
            }}
            placeholder="tag…"
            className="h-6 w-24 rounded-full border border-[var(--line)] bg-white px-2 text-[11px] text-[var(--ink)] placeholder:text-[var(--text-5)] focus:border-[var(--ink)] focus:outline-none"
          />
          {candidates.length > 0 && (
            <div className="absolute left-0 top-full z-10 mt-1 w-32 rounded-[12px] border border-[var(--line)] bg-white p-1 shadow-lg">
              {candidates.slice(0, 6).map((c) => (
                <button
            data-command-exempt="tag chip control on this note; the palette form is note.tag"
                  key={c}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    commit(c);
                  }}
                  className="block w-full rounded-[8px] px-2 py-1 text-left text-[11px] text-[var(--text-2)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button
            data-command-exempt="tag chip control on this note; the palette form is note.tag"
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] text-[var(--text-4)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
        >
          <Plus className="h-2.5 w-2.5" />
          Tag
        </button>
      )}
    </div>
  );
}
