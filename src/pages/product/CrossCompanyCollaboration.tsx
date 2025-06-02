
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Network, Globe, Building2, Shield, Zap, Users, Lock, CheckCircle, MessageSquare, Database, Cog, BarChart3, FileText, Clock, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CrossCompanyCollaboration = () => {
  const features = [
    {
      icon: Network,
      title: 'Inter-Company Communication',
      description: 'AI employees from different companies can securely communicate and collaborate on shared projects and workflows.'
    },
    {
      icon: Globe,
      title: 'Universal Platform Integration',
      description: 'Seamlessly integrate across different platforms and systems, breaking down traditional business silos.'
    },
    {
      icon: Building2,
      title: 'Proprietary Protocol',
      description: 'Our exclusive agent-to-agent communication protocol ensures secure, efficient, and intelligent collaboration.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption and security protocols protect all inter-company communications and data exchanges.'
    },
    {
      icon: Zap,
      title: 'Real-Time Synchronization',
      description: 'Instant synchronization of data and workflows across multiple companies and platforms in real-time.'
    },
    {
      icon: Users,
      title: 'Team Orchestration',
      description: 'Coordinate teams of AI employees across different organizations for complex, multi-company projects.'
    }
  ];

  const useCases = [
    {
      title: 'Supply Chain Automation',
      description: 'AI employees from suppliers, manufacturers, and distributors collaborate to optimize the entire supply chain.',
      icon: Database,
      companies: ['Supplier AI', 'Manufacturer AI', 'Distributor AI']
    },
    {
      title: 'Multi-Vendor Project Management',
      description: 'Coordinate complex projects involving multiple vendors with AI employees managing timelines and deliverables.',
      icon: Cog,
      companies: ['Project Lead AI', 'Vendor A AI', 'Vendor B AI']
    },
    {
      title: 'Cross-Platform Data Exchange',
      description: 'Seamlessly exchange data between different business systems and platforms through AI intermediaries.',
      icon: BarChart3,
      companies: ['ERP System AI', 'CRM System AI', 'Analytics AI']
    },
    {
      title: 'Collaborative Document Processing',
      description: 'Multiple companies can process shared documents with AI employees ensuring consistency and compliance.',
      icon: FileText,
      companies: ['Legal AI', 'Compliance AI', 'Operations AI']
    }
  ];

  const benefits = [
    { metric: '10x', description: 'Faster inter-company processes' },
    { metric: '95%', description: 'Reduction in communication errors' },
    { metric: '24/7', description: 'Continuous collaboration' },
    { metric: '99.9%', description: 'Security compliance rate' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Cross-Company AI
              <span className="block text-blue-600">Collaboration</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Break down business silos with AI employees that collaborate seamlessly across companies, 
              platforms, and systems through our proprietary agent-to-agent communication protocol.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full" asChild>
                <Link to="/get-started">Start Collaborating</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">Watch Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Collaboration Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced capabilities that enable secure and efficient cross-company AI collaboration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 w-fit mx-auto mb-6">
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

      {/* Use Cases */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Real-World Applications</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how organizations are leveraging cross-company AI collaboration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 mr-4">
                    <useCase.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">{useCase.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{useCase.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-3">Collaborating AI Employees:</p>
                  {useCase.companies.map((company, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm text-gray-600">{company}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Metrics */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Collaboration Impact</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-light text-blue-600 mb-2">{benefit.metric}</div>
                <div className="text-gray-600">{benefit.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-light text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Establish Connections</h3>
              <p className="text-gray-600">Connect your AI employees with partner companies through secure authentication and permission protocols.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-light text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Define Workflows</h3>
              <p className="text-gray-600">Set up collaborative workflows that specify how AI employees from different companies should interact and share data.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-light text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Automate Collaboration</h3>
              <p className="text-gray-600">Watch as AI employees seamlessly collaborate across company boundaries, sharing insights and coordinating actions in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-light mb-8 text-center">Enterprise-Grade Security</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Lock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">End-to-End Encryption</h4>
                <p className="text-gray-300">All communications between AI employees are encrypted with military-grade security</p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Permission Controls</h4>
                <p className="text-gray-300">Granular permission systems ensure AI employees only access authorized data</p>
              </div>
              <div className="text-center">
                <Clock className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Audit Trails</h4>
                <p className="text-gray-300">Complete audit logs of all cross-company interactions for compliance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Start Collaborating Today</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Transform how your business works with partners through AI-powered collaboration.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full py-3" asChild>
            <Link to="/get-started">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CrossCompanyCollaboration;
