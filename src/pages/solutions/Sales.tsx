
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, Target, BarChart3 } from 'lucide-react';

const Sales = () => {
  useEffect(() => {
    console.log('Sales: Component mounted and rendering');
    console.log('Sales: Current location:', window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Sales Solutions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your sales process with intelligent automation. Boost conversion rates, 
              streamline lead management, and close more deals with AI assistants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="shadow-lg">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Lead Qualification</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automatically qualify and score leads using AI-powered analysis of customer behavior and engagement patterns.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Users className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Customer Outreach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Personalized email campaigns and follow-ups that adapt to customer preferences and buying signals.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Target className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Pipeline Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Smart pipeline tracking with predictive analytics to identify the best opportunities and optimal timing.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Sales Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Real-time insights into sales performance, conversion rates, and revenue forecasting with AI-driven recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Deal Acceleration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  AI identifies bottlenecks and suggests actions to move deals through your pipeline faster.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Users className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Customer Intelligence</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Deep customer insights and behavioral analysis to help sales teams understand and engage prospects better.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link to="/signup">
                Start Your Sales Transformation
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

export default Sales;
