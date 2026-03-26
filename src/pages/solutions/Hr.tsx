
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, UserCheck, Calendar, BookOpen } from 'lucide-react';

const Hr = () => {
  useEffect(() => {
    console.log('Hr: Component mounted and rendering');
    console.log('Hr: Current location:', window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#181512]">
      <Header />
      
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI-Powered HR Solutions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform your human resources with intelligent automation. Streamline recruitment, 
              enhance employee experience, and optimize workforce management with AI assistants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="shadow-lg">
              <CardHeader>
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Recruitment Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automate candidate screening, interview scheduling, and talent matching with AI-powered recruitment tools.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <UserCheck className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Employee Onboarding</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Personalized onboarding experiences with automated document processing and training schedules.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Calendar className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Performance Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  AI-driven performance tracking, goal setting, and feedback systems for continuous employee development.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <BookOpen className="h-8 w-8 text-[#111111] mb-2" />
                <CardTitle>Learning & Development</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Personalized training recommendations and skill gap analysis to enhance employee capabilities.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Users className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Employee Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Monitor employee satisfaction and engagement with AI-powered sentiment analysis and surveys.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Calendar className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Workforce Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Data-driven insights into workforce trends, productivity, and optimization opportunities.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link to="/signup">
                Modernize Your HR
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

export default Hr;
