
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Headphones, MessageCircle, Clock, Star } from 'lucide-react';

const Support = () => {
  useEffect(() => {
    console.log('Support: Component mounted and rendering');
    console.log('Support: Current location:', window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI-Powered Customer Support
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Deliver exceptional customer experiences with intelligent support automation. 
              Reduce response times, improve satisfaction, and scale your support with AI assistants.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="shadow-lg">
              <CardHeader>
                <Headphones className="h-8 w-8 text-blue-600 mb-2" />
                <CardTitle>24/7 AI Chat Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Intelligent chatbots that provide instant, accurate responses to customer inquiries around the clock.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <MessageCircle className="h-8 w-8 text-green-600 mb-2" />
                <CardTitle>Ticket Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Automated ticket routing, prioritization, and resolution with AI-powered categorization.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Clock className="h-8 w-8 text-purple-600 mb-2" />
                <CardTitle>Response Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  AI-suggested responses and knowledge base recommendations to reduce resolution time.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Star className="h-8 w-8 text-orange-600 mb-2" />
                <CardTitle>Customer Sentiment Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Real-time sentiment monitoring to identify and address customer satisfaction issues proactively.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <Headphones className="h-8 w-8 text-red-600 mb-2" />
                <CardTitle>Escalation Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Intelligent escalation workflows that ensure complex issues reach the right specialists quickly.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <MessageCircle className="h-8 w-8 text-indigo-600 mb-2" />
                <CardTitle>Multi-channel Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Unified support across email, chat, phone, and social media with consistent AI assistance.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700" asChild>
              <Link to="/signup">
                Transform Your Support
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Support;
