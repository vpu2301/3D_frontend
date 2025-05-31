
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Target, 
  Eye, 
  Heart, 
  Users, 
  Award,
  ArrowRight,
  Building2,
  Globe,
  Lightbulb
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Target,
      title: "Innovation First",
      description: "We push the boundaries of what's possible with AI technology to deliver breakthrough solutions."
    },
    {
      icon: Heart,
      title: "Customer Success",
      description: "Your success is our success. We're committed to helping you achieve your business goals."
    },
    {
      icon: Users,
      title: "Collaboration",
      description: "We believe in the power of human-AI collaboration to create extraordinary outcomes."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in everything we do, from product quality to customer service."
    }
  ];

  const stats = [
    { number: "10,000+", label: "AI Employees Deployed" },
    { number: "500+", label: "Companies Served" },
    { number: "80%", label: "Average Time Savings" },
    { number: "24/7", label: "Availability" }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-light text-gray-900 mb-6 tracking-tight">
              About
              <span className="block text-blue-600">3days.ai</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-light">
              We're on a mission to democratize AI and make intelligent automation accessible to businesses of all sizes.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-3xl font-light text-gray-900">Our Mission</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  To empower businesses with AI employees that work seamlessly alongside human teams, 
                  automating repetitive tasks and amplifying human creativity and strategic thinking.
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <Eye className="h-6 w-6 text-purple-600" />
                  </div>
                  <h2 className="text-3xl font-light text-gray-900">Our Vision</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  A world where every business, regardless of size, has access to intelligent automation 
                  that drives growth, efficiency, and innovation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Trusted by Businesses Worldwide
              </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-4xl font-light text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The principles that guide everything we do
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white p-8 rounded-2xl shadow-sm">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-6 flex-shrink-0">
                      <value.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-gray-900 mb-3">{value.title}</h3>
                      <p className="text-gray-600">{value.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Company Info */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Founded</h3>
                <p className="text-gray-600">
                  Established in 2023 with a vision to revolutionize how businesses operate with AI.
                </p>
              </div>
              
              <div>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Globe className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Global Reach</h3>
                <p className="text-gray-600">
                  Serving businesses across 50+ countries with localized support and compliance.
                </p>
              </div>
              
              <div>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Innovation</h3>
                <p className="text-gray-600">
                  Continuous research and development to stay at the forefront of AI technology.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-light text-white mb-6">
              Ready to Join Our Mission?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Experience the future of work with AI employees that transform your business.
            </p>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg" asChild>
              <Link to="/get-started">
                Get Started Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default About;
