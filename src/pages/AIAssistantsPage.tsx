
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Plus, MessageCircle, Settings } from 'lucide-react';

const AIAssistantsPage = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

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

  const assistants = [
    { id: 1, name: 'Customer Support Assistant', type: 'Support', conversations: 145, status: 'Active', gradient: 'from-sky-100 to-blue-100' },
    { id: 2, name: 'Sales Assistant', type: 'Sales', conversations: 89, status: 'Active', gradient: 'from-orange-100 to-red-100' },
    { id: 3, name: 'Technical Helper', type: 'Technical', conversations: 67, status: 'Active', gradient: 'from-slate-100 to-gray-100' },
    { id: 4, name: 'HR Assistant', type: 'HR', conversations: 34, status: 'Idle', gradient: 'from-lime-100 to-green-100' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
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
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Assistant
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {assistants.map((assistant) => (
                  <Card key={assistant.id} className={`bg-gradient-to-br ${assistant.gradient} border-0 shadow-sm`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Bot className="h-5 w-5 mr-2" />
                          {assistant.name}
                        </span>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">Type: {assistant.type}</p>
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="h-4 w-4" />
                          <span className="text-sm text-gray-600">Conversations: {assistant.conversations}</span>
                        </div>
                        <div className={`text-sm ${assistant.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}`}>
                          Status: {assistant.status}
                        </div>
                        <Button variant="outline" className="w-full">
                          Configure
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AIAssistantsPage;
