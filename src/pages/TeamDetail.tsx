import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Users, Crown, Bot, Settings, Mail, Plus, UserPlus } from 'lucide-react';

const TeamDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userEmail, setUserEmail] = useState('');

  // Mock team data - in real app this would come from an API
  const team = {
    id: parseInt(id || '1'),
    name: 'Sales Team',
    description: 'Responsible for driving revenue growth and managing client relationships',
    leader: 'John Doe',
    members: [
      { id: 1, name: 'John Doe', email: 'john@company.com', role: 'Team Lead', avatar: 'JD' },
      { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', role: 'Senior Sales Rep', avatar: 'SJ' },
      { id: 3, name: 'Mike Wilson', email: 'mike@company.com', role: 'Sales Rep', avatar: 'MW' },
      { id: 4, name: 'Lisa Chen', email: 'lisa@company.com', role: 'Sales Rep', avatar: 'LC' },
    ],
    aiEmployees: [
      { id: 1, name: 'Emma', role: 'Sales Assistant', status: 'Active' },
      { id: 2, name: 'Maya', role: 'Marketing Assistant', status: 'Active' },
    ],
    stats: {
      totalTasks: 45,
      completedTasks: 38,
      activeTasks: 7,
      monthlyGoal: 100000,
      currentRevenue: 75000
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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-blue-50">
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
                    Invite Members
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
                    <div className="text-2xl font-light text-blue-600">{team.members.length}</div>
                    <div className="text-sm text-gray-600">Team Members</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-light text-green-600">{team.aiEmployees.length}</div>
                    <div className="text-sm text-gray-600">AI Employees</div>
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
                {/* Team Members */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Team Members</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Member
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {team.members.map((member) => (
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

                {/* AI Employees */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Bot className="h-5 w-5" />
                        <span>AI Employees</span>
                      </div>
                      <Button size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-2" />
                        Assign AI
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {team.aiEmployees.map((ai) => (
                        <div key={ai.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <div className="font-medium">{ai.name}</div>
                              <div className="text-sm text-gray-600">{ai.role}</div>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-green-700 bg-green-50">
                            {ai.status}
                          </Badge>
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
