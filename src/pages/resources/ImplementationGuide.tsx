
import { CheckCircle, ArrowRight, Clock, Users, Cog, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const ImplementationGuide = () => {
  const phases = [
    {
      phase: "Phase 1",
      title: "Assessment & Planning",
      duration: "1-2 weeks",
      icon: Target,
      steps: [
        "Business process analysis",
        "ROI calculation and goal setting",
        "Technology stack evaluation",
        "Implementation roadmap creation"
      ]
    },
    {
      phase: "Phase 2", 
      title: "Setup & Configuration",
      duration: "2-3 weeks",
      icon: Cog,
      steps: [
        "Platform installation and setup",
        "Integration with existing systems",
        "Security configuration",
        "Initial workflow creation"
      ]
    },
    {
      phase: "Phase 3",
      title: "Training & Deployment",
      duration: "2-4 weeks", 
      icon: Users,
      steps: [
        "Team training and onboarding",
        "Pilot program launch",
        "Performance monitoring setup",
        "Gradual rollout to full organization"
      ]
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Implementation Guide
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              A comprehensive step-by-step guide to successfully implementing AI automation 
              in your organization, from initial assessment to full deployment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-md" asChild>
                <Link to="/get-started">Start Implementation</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-md" asChild>
                <Link to="/contact">Get Expert Help</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation Phases */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Implementation Phases</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our proven three-phase approach ensures smooth deployment and maximum ROI
            </p>
          </div>

          <div className="space-y-8">
            {phases.map((phase, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500">
                        <phase.icon className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-sm font-medium text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                          {phase.phase}
                        </span>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {phase.duration}
                        </span>
                      </div>
                      <h3 className="text-2xl font-medium text-gray-900 mb-4">{phase.title}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {phase.steps.map((step, stepIndex) => (
                          <div key={stepIndex} className="flex items-center space-x-3">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                            <span className="text-gray-600">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Begin?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Let our experts guide you through a successful implementation.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-md py-3" asChild>
            <Link to="/schedule-demo">
              Schedule Implementation Call
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ImplementationGuide;
