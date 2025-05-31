import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { BarChart, FileText, Clock, Zap, ArrowRight, TrendingUp, PieChart, Calendar, Download, Eye, Share, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ReportGeneration = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Generate reports in minutes instead of hours with automated data collection'
    },
    {
      icon: Zap,
      title: 'Real-time Data',
      description: 'Access up-to-date information with live data connections'
    },
    {
      icon: Eye,
      title: 'Visual Insights',
      description: 'Transform raw data into compelling charts and visualizations'
    },
    {
      icon: Share,
      title: 'Easy Sharing',
      description: 'Distribute reports automatically to stakeholders via email or dashboards'
    }
  ];

  const reportTypes = [
    {
      icon: BarChart,
      title: 'Financial Reports',
      description: 'P&L statements, balance sheets, and cash flow reports',
      features: ['Automated calculations', 'Multi-period comparisons', 'Variance analysis']
    },
    {
      icon: TrendingUp,
      title: 'Performance Reports',
      description: 'KPI tracking, goal progress, and performance metrics',
      features: ['Custom KPIs', 'Trend analysis', 'Benchmarking']
    },
    {
      icon: PieChart,
      title: 'Analytics Reports',
      description: 'Customer analytics, sales performance, and market insights',
      features: ['Data visualization', 'Predictive analytics', 'Segmentation']
    },
    {
      icon: FileText,
      title: 'Compliance Reports',
      description: 'Regulatory reporting, audit trails, and compliance dashboards',
      features: ['Audit trails', 'Regulatory templates', 'Exception reporting']
    }
  ];

  const features = [
    {
      icon: Calendar,
      title: 'Scheduled Reports',
      description: 'Automatically generate and deliver reports on your schedule'
    },
    {
      icon: Filter,
      title: 'Dynamic Filtering',
      description: 'Create interactive reports with filters and drill-down capabilities'
    },
    {
      icon: Download,
      title: 'Multiple Formats',
      description: 'Export reports in PDF, Excel, PowerPoint, and web formats'
    },
    {
      icon: Share,
      title: 'Smart Distribution',
      description: 'Automatically send reports to the right people at the right time'
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-6">
              <BarChart className="h-4 w-4 mr-2" />
              Automated Report Generation
            </div>
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Generate Reports Instantly
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-light max-w-3xl mx-auto">
              Transform your data into professional reports automatically. Save hours of manual work with intelligent report generation and distribution
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full" asChild>
                <Link to="/get-started">Start Generating</Link>
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
            <p className="text-xl text-gray-600">Transform how your organization creates and shares insights</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 w-fit mx-auto mb-6">
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

      {/* Report Types */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Types of Reports</h2>
            <p className="text-xl text-gray-600">Pre-built templates for every business need</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reportTypes.map((report, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 mr-4">
                    <report.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-medium text-gray-900">{report.title}</h3>
                    <p className="text-gray-600">{report.description}</p>
                  </div>
                </div>
                <ul className="space-y-2">
                  {report.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Powerful Report Features</h2>
            <p className="text-xl text-gray-600">Everything you need for professional reporting</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 w-fit mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-light text-blue-600 mb-2">90%</div>
              <div className="text-gray-600">Time Saved</div>
            </div>
            <div>
              <div className="text-4xl font-light text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Report Templates</div>
            </div>
            <div>
              <div className="text-4xl font-light text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Automated Generation</div>
            </div>
            <div>
              <div className="text-4xl font-light text-blue-600 mb-2">100%</div>
              <div className="text-gray-600">Data Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-6">Ready to Automate Your Reports?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Stop spending hours on manual reporting. Start generating professional reports in minutes
          </p>
          <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full" asChild>
            <Link to="/get-started">
              Start Generating Reports
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
