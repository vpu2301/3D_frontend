
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HelpCircle, Search, BookOpen, MessageCircle, Phone, Mail } from 'lucide-react';

const Help = () => {
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

  const helpTopics = [
    { title: 'Getting Started', description: 'Learn the basics of using 3days.ai platform', icon: BookOpen },
    { title: 'AI Employees', description: 'How to create and manage AI employees', icon: HelpCircle },
    { title: 'Workflows', description: 'Building automated workflows and processes', icon: HelpCircle },
    { title: 'Integrations', description: 'Connecting third-party tools and services', icon: HelpCircle },
    { title: 'Troubleshooting', description: 'Common issues and solutions', icon: HelpCircle },
    { title: 'API Documentation', description: 'Developer resources and API guides', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            
            <main className="flex-1 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-light text-gray-900">Help & Support</h1>
                <p className="text-gray-600">Get the help you need to make the most of 3days.ai</p>
              </div>

              <div className="max-w-4xl space-y-8">
                {/* Search */}
                <Card>
                  <CardHeader>
                    <CardTitle>Search Help Center</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search for help articles, guides, and FAQ..."
                        className="pl-10"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Help Topics */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Popular Help Topics</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {helpTopics.map((topic, index) => (
                      <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start space-x-3">
                            <topic.icon className="h-6 w-6 text-blue-600 mt-1" />
                            <div>
                              <h3 className="font-medium text-gray-900">{topic.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{topic.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Contact Support */}
                <Card>
                  <CardHeader>
                    <CardTitle>Contact Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <MessageCircle className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <h3 className="font-medium">Live Chat</h3>
                        <p className="text-sm text-gray-600 mb-3">Chat with our support team</p>
                        <Button variant="outline">Start Chat</Button>
                      </div>
                      <div className="text-center">
                        <Mail className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <h3 className="font-medium">Email Support</h3>
                        <p className="text-sm text-gray-600 mb-3">Send us an email</p>
                        <Button variant="outline">Send Email</Button>
                      </div>
                      <div className="text-center">
                        <Phone className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <h3 className="font-medium">Phone Support</h3>
                        <p className="text-sm text-gray-600 mb-3">Call our support line</p>
                        <Button variant="outline">Call Now</Button>
                      </div>
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

export default Help;
