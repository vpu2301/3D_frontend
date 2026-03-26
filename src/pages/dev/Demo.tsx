
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Mail, 
  Phone, 
  Calendar, 
  Database, 
  BarChart3, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  User, 
  Building, 
  DollarSign, 
  TrendingUp,
  Search,
  Filter,
  MessageSquare,
  FileText,
  Globe,
  Zap,
  Target,
  Users,
  Bot,
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

const Demo = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [currentSubStep, setCurrentSubStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [activeIntegrations, setActiveIntegrations] = useState<string[]>([]);

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

  const salesProcess = [
    {
      id: 1,
      title: "Lead Discovery & Intelligence Gathering",
      description: "Emma scans multiple data sources and applies AI-powered qualification",
      icon: Search,
      duration: "3 minutes",
      color: "bg-blue-500",
      subSteps: [
        { id: "1.1", task: "Scanning LinkedIn Sales Navigator", status: "pending", integration: "LinkedIn", duration: 45 },
        { id: "1.2", task: "Processing web form submissions", status: "pending", integration: "Website", duration: 30 },
        { id: "1.3", task: "Analyzing referral database", status: "pending", integration: "CRM", duration: 25 },
        { id: "1.4", task: "Running AI qualification scoring", status: "pending", integration: "AI Engine", duration: 60 },
        { id: "1.5", task: "Cross-referencing company data", status: "pending", integration: "ZoomInfo", duration: 40 }
      ]
    },
    {
      id: 2,
      title: "Intelligent Lead Enrichment",
      description: "Deep data enrichment and behavioral analysis of qualified prospects",
      icon: Database,
      duration: "2 minutes",
      color: "bg-purple-500",
      subSteps: [
        { id: "2.1", task: "Enriching contact information", status: "pending", integration: "Apollo", duration: 35 },
        { id: "2.2", task: "Analyzing social media presence", status: "pending", integration: "Twitter API", duration: 40 },
        { id: "2.3", task: "Researching company financials", status: "pending", integration: "Crunchbase", duration: 50 },
        { id: "2.4", task: "Tracking website behavior", status: "pending", integration: "HubSpot", duration: 30 },
        { id: "2.5", task: "Generating personality insights", status: "pending", integration: "Crystal", duration: 25 }
      ]
    },
    {
      id: 3,
      title: "Hyper-Personalized Outreach Campaign",
      description: "AI-crafted personalized messages across multiple channels",
      icon: MessageSquare,
      duration: "4 minutes",
      color: "bg-green-500",
      subSteps: [
        { id: "3.1", task: "Crafting personalized email sequences", status: "pending", integration: "OpenAI GPT-4", duration: 60 },
        { id: "3.2", task: "Creating LinkedIn connection messages", status: "pending", integration: "LinkedIn", duration: 45 },
        { id: "3.3", task: "Scheduling SMS follow-ups", status: "pending", integration: "Twilio", duration: 30 },
        { id: "3.4", task: "Setting up retargeting campaigns", status: "pending", integration: "Facebook Ads", duration: 55 },
        { id: "3.5", task: "Deploying email sequences", status: "pending", integration: "Mailchimp", duration: 40 },
        { id: "3.6", task: "Activating social selling automation", status: "pending", integration: "Outreach", duration: 35 }
      ]
    },
    {
      id: 4,
      title: "Multi-Channel Engagement Tracking",
      description: "Real-time monitoring and response optimization across all touchpoints",
      icon: BarChart3,
      duration: "2.5 minutes",
      color: "bg-[#5c939f]",
      subSteps: [
        { id: "4.1", task: "Monitoring email engagement rates", status: "pending", integration: "SendGrid", duration: 35 },
        { id: "4.2", task: "Tracking LinkedIn message responses", status: "pending", integration: "LinkedIn", duration: 40 },
        { id: "4.3", task: "Analyzing website visit patterns", status: "pending", integration: "Google Analytics", duration: 45 },
        { id: "4.4", task: "Processing chatbot interactions", status: "pending", integration: "Intercom", duration: 30 },
        { id: "4.5", task: "Optimizing message timing", status: "pending", integration: "AI Engine", duration: 40 }
      ]
    },
    {
      id: 5,
      title: "Intelligent Meeting Coordination",
      description: "Automated scheduling with preparation and follow-up workflows",
      icon: Calendar,
      duration: "3 minutes",
      color: "bg-pink-500",
      subSteps: [
        { id: "5.1", task: "Identifying interested prospects", status: "pending", integration: "CRM", duration: 25 },
        { id: "5.2", task: "Checking calendar availability", status: "pending", integration: "Google Calendar", duration: 20 },
        { id: "5.3", task: "Sending meeting invitations", status: "pending", integration: "Calendly", duration: 35 },
        { id: "5.4", task: "Preparing meeting briefs", status: "pending", integration: "OpenAI", duration: 50 },
        { id: "5.5", task: "Setting up Zoom rooms", status: "pending", integration: "Zoom", duration: 15 },
        { id: "5.6", task: "Creating follow-up sequences", status: "pending", integration: "HubSpot", duration: 45 }
      ]
    },
    {
      id: 6,
      title: "Advanced CRM Synchronization",
      description: "Comprehensive data integration and pipeline management",
      icon: Settings,
      duration: "2 minutes",
      color: "bg-indigo-500",
      subSteps: [
        { id: "6.1", task: "Updating contact records", status: "pending", integration: "Salesforce", duration: 40 },
        { id: "6.2", task: "Creating opportunity pipelines", status: "pending", integration: "Pipedrive", duration: 35 },
        { id: "6.3", task: "Logging interaction history", status: "pending", integration: "HubSpot", duration: 30 },
        { id: "6.4", task: "Setting task reminders", status: "pending", integration: "Monday.com", duration: 25 },
        { id: "6.5", task: "Updating deal probabilities", status: "pending", integration: "AI Engine", duration: 30 }
      ]
    },
    {
      id: 7,
      title: "Predictive Analytics & Reporting",
      description: "AI-driven insights and forecasting with actionable recommendations",
      icon: TrendingUp,
      duration: "2.5 minutes",
      color: "bg-red-500",
      subSteps: [
        { id: "7.1", task: "Generating conversion predictions", status: "pending", integration: "TensorFlow", duration: 55 },
        { id: "7.2", task: "Creating performance dashboards", status: "pending", integration: "Tableau", duration: 40 },
        { id: "7.3", task: "Analyzing ROI metrics", status: "pending", integration: "Excel API", duration: 35 },
        { id: "7.4", task: "Identifying optimization opportunities", status: "pending", integration: "AI Engine", duration: 45 },
        { id: "7.5", task: "Scheduling executive reports", status: "pending", integration: "Slack", duration: 25 }
      ]
    }
  ];

  const integrations = [
    "LinkedIn", "Website", "CRM", "AI Engine", "ZoomInfo", "Apollo", "Twitter API", 
    "Crunchbase", "HubSpot", "Crystal", "OpenAI GPT-4", "Twilio", "Facebook Ads", 
    "Mailchimp", "Outreach", "SendGrid", "Google Analytics", "Intercom", 
    "Google Calendar", "Calendly", "Zoom", "Salesforce", "Pipedrive", 
    "Monday.com", "TensorFlow", "Tableau", "Excel API", "Slack"
  ];

  const metrics = [
    { label: "Leads Processed", value: "847", change: "+23%", icon: User },
    { label: "Emails Sent", value: "156", change: "+18%", icon: Mail },
    { label: "Meetings Scheduled", value: "24", change: "+45%", icon: Calendar },
    { label: "Pipeline Value", value: "$487K", change: "+67%", icon: DollarSign },
    { label: "Conversion Rate", value: "34.7%", change: "+12%", icon: Target },
    { label: "Response Rate", value: "68.3%", change: "+28%", icon: TrendingUp }
  ];

  const runDemo = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setCurrentSubStep(0);
    setCompletedTasks([]);
    setActiveIntegrations([]);

    for (let stepIndex = 0; stepIndex < salesProcess.length; stepIndex++) {
      setCurrentStep(stepIndex);
      const currentStepData = salesProcess[stepIndex];
      
      for (let subStepIndex = 0; subStepIndex < currentStepData.subSteps.length; subStepIndex++) {
        setCurrentSubStep(subStepIndex);
        const subStep = currentStepData.subSteps[subStepIndex];
        
        // Activate integration
        setActiveIntegrations(prev => [...prev, subStep.integration]);
        
        // Wait for sub-step duration
        await new Promise(resolve => setTimeout(resolve, subStep.duration * 20)); // Speed up for demo
        
        // Mark sub-step as completed
        setCompletedTasks(prev => [...prev, subStep.id]);
      }
    }

    setIsRunning(false);
    setCurrentStep(salesProcess.length);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setCurrentSubStep(0);
    setCompletedTasks([]);
    setActiveIntegrations([]);
    setIsRunning(false);
  };

  const getCurrentSubStep = () => {
    if (currentStep < salesProcess.length) {
      return salesProcess[currentStep]?.subSteps[currentSubStep];
    }
    return null;
  };

  const getStepProgress = (stepIndex: number) => {
    const step = salesProcess[stepIndex];
    const completedSubSteps = step.subSteps.filter(subStep => 
      completedTasks.includes(subStep.id)
    ).length;
    return (completedSubSteps / step.subSteps.length) * 100;
  };

  const totalProgress = () => {
    const totalSubSteps = salesProcess.reduce((acc, step) => acc + step.subSteps.length, 0);
    return (completedTasks.length / totalSubSteps) * 100;
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
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced AI Sales Automation Demo</h1>
                <p className="text-gray-600">Watch Emma execute a complete end-to-end sales process with 29 integrations</p>
              </div>

              {/* Emma Profile */}
              <Card className="mb-6 border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <img 
                          src="/lovable-uploads/5888447c-4ba4-4923-bd8b-116a4908a301.png" 
                          alt="Emma - AI Sales Coordinator"
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">Emma - AI Sales Coordinator</h2>
                        <Badge variant="outline" className="border-green-500 text-green-700">
                          {isRunning ? 'Processing' : 'Ready'}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        onClick={runDemo} 
                        disabled={isRunning}
                        className="bg-pink-600 hover:bg-pink-700 text-white"
                      >
                        {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                        {isRunning ? 'Running' : 'Start Demo'}
                      </Button>
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
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Overall Progress</span>
                        <span>{Math.round(totalProgress())}%</span>
                      </div>
                      <Progress value={totalProgress()} className="h-2" />
                    </div>
                  )}
                </CardHeader>
              </Card>

              {/* Split Dashboard */}
              <ResizablePanelGroup direction="horizontal" className="min-h-[600px] rounded-lg border">
                {/* Left Panel - Process Overview */}
                <ResizablePanel defaultSize={50}>
                  <div className="p-6 h-full">
                    <h3 className="text-lg font-semibold mb-4">Sales Process Overview</h3>
                    <div className="space-y-4">
                      {salesProcess.map((step, index) => (
                        <Card 
                          key={step.id}
                          className={`transition-all duration-300 ${
                            completedTasks.filter(task => task.startsWith(`${index + 1}.`)).length === step.subSteps.length
                              ? 'border-green-500 bg-green-50' 
                              : currentStep === index && isRunning 
                              ? 'border-pink-500 bg-pink-50 shadow-lg' 
                              : 'border-gray-200'
                          }`}
                        >
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${step.color}`}>
                                  <step.icon className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900">{step.title}</h4>
                                  <p className="text-sm text-gray-600">{step.description}</p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {step.duration}
                              </Badge>
                            </div>
                            {(currentStep >= index || completedTasks.some(task => task.startsWith(`${index + 1}.`))) && (
                              <div className="mt-3">
                                <Progress value={getStepProgress(index)} className="h-1" />
                                <div className="text-xs text-gray-500 mt-1">
                                  {completedTasks.filter(task => task.startsWith(`${index + 1}.`)).length} / {step.subSteps.length} tasks completed
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Right Panel - Detailed Steps */}
                <ResizablePanel defaultSize={50}>
                  <div className="p-6 h-full overflow-auto">
                    <h3 className="text-lg font-semibold mb-4">Real-Time Execution Details</h3>
                    
                    {/* Current Task */}
                    {isRunning && getCurrentSubStep() && (
                      <Card className="mb-4 border-pink-500 bg-pink-50">
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="animate-spin">
                              <Zap className="h-5 w-5 text-pink-600" />
                            </div>
                            <div>
                              <h4 className="font-medium text-pink-800">Currently Processing</h4>
                              <p className="text-sm text-pink-600">{getCurrentSubStep()?.task}</p>
                              <Badge className="mt-1 bg-pink-600">
                                {getCurrentSubStep()?.integration}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Detailed Steps Accordion */}
                    <Accordion type="multiple" className="w-full">
                      {salesProcess.map((step, stepIndex) => (
                        <AccordionItem key={step.id} value={`step-${stepIndex}`}>
                          <AccordionTrigger className="text-left">
                            <div className="flex items-center space-x-3">
                              <div className={`p-1 rounded ${step.color}`}>
                                <step.icon className="h-3 w-3 text-white" />
                              </div>
                              <span>{step.title}</span>
                              {completedTasks.filter(task => task.startsWith(`${stepIndex + 1}.`)).length === step.subSteps.length && (
                                <CheckCircle className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-2 pl-6">
                              {step.subSteps.map((subStep, subIndex) => (
                                <div 
                                  key={subStep.id}
                                  className={`flex items-center justify-between p-2 rounded-lg ${
                                    completedTasks.includes(subStep.id)
                                      ? 'bg-green-100 border border-green-200'
                                      : currentStep === stepIndex && currentSubStep === subIndex && isRunning
                                      ? 'bg-pink-100 border border-pink-200'
                                      : 'bg-gray-50'
                                  }`}
                                >
                                  <div className="flex items-center space-x-2">
                                    {completedTasks.includes(subStep.id) ? (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : currentStep === stepIndex && currentSubStep === subIndex && isRunning ? (
                                      <Clock className="h-4 w-4 text-pink-500 animate-pulse" />
                                    ) : (
                                      <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                                    )}
                                    <span className="text-sm">{subStep.task}</span>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {subStep.integration}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>

                    {/* Active Integrations */}
                    {activeIntegrations.length > 0 && (
                      <Card className="mt-4">
                        <CardHeader>
                          <CardTitle className="text-sm">Active Integrations ({activeIntegrations.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-wrap gap-1">
                            {[...new Set(activeIntegrations)].map((integration) => (
                              <Badge key={integration} variant="secondary" className="text-xs">
                                {integration}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>

              {/* Results Metrics */}
              {completedTasks.length === salesProcess.reduce((acc, step) => acc + step.subSteps.length, 0) && (
                <Card className="mt-6 border-green-500 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-800">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Demo Complete - Emma's Performance Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                      {metrics.map((metric, index) => (
                        <div key={index} className="text-center">
                          <div className="flex justify-center mb-2">
                            <div className="p-2 bg-green-500 rounded-full">
                              <metric.icon className="h-4 w-4 text-white" />
                            </div>
                          </div>
                          <div className="text-lg font-bold text-green-800">{metric.value}</div>
                          <div className="text-xs text-green-600">{metric.label}</div>
                          <div className="text-xs text-green-500">{metric.change}</div>
                        </div>
                      ))}
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Executive Summary</h4>
                      <p className="text-green-700 text-sm">
                        Emma successfully executed a comprehensive 7-stage sales automation process involving 29 integrations, 
                        processing 847 leads, orchestrating 156 personalized outreach campaigns, and scheduling 24 high-value meetings. 
                        Total pipeline value generated: $487,000 with a 34.7% conversion rate - all completed autonomously in under 19 minutes.
                      </p>
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

export default Demo;
