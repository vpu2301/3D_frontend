
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Link, Puzzle, Zap, Database, Cloud, Shield, Code, Settings, Users } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const Integrations = () => {
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
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Integration Hub
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Connect your entire tech stack in one unified ecosystem. Seamlessly integrate with 500+ 
              applications and create workflows that span across all your business tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full" asChild>
                <RouterLink to="/start-free-trial">Browse Integrations</RouterLink>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <RouterLink to="/watch-demo">See How It Works</RouterLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Integration Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for enterprise-scale connectivity and reliability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 w-fit mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Categories */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Popular Integration Categories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with the tools your team already uses and loves
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-lg">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-medium text-gray-900">{category.name}</h3>
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
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-light mb-8 text-center">Enterprise-Grade Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Shield className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Data Protection</h4>
                <p className="text-gray-300">End-to-end encryption and secure data transmission</p>
              </div>
              <div className="text-center">
                <Settings className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Compliance Ready</h4>
                <p className="text-gray-300">SOC 2, GDPR, and HIPAA compliant integrations</p>
              </div>
              <div className="text-center">
                <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Access Control</h4>
                <p className="text-gray-300">Role-based permissions and audit trails</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Connect Everything</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Start integrating your tools today and create seamless workflows across your entire tech stack.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full py-3" asChild>
            <RouterLink to="/start-free-trial">
              Start Integrating
              <ArrowRight className="ml-2 h-4 w-4" />
            </RouterLink>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Integrations;
