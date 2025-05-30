
import { ArrowRight, Play, CheckCircle, Star, Users, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import ROICalculator from '@/components/ROICalculator';
import Partnerships from '@/components/Partnerships';
import { Link } from 'react-router-dom';

const Home = () => {
  const benefits = [
    {
      icon: Users,
      title: 'Save 21+ Hours/Week',
      description: 'For knowledge workers who struggle with email overload, data entry, admin tasks, etc.',
      gradient: 'from-blue-100 to-indigo-100'
    },
    {
      icon: Zap,
      title: 'Accelerate Growth',
      description: 'Deploy AI employees in minutes—no lengthy setup or coding required.',
      gradient: 'from-purple-100 to-pink-100'
    },
    {
      icon: Shield,
      title: 'Enterprise-Ready Security',
      description: 'SOC 2 compliant, full audit trails, and GDPR adherence.',
      gradient: 'from-green-100 to-emerald-100'
    }
  ];

  const howItWorks = [
    {
      step: '01',
      title: 'Choose Your AI Employee',
      description: 'Executive Assistant, Finance Analyst, Support Specialist, and more.'
    },
    {
      step: '02', 
      title: 'Connect Your Tools',
      description: 'Works seamlessly with 100+ apps you already use.'
    },
    {
      step: '03',
      title: 'Watch the Automation',
      description: 'AI handles routine tasks autonomously while you focus on strategy.'
    }
  ];

  const testimonials = [
    {
      quote: "We cut our invoice processing time by 60%—it's like having a dedicated finance analyst on call 24/7.",
      company: 'FinanceFirst LLC'
    },
    {
      quote: "Our support team can finally focus on complex cases while AI handles the repetitive tickets.",
      company: 'TechCorp'
    }
  ];

  const stats = [
    { value: '21+', label: 'Hours Saved Weekly' },
    { value: '100+', label: 'App Integrations' },
    { value: '95%', label: 'Task Accuracy' },
    { value: '24/7', label: 'AI Availability' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-8 tracking-tight leading-tight">
                Reclaim 3 Days Every Week with
                <span className="block font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Autonomous AI Employees
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed">
                Boost productivity, reduce costs, and free your team from repetitive tasks—so they can focus on what truly matters.
              </p>
              <div className="flex flex-col sm:flex-row gap-6">
                <Button 
                  size="lg" 
                  className="bg-black hover:bg-gray-800 text-white text-lg px-12 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  asChild
                >
                  <Link to="/get-started">
                    Get Started
                    <ArrowRight className="ml-3 h-5 w-5" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="ghost" 
                  className="text-lg px-8 py-4 rounded-full border border-gray-200 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link to="/schedule-demo">
                    <Play className="mr-3 h-5 w-5" />
                    Book a Demo
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative animate-fade-in lg:block">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="/lovable-uploads/05a6d222-b447-40b8-aabb-f48a3b3fe366.png" 
                  alt="AI Employee Team - Diverse professionals representing our autonomous AI workforce"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900">AI Team Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="text-5xl font-light text-gray-900 mb-3">{stat.value}</div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnerships Section */}
      <Partnerships />

      {/* Key Benefits Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Key Benefits
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Transform your workflow with AI employees designed for maximum impact.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm overflow-hidden group"
              >
                <CardContent className="p-12">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 w-fit mb-8">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-6">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg font-light">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full" asChild>
              <Link to="/solutions">Learn How</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              How Our AI Employees Transform Your Workflows
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Deploy autonomous AI workers in minutes, not months.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center">
                <div className="text-6xl font-light text-blue-500 mb-6">{step.step}</div>
                <h3 className="text-2xl font-medium text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600 text-lg leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
              <Link to="/how-it-works">View Detailed Process</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Customer Success Section */}
      <section className="py-32 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light text-gray-900 mb-6">
              Customer Success Stories
            </h2>
            <div className="flex justify-center items-center gap-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
              <span className="ml-3 text-gray-600 text-lg">Trusted by industry leaders</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <p className="text-gray-700 mb-6 text-lg leading-relaxed italic">"{testimonial.quote}"</p>
                  <div className="font-medium text-gray-900">– {testimonial.company}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
              <Link to="/customers/case-studies">View All Case Studies</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ROI Calculator Section */}
      <section className="py-32 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Calculate Your ROI
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              See exactly how much time and money you can save with our AI automation platform.
            </p>
          </div>
          
          <ROICalculator />
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="py-32 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-light mb-8 tracking-tight">
            Ready to Free Your Team
            <span className="block font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              from Busywork?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 font-light leading-relaxed">
            Join thousands of teams who have already reclaimed their most valuable resource: time.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 text-lg px-12 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
              asChild
            >
              <Link to="/schedule-demo">
                Request a Demo
                <ArrowRight className="ml-3 h-5 w-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 rounded-full transition-all duration-300"
              asChild
            >
              <Link to="/start-free-trial">Sign Up Free</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
