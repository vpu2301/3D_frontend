
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Bot,
  Settings,
  ArrowLeft,
  Save,
  RefreshCw,
  Shield,
  Zap,
  Users,
  DollarSign,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

type ConfigTab = 'general' | 'capabilities' | 'autonomy' | 'integrations' | 'security';

const CONFIG_TABS: { key: ConfigTab; label: string; icon: React.ElementType }[] = [
  { key: 'general',      label: 'General',      icon: Settings },
  { key: 'capabilities', label: 'Capabilities', icon: Zap      },
  { key: 'autonomy',     label: 'Autonomy',     icon: Shield   },
  { key: 'integrations', label: 'Integrations', icon: Users    },
  { key: 'security',     label: 'Security',     icon: Lock     },
];

const AssistantConfiguration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [assistant, setAssistant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ConfigTab>('general');
  const { toast } = useToast();

  // Form state
  const [config, setConfig] = useState({
    name: '',
    description: '',
    type: '',
    department: '',
    scope: 'team',
    autonomyLevel: 'semi-autonomous',
    workingHours: '24/7',
    maxBudgetLimit: 1000,
    canMakeDecisions: ['Customer Responses', 'Meeting Scheduling'],
    approvalRequired: ['Financial Transactions', 'Policy Changes'],
    capabilities: ['Customer Service', 'Email Management', 'Document Processing'],
    integrations: ['Slack', 'Salesforce', 'Gmail'],
    isActive: true,
    requiresApproval: true,
    confidentialityLevel: 'standard'
  });

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      const email = localStorage.getItem('userEmail');
      
      console.log('AssistantConfiguration - Auth check:', { isAuthenticated, email, assistantId: id });
      
      if (isAuthenticated !== 'true') {
        console.log('Not authenticated, redirecting to login');
        navigate('/login');
        return false;
      }
      
      return true;
    };

    const loadAssistant = () => {
      // Load assistant data
      const storedAssistants = JSON.parse(localStorage.getItem('aiAssistants') || '[]');
      const defaultAssistants = [
        { id: 1, name: 'Customer Support Assistant', type: 'Support', department: 'Customer Service', conversations: 145, status: 'Active', iconColor: 'text-sky-600', bgColor: 'from-sky-100 to-blue-100' },
        { id: 2, name: 'Sales Assistant', type: 'Sales', department: 'Sales', conversations: 89, status: 'Active', iconColor: 'text-orange-600', bgColor: 'from-orange-100 to-red-100' },
        { id: 3, name: 'Technical Helper', type: 'Technical', department: 'IT', conversations: 67, status: 'Active', iconColor: 'text-slate-600', bgColor: 'from-slate-100 to-gray-100' },
        { id: 4, name: 'HR Assistant', type: 'HR', department: 'Human Resources', conversations: 34, status: 'Idle', iconColor: 'text-lime-600', bgColor: 'from-lime-100 to-green-100' },
      ];
      
      const allAssistants = [...defaultAssistants, ...storedAssistants];
      console.log('Looking for assistant with ID:', id, 'in assistants:', allAssistants);
      
      const foundAssistant = allAssistants.find(a => a.id.toString() === id);
      
      if (foundAssistant) {
        console.log('Found assistant for configuration:', foundAssistant);
        setAssistant(foundAssistant);
        setConfig({
          name: foundAssistant.name || '',
          description: foundAssistant.description || '',
          type: foundAssistant.type || '',
          department: foundAssistant.department || '',
          scope: foundAssistant.scope || 'team',
          autonomyLevel: foundAssistant.autonomyLevel || 'semi-autonomous',
          workingHours: foundAssistant.workingHours || '24/7',
          maxBudgetLimit: foundAssistant.maxBudgetLimit || 1000,
          canMakeDecisions: foundAssistant.canMakeDecisions || ['Customer Responses', 'Meeting Scheduling'],
          approvalRequired: foundAssistant.approvalRequired || ['Financial Transactions', 'Policy Changes'],
          capabilities: foundAssistant.capabilities || ['Customer Service', 'Email Management', 'Document Processing'],
          integrations: foundAssistant.integrations || ['Slack', 'Salesforce', 'Gmail'],
          isActive: foundAssistant.status === 'Active',
          requiresApproval: foundAssistant.requiresApproval !== false,
          confidentialityLevel: foundAssistant.confidentialityLevel || 'standard'
        });
      } else {
        console.log('Assistant not found for configuration');
      }
      setPageLoading(false);
    };

    if (checkAuth()) {
      loadAssistant();
    }
  }, [id, navigate]);

  const handleSave = () => {
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Configuration Saved",
        description: `${config.name} has been updated successfully.`,
      });
    }, 1000);
  };

  const handleTestAssistant = () => {
    toast({
      title: "Test Started",
      description: "Running assistant tests in the background...",
    });
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading configuration...</p>
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
          <Button onClick={() => navigate('/ai-assistants')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assistants
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(30,25%,97%)]">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <main className="flex-1 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <SidebarTrigger />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/ai-assistants/${id}`)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Profile
                  </Button>
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${assistant.bgColor || 'from-blue-100 to-indigo-100'}`}>
                    <Settings className={`h-8 w-8 ${assistant.iconColor || 'text-blue-600'}`} />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">Configure {assistant.name}</h1>
                    <p className="text-gray-600">Customize behavior, permissions, and capabilities</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" onClick={handleTestAssistant}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Test Assistant
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </div>

              {/* Tab nav */}
              <div className="flex border-b border-gray-200 mb-6">
                {CONFIG_TABS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={cn(
                      'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
                      activeTab === key
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <Card className="bg-white border-gray-200/60">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Bot className="h-5 w-5 mr-2" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="name">Assistant Name</Label>
                          <Input
                            id="name"
                            value={config.name}
                            onChange={(e) => setConfig({...config, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="type">Type</Label>
                          <Input
                            id="type"
                            value={config.type}
                            onChange={(e) => setConfig({...config, type: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          value={config.description}
                          onChange={(e) => setConfig({...config, description: e.target.value})}
                          placeholder="Describe what this assistant does..."
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="department">Department</Label>
                          <Input
                            id="department"
                            value={config.department}
                            onChange={(e) => setConfig({...config, department: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="workingHours">Working Hours</Label>
                          <Input
                            id="workingHours"
                            value={config.workingHours}
                            onChange={(e) => setConfig({...config, workingHours: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Active Status</Label>
                          <p className="text-sm text-gray-600">Enable or disable this assistant</p>
                        </div>
                        <Switch
                          checked={config.isActive}
                          onCheckedChange={(checked) => setConfig({...config, isActive: checked})}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'capabilities' && (
                <div className="space-y-6">
                  <Card className="bg-white border-gray-200/60">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Zap className="h-5 w-5 mr-2" />
                        Assistant Capabilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {config.capabilities.map((capability, index) => (
                          <div key={index} className="p-4 bg-blue-50 rounded-lg text-center">
                            <p className="font-medium text-blue-900">{capability}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 text-red-600 hover:text-red-700"
                              onClick={() => {
                                const newCapabilities = config.capabilities.filter((_, i) => i !== index);
                                setConfig({...config, capabilities: newCapabilities});
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                          <Button variant="ghost" className="text-gray-600">
                            + Add Capability
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'autonomy' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="bg-white border-gray-200/60">
                      <CardHeader>
                        <CardTitle className="flex items-center text-green-700">
                          <Shield className="h-5 w-5 mr-2" />
                          Autonomous Decisions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {config.canMakeDecisions.map((decision, index) => (
                          <div key={index} className="p-3 bg-green-50 rounded-lg flex justify-between items-center">
                            <p className="text-green-800 font-medium">{decision}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newDecisions = config.canMakeDecisions.filter((_, i) => i !== index);
                                setConfig({...config, canMakeDecisions: newDecisions});
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </CardContent>
                    </Card>

                    <Card className="bg-white border-gray-200/60">
                      <CardHeader>
                        <CardTitle className="flex items-center text-orange-700">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          Requires Approval
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {config.approvalRequired.map((approval, index) => (
                          <div key={index} className="p-3 bg-orange-50 rounded-lg flex justify-between items-center">
                            <p className="text-orange-800 font-medium">{approval}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newApprovals = config.approvalRequired.filter((_, i) => i !== index);
                                setConfig({...config, approvalRequired: newApprovals});
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-white border-gray-200/60">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <DollarSign className="h-5 w-5 mr-2" />
                        Budget & Limits
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="budgetLimit">Maximum Budget Authority ($)</Label>
                        <Input
                          id="budgetLimit"
                          type="number"
                          value={config.maxBudgetLimit}
                          onChange={(e) => setConfig({...config, maxBudgetLimit: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Require Approval for Actions</Label>
                          <p className="text-sm text-gray-600">All actions need human approval</p>
                        </div>
                        <Switch
                          checked={config.requiresApproval}
                          onCheckedChange={(checked) => setConfig({...config, requiresApproval: checked})}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'integrations' && (
                <div className="space-y-6">
                  <Card className="bg-white border-gray-200/60">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Users className="h-5 w-5 mr-2" />
                        Connected Integrations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {config.integrations.map((integration, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg text-center hover:bg-gray-50 transition-colors">
                            <p className="font-medium">{integration}</p>
                            <Badge variant="default" className="mt-2">Connected</Badge>
                          </div>
                        ))}
                        <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                          <Button variant="ghost" className="text-gray-600">
                            + Add Integration
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="space-y-6">
                  <Card className="bg-white border-gray-200/60">
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Lock className="h-5 w-5 mr-2" />
                        Security Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="confidentiality">Confidentiality Level</Label>
                        <select
                          id="confidentiality"
                          className="w-full h-10 px-3 rounded-md border border-input bg-background mt-2"
                          value={config.confidentialityLevel}
                          onChange={(e) => setConfig({...config, confidentialityLevel: e.target.value})}
                        >
                          <option value="public">Public</option>
                          <option value="standard">Standard</option>
                          <option value="confidential">Confidential</option>
                          <option value="restricted">Restricted</option>
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="scope">Access Scope</Label>
                        <select
                          id="scope"
                          className="w-full h-10 px-3 rounded-md border border-input bg-background mt-2"
                          value={config.scope}
                          onChange={(e) => setConfig({...config, scope: e.target.value})}
                        >
                          <option value="personal">Personal</option>
                          <option value="team">Team</option>
                          <option value="department">Department</option>
                          <option value="organization">Organization</option>
                        </select>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AssistantConfiguration;
