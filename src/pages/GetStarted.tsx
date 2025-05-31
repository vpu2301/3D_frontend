
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, ArrowRight, Zap, Users, Shield } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const GetStarted = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);

  useEffect(() => {
    console.log('GetStarted: Component mounted and rendering');
    console.log('GetStarted: Current location:', window.location.pathname);
  }, []);

  const steps = [
    {
      id: 1,
      title: "Sign Up",
      description: "Create your account and get instant access",
      icon: Users,
      completed: false
    },
    {
      id: 2,
      title: "Setup Your Workspace",
      description: "Configure your AI assistants and workflows",
      icon: Zap,
      completed: false
    },
    {
      id: 3,
      title: "Start Automating",
      description: "Deploy your first AI assistant and see results",
      icon: Shield,
      completed: false
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Get Started with 3days.ai
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your business with AI assistants in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {steps.map((step, index) => (
              <Card key={step.id} className={`relative ${currentStep >= step.id ? 'ring-2 ring-blue-500' : ''}`}>
                <CardHeader className="text-center">
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                    currentStep >= step.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {currentStep > step.id ? (
                      <CheckCircle className="h-8 w-8" />
                    ) : (
                      <step.icon className="h-8 w-8" />
                    )}
                  </div>
                  <CardTitle className="text-lg font-semibold">
                    Step {step.id}: {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-center mb-4">{step.description}</p>
                  {currentStep === step.id && (
                    <Button 
                      className="w-full"
                      onClick={() => {
                        if (step.id === 1) navigate('/signup');
                        else if (step.id === 2) navigate('/dashboard');
                        else if (step.id === 3) navigate('/dashboard');
                      }}
                    >
                      {step.id === 1 ? 'Sign Up Now' : step.id === 2 ? 'Setup Workspace' : 'Start Now'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              size="lg"
              onClick={() => navigate('/signup')}
              className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700"
            >
              Sign Up Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default GetStarted;
