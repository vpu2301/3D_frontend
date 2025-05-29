
import { Users, Calendar, Briefcase, HeadphonesIcon, DollarSign, TrendingUp, UserCheck, ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const Agents = () => {
  const digitalWorkers = [
    {
      name: "AI Administrative Assistant",
      icon: UserCheck,
      gradient: "from-blue-500 to-indigo-600",
      bgPattern: "bg-blue-50",
      accent: "bg-blue-100",
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
      gradient: "from-orange-500 to-red-500",
      bgPattern: "bg-orange-50",
      accent: "bg-orange-100",
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
      gradient: "from-green-500 to-emerald-600",
      bgPattern: "bg-green-50",
      accent: "bg-green-100",
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
      gradient: "from-purple-500 to-violet-600",
      bgPattern: "bg-purple-50",
      accent: "bg-purple-100",
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
      gradient: "from-pink-500 to-rose-500",
      bgPattern: "bg-pink-50",
      accent: "bg-pink-100",
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
      gradient: "from-cyan-500 to-blue-600",
      bgPattern: "bg-cyan-50",
      accent: "bg-cyan-100",
      tasks: [
        "Meeting transcription & notes",
        "Phone call handling & screening",
        "Action item tracking",
        "Executive briefing preparation"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full text-white text-sm font-medium mb-8 shadow-lg">
              <Sparkles className="h-4 w-4 mr-2" />
              AI-Powered Digital Workforce
            </div>
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-8 leading-tight">
              Meet Your
              <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent">
                AI Team
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-3xl mx-auto">
              Deploy intelligent AI agents that think, learn, and execute like your best employees. 
              Revolutionary digital workers with independent reasoning and adaptive capabilities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-md" asChild>
                <Link to="/get-started">Deploy AI Agents <Zap className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-md" asChild>
                <Link to="/watch-demo">Watch Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Digital Workers Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Your Digital Workforce
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose from our specialized AI agents, each designed to excel in specific business functions.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {digitalWorkers.map((worker, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white">
                {/* Gradient Header */}
                <div className={`h-2 bg-gradient-to-r ${worker.gradient}`}></div>
                
                <CardHeader className={`${worker.bgPattern} relative overflow-hidden pb-6`}>
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-4 right-4 w-20 h-20">
                      <worker.icon className="w-full h-full text-gray-300" />
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r ${worker.gradient} shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <worker.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-bold text-gray-900 mb-2 leading-tight">
                      {worker.name}
                    </CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  <div className="space-y-3">
                    {worker.tasks.map((task, taskIndex) => (
                      <div key={taskIndex} className="flex items-start space-x-3 group/task">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${worker.gradient} mt-2 group-hover/task:scale-150 transition-transform duration-200`}></div>
                        <span className="text-gray-600 group-hover/task:text-gray-900 transition-colors duration-200 flex-1">
                          {task}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-100">
                    <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md" asChild>
                      <Link to="/get-started">Learn More</Link>
                    </Button>
                  </div>
                </CardContent>

                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${worker.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}></div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose Our AI Agents?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Advanced capabilities that set our digital workforce apart from simple automation tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500 to-cyan-500 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Zap className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Autonomous Decision Making</h3>
              <p className="text-gray-600 leading-relaxed">
                AI agents that analyze situations, make intelligent decisions, and take actions without constant human oversight.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-green-500 to-emerald-500 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Multi-Agent Collaboration</h3>
              <p className="text-gray-600 leading-relaxed">
                Deploy teams of specialized AI agents that communicate and collaborate to solve complex business challenges.
              </p>
            </div>

            <div className="text-center group">
              <div className="bg-gradient-to-br from-purple-500 to-violet-500 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Enterprise-Grade Security</h3>
              <p className="text-gray-600 leading-relaxed">
                Built-in safety measures, monitoring, and compliance features ensure agents operate securely within defined parameters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,_rgba(120,119,198,0.3),_transparent_50%)]"></div>
          <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,_rgba(236,72,153,0.3),_transparent_50%)]"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative">
          <div className="inline-flex items-center px-6 py-3 bg-white/10 rounded-full text-white text-sm font-medium mb-8 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 mr-2" />
            Start Your AI Transformation Today
          </div>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Deploy
            <span className="block text-transparent bg-gradient-to-r from-pink-400 to-yellow-400 bg-clip-text">
              Your AI Workforce?
            </span>
          </h2>
          <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-3xl mx-auto">
            Start with one specialized agent and scale to a full AI workforce that transforms your business operations and drives unprecedented growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-md" asChild>
              <Link to="/get-started">Deploy Now <ArrowRight className="ml-2 h-5 w-5" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-sm px-8 py-3 rounded-md" asChild>
              <Link to="/schedule-demo">Schedule Demo</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Agents;
