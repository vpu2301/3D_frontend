
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, CheckSquare, Users, Clock } from 'lucide-react';

const Tasks = () => {
  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
            Task Management
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            Smart task orchestration that prioritizes, assigns, and tracks work automatically.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <CheckSquare className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-4">Smart Prioritization</h3>
              <p className="text-gray-600">AI automatically prioritizes tasks based on urgency and impact</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-4">Team Coordination</h3>
              <p className="text-gray-600">Seamless collaboration and task assignment across teams</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-8 text-center">
              <Clock className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-4">Time Tracking</h3>
              <p className="text-gray-600">Automatic time tracking and productivity insights</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="text-center">
          <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full">
            Organize Your Tasks
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
