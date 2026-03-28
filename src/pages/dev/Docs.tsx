
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, FileText, Code, Users } from 'lucide-react';

const Docs = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (isAuthenticated !== 'true') {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const docSections = [
    {
      title: 'Getting Started',
      description: 'Quick start guides and tutorials',
      icon: BookOpen,
      items: ['Installation', 'First Steps', 'Basic Concepts']
    },
    {
      title: 'API Reference',
      description: 'Complete API documentation',
      icon: Code,
      items: ['Authentication', 'Endpoints', 'Response Codes', 'Rate Limiting']
    },
    {
      title: 'Guides',
      description: 'In-depth tutorials and examples',
      icon: FileText,
      items: ['Creating AI Employees', 'Building Workflows', 'Integrations']
    },
    {
      title: 'Community',
      description: 'Community resources and support',
      icon: Users,
      items: ['Discord', 'GitHub', 'Stack Overflow', 'Bug Reports']
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <main className="flex-1 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Documentation</h1>
                <p className="text-gray-600">Everything you need to build with 3days.ai</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {docSections.map((section, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <section.icon className="h-5 w-5 mr-2 text-blue-600" />
                        {section.title}
                      </CardTitle>
                      <p className="text-gray-600">{section.description}</p>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {section.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer">
                            • {item}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Links */}
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Quick Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h3 className="font-medium mb-2">SDK Downloads</h3>
                      <p className="text-sm text-gray-600">Official SDKs for popular languages</p>
                    </div>
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h3 className="font-medium mb-2">Code Examples</h3>
                      <p className="text-sm text-gray-600">Ready-to-use code snippets</p>
                    </div>
                    <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <h3 className="font-medium mb-2">Video Tutorials</h3>
                      <p className="text-sm text-gray-600">Step-by-step video guides</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Docs;
