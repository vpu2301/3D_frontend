
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Bot, Plus, Settings, Activity, Eye, MessageCircle, Users, Building } from 'lucide-react';
import CreateAssistantDialog from '@/components/CreateAssistantDialog';

const AIEmployees = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [employees, setEmployees] = useState([
    { 
      id: 1, 
      name: 'Aria', 
      department: 'Sales', 
      status: 'Active', 
      tasks: 12, 
      conversations: 89, 
      type: 'Sales', 
      iconColor: 'text-pink-600', 
      bgColor: 'from-pink-100 to-rose-100', 
      scope: 'team',
      avatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face'
    },
    { 
      id: 2, 
      name: 'Atlas', 
      department: 'Operations', 
      status: 'Active', 
      tasks: 8, 
      conversations: 145, 
      type: 'Support', 
      iconColor: 'text-blue-600', 
      bgColor: 'from-blue-100 to-cyan-100', 
      scope: 'team',
      avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face'
    },
    { 
      id: 3, 
      name: 'Felix', 
      department: 'Finance', 
      status: 'Idle', 
      tasks: 5, 
      conversations: 34, 
      type: 'Finance', 
      iconColor: 'text-green-600', 
      bgColor: 'from-green-100 to-emerald-100', 
      scope: 'team',
      avatar: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop&crop=face'
    },
    { 
      id: 4, 
      name: 'Maya', 
      department: 'Marketing', 
      status: 'Active', 
      tasks: 15, 
      conversations: 67, 
      type: 'Marketing', 
      iconColor: 'text-purple-600', 
      bgColor: 'from-purple-100 to-violet-100', 
      scope: 'personal',
      avatar: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=400&fit=crop&crop=face'
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

    // Load created assistants from localStorage and add them as employees
    const storedAssistants = JSON.parse(localStorage.getItem('aiAssistants') || '[]');
    if (storedAssistants.length > 0) {
      const assistantEmployees = storedAssistants.map((assistant: any) => ({
        id: `assistant-${assistant.id}`,
        name: assistant.name,
        department: assistant.department,
        status: assistant.status || 'Active',
        tasks: Math.floor(Math.random() * 20) + 1,
        conversations: assistant.conversations || Math.floor(Math.random() * 100) + 1,
        type: assistant.type,
        iconColor: assistant.iconColor || 'text-indigo-600',
        bgColor: assistant.bgColor || 'from-indigo-100 to-blue-100',
        scope: assistant.scope || 'team',
        avatar: assistant.avatar || 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=400&h=400&fit=crop&crop=face',
        isAssistant: true
      }));

      setEmployees(prev => {
        const existingIds = new Set(prev.map(emp => emp.id));
        const newEmployees = assistantEmployees.filter((emp: any) => !existingIds.has(emp.id));
        return [...prev, ...newEmployees];
      });
    }
  }, [navigate]);

  const handleEmployeeCreated = (newEmployee: any) => {
    const gradientOptions = [
      { iconColor: 'text-violet-600', bgColor: 'from-violet-100 to-purple-100' },
      { iconColor: 'text-emerald-600', bgColor: 'from-emerald-100 to-teal-100' },
      { iconColor: 'text-amber-600', bgColor: 'from-amber-100 to-yellow-100' },
      { iconColor: 'text-rose-600', bgColor: 'from-rose-100 to-pink-100' },
      { iconColor: 'text-cyan-600', bgColor: 'from-cyan-100 to-blue-100' }
    ];
    
    const avatarOptions = [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=400&h=400&fit=crop&crop=face'
    ];
    
    const colorScheme = gradientOptions[employees.length % gradientOptions.length];
    const selectedAvatar = avatarOptions[employees.length % avatarOptions.length];
    
    const employeeWithGradient = {
      ...newEmployee,
      ...colorScheme,
      avatar: selectedAvatar,
      tasks: Math.floor(Math.random() * 20) + 1,
      conversations: Math.floor(Math.random() * 100) + 1
    };

    setEmployees(prev => [...prev, employeeWithGradient]);

    const storedAssistants = JSON.parse(localStorage.getItem('aiAssistants') || '[]');
    localStorage.setItem('aiAssistants', JSON.stringify([...storedAssistants, employeeWithGradient]));
  };

  const handleViewEmployee = (employeeId: string | number) => {
    navigate(`/ai-assistants/${employeeId}`);
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
                  <h1 className="text-3xl font-light text-gray-900">AI Employees</h1>
                  <p className="text-gray-600">Manage your artificial intelligence workforce and assistants</p>
                </div>
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add AI Employee
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {employees.map((employee) => (
                  <Card key={employee.id} className="bg-white/80 border-gray-200/50 hover:shadow-lg transition-all duration-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={employee.avatar} alt={employee.name} />
                              <AvatarFallback className={`bg-gradient-to-br ${employee.bgColor} ${employee.iconColor} font-medium`}>
                                {employee.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-1 -right-1 p-1 rounded-full bg-gradient-to-br ${employee.bgColor}`}>
                              <Bot className={`h-3 w-3 ${employee.iconColor}`} />
                            </div>
                          </div>
                          <div>
                            <span className="font-medium">{employee.name}</span>
                            {(employee as any).isAssistant && (
                              <span className="block text-xs text-gray-600 font-normal">AI Assistant</span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="hover:bg-gray-100 h-8 w-8"
                            onClick={() => handleViewEmployee(employee.id)}
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
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">
                            {employee.type || employee.department}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            {employee.scope === 'team' ? (
                              <Building className="h-3 w-3 text-gray-600" />
                            ) : (
                              <Users className="h-3 w-3 text-gray-600" />
                            )}
                            <span className="text-xs text-gray-600 capitalize">{employee.scope}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded bg-gray-100">
                            <Activity className="h-3 w-3 text-gray-600" />
                          </div>
                          <span className={`text-sm font-medium ${employee.status === 'Active' ? 'text-green-700' : 'text-amber-700'}`}>
                            {employee.status}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="p-1 rounded bg-gray-100">
                            <MessageCircle className="h-3 w-3 text-gray-600" />
                          </div>
                          <span className="text-sm text-gray-700">Conversations: {employee.conversations}</span>
                        </div>
                        <p className="text-sm text-gray-700">Active Tasks: {employee.tasks}</p>
                        <div className="flex space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="flex-1 text-xs bg-gray-50 hover:bg-gray-100 border-gray-200"
                            onClick={() => handleViewEmployee(employee.id)}
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs bg-gray-50 hover:bg-gray-100 border-gray-200"
                          >
                            <Settings className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {employees.length === 0 && (
                <div className="text-center py-12">
                  <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No AI employees yet</h3>
                  <p className="text-gray-600 mb-4">Create your first AI employee to get started</p>
                  <Button 
                    onClick={() => setShowCreateDialog(true)}
                    className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add AI Employee
                  </Button>
                </div>
              )}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>

      <CreateAssistantDialog 
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onAssistantCreated={handleEmployeeCreated}
      />
    </div>
  );
};

export default AIEmployees;
