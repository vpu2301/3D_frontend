
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Users, Crown, Bot, Settings, Mail, Plus, UserPlus, Activity } from 'lucide-react';

const TeamDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userEmail, setUserEmail] = useState('');

  // Mock team data focused on hybrid human-AI teams
  const team = {
    id: parseInt(id || '1'),
    name: 'Sales Hybrid Team',
    description: 'Human sales representatives working alongside AI assistants for maximum efficiency',
    leader: 'John Doe',
    humanMembers: [
      { id: 1, name: 'John Doe', email: 'john@company.com', role: 'Team Lead', avatar: 'JD' },
      { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Senior Sales Rep', avatar: 'SJ' },
      { id: 3, name: 'Mike Wilson', email: 'mike@company.com', role: 'Sales Rep', avatar: 'MW' },
      { id: 4, name: 'Lisa Chen', email: 'lisa@company.com', role: 'Sales Rep', avatar: 'LC' },
    ],
    aiWorkers: [
      { id: 1, name: 'Emma', role: 'Lead Qualification AI', status: 'Active', efficiency: '95%' },
      { id: 2, name: 'Maya', role: 'Customer Outreach AI', status: 'Active', efficiency: '92%' },
      { id: 3, name: 'Nova', role: 'Data Analysis AI', status: 'Active', efficiency: '98%' },
    ],
    stats: {
      totalTasks: 156,
      completedTasks: 142,
      activeTasks: 14,
      monthlyGoal: 100000,
      currentRevenue: 85000,
      aiProductivity: '340%',
      humanSatisfaction: '4.8/5'
    }
  };

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

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(30,25%,97%)]">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            
            <main className="flex-1 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-light text-gray-900">{team.name}</h1>
                  <p className="text-gray-600">{team.description}</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Workers
                  </Button>
                  <Button>
                    <Settings className="h-4 w-4 mr-2" />
                    Team Settings
                  </Button>
                </div>
              </div>

              {/* Team Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-light text-blue-600">{team.humanMembers.length}</div>
                    <div className="text-sm text-gray-600">Human Workers</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-light text-green-600">{team.aiWorkers.length}</div>
                    <div className="text-sm text-gray-600">AI Workers</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-light text-orange-600">{team.stats.activeTasks}</div>
                    <div className="text-sm text-gray-600">Active Tasks</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-light text-purple-600">
                      {Math.round((team.stats.currentRevenue / team.stats.monthlyGoal) * 100)}%
                    </div>
                    <div className="text-sm text-gray-600">Goal Progress</div>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Human Team Members */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Human Workers</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Human
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {team.humanMembers.map((member) => (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>{member.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{member.name}</span>
                                {member.name === team.leader && (
                                  <Crown className="h-4 w-4 text-amber-500" />
                                )}
                              </div>
                              <div className="text-sm text-gray-600">{member.role}</div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* AI Workers */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-5 w-5" />
                        <span>AI Workers</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Deploy AI
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {team.aiWorkers.map((ai) => (
                        <div key={ai.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="font-medium">{ai.name}</span>
                                <Badge variant="outline" className="text-xs text-green-700 bg-green-50">
                                  {ai.efficiency}
                                </Badge>
                              </div>
                              <div className="text-sm text-gray-600">{ai.role}</div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-green-700 bg-green-50">
                              {ai.status}
                            </Badge>
                            <Button variant="ghost" size="sm">
                              <Activity className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default TeamDetail;
