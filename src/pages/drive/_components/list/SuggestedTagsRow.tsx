import { Sparkles, X, Plus } from 'lucide-react';
import { useDriveStore } from '@/pages/drive/_hooks/use-drive-store';
import type { DriveItem } from '@/pages/drive/_lib/types';

export default function SuggestedTagsRow({ item }: { item: DriveItem }) {
  const accept = useDriveStore((s) => s.acceptSuggestedTag);
  const dismiss = useDriveStore((s) => s.dismissSuggestedTag);
  const tags = item.suggestedTags ?? [];
  if (!tags.length) return null;
  return (
    <div className="flex items-center gap-1.5 text-[11px] text-blue-700">
      <Sparkles className="h-3 w-3" />
      <span className="font-medium">Suggested:</span>
      {tags.map((t) => (
        <span key={t} className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-2 py-0.5 font-medium">
          <button type="button" onClick={() => accept(item.id, t)} className="inline-flex items-center gap-0.5 hover:underline">
            <Plus className="h-2.5 w-2.5" />
            {t}
          </button>
          <button
            type="button"
            onClick={() => dismiss(item.id, t)}
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
