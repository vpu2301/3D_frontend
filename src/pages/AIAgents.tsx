
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Plus, Activity, Zap } from 'lucide-react';

const AIAgents = () => {
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

  const agents = [
    { id: 1, name: 'Data Processing Agent', purpose: 'Data Analysis', executions: 1250, efficiency: '98%' },
    { id: 2, name: 'Email Automation Agent', purpose: 'Communication', executions: 890, efficiency: '95%' },
    { id: 3, name: 'Report Generation Agent', purpose: 'Reporting', executions: 456, efficiency: '97%' },
    { id: 4, name: 'Invoice Processing Agent', purpose: 'Finance', executions: 234, efficiency: '99%' },
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
                    <h1 className="text-3xl font-light text-gray-900">AI Agents</h1>
                    <p className="text-gray-600">Autonomous AI agents for task automation</p>
                  </div>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Deploy Agent
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {agents.map((agent) => (
                  <Card key={agent.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Bot className="h-5 w-5 mr-2" />
                        {agent.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <p className="text-sm text-gray-600">Purpose: {agent.purpose}</p>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-600">Executions: {agent.executions}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Zap className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-600">Efficiency: {agent.efficiency}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Configure
                          </Button>
                          <Button variant="outline" size="sm">
                            Monitor
                          </Button>
                        </div>
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

export default AIAgents;
