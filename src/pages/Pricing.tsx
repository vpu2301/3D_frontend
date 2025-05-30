
import { ArrowRight, Calculator, Shield, Clock, Users, Zap, CheckCircle, DollarSign, Calendar, Unlock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import PricingCalculator from '@/components/PricingCalculator';

const Pricing = () => {
  const pricingPolicies = [
    {
      icon: DollarSign,
      title: 'Simple, Predictable Pricing',
      subtitle: 'No hidden fees or surprise charges',
      description: 'Our transparent pricing model ensures you know exactly what you\'ll pay, when you\'ll pay it.',
      features: [
        'Base price includes 160 productive hours per AI worker',
        'Additional usage billed at predictable hourly rates',
        'Real-time usage tracking and cost monitoring',
        'Detailed billing breakdown with every invoice'
      ],
      highlight: 'Starting at $0/month'
    },
    {
      icon: Users,
      title: 'Volume Discounts That Scale',
      subtitle: 'Bigger teams, bigger savings',
      description: 'As your AI workforce grows, your per-worker costs decrease with automatic volume pricing.',
      features: [
        'Automatic 10% discount on 20+ AI workers',
        'Scale to 20% savings with 50+ workers',
        'Enterprise discounts up to 30% for 100+ workers',
        'No contract minimums or volume commitments'
      ],
      highlight: 'Save up to 30%'
    },
    {
      icon: Calendar,
      title: 'Flexible Payment Terms',
      subtitle: 'Pay how you want, when you want',
      description: 'Choose from multiple billing options designed to fit your cash flow and planning needs.',
      features: [
        'Monthly billing for maximum flexibility',
        'Annual plans with 10% additional discount',
        'Enterprise quarterly and custom billing available',
        'Multiple payment methods accepted'
      ],
      highlight: '10% annual savings'
    },
    {
      icon: Unlock,
      title: 'No Lock-in Guarantee',
      subtitle: 'Freedom to scale up or down',
      description: 'Your business changes, and your AI workforce should adapt with zero friction or penalties.',
      features: [
        'Cancel anytime with just 30 days notice',
        'Instant scaling - add or remove workers immediately',
        'Complete data portability and export rights',
        'No early termination fees, ever'
      ],
      highlight: 'Cancel anytime'
    }
  ];

  const trustIndicators = [
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'SOC 2 Type II certified with bank-grade encryption'
    },
    {
      icon: Clock,
      title: '99.9% Uptime SLA',
      description: 'Guaranteed availability with automated failover'
    },
    {
      icon: CheckCircle,
      title: 'GDPR Compliant',
      description: 'Full compliance with global data protection regulations'
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 tracking-tight leading-none">
              Simple, Fair
              <span className="block font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                AI Worker Pricing
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed">
              From $0 to $1000 per month per AI worker. Transparent, 
              usage-based pricing that scales with your business needs.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Calculator */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Calculate Your AI Worker Cost
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Configure your exact needs and get an instant, transparent quote for your AI workers.
            </p>
          </div>
          <PricingCalculator />
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trustIndicators.map((indicator, index) => {
              const IconComponent = indicator.icon;
              return (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <IconComponent className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-2">{indicator.title}</h3>
                  <p className="text-sm text-gray-600">{indicator.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Policies - Redesigned */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Why Teams Choose Our Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Built for modern businesses that value transparency, flexibility, and growth.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {pricingPolicies.map((policy, index) => {
              const IconComponent = policy.icon;
              return (
                <Card key={index} className="border-0 shadow-lg bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{policy.title}</h3>
                          <p className="text-sm text-gray-500 font-medium">{policy.subtitle}</p>
                        </div>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 px-3 py-1 rounded-full">
                        <span className="text-sm font-medium text-green-700">{policy.highlight}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6 leading-relaxed">{policy.description}</p>
                    
                    <ul className="space-y-3">
                      {policy.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Additional Value Props */}
          <div className="mt-16 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-3xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-light text-gray-900 mb-4">
                Everything You Need to Succeed
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Our pricing includes everything you need to deploy, manage, and scale your AI workforce effectively.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: 'Setup & Onboarding', description: 'Complete setup assistance included' },
                { title: '24/7 AI Support', description: 'Round-the-clock technical support' },
                { title: 'Regular Updates', description: 'Continuous AI model improvements' },
                { title: 'Security & Compliance', description: 'Enterprise-grade data protection' }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="bg-white rounded-xl p-4 shadow-sm mb-3">
                    <Zap className="h-8 w-8 text-blue-500 mx-auto" />
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light mb-6 tracking-tight">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
              Begin with 2 free AI workers and experience transparent, usage-based pricing.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            <div className="text-center lg:text-left">
              <div className="text-6xl font-light mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">$0-1000</span>
              </div>
              <div className="text-xl text-gray-300">Per AI Worker/Month</div>
              <div className="text-gray-400">Start Free • Scale as Needed</div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-100 rounded-full py-3 px-8 transition-all duration-300 hover:scale-105"
                asChild
              >
                <Link to="/start-free-trial">
                  Start Free Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/10 rounded-full py-3 px-8 transition-all duration-300"
                asChild
              >
                <Link to="/contact">Get Custom Quote</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
