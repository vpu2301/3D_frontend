import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Book, Code, Zap, Shield, Database, Settings, ArrowRight, FileText, Download, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Documentation = () => {
  const sections = [
    {
      icon: Book,
      title: 'Getting Started',
      description: 'Quick start guides and basic concepts',
      articles: [
        'Installation and Setup',
        'Your First Workflow',
        'Understanding the Dashboard',
        'Basic Configuration'
      ]
    },
    {
      icon: Code,
      title: 'API Reference',
      description: 'Complete API documentation and examples',
      articles: [
        'Authentication',
        'Endpoints Overview',
        'Rate Limiting',
        'Error Handling'
      ]
    },
    {
      icon: Zap,
      title: 'Automation Guides',
      description: 'Advanced automation workflows and patterns',
      articles: [
        'Workflow Best Practices',
        'Conditional Logic',
        'Error Recovery',
        'Performance Optimization'
      ]
    },
    {
      icon: Database,
      title: 'Integrations',
      description: 'Connect with third-party services and tools',
      articles: [
        'Popular Integrations',
        'Custom Connectors',
        'Data Mapping',
        'Webhook Configuration'
      ]
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Security best practices and compliance',
      articles: [
        'Data Encryption',
        'Access Control',
        'Audit Logs',
        'Compliance Standards'
      ]
    },
    {
      icon: Settings,
      title: 'Administration',
      description: 'User management and system configuration',
      articles: [
        'User Roles',
        'Organization Settings',
        'Billing Management',
        'System Monitoring'
      ]
    }
  ];

  const quickLinks = [
    {
      title: 'API Quick Start',
      description: 'Get up and running with our API in 5 minutes',
      time: '5 min',
      icon: Code
    },
    {
      title: 'Webhook Setup Guide',
      description: 'Learn how to configure webhooks for real-time updates',
      time: '8 min',
      icon: Zap
    },
    {
      title: 'Security Checklist',
      description: 'Essential security configurations for your account',
      time: '10 min',
      icon: Shield
    }
  ];

  const downloadResources = [
    {
      title: 'API Postman Collection',
      description: 'Ready-to-use Postman collection for testing our API',
      type: 'JSON',
      size: '2.4 MB'
    },
    {
      title: 'SDK Documentation',
      description: 'Complete SDK documentation for popular languages',
      type: 'PDF',
      size: '15.2 MB'
    },
    {
      title: 'Integration Templates',
      description: 'Pre-built templates for common integrations',
      type: 'ZIP',
      size: '8.7 MB'
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[color:var(--sand)] to-[color:var(--paper)] dark:from-[color:var(--bg)] dark:to-[color:var(--paper)]">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-light text-[color:var(--ink)] mb-6 tracking-tight">
            Documentation
          </h1>
          <p className="text-xl text-[color:var(--text-2)] mb-8 font-light">
            Comprehensive guides, API references, and technical documentation to help you build amazing automations
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-4 h-5 w-5 text-[color:var(--text-2)]" />
            <Input 
              placeholder="Search documentation..." 
              className="pl-12 py-4 text-lg rounded-full border-[color:var(--line)] focus:border-[color:var(--ink)]"
            />
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Quick Start</h2>
            <p className="text-xl text-[color:var(--text-2)]">Get started with these popular guides</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quickLinks.map((link, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <CardContent className="p-8">
                  <div className="p-4 rounded-[28px] bg-[color:var(--ink)] w-fit mb-6">
                    <link.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-[color:var(--ink)] mb-4">{link.title}</h3>
                  <p className="text-[color:var(--text-2)] mb-4 leading-relaxed">{link.description}</p>
                  <span className="text-sm text-[color:var(--blue)] font-medium">{link.time}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-20 px-4 bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Documentation Sections</h2>
            <p className="text-xl text-[color:var(--text-2)]">Explore our comprehensive documentation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <div key={index} className="bg-[color:var(--sand)] p-8 rounded-[28px] hover:bg-[color:var(--sand)] transition-colors">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-[28px] bg-gradient-to-r from-[color:var(--blue)] to-[color:var(--blue)] mr-4">
                    <section.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-[color:var(--ink)]">{section.title}</h3>
                </div>
                <p className="text-[color:var(--text-2)] mb-6">{section.description}</p>
                <div className="space-y-3">
                  {section.articles.map((article, idx) => (
                    <div key={idx} className="flex items-center justify-between">
                      <span className="text-[color:var(--ink)] hover:text-[color:var(--blue)] cursor-pointer">{article}</span>
                      <ArrowRight className="h-4 w-4 text-[color:var(--text-2)]" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Downloads Section */}
      <section className="py-20 px-4 bg-[color:var(--sand)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Download Resources</h2>
            <p className="text-xl text-[color:var(--text-2)]">Useful resources and tools for developers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {downloadResources.map((resource, index) => (
              <div key={index} className="bg-[color:var(--paper)] p-8 rounded-[28px] shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <FileText className="h-8 w-8 text-[color:var(--blue)]" />
                  <span className="text-sm text-[color:var(--text-2)]">{resource.type}</span>
                </div>
                <h3 className="text-xl font-medium text-[color:var(--ink)] mb-3">{resource.title}</h3>
                <p className="text-[color:var(--text-2)] mb-4">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[color:var(--text-2)]">{resource.size}</span>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* API Reference CTA */}
      <section className="py-20 px-4 bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[color:var(--paper)] rounded-[28px] p-12 text-[color:var(--ink)] border border-[color:var(--line)] text-center">
            <Code className="h-16 w-16 mx-auto mb-6 text-[color:var(--blue)]" />
            <h3 className="text-3xl font-light mb-6">Complete API Reference</h3>
            <p className="text-xl text-[color:var(--text-2)] mb-8 max-w-2xl mx-auto">
              Detailed API documentation with examples, SDKs, and interactive testing
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[color:var(--ink)] text-white hover:bg-[color:var(--text-2)] rounded-full py-3" asChild>
                <Link to="/platform/api">
                  View API Docs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-[color:var(--paper)] hover:text-[color:var(--ink)] rounded-full py-3">
                Interactive API Explorer
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Documentation;
