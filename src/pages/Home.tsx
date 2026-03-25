
import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Users, Building2, Zap, Network, Globe, BarChart3, MessageCircle, Bot, Palette, Microscope, Heart, Brain, FlaskConical, Dna, Stethoscope, Activity } from 'lucide-react';

const Home = () => {
  useEffect(() => {
    console.log('Home: Component mounted and rendering');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <div className="inline-block px-6 py-2 rounded-full shadow-neu-sm mb-8">
              <span className="text-sm text-muted-foreground font-medium">Powered by AI • Built for Science</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-light text-foreground mb-6 tracking-tight">
              AI Research Team
              <span className="block text-primary">for Life Sciences</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto font-light leading-relaxed">
              Transform 40 hours per week of research work into minutes. Observio AI automates data analysis, 
              literature review, experiment design, and regulatory compliance for healthcare and biotech organizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary text-primary-foreground hover:shadow-neu-lg px-8 py-4 text-lg rounded-full shadow-neu transition-all" asChild>
                <Link to="/signup">
                  Start 14-Day Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg rounded-full shadow-neu-sm hover:shadow-neu transition-all" asChild>
                <Link to="/watch-demo">
                  Watch Demo
                </Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground mt-4">94% of biotech researchers say AI directly accelerates discovery</p>
          </div>
        </section>

        {/* Core Modules Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-foreground mb-4">
                Complete AI Research Suite
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Everything you need to automate research and accelerate discovery
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Brain, color: 'text-primary', title: 'Research Assistant', desc: 'AI-powered literature review, hypothesis generation, and experimental design optimization.', items: ['PubMed integration', 'Smart citation analysis', 'Protocol generation'] },
                { icon: BarChart3, color: 'text-accent', title: 'Data Analytics', desc: 'Advanced statistical analysis, biomarker discovery, and predictive modeling.', items: ['Omics analysis', 'Clinical trial optimization', 'Real-world evidence'] },
                { icon: FlaskConical, color: 'text-primary', title: 'Lab Automation', desc: 'Automated experiment tracking, quality control, and results interpretation.', items: ['LIMS integration', 'Quality monitoring', 'Result validation'] },
                { icon: Stethoscope, color: 'text-destructive', title: 'Regulatory Compliance', desc: 'FDA/EMA submission preparation, clinical documentation, and safety monitoring.', items: ['Regulatory tracking', 'Document generation', 'Compliance monitoring'] },
              ].map((mod, i) => (
                <div key={i} className="p-8 rounded-2xl shadow-neu hover:shadow-neu-lg transition-all duration-300 bg-background">
                  <div className="w-12 h-12 rounded-xl shadow-neu-sm flex items-center justify-center mb-6">
                    <mod.icon className={`h-6 w-6 ${mod.color}`} />
                  </div>
                  <h3 className="text-xl font-medium text-foreground mb-4">{mod.title}</h3>
                  <p className="text-muted-foreground mb-4">{mod.desc}</p>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    {mod.items.map((item, j) => (
                      <li key={j}>• {item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Preview Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-light text-foreground mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Choose the plan that fits your research needs and organization size
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-8 rounded-2xl shadow-neu bg-background hover:shadow-neu-lg transition-all duration-300">
                <h3 className="text-xl font-medium text-foreground mb-2">Researcher</h3>
                <div className="text-3xl font-bold text-foreground mb-4">$89<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                <p className="text-muted-foreground mb-6">Perfect for individual researchers</p>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li>• 500k analysis tokens</li>
                  <li>• 200 data visualizations</li>
                  <li>• Basic literature review</li>
                  <li>• Standard support</li>
                </ul>
              </div>
              
              <div className="p-8 rounded-2xl shadow-neu-lg bg-primary text-primary-foreground transform scale-105">
                <h3 className="text-xl font-medium mb-2">Lab Team</h3>
                <div className="text-3xl font-bold mb-4">$249<span className="text-lg font-normal opacity-80">/mo</span></div>
                <p className="opacity-90 mb-6">For research teams (5-20 people)</p>
                <ul className="text-sm space-y-2 text-left opacity-90">
                  <li>• 2M analysis tokens</li>
                  <li>• 1k data visualizations</li>
                  <li>• Advanced analytics</li>
                  <li>• Priority support</li>
                </ul>
              </div>
              
              <div className="p-8 rounded-2xl shadow-neu bg-background hover:shadow-neu-lg transition-all duration-300">
                <h3 className="text-xl font-medium text-foreground mb-2">Enterprise</h3>
                <div className="text-3xl font-bold text-foreground mb-4">$599<span className="text-lg font-normal text-muted-foreground">/mo</span></div>
                <p className="text-muted-foreground mb-6">For biotech & pharma companies</p>
                <ul className="text-sm text-muted-foreground space-y-2 text-left">
                  <li>• Unlimited tokens</li>
                  <li>• Custom integrations</li>
                  <li>• Regulatory compliance</li>
                  <li>• White-label options</li>
                </ul>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground mt-8">14-day free trial • Annual billing saves 20%</p>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-light text-foreground mb-4">
              Trusted by Leading Research Organizations
            </h2>
            <p className="text-xl text-muted-foreground mb-12">
              Join thousands of researchers accelerating discovery with AI
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                { value: '94%', label: 'of researchers report faster discovery with AI', color: 'text-primary' },
                { value: '40hrs', label: 'per week saved on data analysis', color: 'text-accent' },
                { value: '3x', label: 'faster time to publication', color: 'text-primary' },
              ].map((stat, i) => (
                <div key={i} className="p-8 rounded-2xl shadow-neu bg-background">
                  <div className={`text-4xl font-bold ${stat.color} mb-2`}>{stat.value}</div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 mx-4 sm:mx-8 rounded-3xl shadow-neu-lg bg-primary mb-8">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-light text-primary-foreground mb-6">
              Ready to Accelerate Your Research?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Join the AI research revolution and turn weeks of work into hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 px-8 py-4 text-lg rounded-full shadow-lg" asChild>
                <Link to="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
