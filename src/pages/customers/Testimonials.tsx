import { Star, Quote, Building2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      title: "CEO",
      company: "TechCorp Solutions",
      quote: "3days.ai transformed our operations completely. What used to take our team 40 hours per week now happens automatically with 99.5% accuracy. The ROI was immediate.",
      rating: 5,
      avatar: "SJ"
    },
    {
      name: "Michael Chen",
      title: "Operations Director",
      company: "Global Marketing Inc.",
      quote: "The AI Marketing Assistant has revolutionized our content creation process. We're producing 300% more content while maintaining quality and seeing 60% better campaign performance.",
      rating: 5,
      avatar: "MC"
    },
    {
      name: "Emily Rodriguez",
      title: "Customer Success Manager",
      company: "CustomerFirst Support",
      quote: "Our AI Customer Support Agent handles 70% of our tickets automatically. Our human agents can now focus on complex issues while customers get instant help 24/7.",
      rating: 5,
      avatar: "ER"
    },
    {
      name: "David Thompson",
      title: "CFO",
      company: "FinanceFlow Corp",
      quote: "The AI Finance Assistant has streamlined our entire financial workflow. Invoice processing that took days now happens in minutes, and our compliance monitoring is flawless.",
      rating: 5,
      avatar: "DT"
    },
    {
      name: "Lisa Park",
      title: "HR Director",
      company: "PeopleFirst Inc.",
      quote: "From recruitment to employee engagement, our AI assistants have transformed HR operations. We're more strategic now, focusing on people while AI handles the processes.",
      rating: 5,
      avatar: "LP"
    },
    {
      name: "Robert Kim",
      title: "IT Director",
      company: "SecureTech Solutions",
      quote: "The security and reliability of 3days.ai's AI agents give us confidence to automate critical processes. The monitoring and safety measures are enterprise-grade.",
      rating: 5,
      avatar: "RK"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star 
        key={index} 
        className={`h-5 w-5 ${index < rating ? 'text-[color:var(--blue)] fill-current' : 'text-[color:var(--text-4)]'}`} 
      />
    ));
  };

  return (
    <div className="min-h-screen dark:bg-[color:var(--bg)]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[color:var(--blue-100)] to-[color:var(--blue-100)] pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-[color:var(--blue)] p-4 rounded-[28px]">
                <Quote className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[color:var(--ink)] mb-6">
              Customer
              <span className="text-[color:var(--blue)] block">Testimonials</span>
            </h1>
            <p className="text-xl text-[color:var(--text-2)] mb-8 max-w-3xl mx-auto">
              Hear from business leaders who have transformed their operations with our AI automation solutions.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="h-full">
                <CardContent className="p-6 h-full flex flex-col">
                  <div className="flex items-center mb-4">
                    {renderStars(testimonial.rating)}
                  </div>
                  <blockquote className="text-[color:var(--text-2)] mb-6 flex-grow">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="flex items-center space-x-4">
                    <div className="bg-[color:var(--blue-100)] w-12 h-12 rounded-full flex items-center justify-center">
                      <span className="text-[color:var(--blue)] font-semibold text-sm">{testimonial.avatar}</span>
                    </div>
                    <div>
                      <div className="font-semibold text-[color:var(--ink)]">{testimonial.name}</div>
                      <div className="text-sm text-[color:var(--text-2)]">{testimonial.title}</div>
                      <div className="text-sm text-[color:var(--text-2)]">{testimonial.company}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-[color:var(--sand)] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[color:var(--ink)] mb-4">
              Trusted by Industry Leaders
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[color:var(--blue)] mb-2">500+</div>
              <div className="text-[color:var(--text-2)]">Companies Transformed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[color:var(--blue)] mb-2">98%</div>
              <div className="text-[color:var(--text-2)]">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[color:var(--blue)] mb-2">$50M+</div>
              <div className="text-[color:var(--text-2)]">Total Cost Savings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[color:var(--blue)] mb-2">24/7</div>
              <div className="text-[color:var(--text-2)]">AI Agent Availability</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[color:var(--ink)] py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Join Our Success Stories
          </h2>
          <p className="text-xl text-[color:var(--text-4)] mb-8">
            Experience the same transformation these industry leaders achieved.
          </p>
          <Button size="lg" className="bg-[color:var(--blue)] hover:bg-[color:var(--blue)]" asChild>
            <Link to="/get-started">Start Your Journey <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Testimonials;
