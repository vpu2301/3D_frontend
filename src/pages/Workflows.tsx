
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Workflow, Plus, Play, Pause, BarChart, Settings } from 'lucide-react';

const Workflows = () => {
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

  const workflows = [
    { id: 1, name: 'Customer Onboarding', status: 'Active', executions: 145, successRate: '94%', iconColor: 'text-teal-600', bgColor: 'from-teal-100 to-cyan-100' },
    { id: 2, name: 'Invoice Processing', status: 'Active', executions: 289, successRate: '98%', iconColor: 'text-indigo-600', bgColor: 'from-indigo-100 to-blue-100' },
    { id: 3, name: 'Lead Qualification', status: 'Paused', executions: 67, successRate: '92%', iconColor: 'text-amber-600', bgColor: 'from-amber-100 to-yellow-100' },
    { id: 4, name: 'Support Ticket Routing', status: 'Active', executions: 456, successRate: '96%', iconColor: 'text-purple-600', bgColor: 'from-purple-100 to-pink-100' },
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
                  <h1 className="text-3xl font-light text-gray-900">Workflows</h1>
                  <p className="text-gray-600">Design and manage automated business processes</p>
                </div>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workflow
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {workflows.map((workflow) => (
                  <Card key={workflow.id} className="bg-white/80 border-gray-200/50 hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${workflow.bgColor}`}>
                            <Workflow className={`h-4 w-4 ${workflow.iconColor}`} />
                          </div>
                          <span className="font-medium">{workflow.name}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                            {workflow.status === 'Active' ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                          </Button>
                          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className={`text-sm font-medium ${workflow.status === 'Active' ? 'text-green-700' : 'text-amber-700'}`}>
                          Status: {workflow.status}
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded bg-gray-100">
                            <BarChart className="h-3 w-3 text-gray-600" />
                          </div>
                          <span className="text-sm text-gray-700">Executions: {workflow.executions}</span>
                        </div>
                        <p className="text-sm text-gray-700">Success Rate: {workflow.successRate}</p>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 text-xs bg-gray-50 hover:bg-gray-100 border-gray-200"
                          >
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 text-xs bg-gray-50 hover:bg-gray-100 border-gray-200"
                          >
                            Analytics
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

export default Workflows;
