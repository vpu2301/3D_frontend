
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Bot, Users, TrendingUp, CheckCircle, Clock, BarChart3,
  DollarSign, Zap, Target, PieChart, Briefcase, Activity
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
    if (isAuthenticated !== 'true') { navigate('/login'); return; }
    if (email) setUserEmail(email);
  }, [navigate]);

  const metrics = [
    { title: 'Active AI Workers', value: '24', change: '+12%', icon: Bot, color: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'Tasks Completed', value: '1,234', change: '+8%', icon: CheckCircle, color: 'text-accent', bgColor: 'bg-accent/10' },
    { title: 'Work Hours Saved', value: '456', change: '+15%', icon: Clock, color: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'Human Workers', value: '89', change: '+5%', icon: Users, color: 'text-destructive', bgColor: 'bg-destructive/10' }
  ];

  const workerMetrics = [
    { title: 'Worker Productivity', value: '340%', change: '+23%', icon: Activity, color: 'text-accent', bgColor: 'bg-accent/10' },
    { title: 'Cost Per Task', value: '$2.50', change: '-18%', icon: DollarSign, color: 'text-primary', bgColor: 'bg-primary/10' },
    { title: 'Efficiency Gain', value: '85%', change: '+45%', icon: Zap, color: 'text-destructive', bgColor: 'bg-destructive/10' },
    { title: 'Worker Utilization', value: '92%', change: '+12%', icon: Target, color: 'text-primary', bgColor: 'bg-primary/10' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            <AgentsNavbar onAddAgent={() => setWizardOpen(true)} />
            
            <main className="flex-1 p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-light text-foreground">AI Worker Dashboard</h1>
                <p className="text-muted-foreground">Welcome back! Here's an overview of your AI workforce performance today.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {metrics.map((metric, index) => (
                  <MetricCard key={index} {...metric} />
                ))}
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-light text-foreground mb-4">Worker Performance & Efficiency</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {workerMetrics.map((metric, index) => (
                    <MetricCard key={index} {...metric} />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                <QuickActions onCreateWorker={() => setWizardOpen(true)} />
                <RecentActivity />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-xl font-medium flex items-center">
                      <PieChart className="h-5 w-5 mr-2" />
                      Worker Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { icon: Bot, label: 'AI Workers', value: '24 (73%)' },
                        { icon: Users, label: 'Human Workers', value: '9 (27%)' },
                        { icon: Briefcase, label: 'Active Teams', value: '4' },
                      ].map((item, i) => (
                        <div key={i} className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground flex items-center">
                            <item.icon className="h-4 w-4 mr-2" />
                            {item.label}
                          </span>
                          <span className="font-medium text-foreground">{item.value}</span>
                        </div>
                      ))}
                      <div className="border-t border-border pt-2">
                        <div className="flex justify-between items-center font-semibold">
                          <span className="text-foreground">Total Workforce</span>
                          <span className="text-primary">33 Workers</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-medium flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Worker Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 rounded-2xl shadow-neu-inset flex items-center justify-center">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">AI worker performance charts and analytics will be displayed here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <CreateAgentWizard open={wizardOpen} onClose={() => setWizardOpen(false)} onComplete={() => setWizardOpen(false)} />
    </div>
  );
};

export default Dashboard;
