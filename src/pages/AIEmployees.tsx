
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
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Aria', department: 'Sales', status: 'Active', tasks: 12, gradient: 'from-pink-100 to-rose-100' },
    { id: 2, name: 'Atlas', department: 'Operations', status: 'Active', tasks: 8, gradient: 'from-blue-100 to-cyan-100' },
    { id: 3, name: 'Felix', department: 'Finance', status: 'Idle', tasks: 5, gradient: 'from-green-100 to-emerald-100' },
    { id: 4, name: 'Maya', department: 'Marketing', status: 'Active', tasks: 15, gradient: 'from-purple-100 to-violet-100' },
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

    // Load created assistants from localStorage and add them as employees
    const storedAssistants = JSON.parse(localStorage.getItem('aiAssistants') || '[]');
    if (storedAssistants.length > 0) {
      const assistantEmployees = storedAssistants.map((assistant: any) => ({
        id: `assistant-${assistant.id}`,
        name: assistant.name,
        department: assistant.department,
        status: assistant.status || 'Active',
        tasks: Math.floor(Math.random() * 20) + 1, // Random task count for demo
        gradient: assistant.gradient || 'from-indigo-100 to-blue-100',
        isAssistant: true
      }));

      setEmployees(prev => {
        // Avoid duplicates
        const existingIds = new Set(prev.map(emp => emp.id));
        const newEmployees = assistantEmployees.filter((emp: any) => !existingIds.has(emp.id));
        return [...prev, ...newEmployees];
      });
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-purple-50">
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
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add AI Employee
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map((employee) => (
                  <Card key={employee.id} className={`bg-gradient-to-br ${employee.gradient} border-0 shadow-sm hover:shadow-lg transition-all duration-200`}>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center">
                          <div className="p-2 rounded-lg bg-white/50 mr-3">
                            <Users className="h-5 w-5 text-gray-700" />
                          </div>
                          <div>
                            <span className="block">{employee.name}</span>
                            {(employee as any).isAssistant && (
                              <span className="text-xs text-gray-600 font-normal">AI Assistant</span>
                            )}
                          </div>
                        </span>
                        <Button variant="ghost" size="icon" className="hover:bg-white/30">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-700">Department: {employee.department}</p>
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded bg-white/40">
                            <Activity className="h-3 w-3 text-gray-600" />
                          </div>
                          <span className={`text-sm font-medium ${employee.status === 'Active' ? 'text-green-700' : 'text-amber-700'}`}>
                            {employee.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">Active Tasks: {employee.tasks}</p>
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
