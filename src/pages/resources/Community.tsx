
import { Users, ArrowRight, MessageCircle, Heart, Star, Trophy, TrendingUp, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Community = () => {
  const stats = [
    {
      icon: Users,
      number: "10,000+",
      label: "Active Members"
    },
    {
      icon: MessageCircle,
      number: "50,000+", 
      label: "Discussions"
    },
    {
      icon: Heart,
      number: "95%",
      label: "Satisfaction Rate"
    },
    {
      icon: TrendingUp,
      number: "24/7",
      label: "Community Support"
    }
  ];

  const categories = [
    {
      name: "Getting Started",
      icon: Star,
      posts: 1200,
      description: "New to automation? Start here for beginner guides and tips"
    },
    {
      name: "Workflow Sharing",
      icon: MessageCircle,
      posts: 3400,
      description: "Share and discover automation workflows from the community"
    },
    {
      name: "Technical Support",
      icon: Users,
      posts: 2100,
      description: "Get help with technical issues and troubleshooting"
    },
    {
      name: "Feature Requests",
      icon: Trophy,
      posts: 800,
      description: "Suggest new features and vote on community proposals"
    }
  ];

  const recentTopics = [
    {
      title: "Best practices for document automation workflows",
      author: "Alex Chen",
      replies: 24,
      time: "2 hours ago",
      category: "Workflow Sharing"
    },
    {
      title: "How to set up multi-step approval processes?",
      author: "Sarah Johnson",
      replies: 15,
      time: "4 hours ago", 
      category: "Getting Started"
    },
    {
      title: "Integration issues with Salesforce connector",
      author: "Mike Rodriguez",
      replies: 8,
      time: "6 hours ago",
      category: "Technical Support"
    },
    {
      title: "Request: Advanced scheduling features",
      author: "Emma Wilson",
      replies: 32,
      time: "1 day ago",
      category: "Feature Requests"
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[#f5ede3] to-white dark:from-[#181512] dark:to-[#1c1916]">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Community Forum
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Connect with fellow automation enthusiasts, share workflows, get expert help, 
              and stay updated with the latest automation trends and best practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-3 rounded-md" asChild>
                <Link to="/get-started">Join Community</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-md" asChild>
                <Link to="/contact">Browse Discussions</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Thriving Community</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of automation professionals sharing knowledge and experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="p-4 rounded-2xl bg-[#111111] w-fit mx-auto mb-6">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Forum Categories */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Forum Categories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore different topics and find the discussions that matter to you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-blue-500 mr-4">
                      <category.icon className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-900 mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-500">{category.posts} posts</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-6">{category.description}</p>
                  <Button variant="outline" className="w-full">
                    View Category
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Topics */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Recent Discussions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay up to date with the latest community conversations
            </p>
          </div>

          <div className="space-y-6">
            {recentTopics.map((topic, index) => (
              <div key={index} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-grow">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                        {topic.category}
                      </span>
                      <span className="text-xs text-gray-500 flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {topic.time}
                      </span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-blue-600 cursor-pointer">
                      {topic.title}
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>by {topic.author}</span>
                      <span className="flex items-center">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {topic.replies} replies
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" className="px-8 py-3">
              View All Discussions
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#f5ede3] text-[#111111] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Join the Conversation</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Become part of our growing community and accelerate your automation journey.
          </p>
          <Button size="lg" className="bg-[#111111] text-white hover:bg-[#222222] rounded-full py-3" asChild>
            <Link to="/get-started">
              Join Forum
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Community;
