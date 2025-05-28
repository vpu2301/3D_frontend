
import { ArrowRight, Users, Target, Award, Globe, Heart, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const Company = () => {
  const stats = [
    { number: '10M+', label: 'Hours Automated Daily' },
    { number: '50K+', label: 'Digital Workers Deployed' },
    { number: '500+', label: 'Enterprise Customers' },
    { number: '99.9%', label: 'Uptime Guarantee' }
  ];

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'We push the boundaries of what\'s possible with AI automation technology.'
    },
    {
      icon: Users,
      title: 'People-Centric',
      description: 'Technology should amplify human potential, not replace it.'
    },
    {
      icon: Target,
      title: 'Results Driven',
      description: 'Every solution we build delivers measurable business impact.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Democratizing automation for businesses worldwide.'
    },
    {
      icon: Heart,
      title: 'Ethical AI',
      description: 'Responsible development and deployment of AI technologies.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Setting the gold standard for enterprise automation solutions.'
    }
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former VP of Engineering at Google, pioneering AI automation since 2015.',
      image: 'photo-1494790108755-2616b612b786'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO & Co-Founder',
      bio: 'Ex-Tesla AI Lead, expert in large-scale automation systems.',
      image: 'photo-1472099645785-5658abf4ff4e'
    },
    {
      name: 'Dr. Aisha Patel',
      role: 'Chief AI Officer',
      bio: 'MIT PhD, former Microsoft Research, 50+ AI patents.',
      image: 'photo-1507003211169-0a1dd7228f2d'
    },
    {
      name: 'James Thompson',
      role: 'VP of Customer Success',
      bio: '15+ years in enterprise software, ensuring customer ROI.',
      image: 'photo-1519244703995-f4e0f30006d5'
    }
  ];

  const milestones = [
    { year: '2020', event: 'Founded with $2M seed funding' },
    { year: '2021', event: 'First 100 enterprise customers' },
    { year: '2022', event: 'Series A: $25M, launched AI platform' },
    { year: '2023', event: '10,000+ digital workers deployed' },
    { year: '2024', event: 'Series B: $75M, global expansion' }
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 tracking-tight leading-none">
              Building the Future of
              <span className="block font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Intelligent Work
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed">
              We're on a mission to give every professional three extra days per week by automating 
              the repetitive tasks that keep them from doing their best work.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-light text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-light mb-8 tracking-tight">Our Mission</h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Every day, millions of professionals lose hours to repetitive, manual tasks. 
                We believe human creativity and intelligence should be spent on work that matters—
                strategy, innovation, and meaningful connections.
              </p>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Our AI-powered digital workers handle the routine so you can focus on the remarkable.
              </p>
              <Button 
                size="lg" 
                className="bg-white text-black hover:bg-gray-100 rounded-full py-3"
                asChild
              >
                <Link to="/careers">
                  Join Our Mission
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                alt="Team collaboration"
                className="rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              The principles that guide everything we do.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 w-fit mx-auto mb-6">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Experienced leaders from top tech companies building the future of work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <img 
                    src={`https://images.unsplash.com/${member.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 text-sm mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              From startup to industry leader in AI automation.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center mb-8 last:mb-0">
                <div className="w-24 text-2xl font-light text-blue-600 mr-8">{milestone.year}</div>
                <div className="flex-1 bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                  <p className="text-gray-800">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Join thousands of companies already using 3days.ai to reclaim their time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-gray-900 hover:bg-gray-100 rounded-full py-3"
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
              className="border-white/30 text-white hover:bg-white/10 rounded-full py-3"
              asChild
            >
              <Link to="/schedule-demo">Schedule Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Company;
