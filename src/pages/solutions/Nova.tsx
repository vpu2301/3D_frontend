
import { Users, Heart, TrendingUp, ArrowRight, UserCheck, Calendar, FileText, BarChart3, Clock, Shield, CheckCircle, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Nova = () => {
  const features = [
    {
      icon: UserCheck,
      title: 'Recruitment & Hiring',
      description: 'Streamline candidate screening, interview scheduling, and onboarding processes with intelligent automation.'
    },
    {
      icon: Calendar,
      title: 'Employee Scheduling',
      description: 'Optimize workforce scheduling, manage time-off requests, and ensure optimal staffing levels automatically.'
    },
    {
      icon: Heart,
      title: 'Employee Engagement',
      description: 'Monitor employee satisfaction, conduct pulse surveys, and implement retention strategies proactively.'
    },
    {
      icon: BarChart3,
      title: 'Performance Analytics',
      description: 'Track performance metrics, generate insights, and provide data-driven recommendations for talent development.'
    }
  ];

  const hrProcesses = [
    'Candidate Screening', 'Interview Coordination', 'Onboarding Workflows', 'Performance Reviews', 'Benefits Administration', 'Compliance Tracking'
  ];

  const roiStats = [
    { value: '80%', label: 'Faster Hiring Process' },
    { value: '95%', label: 'Employee Satisfaction' },
    { value: '65%', label: 'Time Savings on Admin' },
    { value: '24/7', label: 'HR Support Available' }
  ];

  const testimonials = [
    {
      quote: "Nova transformed our HR operations. What used to take weeks now takes days.",
      author: "Sarah Johnson",
      role: "HR Director at TechCorp"
    },
    {
      quote: "Employee engagement scores increased by 40% since implementing Nova.",
      author: "Michael Chen",
      role: "People Operations Manager"
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-rose-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
                Meet Nova: Your
                <span className="block font-medium bg-gradient-to-r from-rose-500 to-pink-500 bg-clip-text text-transparent">
                  AI HR Specialist
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto lg:mx-0 font-light leading-relaxed">
                Nova revolutionizes human resources with intelligent automation for recruitment, 
                employee engagement, and performance management that puts people first.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
                <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-md" asChild>
                  <Link to="/start-free-trial">Try Nova Free</Link>
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-md" asChild>
                  <Link to="/schedule-demo">Request a Demo</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <div className="relative rounded-2xl overflow-hidden">
                <img 
                  src="/lovable-uploads/6a3a5b85-b2d2-471a-b368-bec35acad2ef.png" 
                  alt="Nova - AI HR Specialist"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-500/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-rose-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900">Nova Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Stats */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">HR Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Measurable improvements in HR efficiency and employee satisfaction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roiStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-light text-gray-900 mb-3">{stat.value}</div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">HR Capabilities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive HR automation powered by artificial intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 mr-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HR Process Automation */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Automated HR Processes</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nova handles your most time-consuming HR tasks automatically
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {hrProcesses.map((process, index) => (
              <div key={index} className="bg-rose-50 p-6 rounded-2xl text-center hover:bg-rose-100 transition-colors">
                <CheckCircle className="h-8 w-8 text-rose-500 mx-auto mb-3" />
                <h3 className="font-medium text-gray-900">{process}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recruitment Workflow */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Smart Recruitment Process</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Job Posting</h3>
              <p className="text-gray-600">Automatically post jobs across multiple platforms</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Screen Candidates</h3>
              <p className="text-gray-600">AI-powered resume screening and ranking</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Schedule Interviews</h3>
              <p className="text-gray-600">Automated interview scheduling and coordination</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Onboard</h3>
              <p className="text-gray-600">Seamless onboarding workflows and documentation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Employee Experience */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Enhanced Employee Experience</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-medium text-gray-900 mb-6">24/7 HR Support</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-rose-500 mr-3" />
                  <span className="text-gray-700">Instant answers to HR questions</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-rose-500 mr-3" />
                  <span className="text-gray-700">Secure and confidential support</span>
                </div>
                <div className="flex items-center">
                  <Heart className="h-5 w-5 text-rose-500 mr-3" />
                  <span className="text-gray-700">Personalized employee assistance</span>
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-5 w-5 text-rose-500 mr-3" />
                  <span className="text-gray-700">Continuous improvement insights</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl">
              <h4 className="text-lg font-medium text-gray-900 mb-4">What employees can ask Nova:</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• "How much vacation time do I have left?"</li>
                <li>• "When is the next performance review?"</li>
                <li>• "How do I update my benefits?"</li>
                <li>• "What's the company policy on remote work?"</li>
                <li>• "How do I request time off?"</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">What HR Leaders Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <p className="text-lg text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* HR System Integrations */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">HR System Integrations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seamlessly connects with your existing HR technology stack
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {['Workday', 'BambooHR', 'ADP', 'Slack', 'Microsoft Teams', 'Greenhouse'].map((integration, index) => (
              <div key={index} className="bg-gray-100 px-6 py-3 rounded-full text-gray-700 font-medium">
                {integration}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Meet Nova?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Transform your HR operations with AI that puts people first and processes second.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-md py-3" asChild>
            <Link to="/start-free-trial">
              Try Nova Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Nova;
