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
      <div className="flex items-center gap-0.5 rounded-[12px] border border-[var(--line-soft)] bg-white p-1 shadow-[0_4px_16px_rgba(20,22,26,0.08)]">
        <span className="plat-eyebrow px-1">Quick:</span>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="rounded-[8px] p-1 text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          title="Heading 1"
        >
          <Heading1 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="rounded-[8px] p-1 text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          title="Heading 2"
        >
          <Heading2 className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="rounded-[8px] p-1 text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          title="Bulleted list"
        >
          <List className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="rounded-[8px] p-1 text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          title="Numbered list"
        >
          <ListOrdered className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className="rounded-[8px] p-1 text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          title="Task list"
        >
          <CheckSquare className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="rounded-[8px] p-1 text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          title="Blockquote"
        >
          <Quote className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className="rounded-[8px] p-1 text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          title="Code block"
        >
          <Code2 className="h-3.5 w-3.5" />
        </button>
        <div className="mx-0.5 h-5 w-px bg-[var(--line-soft)]" />
        <button
          type="button"
          onClick={() => editor.chain().focus().insertContent({ type: 'aiSummary' }).run()}
          className="flex items-center gap-1 rounded-[8px] p-1 text-[var(--ink)] transition-colors hover:bg-[rgba(20,22,26,0.05)]"
          title="AI summary block"
        >
          <Sparkles className="h-3.5 w-3.5" />
        </button>
      </div>
    </FloatingMenu>
  );
}
