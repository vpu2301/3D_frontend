
import { Calculator, FileText, DollarSign, TrendingUp, ArrowRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Felix = () => {
  const features = [
    {
      icon: FileText,
      title: 'Automated Invoice Processing',
      description: 'Extracts data from invoices, validates against purchase orders, and routes for approval automatically.'
    },
    {
      icon: CheckCircle,
      title: 'Expense Approvals & Routing',
      description: 'Streamlines expense report processing with intelligent approval workflows and policy compliance.'
    },
    {
      icon: DollarSign,
      title: 'Financial Data Analysis',
      description: 'Generates insights from financial data patterns and identifies cost-saving opportunities.'
    },
    {
      icon: TrendingUp,
      title: 'Automated Reporting',
      description: 'Creates comprehensive financial reports with real-time data and trend analysis.'
    }
  ];

  const integrations = [
    'QuickBooks', 'SAP', 'Oracle Financials', 'NetSuite', 'Xero', 'Sage'
  ];

  const roiStats = [
    { value: '60%', label: 'Faster Invoice Processing' },
    { value: '98.7%', label: 'Data Accuracy Rate' },
    { value: '$45K', label: 'Average Cost Savings (3 months)' },
    { value: '90%', label: 'Backlog Reduction' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[#f5ede3] to-white dark:from-[#181512] dark:to-[#1c1916]">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
                Meet Felix: Your
                <span className="block font-medium bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  AI Finance Analyst
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto lg:mx-0 font-light leading-relaxed">
                Felix automates invoice processing, expense approvals, and other routine financial tasks 
                with near-perfect accuracy, freeing your finance team for strategic analysis.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
                <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-md" asChild>
                  <Link to="/start-free-trial">Try Felix Free</Link>
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-md" asChild>
                  <Link to="/schedule-demo">Request a Demo</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <div className="relative rounded-2xl overflow-hidden">
                <img 
                  src="/lovable-uploads/d25c8b0d-526c-429b-8628-32fd29d10bd9.png" 
                  alt="Felix - AI Finance Analyst"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900">Felix Active</span>
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
            <h2 className="text-4xl font-light text-gray-900 mb-6">Financial Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real impact on financial operations and cost savings
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
              Comprehensive financial automation that scales with your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-500 mr-4">
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
            <h2 className="text-4xl font-light text-gray-900 mb-6">Enterprise Integrations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seamlessly connects with your existing financial systems
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
      <section className="py-20 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Automate Finance?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Let Felix handle the numbers while your team focuses on strategic finance decisions.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-md py-3" asChild>
            <Link to="/start-free-trial">
              Try Felix Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Felix;
