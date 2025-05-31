
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus, Settings, Activity } from 'lucide-react';

const AIEmployees = () => {
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

  const employees = [
    { id: 1, name: 'Aria', department: 'Sales', status: 'Active', tasks: 12 },
    { id: 2, name: 'Atlas', department: 'Operations', status: 'Active', tasks: 8 },
    { id: 3, name: 'Felix', department: 'Finance', status: 'Idle', tasks: 5 },
    { id: 4, name: 'Maya', department: 'Marketing', status: 'Active', tasks: 15 },
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
                    <h1 className="text-3xl font-light text-gray-900">AI Employees</h1>
                    <p className="text-gray-600">Manage your artificial intelligence workforce</p>
                  </div>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add AI Employee
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map((employee) => (
                  <Card key={employee.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          <Users className="h-5 w-5 mr-2" />
                          {employee.name}
                        </span>
                        <Button variant="ghost" size="icon">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Department: {employee.department}</p>
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4" />
                          <span className={`text-sm ${employee.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}`}>
                            {employee.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Active Tasks: {employee.tasks}</p>
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

export default AIEmployees;
