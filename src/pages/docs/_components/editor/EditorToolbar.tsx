import { useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import {
  Menu as MenuIcon,
  FileText,
  Star,
  History,
  Share2,
  Sparkles,
  MessageCircle,
  Cloud,
  CloudOff,
  Loader2,
} from 'lucide-react';
import type { Editor } from '@tiptap/react';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { useDocsStore } from '@/pages/docs/_hooks/use-docs-store';
import { useDocsUiStore } from '@/pages/docs/_hooks/use-docs-ui-store';
import type { Doc } from '@/pages/docs/_lib/types';
import {
  downloadBlob,
  toMarkdown,
  toHtml,
  toPlainText,
} from '@/pages/docs/_lib/export';
import EditorFormatBar from './EditorFormatBar';
import { cn } from '@/lib/utils';

interface Props {
  doc: Doc;
  editor: Editor | null;
  saveStatus: 'saved' | 'saving' | 'error';
  onAskAi: () => void;
  onPatchTitle: (title: string) => void;
}

function SaveStatusIndicator({ status }: { status: 'saved' | 'saving' | 'error' }) {
  if (status === 'saving') {
    return (
      <span className="flex items-center gap-1 text-xs text-[var(--text-4)]" title="Saving">
        <Loader2 className="h-3 w-3 animate-spin" />
        Saving…
      </span>
    );
  }
  if (status === 'error') {
    return (
      <span className="flex items-center gap-1 text-xs text-[var(--bad-fg)]" title="Save failed">
        <CloudOff className="h-3 w-3" />
        Save failed
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs text-[var(--text-4)]" title="Saved">
      <Cloud className="h-3 w-3" />
      Saved
    </span>
  );
}

export default function EditorToolbar({
  doc,
  editor,
  saveStatus,
  onAskAi,
  onPatchTitle,
}: Props) {
  const star = useDocsStore((s) => s.starDoc);
  const trash = useDocsStore((s) => s.trashDoc);
  const dup = useDocsStore((s) => s.duplicateDoc);
  const {
    setShareOpen,
    setAiSidebarOpen,
    aiSidebarOpen,
    setShortcutsOpen,
    suggestingMode,
    setSuggestingMode,
  } = useDocsUiStore();
  const navigate = useNavigate();
  const [title, setTitle] = useState(doc.title);
  const titleRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTitle(doc.title);
  }, [doc.id, doc.title]);

  const onExport = (kind: 'md' | 'html' | 'txt' | 'docx' | 'pdf') => {
    const safeName = doc.title.replace(/[^a-z0-9-_]+/gi, '-').toLowerCase() || 'document';
    if (kind === 'md') downloadBlob(`${safeName}.md`, 'text/markdown', toMarkdown(doc.content));
    else if (kind === 'html') downloadBlob(`${safeName}.html`, 'text/html', toHtml(doc.content, doc.title));
    else if (kind === 'txt') downloadBlob(`${safeName}.txt`, 'text/plain', toPlainText(doc.content));
    else alert(`${kind.toUpperCase()} export — coming soon.`);
  };

  const openComments = doc.comments.filter((t) => !t.resolved).length;

  return (
    <div className="border-b border-[var(--line-soft)] bg-white">
      {/* Row 1 — title + actions */}
      <div className="flex items-center gap-2 px-4 pt-2.5 pb-1.5">
        <Link
          to="/docs"
          className="rounded-[10px] p-1.5 text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          aria-label="Back to docs"
        >
          <MenuIcon className="h-5 w-5" />
        </Link>
        <FileText className="h-5 w-5 shrink-0 text-[var(--text-4)]" />
        <div className="flex min-w-0 items-center gap-1">
          <input
            ref={titleRef}
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              onPatchTitle(e.target.value);
            }}
            placeholder="Untitled document"
            className="min-w-0 max-w-md rounded-[10px] border border-transparent bg-transparent px-1.5 py-1 text-base font-semibold text-[var(--ink)] placeholder:text-[var(--text-5)] hover:border-[var(--line-soft)] focus:border-[var(--ink)] focus:bg-white focus:outline-none"
            style={{ width: `${Math.max(8, title.length + 1)}ch` }}
          />
          <button
            type="button"
            onClick={() => star(doc.id, !doc.starred)}
            className="rounded-[10px] p-1 text-[var(--text-4)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
            aria-label={doc.starred ? 'Unstar' : 'Star'}
          >
            <Star
              className={cn(
                'h-4 w-4',
                doc.starred && 'fill-[var(--ink)] text-[var(--ink)]',
              )}
            />
          </button>
          <SaveStatusIndicator status={saveStatus} />
        </div>

        <div className="ml-auto flex items-center gap-1">
          <Link
            to={`/docs/${doc.id}/history`}
            className="flex items-center gap-1 rounded-[10px] p-1.5 text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
            title="Version history"
          >
            <History className="h-4 w-4" />
          </Link>
          <button
            type="button"
            className="relative flex items-center gap-1 rounded-[10px] p-1.5 text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
            title="Comments"
            onClick={() =>
              alert('Highlight text and click "Comment" in the bubble menu to start a thread.')
            }
          >
            <MessageCircle className="h-4 w-4" />
            {openComments > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-[var(--ink)] px-1 text-[9px] font-semibold text-white">
                {openComments}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setAiSidebarOpen(!aiSidebarOpen)}
            className={cn(
              'flex h-8 items-center gap-1.5 rounded-full px-3 text-[12.5px] font-semibold transition-colors',
              aiSidebarOpen
                ? 'bg-[var(--ink)] text-white'
                : 'border border-[var(--line)] text-[var(--text-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]',
            )}
          >
            <Sparkles className="h-3.5 w-3.5" /> AI
          </button>
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="plat-btn h-8 px-4 text-[12.5px]"
          >
            <Share2 className="h-3.5 w-3.5" /> Share
          </button>
        </div>
      </div>

      {/* Row 2 — menu bar */}
      <div className="px-2 pb-1">
        <Menubar className="h-auto rounded-none border-0 bg-transparent p-0 shadow-none">
          <MenubarMenu>
            <MenubarTrigger className="rounded-[8px] px-2.5 py-1 text-sm font-medium text-[var(--text-2)]">
              File
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={() => navigate('/docs')}>Back to docs</MenubarItem>
              <MenubarItem onSelect={() => dup(doc.id)}>Make a copy</MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>Download</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem onSelect={() => onExport('md')}>Markdown (.md)</MenubarItem>
                  <MenubarItem onSelect={() => onExport('html')}>HTML (.html)</MenubarItem>
                  <MenubarItem onSelect={() => onExport('txt')}>Plain text (.txt)</MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onSelect={() => onExport('docx')} disabled>
                    Word (.docx) — soon
                  </MenubarItem>
                  <MenubarItem onSelect={() => onExport('pdf')} disabled>
                    PDF — soon
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarItem onSelect={() => setShareOpen(true)}>Share…</MenubarItem>
              <MenubarSeparator />
              <MenubarItem onSelect={() => navigate(`/docs/${doc.id}/history`)}>
                Version history
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                className="text-[var(--bad-fg)] focus:text-[var(--bad-fg)]"
                onSelect={() => {
                  if (confirm('Move this doc to trash?')) {
                    trash(doc.id);
                    navigate('/docs');
                  }
                }}
              >
                Move to trash
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="rounded-[8px] px-2.5 py-1 text-sm font-medium text-[var(--text-2)]">
              Edit
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={() => editor?.chain().focus().undo().run()}>
                Undo
                <MenubarShortcut>⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onSelect={() => editor?.chain().focus().redo().run()}>
                Redo
                <MenubarShortcut>⇧⌘Z</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onSelect={() => document.execCommand('cut')}>
                Cut
                <MenubarShortcut>⌘X</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onSelect={() => document.execCommand('copy')}>
                Copy
                <MenubarShortcut>⌘C</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onSelect={() => document.execCommand('paste')}>
                Paste
                <MenubarShortcut>⌘V</MenubarShortcut>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onSelect={() => editor?.chain().focus().selectAll().run()}>
                Select all
                <MenubarShortcut>⌘A</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="rounded-[8px] px-2.5 py-1 text-sm font-medium text-[var(--text-2)]">
              View
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={() => setSuggestingMode(false)}>
                Editing
                {!suggestingMode && <MenubarShortcut>✓</MenubarShortcut>}
              </MenubarItem>
              <MenubarItem onSelect={() => setSuggestingMode(true)}>
                Suggesting
                {suggestingMode && <MenubarShortcut>✓</MenubarShortcut>}
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onSelect={() => setAiSidebarOpen(!aiSidebarOpen)}>
                {aiSidebarOpen ? 'Hide' : 'Show'} AI sidebar
                <MenubarShortcut>⇧⌘I</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="rounded-[8px] px-2.5 py-1 text-sm font-medium text-[var(--text-2)]">
              Insert
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem
                onSelect={() => {
                  const url = window.prompt('Image URL?');
                  if (url) editor?.chain().focus().setImage({ src: url }).run();
                }}
              >
                Image
              </MenubarItem>
              <MenubarItem
                onSelect={() => {
                  const url = window.prompt('Link URL?');
                  if (url) editor?.chain().focus().setLink({ href: url }).run();
                }}
              >
                Link
                <MenubarShortcut>⌘K</MenubarShortcut>
              </MenubarItem>
              <MenubarItem
                onSelect={() =>
                  editor
                    ?.chain()
                    .focus()
                    .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                    .run()
                }
              >
                Table
              </MenubarItem>
              <MenubarItem onSelect={() => editor?.chain().focus().setHorizontalRule().run()}>
                Divider
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                onSelect={() => editor?.chain().focus().insertContent({ type: 'aiSummary' }).run()}
              >
                AI summary block
              </MenubarItem>
              <MenubarItem
                onSelect={() => editor?.chain().focus().insertContent({ type: 'aiOutline' }).run()}
              >
                AI outline block
              </MenubarItem>
              <MenubarItem
                onSelect={() =>
                  editor
                    ?.chain()
                    .focus()
                    .insertContent({ type: 'aiPrompt', attrs: { prompt: '', output: '' } })
                    .run()
                }
              >
                AI prompt block
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="rounded-[8px] px-2.5 py-1 text-sm font-medium text-[var(--text-2)]">
              Format
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={() => editor?.chain().focus().toggleBold().run()}>
                Bold
                <MenubarShortcut>⌘B</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onSelect={() => editor?.chain().focus().toggleItalic().run()}>
                Italic
                <MenubarShortcut>⌘I</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onSelect={() => editor?.chain().focus().toggleUnderline().run()}>
                Underline
                <MenubarShortcut>⌘U</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onSelect={() => editor?.chain().focus().toggleStrike().run()}>
                Strikethrough
              </MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>Paragraph styles</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem onSelect={() => editor?.chain().focus().setParagraph().run()}>
                    Normal text
                  </MenubarItem>
                  <MenubarItem
                    onSelect={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                  >
                    Heading 1
                    <MenubarShortcut>⇧⌘1</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem
                    onSelect={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                  >
                    Heading 2
                    <MenubarShortcut>⇧⌘2</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem
                    onSelect={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                  >
                    Heading 3
                    <MenubarShortcut>⇧⌘3</MenubarShortcut>
                  </MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarItem onSelect={() => editor?.chain().focus().toggleBlockquote().run()}>
                Blockquote
              </MenubarItem>
              <MenubarItem onSelect={() => editor?.chain().focus().toggleCodeBlock().run()}>
                Code block
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem
                onSelect={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}
              >
                Clear formatting
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="rounded-[8px] px-2.5 py-1 text-sm font-medium text-[var(--text-2)]">
              Tools
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={onAskAi}>
                Ask AI
                <MenubarShortcut>⌘J</MenubarShortcut>
              </MenubarItem>
              <MenubarItem onSelect={() => setAiSidebarOpen(!aiSidebarOpen)}>
                {aiSidebarOpen ? 'Hide' : 'Show'} AI sidebar
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onSelect={() => setShortcutsOpen(true)}>
                Keyboard shortcuts
                <MenubarShortcut>⌘/</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>

          <MenubarMenu>
            <MenubarTrigger className="rounded-[8px] px-2.5 py-1 text-sm font-medium text-[var(--text-2)]">
              Help
            </MenubarTrigger>
            <MenubarContent>
              <MenubarItem onSelect={() => setShortcutsOpen(true)}>
                Keyboard shortcuts
              </MenubarItem>
              <MenubarItem
                onSelect={() => alert('AI Docs · mocked frontend demo for the 3days.ai platform.')}
              >
                About AI Docs
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>

      {/* Row 3 — format toolbar */}
      <EditorFormatBar editor={editor} onAskAi={onAskAi} />
    </div>
  );
}
