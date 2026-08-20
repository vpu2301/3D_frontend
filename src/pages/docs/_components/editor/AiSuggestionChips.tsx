import { Sparkles, FileText, ListTree, Wand2, MoreHorizontal } from 'lucide-react';
import type { Editor } from '@tiptap/react';

interface Chip {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  run: () => void;
}

interface Props {
  editor: Editor;
  onAskAi: () => void;
}

export default function AiSuggestionChips({ editor, onAskAi }: Props) {
  const chips: Chip[] = [
    {
      label: 'AI summary',
      icon: Sparkles,
      run: () => editor.chain().focus().insertContent({ type: 'aiSummary' }).run(),
    },
    {
      label: 'AI outline',
      icon: ListTree,
      run: () => editor.chain().focus().insertContent({ type: 'aiOutline' }).run(),
    },
    {
      label: 'Continue writing',
      icon: Wand2,
      run: onAskAi,
    },
    {
      label: 'More',
      icon: MoreHorizontal,
      run: onAskAi,
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 py-6">
      {chips.map((c) => {
        const Icon = c.icon;
        return (
          <button
            key={c.label}
            type="button"
            onClick={c.run}
            className="plat-btn-ghost h-9"
          >
            <Icon className="h-4 w-4 text-[var(--text-4)]" />
            {c.label}
          </button>
        );
      })}
    </div>
  );
}
