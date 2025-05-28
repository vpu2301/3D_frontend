
import { ArrowRight, Play, CheckCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
  const features = [
    {
      title: 'AI-Powered Automation',
      description: 'Advanced machine learning algorithms that understand your workflow and optimize every task.',
      gradient: 'from-blue-100 to-indigo-100'
    },
    {
      title: 'Seamless Integration',
      description: 'Works perfectly with your existing tools. No disruption, just enhancement.',
      gradient: 'from-purple-100 to-pink-100'
    },
    {
      title: 'Real-time Analytics',
      description: 'See your productivity gains in real-time with beautiful, actionable insights.',
      gradient: 'from-green-100 to-emerald-100'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Operations Director',
      company: 'TechFlow',
      content: "Revolutionary. We've reclaimed 15 hours per week per team member.",
      avatar: 'photo-1494790108755-2616b612b786'
    },
    {
      name: 'Michael Rodriguez',
      role: 'CEO',
      company: 'Digital Ventures',
      content: "The ROI was immediate. Our productivity increased 3x in the first month.",
      avatar: 'photo-1472099645785-5658abf4ff4e'
    },
    {
      name: 'Emily Watson',
      role: 'Product Manager',
      company: 'Innovation Labs',
      content: "Finally, an AI solution that actually understands how we work.",
      avatar: 'photo-1438761681033-6461ffad8d80'
    }
  ];

  const stats = [
    { value: '60%', label: 'Productivity Increase' },
    { value: '3 Days', label: 'Reclaimed Weekly' },
    { value: '10K+', label: 'Happy Users' },
    { value: '99.9%', label: 'Uptime' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="animate-fade-in">
              <h1 className="text-7xl md:text-8xl font-light text-gray-900 mb-8 tracking-tight leading-none">
                Reclaim Your
                <span className="block font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  Three Days
                </span>
              </h1>
              <p className="text-2xl text-gray-600 mb-12 font-light leading-relaxed max-w-3xl mx-auto">
                AI-powered digital workers that handle routine tasks, so your team can focus on what truly matters.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button 
                  size="lg" 
                  className="bg-black hover:bg-gray-800 text-white text-lg px-12 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                >
                  Start Free Trial
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="ghost" 
                  className="text-lg px-8 py-4 rounded-full border border-gray-200 hover:bg-gray-50 transition-all duration-300 hover:scale-105"
                >
                  <Play className="mr-3 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center animate-slide-up" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="text-5xl font-light text-gray-900 mb-3">{stat.value}</div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Built for the future
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Every feature designed to amplify human potential and eliminate the mundane.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white/80 backdrop-blur-sm overflow-hidden group"
              >
                <CardContent className="p-12">
                  <div className={`h-1 w-16 bg-gradient-to-r ${feature.gradient} mb-8 transition-all duration-500 group-hover:w-24`}></div>
                  <h3 className="text-2xl font-medium text-gray-900 mb-6">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-lg font-light">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-light text-gray-900 mb-6">
              Loved by teams worldwide
            </h2>
            <div className="flex justify-center items-center gap-2 mb-8">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-6 w-6 text-yellow-400 fill-current" />
              ))}
              <span className="ml-3 text-gray-600 text-lg">4.9/5 from 2,000+ reviews</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <p className="text-gray-700 mb-8 text-lg leading-relaxed italic">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <img
                      src={`https://images.unsplash.com/${testimonial.avatar}?w=60&h=60&fit=crop&crop=face`}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full mr-4 object-cover"
                    />
                    <div>
                      <div className="font-medium text-gray-900">{testimonial.name}</div>
                      <div className="text-gray-600 text-sm">{testimonial.role} at {testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-light mb-8 tracking-tight">
            Ready to transform
            <span className="block font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              your workflow?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-12 font-light leading-relaxed">
            Join thousands of teams who have already reclaimed their most valuable resource: time.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 text-lg px-12 py-4 rounded-full transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Start Free Trial
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 rounded-full transition-all duration-300"
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
