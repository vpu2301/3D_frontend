
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  ArrowLeft, Play, Bot, Users, GitBranch, Bell, Clock, Zap,
  MousePointer, Globe, Save, Rocket, X, Search, ChevronDown,
  ChevronRight, Code2, RefreshCw, GitMerge, Filter, Layers,
  Mail, MessageSquare, FileText, Tag, Database, AlertCircle,
  CheckCircle2, Loader2, Undo2, Redo2, Copy, Trash2, ArrowUpDown,
  Link2, Github, Network, Braces, Table, Webhook, StickyNote,
  TerminalSquare, ListFilter, Hash, Columns3, Sparkles,
  Maximize2, Download, Upload, Map, LayoutGrid,
  // New icons for integrations
  MoreVertical, Video, Phone, HardDrive, Monitor, Keyboard,
  MousePointer2, Clipboard, FolderOpen, Cpu, Building2, TrendingUp,
  UserPlus, Activity, Target, CheckSquare, BookOpen, Cloud, Mic,
  Terminal, Settings2, Calendar, ShieldCheck, Package, BarChart2,
  List, FileSpreadsheet, Presentation, BookMarked, Puzzle, Wrench,
  ChevronUp, ToggleLeft, ToggleRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { INTEGRATION_CATALOG, INTEGRATION_GROUPS } from '@/data/integrationCatalog';

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
  // Flow control
  branches?: string[];
  // Integration node fields
  integrationKey?: string;
  enabledTools?: string[];
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
  multi?: boolean;
}

// ── Node config (core/flow/trigger/ai/action types) ───────────────────────────

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

  // ── Legacy integrations (kept for template compatibility) ──
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

// ── Integration service icon + color map ──────────────────────────────────────

const INTEGRATION_STYLE: Record<string, { icon: React.ElementType; bg: string; color: string; miniColor: string }> = {
  // Google
  google_gmail:             { icon: Mail,          bg: 'bg-red-500',       color: '#ef4444', miniColor: '#ef4444' },
  google_calendar:          { icon: Calendar,      bg: 'bg-blue-500',      color: '#3b82f6', miniColor: '#3b82f6' },
  google_drive:             { icon: HardDrive,     bg: 'bg-amber-500',     color: '#f59e0b', miniColor: '#f59e0b' },
  google_docs:              { icon: FileText,      bg: 'bg-blue-600',      color: '#2563eb', miniColor: '#2563eb' },
  google_sheets:            { icon: FileSpreadsheet, bg: 'bg-green-600',   color: '#16a34a', miniColor: '#16a34a' },
  google_slides:            { icon: Presentation,  bg: 'bg-yellow-600',    color: '#ca8a04', miniColor: '#ca8a04' },
  google_tasks:             { icon: CheckSquare,   bg: 'bg-teal-600',      color: '#0d9488', miniColor: '#0d9488' },
  google_contacts:          { icon: Users,         bg: 'bg-indigo-500',    color: '#6366f1', miniColor: '#6366f1' },
  google_meet:              { icon: Video,         bg: 'bg-green-500',     color: '#22c55e', miniColor: '#22c55e' },
  // Microsoft 365
  ms365_outlook_email:      { icon: Mail,          bg: 'bg-blue-600',      color: '#2563eb', miniColor: '#2563eb' },
  ms365_outlook_calendar:   { icon: Calendar,      bg: 'bg-indigo-600',    color: '#4f46e5', miniColor: '#4f46e5' },
  ms365_onedrive:           { icon: Cloud,         bg: 'bg-sky-600',       color: '#0284c7', miniColor: '#0284c7' },
  ms365_to_do:              { icon: CheckSquare,   bg: 'bg-blue-500',      color: '#3b82f6', miniColor: '#3b82f6' },
  ms365_teams:              { icon: MessageSquare, bg: 'bg-violet-600',    color: '#7c3aed', miniColor: '#7c3aed' },
  ms365_contacts:           { icon: Users,         bg: 'bg-cyan-600',      color: '#0891b2', miniColor: '#0891b2' },
  ms365_onenote:            { icon: BookOpen,      bg: 'bg-purple-600',    color: '#9333ea', miniColor: '#9333ea' },
  // Slack
  slack_channels:           { icon: Hash,          bg: 'bg-violet-600',    color: '#7c3aed', miniColor: '#7c3aed' },
  slack_messages:           { icon: MessageSquare, bg: 'bg-violet-500',    color: '#8b5cf6', miniColor: '#8b5cf6' },
  slack_files:              { icon: FolderOpen,    bg: 'bg-purple-600',    color: '#9333ea', miniColor: '#9333ea' },
  slack_users:              { icon: Users,         bg: 'bg-fuchsia-600',   color: '#c026d3', miniColor: '#c026d3' },
  slack_reactions:          { icon: Activity,      bg: 'bg-pink-600',      color: '#db2777', miniColor: '#db2777' },
  slack_misc:               { icon: Settings2,     bg: 'bg-violet-700',    color: '#6d28d9', miniColor: '#6d28d9' },
  // HubSpot
  hubspot_contacts:         { icon: Users,         bg: 'bg-orange-500',    color: '#f97316', miniColor: '#f97316' },
  hubspot_companies:        { icon: Building2,     bg: 'bg-orange-600',    color: '#ea580c', miniColor: '#ea580c' },
  hubspot_deals:            { icon: TrendingUp,    bg: 'bg-amber-500',     color: '#f59e0b', miniColor: '#f59e0b' },
  hubspot_tickets:          { icon: Tag,           bg: 'bg-orange-400',    color: '#fb923c', miniColor: '#fb923c' },
  hubspot_engagements:      { icon: Activity,      bg: 'bg-red-500',       color: '#ef4444', miniColor: '#ef4444' },
  hubspot_associations:     { icon: Link2,         bg: 'bg-rose-500',      color: '#f43f5e', miniColor: '#f43f5e' },
  hubspot_properties:       { icon: Settings2,     bg: 'bg-orange-700',    color: '#c2410c', miniColor: '#c2410c' },
  hubspot_marketing:        { icon: Target,        bg: 'bg-red-600',       color: '#dc2626', miniColor: '#dc2626' },
  hubspot_search:           { icon: Search,        bg: 'bg-amber-600',     color: '#d97706', miniColor: '#d97706' },
  // Salesforce
  salesforce_leads:         { icon: UserPlus,      bg: 'bg-blue-500',      color: '#3b82f6', miniColor: '#3b82f6' },
  salesforce_accounts:      { icon: Building2,     bg: 'bg-blue-600',      color: '#2563eb', miniColor: '#2563eb' },
  salesforce_contacts:      { icon: Users,         bg: 'bg-sky-600',       color: '#0284c7', miniColor: '#0284c7' },
  salesforce_opportunities: { icon: TrendingUp,    bg: 'bg-teal-500',      color: '#14b8a6', miniColor: '#14b8a6' },
  salesforce_cases:         { icon: FileText,      bg: 'bg-indigo-500',    color: '#6366f1', miniColor: '#6366f1' },
  salesforce_tasks:         { icon: CheckSquare,   bg: 'bg-cyan-500',      color: '#06b6d4', miniColor: '#06b6d4' },
  salesforce_events:        { icon: Calendar,      bg: 'bg-blue-400',      color: '#60a5fa', miniColor: '#60a5fa' },
  salesforce_campaigns:     { icon: Target,        bg: 'bg-green-600',     color: '#16a34a', miniColor: '#16a34a' },
  salesforce_products:      { icon: Package,       bg: 'bg-amber-500',     color: '#f59e0b', miniColor: '#f59e0b' },
  salesforce_reports:       { icon: BarChart2,     bg: 'bg-violet-500',    color: '#8b5cf6', miniColor: '#8b5cf6' },
  salesforce_dashboards:    { icon: LayoutGrid,    bg: 'bg-purple-500',    color: '#a855f7', miniColor: '#a855f7' },
  salesforce_soql:          { icon: Database,      bg: 'bg-blue-700',      color: '#1d4ed8', miniColor: '#1d4ed8' },
  salesforce_custom:        { icon: Wrench,        bg: 'bg-gray-600',      color: '#4b5563', miniColor: '#4b5563' },
  salesforce_chatter:       { icon: MessageSquare, bg: 'bg-sky-500',       color: '#0ea5e9', miniColor: '#0ea5e9' },
  salesforce_files:         { icon: FolderOpen,    bg: 'bg-teal-600',      color: '#0d9488', miniColor: '#0d9488' },
  salesforce_bulk:          { icon: Layers,        bg: 'bg-blue-800',      color: '#1e40af', miniColor: '#1e40af' },
  salesforce_metadata:      { icon: Braces,        bg: 'bg-slate-600',     color: '#475569', miniColor: '#475569' },
  salesforce_approval:      { icon: ShieldCheck,   bg: 'bg-green-700',     color: '#15803d', miniColor: '#15803d' },
  // Zoom
  zoom_meetings:            { icon: Video,         bg: 'bg-blue-500',      color: '#3b82f6', miniColor: '#3b82f6' },
  zoom_recordings:          { icon: Activity,      bg: 'bg-red-500',       color: '#ef4444', miniColor: '#ef4444' },
  zoom_webinars:            { icon: Monitor,       bg: 'bg-indigo-500',    color: '#6366f1', miniColor: '#6366f1' },
  zoom_users:               { icon: Users,         bg: 'bg-sky-600',       color: '#0284c7', miniColor: '#0284c7' },
  zoom_chat:                { icon: MessageSquare, bg: 'bg-blue-400',      color: '#60a5fa', miniColor: '#60a5fa' },
  zoom_phone:               { icon: Phone,         bg: 'bg-green-500',     color: '#22c55e', miniColor: '#22c55e' },
  zoom_reports:             { icon: BarChart2,     bg: 'bg-teal-500',      color: '#14b8a6', miniColor: '#14b8a6' },
  zoom_rooms:               { icon: Monitor,       bg: 'bg-violet-500',    color: '#8b5cf6', miniColor: '#8b5cf6' },
  zoom_groups:              { icon: Users,         bg: 'bg-cyan-500',      color: '#06b6d4', miniColor: '#06b6d4' },
  zoom_contacts:            { icon: Users,         bg: 'bg-blue-600',      color: '#2563eb', miniColor: '#2563eb' },
  zoom_cloud:               { icon: Cloud,         bg: 'bg-sky-500',       color: '#0ea5e9', miniColor: '#0ea5e9' },
  zoom_quality:             { icon: Activity,      bg: 'bg-green-600',     color: '#16a34a', miniColor: '#16a34a' },
  // Desktop Control
  desktop_screen:           { icon: Monitor,       bg: 'bg-slate-600',     color: '#475569', miniColor: '#475569' },
  desktop_keyboard:         { icon: Keyboard,      bg: 'bg-gray-600',      color: '#4b5563', miniColor: '#4b5563' },
  desktop_mouse:            { icon: MousePointer2, bg: 'bg-slate-500',     color: '#64748b', miniColor: '#64748b' },
  desktop_clipboard:        { icon: Clipboard,     bg: 'bg-zinc-600',      color: '#52525b', miniColor: '#52525b' },
  desktop_windows:          { icon: LayoutGrid,    bg: 'bg-blue-700',      color: '#1d4ed8', miniColor: '#1d4ed8' },
  desktop_apps:             { icon: Puzzle,        bg: 'bg-indigo-600',    color: '#4f46e5', miniColor: '#4f46e5' },
  desktop_files:            { icon: FolderOpen,    bg: 'bg-amber-600',     color: '#d97706', miniColor: '#d97706' },
  desktop_system:           { icon: Cpu,           bg: 'bg-slate-700',     color: '#334155', miniColor: '#334155' },
  desktop_notifications:    { icon: Bell,          bg: 'bg-yellow-600',    color: '#ca8a04', miniColor: '#ca8a04' },
  desktop_ocr:              { icon: FileText,      bg: 'bg-teal-700',      color: '#0f766e', miniColor: '#0f766e' },
  desktop_automation:       { icon: Zap,           bg: 'bg-orange-600',    color: '#ea580c', miniColor: '#ea580c' },
  desktop_ui:               { icon: Monitor,       bg: 'bg-violet-600',    color: '#7c3aed', miniColor: '#7c3aed' },
  desktop_media:            { icon: Activity,      bg: 'bg-pink-600',      color: '#db2777', miniColor: '#db2777' },
  desktop_accessibility:    { icon: Users,         bg: 'bg-green-700',     color: '#15803d', miniColor: '#15803d' },
  // Built-in / Pincer
  pincer_search:            { icon: Search,        bg: 'bg-emerald-600',   color: '#059669', miniColor: '#059669' },
  pincer_browser:           { icon: Globe,         bg: 'bg-teal-600',      color: '#0d9488', miniColor: '#0d9488' },
  pincer_email:             { icon: Mail,          bg: 'bg-green-600',     color: '#16a34a', miniColor: '#16a34a' },
  pincer_calendar:          { icon: Calendar,      bg: 'bg-emerald-500',   color: '#10b981', miniColor: '#10b981' },
  pincer_shell:             { icon: Terminal,      bg: 'bg-gray-800',      color: '#1f2937', miniColor: '#1f2937' },
  pincer_code:              { icon: Code2,         bg: 'bg-slate-700',     color: '#334155', miniColor: '#334155' },
  pincer_files:             { icon: FolderOpen,    bg: 'bg-teal-700',      color: '#0f766e', miniColor: '#0f766e' },
  pincer_memory:            { icon: Database,      bg: 'bg-green-700',     color: '#15803d', miniColor: '#15803d' },
  pincer_voice:             { icon: Mic,           bg: 'bg-emerald-700',   color: '#047857', miniColor: '#047857' },
  pincer_skill:             { icon: Zap,           bg: 'bg-teal-500',      color: '#14b8a6', miniColor: '#14b8a6' },
};

// ── Integration group header colors ───────────────────────────────────────────

const GROUP_STYLE: Record<string, { color: string; label: string }> = {
  'Google Workspace': { color: 'text-red-500',    label: 'Google' },
  'Microsoft 365':    { color: 'text-blue-600',   label: 'Microsoft 365' },
  'Slack':            { color: 'text-violet-600', label: 'Slack' },
  'HubSpot':          { color: 'text-orange-500', label: 'HubSpot' },
  'Salesforce':       { color: 'text-blue-500',   label: 'Salesforce' },
  'Zoom':             { color: 'text-blue-400',   label: 'Zoom' },
  'Desktop Control':  { color: 'text-slate-600',  label: 'Desktop' },
  'Built-in Tools':   { color: 'text-emerald-600',label: 'Built-in' },
};

// ── Execution context ─────────────────────────────────────────────────────────

const ExecCtx = createContext<Record<string, ExecStatus>>({});

// ── Integration config context (open modal from node) ─────────────────────────

interface IntegrationConfigCtxType {
  openConfig: (nodeId: string) => void;
}
const IntegrationConfigCtx = createContext<IntegrationConfigCtxType>({ openConfig: () => {} });

// ── Workflow node (n8n-style) ─────────────────────────────────────────────────

function WorkflowNode({ id, data, selected }: NodeProps) {
  const execStatus = useContext(ExecCtx);
  const nodeData = data as NodeData;
  const cfg = NODE_CONFIG[nodeData.nodeType] ?? NODE_CONFIG.action;
  const Icon = cfg.icon;
  const isTrigger = cfg.category === 'triggers';
  const isCondition = nodeData.nodeType === 'condition';
  const isSwitch = nodeData.nodeType === 'switch_node';
  const status = execStatus[id] ?? 'idle';

  // Switch branches — default to 3 if not set
  const branches: string[] = nodeData.branches ?? ['Case 1', 'Case 2', 'Default'];

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
        'relative bg-white rounded-xl transition-all duration-200 group border',
        isSwitch ? 'w-52' : 'w-44',
        selected
          ? 'ring-2 ring-gray-900 ring-offset-1 border-transparent shadow-lg'
          : 'border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md',
      ].join(' ')}
    >
      {!isTrigger && (
        <Handle
          type="target"
          position={Position.Top}
          className="!w-2.5 !h-2.5 !bg-white !border-2 !border-gray-200 !-top-1.5 hover:!border-gray-900 !transition-colors"
        />
      )}

      <div className="p-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className={`w-7 h-7 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0 opacity-90`}>
            <Icon className="h-3.5 w-3.5 text-white" />
          </div>
          {statusIcon && <div>{statusIcon}</div>}
        </div>
        <p className="text-[8px] font-medium text-gray-400 uppercase tracking-widest leading-none mb-1.5">
          {cfg.label}
        </p>
        <p className="text-[11px] font-semibold text-gray-900 truncate leading-tight">
          {nodeData.label || cfg.label}
        </p>
        {nodeData.expression && (
          <p className="text-[10px] font-mono text-gray-400 mt-1.5 truncate bg-gray-50 rounded-md px-1.5 py-1 border border-gray-100">
            {nodeData.expression}
          </p>
        )}
        {!nodeData.expression && nodeData.description && (
          <p className="text-[10px] text-gray-400 mt-1 truncate leading-relaxed">{nodeData.description}</p>
        )}
      </div>

      {/* ── If / Condition node: True + False labeled outputs ── */}
      {isCondition && (
        <>
          <div className="flex border-t border-gray-100 rounded-b-xl overflow-hidden">
            <div className="flex-1 py-2 flex items-center justify-center bg-emerald-50/70">
              <CheckCircle2 className="h-3 w-3 text-emerald-500 mr-1" />
              <span className="text-[9px] font-semibold text-emerald-600 uppercase tracking-widest">True</span>
            </div>
            <div className="flex-1 py-2 flex items-center justify-center bg-rose-50/70 border-l border-gray-100">
              <AlertCircle className="h-3 w-3 text-rose-400 mr-1" />
              <span className="text-[9px] font-semibold text-rose-500 uppercase tracking-widest">False</span>
            </div>
          </div>
          <Handle
            id="true"
            type="source"
            position={Position.Bottom}
            style={{ left: '25%' }}
            className="!w-3 !h-3 !bg-white !border-2 !border-green-400 !-bottom-1.5 hover:!border-green-600 !transition-colors"
          />
          <Handle
            id="false"
            type="source"
            position={Position.Bottom}
            style={{ left: '75%' }}
            className="!w-3 !h-3 !bg-white !border-2 !border-red-400 !-bottom-1.5 hover:!border-red-600 !transition-colors"
          />
        </>
      )}

      {/* ── Switch node: N labeled branch outputs ── */}
      {isSwitch && (
        <>
          <div className="flex border-t border-gray-100 rounded-b-xl overflow-hidden">
            {branches.map((branch, i) => (
              <div
                key={i}
                className={cn(
                  'flex-1 py-2 flex items-center justify-center',
                  i > 0 ? 'border-l border-gray-100' : '',
                  i === branches.length - 1 ? 'bg-gray-50/60' : 'bg-indigo-50/40',
                )}
              >
                <span className="text-[9px] font-semibold text-indigo-600 truncate px-1 max-w-[52px] text-center leading-tight">
                  {branch}
                </span>
              </div>
            ))}
          </div>
          {branches.map((_, i) => (
            <Handle
              key={i}
              id={`branch-${i}`}
              type="source"
              position={Position.Bottom}
              style={{ left: `${((i + 0.5) / branches.length) * 100}%` }}
              className="!w-3 !h-3 !bg-white !border-2 !border-indigo-400 !-bottom-1.5 hover:!border-indigo-600 !transition-colors"
            />
          ))}
        </>
      )}

      {/* ── Normal nodes: single source handle ── */}
      {!isCondition && !isSwitch && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !bg-white !border-2 !border-gray-300 !-bottom-1.5 hover:!border-blue-500 !transition-colors"
        />
      )}
    </div>
  );
}

// ── Integration node ──────────────────────────────────────────────────────────

function IntegrationNode({ id, data, selected }: NodeProps) {
  const execStatus = useContext(ExecCtx);
  const { openConfig } = useContext(IntegrationConfigCtx);
  const nodeData = data as NodeData;
  const integrationKey = nodeData.integrationKey ?? '';
  const service = INTEGRATION_CATALOG[integrationKey];
  const style = INTEGRATION_STYLE[integrationKey];
  const status = execStatus[id] ?? 'idle';

  const enabledTools = nodeData.enabledTools ?? (service ? service.tools.map(t => t.name) : []);
  const enabledCount = enabledTools.length;
  const totalCount = service?.tools.length ?? 0;

  const Icon = style?.icon ?? Puzzle;
  const bg = style?.bg ?? 'bg-teal-600';

  const statusIcon = {
    running: <Loader2 className="h-3 w-3 animate-spin text-amber-500" />,
    done:    <CheckCircle2 className="h-3 w-3 text-green-500" />,
    error:   <AlertCircle className="h-3 w-3 text-red-500" />,
    pending: <div className="h-2 w-2 rounded-full bg-gray-300" />,
    idle:    null,
  }[status];

  return (
    <div
      className={cn(
        'relative bg-white rounded-xl w-48 transition-all duration-200 border',
        selected
          ? 'ring-2 ring-gray-900 ring-offset-1 border-transparent shadow-lg'
          : 'border-gray-100 shadow-sm hover:border-gray-200 hover:shadow-md',
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2.5 !h-2.5 !bg-white !border-2 !border-gray-200 !-top-1.5 hover:!border-gray-900 !transition-colors"
      />

      <div className="p-3">
        {/* Header row */}
        <div className="flex items-center justify-between gap-1 mb-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center flex-shrink-0 opacity-90`}>
              <Icon className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="min-w-0">
              <p className="text-[8px] font-medium text-gray-300 uppercase tracking-widest leading-none">
                {service?.integration ?? 'Integration'}
              </p>
              <p className="text-[11px] font-semibold text-gray-900 truncate leading-tight mt-0.5">
                {service?.service ?? nodeData.label}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            {statusIcon}
            {/* Three-dots config button */}
            <button
              className="w-5 h-5 rounded-md flex items-center justify-center text-gray-300 hover:text-gray-800 hover:bg-gray-50 transition-colors"
              onMouseDown={e => { e.stopPropagation(); }}
              onClick={e => { e.stopPropagation(); openConfig(id); }}
              title="Configure tools"
            >
              <MoreVertical className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Tool count badge */}
        <div className="flex items-center gap-1">
          <span className={cn(
            'text-[9px] px-1.5 py-0.5 rounded-full font-medium border',
            enabledCount === totalCount
              ? 'bg-gray-100 text-gray-600 border-gray-200'
              : 'bg-amber-50 text-amber-700 border-amber-100'
          )}>
            {enabledCount}/{totalCount} tools
          </span>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2.5 !h-2.5 !bg-white !border-2 !border-gray-200 !-bottom-1.5 hover:!border-gray-900 !transition-colors"
      />
    </div>
  );
}

// ── Tool Config Modal ─────────────────────────────────────────────────────────

function ToolConfigModal({
  open,
  nodeId,
  integrationKey,
  enabledTools,
  onClose,
  onSave,
}: {
  open: boolean;
  nodeId: string;
  integrationKey: string;
  enabledTools: string[];
  onClose: () => void;
  onSave: (nodeId: string, enabled: string[]) => void;
}) {
  const service = INTEGRATION_CATALOG[integrationKey];
  const style = INTEGRATION_STYLE[integrationKey];
  const [localEnabled, setLocalEnabled] = useState<Set<string>>(new Set(enabledTools));
  const [searchQ, setSearchQ] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'read' | 'write'>('all');

  // Reset when modal opens
  useEffect(() => {
    if (open) {
      setLocalEnabled(new Set(enabledTools));
      setSearchQ('');
      setTypeFilter('all');
    }
  }, [open, enabledTools]);

  if (!service) return null;

  const Icon = style?.icon ?? Puzzle;
  const bg = style?.bg ?? 'bg-teal-600';

  const filteredTools = service.tools.filter(t => {
    const matchType = typeFilter === 'all' || t.type === typeFilter;
    const matchSearch = !searchQ || t.name.toLowerCase().includes(searchQ.toLowerCase()) || t.desc.toLowerCase().includes(searchQ.toLowerCase());
    return matchType && matchSearch;
  });

  const readTools  = filteredTools.filter(t => t.type === 'read');
  const writeTools = filteredTools.filter(t => t.type === 'write');

  const toggle = (name: string) => {
    setLocalEnabled(prev => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name); else next.add(name);
      return next;
    });
  };

  const enableAll  = () => setLocalEnabled(new Set(service.tools.map(t => t.name)));
  const disableAll = () => setLocalEnabled(new Set());
  const enableAllVisible = () => setLocalEnabled(prev => {
    const next = new Set(prev);
    filteredTools.forEach(t => next.add(t.name));
    return next;
  });

  const handleSave = () => {
    onSave(nodeId, Array.from(localEnabled));
    onClose();
  };

  const enabledVisible = filteredTools.filter(t => localEnabled.has(t.name)).length;

  return (
    <Dialog open={open} onOpenChange={o => { if (!o) onClose(); }}>
      <DialogContent className="sm:max-w-[560px] p-0 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <DialogHeader className="px-5 pt-5 pb-3 border-b border-gray-100 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2.5 text-base font-semibold">
            <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{service.integration} · {service.service}</p>
              <p className="text-xs font-normal text-gray-500 mt-0.5">
                {localEnabled.size} / {service.tools.length} tools enabled
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Controls */}
        <div className="px-5 pt-3 pb-2 border-b border-gray-50 flex-shrink-0 space-y-2">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              value={searchQ}
              onChange={e => setSearchQ(e.target.value)}
              placeholder="Search tools…"
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-100 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 transition-colors"
            />
          </div>
          {/* Filters + bulk actions */}
          <div className="flex items-center gap-2">
            <div className="flex gap-1 flex-1">
              {(['all', 'read', 'write'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setTypeFilter(f)}
                  className={cn(
                    'px-2.5 py-1 rounded-md text-xs font-medium transition-colors',
                    typeFilter === f ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {f === 'all' ? 'All' : f === 'read' ? 'Read' : 'Write'}
                </button>
              ))}
            </div>
            <div className="flex gap-1">
              <button
                onClick={searchQ || typeFilter !== 'all' ? enableAllVisible : enableAll}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                Enable {searchQ || typeFilter !== 'all' ? 'visible' : 'all'}
              </button>
              <button
                onClick={disableAll}
                className="px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Disable all
              </button>
            </div>
          </div>
        </div>

        {/* Tool list */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4">
          {filteredTools.length === 0 && (
            <p className="text-xs text-gray-400 text-center py-6">No tools match your search</p>
          )}

          {readTools.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Read</span>
                <span className="text-[10px] text-gray-300">{readTools.filter(t => localEnabled.has(t.name)).length}/{readTools.length}</span>
              </div>
              <div className="space-y-1">
                {readTools.map(tool => (
                  <ToolRow key={tool.name} tool={tool} enabled={localEnabled.has(tool.name)} onToggle={() => toggle(tool.name)} />
                ))}
              </div>
            </div>
          )}

          {writeTools.length > 0 && (
            <div>
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">Write</span>
                <span className="text-[10px] text-gray-300">{writeTools.filter(t => localEnabled.has(t.name)).length}/{writeTools.length}</span>
              </div>
              <div className="space-y-1">
                {writeTools.map(tool => (
                  <ToolRow key={tool.name} tool={tool} enabled={localEnabled.has(tool.name)} onToggle={() => toggle(tool.name)} />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
          <p className="text-xs text-gray-400">
            {enabledVisible} shown · {localEnabled.size} total enabled
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="h-7 text-xs bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors"
              onClick={handleSave}
            >
              <CheckCircle2 className="h-3 w-3 mr-1" />
              Apply
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ToolRow({
  tool, enabled, onToggle,
}: {
  tool: { name: string; type: string; approval: boolean; desc: string };
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 px-3 py-2 rounded-lg border cursor-pointer transition-all',
        enabled
          ? 'border-gray-200 bg-gray-50 hover:bg-gray-100'
          : 'border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50/50'
      )}
      onClick={onToggle}
    >
      {/* Toggle */}
      <div className={cn(
        'w-8 h-4 rounded-full flex items-center transition-colors flex-shrink-0',
        enabled ? 'bg-gray-900 justify-end pr-0.5' : 'bg-gray-200 justify-start pl-0.5'
      )}>
        <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
      </div>

      {/* Tool info */}
      <div className="flex-1 min-w-0">
        <p className={cn('text-xs font-medium truncate', enabled ? 'text-gray-900' : 'text-gray-500')}>
          {tool.name}
        </p>
        <p className="text-[10px] text-gray-400 truncate">{tool.desc}</p>
      </div>

      {/* Badges */}
      <div className="flex items-center gap-1 flex-shrink-0">
        {tool.approval && (
          <span className="text-[9px] px-1.5 py-0.5 rounded font-semibold bg-amber-100 text-amber-700 border border-amber-200">
            Approval
          </span>
        )}
      </div>
    </div>
  );
}

// ── Sticky note node ──────────────────────────────────────────────────────────

function StickyNoteNode({ id, data, selected }: NodeProps) {
  const nodeData = data as NodeData;
  return (
    <div
      className={[
        'relative w-44 min-h-[80px] rounded-xl p-3 flex flex-col gap-1',
        'bg-amber-50 border border-amber-200',
        selected ? 'ring-2 ring-gray-900 ring-offset-1 shadow-lg' : 'shadow-sm hover:shadow-md',
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

const nodeTypes: NodeTypes = {
  workflowNode: WorkflowNode,
  stickyNote: StickyNoteNode,
  integrationNode: IntegrationNode,
};

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
      className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-[#f5f3ee] cursor-grab active:cursor-grabbing transition-colors select-none group border border-transparent hover:border-[#141413]/10"
    >
      <div className="w-7 h-7 bg-[#141413]/6 border border-[#c8c6be] flex items-center justify-center flex-shrink-0 group-hover:bg-[#141413]/10 transition-colors" style={{ borderRadius: '9px' }}>
        <Icon className="h-3.5 w-3.5 text-black/45 group-hover:text-black/70 transition-colors" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium text-[#141413] truncate leading-tight">{cfg.label}</p>
        <p className="text-[9px] text-[#30302e]/45 truncate">{cfg.desc}</p>
      </div>
    </div>
  );
}

// ── Integration palette item ──────────────────────────────────────────────────

function IntegrationPaletteItem({ serviceKey }: { serviceKey: string }) {
  const service = INTEGRATION_CATALOG[serviceKey];
  const style = INTEGRATION_STYLE[serviceKey];
  if (!service || !style) return null;
  const Icon = style.icon;

  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/reactflow-integration', serviceKey);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg hover:bg-[#f5f3ee] cursor-grab active:cursor-grabbing transition-colors select-none group border border-transparent hover:border-[#141413]/10"
    >
      <div className="w-7 h-7 bg-[#141413]/6 border border-[#c8c6be] flex items-center justify-center flex-shrink-0 group-hover:bg-[#141413]/10 transition-colors" style={{ borderRadius: '9px' }}>
        <Icon className="h-3.5 w-3.5 text-black/45 group-hover:text-black/70 transition-colors" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-[#141413] truncate leading-tight">{service.service}</p>
        <p className="text-[9px] text-[#30302e]/45 truncate">{service.tools.length} tools</p>
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
        className="w-full flex items-center gap-2 px-3 py-2 text-[9px] font-semibold uppercase tracking-widest text-[#30302e]/40 hover:text-[#141413] transition-colors"
      >
        <CatIcon className={`h-3 w-3 ${cat.color} flex-shrink-0`} />
        <span className="flex-1 text-left">{cat.label}</span>
        {open ? <ChevronDown className="h-3 w-3 text-[#30302e]/25" /> : <ChevronRight className="h-3 w-3 text-[#30302e]/25" />}
      </button>
      {open && (
        <div className="mb-2 px-1">
          {types.map(t => <PaletteItem key={t} nodeType={t} />)}
        </div>
      )}
    </div>
  );
}

// ── Integration group section (collapsible) ───────────────────────────────────

function IntegrationGroupSection({
  groupName, serviceKeys, defaultOpen = false,
}: { groupName: string; serviceKeys: string[]; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  const gStyle = GROUP_STYLE[groupName];

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-widest text-[#30302e]/40 hover:text-[#141413] transition-colors"
      >
        <Puzzle className={`h-3 w-3 ${gStyle?.color ?? 'text-teal-500'} flex-shrink-0`} />
        <span className="flex-1 text-left truncate">{gStyle?.label ?? groupName}</span>
        <span className="text-[9px] text-[#30302e]/25 mr-1 tabular-nums">{serviceKeys.length}</span>
        {open ? <ChevronDown className="h-3 w-3 text-[#30302e]/25" /> : <ChevronRight className="h-3 w-3 text-[#30302e]/25" />}
      </button>
      {open && (
        <div className="mb-2 px-1">
          {serviceKeys.map(k => <IntegrationPaletteItem key={k} serviceKey={k} />)}
        </div>
      )}
    </div>
  );
}

// ── Integration palette panel (all groups) ────────────────────────────────────

function IntegrationPalettePanel({ search }: { search: string }) {
  const [open, setOpen] = useState(false);

  const filteredGroups = Object.entries(INTEGRATION_GROUPS).map(([group, keys]) => ({
    group,
    keys: keys.filter(k => {
      if (!search) return true;
      const svc = INTEGRATION_CATALOG[k];
      return svc && (
        svc.service.toLowerCase().includes(search.toLowerCase()) ||
        svc.integration.toLowerCase().includes(search.toLowerCase()) ||
        svc.tools.some(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
      );
    }),
  })).filter(g => g.keys.length > 0);

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 text-[9px] font-semibold uppercase tracking-widest text-[#30302e]/40 hover:text-[#141413] transition-colors"
      >
        <Puzzle className="h-3 w-3 text-teal-500 flex-shrink-0" />
        <span className="flex-1 text-left">Integrations</span>
        {open ? <ChevronDown className="h-3 w-3 text-[#30302e]/25" /> : <ChevronRight className="h-3 w-3 text-[#30302e]/25" />}
      </button>
      {open && (
        <div className="pl-2 mb-1">
          {filteredGroups.map(({ group, keys }) => (
            <IntegrationGroupSection
              key={group}
              groupName={group}
              serviceKeys={keys}
              defaultOpen={!!search}
            />
          ))}
          {filteredGroups.length === 0 && (
            <p className="text-xs text-[#30302e]/45 text-center py-3 px-2">No integrations found</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Properties panel ──────────────────────────────────────────────────────────

function PropertiesPanel({
  node, onChange, onClose, onDelete, onDuplicate, onOpenConfig,
}: {
  node: Node;
  onChange: (id: string, patch: Partial<NodeData>) => void;
  onClose: () => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onOpenConfig?: (id: string) => void;
}) {
  const data = node.data as NodeData;
  const isIntegration = node.type === 'integrationNode';
  const cfg = isIntegration ? null : (NODE_CONFIG[data.nodeType] ?? NODE_CONFIG.action);
  const integStyle = isIntegration ? INTEGRATION_STYLE[data.integrationKey ?? ''] : null;
  const integService = isIntegration ? INTEGRATION_CATALOG[data.integrationKey ?? ''] : null;
  const Icon = isIntegration ? (integStyle?.icon ?? Puzzle) : cfg!.icon;
  const bg   = isIntegration ? (integStyle?.bg ?? 'bg-teal-600') : cfg!.bg;
  const isTrigger = !isIntegration && cfg!.category === 'triggers';

  return (
    <div className="w-64 border-l border-gray-100 bg-white flex flex-col flex-shrink-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
        <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center flex-shrink-0 opacity-90`}>
          <Icon className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[8px] font-medium text-gray-300 uppercase tracking-widest mb-0.5">Properties</p>
          <span className="text-[11px] font-semibold text-gray-900 truncate block">
            {isIntegration ? (integService?.service ?? 'Integration') : cfg!.label}
          </span>
        </div>
        <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0 text-gray-300 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors" onClick={onClose}>
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Integration-specific */}
        {isIntegration && integService && (
          <div>
            <Label className="text-xs text-gray-500 mb-2 block">Tool Configuration</Label>
            <div className="rounded-lg border border-gray-100 p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">
                  {(data.enabledTools ?? integService.tools.map(t => t.name)).length} / {integService.tools.length} enabled
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 text-[10px] px-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 transition-colors rounded-md"
                  onClick={() => onOpenConfig?.(node.id)}
                >
                  <Settings2 className="h-3 w-3 mr-1" /> Configure
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Label */}
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Label</Label>
          <Input
            className="h-8 text-xs"
            placeholder={isIntegration ? (integService?.service ?? 'Integration') : cfg!.label}
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

        {/* Condition (if/else) */}
        {data.nodeType === 'condition' && (
          <div className="space-y-2">
            <div>
              <Label className="text-xs text-gray-500 mb-1 block">Condition Expression</Label>
              <Input className="h-8 text-xs font-mono" placeholder="{{ $json.status === 'active' }}" value={data.expression ?? ''} onChange={e => onChange(node.id, { expression: e.target.value })} />
            </div>
            <div className="rounded-lg border border-gray-100 overflow-hidden text-[10px]">
              <div className="flex">
                <div className="flex-1 flex items-center gap-1.5 px-2.5 py-2 bg-green-50/70 border-r border-gray-100">
                  <CheckCircle2 className="h-3 w-3 text-green-500 flex-shrink-0" />
                  <span className="font-semibold text-green-700">True</span>
                  <span className="text-green-600 ml-auto">left handle</span>
                </div>
                <div className="flex-1 flex items-center gap-1.5 px-2.5 py-2 bg-red-50/70">
                  <AlertCircle className="h-3 w-3 text-red-400 flex-shrink-0" />
                  <span className="font-semibold text-red-600">False</span>
                  <span className="text-red-500 ml-auto">right handle</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Switch node — editable branches */}
        {data.nodeType === 'switch_node' && (() => {
          const branches: string[] = data.branches ?? ['Case 1', 'Case 2', 'Default'];
          return (
            <div className="space-y-2">
              <Label className="text-xs text-gray-500 block">Branches</Label>
              {branches.map((branch, i) => (
                <div key={i} className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded bg-indigo-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-[9px] font-bold text-indigo-600">{i + 1}</span>
                  </div>
                  <Input
                    className="h-7 text-xs flex-1"
                    value={branch}
                    onChange={e => {
                      const next = [...branches];
                      next[i] = e.target.value;
                      onChange(node.id, { branches: next });
                    }}
                  />
                  {branches.length > 2 && (
                    <button
                      className="w-5 h-5 flex items-center justify-center rounded text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors flex-shrink-0"
                      onClick={() => {
                        const next = branches.filter((_, j) => j !== i);
                        onChange(node.id, { branches: next });
                      }}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              ))}
              {branches.length < 8 && (
                <button
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-dashed border-indigo-200 text-[10px] font-medium text-indigo-500 hover:bg-indigo-50 transition-colors"
                  onClick={() => onChange(node.id, { branches: [...branches, `Case ${branches.length + 1}`] })}
                >
                  <span className="text-base leading-none">+</span> Add Branch
                </button>
              )}
              <p className="text-[10px] text-gray-400">Each branch gets its own output handle at the bottom of the node.</p>
            </div>
          );
        })()}
      </div>

      {/* Footer actions */}
      <div className="px-4 py-3 border-t border-gray-100 flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 h-7 text-[11px] text-gray-400 hover:text-gray-800 hover:bg-gray-50 gap-1 rounded-lg transition-colors"
          onClick={() => onDuplicate(node.id)}
        >
          <Copy className="h-3 w-3" /> Duplicate
        </Button>
        {!isTrigger && (
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 h-7 text-[11px] text-gray-400 hover:text-red-600 hover:bg-red-50 gap-1 rounded-lg transition-colors"
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
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800/60">
        <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Execution Output</span>
        <Button variant="ghost" size="sm" className="h-5 text-[10px] text-gray-600 hover:text-gray-300 px-2 transition-colors" onClick={onClear}>Clear</Button>
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

  // ── Communication templates ──────────────────────────────────────────────────
  'missed-call-whatsapp': {
    name: 'Missed Call → WhatsApp Follow-up',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_event',   'Inbound Call Not Answered'),
      mkNode('n2', 260, 180, 'action',          'Look Up Caller in CRM'),
      mkNode('n3', 260, 300, 'notification',    'Send WhatsApp Message'),
      mkNode('n4', 260, 420, 'condition',       'Customer Replied?'),
      mkNode('n5', 100, 540, 'action',          'Create Support Ticket'),
      mkNode('n6', 420, 540, 'action',          'Route to Support Agent'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'),
    ],
  },
  'email-auto-draft': {
    name: 'Email Auto-Draft Reply',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_email',  'New Email Matching Filter'),
      mkNode('n2', 260, 180, 'ai_classify',    'Classify Intent'),
      mkNode('n3', 260, 300, 'action',         'Search Past Threads'),
      mkNode('n4', 260, 420, 'ai_generate',    'Draft Reply in Sender\'s Language'),
      mkNode('n5', 260, 540, 'human_approval', 'Approval to Send'),
      mkNode('n6', 260, 660, 'send_email',     'Send Reply & Log in CRM'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'),
    ],
  },
  'customer-inquiry-crm': {
    name: 'Inquiry → CRM Ticket → Slack Alert',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_app',    'Inbound WhatsApp Message'),
      mkNode('n2', 260, 180, 'condition',      'Contact in CRM?'),
      mkNode('n3', 100, 300, 'action',         'Create New Contact'),
      mkNode('n4', 420, 300, 'action',         'Fetch Existing Contact'),
      mkNode('n5', 260, 420, 'ai_classify',    'Classify Inquiry'),
      mkNode('n6', 260, 540, 'action',         'Create Support Ticket'),
      mkNode('n7', 260, 660, 'slack',          'Post to #support Slack'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n2', 'n4'), mkEdge('e4', 'n3', 'n5'),
      mkEdge('e5', 'n4', 'n5'), mkEdge('e6', 'n5', 'n6'),
      mkEdge('e7', 'n6', 'n7'),
    ],
  },
  'meeting-followup-email': {
    name: 'Meeting Follow-up Email',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_event',  'Calendar Event Ends'),
      mkNode('n2', 260, 180, 'action',         'Get Meeting Details'),
      mkNode('n3', 260, 300, 'action',         'Search Context & Notes'),
      mkNode('n4', 260, 420, 'ai_generate',    'Draft Follow-up + Action Items'),
      mkNode('n5', 260, 540, 'human_approval', 'Approval to Send'),
      mkNode('n6', 260, 660, 'send_email',     'Send & Log in CRM'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'),
    ],
  },
  'cold-outreach-sequence': {
    name: 'Cold Outreach Sequence (3-touch)',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual',  'Start Sequence for Company'),
      mkNode('n2', 260, 180, 'http_request',    'Research Company'),
      mkNode('n3', 260, 300, 'ai_generate',     'Draft Personalized Email #1'),
      mkNode('n4', 260, 420, 'send_email',      'Send Email #1'),
      mkNode('n5', 260, 540, 'delay',           'Wait 3 Days'),
      mkNode('n6', 260, 660, 'ai_generate',     'Draft Email #2'),
      mkNode('n7', 100, 780, 'send_email',      'Send Email #2'),
      mkNode('n8', 260, 900, 'delay',           'Wait 4 Days'),
      mkNode('n9', 260, 1020,'send_email',      'Send Email #3 & Log CRM'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'), mkEdge('e6', 'n6', 'n7'),
      mkEdge('e7', 'n7', 'n8'), mkEdge('e8', 'n8', 'n9'),
    ],
  },
  'reply-classification-routing': {
    name: 'Reply Classification & Routing',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_email',  'New Reply to Sequence'),
      mkNode('n2', 260, 180, 'ai_classify',    'Classify Intent'),
      mkNode('n3', 260, 300, 'switch_node',    'Route by Intent'),
      mkNode('n4', 60,  420, 'action',         'Mark: Interested'),
      mkNode('n5', 200, 420, 'action',         'Mark: Not Now'),
      mkNode('n6', 340, 420, 'action',         'Unsubscribe & Remove'),
      mkNode('n7', 480, 420, 'action',         'Handle OOO / Wrong Person'),
      mkNode('n8', 260, 540, 'action',         'Update CRM & Log'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n3', 'n5'),
      mkEdge('e5', 'n3', 'n6'), mkEdge('e6', 'n3', 'n7'),
      mkEdge('e7', 'n4', 'n8'), mkEdge('e8', 'n5', 'n8'),
    ],
  },
  'customer-review-response': {
    name: 'Customer Review Response',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_schedule', 'Daily Schedule / On Demand'),
      mkNode('n2', 260, 180, 'http_request',     'Search Google / Trustpilot'),
      mkNode('n3', 260, 300, 'ai_classify',      'Classify Sentiment'),
      mkNode('n4', 260, 420, 'ai_generate',      'Draft Response in Brand Voice'),
      mkNode('n5', 260, 540, 'human_approval',   'Approval to Publish'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
    ],
  },
  'multilingual-support-handoff': {
    name: 'Multilingual Support Handoff',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_app',   'Inbound Message (Non-German)'),
      mkNode('n2', 260, 180, 'ai_classify',   'Detect Language'),
      mkNode('n3', 260, 300, 'ai_transform',  'Translate to German for Log'),
      mkNode('n4', 260, 420, 'ai_generate',   'Draft Response in Customer\'s Language'),
      mkNode('n5', 260, 540, 'condition',     'Complex Issue?'),
      mkNode('n6', 100, 660, 'action',        'Escalate to Human Agent'),
      mkNode('n7', 420, 660, 'notification',  'Send Draft Response'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'), mkEdge('e6', 'n5', 'n7'),
    ],
  },
  'csat-survey-after-resolution': {
    name: 'CSAT Survey After Resolution',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_event',  'Ticket Marked Resolved'),
      mkNode('n2', 260, 180, 'delay',          'Wait 24 Hours'),
      mkNode('n3', 260, 300, 'notification',   'Send WhatsApp Star-Rating Survey'),
      mkNode('n4', 260, 420, 'action',         'Log CSAT Score'),
      mkNode('n5', 260, 540, 'condition',      'Score ≤ 2 Stars?'),
      mkNode('n6', 100, 660, 'action',         'Reopen Ticket + Escalate'),
      mkNode('n7', 420, 660, 'action',         'Mark Survey Complete'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'), mkEdge('e6', 'n5', 'n7'),
    ],
  },
  'invoice-dispute-handling': {
    name: 'Invoice Dispute Handling',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_app',    'Customer Mentions Invoice + Negative Tone'),
      mkNode('n2', 260, 180, 'ai_classify',    'Detect Dispute + Sentiment'),
      mkNode('n3', 260, 300, 'action',         'Look Up Related Invoices'),
      mkNode('n4', 260, 420, 'action',         'Create High-Priority Ticket'),
      mkNode('n5', 260, 540, 'notification',   'Notify Finance Team'),
      mkNode('n6', 260, 660, 'ai_generate',    'Draft Acknowledgment'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'),
    ],
  },
  'whatsapp-appointment-booking': {
    name: 'WhatsApp Appointment Booking',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_app',   'Customer Texts "Termin"'),
      mkNode('n2', 260, 180, 'action',        'Check Calendar Availability'),
      mkNode('n3', 260, 300, 'notification',  'Propose 3 Time Slots'),
      mkNode('n4', 260, 420, 'action',        'Customer Picks Slot'),
      mkNode('n5', 260, 540, 'action',        'Create Calendar Event'),
      mkNode('n6', 260, 660, 'notification',  'Send Confirmation'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'),
    ],
  },
  'phone-appointment-rescheduling': {
    name: 'Phone Appointment Rescheduling',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual', 'Call & Reschedule Appointment'),
      mkNode('n2', 260, 180, 'action',         'Look Up Contact'),
      mkNode('n3', 260, 300, 'action',         'Place Outbound Call'),
      mkNode('n4', 260, 420, 'action',         'Request Reschedule'),
      mkNode('n5', 260, 540, 'action',         'Update Calendar'),
      mkNode('n6', 260, 660, 'notification',   'Report Back to User'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'),
    ],
  },

  // ── Internal Search templates ────────────────────────────────────────────────
  'universal-company-search': {
    name: 'Universal Company Search',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual', '"What do we have on [Company]?"'),
      mkNode('n2', 60,  180, 'action',         'Search CRM (Contacts & Deals)'),
      mkNode('n3', 260, 180, 'action',         'Search Email Threads'),
      mkNode('n4', 460, 180, 'action',         'Search Files & Memory'),
      mkNode('n5', 260, 300, 'merge',          'Merge All Results'),
      mkNode('n6', 260, 420, 'ai_summarize',   'Compile Company Brief'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n1', 'n3'),
      mkEdge('e3', 'n1', 'n4'), mkEdge('e4', 'n2', 'n5'),
      mkEdge('e5', 'n3', 'n5'), mkEdge('e6', 'n4', 'n5'),
      mkEdge('e7', 'n5', 'n6'),
    ],
  },
  'meeting-prep-brief': {
    name: 'Meeting Prep Brief',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_event',  '1 Hour Before External Meeting'),
      mkNode('n2', 260, 180, 'action',         'Get Meeting Attendees'),
      mkNode('n3', 260, 300, 'action',         'Look Up Each Attendee in CRM'),
      mkNode('n4', 260, 420, 'action',         'Search Recent Email Threads'),
      mkNode('n5', 260, 540, 'http_request',   'Web Search for Company News'),
      mkNode('n6', 260, 660, 'ai_summarize',   'Compile 1-Page Brief'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'),
    ],
  },
  'contract-document-finder': {
    name: 'Contract / Document Finder',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual', '"Where is the contract with [Company]?"'),
      mkNode('n2', 60,  180, 'action',         'Search OneDrive / Drive'),
      mkNode('n3', 260, 180, 'action',         'Search Email Attachments'),
      mkNode('n4', 460, 180, 'action',         'Search Slack File Shares'),
      mkNode('n5', 260, 300, 'merge',          'Merge Results'),
      mkNode('n6', 260, 420, 'ai_summarize',   'Return Best Matches with Links'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n1', 'n3'),
      mkEdge('e3', 'n1', 'n4'), mkEdge('e4', 'n2', 'n5'),
      mkEdge('e5', 'n3', 'n5'), mkEdge('e6', 'n4', 'n5'),
      mkEdge('e7', 'n5', 'n6'),
    ],
  },
  'pipeline-status-query': {
    name: 'Pipeline Status Query',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual', '"How does the pipeline look?"'),
      mkNode('n2', 260, 180, 'action',         'Query CRM: Deals by Stage'),
      mkNode('n3', 260, 300, 'action',         'Calculate Totals & Compare to Target'),
      mkNode('n4', 260, 420, 'action',         'Identify Stale Deals + Top Closers'),
      mkNode('n5', 260, 540, 'ai_summarize',   'Format Pipeline Summary'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
    ],
  },
  'team-activity-summary': {
    name: 'Team Activity Summary',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual', '"What did the sales team do this week?"'),
      mkNode('n2', 260, 180, 'action',         'Query CRM: Activities per Rep'),
      mkNode('n3', 260, 300, 'action',         'Emails / Calls / Meetings / Deals'),
      mkNode('n4', 260, 420, 'ai_summarize',   'Compile Per-Rep Summary'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'),
    ],
  },
  'support-ticket-analytics': {
    name: 'Support Ticket Analytics',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_schedule', 'Monday 9am / On Demand'),
      mkNode('n2', 260, 180, 'action',           'Query: Opened / Resolved / Escalated'),
      mkNode('n3', 260, 300, 'action',           'Avg Response Time + Top Issues'),
      mkNode('n4', 260, 420, 'action',           'Calculate CSAT'),
      mkNode('n5', 260, 540, 'ai_summarize',     'Compare to Last Week + Report'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
    ],
  },
  'employee-info-lookup': {
    name: 'Employee Information Lookup',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual', '"How many vacation days does [Name] have?"'),
      mkNode('n2', 260, 180, 'action',         'Search HR Email Threads'),
      mkNode('n3', 260, 300, 'action',         'Search Memory for HR Decisions'),
      mkNode('n4', 260, 420, 'ai_summarize',   'Respond + Suggest HR System Check'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'),
    ],
  },
  'competitive-intelligence': {
    name: 'Competitive Intelligence',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual', '"What is [Competitor] doing?"'),
      mkNode('n2', 260, 180, 'http_request',   'Web Search Competitor News'),
      mkNode('n3', 260, 300, 'http_request',   'Browse Competitor Website'),
      mkNode('n4', 260, 420, 'action',         'Search CRM: Lost Deals to Competitor'),
      mkNode('n5', 260, 540, 'ai_summarize',   'Compile Intelligence Brief'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
    ],
  },
  'historical-decision-recall': {
    name: 'Historical Decision Recall',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual', '"What did we decide about [topic]?"'),
      mkNode('n2', 60,  180, 'action',         'Search Memory + Email Threads'),
      mkNode('n3', 260, 180, 'action',         'Search Slack Messages'),
      mkNode('n4', 460, 180, 'action',         'Search Meeting Notes'),
      mkNode('n5', 260, 300, 'merge',          'Merge All Sources'),
      mkNode('n6', 260, 420, 'ai_summarize',   'Compile Decision Timeline'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n1', 'n3'),
      mkEdge('e3', 'n1', 'n4'), mkEdge('e4', 'n2', 'n5'),
      mkEdge('e5', 'n3', 'n5'), mkEdge('e6', 'n4', 'n5'),
      mkEdge('e7', 'n5', 'n6'),
    ],
  },
  'financial-quick-look': {
    name: 'Financial Quick Look',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual', '"How are we doing financially?"'),
      mkNode('n2', 260, 180, 'action',         'Search Email: Financial Reports'),
      mkNode('n3', 260, 300, 'action',         'Query CRM: Outstanding Invoices'),
      mkNode('n4', 260, 420, 'action',         'Query Pipeline: Expected Revenue'),
      mkNode('n5', 260, 540, 'ai_summarize',   'Compile Financial Snapshot'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
    ],
  },

  // ── Business Process templates ───────────────────────────────────────────────
  'morning-briefing': {
    name: 'Morning Briefing',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_schedule', 'Cron: 7:00 am Daily'),
      mkNode('n2', 60,  180, 'http_request',     'Get Weather'),
      mkNode('n3', 260, 180, 'action',           'Get Today\'s Calendar'),
      mkNode('n4', 460, 180, 'action',           'Get Top 3 Urgent Emails'),
      mkNode('n5', 60,  300, 'action',           'Get Overdue Tasks'),
      mkNode('n6', 260, 300, 'action',           'Get Pipeline Summary'),
      mkNode('n7', 460, 300, 'action',           'Get Support Count'),
      mkNode('n8', 260, 420, 'merge',            'Merge All Data'),
      mkNode('n9', 260, 540, 'notification',     'Send WhatsApp Briefing'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n1', 'n3'), mkEdge('e3', 'n1', 'n4'),
      mkEdge('e4', 'n1', 'n5'), mkEdge('e5', 'n1', 'n6'), mkEdge('e6', 'n1', 'n7'),
      mkEdge('e7', 'n2', 'n8'), mkEdge('e8', 'n3', 'n8'), mkEdge('e9', 'n4', 'n8'),
      mkEdge('e10','n5', 'n8'), mkEdge('e11','n6', 'n8'), mkEdge('e12','n7', 'n8'),
      mkEdge('e13','n8', 'n9'),
    ],
  },
  'receipt-expense-entry': {
    name: 'Receipt → Expense Entry',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_app',   'Photo Received on WhatsApp'),
      mkNode('n2', 260, 180, 'ai_extract',    'OCR: Extract Amount, Vendor, Date, Category'),
      mkNode('n3', 260, 300, 'action',        'Create Expense Entry'),
      mkNode('n4', 260, 420, 'action',        'File Receipt Image'),
      mkNode('n5', 260, 540, 'notification',  'Confirm via WhatsApp'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
    ],
  },
  'multi-person-meeting-scheduler': {
    name: 'Multi-Person Meeting Scheduler',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual', '"Find a time with Thomas, Lisa and Anna"'),
      mkNode('n2', 260, 180, 'action',         'Parse Attendees + Look Up Emails in CRM'),
      mkNode('n3', 260, 300, 'action',         'Check Free/Busy for All Attendees'),
      mkNode('n4', 260, 420, 'action',         'Find Mutual Available Slots'),
      mkNode('n5', 260, 540, 'action',         'Create Event + Invites + Zoom Link'),
      mkNode('n6', 260, 660, 'notification',   'Notify Organizer'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'),
    ],
  },
  'weekly-pipeline-digest': {
    name: 'Weekly Pipeline Digest',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_schedule', 'Cron: Friday 17:00'),
      mkNode('n2', 260, 180, 'action',           'Query Deals Moved This Week'),
      mkNode('n3', 260, 300, 'action',           'New Deals Added + Deals Closed (Won/Lost)'),
      mkNode('n4', 260, 420, 'action',           'Compare to Target'),
      mkNode('n5', 260, 540, 'ai_summarize',     'Format Digest'),
      mkNode('n6', 100, 660, 'notification',     'Send to WhatsApp'),
      mkNode('n7', 420, 660, 'slack',            'Post to #sales Slack'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'), mkEdge('e6', 'n5', 'n7'),
    ],
  },
  'automated-followup-reminder': {
    name: 'Automated Follow-up Reminder',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual', '"Remind me if [contact] doesn\'t reply by [date]"'),
      mkNode('n2', 260, 180, 'delay',          'Wait Until Reminder Date'),
      mkNode('n3', 260, 300, 'action',         'Search Inbox for Reply'),
      mkNode('n4', 260, 420, 'condition',      'Reply Received?'),
      mkNode('n5', 100, 540, 'action',         'Mark as Replied in CRM'),
      mkNode('n6', 420, 540, 'ai_generate',    'Draft Follow-up Email'),
      mkNode('n7', 420, 660, 'human_approval', 'Approval to Send'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n4', 'n6'), mkEdge('e6', 'n6', 'n7'),
    ],
  },
  'new-lead-crm-research': {
    name: 'New Lead → CRM + Research + First Touch',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual', '"New lead: [Name], [Title], [Company]"'),
      mkNode('n2', 260, 180, 'action',         'Create CRM Contact + Company'),
      mkNode('n3', 260, 300, 'http_request',   'Web Search + Browse Website'),
      mkNode('n4', 260, 420, 'ai_generate',    'Draft Personalized First Email'),
      mkNode('n5', 260, 540, 'human_approval', 'Approval to Send'),
      mkNode('n6', 260, 660, 'send_email',     'Send Email + Log Activity'),
      mkNode('n7', 260, 780, 'action',         'Update CRM Record'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'), mkEdge('e6', 'n6', 'n7'),
    ],
  },
  'invoice-forwarding-steuerberater': {
    name: 'Invoice Forwarding to Steuerberater',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual', '"Send all receipts this week to the accountant"'),
      mkNode('n2', 260, 180, 'action',         'Search Email: Receipts/Invoices Last 7 Days'),
      mkNode('n3', 260, 300, 'action',         'Collect All Attachments'),
      mkNode('n4', 260, 420, 'action',         'Bundle into Single Email'),
      mkNode('n5', 260, 540, 'send_email',     'Send to Steuerberater'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
    ],
  },
  'standup-digest-slack': {
    name: 'Standup Digest (Slack)',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_schedule', 'Cron: 9:00 am Daily (Workdays)'),
      mkNode('n2', 260, 180, 'action',           'Summarize Yesterday\'s Project Slack'),
      mkNode('n3', 260, 300, 'ai_extract',       'Extract Action Items'),
      mkNode('n4', 260, 420, 'action',           'Check Task Status'),
      mkNode('n5', 260, 540, 'ai_summarize',     'Compile Standup Digest'),
      mkNode('n6', 260, 660, 'slack',            'Post to Channel'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'),
    ],
  },
  'deal-stage-change-notification': {
    name: 'Deal Stage Change → Notification Chain',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_event',  'Deal Moved to New Stage (CRM Poll)'),
      mkNode('n2', 260, 180, 'notification',   'Notify GF on WhatsApp'),
      mkNode('n3', 260, 300, 'slack',          'Post to #sales Slack'),
      mkNode('n4', 260, 420, 'condition',      'Stage = Closed Won?'),
      mkNode('n5', 100, 540, 'action',         'Create Celebration Task'),
      mkNode('n6', 420, 540, 'action',         'Create Onboarding Task'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n4', 'n6'),
    ],
  },
  'german-business-letter': {
    name: 'German Business Letter Generator',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual', '"Write an offer for [Company]"'),
      mkNode('n2', 260, 180, 'action',         'Get Company + Contact from CRM'),
      mkNode('n3', 260, 300, 'action',         'Load Template from OneDrive'),
      mkNode('n4', 260, 420, 'ai_generate',    'Fill in Details + Generate Document'),
      mkNode('n5', 260, 540, 'human_approval', 'Review Document'),
      mkNode('n6', 260, 660, 'send_email',     'Send as Email Attachment'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'),
    ],
  },
  'zoom-meeting-action-items': {
    name: 'Zoom Meeting → Action Items → Tasks',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_event',  'Zoom Recording Available'),
      mkNode('n2', 260, 180, 'action',         'Get Transcript'),
      mkNode('n3', 260, 300, 'ai_summarize',   'Summarize Key Decisions + Action Items'),
      mkNode('n4', 260, 420, 'action',         'Create Task per Person'),
      mkNode('n5', 260, 540, 'slack',          'Post Summary to Slack'),
      mkNode('n6', 260, 660, 'send_email',     'Email Summary to Participants'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'),
    ],
  },
  'overdue-task-escalation': {
    name: 'Overdue Task Escalation',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_schedule', 'Cron: Daily 10:00 am'),
      mkNode('n2', 260, 180, 'action',           'Check Tasks Overdue > 24h'),
      mkNode('n3', 260, 300, 'slack',            'DM Each Owner on Slack'),
      mkNode('n4', 260, 420, 'condition',        'Overdue > 72h?'),
      mkNode('n5', 100, 540, 'notification',     'Escalate to Manager'),
      mkNode('n6', 420, 540, 'action',           'Add to Weekly Overdue Report'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n4', 'n6'),
    ],
  },
  'travel-prep-package': {
    name: 'Travel Prep Package',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual', '"Traveling to [City] for [Company]"'),
      mkNode('n2', 260, 180, 'action',         'Get Meeting Details'),
      mkNode('n3', 60,  300, 'http_request',   'Research Company'),
      mkNode('n4', 260, 300, 'action',         'Get Attendee Bios'),
      mkNode('n5', 460, 300, 'http_request',   'Check Weather at Destination'),
      mkNode('n6', 260, 420, 'merge',          'Merge All Information'),
      mkNode('n7', 260, 540, 'ai_summarize',   'Compile Travel Brief'),
      mkNode('n8', 260, 660, 'notification',   'Send to WhatsApp'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n2', 'n4'), mkEdge('e4', 'n2', 'n5'),
      mkEdge('e5', 'n3', 'n6'), mkEdge('e6', 'n4', 'n6'),
      mkEdge('e7', 'n5', 'n6'), mkEdge('e8', 'n6', 'n7'),
      mkEdge('e9', 'n7', 'n8'),
    ],
  },
  'e-rechnung-validation': {
    name: 'E-Rechnung Validation',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_email',  'Email with .xml / ZUGFeRD Attachment'),
      mkNode('n2', 260, 180, 'action',         'Download XML Attachment'),
      mkNode('n3', 260, 300, 'ai_extract',     'Parse XRechnung Structure'),
      mkNode('n4', 260, 420, 'action',         'Validate Structure'),
      mkNode('n5', 260, 540, 'ai_extract',     'Extract Sender, Amount, Tax'),
      mkNode('n6', 260, 660, 'condition',      'Validation Failed?'),
      mkNode('n7', 100, 780, 'notification',   'Flag Invalid Invoice'),
      mkNode('n8', 420, 780, 'action',         'Log Valid Invoice'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'), mkEdge('e6', 'n6', 'n7'),
      mkEdge('e7', 'n6', 'n8'),
    ],
  },
  'crm-data-cleanup': {
    name: 'CRM Data Cleanup',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_schedule', 'Weekly / "Clean up duplicates"'),
      mkNode('n2', 260, 180, 'action',           'Find Duplicate Contacts'),
      mkNode('n3', 260, 300, 'action',           'Find Stale Contacts (>6 Months)'),
      mkNode('n4', 260, 420, 'human_approval',   'Propose Merges for Approval'),
      mkNode('n5', 260, 540, 'action',           'Merge Approved Contacts'),
      mkNode('n6', 260, 660, 'http_request',     'Enrich Remaining from Web'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'),
    ],
  },
  'new-employee-welcome': {
    name: 'New Employee Welcome Package',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual',  '"New employee: [Name], starting [Date]"'),
      mkNode('n2', 260, 180, 'action',          'Create HR Entry'),
      mkNode('n3', 260, 300, 'action',          'Build Task List (Laptop, Access, Buddy)'),
      mkNode('n4', 260, 420, 'action',          'Schedule Onboarding Meetings'),
      mkNode('n5', 260, 540, 'send_email',      'Send Welcome Email'),
      mkNode('n6', 260, 660, 'slack',           'Notify Team on Slack'),
      mkNode('n7', 260, 780, 'notification',    'Confirm Setup Complete'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'), mkEdge('e6', 'n6', 'n7'),
    ],
  },

  // ── Reporting & Analytics templates ─────────────────────────────────────────
  'weekly-executive-dashboard': {
    name: 'Weekly Executive Dashboard',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_schedule', 'Cron: Monday 7:00 am'),
      mkNode('n2', 60,  180, 'action',           'Pull Pipeline Value + Deals Closed'),
      mkNode('n3', 260, 180, 'action',           'New Leads + Support CSAT'),
      mkNode('n4', 460, 180, 'action',           'Project Status + Team Activity'),
      mkNode('n5', 260, 300, 'merge',            'Merge All Metrics'),
      mkNode('n6', 260, 420, 'ai_summarize',     'Build Executive Dashboard'),
      mkNode('n7', 100, 540, 'notification',     'Send to WhatsApp'),
      mkNode('n8', 420, 540, 'send_email',       'Send via Email'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n1', 'n3'), mkEdge('e3', 'n1', 'n4'),
      mkEdge('e4', 'n2', 'n5'), mkEdge('e5', 'n3', 'n5'), mkEdge('e6', 'n4', 'n5'),
      mkEdge('e7', 'n5', 'n6'), mkEdge('e8', 'n6', 'n7'), mkEdge('e9', 'n6', 'n8'),
    ],
  },
  'sales-rep-performance-report': {
    name: 'Sales Rep Performance Report',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_schedule', 'Cron: Friday 16:00 / On Demand'),
      mkNode('n2', 260, 180, 'action',           'For Each Rep: Emails + Calls + Meetings'),
      mkNode('n3', 260, 300, 'action',           'Deals Moved + Closed'),
      mkNode('n4', 260, 420, 'action',           'Rank by Activity + Results'),
      mkNode('n5', 260, 540, 'ai_summarize',     'Draft Report'),
      mkNode('n6', 260, 660, 'send_email',       'Send to Head of Sales'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'),
    ],
  },
  'support-volume-report': {
    name: 'Support Volume Report',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_schedule', 'Monthly / On Demand'),
      mkNode('n2', 260, 180, 'action',           'Query Tickets: Category, Priority, Resolution Time'),
      mkNode('n3', 260, 300, 'action',           'Calculate CSAT + Identify Trends'),
      mkNode('n4', 260, 420, 'action',           'Compare to Last Period'),
      mkNode('n5', 260, 540, 'ai_summarize',     'Format and Send Report'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
    ],
  },
  'deal-win-loss-analysis': {
    name: 'Deal Win/Loss Analysis',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual', '"Why did we lose deals?" or Quarterly'),
      mkNode('n2', 260, 180, 'action',         'Query Closed-Lost Deals'),
      mkNode('n3', 260, 300, 'ai_classify',    'Analyze Common Loss Reasons'),
      mkNode('n4', 260, 420, 'action',         'Pipeline Death Stages + Time in Pipeline'),
      mkNode('n5', 260, 540, 'ai_summarize',   'Compile Actionable Insights'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
    ],
  },
  'email-productivity-report': {
    name: 'Email Productivity Report',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_schedule', 'Weekly / On Demand'),
      mkNode('n2', 260, 180, 'action',           'Count Emails Sent / Received / Replied'),
      mkNode('n3', 260, 300, 'action',           'Avg Response Time'),
      mkNode('n4', 260, 420, 'action',           'Identify Unanswered Threads + High-Volume Senders'),
      mkNode('n5', 260, 540, 'ai_summarize',     'Compile Productivity Report'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
    ],
  },
  'meeting-load-analysis': {
    name: 'Meeting Load Analysis',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual', '"How many meetings did I have this week?"'),
      mkNode('n2', 260, 180, 'action',         'Count Meetings: Internal vs External'),
      mkNode('n3', 260, 300, 'action',         'Duration + Recurring vs One-off'),
      mkNode('n4', 260, 420, 'action',         'Calculate Total Hours vs Target'),
      mkNode('n5', 260, 540, 'ai_summarize',   'Suggest Optimization'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
    ],
  },

  // ── System Automation templates ──────────────────────────────────────────────
  'slack-channel-archival': {
    name: 'Slack Channel Archival',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual', '"Archive inactive Slack channels"'),
      mkNode('n2', 260, 180, 'action',         'List All Slack Channels'),
      mkNode('n3', 260, 300, 'filter_items',   'Identify Inactive (30+ Days)'),
      mkNode('n4', 260, 420, 'human_approval', 'Present List for Approval'),
      mkNode('n5', 260, 540, 'action',         'Archive Approved Channels'),
      mkNode('n6', 260, 660, 'notification',   'Notify Members of Archived Channels'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'),
    ],
  },
  'file-organization': {
    name: 'File Organization',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_manual',  '"Clean up the Downloads folder" / Weekly'),
      mkNode('n2', 260, 180, 'action',          'List Files in Target Folder'),
      mkNode('n3', 260, 300, 'ai_classify',     'Classify by Type / Date / Project'),
      mkNode('n4', 260, 420, 'action',          'Create Category Folders'),
      mkNode('n5', 260, 540, 'action',          'Move Files to Folders'),
      mkNode('n6', 260, 660, 'notification',    'Report What Was Organized'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'),
    ],
  },
  'security-audit-report': {
    name: 'Security Audit + Report',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_schedule', 'Scheduled Monthly / On Demand'),
      mkNode('n2', 260, 180, 'action',           'Run Pincer Doctor'),
      mkNode('n3', 260, 300, 'action',           'Check CRM Access Permissions'),
      mkNode('n4', 260, 420, 'action',           'Review Slack Channel Policies'),
      mkNode('n5', 260, 540, 'ai_summarize',     'Compile Security Report'),
      mkNode('n6', 260, 660, 'send_email',       'Email to IT Lead'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'),
    ],
  },
  'contact-enrichment-pipeline': {
    name: 'Contact Enrichment Pipeline',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_schedule', '"Update all contacts at [Company]" / Monthly'),
      mkNode('n2', 260, 180, 'action',           'Get Company Contacts from CRM'),
      mkNode('n3', 260, 300, 'loop',             'For Each Contact'),
      mkNode('n4', 260, 420, 'http_request',     'Web Search: Current Role / Company'),
      mkNode('n5', 260, 540, 'action',           'Update CRM Contact'),
      mkNode('n6', 260, 660, 'filter_items',     'Flag Contacts Who\'ve Left'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'),
    ],
  },
  'zoom-recording-meeting-notes': {
    name: 'Zoom Recording → Meeting Notes → Team Update',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_event',  'New Zoom Recording Available'),
      mkNode('n2', 260, 180, 'action',         'Download Transcript'),
      mkNode('n3', 260, 300, 'ai_summarize',   'Structured Notes: Decisions, Actions, Questions'),
      mkNode('n4', 260, 420, 'action',         'Create Meeting Notes Document'),
      mkNode('n5', 260, 540, 'send_email',     'Share with Attendees'),
      mkNode('n6', 260, 660, 'slack',          'Post Summary to Slack'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n2', 'n3'),
      mkEdge('e3', 'n3', 'n4'), mkEdge('e4', 'n4', 'n5'),
      mkEdge('e5', 'n5', 'n6'),
    ],
  },
  'end-of-day-wrapup': {
    name: 'End-of-Day Wrap-up',
    nodes: [
      mkNode('n1', 260, 60,  'trigger_schedule', 'Cron: 18:00 Daily / "Feierabend"'),
      mkNode('n2', 60,  180, 'action',           'Summarize Emails Sent/Received'),
      mkNode('n3', 260, 180, 'action',           'Summarize Meetings + Tasks'),
      mkNode('n4', 460, 180, 'action',           'List Deals Moved Today'),
      mkNode('n5', 260, 300, 'merge',            'Merge All Activity'),
      mkNode('n6', 260, 420, 'ai_summarize',     'List Open Items for Tomorrow'),
      mkNode('n7', 260, 540, 'ai_generate',      'Draft Priority List'),
      mkNode('n8', 260, 660, 'notification',     'Send WhatsApp Summary'),
    ],
    edges: [
      mkEdge('e1', 'n1', 'n2'), mkEdge('e2', 'n1', 'n3'), mkEdge('e3', 'n1', 'n4'),
      mkEdge('e4', 'n2', 'n5'), mkEdge('e5', 'n3', 'n5'), mkEdge('e6', 'n4', 'n5'),
      mkEdge('e7', 'n5', 'n6'), mkEdge('e8', 'n6', 'n7'), mkEdge('e9', 'n7', 'n8'),
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

  // Tool config modal state
  const [configModal, setConfigModal] = useState<{ nodeId: string; integrationKey: string; enabledTools: string[] } | null>(null);

  const { push, undo, redo, canUndo, canRedo } = useHistory(nodes, edges, setNodes as any, setEdges as any);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const importRef = useRef<HTMLInputElement>(null);

  const selectedNode = nodes.find(n => n.id === selectedId) ?? null;

  // Open integration config modal
  const openConfig = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    if (!node || node.type !== 'integrationNode') return;
    const data = node.data as NodeData;
    const svc = INTEGRATION_CATALOG[data.integrationKey ?? ''];
    if (!svc) return;
    const enabledTools = (data.enabledTools as string[] | undefined) ?? svc.tools.map(t => t.name);
    setConfigModal({ nodeId, integrationKey: data.integrationKey!, enabledTools });
  }, [nodes]);

  const handleSaveToolConfig = useCallback((nodeId: string, enabled: string[]) => {
    setNodes(prev => prev.map(n =>
      n.id === nodeId ? { ...n, data: { ...n.data, enabledTools: enabled } } : n
    ));
  }, [setNodes]);

  // ── Filtered categories for palette ──
  const filteredByCategory = Object.entries(CATEGORIES).reduce<Record<string, string[]>>((acc, [catKey]) => {
    const types = Object.entries(NODE_CONFIG)
      .filter(([, v]) => v.category === catKey)
      .filter(([, v]) => !search || v.label.toLowerCase().includes(search.toLowerCase()) || v.desc.toLowerCase().includes(search.toLowerCase()))
      .map(([k]) => k);
    acc[catKey] = types;
    return acc;
  }, {});

  // Remove 'integrations' from regular category list (we have a dedicated section)
  const regularCategories = Object.entries(CATEGORIES).filter(([k]) => k !== 'integrations');

  // ── Connections ──
  const onConnect = useCallback(
    (params: Connection) => {
      // Determine edge label from sourceHandle
      let edgeLabel: string | undefined;
      if (params.sourceHandle === 'true') {
        edgeLabel = 'True';
      } else if (params.sourceHandle === 'false') {
        edgeLabel = 'False';
      } else if (params.sourceHandle?.startsWith('branch-')) {
        const sourceNode = nodes.find(n => n.id === params.source);
        if (sourceNode) {
          const nd = sourceNode.data as NodeData;
          const branchList = nd.branches ?? ['Case 1', 'Case 2', 'Default'];
          const idx = parseInt(params.sourceHandle.replace('branch-', ''), 10);
          edgeLabel = branchList[idx];
        }
      }

      const edge = {
        ...params,
        animated: true,
        style: { stroke: '#cbd5e1', strokeWidth: 1.5 },
        ...(edgeLabel && {
          label: edgeLabel,
          labelStyle: { fontSize: 10, fontWeight: 700, fill: '#374151' },
          labelBgStyle: { fill: 'white', fillOpacity: 0.95 },
          labelBgPadding: [4, 6] as [number, number],
          labelBgBorderRadius: 4,
        }),
      };
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

      // Check for integration drop
      const integrationKey = e.dataTransfer.getData('application/reactflow-integration');
      if (integrationKey) {
        const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
        const svc = INTEGRATION_CATALOG[integrationKey];
        const newNode: Node = {
          id: `node-${++nodeCounter}`,
          type: 'integrationNode',
          position,
          data: {
            nodeType: 'integration',
            label: svc?.service ?? integrationKey,
            integrationKey,
            enabledTools: svc?.tools.map(t => t.name) ?? [],
          } as NodeData,
        };
        setNodes(prev => {
          const next = [...prev, newNode];
          push(next, edges);
          return next;
        });
        return;
      }

      // Regular node drop
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
      const nodeData = node.data as NodeData;
      const cfg = NODE_CONFIG[nodeData.nodeType] ?? NODE_CONFIG.action;
      const label = nodeData.label || cfg.label;

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
    <IntegrationConfigCtx.Provider value={{ openConfig }}>
      <ExecCtx.Provider value={execStatus}>
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex flex-1 overflow-hidden">
            {/* ── Left panel: node palette ── */}
            <div className="w-56 flex-shrink-0 border-r border-[#141413]/8 bg-white flex flex-col overflow-hidden">
              <div className="px-3 pt-3 pb-2.5 border-b border-[#141413]/8">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#30302e]/35" />
                  <Input
                    className="h-8 pl-8 text-xs bg-[#e8e6dc] border-[#141413]/10 text-[#141413] focus-visible:ring-1 focus-visible:ring-[#141413]/20 rounded-lg placeholder:text-[#30302e]/30"
                    placeholder="Search nodes…"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-2">
                {regularCategories.map(([catKey]) => (
                  <CategorySection
                    key={catKey}
                    catKey={catKey}
                    types={filteredByCategory[catKey] ?? []}
                    defaultOpen={catKey === 'triggers' || catKey === 'flow' || catKey === 'core'}
                  />
                ))}
                <IntegrationPalettePanel search={search} />
                {Object.values(filteredByCategory).every(a => a.length === 0) && !search && (
                  <p className="text-xs text-[#30302e]/45 text-center py-6">No nodes found</p>
                )}
              </div>

              <div className="px-3 py-3 border-t border-[#141413]/8">
                <p className="text-[9px] text-[#30302e]/30 leading-relaxed tracking-wide uppercase font-medium">
                  Drag nodes onto the canvas
                </p>
              </div>
            </div>

            {/* ── Canvas ── */}
            <div className="flex-1 relative bg-gray-50/30" onDrop={onDrop} onDragOver={onDragOver}>
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
                defaultEdgeOptions={{ animated: true, style: { stroke: '#d1d5db', strokeWidth: 1.5 } }}
                deleteKeyCode="Delete"
                proOptions={{ hideAttribution: true }}
              >
                <Background variant={BackgroundVariant.Dots} gap={20} size={1.5} color="#c9cdd4" />

                {/* Hidden import input */}
                <input ref={importRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />

                <Controls
                  className="!shadow-sm !border !border-gray-100 !rounded-xl overflow-hidden !bg-white"
                  showInteractive={false}
                />
                {showMiniMap && (
                  <MiniMap
                    nodeColor={n => {
                      if (n.type === 'integrationNode') {
                        return INTEGRATION_STYLE[(n.data as NodeData)?.integrationKey ?? '']?.miniColor ?? '#0d9488';
                      }
                      return NODE_CONFIG[(n.data as NodeData)?.nodeType]?.miniColor ?? '#94a3b8';
                    }}
                    className="!shadow-sm !border !border-gray-100 !rounded-xl !bg-white"
                    pannable
                    zoomable
                  />
                )}
              </ReactFlow>
            </div>

            {/* ── Right side: vertical toolbar + optional properties panel ── */}
            <div className="flex flex-row flex-shrink-0">
              {/* Vertical toolbar */}
              <div className="flex flex-col items-center gap-0.5 bg-white border-l border-gray-100 px-1.5 py-3">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-300 hover:text-gray-800 hover:bg-gray-50 transition-colors" title="Undo (⌘Z)" onClick={undo} disabled={!canUndo}>
                  <Undo2 className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-300 hover:text-gray-800 hover:bg-gray-50 transition-colors" title="Redo (⌘Y)" onClick={redo} disabled={!canRedo}>
                  <Redo2 className="h-3.5 w-3.5" />
                </Button>

                <div className="h-px w-4 bg-gray-100 my-1.5" />

                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-300 hover:text-gray-800 hover:bg-gray-50 transition-colors" title="Fit view (⌘F)" onClick={handleFitView}>
                  <Maximize2 className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 hover:bg-gray-50 transition-colors ${showMiniMap ? 'text-gray-900' : 'text-gray-300 hover:text-gray-800'}`}
                  title="Toggle minimap"
                  onClick={() => setShowMiniMap(v => !v)}
                >
                  <Map className="h-3.5 w-3.5" />
                </Button>

                <div className="h-px w-4 bg-gray-100 my-1.5" />

                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-300 hover:text-gray-800 hover:bg-gray-50 transition-colors" title="Auto layout (⌘L)" onClick={handleAutoLayout}>
                  <LayoutGrid className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-300 hover:text-gray-800 hover:bg-gray-50 transition-colors" title="Add sticky note" onClick={handleAddNote}>
                  <StickyNote className="h-3.5 w-3.5" />
                </Button>

                <div className="h-px w-4 bg-gray-100 my-1.5" />

                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-300 hover:text-gray-800 hover:bg-gray-50 transition-colors" title="Export JSON (⌘E)" onClick={handleExportJSON}>
                  <Download className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-300 hover:text-gray-800 hover:bg-gray-50 transition-colors" title="Import JSON" onClick={() => importRef.current?.click()}>
                  <Upload className="h-3.5 w-3.5" />
                </Button>

                <div className="h-px w-4 bg-gray-100 my-1.5" />

                <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors" title="Clear canvas" onClick={handleClearCanvas}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>

                <div className="h-px w-4 bg-gray-100 my-1.5" />

                <Button
                  size="sm"
                  className={`h-7 w-7 p-0 ${running ? 'bg-amber-500 hover:bg-amber-600' : 'bg-gray-900 hover:bg-gray-800'} text-white rounded-lg transition-colors`}
                  onClick={runWorkflow}
                  disabled={running}
                  title={running ? 'Running…' : 'Test Run'}
                >
                  {running ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                </Button>
                {showLog && (
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-gray-400 hover:text-gray-700" title="Hide output" onClick={() => setShowLog(false)}>
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>

              {/* Properties panel when a node is selected */}
              {selectedNode && (
                <PropertiesPanel
                  node={selectedNode}
                  onChange={updateNode}
                  onClose={() => setSelectedId(null)}
                  onDelete={deleteNode}
                  onDuplicate={duplicateNode}
                  onOpenConfig={openConfig}
                />
              )}
            </div>
          </div>

          {/* ── Execution log ── */}
          {showLog && (
            <ExecutionLog log={log} onClear={() => setLog([])} />
          )}
        </div>

        {/* ── Tool Config Modal ── */}
        {configModal && (
          <ToolConfigModal
            open={!!configModal}
            nodeId={configModal.nodeId}
            integrationKey={configModal.integrationKey}
            enabledTools={configModal.enabledTools}
            onClose={() => setConfigModal(null)}
            onSave={handleSaveToolConfig}
          />
        )}
      </ExecCtx.Provider>
    </IntegrationConfigCtx.Provider>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const CreateWorkflow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const templateId = (location.state as { templateId?: string } | null)?.templateId;
  const tpl = templateId ? WORKFLOW_TEMPLATES[templateId] : undefined;

  const [name, setName] = useState(tpl?.name ?? '');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') { navigate('/login'); return; }
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
            <main className="flex-1 flex flex-col overflow-hidden">
              {/* Top bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 bg-white flex-shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors rounded-lg"
                  onClick={() => navigate('/workflows')}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>

                <div className="w-px h-5 bg-gray-100 mx-1" />

                <Input
                  placeholder="Untitled Workflow"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="max-w-[240px] text-sm font-semibold text-gray-900 border-0 bg-transparent shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-300 px-1 h-8"
                />

                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors border border-gray-100 rounded-lg px-3"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    <Save className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                    Save Draft
                  </Button>

                  <Button
                    size="sm"
                    className="h-8 text-xs bg-gray-900 hover:bg-gray-800 text-white rounded-lg px-4 font-medium transition-colors"
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
