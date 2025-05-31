
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Workflow, Plus, Play, Pause, BarChart } from 'lucide-react';

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
    { id: 1, name: 'Customer Onboarding', status: 'Active', executions: 145, successRate: '94%' },
    { id: 2, name: 'Invoice Processing', status: 'Active', executions: 289, successRate: '98%' },
    { id: 3, name: 'Lead Qualification', status: 'Paused', executions: 67, successRate: '92%' },
    { id: 4, name: 'Support Ticket Routing', status: 'Active', executions: 456, successRate: '96%' },
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
                    <h1 className="text-3xl font-light text-gray-900">Workflows</h1>
                    <p className="text-gray-600">Design and manage automated business processes</p>
                  </div>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workflow
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {workflows.map((workflow) => (
                  <Card key={workflow.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Workflow className="h-5 w-5 mr-2" />
                          {workflow.name}
                        </span>
                        <Button variant="ghost" size="icon">
                          {workflow.status === 'Active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className={`text-sm ${workflow.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}`}>
                          Status: {workflow.status}
                        </div>
                        <div className="flex items-center space-x-2">
                          <BarChart className="h-4 w-4" />
                          <span className="text-sm text-gray-600">Executions: {workflow.executions}</span>
                        </div>
                        <p className="text-sm text-gray-600">Success Rate: {workflow.successRate}</p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          <Button variant="outline" size="sm">
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
