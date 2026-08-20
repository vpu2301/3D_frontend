import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X, Send, Loader2, FileText } from 'lucide-react';
import { useDriveStore, selectItemsMap } from '@/pages/drive/_hooks/use-drive-store';
import { useDriveUiStore } from '@/pages/drive/_hooks/use-drive-ui-store';
import { askAcrossDrive } from '@/pages/docs/_lib/mockAi';
import { classifyFile, fileKindIcon, fileKindColor } from '@/pages/drive/_lib/fileTypes';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citedFileIds?: string[];
  pending?: boolean;
}

export default function DriveAiSidebar() {
  const itemsMap = useDriveStore(selectItemsMap);
  const setOpen = useDriveUiStore((s) => s.setDriveAiOpen);
  const setPreviewId = useDriveUiStore((s) => s.setPreviewId);
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const files = useMemo(
    () =>
      Object.values(itemsMap)
        .filter((i) => i.type === 'file' && !i.trashed)
        .map((i) => ({
          id: i.id,
          name: i.name,
          kind: classifyFile(i),
          size: i.size ?? 0,
          tags: i.tags,
          parentId: i.parentId,
          updatedAt: i.updatedAt,
          ownerId: i.ownerId,
          extractedText: i.extractedText,
          summary: i.summary?.oneLine,
        })),
    [itemsMap],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages.length]);

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
      for await (const chunk of askAcrossDrive(userMsg.content, files)) {
        acc += chunk.chunk;
        if (chunk.citedFileIds) chunk.citedFileIds.forEach((id) => cited.add(id));
        setMessages((m) =>
          m.map((x) =>
            x.id === aiMsg.id ? { ...x, content: acc, citedFileIds: [...cited] } : x,
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
      <div className="flex items-center justify-between border-b border-[var(--line-soft)] px-4 py-3">
        <div className="flex items-center gap-2 text-[13.5px] font-semibold text-[var(--ink)]">
          <Sparkles className="h-4 w-4 text-[var(--text-4)]" />
          Ask across Drive
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-[8px] p-1 text-[var(--text-4)] hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--ink)]"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-3">
        {messages.length === 0 ? (
          <div className="rounded-[12px] border border-[var(--line-soft)] bg-white p-3.5 text-[13px] text-[var(--text-2)]">
            Ask anything across {files.length} files in your Drive.
            <ul className="mt-2 space-y-1 text-xs text-[var(--text-4)]">
              <li>"Find all contracts mentioning Acme"</li>
              <li>"What was decided in last week's meetings?"</li>
              <li>"Berlin trip photos"</li>
            </ul>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <div
                className={cn(
                  'max-w-[90%] rounded-[12px] px-3 py-2 text-[13.5px] leading-relaxed',
                  m.role === 'user'
                    ? 'bg-[var(--ink)] text-white'
                    : 'border border-[var(--line-soft)] bg-white text-[var(--ink)]',
                )}
              >
                <div className="whitespace-pre-wrap">
                  {m.content}
                  {m.pending && <Loader2 className="ml-1 inline h-3 w-3 animate-spin" />}
                </div>
                {m.citedFileIds && m.citedFileIds.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {m.citedFileIds.map((fid) => {
                      const f = itemsMap[fid];
                      if (!f) return null;
                      const kind = classifyFile(f);
                      const Icon = fileKindIcon(kind);
                      return (
                        <button
                          key={fid}
                          type="button"
                          onClick={() => setPreviewId(fid)}
                          className="inline-flex items-center gap-1 rounded-full border border-[var(--line-soft)] bg-white px-2 py-0.5 text-[10px] font-medium text-[var(--text-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]"
                        >
                          <Icon className={cn('h-2.5 w-2.5', fileKindColor(kind))} />
                          <span className="max-w-[160px] truncate">{f.name}</span>
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
            placeholder="Ask anything about your Drive…"
            rows={2}
            className="flex-1 resize-none rounded-[10px] border border-[var(--line)] bg-white p-2.5 text-[13.5px] text-[var(--ink)] placeholder:text-[var(--text-5)] focus:border-[var(--ink)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--ink)] text-white transition-opacity hover:opacity-85 disabled:opacity-35"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </aside>
  );
}
