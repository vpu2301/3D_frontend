
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Bot, Zap, Settings, BarChart3, Clock, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Automation = () => {
  const features = [
    {
      icon: Bot,
      title: 'AI-Powered Workflows',
      description: 'Create intelligent automation workflows that adapt and learn from your business processes.'
    },
    {
      icon: Zap,
      title: 'Instant Triggers',
      description: 'Set up automated responses to events, emails, form submissions, and data changes in real-time.'
    },
    {
      icon: Settings,
      title: 'Custom Logic Builder',
      description: 'Build complex decision trees and conditional logic without coding expertise.'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Track automation performance with detailed metrics and optimization suggestions.'
    },
    {
      icon: Clock,
      title: 'Scheduled Automations',
      description: 'Run automations on schedules, recurring intervals, or specific time-based conditions.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-grade security with encrypted data processing and compliance certifications.'
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              AI Automation
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Transform your business processes with intelligent automation that thinks, learns, 
              and adapts to your workflow needs. Save 15+ hours per week on repetitive tasks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-3 rounded-full" asChild>
                <Link to="/start-free-trial">Start Automating</Link>
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
            <h2 className="text-4xl font-light text-gray-900 mb-6">Automation Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to automate your business processes intelligently
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-[#111111] w-fit mx-auto mb-6">
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
            <h2 className="text-4xl font-light text-gray-900 mb-6">Common Use Cases</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See how businesses use our automation platform to save time and increase efficiency
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <h3 className="text-2xl font-medium text-gray-900 mb-4">Email & Communication</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Automated email responses and follow-ups</li>
                <li>• Lead qualification and nurturing sequences</li>
                <li>• Customer onboarding email series</li>
                <li>• Meeting scheduling and reminders</li>
              </ul>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <h3 className="text-2xl font-medium text-gray-900 mb-4">Data & Reports</h3>
              <ul className="space-y-3 text-gray-600">
                <li>• Daily/weekly automated reports</li>
                <li>• Data synchronization between systems</li>
                <li>• Performance monitoring alerts</li>
                <li>• Compliance documentation generation</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#f5ede3] text-[#111111] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Automate?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Start building intelligent automations that save you hours every week.
          </p>
          <Button size="lg" className="bg-[#111111] text-white hover:bg-[#222222] rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Automation;
