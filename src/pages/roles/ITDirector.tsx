
import { Database, Shield, Zap, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ITDirector = () => {
  return (
    <div className="min-h-screen dark:bg-[color:var(--bg)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[color:var(--blue-100)] to-[color:var(--blue-100)] pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-[color:var(--blue)] p-4 rounded-[28px]">
                <Database className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[color:var(--ink)] mb-6">
              AI Solutions for
              <span className="text-[color:var(--blue)] block">IT Directors</span>
            </h1>
            <p className="text-xl text-[color:var(--text-2)] mb-8 max-w-3xl mx-auto">
              Modernize IT operations, enhance security, and drive digital transformation with enterprise-grade AI automation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[color:var(--blue)] hover:bg-[color:var(--blue)]" asChild>
                <Link to="/get-started">Modernize IT <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/schedule-demo">Schedule Technical Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[color:var(--ink)] mb-4">
              Enterprise IT Transformation
            </h2>
            <p className="text-xl text-[color:var(--text-2)]">
              Secure, scalable, and intelligent IT operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[color:var(--blue-100)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-[color:var(--blue)]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Enhanced Security</h3>
              <p className="text-[color:var(--text-2)]">
                AI-powered threat detection and automated security response protocols.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[color:var(--blue-100)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Database className="h-8 w-8 text-[color:var(--blue)]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Infrastructure Automation</h3>
              <p className="text-[color:var(--text-2)]">
                Automate server management, deployments, and infrastructure monitoring.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[color:var(--blue-100)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-[color:var(--blue)]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Performance Optimization</h3>
              <p className="text-[color:var(--text-2)]">
                Real-time system optimization and predictive maintenance capabilities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[color:var(--ink)] py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Lead IT Innovation?
          </h2>
          <p className="text-xl text-[color:var(--text-4)] mb-8">
            Transform your IT infrastructure with cutting-edge AI automation solutions.
          </p>
          <Button size="lg" className="bg-[color:var(--blue)] hover:bg-[color:var(--blue)]" asChild>
            <Link to="/get-started">Start Transformation</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ITDirector;
