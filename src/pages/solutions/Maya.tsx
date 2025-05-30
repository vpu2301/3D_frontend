
import { TrendingUp, Target, BarChart3, Users, ArrowRight, Mail, Megaphone, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Maya = () => {
  const features = [
    {
      icon: Target,
      title: 'Campaign Optimization',
      description: 'Automatically optimizes marketing campaigns across all channels using AI-driven insights and performance data.'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Provides real-time analytics and actionable insights to improve ROI and campaign effectiveness.'
    },
    {
      icon: Users,
      title: 'Audience Segmentation',
      description: 'Creates dynamic audience segments based on behavior, demographics, and engagement patterns.'
    },
    {
      icon: Mail,
      title: 'Content Personalization',
      description: 'Generates personalized content at scale for emails, social media, and advertising campaigns.'
    }
  ];

  const integrations = [
    'HubSpot', 'Marketo', 'Salesforce Marketing Cloud', 'Mailchimp', 'Google Ads', 'Facebook Ads'
  ];

  const roiStats = [
    { value: '70%', label: 'Increase in Campaign ROI' },
    { value: '85%', label: 'Content Creation Speed' },
    { value: '$120K', label: 'Average Cost Savings (3 months)' },
    { value: '95%', label: 'Campaign Optimization Accuracy' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
                Meet Maya: Your
                <span className="block font-medium bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                  AI Marketing Specialist
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto lg:mx-0 font-light leading-relaxed">
                Maya transforms your marketing efforts with intelligent campaign optimization, 
                content personalization, and performance analytics that drive real results.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
                <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-md" asChild>
                  <Link to="/start-free-trial">Try Maya Free</Link>
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-md" asChild>
                  <Link to="/schedule-demo">Request a Demo</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/lovable-uploads/3854ebf9-ee3e-42dc-972b-5431cd8e362c.png" 
                  alt="Maya - AI Marketing Specialist"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900">Maya Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Stats */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Marketing Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Measurable results that transform your marketing performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roiStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-light text-gray-900 mb-3">{stat.value}</div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced marketing capabilities powered by artificial intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 mr-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Marketing Tool Integrations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seamlessly connects with your existing marketing stack
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {integrations.map((integration, index) => (
              <div key={index} className="bg-gray-100 px-6 py-3 rounded-full text-gray-700 font-medium">
                {integration}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Transform Marketing?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Let Maya optimize your campaigns while you focus on strategy and creativity.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-md py-3" asChild>
            <Link to="/start-free-trial">
              Try Maya Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Maya;
