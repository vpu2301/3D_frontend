
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, MessageSquare, Network, Shield, Zap, Users, Globe, Building2, Lock, CheckCircle, Clock, Database, Cog, BarChart3, FileText, Bot, Cpu, Settings, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const AgenticCommunication = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'Agent-to-Agent Messaging',
      description: 'Direct communication between AI agents across different organizations with intelligent routing and context preservation.'
    },
    {
      icon: Network,
      title: 'Distributed Network Protocol',
      description: 'Proprietary protocol enables secure, scalable communication across multiple companies and platforms simultaneously.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'End-to-end encryption, permission-based access control, and complete audit trails for all inter-agent communications.'
    },
    {
      icon: Zap,
      title: 'Real-Time Synchronization',
      description: 'Instant data synchronization and workflow coordination across organizational boundaries in real-time.'
    },
    {
      icon: Users,
      title: 'Multi-Party Collaboration',
      description: 'Support for complex workflows involving multiple AI agents from different companies working together.'
    },
    {
      icon: Globe,
      title: 'Platform Agnostic',
      description: 'Works across different business systems, platforms, and infrastructures without vendor lock-in.'
    }
  ];

  const benefits = [
    { metric: '85%', description: 'Reduction in coordination time' },
    { metric: '99.9%', description: 'Communication reliability' },
    { metric: '24/7', description: 'Continuous operation' },
    { metric: '256-bit', description: 'Encryption standard' }
  ];

  const useCases = [
    {
      title: 'Supply Chain Orchestration',
      description: 'AI agents from suppliers, manufacturers, and distributors communicate to optimize inventory, predict demand, and coordinate logistics in real-time.',
      icon: Database,
      participants: ['Supplier Agent', 'Manufacturing Agent', 'Logistics Agent', 'Retail Agent']
    },
    {
      title: 'Cross-Platform Integration',
      description: 'Bridge different business systems with AI agents that translate and synchronize data between CRM, ERP, and specialized industry platforms.',
      icon: Cog,
      participants: ['CRM Agent', 'ERP Agent', 'Analytics Agent', 'Compliance Agent']
    },
    {
      title: 'Multi-Vendor Project Management',
      description: 'Coordinate complex projects with AI agents managing timelines, resources, and deliverables across multiple vendor organizations.',
      icon: BarChart3,
      participants: ['Project Lead Agent', 'Vendor A Agent', 'Vendor B Agent', 'Quality Agent']
    },
    {
      title: 'Regulatory Compliance Network',
      description: 'AI agents share compliance updates, regulatory changes, and audit information across companies in regulated industries.',
      icon: FileText,
      participants: ['Legal Agent', 'Compliance Agent', 'Audit Agent', 'Regulatory Agent']
    }
  ];

  const technicalSpecs = [
    {
      title: 'Protocol Architecture',
      specs: [
        'RESTful API with WebSocket support',
        'JSON-based message format',
        'Asynchronous message queuing',
        'Automatic retry and failover'
      ]
    },
    {
      title: 'Security Features',
      specs: [
        'TLS 1.3 transport encryption',
        'OAuth 2.0 / JWT authentication',
        'Role-based access control',
        'Message integrity verification'
      ]
    },
    {
      title: 'Scalability',
      specs: [
        'Horizontal scaling support',
        'Load balancing across nodes',
        'Message throughput: 10,000+ msg/sec',
        'Multi-region deployment'
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 mb-6">
              <Bot className="h-4 w-4 text-blue-600" />
              <span className="text-blue-700 text-sm font-medium">Platform Technology</span>
            </div>
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Agentic Communication
              <span className="block text-blue-600">Protocol</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
              Revolutionary agent-to-agent communication protocol that enables AI employees from different 
              companies to collaborate seamlessly across organizational boundaries, platforms, and systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full" asChild>
                <Link to="/get-started">Start Building</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">View Technical Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Core Communication Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced capabilities that enable secure, intelligent, and efficient cross-organizational AI collaboration
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-[#111111] w-fit mx-auto mb-6">
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
              See how organizations leverage agentic communication for complex cross-company workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-2xl bg-[#111111] mr-4">
                    <useCase.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">{useCase.title}</h3>
                </div>
                <p className="text-gray-600 mb-6">{useCase.description}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700 mb-3">Participating Agents:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {useCase.participants.map((participant, idx) => (
                      <div key={idx} className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm text-gray-600">{participant}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specifications */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Technical Specifications</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade architecture built for scale, security, and reliability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {technicalSpecs.map((spec, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-2xl">
                <h3 className="text-xl font-medium text-gray-900 mb-6">{spec.title}</h3>
                <ul className="space-y-3">
                  {spec.specs.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Performance & Reliability</h2>
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

      {/* Integration Process */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Integration Process</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-light text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">API Integration</h3>
              <p className="text-gray-600">Connect your AI agents to our communication protocol with simple API calls and authentication setup.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-light text-blue-600">2</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Network Discovery</h3>
              <p className="text-gray-600">Your agents automatically discover and establish secure connections with authorized partner agents.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-light text-blue-600">3</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Workflow Configuration</h3>
              <p className="text-gray-600">Define communication patterns, data sharing rules, and collaborative workflows between agent networks.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-light text-blue-600">4</span>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-4">Live Collaboration</h3>
              <p className="text-gray-600">Watch as your AI agents seamlessly collaborate across company boundaries in real-time operations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Deep Dive */}
      <section className="py-20 px-4 bg-[#f5ede3] text-[#111111]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-12 border border-black/8">
            <h3 className="text-3xl font-light mb-8 text-center">Security Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Lock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Zero-Trust Network</h4>
                <p className="text-black/60">Every agent connection is verified and encrypted, with no implicit trust between network participants.</p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Granular Permissions</h4>
                <p className="text-black/60">Fine-grained access control determines exactly what data each agent can access and share.</p>
              </div>
              <div className="text-center">
                <Activity className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Real-Time Monitoring</h4>
                <p className="text-black/60">Continuous monitoring of all agent communications with instant threat detection and response.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#f5ede3] text-[#111111] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Connect Your AI Agents?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Join the future of inter-organizational AI collaboration with our agentic communication protocol.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-[#111111] text-white hover:bg-[#222222] rounded-full py-3" asChild>
              <Link to="/get-started">
                Start Integration
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-full py-3" asChild>
              <Link to="/contact">
                Contact Technical Team
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AgenticCommunication;
