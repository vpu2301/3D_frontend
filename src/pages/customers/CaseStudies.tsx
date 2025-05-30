
import { Building2, TrendingUp, Users, ArrowRight, CheckCircle, Calendar, MessageCircle, Calculator, Search, Mic } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

const CaseStudies = () => {
  const caseStudies = [
    {
      company: "Executive Solutions Corp",
      industry: "Financial Services",
      worker: "Aria - Executive Assistant",
      challenge: "C-suite executives spending 60% of their time on administrative tasks, missing strategic opportunities and burning out from email overload",
      solution: "Deployed Aria AI Executive Assistant to handle email management, calendar coordination, meeting preparation, and executive reporting",
      results: "Executives reclaimed 25 hours per week for strategic work, 95% reduction in scheduling conflicts, 100% meeting preparation accuracy",
      savings: "$480,000 annually",
      icon: Calendar,
      color: "blue",
      timeline: "2 months",
      metrics: [
        { label: "Time Saved", value: "25 hrs/week", increase: true },
        { label: "Email Response Time", value: "< 30 min", increase: false },
        { label: "Meeting Efficiency", value: "+40%", increase: true },
        { label: "Executive Satisfaction", value: "98%", increase: true }
      ]
    },
    {
      company: "TechSupport Global",
      industry: "Technology",
      worker: "Atlas - Customer Support",
      challenge: "24/7 support demands with 40-minute average response times, 30% customer churn due to poor support experience, agents overwhelmed with repetitive queries",
      solution: "Implemented Atlas AI Customer Support Agent with intelligent ticket routing, automated FAQ responses, and seamless human handoff",
      results: "Response time reduced to 30 seconds, 85% of tickets resolved without human intervention, customer satisfaction increased to 96%",
      savings: "$750,000 annually",
      icon: MessageCircle,
      color: "emerald",
      timeline: "3 months",
      metrics: [
        { label: "Response Time", value: "30 sec", increase: false },
        { label: "Auto-Resolution", value: "85%", increase: true },
        { label: "Customer Satisfaction", value: "96%", increase: true },
        { label: "Agent Productivity", value: "+200%", increase: true }
      ]
    },
    {
      company: "MegaCorp Financial",
      industry: "Enterprise Finance",
      worker: "Felix - Finance Analyst",
      challenge: "Manual invoice processing taking 3 days per invoice, 15% error rate in financial data entry, month-end closing requiring 80 overtime hours",
      solution: "Deployed Felix AI Finance Analyst for automated invoice processing, expense management, financial reporting, and compliance monitoring",
      results: "Invoice processing reduced to 2 minutes, 99.8% accuracy rate, month-end closing completed 5 days faster with zero errors",
      savings: "$920,000 annually",
      icon: Calculator,
      color: "violet",
      timeline: "4 months",
      metrics: [
        { label: "Processing Speed", value: "150x faster", increase: true },
        { label: "Accuracy Rate", value: "99.8%", increase: true },
        { label: "Month-end Time", value: "-5 days", increase: false },
        { label: "Cost Reduction", value: "65%", increase: false }
      ]
    },
    {
      company: "Digital Marketing Pro",
      industry: "Marketing Agency",
      worker: "Maya - Marketing Specialist",
      challenge: "Campaign creation taking 2 weeks, inconsistent brand messaging across channels, manual A/B testing consuming 40 hours per campaign",
      solution: "Integrated Maya AI Marketing Specialist for campaign optimization, content personalization, performance analytics, and automated A/B testing",
      results: "Campaign creation reduced to 2 days, 300% increase in conversion rates, personalized content for 50,000+ customers daily",
      savings: "$650,000 annually",
      icon: TrendingUp,
      color: "pink",
      timeline: "3 months",
      metrics: [
        { label: "Campaign Speed", value: "7x faster", increase: true },
        { label: "Conversion Rate", value: "+300%", increase: true },
        { label: "Content Output", value: "50k/day", increase: true },
        { label: "ROI Improvement", value: "+250%", increase: true }
      ]
    },
    {
      company: "Research Institute Elite",
      industry: "Consulting",
      worker: "Sage - Research Analyst",
      challenge: "Market research projects taking 3 months, limited data sources, analysis accuracy varying by analyst expertise, client deliverables delayed by 40%",
      solution: "Deployed Sage AI Research Analyst for comprehensive data gathering, advanced analytics, report generation, and insight synthesis",
      results: "Research completion time reduced to 1 week, access to 10,000+ data sources, 95% client satisfaction with research quality",
      savings: "$580,000 annually",
      icon: Search,
      color: "indigo",
      timeline: "2 months",
      metrics: [
        { label: "Research Speed", value: "12x faster", increase: true },
        { label: "Data Sources", value: "10,000+", increase: true },
        { label: "Accuracy Rate", value: "97%", increase: true },
        { label: "Client Satisfaction", value: "95%", increase: true }
      ]
    }
  ];

  const getGradient = (color: string) => {
    const gradients = {
      blue: "from-blue-500 to-cyan-500",
      emerald: "from-emerald-500 to-teal-500",
      violet: "from-violet-500 to-purple-500",
      pink: "from-pink-500 to-rose-500",
      indigo: "from-indigo-500 to-blue-500"
    };
    return gradients[color as keyof typeof gradients] || gradients.blue;
  };

  const getBorderColor = (color: string) => {
    const colors = {
      blue: "border-blue-200",
      emerald: "border-emerald-200", 
      violet: "border-violet-200",
      pink: "border-pink-200",
      indigo: "border-indigo-200"
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
              Real AI Worker Success Stories
            </div>
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              AI Workers
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Delivering Results
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover how our specialized AI workers transformed operations across industries, 
              delivering unprecedented efficiency gains and cost savings.
            </p>
          </div>
        </div>
      </section>

      {/* Case Studies Carousel */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h2>
            <p className="text-lg text-gray-600">Swipe through real transformations across industries</p>
          </div>
          
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {caseStudies.map((study, index) => (
                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card className={`h-full border-2 ${getBorderColor(study.color)} shadow-2xl hover:shadow-3xl transition-all duration-300 hover:-translate-y-2 bg-white/90 backdrop-blur-sm overflow-hidden group`}>
                    <CardHeader className={`bg-gradient-to-br ${getGradient(study.color)} text-white relative overflow-hidden p-6`}>
                      <div className="absolute top-0 right-0 w-32 h-32 opacity-10 transform rotate-12 transition-transform group-hover:rotate-0">
                        <study.icon className="w-full h-full" />
                      </div>
                      <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                          <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
                            <study.icon className="h-8 w-8 text-white" />
                          </div>
                          <div className="text-right">
                            <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm block mb-1">
                              {study.timeline}
                            </span>
                            <span className="text-white/90 text-xs">{study.worker}</span>
                          </div>
                        </div>
                        <CardTitle className="text-xl text-white mb-2 font-bold">{study.company}</CardTitle>
                        <CardDescription className="text-white/90 text-sm font-medium">{study.industry}</CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="space-y-6 flex-grow">
                        {/* Challenge */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2 flex items-center text-sm">
                            <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                            Challenge
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{study.challenge}</p>
                        </div>
                        
                        {/* Solution */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2 flex items-center text-sm">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></div>
                            Solution
                          </h4>
                          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">{study.solution}</p>
                        </div>
                        
                        {/* Results */}
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2 flex items-center text-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            Results
                          </h4>
                          <p className="text-gray-600 text-sm mb-4 leading-relaxed line-clamp-2">{study.results}</p>
                          
                          {/* Metrics Grid */}
                          <div className="grid grid-cols-2 gap-2 mb-4">
                            {study.metrics.slice(0, 4).map((metric, idx) => (
                              <div key={idx} className="bg-gray-50 p-2 rounded-lg border">
                                <div className="text-xs text-gray-600 mb-1 truncate">{metric.label}</div>
                                <div className={`text-sm font-bold ${metric.increase ? 'text-green-600' : 'text-blue-600'}`}>
                                  {metric.value}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          {/* Savings Highlight */}
                          <div className={`bg-gradient-to-r ${getGradient(study.color)} p-4 rounded-xl text-white relative overflow-hidden`}>
                            <div className="absolute top-0 right-0 w-16 h-16 opacity-20">
                              <TrendingUp className="w-full h-full" />
                            </div>
                            <div className="relative z-10">
                              <p className="font-bold text-lg mb-1">{study.savings}</p>
                              <p className="text-white/90 text-xs">Annual savings achieved</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* Summary Stats */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Combined Impact Across All AI Workers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Collective results from deploying our specialized AI workforce
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">$3.38M+</div>
              <div className="text-gray-600">Total Annual Savings</div>
            </div>
            <div className="text-center bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">95%+</div>
              <div className="text-gray-600">Average Accuracy Rate</div>
            </div>
            <div className="text-center bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2">150x</div>
              <div className="text-gray-600">Maximum Speed Improvement</div>
            </div>
            <div className="text-center bg-white p-6 rounded-xl shadow-lg">
              <div className="text-4xl font-bold text-orange-600 mb-2">96%</div>
              <div className="text-gray-600">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Deploy Your
            <span className="block text-transparent bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text">AI Workforce?</span>
          </h2>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Join these industry leaders and experience the transformative power of specialized AI workers 
            designed for your specific business needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg" asChild>
              <Link to="/get-started">Deploy AI Workers <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 px-8 py-3 text-lg" asChild>
              <Link to="/watch-demo">See Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CaseStudies;
