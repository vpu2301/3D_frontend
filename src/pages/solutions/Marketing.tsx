
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Megaphone, Target, BarChart3, Users } from 'lucide-react';

const Marketing = () => {
  useEffect(() => {
    console.log('Marketing: Component mounted and rendering');
    console.log('Marketing: Current location:', window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#181512]">
      <Header />
      
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI-Driven Marketing Solutions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Revolutionize your marketing strategy with intelligent automation. Create personalized campaigns, 
              optimize content, and drive better ROI with AI-powered marketing assistants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="shadow-lg">
              <CardHeader>
                <Megaphone className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Content Creation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Generate high-quality marketing content, social media posts, and email campaigns automatically.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Target className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Audience Targeting</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  AI-powered audience segmentation and targeting for maximum campaign effectiveness.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Campaign Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Real-time campaign performance tracking with AI-driven insights and optimization recommendations.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Users className="h-8 w-8 text-[#111111] mb-2" />
                <CardTitle>Lead Nurturing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automated lead nurturing sequences that adapt based on customer behavior and engagement.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Target className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>A/B Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Intelligent A/B testing that automatically optimizes campaigns for better performance.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <BarChart3 className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>ROI Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Maximize marketing ROI with AI-driven budget allocation and channel optimization.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link to="/signup">
                Transform Your Marketing
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

export default Marketing;
