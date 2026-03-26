
import { Brain, Database, Target, Zap, ArrowRight, CheckCircle, Upload, Settings, BarChart3, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const FineTuning = () => {
  const features = [
    {
      icon: Database,
      title: 'Custom Knowledge Base Creation',
      description: 'Transform your company data, documents, and processes into a specialized knowledge base that your AI workers can access instantly.'
    },
    {
      icon: Brain,
      title: 'Domain-Specific Training',
      description: 'Fine-tune AI models with your industry-specific terminology, workflows, and business rules for enhanced accuracy and relevance.'
    },
    {
      icon: Target,
      title: 'Behavior Customization',
      description: 'Train your AI workers to respond in your brand voice, follow company policies, and maintain consistent communication standards.'
    },
    {
      icon: Settings,
      title: 'Continuous Learning',
      description: 'AI workers learn from interactions and feedback, continuously improving their performance with your specific use cases.'
    }
  ];

  const tuningProcess = [
    {
      step: '1',
      title: 'Data Upload & Preparation',
      description: 'Securely upload your documents, databases, and training materials through our encrypted platform.',
      icon: Upload
    },
    {
      step: '2',
      title: 'Knowledge Base Construction',
      description: 'Our AI processes and structures your data into an optimized knowledge base with advanced indexing.',
      icon: Database
    },
    {
      step: '3',
      title: 'Model Fine-Tuning',
      description: 'Train the AI model on your specific data patterns, terminology, and business logic.',
      icon: Settings
    },
    {
      step: '4',
      title: 'Testing & Validation',
      description: 'Comprehensive testing ensures your fine-tuned AI performs accurately with your specific requirements.',
      icon: CheckCircle
    }
  ];

  const dataSources = [
    'Company Documents & Policies',
    'Historical Communications',
    'Process Documentation',
    'Product Specifications',
    'Customer Service Scripts',
    'Industry Standards',
    'Regulatory Guidelines',
    'Training Materials'
  ];

  const benefits = [
    { value: '95%', label: 'Accuracy Improvement' },
    { value: '3x', label: 'Faster Response Time' },
    { value: '80%', label: 'Reduction in Training Time' },
    { value: '24/7', label: 'Knowledge Availability' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[#f5ede3] to-white dark:from-[#181512] dark:to-[#1c1916]">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              AI Fine-Tuning & 
              <span className="block font-medium text-[#111111]">
                Custom Knowledge Bases
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto font-light leading-relaxed">
              Transform your AI workers into domain experts by fine-tuning them with your specific data, 
              creating intelligent assistants that understand your business inside and out.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-3 rounded-md" asChild>
                <Link to="/start-free-trial">Start Fine-Tuning</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-md" asChild>
                <Link to="/schedule-demo">See Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Stats */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Proven Results</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              See the measurable impact of custom-trained AI workers
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-light text-gray-900 mb-3">{benefit.value}</div>
                <div className="text-gray-600 text-lg">{benefit.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fine-Tuning Process */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">How Fine-Tuning Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A simple, secure process to create AI workers tailored to your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {tuningProcess.map((process, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-[#222222] rounded-full flex items-center justify-center mx-auto mb-6">
                    <process.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-3xl font-light text-purple-600 mb-4">Step {process.step}</div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{process.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{process.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Fine-Tuning Capabilities</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced AI customization for enterprise-grade performance
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500 to-[#222222] mr-4">
                      <feature.icon className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Sources */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Supported Data Sources</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Train your AI with virtually any type of business data
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {dataSources.map((source, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-all duration-300 text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-[#222222] rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-900">{source}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Privacy */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-light text-gray-900 mb-6">Enterprise-Grade Security</h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Your data security is our top priority. All fine-tuning processes use enterprise-grade 
                encryption and comply with industry standards.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Shield className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">End-to-end encryption for all data transfers</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">SOC 2 Type II certified infrastructure</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">GDPR and HIPAA compliance available</span>
                </div>
                <div className="flex items-center">
                  <Shield className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-gray-700">Private cloud deployment options</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="w-64 h-64 bg-gradient-to-r from-purple-500 to-[#222222] rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-32 w-32 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#f5ede3] text-[#111111] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Create Your Custom AI?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Transform your business knowledge into intelligent AI workers that understand your specific needs.
          </p>
          <Button size="lg" className="bg-[#111111] text-white hover:bg-[#222222] rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              Start Fine-Tuning
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default FineTuning;
