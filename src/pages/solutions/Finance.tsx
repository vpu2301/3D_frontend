
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, DollarSign, TrendingUp, Calculator, Shield } from 'lucide-react';

const Finance = () => {
  useEffect(() => {
    console.log('Finance: Component mounted and rendering');
    console.log('Finance: Current location:', window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#181512]">
      <Header />
      
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI-Enhanced Finance Solutions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionize your financial operations with intelligent automation. Streamline accounting, 
              improve accuracy, and gain valuable insights with AI-powered finance assistants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="shadow-lg">
              <CardHeader>
                <DollarSign className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Automated Bookkeeping</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automate transaction categorization, invoice processing, and expense management with AI precision.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Financial Forecasting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  AI-powered predictive analytics for cash flow, budget planning, and financial risk assessment.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Calculator className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Tax Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Intelligent tax planning and compliance management to maximize deductions and minimize liability.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Shield className="h-8 w-8 text-[#111111] mb-2" />
                <CardTitle>Fraud Detection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Advanced AI algorithms to detect anomalies and prevent financial fraud in real-time.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <DollarSign className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Budget Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Smart budget tracking and variance analysis with automated alerts and recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <TrendingUp className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Financial Reporting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automated financial report generation with AI-driven insights and visualization.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link to="/signup">
                Optimize Your Finances
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

export default Finance;
