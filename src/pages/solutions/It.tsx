
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Server, Shield, Zap, Monitor, Database, Network, AlertTriangle, CheckCircle, Settings, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const It = () => {
  const features = [
    {
      icon: Server,
      title: 'Infrastructure Monitoring',
      description: 'Real-time monitoring of servers, networks, and applications with predictive maintenance and automated remediation.'
    },
    {
      icon: Shield,
      title: 'Security Automation',
      description: 'Automated threat detection, incident response, and compliance monitoring with 24/7 protection.'
    },
    {
      icon: Zap,
      title: 'System Optimization',
      description: 'Intelligent performance tuning, resource allocation, and capacity planning for optimal system efficiency.'
    },
    {
      icon: Monitor,
      title: 'Service Management',
      description: 'Automated IT service desk operations, ticket routing, and SLA management for improved user experience.'
    },
    {
      icon: Database,
      title: 'Data Management',
      description: 'Automated backup, recovery, and data lifecycle management with integrity monitoring.'
    },
    {
      icon: Network,
      title: 'Network Automation',
      description: 'Intelligent network configuration, traffic optimization, and connectivity management across environments.'
    }
  ];

  const itProcesses = [
    {
      name: 'Incident Management',
      description: 'Automated incident detection and resolution',
      capabilities: ['Alert correlation', 'Auto-remediation', 'Escalation workflows', 'Root cause analysis'],
      improvement: '70% faster resolution'
    },
    {
      name: 'Change Management',
      description: 'Streamlined IT change processes',
      capabilities: ['Approval workflows', 'Risk assessment', 'Rollback automation', 'Impact analysis'],
      improvement: '60% fewer failures'
    },
    {
      name: 'Asset Management',
      description: 'Complete IT asset lifecycle automation',
      capabilities: ['Discovery automation', 'License tracking', 'Compliance monitoring', 'Cost optimization'],
      improvement: '50% cost reduction'
    }
  ];

  const metrics = [
    { value: '99.9%', label: 'System uptime achieved' },
    { value: '85%', label: 'Reduction in manual tasks' },
    { value: '60%', label: 'Faster incident resolution' },
    { value: '40%', label: 'Lower operational costs' }
  ];

  const securityFeatures = [
    { name: 'Threat Detection', description: 'AI-powered threat identification and analysis' },
    { name: 'Vulnerability Management', description: 'Automated scanning and patch management' },
    { name: 'Compliance Monitoring', description: 'Continuous compliance assessment and reporting' },
    { name: 'Identity Management', description: 'Automated user provisioning and access control' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              For IT Teams
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Revolutionize your IT operations with intelligent automation. Monitor systems proactively, 
              automate routine tasks, and enhance security while reducing operational overhead by 85%.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full" asChild>
                <Link to="/start-free-trial">Optimize IT Operations</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">See IT Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">IT Operations Results</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Proven improvements in system reliability and operational efficiency
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-light text-indigo-600 mb-2">{metric.value}</div>
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
            <h2 className="text-4xl font-light text-gray-900 mb-6">IT Automation Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive automation tools for modern IT infrastructure management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 w-fit mx-auto mb-6">
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

      {/* IT Processes */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Automated IT Processes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform critical IT operations with intelligent automation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {itProcesses.map((process, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-3xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-medium text-gray-900">{process.name}</h3>
                  <div className="text-indigo-600 font-medium">{process.improvement}</div>
                </div>
                <p className="text-gray-600 mb-6">{process.description}</p>
                <div className="space-y-3">
                  {process.capabilities.map((capability, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-indigo-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Monitoring Dashboard */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Intelligent Monitoring Workflow</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Monitor className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Monitor</h3>
              <p className="text-gray-600">Continuous monitoring of all IT infrastructure</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Detect</h3>
              <p className="text-gray-600">AI-powered anomaly and threat detection</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Respond</h3>
              <p className="text-gray-600">Automated incident response and remediation</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Optimize</h3>
              <p className="text-gray-600">Continuous improvement and optimization</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Security Automation</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced security features to protect your IT infrastructure
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {securityFeatures.map((feature, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-2xl text-center">
                <Shield className="h-12 w-12 text-indigo-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{feature.name}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IT Infrastructure */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-light mb-8 text-center">Modern IT Infrastructure Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-medium mb-4">Traditional IT Operations</h4>
                <ul className="space-y-3 text-gray-300">
                  <li>• Reactive problem resolution</li>
                  <li>• Manual monitoring and alerts</li>
                  <li>• Time-consuming change processes</li>
                  <li>• Siloed security and operations</li>
                  <li>• Limited visibility and insights</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-medium mb-4">With 3days.ai</h4>
                <ul className="space-y-3 text-gray-300">
                  <li>• Proactive issue prevention and auto-healing</li>
                  <li>• Intelligent monitoring with predictive analytics</li>
                  <li>• Automated change management workflows</li>
                  <li>• Integrated security and operations platform</li>
                  <li>• Complete infrastructure visibility and control</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cloud & Infrastructure */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Infrastructure Integrations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with your existing IT infrastructure and tools
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Server className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="font-medium text-gray-900">Cloud Platforms</h3>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Monitor className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">Monitoring Tools</h3>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900">Security Platforms</h3>
            </div>
            <div className="bg-gray-50 p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900">ITSM Tools</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Modernize IT?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Transform your IT operations with intelligent automation and proactive management.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              Optimize IT Operations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default It;
