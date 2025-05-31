import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { UserCheck, CheckCircle, Clock, Users, ArrowRight, Zap, Shield, FileText, Target, BarChart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const CustomerOnboarding = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Faster Onboarding',
      description: 'Reduce customer onboarding time from weeks to days with automated workflows'
    },
    {
      icon: CheckCircle,
      title: 'Improved Accuracy',
      description: 'Eliminate manual errors and ensure consistent onboarding experiences'
    },
    {
      icon: Users,
      title: 'Better Experience',
      description: 'Provide a smooth, guided experience that delights new customers'
    },
    {
      icon: BarChart,
      title: 'Increased Retention',
      description: 'Well-onboarded customers are 50% more likely to stay long-term'
    }
  ];

  const features = [
    {
      icon: FileText,
      title: 'Document Collection',
      description: 'Automatically request and validate required documents'
    },
    {
      icon: Shield,
      title: 'Identity Verification',
      description: 'Streamline KYC and compliance checks with automated verification'
    },
    {
      icon: MessageCircle,
      title: 'Progress Communication',
      description: 'Keep customers informed with real-time status updates'
    },
    {
      icon: Target,
      title: 'Personalized Setup',
      description: 'Customize onboarding flows based on customer type and needs'
    }
  ];

  const steps = [
    {
      step: '1',
      title: 'Design Your Flow',
      description: 'Map out your ideal customer onboarding journey'
    },
    {
      step: '2',
      title: 'Set Up Automation',
      description: 'Configure automated workflows for each onboarding step'
    },
    {
      step: '3',
      title: 'Launch & Monitor',
      description: 'Deploy your automated onboarding and track performance'
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-6">
              <UserCheck className="h-4 w-4 mr-2" />
              Customer Onboarding Automation
            </div>
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Transform Customer Onboarding
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-light max-w-3xl mx-auto">
              Automate your customer onboarding process to deliver faster, more consistent experiences that drive satisfaction and retention
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full" asChild>
                <Link to="/get-started">Start Automating</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">Watch Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Why Automate Customer Onboarding?</h2>
            <p className="text-xl text-gray-600">The benefits of streamlined onboarding automation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 w-fit mx-auto mb-6">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Onboarding Automation Features</h2>
            <p className="text-xl text-gray-600">Everything you need for seamless customer onboarding</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 mr-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">How It Works</h2>
            <p className="text-xl text-gray-600">Get started with automated onboarding in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-6">
                  {step.step}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-6">Ready to Transform Your Onboarding?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Start delivering exceptional onboarding experiences that drive customer success
          </p>
          <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full" asChild>
            <Link to="/get-started">
              Get Started Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default CustomerOnboarding;
