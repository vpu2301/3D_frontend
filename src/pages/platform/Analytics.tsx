
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BarChart3, TrendingUp, Eye, PieChart, Activity, Target, Clock, Users, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const Analytics = () => {
  const features = [
    {
      icon: BarChart3,
      title: 'Real-time Dashboards',
      description: 'Monitor your automation performance with live, interactive dashboards that update in real-time.'
    },
    {
      icon: TrendingUp,
      title: 'Performance Metrics',
      description: 'Track key performance indicators and see how automation improves your business efficiency.'
    },
    {
      icon: PieChart,
      title: 'ROI Analysis',
      description: 'Measure the return on investment of your automation initiatives with detailed financial insights.'
    },
    {
      icon: Activity,
      title: 'Process Analytics',
      description: 'Deep dive into individual process performance and identify optimization opportunities.'
    },
    {
      icon: Target,
      title: 'Goal Tracking',
      description: 'Set and monitor automation goals with progress tracking and achievement notifications.'
    },
    {
      icon: Eye,
      title: 'Predictive Insights',
      description: 'Leverage AI-powered predictions to forecast trends and optimize your workflows proactively.'
    }
  ];

  const metrics = [
    { value: '85%', label: 'Average time saved' },
    { value: '99.9%', label: 'Uptime reliability' },
    { value: '50+', label: 'Performance indicators' },
    { value: '24/7', label: 'Real-time monitoring' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-[color:var(--paper)]">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-[color:var(--ink)] mb-6 tracking-tight">
              Analytics Dashboard
            </h1>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto font-light leading-relaxed">
              Transform raw data into actionable insights. Monitor, analyze, and optimize your 
              automation performance with comprehensive analytics and real-time reporting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-[color:var(--ink)] hover:bg-[color:var(--text-2)] text-white px-8 py-3 rounded-full" asChild>
                <Link to="/start-free-trial">Explore Analytics</Link>
              </Button>
              <Button variant="outline" className="border-[color:var(--line)] text-[color:var(--ink)] hover:bg-[color:var(--sand)] px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">View Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 px-4 bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-light text-[color:var(--blue)] mb-2">{metric.value}</div>
                <div className="text-[color:var(--text-2)]">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-[color:var(--sand)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Powerful Analytics Features</h2>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto">
              Everything you need to understand and optimize your automation performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-[28px] bg-[color:var(--ink)] w-fit mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-[color:var(--ink)] mb-4">{feature.title}</h3>
                  <p className="text-[color:var(--text-2)] leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-20 px-4 bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[color:var(--paper)] rounded-[28px] p-12 text-[color:var(--ink)] border border-[color:var(--line)]">
            <h3 className="text-3xl font-light mb-8 text-center">Analytics in Action</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-medium mb-4">Real-time Monitoring</h4>
                <ul className="space-y-3 text-[color:var(--text-2)]">
                  <li>• Live performance metrics and KPIs</li>
                  <li>• Instant alerts for anomalies</li>
                  <li>• Resource utilization tracking</li>
                  <li>• Process execution monitoring</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-medium mb-4">Advanced Reporting</h4>
                <ul className="space-y-3 text-[color:var(--text-2)]">
                  <li>• Customizable dashboard views</li>
                  <li>• Automated report generation</li>
                  <li>• Historical trend analysis</li>
                  <li>• Exportable data formats</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[color:var(--sand)] text-[color:var(--ink)] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Start Analyzing Today</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Unlock the power of data-driven automation optimization.
          </p>
          <Button size="lg" className="bg-[color:var(--ink)] text-white hover:bg-[color:var(--text-2)] rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              Try Analytics Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Analytics;
