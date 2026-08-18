import { useEffect, useRef, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import {
  Send,
  Sparkles,
  Paperclip,
  ChevronDown,
  ChevronUp,
  X,
  Maximize2,
  Minimize2,
  Trash2,
  Clock,
  ListTodo,
  AlertTriangle,
} from 'lucide-react';
import { useMailStore } from '@/pages/mail/_hooks/use-mail-store';
import { useMailUiStore } from '@/pages/mail/_hooks/use-mail-ui-store';
import { useTodoStore } from '@/pages/todo/_hooks/use-todo-store';
import {
  draftReply,
  draftFromPrompt,
  ghostCompleteEmail,
  preSendCheck,
  type MockPreSendIssue,
} from '@/pages/docs/_lib/mockAi';
import type { Draft, ReplyIntent } from '@/pages/mail/_lib/types';
import RecipientField from './RecipientField';
import ReplyIntentPicker from './ReplyIntentPicker';
import { cn } from '@/lib/utils';

const SAVE_DEBOUNCE = 1000;

interface Props {
  draftId: string;
  position: number; // 0 = right-most
}

export default function ComposeWindow({ draftId, position }: Props) {
  const draft = useMailStore((s) => s.drafts[draftId]);
  const updateDraft = useMailStore((s) => s.updateDraft);
  const deleteDraft = useMailStore((s) => s.deleteDraft);
  const sendDraft = useMailStore((s) => s.sendDraft);
  const closeCompose = useMailUiStore((s) => s.closeCompose);
  const registerUndoSend = useMailUiStore((s) => s.registerUndoSend);
  const createTask = useTodoStore((s) => s.createTask);

  const [maximized, setMaximized] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [showCcBcc, setShowCcBcc] = useState(false);
  const [intentOpen, setIntentOpen] = useState(false);
  const [aiBusy, setAiBusy] = useState(false);
  const [issues, setIssues] = useState<MockPreSendIssue[]>([]);
  const saveTimer = useRef<number | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
        heading: false,
        horizontalRule: false,
      }),
      Placeholder.configure({ placeholder: 'Write your message…' }),
      Underline,
      Link.configure({ openOnClick: false, autolink: true }),
    ],
    content: draft?.bodyHtml || '',
    onUpdate: ({ editor: ed }) => {
      const html = ed.getHTML();
      if (saveTimer.current) window.clearTimeout(saveTimer.current);
      saveTimer.current = window.setTimeout(() => {
        updateDraft(draftId, { bodyHtml: html });
      }, SAVE_DEBOUNCE);
    },
  });

  useEffect(() => () => {
    if (saveTimer.current) window.clearTimeout(saveTimer.current);
  }, []);

  // Ghost-complete on idle (debounced)
  useEffect(() => {
    if (!editor) return;
    let t: number | null = null;
    const handler = () => {
      if (t) window.clearTimeout(t);
      t = window.setTimeout(async () => {
        const text = editor.getText();
        const recipientName = draft?.to[0]?.name;
        const completion = await ghostCompleteEmail(text, recipientName).catch(() => null);
        if (completion) {
          // Append completion as a faint suggestion at end (simple approach: place inside data attr in DOM)
          const el = document.querySelector(`[data-compose-id="${draftId}"] .compose-ghost`);
          if (el) el.textContent = completion;
        } else {
          const el = document.querySelector(`[data-compose-id="${draftId}"] .compose-ghost`);
          if (el) el.textContent = '';
        }
      }, 700);
    };
    editor.on('update', handler);
    return () => {
      editor.off('update', handler);
      if (t) window.clearTimeout(t);
    };
  }, [editor, draft?.to, draftId]);

  if (!draft) return null;

  const setSubject = (subject: string) => updateDraft(draftId, { subject });
  const setTo = (to: Draft['to']) => updateDraft(draftId, { to });
  const setCc = (cc: Draft['cc']) => updateDraft(draftId, { cc });
  const setBcc = (bcc: Draft['bcc']) => updateDraft(draftId, { bcc });

  const close = async () => {
    closeCompose(draftId);
    // Empty draft? clean it up.
    if (!draft.subject && draft.to.length === 0 && !draft.bodyHtml.trim()) {
      await deleteDraft(draftId);
    }
  };

  const onDiscard = async () => {
    closeCompose(draftId);
    await deleteDraft(draftId);
  };

  const runPreSendChecks = async (): Promise<MockPreSendIssue[]> => {
    const html = editor?.getHTML() ?? draft.bodyHtml;
    return preSendCheck({
      subject: draft.subject,
      bodyHtml: html,
      bodyText: editor?.getText(),
      to: draft.to.map((r) => ({ name: r.name, email: r.email })),
      hasAttachments: draft.attachments.length > 0,
    });
  };

  const onSend = async (scheduleFor?: number) => {
    if (draft.to.length === 0) {
      alert('Add at least one recipient.');
      return;
    }
    const checks = await runPreSendChecks().catch(() => []);
    if (checks.length > 0 && !scheduleFor) {
      setIssues(checks);
      return;
    }
    await reallySend(scheduleFor);
  };

  const reallySend = async (scheduleFor?: number) => {
    if (saveTimer.current) {
      window.clearTimeout(saveTimer.current);
      await updateDraft(draftId, { bodyHtml: editor?.getHTML() ?? draft.bodyHtml });
    }
    const sent = await sendDraft(draftId, scheduleFor ? { scheduleFor } : undefined);
    closeCompose(draftId);
    if (!scheduleFor) {
      registerUndoSend(sent.id, Date.now() + 10_000);
    }
  };

  const onSchedule = async () => {
    const inp = window.prompt('Schedule send — when? (e.g. "tomorrow 8am", or yyyy-mm-dd hh:mm)');
    if (!inp) return;
    const ts = parseScheduleInput(inp);
    if (!ts) {
      alert('Could not parse that time.');
      return;
    }
    await onSend(ts);
  };

  const onSendAndMakeTask = async () => {
    await onSend();
    await createTask({
      title: `Follow up: ${draft.subject || draft.to[0]?.name || 'sent email'}`,
      sourceModule: 'mail',
      dueAt: Date.now() + 3 * 86_400_000,
      tags: ['follow-up'],
    } as any);
  };

  const onAiPrompt = async () => {
    const prompt = window.prompt('Describe the email — e.g. "decline politely", "follow up on the proposal"');
    if (!prompt) return;
    setAiBusy(true);
    let acc = '';
    try {
      for await (const chunk of draftFromPrompt(prompt, {
        contactName: draft.to[0]?.name,
      })) {
        acc += chunk;
        editor?.commands.setContent(htmlFromText(acc));
      }
    } catch {
      /* mock failure */
    } finally {
      setAiBusy(false);
    }
  };

  const onIntent = async (intent: ReplyIntent, freeForm?: string) => {
    setIntentOpen(false);
    setAiBusy(true);
    let acc = '';
    try {
      for await (const chunk of draftReply(
        intent,
        { contactName: draft.to[0]?.name, threadSubject: draft.subject },
        freeForm,
      )) {
        acc += chunk;
        editor?.commands.setContent(htmlFromText(acc));
      }
    } catch {
      /* mock failure */
    } finally {
      setAiBusy(false);
    }
  };

  const containerCls = maximized
    ? 'fixed inset-x-12 inset-y-12 z-40 flex flex-col rounded-lg border border-gray-200 bg-white shadow-2xl'
    : collapsed
      ? 'fixed bottom-0 z-40 w-72 rounded-t-lg border border-gray-200 bg-white shadow-xl'
      : 'fixed bottom-0 z-40 flex h-[560px] w-[520px] flex-col rounded-t-lg border border-gray-200 bg-white shadow-xl';

  const positionStyle = maximized ? {} : { right: 24 + position * 540 };

  return (
    <div className={containerCls} style={positionStyle} data-compose-id={draftId}>
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-100 bg-gray-50 px-3 py-2">
        <span className="truncate text-sm font-medium text-gray-800">
          {draft.subject || 'New message'}
        </span>
        <div className="flex items-center gap-0.5">
          {!maximized && (
            <button
              type="button"
              onClick={() => setCollapsed((c) => !c)}
              className="rounded p-1 text-gray-500 hover:bg-gray-200"
              aria-label={collapsed ? 'Expand' : 'Collapse'}
            >
              {collapsed ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          )}
          <button
            type="button"
            onClick={() => setMaximized((m) => !m)}
            className="rounded p-1 text-gray-500 hover:bg-gray-200"
            aria-label={maximized ? 'Restore' : 'Maximize'}
          >
            {maximized ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
          <button
            type="button"
            onClick={close}
            className="rounded p-1 text-gray-500 hover:bg-gray-200"
            aria-label="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {!collapsed && (
        <>
          <RecipientField label="To" value={draft.to} onChange={setTo} placeholder="Recipients" />
          {showCcBcc ? (
            <>
              <RecipientField label="Cc" value={draft.cc} onChange={setCc} />
              <RecipientField label="Bcc" value={draft.bcc} onChange={setBcc} />
            </>
          ) : (
            <button
              type="button"
              onClick={() => setShowCcBcc(true)}
              className="self-end px-3 py-0.5 text-[11px] text-gray-500 hover:text-[#1a73e8]"
            >
              Cc / Bcc
            </button>
          )}

          <div className="flex items-center border-b border-gray-100 px-3 py-1.5">
            <span className="shrink-0 text-xs text-gray-500">Subject</span>
            <input
              value={draft.subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject"
              className="ml-2 flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          {/* Body */}
          <div className="relative flex-1 overflow-y-auto px-3 py-2 text-sm">
            <EditorContent editor={editor} className="prose prose-sm max-w-none focus:outline-none [&_.ProseMirror]:min-h-[200px] [&_.ProseMirror]:outline-none" />
            <span className="compose-ghost pointer-events-none ml-1 text-gray-400" />
            {aiBusy && (
              <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-[#dde9f4] px-2 py-0.5 text-[10px] font-medium text-[#1a73e8]">
                <Sparkles className="h-3 w-3 animate-pulse" />
                Drafting…
              </div>
            )}
          </div>

          {/* Pre-send issues */}
          {issues.length > 0 && (
            <div className="border-t border-amber-200 bg-amber-50 px-3 py-2">
              <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-amber-800">
                <AlertTriangle className="h-3.5 w-3.5" />
                Before you send
              </div>
              <ul className="space-y-1 text-xs text-amber-900">
                {issues.map((i, idx) => (
                  <li key={idx}>• {i.message}</li>
                ))}
              </ul>
              <div className="mt-1.5 flex justify-end gap-1">
                <button
                  type="button"
                  onClick={() => setIssues([])}
                  className="text-[11px] text-gray-600 hover:underline"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIssues([]);
                    void reallySend();
                  }}
                  className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-medium text-amber-900 hover:bg-amber-200"
                >
                  Send anyway
                </button>
              </div>
            </div>
          )}

          {/* Footer / actions */}
          <div className="relative flex shrink-0 items-center gap-1 border-t border-gray-100 px-2 py-2">
            <button
              type="button"
              onClick={() => onSend()}
              className="flex items-center gap-1.5 rounded-full bg-[#bdd8ec] px-3 py-1.5 text-sm font-medium text-gray-900 hover:bg-[#a5c8e0]"
              title="Send (Cmd/Ctrl+Enter)"
            >
              <Send className="h-3.5 w-3.5" />
              Send
            </button>
            <button
              type="button"
              onClick={onSchedule}
              className="rounded-full p-1.5 text-gray-600 hover:bg-gray-100"
              title="Schedule send"
            >
              <Clock className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={onSendAndMakeTask}
              className="rounded-full p-1.5 text-gray-600 hover:bg-gray-100"
              title="Send + make follow-up task"
            >
              <ListTodo className="h-3.5 w-3.5" />
            </button>

            <div className="ml-auto flex items-center gap-0.5">
              <button
                type="button"
                onClick={onAiPrompt}
                disabled={aiBusy}
                className="rounded-full p-1.5 text-[#1a73e8] hover:bg-[#dde9f4] disabled:opacity-50"
                title="AI draft"
              >
                <Sparkles className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIntentOpen((o) => !o)}
                disabled={aiBusy}
                className="rounded-full px-2 py-1 text-[11px] font-medium text-[#1a73e8] hover:bg-[#dde9f4] disabled:opacity-50"
              >
                Reply with AI
              </button>
              <button
                type="button"
                disabled
                className="rounded-full p-1.5 text-gray-400"
                title="Attach (coming soon)"
              >
                <Paperclip className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={onDiscard}
                className="rounded-full p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                title="Discard"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            <ReplyIntentPicker open={intentOpen} onClose={() => setIntentOpen(false)} onPick={onIntent} />
          </div>
        </>
      )}
    </div>
  );
}

function htmlFromText(text: string): string {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped
    .split(/\n\n+/)
    .map((para) => `<p>${para.replace(/\n/g, '<br>')}</p>`)
    .join('');
}

function parseScheduleInput(s: string): number | null {
  const lower = s.toLowerCase().trim();
  const now = new Date();
  const m = lower.match(/^(tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday)(?:\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)?)?$/);
  if (m) {
    const day = m[1];
    const hour = m[2] ? parseInt(m[2], 10) : 9;
    const minute = m[3] ? parseInt(m[3], 10) : 0;
    const ampm = m[4];
    const target = new Date(now);
    if (day === 'tomorrow') target.setDate(target.getDate() + 1);
    else if (day === 'today') {
      // no shift
    } else {
      const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const idx = days.indexOf(day);
      const cur = target.getDay();
      let diff = idx - cur;
      if (diff <= 0) diff += 7;
      target.setDate(target.getDate() + diff);
    }
    let h = hour;
    if (ampm === 'pm' && h < 12) h += 12;
    if (ampm === 'am' && h === 12) h = 0;
    target.setHours(h, minute, 0, 0);
    return target.getTime();
  }
  const iso = new Date(s);
  if (!isNaN(iso.getTime())) return iso.getTime();
  return null;
}
