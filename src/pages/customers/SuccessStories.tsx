import { Star, TrendingUp, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const SuccessStories = () => {
  const stories = [
    {
      company: "TechCorp Solutions",
      industry: "Technology",
      results: "75% reduction in processing time",
      quote: "3days.ai transformed our operations. We're now processing documents 10x faster with perfect accuracy.",
      logo: "TC",
      savings: "$2.3M annually"
    },
    {
      company: "Global Finance Ltd",
      industry: "Financial Services",
      results: "90% error reduction",
      quote: "The AI automation has eliminated manual errors and freed our team to focus on strategic initiatives.",
      logo: "GF",
      savings: "$1.8M annually"
    },
    {
      company: "Healthcare Partners",
      industry: "Healthcare",
      results: "60% faster patient onboarding",
      quote: "Patient onboarding that used to take hours now happens in minutes, improving our patient experience dramatically.",
      logo: "HP",
      savings: "$950K annually"
    }
  ];

  return (
    <div className="min-h-screen dark:bg-[color:var(--bg)]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[color:var(--blue-100)] to-[color:var(--blue-100)] pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-[color:var(--blue)] p-4 rounded-[28px]">
                <Star className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[color:var(--ink)] mb-6">
              Customer Success
              <span className="text-[color:var(--blue)] block">Stories</span>
            </h1>
            <p className="text-xl text-[color:var(--text-2)] mb-8 max-w-3xl mx-auto">
              Discover how leading companies are transforming their operations and achieving remarkable results with 3days.ai.
            </p>
            <Button size="lg" className="bg-[color:var(--blue)] hover:bg-[color:var(--blue)]" asChild>
              <Link to="/get-started">Start Your Success Story <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {stories.map((story, index) => (
              <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12`}>
                <div className="flex-1">
                  <div className="bg-[color:var(--paper)] p-8 rounded-[28px] shadow-lg border border-[color:var(--line)]">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-[color:var(--ink)] rounded-[16px] flex items-center justify-center text-white font-bold mr-4">
                        {story.logo}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-[color:var(--ink)]">{story.company}</h3>
                        <p className="text-[color:var(--text-2)]">{story.industry}</p>
                      </div>
                    </div>
                    <blockquote className="text-lg text-[color:var(--ink)] mb-6 italic">
                      "{story.quote}"
                    </blockquote>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-[color:var(--blue-100)] p-4 rounded-[16px]">
                        <p className="text-sm text-[color:var(--blue)] font-medium">Key Result</p>
                        <p className="text-lg font-semibold text-[color:var(--ink)]">{story.results}</p>
                      </div>
                      <div className="bg-[color:var(--blue-100)] p-4 rounded-[16px]">
                        <p className="text-sm text-[color:var(--blue)] font-medium">Annual Savings</p>
                        <p className="text-lg font-semibold text-[color:var(--ink)]">{story.savings}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="text-center">
                      <div className="bg-[color:var(--blue-100)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="h-8 w-8 text-[color:var(--blue)]" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2">Productivity Boost</h4>
                      <p className="text-[color:var(--text-2)]">Average 3x improvement in task completion speed</p>
                    </div>
                    <div className="text-center">
                      <div className="bg-[color:var(--blue-100)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="h-8 w-8 text-[color:var(--blue)]" />
                      </div>
                      <h4 className="text-lg font-semibold mb-2">Time Savings</h4>
                      <p className="text-[color:var(--text-2)]">Reclaim 3+ days per week for strategic work</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[color:var(--sand)] py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-[color:var(--ink)] mb-6">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl text-[color:var(--text-2)] mb-8">
            Join hundreds of companies already transforming their operations with AI automation.
          </p>
          <Button size="lg" className="bg-[color:var(--blue)] hover:bg-[color:var(--blue)]" asChild>
            <Link to="/get-started">Get Started Today</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default SuccessStories;
