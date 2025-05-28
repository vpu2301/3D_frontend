
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Target, TrendingUp, Users, Mail, Phone, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sales = () => {
  const features = [
    {
      icon: Target,
      title: 'Lead Qualification',
      description: 'Automatically score and qualify leads based on behavior, demographics, and engagement patterns.'
    },
    {
      icon: Mail,
      title: 'Email Sequences',
      description: 'Personalized email campaigns that adapt based on prospect responses and engagement.'
    },
    {
      icon: Phone,
      title: 'Call Automation',
      description: 'Intelligent call scheduling, reminders, and follow-up sequences for your sales team.'
    },
    {
      icon: Calendar,
      title: 'Meeting Coordination',
      description: 'Automated meeting scheduling with prospects, including calendar sync and reminders.'
    },
    {
      icon: TrendingUp,
      title: 'Pipeline Management',
      description: 'Real-time pipeline tracking with automated stage progression and deal alerts.'
    },
    {
      icon: Users,
      title: 'CRM Integration',
      description: 'Seamless integration with Salesforce, HubSpot, Pipedrive, and other major CRM platforms.'
    }
  ];

  const results = [
    { metric: '40%', label: 'Increase in qualified leads' },
    { metric: '25%', label: 'Faster deal closure' },
    { metric: '60%', label: 'More sales activities automated' },
    { metric: '3x', label: 'Improvement in follow-up consistency' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              For Sales Teams
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Supercharge your sales process with AI-powered automation. Focus on closing deals 
              while we handle lead qualification, follow-ups, and pipeline management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full" asChild>
                <Link to="/start-free-trial">Boost Sales Performance</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">See Sales Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Proven Sales Results</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See the impact our automation has on sales teams like yours
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {results.map((result, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-light text-blue-600 mb-2">{result.metric}</div>
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
            <h2 className="text-4xl font-light text-gray-900 mb-6">Sales Automation Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything your sales team needs to close more deals faster
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-green-500 w-fit mx-auto mb-6">
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

      {/* Use Case Example */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-light mb-8 text-center">Sales Automation in Action</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-medium mb-4">Without Automation</h4>
                <ul className="space-y-3 text-gray-300">
                  <li>• Manual lead qualification takes hours</li>
                  <li>• Inconsistent follow-up sequences</li>
                  <li>• Missed opportunities due to human error</li>
                  <li>• Time-consuming data entry and updates</li>
                  <li>• Difficulty tracking deal progression</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-medium mb-4">With 3days.ai</h4>
                <ul className="space-y-3 text-gray-300">
                  <li>• Instant lead scoring and qualification</li>
                  <li>• Automated, personalized follow-up sequences</li>
                  <li>• Never miss a follow-up or important task</li>
                  <li>• Automatic CRM updates and data sync</li>
                  <li>• Real-time pipeline insights and alerts</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 via-green-500 to-teal-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Close More Deals?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Join thousands of sales professionals who've automated their way to higher quotas.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              Start Selling Smarter
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Sales;
