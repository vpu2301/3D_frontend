import { useEffect, useState } from 'react';
import { ImagePlus, Smile, X } from 'lucide-react';
import type { Doc } from '@/pages/docs/_lib/types';

const COMMON_EMOJIS = [
  '📄', '📝', '📚', '✍️', '💡', '🎯', '🚀', '🔥', '⭐', '✨',
  '📐', '🗓️', '🪞', '🟢', '🍝', '📓', '🔧', '🎨', '🌱', '🧠',
];

interface Props {
  doc: Doc;
  onPatch: (patch: Partial<Doc>) => void;
}

export default function DocHeader({ doc, onPatch }: Props) {
  const [emojiOpen, setEmojiOpen] = useState(false);

  useEffect(() => {
    document.title = `${doc.title || 'Untitled'} · AI Docs`;
  }, [doc.title]);

  const onCoverUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => onPatch({ cover: String(reader.result) });
      reader.readAsDataURL(file);
    };
    input.click();
  };

  // Only render if there's something to show or actions to take
  return (
    <div className="relative group">
      {doc.cover && (
        <div className="relative h-40 w-full overflow-hidden">
          <img src={doc.cover} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onPatch({ cover: undefined })}
            className="absolute right-3 top-3 rounded-[10px] bg-white/90 p-1 text-[var(--text-2)] opacity-0 backdrop-blur transition-opacity hover:bg-white group-hover:opacity-100"
            aria-label="Remove cover"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {(doc.icon || !doc.cover) && (
        <div className="flex items-center gap-2 px-12 pt-6">
          {doc.icon ? (
            <button
              type="button"
              onClick={() => setEmojiOpen((o) => !o)}
              className="text-3xl leading-none transition-transform hover:scale-110"
              title="Change icon"
            >
              {doc.icon}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setEmojiOpen((o) => !o)}
              className="flex items-center gap-1 rounded-[8px] px-1.5 py-0.5 text-xs text-[var(--text-4)] opacity-0 transition-opacity hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)] group-hover:opacity-100"
            >
              <Smile className="h-3.5 w-3.5" /> Add icon
            </button>
          )}
          {!doc.cover && (
            <button
              type="button"
              onClick={onCoverUpload}
              className="flex items-center gap-1 rounded-[8px] px-1.5 py-0.5 text-xs text-[var(--text-4)] opacity-0 transition-opacity hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)] group-hover:opacity-100"
            >
              <ImagePlus className="h-3.5 w-3.5" /> Add cover
            </button>
          )}
        </div>
      )}

      {emojiOpen && (
        <div className="absolute left-12 top-12 z-10 grid grid-cols-10 gap-1 rounded-[12px] border border-[var(--line-soft)] bg-white p-2 shadow-[0_8px_24px_rgba(20,22,26,0.12)]">
          <button
            type="button"
            onClick={() => {
              onPatch({ icon: undefined });
              setEmojiOpen(false);
            }}
            className="col-span-2 rounded-[8px] p-1 text-xs text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          >
            Clear
          </button>
          {COMMON_EMOJIS.map((e) => (
            <button
              type="button"
              key={e}
              onClick={() => {
                onPatch({ icon: e });
                setEmojiOpen(false);
              }}
              className="rounded-[8px] p-1 text-xl transition-colors hover:bg-[rgba(20,22,26,0.05)]"
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
