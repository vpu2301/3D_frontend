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
            className="absolute right-3 top-3 rounded-md bg-white/90 p-1 text-gray-700 opacity-0 backdrop-blur transition-opacity hover:bg-white group-hover:opacity-100"
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
              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-700 group-hover:opacity-100"
            >
              <Smile className="h-3.5 w-3.5" /> Add icon
            </button>
          )}
          {!doc.cover && (
            <button
              type="button"
              onClick={onCoverUpload}
              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-xs text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-700 group-hover:opacity-100"
            >
              <ImagePlus className="h-3.5 w-3.5" /> Add cover
            </button>
          )}
        </div>
      )}

      {emojiOpen && (
        <div className="absolute left-12 top-12 z-10 grid grid-cols-10 gap-1 rounded-md border border-gray-200 bg-white p-2 shadow-md">
          <button
            type="button"
            onClick={() => {
              onPatch({ icon: undefined });
              setEmojiOpen(false);
            }}
            className="col-span-2 rounded p-1 text-xs text-gray-500 hover:bg-gray-100"
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
              className="rounded p-1 text-xl hover:bg-gray-100"
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
