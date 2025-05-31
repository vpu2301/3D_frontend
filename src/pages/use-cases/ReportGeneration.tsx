
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, FileText, Calendar, Download, ArrowRight, TrendingUp, Clock, Users, Zap, PieChart, LineChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ReportGeneration = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Generate comprehensive reports in minutes instead of hours or days'
    },
    {
      icon: TrendingUp,
      title: 'Accurate Data',
      description: 'Eliminate human errors with automated data collection and analysis'
    },
    {
      icon: Users,
      title: 'Consistent Format',
      description: 'Standardized report templates ensure consistency across all departments'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Reports update automatically as new data becomes available'
    }
  ];

  const features = [
    {
      icon: BarChart,
      title: 'Dynamic Charts & Graphs',
      description: 'Automatically generate visualizations from your data'
    },
    {
      icon: FileText,
      title: 'Custom Templates',
      description: 'Create and customize report templates for different needs'
    },
    {
      icon: Calendar,
      title: 'Scheduled Reports',
      description: 'Set up automatic report generation and distribution'
    },
    {
      icon: Download,
      title: 'Multiple Formats',
      description: 'Export reports in PDF, Excel, Word, and PowerPoint formats'
    }
  ];

  const reportTypes = [
    {
      icon: PieChart,
      title: 'Financial Reports',
      description: 'P&L statements, balance sheets, cash flow reports'
    },
    {
      icon: LineChart,
      title: 'Performance Analytics',
      description: 'KPI dashboards, sales performance, operational metrics'
    },
    {
      icon: BarChart,
      title: 'Compliance Reports',
      description: 'Regulatory compliance, audit reports, risk assessments'
    },
    {
      icon: TrendingUp,
      title: 'Business Intelligence',
      description: 'Market analysis, customer insights, trend reports'
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
              <FileText className="h-4 w-4 mr-2" />
              Automated Report Generation
            </div>
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Automate Report Generation
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-light max-w-3xl mx-auto">
              Transform your reporting process with AI-powered automation that creates professional reports instantly from your data
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full" asChild>
                <Link to="/get-started">Start Automating</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">Watch Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Why Automate Report Generation?</h2>
            <p className="text-xl text-gray-600">Transform manual reporting into intelligent automation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 w-fit mx-auto mb-6">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Report Generation Features</h2>
            <p className="text-xl text-gray-600">Everything you need for professional automated reporting</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 mr-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Report Types */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Types of Reports</h2>
            <p className="text-xl text-gray-600">Generate any type of business report automatically</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {reportTypes.map((type, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-3xl text-center">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 w-fit mx-auto mb-6">
                  <type.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">{type.title}</h3>
                <p className="text-gray-600">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-6">Ready to Automate Your Reports?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Start generating professional reports automatically and save hours every week
          </p>
          <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full" asChild>
            <Link to="/get-started">
              Start Automating Reports
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ReportGeneration;
