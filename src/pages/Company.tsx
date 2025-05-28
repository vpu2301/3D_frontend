
import { ArrowRight, Users, Target, Award, Globe, Heart, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Company = () => {
  const values = [
    {
      icon: Heart,
      title: 'Human-Centric',
      description: 'We believe AI should amplify human potential, not replace it.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation First',
      description: 'Pushing the boundaries of what\'s possible with AI technology.'
    },
    {
      icon: Target,
      title: 'Results Driven',
      description: 'Focused on delivering measurable value to our customers.'
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'Building solutions that transform businesses worldwide.'
    }
  ];

  const team = [
    {
      name: 'Sarah Chen',
      role: 'CEO & Co-founder',
      bio: 'Former VP of AI at Google, leading the vision for human-AI collaboration.'
    },
    {
      name: 'Marcus Johnson',
      role: 'CTO & Co-founder',
      bio: 'Ex-Tesla AI architect with 15+ years in autonomous systems.'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Head of Product',
      bio: 'Product leader from Microsoft, specializing in enterprise AI solutions.'
    },
    {
      name: 'David Kim',
      role: 'Head of Engineering',
      bio: 'Former principal engineer at OpenAI, expert in large-scale AI systems.'
    }
  ];

  const milestones = [
    { year: '2021', event: 'Company founded with vision to democratize AI' },
    { year: '2022', event: 'Launched first AI automation platform' },
    { year: '2023', event: 'Reached 10,000+ active users across 50 countries' },
    { year: '2024', event: 'Series A funding and enterprise expansion' }
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-7xl font-light text-gray-900 mb-8 tracking-tight leading-none">
              Building the future of
              <span className="block font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                human-AI collaboration
              </span>
            </h1>
            <p className="text-2xl text-gray-600 mb-12 font-light leading-relaxed">
              We're on a mission to empower every professional with AI-powered digital workers that enhance productivity and creativity.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">Our Mission</h2>
              <p className="text-xl text-gray-600 leading-relaxed font-light">
                To democratize AI and make it accessible to every professional, enabling them to focus on what humans do best: creativity, strategy, and meaningful relationships.
              </p>
            </div>
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">Our Vision</h2>
              <p className="text-xl text-gray-600 leading-relaxed font-light">
                A world where AI and humans work seamlessly together, where tedious tasks are automated, and where every professional can achieve their full potential.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              The principles that guide everything we do.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 mb-6">
                    <value.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 font-light">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">Meet Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto font-light">
              Seasoned leaders from top technology companies working to transform how humans and AI collaborate.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full mx-auto mb-6"></div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">{member.name}</h3>
                <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 font-light text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">Our Journey</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex items-center mb-8 last:mb-0">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium mr-6">
                  {milestone.year}
                </div>
                <p className="text-lg text-gray-700">{milestone.event}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-6">Join Our Mission</h2>
          <p className="text-xl text-gray-600 mb-8 font-light">
            Ready to be part of the AI revolution? Let's build the future together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-black hover:bg-gray-800 text-white text-lg px-8 py-3 rounded-full transition-all duration-300 hover:scale-105"
            >
              View Careers
              <ArrowRight className="ml-3 h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-3 rounded-full border-2 border-gray-300 hover:border-gray-400"
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Company;
