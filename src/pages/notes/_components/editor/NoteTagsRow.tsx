import { useState, useRef } from 'react';
import { Hash, Plus, X } from 'lucide-react';
import { useNotesStore, deriveTags, selectNotesMap } from '@/pages/notes/_hooks/use-notes-store';
import type { Note } from '@/pages/notes/_lib/types';

export default function NoteTagsRow({ note }: { note: Note }) {
  const addTag = useNotesStore((s) => s.addTag);
  const removeTag = useNotesStore((s) => s.removeTag);
  const allNotes = useNotesStore(selectNotesMap);
  const [adding, setAdding] = useState(false);
  const [value, setValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const allTags = deriveTags(Object.values(allNotes)).map((t) => t.name);
  const candidates = value
    ? allTags.filter((t) => t.startsWith(value.toLowerCase()) && !note.tags.includes(t))
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
          className="group inline-flex items-center gap-0.5 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700"
        >
          <Hash className="h-2.5 w-2.5" />
          {t}
          <button
            type="button"
            onClick={() => removeTag(note.id, t)}
            className="ml-0.5 text-gray-400 opacity-0 hover:text-red-500 group-hover:opacity-100"
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
            className="h-6 w-24 rounded-full border border-gray-200 bg-white px-2 text-[11px] focus:border-amber-400 focus:outline-none"
          />
          {candidates.length > 0 && (
            <div className="absolute left-0 top-full z-10 mt-1 w-32 rounded-md border border-gray-200 bg-white p-1 shadow-lg">
              {candidates.slice(0, 6).map((c) => (
                <button
                  key={c}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    commit(c);
                  }}
                  className="block w-full rounded px-2 py-1 text-left text-[11px] hover:bg-gray-100"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[11px] text-gray-400 hover:bg-gray-100 hover:text-gray-700"
        >
          <Plus className="h-2.5 w-2.5" />
          Tag
        </button>
      )}
    </div>
  );
}
