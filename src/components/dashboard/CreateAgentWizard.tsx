/**
 * Deploy-agent wizard, styled with the platform design system (`.plat` in
 * src/styles/platform.css — the marketing tokens transposed for the app):
 * mono crumb + step counter, Sora step titles, squircle icon chips, white
 * rounded option cards with ink selection, ink pill navigation.
 *
 * The `.plat` scope sits on the wizard's own root, so it renders correctly
 * from every page that opens it, migrated or not.
 */
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import {
  Bot, MessageSquare, Shield, Plug, DollarSign, Brain,
  ArrowRight, ArrowLeft, Check, Users,
  Phone, Send, Lock, Globe, Smartphone
} from 'lucide-react';
import { toast } from 'sonner';
import '@/styles/platform.css';

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
  { id: 'permissions', label: 'Access', icon: Shield },
  { id: 'assignees', label: 'Assign', icon: Users },
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

/** Squircle icon + Sora title + quiet subtitle — every step opens the same way. */
function StepHeader({ icon: Icon, title, sub }: { icon: typeof Bot; title: string; sub: string }) {
  return (
    <div className="text-center space-y-4">
      <div className="plat-item-icon mx-auto !h-16 !w-16 !rounded-[14px]">
        <Icon className="h-7 w-7" strokeWidth={1.5} />
      </div>
      <h2 className="text-[1.9rem]">{title}</h2>
      <p className="mx-auto max-w-md text-base" style={{ color: 'var(--text-3)' }}>{sub}</p>
    </div>
  );
}

/** Mono "Select all" / "Clear all" toggle for a group of options. */
function SelectAllButton({ allOn, onToggle }: { allOn: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="font-mono text-[10px] font-medium uppercase tracking-[0.18em] transition-colors hover:!text-[#14161a]"
      style={{ color: 'var(--text-4)' }}
    >
      {allOn ? 'Clear all' : 'Select all'}
    </button>
  );
}

/** White rounded option card; selection is an ink border + check, nothing louder. */
const cardCls = (selected: boolean) =>
  `flex items-center gap-4 w-full rounded-[12px] border bg-white p-4 text-left transition-all ${
    selected ? 'border-[var(--ink)]' : 'border-[var(--line)] hover:border-[var(--line)]'
  }`;

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

  /** Set an array field to everything (select all) or nothing (clear). */
  const setAll = (field: keyof AgentConfig, ids: string[], on: boolean) => {
    const arr = config[field] as string[];
    const rest = arr.filter(i => !ids.includes(i));
    setConfig({ ...config, [field]: on ? [...rest, ...ids] : rest });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return config.name.trim().length > 0;
      case 1: return config.channels.length > 0;
      case 2: return config.permissions.length > 0;
      case 3: return true; // assigning people is optional
      case 4: return true;
      case 5: return config.dailyBudget > 0;
      case 6: return !!config.autonomyLevel;
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
          <div className="space-y-10 animate-fade-in">
            <StepHeader icon={Bot} title="Name your Agent" sub="Give your AI agent a name and describe what it will do" />
            <div className="mx-auto max-w-md space-y-5">
              <div>
                <Label htmlFor="agent-name" className="plat-eyebrow">Agent name</Label>
                <Input
                  id="agent-name"
                  value={config.name}
                  onChange={e => setConfig({ ...config, name: e.target.value })}
                  placeholder="e.g. Customer Support Bot"
                  className="mt-2 h-14 rounded-[10px] border-[var(--line)] bg-white text-lg focus-visible:ring-1 focus-visible:ring-[#14161a]"
                  autoFocus
                />
              </div>
              <div>
                <Label htmlFor="agent-desc" className="plat-eyebrow">Description (optional)</Label>
                <Input
                  id="agent-desc"
                  value={config.description}
                  onChange={e => setConfig({ ...config, description: e.target.value })}
                  placeholder="Handles tier-1 support tickets and FAQs"
                  className="mt-2 h-14 rounded-[10px] border-[var(--line)] bg-white text-lg focus-visible:ring-1 focus-visible:ring-[#14161a]"
                />
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-10 animate-fade-in">
            <StepHeader icon={MessageSquare} title="Communication Channels" sub="Where should your agent be available?" />
            <div className="mx-auto grid max-w-lg grid-cols-1 gap-3">
              {CHANNELS.map(ch => {
                const on = config.channels.includes(ch.id);
                return (
                  <button key={ch.id} onClick={() => toggleArrayItem('channels', ch.id)} className={cardCls(on)}>
                    <span className="plat-item-icon !h-12 !w-12 !rounded-[10px]">
                      <ch.icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="plat-item-title block">{ch.label}</span>
                      <span className="plat-item-sub block">{ch.description}</span>
                    </span>
                    {on && <Check className="h-5 w-5 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        );

      case 2: {
        const allPermIds = PERMISSIONS.map(p => p.id);
        const allPermsOn = allPermIds.every(id => config.permissions.includes(id));
        return (
          <div className="space-y-10 animate-fade-in">
            <StepHeader icon={Shield} title="Access & Permissions" sub="What is this agent allowed to do?" />
            <div className="mx-auto max-w-lg">
              <div className="mb-3 flex items-baseline justify-between">
                <h3 className="plat-eyebrow">Permissions</h3>
                <SelectAllButton
                  allOn={allPermsOn}
                  onToggle={() => setAll('permissions', allPermIds, !allPermsOn)}
                />
              </div>
              <div className="space-y-2.5">
                {PERMISSIONS.map(p => {
                  const on = config.permissions.includes(p.id);
                  return (
                    <label key={p.id} className={`${cardCls(on)} cursor-pointer !items-start !p-4`}>
                      <Checkbox
                        checked={on}
                        onCheckedChange={() => toggleArrayItem('permissions', p.id)}
                        className="mt-0.5 data-[state=checked]:border-[var(--ink)] data-[state=checked]:bg-[#14161a]"
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-bold" style={{ color: 'var(--ink)' }}>{p.label}</span>
                        <span className="block text-xs" style={{ color: 'var(--text-4)' }}>{p.description}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }

      case 3: {
        const departments = EMPLOYEES.filter(e => e.type === 'department');
        const people = EMPLOYEES.filter(e => e.type === 'employee');
        const renderGroup = (label: string, items: typeof EMPLOYEES) => {
          const ids = items.map(e => e.id);
          const allOn = ids.every(id => config.assignees.includes(id));
          return (
            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <h3 className="plat-eyebrow">{label}</h3>
                <SelectAllButton allOn={allOn} onToggle={() => setAll('assignees', ids, !allOn)} />
              </div>
              <div className="space-y-2.5">
                {items.map(e => {
                  const on = config.assignees.includes(e.id);
                  return (
                    <button key={e.id} onClick={() => toggleArrayItem('assignees', e.id)} className={`${cardCls(on)} !p-3.5`}>
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                        style={{ background: 'var(--sand-deep)', color: 'var(--ink)' }}
                      >
                        {e.type === 'department' ? 'D' : e.label.charAt(0)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-bold" style={{ color: 'var(--ink)' }}>{e.label}</span>
                        <span className="block text-xs capitalize" style={{ color: 'var(--text-4)' }}>{e.type}</span>
                      </span>
                      {on && <Check className="h-4 w-4 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        };
        return (
          <div className="space-y-10 animate-fade-in">
            <StepHeader icon={Users} title="Assign to People & Teams" sub="Who will this agent work with? Optional — you can assign later." />
            <div className="mx-auto grid max-w-2xl grid-cols-1 gap-10 md:grid-cols-2">
              {renderGroup('Departments', departments)}
              {renderGroup('Employees', people)}
            </div>
          </div>
        );
      }

      case 4:
        return (
          <div className="space-y-10 animate-fade-in">
            <StepHeader icon={Plug} title="Integrations" sub="Connect your agent to external tools and services" />
            <div className="mx-auto max-w-2xl">
              {['CRM', 'Communication', 'Project Management', 'Support', 'Payments', 'Productivity', 'E-Commerce', 'Knowledge Base', 'Automation'].map(cat => {
                const items = INTEGRATIONS.filter(i => i.category === cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat} className="mb-5">
                    <h3 className="plat-eyebrow mb-2.5">{cat}</h3>
                    <div className="flex flex-wrap gap-2">
                      {items.map(int => {
                        const on = config.integrations.includes(int.id);
                        return (
                          <button
                            key={int.id}
                            onClick={() => toggleArrayItem('integrations', int.id)}
                            className="rounded-full border px-4 py-2 text-sm font-semibold transition-all"
                            style={
                              on
                                ? { background: 'var(--ink)', borderColor: 'var(--ink)', color: '#fff' }
                                : { background: 'var(--paper)', borderColor: 'var(--line)', color: 'var(--text-2)' }
                            }
                          >
                            {int.label}
                            {on && <Check className="ml-1.5 inline h-3.5 w-3.5" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-10 animate-fade-in">
            <StepHeader icon={DollarSign} title="Daily Budget" sub="Set a spending limit for your agent's daily operations" />
            <div className="mx-auto max-w-md space-y-9">
              <div className="text-center">
                <span className="plat-display" style={{ fontSize: 64, lineHeight: 1, letterSpacing: '-0.04em' }}>
                  ${config.dailyBudget}
                </span>
                <p className="mt-2 text-sm" style={{ color: 'var(--text-4)' }}>per day</p>
              </div>
              <Slider
                value={[config.dailyBudget]}
                onValueChange={([v]) => setConfig({ ...config, dailyBudget: v })}
                min={5}
                max={500}
                step={5}
                className="w-full [&_[role=slider]]:border-[var(--ink)] [&_.bg-primary]:bg-[#14161a] [&_.bg-secondary]:bg-[#e9ebef]"
              />
              <div className="flex justify-between font-mono text-xs" style={{ color: 'var(--text-5)' }}>
                <span>$5/day</span>
                <span>$500/day</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[25, 100, 250].map(v => {
                  const on = config.dailyBudget === v;
                  return (
                    <button
                      key={v}
                      onClick={() => setConfig({ ...config, dailyBudget: v })}
                      className="rounded-full border py-2.5 text-sm font-semibold transition-all"
                      style={
                        on
                          ? { background: 'var(--ink)', borderColor: 'var(--ink)', color: '#fff' }
                          : { background: 'var(--paper)', borderColor: 'var(--line)', color: 'var(--text-2)' }
                      }
                    >
                      ${v}/day
                    </button>
                  );
                })}
              </div>
              <p className="text-center text-sm" style={{ color: 'var(--text-4)' }}>
                Estimated monthly: <span className="font-semibold" style={{ color: 'var(--ink)' }}>${config.dailyBudget * 30}</span>
              </p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-10 animate-fade-in">
            <StepHeader icon={Brain} title="Level of Autonomy" sub="How much independence should this agent have?" />
            <div className="mx-auto max-w-lg">
              <RadioGroup
                value={config.autonomyLevel}
                onValueChange={v => setConfig({ ...config, autonomyLevel: v })}
                className="space-y-3"
              >
                {[
                  {
                    value: 'fully-supervised',
                    label: 'Fully Supervised',
                    desc: 'Every action requires human approval before execution. Maximum control.',
                  },
                  {
                    value: 'semi-supervised',
                    label: 'Semi-Supervised',
                    desc: 'Routine tasks auto-executed; high-impact decisions need approval.',
                  },
                  {
                    value: 'unsupervised',
                    label: 'Unsupervised',
                    desc: 'Full autonomy within defined scope. Agent acts independently.',
                  },
                ].map(opt => {
                  const on = config.autonomyLevel === opt.value;
                  return (
                    <label key={opt.value} className={`${cardCls(on)} cursor-pointer !items-start !p-5`}>
                      <RadioGroupItem
                        value={opt.value}
                        className="mt-1 border-[var(--line)] text-[#14161a]"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="plat-item-title block text-base">{opt.label}</span>
                        <span className="mt-1 block text-sm" style={{ color: 'var(--text-4)' }}>{opt.desc}</span>
                      </span>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="plat fixed inset-0 z-50 flex flex-col">
      {/* Progress bar */}
      <div className="h-1 w-full" style={{ background: 'var(--sand-deep)' }}>
        <div
          className="h-full transition-all duration-500"
          style={{ width: `${progress}%`, background: 'var(--ink)' }}
        />
      </div>

      {/* Top bar */}
      <div
        className="flex items-center justify-between border-b px-6 py-4"
        style={{ borderColor: 'var(--line-soft)', background: 'var(--paper)' }}
      >
        <div className="flex items-baseline gap-3">
          <span className="plat-crumb">3days.deploy</span>
          <span className="font-mono text-[11px]" style={{ color: 'var(--text-5)' }}>
            step {currentStep + 1} / {STEPS.length} · {STEPS[currentStep].label.toLowerCase()}
          </span>
        </div>
        <div className="hidden items-center gap-1.5 sm:flex">
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              title={s.label}
              className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all"
              style={
                i < currentStep
                  ? { background: 'var(--ink)', color: '#fff' }
                  : i === currentStep
                    ? { background: 'var(--paper)', color: 'var(--ink)', boxShadow: 'inset 0 0 0 2px var(--ink)' }
                    : { background: 'var(--sand-deep)', color: 'var(--text-5)' }
              }
            >
              {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
            </div>
          ))}
        </div>
        <button type="button" onClick={onClose} className="plat-btn-ghost !h-8">
          Cancel
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-12">
        {renderStep()}
      </div>

      {/* Bottom nav */}
      <div
        className="flex items-center justify-between border-t px-6 py-4"
        style={{ borderColor: 'var(--line-soft)', background: 'var(--paper)' }}
      >
        <button
          type="button"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="plat-btn-ghost disabled:pointer-events-none disabled:opacity-35"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button type="button" onClick={handleNext} disabled={!canProceed()} className="plat-btn !px-7">
          {currentStep === STEPS.length - 1 ? 'Create Agent' : 'Continue'}
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CreateAgentWizard;
