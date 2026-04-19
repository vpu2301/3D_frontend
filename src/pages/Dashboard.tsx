
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Bot,
  Users,
  TrendingUp,
  BarChart3,
  PieChart,
  Briefcase,
  GitBranch,
  Network,
  Shield,
  Zap,
  MessageSquare,
  Activity,
  CheckCircle,
  Plus,
  Settings,
  BarChart2,
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
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (isAuthenticated !== 'true') {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const metrics = [
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
  ];

  const workerMetrics = [
    {
      title: 'Worker Productivity',
      value: '340%',
      subtitle: '+23% this month',
      icon: TrendingUp,
      iconBg: 'from-green-100 to-emerald-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Cost Per Task',
      value: '$2.50',
      subtitle: '-18% vs last month',
      icon: BarChart2,
      iconBg: 'from-blue-100 to-cyan-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Efficiency Gain',
      value: '85%',
      subtitle: '+45% this quarter',
      icon: Zap,
      iconBg: 'from-amber-100 to-yellow-100',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Worker Utilization',
      value: '92%',
      subtitle: '+12% this month',
      icon: Activity,
      iconBg: 'from-violet-100 to-purple-100',
      iconColor: 'text-violet-600',
    },
  ];

  const flowPerformanceMetrics = [
    {
      title: 'Message Throughput',
      value: '50K/s',
      subtitle: 'msg per second',
      icon: MessageSquare,
      iconBg: 'from-blue-100 to-cyan-100',
      iconColor: 'text-blue-600',
    },
    {
      title: 'Avg Latency',
      value: '8.5ms',
      subtitle: 'sub-10ms guaranteed',
      icon: Zap,
      iconBg: 'from-green-100 to-emerald-100',
      iconColor: 'text-green-600',
    },
    {
      title: 'Flow Success Rate',
      value: '99.95%',
      subtitle: 'all active flows',
      icon: CheckCircle,
      iconBg: 'from-amber-100 to-yellow-100',
      iconColor: 'text-amber-600',
    },
    {
      title: 'Active Connections',
      value: '1,247',
      subtitle: '89 partner orgs',
      icon: Network,
      iconBg: 'from-violet-100 to-purple-100',
      iconColor: 'text-violet-600',
    },
  ];

  const communicationFlows = [
    {
      title: 'Supply Chain Coordination',
      participants: ['Supplier Agent', 'Manufacturer Agent', 'Logistics Agent', 'Retailer Agent'],
      description: 'Automated coordination of inventory, production schedules, and delivery logistics.',
      flowType: 'Multi-party',
      typeColor: 'bg-blue-100 text-blue-700',
    },
    {
      title: 'Financial Settlement',
      participants: ['Bank Agent', 'Merchant Agent', 'Payment Processor Agent'],
      description: 'Real-time payment processing and settlement between financial institutions.',
      flowType: 'Secure Transaction',
      typeColor: 'bg-green-100 text-green-700',
    },
    {
      title: 'Compliance Reporting',
      participants: ['Legal Agent', 'Audit Agent', 'Regulatory Agent', 'Compliance Agent'],
      description: 'Automated compliance monitoring and reporting across regulated industries.',
      flowType: 'Regulatory',
      typeColor: 'bg-orange-100 text-orange-700',
    },
    {
      title: 'Cross-Platform Integration',
      participants: ['CRM Agent', 'ERP Agent', 'Analytics Agent', 'Support Agent'],
      description: 'Seamless data synchronization and workflow coordination between platforms.',
      flowType: 'System Integration',
      typeColor: 'bg-purple-100 text-purple-700',
    },
  ];

  const protocolFeatures = [
    { icon: Network, title: 'Distributed Network', status: 'Active' },
    { icon: Shield, title: 'End-to-End Encryption', status: 'Active' },
    { icon: Zap, title: 'Real-Time Sync', status: 'Active' },
    { icon: MessageSquare, title: 'Protocol Translation', status: 'Beta' },
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
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">AI Worker Dashboard</h1>
                  <p className="text-gray-600">Welcome back! Here's an overview of your AI workforce performance today.</p>
                </div>
                <Button
                  onClick={() => setWizardOpen(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Deploy Agent
                </Button>
              </div>

              {/* Primary Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {metrics.map((metric, index) => {
                  const Icon = metric.icon;
                  return (
                    <Card key={index} className="bg-white/80 border-gray-200/50">
                      <CardContent className="pt-5 pb-5">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl bg-gradient-to-br ${metric.iconBg} flex-shrink-0`}>
                            <Icon className={`h-5 w-5 ${metric.iconColor}`} />
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                            <p className="text-sm font-medium text-gray-700">{metric.title}</p>
                            <p className="text-xs text-gray-500">{metric.subtitle}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Recent Activity + Quick Actions */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Recent Activity */}
                <Card className="lg:col-span-2 bg-white/80 border-gray-200/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      <Activity className="h-4 w-4 text-gray-500" />
                      Recent Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {recentActivities.map((activity, index) => (
                      <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
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

                {/* Quick Actions */}
                <Card className="bg-white/80 border-gray-200/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-gray-900">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      className="w-full justify-start bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                      onClick={() => setWizardOpen(true)}
                    >
                      <Bot className="h-4 w-4 mr-2" />
                      Create New AI Worker
                    </Button>
                    <Button className="w-full justify-start bg-white hover:bg-gray-50 border-gray-200 text-gray-700" variant="outline">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button className="w-full justify-start bg-white hover:bg-gray-50 border-gray-200 text-gray-700" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Manage Automations
                    </Button>
                    <Button className="w-full justify-start bg-white hover:bg-gray-50 border-gray-200 text-gray-700" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      User Management
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Worker Performance Section */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-1">Worker Performance & Efficiency</h2>
                <p className="text-sm text-gray-500 mb-4">Key performance indicators across your AI workforce</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {workerMetrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                      <Card key={index} className="bg-white/80 border-gray-200/50">
                        <CardContent className="pt-5 pb-5">
                          <div className="flex items-center gap-3">
                            <div className={`p-2.5 rounded-xl bg-gradient-to-br ${metric.iconBg} flex-shrink-0`}>
                              <Icon className={`h-4 w-4 ${metric.iconColor}`} />
                            </div>
                            <div>
                              <p className="text-xl font-bold text-gray-900">{metric.value}</p>
                              <p className="text-xs font-medium text-gray-700">{metric.title}</p>
                              <p className="text-xs text-gray-500">{metric.subtitle}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>

              {/* Worker Distribution + Performance Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Worker Distribution */}
                <Card className="bg-white/80 border-gray-200/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      <PieChart className="h-4 w-4 text-gray-500" />
                      Worker Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <div className="p-1 rounded bg-gradient-to-br from-blue-100 to-cyan-100">
                            <Bot className="h-3 w-3 text-blue-600" />
                          </div>
                          AI Workers
                        </span>
                        <span className="text-sm font-semibold text-gray-900">24 <span className="text-gray-400 font-normal">(73%)</span></span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <div className="p-1 rounded bg-gradient-to-br from-green-100 to-emerald-100">
                            <Users className="h-3 w-3 text-green-600" />
                          </div>
                          Human Workers
                        </span>
                        <span className="text-sm font-semibold text-gray-900">9 <span className="text-gray-400 font-normal">(27%)</span></span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600 flex items-center gap-2">
                          <div className="p-1 rounded bg-gradient-to-br from-violet-100 to-purple-100">
                            <Briefcase className="h-3 w-3 text-violet-600" />
                          </div>
                          Active Teams
                        </span>
                        <span className="text-sm font-semibold text-gray-900">4</span>
                      </div>
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-sm font-medium text-gray-700">Total Workforce</span>
                        <span className="text-sm font-bold text-blue-600">33 Workers</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Chart */}
                <Card className="lg:col-span-2 bg-white/80 border-gray-200/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold text-gray-900 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-gray-500" />
                      Worker Performance Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/60 flex items-center justify-center">
                      <div className="text-center">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 inline-flex mb-3">
                          <BarChart3 className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-sm text-gray-500">AI worker performance charts will be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Communication Flows Section */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <GitBranch className="h-5 w-5 text-gray-500" />
                  <h2 className="text-xl font-semibold text-gray-900">Communication Flows</h2>
                </div>
                <p className="text-sm text-gray-500 mb-5">Cross-company agentic communication infrastructure</p>

                {/* Protocol feature badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {protocolFeatures.map((f) => {
                    const Icon = f.icon;
                    return (
                      <div key={f.title} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-full text-xs text-gray-700">
                        <Icon className="h-3.5 w-3.5 text-blue-500" />
                        {f.title}
                        <span className={cn(
                          'ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium',
                          f.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        )}>
                          {f.status}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Flow performance metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {flowPerformanceMetrics.map((metric, index) => {
                    const Icon = metric.icon;
                    return (
                      <Card key={index} className="bg-white/80 border-gray-200/50">
                        <CardContent className="pt-4 pb-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${metric.iconBg} flex-shrink-0`}>
                              <Icon className={`h-4 w-4 ${metric.iconColor}`} />
                            </div>
                            <div>
                              <p className="text-lg font-bold text-gray-900">{metric.value}</p>
                              <p className="text-xs font-medium text-gray-700">{metric.title}</p>
                              <p className="text-xs text-gray-500">{metric.subtitle}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Active communication flows */}
                <h3 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-green-500" />
                  Active Communication Flows
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {communicationFlows.map((flow, index) => (
                    <Card key={index} className="bg-white/80 border-gray-200/50 hover:shadow-md transition-all duration-200">
                      <CardContent className="pt-4 pb-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900">{flow.title}</h4>
                          <span className={`px-2 py-0.5 text-[10px] rounded-full font-medium ${flow.typeColor}`}>{flow.flowType}</span>
                        </div>
                        <p className="text-xs text-gray-500 mb-3">{flow.description}</p>
                        <div className="grid grid-cols-2 gap-1">
                          {flow.participants.map((p, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                              <div className="w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0" />
                              <span className="text-xs text-gray-600 truncate">{p}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
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
