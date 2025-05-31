
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Bot, ArrowRight, Check, Sparkles, Users, MessageCircle, Settings, Zap } from 'lucide-react';
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
    personality: 'professional'
  });
  const { toast } = useToast();

  const steps = [
    { number: 1, title: 'Basic Info', icon: Bot },
    { number: 2, title: 'Type & Role', icon: Users },
    { number: 3, title: 'Capabilities', icon: Zap },
    { number: 4, title: 'Personality', icon: MessageCircle },
    { number: 5, title: 'Review', icon: Check }
  ];

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

  const handleNext = () => {
    if (currentStep < 5) {
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
      createdAt: new Date()
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
      personality: 'professional'
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
        return assistantData.personality !== '';
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
        <div className="flex items-center justify-between mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
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
                <ArrowRight className="h-4 w-4 text-gray-300 mx-4" />
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
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Type & Department</h3>
              <div className="space-y-4">
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
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personality & Communication Style</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {personalities.map((personality) => (
                  <Card 
                    key={personality.value}
                    className={`cursor-pointer transition-all ${
                      assistantData.personality === personality.value
                        ? 'border-blue-500 bg-blue-50' 
                        : 'hover:border-gray-300'
                    }`}
                    onClick={() => setAssistantData(prev => ({ ...prev, personality: personality.value }))}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-medium">{personality.label}</h4>
                      <p className="text-sm text-gray-600 mt-1">{personality.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Review & Create</h3>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900">Assistant Details</h4>
                      <div className="mt-2 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Name:</span>
                          <span className="ml-2 font-medium">{assistantData.name}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Type:</span>
                          <span className="ml-2 font-medium">{assistantTypes.find(t => t.value === assistantData.type)?.label}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Department:</span>
                          <span className="ml-2 font-medium">{assistantData.department}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Personality:</span>
                          <span className="ml-2 font-medium">{personalities.find(p => p.value === assistantData.personality)?.label}</span>
                        </div>
                      </div>
                    </div>
                    {assistantData.description && (
                      <div>
                        <h5 className="font-medium text-gray-900">Description</h5>
                        <p className="text-sm text-gray-600 mt-1">{assistantData.description}</p>
                      </div>
                    )}
                    <div>
                      <h5 className="font-medium text-gray-900">Capabilities ({assistantData.capabilities.length})</h5>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {assistantData.capabilities.map((capability) => (
                          <span key={capability} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {capability}
                          </span>
                        ))}
                      </div>
                    </div>
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
            {currentStep < 5 ? (
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
