import { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles, X, Send, Loader2, ListTodo } from 'lucide-react';
import {
  useTodoStore,
  selectTasksMap,
} from '@/pages/todo/_hooks/use-todo-store';
import { useTodoUiStore } from '@/pages/todo/_hooks/use-todo-ui-store';
import { askAcrossTasks } from '@/pages/docs/_lib/mockAi';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citedTaskIds?: string[];
  pending?: boolean;
}

export default function TodoAskSidebar() {
  const open = useTodoUiStore((s) => s.askOpen);
  const setOpen = useTodoUiStore((s) => s.setAskOpen);
  const setSelectedTaskId = useTodoUiStore((s) => s.setSelectedTaskId);
  const setDetailOpen = useTodoUiStore((s) => s.setDetailOpen);
  const tasksMap = useTodoStore(selectTasksMap);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const tasks = useMemo(
    () =>
      Object.values(tasksMap)
        .filter((t) => !t.trashed)
        .map((t) => ({
          id: t.id,
          title: t.title,
          completed: t.completed,
          dueAt: t.dueAt,
          scheduledAt: t.scheduledAt,
          priority: t.priority,
          estimate: t.estimate,
          projectId: t.projectId ?? null,
          listId: t.listId ?? null,
          tags: t.tags,
          parentId: t.parentId ?? null,
          createdAt: t.createdAt,
          updatedAt: t.updatedAt,
        })),
    [tasksMap],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  if (!open) return null;

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = {
      id: `m_${Date.now()}_u`,
      role: 'user',
      content: input.trim(),
    };
    const aiMsg: ChatMessage = {
      id: `m_${Date.now()}_a`,
      role: 'assistant',
      content: '',
      pending: true,
    };
    setMessages((m) => [...m, userMsg, aiMsg]);
    setInput('');
    setLoading(true);
    let acc = '';
    const cited = new Set<string>();
    try {
      for await (const chunk of askAcrossTasks(userMsg.content, tasks)) {
        acc += chunk.chunk;
        chunk.citedTaskIds?.forEach((id) => cited.add(id));
        setMessages((m) =>
          m.map((x) =>
            x.id === aiMsg.id ? { ...x, content: acc, citedTaskIds: [...cited] } : x,
          ),
        );
      }
      setMessages((m) => m.map((x) => (x.id === aiMsg.id ? { ...x, pending: false } : x)));
    } catch {
      setMessages((m) =>
        m.map((x) =>
          x.id === aiMsg.id ? { ...x, pending: false, content: '⚠️ Mock AI failed.' } : x,
        ),
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <aside className="flex h-full w-96 shrink-0 flex-col border-l border-[var(--line-soft)]">
      <div className="flex items-center justify-between border-b border-[var(--line-soft)] px-3 py-2.5">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-[var(--ink)]">
          <Sparkles className="h-4 w-4" style={{ color: 'var(--text-4)' }} />
          Ask across tasks
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-[6px] p-1 text-[var(--text-4)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
        {messages.length === 0 ? (
          <div className="rounded-[12px] border border-[var(--line-soft)] bg-white p-3 text-sm text-[var(--text-3)]">
            Ask anything across {tasks.length} tasks.
            <ul className="mt-2 space-y-1 text-xs">
              <li className="text-[var(--text-4)]">"What's blocking the Q2 launch?"</li>
              <li className="text-[var(--text-4)]">"Show me everything tagged urgent due this week"</li>
              <li className="text-[var(--text-4)]">"What did I procrastinate on most this month?"</li>
            </ul>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <div
                className={cn(
                  'max-w-[90%] rounded-[12px] px-3 py-2 text-sm',
                  m.role === 'user'
                    ? 'bg-[var(--ink)] text-white'
                    : 'border border-[var(--line-soft)] bg-white text-[var(--ink)]',
                )}
              >
                <div className="whitespace-pre-wrap">
                  {m.content}
                  {m.pending && <Loader2 className="ml-1 inline h-3 w-3 animate-spin" />}
                </div>
                {m.citedTaskIds && m.citedTaskIds.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {m.citedTaskIds.map((tid) => {
                      const t = tasksMap[tid];
                      if (!t) return null;
                      return (
                        <button
                          key={tid}
                          type="button"
                          onClick={() => {
                            setSelectedTaskId(tid);
                            setDetailOpen(true);
                          }}
                          className="plat-pill plat-pill-mute !gap-1 !px-2 !py-0.5 !text-[10px] !font-medium transition-colors hover:!text-[var(--ink)]"
                        >
                          <ListTodo className="h-2.5 w-2.5" />
                          <span className="max-w-[160px] truncate">{t.title}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <form
        className="border-t border-[var(--line-soft)] p-3"
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
            placeholder="Ask anything about your tasks…"
            rows={2}
            className="flex-1 resize-none rounded-[10px] border border-[var(--line)] bg-white p-2 text-sm text-[var(--ink)] transition-colors placeholder:text-[var(--text-5)] focus:border-[var(--ink)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="plat-btn !h-9 !w-9 !justify-center !px-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </aside>
  );
}
