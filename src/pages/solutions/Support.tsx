
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, MessageCircle, Clock, Heart, Headphones, Bot, BarChart3, Users, Zap, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const Support = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'Smart Ticket Routing',
      description: 'AI-powered ticket classification and routing to the right specialists based on content and priority.'
    },
    {
      icon: Clock,
      title: 'Response Automation',
      description: 'Instant responses to common queries with personalized solutions and escalation when needed.'
    },
    {
      icon: Heart,
      title: 'Satisfaction Tracking',
      description: 'Automated CSAT surveys and sentiment analysis to continuously improve service quality.'
    },
    {
      icon: Headphones,
      title: 'Multi-Channel Support',
      description: 'Unified support across email, chat, phone, and social media with consistent experiences.'
    },
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Intelligent chatbots that handle routine inquiries and assist agents with complex issues.'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Real-time support metrics, agent performance tracking, and customer satisfaction insights.'
    }
  ];

  const supportChannels = [
    {
      name: 'Email Support',
      description: 'Automated email management and response',
      capabilities: ['Auto-categorization', 'Template responses', 'Priority scoring', 'SLA tracking']
    },
    {
      name: 'Live Chat',
      description: 'Real-time chat with AI assistance',
      capabilities: ['Chatbot handoff', 'Agent suggestions', 'Conversation routing', 'Sentiment analysis']
    },
    {
      name: 'Phone Support',
      description: 'Intelligent call routing and IVR',
      capabilities: ['Smart routing', 'Call transcription', 'Emotion detection', 'Callback scheduling']
    },
    {
      name: 'Self-Service',
      description: 'AI-powered knowledge base and FAQs',
      capabilities: ['Smart search', 'Content recommendations', 'Guided workflows', 'Video tutorials']
    }
  ];

  const metrics = [
    { value: '50%', label: 'Faster response times' },
    { value: '85%', label: 'First contact resolution' },
    { value: '40%', label: 'Reduction in support costs' },
    { value: '95%', label: 'Customer satisfaction' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              For Customer Support
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Deliver exceptional customer service with AI-powered support automation. Reduce response 
              times, increase satisfaction, and empower your team to focus on complex customer needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full" asChild>
                <Link to="/start-free-trial">Improve Customer Service</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">See Support Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Customer Service Results</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Measurable improvements in service quality and team efficiency
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-light text-blue-600 mb-2">{metric.value}</div>
                <div className="text-gray-600">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Support Automation Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools to enhance customer service operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 w-fit mx-auto mb-6">
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

      {/* Support Channels */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Multi-Channel Support</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Deliver consistent experiences across all customer touchpoints
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {supportChannels.map((channel, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-3xl">
                <h3 className="text-2xl font-medium text-gray-900 mb-4">{channel.name}</h3>
                <p className="text-gray-600 mb-6">{channel.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  {channel.capabilities.map((capability, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Journey */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Automated Support Journey</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Contact</h3>
              <p className="text-gray-600">Customer reaches out via any channel</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Analyze</h3>
              <p className="text-gray-600">AI analyzes intent and priority</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Route</h3>
              <p className="text-gray-600">Smart routing to best available agent</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Resolve</h3>
              <p className="text-gray-600">Quick resolution with satisfaction tracking</p>
            </div>
          </div>
        </div>
      </section>

      {/* AI Assistant Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-light mb-8 text-center">AI-Powered Support Assistant</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-medium mb-4">For Customers</h4>
                <ul className="space-y-3 text-gray-300">
                  <li>• 24/7 instant responses to common questions</li>
                  <li>• Guided troubleshooting and problem resolution</li>
                  <li>• Seamless handoff to human agents when needed</li>
                  <li>• Multi-language support capabilities</li>
                  <li>• Proactive issue detection and prevention</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-medium mb-4">For Agents</h4>
                <ul className="space-y-3 text-gray-300">
                  <li>• Real-time response suggestions and knowledge</li>
                  <li>• Customer history and context at a glance</li>
                  <li>• Automated ticket summarization and tagging</li>
                  <li>• Quality assurance and coaching insights</li>
                  <li>• Escalation recommendations and workflows</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Templates */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Support Workflow Templates</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pre-built automation workflows for common support scenarios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <Target className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-4">Ticket Escalation</h3>
              <p className="text-gray-600 mb-6">Automated escalation workflow for high-priority or complex issues.</p>
              <Button variant="outline" className="w-full">Use Template</Button>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <Zap className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-4">Bug Report Processing</h3>
              <p className="text-gray-600 mb-6">Streamlined workflow for bug reports with automatic dev team routing.</p>
              <Button variant="outline" className="w-full">Use Template</Button>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <Heart className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-4">Customer Feedback</h3>
              <p className="text-gray-600 mb-6">Automated feedback collection and routing to product teams.</p>
              <Button variant="outline" className="w-full">Use Template</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Support Integrations */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Support Tool Integrations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with your existing customer service stack
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">Help Desk</h3>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900">CRM Systems</h3>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Bot className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900">Chat Platforms</h3>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-medium text-gray-900">Analytics Tools</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Enhance Support?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Transform your customer service with AI-powered automation that delights customers.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              Improve Customer Service
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Support;
