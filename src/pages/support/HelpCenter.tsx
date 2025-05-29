
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Book, MessageCircle, Video, FileText, Phone, Mail, Users, ArrowRight, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const HelpCenter = () => {
  const categories = [
    {
      icon: Book,
      title: 'Getting Started',
      description: 'Learn the basics and get up and running quickly',
      articles: 12,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for all features',
      articles: 8,
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: FileText,
      title: 'Documentation',
      description: 'Comprehensive technical documentation',
      articles: 25,
      color: 'from-green-500 to-blue-500'
    },
    {
      icon: MessageCircle,
      title: 'FAQs',
      description: 'Frequently asked questions and answers',
      articles: 18,
      color: 'from-orange-500 to-red-500'
    }
  ];

  const popularArticles = [
    {
      title: 'How to create your first automation workflow',
      category: 'Getting Started',
      readTime: '5 min read',
      rating: 4.9
    },
    {
      title: 'Setting up integrations with third-party tools',
      category: 'Integrations',
      readTime: '8 min read',
      rating: 4.8
    },
    {
      title: 'Managing user permissions and access control',
      category: 'Security',
      readTime: '6 min read',
      rating: 4.7
    },
    {
      title: 'Troubleshooting common workflow errors',
      category: 'Troubleshooting',
      readTime: '10 min read',
      rating: 4.6
    }
  ];

  const supportOptions = [
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Get instant help from our support team',
      availability: '24/7 available',
      action: 'Start Chat'
    },
    {
      icon: Phone,
      title: 'Phone Support',
      description: 'Speak directly with our experts',
      availability: 'Mon-Fri 9AM-6PM EST',
      action: 'Call Now'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us your questions via email',
      availability: 'Response within 2 hours',
      action: 'Send Email'
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
            Help Center
          </h1>
          <p className="text-xl text-gray-600 mb-8 font-light">
            Find answers, get support, and learn how to make the most of our platform
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="Search for help articles, guides, and FAQs..." 
              className="pl-12 py-4 text-lg rounded-full border-2 border-gray-200 focus:border-blue-500"
            />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Browse by Category</h2>
            <p className="text-xl text-gray-600">Find the help you need organized by topic</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className={`p-4 rounded-2xl bg-gradient-to-r ${category.color} w-fit mx-auto mb-6`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{category.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{category.description}</p>
                  <span className="text-sm text-blue-600 font-medium">{category.articles} articles</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Popular Articles</h2>
            <p className="text-xl text-gray-600">Most helpful resources from our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {popularArticles.map((article, index) => (
              <div key={index} className="bg-gray-50 p-8 rounded-3xl hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-gray-600">{article.rating}</span>
                  </div>
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-3">{article.title}</h3>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">{article.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Need More Help?</h2>
            <p className="text-xl text-gray-600">Get personalized support from our expert team</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportOptions.map((option, index) => (
              <div key={index} className="bg-white p-8 rounded-3xl shadow-lg text-center">
                <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 w-fit mx-auto mb-6">
                  <option.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">{option.title}</h3>
                <p className="text-gray-600 mb-4">{option.description}</p>
                <p className="text-sm text-gray-500 mb-6">{option.availability}</p>
                <Button variant="outline" className="w-full">{option.action}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-3xl p-12 text-white text-center">
            <Users className="h-16 w-16 mx-auto mb-6 text-blue-400" />
            <h3 className="text-3xl font-light mb-6">Join Our Community</h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Connect with other users, share tips, and get help from the community
            </p>
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full py-3">
              Join Community Forum
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HelpCenter;
