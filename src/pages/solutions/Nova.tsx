
import { Scale, FileText, Shield, Users, ArrowRight, Search, BookOpen, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Nova = () => {
  const features = [
    {
      icon: FileText,
      title: 'Contract Analysis & Review',
      description: 'Automatically analyzes contracts, identifies key terms, and flags potential issues or compliance concerns.'
    },
    {
      icon: Search,
      title: 'Legal Research & Case Law',
      description: 'Conducts comprehensive legal research across databases and provides relevant case law and precedents.'
    },
    {
      icon: Shield,
      title: 'Compliance Monitoring',
      description: 'Monitors regulatory changes and ensures ongoing compliance with applicable laws and regulations.'
    },
    {
      icon: BookOpen,
      title: 'Document Drafting & Templates',
      description: 'Creates legal documents from templates and assists with drafting based on specific requirements.'
    }
  ];

  const integrations = [
    'LexisNexis', 'Westlaw', 'DocuSign', 'Adobe Sign', 'SharePoint', 'Salesforce'
  ];

  const roiStats = [
    { value: '75%', label: 'Document Review Speed' },
    { value: '90%', label: 'Compliance Accuracy' },
    { value: '60%', label: 'Research Time Reduction' },
    { value: '24/7', label: 'Monitoring Coverage' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
                Meet Nova: Your
                <span className="block font-medium bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">
                  AI Legal Specialist
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-4xl mx-auto lg:mx-0 font-light leading-relaxed">
                Nova streamlines legal workflows with intelligent contract analysis, compliance monitoring, 
                and legal research capabilities that enhance accuracy and efficiency.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mt-8">
                <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-md" asChild>
                  <Link to="/start-free-trial">Try Nova Free</Link>
                </Button>
                <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-md" asChild>
                  <Link to="/schedule-demo">Request a Demo</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative animate-fade-in">
              <div className="relative rounded-2xl overflow-hidden">
                <img 
                  src="/lovable-uploads/6a3a5b85-b2d2-471a-b368-bec35acad2ef.png" 
                  alt="Nova - AI Legal Specialist"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 to-transparent"></div>
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-900">Nova Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Stats */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Legal Impact</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Measurable improvements in legal workflow efficiency and accuracy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {roiStats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl font-light text-gray-900 mb-3">{stat.value}</div>
                <div className="text-gray-600 text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Key Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced legal capabilities powered by artificial intelligence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 mr-4">
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

      {/* Integrations */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Legal Tool Integrations</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Seamlessly connects with your existing legal technology stack
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {integrations.map((integration, index) => (
              <div key={index} className="bg-gray-100 px-6 py-3 rounded-full text-gray-700 font-medium">
                {integration}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Meet Nova?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Transform your legal operations with AI that understands law and compliance.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-md py-3" asChild>
            <Link to="/start-free-trial">
              Try Nova Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Nova;
