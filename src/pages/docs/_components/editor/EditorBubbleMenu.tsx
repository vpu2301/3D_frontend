import { BubbleMenu } from '@tiptap/react/menus';
import type { Editor } from '@tiptap/react';
import { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Link as LinkIcon,
  Sparkles,
  ChevronDown,
  Wand2,
  Languages,
  MessageCircle,
} from 'lucide-react';
import type { PresetAction } from '@/pages/docs/_lib/types';

interface Props {
  editor: Editor;
  onAskAi: () => void;
  onPreset: (preset: PresetAction) => void;
  onComment: () => void;
}

const TONES: { id: PresetAction; label: string }[] = [
  { id: 'tone-professional', label: 'Professional' },
  { id: 'tone-casual', label: 'Casual' },
  { id: 'tone-confident', label: 'Confident' },
  { id: 'tone-friendly', label: 'Friendly' },
];

const LANGS: { id: PresetAction; label: string }[] = [
  { id: 'translate-spanish', label: 'Spanish' },
  { id: 'translate-french', label: 'French' },
  { id: 'translate-german', label: 'German' },
  { id: 'translate-japanese', label: 'Japanese' },
];

export default function EditorBubbleMenu({ editor, onAskAi, onPreset, onComment }: Props) {
  const [aiOpen, setAiOpen] = useState(false);
  const [toneOpen, setToneOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const closeAll = () => {
    setAiOpen(false);
    setToneOpen(false);
    setLangOpen(false);
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
      <div className="flex items-center gap-0.5 rounded-md border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
        <button
          type="button"
          onClick={() => {
            closeAll();
            onAskAi();
          }}
          className="flex items-center gap-1 rounded-sm bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
        >
          <Sparkles className="h-3.5 w-3.5" /> Ask AI
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setAiOpen((o) => !o);
              setToneOpen(false);
              setLangOpen(false);
            }}
            className="flex items-center gap-0.5 rounded-sm px-1.5 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Wand2 className="h-3.5 w-3.5" />
            <ChevronDown className="h-3 w-3" />
          </button>
          {aiOpen && (
            <div className="absolute left-0 top-full z-10 mt-1 w-44 rounded-md border bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
              {[
                { id: 'improve', label: 'Improve writing' },
                { id: 'shorter', label: 'Make shorter' },
                { id: 'longer', label: 'Make longer' },
                { id: 'grammar', label: 'Fix grammar' },
                { id: 'summarize', label: 'Summarize' },
                { id: 'explain', label: 'Explain' },
              ].map((p) => (
                <button
                  type="button"
                  key={p.id}
                  onClick={() => {
                    closeAll();
                    onPreset(p.id as PresetAction);
                  }}
                  className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  {p.label}
                </button>
              ))}
              <div className="my-1 border-t border-zinc-100 dark:border-zinc-800" />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setToneOpen((o) => !o);
                    setLangOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded px-2 py-1 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  Change tone <ChevronDown className="h-3 w-3" />
                </button>
                {toneOpen && (
                  <div className="absolute left-full top-0 ml-1 w-32 rounded-md border bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                    {TONES.map((t) => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => {
                          closeAll();
                          onPreset(t.id);
                        }}
                        className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setLangOpen((o) => !o);
                    setToneOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded px-2 py-1 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
                >
                  <span className="flex items-center gap-1">
                    <Languages className="h-3 w-3" /> Translate
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                {langOpen && (
                  <div className="absolute left-full top-0 ml-1 w-32 rounded-md border bg-white p-1 shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
                    {LANGS.map((l) => (
                      <button
                        type="button"
                        key={l.id}
                        onClick={() => {
                          closeAll();
                          onPreset(l.id);
                        }}
                        className="block w-full rounded px-2 py-1 text-left text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mx-0.5 h-5 w-px bg-zinc-200 dark:bg-zinc-700" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded-sm p-1 ${editor.isActive('bold') ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
          aria-label="Bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded-sm p-1 ${editor.isActive('italic') ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
          aria-label="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded-sm p-1 ${editor.isActive('underline') ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
          aria-label="Underline"
        >
          <Underline className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded-sm p-1 ${editor.isActive('strike') ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
          aria-label="Strikethrough"
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`rounded-sm p-1 ${editor.isActive('code') ? 'bg-zinc-100 dark:bg-zinc-800' : 'hover:bg-zinc-100 dark:hover:bg-zinc-800'}`}
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
          className="rounded-sm p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Link"
        >
          <LinkIcon className="h-3.5 w-3.5" />
        </button>

        <div className="mx-0.5 h-5 w-px bg-zinc-200 dark:bg-zinc-700" />

        <button
          type="button"
          onClick={onComment}
          className="flex items-center gap-1 rounded-sm px-1.5 py-1 text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <MessageCircle className="h-3.5 w-3.5" /> Comment
        </button>
      </div>
    </BubbleMenu>
  );
}
