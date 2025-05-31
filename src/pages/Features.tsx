
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Bot, 
  Workflow, 
  BarChart, 
  Shield, 
  Zap, 
  Users,
  ArrowRight,
  CheckCircle,
  Clock,
  DollarSign
} from 'lucide-react';

const Features = () => {
  useEffect(() => {
    console.log('Features: Component mounted and rendering');
    console.log('Features: Current location:', window.location.pathname);
  }, []);

  const features = [
    {
      icon: Bot,
      title: "AI Assistants",
      description: "Intelligent virtual employees that understand context and handle complex tasks autonomously.",
      benefits: ["Natural language processing", "Task automation", "24/7 availability"]
    },
    {
      icon: Workflow,
      title: "Workflow Automation",
      description: "Seamlessly integrate AI into your existing processes with our visual workflow builder.",
      benefits: ["Drag-and-drop interface", "Pre-built templates", "Custom integrations"]
    },
    {
      icon: BarChart,
      title: "Analytics & Insights",
      description: "Real-time dashboards and detailed reports to track performance and ROI.",
      benefits: ["Performance metrics", "Cost savings tracking", "Predictive analytics"]
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with compliance standards that enterprises trust.",
      benefits: ["SOC 2 compliance", "Data encryption", "Access controls"]
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Deploy AI employees in minutes with our pre-trained models and templates.",
      benefits: ["Quick deployment", "Pre-configured models", "Instant results"]
    },
    {
      icon: Users,
      title: "Team Collaboration",
      description: "Built for teams with role-based access and collaborative workspaces.",
      benefits: ["Role management", "Shared workspaces", "Team analytics"]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Powerful Features for
              <span className="block text-blue-600">Modern Businesses</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-light">
              Everything you need to deploy, manage, and scale AI employees across your organization.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                    <feature.icon className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Why Businesses Choose 3days.ai
              </h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Clock className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-4">Save Time</h3>
                <p className="text-gray-600">
                  Reduce manual work by up to 80% with intelligent automation that handles repetitive tasks.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <DollarSign className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-4">Cut Costs</h3>
                <p className="text-gray-600">
                  Reduce operational costs by 60% while maintaining or improving service quality.
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <BarChart className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-2xl font-medium text-gray-900 mb-4">Scale Fast</h3>
                <p className="text-gray-600">
                  Handle increasing workloads without proportional increases in staff or infrastructure costs.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-light text-white mb-6">
              Ready to Experience These Features?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Sign up for free and see how AI employees can transform your business.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg" asChild>
              <Link to="/signup">
                Sign Up Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Features;
