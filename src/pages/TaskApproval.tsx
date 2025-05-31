
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Bot, AlertCircle, FileText, DollarSign, Users } from 'lucide-react';

const TaskApproval = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
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
      assistant: 'Felix (Legal Assistant)',
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
    const email = localStorage.getItem('userEmail');
    
    if (isAuthenticated !== 'true') {
      navigate('/login');
      return;
    }
    
    if (email) {
      setUserEmail(email);
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
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-orange-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            
            <main className="flex-1 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-light text-gray-900">Task Approvals</h1>
                  <p className="text-gray-600">Review and approve tasks from your AI assistants</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    {pendingTasks.length} pending
                  </Badge>
                  <Button variant="outline" size="sm">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    View All Notifications
                  </Button>
                </div>
              </div>

              {pendingTasks.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                  <p className="text-gray-600">No pending approvals at the moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingTasks.map((task) => (
                    <Card key={task.id} className="bg-white/80 border-gray-200/50 hover:shadow-lg transition-all duration-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between text-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-lg bg-gradient-to-br ${task.bgColor}`}>
                              <task.icon className={`h-5 w-5 ${task.iconColor}`} />
                            </div>
                            <div>
                              <span className="font-medium text-gray-900">{task.title}</span>
                              <div className="flex items-center space-x-2 mt-1">
                                <Badge className={getPriorityColor(task.priority)} variant="secondary">
                                  {task.priority}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {task.category}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
                              <Bot className="h-3 w-3" />
                              <span>{task.assistant}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-400">
                              <Clock className="h-3 w-3" />
                              <span>{formatTimeAgo(task.timestamp)}</span>
                            </div>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-gray-700 mb-4">{task.description}</p>
                        <div className="flex space-x-3">
                          <Button 
                            onClick={() => handleApprove(task.id)}
                            className="bg-green-600 hover:bg-green-700 text-white"
                            size="sm"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            onClick={() => handleReject(task.id)}
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            size="sm"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
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
