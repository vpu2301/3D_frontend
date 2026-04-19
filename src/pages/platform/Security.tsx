
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Shield, Lock, Eye, Key, FileText, Users, Globe, AlertTriangle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Security = () => {
  const features = [
    {
      icon: Shield,
      title: 'Data Encryption',
      description: 'End-to-end encryption with AES-256 for data at rest and TLS 1.3 for data in transit.'
    },
    {
      icon: Lock,
      title: 'Access Control',
      description: 'Role-based access control (RBAC) with multi-factor authentication and SSO integration.'
    },
    {
      icon: Eye,
      title: '24/7 Monitoring',
      description: 'Continuous security monitoring with real-time threat detection and incident response.'
    },
    {
      icon: Key,
      title: 'Identity Management',
      description: 'Centralized identity management with fine-grained permissions and audit trails.'
    },
    {
      icon: FileText,
      title: 'Compliance Ready',
      description: 'SOC 2 Type II, GDPR, HIPAA, and ISO 27001 compliance with regular audits.'
    },
    {
      icon: Users,
      title: 'Security Training',
      description: 'Comprehensive security awareness training and ongoing education for all team members.'
    }
  ];

  const certifications = [
    { name: 'SOC 2 Type II', status: 'Certified', description: 'Security and availability controls' },
    { name: 'ISO 27001', status: 'Certified', description: 'Information security management' },
    { name: 'GDPR', status: 'Compliant', description: 'Data protection and privacy' },
    { name: 'HIPAA', status: 'Compliant', description: 'Healthcare data protection' }
  ];

  const securityMetrics = [
    { metric: '99.9%', label: 'Security uptime' },
    { metric: '<1min', label: 'Incident response time' },
    { metric: '0', label: 'Data breaches to date' },
    { metric: '24/7', label: 'Security monitoring' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Security Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Enterprise-grade security that protects your data, ensures compliance, and maintains 
              the highest standards of privacy and trust. Your security is our priority.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-3 rounded-full" asChild>
                <Link to="/start-free-trial">View Security Details</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <Link to="/contact">Contact Security Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Security Metrics */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {securityMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-light text-red-600 mb-2">{metric.metric}</div>
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
            <h2 className="text-4xl font-light text-gray-900 mb-6">Comprehensive Security Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multi-layered security architecture designed to protect against modern threats
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-red-500 to-[#222222] w-fit mx-auto mb-6">
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

      {/* Certifications */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Compliance & Certifications</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Independently verified security standards and compliance frameworks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-2xl text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{cert.name}</h3>
                <div className="text-green-600 font-medium mb-2">{cert.status}</div>
                <p className="text-sm text-gray-600">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Architecture */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-12 text-[#111111] border border-black/8">
            <h3 className="text-3xl font-light mb-8 text-center">Security Architecture</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-medium mb-4">Infrastructure Security</h4>
                <ul className="space-y-3 text-black/60">
                  <li>• Multi-region deployment with redundancy</li>
                  <li>• Network segmentation and firewalls</li>
                  <li>• Intrusion detection and prevention</li>
                  <li>• Regular penetration testing</li>
                  <li>• Secure development lifecycle</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-medium mb-4">Data Protection</h4>
                <ul className="space-y-3 text-black/60">
                  <li>• Encryption at rest and in transit</li>
                  <li>• Data classification and handling</li>
                  <li>• Secure backup and recovery</li>
                  <li>• Data residency compliance</li>
                  <li>• Secure data disposal</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Incident Response */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Incident Response</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Rapid response and recovery protocols to minimize impact
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Detection</h3>
              <p className="text-gray-600">Real-time monitoring and automated alerts</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#1b1b1b] rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-[#111111]" />
              </div>
              <h3 className="text-lg font-medium mb-2">Analysis</h3>
              <p className="text-gray-600">Rapid threat assessment and impact analysis</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Containment</h3>
              <p className="text-gray-600">Immediate containment and mitigation steps</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Recovery</h3>
              <p className="text-gray-600">Full system recovery and lessons learned</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Contact */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-6">Security Questions?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Our security team is here to address any concerns or questions you may have.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-3 rounded-full" asChild>
              <Link to="/contact">Contact Security Team</Link>
            </Button>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full">
              Download Security Whitepaper
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#f5ede3] text-[#111111] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Security You Can Trust</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Experience enterprise-grade security with complete peace of mind.
          </p>
          <Button size="lg" className="bg-[#111111] text-white hover:bg-[#222222] rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              Start Secure Trial
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Security;
