
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Bot, Users, Zap, Brain, Shield, Target, CheckCircle, Settings, BarChart3, FileText, MessageSquare, Calendar, ShoppingCart, Phone, Mail, Search, Database, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Agents = () => {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Reasoning',
      description: 'Advanced AI agents that think, analyze, and make intelligent decisions based on context and data.'
    },
    {
      icon: Users,
      title: 'Multi-Agent Teams',
      description: 'Deploy specialized AI agents that collaborate and communicate to solve complex business challenges.'
    },
    {
      icon: Zap,
      title: 'Autonomous Execution',
      description: 'Agents that can execute tasks independently without constant human oversight or intervention.'
    },
    {
      icon: Brain,
      title: 'Adaptive Learning',
      description: 'AI agents that learn from interactions and improve their performance over time.'
    },
    {
      icon: Shield,
      title: 'Secure Operations',
      description: 'Built-in safety measures and monitoring ensure agents operate within defined parameters.'
    },
    {
      icon: Target,
      title: 'Goal-Oriented',
      description: 'Agents focused on achieving specific business objectives with measurable outcomes.'
    }
  ];

  const agentTypes = [
    {
      name: 'Customer Service Agent',
      description: '24/7 intelligent customer support with human-like interactions',
      icon: MessageSquare,
      capabilities: ['Multi-language support', 'Sentiment analysis', 'Escalation handling', 'Knowledge base integration']
    },
    {
      name: 'Sales Assistant Agent',
      description: 'AI-powered lead qualification and sales process automation',
      icon: ShoppingCart,
      capabilities: ['Lead scoring', 'CRM integration', 'Follow-up sequences', 'Performance analytics']
    },
    {
      name: 'Document Processor Agent',
      description: 'Intelligent document analysis and data extraction workflows',
      icon: FileText,
      capabilities: ['OCR processing', 'Data validation', 'Workflow routing', 'Compliance checking']
    },
    {
      name: 'Email Management Agent',
      description: 'Automated email processing, categorization, and response generation',
      icon: Mail,
      capabilities: ['Email classification', 'Auto-responses', 'Priority handling', 'Calendar integration']
    },
    {
      name: 'Data Analysis Agent',
      description: 'Advanced data processing and insight generation from multiple sources',
      icon: Database,
      capabilities: ['Pattern recognition', 'Report generation', 'Trend analysis', 'Data visualization']
    },
    {
      name: 'Scheduling Agent',
      description: 'Smart calendar management and appointment scheduling automation',
      icon: Calendar,
      capabilities: ['Availability checking', 'Meeting coordination', 'Reminder management', 'Conflict resolution']
    },
    {
      name: 'Research Agent',
      description: 'Comprehensive research and information gathering across web sources',
      icon: Search,
      capabilities: ['Web scraping', 'Source validation', 'Summary generation', 'Fact checking']
    },
    {
      name: 'Call Center Agent',
      description: 'Voice-enabled AI for handling customer calls and inquiries',
      icon: Phone,
      capabilities: ['Speech recognition', 'Natural dialogue', 'Call routing', 'Issue resolution']
    },
    {
      name: 'Workflow Automation Agent',
      description: 'Process optimization and task automation across business systems',
      icon: Settings,
      capabilities: ['Process mapping', 'Task scheduling', 'System integration', 'Performance monitoring']
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[#f5ede3] to-white dark:from-[#181512] dark:to-[#1c1916]">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              AI Agents
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Deploy intelligent AI agents that think, learn, and act autonomously. Create a digital 
              workforce that handles complex tasks with human-level reasoning and decision-making.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-3 rounded-full" asChild>
                <Link to="/get-started">Deploy AI Agents</Link>
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
            <h2 className="text-4xl font-light text-gray-900 mb-6">Agent Capabilities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI agents with human-level reasoning and autonomous decision-making
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-[#222222] w-fit mx-auto mb-6">
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

      {/* Agent Types */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Specialized Agent Types</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pre-configured AI agents for every business function and use case
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {agentTypes.map((agent, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-[#222222] mr-4">
                    <agent.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">{agent.name}</h3>
                </div>
                <p className="text-gray-600 mb-6">{agent.description}</p>
                <div className="space-y-3 mb-6">
                  {agent.capabilities.map((capability, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{capability}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">Deploy Agent</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Agent Performance</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-light text-purple-600 mb-2">95%</div>
              <div className="text-gray-600">Task completion rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-pink-600 mb-2">24/7</div>
              <div className="text-gray-600">Continuous operation</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-blue-600 mb-2">10x</div>
              <div className="text-gray-600">Faster than humans</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-green-600 mb-2">99%</div>
              <div className="text-gray-600">Accuracy rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-12 text-[#111111] border border-black/8">
            <h3 className="text-3xl font-light mb-8 text-center">Enterprise Agent Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Performance Analytics</h4>
                <p className="text-black/60">Real-time monitoring and optimization of agent performance</p>
              </div>
              <div className="text-center">
                <Settings className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Custom Configuration</h4>
                <p className="text-black/60">Tailor agent behavior to your specific business needs</p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Secure Deployment</h4>
                <p className="text-black/60">Enterprise-grade security and compliance features</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#f5ede3] text-[#111111] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Deploy Your AI Workforce</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Start with intelligent AI agents that transform your business operations.
          </p>
          <Button size="lg" className="bg-[#111111] text-white hover:bg-[#222222] rounded-full py-3" asChild>
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

export default Agents;
