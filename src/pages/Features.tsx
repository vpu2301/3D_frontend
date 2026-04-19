
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Palette, MessageCircle, BarChart3, Mail, Target, Play, Building2, Globe, Shield, Zap } from 'lucide-react';

const Features = () => {
  useEffect(() => {
    console.log('Features: Component mounted and rendering');
    console.log('Features: Current location:', window.location.pathname);
  }, []);

  const coreModules = [
    {
      title: "Content Copilot",
      description: "Multilingual GPT-4-grade copy in your brand voice for posts, blogs, emails, and marketing materials.",
      icon: Bot,
      features: ["Brand voice training", "Multi-language support", "SEO optimization", "Content scheduling"],
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Visual Generator",
      description: "Create brand-consistent product images, social posts, and short video clips with 1-click AI generation.",
      icon: Palette,
      features: ["Product photography", "Social media visuals", "Video generation", "Brand consistency"],
      color: "from-green-500 to-green-600"
    },
    {
      title: "AI Chatbot", 
      description: "24/7 customer support for your website and Facebook with fine-tuned responses on your FAQs and products.",
      icon: MessageCircle,
      features: ["Always-on support", "FAQ integration", "Multi-platform deployment", "Lead qualification"],
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Growth Analytics",
      description: "Track engagement, measure performance, and get data-driven recommendations to increase your ROAS.",
      icon: BarChart3,
      features: ["Performance tracking", "ROAS optimization", "Smart recommendations", "A/B testing"],
      color: "from-[#111111] to-[#222222]"
    }
  ];

  const futureModules = [
    {
      title: "AI Email Responder",
      description: "Automated email campaigns and customer responses",
      icon: Mail,
      timeline: "Q2 2024"
    },
    {
      title: "Ad Budget Autopilot", 
      description: "Automated ad spend optimization across platforms",
      icon: Target,
      timeline: "Q2 2024"
    },
    {
      title: "Voice & Video Generation",
      description: "AI-powered voice-overs and video content creation",
      icon: Play,
      timeline: "Q3 2024"
    },
    {
      title: "Agency Marketplace",
      description: "Templates and tools marketplace for agencies",
      icon: Building2,
      timeline: "Q4 2024"
    }
  ];

  const benefits = [
    {
      title: "Save 20 Hours Per Week",
      description: "Automate the marketing tasks that currently take you hours every week",
      icon: Zap,
      stat: "20hrs",
      color: "text-blue-600"
    },
    {
      title: "Multilingual by Default",
      description: "Create content in multiple languages to reach global markets",
      icon: Globe,
      stat: "12+",
      color: "text-green-600"
    },
    {
      title: "GDPR Compliant",
      description: "EU hosting with SOC-2 certification and per-tenant encryption",
      icon: Shield,
      stat: "100%",
      color: "text-purple-600"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#181512]">
      <main className="pt-[60px]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Complete AI Marketing Suite for SMBs
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to automate content creation, customer service, and marketing optimization in one platform.
            </p>
          </div>

          {/* Core Modules */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Core AI Modules</h2>
              <p className="text-lg text-gray-600">Available in all plans from day one</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {coreModules.map((module, index) => (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow border-0 overflow-hidden">
                  <CardHeader className={`bg-gradient-to-r ${module.color} text-white`}>
                    <div className="flex items-center">
                      <module.icon className="h-8 w-8 mr-3" />
                      <CardTitle className="text-xl">{module.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-600 mb-6">{module.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {module.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center text-sm text-gray-700">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                          {feature}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Benefits Section */}
          <section className="mb-20 bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why SMBs Choose MarketMind AI</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <Card key={index} className="text-center border-0 shadow-sm bg-white">
                  <CardContent className="p-8">
                    <div className={`w-16 h-16 ${benefit.color.replace('text-', 'bg-').replace('600', '100')} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <benefit.icon className={`h-8 w-8 ${benefit.color}`} />
                    </div>
                    <div className={`text-3xl font-bold ${benefit.color} mb-2`}>
                      {benefit.stat}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Future Modules */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Coming Soon</h2>
              <p className="text-lg text-gray-600">Advanced features in development</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {futureModules.map((module, index) => (
                <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <module.icon className="h-6 w-6 text-gray-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{module.title}</h3>
                    <p className="text-sm text-gray-600 mb-3">{module.description}</p>
                    <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {module.timeline}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Technical Advantages */}
          <section className="mb-20">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Built for European SMBs</h2>
              <p className="text-lg text-gray-600">Privacy-first, multilingual, and compliant</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">GDPR Compliant</h3>
                <p className="text-gray-600">EU hosting, SOC-2 certified, per-tenant encryption</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Multilingual</h3>
                <p className="text-gray-600">Native support for 12+ European languages</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">High Performance</h3>
                <p className="text-gray-600">80%+ gross margin with proprietary AI models</p>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <div className="bg-white rounded-2xl p-12 text-center border border-black/8">
            <h2 className="text-3xl font-bold text-[#111111] mb-4">Ready to Automate Your Marketing?</h2>
            <p className="text-xl text-black/60 mb-8 max-w-2xl mx-auto">
              Join the AI marketing revolution and turn 20 hours of weekly marketing work into minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-[#111111] text-white hover:bg-[#222222] rounded-full" asChild>
                <Link to="/signup">
                  Start 14-Day Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-black/15 bg-white/70 text-[#111111] hover:bg-white rounded-full" asChild>
                <Link to="/watch-demo">
                  Watch Demo
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Features;
