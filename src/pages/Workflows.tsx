
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Workflow, Plus, Activity, Clock, Settings, Play, Pause,
  UserPlus, FileText, TrendingUp, CheckSquare, UserMinus,
  Headphones, BarChart2, Bug, CreditCard, Target, FileCheck,
  Share2, ChevronRight,
} from 'lucide-react';

const TEMPLATES = [
  {
    id: 'customer-onboarding',
    name: 'Customer Onboarding',
    description: 'Webhook trigger → AI classify → welcome email → approval → account activation',
    category: 'Sales',
    categoryColor: 'bg-blue-100 text-blue-700',
    icon: UserPlus,
    iconBg: 'from-blue-100 to-cyan-100',
    iconColor: 'text-blue-600',
    nodes: 6,
  },
  {
    id: 'invoice-processing',
    name: 'Invoice Processing',
    description: 'Email trigger → AI extract data → validation → log to Sheets → notify',
    category: 'Finance',
    categoryColor: 'bg-green-100 text-green-700',
    icon: FileText,
    iconBg: 'from-green-100 to-emerald-100',
    iconColor: 'text-green-600',
    nodes: 5,
  },
  {
    id: 'lead-qualification',
    name: 'Lead Qualification',
    description: 'Webhook → AI agent scores lead → condition → route to CRM or discard',
    category: 'Sales',
    categoryColor: 'bg-blue-100 text-blue-700',
    icon: TrendingUp,
    iconBg: 'from-indigo-100 to-blue-100',
    iconColor: 'text-indigo-600',
    nodes: 5,
  },
  {
    id: 'content-approval',
    name: 'Content Approval',
    description: 'Manual trigger → AI summarize → human review → approve or reject → publish',
    category: 'Marketing',
    categoryColor: 'bg-pink-100 text-pink-700',
    icon: CheckSquare,
    iconBg: 'from-pink-100 to-rose-100',
    iconColor: 'text-pink-600',
    nodes: 5,
  },
  {
    id: 'employee-offboarding',
    name: 'Employee Offboarding',
    description: 'HR event → revoke access → notify IT → send farewell email → archive records',
    category: 'HR',
    categoryColor: 'bg-orange-100 text-orange-700',
    icon: UserMinus,
    iconBg: 'from-orange-100 to-amber-100',
    iconColor: 'text-orange-600',
    nodes: 5,
  },
  {
    id: 'support-ticket-routing',
    name: 'Support Ticket Routing',
    description: 'Email trigger → AI classify priority → switch → route to Slack or Jira',
    category: 'Support',
    categoryColor: 'bg-teal-100 text-teal-700',
    icon: Headphones,
    iconBg: 'from-teal-100 to-cyan-100',
    iconColor: 'text-teal-600',
    nodes: 5,
  },
  {
    id: 'weekly-report',
    name: 'Weekly Report Generation',
    description: 'Schedule → pull Google Sheets data → AI summarize → send email report',
    category: 'Operations',
    categoryColor: 'bg-violet-100 text-violet-700',
    icon: BarChart2,
    iconBg: 'from-violet-100 to-purple-100',
    iconColor: 'text-violet-600',
    nodes: 4,
  },
  {
    id: 'bug-triage',
    name: 'Bug Triage',
    description: 'GitHub issue → AI classify severity → condition → create Jira + notify Slack',
    category: 'Engineering',
    categoryColor: 'bg-gray-100 text-gray-700',
    icon: Bug,
    iconBg: 'from-gray-100 to-slate-100',
    iconColor: 'text-gray-600',
    nodes: 5,
  },
  {
    id: 'expense-approval',
    name: 'Expense Approval',
    description: 'Email trigger → AI extract amount → condition → human approval → reimburse',
    category: 'Finance',
    categoryColor: 'bg-green-100 text-green-700',
    icon: CreditCard,
    iconBg: 'from-emerald-100 to-green-100',
    iconColor: 'text-emerald-600',
    nodes: 5,
  },
  {
    id: 'sales-pipeline',
    name: 'Sales Pipeline Update',
    description: 'CRM event → set data → condition → notify rep → log activity → schedule follow-up',
    category: 'Sales',
    categoryColor: 'bg-blue-100 text-blue-700',
    icon: Target,
    iconBg: 'from-blue-100 to-indigo-100',
    iconColor: 'text-blue-600',
    nodes: 6,
  },
  {
    id: 'contract-review',
    name: 'Contract Review',
    description: 'Manual trigger → AI extract clauses → human approval → condition → save to Notion',
    category: 'Legal',
    categoryColor: 'bg-amber-100 text-amber-700',
    icon: FileCheck,
    iconBg: 'from-amber-100 to-yellow-100',
    iconColor: 'text-amber-600',
    nodes: 5,
  },
  {
    id: 'social-media-alert',
    name: 'Social Media Monitoring',
    description: 'Schedule → HTTP fetch mentions → AI classify sentiment → condition → Slack alert',
    category: 'Marketing',
    categoryColor: 'bg-pink-100 text-pink-700',
    icon: Share2,
    iconBg: 'from-rose-100 to-pink-100',
    iconColor: 'text-rose-600',
    nodes: 5,
  },
];

const Workflows = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [showAllTemplates, setShowAllTemplates] = useState(false);

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

  const workflows = [
    {
      id: 1,
      name: 'Customer Onboarding Flow',
      description: 'Automated workflow for new customer setup',
      status: 'Active',
      executions: 245,
      successRate: '98%',
      iconColor: 'text-blue-600',
      bgColor: 'from-blue-100 to-cyan-100'
    },
    {
      id: 2,
      name: 'Invoice Processing',
      description: 'Automated invoice validation and approval',
      status: 'Active',
      executions: 189,
      successRate: '95%',
      iconColor: 'text-green-600',
      bgColor: 'from-green-100 to-emerald-100'
    },
    {
      id: 3,
      name: 'Lead Qualification',
      description: 'Qualify and route sales leads automatically',
      status: 'Paused',
      executions: 76,
      successRate: '92%',
      iconColor: 'text-purple-600',
      bgColor: 'from-purple-100 to-violet-100'
    },
    {
      id: 4,
      name: 'Content Approval',
      description: 'Review and approve marketing content',
      status: 'Active',
      executions: 134,
      successRate: '97%',
      iconColor: 'text-orange-600',
      bgColor: 'from-orange-100 to-red-100'
    },
  ];

  const visibleTemplates = showAllTemplates ? TEMPLATES : TEMPLATES.slice(0, 6);

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(30,25%,97%)]">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />

            <main className="flex-1 p-6 space-y-8 overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-light text-gray-900">Workflows</h1>
                  <p className="text-gray-600">Automated business process workflows</p>
                </div>
                <Button
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  onClick={() => navigate('/workflows/create')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Workflow
                </Button>
              </div>

              {/* Templates section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Templates</h2>
                    <p className="text-sm text-gray-500">Start from a pre-built workflow — open it in the canvas and customize or publish</p>
                  </div>
                  <button
                    onClick={() => setShowAllTemplates(v => !v)}
                    className="flex items-center gap-1 text-sm text-green-600 hover:text-green-700 font-medium transition-colors"
                  >
                    {showAllTemplates ? 'Show less' : `View all ${TEMPLATES.length}`}
                    <ChevronRight className={`h-4 w-4 transition-transform ${showAllTemplates ? 'rotate-90' : ''}`} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {visibleTemplates.map((tpl) => {
                    const Icon = tpl.icon;
                    return (
                      <div
                        key={tpl.id}
                        className="group bg-white border border-gray-200/70 rounded-xl p-4 hover:shadow-md hover:border-green-200 transition-all duration-200 cursor-pointer"
                        onClick={() => navigate('/workflows/create', { state: { templateId: tpl.id } })}
                      >
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${tpl.iconBg} flex-shrink-0`}>
                            <Icon className={`h-4 w-4 ${tpl.iconColor}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-sm font-medium text-gray-900 leading-tight">{tpl.name}</h3>
                              <Badge className={`text-[10px] px-1.5 py-0 font-normal ${tpl.categoryColor} border-0`}>
                                {tpl.category}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{tpl.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-gray-400">{tpl.nodes} nodes</span>
                          <span className="text-xs text-green-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
                            Use template <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* My Workflows section */}
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">My Workflows</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {workflows.map((workflow) => (
                    <Card key={workflow.id} className="bg-white/80 border-gray-200/50 hover:shadow-lg transition-all duration-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-2">
                            <div className={`p-2 rounded-lg bg-gradient-to-br ${workflow.bgColor}`}>
                              <Workflow className={`h-4 w-4 ${workflow.iconColor}`} />
                            </div>
                            <span className="font-medium">{workflow.name}</span>
                          </div>
                          <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          <p className="text-xs text-gray-600">{workflow.description}</p>

                          <div className="flex items-center justify-between">
                            <Badge
                              variant={workflow.status === 'Active' ? 'default' : 'secondary'}
                              className={workflow.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}
                            >
                              {workflow.status}
                            </Badge>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="p-1 rounded bg-gray-100">
                              <Activity className="h-3 w-3 text-blue-600" />
                            </div>
                            <span className="text-sm text-gray-700">Executions: {workflow.executions}</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <div className="p-1 rounded bg-gray-100">
                              <Clock className="h-3 w-3 text-green-600" />
                            </div>
                            <span className="text-sm text-gray-700">Success: {workflow.successRate}</span>
                          </div>

                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs bg-gray-50 hover:bg-gray-100 border-gray-200"
                            >
                              {workflow.status === 'Active' ? (
                                <>
                                  <Pause className="h-3 w-3 mr-1" />
                                  Pause
                                </>
                              ) : (
                                <>
                                  <Play className="h-3 w-3 mr-1" />
                                  Resume
                                </>
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 text-xs bg-gray-50 hover:bg-gray-100 border-gray-200"
                              onClick={() => navigate('/workflows/create')}
                            >
                              Edit
                            </Button>
                          </div>
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
    </div>
  );
};

export default Workflows;
