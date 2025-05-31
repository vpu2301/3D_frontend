
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Send, Mic, MicOff, Bot } from 'lucide-react';

const Chat = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<{id: number, text: string, sender: 'user' | 'assistant', timestamp: Date}>>([]);
  const [isListening, setIsListening] = useState(false);

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

    // Add welcome message
    setMessages([{
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      sender: 'assistant',
      timestamp: new Date()
    }]);
  }, [navigate]);

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

    // Simulate AI response
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
    // Voice functionality would be implemented here
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
            
            <main className="flex-1 p-6">
              <div className="flex items-center space-x-4 mb-6">
                <SidebarTrigger />
                <div>
                  <h1 className="text-3xl font-light text-gray-900">AI Chat</h1>
                  <p className="text-gray-600">Interact with your AI assistants through text or voice commands</p>
                </div>
              </div>

              <div className="max-w-4xl mx-auto">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bot className="h-5 w-5 mr-2" />
                      AI Assistant Chat
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                              msg.sender === 'user'
                                ? 'bg-blue-600 text-white'
                                : 'bg-white border shadow-sm'
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

                    {/* Input Area */}
                    <div className="flex items-end space-x-2">
                      <div className="flex-1">
                        <Textarea
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type your message here..."
                          className="min-h-[60px] resize-none"
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Button
                          onClick={handleVoiceToggle}
                          variant={isListening ? "default" : "outline"}
                          size="icon"
                          className={isListening ? "bg-red-600 hover:bg-red-700" : ""}
                        >
                          {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                        </Button>
                        <Button onClick={handleSendMessage} size="icon">
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Chat;
