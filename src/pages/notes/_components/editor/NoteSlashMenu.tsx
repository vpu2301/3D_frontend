import { useEffect, useState } from 'react';
import {
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code2,
  Minus,
  Image as ImageIcon,
  Type,
  Bell,
  StickyNote,
  Hash,
} from 'lucide-react';
import type { Editor } from '@tiptap/react';
import { cn } from '@/lib/utils';

export interface SlashState {
  triggerFrom: number;
  query: string;
  position: { x: number; y: number };
}

interface Item {
  id: string;
  label: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  group: 'Basic' | 'Lists' | 'Advanced' | 'Notes';
  run: (editor: Editor) => void;
}

const ITEMS: Item[] = [
  { id: 'p', label: 'Text', hint: 'Plain paragraph', icon: Type, group: 'Basic', run: (e) => e.chain().focus().setParagraph().run() },
  { id: 'h1', label: 'Heading 1', hint: 'Big heading', icon: Heading1, group: 'Basic', run: (e) => e.chain().focus().toggleHeading({ level: 1 }).run() },
  { id: 'h2', label: 'Heading 2', hint: 'Medium heading', icon: Heading2, group: 'Basic', run: (e) => e.chain().focus().toggleHeading({ level: 2 }).run() },
  { id: 'h3', label: 'Heading 3', hint: 'Small heading', icon: Heading3, group: 'Basic', run: (e) => e.chain().focus().toggleHeading({ level: 3 }).run() },
  { id: 'bullet', label: 'Bulleted list', hint: 'Bulleted list', icon: List, group: 'Lists', run: (e) => e.chain().focus().toggleBulletList().run() },
  { id: 'ordered', label: 'Numbered list', hint: 'Numbered list', icon: ListOrdered, group: 'Lists', run: (e) => e.chain().focus().toggleOrderedList().run() },
  { id: 'task', label: 'To-do list', hint: 'Tasks roll up across notes', icon: CheckSquare, group: 'Lists', run: (e) => e.chain().focus().toggleTaskList().run() },
  { id: 'quote', label: 'Blockquote', hint: 'Stand-out quote', icon: Quote, group: 'Advanced', run: (e) => e.chain().focus().toggleBlockquote().run() },
  { id: 'codeblock', label: 'Code block', hint: 'Syntax-highlighted code', icon: Code2, group: 'Advanced', run: (e) => e.chain().focus().toggleCodeBlock().run() },
  { id: 'hr', label: 'Divider', hint: 'Horizontal rule', icon: Minus, group: 'Advanced', run: (e) => e.chain().focus().setHorizontalRule().run() },
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
    id: 'remind',
    label: 'Reminder',
    hint: 'Schedule a reminder · mirrors to Calendar',
    icon: Bell,
    group: 'Notes',
    run: (e) => {
      const when = window.prompt('Reminder when? (ISO datetime, "today", or "tomorrow")');
      if (!when) return;
      const dueAt = parseRoughTime(when);
      if (!dueAt) {
        alert('Could not parse time.');
        return;
      }
      e.chain().focus().insertContent({ type: 'reminder', attrs: { dueAt } }).run();
    },
  },
  {
    id: 'wikilink',
    label: 'Wiki-link',
    hint: 'Use [[ to start',
    icon: StickyNote,
    group: 'Notes',
    run: (e) => e.chain().focus().insertContent('[[').run(),
  },
  {
    id: 'tag',
    label: 'Tag',
    hint: 'Use # inline to tag',
    icon: Hash,
    group: 'Notes',
    run: (e) => e.chain().focus().insertContent('#').run(),
  },
];

function parseRoughTime(s: string): number | null {
  const iso = Date.parse(s);
  if (!Number.isNaN(iso)) return iso;
  const lower = s.toLowerCase().trim();
  const now = new Date();
  if (lower === 'today') return now.setHours(17, 0, 0, 0);
  if (lower === 'tomorrow') {
    const t = new Date(now);
    t.setDate(t.getDate() + 1);
    t.setHours(9, 0, 0, 0);
    return t.getTime();
  }
  return null;
}

interface Props {
  editor: Editor;
  state: SlashState;
  onClose: () => void;
}

export default function NoteSlashMenu({ editor, state, onClose }: Props) {
  const [active, setActive] = useState(0);

  const filtered = ITEMS.filter(
    (i) =>
      !state.query ||
      i.label.toLowerCase().includes(state.query.toLowerCase()) ||
      i.id.toLowerCase().includes(state.query.toLowerCase()),
  );

  useEffect(() => setActive(0), [state.query]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, filtered, onClose]);

  const commit = (item: Item) => {
    const to = editor.state.selection.from;
    editor.chain().focus().deleteRange({ from: state.triggerFrom, to }).run();
    item.run(editor);
    onClose();
  };

  if (filtered.length === 0) {
    return (
      <div
        className="fixed z-50 w-72 rounded-md border border-gray-200 bg-white p-3 text-xs text-gray-500 shadow-lg"
        style={{ left: state.position.x, top: state.position.y }}
      >
        No matching commands. Press Esc.
      </div>
    );
  }

  const grouped: { group: string; items: Item[] }[] = [];
  for (const item of filtered) {
    const last = grouped[grouped.length - 1];
    if (last && last.group === item.group) last.items.push(item);
    else grouped.push({ group: item.group, items: [item] });
  }

  let runningIdx = -1;
  return (
    <div
      className="fixed z-50 max-h-80 w-72 overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg"
      style={{ left: state.position.x, top: state.position.y }}
    >
      {grouped.map((g) => (
        <div key={g.group}>
          <div className="px-2 pb-1 pt-2 text-[10px] font-medium uppercase tracking-wider text-gray-400">
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
                className={cn(
                  'flex w-full items-start gap-2 rounded px-2 py-1.5 text-left',
                  isActive && 'bg-gray-100',
                )}
              >
                <Icon className="mt-0.5 h-4 w-4 text-gray-500" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm">{item.label}</div>
                  <div className="truncate text-[11px] text-gray-500">{item.hint}</div>
                </div>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
