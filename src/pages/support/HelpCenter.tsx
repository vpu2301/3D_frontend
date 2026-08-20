import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search, Book, MessageCircle, Video, FileText, Phone, Mail, Users, ArrowRight, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const HelpCenter = () => {
  const categories = [
    {
      icon: Book,
      title: 'Getting Started',
      description: 'Learn the basics and get up and running quickly',
      articles: 12,
      color: 'from-[color:var(--blue)] to-[color:var(--blue)]'
    },
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Step-by-step video guides for all features',
      articles: 8,
      color: 'from-[color:var(--blue)] to-[color:var(--text-2)]'
    },
    {
      icon: FileText,
      title: 'Documentation',
      description: 'Comprehensive technical documentation',
      articles: 25,
      color: 'from-[color:var(--blue)] to-[color:var(--blue)]'
    },
    {
      icon: MessageCircle,
      title: 'FAQs',
      description: 'Frequently asked questions and answers',
      articles: 18,
      color: 'from-[color:var(--ink)] to-[color:var(--text-2)]'
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
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[color:var(--sand)] to-[color:var(--paper)] dark:from-[color:var(--bg)] dark:to-[color:var(--paper)]">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-light text-[color:var(--ink)] mb-6 tracking-tight">
            Help Center
          </h1>
          <p className="text-xl text-[color:var(--text-2)] mb-8 font-light">
            Find answers, get support, and learn how to make the most of our platform
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-4 h-5 w-5 text-[color:var(--text-2)]" />
            <Input 
              placeholder="Search for help articles, guides, and FAQs..." 
              className="pl-12 py-4 text-lg rounded-full border-[color:var(--line)] focus:border-[color:var(--ink)]"
            />
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Browse by Category</h2>
            <p className="text-xl text-[color:var(--text-2)]">Find the help you need organized by topic</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className={`p-4 rounded-[28px] bg-gradient-to-r ${category.color} w-fit mx-auto mb-6`}>
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-[color:var(--ink)] mb-4">{category.title}</h3>
                  <p className="text-[color:var(--text-2)] mb-4 leading-relaxed">{category.description}</p>
                  <span className="text-sm text-[color:var(--blue)] font-medium">{category.articles} articles</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 px-4 bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Popular Articles</h2>
            <p className="text-xl text-[color:var(--text-2)]">Most helpful resources from our community</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {popularArticles.map((article, index) => (
              <div key={index} className="bg-[color:var(--sand)] p-8 rounded-[28px] hover:bg-[color:var(--sand)] transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-4">
                  <span className="px-3 py-1 bg-[color:var(--blue-100)] text-[color:var(--blue)] rounded-full text-sm font-medium">
                    {article.category}
                  </span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-[color:var(--blue)] mr-1" />
                    <span className="text-sm text-[color:var(--text-2)]">{article.rating}</span>
                  </div>
                </div>
                <h3 className="text-xl font-medium text-[color:var(--ink)] mb-3">{article.title}</h3>
                <div className="flex items-center text-[color:var(--text-2)]">
                  <Clock className="h-4 w-4 mr-2" />
                  <span className="text-sm">{article.readTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Options */}
      <section className="py-20 px-4 bg-[color:var(--sand)]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-[color:var(--ink)] mb-6">Need More Help?</h2>
            <p className="text-xl text-[color:var(--text-2)]">Get personalized support from our expert team</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportOptions.map((option, index) => (
              <div key={index} className="bg-[color:var(--paper)] p-8 rounded-[28px] shadow-lg text-center">
                <div className="p-4 rounded-[28px] bg-[color:var(--ink)] w-fit mx-auto mb-6">
                  <option.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-medium text-[color:var(--ink)] mb-4">{option.title}</h3>
                <p className="text-[color:var(--text-2)] mb-4">{option.description}</p>
                <p className="text-sm text-[color:var(--text-2)] mb-6">{option.availability}</p>
                <Button variant="outline" className="w-full">{option.action}</Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20 px-4 bg-[color:var(--paper)]">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[color:var(--paper)] rounded-[28px] p-12 text-[color:var(--ink)] border border-[color:var(--line)] text-center">
            <Users className="h-16 w-16 mx-auto mb-6 text-[color:var(--blue)]" />
            <h3 className="text-3xl font-light mb-6">Join Our Community</h3>
            <p className="text-xl text-[color:var(--text-2)] mb-8 max-w-2xl mx-auto">
              Connect with other users, share tips, and get help from the community
            </p>
            <Button size="lg" className="bg-[color:var(--ink)] text-white hover:bg-[color:var(--text-2)] rounded-full py-3">
              Join Community Forum
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default HelpCenter;
