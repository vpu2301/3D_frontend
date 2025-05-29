
import { useState } from 'react';
import { ArrowRight, MapPin, Clock, Users, Heart, Zap, Globe, Filter, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'react-router-dom';

const Careers = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

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
      id: '1',
      title: 'Senior AI Engineer',
      department: 'Engineering',
      location: 'Remote / San Francisco',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Lead the development of our core AI automation platform. You\'ll architect and build large-scale ML systems that process millions of workflows daily, working with transformer models, multi-agent systems, and distributed computing frameworks.',
      requirements: [
        '7+ years in AI/ML engineering',
        'Deep expertise in Python, TensorFlow/PyTorch',
        'Experience with LLMs and transformer architectures',
        'Distributed systems and cloud infrastructure (AWS/GCP)',
        'Track record of shipping ML products at scale'
      ],
      responsibilities: [
        'Design and implement core AI algorithms for workflow automation',
        'Optimize model performance and inference speed',
        'Collaborate with product teams on AI feature development',
        'Mentor junior engineers and establish ML best practices'
      ]
    },
    {
      id: '2',
      title: 'Product Manager - AI Platform',
      department: 'Product',
      location: 'Remote / New York',
      type: 'Full-time',
      experience: 'Mid-Senior',
      description: 'Drive product strategy for our AI automation platform. You\'ll work directly with enterprise customers to understand complex workflow needs and translate them into product requirements that our engineering team can execute.',
      requirements: [
        '5+ years product management experience',
        'B2B SaaS background with enterprise customers',
        'Technical depth to work with AI/ML teams',
        'Experience with workflow automation tools',
        'Strong analytical and customer research skills'
      ],
      responsibilities: [
        'Define product roadmap for AI automation features',
        'Conduct customer interviews and market research',
        'Work with engineering on technical specifications',
        'Analyze product metrics and user behavior'
      ]
    },
    {
      id: '3',
      title: 'Enterprise Sales Director',
      department: 'Sales',
      location: 'Remote / Multiple',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Lead our enterprise sales efforts targeting Fortune 500 companies. You\'ll build relationships with C-level executives, understand complex organizational needs, and position our AI platform as a strategic transformation tool.',
      requirements: [
        '8+ years enterprise B2B sales experience',
        'Proven track record with $5M+ annual quotas',
        'Experience selling SaaS/automation solutions',
        'Existing network of enterprise decision makers',
        'Consultative selling approach'
      ],
      responsibilities: [
        'Manage full sales cycle for enterprise accounts',
        'Build relationships with key stakeholders',
        'Collaborate with technical teams on complex deals',
        'Develop territory strategy and account plans'
      ]
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Mid-Senior',
      description: 'Scale our infrastructure to support millions of automation workflows with 99.9% uptime. You\'ll work with Kubernetes, microservices, and cloud-native technologies to build resilient, auto-scaling systems.',
      requirements: [
        '5+ years DevOps/Infrastructure experience',
        'Expert-level Kubernetes and Docker skills',
        'Experience with AWS/GCP cloud platforms',
        'Infrastructure as Code (Terraform, CloudFormation)',
        'Monitoring and observability tools'
      ],
      responsibilities: [
        'Design and maintain cloud infrastructure',
        'Implement CI/CD pipelines and deployment automation',
        'Monitor system performance and reliability',
        'Optimize costs and resource utilization'
      ]
    },
    {
      id: '5',
      title: 'Senior UX Designer',
      department: 'Design',
      location: 'Remote / San Francisco',
      type: 'Full-time',
      experience: 'Senior',
      description: 'Design intuitive interfaces that make complex AI automation accessible to business users. You\'ll create design systems, conduct user research, and work closely with engineering to bring beautiful, functional experiences to life.',
      requirements: [
        '6+ years UX design experience',
        'B2B product design background',
        'Proficiency in Figma, design systems',
        'User research and usability testing experience',
        'Understanding of technical constraints'
      ],
      responsibilities: [
        'Design user experiences for automation workflows',
        'Conduct user research and usability testing',
        'Create and maintain design system',
        'Collaborate with product and engineering teams'
      ]
    },
    {
      id: '6',
      title: 'Customer Success Manager',
      department: 'Customer Success',
      location: 'Remote',
      type: 'Full-time',
      experience: 'Mid-Level',
      description: 'Ensure our enterprise customers achieve maximum value from our platform. You\'ll work as a trusted advisor, helping customers implement complex automation strategies and driving expansion revenue through consultative engagement.',
      requirements: [
        '4+ years customer success experience',
        'B2B SaaS background with enterprise accounts',
        'Technical aptitude for automation platforms',
        'Consultative approach to customer relationships',
        'Experience with customer health metrics'
      ],
      responsibilities: [
        'Manage relationships with enterprise customers',
        'Drive product adoption and expansion revenue',
        'Provide strategic consulting on automation',
        'Analyze customer health and success metrics'
      ]
    },
    // Internships
    {
      id: '7',
      title: 'AI Research Intern',
      department: 'Engineering',
      location: 'Remote / San Francisco',
      type: 'Internship',
      experience: 'Entry-Level',
      description: 'Join our AI research team to explore cutting-edge machine learning techniques. Work on real projects that impact millions of users while learning from world-class AI engineers and researchers.',
      requirements: [
        'Pursuing CS, AI, or related degree',
        'Strong programming skills in Python',
        'Knowledge of ML fundamentals',
        'Experience with TensorFlow or PyTorch',
        'Research experience preferred'
      ],
      responsibilities: [
        'Conduct research on novel AI techniques',
        'Implement and test ML algorithms',
        'Collaborate with senior engineers on projects',
        'Present findings to the research team'
      ]
    },
    {
      id: '8',
      title: 'Product Management Intern',
      department: 'Product',
      location: 'Remote / New York',
      type: 'Internship',
      experience: 'Entry-Level',
      description: 'Get hands-on experience in B2B product management. Work with our product team to understand customer needs, analyze data, and contribute to product strategy for our AI automation platform.',
      requirements: [
        'Pursuing business, engineering, or related degree',
        'Strong analytical and communication skills',
        'Interest in technology and AI',
        'Experience with data analysis tools',
        'Customer-focused mindset'
      ],
      responsibilities: [
        'Assist with customer research and interviews',
        'Analyze product usage data and metrics',
        'Support product roadmap planning',
        'Create specifications for new features'
      ]
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

  // Filter jobs based on search and filters
  const filteredOpenings = openings.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || job.location.includes(selectedLocation);
    const matchesType = selectedType === 'all' || job.type === selectedType;

    return matchesSearch && matchesDepartment && matchesLocation && matchesType;
  });

  const departments = [...new Set(openings.map(job => job.department))];
  const locations = [...new Set(openings.flatMap(job => job.location.split(' / ')))];
  const types = [...new Set(openings.map(job => job.type))];

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

          {/* Filters */}
          <div className="mb-8">
            <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Filter className="h-5 w-5 text-gray-600" />
                  <h3 className="text-lg font-medium text-gray-900">Filter Positions</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search positions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map(dept => (
                        <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      {locations.map(loc => (
                        <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Job Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      {types.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="space-y-6">
            {filteredOpenings.map((job) => (
              <Link key={job.id} to={`/careers/job/${job.id}`}>
                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                  <CardContent className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <h3 className="text-2xl font-medium text-gray-900 hover:text-blue-600 transition-colors">{job.title}</h3>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {job.department}
                          </Badge>
                          {job.type === 'Internship' && (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              Internship
                            </Badge>
                          )}
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
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {job.experience} Level
                          </div>
                        </div>

                        <p className="text-gray-700 mb-6 leading-relaxed line-clamp-3">{job.description}</p>

                        <div className="grid md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-3">Key Requirements:</p>
                            <ul className="space-y-2">
                              {job.requirements.slice(0, 3).map((req, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-start">
                                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                                  {req}
                                </li>
                              ))}
                              {job.requirements.length > 3 && (
                                <li className="text-sm text-blue-600 font-medium">
                                  +{job.requirements.length - 3} more requirements
                                </li>
                              )}
                            </ul>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-900 mb-3">You'll be:</p>
                            <ul className="space-y-2">
                              {job.responsibilities.slice(0, 3).map((resp, idx) => (
                                <li key={idx} className="text-sm text-gray-600 flex items-start">
                                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                                  {resp}
                                </li>
                              ))}
                              {job.responsibilities.length > 3 && (
                                <li className="text-sm text-blue-600 font-medium">
                                  +{job.responsibilities.length - 3} more responsibilities
                                </li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>

                      <div className="lg:ml-8 mt-6 lg:mt-0 flex flex-col items-end">
                        <Button className="bg-black hover:bg-gray-800 text-white rounded-full px-8 py-3 mb-3">
                          View Details
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                        <span className="text-sm text-gray-500">Click to learn more</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {filteredOpenings.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No positions match your current filters.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDepartment('all');
                  setSelectedLocation('all');
                  setSelectedType('all');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

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
