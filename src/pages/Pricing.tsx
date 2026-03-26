
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Check, Star, ArrowRight, Bot, Palette, MessageCircle, BarChart3, Mail, Target, Play, Building2 } from 'lucide-react';

const Pricing = () => {
  useEffect(() => {
    console.log('Pricing: Component mounted and rendering');
  }, []);

  const plans = [
    {
      name: 'Starter',
      price: '€49',
      description: 'Perfect for solo founders and small businesses',
      features: [
        '200k text tokens per month',
        '100 AI-generated images',
        'Basic website chatbot',
        'Growth analytics dashboard',
        'Email support',
        'Brand voice training',
        'Multi-language content'
      ],
      cta: 'Start Free Trial',
      popular: false,
      ideal: 'Solo founder'
    },
    {
      name: 'Growth',
      price: '€99',
      description: 'Ideal for growing teams of 5-15 people',
      features: [
        '1M text tokens per month',
        '500 AI-generated images',
        'Advanced chatbot with FAQ integration',
        'Full analytics suite with ROAS tracking',
        'Priority support',
        'Custom brand templates',
        'Social media scheduling',
        'A/B testing for content'
      ],
      cta: 'Start Free Trial',
      popular: true,
      ideal: '5-15 person firm'
    },
    {
      name: 'Pro',
      price: '€199',
      description: 'For agencies and multi-brand businesses',
      features: [
        '3M text tokens per month',
        '1k AI-generated images',
        'API access for integrations',
        'White-label options',
        'Dedicated account manager',
        'Custom model fine-tuning',
        'Advanced automation workflows',
        'Multi-brand management',
        'Custom integrations'
      ],
      cta: 'Contact Sales',
      popular: false,
      ideal: 'Agency / multi-brand'
    }
  ];

  const modules = [
    {
      name: 'Content Copilot',
      icon: Bot,
      description: 'GPT-4-grade copy in your brand voice',
      included: ['All plans']
    },
    {
      name: 'Visual Generator',
      icon: Palette,
      description: 'Brand-consistent images and videos',
      included: ['All plans']
    },
    {
      name: 'AI Chatbot',
      icon: MessageCircle,
      description: '24/7 customer support automation',
      included: ['All plans']
    },
    {
      name: 'Growth Analytics',
      icon: BarChart3,
      description: 'Performance tracking and optimization',
      included: ['All plans']
    },
    {
      name: 'Email Automation',
      icon: Mail,
      description: 'AI-powered email campaigns',
      included: ['Coming Q2 2024']
    },
    {
      name: 'Ad Budget Autopilot',
      icon: Target,
      description: 'Automated ad spend optimization',
      included: ['Coming Q2 2024']
    }
  ];

  return (
    <div className="min-h-screen bg-[#f5ede3] dark:bg-[#181512]">
      <Header />
      
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Choose the plan that fits your business size. All plans include 14-day free trial.
            </p>
            <div className="flex justify-center items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                14-day free trial
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Cancel anytime
              </Badge>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                15% off annual billing
              </Badge>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative ${plan.popular ? 'border-blue-500 shadow-lg scale-105' : 'border-gray-200'}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-6">
                  <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                  <p className="text-gray-600 mt-2">{plan.description}</p>
                  <Badge variant="outline" className="mt-2 w-fit mx-auto">
                    {plan.ideal}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-blue-600 hover:bg-blue-700' : 'bg-[#111111] hover:bg-[#222222] rounded-full'}`}
                    asChild
                  >
                    <Link to={plan.cta === 'Contact Sales' ? '/contact' : '/signup'}>
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* What's Included Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Complete AI Marketing Suite
              </h2>
              <p className="text-xl text-gray-600">
                Every plan includes access to our full range of AI marketing tools
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, index) => (
                <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                        <module.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{module.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-3">{module.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {module.included.map((item, itemIndex) => (
                        <Badge key={itemIndex} variant="outline" className="text-xs">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What happens after the free trial?</h3>
                <p className="text-gray-600">You can continue with a paid plan or cancel anytime. No commitment required.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I change plans anytime?</h3>
                <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What are overages?</h3>
                <p className="text-gray-600">If you exceed your plan limits, additional usage is billed at cost × 1.25. You'll be notified before any charges.</p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is my data secure?</h3>
                <p className="text-gray-600">Yes, we use EU hosting with GDPR compliance, SOC-2 certification, and per-tenant encryption.</p>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-[#111111] to-[#333333] rounded-3xl p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Marketing?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of SMBs using AI to automate their marketing and drive growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100" asChild>
                <Link to="/signup">
                  Start 14-Day Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" asChild>
                <Link to="/watch-demo">
                  Watch Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
