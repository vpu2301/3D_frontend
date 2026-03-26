
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Play, Code, Terminal } from 'lucide-react';

const Playground = () => {
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            
            <main className="flex-1 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">API Playground</h1>
                <p className="text-gray-600">Test and experiment with 3days.ai APIs</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Request Panel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      API Request
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Endpoint</label>
                      <input 
                        type="text" 
                        className="w-full p-2 border rounded-md"
                        defaultValue="/api/v1/ai-employees"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Method</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>GET</option>
                        <option>POST</option>
                        <option>PUT</option>
                        <option>DELETE</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Request Body</label>
                      <Textarea 
                        placeholder="Enter JSON request body..."
                        className="h-32"
                      />
                    </div>
                    <Button className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Send Request
                    </Button>
                  </CardContent>
                </Card>

                {/* Response Panel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Terminal className="h-5 w-5 mr-2" />
                      Response
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm h-64 overflow-auto">
                      <p>// Response will appear here</p>
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

export default Playground;
