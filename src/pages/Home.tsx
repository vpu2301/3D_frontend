
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Users, Building2, Zap, Network, Globe, BarChart3, MessageCircle, Bot, Palette, Microscope, Heart, Brain, FlaskConical, Dna, Stethoscope, Activity } from 'lucide-react';

const Home = () => {
  useEffect(() => {
    console.log('Home: Component mounted and rendering');
    console.log('Home: Current location:', window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-light text-gray-900 mb-6 tracking-tight">
              AI Research Team
              <span className="block text-blue-600">for Life Sciences</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
              Transform 40 hours per week of research work into minutes. Observio AI automates data analysis, 
              literature review, experiment design, and regulatory compliance for healthcare and biotech organizations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all" asChild>
                <Link to="/signup">
                  Start 14-Day Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg rounded-full border-2 hover:bg-gray-50" asChild>
                <Link to="/watch-demo">
                  Watch Demo
                </Link>
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">94% of biotech researchers say AI directly accelerates discovery</p>
          </div>
        </section>

        {/* Core Modules Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Complete AI Research Suite
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to automate research and accelerate discovery
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Research Assistant</h3>
                <p className="text-gray-600 mb-4">
                  AI-powered literature review, hypothesis generation, and experimental design optimization.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• PubMed integration</li>
                  <li>• Smart citation analysis</li>
                  <li>• Protocol generation</li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <BarChart3 className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Data Analytics</h3>
                <p className="text-gray-600 mb-4">
                  Advanced statistical analysis, biomarker discovery, and predictive modeling.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Omics analysis</li>
                  <li>• Clinical trial optimization</li>
                  <li>• Real-world evidence</li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <FlaskConical className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Lab Automation</h3>
                <p className="text-gray-600 mb-4">
                  Automated experiment tracking, quality control, and results interpretation.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• LIMS integration</li>
                  <li>• Quality monitoring</li>
                  <li>• Result validation</li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                  <Stethoscope className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Regulatory Compliance</h3>
                <p className="text-gray-600 mb-4">
                  FDA/EMA submission preparation, clinical documentation, and safety monitoring.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Regulatory tracking</li>
                  <li>• Document generation</li>
                  <li>• Compliance monitoring</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Preview Section */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Choose the plan that fits your research needs and organization size
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <h3 className="text-xl font-medium text-gray-900 mb-2">Researcher</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">$89<span className="text-lg font-normal text-gray-600">/mo</span></div>
                <p className="text-gray-600 mb-6">Perfect for individual researchers</p>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>• 500k analysis tokens</li>
                  <li>• 200 data visualizations</li>
                  <li>• Basic literature review</li>
                  <li>• Standard support</li>
                </ul>
              </div>
              
              <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg transform scale-105">
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
              
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <h3 className="text-xl font-medium text-gray-900 mb-2">Enterprise</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">$599<span className="text-lg font-normal text-gray-600">/mo</span></div>
                <p className="text-gray-600 mb-6">For biotech & pharma companies</p>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>• Unlimited tokens</li>
                  <li>• Custom integrations</li>
                  <li>• Regulatory compliance</li>
                  <li>• White-label options</li>
                </ul>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-8">14-day free trial • Annual billing saves 20%</p>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Trusted by Leading Research Organizations
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Join thousands of researchers accelerating discovery with AI
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">94%</div>
                <p className="text-gray-600">of researchers report faster discovery with AI</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">40hrs</div>
                <p className="text-gray-600">per week saved on data analysis</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">3x</div>
                <p className="text-gray-600">faster time to publication</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-light text-white mb-6">
              Ready to Accelerate Your Research?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join the AI research revolution and turn weeks of work into hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg" asChild>
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
