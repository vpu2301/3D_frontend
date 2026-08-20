import { Sparkles, X, Plus } from 'lucide-react';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import type { Note } from '@/pages/notes/_lib/types';

export default function NoteSuggestedTags({ note }: { note: Note }) {
  const accept = useNotesStore((s) => s.acceptSuggestedTag);
  const dismiss = useNotesStore((s) => s.dismissSuggestedTag);
  const tags = note.suggestedTags ?? [];
  if (tags.length === 0) return null;
  return (
    <div className="mx-10 mt-3 flex flex-wrap items-center gap-1.5 rounded-[12px] border border-[var(--line-soft)] bg-[var(--sand)] px-3 py-2 text-xs text-[var(--text-2)]">
      <Sparkles className="h-3.5 w-3.5" />
      <span className="font-medium">Suggested tags:</span>
      {tags.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-0.5 rounded-full border border-[var(--line-soft)] bg-white px-2 py-0.5 text-[11px] font-medium text-[var(--ink)]"
        >
          <button
            data-command-exempt="accepts or dismisses one AI tag suggestion; it exists only while that suggestion does"
            type="button"
            onClick={() => accept(note.id, t)}
            className="inline-flex items-center gap-0.5 hover:underline"
          >
            <Plus className="h-2.5 w-2.5" />
            {t}
          </button>
          <button
            data-command-exempt="accepts or dismisses one AI tag suggestion; it exists only while that suggestion does"
            type="button"
            onClick={() => dismiss(note.id, t)}
            className="ml-0.5 text-[var(--text-5)] transition-colors hover:text-[var(--ink)]"
            aria-label="Dismiss"
          >
            <X className="h-2.5 w-2.5" />
          </button>
        </span>
      ))}
    </div>
  );
}
