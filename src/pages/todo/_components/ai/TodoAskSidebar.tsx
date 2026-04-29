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
    <aside className="flex h-full w-96 shrink-0 flex-col border-l border-gray-200 bg-white">
      <div className="flex items-center justify-between border-b border-gray-200 px-3 py-2.5">
        <div className="flex items-center gap-1.5 font-medium">
          <Sparkles className="h-4 w-4 text-violet-500" />
          Ask across tasks
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded p-1 hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
        {messages.length === 0 ? (
          <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-600">
            Ask anything across {tasks.length} tasks.
            <ul className="mt-2 space-y-1 text-xs">
              <li className="text-violet-700">"What's blocking the Q2 launch?"</li>
              <li className="text-violet-700">"Show me everything tagged urgent due this week"</li>
              <li className="text-violet-700">"What did I procrastinate on most this month?"</li>
            </ul>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <div
                className={cn(
                  'max-w-[90%] rounded-lg px-3 py-2 text-sm',
                  m.role === 'user' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-900',
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
                          className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-violet-700 shadow-sm hover:bg-violet-50"
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
        className="border-t border-gray-200 p-3"
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
            className="flex-1 resize-none rounded-md border border-gray-200 bg-white p-2 text-sm focus:border-violet-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-md bg-violet-600 text-white hover:bg-violet-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </aside>
  );
}
