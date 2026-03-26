
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Cog, BarChart3, Clock, Shield } from 'lucide-react';

const Operations = () => {
  useEffect(() => {
    console.log('Operations: Component mounted and rendering');
    console.log('Operations: Current location:', window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#181512]">
      <Header />
      
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Operational Excellence with AI
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Streamline your operations with intelligent automation. Optimize workflows, 
              reduce costs, and improve efficiency with AI-powered operational assistants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="shadow-lg">
              <CardHeader>
                <Cog className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Process Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automate repetitive tasks and complex workflows to improve efficiency and reduce human error.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Performance Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Real-time operational metrics and AI-driven insights to optimize business performance.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Clock className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Resource Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Intelligent resource allocation and capacity planning based on predictive analytics.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Shield className="h-8 w-8 text-[#111111] mb-2" />
                <CardTitle>Quality Control</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automated quality assurance and compliance monitoring with AI-powered inspection systems.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Cog className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Supply Chain Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  AI-driven supply chain management for inventory optimization and demand forecasting.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Cost Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Identify cost-saving opportunities and optimize operational expenses with AI insights.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link to="/signup">
                Optimize Your Operations
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Operations;
