
import { ArrowRight, Play, CheckCircle, Star, Shield, Zap, Target, TrendingUp, Clock, Users, DollarSign, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const WatchDemo = () => {
  const stats = [
    { value: '60-85%', label: 'Time Reduction', description: 'Per automated process' },
    { value: '40-60%', label: 'Cost Savings', description: 'Operational expenses' },
    { value: '6.2 months', label: 'Payback Period', description: 'Typical enterprise' },
    { value: '650%', label: '3-Year ROI', description: 'Average customer' }
  ];

  const digitalWorkers = [
    {
      title: 'Administrative Operations',
      description: 'Calendar management, email processing, document generation',
      timeSavings: '15-20 hours/week',
      accuracy: '99.5%',
      icon: Clock
    },
    {
      title: 'Customer Service',
      description: '24/7 support, ticket management, knowledge base queries',
      timeSavings: '70% faster response',
      accuracy: '85% first contact resolution',
      icon: Users
    },
    {
      title: 'Financial Operations',
      description: 'Invoice processing, payment handling, expense management',
      timeSavings: '80% faster cycles',
      accuracy: '99.8%',
      icon: DollarSign
    },
    {
      title: 'Data Analytics',
      description: 'Report generation, KPI monitoring, trend analysis',
      timeSavings: '90% reduction in reporting time',
      accuracy: '99.9%',
      icon: BarChart3
    }
  ];

  const targetIndustries = [
    'Financial Services & Banking',
    'Healthcare & Life Sciences',
    'Manufacturing & Supply Chain',
    'Professional Services',
    'Government & Public Sector'
  ];

  const keyFeatures = [
    {
      title: 'AI-Powered Decision Engine',
      description: 'Advanced NLP, machine learning, and computer vision with 99.2% OCR accuracy',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Enterprise Security',
      description: 'SOC 2 Type II, ISO 27001, GDPR, and HIPAA compliant with zero-trust architecture',
      gradient: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Rapid Implementation',
      description: '90-day deployment with 200+ pre-built integrations and no-code workflow designer',
      gradient: 'from-green-500 to-emerald-500'
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 tracking-tight leading-none">
              Watch 3days.ai
              <span className="block font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Transform Enterprise
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed">
              See how our AI-powered digital workforce platform eliminates the $2.1 trillion annual productivity loss 
              by automating complex, multi-step business processes with human-like intelligence.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="lg" 
                className="bg-black hover:bg-gray-800 text-white text-lg px-12 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
              >
                <Play className="mr-3 h-5 w-5" />
                Watch Full Demo
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4 rounded-full border border-gray-200 hover:bg-gray-50 transition-all duration-300"
                asChild
              >
                <Link to="/start-free-trial">
                  Start Free Trial
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Video Demo Placeholder */}
          <div className="relative max-w-5xl mx-auto mb-20">
            <div className="aspect-video bg-gradient-to-br from-gray-900 to-black rounded-3xl shadow-2xl flex items-center justify-center overflow-hidden">
              <div className="text-center text-white">
                <Play className="h-24 w-24 mx-auto mb-6 opacity-80" />
                <h3 className="text-2xl font-light mb-2">Enterprise Demo Video</h3>
                <p className="text-gray-300">See 3days.ai digital workers in action</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Executive Summary */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              The Enterprise Productivity Crisis
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
              Knowledge workers waste 60-70% of their time on routine, automatable tasks, 
              creating a $2.1 trillion annual productivity loss. Unlike traditional RPA solutions 
              that break easily, 3days.ai handles unstructured tasks requiring decision-making 
              and contextual understanding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm text-center hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="text-4xl font-light text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-lg font-medium text-gray-900 mb-2">{stat.label}</div>
                  <div className="text-gray-600 font-light text-sm">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Platform Architecture & Core Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Built on microservices architecture for scalability, reliability, and enterprise-grade performance.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm overflow-hidden group"
              >
                <CardContent className="p-8">
                  <div className={`h-1 w-16 bg-gradient-to-r ${feature.gradient} mb-6 transition-all duration-500 group-hover:w-24`}></div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed font-light">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Digital Worker Portfolio */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Digital Worker Portfolio
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              AI-powered automation agents designed to handle specific business functions 
              with human-like intelligence and decision-making capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {digitalWorkers.map((worker, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 mr-4">
                      <worker.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">{worker.title}</h3>
                  </div>
                  <p className="text-gray-600 mb-6 leading-relaxed">{worker.description}</p>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Time Savings:</span>
                      <span className="font-medium text-gray-900">{worker.timeSavings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Accuracy:</span>
                      <span className="font-medium text-gray-900">{worker.accuracy}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Target Industries */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Target Industries
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Serving 100+ enterprise customers globally across major industries.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {targetIndustries.map((industry, index) => (
              <div 
                key={index} 
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group text-center"
              >
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 group-hover:scale-150 transition-transform duration-300"></div>
                <span className="text-gray-800 font-medium">{industry}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center mb-8">
                <Shield className="h-12 w-12 text-blue-400 mr-4" />
                <h2 className="text-4xl font-light">Enterprise-Grade Security</h2>
              </div>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed font-light">
                Zero-trust security architecture with comprehensive compliance certifications 
                and 24/7 security monitoring.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  'SOC 2 Type II Certified',
                  'ISO 27001:2013',
                  'GDPR & CCPA Compliant',
                  'HIPAA Ready',
                  'FedRAMP Compatible',
                  '99.9% Uptime SLA'
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl border border-gray-700">
              <h3 className="text-2xl font-light mb-6">Ready to Transform Your Operations?</h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Contact our enterprise team for a custom demonstration, detailed ROI analysis, 
                and technical consultation tailored to your organization's needs.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <span className="text-gray-400 w-20">Email:</span>
                  <span className="text-white">enterprise@3days.ai</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 w-20">Phone:</span>
                  <span className="text-white">+1 (555) 3DAYS-AI</span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-400 w-20">Demo:</span>
                  <span className="text-white">demo.3days.ai</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-100 rounded-full py-3 transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link to="/start-free-trial">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 rounded-full py-3 transition-all duration-300"
                  asChild
                >
                  <Link to="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default WatchDemo;
