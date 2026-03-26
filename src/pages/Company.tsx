
import { ArrowRight, Users, Target, Award, Globe, Heart, Lightbulb, Building, Calendar, MapPin, Mail } from 'lucide-react';
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
      description: 'We push the boundaries of what\'s possible with AI automation technology to create breakthrough solutions.'
    },
    {
      icon: Users,
      title: 'People-Centric',
      description: 'Technology should amplify human potential, not replace it. We design AI that enhances human capabilities.'
    },
    {
      icon: Target,
      title: 'Results Driven',
      description: 'Every solution we build delivers measurable business impact and real ROI for our customers.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Democratizing automation for businesses worldwide, regardless of size or industry.'
    },
    {
      icon: Heart,
      title: 'Ethical AI',
      description: 'Responsible development and deployment of AI technologies that benefit society.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Setting the gold standard for enterprise automation solutions and customer success.'
    }
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former VP of Engineering at Google, pioneering AI automation since 2015. Stanford CS PhD.',
      image: 'photo-1494790108755-2616b612b786'
    },
    {
      name: 'Marcus Rodriguez',
      role: 'CTO & Co-Founder',
      bio: 'Ex-Tesla AI Lead, expert in large-scale automation systems. MIT graduate with 15+ years experience.',
      image: 'photo-1472099645785-5658abf4ff4e'
    },
    {
      name: 'Dr. Aisha Patel',
      role: 'Chief AI Officer',
      bio: 'MIT PhD, former Microsoft Research, 50+ AI patents. Leading authority on enterprise AI.',
      image: 'photo-1507003211169-0a1dd7228f2d'
    },
    {
      name: 'James Thompson',
      role: 'VP of Customer Success',
      bio: '15+ years in enterprise software, ensuring customer ROI and satisfaction across Fortune 500.',
      image: 'photo-1519244703995-f4e0f30006d5'
    }
  ];

  const milestones = [
    { year: '2020', event: 'Founded with $2M seed funding from top VCs' },
    { year: '2021', event: 'First 100 enterprise customers onboarded' },
    { year: '2022', event: 'Series A: $25M, launched AI automation platform' },
    { year: '2023', event: '10,000+ digital workers deployed globally' },
    { year: '2024', event: 'Series B: $75M, expanded to 50+ countries' }
  ];

  const offices = [
    {
      city: 'San Francisco',
      address: '123 Market Street, Suite 500',
      type: 'Headquarters'
    },
    {
      city: 'New York',
      address: '456 Broadway, 25th Floor',
      type: 'East Coast Hub'
    },
    {
      city: 'London',
      address: '789 Tech City, Level 10',
      type: 'European Operations'
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-white dark:bg-[#181512]">
      {/* Hero Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-5xl mx-auto mb-20">
            <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 tracking-tight leading-tight">
              Building the Future of
              <span className="block font-medium text-[#111111]">
                Intelligent Work
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed max-w-4xl mx-auto">
              We're on a mission to give every professional three extra days per week by automating 
              the repetitive tasks that keep them from doing their best work. Founded in 2020, 
              we've become the leading AI automation platform trusted by Fortune 500 companies worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <Link to="/careers">Join Our Team <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-lg">
                <div className="text-4xl lg:text-5xl font-light text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-24 bg-[#f5ede3] text-[#111111] px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-light mb-8 tracking-tight">Our Mission</h2>
              <p className="text-xl text-black/60 mb-8 leading-relaxed">
                Every day, millions of professionals lose hours to repetitive, manual tasks. 
                We believe human creativity and intelligence should be spent on work that matters—
                strategy, innovation, and meaningful connections.
              </p>
              <p className="text-xl text-black/60 mb-8 leading-relaxed">
                Our AI-powered digital workers handle the routine so you can focus on the remarkable. 
                We're not just building software; we're reshaping how work gets done.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-2xl font-medium mb-2">Vision</h3>
                  <p className="text-black/50">A world where every professional has an AI workforce</p>
                </div>
                <div>
                  <h3 className="text-2xl font-medium mb-2">Impact</h3>
                  <p className="text-black/50">10M+ hours saved for our customers</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
                alt="Team collaboration"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-[#222222]/8 rounded-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              The principles that guide everything we do, from product development to customer relationships.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-[#111111] w-fit mx-auto mb-6">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">Leadership Team</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Experienced leaders from top tech companies building the future of work.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white">
                <CardContent className="p-6 text-center">
                  <img 
                    src={`https://images.unsplash.com/${member.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-gray-100"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <p className="text-blue-600 text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 px-4 bg-gray-50">
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
                <div className="w-24 text-2xl font-light text-blue-600 mr-8 flex-shrink-0">{milestone.year}</div>
                <div className="flex-1 bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <p className="text-gray-800 font-medium">{milestone.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Offices */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">Global Presence</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              We're building a global team with offices in key technology hubs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-[#111111] w-fit mx-auto mb-6">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{office.city}</h3>
                  <p className="text-blue-600 text-sm font-medium mb-3">{office.type}</p>
                  <p className="text-gray-600 text-sm flex items-center justify-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    {office.address}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#f5ede3] text-[#111111] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Transform Your Business?</h2>
          <p className="text-xl mb-12 text-black/60 font-light">
            Join thousands of companies already using 3days.ai to reclaim their time and boost productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-[#111111] text-white hover:bg-[#222222] rounded-full"
              asChild
            >
              <Link to="/get-started">
                Get Started Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-black/15 bg-white/70 text-[#111111] hover:bg-white rounded-full"
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
