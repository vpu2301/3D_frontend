
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Workflow as WorkflowIcon, GitBranch, Play, Users, Timer, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Workflow = () => {
  const features = [
    {
      icon: WorkflowIcon,
      title: 'Visual Workflow Builder',
      description: 'Drag-and-drop interface to create complex workflows without any coding required.'
    },
    {
      icon: GitBranch,
      title: 'Conditional Logic',
      description: 'Build sophisticated decision trees with if/then conditions and multiple paths.'
    },
    {
      icon: Play,
      title: 'Real-time Execution',
      description: 'Watch your workflows run in real-time with detailed execution logs and debugging.'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Share workflows with team members and collaborate on process improvements.'
    },
    {
      icon: Timer,
      title: 'Scheduling & Triggers',
      description: 'Set up time-based triggers, webhooks, and event-driven workflow execution.'
    },
    {
      icon: CheckCircle,
      title: 'Quality Assurance',
      description: 'Built-in testing and validation tools to ensure your workflows run perfectly.'
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Workflow Builder
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Design, build, and deploy sophisticated workflows with our intuitive visual builder. 
              No coding required - just drag, drop, and connect your business processes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full" asChild>
                <Link to="/start-free-trial">Build Your First Workflow</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">See It In Action</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Powerful Workflow Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create and manage complex business workflows
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

      {/* Workflow Templates */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Pre-built Templates</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start with proven workflow templates and customize them for your business needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <h3 className="text-2xl font-medium text-gray-900 mb-4">Customer Onboarding</h3>
              <p className="text-gray-600 mb-6">Complete workflow for new customer welcome sequences, document collection, and account setup.</p>
              <Button variant="outline" className="w-full">Use Template</Button>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <h3 className="text-2xl font-medium text-gray-900 mb-4">Invoice Processing</h3>
              <p className="text-gray-600 mb-6">Automated invoice approval workflow with multi-level approvals and payment processing.</p>
              <Button variant="outline" className="w-full">Use Template</Button>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-lg">
              <h3 className="text-2xl font-medium text-gray-900 mb-4">Employee Offboarding</h3>
              <p className="text-gray-600 mb-6">Comprehensive checklist workflow for employee departures and access management.</p>
              <Button variant="outline" className="w-full">Use Template</Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Start Building Today</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Create your first workflow in minutes with our intuitive builder and templates.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              Try Workflow Builder
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Workflow;
