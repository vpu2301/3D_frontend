
import { Search, BookOpen, TrendingUp, BarChart3, ArrowRight, FileText, Brain, Database } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Sage = () => {
  const features = [
    {
      icon: Search,
      title: 'Market Research Automation',
      description: 'Conducts comprehensive market research across multiple sources, providing detailed competitive analysis and market insights.'
    },
    {
      icon: FileText,
      title: 'Report Generation',
      description: 'Creates professional research reports with data visualization, executive summaries, and actionable recommendations.'
    },
    {
      icon: Database,
      title: 'Data Analysis & Mining',
      description: 'Analyzes large datasets to identify trends, patterns, and opportunities that drive strategic decisions.'
    },
    {
      icon: Brain,
      title: 'Competitive Intelligence',
      description: 'Monitors competitor activities, pricing strategies, and market positioning to maintain competitive advantage.'
    }
  ];

  const integrations = [
    'Bloomberg', 'Reuters', 'Factiva', 'Google Analytics', 'Tableau', 'Power BI'
  ];

  const roiStats = [
    { value: '80%', label: 'Faster Research Completion' },
    { value: '95%', label: 'Data Accuracy Rate' },
    { value: '$85K', label: 'Average Research Cost Savings' },
    { value: '24/7', label: 'Continuous Market Monitoring' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Meet Sage: Your
              <span className="block font-medium bg-gradient-to-r from-indigo-500 to-teal-500 bg-clip-text text-transparent">
                AI Research Analyst
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
              Sage delivers comprehensive research and analysis with unmatched speed and accuracy, 
              transforming how your organization gathers and processes business intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-md" asChild>
                <Link to="/start-free-trial">Try Sage Free</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-md" asChild>
                <Link to="/schedule-demo">Request a Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Stats */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Research Excellence</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Delivering insights that drive strategic decision-making
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
              Advanced research capabilities that deliver actionable intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-teal-500 mr-4">
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
            <h2 className="text-4xl font-light text-gray-900 mb-6">Data Source Integrations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connects to premium research databases and analytics platforms
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
      <section className="py-20 bg-gradient-to-r from-indigo-500 via-teal-500 to-cyan-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready for Smarter Research?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Let Sage handle complex research while you focus on strategic decision-making.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-md py-3" asChild>
            <Link to="/start-free-trial">
              Try Sage Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Sage;
