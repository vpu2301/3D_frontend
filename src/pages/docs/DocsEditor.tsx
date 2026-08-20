import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import { Table } from '@tiptap/extension-table';
import { TableRow } from '@tiptap/extension-table-row';
import { TableCell } from '@tiptap/extension-table-cell';
import { TableHeader } from '@tiptap/extension-table-header';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import CharacterCount from '@tiptap/extension-character-count';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import { common, createLowlight } from 'lowlight';

import DocsLayout from '@/pages/docs/_components/shared/DocsLayout';
import EditorToolbar from '@/pages/docs/_components/editor/EditorToolbar';
import DocHeader from '@/pages/docs/_components/editor/DocHeader';
import StatusBar from '@/pages/docs/_components/editor/StatusBar';
import EditorBubbleMenu from '@/pages/docs/_components/editor/EditorBubbleMenu';
import EditorFloatingMenu from '@/pages/docs/_components/editor/EditorFloatingMenu';
import SlashMenu from '@/pages/docs/_components/editor/SlashMenu';
import ShareModal from '@/pages/docs/_components/editor/ShareModal';
import ShortcutsModal from '@/pages/docs/_components/editor/ShortcutsModal';
import CommentsPanel from '@/pages/docs/_components/editor/CommentsPanel';
import InlineAiPrompt from '@/pages/docs/_components/ai/InlineAiPrompt';
import AiSidebar from '@/pages/docs/_components/ai/AiSidebar';
import AiSuggestionChips from '@/pages/docs/_components/editor/AiSuggestionChips';

import { useDocsStore } from '@/pages/docs/_hooks/use-docs-store';
import { useDocsUiStore } from '@/pages/docs/_hooks/use-docs-ui-store';
import { useDocsSettingsStore } from '@/pages/docs/_hooks/use-docs-settings-store';
import { configureMockAi, ghostComplete } from '@/pages/docs/_lib/mockAi';
import { GhostText, setGhostText, getGhostText } from '@/pages/docs/_lib/extensions/ghostText';
import { AiSummaryNode } from '@/pages/docs/_lib/extensions/aiSummary';
import { AiOutlineNode } from '@/pages/docs/_lib/extensions/aiOutline';
import { AiPromptNode } from '@/pages/docs/_lib/extensions/aiPrompt';
import type { Doc, PresetAction } from '@/pages/docs/_lib/types';
import { newId } from '@/pages/docs/_lib/storage';
import { cn } from '@/lib/utils';

const lowlight = createLowlight(common);

interface SlashState {
  triggerFrom: number;
  query: string;
  position: { x: number; y: number };
}

interface AiPromptState {
  position: { x: number; y: number };
  selectionRange: { from: number; to: number } | null;
  preset?: PresetAction;
}

const DEBOUNCE_MS = 500;
const SNAPSHOT_INTERVAL_MS = 2 * 60 * 1000;
const GHOST_DELAY_MS = 700;

export default function DocsEditor() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const load = useDocsStore((s) => s.load);
  const loaded = useDocsStore((s) => s.loaded);
  const docsMap = useDocsStore((s) => s.docs);
  const saveContent = useDocsStore((s) => s.saveContent);
  const updateDoc = useDocsStore((s) => s.updateDoc);
  const takeSnapshot = useDocsStore((s) => s.takeSnapshot);
  const addComment = useDocsStore((s) => s.addComment);

  const settings = useDocsSettingsStore();
  const {
    aiSidebarOpen,
    setAiSidebarOpen,
    setShortcutsOpen,
    suggestingMode,
  } = useDocsUiStore();

  const [slashState, setSlashState] = useState<SlashState | null>(null);
  const [aiPromptState, setAiPromptState] = useState<AiPromptState | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  const saveTimer = useRef<number | null>(null);
  const snapshotTimer = useRef<number | null>(null);
  const ghostTimer = useRef<number | null>(null);

  const doc: Doc | undefined = id ? docsMap[id] : undefined;

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    configureMockAi({ failureRate: settings.mockFailureRate });
  }, [settings.mockFailureRate]);

  useEffect(() => {
    if (settings.aiSidebarDefaultOpen && !aiSidebarOpen) setAiSidebarOpen(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const editor = useEditor(
    {
      extensions: [
        StarterKit.configure({
          codeBlock: false,
          heading: { levels: [1, 2, 3] },
        }),
        Placeholder.configure({
          placeholder: ({ node }) => {
            if (node.type.name === 'heading') return `Heading ${node.attrs.level}`;
            return "Press '/' for commands, or just start writing…";
          },
        }),
        Underline,
        Highlight,
        Typography,
        Link.configure({ openOnClick: false, autolink: true }),
        Image.configure({ inline: false, allowBase64: true }),
        TaskList,
        TaskItem.configure({ nested: true }),
        Table.configure({ resizable: false }),
        TableRow,
        TableCell,
        TableHeader,
        CodeBlockLowlight.configure({ lowlight }),
        CharacterCount,
        GhostText,
        AiSummaryNode,
        AiOutlineNode,
        AiPromptNode,
      ],
      content: doc?.content ?? { type: 'doc', content: [{ type: 'paragraph' }] },
      editable: !suggestingMode,
      editorProps: {
        attributes: {
          class:
            'prose prose-zinc max-w-none focus:outline-none dark:prose-invert prose-headings:font-semibold prose-p:my-2 min-h-[60vh] px-12 pb-32',
        },
        handleDOMEvents: {
          drop: (_view, event) => {
            const file = event.dataTransfer?.files?.[0];
            if (file && file.type.startsWith('image/')) {
              event.preventDefault();
              const reader = new FileReader();
              reader.onload = () => {
                editor?.chain().focus().setImage({ src: String(reader.result) }).run();
              };
              reader.readAsDataURL(file);
              return true;
            }
            return false;
          },
          paste: (_view, event) => {
            const file = event.clipboardData?.files?.[0];
            if (file && file.type.startsWith('image/')) {
              event.preventDefault();
              const reader = new FileReader();
              reader.onload = () => {
                editor?.chain().focus().setImage({ src: String(reader.result) }).run();
              };
              reader.readAsDataURL(file);
              return true;
            }
            return false;
          },
          keydown: (view, event) => {
            // Tab accepts ghost text
            if (event.key === 'Tab') {
              const ghost = getGhostText(editor);
              if (ghost) {
                event.preventDefault();
                editor?.chain().focus().insertContent(ghost.text).run();
                setGhostText(editor, null);
                return true;
              }
            }
            if (event.key === 'Escape') {
              if (getGhostText(editor)) {
                setGhostText(editor, null);
                return true;
              }
            }
            return false;
          },
        },
      },
      onUpdate: ({ editor: ed }) => {
        if (!doc) return;
        scheduleSave(ed.getJSON());
        scheduleGhost();
      },
    },
    [doc?.id],
  );

  // Track edit mode toggle
  useEffect(() => {
    editor?.setEditable(!suggestingMode);
  }, [editor, suggestingMode]);

  // ----- Save & snapshot ----------------------------------------------------
  const scheduleSave = useCallback(
    (json: any) => {
      if (!doc) return;
      setSaveStatus('saving');
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(async () => {
        try {
          await saveContent(doc.id, json);
          setSaveStatus('saved');
        } catch {
          setSaveStatus('error');
        }
      }, DEBOUNCE_MS);
    },
    [doc, saveContent],
  );

  useEffect(() => {
    if (!doc?.id) return;
    if (snapshotTimer.current) window.clearInterval(snapshotTimer.current);
    snapshotTimer.current = window.setInterval(() => {
      takeSnapshot(doc.id);
    }, SNAPSHOT_INTERVAL_MS);
    return () => {
      if (snapshotTimer.current) window.clearInterval(snapshotTimer.current);
    };
  }, [doc?.id, takeSnapshot]);

  // ----- Ghost text ---------------------------------------------------------
  const scheduleGhost = useCallback(() => {
    if (!editor || !settings.ghostTextEnabled) return;
    if (ghostTimer.current) window.clearTimeout(ghostTimer.current);
    ghostTimer.current = window.setTimeout(async () => {
      const { selection, doc: pdoc } = editor.state;
      if (!selection.empty) return;
      const $from = selection.$from;
      // only at end of a paragraph
      if ($from.parentOffset !== $from.parent.content.size) return;
      if ($from.parent.type.name !== 'paragraph') return;
      const before = pdoc.textBetween(Math.max(0, selection.from - 200), selection.from, '\n', ' ');
      const result = await ghostComplete(before);
      if (result && editor.state.selection.empty) {
        setGhostText(editor, result);
      }
    }, GHOST_DELAY_MS);
  }, [editor, settings.ghostTextEnabled]);

  // ----- Slash menu ---------------------------------------------------------
  useEffect(() => {
    if (!editor) return;
    const view = editor.view;

    const handler = (e: KeyboardEvent) => {
      if (slashState) {
        if (e.key === 'Backspace') {
          // if we backspaced past the trigger, close
          setTimeout(() => {
            if (!editor) return;
            const pos = editor.state.selection.from;
            if (pos < slashState.triggerFrom) {
              setSlashState(null);
            } else {
              const text = editor.state.doc.textBetween(slashState.triggerFrom, pos, '\n', ' ');
              if (!text.startsWith('/')) setSlashState(null);
              else setSlashState((s) => (s ? { ...s, query: text.slice(1) } : s));
            }
          }, 0);
        }
        return;
      }

      if (e.key === '/') {
        // open slash menu after the slash is inserted
        setTimeout(() => {
          if (!editor) return;
          const sel = editor.state.selection;
          if (!sel.empty) return;
          const $from = sel.$from;
          const before = $from.parent.textBetween(0, $from.parentOffset, '\n', ' ');
          // require at start or after whitespace
          if (before !== '/' && !/\s\/$/.test(before) && !before.endsWith('\n/')) return;
          const triggerFrom = sel.from - 1;
          const coords = view.coordsAtPos(sel.from);
          setSlashState({
            triggerFrom,
            query: '',
            position: { x: coords.left, y: coords.bottom + 4 },
          });
        }, 0);
      }
    };

    const inputHandler = () => {
      if (!editor || !slashState) return;
      const pos = editor.state.selection.from;
      if (pos < slashState.triggerFrom) {
        setSlashState(null);
        return;
      }
      const text = editor.state.doc.textBetween(slashState.triggerFrom, pos, '\n', ' ');
      if (!text.startsWith('/')) {
        setSlashState(null);
        return;
      }
      setSlashState((s) => (s ? { ...s, query: text.slice(1) } : s));
    };

    const dom = view.dom as HTMLElement;
    dom.addEventListener('keydown', handler);
    dom.addEventListener('input', inputHandler);
    return () => {
      dom.removeEventListener('keydown', handler);
      dom.removeEventListener('input', inputHandler);
    };
  }, [editor, slashState]);

  // ----- Cmd+J for AI prompt + Cmd+/ for shortcuts -------------------------
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key === 'j') {
        if (!editor) return;
        e.preventDefault();
        const sel = editor.state.selection;
        const coords = editor.view.coordsAtPos(sel.from);
        setAiPromptState({
          position: { x: coords.left, y: coords.bottom + 4 },
          selectionRange: sel.empty ? null : { from: sel.from, to: sel.to },
        });
      } else if (meta && e.key === '/') {
        e.preventDefault();
        setShortcutsOpen(true);
      } else if (meta && e.key.toLowerCase() === 'i' && e.shiftKey) {
        e.preventDefault();
        setAiSidebarOpen(!aiSidebarOpen);
      } else if (meta && e.key === 's') {
        e.preventDefault();
        if (doc) takeSnapshot(doc.id);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [editor, doc, aiSidebarOpen, setAiSidebarOpen, setShortcutsOpen, takeSnapshot]);

  // ----- Bubble menu actions -----------------------------------------------
  const onBubbleAskAi = () => {
    if (!editor) return;
    const sel = editor.state.selection;
    const coords = editor.view.coordsAtPos(sel.to);
    setAiPromptState({
      position: { x: coords.left, y: coords.bottom + 4 },
      selectionRange: { from: sel.from, to: sel.to },
    });
  };

  const onBubblePreset = (preset: PresetAction) => {
    if (!editor) return;
    const sel = editor.state.selection;
    if (sel.empty) return;
    const coords = editor.view.coordsAtPos(sel.to);
    setAiPromptState({
      position: { x: coords.left, y: coords.bottom + 4 },
      selectionRange: { from: sel.from, to: sel.to },
      preset,
    });
  };

  const onBubbleComment = () => {
    if (!editor || !doc) return;
    const sel = editor.state.selection;
    if (sel.empty) return;
    const body = window.prompt('Comment text?');
    if (!body) return;
    const threadId = newId('thread');
    addComment(doc.id, threadId, `${sel.from}-${sel.to}`, body);
  };

  // ----- Save title/icon/cover ---------------------------------------------
  const onPatchDoc = useCallback(
    (patch: Partial<Doc>) => {
      if (!doc) return;
      updateDoc(doc.id, patch);
    },
    [doc, updateDoc],
  );

  // ----- Rendering ----------------------------------------------------------
  const containerWidth = useMemo(() => {
    switch (settings.pageWidth) {
      case 'narrow':
        return 'max-w-2xl';
      case 'wide':
        return 'max-w-3xl';
      case 'full':
        return 'max-w-5xl';
    }
  }, [settings.pageWidth]);

  const fontFamily = useMemo(() => {
    switch (settings.font) {
      case 'sans':
        return 'font-sans';
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
    }
  }, [settings.font]);

  if (!loaded) {
    return (
      <DocsLayout>
        <div className="flex h-full items-center justify-center text-sm text-[var(--text-3)]">Loading…</div>
      </DocsLayout>
    );
  }

  if (!doc) {
    return (
      <DocsLayout>
        <div className="flex h-full flex-col items-center justify-center gap-3 text-center">
          <div className="text-lg font-semibold text-[var(--ink)]">Document not found</div>
          <button
            type="button"
            onClick={() => navigate('/docs')}
            className="plat-btn-ghost"
          >
            Back to dashboard
          </button>
        </div>
      </DocsLayout>
    );
  }

  // Detect "empty" doc to show AI suggestion chips
  const isDocEmpty = (() => {
    const content = doc.content?.content ?? [];
    if (content.length === 0) return true;
    if (content.length === 1) {
      const only = content[0];
      if (only.type === 'paragraph' && (!only.content || only.content.length === 0)) return true;
    }
    return false;
  })();

  return (
    <DocsLayout>
      <div className="flex h-full flex-1 flex-col">
        <EditorToolbar
          doc={doc}
          editor={editor}
          saveStatus={saveStatus}
          onAskAi={onBubbleAskAi}
          onPatchTitle={(t) => onPatchDoc({ title: t })}
        />
        <div className="flex flex-1 overflow-hidden">
          <div className="flex flex-1 flex-col overflow-y-auto bg-white">
            <DocHeader doc={doc} onPatch={onPatchDoc} />
            {isDocEmpty && editor && (
              <div className={cn('mx-auto w-full', containerWidth)}>
                <AiSuggestionChips editor={editor} onAskAi={onBubbleAskAi} />
              </div>
            )}
            <div className={cn('mx-auto w-full', containerWidth)}>
              <div
                className={cn(fontFamily)}
                style={{ fontSize: settings.fontSize, lineHeight: settings.lineSpacing }}
              >
                {editor && (
                  <>
                    <EditorBubbleMenu
                      editor={editor}
                      onAskAi={onBubbleAskAi}
                      onPreset={onBubblePreset}
                      onComment={onBubbleComment}
                    />
                    <EditorFloatingMenu editor={editor} />
                  </>
                )}
                <EditorContent editor={editor} />
              </div>
            </div>
            <StatusBar editor={editor} />
          </div>
          <CommentsPanel doc={doc} />
          {aiSidebarOpen && editor && (
            <AiSidebar editor={editor} docId={doc.id} onClose={() => setAiSidebarOpen(false)} />
          )}
        </div>
      </div>

      {slashState && editor && (
        <SlashMenu
          editor={editor}
          query={slashState.query}
          position={slashState.position}
          triggerFrom={slashState.triggerFrom}
          onClose={() => setSlashState(null)}
        />
      )}

      {aiPromptState && editor && (
        <InlineAiPrompt
          editor={editor}
          position={aiPromptState.position}
          selectionRange={aiPromptState.selectionRange}
          preset={aiPromptState.preset}
          onClose={() => setAiPromptState(null)}
        />
      )}

      <ShareModal docTitle={doc.title} />
      <ShortcutsModal />
    </DocsLayout>
  );
}
