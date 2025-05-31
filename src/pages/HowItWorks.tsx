
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Bot, Settings, Zap, CheckCircle, Play, Lightbulb, Target, Rocket } from 'lucide-react';

const HowItWorks = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

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

  const steps = [
    {
      step: 1,
      title: "Choose Your AI Employee",
      description: "Select from our library of pre-trained AI employees or create a custom one tailored to your specific needs.",
      icon: Bot,
      features: ["50+ ready-to-use templates", "Custom training available", "Department-specific specializations"],
      color: "from-blue-500 to-indigo-500"
    },
    {
      step: 2,
      title: "Configure & Train",
      description: "Set up your AI employee's capabilities, permissions, and workflows. Define what tasks they can handle autonomously.",
      icon: Settings,
      features: ["Drag-and-drop workflow builder", "Permission management", "Integration setup"],
      color: "from-green-500 to-emerald-500"
    },
    {
      step: 3,
      title: "Deploy & Automate",
      description: "Launch your AI employee and watch them handle tasks 24/7. Monitor performance and optimize as needed.",
      icon: Zap,
      features: ["Real-time monitoring", "Performance analytics", "Continuous learning"],
      color: "from-purple-500 to-pink-500"
    }
  ];

  const capabilities = [
    {
      category: "Customer Service",
      tasks: ["Answer customer inquiries", "Process support tickets", "Handle refunds and returns", "Escalate complex issues"],
      color: "bg-blue-100 text-blue-800",
      icon: Target
    },
    {
      category: "Sales & Marketing",
      tasks: ["Qualify leads", "Send follow-up emails", "Schedule meetings", "Update CRM records"],
      color: "bg-green-100 text-green-800",
      icon: Rocket
    },
    {
      category: "Data Processing",
      tasks: ["Extract data from documents", "Generate reports", "Analyze trends", "Update databases"],
      color: "bg-purple-100 text-purple-800",
      icon: Bot
    },
    {
      category: "HR & Operations",
      tasks: ["Screen resumes", "Schedule interviews", "Onboard new hires", "Process expense reports"],
      color: "bg-orange-100 text-orange-800",
      icon: Lightbulb
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            
            <main className="flex-1 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-light text-gray-900">How It Works</h1>
                <p className="text-gray-600">Transform your business operations in three simple steps</p>
              </div>

              {/* Demo Section */}
              <section className="mb-12">
                <Card className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white border-0">
                  <CardContent className="p-8 text-center">
                    <h2 className="text-2xl font-light mb-4">See It In Action</h2>
                    <p className="text-lg mb-6 opacity-90">
                      Watch how AI employees integrate seamlessly into your existing workflows
                    </p>
                    <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full">
                      <Play className="mr-2 h-5 w-5" />
                      Watch 2-Minute Demo
                    </Button>
                  </CardContent>
                </Card>
              </section>

              {/* Steps Section */}
              <section className="mb-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-light text-gray-900 mb-4">Three Steps to AI Automation</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    Get started in minutes, not months
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {steps.map((step) => (
                    <Card key={step.step} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                      <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                          <div className={`p-4 rounded-2xl bg-gradient-to-r ${step.color} w-fit`}>
                            <step.icon className="h-8 w-8 text-white" />
                          </div>
                        </div>
                        <div className="bg-gray-900 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mx-auto mb-2">
                          {step.step}
                        </div>
                        <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <p className="text-gray-600 mb-6">{step.description}</p>
                        <div className="space-y-2">
                          {step.features.map((feature, index) => (
                            <div key={index} className="flex items-center justify-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Capabilities Section */}
              <section className="mb-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-light text-gray-900 mb-4">What Can AI Employees Do?</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">
                    From simple tasks to complex workflows, our AI handles it all
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {capabilities.map((capability, index) => (
                    <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <div className="p-2 rounded-lg bg-gray-100 mr-3">
                            <capability.icon className="h-5 w-5 text-gray-600" />
                          </div>
                          {capability.category}
                          <Badge className={`ml-auto ${capability.color} border-0`}>
                            {capability.tasks.length} tasks
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {capability.tasks.map((task, taskIndex) => (
                            <div key={taskIndex} className="flex items-center text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                              <span className="text-gray-700">{task}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Benefits Section */}
              <section className="mb-12">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-light text-gray-900 mb-4">Why Businesses Choose 3days.ai</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="text-center border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-blue-600">80%</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Time Saved</h3>
                      <p className="text-gray-600 text-sm">Automate repetitive tasks and focus on high-value work</p>
                    </CardContent>
                  </Card>

                  <Card className="text-center border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-green-600">24/7</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Always Working</h3>
                      <p className="text-gray-600 text-sm">AI employees never sleep, take breaks, or call in sick</p>
                    </CardContent>
                  </Card>

                  <Card className="text-center border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="bg-purple-100 p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl font-bold text-purple-600">ROI</span>
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Immediate ROI</h3>
                      <p className="text-gray-600 text-sm">See returns from day one with our quick setup process</p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* CTA Section */}
              <section className="text-center">
                <Card className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white border-0">
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-light mb-4">Ready to Get Started?</h2>
                    <p className="text-lg mb-6 opacity-90 font-light">
                      Join thousands of companies that are already transforming their operations with AI employees.
                    </p>
                    <div className="space-x-4">
                      <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full">
                        Start Free Trial
                      </Button>
                      <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-gray-900 rounded-full">
                        Schedule Demo
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </section>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default HowItWorks;
