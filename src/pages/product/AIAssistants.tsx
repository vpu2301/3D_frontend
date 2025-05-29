
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, MessageSquare, Brain, Clock, Globe, Mic, FileText, Users, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const AIAssistants = () => {
  const features = [
    {
      icon: MessageSquare,
      title: 'Natural Conversations',
      description: 'Engage in human-like conversations with context awareness and emotional intelligence.'
    },
    {
      icon: Brain,
      title: 'Knowledge Integration',
      description: 'Access and synthesize information from your company knowledge base and external sources.'
    },
    {
      icon: Clock,
      title: '24/7 Availability',
      description: 'Always-on assistance that provides instant responses and support around the clock.'
    },
    {
      icon: Globe,
      title: 'Multi-language Support',
      description: 'Communicate in over 50 languages with accurate translation and cultural context.'
    },
    {
      icon: Mic,
      title: 'Voice Interactions',
      description: 'Natural voice conversations with advanced speech recognition and synthesis.'
    },
    {
      icon: FileText,
      title: 'Document Understanding',
      description: 'Analyze, summarize, and extract insights from documents and files instantly.'
    }
  ];

  const useCases = [
    {
      title: 'Customer Support',
      description: 'Intelligent help desk that resolves issues and escalates when needed',
      benefits: ['Reduced response time', 'Consistent service quality', 'Cost savings', '24/7 availability']
    },
    {
      title: 'Personal Productivity',
      description: 'AI assistant that manages schedules, tasks, and daily workflows',
      benefits: ['Smart scheduling', 'Task prioritization', 'Email management', 'Meeting preparation']
    },
    {
      title: 'Knowledge Management',
      description: 'Instant access to company information and expert knowledge',
      benefits: ['Quick answers', 'Knowledge discovery', 'Training support', 'Information synthesis']
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              AI Assistants
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Intelligent AI assistants that understand context, learn from interactions, and provide 
              personalized support for your team and customers with human-like conversations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full" asChild>
                <Link to="/start-free-trial">Create AI Assistant</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">Try Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Assistant Capabilities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI features that make conversations natural and productive
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
            <h2 className="text-4xl font-light text-gray-900 mb-6">Popular Use Cases</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how AI assistants transform different areas of your business
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-lg">
                <h3 className="text-2xl font-medium text-gray-900 mb-4">{useCase.title}</h3>
                <p className="text-gray-600 mb-6">{useCase.description}</p>
                <div className="space-y-3">
                  {useCase.benefits.map((benefit, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Stats */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Assistant Performance</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-light text-blue-600 mb-2">98%</div>
              <div className="text-gray-600">User satisfaction</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-purple-600 mb-2">&lt;2s</div>
              <div className="text-gray-600">Average response time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-green-600 mb-2">50+</div>
              <div className="text-gray-600">Languages supported</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-orange-600 mb-2">24/7</div>
              <div className="text-gray-600">Uptime availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-light mb-8 text-center">Enterprise Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Team Collaboration</h4>
                <p className="text-gray-300">Shared assistants with role-based access and permissions</p>
              </div>
              <div className="text-center">
                <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">API Integration</h4>
                <p className="text-gray-300">Connect with your existing tools and workflows</p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Data Security</h4>
                <p className="text-gray-300">Enterprise-grade security and privacy protection</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Build Your AI Assistant</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Create intelligent assistants that understand your business and help your team succeed.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default AIAssistants;
