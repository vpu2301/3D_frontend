
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Users, Building2, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-light text-gray-900 mb-6 tracking-tight">
              AI Employees for
              <span className="block text-blue-600">Modern Business</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
              Transform your operations with intelligent AI assistants that work 24/7. 
              Automate complex workflows, reduce costs, and scale your business effortlessly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all" asChild>
                <Link to="/get-started">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg rounded-full border-2 hover:bg-gray-50" asChild>
                <Link to="/features">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Why Choose 3days.ai?
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Our AI employees deliver results in just 3 days, transforming how you work
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Lightning Fast Setup</h3>
                <p className="text-gray-600">
                  Deploy AI employees in minutes, not months. Our pre-trained models get you started immediately.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">24/7 Availability</h3>
                <p className="text-gray-600">
                  Your AI employees never sleep, take breaks, or call in sick. Consistent performance around the clock.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <Building2 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Enterprise Ready</h3>
                <p className="text-gray-600">
                  Secure, scalable, and compliant. Built for businesses that demand the highest standards.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-light text-gray-900 mb-12">
              Trusted by Forward-Thinking Companies
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              <div className="h-12 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 font-medium">Company A</span>
              </div>
              <div className="h-12 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 font-medium">Company B</span>
              </div>
              <div className="h-12 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 font-medium">Company C</span>
              </div>
              <div className="h-12 bg-gray-200 rounded flex items-center justify-center">
                <span className="text-gray-500 font-medium">Company D</span>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-light text-white mb-6">
              Ready to Transform Your Business?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of companies already using AI employees to scale their operations.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg" asChild>
              <Link to="/get-started">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
