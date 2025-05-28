
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, GitBranch, Layers, Play } from 'lucide-react';

const Workflow = () => {
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
            Workflow Builder
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            Visual workflow creation that makes complex automation simple and intuitive.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <GitBranch className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-4">Visual Builder</h3>
              <p className="text-gray-600">Drag and drop interface for creating complex workflows</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Layers className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-4">Multi-Step Logic</h3>
              <p className="text-gray-600">Build sophisticated conditional workflows with ease</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Play className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-4">Instant Deploy</h3>
              <p className="text-gray-600">Deploy workflows instantly with one-click activation</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full">
            Build Your First Workflow
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Workflow;
