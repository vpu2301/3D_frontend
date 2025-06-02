
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import CreateAssistantDialog from '@/components/CreateAssistantDialog';
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
  Zap,
  Clock
} from 'lucide-react';

const Demos = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const [demoProgress, setDemoProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
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
      title: "Open Create Assistant Dialog",
      description: "Click the 'Create New Assistant' button to start",
      action: "dialog-open",
      duration: 2000
    },
    {
      id: 2,
      title: "Enter Basic Information",
      description: "Fill in assistant name and description",
      action: "form-fill",
      duration: 3000
    },
    {
      id: 3,
      title: "Select Type & Department",
      description: "Choose assistant type and department",
      action: "selection",
      duration: 2500
    },
    {
      id: 4,
      title: "Configure Capabilities",
      description: "Select what the assistant can do",
      action: "capabilities",
      duration: 3000
    },
    {
      id: 5,
      title: "Set Autonomy Level",
      description: "Define decision-making boundaries",
      action: "autonomy",
      duration: 2500
    },
    {
      id: 6,
      title: "Connect Integrations",
      description: "Choose tools and services to connect",
      action: "integrations",
      duration: 2000
    },
    {
      id: 7,
      title: "Configure Approval Rules",
      description: "Set up decision and approval workflows",
      action: "approvals",
      duration: 2500
    },
    {
      id: 8,
      title: "Review & Create",
      description: "Review settings and create the assistant",
      action: "create",
      duration: 2000
    }
  ];

  const runAIEmployeeDemo = async () => {
    setActiveDemo('ai-employee-setup');
    setIsRunning(true);
    setCurrentStep(0);
    setDemoProgress(0);

    // Open the create dialog
    setShowCreateDialog(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    for (let i = 0; i < aiEmployeeSteps.length; i++) {
      setCurrentStep(i);
      const step = aiEmployeeSteps[i];
      
      // Wait for step duration
      await new Promise(resolve => setTimeout(resolve, step.duration));
      
      // Update progress
      setDemoProgress(((i + 1) / aiEmployeeSteps.length) * 100);
    }

    // Close dialog and complete demo
    setTimeout(() => {
      setShowCreateDialog(false);
      setIsRunning(false);
    }, 1000);
  };

  const resetDemo = () => {
    setActiveDemo(null);
    setIsRunning(false);
    setCurrentStep(0);
    setDemoProgress(0);
    setCursorPosition({ x: 0, y: 0 });
    setShowCreateDialog(false);
  };

  const handleAssistantCreated = (assistant: any) => {
    // Handle the created assistant (demo purposes)
    console.log('Demo assistant created:', assistant);
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

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Demo Cards - Left Side */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Demo Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            <span className="text-sm text-gray-500 flex items-center">
                              <Clock className="h-4 w-4 mr-1" />
                              {demo.duration}
                            </span>
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

                  {/* Active Demo Info */}
                  {activeDemo && (
                    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="flex items-center text-blue-800">
                              <Zap className="h-5 w-5 mr-2" />
                              AI Employee Setup Demo
                            </CardTitle>
                            <p className="text-blue-600 mt-1">Follow along as we create your first AI employee</p>
                          </div>
                          <Button 
                            onClick={resetDemo} 
                            variant="outline"
                            disabled={isRunning}
                            size="sm"
                          >
                            <RotateCcw className="h-4 w-4 mr-2" />
                            Reset
                          </Button>
                        </div>
                      </CardHeader>
                    </Card>
                  )}
                </div>

                {/* Progress Panel - Right Side */}
                {activeDemo && (
                  <div className="lg:col-span-1">
                    <Card className="sticky top-6">
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center">
                          <Settings className="h-5 w-5 mr-2" />
                          Demo Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {/* Overall Progress */}
                        <div>
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Overall Progress</span>
                            <span>{Math.round(demoProgress)}%</span>
                          </div>
                          <Progress value={demoProgress} className="h-2" />
                        </div>

                        {/* Current Step */}
                        {isRunning && currentStep < aiEmployeeSteps.length && (
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                              <span className="font-medium text-blue-800">
                                Step {currentStep + 1} of {aiEmployeeSteps.length}
                              </span>
                            </div>
                            <h4 className="font-semibold text-blue-900 mb-1">
                              {aiEmployeeSteps[currentStep].title}
                            </h4>
                            <p className="text-sm text-blue-700">
                              {aiEmployeeSteps[currentStep].description}
                            </p>
                          </div>
                        )}

                        {/* Steps List */}
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900 mb-3">All Steps</h4>
                          {aiEmployeeSteps.map((step, index) => (
                            <div 
                              key={step.id}
                              className={`flex items-center space-x-3 p-2 rounded-lg transition-all ${
                                index < currentStep ? 'bg-green-50 border border-green-200' :
                                index === currentStep && isRunning ? 'bg-blue-50 border border-blue-200' :
                                'bg-gray-50'
                              }`}
                            >
                              {index < currentStep ? (
                                <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                              ) : index === currentStep && isRunning ? (
                                <div className="h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin flex-shrink-0"></div>
                              ) : (
                                <div className="h-4 w-4 border-2 border-gray-300 rounded-full flex-shrink-0"></div>
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">{step.title}</p>
                                <p className="text-xs text-gray-500 truncate">{step.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Demo Complete */}
                        {activeDemo && !isRunning && demoProgress === 100 && (
                          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                            <h3 className="font-semibold text-green-800 mb-1">Demo Complete!</h3>
                            <p className="text-sm text-green-600 mb-3">
                              Ready to create your own AI employee?
                            </p>
                            <div className="space-y-2">
                              <Button 
                                onClick={() => navigate('/ai-employees')} 
                                size="sm"
                                className="w-full"
                              >
                                <ArrowRight className="h-4 w-4 mr-2" />
                                Try Now
                              </Button>
                              <Button 
                                onClick={resetDemo} 
                                variant="outline" 
                                size="sm"
                                className="w-full"
                              >
                                Watch Again
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>

      {/* Create Assistant Dialog */}
      <CreateAssistantDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onAssistantCreated={handleAssistantCreated}
      />
    </div>
  );
};

export default Demos;
