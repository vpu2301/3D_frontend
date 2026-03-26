
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Workflow, Zap, Settings, Code, Play, GitBranch, Clock, Users, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const WorkflowBuilder = () => {
  const features = [
    {
      icon: Workflow,
      title: 'Visual Workflow Designer',
      description: 'Drag-and-drop interface to create complex workflows without coding knowledge required.'
    },
    {
      icon: Zap,
      title: 'Smart Triggers',
      description: 'Intelligent triggers that start workflows based on events, schedules, or conditions.'
    },
    {
      icon: Settings,
      title: 'Custom Logic Builder',
      description: 'Build conditional logic, loops, and decision trees with an intuitive interface.'
    },
    {
      icon: Code,
      title: 'API Integrations',
      description: 'Connect to any API or service with pre-built connectors and custom integrations.'
    },
    {
      icon: Play,
      title: 'Real-time Execution',
      description: 'Monitor workflow execution in real-time with detailed logs and debugging tools.'
    },
    {
      icon: GitBranch,
      title: 'Version Control',
      description: 'Track changes, rollback versions, and collaborate on workflow development.'
    }
  ];

  const workflowTypes = [
    {
      name: 'Data Processing',
      description: 'Automate data collection, transformation, and analysis workflows',
      examples: ['ETL pipelines', 'Data validation', 'Report generation', 'Database sync']
    },
    {
      name: 'Business Processes',
      description: 'Streamline operational workflows and approval processes',
      examples: ['Invoice approval', 'Employee onboarding', 'Customer support', 'Quality assurance']
    },
    {
      name: 'Marketing Automation',
      description: 'Create sophisticated marketing campaigns and lead nurturing',
      examples: ['Email sequences', 'Lead scoring', 'Social media posting', 'Campaign analytics']
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[#f5ede3] to-white dark:from-[#181512] dark:to-[#1c1916]">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Workflow Builder
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Design, build, and deploy sophisticated automation workflows with our visual, 
              no-code builder. Connect systems, automate processes, and scale your operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-3 rounded-full" asChild>
                <Link to="/start-free-trial">Start Building</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">View Builder Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Builder Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create powerful automation workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 w-fit mx-auto mb-6">
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

      {/* Workflow Types */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Workflow Templates</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Pre-built templates for common business workflows
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {workflowTypes.map((workflow, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-lg">
                <h3 className="text-2xl font-medium text-gray-900 mb-4">{workflow.name}</h3>
                <p className="text-gray-600 mb-6">{workflow.description}</p>
                <div className="space-y-3 mb-6">
                  {workflow.examples.map((example, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{example}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full">Use Template</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Builder Stats */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Builder Performance</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-light text-green-600 mb-2">90%</div>
              <div className="text-gray-600">Faster development</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Pre-built connectors</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-purple-600 mb-2">99.9%</div>
              <div className="text-gray-600">Uptime reliability</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-[#111111] mb-2">24/7</div>
              <div className="text-gray-600">Monitoring & support</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">1. Design</h3>
              <p className="text-gray-600">Drag and drop components to build your workflow</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Code className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">2. Configure</h3>
              <p className="text-gray-600">Set up triggers, conditions, and integrations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">3. Test</h3>
              <p className="text-gray-600">Test your workflow with real data and scenarios</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#1b1b1b] rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-[#111111]" />
              </div>
              <h3 className="text-lg font-medium mb-2">4. Deploy</h3>
              <p className="text-gray-600">Launch your workflow and monitor performance</p>
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-12 text-[#111111] border border-black/8">
            <h3 className="text-3xl font-light mb-8 text-center">Enterprise Capabilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Team Collaboration</h4>
                <p className="text-black/60">Share workflows and collaborate with team members</p>
              </div>
              <div className="text-center">
                <Clock className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Advanced Scheduling</h4>
                <p className="text-black/60">Complex scheduling and time-based triggers</p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Security & Compliance</h4>
                <p className="text-black/60">Enterprise-grade security and audit trails</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#f5ede3] text-[#111111] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Start Building Workflows</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Transform your business processes with powerful, visual workflow automation.
          </p>
          <Button size="lg" className="bg-[#111111] text-white hover:bg-[#222222] rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              Try Builder Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default WorkflowBuilder;
