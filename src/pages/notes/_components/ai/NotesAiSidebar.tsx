import { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles, X, Send, Loader2, StickyNote } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotesStore, selectNotesMap, deriveTitle, deriveFullText } from '@/pages/notes/_hooks/use-notes-store';
import { answerOverNotes } from '@/pages/docs/_lib/mockAi';
import { newId } from '@/pages/notes/_lib/storage';
import type { Note } from '@/pages/notes/_lib/types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: string[];
  pending?: boolean;
}

interface Props {
  noteId?: string;
  onClose: () => void;
}

const SEVEN_DAYS = 7 * 86_400_000;

export default function NotesAiSidebar({ noteId, onClose }: Props) {
  const notesMap = useNotesStore(selectNotesMap);
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Context = current note + linked notes + recent (last 7 days)
  const contextNotes: Note[] = useMemo(() => {
    const all = Object.values(notesMap).filter((n) => !n.trashed);
    if (!noteId) return all;
    const cur = notesMap[noteId];
    if (!cur) return all;
    const linked = new Set<string>(
      cur.links.filter((l) => l.type === 'note').map((l) => l.targetId),
    );
    const recent = all.filter((n) => Date.now() - n.updatedAt < SEVEN_DAYS).map((n) => n.id);
    const ids = new Set<string>([cur.id, ...linked, ...recent]);
    return all.filter((n) => ids.has(n.id));
  }, [notesMap, noteId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

  const send = async () => {
    if (!input.trim()) return;
    const userMsg: ChatMessage = { id: newId('m'), role: 'user', content: input.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput('');
    const aiMsg: ChatMessage = { id: newId('m'), role: 'assistant', content: '', pending: true };
    setMessages((m) => [...m, aiMsg]);
    setLoading(true);

    const ctx = contextNotes.map((n) => ({
      id: n.id,
      title: deriveTitle(n),
      text: deriveFullText(n),
    }));
    let acc = '';
    const citations = new Set<string>();
    try {
      for await (const chunk of answerOverNotes(userMsg.content, ctx)) {
        acc += chunk.chunk;
        if (chunk.citations) chunk.citations.forEach((c) => citations.add(c));
        setMessages((m) =>
          m.map((x) => (x.id === aiMsg.id ? { ...x, content: acc, citations: [...citations] } : x)),
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
          <Sparkles className="h-4 w-4 text-blue-500" />
          Ask across notes
        </div>
        <button
          type="button"
          onClick={onClose}
          className="rounded p-1 hover:bg-gray-100"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
        {messages.length === 0 ? (
          <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-600">
            Ask anything across {contextNotes.length} notes
            {noteId ? ' (this note + linked + recent)' : ''}.
            <ul className="mt-2 space-y-1 text-xs">
              <li className="text-blue-700">"What did I decide about diff-accept this week?"</li>
              <li className="text-blue-700">"What open tasks do I have?"</li>
              <li className="text-blue-700">"Find notes about AI tagging"</li>
            </ul>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <div
                className={
                  m.role === 'user'
                    ? 'max-w-[85%] rounded-lg bg-blue-600 px-3 py-2 text-sm text-white'
                    : 'max-w-[90%] rounded-lg bg-gray-100 px-3 py-2 text-sm text-gray-900'
                }
              >
                <div className="whitespace-pre-wrap">
                  {m.content}
                  {m.pending && <Loader2 className="ml-1 inline h-3 w-3 animate-spin" />}
                </div>
                {m.citations && m.citations.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {m.citations.map((cid) => {
                      const n = notesMap[cid];
                      if (!n) return null;
                      return (
                        <button
                          key={cid}
                          type="button"
                          onClick={() => navigate(`/notes/${cid}`)}
                          className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-medium text-blue-700 shadow-sm hover:bg-blue-50"
                        >
                          <StickyNote className="h-2.5 w-2.5" />
                          {deriveTitle(n)}
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
            placeholder="Ask anything across your notes…"
            rows={2}
            className="flex-1 resize-none rounded-md border border-gray-200 bg-white p-2 text-sm focus:border-blue-400 focus:outline-none"
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
