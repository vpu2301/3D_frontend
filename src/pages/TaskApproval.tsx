
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Bot, AlertCircle, FileText, DollarSign, Users } from 'lucide-react';

const TaskApproval = () => {
  const navigate = useNavigate();
  const [pendingTasks, setPendingTasks] = useState([
    {
      id: 1,
      title: 'Customer Refund Request - $150',
      assistant: 'Emma (Sales Assistant)',
      description: 'Customer requesting refund for Order #12345 due to product defect',
      priority: 'High',
      category: 'Finance',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      icon: DollarSign,
      iconColor: 'text-red-600',
      bgColor: 'from-red-100 to-pink-100'
    },
    {
      id: 2,
      title: 'New Employee Onboarding Approval',
      assistant: 'Aria (HR Assistant)',
      description: 'Approve onboarding checklist for John Smith starting Monday',
      priority: 'Medium',
      category: 'HR',
      timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
      icon: Users,
      iconColor: 'text-blue-600',
      bgColor: 'from-blue-100 to-cyan-100'
    },
    {
      id: 3,
      title: 'Contract Review Required',
      assistant: 'Nova (Legal Assistant)',
      description: 'Client contract terms need approval before signing - ABC Corp',
      priority: 'High',
      category: 'Legal',
      timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
      icon: FileText,
      iconColor: 'text-purple-600',
      bgColor: 'from-purple-100 to-violet-100'
    },
    {
      id: 4,
      title: 'Marketing Campaign Budget',
      assistant: 'Maya (Marketing Assistant)',
      description: 'Approve Q1 marketing budget allocation of $25,000',
      priority: 'Medium',
      category: 'Marketing',
      timestamp: new Date(Date.now() - 1000 * 60 * 90), // 1.5 hours ago
      icon: DollarSign,
      iconColor: 'text-green-600',
      bgColor: 'from-green-100 to-emerald-100'
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    if (isAuthenticated !== 'true') {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleApprove = (taskId: number) => {
    setPendingTasks(prev => prev.filter(task => task.id !== taskId));
    // Here you would typically send an API call to approve the task
  };

  const handleReject = (taskId: number) => {
    setPendingTasks(prev => prev.filter(task => task.id !== taskId));
    // Here you would typically send an API call to reject the task
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'plat-pill !border-0 !bg-[rgba(179,56,46,0.1)] !text-[color:var(--bad-fg)]';
      case 'Medium': return 'plat-pill !border-0 !bg-[var(--warn-bg)] !text-[color:var(--warn-fg)]';
      case 'Low': return 'plat-pill !border-0 !bg-[var(--ok-bg)] !text-[color:var(--ok-fg)]';
      default: return 'plat-pill !border-0 !bg-[var(--sand-deep)] !text-[color:var(--text-3)]';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="plat min-h-screen flex flex-col">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col bg-transparent">
            <main className="flex-1 p-6 pb-20 lg:p-8 lg:pb-20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="plat-crumb">3days.tasks.approval</p>
                  <h1 className="mt-1 text-[26px]">Task Approvals</h1>
                  <p className="mt-1 text-sm" style={{ color: 'var(--text-4)' }}>Review and approve tasks from your AI assistants</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="plat-pill plat-pill-mute !border-0">
                    {pendingTasks.length} pending
                  </Badge>
                  <Button variant="outline" size="sm" className="plat-btn-ghost !h-9 !rounded-full !border !border-[color:var(--line)] !bg-transparent !px-4 !text-xs">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    View All Notifications
                  </Button>
                </div>
              </div>

              {pendingTasks.length === 0 ? (
                <div className="plat-panel text-center py-12">
                  <CheckCircle className="h-16 w-16 mx-auto mb-4" strokeWidth={1.25} style={{ color: 'var(--ok-fg)' }} />
                  <h3 className="text-lg font-medium mb-2">All caught up!</h3>
                  <p className="text-sm" style={{ color: 'var(--text-4)' }}>No pending approvals at the moment</p>
                </div>
              ) : (
                <div className="plat-panel !p-0 divide-y" style={{ borderColor: 'var(--line-soft)' }}>
                  {pendingTasks.map((task) => (
                    <div key={task.id} className="p-5" style={{ borderColor: 'var(--line-soft)' }}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="plat-item-icon !h-11 !w-11 !rounded-[10px]">
                            <task.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
                          </span>
                          <div className="min-w-0">
                            <span className="text-[15px] font-semibold">{task.title}</span>
                            <div className="flex items-center gap-2 mt-1.5">
                              <Badge className={getPriorityColor(task.priority)} variant="secondary">
                                {task.priority}
                              </Badge>
                              <Badge variant="outline" className="plat-pill !border !border-[color:var(--line)] !bg-transparent !text-[color:var(--text-3)] !font-medium">
                                {task.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="flex items-center justify-end gap-1.5 text-xs mb-1.5" style={{ color: 'var(--text-3)' }}>
                            <Bot className="h-3 w-3" />
                            <span>{task.assistant}</span>
                          </div>
                          <div className="flex items-center justify-end gap-1.5 text-xs" style={{ color: 'var(--text-5)' }}>
                            <Clock className="h-3 w-3" />
                            <span>{formatTimeAgo(task.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      <p className="mt-3 text-sm" style={{ color: 'var(--text-2)' }}>{task.description}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Button
                          onClick={() => handleApprove(task.id)}
                          className="plat-btn !h-9 !rounded-full !bg-[var(--ink)] !px-4 !text-xs !text-white"
                          size="sm"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleReject(task.id)}
                          variant="outline"
                          className="plat-btn-ghost !h-9 !rounded-full !border !border-[color:var(--line)] !bg-transparent !px-4 !text-xs !text-[color:var(--bad-fg)]"
                          size="sm"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Reject
                        </Button>
                        <Button variant="ghost" size="sm" className="!h-9 !rounded-full !px-4 !text-xs !text-[color:var(--text-3)]">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default TaskApproval;
