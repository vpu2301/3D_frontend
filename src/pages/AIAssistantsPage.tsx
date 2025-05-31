
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
    { id: 1, name: 'Customer Support Assistant', type: 'Support', conversations: 145, status: 'Active', iconColor: 'text-sky-600', bgColor: 'from-sky-100 to-blue-100' },
    { id: 2, name: 'Sales Assistant', type: 'Sales', conversations: 89, status: 'Active', iconColor: 'text-orange-600', bgColor: 'from-orange-100 to-red-100' },
    { id: 3, name: 'Technical Helper', type: 'Technical', conversations: 67, status: 'Active', iconColor: 'text-slate-600', bgColor: 'from-slate-100 to-gray-100' },
    { id: 4, name: 'HR Assistant', type: 'HR', conversations: 34, status: 'Idle', iconColor: 'text-lime-600', bgColor: 'from-lime-100 to-green-100' },
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
    const gradientOptions = [
      { iconColor: 'text-violet-600', bgColor: 'from-violet-100 to-purple-100' },
      { iconColor: 'text-emerald-600', bgColor: 'from-emerald-100 to-teal-100' },
      { iconColor: 'text-amber-600', bgColor: 'from-amber-100 to-yellow-100' },
      { iconColor: 'text-rose-600', bgColor: 'from-rose-100 to-pink-100' },
      { iconColor: 'text-cyan-600', bgColor: 'from-cyan-100 to-blue-100' }
    ];
    
    const colorScheme = gradientOptions[assistants.length % gradientOptions.length];
    const assistantWithGradient = {
      ...newAssistant,
      ...colorScheme
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
                  <Card key={assistant.id} className="bg-white/80 border-gray-200/50 hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${assistant.bgColor}`}>
                            <Bot className={`h-4 w-4 ${assistant.iconColor}`} />
                          </div>
                          <span className="font-medium">{assistant.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                            {assistant.type}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded bg-gray-100">
                            <MessageCircle className="h-3 w-3 text-gray-600" />
                          </div>
                          <span className="text-sm text-gray-700">Conversations: {assistant.conversations}</span>
                        </div>
                        <div className={`text-sm font-medium ${assistant.status === 'Active' ? 'text-green-700' : 'text-amber-700'}`}>
                          Status: {assistant.status}
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full text-xs bg-gray-50 hover:bg-gray-100 border-gray-200"
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
