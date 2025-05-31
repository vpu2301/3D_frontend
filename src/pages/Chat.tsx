
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, MicOff, Bot, Zap, User, Clock, Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';

const Chat = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{id: number, text: string, sender: 'user' | 'assistant', timestamp: Date}>>([]);
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const fastCommands = [
    { icon: Zap, label: '@Emma', description: 'Sales Assistant', color: 'bg-pink-100' },
    { icon: User, label: '@Aria', description: 'Support Helper', color: 'bg-blue-100' },
    { icon: Clock, label: '@Felix', description: 'Finance Expert', color: 'bg-green-100' },
    { icon: Calendar, label: '@Maya', description: 'Marketing Pro', color: 'bg-purple-100' },
  ];

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');
    
    if (isAuthenticated !== 'true') {
      navigate('/login');
      return;
    }
    
    if (email) {
      setUserEmail(email);
    }

    setMessages([{
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date()
    }]);
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    setIsTyping(e.target.value.length > 0);
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      text: message,
      sender: 'user' as const,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    setIsTyping(false);

    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        text: "I understand you're asking about: '" + message + "'. I'm here to help with your AI automation needs!",
        sender: 'assistant' as const,
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            
            <main className="flex-1 flex flex-col relative">
              <div className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100">
                    <Bot className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-light text-gray-800">AI Chat</h1>
                    <p className="text-gray-500">Chat with your AI assistants</p>
                  </div>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 px-6 pb-32 overflow-y-auto">
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
                        <p className="text-sm">{msg.text}</p>
                        <p className={`text-xs mt-2 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-400'}`}>
                          {msg.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fixed Input Area */}
              <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-gray-100">
                <div className="p-6">
                  <div className="max-w-4xl mx-auto">
                    {/* Fast Commands */}
                    {!isTyping && (
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
                    <div className={`relative transition-all duration-300 ${isTyping ? 'max-w-2xl mx-auto' : 'max-w-3xl'}`}>
                      <Card className="bg-white/90 border-gray-200/50 shadow-lg">
                        <div className="relative p-2">
                          <Input
                            value={message}
                            onChange={handleInputChange}
                            onKeyPress={handleKeyPress}
                            placeholder="Type your message or use @ commands..."
                            className="border-0 bg-transparent text-base pr-16 focus-visible:ring-0 focus-visible:ring-offset-0"
                          />
                          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
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
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Chat;
