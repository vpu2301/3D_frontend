
import { Users, Zap, Settings, PlayCircle, CheckCircle, ArrowRight, Shield, Lock, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const HowItWorks = () => {
  const steps = [
    {
      step: '01',
      icon: Users,
      title: 'Select an AI Employee',
      description: 'Pick from our catalog of specialized roles like Executive Assistant, Support Specialist, Finance Analyst, and more.',
      details: 'Browse our library of pre-trained AI workers, each designed for specific department needs and workflows.'
    },
    {
      step: '02',
      icon: Zap,
      title: 'Connect Your Tools',
      description: 'Authorize access to your existing apps (email, CRM, accounting software).',
      details: 'One-click integrations with 100+ popular business applications. No complex API setup required.'
    },
    {
      step: '03',
      icon: Settings,
      title: 'Configure Task Workflows',
      description: 'Outline your preferred processes or let the AI infer them from your existing data.',
      details: 'Simple drag-and-drop workflow builder or intelligent auto-configuration based on your current processes.'
    },
    {
      step: '04',
      icon: PlayCircle,
      title: 'Go Live and Monitor',
      description: 'AI starts performing tasks in real-time. Dashboard provides clear metrics and audit logs.',
      details: 'Real-time performance monitoring with detailed analytics and complete audit trails for compliance.'
    },
    {
      step: '05',
      icon: CheckCircle,
      title: 'Continuous Improvement',
      description: 'AI learns from each interaction, refining accuracy and speed over time.',
      details: 'Machine learning algorithms continuously optimize performance based on your unique business patterns.'
    }
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: 'SOC 2 Compliance',
      description: 'Industry-leading security standards and controls'
    },
    {
      icon: Lock,
      title: 'Data Encryption',
      description: 'End-to-end encryption in transit and at rest'
    },
    {
      icon: Eye,
      title: 'Role-Based Access',
      description: 'Granular permission controls and access management'
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Deploy AI Workers in
              <span className="block font-medium bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                10 Minutes—No Coding Required
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Experience effortless onboarding, integrated workflows, and continuous AI learning 
              that transforms your business operations from day one.
            </p>
          </div>
        </div>
      </section>

      {/* Step-by-Step Process */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Step-by-Step Process</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From selection to deployment, get your AI workforce running in minutes
            </p>
          </div>

          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className="flex-1">
                  <div className="flex items-center mb-6">
                    <div className="text-6xl font-light text-blue-500 mr-6">{step.step}</div>
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500">
                      <step.icon className="h-8 w-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-medium text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-xl text-gray-600 mb-4 leading-relaxed">{step.description}</p>
                  <p className="text-gray-500 leading-relaxed">{step.details}</p>
                </div>
                <div className="flex-1">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-12 h-80 flex items-center justify-center">
                    <div className="text-gray-400 text-lg">Interactive Demo Preview</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Security & Compliance</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Enterprise-grade security built in from day one
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {securityFeatures.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <CardContent className="p-8">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 w-fit mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-6">
              Additional compliance certifications: GDPR, HIPAA, and more
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">
            Ready to See How Fast You Can Deploy?
          </h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Book a demo to see how quickly you can onboard your first AI worker
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-md py-3" asChild>
            <Link to="/schedule-demo">
              Book a Demo
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
