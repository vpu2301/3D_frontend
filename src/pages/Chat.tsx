import { useState, useEffect, useRef } from 'react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Mic, MicOff, Bot, Zap, User, Clock, Calendar, Paperclip, X, FileText, Image } from 'lucide-react';
import { Card } from '@/components/ui/card';

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

  // Get user email from localStorage (should be available since this is a protected route)
  const userEmail = localStorage.getItem('userEmail') || 'user@example.com';

  const fastCommands = [
    { icon: Zap, label: '@Emma', description: 'Sales Assistant', color: 'bg-pink-100' },
    { icon: User, label: '@Aria', description: 'Support Helper', color: 'bg-blue-100' },
    { icon: Clock, label: '@Felix', description: 'Finance Expert', color: 'bg-green-100' },
    { icon: Calendar, label: '@Maya', description: 'Marketing Pro', color: 'bg-purple-100' },
  ];

  useEffect(() => {
    console.log('=== Chat useEffect running ===');
    
    // Initialize with welcome message
    const welcomeMessage = {
      id: 1,
      text: "Hello! Welcome to 3days.ai. I'm your AI assistant. Try asking me to help you with tasks like 'Create a marketing plan for my new product' or 'Analyze my sales data'. How can I help you today?",
      sender: 'assistant' as const,
      timestamp: new Date()
    };
    
    console.log('Setting welcome message:', welcomeMessage);
    setMessages([welcomeMessage]);

    // Sample chat history
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFastCommand = (command: string) => {
    setMessage(command + ' ');
    setIsTyping(true);
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

  console.log('=== Chat render state ===', { 
    messagesCount: messages.length, 
    currentChatId,
    isLoading
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(30,25%,97%)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-[hsl(30,25%,97%)]">
        <AppSidebar />
        <SidebarInset className="flex-1">
          <LoggedInHeader userEmail={userEmail} />
          
          <main className="flex-1 flex">
            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col relative">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100">
                      <Bot className="h-8 w-8 text-blue-600" />
                    </div>
                    <div>
                      <h1 className="text-3xl font-light text-gray-800">AI Chat</h1>
                      <p className="text-gray-500">Chat with your AI assistants</p>
                    </div>
                  </div>
                  <Button onClick={startNewChat} variant="outline" size="sm">
                    New Chat
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto pb-40">
                <div className="p-6">
                  <div className="max-w-4xl mx-auto space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                            msg.sender === 'user'
                              ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white'
                              : 'bg-white border border-gray-100 text-gray-800'
                          }`}
                        >
                          {msg.text && <p className="text-sm">{msg.text}</p>}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {msg.attachments.map((attachment, index) => {
                                const FileIcon = getFileIcon(attachment.type);
                                return (
                                  <div key={index} className="flex items-center space-x-2 p-2 bg-black/10 rounded-lg">
                                    <FileIcon className="h-4 w-4" />
                                    <span className="text-xs truncate">{attachment.name}</span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                          <p className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </div>

              {/* Fixed Input Area */}
              <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-100 p-6">
                <div className="max-w-4xl mx-auto">
                  {/* Attachments Preview */}
                  {attachments.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {attachments.map((file, index) => {
                        const FileIcon = getFileIcon(file.type);
                        return (
                          <div key={index} className="flex items-center space-x-2 bg-gray-100 px-3 py-2 rounded-lg">
                            <FileIcon className="h-4 w-4 text-gray-600" />
                            <span className="text-sm text-gray-700 truncate max-w-32">{file.name}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeAttachment(index)}
                              className="h-auto p-1"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Fast Commands */}
                  {!isTyping && attachments.length === 0 && (
                    <div className="mb-4 flex flex-wrap gap-2">
                      {fastCommands.map((command, index) => (
                        <Button
                          key={index}
                          variant="ghost"
                          size="sm"
                          onClick={() => handleFastCommand(command.label)}
                          className={`${command.color} text-gray-700 hover:scale-105 transition-all duration-200 border border-gray-200/50`}
                        >
                          <command.icon className="h-3 w-3 mr-2" />
                          <span className="text-xs font-medium">{command.label}</span>
                          <span className="text-xs text-gray-500 ml-1">- {command.description}</span>
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Input Field */}
                  <div className={`relative transition-all duration-300 ${isTyping || attachments.length > 0 ? 'max-w-2xl mx-auto' : 'max-w-3xl'}`}>
                    <Card className="bg-white/90 border-gray-200/50 shadow-lg">
                      <div className="relative p-2">
                        <Input
                          value={message}
                          onChange={handleInputChange}
                          onKeyPress={handleKeyPress}
                          placeholder="Try: 'Create a marketing plan for my startup' or 'Help me organize my project tasks'..."
                          className="border-0 bg-transparent text-base pr-20 focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                          <Button
                            onClick={handleFileAttach}
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                          >
                            <Paperclip className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={handleVoiceToggle}
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 rounded-full transition-all duration-200 ${
                              isListening 
                                ? "bg-red-100 text-red-600 hover:bg-red-200" 
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                          </Button>
                          <Button 
                            onClick={handleSendMessage} 
                            size="icon" 
                            className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transition-all duration-200"
                          >
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat History Sidebar */}
            <div className="w-80 bg-white border-l border-gray-100 flex flex-col">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-medium text-gray-900">Chat History</h3>
              </div>
              <ScrollArea className="flex-1">
                <div className="p-4 space-y-2">
                  <div
                    onClick={() => selectChatHistory('current')}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      currentChatId === 'current' 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="font-medium text-sm">Current Chat</span>
                    </div>
                    <p className="text-xs text-gray-600 truncate">Active conversation</p>
                    <p className="text-xs text-gray-400 mt-1">Now</p>
                  </div>
                  {chatHistory.map((chat) => (
                    <div
                      key={chat.id}
                      onClick={() => selectChatHistory(chat.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        currentChatId === chat.id 
                          ? 'bg-blue-50 border border-blue-200' 
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm truncate">{chat.title}</span>
                        <span className="text-xs text-gray-400">{chat.messageCount}</span>
                      </div>
                      <p className="text-xs text-gray-600 truncate">{chat.lastMessage}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {chat.timestamp.toLocaleDateString()}
                      </p>
                    </div>
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
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Chat;
