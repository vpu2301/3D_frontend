
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Users, Building, Calendar, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const JobDetail = () => {
  const { id } = useParams();

  // Mock job data - in a real app, this would come from an API
  const jobs = {
    '1': {
      title: 'Senior AI Engineer',
      department: 'Engineering',
      location: 'Remote / San Francisco',
      type: 'Full-time',
      experience: 'Senior Level (7+ years)',
      salary: '$180,000 - $250,000',
      posted: '2 days ago',
      description: 'Lead the development of our core AI automation platform. You\'ll architect and build large-scale ML systems that process millions of workflows daily, working with transformer models, multi-agent systems, and distributed computing frameworks.',
      requirements: [
        '7+ years in AI/ML engineering with production experience',
        'Deep expertise in Python, TensorFlow/PyTorch, and modern ML frameworks',
        'Experience with LLMs, transformer architectures, and fine-tuning',
        'Strong background in distributed systems and cloud infrastructure (AWS/GCP)',
        'Track record of shipping ML products at scale with millions of users',
        'PhD in Computer Science, ML, or related field preferred',
        'Experience with MLOps, model deployment, and monitoring systems'
      ],
      responsibilities: [
        'Design and implement core AI algorithms for workflow automation',
        'Optimize model performance, inference speed, and resource utilization',
        'Collaborate with product teams on AI feature development and roadmap',
        'Mentor junior engineers and establish ML engineering best practices',
        'Research and integrate cutting-edge AI/ML techniques',
        'Build scalable ML infrastructure and deployment pipelines',
        'Work with data teams to improve model training and evaluation'
      ],
      benefits: [
        'Competitive salary with equity participation',
        'Comprehensive health, dental, and vision insurance',
        'Unlimited PTO and flexible remote work',
        '$5,000 annual learning and development budget',
        'Top-tier equipment and home office setup allowance',
        'Quarterly team retreats and company offsites'
      ],
      team: 'AI Platform Team (12 engineers)',
      reportingTo: 'VP of Engineering',
      aboutTeam: 'Join our world-class AI team building the future of work automation. We\'re a collaborative group of ML engineers, researchers, and infrastructure specialists working on cutting-edge problems at the intersection of AI and enterprise software.'
    },
    '2': {
      title: 'Product Manager - AI Platform',
      department: 'Product',
      location: 'Remote / New York',
      type: 'Full-time',
      experience: 'Mid-Senior Level (5+ years)',
      salary: '$150,000 - $200,000',
      posted: '1 week ago',
      description: 'Drive product strategy for our AI automation platform. You\'ll work directly with enterprise customers to understand complex workflow needs and translate them into product requirements that our engineering team can execute.',
      requirements: [
        '5+ years product management experience in B2B SaaS',
        'Strong technical background with enterprise software experience',
        'Experience with AI/ML products and understanding of technical constraints',
        'Track record of working with enterprise customers ($1M+ deals)',
        'Excellent analytical skills and experience with product metrics',
        'Strong communication skills for cross-functional collaboration',
        'MBA or equivalent business education preferred'
      ],
      responsibilities: [
        'Define product roadmap for AI automation features',
        'Conduct customer interviews and market research',
        'Work with engineering on technical specifications and architecture',
        'Analyze product metrics, user behavior, and business impact',
        'Lead go-to-market strategy for new features',
        'Collaborate with sales and customer success on product positioning',
        'Manage product launches and feature rollouts'
      ],
      benefits: [
        'Competitive salary with equity participation',
        'Comprehensive health, dental, and vision insurance',
        'Unlimited PTO and flexible remote work',
        '$3,000 annual learning and development budget',
        'Product conference attendance and training',
        'Quarterly team retreats and company offsites'
      ],
      team: 'Product Team (6 PMs)',
      reportingTo: 'Head of Product',
      aboutTeam: 'Our product team works closely with customers, engineering, and design to build products that solve real business problems. We\'re data-driven, customer-obsessed, and focused on delivering exceptional user experiences.'
    }
  };

  const job = jobs[id as keyof typeof jobs];

  if (!job) {
    return (
      <div className="min-h-screen pt-16 px-4 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-gray-900 mb-4">Job not found</h1>
          <Link to="/careers">
            <Button variant="outline">Back to Careers</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/careers" className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Careers
          </Link>

          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <h1 className="text-4xl font-light text-gray-900">{job.title}</h1>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {job.department}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-600 mb-6">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                {job.location}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                {job.type}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Posted {job.posted}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3">
                Apply for this Position
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3">
                <Share2 className="h-4 w-4 mr-2" />
                Share Job
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Job Details */}
      <section className="pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-medium text-gray-900 mb-4">About the Role</h3>
                  <p className="text-gray-700 leading-relaxed mb-6">{job.description}</p>
                  <p className="text-gray-700 leading-relaxed">{job.aboutTeam}</p>
                </CardContent>
              </Card>

              {/* Responsibilities */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-medium text-gray-900 mb-4">Key Responsibilities</h3>
                  <ul className="space-y-3">
                    {job.responsibilities.map((resp, idx) => (
                      <li key={idx} className="text-gray-700 flex items-start">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        {resp}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-medium text-gray-900 mb-4">Requirements</h3>
                  <ul className="space-y-3">
                    {job.requirements.map((req, idx) => (
                      <li key={idx} className="text-gray-700 flex items-start">
                        <div className="w-2 h-2 bg-gray-400 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        {req}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-medium text-gray-900 mb-4">Benefits & Perks</h3>
                  <ul className="space-y-3">
                    {job.benefits.map((benefit, idx) => (
                      <li key={idx} className="text-gray-700 flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Job Details</h4>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Experience Level</div>
                      <div className="text-gray-900">{job.experience}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Salary Range</div>
                      <div className="text-gray-900">{job.salary}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Team</div>
                      <div className="text-gray-900">{job.team}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Reports To</div>
                      <div className="text-gray-900">{job.reportingTo}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Apply Card */}
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-purple-50">
                <CardContent className="p-6 text-center">
                  <h4 className="text-lg font-medium text-gray-900 mb-3">Ready to Apply?</h4>
                  <p className="text-gray-600 mb-6 text-sm">Join our team and help build the future of work automation.</p>
                  <Button className="w-full bg-black hover:bg-gray-800 text-white mb-3">
                    Apply Now
                  </Button>
                  <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50">
                    Save for Later
                  </Button>
                </CardContent>
              </Card>

              {/* Contact */}
              <Card className="border-0 shadow-lg">
                <CardContent className="p-6">
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Questions?</h4>
                  <p className="text-gray-600 text-sm mb-4">
                    Have questions about this role? We'd love to hear from you.
                  </p>
                  <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50" asChild>
                    <Link to="/contact">Contact Us</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JobDetail;
