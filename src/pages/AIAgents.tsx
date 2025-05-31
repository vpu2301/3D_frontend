
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, Plus, Activity, Zap, Settings } from 'lucide-react';

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
    { id: 1, name: 'Data Processing Agent', purpose: 'Data Analysis', executions: 1250, efficiency: '98%', iconColor: 'text-cyan-600', bgColor: 'from-cyan-100 to-blue-100' },
    { id: 2, name: 'Email Automation Agent', purpose: 'Communication', executions: 890, efficiency: '95%', iconColor: 'text-violet-600', bgColor: 'from-violet-100 to-purple-100' },
    { id: 3, name: 'Report Generation Agent', purpose: 'Reporting', executions: 456, efficiency: '97%', iconColor: 'text-emerald-600', bgColor: 'from-emerald-100 to-green-100' },
    { id: 4, name: 'Invoice Processing Agent', purpose: 'Finance', executions: 234, efficiency: '99%', iconColor: 'text-rose-600', bgColor: 'from-rose-100 to-pink-100' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            
            <main className="flex-1 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-light text-gray-900">AI Agents</h1>
                  <p className="text-gray-600">Autonomous AI agents for task automation</p>
                </div>
                <Button className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Deploy Agent
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agents.map((agent) => (
                  <Card key={agent.id} className="bg-white/80 border-gray-200/50 hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${agent.bgColor}`}>
                            <Bot className={`h-4 w-4 ${agent.iconColor}`} />
                          </div>
                          <span className="font-medium">{agent.name}</span>
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
                            {agent.purpose}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded bg-gray-100">
                            <Activity className="h-3 w-3 text-blue-600" />
                          </div>
                          <span className="text-sm text-gray-700">Executions: {agent.executions}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded bg-gray-100">
                            <Zap className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="text-sm text-gray-700">Efficiency: {agent.efficiency}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 text-xs bg-gray-50 hover:bg-gray-100 border-gray-200"
                          >
                            Configure
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 text-xs bg-gray-50 hover:bg-gray-100 border-gray-200"
                          >
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
