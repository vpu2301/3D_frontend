
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
      <div className="plat min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[color:var(--ink)] mx-auto"></div>
          <p className="mt-2 text-sm text-[color:var(--text-3)]">Loading configuration...</p>
        </div>
      </div>
    );
  }

  if (!assistant) {
    return (
      <div className="plat min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Bot className="h-16 w-16 text-[color:var(--text-5)] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[color:var(--ink)] mb-2">Assistant not found</h3>
          <p className="text-[color:var(--text-3)] mb-4">The assistant with ID "{id}" could not be found.</p>
          <Button onClick={() => navigate('/ai-assistants')} className="plat-btn">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Assistants
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="plat min-h-screen flex flex-col">
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
                    className="plat-btn-ghost"
                    onClick={() => navigate(`/ai-assistants/${id}`)}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Profile
                  </Button>
                  <div className="p-3 rounded-[12px] flex items-center justify-center" style={{ background: 'var(--sand)' }}>
                    <Settings className="h-8 w-8" style={{ color: 'var(--ink)' }} />
                  </div>
                  <div>
                    <p className="plat-crumb">3days.assistant.config</p>
                    <h1 className="mt-1 text-3xl font-bold text-[color:var(--ink)]">Configure {assistant.name}</h1>
                    <p className="mt-1 text-sm" style={{ color: 'var(--text-4)' }}>Customize behavior, permissions, and capabilities</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" className="plat-btn-ghost !h-10" onClick={handleTestAssistant}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Test Assistant
                  </Button>
                  <Button onClick={handleSave} disabled={isLoading} className="plat-btn">
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
              <div className="flex border-b border-[color:var(--line-soft)] mb-6">
                {CONFIG_TABS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={cn(
                      'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap',
                      activeTab === key
                        ? 'border-[color:var(--ink)] text-[color:var(--ink)]'
                        : 'border-transparent text-[color:var(--text-4)] hover:text-[color:var(--ink)] hover:border-[color:var(--line)]'
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
                  <Card className="plat-panel !p-0 shadow-none">
                    <CardHeader>
                      <CardTitle className="flex items-center !text-lg">
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
                            className="rounded-[10px] border-[color:var(--line)] focus-visible:!ring-[rgba(20,22,26,0.08)] focus-visible:!border-[color:var(--ink)]"
                            value={config.name}
                            onChange={(e) => setConfig({...config, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="type">Type</Label>
                          <Input
                            id="type"
                            className="rounded-[10px] border-[color:var(--line)] focus-visible:!ring-[rgba(20,22,26,0.08)] focus-visible:!border-[color:var(--ink)]"
                            value={config.type}
                            onChange={(e) => setConfig({...config, type: e.target.value})}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          className="rounded-[10px] border-[color:var(--line)] focus-visible:!ring-[rgba(20,22,26,0.08)] focus-visible:!border-[color:var(--ink)]"
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
                            className="rounded-[10px] border-[color:var(--line)] focus-visible:!ring-[rgba(20,22,26,0.08)] focus-visible:!border-[color:var(--ink)]"
                            value={config.department}
                            onChange={(e) => setConfig({...config, department: e.target.value})}
                          />
                        </div>
                        <div>
                          <Label htmlFor="workingHours">Working Hours</Label>
                          <Input
                            id="workingHours"
                            className="rounded-[10px] border-[color:var(--line)] focus-visible:!ring-[rgba(20,22,26,0.08)] focus-visible:!border-[color:var(--ink)]"
                            value={config.workingHours}
                            onChange={(e) => setConfig({...config, workingHours: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Active Status</Label>
                          <p className="text-sm text-[color:var(--text-3)]">Enable or disable this assistant</p>
                        </div>
                        <Switch
                          className="data-[state=checked]:bg-[color:var(--ink)]"
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
                  <Card className="plat-panel !p-0 shadow-none">
                    <CardHeader>
                      <CardTitle className="flex items-center !text-lg">
                        <Zap className="h-5 w-5 mr-2" />
                        Assistant Capabilities
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {config.capabilities.map((capability, index) => (
                          <div key={index} className="p-4 rounded-[12px] text-center" style={{ background: 'var(--sand)', border: '1px solid var(--line-soft)' }}>
                            <p className="font-medium" style={{ color: 'var(--ink)' }}>{capability}</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-2 !text-[color:var(--bad-fg)] hover:opacity-70"
                              onClick={() => {
                                const newCapabilities = config.capabilities.filter((_, i) => i !== index);
                                setConfig({...config, capabilities: newCapabilities});
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ))}
                        <div className="p-4 border border-dashed border-[color:var(--line)] rounded-[12px] text-center">
                          <Button variant="ghost" className="!text-[color:var(--text-3)]">
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
                    <Card className="plat-panel !p-0 shadow-none">
                      <CardHeader>
                        <CardTitle className="flex items-center !text-lg" style={{ color: 'var(--ok-fg)' }}>
                          <Shield className="h-5 w-5 mr-2" />
                          Autonomous Decisions
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {config.canMakeDecisions.map((decision, index) => (
                          <div key={index} className="p-3 rounded-[12px] flex justify-between items-center" style={{ background: 'var(--ok-bg)' }}>
                            <p className="font-medium" style={{ color: 'var(--ok-fg)' }}>{decision}</p>
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

                    <Card className="plat-panel !p-0 shadow-none">
                      <CardHeader>
                        <CardTitle className="flex items-center !text-lg" style={{ color: 'var(--warn-fg)' }}>
                          <AlertCircle className="h-5 w-5 mr-2" />
                          Requires Approval
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {config.approvalRequired.map((approval, index) => (
                          <div key={index} className="p-3 rounded-[12px] flex justify-between items-center" style={{ background: 'var(--warn-bg)' }}>
                            <p className="font-medium" style={{ color: 'var(--warn-fg)' }}>{approval}</p>
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

                  <Card className="plat-panel !p-0 shadow-none">
                    <CardHeader>
                      <CardTitle className="flex items-center !text-lg">
                        <DollarSign className="h-5 w-5 mr-2" />
                        Budget & Limits
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="budgetLimit">Maximum Budget Authority ($)</Label>
                        <Input
                          id="budgetLimit"
                          className="rounded-[10px] border-[color:var(--line)] focus-visible:!ring-[rgba(20,22,26,0.08)] focus-visible:!border-[color:var(--ink)]"
                          type="number"
                          value={config.maxBudgetLimit}
                          onChange={(e) => setConfig({...config, maxBudgetLimit: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Require Approval for Actions</Label>
                          <p className="text-sm text-[color:var(--text-3)]">All actions need human approval</p>
                        </div>
                        <Switch
                          className="data-[state=checked]:bg-[color:var(--ink)]"
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
                  <Card className="plat-panel !p-0 shadow-none">
                    <CardHeader>
                      <CardTitle className="flex items-center !text-lg">
                        <Users className="h-5 w-5 mr-2" />
                        Connected Integrations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {config.integrations.map((integration, index) => (
                          <div key={index} className="p-4 border border-[color:var(--line-soft)] rounded-[12px] text-center hover:bg-[rgba(20,22,26,0.04)] transition-colors">
                            <p className="font-medium">{integration}</p>
                            <Badge variant="default" className="mt-2 bg-[color:var(--ok-bg)] text-[color:var(--ok-fg)] border-transparent hover:bg-[color:var(--ok-bg)]">Connected</Badge>
                          </div>
                        ))}
                        <div className="p-4 border border-dashed border-[color:var(--line)] rounded-[12px] text-center">
                          <Button variant="ghost" className="!text-[color:var(--text-3)]">
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
                  <Card className="plat-panel !p-0 shadow-none">
                    <CardHeader>
                      <CardTitle className="flex items-center !text-lg">
                        <Lock className="h-5 w-5 mr-2" />
                        Security Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="confidentiality">Confidentiality Level</Label>
                        <select
                          id="confidentiality"
                          className="w-full h-10 px-3 rounded-[10px] border border-[color:var(--line)] bg-white mt-2"
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
                          className="w-full h-10 px-3 rounded-[10px] border border-[color:var(--line)] bg-white mt-2"
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
