
import { Brain, Lightbulb, BookOpen, Users, ArrowRight, Search, FileText, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Sage = () => {
  const features = [
    {
      icon: Brain,
      title: 'Intelligent Knowledge Management',
      description: 'Organizes and analyzes vast amounts of information to provide instant access to relevant insights and data.'
    },
    {
      icon: Search,
      title: 'Advanced Research & Analysis',
      description: 'Conducts comprehensive research across multiple sources and provides detailed analytical reports.'
    },
    {
      icon: FileText,
      title: 'Document Processing & Synthesis',
      description: 'Processes complex documents and synthesizes key information into actionable insights.'
    },
    {
      icon: Lightbulb,
      title: 'Strategic Recommendations',
      description: 'Provides data-driven strategic recommendations based on comprehensive analysis and industry trends.'
    }
  ];

  const integrations = [
    'Confluence', 'Notion', 'SharePoint', 'Google Drive', 'Dropbox', 'Slack'
  ];

  const roiStats = [
    { value: '80%', label: 'Research Time Reduction' },
    { value: '95%', label: 'Information Accuracy' },
    { value: '15min', label: 'Average Analysis Time' },
    { value: '1000+', label: 'Sources Analyzed Daily' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[#f5ede3] to-white dark:from-[#181512] dark:to-[#1c1916]">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
                Meet Sage: Your
                <span className="block font-medium text-[#111111]">
                  AI Knowledge Specialist
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto lg:mx-0 font-light leading-relaxed">
                Sage is an advanced AI knowledge specialist that processes information, conducts research, 
                and provides strategic insights to help you make informed decisions faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
                <Button className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-3 rounded-md" asChild>
                  <Link to="/start-free-trial">Try Sage Free</Link>
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-md" asChild>
                  <Link to="/schedule-demo">Request a Demo</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <div className="relative rounded-2xl overflow-hidden">
                <img 
                  src="/lovable-uploads/51f15fda-c4d2-4d7d-afcb-35578649ec78.png" 
                  alt="Sage - AI Knowledge Specialist"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900">Sage Active</span>
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
            <h2 className="text-4xl font-light text-gray-900 mb-6">Knowledge Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Measurable improvements in research efficiency and decision-making speed
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
              Advanced knowledge management capabilities powered by artificial intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 mr-4">
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
            <h2 className="text-4xl font-light text-gray-900 mb-6">Knowledge Base Integrations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seamlessly connects with your existing knowledge management tools
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
      <section className="py-20 bg-[#f5ede3] text-[#111111] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Meet Sage?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Transform your knowledge management with an AI that never stops learning.
          </p>
          <Button size="lg" className="bg-[#111111] text-white hover:bg-[#222222] rounded-full py-3" asChild>
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
