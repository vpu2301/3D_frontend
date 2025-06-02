
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Users, 
  Bot, 
  Settings, 
  CheckCircle,
  Mouse,
  ArrowRight,
  Zap
} from 'lucide-react';

const Demos = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [demoProgress, setDemoProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');
    
    if (isAuthenticated !== 'true') {
      navigate('/login');
      return;
    }
    
    if (email) {
      setUserEmail(email);
    }
  }, [navigate]);

  const demos = [
    {
      id: 'ai-employee-setup',
      title: 'AI Employee Setup',
      description: 'Step-by-step guide to setting up your first AI employee with real UI interactions',
      icon: Users,
      duration: '3 minutes',
      color: 'bg-blue-500',
      status: 'ready'
    },
    {
      id: 'workflow-automation',
      title: 'Workflow Automation',
      description: 'Create complex automation workflows using our drag-and-drop builder',
      icon: Bot,
      duration: '5 minutes',
      color: 'bg-purple-500',
      status: 'coming-soon'
    },
    {
      id: 'integrations-setup',
      title: 'Integrations Setup',
      description: 'Connect your favorite tools and services with AI-powered integrations',
      icon: Settings,
      duration: '4 minutes',
      color: 'bg-green-500',
      status: 'coming-soon'
    }
  ];

  const aiEmployeeSteps = [
    {
      id: 1,
      title: "Navigate to AI Employees",
      description: "Click on the AI Employees section in the sidebar",
      action: "cursor-move",
      target: { x: 150, y: 200 },
      duration: 2000
    },
    {
      id: 2,
      title: "Click Create New Employee",
      description: "Press the 'Create New Employee' button",
      action: "cursor-click",
      target: { x: 400, y: 150 },
      duration: 1500
    },
    {
      id: 3,
      title: "Enter Employee Details",
      description: "Fill in the employee name and role",
      action: "typing",
      target: { x: 500, y: 250 },
      duration: 3000
    },
    {
      id: 4,
      title: "Select AI Model",
      description: "Choose the appropriate AI model for your employee",
      action: "cursor-click",
      target: { x: 450, y: 320 },
      duration: 2000
    },
    {
      id: 5,
      title: "Configure Permissions",
      description: "Set up access levels and permissions",
      action: "cursor-move",
      target: { x: 380, y: 400 },
      duration: 2500
    },
    {
      id: 6,
      title: "Review & Create",
      description: "Review settings and create your AI employee",
      action: "cursor-click",
      target: { x: 500, y: 480 },
      duration: 2000
    }
  ];

  const runAIEmployeeDemo = async () => {
    setActiveDemo('ai-employee-setup');
    setIsRunning(true);
    setCurrentStep(0);
    setDemoProgress(0);

    for (let i = 0; i < aiEmployeeSteps.length; i++) {
      setCurrentStep(i);
      const step = aiEmployeeSteps[i];
      
      // Animate cursor movement
      if (step.action === 'cursor-move' || step.action === 'cursor-click') {
        await animateCursor(step.target);
      }
      
      // Wait for step duration
      await new Promise(resolve => setTimeout(resolve, step.duration));
      
      // Update progress
      setDemoProgress(((i + 1) / aiEmployeeSteps.length) * 100);
    }

    setIsRunning(false);
  };

  const animateCursor = async (target: { x: number; y: number }) => {
    const startX = cursorPosition.x;
    const startY = cursorPosition.y;
    const duration = 1000;
    const steps = 30;
    
    for (let i = 0; i <= steps; i++) {
      const progress = i / steps;
      const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease out cubic
      
      const newX = startX + (target.x - startX) * easeProgress;
      const newY = startY + (target.y - startY) * easeProgress;
      
      setCursorPosition({ x: newX, y: newY });
      await new Promise(resolve => setTimeout(resolve, duration / steps));
    }
  };

  const resetDemo = () => {
    setActiveDemo(null);
    setIsRunning(false);
    setCurrentStep(0);
    setDemoProgress(0);
    setCursorPosition({ x: 0, y: 0 });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            
            <main className="flex-1 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-light text-gray-900 mb-2">Interactive Demos</h1>
                <p className="text-gray-600">Experience our platform features with realistic, step-by-step demonstrations</p>
              </div>

              {/* Demo Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {demos.map((demo) => (
                  <Card 
                    key={demo.id}
                    className={`transition-all duration-300 hover:shadow-lg ${
                      activeDemo === demo.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                    }`}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className={`p-3 rounded-lg ${demo.color}`}>
                          <demo.icon className="h-6 w-6 text-white" />
                        </div>
                        <Badge 
                          variant={demo.status === 'ready' ? 'default' : 'secondary'}
                          className={demo.status === 'ready' ? 'bg-green-500' : ''}
                        >
                          {demo.status === 'ready' ? 'Ready' : 'Coming Soon'}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{demo.title}</CardTitle>
                      <p className="text-sm text-gray-600">{demo.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{demo.duration}</span>
                        <Button 
                          onClick={() => demo.id === 'ai-employee-setup' && runAIEmployeeDemo()}
                          disabled={demo.status !== 'ready' || isRunning}
                          size="sm"
                          className={demo.status === 'ready' ? '' : 'opacity-50 cursor-not-allowed'}
                        >
                          <Play className="h-4 w-4 mr-1" />
                          {demo.status === 'ready' ? 'Start Demo' : 'Coming Soon'}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Active Demo Display */}
              {activeDemo && (
                <Card className="mb-6 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center text-blue-800">
                          <Zap className="h-5 w-5 mr-2" />
                          AI Employee Setup Demo
                        </CardTitle>
                        <p className="text-blue-600 mt-1">Watch as we guide you through setting up your first AI employee</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          onClick={resetDemo} 
                          variant="outline"
                          disabled={isRunning}
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </div>
                    </div>
                    {isRunning && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-blue-600 mb-2">
                          <span>Progress</span>
                          <span>{Math.round(demoProgress)}%</span>
                        </div>
                        <Progress value={demoProgress} className="h-2" />
                      </div>
                    )}
                  </CardHeader>
                </Card>
              )}

              {/* Demo Viewport */}
              {activeDemo === 'ai-employee-setup' && (
                <Card className="relative border-2 border-gray-300 bg-white min-h-[600px] overflow-hidden">
                  <CardHeader className="bg-gray-100 border-b">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="ml-4 text-sm text-gray-600">3days.ai - AI Employees</span>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0 relative">
                    {/* Simulated UI */}
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold">AI Employees</h2>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Users className="h-4 w-4 mr-2" />
                          Create New Employee
                        </Button>
                      </div>
                      
                      {/* Mock form */}
                      <div className="max-w-md space-y-4">
                        <div>
                          <label className="block text-sm font-medium mb-1">Employee Name</label>
                          <input 
                            type="text" 
                            placeholder="Enter employee name..." 
                            className="w-full p-2 border rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">Role</label>
                          <select className="w-full p-2 border rounded-md">
                            <option>Select a role...</option>
                            <option>Sales Assistant</option>
                            <option>Customer Support</option>
                            <option>Data Analyst</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-1">AI Model</label>
                          <select className="w-full p-2 border rounded-md">
                            <option>GPT-4 Turbo</option>
                            <option>Claude 3</option>
                            <option>Custom Model</option>
                          </select>
                        </div>
                        <Button className="w-full">
                          Create AI Employee
                        </Button>
                      </div>
                    </div>

                    {/* Animated Cursor */}
                    {isRunning && (
                      <div 
                        className="absolute pointer-events-none transition-all duration-100 ease-out z-50"
                        style={{
                          left: `${cursorPosition.x}px`,
                          top: `${cursorPosition.y}px`,
                          transform: 'translate(-50%, -50%)'
                        }}
                      >
                        <Mouse className="h-6 w-6 text-blue-600 drop-shadow-lg" />
                      </div>
                    )}

                    {/* Current Step Indicator */}
                    {isRunning && currentStep < aiEmployeeSteps.length && (
                      <div className="absolute top-4 right-4 bg-blue-600 text-white p-3 rounded-lg shadow-lg max-w-xs">
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <span className="font-medium">Step {currentStep + 1}</span>
                        </div>
                        <p className="text-sm mt-1">{aiEmployeeSteps[currentStep].description}</p>
                      </div>
                    )}

                    {/* Completion Message */}
                    {activeDemo && !isRunning && demoProgress === 100 && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-md">
                          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                          <h3 className="text-xl font-semibold mb-2">Demo Complete!</h3>
                          <p className="text-gray-600 mb-4">
                            You've successfully learned how to set up an AI employee. 
                            Ready to try it for real?
                          </p>
                          <div className="flex space-x-2">
                            <Button onClick={() => navigate('/ai-employees')} className="flex-1">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Try Now
                            </Button>
                            <Button onClick={resetDemo} variant="outline" className="flex-1">
                              Watch Again
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Steps List for Active Demo */}
              {activeDemo === 'ai-employee-setup' && (
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Demo Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {aiEmployeeSteps.map((step, index) => (
                        <div 
                          key={step.id}
                          className={`flex items-center space-x-3 p-3 rounded-lg ${
                            index < currentStep ? 'bg-green-50 border border-green-200' :
                            index === currentStep && isRunning ? 'bg-blue-50 border border-blue-200' :
                            'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          {index < currentStep ? (
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                          ) : index === currentStep && isRunning ? (
                            <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                          ) : (
                            <div className="h-5 w-5 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
                          )}
                          <div>
                            <h4 className="font-medium">{step.title}</h4>
                            <p className="text-sm text-gray-600">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Demos;
