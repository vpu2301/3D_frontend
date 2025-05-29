
import { Building2, TrendingUp, Clock, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const CaseStudies = () => {
  const caseStudies = [
    {
      company: "TechCorp Solutions",
      industry: "Technology",
      challenge: "Manual invoice processing taking 40+ hours per week",
      solution: "AI Finance Assistant for automated invoice processing and AP/AR",
      results: "85% reduction in processing time, 99.5% accuracy rate",
      savings: "$180,000 annually",
      icon: Building2,
      color: "blue"
    },
    {
      company: "Global Marketing Inc.",
      industry: "Marketing Agency",
      challenge: "Content creation and campaign analysis consuming excessive resources",
      solution: "AI Marketing Assistant for content creation and performance analysis",
      results: "300% increase in content output, 60% improvement in campaign ROI",
      savings: "$250,000 annually",
      icon: TrendingUp,
      color: "green"
    },
    {
      company: "CustomerFirst Support",
      industry: "SaaS",
      challenge: "24/7 customer support demands overwhelming human agents",
      solution: "AI Customer Support Agent for ticket routing and FAQ handling",
      results: "70% of tickets resolved automatically, 24/7 availability",
      savings: "$320,000 annually",
      icon: Users,
      color: "purple"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-gray-50 to-blue-50 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Customer
              <span className="text-blue-600 block">Case Studies</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Real companies achieving extraordinary results with AI automation. See how our customers transformed their operations.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
            {caseStudies.map((study, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className={`bg-${study.color}-50 border-b`}>
                  <div className="flex items-center space-x-4">
                    <div className={`bg-${study.color}-100 p-3 rounded-lg`}>
                      <study.icon className={`h-8 w-8 text-${study.color}-600`} />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{study.company}</CardTitle>
                      <CardDescription className="text-lg">{study.industry}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Challenge</h4>
                      <p className="text-gray-600">{study.challenge}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Solution</h4>
                      <p className="text-gray-600">{study.solution}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Results</h4>
                      <p className="text-gray-600 mb-4">{study.results}</p>
                      <div className={`bg-${study.color}-50 p-4 rounded-lg`}>
                        <p className={`font-bold text-${study.color}-700 text-lg`}>{study.savings}</p>
                        <p className="text-sm text-gray-600">Annual savings</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join these companies and transform your business with AI automation.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
            <Link to="/get-started">Start Your Transformation <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;
