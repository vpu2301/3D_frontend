
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, DollarSign, FileText, TrendingUp, Calculator, CreditCard, BarChart3, Shield, Clock, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Finance = () => {
  const features = [
    {
      icon: DollarSign,
      title: 'Invoice Processing',
      description: 'Automated invoice generation, approval workflows, and payment processing with vendor management.'
    },
    {
      icon: FileText,
      title: 'Financial Reporting',
      description: 'Real-time financial reports, compliance documents, and regulatory filing automation.'
    },
    {
      icon: TrendingUp,
      title: 'Budget Analysis',
      description: 'Intelligent budget forecasting, variance analysis, and spend optimization recommendations.'
    },
    {
      icon: Calculator,
      title: 'Expense Management',
      description: 'Automated expense report processing, policy compliance, and reimbursement workflows.'
    },
    {
      icon: CreditCard,
      title: 'Accounts Payable',
      description: 'Streamlined AP processes with three-way matching and automated payment scheduling.'
    },
    {
      icon: BarChart3,
      title: 'Financial Analytics',
      description: 'Advanced financial modeling, KPI tracking, and predictive analytics for strategic planning.'
    }
  ];

  const processes = [
    {
      name: 'Month-End Close',
      description: 'Accelerate financial close processes',
      tasks: ['Journal entry automation', 'Reconciliation workflows', 'Financial statement prep', 'Variance analysis'],
      improvement: '75% faster'
    },
    {
      name: 'Accounts Payable',
      description: 'Streamline vendor payments and approvals',
      tasks: ['Invoice capture', 'Three-way matching', 'Approval routing', 'Payment processing'],
      improvement: '80% less manual work'
    },
    {
      name: 'Financial Planning',
      description: 'Automate budgeting and forecasting',
      tasks: ['Budget consolidation', 'Forecast modeling', 'Scenario planning', 'Variance reporting'],
      improvement: '60% more accurate'
    }
  ];

  const metrics = [
    { value: '90%', label: 'Reduction in processing time' },
    { value: '99.5%', label: 'Accuracy in calculations' },
    { value: '65%', label: 'Faster month-end close' },
    { value: '50%', label: 'Cost savings on operations' }
  ];

  const complianceFeatures = [
    { name: 'GAAP Compliance', description: 'Automated compliance with accounting standards' },
    { name: 'SOX Controls', description: 'Sarbanes-Oxley compliance and audit trails' },
    { name: 'Tax Reporting', description: 'Automated tax calculations and filing' },
    { name: 'Regulatory Filing', description: 'Streamlined regulatory report generation' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              For Finance Teams
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Automate your financial operations with precision and control. From invoice processing 
              to financial reporting, enhance accuracy while reducing manual work by 90%.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full" asChild>
                <Link to="/start-free-trial">Streamline Finance</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">See Finance Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Financial Operations Results</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proven results from finance teams using intelligent automation
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-light text-emerald-600 mb-2">{metric.value}</div>
                <div className="text-gray-600">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Finance Automation Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools to automate every aspect of financial operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-blue-500 w-fit mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Processes */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Automated Financial Processes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              End-to-end automation for critical finance workflows
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {processes.map((process, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-3xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-medium text-gray-900">{process.name}</h3>
                  <div className="text-emerald-600 font-medium">{process.improvement}</div>
                </div>
                <p className="text-gray-600 mb-6">{process.description}</p>
                <div className="space-y-3">
                  {process.tasks.map((task, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{task}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Financial Workflow */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Automated Financial Workflow</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Capture</h3>
              <p className="text-gray-600">Automated data entry and document processing</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Validate</h3>
              <p className="text-gray-600">Intelligent validation and compliance checks</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Process</h3>
              <p className="text-gray-600">Automated workflow routing and approvals</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Report</h3>
              <p className="text-gray-600">Real-time reporting and analytics</p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance & Security */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Compliance & Security</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built-in compliance features to meet regulatory requirements
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {complianceFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-2xl text-center">
                <Shield className="h-12 w-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-light mb-8 text-center">Finance Automation ROI</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-medium mb-4">Cost Savings</h4>
                <ul className="space-y-3 text-gray-300">
                  <li>• 50-70% reduction in processing costs</li>
                  <li>• Elimination of manual data entry errors</li>
                  <li>• Reduced audit and compliance costs</li>
                  <li>• Faster month-end close cycles</li>
                  <li>• Optimized cash flow management</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-medium mb-4">Business Benefits</h4>
                <ul className="space-y-3 text-gray-300">
                  <li>• Real-time financial visibility</li>
                  <li>• Improved decision-making speed</li>
                  <li>• Enhanced regulatory compliance</li>
                  <li>• Better vendor relationships</li>
                  <li>• Strategic focus for finance teams</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ERP Integrations */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">ERP & Financial System Integrations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seamlessly connect with your existing financial infrastructure
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calculator className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="font-medium text-gray-900">ERP Systems</h3>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">BI Platforms</h3>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CreditCard className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900">Payment Systems</h3>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-medium text-gray-900">Accounting Software</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Transform Finance?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Automate your financial operations and focus on strategic growth initiatives.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              Start Financial Automation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Finance;
