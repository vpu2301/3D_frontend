
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Code, Shield, Zap, Database, Globe, Key, Book, Users, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Api = () => {
  const features = [
    {
      icon: Code,
      title: 'RESTful Architecture',
      description: 'Modern REST API with intuitive endpoints, comprehensive documentation, and SDKs for popular languages.'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'OAuth 2.0, API keys, rate limiting, and encryption ensure your data stays secure and compliant.'
    },
    {
      icon: Zap,
      title: 'High Performance',
      description: 'Sub-100ms response times with global CDN, auto-scaling, and 99.9% uptime SLA.'
    },
    {
      icon: Database,
      title: 'Real-time Webhooks',
      description: 'Instant notifications for events with reliable delivery and automatic retry mechanisms.'
    },
    {
      icon: Globe,
      title: 'Global Infrastructure',
      description: 'Multi-region deployment with edge caching for optimal performance worldwide.'
    },
    {
      icon: Key,
      title: 'Flexible Authentication',
      description: 'Multiple auth methods including API keys, OAuth 2.0, and JWT tokens for any use case.'
    }
  ];

  const sdks = [
    { language: 'JavaScript', status: 'Available' },
    { language: 'Python', status: 'Available' },
    { language: 'PHP', status: 'Available' },
    { language: 'Java', status: 'Available' },
    { language: 'C#', status: 'Available' },
    { language: 'Go', status: 'Available' }
  ];

  return (
    <div className="min-h-screen pt-20 bg-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              API Gateway
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Build powerful integrations with our comprehensive API platform. Access all automation 
              features programmatically with enterprise-grade security and reliability.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full" asChild>
                <Link to="/start-free-trial">Explore API Docs</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full" asChild>
                <Link to="/watch-demo">See Examples</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Developer-First API</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built for developers, by developers - with the tools and features you need
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 w-fit mx-auto mb-6">
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

      {/* SDK Support */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">SDK Support</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Official SDKs for popular programming languages
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {sdks.map((sdk, index) => (
              <div key={index} className="bg-white p-6 rounded-2xl shadow-lg text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Code className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-2">{sdk.language}</h3>
                <span className="text-sm text-green-600">{sdk.status}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Quick Start</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get started with just a few lines of code
            </p>
          </div>

          <div className="bg-gray-900 rounded-3xl p-8 text-green-400 font-mono">
            <div className="mb-4 text-gray-400">// Initialize the API client</div>
            <div className="mb-2">const client = new ThreeDaysAPI(&#123;</div>
            <div className="ml-4 mb-2">apiKey: 'your-api-key',</div>
            <div className="ml-4 mb-2">baseURL: 'https://api.3days.ai'</div>
            <div className="mb-4">&#125;);</div>
            
            <div className="mb-4 text-gray-400">// Create a new automation workflow</div>
            <div className="mb-2">const workflow = await client.workflows.create(&#123;</div>
            <div className="ml-4 mb-2">name: 'Email Processing',</div>
            <div className="ml-4 mb-2">trigger: 'email_received',</div>
            <div className="ml-4 mb-2">actions: ['extract_data', 'classify', 'route']</div>
            <div className="mb-4">&#125;);</div>

            <div className="text-gray-400">// Start the workflow</div>
            <div>await workflow.start();</div>
          </div>
        </div>
      </section>

      {/* Developer Resources */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-gray-900 via-black to-gray-900 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-light mb-8 text-center">Developer Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Book className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Documentation</h4>
                <p className="text-gray-300">Comprehensive guides, tutorials, and API reference</p>
              </div>
              <div className="text-center">
                <Users className="h-12 w-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Community</h4>
                <p className="text-gray-300">Join our developer community for support and discussion</p>
              </div>
              <div className="text-center">
                <Settings className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                <h4 className="text-xl font-medium mb-2">Sandbox</h4>
                <p className="text-gray-300">Test API calls in our interactive sandbox environment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rate Limits & Pricing */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">API Pricing</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-3xl">
              <h3 className="text-2xl font-medium mb-4">Starter</h3>
              <div className="text-3xl font-light mb-4">$29<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-6">
                <li>• 10,000 API calls/month</li>
                <li>• Standard rate limits</li>
                <li>• Email support</li>
                <li>• Basic documentation</li>
              </ul>
              <Button variant="outline" className="w-full">Get Started</Button>
            </div>
            <div className="bg-blue-50 p-8 rounded-3xl border-2 border-blue-200">
              <h3 className="text-2xl font-medium mb-4">Professional</h3>
              <div className="text-3xl font-light mb-4">$99<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-6">
                <li>• 100,000 API calls/month</li>
                <li>• Higher rate limits</li>
                <li>• Priority support</li>
                <li>• Advanced features</li>
              </ul>
              <Button className="w-full">Most Popular</Button>
            </div>
            <div className="bg-gray-50 p-8 rounded-3xl">
              <h3 className="text-2xl font-medium mb-4">Enterprise</h3>
              <div className="text-3xl font-light mb-4">Custom</div>
              <ul className="space-y-3 mb-6">
                <li>• Unlimited API calls</li>
                <li>• No rate limits</li>
                <li>• Dedicated support</li>
                <li>• Custom SLA</li>
              </ul>
              <Button variant="outline" className="w-full">Contact Sales</Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Start Building Today</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Join thousands of developers building amazing automation solutions.
          </p>
          <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 rounded-full py-3" asChild>
            <Link to="/start-free-trial">
              Get API Access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Api;
