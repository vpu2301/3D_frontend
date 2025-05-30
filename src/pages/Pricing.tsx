
import { ArrowRight, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import PricingCalculator from '@/components/PricingCalculator';

const Pricing = () => {
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
