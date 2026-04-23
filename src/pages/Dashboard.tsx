
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bot,
  Users,
  TrendingUp,
  BarChart3,
  Briefcase,
  Zap,
  Activity,
  CheckCircle,
  Plus,
  Settings,
  DollarSign,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import CreateAgentWizard from '@/components/dashboard/CreateAgentWizard';
import { cn } from '@/lib/utils';

const Dashboard = () => {
  const navigate = useNavigate();
  const [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') || sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') {
      navigate('/login');
    }
  }, [navigate]);

  const kpis = [
    {
      title: 'Tasks Completed',
      value: '47',
      subtitle: '+12 today',
      icon: CheckCircle,
      iconBg: 'from-green-100 to-emerald-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Hours Saved',
      value: '18.4h',
      subtitle: 'this week',
      icon: TrendingUp,
      iconBg: 'from-blue-100 to-cyan-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Automation Rate',
      value: '73%',
      subtitle: 'of routine work',
      icon: Zap,
      iconBg: 'from-rose-100 to-pink-100',
      iconColor: 'text-rose-600',
    },
    {
      title: 'Cost Per Task',
      value: '$2.50',
      subtitle: '-18% vs last month',
      icon: DollarSign,
      iconBg: 'from-amber-100 to-yellow-100',
      iconColor: 'text-amber-600',
    },
  ];

  const workforceStats = [
    { label: 'AI Workers', value: '24', sub: '73% of workforce', icon: Bot, color: 'text-blue-600', bg: 'from-blue-100 to-cyan-100' },
    { label: 'Human Workers', value: '9', sub: '27% of workforce', icon: Users, color: 'text-green-600', bg: 'from-green-100 to-emerald-100' },
    { label: 'Active Teams', value: '4', sub: '33 total workers', icon: Briefcase, color: 'text-violet-600', bg: 'from-violet-100 to-purple-100' },
    { label: 'Worker Productivity', value: '340%', sub: '+23% this month', icon: BarChart3, color: 'text-rose-600', bg: 'from-rose-100 to-pink-100' },
  ];

  const recentActivities = [
    { message: 'Weekly report drafted and sent', time: '2 min ago', status: 'success' },
    { message: 'Meeting notes summarized → Notion', time: '14 min ago', status: 'success' },
    { message: 'Q4 budget analysis in progress...', time: '', status: 'running' },
    { message: 'Invoice batch #1142 processed', time: '1h ago', status: 'success' },
    { message: 'Lead qualification workflow triggered', time: '2h ago', status: 'success' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(30,25%,97%)]">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col bg-white">
            <main className="flex-1 p-6">
              {/* Page header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-sm text-gray-500 mt-0.5">Your AI workforce at a glance</p>
                </div>
                <Button
                  onClick={() => setWizardOpen(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Deploy Agent
                </Button>
              </div>

              {/* KPIs */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {kpis.map((kpi, index) => {
                  const Icon = kpi.icon;
                  return (
                    <Card key={index} className="bg-white border-gray-200/60">
                      <CardContent className="pt-5 pb-5">
                        <div className="flex items-start gap-3">
                          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${kpi.iconBg} flex-shrink-0`}>
                            <Icon className={`h-4 w-4 ${kpi.iconColor}`} />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900 leading-tight">{kpi.value}</p>
                            <p className="text-xs font-medium text-gray-700 mt-0.5">{kpi.title}</p>
                            <p className="text-xs text-gray-400">{kpi.subtitle}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Recent Activity + Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <Card className="lg:col-span-2 bg-white border-gray-200/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-gray-400" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-1">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-2.5 border-b border-gray-100 last:border-b-0">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            'w-2 h-2 rounded-full flex-shrink-0',
                            activity.status === 'success' ? 'bg-green-500' : 'bg-blue-400 animate-pulse'
                          )} />
                          <span className="text-sm text-gray-700">{activity.message}</span>
                        </div>
                        {activity.time && (
                          <span className="text-xs text-gray-400 ml-4 flex-shrink-0">{activity.time}</span>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                <Card className="bg-white border-gray-200/60">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-semibold text-gray-900">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      className="w-full justify-start bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                      onClick={() => setWizardOpen(true)}
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      Create New AI Worker
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Automations
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      User Management
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Workforce Overview */}
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Workforce Overview</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {workforceStats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                      <Card key={index} className="bg-white border-gray-200/60">
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.bg} flex-shrink-0`}>
                              <Icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                            <div>
                              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
                              <p className="text-xs font-medium text-gray-700">{stat.label}</p>
                              <p className="text-xs text-gray-400">{stat.sub}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
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
