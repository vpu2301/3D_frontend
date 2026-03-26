
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
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import CommunicationSettings from '@/components/dashboard/CommunicationSettings';
import OwnerInfo from '@/components/dashboard/OwnerInfo';
import AIEmployeeConnections from '@/components/dashboard/AIEmployeeConnections';
import EnhancedActivityLog from '@/components/dashboard/EnhancedActivityLog';
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
  ArrowLeft,
  Network,
  UserCheck
} from 'lucide-react';

const AssistantProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [assistant, setAssistant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      const email = localStorage.getItem('userEmail');
      
      console.log('AssistantProfile - Auth check:', { isAuthenticated, email, assistantId: id });
      
      if (isAuthenticated !== 'true') {
        console.log('Not authenticated, redirecting to login');
        navigate('/login');
        return false;
      }
      
      if (email) {
        setUserEmail(email);
      }
      
      return true;
    };

    const loadAssistant = () => {
      // Load assistant data (from localStorage or API)
      const storedAssistants = JSON.parse(localStorage.getItem('aiAssistants') || '[]');
      const defaultAssistants = [
        { 
          id: 1, 
          name: 'Aria', 
          type: 'Sales', 
          department: 'Sales', 
          conversations: 89, 
          status: 'Active', 
          iconColor: 'text-pink-600', 
          bgColor: 'from-pink-100 to-rose-100',
          avatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face'
        },
        { 
          id: 2, 
          name: 'Atlas', 
          type: 'Support', 
          department: 'Operations', 
          conversations: 145, 
          status: 'Active', 
          iconColor: 'text-blue-600', 
          bgColor: 'from-blue-100 to-cyan-100',
          avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face'
        },
        { 
          id: 3, 
          name: 'Felix', 
          type: 'Finance', 
          department: 'Finance', 
          conversations: 34, 
          status: 'Idle', 
          iconColor: 'text-green-600', 
          bgColor: 'from-green-100 to-emerald-100',
          avatar: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop&crop=face'
        },
        { 
          id: 4, 
          name: 'Maya', 
          type: 'Marketing', 
          department: 'Marketing', 
          conversations: 67, 
          status: 'Active', 
          iconColor: 'text-purple-600', 
          bgColor: 'from-purple-100 to-violet-100',
          avatar: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=400&fit=crop&crop=face'
        },
      ];
      
      const allAssistants = [...defaultAssistants, ...storedAssistants];
      console.log('Looking for assistant with ID:', id, 'in assistants:', allAssistants);
      
      const foundAssistant = allAssistants.find(a => a.id.toString() === id);
      
      if (foundAssistant) {
        console.log('Found assistant:', foundAssistant);
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
          avatar: foundAssistant.avatar || 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=400&h=400&fit=crop&crop=face',
          owner: {
            type: 'person',
            name: 'Sarah Johnson',
            email: 'sarah.johnson@company.com',
            role: 'Sales Director',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b9b0bce2?w=400&h=400&fit=crop&crop=face'
          },
          connections: [
            {
              id: '2',
              name: 'Atlas',
              type: 'Support Assistant',
              department: 'Operations',
              location: 'internal',
              avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face',
              status: 'active',
              lastInteraction: '2 hours ago'
            },
            {
              id: '3',
              name: 'Felix',
              type: 'Finance Assistant',
              department: 'Finance',
              location: 'internal',
              avatar: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop&crop=face',
              status: 'active',
              lastInteraction: '1 day ago'
            },
            {
              id: 'ext1',
              name: 'Nova',
              type: 'Marketing Assistant',
              department: 'Marketing',
              location: 'external',
              company: 'Partner Corp',
              avatar: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=400&fit=crop&crop=face',
              status: 'active',
              lastInteraction: '3 hours ago'
            }
          ],
          enhancedActivities: [
            {
              id: '1',
              action: 'Processed customer inquiry from John Doe',
              time: '2 minutes ago',
              status: 'completed',
              category: 'communication',
              priority: 'medium',
              details: [
                {
                  timestamp: '2024-01-15 14:30:00',
                  description: 'Received inquiry via email',
                  metadata: { source: 'email', subject: 'Product pricing question' }
                },
                {
                  timestamp: '2024-01-15 14:31:15',
                  description: 'Analyzed inquiry and categorized as pricing request',
                  metadata: { category: 'pricing', confidence: 0.95 }
                },
                {
                  timestamp: '2024-01-15 14:32:00',
                  description: 'Generated response and sent to customer',
                  metadata: { responseTime: '2 minutes', customerSatisfaction: 4.8 }
                }
              ],
              participants: ['John Doe', 'Aria'],
              relatedConnections: ['Atlas', 'Felix']
            },
            {
              id: '2',
              action: 'Collaborated with Atlas on support ticket',
              time: '15 minutes ago',
              status: 'completed',
              category: 'collaboration',
              priority: 'high',
              details: [
                {
                  timestamp: '2024-01-15 14:15:00',
                  description: 'Escalated complex inquiry to Atlas',
                  metadata: { ticketId: 'TK-12345', escalationReason: 'Technical complexity' }
                },
                {
                  timestamp: '2024-01-15 14:20:00',
                  description: 'Received resolution from Atlas',
                  metadata: { resolutionTime: '5 minutes', solution: 'API configuration update' }
                }
              ],
              participants: ['Aria', 'Atlas'],
              relatedConnections: ['Atlas']
            },
            {
              id: '3',
              action: 'System health check completed',
              time: '1 hour ago',
              status: 'completed',
              category: 'system',
              priority: 'low',
              details: [
                {
                  timestamp: '2024-01-15 13:30:00',
                  description: 'Initiated system health check',
                  metadata: { components: ['memory', 'processing', 'network'] }
                },
                {
                  timestamp: '2024-01-15 13:31:00',
                  description: 'All systems operational',
                  metadata: { memoryUsage: '45%', cpuUsage: '23%', networkLatency: '12ms' }
                }
              ],
              participants: ['System Monitor'],
              relatedConnections: []
            },
            {
              id: '4',
              action: 'Generated weekly sales report',
              time: '2 hours ago',
              status: 'completed',
              category: 'task',
              priority: 'medium',
              details: [
                {
                  timestamp: '2024-01-15 12:30:00',
                  description: 'Started data collection for weekly report',
                  metadata: { dateRange: '2024-01-08 to 2024-01-14', sources: ['CRM', 'Email', 'Calls'] }
                },
                {
                  timestamp: '2024-01-15 12:45:00',
                  description: 'Compiled and formatted report',
                  metadata: { totalLeads: 127, conversions: 23, revenue: '$45,600' }
                }
              ],
              participants: ['Aria', 'Sales Team'],
              relatedConnections: ['Felix']
            }
          ],
          recentActivities: [
            { action: 'Resolved customer inquiry', time: '2 minutes ago', status: 'completed' },
            { action: 'Scheduled team meeting', time: '15 minutes ago', status: 'completed' },
            { action: 'Processed expense report', time: '1 hour ago', status: 'pending_approval' },
            { action: 'Generated weekly report', time: '2 hours ago', status: 'completed' },
          ]
        });
      } else {
        console.log('Assistant not found');
      }
      setLoading(false);
    };

    if (checkAuth()) {
      loadAssistant();
    }
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading assistant...</p>
        </div>
      </div>
    );
  }

  if (!assistant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Assistant not found</h3>
          <p className="text-gray-600 mb-4">The assistant with ID "{id}" could not be found.</p>
          <Button onClick={() => navigate('/ai-employees')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to AI Employees
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(30,25%,97%)]">
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
                    onClick={() => navigate('/ai-employees')}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                  <div className="relative">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={assistant.avatar} alt={assistant.name} />
                      <AvatarFallback className={`bg-gradient-to-br ${assistant.bgColor || 'from-blue-100 to-indigo-100'} ${assistant.iconColor || 'text-blue-600'} text-lg font-medium`}>
                        {assistant.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 p-2 rounded-full bg-gradient-to-br ${assistant.bgColor || 'from-blue-100 to-indigo-100'}`}>
                      <Bot className={`h-4 w-4 ${assistant.iconColor || 'text-blue-600'}`} />
                    </div>
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
                <TabsList className="grid w-full grid-cols-7">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="owner">Owner</TabsTrigger>
                  <TabsTrigger value="connections">Connections</TabsTrigger>
                  <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                  <TabsTrigger value="autonomy">Autonomy</TabsTrigger>
                  <TabsTrigger value="communication">Communication</TabsTrigger>
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

                <TabsContent value="owner" className="space-y-6">
                  <OwnerInfo owner={assistant.owner} />
                </TabsContent>

                <TabsContent value="connections" className="space-y-6">
                  <AIEmployeeConnections connections={assistant.connections} />
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

                <TabsContent value="communication" className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <Network className="h-6 w-6 text-blue-600" />
                      <h3 className="text-xl font-medium text-gray-900">Communication Settings for {assistant.name}</h3>
                    </div>
                    <p className="text-gray-600 mb-6">
                      Configure how {assistant.name} communicates with other AI employees and external networks.
                    </p>
                    <CommunicationSettings />
                  </div>
                </TabsContent>

                <TabsContent value="activity" className="space-y-6">
                  <EnhancedActivityLog activities={assistant.enhancedActivities} />
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
