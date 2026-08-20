/**
 * Inline AI — entry point one of two (FE-5 §3).
 *
 * Three actions on a selection, no submenu, and nothing else in the editor gets
 * an AI button. That is the specification, and `aiGates.test.ts` enforces it,
 * because the failure mode here is not a bug: it is a ✨ on every surface,
 * added one reasonable-sounding button at a time, until the product is a
 * chatbot wearing a note-taking app.
 *
 * The preset menu that used to live here (improve / shorten / summarize) is
 * gone with it. It was the last caller of the Docs mock left in /notes — five
 * actions that rewrote the user's own sentences with output from a mock, which
 * is both the anti-pattern this sprint refuses and a promise no backend made.
 */

import { BubbleMenu } from '@tiptap/react/menus';
import type { Editor } from '@tiptap/react';
import { useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Code,
  Link as LinkIcon,
  Unlink,
  ListChecks,
  Lightbulb,
  Loader2,
  MessageCircleQuestion,
} from 'lucide-react';
import { toast } from 'sonner';
import { extractTasks, extractDecisions, BudgetExceededError } from '@/pages/notes/_lib/aiClient';
import { useNotesUiStore } from '@/pages/notes/_hooks/use-notes-ui-store';

interface Props {
  editor: Editor;
  /**
   * Raises the link dialog. The bubble menu cannot own it: it hides as soon as
   * the selection loses focus, which is what opening a dialog does.
   */
  onEditLink: () => void;
}

type Busy = 'tasks' | 'decisions' | null;

function reportAiFailure(error: unknown) {
  if (error instanceof BudgetExceededError) {
    const at = error.resetAt
      ? new Date(error.resetAt).toLocaleTimeString(undefined, {
          hour: '2-digit',
          minute: '2-digit',
        })
      : null;
    toast.error('Daily AI budget reached', {
      description: at ? `Resets at ${at}.` : undefined,
    });
    return;
  }
  toast.error('The AI request failed', {
    description: error instanceof Error ? error.message : undefined,
  });
}

export default function NoteBubbleMenu({ editor, onEditLink }: Props) {
  const [busy, setBusy] = useState<Busy>(null);
  const askAboutSelection = useNotesUiStore((s) => s.askAboutSelection);

  /**
   * Runs an extractor over the selection and inserts the result *after* it.
   *
   * Two properties matter and both are load-bearing:
   *
   *  - **The selection is never replaced.** The user wrote those words. An
   *    extraction adds structure next to them; it does not overwrite the
   *    source it was derived from.
   *  - **One transaction.** `insertContentAt` inside a single chain is one
   *    ProseMirror step, so one `Cmd+Z` restores the document exactly as it
   *    was. Insert-then-adjust in two chains would need two undos, and the
   *    second one is the one nobody presses.
   *
   * The positions are captured before the await: the document can move under
   * an in-flight request (autosave, a collaborator, the user typing), and
   * inserting at a stale offset drops a task list into the middle of a word.
   */
  const runExtraction = async (
    kind: Exclude<Busy, null>,
    extract: (text: string) => Promise<Array<{ text: string; done?: boolean }>>,
    build: (items: Array<{ text: string; done?: boolean }>) => Record<string, unknown>,
    emptyMessage: string,
  ) => {
    const { from, to } = editor.state.selection;
    if (from === to || busy) return;
    const text = editor.state.doc.textBetween(from, to, '\n', ' ');

    setBusy(kind);
    try {
      const items = await extract(text);
      if (items.length === 0) {
        toast(emptyMessage);
        return;
      }
      // Re-resolve against the current document. `to` was valid when the user
      // clicked; `insertContentAt` past the end of a shortened doc throws.
      const at = Math.min(to, editor.state.doc.content.size);
      editor.chain().focus().insertContentAt(at, build(items)).run();
    } catch (error) {
      reportAiFailure(error);
    } finally {
      setBusy(null);
    }
  };

  const onExtractTasks = () =>
    runExtraction(
      'tasks',
      (text) => extractTasks(text),
      (tasks) => ({
        type: 'taskList',
        content: tasks.map((t) => ({
          type: 'taskItem',
          attrs: { checked: !!t.done },
          content: [{ type: 'paragraph', content: [{ type: 'text', text: t.text }] }],
        })),
      }),
      'No tasks found in the selection',
    );

  const onExtractDecisions = () =>
    runExtraction(
      'decisions',
      (text) => extractDecisions(text),
      (decisions) => ({
        type: 'blockquote',
        content: [
          { type: 'paragraph', content: [{ type: 'text', text: 'Decisions:' }] },
          {
            type: 'bulletList',
            content: decisions.map((d) => ({
              type: 'listItem',
              content: [{ type: 'paragraph', content: [{ type: 'text', text: d.text }] }],
            })),
          },
        ],
      }),
      'No decisions found in the selection',
    );

  const onAsk = () => {
    const { from, to } = editor.state.selection;
    if (from === to) return;
    askAboutSelection(editor.state.doc.textBetween(from, to, '\n', ' '));
  };

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: 'top' }}
      shouldShow={({ from, to, state }) => {
        // While a request is in flight the menu stays up even if the selection
        // collapses: it is showing progress, and yanking it away mid-request
        // reads as "it failed" when the answer is two seconds out.
        if (busy) return true;
        if (from === to) return false;
        if (state.doc.resolve(from).parent.type.name === 'codeBlock') return false;
        return true;
      }}
    >
      <div className="flex items-center gap-0.5 rounded-[12px] border border-[var(--line)] bg-white p-1 shadow-lg">
        <AiAction
          icon={busy === 'tasks' ? Loader2 : ListChecks}
          label="Extract tasks"
          spinning={busy === 'tasks'}
          disabled={busy !== null}
          onClick={onExtractTasks}
        />
        <AiAction
          icon={busy === 'decisions' ? Loader2 : Lightbulb}
          label="Extract decisions"
          spinning={busy === 'decisions'}
          disabled={busy !== null}
          onClick={onExtractDecisions}
        />
        <AiAction
          icon={MessageCircleQuestion}
          label="Ask…"
          disabled={busy !== null}
          onClick={onAsk}
        />

        <div className="mx-0.5 h-5 w-px bg-[rgba(20,22,26,0.1)]" />

        <button
          data-command-exempt="editor formatting applied to the current selection; typed, not commanded — see the slash menu and the ? sheet"
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`rounded-[8px] p-1 transition-colors ${editor.isActive('bold') ? 'bg-[rgba(20,22,26,0.06)] text-[var(--ink)]' : 'text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)]'}`}
          aria-label="Bold"
        >
          <Bold className="h-3.5 w-3.5" />
        </button>
        <button
          data-command-exempt="editor formatting applied to the current selection; typed, not commanded — see the slash menu and the ? sheet"
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`rounded-[8px] p-1 transition-colors ${editor.isActive('italic') ? 'bg-[rgba(20,22,26,0.06)] text-[var(--ink)]' : 'text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)]'}`}
          aria-label="Italic"
        >
          <Italic className="h-3.5 w-3.5" />
        </button>
        <button
          data-command-exempt="editor formatting applied to the current selection; typed, not commanded — see the slash menu and the ? sheet"
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`rounded-[8px] p-1 transition-colors ${editor.isActive('underline') ? 'bg-[rgba(20,22,26,0.06)] text-[var(--ink)]' : 'text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)]'}`}
          aria-label="Underline"
        >
          <Underline className="h-3.5 w-3.5" />
        </button>
        <button
          data-command-exempt="editor formatting applied to the current selection; typed, not commanded — see the slash menu and the ? sheet"
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className={`rounded-[8px] p-1 transition-colors ${editor.isActive('code') ? 'bg-[rgba(20,22,26,0.06)] text-[var(--ink)]' : 'text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)]'}`}
          aria-label="Inline code"
        >
          <Code className="h-3.5 w-3.5" />
        </button>
        <button
          data-command-exempt="editor formatting applied to the current selection; typed, not commanded — see the slash menu and the ? sheet"
          type="button"
          onClick={onEditLink}
          className={`rounded-[8px] p-1 transition-colors ${editor.isActive('link') ? 'bg-[rgba(20,22,26,0.06)] text-[var(--ink)]' : 'text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)]'}`}
          aria-label={editor.isActive('link') ? 'Edit link' : 'Add link'}
        >
          <LinkIcon className="h-3.5 w-3.5" />
        </button>
        {/* Removing a link used to be "confirm the prompt empty", which was not
            discoverable; it is its own button now that the prompt is a dialog. */}
        {editor.isActive('link') && (
          <button
            data-command-exempt="editor formatting applied to the current selection; typed, not commanded — see the slash menu and the ? sheet"
            type="button"
            onClick={() => editor.chain().focus().unsetLink().run()}
            className="rounded-[8px] p-1 text-[var(--text-4)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--bad-fg)]"
            aria-label="Remove link"
          >
            <Unlink className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </BubbleMenu>
  );
}

interface AiActionProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  spinning?: boolean;
  disabled?: boolean;
  onClick: () => void;
}

/**
 * In-flight state is the icon becoming a spinner in place, not a toast and not
 * a disabled menu that closes. The user is watching this button; that is where
 * the answer to "did it hear me" belongs.
 */
function AiAction({ icon: Icon, label, spinning, disabled, onClick }: AiActionProps) {
  return (
    <button
      data-ai-entry-point="bubble-menu"
      data-command-exempt="inline AI on the current selection; one of the module's two AI entry points, the other being the ask panel (view.ai)"
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-busy={spinning || undefined}
      className="flex items-center gap-1 rounded-[8px] px-2 py-1 text-xs font-medium text-[var(--text-2)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)] disabled:opacity-50"
    >
      <Icon className={`h-3.5 w-3.5 ${spinning ? 'animate-spin' : ''}`} />
      {label}
    </button>
  );
}
