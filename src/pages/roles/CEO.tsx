
import { TrendingUp, Users, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const CEO = () => {
  return (
    <div className="min-h-screen dark:bg-[color:var(--bg)]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[color:var(--blue-100)] to-[color:var(--blue-100)] pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-[color:var(--blue)] p-4 rounded-[28px]">
                <TrendingUp className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[color:var(--ink)] mb-6">
              AI Solutions
              <span className="text-[color:var(--blue)] block">for CEOs</span>
            </h1>
            <p className="text-xl text-[color:var(--text-2)] mb-8 max-w-3xl mx-auto">
              Transform your organization with AI-powered automation that drives growth, reduces costs, and creates competitive advantages.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[color:var(--blue)] hover:bg-[color:var(--blue)]" asChild>
                <Link to="/get-started">Drive Growth <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/schedule-demo">Schedule Executive Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Key Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[color:var(--ink)] mb-4">
              Strategic Impact for Leaders
            </h2>
            <p className="text-xl text-[color:var(--text-2)]">
              Focus on strategy while AI handles operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[color:var(--blue-100)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-[color:var(--blue)]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">30% Cost Reduction</h3>
              <p className="text-[color:var(--text-2)]">
                Reduce operational costs while maintaining quality and increasing output capacity.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[color:var(--blue-100)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-[color:var(--blue)]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Team Productivity</h3>
              <p className="text-[color:var(--text-2)]">
                Free your team from repetitive tasks to focus on strategic, high-value work.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[color:var(--blue-100)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-[color:var(--blue)]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Faster Decisions</h3>
              <p className="text-[color:var(--text-2)]">
                Get real-time insights and automated reporting for faster, data-driven decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[color:var(--ink)] py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Lead the AI Revolution?
          </h2>
          <p className="text-xl text-[color:var(--text-4)] mb-8">
            Join forward-thinking CEOs who are already transforming their organizations with AI.
          </p>
          <Button size="lg" className="bg-[color:var(--blue)] hover:bg-[color:var(--blue)]" asChild>
            <Link to="/schedule-demo">Schedule Executive Briefing</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CEO;
