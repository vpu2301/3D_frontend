
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Cog, Clock, CheckCircle, Workflow, BarChart3, Users, Zap, Target, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Operations = () => {
  const features = [
    {
      icon: Cog,
      title: 'Process Optimization',
      description: 'AI identifies bottlenecks and inefficiencies, automatically suggesting and implementing improvements.'
    },
    {
      icon: Clock,
      title: 'Resource Management',
      description: 'Intelligent resource allocation and scheduling based on demand, capacity, and priorities.'
    },
    {
      icon: CheckCircle,
      title: 'Quality Assurance',
      description: 'Automated quality checks and compliance monitoring with real-time alerts and reporting.'
    },
    {
      icon: Workflow,
      title: 'Workflow Automation',
      description: 'End-to-end process automation that spans multiple departments and systems.'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Real-time operational metrics and KPIs with predictive insights and trend analysis.'
    },
    {
      icon: Users,
      title: 'Team Coordination',
      description: 'Seamless collaboration tools that keep teams aligned and operations running smoothly.'
    }
  ];

  const processTypes = [
    {
      name: 'Supply Chain',
      description: 'Automate procurement, inventory, and logistics',
      improvements: ['30% faster processing', 'Reduced stockouts', 'Optimized delivery routes', 'Vendor performance tracking']
    },
    {
      name: 'Customer Service',
      description: 'Streamline support operations and case management',
      improvements: ['50% faster resolution', 'Improved satisfaction', 'Automated escalations', 'Knowledge base updates']
    },
    {
      name: 'Manufacturing',
      description: 'Optimize production planning and quality control',
      improvements: ['25% efficiency gain', 'Reduced defects', 'Predictive maintenance', 'Real-time monitoring']
    }
  ];

  const metrics = [
    { value: '45%', label: 'Operational cost reduction' },
    { value: '70%', label: 'Faster process completion' },
    { value: '90%', label: 'Fewer manual errors' },
    { value: '60%', label: 'Improved resource utilization' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              For Operations Teams
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Transform your operations with intelligent automation that eliminates bottlenecks, 
              optimizes resources, and ensures consistent quality across all your processes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full" asChild>
                <Link to="/start-free-trial">Optimize Operations</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">See Operations Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Operational Excellence Results</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Measurable improvements in efficiency, quality, and cost reduction
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-light text-orange-600 mb-2">{metric.value}</div>
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
            <h2 className="text-4xl font-light text-gray-900 mb-6">Operations Automation Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools to streamline and optimize your operational processes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 w-fit mx-auto mb-6">
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

      {/* Process Types */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Operations Use Cases</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform key operational areas with intelligent automation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {processTypes.map((process, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-3xl">
                <h3 className="text-2xl font-medium text-gray-900 mb-4">{process.name}</h3>
                <p className="text-gray-600 mb-6">{process.description}</p>
                <div className="space-y-3">
                  {process.improvements.map((improvement, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{improvement}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">How Operations Automation Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">1. Analyze</h3>
              <p className="text-gray-600">AI analyzes current processes and identifies optimization opportunities</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">2. Design</h3>
              <p className="text-gray-600">Create optimized workflows with intelligent automation rules</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">3. Execute</h3>
              <p className="text-gray-600">Deploy automated processes with real-time monitoring</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">4. Optimize</h3>
              <p className="text-gray-600">Continuously improve based on performance data and feedback</p>
            </div>
          </div>
        </div>
      </section>

      {/* Success Story */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-light mb-8 text-center">Operations Transformation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-medium mb-4">Before Automation</h4>
                <ul className="space-y-3 text-gray-300">
                  <li>• Manual process coordination across departments</li>
                  <li>• Frequent delays and bottlenecks</li>
                  <li>• Inconsistent quality and standards</li>
                  <li>• Limited visibility into operations</li>
                  <li>• High operational costs and waste</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-medium mb-4">With 3days.ai</h4>
                <ul className="space-y-3 text-gray-300">
                  <li>• Seamless automated workflows across all departments</li>
                  <li>• Real-time process optimization and resource allocation</li>
                  <li>• Consistent quality with automated compliance checks</li>
                  <li>• Complete operational visibility and control</li>
                  <li>• Significant cost reduction and efficiency gains</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Partners */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Operations Integrations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with your existing operations tools and systems
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Cog className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">ERP Systems</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900">BI Platforms</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900">HR Systems</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Workflow className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-medium text-gray-900">Workflow Tools</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Optimize Operations?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Transform your operations with intelligent automation that drives efficiency and growth.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              Start Optimizing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Operations;
