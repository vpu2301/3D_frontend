
import { ArrowRight, CheckCircle, Star, Zap, Shield, Crown, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for testing and small teams',
      features: [
        '2 AI workers included',
        'Limited tasks per day',
        'Basic integrations',
        'Email support',
        'Quick proof of value',
        'Community access'
      ],
      roi: 'Immediate',
      payback: 'No cost',
      popular: false,
      icon: Star,
      cta: 'Start Free'
    },
    {
      name: 'Professional',
      price: '$1,500',
      period: 'per AI worker/month',
      description: 'Growing teams ready to scale',
      features: [
        'Unlimited AI workers',
        'Unlimited daily tasks',
        'Advanced integrations (200+)',
        '24/7 priority support',
        'Advanced analytics & ROI tracking',
        'Custom workflow automation',
        '99.9% uptime SLA'
      ],
      roi: '500-800%',
      payback: '4.2 months',
      popular: true,
      icon: Zap,
      cta: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      price: '$25K - $500K',
      period: 'per year',
      description: 'Large-scale deployments with custom solutions',
      features: [
        'Unlimited AI workers',
        'Custom development projects',
        'Dedicated customer success manager',
        'On-premises deployment option',
        'White-label solutions',
        'API access & marketplace integration',
        '99.99% uptime SLA'
      ],
      roi: '800-1200%',
      payback: '2-4 months',
      popular: false,
      icon: Crown,
      cta: 'Contact Sales'
    }
  ];

  const revenueStreams = [
    {
      name: 'Platform Subscriptions',
      percentage: '78%',
      description: 'Free tier + Premium at $1,500–$8,000/mo/worker',
      margin: '95% gross margins',
      color: 'from-blue-500 to-purple-500'
    },
    {
      name: 'Enterprise Services',
      percentage: '18%',
      description: 'Custom dev ($250K–$2M projects)',
      margin: '65% margins',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Marketplace & Data',
      percentage: '4%',
      description: 'Third-party AI workers',
      margin: '90% margins',
      color: 'from-pink-500 to-red-500'
    }
  ];

  const growthMetrics = [
    { year: '2027', arr: '$1B ARR', workers: '400K digital workers' },
    { year: '2029', arr: '$10B ARR', workers: '4M digital workers' },
    { year: '2032', arr: '$100B ARR', workers: '40M digital workers' }
  ];

  const businessMetrics = [
    { label: 'Avg Contract Value', value: '$65K' },
    { label: 'Gross Margin', value: '94%' },
    { label: 'LTV:CAC Ratio', value: '4.7:1' },
    { label: 'CAC Payback', value: '4.2 mo' }
  ];

  const upgradeTriggers = [
    'Reaching email/ticket capacity limits',
    'Need for deeper system integrations',
    'Advanced analytics and reporting requests',
    'Team scaling beyond free tier limits',
    'Custom workflow requirements',
    'Enterprise security and compliance needs'
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 tracking-tight leading-none">
              Freemium to
              <span className="block font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Enterprise Scale
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed">
              Start free with 2 AI workers, then scale to enterprise with our proven 
              business model that's projected to reach $100B ARR by 2032.
            </p>
          </div>
        </div>
      </section>

      {/* Business Metrics */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Proven Business Model</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {businessMetrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-light text-gray-900 mb-2">{metric.value}</div>
                <div className="text-gray-600">{metric.label}</div>
              </div>
            ))}
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

      {/* Revenue Streams */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Revenue Streams
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Diversified revenue model with high-margin streams.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {revenueStreams.map((stream, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className={`text-6xl font-light bg-gradient-to-r ${stream.color} bg-clip-text text-transparent mb-4`}>
                    {stream.percentage}
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{stream.name}</h3>
                  <p className="text-gray-600 mb-4">{stream.description}</p>
                  <div className="text-green-600 font-medium">{stream.margin}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Growth Projections */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              Growth Trajectory
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Our path to $100B ARR with proven market demand.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {growthMetrics.map((metric, index) => (
              <div key={index} className="text-center bg-white rounded-3xl p-8 shadow-lg">
                <div className="text-3xl font-light text-gray-600 mb-2">{metric.year}</div>
                <div className="text-4xl font-medium text-gray-900 mb-4">{metric.arr}</div>
                <div className="text-gray-600">{metric.workers}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upgrade Triggers */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">
              When Teams Upgrade
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Common scenarios that drive users from free to paid plans.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upgradeTriggers.map((trigger, index) => (
              <div 
                key={index} 
                className="bg-white p-6 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-4 group-hover:scale-150 transition-transform duration-300"></div>
                <span className="text-gray-800 font-medium">{trigger}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light mb-6 tracking-tight">
              Start Your Journey to Scale
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light">
              Begin with 2 free AI workers and experience the future of work automation.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
            <div className="text-center lg:text-left">
              <div className="text-6xl font-light mb-4">
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">2</span>
              </div>
              <div className="text-xl text-gray-300">AI Workers</div>
              <div className="text-gray-400">Free Forever</div>
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
                <Link to="/schedule-demo">Schedule Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricing;
