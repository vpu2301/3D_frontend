
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckSquare, Users, Clock, Calendar, Bell, Target, BarChart3, Zap, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Tasks = () => {
  const features = [
    {
      icon: CheckSquare,
      title: 'Smart Prioritization',
      description: 'AI analyzes urgency, impact, and dependencies to automatically prioritize tasks for maximum efficiency.'
    },
    {
      icon: Users,
      title: 'Team Orchestration',
      description: 'Intelligent task assignment based on team member skills, workload, and availability.'
    },
    {
      icon: Clock,
      title: 'Time Intelligence',
      description: 'Automatic time tracking, estimation, and deadline management with proactive alerts.'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'AI-powered scheduling that considers dependencies, resources, and team calendars.'
    },
    {
      icon: Bell,
      title: 'Proactive Notifications',
      description: 'Contextual alerts and reminders that help teams stay on track without overwhelming them.'
    },
    {
      icon: Target,
      title: 'Goal Alignment',
      description: 'Connect tasks to strategic objectives and track progress toward organizational goals.'
    }
  ];

  const workflowTypes = [
    {
      name: 'Project Management',
      description: 'End-to-end project tracking with automated milestone management',
      features: ['Gantt charts', 'Resource allocation', 'Risk assessment', 'Progress reporting']
    },
    {
      name: 'Operational Tasks',
      description: 'Daily operational workflows with smart automation triggers',
      features: ['SOP automation', 'Quality checks', 'Escalation rules', 'Performance metrics']
    },
    {
      name: 'Customer Success',
      description: 'Customer lifecycle management with automated touchpoints',
      features: ['Onboarding flows', 'Health scoring', 'Renewal tracking', 'Support tickets']
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Task Management
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Orchestrate work intelligently with AI-powered task management that prioritizes, 
              assigns, and tracks progress automatically. Never miss a deadline or drop a task again.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-3 rounded-full" asChild>
                <Link to="/start-free-trial">Organize Your Tasks</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">See Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Intelligent Task Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Beyond traditional task management - powered by AI for maximum productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-[#222222] w-fit mx-auto mb-6">
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
              Pre-built workflows for common business processes, ready to customize
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {workflowTypes.map((workflow, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-lg">
                <h3 className="text-2xl font-medium text-gray-900 mb-4">{workflow.name}</h3>
                <p className="text-gray-600 mb-6">{workflow.description}</p>
                <div className="space-y-2">
                  {workflow.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></div>
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-6">Use Template</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Productivity Stats */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Productivity Impact</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-light text-indigo-600 mb-2">40%</div>
              <div className="text-gray-600">Faster task completion</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-purple-600 mb-2">85%</div>
              <div className="text-gray-600">Reduction in missed deadlines</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-blue-600 mb-2">60%</div>
              <div className="text-gray-600">Better resource utilization</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-light text-green-600 mb-2">3x</div>
              <div className="text-gray-600">Improved team coordination</div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-12 text-[#111111] border border-black/8">
            <h3 className="text-3xl font-light mb-8 text-center">Advanced Capabilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-indigo-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Analytics Dashboard</h4>
                <p className="text-black/60">Real-time insights into team productivity and bottlenecks</p>
              </div>
              <div className="text-center">
                <Zap className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Automation Rules</h4>
                <p className="text-black/60">Custom automation triggers for recurring workflows</p>
              </div>
              <div className="text-center">
                <Settings className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Custom Workflows</h4>
                <p className="text-black/60">Build complex workflows with conditional logic</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#f5ede3] text-[#111111] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Master Your Tasks</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Transform chaos into clarity with intelligent task management.
          </p>
          <Button size="lg" className="bg-[#111111] text-white hover:bg-[#222222] rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              Start Organizing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Tasks;
