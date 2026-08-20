import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, CheckCircle, AlertTriangle, FileText, ArrowRight, Clock, BarChart, Users, Database, Eye, Bell, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const ComplianceMonitoring = () => {
  const benefits = [
    {
      icon: Shield,
      title: 'Risk Reduction',
      description: 'Proactively identify and mitigate compliance risks before they become issues'
    },
    {
      icon: Clock,
      title: 'Real-time Monitoring',
      description: 'Continuous monitoring ensures you never miss critical compliance events'
    },
    {
      icon: FileText,
      title: 'Audit Readiness',
      description: 'Maintain comprehensive audit trails and documentation automatically'
    },
    {
      icon: BarChart,
      title: 'Detailed Reporting',
      description: 'Generate compliance reports and dashboards for stakeholders'
    }
  ];

  const features = [
    {
      icon: Eye,
      title: 'Continuous Monitoring',
      description: 'Monitor all business processes and transactions for compliance violations'
    },
    {
      icon: Bell,
      title: 'Automated Alerts',
      description: 'Get instant notifications when compliance thresholds are breached'
    },
    {
      icon: Database,
      title: 'Data Governance',
      description: 'Ensure data handling complies with GDPR, CCPA, and other regulations'
    },
    {
      icon: Lock,
      title: 'Access Control',
      description: 'Monitor and control user access to sensitive systems and data'
    }
  ];

  const industries = [
    {
      name: 'Financial Services',
      regulations: ['SOX', 'PCI DSS', 'Basel III', 'MiFID II']
    },
    {
      name: 'Healthcare',
      regulations: ['HIPAA', 'FDA', 'HITECH', 'GDPR']
    },
    {
      name: 'Technology',
      regulations: ['GDPR', 'CCPA', 'SOC 2', 'ISO 27001']
    },
    {
      name: 'Manufacturing',
      regulations: ['ISO 9001', 'OSHA', 'EPA', 'FDA']
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
              <Shield className="h-4 w-4 mr-2" />
              Compliance Monitoring Automation
            </div>
            <h1 className="text-6xl font-light text-[color:var(--ink)] mb-6 tracking-tight">
              Automate Compliance Monitoring
            </h1>
            <p className="text-xl text-[color:var(--text-2)] mb-8 font-light max-w-3xl mx-auto">
              Stay ahead of regulatory requirements with automated compliance monitoring that detects violations in real-time and maintains audit trails
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[color:var(--ink)] hover:bg-[color:var(--text-2)] text-white px-8 py-3 rounded-full" asChild>
                <Link to="/get-started">Start Monitoring</Link>
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
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Why Automate Compliance Monitoring?</h2>
            <p className="text-xl text-[color:var(--text-2)]">Protect your organization with proactive compliance management</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-[28px] bg-gradient-to-r from-[color:var(--blue)] to-[color:var(--text-2)] w-fit mx-auto mb-6">
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
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Compliance Monitoring Features</h2>
            <p className="text-xl text-[color:var(--text-2)]">Comprehensive tools for regulatory compliance</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-[color:var(--paper)] p-8 rounded-[28px] shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="p-3 rounded-[28px] bg-[color:var(--ink)] mr-4">
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

      {/* Industry Compliance */}
      <section className="py-20 px-4 bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Industry-Specific Compliance</h2>
            <p className="text-xl text-[color:var(--text-2)]">Pre-built monitoring for major industry regulations</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {industries.map((industry, index) => (
              <div key={index} className="bg-[color:var(--sand)] p-6 rounded-[28px]">
                <h3 className="text-xl font-medium text-[color:var(--ink)] mb-4">{industry.name}</h3>
                <div className="space-y-2">
                  {industry.regulations.map((regulation, idx) => (
                    <div key={idx} className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-[color:var(--blue)] mr-2" />
                      <span className="text-[color:var(--ink)] text-sm">{regulation}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-[color:var(--sand)]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Stay Compliant, Stay Secure</h2>
          <p className="text-xl text-[color:var(--text-2)] mb-8">
            Protect your organization with automated compliance monitoring that works 24/7
          </p>
          <Button size="lg" className="bg-[color:var(--ink)] hover:bg-[color:var(--text-2)] text-white px-8 py-3 rounded-full" asChild>
            <Link to="/get-started">
              Start Monitoring Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default ComplianceMonitoring;
