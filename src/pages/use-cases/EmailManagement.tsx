import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Inbox, Send, Filter, ArrowRight, Clock, Users, Zap, CheckCircle, Tag, Star, Archive } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const EmailManagement = () => {
  const benefits = [
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Reduce email processing time by 80% with intelligent automation'
    },
    {
      icon: Filter,
      title: 'Smart Filtering',
      description: 'Automatically categorize and prioritize emails based on content and sender'
    },
    {
      icon: Zap,
      title: 'Quick Responses',
      description: 'Generate contextual responses and auto-reply to common inquiries'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Route emails to the right team members automatically'
    }
  ];

  const features = [
    {
      icon: Inbox,
      title: 'Smart Inbox Management',
      description: 'Automatically sort, label, and prioritize incoming emails'
    },
    {
      icon: Send,
      title: 'Automated Responses',
      description: 'Send personalized responses based on email content and context'
    },
    {
      icon: Tag,
      title: 'Intelligent Tagging',
      description: 'Automatically tag emails with relevant categories and projects'
    },
    {
      icon: Archive,
      title: 'Auto-Archiving',
      description: 'Archive completed conversations and organize email history'
    }
  ];

  const useCases = [
    {
      title: 'Customer Support',
      description: 'Automatically categorize support tickets and route to appropriate teams',
      benefits: ['Faster response times', 'Improved customer satisfaction', 'Reduced manual work']
    },
    {
      title: 'Sales Follow-up',
      description: 'Automate lead nurturing and follow-up email sequences',
      benefits: ['Higher conversion rates', 'Consistent follow-up', 'Personalized outreach']
    },
    {
      title: 'HR Communications',
      description: 'Streamline candidate communications and employee notifications',
      benefits: ['Better candidate experience', 'Consistent messaging', 'Reduced admin work']
    },
    {
      title: 'Invoice Management',
      description: 'Automatically process invoices and payment confirmations',
      benefits: ['Faster processing', 'Reduced errors', 'Improved cash flow']
    }
  ];

  const stats = [
    { value: '80%', label: 'Time Saved' },
    { value: '50%', label: 'Faster Responses' },
    { value: '95%', label: 'Accuracy Rate' },
    { value: '24/7', label: 'Automated Processing' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-6">
              <Mail className="h-4 w-4 mr-2" />
              Email Management Automation
            </div>
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Master Your Email Flow
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-light max-w-3xl mx-auto">
              Automate email processing, responses, and organization to turn your inbox into a productivity powerhouse
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
            <h2 className="text-4xl font-light text-gray-900 mb-6">Why Automate Email Management?</h2>
            <p className="text-xl text-gray-600">Transform how you handle email communication</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 w-fit mx-auto mb-6">
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
            <h2 className="text-4xl font-light text-gray-900 mb-6">Email Automation Features</h2>
            <p className="text-xl text-gray-600">Comprehensive tools for email productivity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 mr-4">
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

      {/* Use Cases */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Email Automation Use Cases</h2>
            <p className="text-xl text-gray-600">Real-world applications across departments</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-3xl">
                <h3 className="text-xl font-medium text-gray-900 mb-4">{useCase.title}</h3>
                <p className="text-gray-600 mb-6">{useCase.description}</p>
                <ul className="space-y-2">
                  {useCase.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-center text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-light text-purple-600 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-6">Ready to Automate Your Email?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Stop drowning in emails. Start managing them intelligently with automation
          </p>
          <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full" asChild>
            <Link to="/get-started">
              Start Email Automation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default EmailManagement;
