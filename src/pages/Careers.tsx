
import { ArrowRight, MapPin, Clock, Users, Heart, Zap, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const Careers = () => {
  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health, dental, and vision insurance plus wellness stipend'
    },
    {
      icon: Clock,
      title: 'Flexible Work',
      description: 'Remote-first culture with flexible hours and unlimited PTO'
    },
    {
      icon: Zap,
      title: 'Growth & Learning',
      description: '$5K annual learning budget and mentorship programs'
    },
    {
      icon: Users,
      title: 'Equity & Impact',
      description: 'Meaningful equity participation and work that changes industries'
    },
    {
      icon: Globe,
      title: 'Global Team',
      description: 'Work with top talent from around the world on cutting-edge technology'
    }
  ];

  const openings = [
    {
      title: 'Senior AI Engineer',
      department: 'Engineering',
      location: 'Remote / San Francisco',
      type: 'Full-time',
      description: 'Build and optimize large-scale AI models for workflow automation. Lead architecture decisions for our core AI platform.',
      requirements: ['5+ years in AI/ML', 'Python, TensorFlow/PyTorch', 'Experience with LLMs', 'Distributed systems']
    },
    {
      title: 'Product Manager - AI Platform',
      department: 'Product',
      location: 'Remote / New York',
      type: 'Full-time',
      description: 'Define product strategy for our AI automation platform. Work closely with customers to understand pain points.',
      requirements: ['3+ years PM experience', 'B2B SaaS background', 'Technical depth', 'Customer-focused mindset']
    },
    {
      title: 'Enterprise Sales Director',
      department: 'Sales',
      location: 'Remote / Multiple',
      type: 'Full-time',
      description: 'Drive revenue growth by selling to Fortune 500 companies. Build relationships with C-level executives.',
      requirements: ['7+ years enterprise sales', 'SaaS/automation experience', 'Proven track record', '$5M+ annual quota']
    },
    {
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Scale our infrastructure to support millions of automation workflows. Ensure 99.9% uptime.',
      requirements: ['AWS/GCP expertise', 'Kubernetes/Docker', 'CI/CD pipelines', 'Monitoring & alerting']
    },
    {
      title: 'UX Designer',
      department: 'Design',
      location: 'Remote / San Francisco',
      type: 'Full-time',
      description: 'Design intuitive interfaces for complex automation workflows. Make AI accessible to business users.',
      requirements: ['5+ years UX design', 'B2B product experience', 'Figma/Sketch proficiency', 'User research skills']
    },
    {
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time',
      description: 'Ensure customer success and drive expansion revenue. Help customers achieve maximum ROI.',
      requirements: ['3+ years CS experience', 'SaaS background', 'Technical aptitude', 'Consultative approach']
    }
  ];

  const values = [
    'Customer obsession drives everything we do',
    'Move fast and iterate based on feedback',
    'Default to transparency and open communication',
    'Embrace failure as learning opportunities',
    'Build for scale from day one',
    'Prioritize team growth and development'
  ];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-6xl md:text-7xl font-light text-gray-900 mb-8 tracking-tight leading-none">
              Build the Future of
              <span className="block font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Work with Us
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 font-light leading-relaxed">
              Join a team of passionate innovators creating AI that amplifies human potential. 
              Help us give every professional three extra days per week.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-black hover:bg-gray-800 text-white rounded-full py-3"
                asChild
              >
                <a href="#openings">
                  View Open Positions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full py-3"
                asChild
              >
                <Link to="/company">Learn About Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Hero Image */}
      <section className="px-4 mb-20">
        <div className="max-w-7xl mx-auto">
          <img 
            src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Team collaboration"
            className="rounded-3xl shadow-2xl w-full h-96 object-cover"
          />
        </div>
      </section>

      {/* Why Join Us */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">Why Join 3days.ai?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Be part of a mission-driven team building technology that transforms how the world works.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 w-fit mx-auto mb-6">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Company Values */}
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-light mb-8 text-center">Our Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mr-4 mt-2 flex-shrink-0"></div>
                  <span className="text-gray-300">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="openings" className="py-20 bg-gray-50 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-light text-gray-900 mb-6 tracking-tight">Open Positions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
              Join our growing team and help shape the future of AI automation.
            </p>
          </div>

          <div className="space-y-6">
            {openings.map((job, index) => (
              <Card key={index} className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-2xl font-medium text-gray-900">{job.title}</h3>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {job.department}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-6 text-gray-600 mb-4">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {job.type}
                        </div>
                      </div>

                      <p className="text-gray-700 mb-4 leading-relaxed">{job.description}</p>

                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Requirements:</p>
                        <div className="flex flex-wrap gap-2">
                          {job.requirements.map((req, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {req}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="lg:ml-8 mt-6 lg:mt-0">
                      <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-8 py-3">
                        Apply Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Don't see the perfect role?</p>
            <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full px-8 py-3">
              Send Us Your Resume
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Make an Impact?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Help us build the AI platform that gives millions of professionals their time back.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-gray-900 hover:bg-gray-100 rounded-full py-3"
            asChild
          >
            <a href="#openings">
              Explore Opportunities
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Careers;
