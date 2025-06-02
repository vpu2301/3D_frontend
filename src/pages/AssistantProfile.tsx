import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CommunicationSettings from '@/components/dashboard/CommunicationSettings';
import { Bot, ArrowLeft, Network } from 'lucide-react';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import AssistantProfileHeader from '@/components/assistant/AssistantProfileHeader';
import AssistantStatsCards from '@/components/assistant/AssistantStatsCards';
import AssistantOverviewTab from '@/components/assistant/AssistantOverviewTab';
import AssistantCapabilitiesTab from '@/components/assistant/AssistantCapabilitiesTab';
import AssistantAutonomyTab from '@/components/assistant/AssistantAutonomyTab';
import AssistantIntegrationsTab from '@/components/assistant/AssistantIntegrationsTab';
import AssistantActivityTab from '@/components/assistant/AssistantActivityTab';

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

  const handleConfigureClick = () => {
    // Navigate to settings page since there's no specific configure route
    navigate('/settings');
  };

  const handleBackClick = () => {
    navigate('/ai-employees');
  };

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
          <Button onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to AI Employees
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            
            <main className="flex-1 p-6">
              <AssistantProfileHeader 
                assistant={assistant}
                onBack={handleBackClick}
                onConfigure={handleConfigureClick}
              />

              <AssistantStatsCards assistant={assistant} />

              {/* Main Content Tabs */}
              <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="capabilities">Capabilities</TabsTrigger>
                  <TabsTrigger value="autonomy">Autonomy</TabsTrigger>
                  <TabsTrigger value="integrations">Integrations</TabsTrigger>
                  <TabsTrigger value="communication">Communication</TabsTrigger>
                  <TabsTrigger value="activity">Activity</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <AssistantOverviewTab assistant={assistant} />
                </TabsContent>

                <TabsContent value="capabilities">
                  <AssistantCapabilitiesTab assistant={assistant} />
                </TabsContent>

                <TabsContent value="autonomy">
                  <AssistantAutonomyTab assistant={assistant} />
                </TabsContent>

                <TabsContent value="integrations">
                  <AssistantIntegrationsTab assistant={assistant} />
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

                <TabsContent value="activity">
                  <AssistantActivityTab assistant={assistant} />
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
