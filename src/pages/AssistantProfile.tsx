
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Bot, 
  Settings, 
  Activity, 
  MessageCircle, 
  Clock, 
  Shield, 
  Users, 
  Zap, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  Target,
  BarChart3,
  Workflow,
  ArrowLeft
} from 'lucide-react';

const AssistantProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [assistant, setAssistant] = useState<any>(null);

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

    // Load assistant data (from localStorage or API)
    const storedAssistants = JSON.parse(localStorage.getItem('aiAssistants') || '[]');
    const defaultAssistants = [
      { id: 1, name: 'Customer Support Assistant', type: 'Support', conversations: 145, status: 'Active', iconColor: 'text-sky-600', bgColor: 'from-sky-100 to-blue-100' },
      { id: 2, name: 'Sales Assistant', type: 'Sales', conversations: 89, status: 'Active', iconColor: 'text-orange-600', bgColor: 'from-orange-100 to-red-100' },
      { id: 3, name: 'Technical Helper', type: 'Technical', conversations: 67, status: 'Active', iconColor: 'text-slate-600', bgColor: 'from-slate-100 to-gray-100' },
      { id: 4, name: 'HR Assistant', type: 'HR', conversations: 34, status: 'Idle', iconColor: 'text-lime-600', bgColor: 'from-lime-100 to-green-100' },
    ];
    
    const allAssistants = [...defaultAssistants, ...storedAssistants];
    const foundAssistant = allAssistants.find(a => a.id.toString() === id);
    
    if (foundAssistant) {
      // Add mock data for demonstration
      setAssistant({
        ...foundAssistant,
        efficiency: 94,
        responsetime: 1.2,
        satisfactionScore: 4.7,
        tasksCompleted: 1247,
        totalCostSavings: 45600,
        uptime: 99.8,
        capabilities: foundAssistant.capabilities || ['Customer Service', 'Email Management', 'Document Processing'],
        integrations: foundAssistant.integrations || ['Slack', 'Salesforce', 'Gmail'],
        canMakeDecisions: foundAssistant.canMakeDecisions || ['Customer Responses', 'Meeting Scheduling'],
        approvalRequired: foundAssistant.approvalRequired || ['Financial Transactions', 'Policy Changes'],
        autonomyLevel: foundAssistant.autonomyLevel || 'semi-autonomous',
        scope: foundAssistant.scope || 'team',
        workingHours: foundAssistant.workingHours || '24/7',
        maxBudgetLimit: foundAssistant.maxBudgetLimit || 1000,
        recentActivities: [
          { action: 'Resolved customer inquiry', time: '2 minutes ago', status: 'completed' },
          { action: 'Scheduled team meeting', time: '15 minutes ago', status: 'completed' },
          { action: 'Processed expense report', time: '1 hour ago', status: 'pending_approval' },
          { action: 'Generated weekly report', time: '2 hours ago', status: 'completed' },
        ]
      });
    }
  }, [id, navigate]);

  if (!assistant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Assistant not found</h3>
          <Button onClick={() => navigate('/ai-assistants')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assistants
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            
            <main className="flex-1 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate('/ai-assistants')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${assistant.bgColor || 'from-blue-100 to-indigo-100'}`}>
                    <Bot className={`h-8 w-8 ${assistant.iconColor || 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-light text-gray-900">{assistant.name}</h1>
                    <p className="text-gray-600">{assistant.type} • {assistant.department}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant={assistant.status === 'Active' ? 'default' : 'secondary'}
                    className={assistant.status === 'Active' ? 'bg-green-500' : ''}
                  >
                    {assistant.status}
                  </Badge>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/ai-assistants/${id}/configure`)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Efficiency</p>
                        <p className="text-2xl font-light text-gray-900">{assistant.efficiency}%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-green-600" />
                    </div>
                    <Progress value={assistant.efficiency} className="mt-3" />
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Response Time</p>
                        <p className="text-2xl font-light text-gray-900">{assistant.responsetime}s</p>
                      </div>
                      <Clock className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Satisfaction</p>
                        <p className="text-2xl font-light text-gray-900">{assistant.satisfactionScore}/5</p>
                      </div>
                      <Target className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Cost Savings</p>
                        <p className="text-2xl font-light text-gray-900">${assistant.totalCostSavings.toLocaleString()}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Tabs */}
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                  <TabsTrigger value="autonomy">Autonomy</TabsTrigger>
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Performance Metrics */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BarChart3 className="h-5 w-5 mr-2" />
                          Performance Metrics
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Tasks Completed</span>
                          <span className="font-medium">{assistant.tasksCompleted.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Conversations</span>
                          <span className="font-medium">{assistant.conversations}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Uptime</span>
                          <span className="font-medium">{assistant.uptime}%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Working Hours</span>
                          <Badge variant="outline">{assistant.workingHours}</Badge>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Configuration Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Settings className="h-5 w-5 mr-2" />
                          Configuration
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Scope</span>
                          <Badge variant="outline" className="capitalize">{assistant.scope}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Autonomy Level</span>
                          <Badge variant="outline" className="capitalize">{assistant.autonomyLevel.replace('-', ' ')}</Badge>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Budget Authority</span>
                          <span className="font-medium">${assistant.maxBudgetLimit}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Department</span>
                          <Badge variant="outline">{assistant.department}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Activity className="h-5 w-5 mr-2" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {assistant.recentActivities.map((activity: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              {activity.status === 'completed' ? (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              ) : (
                                <AlertCircle className="h-5 w-5 text-orange-600" />
                              )}
                              <div>
                                <p className="font-medium text-sm">{activity.action}</p>
                                <p className="text-xs text-gray-600">{activity.time}</p>
                              </div>
                            </div>
                            <Badge 
                              variant={activity.status === 'completed' ? 'default' : 'secondary'}
                              className={activity.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}
                            >
                              {activity.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="capabilities" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Zap className="h-5 w-5 mr-2" />
                        Assistant Capabilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {assistant.capabilities.map((capability: string, index: number) => (
                          <div key={index} className="p-4 bg-blue-50 rounded-lg text-center">
                            <p className="font-medium text-blue-900">{capability}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="autonomy" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-green-700">
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Can Make Decisions For
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {assistant.canMakeDecisions.map((decision: string, index: number) => (
                            <div key={index} className="p-3 bg-green-50 rounded-lg">
                              <p className="text-green-800 font-medium">{decision}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center text-orange-700">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          Requires Approval For
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {assistant.approvalRequired.map((approval: string, index: number) => (
                            <div key={index} className="p-3 bg-orange-50 rounded-lg">
                              <p className="text-orange-800 font-medium">{approval}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="integrations" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Workflow className="h-5 w-5 mr-2" />
                        Connected Integrations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {assistant.integrations.map((integration: string, index: number) => (
                          <div key={index} className="p-4 border rounded-lg text-center hover:bg-gray-50 transition-colors">
                            <p className="font-medium">{integration}</p>
                            <p className="text-xs text-gray-600 mt-1">Connected</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="activity" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Calendar className="h-5 w-5 mr-2" />
                        Activity Log
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {assistant.recentActivities.map((activity: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center space-x-4">
                              {activity.status === 'completed' ? (
                                <CheckCircle className="h-6 w-6 text-green-600" />
                              ) : (
                                <AlertCircle className="h-6 w-6 text-orange-600" />
                              )}
                              <div>
                                <p className="font-medium">{activity.action}</p>
                                <p className="text-sm text-gray-600">{activity.time}</p>
                              </div>
                            </div>
                            <Badge 
                              variant={activity.status === 'completed' ? 'default' : 'secondary'}
                              className={activity.status === 'completed' ? 'bg-green-500' : 'bg-orange-500'}
                            >
                              {activity.status.replace('_', ' ')}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AssistantProfile;
