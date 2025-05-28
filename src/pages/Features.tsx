
import { ArrowRight, Zap, Shield, Workflow, BarChart3, Bot, Clock, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Features = () => {
  const mainFeatures = [
    {
      icon: Bot,
      title: 'Intelligent Digital Workers',
      description: 'AI agents that understand context, learn from your patterns, and execute tasks with human-like precision.',
      details: ['Natural language processing', 'Contextual understanding', 'Continuous learning', 'Multi-domain expertise'],
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Workflow,
      title: 'Seamless Integration',
      description: 'Connects effortlessly with your existing ecosystem. No disruption, just enhancement.',
      details: ['500+ pre-built integrations', 'API-first architecture', 'Custom connectors', 'Zero-downtime deployment'],
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Real-time insights into productivity gains, performance metrics, and optimization opportunities.',
      details: ['Live dashboards', 'Predictive analytics', 'ROI tracking', 'Performance insights'],
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  const capabilities = [
    'Document Processing & Analysis',
    'Email Management & Auto-responses',
    'Data Entry & Validation',
    'Report Generation & Formatting',
    'Customer Support Automation',
    'Meeting Scheduling & Coordination',
    'Invoice Processing & Tracking',
    'Social Media Content Management',
    'Quality Assurance Testing',
    'Inventory Management',
    'Lead Qualification & Scoring',
    'Content Creation & Editing'
  ];

  const benefits = [
    {
      stat: '24h',
      label: 'Setup Time',
      description: 'From signup to full deployment'
    },
    {
      stat: '∞',
      label: 'Scalability',
      description: 'Grow without limits'
    },
    {
      stat: '70%',
      label: 'Cost Reduction',
      description: 'In operational expenses'
    },
    {
      stat: '99.9%',
      label: 'Reliability',
      description: 'Enterprise-grade uptime'
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-7xl font-light text-gray-900 mb-8 tracking-tight leading-none">
              Features that
              <span className="block font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                redefine possible
              </span>
            </h1>
            <p className="text-2xl text-gray-600 mb-12 font-light leading-relaxed">
              Discover the comprehensive suite of AI-powered tools designed to amplify human potential.
            </p>
            <Button 
              size="lg" 
              className="bg-black hover:bg-gray-800 text-white text-lg px-12 py-4 rounded-full transition-all duration-300 hover:scale-105"
            >
              Explore Features
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-32">
            {mainFeatures.map((feature, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-8`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">{feature.title}</h3>
                  <p className="text-xl text-gray-600 mb-8 leading-relaxed font-light">{feature.description}</p>
                  <ul className="space-y-4">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-lg">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                  <div className={`h-96 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-10`}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              What your digital workers can do
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              A comprehensive list of tasks your AI workforce handles with precision and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((capability, index) => (
              <div 
                key={index} 
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 group-hover:scale-150 transition-transform duration-300"></div>
                  <span className="text-gray-800 font-medium">{capability}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Measurable impact from day one
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="text-6xl font-light text-gray-900 mb-4">{benefit.stat}</div>
                  <div className="text-lg font-medium text-gray-900 mb-2">{benefit.label}</div>
                  <div className="text-gray-600 font-light">{benefit.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="py-32 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-8">
                <Shield className="h-12 w-12 text-blue-400 mr-4" />
                <h2 className="text-4xl font-light">Enterprise-grade security</h2>
              </div>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed font-light">
                Your data security is paramount. We maintain the highest standards of protection and compliance.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  'SOC 2 Type II Certified',
                  'GDPR & CCPA Compliant',
                  'End-to-end Encryption',
                  'Regular Security Audits',
                  'Role-based Access Control',
                  '24/7 Security Monitoring'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-12 rounded-3xl border border-gray-700">
              <h3 className="text-2xl font-light mb-6">Ready to get started?</h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Experience the future of productivity. Start your journey today.
              </p>
              <Button 
                size="lg" 
                className="w-full bg-white text-black hover:bg-gray-100 rounded-full py-4 transition-all duration-300 hover:scale-105"
              >
                Start Free Trial
                <ArrowRight className="ml-3 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
