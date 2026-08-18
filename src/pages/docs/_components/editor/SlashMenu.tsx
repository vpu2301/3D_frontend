import { useEffect, useRef, useState } from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Code2,
  CheckSquare,
  Minus,
  Image as ImageIcon,
  Sparkles,
  ListTree,
  Wand2,
  Type,
} from 'lucide-react';
import type { Editor } from '@tiptap/react';

interface Item {
  id: string;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  group: 'Basic' | 'Lists' | 'Advanced' | 'AI';
  run: (editor: Editor) => void;
}

const ITEMS: Item[] = [
  {
    id: 'paragraph',
    label: 'Text',
    hint: 'Plain paragraph',
    icon: Type,
    group: 'Basic',
    run: (e) => e.chain().focus().setParagraph().run(),
  },
  {
    id: 'h1',
    label: 'Heading 1',
    hint: 'Big section heading',
    icon: Heading1,
    group: 'Basic',
    run: (e) => e.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    id: 'h2',
    label: 'Heading 2',
    hint: 'Medium section heading',
    icon: Heading2,
    group: 'Basic',
    run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    id: 'h3',
    label: 'Heading 3',
    hint: 'Small section heading',
    icon: Heading3,
    group: 'Basic',
    run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    id: 'bullet',
    label: 'Bulleted list',
    hint: 'Simple bulleted list',
    icon: List,
    group: 'Lists',
    run: (e) => e.chain().focus().toggleBulletList().run(),
  },
  {
    id: 'ordered',
    label: 'Numbered list',
    hint: 'Numbered list',
    icon: ListOrdered,
    group: 'Lists',
    run: (e) => e.chain().focus().toggleOrderedList().run(),
  },
  {
    id: 'task',
    label: 'To-do list',
    hint: 'Checklist with checkboxes',
    icon: CheckSquare,
    group: 'Lists',
    run: (e) => e.chain().focus().toggleTaskList().run(),
  },
  {
    id: 'quote',
    label: 'Blockquote',
    hint: 'Stand-out quote',
    icon: Quote,
    group: 'Advanced',
    run: (e) => e.chain().focus().toggleBlockquote().run(),
  },
  {
    id: 'codeblock',
    label: 'Code block',
    hint: 'Syntax-highlighted code',
    icon: Code2,
    group: 'Advanced',
    run: (e) => e.chain().focus().toggleCodeBlock().run(),
  },
  {
    id: 'code',
    label: 'Inline code',
    hint: 'Format text as code',
    icon: Code,
    group: 'Advanced',
    run: (e) => e.chain().focus().toggleCode().run(),
  },
  {
    id: 'hr',
    label: 'Divider',
    hint: 'Horizontal rule',
    icon: Minus,
    group: 'Advanced',
    run: (e) => e.chain().focus().setHorizontalRule().run(),
  },
  {
    id: 'image',
    label: 'Image',
    hint: 'Embed from URL',
    icon: ImageIcon,
    group: 'Advanced',
    run: (e) => {
      const url = window.prompt('Image URL?');
      if (url) e.chain().focus().setImage({ src: url }).run();
    },
  },
  {
    id: 'ai-summary',
    label: 'AI summary',
    hint: 'TL;DR of the doc above',
    icon: Sparkles,
    group: 'AI',
    run: (e) => e.chain().focus().insertContent({ type: 'aiSummary' }).run(),
  },
  {
    id: 'ai-outline',
    label: 'AI outline',
    hint: 'Live table of contents',
    icon: ListTree,
    group: 'AI',
    run: (e) => e.chain().focus().insertContent({ type: 'aiOutline' }).run(),
  },
  {
    id: 'ai-prompt',
    label: 'AI prompt block',
    hint: 'Saved, re-runnable prompt',
    icon: Wand2,
    group: 'AI',
    run: (e) =>
      e.chain().focus().insertContent({ type: 'aiPrompt', attrs: { prompt: '', output: '' } }).run(),
  },
];

interface Props {
  editor: Editor;
  position: { x: number; y: number };
  query: string;
  onClose: () => void;
  /** Position of the trigger '/' in the doc, used to delete it on selection */
  triggerFrom: number;
}

export default function SlashMenu({ editor, position, query, onClose, triggerFrom }: Props) {
  const [active, setActive] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = ITEMS.filter(
    (i) =>
      !query ||
      i.label.toLowerCase().includes(query.toLowerCase()) ||
      i.id.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive((a) => Math.min(filtered.length - 1, a + 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive((a) => Math.max(0, a - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const item = filtered[active];
        if (item) commit(item);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKey, true);
    return () => window.removeEventListener('keydown', onKey, true);
  }, [active, filtered, onClose]);

  const commit = (item: Item) => {
    // delete the slash and any typed query
    const to = editor.state.selection.from;
    editor.chain().focus().deleteRange({ from: triggerFrom, to }).run();
    item.run(editor);
    onClose();
  };

  if (filtered.length === 0) {
    return (
      <div
        ref={containerRef}
        className="fixed z-50 w-72 rounded-md border border-zinc-200 bg-white p-3 text-xs text-zinc-500 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
        style={{ left: position.x, top: position.y }}
      >
        No matching commands. Press Esc.
      </div>
    );
  }

  // group consecutively while preserving filtered order
  const grouped: { group: string; items: Item[] }[] = [];
  for (const item of filtered) {
    const last = grouped[grouped.length - 1];
    if (last && last.group === item.group) last.items.push(item);
    else grouped.push({ group: item.group, items: [item] });
  }

  let runningIdx = -1;

  return (
    <div
      ref={containerRef}
      className="fixed z-50 max-h-80 w-72 overflow-y-auto rounded-md border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
      style={{ left: position.x, top: position.y }}
      role="listbox"
    >
      {grouped.map((g) => (
        <div key={g.group}>
          <div className="px-2 pb-1 pt-2 text-[10px] font-medium uppercase tracking-wider text-zinc-400">
            {g.group}
          </div>
          {g.items.map((item) => {
            runningIdx++;
            const i = runningIdx;
            const Icon = item.icon;
            const isActive = i === active;
            return (
              <button
                type="button"
                key={item.id}
                onMouseEnter={() => setActive(i)}
                onClick={() => commit(item)}
                className={`flex w-full items-start gap-2 rounded px-2 py-1.5 text-left ${
                  isActive ? 'bg-zinc-100 dark:bg-zinc-800' : ''
                }`}
                role="option"
                aria-selected={isActive}
              >
                <Icon className="mt-0.5 h-4 w-4 text-zinc-500" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm">{item.label}</div>
                  <div className="truncate text-[11px] text-zinc-500">{item.hint}</div>
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
