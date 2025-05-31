
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Puzzle, Plus, CheckCircle, AlertCircle } from 'lucide-react';

const IntegrationsPage = () => {
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

  const integrations = [
    { id: 1, name: 'Slack', category: 'Communication', status: 'Connected', description: 'Team communication platform' },
    { id: 2, name: 'Salesforce', category: 'CRM', status: 'Connected', description: 'Customer relationship management' },
    { id: 3, name: 'Google Workspace', category: 'Productivity', status: 'Disconnected', description: 'Email and document collaboration' },
    { id: 4, name: 'Zapier', category: 'Automation', status: 'Connected', description: 'Workflow automation platform' },
    { id: 5, name: 'Microsoft Teams', category: 'Communication', status: 'Disconnected', description: 'Video conferencing and chat' },
    { id: 6, name: 'HubSpot', category: 'Marketing', status: 'Connected', description: 'Marketing automation platform' },
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
                    <h1 className="text-3xl font-light text-gray-900">Integrations</h1>
                    <p className="text-gray-600">Connect your favorite tools and services</p>
                  </div>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Integration
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.map((integration) => (
                  <Card key={integration.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Puzzle className="h-5 w-5 mr-2" />
                          {integration.name}
                        </span>
                        {integration.status === 'Connected' ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <p className="text-sm text-gray-600">Category: {integration.category}</p>
                        <p className="text-sm text-gray-500">{integration.description}</p>
                        <div className={`text-sm ${integration.status === 'Connected' ? 'text-green-600' : 'text-yellow-600'}`}>
                          {integration.status}
                        </div>
                        <Button 
                          variant={integration.status === 'Connected' ? 'outline' : 'default'} 
                          className="w-full"
                        >
                          {integration.status === 'Connected' ? 'Configure' : 'Connect'}
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

export default IntegrationsPage;
