
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Bot,
  Users,
  TrendingUp,
  BarChart3,
  PieChart,
  Briefcase,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import AgentsNavbar from '@/components/dashboard/AgentsNavbar';
import MetricCard from '@/components/dashboard/MetricCard';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';
import CreateAgentWizard from '@/components/dashboard/CreateAgentWizard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');
    
    if (isAuthenticated !== 'true') {
      navigate('/login');
      return;
    }
    
    if (email) {
      setUserEmail(email);
    }
  }, [navigate]);

  // Key metrics data
  const metrics = [
    {
      title: 'Tasks Completed',
      value: '47',
      subtitle: '+12 today',
      bgColor: 'bg-[#cce8ca]',
    },
    {
      title: 'Hours Saved',
      value: '18.4h',
      subtitle: 'this week',
      bgColor: 'bg-[#bdd8ec]',
    },
    {
      title: 'Automation Rate',
      value: '73%',
      subtitle: 'of routine work',
      bgColor: 'bg-[#f5c6cc]',
    },
  ];

  // Worker productivity metrics
  const workerMetrics = [
    {
      title: 'Worker Productivity',
      value: '340%',
      subtitle: '+23% this month',
      bgColor: 'bg-[#cce8ca]',
    },
    {
      title: 'Cost Per Task',
      value: '$2.50',
      subtitle: '-18% vs last month',
      bgColor: 'bg-[#bdd8ec]',
    },
    {
      title: 'Efficiency Gain',
      value: '85%',
      subtitle: '+45% this quarter',
      bgColor: 'bg-[#fde9c4]',
    },
    {
      title: 'Worker Utilization',
      value: '92%',
      subtitle: '+12% this month',
      bgColor: 'bg-[#e4d4f4]',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(30,25%,97%)]">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            <AgentsNavbar onAddAgent={() => setWizardOpen(true)} />
            
            {/* Main Content */}
            <main className="flex-1 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-light text-gray-900">AI Worker Dashboard</h1>
                <p className="text-gray-600">Welcome back! Here's an overview of your AI workforce performance today.</p>
              </div>

              {/* Primary Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {metrics.map((metric, index) => (
                  <MetricCard key={index} {...metric} />
                ))}
              </div>

              {/* Recent Activity */}
              <div className="mb-8">
                <RecentActivity />
              </div>

              {/* Worker Performance Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-light text-gray-900 mb-4">Worker Performance & Efficiency</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {workerMetrics.map((metric, index) => (
                    <MetricCard key={index} {...metric} />
                  ))}
                </div>
              </div>

              {/* Dashboard Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <QuickActions onCreateWorker={() => setWizardOpen(true)} />
                
                {/* Worker Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-medium flex items-center">
                      <PieChart className="h-5 w-5 mr-2" />
                      Worker Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 flex items-center">
                          <Bot className="h-4 w-4 mr-2" />
                          AI Workers
                        </span>
                        <span className="font-medium">24 (73%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          Human Workers
                        </span>
                        <span className="font-medium">9 (27%)</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600 flex items-center">
                          <Briefcase className="h-4 w-4 mr-2" />
                          Active Teams
                        </span>
                        <span className="font-medium">4</span>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between items-center font-semibold">
                          <span>Total Workforce</span>
                          <span className="text-blue-600">33 Workers</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-medium flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Worker Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">AI worker performance charts and analytics will be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <CreateAgentWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={() => setWizardOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
