
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Clock, DollarSign, Users, Search, Building, Star, Heart } from 'lucide-react';

const Careers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');

  const jobs = [
    {
      id: 1,
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$150k - $200k",
      description: "Lead the development of our next-generation AI employees and automation systems.",
      requirements: ["5+ years in AI/ML", "Python, TensorFlow", "Distributed systems"],
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Product Manager - AI Platform",
      department: "Product",
      location: "Remote",
      type: "Full-time", 
      salary: "$130k - $170k",
      description: "Drive product strategy and roadmap for our AI employee platform.",
      requirements: ["3+ years product management", "AI/ML background", "B2B SaaS experience"],
      posted: "1 week ago"
    },
    {
      id: 3,
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "New York, NY",
      type: "Full-time",
      salary: "$80k - $120k", 
      description: "Help our customers maximize value from their AI employee implementations.",
      requirements: ["2+ years customer success", "Technical aptitude", "SaaS experience"],
      posted: "3 days ago"
    },
    {
      id: 4,
      title: "Frontend Developer",
      department: "Engineering",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$100k - $140k",
      description: "Build beautiful, intuitive interfaces for our AI platform.",
      requirements: ["React expertise", "TypeScript", "UI/UX sensibility"],
      posted: "1 week ago"
    },
    {
      id: 5,
      title: "Sales Development Representative",
      department: "Sales",
      location: "Remote",
      type: "Full-time",
      salary: "$60k - $80k + commission",
      description: "Generate qualified leads and drive initial customer conversations.",
      requirements: ["1+ years sales experience", "SaaS background preferred", "Strong communication"],
      posted: "5 days ago"
    },
    {
      id: 6,
      title: "DevOps Engineer",
      department: "Engineering", 
      location: "Seattle, WA",
      type: "Full-time",
      salary: "$120k - $160k",
      description: "Scale our infrastructure to support millions of AI employee interactions.",
      requirements: ["Kubernetes", "AWS/GCP", "CI/CD pipelines"],
      posted: "4 days ago"
    }
  ];

  const benefits = [
    { icon: DollarSign, title: "Competitive Packages", description: "Salary and equity" },
    { icon: Heart, title: "Health Coverage", description: "Full health, dental, vision" },
    { icon: Clock, title: "Unlimited PTO", description: "Take time when you need it" },
    { icon: Building, title: "Remote First", description: "Work from anywhere" },
    { icon: Star, title: "Growth Budget", description: "$2000 learning stipend" },
    { icon: Users, title: "Stock Options", description: "Equity in our success" }
  ];

  const departments = [...new Set(jobs.map(job => job.department))];
  const locations = [...new Set(jobs.map(job => job.location))];

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' || job.department === departmentFilter;
    const matchesLocation = locationFilter === 'all' || job.location === locationFilter;
    
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f5ede3] via-white to-purple-50 dark:from-[#181512] dark:via-[#1c1916] dark:to-[#1c1916]">
      <main className="pt-16 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Join the AI Revolution</h1>
            <p className="text-gray-600">Help us build the future of work with passionate individuals</p>
          </div>

          {/* Company Stats */}
          <section className="mb-8">
            <Card className="bg-[#f5ede3] text-[#111111] border-0">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <Users className="h-8 w-8 mx-auto mb-2 opacity-90" />
                    <div className="text-2xl font-light">50+</div>
                    <div className="text-sm opacity-90">Employees</div>
                  </div>
                  <div>
                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-90" />
                    <div className="text-2xl font-light">Remote</div>
                    <div className="text-sm opacity-90">First Culture</div>
                  </div>
                  <div>
                    <Star className="h-8 w-8 mx-auto mb-2 opacity-90" />
                    <div className="text-2xl font-light">Series A</div>
                    <div className="text-sm opacity-90">Funding Stage</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          {/* Filters */}
          <section className="mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black/50 h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/80 border-gray-200"
                />
              </div>
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="bg-white/80 border-gray-200">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="bg-white/80 border-gray-200">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>

          {/* Job Listings */}
          <section className="mb-12">
            <h2 className="text-xl font-medium text-gray-900 mb-6">Open Positions ({filteredJobs.length})</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg mb-2">{job.title}</CardTitle>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">{job.department}</Badge>
                          <Badge variant="outline" className="text-xs">{job.type}</Badge>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">{job.posted}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4">{job.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-xs text-gray-600">
                        <MapPin className="h-3 w-3 mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-xs text-gray-600">
                        <DollarSign className="h-3 w-3 mr-2" />
                        {job.salary}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredJobs.length === 0 && (
              <Card className="text-center py-12 border-0 shadow-sm">
                <CardContent>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                  <p className="text-gray-600">Try adjusting your search criteria or check back later for new openings.</p>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Benefits Section */}
          <section>
            <div className="text-center mb-8">
              <h2 className="text-2xl font-light text-gray-900 mb-4">Why Work at 3days.ai?</h2>
              <p className="text-gray-600">We invest in our people and their growth</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="p-3 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 w-fit mx-auto mb-4">
                      <benefit.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-sm text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Careers;
