import { BubbleMenu } from '@tiptap/react/menus';
import type { Editor } from '@tiptap/react';
import { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Code,
  Link as LinkIcon,
  Sparkles,
  ChevronDown,
  ListChecks,
  Lightbulb,
} from 'lucide-react';
import { runPreset, extractTasks, extractDecisions } from '@/pages/docs/_lib/mockAi';
import type { PresetAction } from '@/pages/docs/_lib/types';

interface Props {
  editor: Editor;
}

export default function NoteBubbleMenu({ editor }: Props) {
  const onAskAiFromBubble = async (preset: PresetAction = 'improve') => {
    await runOnSelection(preset);
  };
  const [aiOpen, setAiOpen] = useState(false);

  const runOnSelection = async (preset: PresetAction) => {
    const sel = editor.state.selection;
    if (sel.empty) return;
    const text = editor.state.doc.textBetween(sel.from, sel.to, '\n', ' ');
    let acc = '';
    try {
      for await (const chunk of runPreset(preset, text)) {
        acc += chunk;
      }
      editor
        .chain()
        .focus()
        .deleteRange({ from: sel.from, to: sel.to })
        .insertContent(acc)
        .run();
    } catch {
      /* ignore mock failure */
    }
  };

  const onExtractTasks = async () => {
    const sel = editor.state.selection;
    if (sel.empty) return;
    const text = editor.state.doc.textBetween(sel.from, sel.to, '\n', ' ');
    try {
      const tasks = await extractTasks(text);
      if (tasks.length === 0) return;
      const node = {
        type: 'taskList',
        content: tasks.map((t) => ({
          type: 'taskItem',
          attrs: { checked: !!t.done },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: t.text }] }],
        })),
      };
      editor.chain().focus().insertContentAt(sel.to, node).run();
    } catch {
      /* mock failure */
    }
  };

  const onExtractDecisions = async () => {
    const sel = editor.state.selection;
    if (sel.empty) return;
    const text = editor.state.doc.textBetween(sel.from, sel.to, '\n', ' ');
    try {
      const decisions = await extractDecisions(text);
      if (decisions.length === 0) return;
      const blockquote = {
        type: 'blockquote',
        content: [
          {
            type: 'paragraph',
            content: [{ type: 'text', text: 'Decisions:' }],
          },
          {
            type: 'bulletList',
            content: decisions.map((d) => ({
              type: 'listItem',
              content: [
                { type: 'paragraph', content: [{ type: 'text', text: d.text }] },
              ],
            })),
          },
        ],
      };
      editor.chain().focus().insertContentAt(sel.to, blockquote).run();
    } catch {
      /* mock failure */
    }
  };

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: 'top' }}
      shouldShow={({ from, to, state }) => {
        if (from === to) return false;
        if (state.doc.resolve(from).parent.type.name === 'codeBlock') return false;
        return true;
      }}
    >
      <div className="flex items-center gap-0.5 rounded-md border border-gray-200 bg-white p-1 shadow-lg">
        <button
          type="button"
          onClick={() => onAskAiFromBubble('improve')}
          className="flex items-center gap-1 rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
        >
          <Sparkles className="h-3.5 w-3.5" /> Ask AI
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setAiOpen((o) => !o)}
            className="flex items-center gap-0.5 rounded-sm px-1.5 py-1 text-xs hover:bg-gray-100"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
          {aiOpen && (
            <div
              className="absolute left-0 top-full z-10 mt-1 w-44 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
              onMouseLeave={() => setAiOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setAiOpen(false);
                  onExtractTasks();
                }}
                className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-xs hover:bg-gray-100"
              >
                <ListChecks className="h-3 w-3" /> Extract tasks
              </button>
              <button
                type="button"
                onClick={() => {
                  setAiOpen(false);
                  onExtractDecisions();
                }}
                className="flex w-full items-center gap-1.5 rounded px-2 py-1 text-left text-xs hover:bg-gray-100"
              >
                <Lightbulb className="h-3 w-3" /> Extract decisions
              </button>
              <div className="my-1 border-t border-gray-100" />
              {[
                { id: 'improve', label: 'Improve writing' },
                { id: 'shorter', label: 'Make shorter' },
                { id: 'longer', label: 'Make longer' },
                { id: 'grammar', label: 'Fix grammar' },
                { id: 'summarize', label: 'Summarize' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setAiOpen(false);
                    runOnSelection(p.id as PresetAction);
                  }}
                  className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-gray-100"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="mx-0.5 h-5 w-px bg-gray-200" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded-sm p-1 ${editor.isActive('bold') ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
          aria-label="Bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded-sm p-1 ${editor.isActive('italic') ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
          aria-label="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded-sm p-1 ${editor.isActive('underline') ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
          aria-label="Underline"
        >
          <Underline className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`rounded-sm p-1 ${editor.isActive('code') ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
          aria-label="Inline code"
        >
          <Code className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => {
            const url = window.prompt('URL?');
            if (url) editor.chain().focus().setLink({ href: url }).run();
            else editor.chain().focus().unsetLink().run();
          }}
          className="rounded-sm p-1 hover:bg-gray-100"
          aria-label="Link"
        >
          <LinkIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    </BubbleMenu>
  );
}
