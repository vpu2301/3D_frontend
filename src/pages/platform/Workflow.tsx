
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Workflow, GitBranch, Play, Settings, Clock, Users, CheckCircle, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

const WorkflowPlatform = () => {
  const features = [
    {
      icon: Workflow,
      title: 'Visual Designer',
      description: 'Intuitive drag-and-drop interface for creating complex workflows without coding.'
    },
    {
      icon: GitBranch,
      title: 'Conditional Logic',
      description: 'Build sophisticated decision trees and branching logic for any business scenario.'
    },
    {
      icon: Play,
      title: 'Real-time Execution',
      description: 'Monitor workflow execution with live status updates and detailed activity logs.'
    },
    {
      icon: Settings,
      title: 'Custom Triggers',
      description: 'Start workflows from any event - API calls, schedules, file uploads, or data changes.'
    },
    {
      icon: Clock,
      title: 'Scheduling Engine',
      description: 'Advanced scheduling with cron expressions, time zones, and recurring patterns.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share workflows, assign ownership, and collaborate with version control.'
    }
  ];

  const workflowExamples = [
    {
      name: 'Customer Onboarding',
      steps: ['New user signup', 'Send welcome email', 'Create account', 'Schedule follow-up'],
      duration: '2-5 minutes'
    },
    {
      name: 'Invoice Processing',
      steps: ['Receive invoice', 'Extract data', 'Validate amount', 'Route for approval'],
      duration: '30 seconds'
    },
    {
      name: 'Lead Qualification',
      steps: ['New lead capture', 'Score lead', 'Assign to sales rep', 'Send notification'],
      duration: '1 minute'
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-[color:var(--paper)]">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-[color:var(--ink)] mb-6 tracking-tight">
              Workflow Engine
            </h1>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto font-light leading-relaxed">
              Design and orchestrate complex business processes with our powerful workflow engine. 
              Connect systems, automate decisions, and scale operations with visual workflow automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-[color:var(--ink)] hover:bg-[color:var(--text-2)] text-white px-8 py-3 rounded-full" asChild>
                <Link to="/start-free-trial">Build Workflows</Link>
              </Button>
              <Button variant="outline" className="border-[color:var(--line)] text-[color:var(--ink)] hover:bg-[color:var(--sand)] px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">See Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Workflow Features</h2>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto">
              Professional workflow automation tools for enterprise-scale operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-[28px] bg-gradient-to-r from-[color:var(--blue)] to-[color:var(--text-2)] w-fit mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-[color:var(--ink)] mb-4">{feature.title}</h3>
                  <p className="text-[color:var(--text-2)] leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Examples */}
      <section className="py-20 px-4 bg-[color:var(--sand)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Common Workflows</h2>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto">
              See how businesses automate key processes with our workflow engine
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {workflowExamples.map((workflow, index) => (
              <div key={index} className="bg-[color:var(--paper)] p-8 rounded-[28px] shadow-lg">
                <h3 className="text-2xl font-medium text-[color:var(--ink)] mb-4">{workflow.name}</h3>
                <div className="text-sm text-[color:var(--blue)] mb-6">Execution time: {workflow.duration}</div>
                <div className="space-y-4">
                  {workflow.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-8 h-8 bg-[color:var(--blue-100)] rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                        <span className="text-sm font-medium text-[color:var(--blue)]">{idx + 1}</span>
                      </div>
                      <span className="text-[color:var(--ink)]">{step}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-6">Use Template</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-20 px-4 bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Workflow Performance</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-light text-[color:var(--blue)] mb-2">99.9%</div>
              <div className="text-[color:var(--text-2)]">Execution reliability</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-[color:var(--blue)] mb-2">&lt;100ms</div>
              <div className="text-[color:var(--text-2)]">Step execution time</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-[color:var(--blue)] mb-2">1M+</div>
              <div className="text-[color:var(--text-2)]">Workflows per day</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-[color:var(--blue)] mb-2">24/7</div>
              <div className="text-[color:var(--text-2)]">Monitoring & support</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-[color:var(--sand)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Build Workflows in Minutes</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[color:var(--blue-100)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Workflow className="h-8 w-8 text-[color:var(--blue)]" />
              </div>
              <h3 className="text-lg font-medium mb-2">1. Design</h3>
              <p className="text-[color:var(--text-2)]">Drag and drop steps to create your workflow</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[color:var(--blue-100)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="h-8 w-8 text-[color:var(--blue)]" />
              </div>
              <h3 className="text-lg font-medium mb-2">2. Configure</h3>
              <p className="text-[color:var(--text-2)]">Set triggers, conditions, and integrations</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[color:var(--blue-100)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Play className="h-8 w-8 text-[color:var(--blue)]" />
              </div>
              <h3 className="text-lg font-medium mb-2">3. Test</h3>
              <p className="text-[color:var(--text-2)]">Run tests to validate your workflow logic</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[color:var(--blue-100)] rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-[color:var(--blue)]" />
              </div>
              <h3 className="text-lg font-medium mb-2">4. Deploy</h3>
              <p className="text-[color:var(--text-2)]">Launch and monitor your automated workflow</p>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 px-4 bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[color:var(--paper)] rounded-[28px] p-12 text-[color:var(--ink)] border border-[color:var(--line)]">
            <h3 className="text-3xl font-light mb-8 text-center">Enterprise Workflow Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Zap className="h-12 w-12 text-[color:var(--blue)] mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">High Performance</h4>
                <p className="text-[color:var(--text-2)]">Scale to millions of workflow executions per day</p>
              </div>
              <div className="text-center">
                <Users className="h-12 w-12 text-[color:var(--blue)] mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Team Collaboration</h4>
                <p className="text-[color:var(--text-2)]">Version control and collaborative workflow development</p>
              </div>
              <div className="text-center">
                <Shield className="h-12 w-12 text-[color:var(--blue)] mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Enterprise Security</h4>
                <p className="text-[color:var(--text-2)]">Role-based access and audit trails for compliance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[color:var(--sand)] text-[color:var(--ink)] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Automate Your Workflows</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Start building powerful automation workflows that scale with your business.
          </p>
          <Button size="lg" className="bg-[color:var(--ink)] text-white hover:bg-[color:var(--text-2)] rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              Start Building
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default WorkflowPlatform;
