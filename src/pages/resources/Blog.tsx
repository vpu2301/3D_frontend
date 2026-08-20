
import { ArrowRight, Calendar, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const Blog = () => {
  const posts = [
    {
      id: '1',
      title: 'The Future of Work: How AI is Reshaping Enterprise Operations',
      excerpt: 'Discover how artificial intelligence is transforming traditional business processes and giving teams unprecedented efficiency gains.',
      author: 'Sarah Chen',
      date: '2024-01-15',
      readTime: '8 min read',
      category: 'AI & Automation',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '2',
      title: 'Building Scalable Automation Workflows: Best Practices',
      excerpt: 'Learn how to design and implement automation workflows that grow with your business and deliver consistent results.',
      author: 'Michael Rodriguez',
      date: '2024-01-12',
      readTime: '6 min read',
      category: 'Workflow Design',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '3',
      title: 'ROI of Automation: Measuring Success in Digital Transformation',
      excerpt: 'Understand how to quantify the value of automation initiatives and build a compelling business case for stakeholders.',
      author: 'David Kim',
      date: '2024-01-10',
      readTime: '10 min read',
      category: 'Business Strategy',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '4',
      title: 'Security First: Protecting Your Automated Workflows',
      excerpt: 'Essential security considerations and best practices for implementing automation in enterprise environments.',
      author: 'Lisa Thompson',
      date: '2024-01-08',
      readTime: '7 min read',
      category: 'Security',
      image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '5',
      title: 'Customer Success Stories: Real-World Automation Wins',
      excerpt: 'See how leading companies are using automation to solve complex business challenges and drive growth.',
      author: 'Jennifer Walsh',
      date: '2024-01-05',
      readTime: '5 min read',
      category: 'Case Studies',
      image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    },
    {
      id: '6',
      title: 'Getting Started with AI Automation: A Beginner\'s Guide',
      excerpt: 'Everything you need to know to begin your automation journey, from planning to implementation.',
      author: 'Alex Park',
      date: '2024-01-03',
      readTime: '12 min read',
      category: 'Getting Started',
      image: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
    }
  ];

  const categories = ['All', 'AI & Automation', 'Workflow Design', 'Business Strategy', 'Security', 'Case Studies', 'Getting Started'];

  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-[color:var(--sand)] to-[color:var(--paper)] dark:from-[color:var(--bg)] dark:to-[color:var(--paper)]">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h1 className="text-6xl md:text-7xl font-light text-[color:var(--ink)] mb-8 tracking-tight leading-none">
              Insights &
              <span className="block font-medium text-[color:var(--ink)]">
                Resources
              </span>
            </h1>
            <p className="text-xl text-[color:var(--text-2)] mb-12 font-light leading-relaxed">
              Stay ahead of the curve with expert insights on AI automation, 
              workflow optimization, and the future of work.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="pb-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant={index === 0 ? "default" : "outline"}
                className={index === 0 ? "bg-[color:var(--ink)] hover:bg-[color:var(--text-2)] text-white" : "border-[color:var(--line)] text-[color:var(--ink)] hover:bg-[color:var(--sand)]"}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <Card className="border-0 shadow-2xl overflow-hidden bg-[color:var(--paper)] backdrop-blur-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="relative h-64 lg:h-auto">
                <img 
                  src={posts[0].image}
                  alt={posts[0].title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-[color:var(--blue)] text-white">Featured</Badge>
                </div>
              </div>
              <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                <Badge variant="outline" className="w-fit mb-4 bg-[color:var(--blue-100)] text-[color:var(--blue)] border-[color:var(--line)]">
                  {posts[0].category}
                </Badge>
                <h2 className="text-3xl font-medium text-[color:var(--ink)] mb-4 leading-tight">
                  {posts[0].title}
                </h2>
                <p className="text-[color:var(--text-2)] mb-6 leading-relaxed text-lg">
                  {posts[0].excerpt}
                </p>
                <div className="flex items-center gap-6 text-[color:var(--text-2)] text-sm mb-6">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    {posts[0].author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date(posts[0].date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    {posts[0].readTime}
                  </div>
                </div>
                <Button className="bg-[color:var(--ink)] hover:bg-[color:var(--text-2)] text-white w-fit">
                  Read Article
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </div>
          </Card>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.slice(1).map((post) => (
              <Card key={post.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 bg-[color:var(--paper)] backdrop-blur-sm overflow-hidden group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="outline" className="bg-[color:var(--paper)] text-[color:var(--ink)] border-[color:var(--line)]">
                      {post.category}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-medium text-[color:var(--ink)] mb-3 leading-tight group-hover:text-[color:var(--blue)] transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-[color:var(--text-2)] mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-[color:var(--text-2)] text-sm">
                    <div className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(post.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-20 bg-[color:var(--sand)] text-[color:var(--ink)] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Stay Updated</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Get the latest insights on AI automation and workflow optimization delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-[12px] text-[color:var(--ink)] border-0 focus:outline-none focus:ring-2 focus:ring-white/20"
            />
            <Button className="bg-[color:var(--ink)] text-white hover:bg-[color:var(--text-2)] px-8 py-3">
              Subscribe
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
