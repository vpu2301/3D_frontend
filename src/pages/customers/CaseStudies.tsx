
import { Building2, TrendingUp, Users, ArrowRight, CheckCircle } from 'lucide-react';
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
      color: "blue",
      timeline: "3 months"
    },
    {
      company: "Global Marketing Inc.",
      industry: "Marketing Agency",
      challenge: "Content creation and campaign analysis consuming excessive resources",
      solution: "AI Marketing Assistant for content creation and performance analysis",
      results: "300% increase in content output, 60% improvement in campaign ROI",
      savings: "$250,000 annually",
      icon: TrendingUp,
      color: "emerald",
      timeline: "2 months"
    },
    {
      company: "CustomerFirst Support",
      industry: "SaaS",
      challenge: "24/7 customer support demands overwhelming human agents",
      solution: "AI Customer Support Agent for ticket routing and FAQ handling",
      results: "70% of tickets resolved automatically, 24/7 availability",
      savings: "$320,000 annually",
      icon: Users,
      color: "violet",
      timeline: "4 months"
    }
  ];

  const getGradient = (color: string) => {
    const gradients = {
      blue: "from-blue-500 to-cyan-500",
      emerald: "from-emerald-500 to-teal-500",
      violet: "from-violet-500 to-purple-500"
    };
    return gradients[color as keyof typeof gradients] || gradients.blue;
  };

  const getBorderColor = (color: string) => {
    const colors = {
      blue: "border-blue-200",
      emerald: "border-emerald-200", 
      violet: "border-violet-200"
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full text-blue-700 text-sm font-medium mb-6">
              <CheckCircle className="h-4 w-4 mr-2" />
              Real Success Stories
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Transforming
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Businesses
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover how forward-thinking companies achieved extraordinary results with AI automation, 
              saving millions and transforming their operations.
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Layout */}
      <section className="py-20 relative">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-emerald-500 to-violet-500 transform md:-translate-x-px"></div>
            
            <div className="space-y-16">
              {caseStudies.map((study, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  {/* Timeline Dot */}
                  <div className={`absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-gradient-to-r ${getGradient(study.color)} transform md:-translate-x-2 z-10 ring-4 ring-white shadow-lg`}></div>
                  
                  {/* Content Card */}
                  <div className={`w-full md:w-5/12 ml-16 md:ml-0 ${index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'}`}>
                    <Card className={`border-2 ${getBorderColor(study.color)} shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm`}>
                      <CardHeader className={`bg-gradient-to-r ${getGradient(study.color)} text-white relative overflow-hidden`}>
                        <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
                          <study.icon className="w-full h-full" />
                        </div>
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-4">
                            <div className="bg-white/20 p-3 rounded-lg backdrop-blur-sm">
                              <study.icon className="h-8 w-8 text-white" />
                            </div>
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                              {study.timeline}
                            </span>
                          </div>
                          <CardTitle className="text-2xl text-white mb-2">{study.company}</CardTitle>
                          <CardDescription className="text-white/90 text-lg">{study.industry}</CardDescription>
                        </div>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div className="space-y-6">
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                              <div className="w-2 h-2 bg-red-500 rounded-full mr-3"></div>
                              Challenge
                            </h4>
                            <p className="text-gray-600 pl-5">{study.challenge}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                              Solution
                            </h4>
                            <p className="text-gray-600 pl-5">{study.solution}</p>
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                              Results
                            </h4>
                            <p className="text-gray-600 pl-5 mb-4">{study.results}</p>
                            <div className={`bg-gradient-to-r ${getGradient(study.color)} p-4 rounded-lg text-white`}>
                              <p className="font-bold text-xl">{study.savings}</p>
                              <p className="text-white/90 text-sm">Annual savings achieved</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Be Our Next
            <span className="block text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">Success Story?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join these industry leaders and transform your business with AI automation that delivers real results.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg" asChild>
              <Link to="/get-started">Start Your Transformation <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg" asChild>
              <Link to="/watch-demo">Watch Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;
