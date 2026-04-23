import { useState, useEffect, useRef } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import {
  Send, Mic, MicOff, Bot, User,
  Paperclip, X, FileText, Image, Plus, Link2, Unlink,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  isConnected as pincerConnected,
  streamChat,
  sendChat,
  fetchLatestConversation,
  resetUserId,
  clearAuth,
  PincerError,
  type PincerMessage,
} from '@/lib/pincerClient';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  attachments?: Array<{ name: string; type: string; size: number; url: string }>;
  streaming?: boolean;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

const AGENTS = [
  { label: 'Emma',  color: '#fce7f3', dot: '#f472b6' },
  { label: 'Aria',  color: '#dbeafe', dot: '#60a5fa' },
  { label: 'Felix', color: '#dcfce7', dot: '#4ade80' },
  { label: 'Maya',  color: '#ede9fe', dot: '#a78bfa' },
];

const SUGGESTIONS = [
  { title: 'Create a marketing plan',   sub: 'for my new product launch'         },
  { title: 'Analyze sales data',        sub: 'and generate a summary report'     },
  { title: 'Draft a project timeline',  sub: 'with milestones and deliverables'  },
  { title: 'Prepare a budget overview', sub: 'for Q2 planning session'           },
];

const WELCOME_MESSAGE: ChatMessage = {
  id: 1,
  text: "Hello! Welcome to 3days.ai. I'm your AI assistant. Try asking me to help you with tasks like 'Create a marketing plan for my new product' or 'Analyze my sales data'. How can I help you today?",
  sender: 'assistant',
  timestamp: new Date(),
};

const Chat = () => {
  const { toast } = useToast();
  const [message, setMessage]             = useState('');
  const [messages, setMessages]           = useState<ChatMessage[]>([]);
  const [isListening, setIsListening]     = useState(false);
  const [attachments, setAttachments]     = useState<File[]>([]);
  const [chatHistory, setChatHistory]     = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('current');
  const [isStreaming, setIsStreaming]     = useState(false);
  const [pincerOn, setPincerOn]           = useState<boolean>(() => pincerConnected());

  const fileInputRef   = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef    = useRef<HTMLTextAreaElement>(null);
  const abortRef       = useRef<AbortController | null>(null);

  const hasStarted = messages.some(m => m.sender === 'user');

  // Boot: show welcome and, if Pincer is connected, hydrate past thread.
  useEffect(() => {
    setMessages([WELCOME_MESSAGE]);
    setChatHistory([
      { id: 'chat-1', title: 'Project Planning Discussion', lastMessage: 'Thanks for the help with the timeline!', timestamp: new Date(Date.now() - 86400000),  messageCount: 12 },
      { id: 'chat-2', title: 'Budget Analysis',             lastMessage: 'Can you review these numbers?',          timestamp: new Date(Date.now() - 172800000), messageCount: 8  },
    ]);

    if (!pincerConnected()) return;

    let cancelled = false;
    (async () => {
      try {
        const history = await fetchLatestConversation();
        if (cancelled || !history || history.length === 0) return;
        const hydrated = mapHistory(history);
        if (hydrated.length > 0) setMessages(hydrated);
      } catch (err) {
        if (err instanceof PincerError && err.status === 401) {
          setPincerOn(false);
          toast({
            title: 'Pincer token rejected',
            description: 'Reconnect from the login page.',
            variant: 'destructive',
          });
        }
      }
    })();
    return () => {
      cancelled = true;
      abortRef.current?.abort();
    };
  }, [toast]);

  useEffect(() => {
    if (hasStarted) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, hasStarted]);

  const adjustHeight = () => {
    const el = textareaRef.current;
    if (el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 180) + 'px'; }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    adjustHeight();
  };

  const handleSend = () => {
    if (isStreaming) return;
    if (!message.trim() && attachments.length === 0) return;

    const atts = attachments.map(f => ({ name: f.name, type: f.type, size: f.size, url: URL.createObjectURL(f) }));
    const userText = message;
    const userMsg: ChatMessage = { id: messages.length + 1, text: userText, sender: 'user', timestamp: new Date(), attachments: atts.length ? atts : undefined };
    setMessages(p => [...p, userMsg]);
    setMessage('');
    setAttachments([]);
    if (textareaRef.current)  textareaRef.current.style.height = 'auto';
    if (fileInputRef.current) fileInputRef.current.value = '';

    if (pincerOn) {
      void dispatchToPincer(userText);
    } else {
      // Mock fallback so the UI still works without a Pincer backend.
      setTimeout(() => {
        const reply: ChatMessage = {
          id: Date.now(),
          text: attachments.length
            ? `I can see you've shared ${attachments.length} file(s). I'll analyze them and help you with: "${userText || 'the attached files'}".`
            : `I understand you're asking about: "${userText}". (Demo mode — connect to a Pincer backend for a real reply.)`,
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages(p => [...p, reply]);
      }, 600);
    }
  };

  // Stream a reply from the Pincer backend, appending tokens to a single
  // assistant bubble. Falls back to POST /api/chat/message on stream failure.
  const dispatchToPincer = async (userText: string) => {
    const assistantId = Date.now();
    setMessages(p => [
      ...p,
      { id: assistantId, text: '', sender: 'assistant', timestamp: new Date(), streaming: true },
    ]);

    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;
    setIsStreaming(true);

    const appendDelta = (delta: string) => {
      setMessages(p =>
        p.map(m => (m.id === assistantId ? { ...m, text: m.text + delta } : m)),
      );
    };
    const finish = (finalText?: string) => {
      setMessages(p =>
        p.map(m =>
          m.id === assistantId
            ? { ...m, text: finalText && finalText.length > m.text.length ? finalText : m.text, streaming: false }
            : m,
        ),
      );
    };

    try {
      let gotChunk = false;
      for await (const ev of streamChat(userText, controller.signal)) {
        if (ev.event === 'chunk') {
          gotChunk = true;
          appendDelta(ev.data.delta);
        } else if (ev.event === 'done') {
          finish(ev.data.text);
          return;
        } else if (ev.event === 'error') {
          throw new PincerError(ev.data.message, 500);
        }
        // 'tool' events are intentionally ignored for now.
      }
      // Stream closed without an explicit `done` — finalize whatever we have.
      if (gotChunk) finish();
      else throw new PincerError('Empty stream', 500);
    } catch (streamErr) {
      if (controller.signal.aborted) {
        finish();
        return;
      }
      // Fall back to the non-streaming endpoint so the user still gets a reply.
      try {
        const { reply } = await sendChat(userText);
        setMessages(p =>
          p.map(m => (m.id === assistantId ? { ...m, text: reply, streaming: false } : m)),
        );
      } catch (fallbackErr) {
        const msg =
          fallbackErr instanceof PincerError
            ? fallbackErr.message
            : streamErr instanceof Error
              ? streamErr.message
              : 'Unknown error';
        setMessages(p =>
          p.map(m =>
            m.id === assistantId
              ? { ...m, text: `⚠️ ${msg}`, streaming: false }
              : m,
          ),
        );
        if (fallbackErr instanceof PincerError && fallbackErr.status === 401) {
          setPincerOn(false);
        }
      }
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const startNewChat = () => {
    abortRef.current?.abort();
    if (pincerOn) resetUserId();
    setCurrentChatId('current');
    setMessages([WELCOME_MESSAGE]);
  };

  const selectChat = (id: string) => {
    setCurrentChatId(id);
    if (id !== 'current') {
      setMessages([{ id: 1, text: `Loading conversation: ${chatHistory.find(c => c.id === id)?.title}...`, sender: 'assistant', timestamp: new Date() }]);
    }
  };

  const disconnectPincer = () => {
    clearAuth();
    setPincerOn(false);
    toast({ title: 'Disconnected from Pincer', description: 'Chat will use demo replies until you reconnect.' });
  };

  const getFileIcon = (type: string) => type.startsWith('image/') ? Image : FileText;
  const fmt = (d: Date) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  /* ── Agent pills ── */
  const AgentPills = () => (
    <div className="flex flex-wrap gap-1.5">
      {AGENTS.map(a => (
        <button
          key={a.label}
          onClick={() => { setMessage(`@${a.label} `); textareaRef.current?.focus(); }}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-gray-600 border border-gray-200 hover:border-gray-300 transition-all"
          style={{ backgroundColor: a.color }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: a.dot }} />
          {a.label}
        </button>
      ))}
    </div>
  );

  /* ── Bottom input bar (shared) ── */
  const InputBar = () => (
    <div className="w-full">
      {/* Attachment chips */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 px-1">
          {attachments.map((f, i) => {
            const Icon = getFileIcon(f.type);
            return (
              <div key={i} className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1.5 rounded-lg border border-gray-200 text-xs text-gray-700">
                <Icon className="h-3.5 w-3.5 text-gray-400" />
                <span className="truncate max-w-[8rem]">{f.name}</span>
                <button onClick={() => setAttachments(p => p.filter((_, j) => j !== i))} className="ml-0.5 text-gray-400 hover:text-gray-600"><X className="h-3 w-3" /></button>
              </div>
            );
          })}
        </div>
      )}

      {/* Textarea card */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-sm focus-within:border-[#8fc4e4] focus-within:shadow-md transition-all duration-200">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={isStreaming ? 'Generating reply…' : 'Message AI assistant… (Shift+Enter for new line)'}
          rows={1}
          disabled={isStreaming}
          className="w-full resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 px-4 pt-3.5 pb-2 focus:outline-none leading-relaxed disabled:opacity-60"
          style={{ minHeight: '52px', maxHeight: '180px' }}
        />
        <div className="flex items-center justify-between px-3 pb-3">
          {/* Left actions */}
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center justify-center h-7 w-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <Paperclip className="h-4 w-4" />
          </button>
          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsListening(p => !p)}
              className={`flex items-center justify-center h-7 w-7 rounded-lg transition-colors ${isListening ? 'bg-red-100 text-red-500' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <button
              onClick={handleSend}
              disabled={isStreaming || (!message.trim() && attachments.length === 0)}
              className={`flex items-center justify-center h-7 w-7 rounded-lg transition-all duration-150 ${
                !isStreaming && (message.trim() || attachments.length > 0)
                  ? 'bg-gray-900 text-white hover:bg-gray-700 shadow-sm'
                  : 'bg-gray-100 text-gray-300 cursor-not-allowed'
              }`}
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>

      <p className="text-center text-[11px] text-gray-400 mt-2">
        AI can make mistakes. Consider checking important information.
      </p>
    </div>
  );

  const PincerBadge = () => (
    <button
      onClick={pincerOn ? disconnectPincer : undefined}
      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all ${
        pincerOn
          ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
          : 'bg-gray-50 border-gray-200 text-gray-500 cursor-default'
      }`}
      title={pincerOn ? 'Connected to Pincer — click to disconnect' : 'Demo mode — sign in with a token to connect'}
    >
      {pincerOn ? <Link2 className="h-3 w-3" /> : <Unlink className="h-3 w-3" />}
      {pincerOn ? 'Pincer connected' : 'Demo mode'}
    </button>
  );

  return (
    <SidebarProvider>
      <AppSidebar
        chatHistory={chatHistory}
        currentChatId={currentChatId}
        onSelectChat={selectChat}
        onNewChat={startNewChat}
      />
      <SidebarInset className="flex flex-row overflow-hidden h-screen bg-white">

        {/* ────────────── Main chat column ────────────── */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

          {!hasStarted ? (
            /* ── Empty / welcome state ── */
            <div className="flex-1 flex flex-col items-center justify-center overflow-y-auto px-6 py-16">
              <div className="w-full max-w-2xl flex flex-col items-center gap-8">

                {/* Icon + greeting */}
                <div className="flex flex-col items-center gap-3 text-center">
                  <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-[#bdd8ec]">
                    <Bot className="h-7 w-7 text-gray-700" />
                  </div>
                  <h1 className="text-[1.65rem] font-semibold text-gray-900 tracking-tight">How can I help you today?</h1>
                  <p className="text-sm text-gray-500">Chat with your AI employees or ask anything</p>
                  <PincerBadge />
                </div>

                {/* Suggestion grid */}
                <div className="grid grid-cols-2 gap-2.5 w-full">
                  {SUGGESTIONS.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => { setMessage(s.title + ' ' + s.sub); textareaRef.current?.focus(); }}
                      className="text-left p-4 rounded-xl border border-gray-200 hover:border-[#8fc4e4] hover:bg-blue-50/30 transition-all duration-150 group"
                    >
                      <p className="text-sm font-medium text-gray-800 mb-0.5 group-hover:text-gray-900">{s.title}</p>
                      <p className="text-xs text-gray-400">{s.sub}</p>
                    </button>
                  ))}
                </div>

                {/* Agents */}
                <div className="w-full">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-2.5">Available agents</p>
                  <AgentPills />
                </div>

                {/* Input */}
                <div className="w-full">
                  <InputBar />
                </div>
              </div>
            </div>

          ) : (
            /* ── Active chat state ── */
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-5 h-14 border-b border-gray-100 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#bdd8ec]">
                    <Bot className="h-4 w-4 text-gray-700" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800">AI Chat</span>
                  <PincerBadge />
                </div>
                <button
                  onClick={startNewChat}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 border border-transparent hover:border-gray-200 transition-all"
                >
                  <Plus className="h-3.5 w-3.5" />
                  New chat
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto">
                <div className="max-w-2xl mx-auto py-10 px-4 space-y-8">
                  {messages.map(msg => (
                    <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                      {/* Avatar */}
                      {msg.sender === 'assistant' ? (
                        <div className="shrink-0 flex items-center justify-center h-8 w-8 rounded-lg bg-[#bdd8ec] mt-0.5">
                          <Bot className="h-4 w-4 text-gray-700" />
                        </div>
                      ) : (
                        <div className="shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-gray-800 mt-0.5">
                          <User className="h-3.5 w-3.5 text-white" />
                        </div>
                      )}

                      {/* Content */}
                      <div className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                        {msg.sender === 'assistant' ? (
                          <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                            {msg.text}
                            {msg.streaming && <span className="inline-block w-1.5 h-3.5 ml-0.5 bg-gray-400 animate-pulse align-middle" />}
                          </p>
                        ) : (
                          <div className="bg-gray-900 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-md leading-relaxed shadow-sm whitespace-pre-wrap">
                            {msg.text}
                          </div>
                        )}

                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="mt-1.5 flex flex-col gap-1.5">
                            {msg.attachments.map((att, i) => {
                              const Icon = getFileIcon(att.type);
                              return (
                                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg border border-gray-200">
                                  <Icon className="h-3.5 w-3.5 text-gray-500" />
                                  <span className="text-xs text-gray-700 truncate max-w-48">{att.name}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        <span className="text-[11px] text-gray-400 mt-1.5 px-0.5">{fmt(msg.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>

              {/* Bottom bar */}
              <div className="shrink-0 border-t border-gray-100 bg-white px-4 pt-3 pb-4">
                <div className="max-w-2xl mx-auto space-y-2.5">
                  <AgentPills />
                  <InputBar />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Hidden file input */}
        <input ref={fileInputRef} type="file" multiple className="hidden" onChange={e => setAttachments(p => [...p, ...Array.from(e.target.files || [])])} accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx" />
      </SidebarInset>
    </SidebarProvider>
  );
};

// Turn Pincer's stored message log into local ChatMessage bubbles.
function mapHistory(history: PincerMessage[]): ChatMessage[] {
  const out: ChatMessage[] = [];
  let counter = 1;
  for (const m of history) {
    if (m.role !== 'user' && m.role !== 'assistant') continue;
    if (!m.content || !m.content.trim()) continue;
    out.push({
      id: counter++,
      text: m.content,
      sender: m.role,
      timestamp: m.timestamp ? new Date(m.timestamp) : new Date(),
    });
  }
  return out;
}

export default Chat;
