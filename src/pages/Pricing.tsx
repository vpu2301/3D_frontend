
import { ArrowRight, CheckCircle, Star, Zap, Shield, Crown, Users, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import PricingCalculator from '@/components/PricingCalculator';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for testing and small teams',
      features: [
        '2 AI workers included',
        'Up to 80 hours/month per worker',
        '3 basic integrations',
        'Community support',
        'Standard cloud deployment',
        'Basic analytics'
      ],
      limitations: ['Limited daily tasks', 'Basic integrations only', 'Community support only'],
      popular: false,
      icon: Star,
      cta: 'Start Free',
      maxWorkers: 2
    },
    {
      name: 'Professional',
      price: '$1,500',
      period: 'per AI worker/month',
      description: 'For growing teams ready to scale',
      features: [
        'Unlimited AI workers',
        '160 hours/month per worker (included)',
        '5 integrations included',
        '24/7 standard support',
        'Advanced analytics',
        'Custom workflow automation',
        '99.9% uptime SLA',
        'API access'
      ],
      addOns: [
        'Additional hours: $12/hour',
        'Extra integrations: $200/month each',
        'Premium support: +50% base price'
      ],
      popular: true,
      icon: Zap,
      cta: 'Start Free Trial',
      maxWorkers: 'Unlimited'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'volume pricing available',
      description: 'Large-scale deployments with custom solutions',
      features: [
        'Volume discounts (up to 30%)',
        'Unlimited usage hours',
        'Unlimited integrations',
        'Dedicated customer success manager',
        'On-premises deployment option',
        'Custom features development',
        '99.99% uptime SLA',
        'White-label solutions'
      ],
      discounts: [
        '10% off: 20+ workers',
        '20% off: 50+ workers', 
        '30% off: 100+ workers'
      ],
      popular: false,
      icon: Crown,
      cta: 'Contact Sales',
      maxWorkers: 'Unlimited'
    }
  ];

  const pricingPolicies = [
    {
      title: 'Transparent Usage-Based Pricing',
      description: 'Pay only for what you use with clear, predictable costs',
      details: [
        'Base price includes 160 hours per worker per month',
        'Additional usage charged at $12 per hour',
        'No hidden fees or surprise charges'
      ]
    },
    {
      title: 'Volume Discounts',
      description: 'Significant savings for larger deployments',
      details: [
        '10% discount for 20+ AI workers',
        '20% discount for 50+ AI workers',
        '30% discount for 100+ AI workers'
      ]
    },
    {
      title: 'Flexible Billing Options',
      description: 'Choose the payment schedule that works for you',
      details: [
        'Monthly billing for flexibility',
        'Annual billing with 10% discount',
        'Enterprise custom billing terms'
      ]
    },
    {
      title: 'No Lock-in Contracts',
      description: 'Scale up or down without commitments',
      details: [
        'Cancel anytime with 30-day notice',
        'Upgrade or downgrade instantly',
        'Data export available at any time'
      ]
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
                Usage-Based Pricing
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed">
              Start free with 2 AI workers, then scale with transparent, 
              usage-based pricing that grows with your business needs.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Calculator */}
      <section className="py-20 px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Calculate Your Custom Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Configure your exact needs and get an instant, transparent quote.
            </p>
          </div>
          <PricingCalculator />
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Standard Pricing Tiers</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Choose a plan that fits your current needs, upgrade anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm overflow-hidden relative ${
                  plan.popular ? 'ring-2 ring-blue-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-blue-500 text-white px-6 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </div>
                  </div>
                )}
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 mr-4">
                      <plan.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-medium text-gray-900">{plan.name}</h3>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-4xl font-light text-gray-900 mb-2">{plan.price}</div>
                    <div className="text-gray-600 text-sm">{plan.period}</div>
                    <div className="text-gray-700 font-medium mt-2">{plan.description}</div>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {plan.addOns && (
                    <div className="bg-blue-50 rounded-2xl p-4 mb-6">
                      <div className="text-sm font-medium text-gray-900 mb-2">Add-ons Available:</div>
                      {plan.addOns.map((addon, idx) => (
                        <div key={idx} className="text-sm text-gray-600">{addon}</div>
                      ))}
                    </div>
                  )}

                  {plan.discounts && (
                    <div className="bg-green-50 rounded-2xl p-4 mb-6">
                      <div className="text-sm font-medium text-gray-900 mb-2">Volume Discounts:</div>
                      {plan.discounts.map((discount, idx) => (
                        <div key={idx} className="text-sm text-gray-600">{discount}</div>
                      ))}
                    </div>
                  )}

                  <Button 
                    className={`w-full py-3 rounded-full transition-all duration-300 hover:scale-105 ${
                      plan.popular 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-black hover:bg-gray-800 text-white'
                    }`}
                    asChild
                  >
                    <Link to={plan.name === 'Free' ? '/start-free-trial' : plan.name === 'Enterprise' ? '/contact' : '/start-free-trial'}>
                      {plan.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Policies */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Our Pricing Philosophy
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Fair, transparent, and designed to scale with your success.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {pricingPolicies.map((policy, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{policy.title}</h3>
                  <p className="text-gray-600 mb-6">{policy.description}</p>
                  <ul className="space-y-2">
                    {policy.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        <span className="text-gray-700">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
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
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Free</span>
              </div>
              <div className="text-xl text-gray-300">Start Today</div>
              <div className="text-gray-400">2 AI Workers • No Credit Card</div>
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
