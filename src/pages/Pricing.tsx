
import { ArrowRight, CheckCircle, Star, Zap, Shield, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: 'Starter',
      price: '$1,500',
      period: 'per digital worker/month',
      description: 'Small teams (1-50 employees)',
      features: [
        'Up to 3 digital workers',
        'Standard integrations (50+)',
        'Email support (business hours)',
        'Basic analytics dashboard',
        'Online documentation',
        '99.5% uptime SLA'
      ],
      roi: '300-500%',
      payback: '4-6 months',
      popular: false,
      icon: Zap
    },
    {
      name: 'Professional',
      price: '$3,000',
      period: 'per digital worker/month',
      description: 'Growing companies (50-500 employees)',
      features: [
        'Up to 25 digital workers',
        'All integrations (200+)',
        '24/7 support (phone, chat, email)',
        'Advanced analytics & ROI tracking',
        'Custom digital worker development',
        'Training & change management',
        '99.9% uptime SLA'
      ],
      roi: '500-800%',
      payback: '3-5 months',
      popular: true,
      icon: Shield
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'volume-based pricing',
      description: 'Large organizations (500+ employees)',
      features: [
        'Unlimited digital workers',
        'All features + custom development',
        'Dedicated customer success manager',
        'On-premises deployment option',
        'White-label and API access',
        '99.99% uptime SLA'
      ],
      roi: '800-1200%',
      payback: '2-4 months',
      popular: false,
      icon: Crown
    }
  ];

  const roiExamples = [
    {
      size: 'Mid-Size Company (200 employees)',
      currentLoss: '$17M',
      investment: '$360K/year',
      timeSavings: '18 hrs/week/employee',
      annualGain: '$2.4M',
      netSavings: '$2.04M',
      roi: '567%',
      payback: '2.1 months'
    },
    {
      size: 'Enterprise (1,000 employees)',
      currentLoss: '$85M',
      investment: '$1.5M/year',
      timeSavings: '22 hrs/week/employee',
      annualGain: '$15.8M',
      netSavings: '$14.3M',
      roi: '953%',
      payback: '1.4 months'
    }
  ];

  const includedServices = [
    'Business process assessment',
    'ROI analysis and business case',
    'Technical architecture review',
    'Custom digital worker development',
    'System integration and testing',
    'Administrator training (16 hours)',
    'End-user training (8 hours)',
    'Go-live support (2 weeks)'
  ];

  const guarantees = [
    '99.9% uptime SLA with credits',
    'ROI achievement within 6 months',
    '90-day implementation guarantee',
    '24/7 support response commitments',
    'Data security and compliance',
    'Performance benchmarks met'
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 tracking-tight leading-none">
              Transparent
              <span className="block font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Value-Based Pricing
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed">
              Pricing that scales with your automation needs and delivers immediate ROI 
              with predictable costs for budget planning and growth forecasting.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm overflow-hidden relative ${
                  plan.popular ? 'ring-2 ring-blue-500' : ''
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

                  <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-medium text-gray-900">{plan.roi}</div>
                        <div className="text-sm text-gray-600">Typical ROI</div>
                      </div>
                      <div>
                        <div className="text-2xl font-medium text-gray-900">{plan.payback}</div>
                        <div className="text-sm text-gray-600">Payback</div>
                      </div>
                    </div>
                  </div>

                  <Button 
                    className={`w-full py-3 rounded-full transition-all duration-300 hover:scale-105 ${
                      plan.popular 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                        : 'bg-black hover:bg-gray-800 text-white'
                    }`}
                    asChild
                  >
                    <Link to="/start-free-trial">
                      {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ROI Examples */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              ROI Calculation Examples
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Real examples showing the financial impact of 3days.ai implementation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {roiExamples.map((example, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <h3 className="text-xl font-medium text-gray-900 mb-6">{example.size}</h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Current annual productivity loss:</span>
                      <span className="font-medium text-gray-900">{example.currentLoss}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">3days.ai investment:</span>
                      <span className="font-medium text-gray-900">{example.investment}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Time savings achieved:</span>
                      <span className="font-medium text-gray-900">{example.timeSavings}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Annual productivity gain:</span>
                      <span className="font-medium text-green-600">{example.annualGain}</span>
                    </div>
                    <div className="flex justify-between items-center border-t pt-4">
                      <span className="text-gray-600">Net annual savings:</span>
                      <span className="font-bold text-green-600 text-lg">{example.netSavings}</span>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4 mt-4">
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-green-600">{example.roi}</div>
                          <div className="text-sm text-gray-600">ROI</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">{example.payback}</div>
                          <div className="text-sm text-gray-600">Payback</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Implementation Services */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Implementation Services Included
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              $125K+ value included at no additional cost with all plans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {includedServices.map((service, index) => (
              <div 
                key={index} 
                className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group text-center"
              >
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 group-hover:scale-150 transition-transform duration-300"></div>
                <span className="text-gray-800 font-medium text-sm">{service}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light mb-6 tracking-tight">
              Performance Guarantees & Risk Mitigation
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
              We stand behind our platform with comprehensive guarantees and risk mitigation.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h3 className="text-2xl font-light mb-8">Performance Guarantees</h3>
              <div className="space-y-4">
                {guarantees.map((guarantee, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-300">{guarantee}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8 rounded-3xl border border-gray-700">
              <h3 className="text-2xl font-light mb-6">Ready to Get Started?</h3>
              <p className="text-gray-300 mb-8 leading-relaxed">
                30-day free trial available with money-back guarantee for the first 90 days.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-100 rounded-full py-3 transition-all duration-300 hover:scale-105"
                  asChild
                >
                  <Link to="/start-free-trial">
                    Start Free Trial
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10 rounded-full py-3 transition-all duration-300"
                  asChild
                >
                  <Link to="/contact">Contact Sales</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
