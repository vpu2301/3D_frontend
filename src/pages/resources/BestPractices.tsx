
import { Lightbulb, ArrowRight, Shield, Zap, Users, Target, CheckCircle, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const BestPractices = () => {
  const practices = [
    {
      category: "Security & Compliance",
      icon: Shield,
      color: "blue",
      practices: [
        "Implement role-based access controls",
        "Regular security audits and monitoring",
        "Data encryption in transit and at rest",
        "Compliance with industry regulations"
      ]
    },
    {
      category: "Performance Optimization",
      icon: Zap,
      color: "green", 
      practices: [
        "Regular workflow performance reviews",
        "Automated monitoring and alerting",
        "Resource optimization strategies",
        "Continuous improvement processes"
      ]
    },
    {
      category: "Team Management",
      icon: Users,
      color: "purple",
      practices: [
        "Comprehensive team training programs",
        "Clear role definitions and responsibilities",
        "Regular feedback and communication",
        "Change management strategies"
      ]
    }
  ];

  const dosDonts = [
    {
      type: "do",
      title: "Start Small and Scale",
      description: "Begin with simple, high-impact processes before tackling complex workflows."
    },
    {
      type: "do",
      title: "Monitor Performance",
      description: "Set up comprehensive monitoring to track automation performance and ROI."
    },
    {
      type: "don't",
      title: "Automate Broken Processes",
      description: "Fix and optimize processes before implementing automation."
    },
    {
      type: "don't",
      title: "Ignore User Feedback",
      description: "Regularly collect and act on feedback from team members using the system."
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-[#f5ede3] to-white dark:from-[#181512] dark:to-[#1c1916]">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              Best Practices
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto font-light leading-relaxed">
              Learn from industry experts and successful implementations. Follow these proven 
              best practices to maximize your automation success and avoid common pitfalls.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button className="bg-[#111111] hover:bg-[#222222] text-white px-8 py-3 rounded-md" asChild>
                <Link to="/resources/training">View Training Resources</Link>
              </Button>
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-md" asChild>
                <Link to="/contact">Consult an Expert</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Best Practices Categories */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Core Practice Areas</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Essential categories for successful automation implementation
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {practices.map((category, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardContent className="p-8 text-center">
                  <div className="p-4 rounded-2xl bg-[#111111] w-fit mx-auto mb-6">
                    <category.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-6">{category.category}</h3>
                  <div className="space-y-4 text-left">
                    {category.practices.map((practice, practiceIndex) => (
                      <div key={practiceIndex} className="flex items-start space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{practice}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Do's and Don'ts */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Do's and Don'ts</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn from common mistakes and follow proven success strategies
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {dosDonts.map((item, index) => (
              <div key={index} className={`bg-white p-6 rounded-lg shadow-lg border-l-4 ${
                item.type === 'do' ? 'border-green-500' : 'border-red-500'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${
                    item.type === 'do' ? 'bg-green-100' : 'bg-red-100'
                  }`}>
                    {item.type === 'do' ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div>
                    <h3 className={`text-lg font-medium mb-2 ${
                      item.type === 'do' ? 'text-green-800' : 'text-red-800'
                    }`}>
                      {item.type === 'do' ? 'DO: ' : "DON'T: "}{item.title}
                    </h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#f5ede3] text-[#111111] px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-light mb-8 tracking-tight">Apply Best Practices</h2>
          <p className="text-xl mb-12 opacity-90 font-light">
            Start implementing these proven strategies in your organization today.
          </p>
          <Button size="lg" className="bg-[#111111] text-white hover:bg-[#222222] rounded-full py-3" asChild>
            <Link to="/get-started">
              Start Implementation
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default BestPractices;
