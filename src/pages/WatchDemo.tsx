
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play, CheckCircle, Clock, Users, Zap } from 'lucide-react';

const WatchDemo = () => {
  const [selectedDemo, setSelectedDemo] = useState('overview');

  const demos = [
    {
      id: 'overview',
      title: 'Platform Overview',
      duration: '5:30',
      description: 'Complete walkthrough of the 3days.ai platform',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      features: ['Dashboard tour', 'AI employee creation', 'Basic workflows']
    },
    {
      id: 'customer-service',
      title: 'Customer Service AI',
      duration: '8:15',
      description: 'See how our AI handles customer inquiries automatically',
      thumbnail: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop',
      features: ['Ticket automation', 'Response generation', 'Escalation handling']
    },
    {
      id: 'sales-automation',
      title: 'Sales Process Automation',
      duration: '7:45',
      description: 'Automate lead qualification and follow-ups',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
      features: ['Lead scoring', 'Email sequences', 'CRM integration']
    },
    {
      id: 'data-processing',
      title: 'Data Processing & Analysis',
      duration: '6:20',
      description: 'Transform raw data into actionable insights',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      features: ['Data extraction', 'Report generation', 'Trend analysis']
    }
  ];

  const benefits = [
    {
      icon: Clock,
      title: "Save 80% of Time",
      description: "Automate repetitive tasks instantly"
    },
    {
      icon: Users,
      title: "Scale Your Team",
      description: "Add AI employees without overhead"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "See improvements from day one"
    }
  ];

  const currentDemo = demos.find(demo => demo.id === selectedDemo);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Watch 3days.ai in Action
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how businesses are transforming their operations with AI employees. 
            Choose a demo that matches your use case.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Demo Selection */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Demo</h2>
            <div className="space-y-4">
              {demos.map((demo) => (
                <Card 
                  key={demo.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedDemo === demo.id ? 'ring-2 ring-blue-500' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedDemo(demo.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{demo.title}</h3>
                      <Badge variant="outline">{demo.duration}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{demo.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {demo.features.map((feature, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Video Player */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {currentDemo?.title}
                  <Badge>{currentDemo?.duration}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative bg-black rounded-lg overflow-hidden mb-6">
                  <img 
                    src={currentDemo?.thumbnail}
                    alt={currentDemo?.title}
                    className="w-full h-64 md:h-96 object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Button size="lg" className="rounded-full h-16 w-16 p-0">
                      <Play className="h-8 w-8" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    What You'll Learn:
                  </h3>
                  <ul className="space-y-2">
                    {currentDemo?.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Why Choose 3days.ai?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-8">
                  <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <benefit.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="bg-blue-600 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of companies already using AI employees to transform their business operations.
              </p>
              <div className="space-x-4">
                <Button size="lg" variant="secondary">
                  Start Free Trial
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                  Schedule Live Demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default WatchDemo;
