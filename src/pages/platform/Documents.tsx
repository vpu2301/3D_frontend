
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, FileText, Search, Brain, Upload, Eye, Download, Lock, Zap, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const Documents = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Extraction',
      description: 'Advanced OCR and NLP technology extracts data from any document format with 99.5% accuracy.'
    },
    {
      icon: Search,
      title: 'Intelligent Search',
      description: 'Find any information across thousands of documents using natural language queries.'
    },
    {
      icon: Eye,
      title: 'Smart Classification',
      description: 'Automatically categorize and tag documents based on content, type, and business rules.'
    },
    {
      icon: Zap,
      title: 'Instant Processing',
      description: 'Process documents in real-time with sub-second response times for immediate insights.'
    },
    {
      icon: Users,
      title: 'Collaboration Tools',
      description: 'Share, annotate, and collaborate on documents with team members in real-time.'
    },
    {
      icon: Lock,
      title: 'Secure Storage',
      description: 'Bank-grade encryption and compliance with industry standards for document security.'
    }
  ];

  const documentTypes = [
    { type: 'Invoices', description: 'Extract vendor, amount, dates', accuracy: '99.8%' },
    { type: 'Contracts', description: 'Key terms, dates, obligations', accuracy: '99.5%' },
    { type: 'Receipts', description: 'Items, amounts, tax information', accuracy: '99.7%' },
    { type: 'Forms', description: 'Field data, signatures, checkboxes', accuracy: '99.9%' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[#f5ede3] to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Document Processing
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Transform unstructured documents into actionable data. Our AI-powered platform extracts, 
              analyzes, and processes documents with human-level accuracy at machine speed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-3 rounded-full" asChild>
                <Link to="/start-free-trial">Process Documents Now</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">See It in Action</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Intelligent Document Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to digitize and automate your document workflows
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-[#111111] w-fit mx-auto mb-6">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Document Types */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Supported Document Types</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Process any document type with industry-leading accuracy rates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {documentTypes.map((doc, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <FileText className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{doc.type}</h3>
                <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                <div className="text-green-600 font-medium">{doc.accuracy}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Flow */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">1. Upload</h3>
              <p className="text-gray-600">Upload documents via drag-and-drop, email, or API</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">2. Process</h3>
              <p className="text-gray-600">AI extracts and validates data with high accuracy</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">3. Review</h3>
              <p className="text-gray-600">Review and validate extracted data if needed</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#1b1b1b] rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="h-8 w-8 text-[#111111]" />
              </div>
              <h3 className="text-lg font-medium mb-2">4. Export</h3>
              <p className="text-gray-600">Export to your systems or trigger automated workflows</p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-12 text-[#111111] border border-black/8">
            <h3 className="text-3xl font-light mb-8 text-center">Real-World Applications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-xl font-medium mb-4">Finance & Accounting</h4>
                <ul className="space-y-3 text-black/60">
                  <li>• Automated invoice processing and AP/AR</li>
                  <li>• Expense report digitization</li>
                  <li>• Tax document preparation</li>
                  <li>• Financial statement analysis</li>
                </ul>
              </div>
              <div>
                <h4 className="text-xl font-medium mb-4">Legal & Compliance</h4>
                <ul className="space-y-3 text-black/60">
                  <li>• Contract analysis and management</li>
                  <li>• Legal document review</li>
                  <li>• Compliance documentation</li>
                  <li>• Due diligence processes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#f5ede3] text-[#111111] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Ready to Go Paperless?</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Transform your document processes with AI-powered automation.
          </p>
          <Button size="lg" className="bg-[#111111] text-white hover:bg-[#222222] rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              Start Processing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Documents;
