
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus, Settings, Activity } from 'lucide-react';

const AIEmployees = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Aria', department: 'Sales', status: 'Active', tasks: 12, iconColor: 'text-pink-600', bgColor: 'from-pink-100 to-rose-100' },
    { id: 2, name: 'Atlas', department: 'Operations', status: 'Active', tasks: 8, iconColor: 'text-blue-600', bgColor: 'from-blue-100 to-cyan-100' },
    { id: 3, name: 'Felix', department: 'Finance', status: 'Idle', tasks: 5, iconColor: 'text-green-600', bgColor: 'from-green-100 to-emerald-100' },
    { id: 4, name: 'Maya', department: 'Marketing', status: 'Active', tasks: 15, iconColor: 'text-purple-600', bgColor: 'from-purple-100 to-violet-100' },
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
        iconColor: 'text-indigo-600',
        bgColor: 'from-indigo-100 to-blue-100',
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
                <div>
                  <h1 className="text-3xl font-light text-gray-900">AI Employees</h1>
                  <p className="text-gray-600">Manage your artificial intelligence workforce</p>
                </div>
                <Button className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Add AI Employee
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map((employee) => (
                  <Card key={employee.id} className="bg-white/80 border-gray-200/50 hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <div className={`p-2 rounded-lg bg-gradient-to-br ${employee.bgColor}`}>
                            <Users className={`h-4 w-4 ${employee.iconColor}`} />
                          </div>
                          <div>
                            <span className="font-medium">{employee.name}</span>
                            {(employee as any).isAssistant && (
                              <span className="block text-xs text-gray-600 font-normal">AI Assistant</span>
                            )}
                          </div>
                        </div>
                        <Button variant="ghost" size="icon" className="hover:bg-gray-100">
                          <Settings className="h-4 w-4" />
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">
                            {employee.department}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded bg-gray-100">
                            <Activity className="h-3 w-3 text-gray-600" />
                          </div>
                          <span className={`text-sm font-medium ${employee.status === 'Active' ? 'text-green-700' : 'text-amber-700'}`}>
                            {employee.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700">Active Tasks: {employee.tasks}</p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full text-xs bg-gray-50 hover:bg-gray-100 border-gray-200"
                        >
                          Configure
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

export default AIEmployees;
