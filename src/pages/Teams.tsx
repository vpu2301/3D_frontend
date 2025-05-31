
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UserCheck, Plus, Users, Crown } from 'lucide-react';

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
    { id: 1, name: 'Sales Team', members: 8, aiEmployees: 3, leader: 'John Doe' },
    { id: 2, name: 'Marketing Team', members: 6, aiEmployees: 2, leader: 'Jane Smith' },
    { id: 3, name: 'Operations Team', members: 10, aiEmployees: 4, leader: 'Mike Johnson' },
    { id: 4, name: 'Finance Team', members: 4, aiEmployees: 1, leader: 'Sarah Wilson' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            
            <main className="flex-1 p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <div>
                    <h1 className="text-3xl font-light text-gray-900">Teams</h1>
                    <p className="text-gray-600">Manage your organization's teams and members</p>
                  </div>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Team
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teams.map((team) => (
                  <Card key={team.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <UserCheck className="h-5 w-5 mr-2" />
                        {team.name}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <Crown className="h-4 w-4 text-yellow-600" />
                          <span className="text-sm text-gray-600">Leader: {team.leader}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-gray-600">Members: {team.members}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <UserCheck className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-600">AI Employees: {team.aiEmployees}</span>
                        </div>
                        <Button variant="outline" className="w-full">
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
