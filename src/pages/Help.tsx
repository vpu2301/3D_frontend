
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HelpCircle, Search, BookOpen, MessageCircle, Phone, Mail } from 'lucide-react';

const Help = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (isAuthenticated !== 'true') {
      navigate('/login');
      return;
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
    <div className="plat min-h-screen flex flex-col">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col bg-transparent">
            <main className="flex-1 p-6 lg:p-8">
              <div className="mb-8">
                <p className="plat-crumb">3days.help</p>
                <h1 className="mt-1 text-[26px]">Help &amp; Support</h1>
                <p className="mt-1 text-sm" style={{ color: 'var(--text-4)' }}>Get the help you need to make the most of 3days.ai</p>
              </div>

              <div className="max-w-4xl space-y-8">
                {/* Search */}
                <Card className="rounded-[14px] border-[color:var(--line-soft)] bg-white shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Search Help Center</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" style={{ color: 'var(--text-5)' }} />
                      <Input
                        placeholder="Search for help articles, guides, and FAQ..."
                        className="pl-10 !rounded-[10px] border-[color:var(--line)] bg-white"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Help Topics */}
                <div>
                  <h2 className="plat-eyebrow mb-3">Popular Help Topics</h2>
                  <div className="plat-panel !p-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
                      {helpTopics.map((topic, index) => (
                        <div
                          key={index}
                          className="plat-item cursor-pointer transition-colors hover:bg-[rgba(20,22,26,0.04)]"
                        >
                          <span className="plat-item-icon !h-10 !w-10 !rounded-[10px]">
                            <topic.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                          </span>
                          <div className="min-w-0">
                            <h3 className="plat-item-title text-[14px]">{topic.title}</h3>
                            <p className="plat-item-sub mt-0.5">{topic.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Contact Support */}
                <Card className="rounded-[14px] border-[color:var(--line-soft)] bg-white shadow-none">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Contact Support</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <MessageCircle className="h-8 w-8 mx-auto mb-2" strokeWidth={1.5} style={{ color: 'var(--text-4)' }} />
                        <h3 className="text-sm font-semibold">Live Chat</h3>
                        <p className="text-sm mb-3" style={{ color: 'var(--text-4)' }}>Chat with our support team</p>
                        <Button variant="outline" className="plat-btn-ghost mx-auto !h-9 !rounded-full !border !border-[color:var(--line)] !bg-transparent !px-4 !text-xs">Start Chat</Button>
                      </div>
                      <div className="text-center">
                        <Mail className="h-8 w-8 mx-auto mb-2" strokeWidth={1.5} style={{ color: 'var(--text-4)' }} />
                        <h3 className="text-sm font-semibold">Email Support</h3>
                        <p className="text-sm mb-3" style={{ color: 'var(--text-4)' }}>Send us an email</p>
                        <Button variant="outline" className="plat-btn-ghost mx-auto !h-9 !rounded-full !border !border-[color:var(--line)] !bg-transparent !px-4 !text-xs">Send Email</Button>
                      </div>
                      <div className="text-center">
                        <Phone className="h-8 w-8 mx-auto mb-2" strokeWidth={1.5} style={{ color: 'var(--text-4)' }} />
                        <h3 className="text-sm font-semibold">Phone Support</h3>
                        <p className="text-sm mb-3" style={{ color: 'var(--text-4)' }}>Call our support line</p>
                        <Button variant="outline" className="plat-btn-ghost mx-auto !h-9 !rounded-full !border !border-[color:var(--line)] !bg-transparent !px-4 !text-xs">Call Now</Button>
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
