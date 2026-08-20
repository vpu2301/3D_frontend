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
      <div className="flex items-center gap-0.5 rounded-[12px] border border-[var(--line-soft)] bg-white p-1 shadow-[0_8px_24px_rgba(20,22,26,0.12)]">
        <button
          type="button"
          onClick={() => {
            closeAll();
            onAskAi();
          }}
          className="flex items-center gap-1 rounded-full bg-[var(--ink)] px-2.5 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-85"
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
            className="flex items-center gap-0.5 rounded-[8px] px-1.5 py-1 text-xs text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          >
            <Wand2 className="h-3.5 w-3.5" />
            <ChevronDown className="h-3 w-3" />
          </button>
          {aiOpen && (
            <div className="absolute left-0 top-full z-10 mt-1 w-44 rounded-[12px] border border-[var(--line-soft)] bg-white p-1 shadow-[0_8px_24px_rgba(20,22,26,0.12)]">
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
                  className="block w-full rounded-[8px] px-2 py-1 text-left text-xs text-[var(--text-2)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
                >
                  {p.label}
                </button>
              ))}
              <div className="my-1 border-t border-[var(--line-soft)]" />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setToneOpen((o) => !o);
                    setLangOpen(false);
                  }}
                  className="flex w-full items-center justify-between rounded-[8px] px-2 py-1 text-left text-xs text-[var(--text-2)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
                >
                  Change tone <ChevronDown className="h-3 w-3" />
                </button>
                {toneOpen && (
                  <div className="absolute left-full top-0 ml-1 w-32 rounded-[12px] border border-[var(--line-soft)] bg-white p-1 shadow-[0_8px_24px_rgba(20,22,26,0.12)]">
                    {TONES.map((t) => (
                      <button
                        type="button"
                        key={t.id}
                        onClick={() => {
                          closeAll();
                          onPreset(t.id);
                        }}
                        className="block w-full rounded-[8px] px-2 py-1 text-left text-xs text-[var(--text-2)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
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
                  className="flex w-full items-center justify-between rounded-[8px] px-2 py-1 text-left text-xs text-[var(--text-2)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
                >
                  <span className="flex items-center gap-1">
                    <Languages className="h-3 w-3" /> Translate
                  </span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                {langOpen && (
                  <div className="absolute left-full top-0 ml-1 w-32 rounded-[12px] border border-[var(--line-soft)] bg-white p-1 shadow-[0_8px_24px_rgba(20,22,26,0.12)]">
                    {LANGS.map((l) => (
                      <button
                        type="button"
                        key={l.id}
                        onClick={() => {
                          closeAll();
                          onPreset(l.id);
                        }}
                        className="block w-full rounded-[8px] px-2 py-1 text-left text-xs text-[var(--text-2)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
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

        <div className="mx-0.5 h-5 w-px bg-[var(--line-soft)]" />

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded-[8px] p-1 transition-colors ${editor.isActive('bold') ? 'bg-[rgba(20,22,26,0.06)] text-[var(--ink)]' : 'text-[var(--text-3)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]'}`}
          aria-label="Bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded-[8px] p-1 transition-colors ${editor.isActive('italic') ? 'bg-[rgba(20,22,26,0.06)] text-[var(--ink)]' : 'text-[var(--text-3)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]'}`}
          aria-label="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded-[8px] p-1 transition-colors ${editor.isActive('underline') ? 'bg-[rgba(20,22,26,0.06)] text-[var(--ink)]' : 'text-[var(--text-3)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]'}`}
          aria-label="Underline"
        >
          <Underline className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`rounded-[8px] p-1 transition-colors ${editor.isActive('strike') ? 'bg-[rgba(20,22,26,0.06)] text-[var(--ink)]' : 'text-[var(--text-3)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]'}`}
          aria-label="Strikethrough"
        >
          <Strikethrough className="h-3.5 w-3.5" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`rounded-[8px] p-1 transition-colors ${editor.isActive('code') ? 'bg-[rgba(20,22,26,0.06)] text-[var(--ink)]' : 'text-[var(--text-3)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]'}`}
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
          className="rounded-[8px] p-1 text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          aria-label="Link"
        >
          <LinkIcon className="h-3.5 w-3.5" />
        </button>

        <div className="mx-0.5 h-5 w-px bg-[var(--line-soft)]" />

        <button
          type="button"
          onClick={onComment}
          className="flex items-center gap-1 rounded-[8px] px-1.5 py-1 text-xs text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
        >
          <MessageCircle className="h-3.5 w-3.5" /> Comment
        </button>
      </div>
    </BubbleMenu>
  );
}
