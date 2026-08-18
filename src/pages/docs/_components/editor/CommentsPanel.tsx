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
    <div className="hidden w-72 shrink-0 overflow-y-auto border-l border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950 xl:block">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-1 text-sm font-semibold">
          <MessageCircle className="h-4 w-4" /> Comments ({doc.comments.length})
        </div>
        <button
          type="button"
          onClick={() => setShowResolved((v) => !v)}
          className="text-[10px] text-blue-600 hover:underline dark:text-blue-400"
        >
          {showResolved ? 'Hide resolved' : 'Show resolved'}
        </button>
      </div>
      <div className="space-y-2">
        {visible.map((thread) => (
          <div
            key={thread.id}
            className={`rounded-md border bg-white p-2 dark:bg-zinc-900 ${
              thread.resolved
                ? 'border-zinc-200 opacity-60 dark:border-zinc-800'
                : 'border-amber-200 dark:border-amber-900'
            }`}
          >
            {thread.replies.map((r) => (
              <div key={r.id} className="mb-1.5 last:mb-0">
                <div className="flex items-center gap-1">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-[9px] font-medium text-white">
                    {r.author.slice(0, 1)}
                  </div>
                  <span className="text-xs font-medium">{r.author}</span>
                  <span className="text-[10px] text-zinc-500">
                    {new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="ml-6 text-xs text-zinc-700 dark:text-zinc-300">{r.body}</div>
              </div>
            ))}
            <div className="mt-1.5 flex items-center justify-between">
              <button
                type="button"
                onClick={() => resolve(doc.id, thread.id, !thread.resolved)}
                className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] hover:bg-zinc-100 dark:hover:bg-zinc-800"
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
                  className="flex-1 rounded-md border border-zinc-200 bg-white px-1.5 py-1 text-xs focus:border-blue-400 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900"
                />
                <button
                  type="submit"
                  className="rounded-md bg-blue-600 p-1 text-white hover:bg-blue-700"
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
