import { useState, useRef, useEffect } from 'react';
import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  Highlighter,
  Link as LinkIcon,
  Image as ImageIcon,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  RemoveFormatting,
  ChevronDown,
  Sparkles,
  Eye,
  Edit3,
  MessageCircle,
  Pilcrow,
} from 'lucide-react';
import type { Editor } from '@tiptap/react';
import { useDocsSettingsStore } from '@/pages/docs/_hooks/use-docs-settings-store';
import { useDocsUiStore } from '@/pages/docs/_hooks/use-docs-ui-store';
import { cn } from '@/lib/utils';

interface Props {
  editor: Editor | null;
  onAskAi: () => void;
}

interface ToolButtonProps {
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}

function ToolButton({ active, disabled, onClick, title, children }: ToolButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={title}
      className={cn(
        'flex h-7 w-7 items-center justify-center rounded-[10px] transition-colors',
        active && !disabled && 'bg-[rgba(20,22,26,0.06)] text-[var(--ink)]',
        !active && !disabled && 'text-[var(--text-3)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]',
        disabled && 'cursor-not-allowed text-[var(--text-5)] opacity-50',
      )}
    >
      {children}
    </button>
  );
}

function Divider() {
  return <div className="mx-1 h-5 w-px bg-[var(--line-soft)]" />;
}

export default function EditorFormatBar({ editor, onAskAi }: Props) {
  const { fontSize, setFontSize, font, setFont } = useDocsSettingsStore();
  const { suggestingMode, setSuggestingMode } = useDocsUiStore();

  const [styleOpen, setStyleOpen] = useState(false);
  const [fontOpen, setFontOpen] = useState(false);
  const [modeOpen, setModeOpen] = useState(false);

  // Force re-render on selection change so active states update
  const [, force] = useState(0);
  useEffect(() => {
    if (!editor) return;
    const handler = () => force((n) => n + 1);
    editor.on('selectionUpdate', handler);
    editor.on('transaction', handler);
    return () => {
      editor.off('selectionUpdate', handler);
      editor.off('transaction', handler);
    };
  }, [editor]);

  if (!editor) {
    return <div className="flex h-9 items-center border-t border-[var(--line-soft)] px-3" />;
  }

  const currentStyle = editor.isActive('heading', { level: 1 })
    ? 'Heading 1'
    : editor.isActive('heading', { level: 2 })
      ? 'Heading 2'
      : editor.isActive('heading', { level: 3 })
        ? 'Heading 3'
        : 'Normal text';

  const fontLabel = font === 'sans' ? 'Sans' : font === 'serif' ? 'Serif' : 'Mono';

  return (
    <div className="flex h-9 items-center gap-0.5 border-t border-[var(--line-soft)] bg-white px-2">
      <ToolButton
        title="Undo"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo2 className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton
        title="Redo"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo2 className="h-3.5 w-3.5" />
      </ToolButton>

      <Divider />

      {/* Style dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setStyleOpen((o) => !o);
            setFontOpen(false);
            setModeOpen(false);
          }}
          className="flex h-7 items-center gap-1 rounded-[10px] px-2 text-xs text-[var(--text-2)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          title="Paragraph styles"
        >
          <span className="w-20 truncate text-left">{currentStyle}</span>
          <ChevronDown className="h-3 w-3" />
        </button>
        {styleOpen && (
          <div
            className="absolute left-0 top-full z-20 mt-1 w-44 rounded-[12px] border border-[var(--line-soft)] bg-white p-1 shadow-[0_8px_24px_rgba(20,22,26,0.1)]"
            onMouseLeave={() => setStyleOpen(false)}
          >
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().setParagraph().run();
                setStyleOpen(false);
              }}
              className="block w-full rounded-[8px] px-2 py-1 text-left text-sm text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
            >
              Normal text
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 1 }).run();
                setStyleOpen(false);
              }}
              className="block w-full rounded-[8px] px-2 py-1 text-left text-2xl font-semibold text-[var(--ink)] hover:bg-[rgba(20,22,26,0.05)]"
            >
              Heading 1
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 2 }).run();
                setStyleOpen(false);
              }}
              className="block w-full rounded-[8px] px-2 py-1 text-left text-xl font-semibold text-[var(--ink)] hover:bg-[rgba(20,22,26,0.05)]"
            >
              Heading 2
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().toggleHeading({ level: 3 }).run();
                setStyleOpen(false);
              }}
              className="block w-full rounded-[8px] px-2 py-1 text-left text-base font-semibold text-[var(--ink)] hover:bg-[rgba(20,22,26,0.05)]"
            >
              Heading 3
            </button>
          </div>
        )}
      </div>

      <Divider />

      {/* Font dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => {
            setFontOpen((o) => !o);
            setStyleOpen(false);
            setModeOpen(false);
          }}
          className="flex h-7 items-center gap-1 rounded-[10px] px-2 text-xs text-[var(--text-2)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          title="Font"
        >
          <span className="w-12 truncate text-left">{fontLabel}</span>
          <ChevronDown className="h-3 w-3" />
        </button>
        {fontOpen && (
          <div
            className="absolute left-0 top-full z-20 mt-1 w-32 rounded-[12px] border border-[var(--line-soft)] bg-white p-1 shadow-[0_8px_24px_rgba(20,22,26,0.1)]"
            onMouseLeave={() => setFontOpen(false)}
          >
            <button
              type="button"
              onClick={() => {
                setFont('sans');
                setFontOpen(false);
              }}
              className="block w-full rounded-[8px] px-2 py-1 text-left font-sans text-sm text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
            >
              Sans
            </button>
            <button
              type="button"
              onClick={() => {
                setFont('serif');
                setFontOpen(false);
              }}
              className="block w-full rounded-[8px] px-2 py-1 text-left font-serif text-sm text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
            >
              Serif
            </button>
            <button
              type="button"
              onClick={() => {
                setFont('mono');
                setFontOpen(false);
              }}
              className="block w-full rounded-[8px] px-2 py-1 text-left font-mono text-sm text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
            >
              Mono
            </button>
          </div>
        )}
      </div>

      <Divider />

      {/* Font size */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => setFontSize(Math.max(10, fontSize - 1))}
          className="flex h-6 w-6 items-center justify-center rounded-[8px] text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          title="Decrease size"
          aria-label="Decrease size"
        >
          −
        </button>
        <input
          type="number"
          value={fontSize}
          onChange={(e) =>
            setFontSize(Math.max(10, Math.min(36, Number(e.target.value) || 16)))
          }
          className="h-6 w-9 rounded-[8px] border border-[var(--line-soft)] bg-white text-center text-xs text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setFontSize(Math.min(36, fontSize + 1))}
          className="flex h-6 w-6 items-center justify-center rounded-[8px] text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          title="Increase size"
          aria-label="Increase size"
        >
          +
        </button>
      </div>

      <Divider />

      <ToolButton
        title="Bold (⌘B)"
        active={editor.isActive('bold')}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton
        title="Italic (⌘I)"
        active={editor.isActive('italic')}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton
        title="Underline (⌘U)"
        active={editor.isActive('underline')}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <Underline className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton
        title="Strikethrough"
        active={editor.isActive('strike')}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton
        title="Inline code"
        active={editor.isActive('code')}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton
        title="Highlight"
        active={editor.isActive('highlight')}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Highlighter className="h-3.5 w-3.5" />
      </ToolButton>

      <Divider />

      <ToolButton
        title="Link (⌘K)"
        active={editor.isActive('link')}
        onClick={() => {
          const url = window.prompt('URL?', (editor.getAttributes('link').href as string) ?? '');
          if (url === null) return;
          if (url === '') editor.chain().focus().unsetLink().run();
          else editor.chain().focus().setLink({ href: url }).run();
        }}
      >
        <LinkIcon className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton
        title="Image"
        onClick={() => {
          const url = window.prompt('Image URL?');
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }}
      >
        <ImageIcon className="h-3.5 w-3.5" />
      </ToolButton>

      <Divider />

      <ToolButton
        title="Bulleted list"
        active={editor.isActive('bulletList')}
        onClick={() => editor.chain().focus().toggleBulletList().run()}
      >
        <List className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton
        title="Numbered list"
        active={editor.isActive('orderedList')}
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
      >
        <ListOrdered className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton
        title="Task list"
        active={editor.isActive('taskList')}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
      >
        <ListChecks className="h-3.5 w-3.5" />
      </ToolButton>
      <ToolButton
        title="Blockquote"
        active={editor.isActive('blockquote')}
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
      >
        <Quote className="h-3.5 w-3.5" />
      </ToolButton>

      <Divider />

      <ToolButton
        title="Clear formatting"
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
      >
        <RemoveFormatting className="h-3.5 w-3.5" />
      </ToolButton>

      <Divider />

      <button
        type="button"
        onClick={onAskAi}
        className="flex h-7 items-center gap-1.5 rounded-full border border-[var(--line)] px-3 text-xs font-semibold text-[var(--text-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
        title="Ask AI (⌘J)"
      >
        <Sparkles className="h-3.5 w-3.5" /> Ask AI
      </button>

      <div className="ml-auto flex items-center">
        {/* Editing mode dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setModeOpen((o) => !o);
              setStyleOpen(false);
              setFontOpen(false);
            }}
            className="flex h-7 items-center gap-1 rounded-[10px] px-2 text-xs text-[var(--text-2)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
            title="View / Edit mode"
          >
            {suggestingMode ? (
              <>
                <Eye className="h-3.5 w-3.5" /> Suggesting
              </>
            ) : (
              <>
                <Edit3 className="h-3.5 w-3.5" /> Editing
              </>
            )}
            <ChevronDown className="h-3 w-3" />
          </button>
          {modeOpen && (
            <div
              className="absolute right-0 top-full z-20 mt-1 w-40 rounded-[12px] border border-[var(--line-soft)] bg-white p-1 shadow-[0_8px_24px_rgba(20,22,26,0.1)]"
              onMouseLeave={() => setModeOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setSuggestingMode(false);
                  setModeOpen(false);
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-[8px] px-2 py-1 text-left text-sm text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]',
                  !suggestingMode && 'bg-[rgba(20,22,26,0.06)] font-semibold text-[var(--ink)]',
                )}
              >
                <Edit3 className="h-3.5 w-3.5" /> Editing
              </button>
              <button
                type="button"
                onClick={() => {
                  setSuggestingMode(true);
                  setModeOpen(false);
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-[8px] px-2 py-1 text-left text-sm text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]',
                  suggestingMode && 'bg-[rgba(20,22,26,0.06)] font-semibold text-[var(--ink)]',
                )}
              >
                <Eye className="h-3.5 w-3.5" /> Suggesting
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
