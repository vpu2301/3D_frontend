
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Mail, Phone, Calendar, Database, BarChart3, CheckCircle, Clock, ArrowRight, User, Building, DollarSign, TrendingUp } from 'lucide-react';

const Demo = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<number[]>([]);

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

  const demoScenario = [
    {
      id: 1,
      title: "Lead Discovery & Qualification",
      description: "Emma identifies and qualifies new prospects from multiple sources",
      icon: User,
      details: [
        "Scanned 500+ leads from LinkedIn, web forms, and referrals",
        "Qualified 45 high-potential prospects using AI scoring",
        "Prioritized leads based on company size, budget, and timeline"
      ],
      duration: "2 minutes"
    },
    {
      id: 2,
      title: "Automated Email Outreach",
      description: "Personalized email campaigns sent to qualified leads",
      icon: Mail,
      details: [
        "Composed 45 personalized email sequences",
        "A/B tested subject lines for optimal open rates",
        "Scheduled follow-up emails based on engagement"
      ],
      duration: "1 minute"
    },
    {
      id: 3,
      title: "Meeting Scheduling",
      description: "Coordinates and schedules meetings with interested prospects",
      icon: Calendar,
      details: [
        "Received 12 positive responses from email campaign",
        "Automatically scheduled 8 demo meetings",
        "Sent calendar invites with meeting preparation materials"
      ],
      duration: "30 seconds"
    },
    {
      id: 4,
      title: "CRM Updates",
      description: "Updates customer relationship management system with all interactions",
      icon: Database,
      details: [
        "Updated 45 lead records with interaction history",
        "Created 8 new opportunities in sales pipeline",
        "Tagged prospects with relevant categories and notes"
      ],
      duration: "15 seconds"
    },
    {
      id: 5,
      title: "Sales Report Generation",
      description: "Generates comprehensive sales performance and pipeline reports",
      icon: BarChart3,
      details: [
        "Generated weekly sales pipeline report",
        "Analyzed conversion rates and identified trends",
        "Created actionable insights for sales team"
      ],
      duration: "45 seconds"
    }
  ];

  const metrics = [
    { label: "Leads Processed", value: "500+", icon: User },
    { label: "Emails Sent", value: "45", icon: Mail },
    { label: "Meetings Scheduled", value: "8", icon: Calendar },
    { label: "Pipeline Value", value: "$125K", icon: DollarSign }
  ];

  const runDemo = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    setCompletedTasks([]);

    for (let i = 0; i < demoScenario.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate task duration
      setCompletedTasks(prev => [...prev, i]);
    }

    setIsRunning(false);
    setCurrentStep(demoScenario.length);
  };

  const resetDemo = () => {
    setCurrentStep(0);
    setCompletedTasks([]);
    setIsRunning(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            
            <main className="flex-1 p-6">
              <div className="mb-8">
                <h1 className="text-3xl font-light text-gray-900 mb-2">AI Sales Coordinator Demo</h1>
                <p className="text-gray-600">Experience Emma's autonomous sales management capabilities</p>
              </div>

              {/* Emma Profile Card */}
              <Card className="mb-8 border-pink-200 bg-gradient-to-r from-pink-50 to-rose-50">
                <CardHeader className="pb-4">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <img 
                        src="/lovable-uploads/5888447c-4ba4-4923-bd8b-116a4908a301.png" 
                        alt="Emma - AI Sales Specialist"
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">Emma</h2>
                      <p className="text-pink-600 font-medium">AI Sales Coordinator</p>
                      <Badge variant="outline" className="mt-1 border-green-500 text-green-700">
                        Active & Ready
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Control Panel */}
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Demo Control Panel
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4 mb-6">
                    <Button 
                      onClick={runDemo} 
                      disabled={isRunning}
                      className="bg-pink-600 hover:bg-pink-700 text-white"
                    >
                      {isRunning ? 'Running Demo...' : 'Start Sales Demo'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={resetDemo} 
                      variant="outline"
                      disabled={isRunning}
                    >
                      Reset Demo
                    </Button>
                  </div>
                  
                  {isRunning && (
                    <div className="mb-4">
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>Demo Progress</span>
                        <span>{Math.round((completedTasks.length / demoScenario.length) * 100)}%</span>
                      </div>
                      <Progress value={(completedTasks.length / demoScenario.length) * 100} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Scenario Steps */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {demoScenario.map((step, index) => (
                  <Card 
                    key={step.id} 
                    className={`transition-all duration-300 ${
                      completedTasks.includes(index) 
                        ? 'border-green-500 bg-green-50' 
                        : currentStep === index && isRunning 
                        ? 'border-pink-500 bg-pink-50 shadow-lg' 
                        : 'border-gray-200'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            completedTasks.includes(index) 
                              ? 'bg-green-500' 
                              : currentStep === index && isRunning 
                              ? 'bg-pink-500' 
                              : 'bg-gray-400'
                          }`}>
                            {completedTasks.includes(index) ? (
                              <CheckCircle className="h-5 w-5 text-white" />
                            ) : (
                              <step.icon className="h-5 w-5 text-white" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{step.title}</h3>
                            <p className="text-sm text-gray-600">{step.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {currentStep === index && isRunning && (
                            <div className="flex items-center text-pink-600">
                              <Clock className="h-4 w-4 mr-1" />
                              <span className="text-sm font-medium">Processing...</span>
                            </div>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {step.duration}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {step.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start space-x-2 text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Results Metrics */}
              {completedTasks.length === demoScenario.length && (
                <Card className="border-green-500 bg-green-50">
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-800">
                      <TrendingUp className="h-5 w-5 mr-2" />
                      Demo Results - Emma's Performance
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {metrics.map((metric, index) => (
                        <div key={index} className="text-center">
                          <div className="flex justify-center mb-2">
                            <div className="p-3 bg-green-500 rounded-full">
                              <metric.icon className="h-6 w-6 text-white" />
                            </div>
                          </div>
                          <div className="text-2xl font-bold text-green-800">{metric.value}</div>
                          <div className="text-sm text-green-600">{metric.label}</div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 p-4 bg-white rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-800 mb-2">Summary</h4>
                      <p className="text-green-700">
                        Emma successfully processed 500+ leads, sent 45 personalized emails, scheduled 8 high-value meetings, 
                        updated all CRM records, and generated comprehensive sales reports—all autonomously in under 5 minutes. 
                        Total pipeline value created: $125,000.
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
