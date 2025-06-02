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
  const [showCursor, setShowCursor] = useState(false);
  const [currentAction, setCurrentAction] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [isTransitioning, setIsTransitioning] = useState(false);

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
      duration: 2000,
      cursorTarget: { x: 400, y: 300 },
      actionText: "Clicking 'Create New Assistant'"
    },
    {
      id: 2,
      title: "Enter Assistant Name",
      description: "Type the assistant name in the input field",
      action: "form-fill-name",
      duration: 3000,
      cursorTarget: { x: 350, y: 250 },
      actionText: "Typing assistant name",
      typeText: "Sales Assistant"
    },
    {
      id: 3,
      title: "Enter Description",
      description: "Fill in a detailed description",
      action: "form-fill-description",
      duration: 3500,
      cursorTarget: { x: 350, y: 320 },
      actionText: "Typing description",
      typeText: "An AI assistant that helps with sales tasks and customer management"
    },
    {
      id: 4,
      title: "Select Assistant Type",
      description: "Choose the type of assistant",
      action: "selection-type",
      duration: 2500,
      cursorTarget: { x: 300, y: 400 },
      actionText: "Selecting assistant type"
    },
    {
      id: 5,
      title: "Choose Department",
      description: "Select the department this assistant belongs to",
      action: "selection-department",
      duration: 2000,
      cursorTarget: { x: 400, y: 450 },
      actionText: "Choosing department"
    },
    {
      id: 6,
      title: "Configure Capabilities",
      description: "Select what the assistant can do",
      action: "capabilities",
      duration: 3000,
      cursorTarget: { x: 320, y: 500 },
      actionText: "Configuring capabilities"
    },
    {
      id: 7,
      title: "Set Autonomy Level",
      description: "Define decision-making boundaries",
      action: "autonomy",
      duration: 2500,
      cursorTarget: { x: 380, y: 550 },
      actionText: "Setting autonomy level"
    },
    {
      id: 8,
      title: "Connect Integrations",
      description: "Choose tools and services to connect",
      action: "integrations",
      duration: 2000,
      cursorTarget: { x: 360, y: 600 },
      actionText: "Connecting integrations"
    },
    {
      id: 9,
      title: "Configure Approval Rules",
      description: "Set up decision and approval workflows",
      action: "approvals",
      duration: 2500,
      cursorTarget: { x: 340, y: 650 },
      actionText: "Setting approval rules"
    },
    {
      id: 10,
      title: "Review & Create",
      description: "Review settings and create the assistant",
      action: "create",
      duration: 2000,
      cursorTarget: { x: 450, y: 700 },
      actionText: "Creating assistant"
    }
  ];

  const simulateCursorMovement = async (targetX: number, targetY: number, duration: number = 1000) => {
    return new Promise<void>((resolve) => {
      const startX = cursorPosition.x;
      const startY = cursorPosition.y;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth movement
        const easeInOut = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        const easedProgress = easeInOut(progress);
        
        const currentX = startX + (targetX - startX) * easedProgress;
        const currentY = startY + (targetY - startY) * easedProgress;
        
        setCursorPosition({ x: currentX, y: currentY });
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      
      animate();
    });
  };

  const simulateTyping = async (text: string, duration: number = 2000) => {
    return new Promise<void>((resolve) => {
      setIsTyping(true);
      setTypedText('');
      
      const chars = text.split('');
      const charDelay = duration / chars.length;
      
      let currentText = '';
      chars.forEach((char, index) => {
        setTimeout(() => {
          currentText += char;
          setTypedText(currentText);
          
          if (index === chars.length - 1) {
            setTimeout(() => {
              setIsTyping(false);
              resolve();
            }, 200);
          }
        }, charDelay * index);
      });
    });
  };

  const simulateClick = async () => {
    return new Promise<void>((resolve) => {
      setIsClicking(true);
      setTimeout(() => {
        setIsClicking(false);
        resolve();
      }, 200);
    });
  };

  const runAIEmployeeDemo = async () => {
    setActiveDemo('ai-employee-setup');
    setIsRunning(true);
    setCurrentStep(0);
    setDemoProgress(0);
    setShowCursor(true);
    setCursorPosition({ x: 100, y: 100 });

    // Open the create dialog first
    setShowCreateDialog(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    for (let i = 0; i < aiEmployeeSteps.length; i++) {
      setCurrentStep(i);
      const step = aiEmployeeSteps[i];
      setCurrentAction(step.actionText);
      
      // Move cursor to target
      if (step.cursorTarget) {
        await simulateCursorMovement(step.cursorTarget.x, step.cursorTarget.y, 800);
      }
      
      // Simulate click
      await simulateClick();
      
      // If this step involves typing, simulate it
      if (step.typeText) {
        await new Promise(resolve => setTimeout(resolve, 300)); // Brief pause after click
        await simulateTyping(step.typeText, Math.min(step.duration - 1000, 2000));
      }
      
      // Wait for remaining step duration
      const remainingTime = step.typeText ? 
        Math.max(step.duration - 2000, 500) : 
        Math.max(step.duration - 1000, 500);
      
      await new Promise(resolve => setTimeout(resolve, remainingTime));
      
      // Update progress
      setDemoProgress(((i + 1) / aiEmployeeSteps.length) * 100);
    }

    // Complete demo and transition
    setCurrentAction('Transitioning to AI Employees page');
    setIsTransitioning(true);
    
    // Wait a moment to show the completion
    setTimeout(() => {
      setShowCreateDialog(false);
      setIsRunning(false);
      setShowCursor(false);
      setCurrentAction('');
      setTypedText('');
      setIsTransitioning(false);
      
      // Navigate to AI Employees page after a brief pause
      setTimeout(() => {
        navigate('/ai-employees');
      }, 1500);
    }, 2000);
  };

  const resetDemo = () => {
    setActiveDemo(null);
    setIsRunning(false);
    setCurrentStep(0);
    setDemoProgress(0);
    setCursorPosition({ x: 0, y: 0 });
    setShowCreateDialog(false);
    setShowCursor(false);
    setCurrentAction('');
    setIsTyping(false);
    setIsClicking(false);
    setTypedText('');
    setIsTransitioning(false);
  };

  const handleAssistantCreated = (assistant: any) => {
    console.log('Demo assistant created:', assistant);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 relative">
      {/* Animated Cursor */}
      {showCursor && (
        <div
          className={`fixed z-[9999] pointer-events-none transition-all duration-100 ${
            isClicking ? 'scale-90' : 'scale-100'
          }`}
          style={{
            left: `${cursorPosition.x}px`,
            top: `${cursorPosition.y}px`,
            transform: 'translate(-4px, -4px)'
          }}
        >
          <Mouse 
            className={`h-6 w-6 text-blue-600 drop-shadow-lg ${
              isClicking ? 'text-blue-800' : ''
            }`} 
          />
          {isClicking && (
            <div className="absolute -top-1 -left-1 w-8 h-8 border-2 border-blue-400 rounded-full animate-ping opacity-75"></div>
          )}
        </div>
      )}

      {/* Action Indicator */}
      {currentAction && (
        <div 
          className="fixed z-[9998] bg-black text-white px-3 py-2 rounded-lg text-sm shadow-lg pointer-events-none"
          style={{
            left: `${cursorPosition.x + 20}px`,
            top: `${cursorPosition.y - 40}px`
          }}
        >
          <div className="flex items-center space-x-2">
            {isTyping ? (
              <>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>{currentAction}</span>
              </>
            ) : isTransitioning ? (
              <>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>{currentAction}</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>{currentAction}</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* Typing Display */}
      {isTyping && typedText && (
        <div 
          className="fixed z-[9997] bg-blue-50 border border-blue-200 px-3 py-2 rounded text-sm shadow-sm pointer-events-none"
          style={{
            left: `${cursorPosition.x + 10}px`,
            top: `${cursorPosition.y + 30}px`
          }}
        >
          <span className="text-blue-800">{typedText}</span>
          <span className="animate-pulse">|</span>
        </div>
      )}

      {/* Transition Overlay */}
      {isTransitioning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9990] flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 text-center shadow-xl">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Demo Complete!</h3>
            <p className="text-gray-600">Redirecting to AI Employees page...</p>
          </div>
        </div>
      )}

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
                              {isRunning && (
                                <div className="ml-2 flex items-center">
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-1"></div>
                                  <span className="text-sm font-normal">Live Demo Running</span>
                                </div>
                              )}
                            </CardTitle>
                            <p className="text-blue-600 mt-1">
                              {isRunning ? 'Watch the realistic simulation with cursor movements and typing' : 'Follow along as we create your first AI employee'}
                            </p>
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
                            <p className="text-sm text-blue-700 mb-2">
                              {aiEmployeeSteps[currentStep].description}
                            </p>
                            {currentAction && (
                              <div className="flex items-center space-x-2 text-xs text-blue-600">
                                <Mouse className="h-3 w-3" />
                                <span>{currentAction}</span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Transition Status */}
                        {isTransitioning && (
                          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                              <span className="font-medium text-purple-800">Demo Complete</span>
                            </div>
                            <h4 className="font-semibold text-purple-900 mb-1">Transitioning to AI Employees</h4>
                            <p className="text-sm text-purple-700">
                              Redirecting you to the actual AI Employees page...
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
                        {activeDemo && !isRunning && demoProgress === 100 && !isTransitioning && (
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
