
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Users, Calendar, UserCheck, FileText, Clock, Target, BarChart3, MessageCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hr = () => {
  const features = [
    {
      icon: Users,
      title: 'Recruitment Automation',
      description: 'Streamline hiring with automated candidate screening, interview scheduling, and onboarding workflows.'
    },
    {
      icon: Calendar,
      title: 'Employee Onboarding',
      description: 'Automated onboarding workflows that ensure new hires have everything they need from day one.'
    },
    {
      icon: UserCheck,
      title: 'Performance Management',
      description: 'Intelligent performance tracking, goal setting, and review processes with automated reminders.'
    },
    {
      icon: FileText,
      title: 'Document Management',
      description: 'Automate HR document processing, policy updates, and compliance tracking across the organization.'
    },
    {
      icon: Clock,
      title: 'Time & Attendance',
      description: 'Smart time tracking, leave management, and payroll integration with real-time reporting.'
    },
    {
      icon: MessageCircle,
      title: 'Employee Engagement',
      description: 'Automated surveys, feedback collection, and engagement analysis to improve workplace culture.'
    }
  ];

  const processes = [
    {
      name: 'Talent Acquisition',
      description: 'From job posting to offer acceptance',
      steps: ['Job posting automation', 'Resume screening', 'Interview coordination', 'Background checks', 'Offer management'],
      timeSaved: '60%'
    },
    {
      name: 'Employee Lifecycle',
      description: 'Comprehensive employee journey management',
      steps: ['Onboarding workflows', 'Training assignments', 'Performance reviews', 'Career development', 'Offboarding'],
      timeSaved: '70%'
    },
    {
      name: 'Compliance & Reporting',
      description: 'Automated compliance and analytics',
      steps: ['Policy updates', 'Training compliance', 'Audit trails', 'HR analytics', 'Regulatory reporting'],
      timeSaved: '80%'
    }
  ];

  const metrics = [
    { value: '50%', label: 'Faster hiring process' },
    { value: '85%', label: 'Improved onboarding satisfaction' },
    { value: '40%', label: 'Reduction in HR admin time' },
    { value: '95%', label: 'Compliance accuracy' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              For HR Teams
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Transform your people operations with intelligent automation. From recruitment to 
              retirement, streamline every aspect of the employee lifecycle while enhancing the human experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full" asChild>
                <Link to="/start-free-trial">Enhance HR Operations</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">See HR Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Metrics Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">HR Impact Results</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Measurable improvements in efficiency, satisfaction, and compliance
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-light text-green-600 mb-2">{metric.value}</div>
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
            <h2 className="text-4xl font-light text-gray-900 mb-6">HR Automation Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive tools to streamline people operations and enhance employee experience
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

      {/* HR Processes */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Automated HR Processes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              End-to-end automation for critical HR workflows
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {processes.map((process, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-3xl">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-medium text-gray-900">{process.name}</h3>
                  <div className="text-green-600 font-medium">{process.timeSaved} faster</div>
                </div>
                <p className="text-gray-600 mb-6">{process.description}</p>
                <div className="space-y-3">
                  {process.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Employee Journey */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Automated Employee Journey</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Recruitment</h3>
              <p className="text-gray-600">Automated candidate sourcing and screening</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Onboarding</h3>
              <p className="text-gray-600">Seamless new hire integration</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Development</h3>
              <p className="text-gray-600">Continuous learning and growth</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Performance</h3>
              <p className="text-gray-600">Regular reviews and feedback</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Transition</h3>
              <p className="text-gray-600">Career moves and exits</p>
            </div>
          </div>
        </div>
      </section>

      {/* HR Analytics */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-light mb-8 text-center">HR Analytics & Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-medium mb-4">People Analytics</h4>
                <ul className="space-y-3 text-gray-300">
                  <li>• Employee engagement and satisfaction trends</li>
                  <li>• Turnover prediction and retention analysis</li>
                  <li>• Performance and productivity metrics</li>
                  <li>• Diversity, equity, and inclusion tracking</li>
                  <li>• Skills gap analysis and development needs</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-medium mb-4">Operational Insights</h4>
                <ul className="space-y-3 text-gray-300">
                  <li>• Recruitment funnel optimization</li>
                  <li>• Time-to-hire and cost-per-hire analysis</li>
                  <li>• Training effectiveness measurement</li>
                  <li>• Compliance monitoring and reporting</li>
                  <li>• Workforce planning and forecasting</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Ecosystem */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">HR System Integrations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Connect with your existing HR tech stack
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-medium text-gray-900">HRIS Systems</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-medium text-gray-900">ATS Platforms</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-medium text-gray-900">Payroll Systems</h3>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="font-medium text-gray-900">Performance Tools</h3>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Transform HR?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Empower your people operations with intelligent automation that puts employees first.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              Enhance HR Operations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Hr;
