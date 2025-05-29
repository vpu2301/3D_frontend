
import { Users, Calendar, Briefcase, HeadphonesIcon, DollarSign, TrendingUp, UserCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Agents = () => {
  const digitalWorkers = [
    {
      name: "AI Administrative Assistant",
      icon: UserCheck,
      color: "blue",
      tasks: [
        "Calendar management & scheduling",
        "Email drafting & filtering", 
        "Report generation",
        "Data entry & form filling"
      ]
    },
    {
      name: "AI Research Analyst",
      icon: TrendingUp,
      color: "orange",
      tasks: [
        "Document summarization",
        "Client research & briefings",
        "Data analysis & insights",
        "CRM updates & lead qualification"
      ]
    },
    {
      name: "AI Customer Support Agent",
      icon: HeadphonesIcon,
      color: "green",
      tasks: [
        "24/7 customer service",
        "Ticket routing & resolution",
        "FAQ handling",
        "Password resets & basic IT"
      ]
    },
    {
      name: "AI Finance Assistant",
      icon: DollarSign,
      color: "purple",
      tasks: [
        "Invoice processing & AP/AR",
        "Expense report handling",
        "Financial reporting",
        "Compliance monitoring"
      ]
    },
    {
      name: "AI Marketing Assistant",
      icon: TrendingUp,
      color: "pink",
      tasks: [
        "Content creation & social media",
        "Market research & analysis",
        "Campaign performance reports",
        "Competitor monitoring"
      ]
    },
    {
      name: "AI Executive Secretary",
      icon: Briefcase,
      color: "red",
      tasks: [
        "Meeting transcription & notes",
        "Phone call handling & screening",
        "Action item tracking",
        "Executive briefing preparation"
      ]
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-50 border-blue-200 text-blue-600",
      orange: "bg-orange-50 border-orange-200 text-orange-600",
      green: "bg-green-50 border-green-200 text-green-600",
      purple: "bg-purple-50 border-purple-200 text-purple-600",
      pink: "bg-pink-50 border-pink-200 text-pink-600",
      red: "bg-red-50 border-red-200 text-red-600"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getIconBgColor = (color: string) => {
    const colorMap = {
      blue: "bg-blue-100",
      orange: "bg-orange-100", 
      green: "bg-green-100",
      purple: "bg-purple-100",
      pink: "bg-pink-100",
      red: "bg-red-100"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  const getTextColor = (color: string) => {
    const colorMap = {
      blue: "text-blue-600",
      orange: "text-orange-600",
      green: "text-green-600", 
      purple: "text-purple-600",
      pink: "text-pink-600",
      red: "text-red-600"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-indigo-100 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-purple-600 p-4 rounded-2xl">
                <Users className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Our Digital
              <span className="text-purple-600 block">Workers</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Meet your new AI workforce. Intelligent agents capable of independent reasoning, conditional logic, and learning over time while keeping humans in the loop.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700" asChild>
                <Link to="/get-started">Deploy Agents <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/watch-demo">Watch Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Workers Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {digitalWorkers.map((worker, index) => (
              <Card key={index} className={`border-2 ${getColorClasses(worker.color)}`}>
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className={`${getIconBgColor(worker.color)} p-3 rounded-lg`}>
                      <worker.icon className={`h-6 w-6 ${getTextColor(worker.color)}`} />
                    </div>
                  </div>
                  <CardTitle className="text-xl text-gray-900">{worker.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {worker.tasks.map((task, taskIndex) => (
                      <li key={taskIndex} className="flex items-start space-x-2">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-600">{task}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Key Differentiator Section */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Key Differentiator
          </h2>
          <p className="text-xl text-gray-600 leading-relaxed">
            Not simple chatbots, but intelligent agents capable of independent reasoning, 
            conditional logic, and learning over time while keeping humans in the loop.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Autonomous AI Workforce
            </h2>
            <p className="text-xl text-gray-600">
              Deploy AI agents that think, learn, and execute like your best employees
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Autonomous Decision Making</h3>
              <p className="text-gray-600">
                AI agents that can analyze situations, make decisions, and take actions without human intervention.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Multi-Agent Collaboration</h3>
              <p className="text-gray-600">
                Deploy teams of specialized AI agents that work together to solve complex business challenges.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserCheck className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Safe & Reliable</h3>
              <p className="text-gray-600">
                Built-in safety measures and monitoring to ensure agents operate within defined parameters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-900 py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Deploy AI Agents?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Start with one agent and scale to a full AI workforce that transforms your business.
          </p>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700" asChild>
            <Link to="/get-started">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Agents;
