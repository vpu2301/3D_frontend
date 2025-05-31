
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Clock, DollarSign, Users, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Mock job data - in real app, this would come from an API
  const jobs = {
    '1': {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "San Francisco, CA", 
      type: "Full-time",
      salary: "$150k - $200k",
      posted: "2 days ago",
      description: "We're looking for a Senior AI Engineer to lead the development of our next-generation AI employees and automation systems. You'll work on cutting-edge machine learning models and help scale our platform to serve millions of AI employee interactions daily.",
      responsibilities: [
        "Design and implement advanced AI models for task automation",
        "Lead architecture decisions for our AI platform",
        "Collaborate with product teams to define AI capabilities",
        "Optimize model performance and scalability",
        "Mentor junior engineers and establish best practices",
        "Research and implement state-of-the-art AI techniques"
      ],
      requirements: [
        "5+ years of experience in AI/ML engineering",
        "Expert knowledge of Python, TensorFlow, and PyTorch",
        "Experience with distributed systems and cloud platforms",
        "Strong understanding of NLP and computer vision",
        "Experience with MLOps and model deployment",
        "PhD in Computer Science, AI, or related field preferred"
      ],
      niceToHave: [
        "Experience with large language models (LLMs)",
        "Background in autonomous systems",
        "Open source contributions to AI projects",
        "Experience in startup environments"
      ],
      benefits: [
        "Competitive salary with equity package",
        "Health, dental, and vision insurance", 
        "Unlimited PTO policy",
        "$2000 home office setup budget",
        "Learning and development stipend",
        "Stock option program",
        "Flexible work arrangements"
      ]
    }
  };

  const job = jobs[id as keyof typeof jobs];

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <Button onClick={() => navigate('/careers')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Careers
          </Button>
        </div>
      </div>
    );
  }

  const handleApply = () => {
    toast({
      title: "Application Started",
      description: "Redirecting to application form...",
    });
    // In a real app, this would redirect to an application form
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Job link copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate('/careers')}
            className="flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Careers
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Job
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Overview */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-3xl mb-2">{job.title}</CardTitle>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge variant="secondary">{job.department}</Badge>
                      <Badge variant="outline">{job.type}</Badge>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Posted {job.posted}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    {job.type}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <DollarSign className="h-4 w-4 mr-2" />
                    {job.salary}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">{job.description}</p>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle>Key Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Nice to Have */}
            <Card>
              <CardHeader>
                <CardTitle>Nice to Have</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {job.niceToHave.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <Card>
              <CardHeader>
                <CardTitle>Ready to Apply?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button onClick={handleApply} className="w-full" size="lg">
                  Apply Now
                </Button>
                <p className="text-sm text-gray-600 text-center">
                  We typically respond within 3-5 business days
                </p>
              </CardContent>
            </Card>

            {/* Benefits */}
            <Card>
              <CardHeader>
                <CardTitle>Benefits & Perks</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  About 3days.ai
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  We're revolutionizing the future of work with AI employees that seamlessly 
                  integrate into business operations worldwide.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Founded:</span>
                    <span className="font-medium">2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Employees:</span>
                    <span className="font-medium">50+</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Funding:</span>
                    <span className="font-medium">Series A</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
