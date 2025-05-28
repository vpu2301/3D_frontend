
import { Check, ArrowRight, Zap, Shield, Clock, Users, TrendingUp, Bot, Workflow, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Features = () => {
  const coreFeatures = [
    {
      icon: Bot,
      title: 'AI-Powered Digital Workers',
      description: 'Deploy specialized AI agents that understand your business context and execute tasks with human-like intelligence.',
      features: ['Natural language processing', 'Context awareness', 'Continuous learning', 'Multi-skill capability']
    },
    {
      icon: Workflow,
      title: 'Seamless Integration',
      description: 'Connect with your existing tools and workflows without disruption. Our platform adapts to your current setup.',
      features: ['500+ integrations', 'API-first approach', 'Custom connectors', 'Zero downtime deployment']
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Track productivity gains, monitor performance, and optimize workflows with comprehensive insights.',
      features: ['Real-time dashboards', 'Performance metrics', 'ROI tracking', 'Predictive analytics']
    }
  ];

  const capabilities = [
    'Document Processing & Analysis',
    'Email Management & Responses',
    'Data Entry & Validation',
    'Report Generation',
    'Customer Support Automation',
    'Meeting Scheduling & Coordination',
    'Invoice Processing',
    'Social Media Management',
    'Quality Assurance Testing',
    'Inventory Management',
    'Lead Qualification',
    'Content Creation & Editing'
  ];

  const benefits = [
    {
      title: 'Immediate Impact',
      description: 'See results from day one with pre-trained AI workers ready to deploy.',
      stat: '24 hours',
      statLabel: 'to full deployment'
    },
    {
      title: 'Scalable Solution',
      description: 'Grow your digital workforce as your business needs evolve.',
      stat: 'Unlimited',
      statLabel: 'scaling potential'
    },
    {
      title: 'Cost Effective',
      description: 'Reduce operational costs while increasing output quality.',
      stat: '70%',
      statLabel: 'cost reduction'
    },
    {
      title: 'Reliable Performance',
      description: '24/7 availability with enterprise-grade security and compliance.',
      stat: '99.9%',
      statLabel: 'uptime guarantee'
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Powerful Features for
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Maximum Productivity
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover how our comprehensive suite of AI-powered tools can transform your workflow 
              and help you reclaim valuable time for strategic initiatives.
            </p>
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Core Platform Features</h2>
            <p className="text-xl text-gray-600">Everything you need to build and manage your digital workforce</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {coreFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700">
                        <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Our Digital Workers Can Do</h2>
            <p className="text-xl text-gray-600">A comprehensive list of tasks your AI workforce can handle</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {capabilities.map((capability, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex items-center">
                <Zap className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
                <span className="text-gray-700">{capability}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Teams Choose 3days.ai</h2>
            <p className="text-xl text-gray-600">Measurable benefits that drive real business results</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-3xl font-bold py-4 px-6 rounded-lg mb-4">
                  {benefit.stat}
                </div>
                <div className="text-sm text-gray-600 mb-2">{benefit.statLabel}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Shield className="h-12 w-12 text-blue-400 mr-4" />
                <h2 className="text-3xl font-bold">Enterprise-Grade Security</h2>
              </div>
              <p className="text-gray-300 mb-6">
                Your data security is our top priority. We maintain the highest standards of security 
                and compliance to protect your business information.
              </p>
              <ul className="space-y-3">
                {[
                  'SOC 2 Type II Certified',
                  'GDPR & CCPA Compliant',
                  'End-to-end Encryption',
                  'Regular Security Audits',
                  'Role-based Access Control',
                  '24/7 Security Monitoring'
                ].map((item, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-green-400 mr-3" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-800 p-8 rounded-lg">
              <h3 className="text-xl font-semibold mb-4">Ready to Get Started?</h3>
              <p className="text-gray-300 mb-6">
                Experience the power of AI-driven productivity. Start your free trial today and see 
                the difference 3days.ai can make for your team.
              </p>
              <Button size="lg" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
