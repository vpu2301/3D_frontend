
import { TrendingUp, Users, Target, BarChart3, ArrowRight, PhoneCall, Mail, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Emma = () => {
  const features = [
    {
      icon: Users,
      title: 'Lead Qualification & Scoring',
      description: 'Automatically qualifies leads, scores prospects, and prioritizes high-value opportunities for maximum conversion.'
    },
    {
      icon: PhoneCall,
      title: 'Automated Outreach & Follow-up',
      description: 'Manages personalized outreach campaigns and ensures timely follow-ups across multiple channels.'
    },
    {
      icon: BarChart3,
      title: 'Sales Performance Analytics',
      description: 'Provides real-time insights into sales metrics, pipeline health, and team performance optimization.'
    },
    {
      icon: Calendar,
      title: 'Meeting Scheduling & CRM Updates',
      description: 'Handles appointment scheduling, updates CRM records, and maintains accurate customer interaction logs.'
    }
  ];

  const integrations = [
    'Salesforce', 'HubSpot', 'Pipedrive', 'Zoom', 'Calendly', 'LinkedIn Sales Navigator'
  ];

  const roiStats = [
    { value: '85%', label: 'Lead Response Rate' },
    { value: '40%', label: 'Sales Cycle Reduction' },
    { value: '95%', label: 'Follow-up Consistency' },
    { value: '3x', label: 'Pipeline Velocity Increase' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
                Meet Emma: Your
                <span className="block font-medium bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                  AI Sales Specialist
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto lg:mx-0 font-light leading-relaxed">
                Emma automates lead qualification, manages outreach campaigns, and optimizes your sales pipeline 
                with intelligent insights and personalized customer engagement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
                <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-md" asChild>
                  <Link to="/start-free-trial">Try Emma Free</Link>
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-md" asChild>
                  <Link to="/schedule-demo">Request a Demo</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <div className="relative rounded-2xl overflow-hidden">
                <img 
                  src="/lovable-uploads/35c36576-e7de-466a-bc06-44e278438e79.png" 
                  alt="Emma - AI Sales Specialist"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pink-500/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-pink-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900">Emma Active</span>
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
            <h2 className="text-4xl font-light text-gray-900 mb-6">Sales Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proven results in sales performance and revenue growth
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
              Advanced sales capabilities that drive revenue and accelerate growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500 to-rose-500 mr-4">
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
            <h2 className="text-4xl font-light text-gray-900 mb-6">Sales Tool Integrations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seamlessly connects with your existing sales technology stack
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
      <section className="py-20 bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Accelerate Sales?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Let Emma handle the pipeline while your team focuses on closing high-value deals.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-md py-3" asChild>
            <Link to="/start-free-trial">
              Try Emma Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Emma;
