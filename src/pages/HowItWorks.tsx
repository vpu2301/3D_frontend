
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Bot, Settings, Zap, CheckCircle, Play } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      step: 1,
      title: "Choose Your AI Employee",
      description: "Select from our library of pre-trained AI employees or create a custom one tailored to your specific needs.",
      icon: Bot,
      features: ["50+ ready-to-use templates", "Custom training available", "Department-specific specializations"],
      image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop"
    },
    {
      step: 2,
      title: "Configure & Train",
      description: "Set up your AI employee's capabilities, permissions, and workflows. Define what tasks they can handle autonomously.",
      icon: Settings,
      features: ["Drag-and-drop workflow builder", "Permission management", "Integration setup"],
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=300&fit=crop"
    },
    {
      step: 3,
      title: "Deploy & Automate",
      description: "Launch your AI employee and watch them handle tasks 24/7. Monitor performance and optimize as needed.",
      icon: Zap,
      features: ["Real-time monitoring", "Performance analytics", "Continuous learning"],
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop"
    }
  ];

  const capabilities = [
    {
      category: "Customer Service",
      tasks: ["Answer customer inquiries", "Process support tickets", "Handle refunds and returns", "Escalate complex issues"],
      color: "bg-blue-500"
    },
    {
      category: "Sales & Marketing",
      tasks: ["Qualify leads", "Send follow-up emails", "Schedule meetings", "Update CRM records"],
      color: "bg-green-500"
    },
    {
      category: "Data Processing",
      tasks: ["Extract data from documents", "Generate reports", "Analyze trends", "Update databases"],
      color: "bg-purple-500"
    },
    {
      category: "HR & Operations",
      tasks: ["Screen resumes", "Schedule interviews", "Onboard new hires", "Process expense reports"],
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              How 3days.ai Works
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Transform your business operations in three simple steps. Our AI employees integrate 
              seamlessly into your existing workflows and start delivering value immediately.
            </p>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Play className="mr-2 h-5 w-5" />
              Watch 2-Minute Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Three Steps to AI Automation
            </h2>
            <p className="text-xl text-gray-600">
              Get started in minutes, not months
            </p>
          </div>

          <div className="space-y-20">
            {steps.map((step, index) => (
              <div key={step.step} className={`flex flex-col lg:flex-row items-center gap-12 ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}>
                <div className="flex-1">
                  <div className="flex items-center mb-4">
                    <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center font-bold text-lg mr-4">
                      {step.step}
                    </div>
                    <step.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-lg text-gray-600 mb-6">{step.description}</p>
                  <ul className="space-y-2">
                    {step.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1">
                  <img 
                    src={step.image}
                    alt={step.title}
                    className="rounded-lg shadow-xl w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Can AI Employees Do?
            </h2>
            <p className="text-xl text-gray-600">
              From simple tasks to complex workflows, our AI handles it all
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {capabilities.map((capability, index) => (
              <Card key={index} className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${capability.color} mr-3`}></div>
                    {capability.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {capability.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        <span className="text-gray-700">{task}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Businesses Choose 3days.ai
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl font-bold text-blue-600">80%</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Time Saved</h3>
              <p className="text-gray-600">Automate repetitive tasks and focus on high-value work</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl font-bold text-green-600">24/7</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Always Working</h3>
              <p className="text-gray-600">AI employees never sleep, take breaks, or call in sick</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <span className="text-3xl font-bold text-purple-600">ROI</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Immediate ROI</h3>
              <p className="text-gray-600">See returns from day one with our quick setup process</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of companies that are already transforming their operations with AI employees.
          </p>
          <div className="space-x-4">
            <Button size="lg" variant="secondary">
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
              Schedule Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;
