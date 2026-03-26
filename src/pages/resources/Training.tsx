
import { BookOpen, ArrowRight, Play, Users, Target, CheckCircle, Clock, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Training = () => {
  const courses = [
    {
      title: "Getting Started with AI Automation",
      duration: "2 hours",
      level: "Beginner",
      icon: Play,
      description: "Learn the fundamentals of AI automation and how to get started with your first workflows."
    },
    {
      title: "Advanced Workflow Design", 
      duration: "4 hours",
      level: "Intermediate",
      icon: Target,
      description: "Master complex workflow patterns and optimization techniques for maximum efficiency."
    },
    {
      title: "Team Management & Collaboration",
      duration: "3 hours", 
      level: "Intermediate",
      icon: Users,
      description: "Best practices for managing automation teams and collaborative workflow development."
    },
    {
      title: "Security & Compliance",
      duration: "2.5 hours",
      level: "Advanced", 
      icon: CheckCircle,
      description: "Ensure your automation meets security standards and compliance requirements."
    }
  ];

  const resources = [
    {
      type: "Video Tutorials",
      count: "50+ videos",
      description: "Step-by-step video guides covering all platform features"
    },
    {
      type: "Interactive Labs",
      count: "15+ labs", 
      description: "Hands-on exercises to practice automation concepts"
    },
    {
      type: "Certification Programs",
      count: "3 certifications",
      description: "Earn recognized certifications in AI automation"
    },
    {
      type: "Live Workshops",
      count: "Weekly sessions",
      description: "Join live training sessions with our experts"
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[#f5ede3] to-white dark:from-[#181512] dark:to-[#1c1916]">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Training Resources
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Master AI automation with our comprehensive training programs. From beginner tutorials 
              to advanced certification courses, we have everything you need to succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-3 rounded-md" asChild>
                <Link to="/get-started">Start Learning</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-md" asChild>
                <Link to="/contact">Schedule Live Training</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Featured Courses</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Structured learning paths to help you master AI automation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map((course, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-4 rounded-2xl bg-[#111111] mr-4">
                      <course.icon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">{course.title}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {course.duration}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.level === 'Beginner' ? 'bg-green-100 text-green-700' :
                          course.level === 'Intermediate' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {course.level}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">{course.description}</p>
                  <Button className="w-full bg-[#111111] hover:bg-[#222222] text-white">
                    Start Course
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Training Resources */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Learning Resources</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Multiple ways to learn and grow your automation skills
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resources.map((resource, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg text-center">
                <div className="p-3 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 w-fit mx-auto mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{resource.type}</h3>
                <p className="text-sm text-blue-600 font-medium mb-2">{resource.count}</p>
                <p className="text-gray-600 text-sm">{resource.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#f5ede3] text-[#111111] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Start Your Learning Journey</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Join thousands of professionals who have mastered AI automation with our training programs.
          </p>
          <Button size="lg" className="bg-[#111111] text-white hover:bg-[#222222] rounded-full py-3" asChild>
            <Link to="/get-started">
              Begin Training
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Training;
