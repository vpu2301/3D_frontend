
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Clock, Shield, BarChart3, Users, Cog } from 'lucide-react';

const Features = () => {
  useEffect(() => {
    console.log('Features: Component mounted and rendering');
    console.log('Features: Current location:', window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Business
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how 3days.ai transforms your operations with intelligent automation, 
              advanced analytics, and seamless integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Zap className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Lightning Fast Deployment</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Get up and running in minutes, not months. Our pre-trained AI employees 
                  are ready to work from day one.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 3-minute setup process</li>
                  <li>• Pre-configured workflows</li>
                  <li>• Instant integration</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Clock className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>24/7 Availability</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Your AI employees never sleep, take breaks, or call in sick. 
                  Consistent performance around the clock.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Continuous operation</li>
                  <li>• No downtime</li>
                  <li>• Global timezone support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Shield className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Enterprise Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Bank-level security with end-to-end encryption, compliance certifications, 
                  and advanced access controls.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• SOC 2 Type II certified</li>
                  <li>• GDPR compliant</li>
                  <li>• Zero-trust architecture</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Advanced Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Real-time insights and performance metrics to optimize your operations 
                  and measure ROI.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Performance dashboards</li>
                  <li>• Predictive analytics</li>
                  <li>• Custom reporting</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Users className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Seamless Collaboration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  AI employees that work alongside your human team, enhancing 
                  productivity without disruption.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Team integration</li>
                  <li>• Workflow handoffs</li>
                  <li>• Smart notifications</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <Cog className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Easy Customization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Tailor AI employees to your specific business needs with 
                  intuitive configuration tools.
                </p>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• No-code customization</li>
                  <li>• Business rule engine</li>
                  <li>• Flexible workflows</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Experience the Future?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of companies already using AI employees to transform their operations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
                <Link to="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/watch-demo">
                  Watch Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Features;
