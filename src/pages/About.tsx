
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Target, Zap, Globe } from 'lucide-react';

const About = () => {
  useEffect(() => {
    console.log('About: Component mounted and rendering');
    console.log('About: Current location:', window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-[color:var(--paper)] dark:bg-[color:var(--bg)]">
      <main className="pt-[60px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-[color:var(--ink)] mb-4">
              About 3days.ai
            </h1>
            <p className="text-xl text-[color:var(--text-2)] max-w-3xl mx-auto">
              We're on a mission to revolutionize how businesses operate by providing 
              intelligent AI employees that work alongside human teams.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-3xl font-bold text-[color:var(--ink)] mb-6">Our Mission</h2>
              <p className="text-lg text-[color:var(--text-2)] mb-6">
                At 3days.ai, we believe that every business should have access to intelligent 
                automation that enhances human potential rather than replacing it. Our AI employees 
                are designed to handle repetitive tasks, analyze complex data, and provide insights 
                that help teams focus on strategic, creative work.
              </p>
              <p className="text-lg text-[color:var(--text-2)]">
                Founded in 2024, we've already helped thousands of companies reclaim valuable time 
                and resources, allowing them to scale efficiently and compete in the digital age.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[color:var(--blue-100)] to-[color:var(--blue-100)] p-8 rounded-[28px]">
              <h3 className="text-2xl font-bold text-[color:var(--ink)] mb-4">Why "3days"?</h3>
              <p className="text-[color:var(--text-2)] mb-4">
                Our name reflects our core promise: give you back three workdays per week. 
                Through intelligent automation, our AI employees handle routine tasks so your 
                team can focus on what matters most.
              </p>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-[color:var(--blue)]" />
                <span className="text-sm text-[color:var(--text-2)]">40% increase in team productivity</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            <Card className="text-center">
              <CardHeader>
                <Target className="h-12 w-12 text-[color:var(--blue)] mx-auto mb-4" />
                <CardTitle>Innovation First</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[color:var(--text-2)]">
                  Cutting-edge AI technology that stays ahead of industry trends and delivers real results.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Users className="h-12 w-12 text-[color:var(--blue)] mx-auto mb-4" />
                <CardTitle>Human-Centered</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[color:var(--text-2)]">
                  AI that enhances human capabilities, designed with empathy and understanding of real workplace needs.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Zap className="h-12 w-12 text-[color:var(--blue)] mx-auto mb-4" />
                <CardTitle>Speed & Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[color:var(--text-2)]">
                  Fast implementation and immediate impact, delivering results from day one of deployment.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <Globe className="h-12 w-12 text-[color:var(--ink)] mx-auto mb-4" />
                <CardTitle>Global Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[color:var(--text-2)]">
                  Empowering businesses worldwide to achieve more with intelligent automation solutions.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center bg-gradient-to-r from-[color:var(--blue)] to-[color:var(--blue)] rounded-[28px] p-12 text-white">
            <h2 className="text-3xl font-bold mb-4">Join the AI Revolution</h2>
            <p className="text-xl mb-8 text-[color:var(--blue)]">
              Ready to transform your business with AI employees? Start your journey today.
            </p>
            <Button size="lg" className="bg-[color:var(--paper)] text-[color:var(--blue)] hover:bg-[color:var(--sand)]" asChild>
              <Link to="/signup">
                Get Started Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default About;
