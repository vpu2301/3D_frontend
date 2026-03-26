
import {
  useState, useEffect, useCallback, useRef,
  createContext, useContext,
} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ReactFlow, MiniMap, Controls, Background, BackgroundVariant, Panel,
  useNodesState, useEdgesState, addEdge,
  Handle, Position, useReactFlow, ReactFlowProvider,
  type Node, type Edge, type Connection, type NodeTypes, type NodeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft, Play, Bot, Users, GitBranch, Bell, Clock, Zap,
  MousePointer, Globe, Save, Rocket, X, Search, ChevronDown,
  ChevronRight, Code2, RefreshCw, GitMerge, Filter, Layers,
  Mail, MessageSquare, FileText, Tag, Database, AlertCircle,
  CheckCircle2, Loader2, Undo2, Redo2, Copy, Trash2, ArrowUpDown,
  Link2, Github, Network, Braces, Table, Webhook, StickyNote,
  TerminalSquare, ListFilter, Hash, Columns3, Sparkles,
  Maximize2, Download, Upload, Map, LayoutGrid,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────

interface NodeData extends Record<string, unknown> {
  nodeType: string;
  label: string;
  description?: string;
  assignee?: string;
  duration?: string;
  message?: string;
  method?: string;
  url?: string;
  expression?: string;
  language?: string;
  cronExpression?: string;
  field?: string;
  channel?: string;
  model?: string;
  prompt?: string;
}

type ExecStatus = 'idle' | 'pending' | 'running' | 'done' | 'error';

interface NodeCfg {
  label: string;
  category: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  miniColor: string;
  desc: string;
  multi?: boolean; // multiple source handles (condition/switch)
}

// ── Node config (30+ types, 6 categories) ────────────────────────────────────

const NODE_CONFIG: Record<string, NodeCfg> = {
  // ── Triggers ──────────────────────────────────────
  trigger_manual:   { label: 'Manual Trigger',  category: 'triggers', icon: MousePointer, color: '#f59e0b', bg: 'bg-amber-500',  miniColor: '#f59e0b', desc: 'Start workflow manually' },
  trigger_schedule: { label: 'Schedule',         category: 'triggers', icon: Clock,        color: '#f59e0b', bg: 'bg-amber-500',  miniColor: '#f59e0b', desc: 'Run on a cron schedule' },
  trigger_webhook:  { label: 'Webhook',          category: 'triggers', icon: Globe,        color: '#f59e0b', bg: 'bg-amber-500',  miniColor: '#f59e0b', desc: 'Triggered by HTTP request' },
  trigger_event:    { label: 'On Event',         category: 'triggers', icon: Zap,          color: '#f59e0b', bg: 'bg-amber-500',  miniColor: '#f59e0b', desc: 'Listen for platform events' },
  trigger_email:    { label: 'Email Trigger',    category: 'triggers', icon: Mail,         color: '#f59e0b', bg: 'bg-amber-500',  miniColor: '#f59e0b', desc: 'Triggered by incoming email' },
  trigger_app:      { label: 'App Trigger',      category: 'triggers', icon: Link2,        color: '#f59e0b', bg: 'bg-amber-500',  miniColor: '#f59e0b', desc: 'Triggered by app action' },

  // ── Flow ──────────────────────────────────────────
  condition:        { label: 'If',               category: 'flow',    icon: GitBranch,    color: '#6366f1', bg: 'bg-indigo-500', miniColor: '#6366f1', desc: 'Branch with true / false', multi: true },
  switch_node:      { label: 'Switch',           category: 'flow',    icon: Columns3,     color: '#6366f1', bg: 'bg-indigo-500', miniColor: '#6366f1', desc: 'Route to multiple branches', multi: true },
  loop:             { label: 'Loop Over Items',  category: 'flow',    icon: RefreshCw,    color: '#6366f1', bg: 'bg-indigo-500', miniColor: '#6366f1', desc: 'Iterate over a list' },
  merge:            { label: 'Merge',            category: 'flow',    icon: GitMerge,     color: '#6366f1', bg: 'bg-indigo-500', miniColor: '#6366f1', desc: 'Combine multiple branches' },
  wait:             { label: 'Wait',             category: 'flow',    icon: Clock,        color: '#6366f1', bg: 'bg-indigo-500', miniColor: '#6366f1', desc: 'Pause until condition' },
  stop_error:       { label: 'Stop & Error',     category: 'flow',    icon: AlertCircle,  color: '#6366f1', bg: 'bg-indigo-500', miniColor: '#6366f1', desc: 'Stop and throw an error' },

  // ── Core ──────────────────────────────────────────
  http_request:     { label: 'HTTP Request',     category: 'core',    icon: Network,      color: '#3b82f6', bg: 'bg-blue-500',   miniColor: '#3b82f6', desc: 'Make HTTP / REST API calls' },
  set_data:         { label: 'Set',              category: 'core',    icon: Database,     color: '#3b82f6', bg: 'bg-blue-500',   miniColor: '#3b82f6', desc: 'Set or transform data fields' },
  code:             { label: 'Code',             category: 'core',    icon: Code2,        color: '#3b82f6', bg: 'bg-blue-500',   miniColor: '#3b82f6', desc: 'Run custom JS / Python code' },
  filter:           { label: 'Filter',           category: 'core',    icon: Filter,       color: '#3b82f6', bg: 'bg-blue-500',   miniColor: '#3b82f6', desc: 'Filter items by condition' },
  aggregate:        { label: 'Aggregate',        category: 'core',    icon: Layers,       color: '#3b82f6', bg: 'bg-blue-500',   miniColor: '#3b82f6', desc: 'Aggregate / group items' },
  sort:             { label: 'Sort',             category: 'core',    icon: ArrowUpDown,  color: '#3b82f6', bg: 'bg-blue-500',   miniColor: '#3b82f6', desc: 'Sort items by field' },

  // ── AI ────────────────────────────────────────────
  ai_agent:         { label: 'AI Agent',         category: 'ai',      icon: Bot,          color: '#8b5cf6', bg: 'bg-violet-500', miniColor: '#8b5cf6', desc: 'Delegate task to AI agent' },
  llm_chain:        { label: 'LLM Chain',        category: 'ai',      icon: Sparkles,     color: '#8b5cf6', bg: 'bg-violet-500', miniColor: '#8b5cf6', desc: 'Chain LLM prompts' },
  ai_summarize:     { label: 'Summarize',        category: 'ai',      icon: FileText,     color: '#8b5cf6', bg: 'bg-violet-500', miniColor: '#8b5cf6', desc: 'Summarize text content' },
  ai_classify:      { label: 'Classify',         category: 'ai',      icon: Tag,          color: '#8b5cf6', bg: 'bg-violet-500', miniColor: '#8b5cf6', desc: 'Classify text or data' },
  ai_extract:       { label: 'Extract Data',     category: 'ai',      icon: ListFilter,   color: '#8b5cf6', bg: 'bg-violet-500', miniColor: '#8b5cf6', desc: 'Extract structured data' },

  // ── Actions ───────────────────────────────────────
  action:           { label: 'Action',           category: 'actions', icon: Play,         color: '#22c55e', bg: 'bg-green-500',  miniColor: '#22c55e', desc: 'Perform a platform action' },
  notification:     { label: 'Notification',     category: 'actions', icon: Bell,         color: '#22c55e', bg: 'bg-green-500',  miniColor: '#22c55e', desc: 'Send a notification' },
  human_approval:   { label: 'Human Approval',   category: 'actions', icon: Users,        color: '#22c55e', bg: 'bg-green-500',  miniColor: '#22c55e', desc: 'Wait for human approval' },
  send_email:       { label: 'Send Email',        category: 'actions', icon: Mail,         color: '#22c55e', bg: 'bg-green-500',  miniColor: '#22c55e', desc: 'Send an outbound email' },
  delay:            { label: 'Delay',            category: 'actions', icon: Clock,        color: '#22c55e', bg: 'bg-green-500',  miniColor: '#22c55e', desc: 'Wait for a set duration' },

  // ── Integrations ──────────────────────────────────
  slack:            { label: 'Slack',            category: 'integrations', icon: MessageSquare, color: '#0d9488', bg: 'bg-teal-600', miniColor: '#0d9488', desc: 'Send a Slack message' },
  google_sheets:    { label: 'Google Sheets',    category: 'integrations', icon: Table,         color: '#0d9488', bg: 'bg-teal-600', miniColor: '#0d9488', desc: 'Read / write spreadsheet' },
  notion:           { label: 'Notion',           category: 'integrations', icon: FileText,      color: '#0d9488', bg: 'bg-teal-600', miniColor: '#0d9488', desc: 'Read / write Notion pages' },
  github:           { label: 'GitHub',           category: 'integrations', icon: Github,        color: '#0d9488', bg: 'bg-teal-600', miniColor: '#0d9488', desc: 'GitHub operations' },
  jira:             { label: 'Jira',             category: 'integrations', icon: Hash,          color: '#0d9488', bg: 'bg-teal-600', miniColor: '#0d9488', desc: 'Create / update Jira issues' },
  airtable:         { label: 'Airtable',         category: 'integrations', icon: Database,      color: '#0d9488', bg: 'bg-teal-600', miniColor: '#0d9488', desc: 'Airtable read / write' },

  // ── Notes ─────────────────────────────────────────
  sticky_note:      { label: 'Sticky Note',      category: 'core',        icon: StickyNote,    color: '#eab308', bg: 'bg-yellow-400', miniColor: '#eab308', desc: 'Add a note to the canvas' },
};

const CATEGORIES: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  triggers:     { label: 'Triggers',      icon: Zap,          color: 'text-amber-500' },
  flow:         { label: 'Flow',          icon: GitBranch,    color: 'text-indigo-500' },
  core:         { label: 'Core',          icon: Code2,        color: 'text-blue-500' },
  ai:           { label: 'AI & Data',     icon: Sparkles,     color: 'text-violet-500' },
  actions:      { label: 'Actions',       icon: Play,         color: 'text-green-500' },
  integrations: { label: 'Integrations', icon: Link2,        color: 'text-teal-500' },
};

const AI_AGENTS = ['Emma (Sales)', 'Aria (HR)', 'Felix (Finance)', 'Maya (Marketing)', 'Atlas (Support)', 'Sage (Research)'];

// ── Execution context ─────────────────────────────────────────────────────────

const ExecCtx = createContext<Record<string, ExecStatus>>({});

// ── Workflow node (n8n-style) ─────────────────────────────────────────────────

function WorkflowNode({ id, data, selected }: NodeProps) {
  const execStatus = useContext(ExecCtx);
  const nodeData = data as NodeData;
  const cfg = NODE_CONFIG[nodeData.nodeType] ?? NODE_CONFIG.action;
  const Icon = cfg.icon;
  const isTrigger = cfg.category === 'triggers';
  const status = execStatus[id] ?? 'idle';

  const statusIcon = {
    running: <Loader2 className="h-3 w-3 animate-spin text-amber-500" />,
    done:    <CheckCircle2 className="h-3 w-3 text-green-500" />,
    error:   <AlertCircle className="h-3 w-3 text-red-500" />,
    pending: <div className="h-2 w-2 rounded-full bg-gray-300" />,
    idle:    null,
  }[status];

  return (
    <div
      className={[
        'relative bg-white rounded-xl w-48 transition-all duration-150 group',
        selected
          ? 'ring-2 ring-blue-500 ring-offset-1 shadow-[0_4px_16px_rgba(59,130,246,0.18)]'
          : 'shadow-[0_1px_4px_rgba(0,0,0,0.07),0_0_0_1px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.10),0_0_0_1px_rgba(0,0,0,0.08)]',
      ].join(' ')}
    >
      {/* Top handle */}
      {!isTrigger && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !bg-white !border-2 !border-gray-300 !-top-1.5 hover:!border-blue-500 !transition-colors"
        />
      )}

      {/* Content */}
      <div className="p-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
          {statusIcon && <div className="mt-0.5">{statusIcon}</div>}
        </div>
        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wide leading-none mb-1">
          {cfg.label}
        </p>
        <p className="text-sm font-semibold text-gray-800 truncate leading-tight">
          {nodeData.label || cfg.label}
        </p>
        {nodeData.description && (
          <p className="text-[11px] text-gray-400 mt-0.5 truncate">{nodeData.description}</p>
        )}
      </div>

      {/* Bottom source handle */}
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !bg-white !border-2 !border-gray-300 !-bottom-1.5 hover:!border-blue-500 !transition-colors"
      />

      {/* Condition / Switch false branch */}
      {cfg.multi && (
        <Handle
          id="false"
          type="source"
          position={Position.Right}
          className="!w-3 !h-3 !bg-white !border-2 !border-red-300 hover:!border-red-500 !transition-colors"
        />
      )}
    </div>
  );
}

// ── Sticky note node ──────────────────────────────────────────────────────────

function StickyNoteNode({ id, data, selected }: NodeProps) {
  const nodeData = data as NodeData;
  return (
    <div
      className={[
        'relative w-44 min-h-[80px] rounded-lg p-3 flex flex-col gap-1',
        'bg-yellow-100 border border-yellow-300',
        selected ? 'ring-2 ring-yellow-400 ring-offset-1' : 'shadow-sm',
      ].join(' ')}
    >
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-yellow-400 !border-yellow-500 !-top-1" />
      <div className="flex items-center gap-1 mb-0.5">
        <StickyNote className="h-3 w-3 text-yellow-600 flex-shrink-0" />
        <span className="text-[10px] font-semibold text-yellow-700 uppercase tracking-wide">Note</span>
      </div>
      <p className="text-[11px] text-yellow-900 leading-relaxed whitespace-pre-wrap break-words flex-1">
        {nodeData.description || 'Double-click to edit in properties panel'}
      </p>
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-yellow-400 !border-yellow-500 !-bottom-1" />
    </div>
  );
}

const nodeTypes: NodeTypes = { workflowNode: WorkflowNode, stickyNote: StickyNoteNode };

// ── Palette item ──────────────────────────────────────────────────────────────

function PaletteItem({ nodeType }: { nodeType: string }) {
  const cfg = NODE_CONFIG[nodeType];
  if (!cfg) return null;
  const Icon = cfg.icon;

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/reactflow', nodeType);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-100 cursor-grab active:cursor-grabbing transition-colors select-none group"
    >
      <div className={`w-7 h-7 rounded-md ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
        <Icon className="h-3.5 w-3.5 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-700 truncate leading-tight">{cfg.label}</p>
        <p className="text-[10px] text-gray-400 truncate">{cfg.desc}</p>
      </div>
    </div>
  );
}

// ── Category section (collapsible) ────────────────────────────────────────────

function CategorySection({
  catKey, types, defaultOpen = true,
}: { catKey: string; types: string[]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const cat = CATEGORIES[catKey];
  if (!types.length) return null;
  const CatIcon = cat.icon;

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 hover:text-gray-600 transition-colors"
      >
        <CatIcon className={`h-3 w-3 ${cat.color}`} />
        <span className="flex-1 text-left">{cat.label}</span>
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
      </button>
      {open && (
        <div className="mb-1">
          {types.map(t => <PaletteItem key={t} nodeType={t} />)}
        </div>
      )}
    </div>
  );
}

// ── Properties panel ──────────────────────────────────────────────────────────

function PropertiesPanel({
  node, onChange, onClose, onDelete, onDuplicate,
}: {
  node: Node;
  onChange: (id: string, patch: Partial<NodeData>) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}) {
  const data = node.data as NodeData;
  const cfg = NODE_CONFIG[data.nodeType] ?? NODE_CONFIG.action;
  const Icon = cfg.icon;
  const isTrigger = cfg.category === 'triggers';

  return (
    <div className="w-64 border-l border-gray-100 bg-white flex flex-col flex-shrink-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-gray-100">
        <div className={`w-7 h-7 rounded-md ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className="h-3.5 w-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold text-gray-800 flex-1 truncate">{cfg.label}</span>
        <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0" onClick={onClose}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Fields */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Label */}
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Label</Label>
          <Input
            className="h-8 text-xs"
            placeholder={cfg.label}
            value={data.label}
            onChange={e => onChange(node.id, { label: e.target.value })}
          />
        </div>

        {/* Description */}
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Description</Label>
          <Textarea
            className="text-xs resize-none"
            rows={2}
            placeholder="Add a note…"
            value={data.description ?? ''}
            onChange={e => onChange(node.id, { description: e.target.value })}
          />
        </div>

        {/* Trigger-specific */}
        {data.nodeType === 'trigger_schedule' && (
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Cron Expression</Label>
            <Input className="h-8 text-xs font-mono" placeholder="0 9 * * 1-5" value={data.cronExpression ?? ''} onChange={e => onChange(node.id, { cronExpression: e.target.value })} />
            <p className="text-[10px] text-gray-400 mt-1">e.g. <span className="font-mono">0 9 * * 1-5</span> = weekdays at 9am</p>
          </div>
        )}
        {data.nodeType === 'trigger_webhook' && (
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Webhook URL</Label>
            <Input className="h-8 text-xs font-mono" placeholder="/webhook/my-flow" value={data.url ?? ''} onChange={e => onChange(node.id, { url: e.target.value })} />
          </div>
        )}

        {/* HTTP Request */}
        {data.nodeType === 'http_request' && (
          <>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Method</Label>
              <Select value={data.method ?? 'GET'} onValueChange={v => onChange(node.id, { method: v })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['GET','POST','PUT','PATCH','DELETE'].map(m => <SelectItem key={m} value={m} className="text-xs">{m}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">URL</Label>
              <Input className="h-8 text-xs font-mono" placeholder="https://api.example.com/data" value={data.url ?? ''} onChange={e => onChange(node.id, { url: e.target.value })} />
            </div>
          </>
        )}

        {/* Code */}
        {data.nodeType === 'code' && (
          <>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Language</Label>
              <Select value={data.language ?? 'javascript'} onValueChange={v => onChange(node.id, { language: v })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="javascript" className="text-xs">JavaScript</SelectItem>
                  <SelectItem value="python" className="text-xs">Python</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Code</Label>
              <Textarea className="text-xs font-mono resize-none" rows={5} placeholder="// return { data: items };" value={data.expression ?? ''} onChange={e => onChange(node.id, { expression: e.target.value })} />
            </div>
          </>
        )}

        {/* Set data */}
        {data.nodeType === 'set_data' && (
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Expression</Label>
            <Textarea className="text-xs font-mono resize-none" rows={4} placeholder='{{ $json.field }}' value={data.expression ?? ''} onChange={e => onChange(node.id, { expression: e.target.value })} />
          </div>
        )}

        {/* AI Agent */}
        {(data.nodeType === 'ai_agent' || data.nodeType === 'llm_chain') && (
          <>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">AI Agent</Label>
              <Select value={data.assignee ?? ''} onValueChange={v => onChange(node.id, { assignee: v })}>
                <SelectTrigger className="h-8 text-xs"><SelectValue placeholder="Select agent" /></SelectTrigger>
                <SelectContent>
                  {AI_AGENTS.map(a => <SelectItem key={a} value={a} className="text-xs">{a}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Prompt / Instructions</Label>
              <Textarea className="text-xs resize-none" rows={4} placeholder="Describe what the agent should do…" value={data.prompt ?? ''} onChange={e => onChange(node.id, { prompt: e.target.value })} />
            </div>
          </>
        )}

        {/* AI Summarize / Classify / Extract */}
        {(data.nodeType === 'ai_summarize' || data.nodeType === 'ai_classify' || data.nodeType === 'ai_extract') && (
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Input Field</Label>
            <Input className="h-8 text-xs font-mono" placeholder="{{ $json.text }}" value={data.field ?? ''} onChange={e => onChange(node.id, { field: e.target.value })} />
          </div>
        )}

        {/* Delay / Wait */}
        {(data.nodeType === 'delay' || data.nodeType === 'wait') && (
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Duration</Label>
            <Input className="h-8 text-xs" placeholder="e.g. 1 hour, 2 days" value={data.duration ?? ''} onChange={e => onChange(node.id, { duration: e.target.value })} />
          </div>
        )}

        {/* Notification / Send Email */}
        {(data.nodeType === 'notification' || data.nodeType === 'send_email') && (
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Message</Label>
            <Textarea className="text-xs resize-none" rows={3} placeholder="Message content…" value={data.message ?? ''} onChange={e => onChange(node.id, { message: e.target.value })} />
          </div>
        )}

        {/* Slack */}
        {data.nodeType === 'slack' && (
          <>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Channel</Label>
              <Input className="h-8 text-xs" placeholder="#general" value={data.channel ?? ''} onChange={e => onChange(node.id, { channel: e.target.value })} />
            </div>
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Message</Label>
              <Textarea className="text-xs resize-none" rows={3} placeholder="Message text…" value={data.message ?? ''} onChange={e => onChange(node.id, { message: e.target.value })} />
            </div>
          </>
        )}

        {/* Condition hint */}
        {(data.nodeType === 'condition' || data.nodeType === 'switch_node') && (
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Condition</Label>
            <Input className="h-8 text-xs font-mono" placeholder="{{ $json.status === 'active' }}" value={data.expression ?? ''} onChange={e => onChange(node.id, { expression: e.target.value })} />
            <div className="mt-2 rounded-lg bg-indigo-50 border border-indigo-100 p-2.5 text-[10px] text-indigo-600 space-y-0.5">
              <p><span className="font-semibold">Bottom</span> → True branch</p>
              <p><span className="font-semibold">Right</span> → False branch</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer actions */}
      <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 h-7 text-xs text-gray-500 hover:text-gray-700 gap-1"
          onClick={() => onDuplicate(node.id)}
        >
          <Copy className="h-3 w-3" /> Duplicate
        </Button>
        {!isTrigger && (
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-7 text-xs text-red-500 hover:text-red-700 hover:bg-red-50 gap-1"
            onClick={() => onDelete(node.id)}
          >
            <Trash2 className="h-3 w-3" /> Remove
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Execution log ─────────────────────────────────────────────────────────────

function ExecutionLog({
  log, onClear,
}: { log: string[]; onClear: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => { ref.current?.scrollTo(0, ref.current.scrollHeight); }, [log]);

  return (
    <div className="border-t border-gray-100 bg-gray-950 flex flex-col" style={{ height: 160 }}>
      <div className="flex items-center justify-between px-4 py-1.5 border-b border-gray-800">
        <span className="text-[11px] font-medium text-gray-400">Execution Output</span>
        <Button variant="ghost" size="sm" className="h-5 text-[10px] text-gray-500 hover:text-gray-300 px-2" onClick={onClear}>Clear</Button>
      </div>
      <div ref={ref} className="flex-1 overflow-y-auto px-4 py-2 space-y-0.5 font-mono text-[11px]">
        {log.length === 0
          ? <span className="text-gray-600">Run the workflow to see output here.</span>
          : log.map((line, i) => (
            <div key={i} className={[
              line.startsWith('[ERROR]') ? 'text-red-400' :
              line.startsWith('[DONE]')  ? 'text-green-400' :
              line.startsWith('[RUN]')   ? 'text-amber-400' :
              'text-gray-400',
            ].join('')}>
              {line}
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ── History (undo / redo) ─────────────────────────────────────────────────────

function useHistory(nodes: Node[], edges: Edge[], setNodes: (n: Node[]) => void, setEdges: (e: Edge[]) => void) {
  const stack = useRef<{ nodes: Node[]; edges: Edge[] }[]>([{ nodes, edges }]);
  const idx   = useRef(0);
  const skip  = useRef(false);

  const push = useCallback((n: Node[], e: Edge[]) => {
    if (skip.current) return;
    stack.current = stack.current.slice(0, idx.current + 1);
    stack.current.push({ nodes: n.map(x => ({ ...x })), edges: e.map(x => ({ ...x })) });
    idx.current = stack.current.length - 1;
  }, []);

  const undo = useCallback(() => {
    if (idx.current <= 0) return;
    idx.current--;
    skip.current = true;
    const s = stack.current[idx.current];
    setNodes(s.nodes);
    setEdges(s.edges);
    setTimeout(() => { skip.current = false; }, 0);
  }, [setNodes, setEdges]);

  const redo = useCallback(() => {
    if (idx.current >= stack.current.length - 1) return;
    idx.current++;
    skip.current = true;
    const s = stack.current[idx.current];
    setNodes(s.nodes);
    setEdges(s.edges);
    setTimeout(() => { skip.current = false; }, 0);
  }, [setNodes, setEdges]);

  const canUndo = idx.current > 0;
  const canRedo = idx.current < stack.current.length - 1;

  return { push, undo, redo, canUndo, canRedo };
}

// ── Initial state ─────────────────────────────────────────────────────────────

let nodeCounter = 1;

const initialNodes: Node[] = [
  {
    id: 'trigger-1',
    type: 'workflowNode',
    position: { x: 260, y: 60 },
    data: { nodeType: 'trigger_manual', label: 'Start' } as NodeData,
  },
];
const initialEdges: Edge[] = [];

// ── Workflow templates ─────────────────────────────────────────────────────────

const mkEdge = (id: string, source: string, target: string): Edge => ({
  id, source, target, animated: true, style: { stroke: '#cbd5e1', strokeWidth: 1.5 },
});

const mkNode = (id: string, x: number, y: number, nodeType: string, label: string): Node => ({
  id, type: 'workflowNode', position: { x, y }, data: { nodeType, label } as NodeData,
});

export const WORKFLOW_TEMPLATES: Record<string, { name: string; nodes: Node[]; edges: Edge[] }> = {
  'customer-onboarding': {
    name: 'Customer Onboarding',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_webhook', 'New Customer Signup'),
      mkNode('n2', 260, 180, 'ai_classify',     'Classify Customer Tier'),
      mkNode('n3', 260, 300, 'send_email',       'Send Welcome Email'),
      mkNode('n4', 260, 420, 'human_approval',   'Account Setup Approval'),
      mkNode('n5', 260, 540, 'action',           'Activate Account'),
      mkNode('n6', 260, 660, 'notification',     'Notify Sales Team'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'),
    ],
  },
  'invoice-processing': {
    name: 'Invoice Processing',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_email',  'Incoming Invoice Email'),
      mkNode('n2', 260, 180, 'ai_extract',     'Extract Invoice Data'),
      mkNode('n3', 260, 300, 'condition',      'Amount > $1,000?'),
      mkNode('n4', 100, 420, 'human_approval', 'Manual Review'),
      mkNode('n5', 420, 420, 'google_sheets',  'Log to Spreadsheet'),
      mkNode('n6', 260, 540, 'send_email',     'Confirm Payment'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n3', 'n5'),
      mkEdge('e5', 'n4', 'n6'), mkEdge('e6', 'n5', 'n6'),
    ],
  },
  'lead-qualification': {
    name: 'Lead Qualification',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_webhook', 'New Lead Submitted'),
      mkNode('n2', 260, 180, 'ai_agent',        'Score & Qualify Lead'),
      mkNode('n3', 260, 300, 'condition',       'Score ≥ 70?'),
      mkNode('n4', 100, 420, 'send_email',      'Send to Sales Rep'),
      mkNode('n5', 420, 420, 'action',          'Add to Nurture List'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n3', 'n5'),
    ],
  },
  'content-approval': {
    name: 'Content Approval',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual',  'Submit Content for Review'),
      mkNode('n2', 260, 180, 'ai_summarize',    'AI Summarize & Check'),
      mkNode('n3', 260, 300, 'human_approval',  'Editor Approval'),
      mkNode('n4', 260, 420, 'condition',       'Approved?'),
      mkNode('n5', 100, 540, 'action',          'Publish Content'),
      mkNode('n6', 420, 540, 'notification',    'Notify Author (Rejected)'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n4', 'n6'),
    ],
  },
  'employee-offboarding': {
    name: 'Employee Offboarding',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_event',  'Employee Exit Event'),
      mkNode('n2', 260, 180, 'action',         'Revoke System Access'),
      mkNode('n3', 260, 300, 'notification',   'Notify IT Department'),
      mkNode('n4', 260, 420, 'send_email',     'Send Farewell & Offboarding Guide'),
      mkNode('n5', 260, 540, 'action',         'Archive Employee Records'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
    ],
  },
  'support-ticket-routing': {
    name: 'Support Ticket Routing',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_email',  'Incoming Support Email'),
      mkNode('n2', 260, 180, 'ai_classify',    'Classify Priority & Category'),
      mkNode('n3', 260, 300, 'switch_node',    'Route by Priority'),
      mkNode('n4', 60,  420, 'slack',          'Alert: P1 Critical'),
      mkNode('n5', 260, 420, 'jira',           'Create Jira Ticket'),
      mkNode('n6', 460, 420, 'send_email',     'Auto-Reply to Customer'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n3', 'n5'),
      mkEdge('e5', 'n3', 'n6'),
    ],
  },
  'weekly-report': {
    name: 'Weekly Report Generation',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_schedule', 'Every Monday 8 AM'),
      mkNode('n2', 260, 180, 'google_sheets',    'Fetch Weekly Data'),
      mkNode('n3', 260, 300, 'ai_summarize',     'Generate AI Summary'),
      mkNode('n4', 260, 420, 'send_email',       'Email Report to Team'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'),
    ],
  },
  'bug-triage': {
    name: 'Bug Triage',
    nodes: [
      mkNode('n1', 260, 60,  'github',       'New GitHub Issue'),
      mkNode('n2', 260, 180, 'ai_classify',  'Classify Severity & Type'),
      mkNode('n3', 260, 300, 'condition',    'Severity = Critical?'),
      mkNode('n4', 100, 420, 'jira',         'Create Jira Bug Ticket'),
      mkNode('n5', 420, 420, 'slack',        'Alert Engineering Channel'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n3', 'n5'),
    ],
  },
  'expense-approval': {
    name: 'Expense Approval',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_email',  'Expense Submission Email'),
      mkNode('n2', 260, 180, 'ai_extract',     'Extract Amount & Category'),
      mkNode('n3', 260, 300, 'condition',      'Amount > $500?'),
      mkNode('n4', 100, 420, 'human_approval', 'Manager Approval Required'),
      mkNode('n5', 420, 420, 'action',         'Auto-Approve'),
      mkNode('n6', 260, 540, 'send_email',     'Confirm Reimbursement'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n3', 'n5'),
      mkEdge('e5', 'n4', 'n6'), mkEdge('e6', 'n5', 'n6'),
    ],
  },
  'sales-pipeline': {
    name: 'Sales Pipeline Update',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_event', 'Deal Stage Changed'),
      mkNode('n2', 260, 180, 'set_data',      'Enrich Deal Data'),
      mkNode('n3', 260, 300, 'condition',     'Stage = Closed Won?'),
      mkNode('n4', 100, 420, 'notification',  'Notify Account Exec'),
      mkNode('n5', 420, 420, 'action',        'Update CRM Record'),
      mkNode('n6', 260, 540, 'delay',         'Wait 2 Days'),
      mkNode('n7', 260, 660, 'send_email',    'Schedule Follow-up'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n3', 'n5'),
      mkEdge('e5', 'n5', 'n6'), mkEdge('e6', 'n6', 'n7'),
    ],
  },
  'contract-review': {
    name: 'Contract Review',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual',  'Upload Contract'),
      mkNode('n2', 260, 180, 'ai_extract',      'Extract Key Clauses'),
      mkNode('n3', 260, 300, 'human_approval',  'Legal Team Review'),
      mkNode('n4', 260, 420, 'condition',       'Approved?'),
      mkNode('n5', 100, 540, 'notion',          'Save to Notion'),
      mkNode('n6', 420, 540, 'send_email',      'Request Revisions'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n4', 'n6'),
    ],
  },
  'social-media-alert': {
    name: 'Social Media Monitoring',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_schedule', 'Every Hour'),
      mkNode('n2', 260, 180, 'http_request',     'Fetch Brand Mentions'),
      mkNode('n3', 260, 300, 'ai_classify',      'Classify Sentiment'),
      mkNode('n4', 260, 420, 'condition',        'Negative Sentiment?'),
      mkNode('n5', 100, 540, 'slack',            'Alert Social Media Team'),
      mkNode('n6', 420, 540, 'action',           'Log to Dashboard'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n4', 'n6'),
    ],
  },
};

// ── Builder ───────────────────────────────────────────────────────────────────

function Builder({ templateNodes, templateEdges }: { templateNodes?: Node[]; templateEdges?: Edge[] }) {
  const { screenToFlowPosition, fitView } = useReactFlow();
  const [nodes, setNodes, onNodesChange] = useNodesState(templateNodes ?? initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(templateEdges ?? initialEdges);
  const [selectedId, setSelectedId]       = useState<string | null>(null);
  const [search, setSearch]               = useState('');
  const [execStatus, setExecStatus]       = useState<Record<string, ExecStatus>>({});
  const [running, setRunning]             = useState(false);
  const [log, setLog]                     = useState<string[]>([]);
  const [showLog, setShowLog]             = useState(false);

  const { push, undo, redo, canUndo, canRedo } = useHistory(nodes, edges, setNodes as any, setEdges as any);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const importRef = useRef<HTMLInputElement>(null);

  const selectedNode = nodes.find(n => n.id === selectedId) ?? null;

  // ── Filtered categories for palette ──
  const filteredByCategory = Object.entries(CATEGORIES).reduce<Record<string, string[]>>((acc, [catKey]) => {
    const types = Object.entries(NODE_CONFIG)
      .filter(([k, v]) => v.category === catKey)
      .filter(([k, v]) => !search || v.label.toLowerCase().includes(search.toLowerCase()) || v.desc.toLowerCase().includes(search.toLowerCase()))
      .map(([k]) => k);
    acc[catKey] = types;
    return acc;
  }, {});

  // ── Connections ──
  const onConnect = useCallback(
    (params: Connection) => {
      const edge = { ...params, animated: true, style: { stroke: '#cbd5e1', strokeWidth: 1.5 } };
      setEdges(prev => {
        const next = addEdge(edge, prev);
        push(nodes, next);
        return next;
      });
    },
    [setEdges, nodes, push],
  );

  // ── Drag & drop ──
  const onDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; }, []);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const nodeType = e.dataTransfer.getData('application/reactflow');
      if (!nodeType) return;
      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const cfg = NODE_CONFIG[nodeType];
      const newNode: Node = {
        id: `node-${++nodeCounter}`,
        type: nodeType === 'sticky_note' ? 'stickyNote' : 'workflowNode',
        position,
        data: { nodeType, label: cfg.label } as NodeData,
      };
      setNodes(prev => {
        const next = [...prev, newNode];
        push(next, edges);
        return next;
      });
    },
    [screenToFlowPosition, setNodes, edges, push],
  );

  // ── Update / delete / duplicate ──
  const updateNode = useCallback(
    (id: string, patch: Partial<NodeData>) =>
      setNodes(prev => prev.map(n => n.id === id ? { ...n, data: { ...n.data, ...patch } } : n)),
    [setNodes],
  );

  const deleteNode = useCallback(
    (id: string) => {
      setNodes(prev => { const next = prev.filter(n => n.id !== id); push(next, edges); return next; });
      setEdges(prev => prev.filter(e => e.source !== id && e.target !== id));
      setSelectedId(null);
    },
    [setNodes, setEdges, edges, push],
  );

  const duplicateNode = useCallback(
    (id: string) => {
      const orig = nodes.find(n => n.id === id);
      if (!orig) return;
      const copy: Node = {
        ...orig,
        id: `node-${++nodeCounter}`,
        position: { x: orig.position.x + 24, y: orig.position.y + 24 },
        data: { ...orig.data },
      };
      setNodes(prev => { const next = [...prev, copy]; push(next, edges); return next; });
    },
    [nodes, setNodes, edges, push],
  );

  // ── Execution simulation ──
  const runWorkflow = useCallback(async () => {
    if (running) return;
    setRunning(true);
    setShowLog(true);
    setLog([]);
    const ts = () => new Date().toLocaleTimeString();
    const addLog = (line: string) => setLog(prev => [...prev, line]);

    addLog(`[${ts()}] Workflow execution started`);

    const ordered = [...nodes].sort((a, b) => a.position.y - b.position.y);

    for (const node of ordered) {
      const cfg = NODE_CONFIG[(node.data as NodeData).nodeType] ?? NODE_CONFIG.action;
      const label = (node.data as NodeData).label || cfg.label;

      setExecStatus(prev => ({ ...prev, [node.id]: 'running' }));
      addLog(`[RUN]  Executing "${label}"…`);
      await new Promise(r => setTimeout(r, 500 + Math.random() * 400));

      const success = Math.random() > 0.08;
      setExecStatus(prev => ({ ...prev, [node.id]: success ? 'done' : 'error' }));

      if (success) {
        addLog(`[DONE] "${label}" completed successfully`);
      } else {
        addLog(`[ERROR] "${label}" failed — retrying…`);
        await new Promise(r => setTimeout(r, 300));
        setExecStatus(prev => ({ ...prev, [node.id]: 'done' }));
        addLog(`[DONE] "${label}" recovered on retry`);
      }
    }

    addLog(`[${ts()}] Execution finished — ${ordered.length} node(s) processed`);
    setRunning(false);

    setTimeout(() => setExecStatus({}), 3000);
  }, [nodes, running]);

  // ── Fit view ──
  const handleFitView = useCallback(() => {
    fitView({ duration: 300, padding: 0.15 });
  }, [fitView]);

  // ── Auto layout (topological BFS) ──
  const handleAutoLayout = useCallback(() => {
    const childrenMap = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    nodes.forEach(n => { childrenMap.set(n.id, []); inDegree.set(n.id, 0); });
    edges.forEach(e => {
      childrenMap.get(e.source)?.push(e.target);
      inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
    });

    const levels = new Map<string, number>();
    const queue: string[] = [];
    nodes.forEach(n => {
      if ((inDegree.get(n.id) ?? 0) === 0) { levels.set(n.id, 0); queue.push(n.id); }
    });
    while (queue.length > 0) {
      const id = queue.shift()!;
      const lvl = levels.get(id) ?? 0;
      childrenMap.get(id)?.forEach(child => {
        if (!levels.has(child)) { levels.set(child, lvl + 1); queue.push(child); }
      });
    }
    // Assign disconnected nodes a bottom row
    nodes.forEach((n, i) => { if (!levels.has(n.id)) levels.set(n.id, 999 + i); });

    const byLevel = new Map<number, string[]>();
    levels.forEach((lvl, id) => { byLevel.set(lvl, [...(byLevel.get(lvl) ?? []), id]); });

    const H_GAP = 220, V_GAP = 130;
    const posMap = new Map<string, { x: number; y: number }>();
    byLevel.forEach((ids, lvl) => {
      ids.forEach((id, i) => {
        const totalW = ids.length * H_GAP;
        posMap.set(id, { x: i * H_GAP - totalW / 2 + H_GAP / 2 + 260, y: lvl * V_GAP + 60 });
      });
    });

    setNodes(prev => prev.map(n => ({ ...n, position: posMap.get(n.id) ?? n.position })));
    setTimeout(() => fitView({ duration: 400, padding: 0.15 }), 60);
  }, [nodes, edges, setNodes, fitView]);

  // ── Export JSON ──
  const handleExportJSON = useCallback(() => {
    const payload = JSON.stringify({ nodes, edges }, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'workflow.json';
    a.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  // ── Import JSON ──
  const handleImportFile = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const { nodes: n, edges: ed } = JSON.parse(ev.target?.result as string);
        if (Array.isArray(n) && Array.isArray(ed)) {
          setNodes(n);
          setEdges(ed);
          push(n, ed);
          setTimeout(() => fitView({ duration: 300, padding: 0.15 }), 60);
        }
      } catch { /* ignore malformed JSON */ }
    };
    reader.readAsText(file);
    e.target.value = '';
  }, [setNodes, setEdges, push, fitView]);

  // ── Clear canvas ──
  const handleClearCanvas = useCallback(() => {
    if (!window.confirm('Clear all nodes and connections?')) return;
    const starter: Node[] = [{
      id: 'trigger-1',
      type: 'workflowNode',
      position: { x: 260, y: 60 },
      data: { nodeType: 'trigger_manual', label: 'Start' } as NodeData,
    }];
    setNodes(starter);
    setEdges([]);
    push(starter, []);
    setSelectedId(null);
  }, [setNodes, setEdges, push]);

  // ── Add sticky note ──
  const handleAddNote = useCallback(() => {
    const newNode: Node = {
      id: `node-${++nodeCounter}`,
      type: 'stickyNote',
      position: { x: 100 + Math.random() * 200, y: 100 + Math.random() * 200 },
      data: { nodeType: 'sticky_note', label: 'Note', description: 'Add your note here…' } as NodeData,
    };
    setNodes(prev => { const next = [...prev, newNode]; push(next, edges); return next; });
  }, [setNodes, edges, push]);

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((mod && e.key === 'y') || (mod && e.shiftKey && e.key === 'z')) { e.preventDefault(); redo(); }
      if (mod && e.key === 'd' && selectedId) { e.preventDefault(); duplicateNode(selectedId); }
      if (mod && e.key === 'f') { e.preventDefault(); fitView({ duration: 300, padding: 0.15 }); }
      if (mod && e.key === 'l') { e.preventDefault(); handleAutoLayout(); }
      if (mod && e.key === 'e') { e.preventDefault(); handleExportJSON(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [undo, redo, selectedId, duplicateNode, fitView, handleAutoLayout, handleExportJSON]);

  return (
    <ExecCtx.Provider value={execStatus}>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex flex-1 overflow-hidden">
          {/* ── Palette ── */}
          <div className="w-56 flex-shrink-0 border-r border-gray-100 bg-white flex flex-col overflow-hidden">
            <div className="px-3 pt-3 pb-2 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                <Input
                  className="h-8 pl-8 text-xs bg-gray-50 border-gray-100 focus-visible:ring-1"
                  placeholder="Search nodes…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto py-1">
              {Object.entries(CATEGORIES).map(([catKey]) => (
                <CategorySection
                  key={catKey}
                  catKey={catKey}
                  types={filteredByCategory[catKey] ?? []}
                  defaultOpen={catKey === 'triggers' || catKey === 'flow' || catKey === 'core'}
                />
              ))}
              {Object.values(filteredByCategory).every(a => a.length === 0) && (
                <p className="text-xs text-gray-400 text-center py-6">No nodes found</p>
              )}
            </div>

            <div className="px-3 py-3 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 leading-relaxed">
                Drag nodes onto the canvas. Pull handles to connect.
              </p>
            </div>
          </div>

          {/* ── Canvas ── */}
          <div className="flex-1 relative bg-white" onDrop={onDrop} onDragOver={onDragOver}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={(changes) => { onNodesChange(changes); }}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={(_, node) => setSelectedId(node.id)}
              onPaneClick={() => setSelectedId(null)}
              nodeTypes={nodeTypes}
              fitView
              defaultEdgeOptions={{ animated: true, style: { stroke: '#cbd5e1', strokeWidth: 1.5 } }}
              deleteKeyCode="Delete"
              proOptions={{ hideAttribution: true }}
            >
              <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} color="#d1d5db" />

              {/* Hidden import input */}
              <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />

              {/* Floating toolbar */}
              <Panel position="top-center">
                <div className="flex items-center gap-0.5 bg-white rounded-xl border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.08)] px-2 py-1.5">
                  {/* Edit group */}
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700" title="Undo (⌘Z)" onClick={undo} disabled={!canUndo}>
                    <Undo2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700" title="Redo (⌘Y)" onClick={redo} disabled={!canRedo}>
                    <Redo2 className="h-3.5 w-3.5" />
                  </Button>

                  <div className="w-px h-4 bg-gray-200 mx-1" />

                  {/* View group */}
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700" title="Fit view (⌘F)" onClick={handleFitView}>
                    <Maximize2 className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={`h-7 w-7 hover:text-gray-700 ${showMiniMap ? 'text-blue-500' : 'text-gray-400'}`}
                    title="Toggle minimap"
                    onClick={() => setShowMiniMap(v => !v)}
                  >
                    <Map className="h-3.5 w-3.5" />
                  </Button>

                  <div className="w-px h-4 bg-gray-200 mx-1" />

                  {/* Layout group */}
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700" title="Auto layout (⌘L)" onClick={handleAutoLayout}>
                    <LayoutGrid className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700" title="Add sticky note" onClick={handleAddNote}>
                    <StickyNote className="h-3.5 w-3.5" />
                  </Button>

                  <div className="w-px h-4 bg-gray-200 mx-1" />

                  {/* Data group */}
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700" title="Export JSON (⌘E)" onClick={handleExportJSON}>
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700" title="Import JSON" onClick={() => importRef.current?.click()}>
                    <Upload className="h-3.5 w-3.5" />
                  </Button>

                  <div className="w-px h-4 bg-gray-200 mx-1" />

                  {/* Danger group */}
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-red-500" title="Clear canvas" onClick={handleClearCanvas}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>

                  <div className="w-px h-4 bg-gray-200 mx-1" />

                  {/* Run group */}
                  <Button
                    size="sm"
                    className={`h-7 text-xs px-3 gap-1.5 ${running ? 'bg-amber-500 hover:bg-amber-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                    onClick={runWorkflow}
                    disabled={running}
                  >
                    {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                    {running ? 'Running…' : 'Test Run'}
                  </Button>
                  {showLog && (
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700" title="Hide output" onClick={() => setShowLog(false)}>
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              </Panel>

              <Controls
                className="!shadow-none !border !border-gray-200 !rounded-lg overflow-hidden"
                showInteractive={false}
              />
              {showMiniMap && (
                <MiniMap
                  nodeColor={n => NODE_CONFIG[(n.data as NodeData)?.nodeType]?.miniColor ?? '#94a3b8'}
                  className="!shadow-none !border !border-gray-200 !rounded-lg"
                  pannable
                  zoomable
                />
              )}
            </ReactFlow>
          </div>

          {/* ── Properties panel ── */}
          {selectedNode && (
            <PropertiesPanel
              node={selectedNode}
              onChange={updateNode}
              onClose={() => setSelectedId(null)}
              onDelete={deleteNode}
              onDuplicate={duplicateNode}
            />
          )}
        </div>

        {/* ── Execution log ── */}
        {showLog && (
          <ExecutionLog log={log} onClear={() => setLog([])} />
        )}
      </div>
    </ExecCtx.Provider>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const CreateWorkflow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const templateId = (location.state as { templateId?: string } | null)?.templateId;
  const tpl = templateId ? WORKFLOW_TEMPLATES[templateId] : undefined;

  const [userEmail, setUserEmail] = useState('');
  const [name, setName] = useState(tpl?.name ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');
    if (isAuthenticated !== 'true') { navigate('/login'); return; }
    if (email) setUserEmail(email);
  }, [navigate]);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); navigate('/workflows'); }, 900);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SidebarProvider>
        <div className="flex w-full flex-1 overflow-hidden" style={{ height: '100vh' }}>
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col overflow-hidden">
            <LoggedInHeader userEmail={userEmail} />

            <main className="flex-1 flex flex-col overflow-hidden">
              {/* Top bar */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-white flex-shrink-0">
                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500" onClick={() => navigate('/workflows')}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                <div className="w-px h-4 bg-gray-200 mx-1" />

                <Input
                  placeholder="Untitled Workflow"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="max-w-[220px] text-sm font-medium border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-400 px-1 h-8"
                />

                <div className="flex items-center gap-1 ml-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 text-xs border-gray-200 text-gray-600"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                    Save Draft
                  </Button>

                  <Button
                    size="sm"
                    className="h-8 text-xs bg-green-500 hover:bg-green-600 text-white"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <Rocket className="h-3.5 w-3.5 mr-1.5" />
                    {saving ? 'Publishing…' : 'Publish'}
                  </Button>
                </div>
              </div>

              {/* Builder */}
              <ReactFlowProvider>
                <Builder templateNodes={tpl?.nodes} templateEdges={tpl?.edges} />
              </ReactFlowProvider>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default CreateWorkflow;
