
import { Cog, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const OperationsManager = () => {
  return (
    <div className="min-h-screen dark:bg-[#181512]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#111111] to-red-100 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-[#111111] p-4 rounded-2xl">
                <Cog className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              AI Solutions for
              <span className="text-[#111111] block">Operations Managers</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Streamline operations, reduce costs, and boost efficiency with AI-powered automation designed for operations professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#111111] hover:bg-[#222222]" asChild>
                <Link to="/get-started">Optimize Operations <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/schedule-demo">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Operational Excellence Through AI
            </h2>
            <p className="text-xl text-gray-600">
              Transform your operations with intelligent automation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">40% Efficiency Gain</h3>
              <p className="text-gray-600">
                Automate routine operational tasks and focus your team on strategic initiatives.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Cog className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Process Optimization</h3>
              <p className="text-gray-600">
                Identify bottlenecks and optimize workflows with AI-driven insights and recommendations.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Team Productivity</h3>
              <p className="text-gray-600">
                Enable your team to work on high-value activities while AI handles routine operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#f5ede3] py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[#111111] mb-6">
            Ready to Transform Your Operations?
          </h2>
          <p className="text-xl text-black/60 mb-8">
            Join operations managers who have revolutionized their processes with AI automation.
          </p>
          <Button size="lg" className="bg-[#111111] hover:bg-[#222222]" asChild>
            <Link to="/get-started">Start Optimizing</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default OperationsManager;
