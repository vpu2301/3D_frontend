import { useState, useEffect, useRef } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Send, Mic, MicOff, Bot, User,
  Paperclip, X, FileText, Image, Plus, MessageSquare, Hash,
  Zap, Clock, Calendar
} from 'lucide-react';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  attachments?: Array<{
    name: string;
    type: string;
    size: number;
    url: string;
  }>;
}

interface ChatHistory {
  id: string;
  title: string;
  lastMessage: string;
  timestamp: Date;
  messageCount: number;
}

const Chat = () => {
  console.log('=== Chat component starting to render ===');

  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>('current');
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';

  const fastCommands = [
    { icon: Zap, label: '@Emma', description: 'Sales Assistant', color: '#fce7f3' },
    { icon: User, label: '@Aria', description: 'Support Helper', color: '#dbeafe' },
    { icon: Clock, label: '@Felix', description: 'Finance Expert', color: '#dcfce7' },
    { icon: Calendar, label: '@Maya', description: 'Marketing Pro', color: '#ede9fe' },
  ];

  const hasStarted = messages.some(m => m.sender === 'user');

  useEffect(() => {
    console.log('=== Chat useEffect running ===');

    const welcomeMessage = {
      id: 1,
      text: "Hello! Welcome to 3days.ai. I'm your AI assistant. Try asking me to help you with tasks like 'Create a marketing plan for my new product' or 'Analyze my sales data'. How can I help you today?",
      sender: 'assistant' as const,
      timestamp: new Date()
    };

    console.log('Setting welcome message:', welcomeMessage);
    setMessages([welcomeMessage]);

    const sampleHistory: ChatHistory[] = [
      {
        id: 'chat-1',
        title: 'Project Planning Discussion',
        lastMessage: 'Thanks for the help with the timeline!',
        timestamp: new Date(Date.now() - 86400000),
        messageCount: 12
      },
      {
        id: 'chat-2',
        title: 'Budget Analysis',
        lastMessage: 'Can you review these numbers?',
        timestamp: new Date(Date.now() - 172800000),
        messageCount: 8
      }
    ];

    console.log('Setting chat history:', sampleHistory);
    setChatHistory(sampleHistory);
    setIsLoading(false);
    console.log('=== Chat initialization complete ===');
  }, []);

  useEffect(() => {
    if (hasStarted) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, hasStarted]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  };

  const handleFileAttach = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setAttachments(prev => [...prev, ...files]);
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if (!message.trim() && attachments.length === 0) return;

    const messageAttachments = attachments.map(file => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file)
    }));

    const newMessage: ChatMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user',
      timestamp: new Date(),
      attachments: messageAttachments.length > 0 ? messageAttachments : undefined
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setAttachments([]);
    setIsTyping(false);

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    setTimeout(() => {
      const response: ChatMessage = {
        id: messages.length + 2,
        text: attachments.length > 0
          ? `I can see you've shared ${attachments.length} file(s). I'll analyze them and help you with: "${message || 'the attached files'}". Here's a task I can create for you: "Process and analyze uploaded documents for insights and recommendations."`
          : `I understand you're asking about: "${message}". Let me create a task for this: "AI Employee will handle: ${message}". I'll assign this to the most suitable AI assistant and get started right away!`,
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const handleVoiceToggle = () => {
    setIsListening(!isListening);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFastCommand = (command: string) => {
    setMessage(command + ' ');
    setIsTyping(true);
    textareaRef.current?.focus();
  };

  const selectChatHistory = (chatId: string) => {
    setCurrentChatId(chatId);
    if (chatId !== 'current') {
      setMessages([{
        id: 1,
        text: `Loading conversation: ${chatHistory.find(c => c.id === chatId)?.title}...`,
        sender: 'assistant',
        timestamp: new Date()
      }]);
    }
  };

  const startNewChat = () => {
    setCurrentChatId('current');
    setMessages([{
      id: 1,
      text: "Hello! Welcome to 3days.ai. I'm your AI assistant. Try asking me to help you with tasks like 'Create a marketing plan for my new product' or 'Analyze my sales data'. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date()
    }]);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return Image;
    return FileText;
  };

  const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  console.log('=== Chat render state ===', { messagesCount: messages.length, currentChatId, isLoading });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-gray-200 border-t-gray-600 mx-auto mb-4"></div>
          <p className="text-sm text-gray-500">Loading chat...</p>
        </div>
      </div>
    );
  }

  // --- Shared: Agent pills ---
  const AgentPills = ({ small = false }: { small?: boolean }) => (
    <div className="flex flex-wrap gap-1.5">
      {fastCommands.map((command, index) => (
        <button
          key={index}
          onClick={() => handleFastCommand(command.label)}
          className={`flex items-center gap-1 rounded-full font-medium text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-150 ${
            small ? 'px-2 py-0.5 text-xs' : 'px-3 py-1.5 text-xs shadow-sm'
          }`}
          style={{ backgroundColor: command.color + (small ? '60' : '80') }}
        >
          <Hash className={`opacity-50 ${small ? 'h-2.5 w-2.5' : 'h-3 w-3'}`} />
          <span>{command.label.replace('@', '')}</span>
          {!small && (
            <>
              <span className="text-gray-400">·</span>
              <span className="text-gray-500 font-normal">{command.description}</span>
            </>
          )}
        </button>
      ))}
    </div>
  );

  // --- Shared: Input box ---
  const InputBox = ({ compact = false, actionsBelow = false }: { compact?: boolean; actionsBelow?: boolean }) => (
    <div className={compact ? '' : 'w-full max-w-2xl mx-auto'}>
      {attachments.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2 px-1">
          {attachments.map((file, index) => {
            const FileIcon = getFileIcon(file.type);
            return (
              <div key={index} className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-1.5 rounded-lg border border-gray-200">
                <FileIcon className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-xs text-gray-700 truncate max-w-28">{file.name}</span>
                <button onClick={() => removeAttachment(index)} className="text-gray-400 hover:text-gray-600 ml-0.5">
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className={`relative bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 focus-within:border-gray-300 focus-within:shadow-md`}>
        <textarea
          ref={textareaRef}
          value={message}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Message AI assistant... (Shift+Enter for new line)"
          rows={1}
          className={`w-full resize-none bg-transparent text-sm text-gray-800 placeholder-gray-400 px-4 focus:outline-none leading-relaxed ${
            actionsBelow ? 'pt-3 pb-3' : 'pt-3.5 pb-12'
          }`}
          style={{ minHeight: '52px', maxHeight: '200px' }}
        />
        {!actionsBelow && (
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <button
              onClick={handleFileAttach}
              className="flex items-center justify-center h-7 w-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Paperclip className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleVoiceToggle}
                className={`flex items-center justify-center h-7 w-7 rounded-lg transition-colors ${
                  isListening
                    ? 'bg-red-100 text-red-500 hover:bg-red-200'
                    : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                }`}
              >
                {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!message.trim() && attachments.length === 0}
                className={`flex items-center justify-center h-7 w-7 rounded-lg transition-all duration-150 ${
                  message.trim() || attachments.length > 0
                    ? 'bg-gray-900 text-white hover:bg-gray-700 shadow-sm'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {actionsBelow && (
        <div className="flex items-center justify-between mt-2 px-0.5">
          <button
            onClick={handleFileAttach}
            className="flex items-center justify-center h-7 w-7 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleVoiceToggle}
              className={`flex items-center justify-center h-7 w-7 rounded-lg transition-colors ${
                isListening
                  ? 'bg-red-100 text-red-500 hover:bg-red-200'
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
              }`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!message.trim() && attachments.length === 0}
              className={`flex items-center gap-1.5 px-3 h-7 rounded-lg text-xs font-medium transition-all duration-150 ${
                message.trim() || attachments.length > 0
                  ? 'bg-gray-900 text-white hover:bg-gray-700 shadow-sm'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="h-3 w-3" />
              <span>Send</span>
            </button>
          </div>
        </div>
      )}

      {!actionsBelow && (
        <p className="text-center text-xs text-gray-400 mt-2">
          AI can make mistakes. Consider checking important information.
        </p>
      )}
    </div>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-row min-h-0">

          {/* ── Main Chat Column ── */}
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {!hasStarted ? (
              /* ── EMPTY STATE: centered layout ── */
              <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 overflow-y-auto">
                <div className="w-full max-w-2xl flex flex-col items-center gap-8">

                  {/* Branding */}
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl bg-[#bdd8ec] mb-5">
                      <Bot className="h-7 w-7 text-gray-700" />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-1.5">How can I help you today?</h1>
                    <p className="text-gray-500 text-sm">Chat with your AI employees or ask anything</p>
                  </div>

                  {/* Suggestion cards */}
                  <div className="grid grid-cols-2 gap-3 w-full">
                    {[
                      { title: 'Create a marketing plan', sub: 'for my new product launch' },
                      { title: 'Analyze sales data', sub: 'and generate a summary report' },
                      { title: 'Draft a project timeline', sub: 'with milestones and deliverables' },
                      { title: 'Prepare a budget overview', sub: 'for Q2 planning session' },
                    ].map((s, i) => (
                      <button
                        key={i}
                        onClick={() => { setMessage(s.title + ' ' + s.sub); setIsTyping(true); textareaRef.current?.focus(); }}
                        className="text-left p-4 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-150 group"
                      >
                        <p className="text-sm font-medium text-gray-800 mb-0.5 group-hover:text-gray-900">{s.title}</p>
                        <p className="text-xs text-gray-400">{s.sub}</p>
                      </button>
                    ))}
                  </div>

                  {/* Agent @ pills */}
                  <div className="w-full">
                    <p className="text-xs text-gray-400 mb-2.5 font-medium uppercase tracking-wide">Available agents</p>
                    <AgentPills />
                  </div>

                  {/* Centered input */}
                  <div className="w-full">
                    <InputBox />
                  </div>
                </div>
              </div>
            ) : (
              /* ── ACTIVE CHAT STATE ── */
              <>
                {/* Slim header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#bdd8ec]">
                      <Bot className="h-4 w-4 text-gray-700" />
                    </div>
                    <span className="text-sm font-medium text-gray-800">AI Chat</span>
                  </div>
                  <button
                    onClick={startNewChat}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    New chat
                  </button>
                </div>

                {/* Messages area */}
                <div className="flex-1 overflow-y-auto">
                  <div className="max-w-3xl mx-auto py-8 px-4 space-y-6">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar */}
                        <div className={`shrink-0 flex items-start pt-0.5 ${msg.sender === 'user' ? 'ml-2' : 'mr-2'}`}>
                          {msg.sender === 'assistant' ? (
                            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#bdd8ec]">
                              <Bot className="h-4 w-4 text-gray-700" />
                            </div>
                          ) : (
                            <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-800">
                              <User className="h-3.5 w-3.5 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Bubble */}
                        <div className={`flex flex-col max-w-[75%] ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                          {msg.sender === 'assistant' ? (
                            <div className="text-sm text-gray-800 leading-relaxed">
                              {msg.text}
                            </div>
                          ) : (
                            <div className="bg-gray-900 text-white text-sm px-4 py-2.5 rounded-2xl rounded-tr-sm leading-relaxed">
                              {msg.text}
                            </div>
                          )}

                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-2 flex flex-col gap-1.5">
                              {msg.attachments.map((att, i) => {
                                const FileIcon = getFileIcon(att.type);
                                return (
                                  <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg border border-gray-200">
                                    <FileIcon className="h-3.5 w-3.5 text-gray-500" />
                                    <span className="text-xs text-gray-700 truncate max-w-48">{att.name}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}

                          <span className="text-xs text-gray-400 mt-1 px-1">{formatTime(msg.timestamp)}</span>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>

                {/* Bottom input bar */}
                <div className="shrink-0 bg-white border-t border-gray-100 px-4 pt-3 pb-4">
                  <div className="max-w-3xl mx-auto">
                    {/* Agent pills — always above input */}
                    <div className="mb-2">
                      <AgentPills small />
                    </div>
                    <InputBox compact actionsBelow />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── History Sidebar ── */}
          <div className="w-64 shrink-0 border-l border-gray-100 flex flex-col bg-gray-50/50 h-full">
            <div className="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">History</span>
              </div>
              <button
                onClick={startNewChat}
                className="flex items-center justify-center h-6 w-6 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-3 space-y-1">
                {/* Today section */}
                <p className="text-xs font-medium text-gray-400 px-2 py-1.5 uppercase tracking-wide">Today</p>

                <button
                  onClick={() => selectChatHistory('current')}
                  className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors group ${
                    currentChatId === 'current'
                      ? 'bg-white border border-gray-200 shadow-sm'
                      : 'hover:bg-white/70'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-0.5">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 shrink-0"></div>
                    <span className={`text-sm truncate ${currentChatId === 'current' ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                      Current Chat
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 truncate pl-3.5">Active conversation</p>
                </button>

                {/* Older section */}
                {chatHistory.length > 0 && (
                  <p className="text-xs font-medium text-gray-400 px-2 py-1.5 uppercase tracking-wide mt-2">Earlier</p>
                )}

                {chatHistory.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => selectChatHistory(chat.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                      currentChatId === chat.id
                        ? 'bg-white border border-gray-200 shadow-sm'
                        : 'hover:bg-white/70'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className={`text-sm truncate ${currentChatId === chat.id ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                        {chat.title}
                      </span>
                      <span className="text-xs text-gray-300 shrink-0 ml-2">{chat.messageCount}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{chat.lastMessage}</p>
                    <p className="text-xs text-gray-300 mt-0.5">
                      {chat.timestamp.toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </p>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
          />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Chat;
