
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Zap, Clock, Users, ArrowRight, Filter, Reply, Archive, Send, Inbox, Star, AlertCircle } from 'lucide-react';
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
      icon: Zap,
      title: 'Smart Prioritization',
      description: 'Automatically prioritize emails based on importance and urgency'
    },
    {
      icon: Users,
      title: 'Better Organization',
      description: 'Keep your inbox organized with AI-powered categorization'
    },
    {
      icon: Reply,
      title: 'Quick Responses',
      description: 'Generate contextual email responses automatically'
    }
  ];

  const features = [
    {
      icon: Filter,
      title: 'Smart Filtering',
      description: 'Automatically sort emails into relevant folders and categories'
    },
    {
      icon: Reply,
      title: 'Auto-Response',
      description: 'Generate intelligent responses based on email content and context'
    },
    {
      icon: Archive,
      title: 'Email Archiving',
      description: 'Automatically archive old emails based on customizable rules'
    },
    {
      icon: Send,
      title: 'Scheduled Sending',
      description: 'Schedule emails to be sent at optimal times for better engagement'
    }
  ];

  const capabilities = [
    {
      icon: Inbox,
      title: 'Inbox Zero',
      description: 'Maintain a clean, organized inbox automatically'
    },
    {
      icon: Star,
      title: 'Important Email Detection',
      description: 'Never miss critical emails with AI-powered importance scoring'
    },
    {
      icon: AlertCircle,
      title: 'Follow-up Reminders',
      description: 'Automatic reminders for emails that need follow-up'
    },
    {
      icon: Mail,
      title: 'Email Templates',
      description: 'Smart templates that adapt to different email types'
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[color:var(--sand)] to-[color:var(--paper)] dark:from-[color:var(--bg)] dark:to-[color:var(--paper)]">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-[color:var(--blue-100)] text-[color:var(--blue)] rounded-full text-sm font-medium mb-6">
              <Mail className="h-4 w-4 mr-2" />
              Email Management Automation
            </div>
            <h1 className="text-6xl font-light text-[color:var(--ink)] mb-6 tracking-tight">
              Automate Email Management
            </h1>
            <p className="text-xl text-[color:var(--text-2)] mb-8 font-light max-w-3xl mx-auto">
              Transform your email workflow with AI-powered automation that sorts, prioritizes, and responds to emails intelligently
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[color:var(--ink)] hover:bg-[color:var(--text-2)] text-white px-8 py-3 rounded-full" asChild>
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
      <section className="py-20 px-4 bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Why Automate Email Management?</h2>
            <p className="text-xl text-[color:var(--text-2)]">Take control of your inbox with intelligent automation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-[28px] bg-gradient-to-r from-[color:var(--blue)] to-[color:var(--blue)] w-fit mx-auto mb-6">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-[color:var(--ink)] mb-4">{benefit.title}</h3>
                  <p className="text-[color:var(--text-2)] leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-[color:var(--sand)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Email Automation Features</h2>
            <p className="text-xl text-[color:var(--text-2)]">Powerful tools for email management automation</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-[color:var(--paper)] p-8 rounded-[28px] shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-[28px] bg-gradient-to-r from-[color:var(--blue)] to-[color:var(--blue)] mr-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-[color:var(--ink)]">{feature.title}</h3>
                </div>
                <p className="text-[color:var(--text-2)] leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20 px-4 bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Advanced Capabilities</h2>
            <p className="text-xl text-[color:var(--text-2)]">AI-powered email intelligence for maximum productivity</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {capabilities.map((capability, index) => (
              <div key={index} className="bg-[color:var(--sand)] p-6 rounded-[28px] text-center">
                <div className="p-4 rounded-[28px] bg-gradient-to-r from-[color:var(--blue)] to-[color:var(--text-2)] w-fit mx-auto mb-6">
                  <capability.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-medium text-[color:var(--ink)] mb-4">{capability.title}</h3>
                <p className="text-[color:var(--text-2)]">{capability.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[color:var(--sand)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Ready to Master Your Inbox?</h2>
          <p className="text-xl text-[color:var(--text-2)] mb-8">
            Start automating your email management and reclaim hours every day
          </p>
          <Button size="lg" className="bg-[color:var(--ink)] hover:bg-[color:var(--text-2)] text-white px-8 py-3 rounded-full" asChild>
            <Link to="/get-started">
              Automate Email Management
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
