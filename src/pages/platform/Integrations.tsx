import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Link, Puzzle, Zap, Database, Cloud, Shield, Code, Settings, Users } from 'lucide-react';

const Integrations = () => {
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

  const features = [
    {
      icon: Link,
      title: '500+ Pre-built Connectors',
      description: 'Connect instantly with popular business tools including Salesforce, Slack, Microsoft 365, and more.'
    },
    {
      icon: Puzzle,
      title: 'One-Click Setup',
      description: 'Simple integration wizard guides you through connecting your tools in minutes, not hours.'
    },
    {
      icon: Zap,
      title: 'Real-time Sync',
      description: 'Bidirectional data synchronization ensures all your systems stay up-to-date automatically.'
    },
    {
      icon: Database,
      title: 'Universal Data Hub',
      description: 'Centralize data from multiple sources into a unified view for better decision making.'
    },
    {
      icon: Cloud,
      title: 'Cloud & On-Premise',
      description: 'Connect both cloud-based and on-premise systems with enterprise-grade security.'
    },
    {
      icon: Code,
      title: 'Custom APIs',
      description: 'Build custom integrations with our RESTful API and comprehensive developer tools.'
    }
  ];

  const categories = [
    {
      name: 'CRM & Sales',
      tools: ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM'],
      count: '25+ tools'
    },
    {
      name: 'Communication',
      tools: ['Slack', 'Microsoft Teams', 'Discord', 'Zoom'],
      count: '30+ tools'
    },
    {
      name: 'Productivity',
      tools: ['Google Workspace', 'Microsoft 365', 'Notion', 'Asana'],
      count: '40+ tools'
    },
    {
      name: 'E-commerce',
      tools: ['Shopify', 'WooCommerce', 'Magento', 'BigCommerce'],
      count: '20+ tools'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            
            <main className="flex-1 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-light text-gray-900">Integration Hub</h1>
                <p className="text-gray-600">Connect your entire tech stack in one unified ecosystem</p>
              </div>

              {/* Features Grid */}
              <section className="mb-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-light text-gray-900 mb-4">Integration Features</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Built for enterprise-scale connectivity and reliability
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map((feature, index) => (
                    <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                      <CardContent className="p-6 text-center">
                        <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 w-fit mx-auto mb-4">
                          <feature.icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-3">{feature.title}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Integration Categories */}
              <section className="mb-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-light text-gray-900 mb-4">Popular Integration Categories</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Connect with the tools your team already uses and loves
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {categories.map((category, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xl font-medium text-gray-900">{category.name}</h3>
                        <span className="text-sm text-blue-600 font-medium">{category.count}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {category.tools.map((tool, idx) => (
                          <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* Security & Compliance */}
              <section className="mb-12">
                <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-light mb-6 text-center">Enterprise-Grade Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <Shield className="h-10 w-10 text-blue-400 mx-auto mb-3" />
                      <h4 className="text-lg font-medium mb-2">Data Protection</h4>
                      <p className="text-gray-300 text-sm">End-to-end encryption and secure data transmission</p>
                    </div>
                    <div className="text-center">
                      <Settings className="h-10 w-10 text-green-400 mx-auto mb-3" />
                      <h4 className="text-lg font-medium mb-2">Compliance Ready</h4>
                      <p className="text-gray-300 text-sm">SOC 2, GDPR, and HIPAA compliant integrations</p>
                    </div>
                    <div className="text-center">
                      <Users className="h-10 w-10 text-purple-400 mx-auto mb-3" />
                      <h4 className="text-lg font-medium mb-2">Access Control</h4>
                      <p className="text-gray-300 text-sm">Role-based permissions and audit trails</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* CTA Section */}
              <section className="text-center">
                <div className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white p-8 rounded-2xl">
                  <h2 className="text-3xl font-light mb-4 tracking-tight">Connect Everything</h2>
                  <p className="text-lg mb-6 opacity-90 font-light">
                    Start integrating your tools today and create seamless workflows across your entire tech stack.
                  </p>
                  <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full py-3">
                    Start Integrating
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </section>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Integrations;
