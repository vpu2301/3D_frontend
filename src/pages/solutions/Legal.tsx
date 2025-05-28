
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Scale, FileText, Search, Shield, Clock, Users, BarChart3, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Legal = () => {
  const features = [
    {
      icon: Scale,
      title: 'Contract Analysis',
      description: 'AI-powered contract review, risk assessment, and clause extraction with intelligent recommendations.'
    },
    {
      icon: FileText,
      title: 'Document Generation',
      description: 'Automated legal document creation using intelligent templates and precedent analysis.'
    },
    {
      icon: Search,
      title: 'Legal Research',
      description: 'Intelligent legal research with case law analysis, citation checking, and precedent discovery.'
    },
    {
      icon: Shield,
      title: 'Compliance Monitoring',
      description: 'Real-time compliance tracking, regulatory updates, and automated policy management.'
    },
    {
      icon: Clock,
      title: 'Matter Management',
      description: 'Comprehensive case and matter tracking with deadline management and workflow automation.'
    },
    {
      icon: Users,
      title: 'Client Communication',
      description: 'Automated client updates, billing integration, and secure document sharing platforms.'
    }
  ];

  const legalProcesses = [
    {
      name: 'Contract Lifecycle',
      description: 'End-to-end contract management automation',
      stages: ['Contract drafting', 'Review & negotiation', 'Approval workflows', 'Execution & storage', 'Renewal tracking'],
      efficiency: '70% faster processing'
    },
    {
      name: 'Due Diligence',
      description: 'Streamlined due diligence processes',
      stages: ['Document collection', 'Risk assessment', 'Compliance verification', 'Report generation', 'Issue tracking'],
      efficiency: '60% time reduction'
    },
    {
      name: 'Litigation Support',
      description: 'Automated litigation and discovery workflows',
      stages: ['Case intake', 'Document review', 'Evidence organization', 'Timeline creation', 'Report preparation'],
      efficiency: '80% cost savings'
    }
  ];

  const metrics = [
    { value: '85%', label: 'Reduction in review time' },
    { value: '95%', label: 'Contract accuracy improvement' },
    { value: '60%', label: 'Faster document turnaround' },
    { value: '40%', label: 'Lower legal operation costs' }
  ];

  const complianceAreas = [
    { name: 'GDPR Compliance', description: 'Data protection and privacy regulation compliance' },
    { name: 'Corporate Governance', description: 'Board resolutions and corporate compliance tracking' },
    { name: 'Regulatory Filings', description: 'Automated regulatory report generation and filing' },
    { name: 'IP Management', description: 'Intellectual property tracking and protection workflows' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              For Legal Teams
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Revolutionize legal operations with AI-powered automation. From contract analysis to 
              compliance monitoring, enhance accuracy and efficiency while reducing manual work by 85%.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full" asChild>
                <Link to="/start-free-trial">Enhance Legal Operations</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">See Legal Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Legal Operations Results</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Measurable improvements in legal efficiency and accuracy
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-light text-amber-600 mb-2">{metric.value}</div>
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
            <h2 className="text-4xl font-light text-gray-900 mb-6">Legal Automation Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools to streamline legal operations and enhance service delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 w-fit mx-auto mb-6">
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

      {/* Legal Processes */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Automated Legal Processes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline complex legal workflows with intelligent automation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {legalProcesses.map((process, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-3xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-medium text-gray-900">{process.name}</h3>
                  <div className="text-amber-600 font-medium">{process.efficiency}</div>
                </div>
                <p className="text-gray-600 mb-6">{process.description}</p>
                <div className="space-y-3">
                  {process.stages.map((stage, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-amber-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{stage}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contract Analysis Workflow */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">AI-Powered Contract Analysis</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Upload</h3>
              <p className="text-gray-600">Upload contracts and legal documents for analysis</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Analyze</h3>
              <p className="text-gray-600">AI extracts key clauses and identifies risks</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Review</h3>
              <p className="text-gray-600">Highlight potential issues and recommendations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Approve</h3>
              <p className="text-gray-600">Streamlined approval workflow and execution</p>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Compliance Automation</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay compliant with automated monitoring and reporting
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {complianceAreas.map((area, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-2xl text-center">
                <Shield className="h-12 w-12 text-amber-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{area.name}</h3>
                <p className="text-sm text-gray-600">{area.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Technology Stack */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-light mb-8 text-center">Modern Legal Operations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-medium mb-4">Traditional Legal Work</h4>
                <ul className="space-y-3 text-gray-300">
                  <li>• Manual contract review and redlining</li>
                  <li>• Time-consuming legal research</li>
                  <li>• Paper-based document management</li>
                  <li>• Reactive compliance monitoring</li>
                  <li>• Inefficient matter management</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-medium mb-4">With 3days.ai</h4>
                <ul className="space-y-3 text-gray-300">
                  <li>• AI-powered contract analysis and risk assessment</li>
                  <li>• Intelligent legal research with citation analysis</li>
                  <li>• Digital document management with smart search</li>
                  <li>• Proactive compliance monitoring and alerts</li>
                  <li>• Automated matter management and reporting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Templates */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Legal Workflow Templates</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pre-built workflows for common legal processes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-3xl">
              <Scale className="h-12 w-12 text-amber-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-4">Contract Review</h3>
              <p className="text-gray-600 mb-6">Automated contract analysis workflow with risk assessment and approval routing.</p>
              <Button variant="outline" className="w-full">Use Template</Button>
            </div>
            <div className="bg-gray-50 p-8 rounded-3xl">
              <FileText className="h-12 w-12 text-blue-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-4">Legal Request</h3>
              <p className="text-gray-600 mb-6">Streamlined legal request intake and triage workflow for internal clients.</p>
              <Button variant="outline" className="w-full">Use Template</Button>
            </div>
            <div className="bg-gray-50 p-8 rounded-3xl">
              <Shield className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-medium text-gray-900 mb-4">Compliance Check</h3>
              <p className="text-gray-600 mb-6">Automated compliance verification workflow with regulatory update tracking.</p>
              <Button variant="outline" className="w-full">Use Template</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Legal System Integrations */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Legal System Integrations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with your existing legal technology stack
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="font-medium text-gray-900">DMS Platforms</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">Practice Management</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900">Time & Billing</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900">Legal Research</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Modernize Legal?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Transform your legal operations with AI-powered automation and intelligent workflows.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              Enhance Legal Operations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Legal;
