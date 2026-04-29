import { Sparkles, X, Plus } from 'lucide-react';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import type { Note } from '@/pages/notes/_lib/types';

export default function NoteSuggestedTags({ note }: { note: Note }) {
  const accept = useNotesStore((s) => s.acceptSuggestedTag);
  const dismiss = useNotesStore((s) => s.dismissSuggestedTag);
  const tags = note.suggestedTags ?? [];
  if (tags.length === 0) return null;
  return (
    <div className="mx-10 mt-3 flex flex-wrap items-center gap-1.5 rounded-md border border-blue-100 bg-blue-50/50 px-3 py-2 text-xs text-blue-900">
      <Sparkles className="h-3.5 w-3.5" />
      <span className="font-medium">Suggested tags:</span>
      {tags.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-0.5 rounded-full bg-white px-2 py-0.5 text-[11px] font-medium text-blue-700 shadow-sm"
        >
          <button
            type="button"
            onClick={() => accept(note.id, t)}
            className="inline-flex items-center gap-0.5 hover:underline"
          >
            <Plus className="h-2.5 w-2.5" />
            {t}
          </button>
          <button
            type="button"
            onClick={() => dismiss(note.id, t)}
            className="ml-0.5 text-blue-400 hover:text-blue-700"
            aria-label="Dismiss"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </span>
      ))}
    </div>
  );
}
