
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus, Bot, Crown, Settings, Eye, UserPlus } from 'lucide-react';
import CreateTeamDialog from '@/components/CreateTeamDialog';

const Teams = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [teams, setTeams] = useState([
    { 
      id: 1, 
      name: 'Sales Hybrid Team', 
      humanMembers: 5, 
      aiWorkers: 3, 
      leader: 'John Doe', 
      iconColor: 'text-orange-600', 
      bgColor: 'from-orange-100 to-amber-100',
      description: 'Human sales reps working alongside AI assistants'
    },
    { 
      id: 2, 
      name: 'Marketing Automation', 
      humanMembers: 3, 
      aiWorkers: 4, 
      leader: 'Jane Smith', 
      iconColor: 'text-pink-600', 
      bgColor: 'from-pink-100 to-fuchsia-100',
      description: 'Content creation and campaign management team'
    },
    { 
      id: 3, 
      name: 'Operations Support', 
      humanMembers: 6, 
      aiWorkers: 8, 
      leader: 'Mike Johnson', 
      iconColor: 'text-blue-600', 
      bgColor: 'from-blue-100 to-indigo-100',
      description: 'Process automation and workflow optimization'
    },
    { 
      id: 4, 
      name: 'Customer Success', 
      humanMembers: 4, 
      aiWorkers: 2, 
      leader: 'Sarah Wilson', 
      iconColor: 'text-green-600', 
      bgColor: 'from-green-100 to-teal-100',
      description: '24/7 customer support with AI escalation'
    },
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

  const handleTeamCreated = (newTeam: any) => {
    setTeams(prev => [...prev, newTeam]);
  };

  const handleViewTeam = (teamId: number) => {
    navigate(`/teams/${teamId}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-purple-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            
            <main className="flex-1 p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-light text-gray-900">Human Teams</h1>
                  <p className="text-gray-600">Manage hybrid teams of human workers and AI assistants</p>
                </div>
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Team
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <Card key={team.id} className="bg-white/80 border-gray-200/50 hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${team.bgColor}`}>
                            <Users className={`h-4 w-4 ${team.iconColor}`} />
                          </div>
                          <div>
                            <span className="font-medium">{team.name}</span>
                            <p className="text-xs text-gray-500 font-normal mt-1">{team.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hover:bg-gray-100 h-8 w-8"
                            onClick={() => handleViewTeam(team.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="hover:bg-gray-100 h-8 w-8">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded bg-gray-100">
                            <Crown className="h-3 w-3 text-amber-600" />
                          </div>
                          <span className="text-sm text-gray-700">Leader: {team.leader}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded bg-gray-100">
                            <Users className="h-3 w-3 text-blue-600" />
                          </div>
                          <span className="text-sm text-gray-700">Human Workers: {team.humanMembers}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded bg-gray-100">
                            <Bot className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="text-sm text-gray-700">AI Workers: {team.aiWorkers}</span>
                        </div>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 text-xs bg-gray-50 hover:bg-gray-100 border-gray-200"
                            onClick={() => handleViewTeam(team.id)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Team
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs bg-gray-50 hover:bg-gray-100 border-gray-200"
                          >
                            <UserPlus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>

      <CreateTeamDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onTeamCreated={handleTeamCreated}
      />
    </div>
  );
};

export default Teams;
