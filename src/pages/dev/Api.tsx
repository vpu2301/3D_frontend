
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Key, Shield, Zap } from 'lucide-react';

const Api = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (isAuthenticated !== 'true') {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const endpoints = [
    { method: 'GET', path: '/api/v1/ai-employees', description: 'List all AI employees' },
    { method: 'POST', path: '/api/v1/ai-employees', description: 'Create new AI employee' },
    { method: 'GET', path: '/api/v1/tasks', description: 'Get tasks list' },
    { method: 'POST', path: '/api/v1/workflows', description: 'Create workflow' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <main className="flex-1 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">API Documentation</h1>
                <p className="text-gray-600">Comprehensive guide to 3days.ai REST API</p>
              </div>

              <div className="max-w-4xl space-y-8">
                {/* Getting Started */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Zap className="h-5 w-5 mr-2" />
                      Getting Started
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      The 3days.ai API uses REST conventions and returns JSON responses. All requests require authentication.
                    </p>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                      <p>Base URL: https://api.3days.ai/v1</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Authentication */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2" />
                      Authentication
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">
                      Use your API key in the Authorization header:
                    </p>
                    <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm">
                      <p>Authorization: Bearer YOUR_API_KEY</p>
                    </div>
                  </CardContent>
                </Card>

                {/* API Keys */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Key className="h-5 w-5 mr-2" />
                      Your API Keys
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Production Key</p>
                          <p className="text-sm text-gray-600">sk-prod-****************************</p>
                        </div>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Active</Badge>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Development Key</p>
                          <p className="text-sm text-gray-600">sk-dev-****************************</p>
                        </div>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">Active</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Endpoints */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Code className="h-5 w-5 mr-2" />
                      API Endpoints
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {endpoints.map((endpoint, index) => (
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <Badge 
                              variant="secondary" 
                              className={
                                endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800' :
                                endpoint.method === 'POST' ? 'bg-green-100 text-green-800' :
                                'bg-yellow-100 text-yellow-800'
                              }
                            >
                              {endpoint.method}
                            </Badge>
                            <div>
                              <p className="font-mono text-sm">{endpoint.path}</p>
                              <p className="text-sm text-gray-600">{endpoint.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
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

export default Api;
