
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Link, Puzzle, Zap, Database, Cloud, Shield, Code, Settings, Users, CheckCircle } from 'lucide-react';

const Integrations = () => {
  const features = [
    {
      icon: Link,
      title: '500+ Pre-built Connectors',
      description: 'Connect instantly with popular business tools including Salesforce, Slack, Microsoft 365, and more.',
      color: 'from-blue-500 to-indigo-500'
    },
    {
      icon: Puzzle,
      title: 'One-Click Setup',
      description: 'Simple integration wizard guides you through connecting your tools in minutes, not hours.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Zap,
      title: 'Real-time Sync',
      description: 'Bidirectional data synchronization ensures all your systems stay up-to-date automatically.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Database,
      title: 'Universal Data Hub',
      description: 'Centralize data from multiple sources into a unified view for better decision making.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Cloud,
      title: 'Cloud & On-Premise',
      description: 'Connect both cloud-based and on-premise systems with enterprise-grade security.',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      icon: Code,
      title: 'Custom APIs',
      description: 'Build custom integrations with our RESTful API and comprehensive developer tools.',
      color: 'from-violet-500 to-purple-500'
    }
  ];

  const categories = [
    {
      name: 'CRM & Sales',
      tools: ['Salesforce', 'HubSpot', 'Pipedrive', 'Zoho CRM'],
      count: '25+ tools',
      color: 'bg-blue-100 text-blue-800'
    },
    {
      name: 'Communication',
      tools: ['Slack', 'Microsoft Teams', 'Discord', 'Zoom'],
      count: '30+ tools',
      color: 'bg-green-100 text-green-800'
    },
    {
      name: 'Productivity',
      tools: ['Google Workspace', 'Microsoft 365', 'Notion', 'Asana'],
      count: '40+ tools',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      name: 'E-commerce',
      tools: ['Shopify', 'WooCommerce', 'Magento', 'BigCommerce'],
      count: '20+ tools',
      color: 'bg-orange-100 text-orange-800'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <main className="pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-light text-gray-900">Integration Hub</h1>
            <p className="text-gray-600">Connect your entire tech stack in one unified ecosystem</p>
          </div>

          {/* Stats Overview */}
          <section className="mb-12">
            <Card className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0">
              <CardContent className="p-6">
                <div className="grid grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-light">500+</div>
                    <div className="text-sm opacity-90">Integrations</div>
                  </div>
                  <div>
                    <div className="text-2xl font-light">99.9%</div>
                    <div className="text-sm opacity-90">Uptime</div>
                  </div>
                  <div>
                    <div className="text-2xl font-light">24/7</div>
                    <div className="text-sm opacity-90">Sync</div>
                  </div>
                  <div>
                    <div className="text-2xl font-light">1-Click</div>
                    <div className="text-sm opacity-90">Setup</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

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
                <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className={`p-3 rounded-2xl bg-gradient-to-r ${feature.color} w-fit mx-auto mb-4`}>
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
                <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-medium text-gray-900">{category.name}</h3>
                      <Badge className={`${category.color} border-0`}>
                        {category.count}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {category.tools.map((tool, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {tool}
                        </span>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Security & Compliance */}
          <section className="mb-12">
            <Card className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-light mb-6 text-center">Enterprise-Grade Security</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="p-3 rounded-full bg-blue-600/20 w-fit mx-auto mb-3">
                      <Shield className="h-8 w-8 text-blue-400" />
                    </div>
                    <h4 className="text-lg font-medium mb-2">Data Protection</h4>
                    <p className="text-gray-300 text-sm">End-to-end encryption and secure data transmission</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 rounded-full bg-green-600/20 w-fit mx-auto mb-3">
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    </div>
                    <h4 className="text-lg font-medium mb-2">Compliance Ready</h4>
                    <p className="text-gray-300 text-sm">SOC 2, GDPR, and HIPAA compliant integrations</p>
                  </div>
                  <div className="text-center">
                    <div className="p-3 rounded-full bg-purple-600/20 w-fit mx-auto mb-3">
                      <Users className="h-8 w-8 text-purple-400" />
                    </div>
                    <h4 className="text-lg font-medium mb-2">Access Control</h4>
                    <p className="text-gray-300 text-sm">Role-based permissions and audit trails</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <Card className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white border-0">
              <CardContent className="p-8">
                <h2 className="text-2xl font-light mb-4">Connect Everything</h2>
                <p className="text-lg mb-6 opacity-90 font-light">
                  Start integrating your tools today and create seamless workflows across your entire tech stack.
                </p>
                <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full">
                  Start Integrating
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Integrations;
