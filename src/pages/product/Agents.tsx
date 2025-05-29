
import { Users, Zap, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Agents = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-indigo-100 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-purple-600 p-4 rounded-2xl">
                <Users className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI
              <span className="text-purple-600 block">Agents</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Deploy intelligent AI agents that work autonomously to handle complex tasks, make decisions, and deliver results 24/7.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700" asChild>
                <Link to="/get-started">Deploy Agents <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/watch-demo">Watch Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Autonomous AI Workforce
            </h2>
            <p className="text-xl text-gray-600">
              Deploy AI agents that think, learn, and execute like your best employees
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Autonomous Decision Making</h3>
              <p className="text-gray-600">
                AI agents that can analyze situations, make decisions, and take actions without human intervention.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Multi-Agent Collaboration</h3>
              <p className="text-gray-600">
                Deploy teams of specialized AI agents that work together to solve complex business challenges.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Safe & Reliable</h3>
              <p className="text-gray-600">
                Built-in safety measures and monitoring to ensure agents operate within defined parameters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Deploy AI Agents?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start with one agent and scale to a full AI workforce that transforms your business.
          </p>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700" asChild>
            <Link to="/get-started">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Agents;
