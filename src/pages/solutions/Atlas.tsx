
import { MessageCircle, Users, Clock, TrendingUp, ArrowRight, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Atlas = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'Instant Response to Common Questions',
      description: 'Provides immediate, accurate answers to frequently asked questions across all channels.'
    },
    {
      icon: Users,
      title: 'Ticket Categorization & Prioritization',
      description: 'Automatically sorts and prioritizes support tickets based on urgency and complexity.'
    },
    {
      icon: Clock,
      title: 'Multi-channel Support',
      description: 'Handles customer inquiries across email, chat, social media, and phone seamlessly.'
    },
    {
      icon: TrendingUp,
      title: 'Proactive Issue Detection',
      description: 'Identifies patterns and potential issues before they become major problems.'
    }
  ];

  const integrations = [
    'Zendesk', 'Freshdesk', 'Salesforce Service Cloud', 'Intercom', 'Help Scout', 'Slack'
  ];

  const roiStats = [
    { value: '65%', label: 'Cost Reduction vs Human Agents' },
    { value: '24/7', label: 'Coverage with Zero Downtime' },
    { value: '95%', label: 'Customer Satisfaction Score' },
    { value: '2s', label: 'Average Response Time' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Atlas Handles Routine Support,
              <span className="block font-medium bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                So Your Team Can Solve the Tough Cases
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
              Atlas uses advanced natural language understanding to resolve repetitive customer inquiries, 
              escalate complex tickets, and maintain a comprehensive knowledge base.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-md" asChild>
                <Link to="/schedule-demo">See Atlas in Action</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-md" asChild>
                <Link to="/start-free-trial">Try Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Stats */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">ROI Data</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Measurable impact on your support operations and customer satisfaction
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
              Advanced support capabilities that scale with your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 mr-4">
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
            <h2 className="text-4xl font-light text-gray-900 mb-6">Seamless Integrations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Works with your existing support infrastructure
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
      <section className="py-20 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Transform Support?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Let Atlas handle the routine while your team focuses on building relationships.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-md py-3" asChild>
            <Link to="/schedule-demo">
              See Atlas in Action
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Atlas;
