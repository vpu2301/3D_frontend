
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { 
  Bot, MessageSquare, Shield, Plug, DollarSign, Brain, 
  ArrowRight, ArrowLeft, Check, Sparkles,
  Phone, Send, Lock, Globe, Smartphone
} from 'lucide-react';
import { toast } from 'sonner';

interface CreateAgentWizardProps {
  open: boolean;
  onClose: () => void;
  onComplete: (agent: AgentConfig) => void;
}

interface AgentConfig {
  name: string;
  description: string;
  channels: string[];
  permissions: string[];
  connections: string[];
  assignees: string[];
  integrations: string[];
  dailyBudget: number;
  autonomyLevel: string;
}

const STEPS = [
  { id: 'name', label: 'Agent Name', icon: Bot },
  { id: 'channels', label: 'Channels', icon: MessageSquare },
  { id: 'permissions', label: 'Permissions', icon: Shield },
  { id: 'integrations', label: 'Integrations', icon: Plug },
  { id: 'budget', label: 'Budget', icon: DollarSign },
  { id: 'autonomy', label: 'Autonomy', icon: Brain },
];

const CHANNELS = [
  { id: 'whatsapp', label: 'WhatsApp', icon: Phone, description: 'Business messaging via WhatsApp API' },
  { id: 'telegram', label: 'Telegram', icon: Send, description: 'Telegram Bot integration' },
  { id: 'signal', label: 'Signal', icon: Lock, description: 'Secure Signal messaging' },
  { id: 'web', label: 'Web Chat', icon: Globe, description: 'Embeddable website widget' },
  { id: 'app', label: 'Mobile App', icon: Smartphone, description: 'In-app push & chat' },
];

const PERMISSIONS = [
  { id: 'read_data', label: 'Read Data', description: 'Access and read organizational data' },
  { id: 'write_data', label: 'Write Data', description: 'Create and modify records' },
  { id: 'send_messages', label: 'Send Messages', description: 'Send messages on behalf of org' },
  { id: 'approve_tasks', label: 'Approve Tasks', description: 'Auto-approve tasks under threshold' },
  { id: 'manage_budget', label: 'Manage Budget', description: 'Allocate and spend within limits' },
  { id: 'access_external', label: 'External Access', description: 'Connect to external services' },
];

const EMPLOYEES = [
  { id: 'dept_sales', label: 'Sales Department', type: 'department' },
  { id: 'dept_support', label: 'Customer Support', type: 'department' },
  { id: 'dept_marketing', label: 'Marketing', type: 'department' },
  { id: 'emp_1', label: 'Sarah Chen', type: 'employee' },
  { id: 'emp_2', label: 'Marcus Johnson', type: 'employee' },
  { id: 'emp_3', label: 'Priya Patel', type: 'employee' },
];

const INTEGRATIONS = [
  { id: 'salesforce', label: 'Salesforce', category: 'CRM' },
  { id: 'hubspot', label: 'HubSpot', category: 'CRM' },
  { id: 'slack', label: 'Slack', category: 'Communication' },
  { id: 'jira', label: 'Jira', category: 'Project Management' },
  { id: 'zendesk', label: 'Zendesk', category: 'Support' },
  { id: 'stripe', label: 'Stripe', category: 'Payments' },
  { id: 'google_workspace', label: 'Google Workspace', category: 'Productivity' },
  { id: 'microsoft_365', label: 'Microsoft 365', category: 'Productivity' },
  { id: 'shopify', label: 'Shopify', category: 'E-Commerce' },
  { id: 'notion', label: 'Notion', category: 'Knowledge Base' },
  { id: 'intercom', label: 'Intercom', category: 'Support' },
  { id: 'zapier', label: 'Zapier', category: 'Automation' },
];

const CreateAgentWizard = ({ open, onClose, onComplete }: CreateAgentWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [config, setConfig] = useState<AgentConfig>({
    name: '',
    description: '',
    channels: [],
    permissions: [],
    connections: [],
    assignees: [],
    integrations: [],
    dailyBudget: 50,
    autonomyLevel: 'semi-supervised',
  });

  if (!open) return null;

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const toggleArrayItem = (field: keyof AgentConfig, item: string) => {
    const arr = config[field] as string[];
    setConfig({
      ...config,
      [field]: arr.includes(item) ? arr.filter(i => i !== item) : [...arr, item],
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return config.name.trim().length > 0;
      case 1: return config.channels.length > 0;
      case 2: return config.permissions.length > 0 || config.assignees.length > 0;
      case 3: return true;
      case 4: return config.dailyBudget > 0;
      case 5: return !!config.autonomyLevel;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(config);
      toast.success(`Agent "${config.name}" created successfully!`);
      onClose();
      setCurrentStep(0);
      setConfig({
        name: '', description: '', channels: [], permissions: [],
        connections: [], assignees: [], integrations: [],
        dailyBudget: 50, autonomyLevel: 'semi-supervised',
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto shadow-lg">
                <Bot className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Name your Agent</h2>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">Give your AI agent a name and describe what it will do</p>
            </div>
            <div className="max-w-md mx-auto space-y-4">
              <div>
                <Label htmlFor="agent-name" className="text-sm font-medium text-foreground">Agent Name</Label>
                <Input
                  id="agent-name"
                  value={config.name}
                  onChange={e => setConfig({ ...config, name: e.target.value })}
                  placeholder="e.g. Customer Support Bot"
                  className="mt-2 h-14 text-lg border-border"
                  autoFocus
                />
              </div>
              <div>
                <Label htmlFor="agent-desc" className="text-sm font-medium text-foreground">Description (optional)</Label>
                <Input
                  id="agent-desc"
                  value={config.description}
                  onChange={e => setConfig({ ...config, description: e.target.value })}
                  placeholder="Handles tier-1 support tickets and FAQs"
                  className="mt-2 h-14 text-lg border-border"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto shadow-lg">
                <MessageSquare className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Communication Channels</h2>
              <p className="text-muted-foreground text-lg">Where should your agent be available?</p>
            </div>
            <div className="max-w-lg mx-auto grid grid-cols-1 gap-3">
              {CHANNELS.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => toggleArrayItem('channels', ch.id)}
                  className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left ${
                    config.channels.includes(ch.id)
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'border-border hover:border-muted-foreground/30 hover:bg-muted/50'
                  }`}
                >
                  <div className={`p-3 rounded-lg ${config.channels.includes(ch.id) ? 'bg-primary/10' : 'bg-muted'}`}>
                    <ch.icon className={`h-5 w-5 ${config.channels.includes(ch.id) ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{ch.label}</p>
                    <p className="text-sm text-muted-foreground">{ch.description}</p>
                  </div>
                  {config.channels.includes(ch.id) && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </button>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mx-auto shadow-lg">
                <Shield className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Scope & Assignments</h2>
              <p className="text-muted-foreground text-lg">Set permissions and assign to people or teams</p>
            </div>
            <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Permissions</h3>
                {PERMISSIONS.map(p => (
                  <label
                    key={p.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      config.permissions.includes(p.id) ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <Checkbox
                      checked={config.permissions.includes(p.id)}
                      onCheckedChange={() => toggleArrayItem('permissions', p.id)}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="font-medium text-foreground text-sm">{p.label}</p>
                      <p className="text-xs text-muted-foreground">{p.description}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Assign To</h3>
                {EMPLOYEES.map(e => (
                  <button
                    key={e.id}
                    onClick={() => toggleArrayItem('assignees', e.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${
                      config.assignees.includes(e.id) ? 'border-primary bg-primary/5' : 'border-border hover:bg-muted/50'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      e.type === 'department' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                    }`}>
                      {e.type === 'department' ? 'D' : e.label.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{e.label}</p>
                      <p className="text-xs text-muted-foreground capitalize">{e.type}</p>
                    </div>
                    {config.assignees.includes(e.id) && <Check className="h-4 w-4 text-primary" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center mx-auto shadow-lg">
                <Plug className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Integrations</h2>
              <p className="text-muted-foreground text-lg">Connect your agent to external tools and services</p>
            </div>
            <div className="max-w-2xl mx-auto">
              {['CRM', 'Communication', 'Project Management', 'Support', 'Payments', 'Productivity', 'E-Commerce', 'Knowledge Base', 'Automation'].map(cat => {
                const items = INTEGRATIONS.filter(i => i.category === cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat} className="mb-4">
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {items.map(int => (
                        <button
                          key={int.id}
                          onClick={() => toggleArrayItem('integrations', int.id)}
                          className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                            config.integrations.includes(int.id)
                              ? 'border-primary bg-primary/5 text-primary'
                              : 'border-border text-foreground hover:border-muted-foreground/30 hover:bg-muted/50'
                          }`}
                        >
                          {int.label}
                          {config.integrations.includes(int.id) && <Check className="inline h-4 w-4 ml-1" />}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mx-auto shadow-lg">
                <DollarSign className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Daily Budget</h2>
              <p className="text-muted-foreground text-lg">Set a spending limit for your agent's daily operations</p>
            </div>
            <div className="max-w-md mx-auto space-y-8">
              <div className="text-center">
                <span className="text-6xl font-bold text-foreground">${config.dailyBudget}</span>
                <p className="text-muted-foreground mt-2">per day</p>
              </div>
              <Slider
                value={[config.dailyBudget]}
                onValueChange={([v]) => setConfig({ ...config, dailyBudget: v })}
                min={5}
                max={500}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>$5/day</span>
                <span>$500/day</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[25, 100, 250].map(v => (
                  <button
                    key={v}
                    onClick={() => setConfig({ ...config, dailyBudget: v })}
                    className={`p-3 rounded-lg border-2 font-semibold transition-all ${
                      config.dailyBudget === v
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-border text-foreground hover:bg-muted/50'
                    }`}
                  >
                    ${v}/day
                  </button>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground">
                Estimated monthly: <span className="font-semibold text-foreground">${config.dailyBudget * 30}</span>
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center mx-auto shadow-lg">
                <Brain className="h-10 w-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-foreground">Level of Autonomy</h2>
              <p className="text-muted-foreground text-lg">How much independence should this agent have?</p>
            </div>
            <div className="max-w-lg mx-auto">
              <RadioGroup
                value={config.autonomyLevel}
                onValueChange={v => setConfig({ ...config, autonomyLevel: v })}
                className="space-y-4"
              >
                {[
                  {
                    value: 'fully-supervised',
                    label: 'Fully Supervised',
                    desc: 'Every action requires human approval before execution. Maximum control.',
                    color: 'from-green-500 to-emerald-500',
                  },
                  {
                    value: 'semi-supervised',
                    label: 'Semi-Supervised',
                    desc: 'Routine tasks auto-executed; high-impact decisions need approval.',
                    color: 'from-amber-500 to-orange-500',
                  },
                  {
                    value: 'unsupervised',
                    label: 'Unsupervised',
                    desc: 'Full autonomy within defined scope. Agent acts independently.',
                    color: 'from-red-500 to-rose-500',
                  },
                ].map(opt => (
                  <label
                    key={opt.value}
                    className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                      config.autonomyLevel === opt.value
                        ? 'border-primary bg-primary/5 shadow-md'
                        : 'border-border hover:border-muted-foreground/30 hover:bg-muted/50'
                    }`}
                  >
                    <RadioGroupItem value={opt.value} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground text-lg">{opt.label}</p>
                        <div className={`h-2 w-2 rounded-full bg-gradient-to-r ${opt.color}`} />
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{opt.desc}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex flex-col">
      {/* Progress bar */}
      <div className="w-full h-1 bg-muted">
        <div
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Sparkles className="h-5 w-5 text-primary" />
          <span className="font-semibold text-foreground">Create Agent</span>
          <span className="text-sm text-muted-foreground">Step {currentStep + 1} of {STEPS.length}</span>
        </div>
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < currentStep
                  ? 'bg-primary text-primary-foreground'
                  : i === currentStep
                  ? 'bg-primary/20 text-primary border-2 border-primary'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
            </div>
          ))}
        </div>
        <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground">
          Cancel
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto py-12 px-6">
        {renderStep()}
      </div>

      {/* Bottom nav */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-background">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="gap-2 bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 text-white px-8"
        >
          {currentStep === STEPS.length - 1 ? (
            <>
              Create Agent
              <Sparkles className="h-4 w-4" />
            </>
          ) : (
            <>
              Continue
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default CreateAgentWizard;
