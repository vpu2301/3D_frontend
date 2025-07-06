
import { useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star, Users, Building2, Zap, Network, Globe, BarChart3, MessageCircle, Bot, Palette } from 'lucide-react';

const Home = () => {
  useEffect(() => {
    console.log('Home: Component mounted and rendering');
    console.log('Home: Current location:', window.location.pathname);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-light text-gray-900 mb-6 tracking-tight">
              AI Growth Team
              <span className="block text-blue-600">in a Box</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto font-light leading-relaxed">
              Turn 20 hours per week of marketing work into minutes. MarketMind AI automates content creation, 
              ad visuals, customer service chat, and campaign optimization for SMBs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all" asChild>
                <Link to="/signup">
                  Start 14-Day Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-4 text-lg rounded-full border-2 hover:bg-gray-50" asChild>
                <Link to="/watch-demo">
                  Watch Demo
                </Link>
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">91% of AI-using SMBs say it directly fuels growth</p>
          </div>
        </section>

        {/* Core Modules Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-gray-900 mb-4">
                Complete AI Marketing Suite
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Everything you need to automate your marketing and grow your business
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-6">
                  <Bot className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Content Copilot</h3>
                <p className="text-gray-600 mb-4">
                  Multilingual GPT-4-grade copy in your brand voice for posts, blogs, and emails.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Brand voice training</li>
                  <li>• Multi-language support</li>
                  <li>• SEO optimization</li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-6">
                  <Palette className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Visual Generator</h3>
                <p className="text-gray-600 mb-4">
                  Product images, social posts, and short clips with 1-click AI generation.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Brand-consistent visuals</li>
                  <li>• Product photography</li>
                  <li>• Video generation</li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                  <MessageCircle className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">AI Chatbot</h3>
                <p className="text-gray-600 mb-4">
                  24/7 customer support for your website and Facebook with fine-tuned responses.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Always-on support</li>
                  <li>• FAQ integration</li>
                  <li>• Multi-platform</li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-6">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-4">Growth Analytics</h3>
                <p className="text-gray-600 mb-4">
                  Track engagement and get data-driven recommendations to increase ROAS.
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Performance tracking</li>
                  <li>• ROAS optimization</li>
                  <li>• Smart recommendations</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Preview Section */}
        <section className="py-20 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-light text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Choose the plan that fits your business size and needs
            </p>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <h3 className="text-xl font-medium text-gray-900 mb-2">Starter</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">€49<span className="text-lg font-normal text-gray-600">/mo</span></div>
                <p className="text-gray-600 mb-6">Perfect for solo founders</p>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>• 200k text tokens</li>
                  <li>• 100 AI images</li>
                  <li>• Basic chatbot</li>
                  <li>• Growth analytics</li>
                </ul>
              </div>
              
              <div className="bg-blue-600 text-white p-8 rounded-2xl shadow-lg transform scale-105">
                <h3 className="text-xl font-medium mb-2">Growth</h3>
                <div className="text-3xl font-bold mb-4">€99<span className="text-lg font-normal opacity-80">/mo</span></div>
                <p className="opacity-90 mb-6">For growing teams (5-15 people)</p>
                <ul className="text-sm space-y-2 text-left opacity-90">
                  <li>• 1M text tokens</li>
                  <li>• 500 AI images</li>
                  <li>• Advanced chatbot</li>
                  <li>• Full analytics suite</li>
                </ul>
              </div>
              
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <h3 className="text-xl font-medium text-gray-900 mb-2">Pro</h3>
                <div className="text-3xl font-bold text-gray-900 mb-4">€199<span className="text-lg font-normal text-gray-600">/mo</span></div>
                <p className="text-gray-600 mb-6">For agencies & multi-brand</p>
                <ul className="text-sm text-gray-600 space-y-2 text-left">
                  <li>• 3M text tokens</li>
                  <li>• 1k AI images</li>
                  <li>• API access</li>
                  <li>• White-label options</li>
                </ul>
              </div>
            </div>
            
            <p className="text-sm text-gray-500 mt-8">14-day free trial • Annual billing saves 15%</p>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-light text-gray-900 mb-4">
              Trusted by SMBs Across Europe
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Join thousands of businesses automating their marketing with AI
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">91%</div>
                <p className="text-gray-600">of AI-using SMBs report direct growth impact</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-2">20hrs</div>
                <p className="text-gray-600">per week saved on marketing tasks</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">85%</div>
                <p className="text-gray-600">of customer service leaders adopting GenAI</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-blue-600">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-light text-white mb-6">
              Ready to Transform Your Marketing?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join the AI marketing revolution and turn hours of work into minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg rounded-full shadow-lg" asChild>
                <Link to="/signup">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
