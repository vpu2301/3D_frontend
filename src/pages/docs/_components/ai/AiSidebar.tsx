import { useEffect, useRef, useState } from 'react';
import { Sparkles, X, Send, Check, Loader2 } from 'lucide-react';
import type { Editor } from '@tiptap/react';
import DiffView from './DiffView';
import { streamCompletion } from '@/pages/docs/_lib/mockAi';
import { useDocsAiStore } from '@/pages/docs/_hooks/use-docs-ai-store';
import { useDocsSettingsStore } from '@/pages/docs/_hooks/use-docs-settings-store';
import { newId } from '@/pages/docs/_lib/storage';
import { toPlainText } from '@/pages/docs/_lib/export';
import type { AiChatMessage } from '@/pages/docs/_lib/types';

interface Props {
  editor: Editor;
  docId: string;
  onClose: () => void;
}

export default function AiSidebar({ editor, docId, onClose }: Props) {
  const messages = useDocsAiStore((s) => s.chats[docId] ?? []);
  const append = useDocsAiStore((s) => s.appendMessage);
  const patch = useDocsAiStore((s) => s.patchMessage);
  const tone = useDocsSettingsStore((s) => s.defaultTone);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: AiChatMessage = {
      id: newId('msg'),
      role: 'user',
      content: input.trim(),
      createdAt: Date.now(),
    };
    append(docId, userMsg);
    setInput('');

    const aiMsg: AiChatMessage = {
      id: newId('msg'),
      role: 'assistant',
      content: '',
      pending: true,
      createdAt: Date.now(),
    };
    append(docId, aiMsg);

    setLoading(true);
    const ctx = toPlainText(editor.getJSON() as any);
    let acc = '';
    try {
      for await (const chunk of streamCompletion(userMsg.content, ctx, { tone })) {
        acc += chunk;
        patch(docId, aiMsg.id, { content: acc });
      }
      // detect "rewrite/replace" intents and attach a proposal
      const intent = userMsg.content.toLowerCase();
      const isRewrite =
        intent.includes('rewrite') ||
        intent.includes('replace') ||
        intent.includes('turn this into');
      if (isRewrite) {
        patch(docId, aiMsg.id, {
          pending: false,
          content: 'I drafted a proposed rewrite. Review the diff below.',
          proposal: {
            id: newId('proposal'),
            kind: 'replace-doc',
            before: ctx,
            after: acc,
            description: userMsg.content,
            createdAt: Date.now(),
          },
        });
      } else {
        patch(docId, aiMsg.id, { pending: false });
      }
    } catch (e: any) {
      patch(docId, aiMsg.id, {
        pending: false,
        content: '⚠️ Mock AI failed. Try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const acceptProposal = (msg: AiChatMessage) => {
    if (!msg.proposal) return;
    if (msg.proposal.kind === 'replace-doc') {
      // Replace whole doc with paragraphs from `after`
      const paragraphs = msg.proposal.after.split(/\n\n+/).map((p) => ({
        type: 'paragraph',
        content: p ? [{ type: 'text', text: p }] : [],
      }));
      editor.commands.setContent({ type: 'doc', content: paragraphs.length ? paragraphs : [{ type: 'paragraph' }] });
    }
    patch(docId, msg.id, { proposal: undefined, content: msg.content + '\n\n✓ Accepted.' });
  };

  const rejectProposal = (msg: AiChatMessage) => {
    patch(docId, msg.id, { proposal: undefined, content: msg.content + '\n\n✗ Rejected.' });
  };

  return (
    <aside className="flex h-full w-96 shrink-0 flex-col border-l border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between border-b border-zinc-200 px-3 py-2.5 dark:border-zinc-800">
        <div className="flex items-center gap-1.5 font-medium">
          <Sparkles className="h-4 w-4 text-blue-500" />
          AI assistant
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          aria-label="Close AI sidebar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
        {messages.length === 0 ? (
          <div className="rounded-md bg-zinc-50 p-3 text-sm text-zinc-500 dark:bg-zinc-800/40">
            Ask anything about this document.
            <ul className="mt-2 space-y-1 text-xs">
              <li className="text-blue-700 dark:text-blue-300">"Rewrite section 2 in bullets"</li>
              <li className="text-blue-700 dark:text-blue-300">"Summarize this in three sentences"</li>
              <li className="text-blue-700 dark:text-blue-300">"List action items"</li>
              <li className="text-blue-700 dark:text-blue-300">"Make the tone more confident"</li>
            </ul>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                  m.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100'
                }`}
              >
                <div className="whitespace-pre-wrap">
                  {m.content}
                  {m.pending && <Loader2 className="ml-1 inline h-3 w-3 animate-spin" />}
                </div>
                {m.proposal && (
                  <div className="mt-2">
                    <DiffView before={m.proposal.before} after={m.proposal.after} />
                    <div className="mt-2 flex justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => rejectProposal(m)}
                        className="rounded px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-700"
                      >
                        Reject
                      </button>
                      <button
                        type="button"
                        onClick={() => acceptProposal(m)}
                        className="flex items-center gap-1 rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700"
                      >
                        <Check className="h-3 w-3" /> Accept all
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <form
        className="border-t border-zinc-200 p-3 dark:border-zinc-800"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <div className="flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Ask AI about this doc…"
            rows={2}
            className="flex-1 resize-none rounded-md border border-zinc-200 bg-white p-2 text-sm focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </aside>
  );
}
