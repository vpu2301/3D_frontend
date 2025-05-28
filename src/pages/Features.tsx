import { ArrowRight, Zap, Brain, Shield, BarChart3, Users, Clock, Workflow, Database, Lock, Globe, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const Features = () => {
  const mainFeatures = [
    {
      icon: Brain,
      title: 'AI-Powered Digital Workers',
      description: 'Intelligent automation that learns and adapts to your business processes',
      details: [
        'Natural language processing for document understanding',
        'Machine learning algorithms that improve over time',
        'Context-aware decision making capabilities',
        'Multi-modal AI supporting text, images, and data'
      ],
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: Workflow,
      title: 'Visual Workflow Builder',
      description: 'Drag-and-drop interface to create complex automation workflows',
      details: [
        'No-code workflow design with intuitive interface',
        'Pre-built templates for common business processes',
        'Real-time workflow testing and debugging',
        'Version control and rollback capabilities'
      ],
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: Database,
      title: 'Universal Integrations',
      description: 'Connect with 200+ applications and systems seamlessly',
      details: [
        'API-first architecture for maximum flexibility',
        'Pre-built connectors for popular business tools',
        'Custom integration development support',
        'Real-time data synchronization across platforms'
      ],
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Deep insights into automation performance and ROI',
      details: [
        'Real-time performance monitoring and alerts',
        'Comprehensive ROI tracking and reporting',
        'Predictive analytics for process optimization',
        'Custom dashboards and business intelligence'
      ],
      image: 'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80'
    }
  ];

  const capabilities = [
    {
      icon: Clock,
      title: 'Time Tracking',
      description: 'Monitor time saved across all automated processes'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Built-in tools for team coordination and task management'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with compliance certifications'
    },
    {
      icon: Globe,
      title: 'Global Deployment',
      description: 'Multi-region deployment with local data residency'
    },
    {
      icon: Smartphone,
      title: 'Mobile Access',
      description: 'Full-featured mobile apps for iOS and Android'
    },
    {
      icon: Lock,
      title: 'Access Control',
      description: 'Granular permissions and role-based access management'
    }
  ];

  const useCases = [
    {
      title: 'Document Processing',
      description: 'Extract, analyze, and process documents automatically',
      timesSaved: '85%',
      processes: ['Invoice processing', 'Contract analysis', 'Data extraction', 'Compliance checking'],
      image: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Customer Service',
      description: 'Automate ticket routing, responses, and escalations',
      timesSaved: '70%',
      processes: ['Ticket classification', 'Auto-responses', 'Escalation rules', 'Knowledge base updates'],
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Data Entry & Migration',
      description: 'Eliminate manual data entry with intelligent automation',
      timesSaved: '95%',
      processes: ['CRM updates', 'Database migration', 'Form processing', 'Data validation'],
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80'
    },
    {
      title: 'Report Generation',
      description: 'Create and distribute reports automatically',
      timesSaved: '80%',
      processes: ['Data collection', 'Report formatting', 'Distribution', 'Performance tracking'],
      image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 tracking-tight leading-none">
              Powerful Features for
              <span className="block font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Intelligent Automation
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed">
              Everything you need to automate complex business processes with AI-powered 
              digital workers that think, learn, and adapt to your organization.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-black hover:bg-gray-800 text-white rounded-full py-3"
                asChild
              >
                <Link to="/start-free-trial">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full py-3"
                asChild
              >
                <Link to="/schedule-demo">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Features with Images */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Core Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Built from the ground up for enterprise-scale automation.
            </p>
          </div>

          <div className="space-y-20">
            {mainFeatures.map((feature, index) => (
              <div key={index} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                <div className={index % 2 === 1 ? 'lg:col-start-2' : ''}>
                  <div className="flex items-center mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 mr-6">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-3xl font-medium text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600 text-lg">{feature.description}</p>
                    </div>
                  </div>
                  <ul className="space-y-4">
                    {feature.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-4 mt-3 flex-shrink-0"></div>
                        <span className="text-gray-700 text-lg">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}>
                  <div className="relative">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-80 object-cover rounded-3xl shadow-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-3xl"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Capabilities */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Built for Enterprise
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Enterprise-grade capabilities that scale with your business.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {capabilities.map((capability, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 w-fit mx-auto mb-4">
                    <capability.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{capability.title}</h3>
                  <p className="text-gray-600 text-sm">{capability.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases with Images */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Real-World Use Cases
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              See how organizations are using 3days.ai to transform their operations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm overflow-hidden">
                <div className="relative h-48">
                  <img 
                    src={useCase.image} 
                    alt={useCase.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      {useCase.timesSaved} time saved
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-8">
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{useCase.title}</h3>
                  <p className="text-gray-600 mb-6">{useCase.description}</p>
                  <div>
                    <p className="text-sm font-medium text-gray-900 mb-3">Common Processes:</p>
                    <div className="flex flex-wrap gap-2">
                      {useCase.processes.map((process, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {process}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technical Specs */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light mb-6 tracking-tight">
              Technical Specifications
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
              Enterprise-grade infrastructure built for scale and reliability.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-light mb-2">99.9%</div>
              <div className="text-gray-400">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light mb-2">200+</div>
              <div className="text-gray-400">Integrations</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light mb-2">SOC 2</div>
              <div className="text-gray-400">Compliant</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light mb-2">24/7</div>
              <div className="text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Get Started?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Experience the power of AI automation with a free 30-day trial.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 rounded-full py-3"
              asChild
            >
              <Link to="/start-free-trial">
                Start Free Trial
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 rounded-full py-3"
              asChild
            >
              <Link to="/contact">Contact Sales</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
