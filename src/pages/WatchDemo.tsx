
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Clock, Users, CheckCircle } from 'lucide-react';

const WatchDemo = () => {
  const [selectedDemo, setSelectedDemo] = useState('overview');

  const demos = [
    {
      id: 'overview',
      title: 'Platform Overview',
      duration: '5 min',
      description: 'Get a comprehensive overview of 3days.ai and its key features',
      thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=500&h=300&fit=crop'
    },
    {
      id: 'automation',
      title: 'AI Automation in Action',
      duration: '8 min',
      description: 'See how our AI identifies and automates repetitive tasks',
      thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=500&h=300&fit=crop'
    },
    {
      id: 'workflow',
      title: 'Building Workflows',
      duration: '6 min',
      description: 'Learn how to create custom workflows with our visual builder',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop'
    },
    {
      id: 'integration',
      title: 'Integration Setup',
      duration: '4 min',
      description: 'Connect your existing tools in just a few clicks',
      thumbnail: 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=500&h=300&fit=crop'
    }
  ];

  const benefits = [
    'No installation required',
    'See real use cases',
    'Interactive walkthrough',
    'Q&A with experts'
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
            Watch Demo
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light">
            See 3days.ai in action with our interactive demos and live sessions.
          </p>
        </div>

        {/* Main Demo Video */}
        <div className="mb-20">
          <Card className="border-0 shadow-2xl overflow-hidden">
            <div className="relative">
              <img 
                src={demos.find(d => d.id === selectedDemo)?.thumbnail}
                alt="Demo thumbnail"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Button 
                  size="lg"
                  className="bg-white text-black hover:bg-gray-100 rounded-full px-8 py-4"
                >
                  <Play className="mr-3 h-6 w-6" />
                  Play Demo
                </Button>
              </div>
            </div>
            <CardContent className="p-8">
              <h3 className="text-2xl font-medium mb-4">
                {demos.find(d => d.id === selectedDemo)?.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {demos.find(d => d.id === selectedDemo)?.description}
              </p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-2" />
                {demos.find(d => d.id === selectedDemo)?.duration}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Demo Selection */}
        <div className="mb-20">
          <h2 className="text-3xl font-light text-gray-900 mb-8 text-center">
            Choose Your Demo Experience
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {demos.map((demo) => (
              <Card 
                key={demo.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  selectedDemo === demo.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedDemo(demo.id)}
              >
                <div className="relative">
                  <img 
                    src={demo.thumbnail}
                    alt={demo.title}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-t-lg flex items-center justify-center">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-2">{demo.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{demo.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {demo.duration}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Live Demo CTA */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-50 to-purple-50">
            <CardContent className="p-8">
              <Users className="h-12 w-12 text-blue-500 mb-6" />
              <h3 className="text-2xl font-medium mb-4">Schedule a Live Demo</h3>
              <p className="text-gray-600 mb-6">
                Get a personalized demo tailored to your specific use case and industry.
              </p>
              <div className="space-y-3 mb-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
              <Button className="w-full bg-black hover:bg-gray-800 text-white rounded-full">
                Schedule Live Demo
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-xl">
            <CardContent className="p-8">
              <Play className="h-12 w-12 text-purple-500 mb-6" />
              <h3 className="text-2xl font-medium mb-4">Self-Guided Tour</h3>
              <p className="text-gray-600 mb-6">
                Explore the platform at your own pace with our interactive product tour.
              </p>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Interactive tutorials</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">Sample data included</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">No signup required</span>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                </div>
              </div>
              <Button variant="outline" className="w-full rounded-full">
                Start Interactive Tour
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WatchDemo;
