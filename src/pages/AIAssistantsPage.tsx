
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Plus, MessageCircle, Settings } from 'lucide-react';
import CreateAssistantDialog from '@/components/CreateAssistantDialog';

const AIAssistantsPage = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [assistants, setAssistants] = useState([
    { id: 1, name: 'Customer Support Assistant', type: 'Support', conversations: 145, status: 'Active', gradient: 'from-sky-100 to-blue-100' },
    { id: 2, name: 'Sales Assistant', type: 'Sales', conversations: 89, status: 'Active', gradient: 'from-orange-100 to-red-100' },
    { id: 3, name: 'Technical Helper', type: 'Technical', conversations: 67, status: 'Active', gradient: 'from-slate-100 to-gray-100' },
    { id: 4, name: 'HR Assistant', type: 'HR', conversations: 34, status: 'Idle', gradient: 'from-lime-100 to-green-100' },
  ]);

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
  }, [navigate]);

  const handleAssistantCreated = (newAssistant: any) => {
    // Add gradient based on type
    const gradients = [
      'from-violet-100 to-purple-100',
      'from-emerald-100 to-teal-100',
      'from-amber-100 to-yellow-100',
      'from-rose-100 to-pink-100',
      'from-cyan-100 to-blue-100'
    ];
    
    const assistantWithGradient = {
      ...newAssistant,
      gradient: gradients[assistants.length % gradients.length]
    };

    setAssistants(prev => [...prev, assistantWithGradient]);

    // Store in localStorage to persist across page reloads
    const storedAssistants = JSON.parse(localStorage.getItem('aiAssistants') || '[]');
    localStorage.setItem('aiAssistants', JSON.stringify([...storedAssistants, assistantWithGradient]));
  };

  // Load assistants from localStorage on component mount
  useEffect(() => {
    const storedAssistants = JSON.parse(localStorage.getItem('aiAssistants') || '[]');
    if (storedAssistants.length > 0) {
      setAssistants(prev => [...prev, ...storedAssistants.filter((stored: any) => 
        !prev.some(existing => existing.id === stored.id)
      )]);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            
            <main className="flex-1 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <div>
                    <h1 className="text-3xl font-light text-gray-900">AI Assistants</h1>
                    <p className="text-gray-600">Configure and manage your AI-powered assistants</p>
                  </div>
                </div>
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assistant
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assistants.map((assistant) => (
                  <Card key={assistant.id} className={`bg-gradient-to-br ${assistant.gradient} border-0 shadow-sm hover:shadow-lg transition-all duration-200`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          <div className="p-2 rounded-lg bg-white/50 mr-3">
                            <Bot className="h-5 w-5 text-gray-700" />
                          </div>
                          {assistant.name}
                        </span>
                        <Button variant="ghost" size="icon" className="hover:bg-white/30">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-700">Type: {assistant.type}</p>
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded bg-white/40">
                            <MessageCircle className="h-3 w-3 text-gray-600" />
                          </div>
                          <span className="text-sm text-gray-700">Conversations: {assistant.conversations}</span>
                        </div>
                        <div className={`text-sm font-medium ${assistant.status === 'Active' ? 'text-green-700' : 'text-amber-700'}`}>
                          Status: {assistant.status}
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full bg-white/60 hover:bg-white/80 border-white/50"
                        >
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {assistants.length === 0 && (
                <div className="text-center py-12">
                  <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No assistants yet</h3>
                  <p className="text-gray-600 mb-4">Create your first AI assistant to get started</p>
                  <Button 
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Assistant
                  </Button>
                </div>
              )}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>

      <CreateAssistantDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onAssistantCreated={handleAssistantCreated}
      />
    </div>
  );
};

export default AIAssistantsPage;
