
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Mic, MicOff, Bot } from 'lucide-react';

const Chat = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{id: number, text: string, sender: 'user' | 'assistant', timestamp: Date}>>([]);
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [exampleText, setExampleText] = useState('');
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);

  const examplePrompts = [
    "@Emma -> prepare Sales proposal for our products for Zalando Customer Support team",
    "@Aria -> schedule meeting with tech leads for Q1 planning session",
    "@Felix -> analyze Q4 financial reports and create executive summary",
    "@Maya -> create marketing campaign for new product launch",
    "@Atlas -> review and optimize customer support workflows"
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

  // Animated example prompt effect
  useEffect(() => {
    if (isTyping || message.trim()) return;

    const currentPrompt = examplePrompts[currentExampleIndex];
    let charIndex = 0;

    const typeInterval = setInterval(() => {
      if (charIndex <= currentPrompt.length) {
        setExampleText(currentPrompt.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setTimeout(() => {
          setCurrentExampleIndex((prev) => (prev + 1) % examplePrompts.length);
          setExampleText('');
        }, 2000);
      }
    }, 50);

    return () => clearInterval(typeInterval);
  }, [currentExampleIndex, isTyping, message, examplePrompts]);

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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            
            <main className="flex-1 flex flex-col items-center justify-center p-6">
              <div className="w-full max-w-4xl flex flex-col items-center">
                <div className="text-center mb-8">
                  <div className="flex items-center justify-center mb-4">
                    <SidebarTrigger className="mr-4" />
                    <Bot className="h-12 w-12 text-blue-600" />
                  </div>
                  <h1 className="text-4xl font-light text-gray-900 mb-2">AI Chat</h1>
                  <p className="text-gray-600">Interact with your AI assistants through text or voice commands</p>
                </div>

                {/* Messages Area - Only show if there are messages beyond the welcome */}
                {messages.length > 1 && (
                  <div className="w-full mb-6 max-h-96 overflow-y-auto space-y-4 p-4 bg-white rounded-lg border shadow-sm">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            msg.sender === 'user'
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{msg.text}</p>
                          <p className={`text-xs mt-1 ${msg.sender === 'user' ? 'text-blue-100' : 'text-gray-500'}`}>
                            {msg.timestamp.toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Input Area */}
                <div className="w-full max-w-2xl">
                  <div className="relative">
                    <Input
                      value={message}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      placeholder={isTyping || message.trim() ? "Type your message here..." : exampleText || "Type your message here..."}
                      className="pr-20 py-3 text-base"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                      <Button
                        onClick={handleVoiceToggle}
                        variant={isListening ? "default" : "ghost"}
                        size="icon"
                        className={`h-8 w-8 ${isListening ? "bg-red-600 hover:bg-red-700" : ""}`}
                      >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      <Button onClick={handleSendMessage} size="icon" className="h-8 w-8">
                        <Send className="h-4 w-4" />
                      </Button>
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
