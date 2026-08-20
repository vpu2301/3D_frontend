import { Database, Zap, Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const DataEntry = () => {
  return (
    <div className="min-h-screen dark:bg-[color:var(--bg)]">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[color:var(--blue-100)] to-[color:var(--blue-100)] pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-[color:var(--blue)] p-4 rounded-[28px]">
                <Database className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-[color:var(--ink)] mb-6">
              Data Entry
              <span className="text-[color:var(--blue)] block">Automation</span>
            </h1>
            <p className="text-xl text-[color:var(--text-2)] mb-8 max-w-3xl mx-auto">
              Eliminate manual data entry with AI-powered automation that's faster, more accurate, and never gets tired.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[color:var(--blue)] hover:bg-[color:var(--blue)]" asChild>
                <Link to="/get-started">Automate Data Entry <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/watch-demo">See It in Action</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[color:var(--ink)] mb-4">
              Transform Your Data Entry Process
            </h2>
            <p className="text-xl text-[color:var(--text-2)]">
              Say goodbye to tedious manual work and human errors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-[color:var(--blue-100)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-[color:var(--blue)]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">10x Faster</h3>
              <p className="text-[color:var(--text-2)]">
                Process data entry tasks in minutes instead of hours with intelligent automation.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[color:var(--blue-100)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Database className="h-8 w-8 text-[color:var(--blue)]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">99.9% Accuracy</h3>
              <p className="text-[color:var(--text-2)]">
                Eliminate human errors with AI-powered data validation and verification systems.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-[color:var(--blue-100)] w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="h-8 w-8 text-[color:var(--blue)]" />
              </div>
              <h3 className="text-xl font-semibold mb-4">24/7 Processing</h3>
              <p className="text-[color:var(--text-2)]">
                Continuous data processing that works around the clock without breaks or downtime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[color:var(--ink)] py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Eliminate Manual Data Entry?
          </h2>
          <p className="text-xl text-[color:var(--text-4)] mb-8">
            Join companies saving hundreds of hours per month on data entry tasks.
          </p>
          <Button size="lg" className="bg-[color:var(--blue)] hover:bg-[color:var(--blue)]" asChild>
            <Link to="/get-started">Start Automating</Link>
          </Button>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default DataEntry;
