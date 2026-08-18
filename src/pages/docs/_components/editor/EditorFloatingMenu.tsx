import { FloatingMenu } from '@tiptap/react/menus';
import type { Editor } from '@tiptap/react';
import { Heading1, Heading2, List, ListOrdered, CheckSquare, Quote, Code2, Sparkles } from 'lucide-react';

export default function EditorFloatingMenu({ editor }: { editor: Editor }) {
  return (
    <FloatingMenu
      editor={editor}
      options={{ placement: 'left' }}
      shouldShow={({ state }) => {
        const { $from } = state.selection;
        const isEmpty = $from.parent.content.size === 0 && $from.parent.type.name === 'paragraph';
        return isEmpty;
      }}
    >
      <div className="flex items-center gap-0.5 rounded-md border border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-700 dark:bg-zinc-900">
        <span className="px-1 text-[10px] uppercase tracking-wider text-zinc-400">Quick:</span>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          title="Heading 1"
        >
          <Heading1 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          title="Heading 2"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          title="Bulleted list"
        >
          <List className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          title="Numbered list"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          title="Task list"
        >
          <CheckSquare className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          title="Blockquote"
        >
          <Quote className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          title="Code block"
        >
          <Code2 className="h-3.5 w-3.5" />
        </button>
        <div className="mx-0.5 h-5 w-px bg-zinc-200 dark:bg-zinc-700" />
        <button
          type="button"
          onClick={() => editor.chain().focus().insertContent({ type: 'aiSummary' }).run()}
          className="flex items-center gap-1 rounded p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-950"
          title="AI summary block"
        >
          <Sparkles className="h-3.5 w-3.5" />
        </button>
      </div>
    </FloatingMenu>
  );
}
