
import { Users, Target, Award, TrendingUp, ArrowRight, Lightbulb, Heart, Globe, Calendar, Trophy, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'We push the boundaries of what\'s possible with AI to create solutions that truly transform how people work and live.'
    },
    {
      icon: Heart,
      title: 'People Centered',
      description: 'Technology should empower people, not replace them. We design AI that enhances human potential and creativity.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'We\'re building tools that can improve productivity and quality of life for workers worldwide, regardless of location.'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'We maintain the highest standards of data security and privacy, earning the trust of Fortune 500 companies.'
    },
    {
      icon: Zap,
      title: 'Speed & Efficiency',
      description: 'Our solutions are designed for immediate impact, delivering ROI from day one with minimal setup time.'
    },
    {
      icon: Trophy,
      title: 'Excellence',
      description: 'We strive for perfection in everything we do, from product quality to customer service and support.'
    }
  ];

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former AI researcher at Stanford with 15+ years in machine learning and automation. Published 50+ papers on AI.',
      image: 'photo-1581091226825-a6a2a5aee158',
      expertise: 'AI Strategy, Machine Learning'
    },
    {
      name: 'Michael Rodriguez',
      role: 'CTO & Co-Founder',
      bio: 'Ex-Google engineer specializing in distributed systems and AI infrastructure. Built systems serving billions.',
      image: 'photo-1486312338219-ce68d2c6f44d',
      expertise: 'System Architecture, DevOps'
    },
    {
      name: 'Emily Watson',
      role: 'VP of Product',
      bio: 'Product strategist with expertise in enterprise software and user experience design. Former Microsoft PM.',
      image: 'photo-1649972904349-6e44c42644a7',
      expertise: 'Product Strategy, UX Design'
    },
    {
      name: 'David Park',
      role: 'Head of AI Research',
      bio: 'PhD in Computer Science with focus on natural language processing and cognitive computing. MIT graduate.',
      image: 'photo-1488590528505-98d2b5aba04b',
      expertise: 'NLP, Cognitive AI'
    },
    {
      name: 'Lisa Johnson',
      role: 'VP of Sales',
      bio: 'Enterprise sales leader with 12+ years helping Fortune 500 companies adopt automation technologies.',
      image: 'photo-1507003211169-0a1dd7228f2d',
      expertise: 'Enterprise Sales, Customer Success'
    },
    {
      name: 'Alex Kumar',
      role: 'Head of Engineering',
      bio: 'Full-stack engineer with expertise in scalable systems. Former lead at Uber and Airbnb.',
      image: 'photo-1519244703995-f4e0f30006d5',
      expertise: 'Backend Systems, API Design'
    }
  ];

  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'Started with a vision to democratize AI-powered productivity tools and make automation accessible to all.',
      highlight: 'Founded by Stanford AI researchers'
    },
    {
      year: '2021',
      title: 'First Product Launch',
      description: 'Released our MVP automation platform with first 100 beta customers providing valuable feedback.',
      highlight: '100 beta customers'
    },
    {
      year: '2022',
      title: 'Series A Funding',
      description: 'Raised $15M to accelerate product development and team growth from leading VCs.',
      highlight: '$15M Series A'
    },
    {
      year: '2023',
      title: 'Platform Launch',
      description: 'Released 3days.ai platform with comprehensive automation suite, reaching 1,000 enterprise customers.',
      highlight: '1,000 enterprise customers'
    },
    {
      year: '2024',
      title: 'Global Expansion',
      description: 'Expanded to serve customers across 50+ countries with localized support and partnerships.',
      highlight: '50+ countries served'
    },
    {
      year: '2024',
      title: 'AI Breakthrough',
      description: 'Launched advanced AI workers capable of handling complex multi-step business processes.',
      highlight: 'Next-gen AI workers'
    }
  ];

  const stats = [
    { icon: Users, value: '50,000+', label: 'Active Users Worldwide' },
    { icon: Target, value: '10M+', label: 'Tasks Automated Monthly' },
    { icon: Award, value: '99.9%', label: 'Customer Satisfaction' },
    { icon: TrendingUp, value: '400%', label: 'Average Productivity Increase' }
  ];

  const achievements = [
    'Forbes 30 Under 30 - AI Category',
    'TechCrunch Disrupt Winner 2023',
    'Gartner Cool Vendor in AI',
    'SOC 2 Type II Certified',
    'ISO 27001 Compliance',
    'GDPR Compliant'
  ];

  return (
    <div className="min-h-screen pt-16 bg-white">
      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-6xl font-light text-gray-900 mb-8 tracking-tight">
              Reimagining the Future of
              <span className="block font-medium bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Workplace Productivity
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed">
              At 3days.ai, we believe that artificial intelligence should amplify human potential, 
              not replace it. Our mission is to give everyone their time back by automating the routine, 
              so they can focus on the remarkable. We're not just building software—we're crafting 
              the future of how work gets done.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white" asChild>
                <Link to="/get-started">Start Your Journey <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/careers">Join Our Team</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-light text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-light text-gray-900 mb-6">Our Mission</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  To revolutionize workplace productivity by providing AI-powered digital workers that handle 
                  routine tasks, allowing human workers to focus on creative, strategic, and meaningful work 
                  that drives innovation and growth.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We envision a world where technology serves humanity by eliminating mundane work and 
                  creating opportunities for people to engage in more fulfilling, impactful activities 
                  that leverage their unique human capabilities.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Why 3days.ai?</h3>
                <p className="text-gray-600">
                  The name represents our core promise: giving professionals back 3 days per week 
                  by automating time-consuming tasks. Imagine what you could accomplish with 60% 
                  more time for strategic thinking, creativity, and innovation.
                </p>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-light text-gray-900 mb-6">Our Vision</h2>
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  A future where every knowledge worker has access to a personal AI workforce that handles 
                  the routine, repetitive tasks that consume valuable time and energy, enabling unprecedented 
                  levels of productivity and job satisfaction.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  By 2030, we aim to help millions of professionals reclaim billions of hours annually, 
                  creating unprecedented levels of productivity and job satisfaction across industries worldwide. 
                  This isn't just about efficiency—it's about human fulfillment.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recognition & Achievements</h3>
                <div className="grid grid-cols-2 gap-2">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center">
                      <Award className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
                      {achievement}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
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

      {/* Timeline */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">Key milestones in our mission to transform workplace productivity</p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-semibold w-20 h-20 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-8 flex-shrink-0">
                  {milestone.year}
                </div>
                <div className="flex-1 bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2 md:mb-0">{milestone.title}</h3>
                    <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {milestone.highlight}
                    </span>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The visionaries and builders behind 3days.ai</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6 text-center">
                  <img
                    src={`https://images.unsplash.com/${member.image}?w=200&h=200&fit=crop&crop=face`}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-4 border-gray-100"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{member.role}</p>
                  <p className="text-xs text-gray-500 font-medium mb-3 bg-gray-50 px-3 py-1 rounded-full">
                    {member.expertise}
                  </p>
                  <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-light text-white mb-6">Join Our Mission</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto font-light">
            Ready to be part of the productivity revolution? Whether you're looking to transform your 
            workflow or join our team, we'd love to hear from you. Together, we can build a future 
            where work is more meaningful and fulfilling.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Link to="/get-started" className="flex items-center">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              <Link to="/careers">Explore Careers</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
