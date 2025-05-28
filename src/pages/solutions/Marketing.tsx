
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Megaphone, Mail, BarChart3, Users, Target, Zap, Globe, Calendar, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Marketing = () => {
  const features = [
    {
      icon: Megaphone,
      title: 'Campaign Automation',
      description: 'Create, launch, and optimize multi-channel marketing campaigns with AI-powered personalization.'
    },
    {
      icon: Mail,
      title: 'Email Personalization',
      description: 'Generate personalized email content at scale with dynamic content and behavioral triggers.'
    },
    {
      icon: Target,
      title: 'Lead Scoring',
      description: 'Automatically score and qualify leads based on behavior, demographics, and engagement patterns.'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Real-time campaign performance tracking with ROI analysis and optimization recommendations.'
    },
    {
      icon: Users,
      title: 'Audience Segmentation',
      description: 'Dynamic audience segmentation based on behavior, preferences, and conversion likelihood.'
    },
    {
      icon: Globe,
      title: 'Social Media Automation',
      description: 'Schedule, publish, and manage social media content across all major platforms automatically.'
    }
  ];

  const results = [
    { metric: '65%', label: 'Increase in conversion rates' },
    { metric: '80%', label: 'Reduction in manual tasks' },
    { metric: '3x', label: 'Faster campaign deployment' },
    { metric: '45%', label: 'Higher email open rates' }
  ];

  const channels = [
    { name: 'Email Marketing', features: ['Drip campaigns', 'A/B testing', 'Behavioral triggers', 'Personalization'] },
    { name: 'Social Media', features: ['Auto-posting', 'Content curation', 'Engagement tracking', 'Hashtag optimization'] },
    { name: 'Content Marketing', features: ['Content planning', 'SEO optimization', 'Distribution', 'Performance tracking'] },
    { name: 'Paid Advertising', features: ['Bid optimization', 'Audience targeting', 'Creative testing', 'Budget allocation'] }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              For Marketing Teams
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Scale your marketing efforts with AI-powered automation. Create personalized campaigns, 
              nurture leads intelligently, and drive growth while reducing manual work by 80%.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full" asChild>
                <Link to="/start-free-trial">Transform Your Marketing</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">See Marketing Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Marketing Results That Matter</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See the impact our automation has on marketing performance
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {results.map((result, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-light text-purple-600 mb-2">{result.metric}</div>
                <div className="text-gray-600">{result.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Marketing Automation Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to automate and scale your marketing efforts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 w-fit mx-auto mb-6">
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

      {/* Marketing Channels */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Multi-Channel Automation</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Automate across all your marketing channels for consistent messaging
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {channels.map((channel, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-3xl">
                <h3 className="text-2xl font-medium text-gray-900 mb-6">{channel.name}</h3>
                <div className="grid grid-cols-2 gap-4">
                  {channel.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{feature}</span>
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
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-light mb-8 text-center">Automated Customer Journey</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <Target className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Awareness</h4>
                <p className="text-gray-300">Content marketing and social media automation</p>
              </div>
              <div className="text-center">
                <Mail className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Consideration</h4>
                <p className="text-gray-300">Email nurturing and lead scoring</p>
              </div>
              <div className="text-center">
                <Zap className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Conversion</h4>
                <p className="text-gray-300">Personalized offers and retargeting</p>
              </div>
              <div className="text-center">
                <TrendingUp className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Retention</h4>
                <p className="text-gray-300">Customer success and upselling automation</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Templates */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Ready-to-Use Templates</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start with proven marketing automation workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-3xl">
              <Calendar className="h-12 w-12 text-purple-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-4">Welcome Series</h3>
              <p className="text-gray-600 mb-6">Automated onboarding sequence for new subscribers with personalized content.</p>
              <Button variant="outline" className="w-full">Use Template</Button>
            </div>
            <div className="bg-gray-50 p-8 rounded-3xl">
              <Target className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-4">Lead Nurturing</h3>
              <p className="text-gray-600 mb-6">Multi-touch campaign that guides leads through the sales funnel.</p>
              <Button variant="outline" className="w-full">Use Template</Button>
            </div>
            <div className="bg-gray-50 p-8 rounded-3xl">
              <Users className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-4">Customer Retention</h3>
              <p className="text-gray-600 mb-6">Re-engagement campaigns for inactive customers and churn prevention.</p>
              <Button variant="outline" className="w-full">Use Template</Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Scale Your Marketing?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Join thousands of marketers who've automated their way to better results.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              Start Marketing Smarter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Marketing;
