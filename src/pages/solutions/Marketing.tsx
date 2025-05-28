
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Megaphone, Mail, BarChart3 } from 'lucide-react';

const Marketing = () => {
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
            For Marketing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            Automate campaigns and personalize customer experiences at scale.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Megaphone className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-4">Campaign Automation</h3>
              <p className="text-gray-600">Create and optimize campaigns automatically</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Mail className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-4">Email Personalization</h3>
              <p className="text-gray-600">AI-powered personalized email content at scale</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <BarChart3 className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-4">Performance Analytics</h3>
              <p className="text-gray-600">Real-time campaign performance and ROI tracking</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full">
            Transform Your Marketing
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Marketing;
