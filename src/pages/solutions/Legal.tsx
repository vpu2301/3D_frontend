
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Scale, FileText, Search } from 'lucide-react';

const Legal = () => {
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
            For Legal
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            Streamline legal document management and compliance with intelligent automation.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Scale className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-4">Contract Analysis</h3>
              <p className="text-gray-600">AI-powered contract review and risk assessment</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <FileText className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-4">Document Generation</h3>
              <p className="text-gray-600">Automated legal document creation and templates</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Search className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-4">Compliance Monitoring</h3>
              <p className="text-gray-600">Real-time compliance tracking and reporting</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full">
            Enhance Legal Operations
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Legal;
