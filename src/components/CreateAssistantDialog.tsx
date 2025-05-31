import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Bot, ArrowRight, Check, Sparkles, Users, MessageCircle, Settings, Zap, Shield, UserCheck, Building, Puzzle, Workflow, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateAssistantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssistantCreated: (assistant: any) => void;
}

const CreateAssistantDialog = ({ open, onOpenChange, onAssistantCreated }: CreateAssistantDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [assistantData, setAssistantData] = useState({
    name: '',
    type: '',
    department: '',
    description: '',
    capabilities: [] as string[],
    personality: 'professional',
    // New fields
    scope: 'personal', // personal or team
    autonomyLevel: 'supervised', // supervised, semi-autonomous, autonomous
    approvalRequired: [] as string[],
    canMakeDecisions: [] as string[],
    integrations: [] as string[],
    workingHours: '24/7',
    escalationRules: '',
    maxBudgetLimit: 0,
    teamMembers: [] as string[]
  });
  const { toast } = useToast();

  const steps = [
    { number: 1, title: 'Basic Info', icon: Bot },
    { number: 2, title: 'Type & Scope', icon: Users },
    { number: 3, title: 'Capabilities', icon: Zap },
    { number: 4, title: 'Autonomy', icon: Shield },
    { number: 5, title: 'Integrations', icon: Puzzle },
    { number: 6, title: 'Approval Rules', icon: UserCheck },
    { number: 7, title: 'Review', icon: Check }
  ];

  // ... keep existing code (assistantTypes, departments, personalities, availableCapabilities)
  const assistantTypes = [
    { value: 'support', label: 'Customer Support', description: 'Handle customer inquiries and provide assistance' },
    { value: 'sales', label: 'Sales Assistant', description: 'Help with lead qualification and sales processes' },
    { value: 'technical', label: 'Technical Helper', description: 'Provide technical guidance and troubleshooting' },
    { value: 'hr', label: 'HR Assistant', description: 'Assist with HR processes and employee queries' },
    { value: 'finance', label: 'Finance Expert', description: 'Help with financial analysis and reporting' },
    { value: 'marketing', label: 'Marketing Pro', description: 'Support marketing campaigns and content creation' }
  ];

  const departments = ['Sales', 'Marketing', 'Operations', 'Finance', 'HR', 'IT', 'Customer Support'];

  const availableCapabilities = [
    'Document Processing', 'Data Analysis', 'Email Management', 'Report Generation',
    'Customer Service', 'Lead Qualification', 'Appointment Scheduling', 'Content Creation',
    'Social Media Management', 'Invoice Processing', 'Compliance Monitoring', 'Training & Onboarding'
  ];

  const personalities = [
    { value: 'professional', label: 'Professional', description: 'Formal and business-focused communication' },
    { value: 'friendly', label: 'Friendly', description: 'Warm and approachable interaction style' },
    { value: 'concise', label: 'Concise', description: 'Brief and to-the-point responses' },
    { value: 'detailed', label: 'Detailed', description: 'Comprehensive and thorough explanations' }
  ];

  const autonomyLevels = [
    { value: 'supervised', label: 'Supervised', description: 'Requires approval for all actions' },
    { value: 'semi-autonomous', label: 'Semi-Autonomous', description: 'Can make routine decisions independently' },
    { value: 'autonomous', label: 'Autonomous', description: 'Full decision-making authority within defined scope' }
  ];

  const availableIntegrations = [
    'Slack', 'Microsoft Teams', 'Salesforce', 'HubSpot', 'Google Workspace', 'Microsoft 365',
    'Zoom', 'Notion', 'Asana', 'Trello', 'Shopify', 'Stripe', 'Zapier', 'Gmail', 'Outlook'
  ];

  const decisionAreas = [
    'Customer Responses', 'Meeting Scheduling', 'Document Approvals', 'Budget Allocation',
    'Task Assignment', 'Data Updates', 'Report Generation', 'Email Responses'
  ];

  const approvalAreas = [
    'Financial Transactions', 'Contract Signing', 'Customer Refunds', 'Personnel Decisions',
    'Policy Changes', 'External Communications', 'Large Purchases', 'System Changes'
  ];

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCapabilityToggle = (capability: string) => {
    setAssistantData(prev => ({
      ...prev,
      capabilities: prev.capabilities.includes(capability)
        ? prev.capabilities.filter(c => c !== capability)
        : [...prev.capabilities, capability]
    }));
  };

  const handleIntegrationToggle = (integration: string) => {
    setAssistantData(prev => ({
      ...prev,
      integrations: prev.integrations.includes(integration)
        ? prev.integrations.filter(i => i !== integration)
        : [...prev.integrations, integration]
    }));
  };

  const handleDecisionToggle = (decision: string) => {
    setAssistantData(prev => ({
      ...prev,
      canMakeDecisions: prev.canMakeDecisions.includes(decision)
        ? prev.canMakeDecisions.filter(d => d !== decision)
        : [...prev.canMakeDecisions, decision]
    }));
  };

  const handleApprovalToggle = (approval: string) => {
    setAssistantData(prev => ({
      ...prev,
      approvalRequired: prev.approvalRequired.includes(approval)
        ? prev.approvalRequired.filter(a => a !== approval)
        : [...prev.approvalRequired, approval]
    }));
  };

  const handleCreate = () => {
    if (!assistantData.name || !assistantData.type || !assistantData.department) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newAssistant = {
      id: Date.now(),
      name: assistantData.name,
      type: assistantData.type,
      department: assistantData.department,
      status: 'Active',
      conversations: 0,
      description: assistantData.description,
      capabilities: assistantData.capabilities,
      personality: assistantData.personality,
      scope: assistantData.scope,
      autonomyLevel: assistantData.autonomyLevel,
      approvalRequired: assistantData.approvalRequired,
      canMakeDecisions: assistantData.canMakeDecisions,
      integrations: assistantData.integrations,
      workingHours: assistantData.workingHours,
      escalationRules: assistantData.escalationRules,
      maxBudgetLimit: assistantData.maxBudgetLimit,
      teamMembers: assistantData.teamMembers,
      createdAt: new Date(),
      iconColor: 'text-violet-600',
      bgColor: 'from-violet-100 to-purple-100'
    };

    onAssistantCreated(newAssistant);
    
    toast({
      title: "Assistant Created!",
      description: `${assistantData.name} has been successfully created and is now active.`,
    });

    // Reset form and close dialog
    setCurrentStep(1);
    setAssistantData({
      name: '',
      type: '',
      department: '',
      description: '',
      capabilities: [],
      personality: 'professional',
      scope: 'personal',
      autonomyLevel: 'supervised',
      approvalRequired: [],
      canMakeDecisions: [],
      integrations: [],
      workingHours: '24/7',
      escalationRules: '',
      maxBudgetLimit: 0,
      teamMembers: []
    });
    onOpenChange(false);
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return assistantData.name.trim() !== '';
      case 2:
        return assistantData.type !== '' && assistantData.department !== '';
      case 3:
        return assistantData.capabilities.length > 0;
      case 4:
        return assistantData.autonomyLevel !== '';
      case 5:
        return true; // Integrations are optional
      case 6:
        return true; // Approval rules are optional
      default:
        return true;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-blue-600" />
            <span>Create New AI Assistant</span>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-8 overflow-x-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center min-w-0">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                currentStep >= step.number 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {currentStep > step.number ? (
                  <Check className="h-5 w-5" />
                ) : (
                  <step.icon className="h-5 w-5" />
                )}
              </div>
              <div className="ml-3">
                <p className={`text-sm font-medium ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'}`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-gray-300 mx-4 flex-shrink-0" />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Basic Information</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Assistant Name *</Label>
                  <Input
                    id="name"
                    value={assistantData.name}
                    onChange={(e) => setAssistantData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g., Aria, Atlas, Maya..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    value={assistantData.description}
                    onChange={(e) => setAssistantData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of what this assistant will do..."
                    className="mt-1"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Type & Scope</h3>
              
              <div>
                <Label>Assistant Type *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                  {assistantTypes.map((type) => (
                    <Card 
                      key={type.value}
                      className={`cursor-pointer transition-all ${
                        assistantData.type === type.value 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => setAssistantData(prev => ({ ...prev, type: type.value }))}
                    >
                      <CardContent className="p-4">
                        <h4 className="font-medium">{type.label}</h4>
                        <p className="text-sm text-gray-600 mt-1">{type.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="department">Department *</Label>
                <Select value={assistantData.department} onValueChange={(value) => setAssistantData(prev => ({ ...prev, department: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Assistant Scope</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Card 
                    className={`cursor-pointer transition-all ${
                      assistantData.scope === 'personal' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setAssistantData(prev => ({ ...prev, scope: 'personal' }))}
                  >
                    <CardContent className="p-4 text-center">
                      <Users className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                      <h4 className="font-medium">Personal</h4>
                      <p className="text-sm text-gray-600">Only you can interact with this assistant</p>
                    </CardContent>
                  </Card>
                  <Card 
                    className={`cursor-pointer transition-all ${
                      assistantData.scope === 'team' 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setAssistantData(prev => ({ ...prev, scope: 'team' }))}
                  >
                    <CardContent className="p-4 text-center">
                      <Building className="h-6 w-6 mx-auto mb-2 text-green-600" />
                      <h4 className="font-medium">Team</h4>
                      <p className="text-sm text-gray-600">Shared across your team or department</p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div>
                <Label htmlFor="personality">Communication Style</Label>
                <Select value={assistantData.personality} onValueChange={(value) => setAssistantData(prev => ({ ...prev, personality: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select communication style" />
                  </SelectTrigger>
                  <SelectContent>
                    {personalities.map((personality) => (
                      <SelectItem key={personality.value} value={personality.value}>
                        {personality.label} - {personality.description}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Capabilities</h3>
              <p className="text-gray-600">Select the capabilities your assistant should have:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {availableCapabilities.map((capability) => (
                  <Card 
                    key={capability}
                    className={`cursor-pointer transition-all ${
                      assistantData.capabilities.includes(capability)
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => handleCapabilityToggle(capability)}
                  >
                    <CardContent className="p-3 text-center">
                      <p className="text-sm font-medium">{capability}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Autonomy & Decision Making</h3>
              
              <div>
                <Label>Autonomy Level</Label>
                <div className="grid grid-cols-1 gap-3 mt-2">
                  {autonomyLevels.map((level) => (
                    <Card 
                      key={level.value}
                      className={`cursor-pointer transition-all ${
                        assistantData.autonomyLevel === level.value
                          ? 'border-blue-500 bg-blue-50' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => setAssistantData(prev => ({ ...prev, autonomyLevel: level.value }))}
                    >
                      <CardContent className="p-4 flex items-center">
                        <Shield className="h-6 w-6 mr-3 text-blue-600" />
                        <div>
                          <h4 className="font-medium">{level.label}</h4>
                          <p className="text-sm text-gray-600">{level.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Label>Working Hours</Label>
                <Select value={assistantData.workingHours} onValueChange={(value) => setAssistantData(prev => ({ ...prev, workingHours: value }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select working hours" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24/7">24/7 - Always Available</SelectItem>
                    <SelectItem value="business">Business Hours (9 AM - 5 PM)</SelectItem>
                    <SelectItem value="extended">Extended Hours (7 AM - 9 PM)</SelectItem>
                    <SelectItem value="custom">Custom Schedule</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="budgetLimit">Maximum Budget Authority ($)</Label>
                <Input
                  id="budgetLimit"
                  type="number"
                  value={assistantData.maxBudgetLimit}
                  onChange={(e) => setAssistantData(prev => ({ ...prev, maxBudgetLimit: Number(e.target.value) }))}
                  placeholder="0"
                  className="mt-1"
                />
                <p className="text-sm text-gray-500 mt-1">Maximum amount the assistant can spend without approval</p>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Integrations</h3>
              <p className="text-gray-600">Connect your assistant to the tools your team uses:</p>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {availableIntegrations.map((integration) => (
                  <Card 
                    key={integration}
                    className={`cursor-pointer transition-all ${
                      assistantData.integrations.includes(integration)
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => handleIntegrationToggle(integration)}
                  >
                    <CardContent className="p-3 text-center">
                      <p className="text-sm font-medium">{integration}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Decision Making & Approval Rules</h3>
              
              <div>
                <Label>Assistant Can Make Decisions For:</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {decisionAreas.map((decision) => (
                    <Card 
                      key={decision}
                      className={`cursor-pointer transition-all ${
                        assistantData.canMakeDecisions.includes(decision)
                          ? 'border-green-500 bg-green-50' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => handleDecisionToggle(decision)}
                    >
                      <CardContent className="p-3">
                        <p className="text-sm font-medium">{decision}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Label>Requires Approval For:</Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  {approvalAreas.map((approval) => (
                    <Card 
                      key={approval}
                      className={`cursor-pointer transition-all ${
                        assistantData.approvalRequired.includes(approval)
                          ? 'border-orange-500 bg-orange-50' 
                          : 'hover:border-gray-300'
                      }`}
                      onClick={() => handleApprovalToggle(approval)}
                    >
                      <CardContent className="p-3">
                        <p className="text-sm font-medium">{approval}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="escalationRules">Escalation Rules</Label>
                <Textarea
                  id="escalationRules"
                  value={assistantData.escalationRules}
                  onChange={(e) => setAssistantData(prev => ({ ...prev, escalationRules: e.target.value }))}
                  placeholder="Define when and how the assistant should escalate issues to humans..."
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Review & Create</h3>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Basic Info</h4>
                        <div className="space-y-1 text-sm">
                          <div><span className="text-gray-600">Name:</span> <span className="ml-2 font-medium">{assistantData.name}</span></div>
                          <div><span className="text-gray-600">Type:</span> <span className="ml-2 font-medium">{assistantTypes.find(t => t.value === assistantData.type)?.label}</span></div>
                          <div><span className="text-gray-600">Department:</span> <span className="ml-2 font-medium">{assistantData.department}</span></div>
                          <div><span className="text-gray-600">Scope:</span> <Badge variant="outline" className="ml-2">{assistantData.scope}</Badge></div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Autonomy</h4>
                        <div className="space-y-1 text-sm">
                          <div><span className="text-gray-600">Level:</span> <span className="ml-2 font-medium">{autonomyLevels.find(l => l.value === assistantData.autonomyLevel)?.label}</span></div>
                          <div><span className="text-gray-600">Working Hours:</span> <span className="ml-2 font-medium">{assistantData.workingHours}</span></div>
                          <div><span className="text-gray-600">Budget Limit:</span> <span className="ml-2 font-medium">${assistantData.maxBudgetLimit}</span></div>
                        </div>
                      </div>
                    </div>

                    {assistantData.capabilities.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Capabilities ({assistantData.capabilities.length})</h5>
                        <div className="flex flex-wrap gap-2">
                          {assistantData.capabilities.map((capability) => (
                            <Badge key={capability} variant="secondary">{capability}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {assistantData.integrations.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Integrations ({assistantData.integrations.length})</h5>
                        <div className="flex flex-wrap gap-2">
                          {assistantData.integrations.map((integration) => (
                            <Badge key={integration} variant="outline">{integration}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {assistantData.canMakeDecisions.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Can Make Decisions For</h5>
                        <div className="flex flex-wrap gap-2">
                          {assistantData.canMakeDecisions.map((decision) => (
                            <Badge key={decision} className="bg-green-100 text-green-800">{decision}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {assistantData.approvalRequired.length > 0 && (
                      <div>
                        <h5 className="font-medium text-gray-900 mb-2">Requires Approval For</h5>
                        <div className="flex flex-wrap gap-2">
                          {assistantData.approvalRequired.map((approval) => (
                            <Badge key={approval} className="bg-orange-100 text-orange-800">{approval}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button 
            variant="outline" 
            onClick={handleBack}
            disabled={currentStep === 1}
          >
            Back
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            {currentStep < 7 ? (
              <Button 
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
              >
                Next
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleCreate}
                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Create Assistant
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAssistantDialog;
