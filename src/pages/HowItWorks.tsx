
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Bot, Settings, Zap, CheckCircle, Play, Lightbulb, Target, Rocket } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      title: "Choose Your AI Employee",
      description: "Select from our library of pre-trained AI employees or create a custom one tailored to your specific needs.",
      icon: Bot,
      features: ["50+ ready-to-use templates", "Custom training available", "Department-specific specializations"],
      color: "from-[color:var(--blue)] to-[color:var(--blue)]"
    },
    {
      step: 2,
      title: "Configure & Train",
      description: "Set up your AI employee's capabilities, permissions, and workflows. Define what tasks they can handle autonomously.",
      icon: Settings,
      features: ["Drag-and-drop workflow builder", "Permission management", "Integration setup"],
      color: "from-[color:var(--blue)] to-[color:var(--blue)]"
    },
    {
      step: 3,
      title: "Deploy & Automate",
      description: "Launch your AI employee and watch them handle tasks 24/7. Monitor performance and optimize as needed.",
      icon: Zap,
      features: ["Real-time monitoring", "Performance analytics", "Continuous learning"],
      color: "from-[color:var(--blue)] to-[color:var(--text-2)]"
    }
  ];

  const capabilities = [
    {
      category: "Customer Service",
      tasks: ["Answer customer inquiries", "Process support tickets", "Handle refunds and returns", "Escalate complex issues"],
      color: "bg-[color:var(--blue-100)] text-[color:var(--blue)]",
      icon: Target
    },
    {
      category: "Sales & Marketing",
      tasks: ["Qualify leads", "Send follow-up emails", "Schedule meetings", "Update CRM records"],
      color: "bg-[color:var(--blue-100)] text-[color:var(--blue)]",
      icon: Rocket
    },
    {
      category: "Data Processing",
      tasks: ["Extract data from documents", "Generate reports", "Analyze trends", "Update databases"],
      color: "bg-[color:var(--blue-100)] text-[color:var(--blue)]",
      icon: Bot
    },
    {
      category: "HR & Operations",
      tasks: ["Screen resumes", "Schedule interviews", "Onboard new hires", "Process expense reports"],
      color: "bg-[color:var(--ink)] text-[color:var(--blue)]",
      icon: Lightbulb
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[color:var(--sand)] via-[color:var(--paper)] to-[color:var(--blue-100)] dark:from-[color:var(--bg)] dark:via-[color:var(--paper)] dark:to-[color:var(--paper)]">
      <main className="pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[color:var(--ink)]">How It Works</h1>
            <p className="text-[color:var(--text-2)]">Transform your business operations in three simple steps</p>
          </div>

          {/* Demo Section */}
          <section className="mb-12">
            <Card className="bg-gradient-to-r from-[color:var(--blue)] via-[color:var(--blue)] to-[color:var(--text-2)] text-white border-0">
              <CardContent className="p-8 text-center">
                <h2 className="text-2xl font-light mb-4">See It In Action</h2>
                <p className="text-lg mb-6 opacity-90">
                  Watch how AI employees integrate seamlessly into your existing workflows
                </p>
                <Button size="lg" className="bg-[color:var(--paper)] text-[color:var(--ink)] hover:bg-[color:var(--sand)] rounded-full">
                  <Play className="mr-2 h-5 w-5" />
                  Watch 2-Minute Demo
                </Button>
              </CardContent>
            </Card>
          </section>

          {/* Steps Section */}
          <section className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-light text-[color:var(--ink)] mb-4">Three Steps to AI Automation</h2>
              <p className="text-[color:var(--text-2)] max-w-2xl mx-auto">
                Get started in minutes, not months
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {steps.map((step) => (
                <Card key={step.step} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                      <div className={`p-4 rounded-[28px] bg-gradient-to-r ${step.color} w-fit`}>
                        <step.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="bg-[color:var(--sand)] text-[color:var(--ink)] rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm mx-auto mb-2">
                      {step.step}
                    </div>
                    <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <p className="text-[color:var(--text-2)] mb-6">{step.description}</p>
                    <div className="space-y-2">
                      {step.features.map((feature, index) => (
                        <div key={index} className="flex items-center justify-center text-sm">
                          <CheckCircle className="h-4 w-4 text-[color:var(--blue)] mr-2" />
                          <span className="text-[color:var(--ink)]">{feature}</span>
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
              <h2 className="text-2xl font-light text-[color:var(--ink)] mb-4">What Can AI Employees Do?</h2>
              <p className="text-[color:var(--text-2)] max-w-2xl mx-auto">
                From simple tasks to complex workflows, our AI handles it all
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {capabilities.map((capability, index) => (
                <Card key={index} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <div className="p-2 rounded-[16px] bg-[color:var(--sand)] mr-3">
                        <capability.icon className="h-5 w-5 text-[color:var(--text-2)]" />
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
                          <CheckCircle className="h-4 w-4 text-[color:var(--blue)] mr-2 flex-shrink-0" />
                          <span className="text-[color:var(--ink)]">{task}</span>
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
              <h2 className="text-2xl font-light text-[color:var(--ink)] mb-4">Why Businesses Choose 3days.ai</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="text-center border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="bg-[color:var(--blue-100)] p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[color:var(--blue)]">80%</span>
                  </div>
                  <h3 className="text-lg font-medium text-[color:var(--ink)] mb-2">Time Saved</h3>
                  <p className="text-[color:var(--text-2)] text-sm">Automate repetitive tasks and focus on high-value work</p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="bg-[color:var(--blue-100)] p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[color:var(--blue)]">24/7</span>
                  </div>
                  <h3 className="text-lg font-medium text-[color:var(--ink)] mb-2">Always Working</h3>
                  <p className="text-[color:var(--text-2)] text-sm">AI employees never sleep, take breaks, or call in sick</p>
                </CardContent>
              </Card>

              <Card className="text-center border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="bg-[color:var(--blue-100)] p-4 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[color:var(--blue)]">ROI</span>
                  </div>
                  <h3 className="text-lg font-medium text-[color:var(--ink)] mb-2">Immediate ROI</h3>
                  <p className="text-[color:var(--text-2)] text-sm">See returns from day one with our quick setup process</p>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center">
            <Card className="bg-[color:var(--paper)] text-[color:var(--ink)] border border-[color:var(--line)]">
              <CardContent className="p-8">
                <h2 className="text-2xl font-light mb-4">Ready to Get Started?</h2>
                <p className="text-lg text-[color:var(--text-2)] mb-6 font-light">
                  Join thousands of companies that are already transforming their operations with AI employees.
                </p>
                <div className="space-x-4">
                  <Button size="lg" className="bg-[color:var(--ink)] text-white hover:bg-[color:var(--text-2)] rounded-full">
                    Start Free Trial
                  </Button>
                  <Button size="lg" variant="outline" className="border-[color:var(--line)] bg-[color:var(--paper)] text-[color:var(--ink)] hover:bg-[color:var(--paper)] rounded-full">
                    Schedule Demo
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
};

export default HowItWorks;
