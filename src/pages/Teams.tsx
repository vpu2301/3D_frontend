
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, Plus, Users, Crown, Settings } from 'lucide-react';

const Teams = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');

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

  const teams = [
    { id: 1, name: 'Sales Team', members: 8, aiEmployees: 3, leader: 'John Doe', iconColor: 'text-orange-600', bgColor: 'from-orange-100 to-amber-100' },
    { id: 2, name: 'Marketing Team', members: 6, aiEmployees: 2, leader: 'Jane Smith', iconColor: 'text-pink-600', bgColor: 'from-pink-100 to-fuchsia-100' },
    { id: 3, name: 'Operations Team', members: 10, aiEmployees: 4, leader: 'Mike Johnson', iconColor: 'text-blue-600', bgColor: 'from-blue-100 to-indigo-100' },
    { id: 4, name: 'Finance Team', members: 4, aiEmployees: 1, leader: 'Sarah Wilson', iconColor: 'text-green-600', bgColor: 'from-green-100 to-teal-100' },
  ];

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
                  <h1 className="text-3xl font-light text-gray-900">Teams</h1>
                  <p className="text-gray-600">Manage your organization's teams and members</p>
                </div>
                <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
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
                            <UserCheck className={`h-4 w-4 ${team.iconColor}`} />
                          </div>
                          <span className="font-medium">{team.name}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                          <Settings className="h-4 w-4" />
                        </Button>
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
                          <span className="text-sm text-gray-700">Members: {team.members}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded bg-gray-100">
                            <UserCheck className="h-3 w-3 text-green-600" />
                          </div>
                          <span className="text-sm text-gray-700">AI Employees: {team.aiEmployees}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full text-xs bg-gray-50 hover:bg-gray-100 border-gray-200"
                        >
                          Manage Team
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Teams;
