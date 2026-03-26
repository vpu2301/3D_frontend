
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Server, Shield, Monitor, Code } from 'lucide-react';

const It = () => {
  useEffect(() => {
    console.log('It: Component mounted and rendering');
    console.log('It: Current location:', window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-[#181512]">
      <Header />
      
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI-Driven IT Solutions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Modernize your IT operations with intelligent automation. Enhance security, 
              optimize infrastructure, and accelerate digital transformation with AI assistants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="shadow-lg">
              <CardHeader>
                <Server className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>Infrastructure Monitoring</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  AI-powered monitoring and predictive maintenance for servers, networks, and cloud infrastructure.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Shield className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Security Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Intelligent threat detection, incident response, and vulnerability management with AI security tools.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Monitor className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Help Desk Automation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automated IT ticket resolution and user support with intelligent troubleshooting assistance.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Code className="h-8 w-8 text-[#111111] mb-2" />
                <CardTitle>DevOps Integration</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  AI-enhanced CI/CD pipelines, code quality analysis, and deployment optimization.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Server className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Resource Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Intelligent resource allocation and cost optimization for cloud and on-premise infrastructure.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Shield className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Compliance Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automated compliance monitoring and reporting for regulatory requirements and industry standards.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link to="/signup">
                Modernize Your IT
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

export default It;
