import { useState } from 'react';
import { Check, MessageCircle, Send, X } from 'lucide-react';
import type { Doc } from '@/pages/docs/_lib/types';
import { useDocsStore } from '@/pages/docs/_hooks/use-docs-store';

interface Props {
  doc: Doc;
}

export default function CommentsPanel({ doc }: Props) {
  const reply = useDocsStore((s) => s.replyToComment);
  const resolve = useDocsStore((s) => s.resolveComment);
  const [showResolved, setShowResolved] = useState(false);
  const [replyText, setReplyText] = useState<Record<string, string>>({});

  const visible = showResolved ? doc.comments : doc.comments.filter((c) => !c.resolved);

  if (doc.comments.length === 0) return null;

  return (
    <div className="hidden w-72 shrink-0 overflow-y-auto border-l border-[var(--line-soft)] p-3 xl:block">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-[var(--ink)]">
          <MessageCircle className="h-4 w-4" /> Comments ({doc.comments.length})
        </div>
        <button
          type="button"
          onClick={() => setShowResolved((v) => !v)}
          className="text-[10px] font-medium text-[var(--text-3)] transition-colors hover:text-[var(--ink)]"
        >
          {showResolved ? 'Hide resolved' : 'Show resolved'}
        </button>
      </div>
      <div className="space-y-2">
        {visible.map((thread) => (
          <div
            key={thread.id}
            className={`rounded-[12px] border bg-white p-2.5 ${
              thread.resolved
                ? 'border-[var(--line-soft)] opacity-60'
                : 'border-[var(--line)]'
            }`}
          >
            {thread.replies.map((r) => (
              <div key={r.id} className="mb-1.5 last:mb-0">
                <div className="flex items-center gap-1">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--ink)] text-[9px] font-semibold text-white">
                    {r.author.slice(0, 1)}
                  </div>
                  <span className="text-xs font-semibold text-[var(--ink)]">{r.author}</span>
                  <span className="text-[10px] text-[var(--text-4)]">
                    {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="ml-6 text-xs text-[var(--text-2)]">{r.body}</div>
              </div>
            ))}
            <div className="mt-1.5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => resolve(doc.id, thread.id, !thread.resolved)}
                className="flex items-center gap-1 rounded-[8px] px-1.5 py-0.5 text-[10px] font-medium text-[var(--text-3)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
              >
                {thread.resolved ? <X className="h-3 w-3" /> : <Check className="h-3 w-3" />}
                {thread.resolved ? 'Reopen' : 'Resolve'}
              </button>
            </div>
            {!thread.resolved && (
              <form
                className="mt-1.5 flex gap-1"
                onSubmit={(e) => {
                  e.preventDefault();
                  const body = replyText[thread.id]?.trim();
                  if (!body) return;
                  reply(doc.id, thread.id, body);
                  setReplyText((m) => ({ ...m, [thread.id]: '' }));
                }}
              >
                <input
                  value={replyText[thread.id] ?? ''}
                  onChange={(e) =>
                    setReplyText((m) => ({ ...m, [thread.id]: e.target.value }))
                  }
                  placeholder="Reply…"
                  className="flex-1 rounded-[10px] border border-[var(--line-soft)] bg-[var(--sand)] px-2 py-1 text-xs text-[var(--ink)] placeholder:text-[var(--text-5)] focus:border-[var(--ink)] focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-[10px] bg-[var(--ink)] p-1.5 text-white transition-opacity hover:opacity-85"
                >
                  <Send className="h-3 w-3" />
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
