
import { Users, Target, Award, TrendingUp, ArrowRight, Lightbulb, Heart, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const About = () => {
  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'We push the boundaries of what\'s possible with AI to create solutions that truly transform how people work.'
    },
    {
      icon: Heart,
      title: 'People Centered',
      description: 'Technology should empower people, not replace them. We design AI that enhances human potential.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'We\'re building tools that can improve productivity and quality of life for workers worldwide.'
    }
  ];

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'CEO & Co-Founder',
      bio: 'Former AI researcher at Stanford with 15+ years in machine learning and automation.',
      image: 'photo-1581091226825-a6a2a5aee158'
    },
    {
      name: 'Michael Rodriguez',
      role: 'CTO & Co-Founder',
      bio: 'Ex-Google engineer specializing in distributed systems and AI infrastructure.',
      image: 'photo-1486312338219-ce68d2c6f44d'
    },
    {
      name: 'Emily Watson',
      role: 'VP of Product',
      bio: 'Product strategist with expertise in enterprise software and user experience design.',
      image: 'photo-1649972904349-6e44c42644a7'
    },
    {
      name: 'David Park',
      role: 'Head of AI Research',
      bio: 'PhD in Computer Science with focus on natural language processing and cognitive computing.',
      image: 'photo-1488590528505-98d2b5aba04b'
    }
  ];

  const milestones = [
    {
      year: '2022',
      title: 'Company Founded',
      description: 'Started with a vision to democratize AI-powered productivity tools.'
    },
    {
      year: '2023',
      title: 'Series A Funding',
      description: 'Raised $15M to accelerate product development and team growth.'
    },
    {
      year: '2024',
      title: 'Platform Launch',
      description: 'Released 3days.ai platform with first 1,000 enterprise customers.'
    },
    {
      year: '2024',
      title: 'Global Expansion',
      description: 'Expanded to serve customers across 50+ countries worldwide.'
    }
  ];

  const stats = [
    { icon: Users, value: '10,000+', label: 'Active Users' },
    { icon: Target, value: '1M+', label: 'Tasks Automated' },
    { icon: Award, value: '99.9%', label: 'Customer Satisfaction' },
    { icon: TrendingUp, value: '3x', label: 'Productivity Increase' }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Reimagining the Future of
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Workplace Productivity
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              At 3days.ai, we believe that artificial intelligence should amplify human potential, 
              not replace it. Our mission is to give everyone their time back by automating the routine, 
              so they can focus on the remarkable.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-lg text-gray-600 mb-6">
                To revolutionize workplace productivity by providing AI-powered digital workers that handle 
                routine tasks, allowing human workers to focus on creative, strategic, and meaningful work 
                that drives innovation and growth.
              </p>
              <p className="text-gray-600">
                We envision a world where technology serves humanity by eliminating mundane work and 
                creating opportunities for people to engage in more fulfilling, impactful activities.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
              <p className="text-lg text-gray-600 mb-6">
                A future where every knowledge worker has access to a personal AI workforce that handles 
                the routine, repetitive tasks that consume valuable time and energy.
              </p>
              <p className="text-gray-600">
                By 2030, we aim to help millions of professionals reclaim billions of hours annually, 
                creating unprecedented levels of productivity and job satisfaction across industries worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg text-center">
                <CardContent className="p-8">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">Key milestones in our mission to transform workplace productivity</p>
          </div>

          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center md:items-start">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-bold w-20 h-20 rounded-full flex items-center justify-center mb-4 md:mb-0 md:mr-8 flex-shrink-0">
                  {milestone.year}
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{milestone.title}</h3>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">The visionaries and builders behind 3days.ai</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-lg">
                <CardContent className="p-6 text-center">
                  <img
                    src={`https://images.unsplash.com/${member.image}?w=200&h=200&fit=crop&crop=face`}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-gray-600">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Join Our Mission</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Ready to be part of the productivity revolution? Whether you're looking to transform your 
            workflow or join our team, we'd love to hear from you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Explore Careers
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
