
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import {
  ChevronLeft, ChevronRight, ChevronDown, Bot, Settings, Activity, Clock, Zap,
  TrendingUp, CheckCircle, AlertCircle, DollarSign, Target, BarChart2,
  Network, Search, Filter, ArrowUpDown, MoreHorizontal, Eye, FileText,
  XCircle, MessageSquare, RefreshCw, CheckSquare, Users, Sparkles, Plus,
  Pencil, Tag, BookOpen, Star, Shield, Code, Brain, Globe, Mail, FileBarChart,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

/* ─── Default assistant data ─── */
const DEFAULT_ASSISTANTS = [
  { id: 1, name: 'Aria',  type: 'Sales',     department: 'Sales',      conversations: 89,  status: 'Active' },
  { id: 2, name: 'Atlas', type: 'Support',   department: 'Operations', conversations: 145, status: 'Active' },
  { id: 3, name: 'Felix', type: 'Finance',   department: 'Finance',    conversations: 34,  status: 'Idle'   },
  { id: 4, name: 'Maya',  type: 'Marketing', department: 'Marketing',  conversations: 67,  status: 'Active' },
];

/* ─── Task data per assistant ─── */
type TaskStatus = 'Completed' | 'In Progress' | 'Failed' | 'Pending';

type AssistantTask = {
  id: number; title: string; assignedBy: string; status: TaskStatus;
  priority: 'High' | 'Medium' | 'Low'; category: string;
  createdAt: string; duration?: string; notes?: string;
};

const ASSISTANT_TASKS: Record<number, AssistantTask[]> = {
  1: [
    { id: 1, title: 'Qualify 12 inbound leads from CRM',           assignedBy: 'Sarah Johnson', status: 'Completed',   priority: 'High',   category: 'Lead Qualification', createdAt: '2026-04-12', duration: '3m 42s', notes: 'All leads scored and pushed to pipeline.' },
    { id: 2, title: 'Send follow-up emails to Q1 pipeline',        assignedBy: 'Sarah Johnson', status: 'Completed',   priority: 'Medium', category: 'Outreach',           createdAt: '2026-04-11', duration: '1m 55s' },
    { id: 3, title: 'Generate pipeline forecast report',           assignedBy: 'Sarah Johnson', status: 'In Progress', priority: 'High',   category: 'Reporting',          createdAt: '2026-04-12', notes: 'Compiling data from CRM and email sources.' },
    { id: 4, title: 'Update lead scoring model inputs',            assignedBy: 'James Wilson',  status: 'Completed',   priority: 'Low',    category: 'Data Hygiene',       createdAt: '2026-04-10', duration: '2m 03s' },
    { id: 5, title: 'Draft cold outreach templates for Q2',        assignedBy: 'Sarah Johnson', status: 'Pending',     priority: 'Medium', category: 'Content',            createdAt: '2026-04-12' },
    { id: 6, title: 'Analyse competitor pricing from scraped data', assignedBy: 'James Wilson',  status: 'Completed',   priority: 'High',   category: 'Research',           createdAt: '2026-04-09', duration: '4m 18s' },
  ],
  2: [
    { id: 1, title: 'Process 14 VIP support tickets',              assignedBy: 'David Kim',      status: 'In Progress', priority: 'High',   category: 'Support',      createdAt: '2026-04-12' },
    { id: 2, title: 'Generate weekly support digest',              assignedBy: 'James Wilson',   status: 'Completed',   priority: 'Medium', category: 'Reporting',    createdAt: '2026-04-11', duration: '1m 47s' },
    { id: 3, title: 'Monitor CI/CD pipeline anomalies',            assignedBy: 'David Kim',      status: 'Completed',   priority: 'High',   category: 'DevOps',       createdAt: '2026-04-10', duration: '0m 22s' },
    { id: 4, title: 'Escalate at-risk account #CS-902',            assignedBy: 'James Wilson',   status: 'Failed',      priority: 'High',   category: 'Escalation',   createdAt: '2026-04-11', duration: '0m 44s', notes: 'Contact details were outdated.' },
    { id: 5, title: 'Generate weekly infrastructure health report', assignedBy: 'David Kim',      status: 'Completed',   priority: 'Medium', category: 'Reporting',    createdAt: '2026-04-10', duration: '2m 30s' },
    { id: 6, title: 'Triage on-call alert batch #38',              assignedBy: 'Ryan Kowalski',  status: 'In Progress', priority: 'High',   category: 'On-Call',      createdAt: '2026-04-12' },
    { id: 7, title: 'Send NPS survey follow-up batch',             assignedBy: 'James Wilson',   status: 'Pending',     priority: 'Low',    category: 'Outreach',     createdAt: '2026-04-12' },
  ],
  3: [
    { id: 1, title: 'Reconcile March invoices',                    assignedBy: 'Priya Patel',   status: 'In Progress', priority: 'High',   category: 'Finance',   createdAt: '2026-04-12' },
    { id: 2, title: 'Prepare Q1 expense report',                   assignedBy: 'Priya Patel',   status: 'Completed',   priority: 'High',   category: 'Finance',   createdAt: '2026-04-10', duration: '5m 30s' },
    { id: 3, title: 'Flag duplicate invoice #INV-4471',            assignedBy: 'Priya Patel',   status: 'Completed',   priority: 'Medium', category: 'Audit',     createdAt: '2026-04-09', duration: '0m 48s' },
    { id: 4, title: 'Generate budget variance summary',            assignedBy: 'Priya Patel',   status: 'Pending',     priority: 'Low',    category: 'Reporting', createdAt: '2026-04-12' },
  ],
  4: [
    { id: 1, title: 'Generate April social media content brief',   assignedBy: 'Michael Chen',  status: 'Completed',   priority: 'High',   category: 'Content',   createdAt: '2026-04-11', duration: '2m 18s' },
    { id: 2, title: 'Analyse Q1 campaign performance data',        assignedBy: 'Michael Chen',  status: 'Completed',   priority: 'Medium', category: 'Analytics', createdAt: '2026-04-10', duration: '4m 10s' },
    { id: 3, title: 'Draft email newsletter for product launch',   assignedBy: 'Michael Chen',  status: 'In Progress', priority: 'High',   category: 'Content',   createdAt: '2026-04-12' },
    { id: 4, title: 'Compile competitor ad spend summary',         assignedBy: 'Michael Chen',  status: 'Pending',     priority: 'Low',    category: 'Research',  createdAt: '2026-04-12' },
    { id: 5, title: 'Create design request brief for landing page',assignedBy: 'Tomás Reyes',   status: 'Completed',   priority: 'Medium', category: 'Design',    createdAt: '2026-04-10', duration: '1m 20s' },
  ],
};

/* ─── Activity data per assistant ─── */
const ASSISTANT_ACTIVITY: Record<number, Array<{
  id: number; type: 'task_completed' | 'task_failed' | 'message' | 'assignment' | 'escalation';
  employee: string; text: string; time: string;
}>> = {
  1: [
    { id: 1, type: 'task_completed', employee: 'Sarah Johnson', text: 'Completed lead qualification batch (12 leads scored)',   time: '12m ago'   },
    { id: 2, type: 'message',        employee: 'James Wilson',  text: 'Sent escalation summary for deal #4472 to inbox',         time: '1h ago'    },
    { id: 3, type: 'task_completed', employee: 'Sarah Johnson', text: 'Follow-up emails sent to 9 contacts in Q1 pipeline',     time: '3h ago'    },
    { id: 4, type: 'assignment',     employee: 'Sarah Johnson', text: 'New task assigned: Generate pipeline forecast report',     time: '4h ago'    },
    { id: 5, type: 'task_completed', employee: 'James Wilson',  text: 'Lead scoring model inputs updated successfully',          time: 'Yesterday' },
  ],
  2: [
    { id: 1, type: 'escalation',     employee: 'David Kim',     text: 'On-call alert batch #38 triaged — 2 high priority',      time: '9m ago'  },
    { id: 2, type: 'task_completed', employee: 'James Wilson',  text: 'Weekly support digest sent to CS team',                   time: '3h ago'  },
    { id: 3, type: 'task_failed',    employee: 'James Wilson',  text: 'Failed to escalate account #CS-902 — stale contact',     time: '1d ago'  },
    { id: 4, type: 'task_completed', employee: 'David Kim',     text: 'Weekly infrastructure health report generated',           time: '1d ago'  },
    { id: 5, type: 'message',        employee: 'Ryan Kowalski', text: 'Incident post-mortem draft for April 10 outage ready',    time: '1d ago'  },
    { id: 6, type: 'assignment',     employee: 'Ryan Kowalski', text: 'Runbook update task queued for memory-leak scenario',     time: '2d ago'  },
  ],
  3: [
    { id: 1, type: 'task_completed', employee: 'Priya Patel', text: 'Duplicate invoice #INV-4471 flagged and sent for review', time: '31m ago' },
    { id: 2, type: 'task_completed', employee: 'Priya Patel', text: 'Q1 expense report completed and filed',                  time: '2d ago'  },
    { id: 3, type: 'message',        employee: 'Priya Patel', text: 'Budget variance summary draft available for review',      time: '3d ago'  },
  ],
  4: [
    { id: 1, type: 'task_completed', employee: 'Michael Chen', text: 'April social media content brief delivered',               time: '5m ago'    },
    { id: 2, type: 'task_completed', employee: 'Michael Chen', text: 'Q1 campaign performance analysis ready for review',        time: '2h ago'    },
    { id: 3, type: 'assignment',     employee: 'Michael Chen', text: 'Started drafting April product launch newsletter',          time: '3h ago'    },
    { id: 4, type: 'task_completed', employee: 'Tomás Reyes',  text: 'Landing page design brief delivered to Figma workspace',   time: '2d ago'    },
    { id: 5, type: 'message',        employee: 'Michael Chen', text: 'Shared competitor ad spend summary (draft) in workspace',  time: 'Yesterday' },
  ],
};

/* ─── Connected employees per assistant ─── */
const ASSISTANT_EMPLOYEES: Record<number, Array<{
  id: number; name: string; role: string; department: string; status: 'Active' | 'Remote' | 'On Leave';
  activeTasks: number; completedTasks: number; lastInteraction: string;
}>> = {
  1: [
    { id: 1,  name: 'Sarah Johnson', role: 'Sales Manager',        department: 'Sales',            status: 'Active', activeTasks: 2, completedTasks: 38, lastInteraction: '12m ago'  },
    { id: 6,  name: 'James Wilson',  role: 'Customer Success Mgr', department: 'Customer Success', status: 'Remote', activeTasks: 1, completedTasks: 15, lastInteraction: '4h ago'   },
  ],
  2: [
    { id: 4,  name: 'David Kim',      role: 'DevOps Engineer',      department: 'Engineering',      status: 'Active', activeTasks: 3, completedTasks: 51, lastInteraction: '18m ago' },
    { id: 6,  name: 'James Wilson',   role: 'Customer Success Mgr', department: 'Customer Success', status: 'Remote', activeTasks: 2, completedTasks: 89, lastInteraction: '3h ago'  },
    { id: 10, name: 'Ryan Kowalski',  role: 'Senior Engineer',      department: 'Engineering',      status: 'Active', activeTasks: 1, completedTasks: 63, lastInteraction: '9m ago'  },
  ],
  3: [
    { id: 5,  name: 'Priya Patel', role: 'Finance Analyst', department: 'Finance', status: 'Active', activeTasks: 2, completedTasks: 44, lastInteraction: '31m ago' },
  ],
  4: [
    { id: 2,  name: 'Michael Chen', role: 'Marketing Lead',   department: 'Marketing', status: 'Active', activeTasks: 3, completedTasks: 27, lastInteraction: '5m ago' },
    { id: 8,  name: 'Tomás Reyes',  role: 'Product Designer', department: 'Design',    status: 'Active', activeTasks: 1, completedTasks: 8,  lastInteraction: '1h ago' },
  ],
};

/* ─── Skills data per assistant ─── */
type SkillKind = 'Core' | 'Custom';
type SkillCategory = 'Communication' | 'Analysis' | 'Automation' | 'Research' | 'Content' | 'Data' | 'Integration';

type AssistantSkill = {
  id: number; name: string; description: string; category: SkillCategory;
  kind: SkillKind; enabled: boolean; lastUsed?: string;
};

const SKILL_CATEGORY_META: Record<SkillCategory, { icon: React.ElementType; color: string; bg: string }> = {
  Communication: { icon: Mail,          color: 'text-blue-600',   bg: 'bg-blue-100'   },
  Analysis:      { icon: FileBarChart,  color: 'text-purple-600', bg: 'bg-purple-100' },
  Automation:    { icon: Zap,           color: 'text-amber-600',  bg: 'bg-amber-100'  },
  Research:      { icon: Globe,         color: 'text-cyan-600',   bg: 'bg-cyan-100'   },
  Content:       { icon: BookOpen,      color: 'text-pink-600',   bg: 'bg-pink-100'   },
  Data:          { icon: Code,          color: 'text-green-600',  bg: 'bg-green-100'  },
  Integration:   { icon: Network,       color: 'text-orange-600', bg: 'bg-orange-100' },
};

const ASSISTANT_SKILLS: Record<number, AssistantSkill[]> = {
  1: [
    { id: 1, name: 'Lead Qualification',   description: 'Score and qualify inbound leads using CRM data, engagement history, and firmographic signals.',          category: 'Analysis',      kind: 'Core',   enabled: true, lastUsed: '12m ago'  },
    { id: 2, name: 'Email Outreach',       description: 'Draft and send personalised follow-up emails to prospects based on pipeline stage and activity.',          category: 'Communication', kind: 'Core',   enabled: true, lastUsed: '3h ago'   },
  ],
  2: [
    { id: 1, name: 'Ticket Triage',       description: 'Classify, prioritise, and route incoming support tickets based on content analysis and SLA rules.',         category: 'Automation',    kind: 'Core',   enabled: true, lastUsed: '9m ago'   },
    { id: 2, name: 'Incident Monitoring',  description: 'Watch CI/CD pipelines and infrastructure metrics for anomalies and alert on-call teams.',                   category: 'Automation',    kind: 'Core',   enabled: true, lastUsed: '1h ago'   },
    { id: 3, name: 'Report Generation',   description: 'Produce weekly digests summarising support volume, resolution times, and escalation trends.',                category: 'Content',       kind: 'Core',   enabled: true, lastUsed: '3h ago'   },
  ],
  3: [
    { id: 1, name: 'Invoice Reconciliation', description: 'Match invoices against purchase orders and flag discrepancies for human review.',                         category: 'Data',          kind: 'Core',   enabled: true, lastUsed: '31m ago' },
  ],
  4: [
    { id: 1, name: 'Content Brief Generation', description: 'Create structured content briefs for social media, blog, and email campaigns.',                         category: 'Content',       kind: 'Core',   enabled: true, lastUsed: '5m ago'    },
    { id: 2, name: 'Campaign Analytics',       description: 'Pull performance data from ad platforms and generate trend analysis with recommendations.',              category: 'Analysis',      kind: 'Core',   enabled: true, lastUsed: '2h ago'    },
  ],
};

/* ─── Skills catalog (available for all assistants to add) ─── */
const SKILLS_CATALOG: AssistantSkill[] = [
  { id: 100, name: 'Slack Notifications',     description: 'Send contextual notifications and summaries to configured Slack channels.',                category: 'Integration',   kind: 'Custom', enabled: true },
  { id: 101, name: 'Document Summarisation',   description: 'Summarise long documents, PDFs, and meeting transcripts into actionable bullet points.',  category: 'Content',       kind: 'Custom', enabled: true },
  { id: 102, name: 'Data Extraction',          description: 'Extract structured data from unstructured sources like emails, PDFs, and web pages.',     category: 'Data',          kind: 'Custom', enabled: true },
  { id: 103, name: 'Sentiment Analysis',       description: 'Analyse customer feedback and communications for sentiment and key themes.',               category: 'Analysis',      kind: 'Custom', enabled: true },
  { id: 104, name: 'Calendar Management',      description: 'Schedule, reschedule, and manage meetings based on participant availability.',             category: 'Automation',    kind: 'Custom', enabled: true },
  { id: 105, name: 'Knowledge Base Search',    description: 'Search and retrieve relevant articles from internal knowledge bases and wikis.',           category: 'Research',      kind: 'Custom', enabled: true },
  { id: 106, name: 'Webhook Triggers',         description: 'Trigger external workflows and APIs based on task events and conditions.',                 category: 'Integration',   kind: 'Custom', enabled: true },
  { id: 107, name: 'Translation',              description: 'Translate messages and documents between supported languages while preserving tone.',      category: 'Communication', kind: 'Custom', enabled: true },
];

const ACTIVITY_ICON_MAP: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  task_completed: { icon: CheckCircle,   color: 'text-green-600', bg: 'from-green-100 to-emerald-100' },
  task_failed:    { icon: XCircle,       color: 'text-red-600',   bg: 'from-red-100 to-pink-100'      },
  message:        { icon: MessageSquare, color: 'text-blue-600',  bg: 'from-blue-100 to-cyan-100'     },
  assignment:     { icon: Zap,           color: 'text-amber-600', bg: 'from-amber-100 to-yellow-100'  },
  escalation:     { icon: AlertCircle,   color: 'text-orange-600',bg: 'from-orange-100 to-amber-100'  },
};

const TASK_STATUS_STYLE: Record<TaskStatus, string> = {
  Completed:     'bg-green-100 text-green-700 border-green-200',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
  Failed:        'bg-red-100 text-red-700 border-red-200',
  Pending:       'bg-gray-100 text-gray-500 border-gray-200',
};

const PRIORITY_STYLE: Record<string, string> = {
  High:   'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Low:    'bg-green-100 text-green-700 border-green-200',
};

const STATUS_BADGE: Record<string, string> = {
  Active: 'bg-green-100 text-green-700 border-green-200',
  Idle:   'bg-amber-100 text-amber-700 border-amber-200',
};

const EMPLOYEE_STATUS_BADGE: Record<string, string> = {
  Active:     'bg-green-100 text-green-700 border-green-200',
  Remote:     'bg-blue-100 text-blue-700 border-blue-200',
  'On Leave': 'bg-amber-100 text-amber-700 border-amber-200',
};

type ProfileTab = 'overview' | 'employees' | 'tasks' | 'skills' | 'activity';

const PROFILE_TABS: { key: ProfileTab; label: string; icon: React.ElementType }[] = [
  { key: 'overview',   label: 'Overview',   icon: BarChart2   },
  { key: 'employees',  label: 'Employees',  icon: Users       },
  { key: 'tasks',      label: 'Tasks',      icon: CheckSquare },
  { key: 'skills',     label: 'Skills',     icon: Sparkles    },
  { key: 'activity',   label: 'Activity',   icon: Activity    },
];

const TASK_STATUSES  = ['All', 'Completed', 'In Progress', 'Pending', 'Failed'];
const TASK_PRIORITIES = ['All', 'High', 'Medium', 'Low'];

/* ─── Tasks table sub-component ─── */
const AssistantTasksTable = ({ tasks }: { tasks: AssistantTask[] }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortField, setSortField] = useState<keyof AssistantTask>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filtered = tasks
    .filter(t => {
      const q = search.toLowerCase();
      const matchSearch = !q || t.title.toLowerCase().includes(q) || t.assignedBy.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
      const matchStatus = statusFilter === 'All' || t.status === statusFilter;
      const matchPri    = priorityFilter === 'All' || t.priority === priorityFilter;
      return matchSearch && matchStatus && matchPri;
    })
    .sort((a, b) => {
      const av = String(a[sortField] ?? '').toLowerCase();
      const bv = String(b[sortField] ?? '').toLowerCase();
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (field: keyof AssistantTask) => {
    if (sortField === field) setSortAsc(a => !a);
    else { setSortField(field); setSortAsc(true); }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: keyof AssistantTask }) => (
    <ArrowUpDown className={cn('h-3 w-3 ml-1 inline', sortField === field ? 'text-gray-900' : 'text-gray-400')} />
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 bg-white border-gray-200"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[110px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-gray-400" />
                {statusFilter === 'All' ? 'Status' : statusFilter}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {TASK_STATUSES.map(s => (
              <DropdownMenuItem key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={cn(statusFilter === s && 'font-medium')}>
                {s === 'All' ? 'All Statuses' : s}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[110px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-gray-400" />
                {priorityFilter === 'All' ? 'Priority' : priorityFilter}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {TASK_PRIORITIES.map(p => (
              <DropdownMenuItem key={p} onClick={() => { setPriorityFilter(p); setPage(1); }} className={cn(priorityFilter === p && 'font-medium')}>
                {p === 'All' ? 'All Priorities' : p}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <Card className="bg-white border-gray-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('title')}>
                  Task <SortIcon field="title" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('status')}>
                  Status <SortIcon field="status" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('priority')}>
                  Priority <SortIcon field="priority" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('category')}>
                  Category <SortIcon field="category" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('assignedBy')}>
                  Assigned By <SortIcon field="assignedBy" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Duration</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden lg:table-cell" onClick={() => toggleSort('createdAt')}>
                  Date <SortIcon field="createdAt" />
                </th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No tasks match your filters.
                  </td>
                </tr>
              ) : (
                paged.map(task => (
                  <tr key={task.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 truncate">{task.title}</p>
                        {task.notes && <p className="text-xs text-gray-500 truncate">{task.notes}</p>}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', TASK_STATUS_STYLE[task.status])}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', PRIORITY_STYLE[task.priority])}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{task.category}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="flex items-center gap-1.5 text-gray-600 text-xs">
                        <Users className="h-3.5 w-3.5 text-gray-400" />
                        {task.assignedBy}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">{task.duration ?? '—'}</td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        {task.createdAt}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <FileText className="h-4 w-4 mr-2" />Export
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between gap-3 flex-wrap text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>
              {filtered.length > 0
                ? `Showing ${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filtered.length)} of ${filtered.length} tasks`
                : '0 tasks'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">Rows:</span>
              <select
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="h-6 rounded border border-gray-200 bg-white text-gray-700 text-xs px-1 focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer"
              >
                {[5, 10, 15].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(statusFilter !== 'All' || priorityFilter !== 'All' || search) && (
              <button
                className="text-gray-500 hover:text-gray-900 underline underline-offset-2"
                onClick={() => { setSearch(''); setStatusFilter('All'); setPriorityFilter('All'); setPage(1); }}
              >
                Clear filters
              </button>
            )}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-7 w-7 !border-gray-200 hover:!bg-gray-100 hover:!text-gray-700" disabled={safePage === 1} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Button key={p} variant={p === safePage ? 'default' : 'outline'} size="icon" className={cn('h-7 w-7 text-xs', p !== safePage && '!border-gray-200 text-gray-600 hover:!bg-gray-100 hover:!text-gray-700')} onClick={() => setPage(p)}>
                    {p}
                  </Button>
                ))}
                <Button variant="outline" size="icon" className="h-7 w-7 !border-gray-200 hover:!bg-gray-100 hover:!text-gray-700" disabled={safePage === totalPages} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

/* ─── Skills panel sub-component ─── */
const SKILL_STATUS_STYLE: Record<string, string> = {
  Enabled:  'bg-green-100 text-green-700 border-green-200',
  Disabled: 'bg-gray-100 text-gray-500 border-gray-200',
};

const AssistantSkillsPanel = ({ assistantId }: { assistantId: number }) => {
  const [skills, setSkills] = useState<AssistantSkill[]>(ASSISTANT_SKILLS[assistantId] ?? []);
  const [filterKind, setFilterKind] = useState<'All' | SkillKind>('All');
  const [filterCategory, setFilterCategory] = useState<'All' | SkillCategory>('All');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Enabled' | 'Disabled'>('All');
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'name' | 'category' | 'kind' | 'lastUsed'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [addTab, setAddTab] = useState<'create' | 'catalog'>('catalog');
  const [editSkill, setEditSkill] = useState<AssistantSkill | null>(null);
  const [viewSkill, setViewSkill] = useState<AssistantSkill | null>(null);

  // New skill form state
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<SkillCategory>('Automation');

  const categories = Array.from(new Set(skills.map(s => s.category)));

  const filtered = skills
    .filter(s => {
      const q = search.toLowerCase();
      const matchSearch = !q || s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
      const matchKind = filterKind === 'All' || s.kind === filterKind;
      const matchCat = filterCategory === 'All' || s.category === filterCategory;
      const matchStatus = filterStatus === 'All' || (filterStatus === 'Enabled' ? s.enabled : !s.enabled);
      return matchSearch && matchKind && matchCat && matchStatus;
    })
    .sort((a, b) => {
      const av = String(a[sortField] ?? '').toLowerCase();
      const bv = String(b[sortField] ?? '').toLowerCase();
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (field: typeof sortField) => {
    if (sortField === field) setSortAsc(a => !a);
    else { setSortField(field); setSortAsc(true); }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: typeof sortField }) => (
    <ArrowUpDown className={cn('h-3 w-3 ml-1 inline', sortField === field ? 'text-gray-900' : 'text-gray-400')} />
  );

  const handleAddFromCatalog = (catalogSkill: AssistantSkill) => {
    const exists = skills.find(s => s.name === catalogSkill.name);
    if (exists) return;
    const newSkill = { ...catalogSkill, id: Date.now(), enabled: true, lastUsed: undefined };
    setSkills(prev => [...prev, newSkill]);
  };

  const handleCreateSkill = () => {
    if (!newName.trim()) return;
    const newSkill: AssistantSkill = {
      id: Date.now(), name: newName.trim(), description: newDescription.trim(),
      category: newCategory, kind: 'Custom', enabled: true,
    };
    setSkills(prev => [...prev, newSkill]);
    setNewName(''); setNewDescription(''); setNewCategory('Automation');
    setAddDialogOpen(false);
  };

  const handleSaveEdit = () => {
    if (!editSkill) return;
    setSkills(prev => prev.map(s => s.id === editSkill.id ? editSkill : s));
    setEditSkill(null);
  };

  const handleToggleEnabled = (id: number) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  const handleRemoveSkill = (id: number) => {
    setSkills(prev => prev.filter(s => s.id !== id));
  };

  const catalogFiltered = SKILLS_CATALOG.filter(cs => !skills.find(s => s.name === cs.name));

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search skills..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 bg-white border-gray-200"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[100px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-gray-400" />
                {filterKind === 'All' ? 'Type' : filterKind}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {(['All', 'Core', 'Custom'] as const).map(k => (
              <DropdownMenuItem key={k} onClick={() => { setFilterKind(k); setPage(1); }} className={cn(filterKind === k && 'font-medium')}>
                {k === 'All' ? 'All Types' : k}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[110px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-gray-400" />
                {filterStatus === 'All' ? 'Status' : filterStatus}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {(['All', 'Enabled', 'Disabled'] as const).map(s => (
              <DropdownMenuItem key={s} onClick={() => { setFilterStatus(s); setPage(1); }} className={cn(filterStatus === s && 'font-medium')}>
                {s === 'All' ? 'All Statuses' : s}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[120px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-gray-400" />
                {filterCategory === 'All' ? 'Category' : filterCategory}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => { setFilterCategory('All'); setPage(1); }} className={cn(filterCategory === 'All' && 'font-medium')}>All Categories</DropdownMenuItem>
            {categories.map(c => (
              <DropdownMenuItem key={c} onClick={() => { setFilterCategory(c); setPage(1); }} className={cn(filterCategory === c && 'font-medium')}>{c}</DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" onClick={() => { setAddDialogOpen(true); setAddTab('catalog'); }} className="ml-auto">
          <Plus className="h-3.5 w-3.5 mr-1.5" />
          Add Skill
        </Button>
      </div>

      {/* Table */}
      <Card className="bg-white border-gray-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('name')}>
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5 text-gray-400" />
                    Skill <SortIcon field="name" />
                  </span>
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  Status
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('kind')}>
                  Type <SortIcon field="kind" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('category')}>
                  Category <SortIcon field="category" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('lastUsed')}>
                  Last Used <SortIcon field="lastUsed" />
                </th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                    <Sparkles className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                    No skills match your filters.
                  </td>
                </tr>
              ) : (
                paged.map(skill => {
                  const catMeta = SKILL_CATEGORY_META[skill.category];
                  const CatIcon = catMeta.icon;
                  const statusLabel = skill.enabled ? 'Enabled' : 'Disabled';
                  return (
                    <tr key={skill.id} className={cn('border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors', !skill.enabled && 'opacity-60')}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', catMeta.bg)}>
                            <CatIcon className={cn('w-4 h-4', catMeta.color)} />
                          </div>
                          <span className="font-medium text-gray-900 truncate">{skill.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', SKILL_STATUS_STYLE[statusLabel])}>
                          {statusLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-700">{skill.kind}</td>
                      <td className="px-4 py-3 text-gray-700">{skill.category}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{skill.lastUsed ?? '—'}</td>
                      <td className="px-4 py-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-gray-100">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setViewSkill(skill)}>
                              <Eye className="h-4 w-4 mr-2" />View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setEditSkill({ ...skill })}>
                              <Pencil className="h-4 w-4 mr-2" />Edit Skill
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleEnabled(skill.id)}>
                              {skill.enabled
                                ? <><XCircle className="h-4 w-4 mr-2" />Disable</>
                                : <><CheckCircle className="h-4 w-4 mr-2" />Enable</>}
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-600" onClick={() => handleRemoveSkill(skill.id)}>
                              <XCircle className="h-4 w-4 mr-2" />Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between gap-3 flex-wrap text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>
              {filtered.length > 0
                ? `Showing ${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filtered.length)} of ${filtered.length} entries`
                : '0 entries'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">Rows:</span>
              <select
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="h-6 rounded border border-gray-200 bg-white text-gray-700 text-xs px-1 focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer"
              >
                {[5, 10, 15].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(filterKind !== 'All' || filterCategory !== 'All' || filterStatus !== 'All' || search) && (
              <button
                className="text-gray-500 hover:text-gray-900 underline underline-offset-2"
                onClick={() => { setSearch(''); setFilterKind('All'); setFilterCategory('All'); setFilterStatus('All'); setPage(1); }}
              >
                Clear filters
              </button>
            )}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-7 w-7 !border-gray-200 hover:!bg-gray-100 hover:!text-gray-700" disabled={safePage === 1} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Button key={p} variant={p === safePage ? 'default' : 'outline'} size="icon" className={cn('h-7 w-7 text-xs', p !== safePage && '!border-gray-200 text-gray-600 hover:!bg-gray-100 hover:!text-gray-700')} onClick={() => setPage(p)}>
                    {p}
                  </Button>
                ))}
                <Button variant="outline" size="icon" className="h-7 w-7 !border-gray-200 hover:!bg-gray-100 hover:!text-gray-700" disabled={safePage === totalPages} onClick={() => setPage(p => p + 1)}>
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* ── View Skill Dialog ── */}
      <Dialog open={!!viewSkill} onOpenChange={open => !open && setViewSkill(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {viewSkill && (() => {
                const meta = SKILL_CATEGORY_META[viewSkill.category];
                const Icon = meta.icon;
                return <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', meta.bg)}><Icon className={cn('w-4 h-4', meta.color)} /></div>;
              })()}
              {viewSkill?.name}
            </DialogTitle>
          </DialogHeader>
          {viewSkill && (
            <div className="space-y-4 pt-2">
              <p className="text-sm text-gray-700">{viewSkill.description}</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Category</p>
                  <p className="font-medium text-gray-900">{viewSkill.category}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Type</p>
                  <Badge variant="secondary" className={cn('text-xs border',
                    viewSkill.kind === 'Core' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-gray-100 text-gray-600 border-gray-200'
                  )}>
                    {viewSkill.kind === 'Core' ? <><Shield className="h-3 w-3 mr-1 inline" />Core Skill</> : 'Custom Skill'}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-0.5">Status</p>
                  <p className="font-medium text-gray-900">{viewSkill.enabled ? 'Enabled' : 'Disabled'}</p>
                </div>
                {viewSkill.lastUsed && (
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Last Used</p>
                    <p className="font-medium text-gray-900">{viewSkill.lastUsed}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Edit Skill Dialog ── */}
      <Dialog open={!!editSkill} onOpenChange={open => !open && setEditSkill(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Skill</DialogTitle>
          </DialogHeader>
          {editSkill && (
            <div className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label className="text-sm">Name</Label>
                <Input value={editSkill.name} onChange={e => setEditSkill({ ...editSkill, name: e.target.value })} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Description</Label>
                <Textarea value={editSkill.description} onChange={e => setEditSkill({ ...editSkill, description: e.target.value })} rows={3} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Category</Label>
                <select
                  value={editSkill.category}
                  onChange={e => setEditSkill({ ...editSkill, category: e.target.value as SkillCategory })}
                  className="w-full h-9 rounded-md border border-gray-200 bg-white text-sm px-3 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  {(Object.keys(SKILL_CATEGORY_META) as SkillCategory[]).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Type</Label>
                <div className="flex gap-2">
                  {(['Core', 'Custom'] as const).map(k => (
                    <button
                      key={k}
                      onClick={() => setEditSkill({ ...editSkill, kind: k })}
                      className={cn('px-3 py-1.5 rounded-md text-sm border transition-colors',
                        editSkill.kind === k ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                      )}
                    >
                      {k}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setEditSkill(null)}>Cancel</Button>
                <Button size="sm" onClick={handleSaveEdit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Add Skill Dialog ── */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Skill</DialogTitle>
          </DialogHeader>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-4">
            {[
              { key: 'catalog' as const, label: 'Skills Catalog', icon: BookOpen },
              { key: 'create' as const,  label: 'Create New',     icon: Plus     },
            ].map(t => (
              <button
                key={t.key}
                onClick={() => setAddTab(t.key)}
                className={cn(
                  'flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors',
                  addTab === t.key ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                <t.icon className="h-3.5 w-3.5" />{t.label}
              </button>
            ))}
          </div>

          {/* Catalog tab */}
          {addTab === 'catalog' && (
            <div className="space-y-2">
              {catalogFiltered.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-8">All catalog skills have been added.</p>
              ) : (
                catalogFiltered.map(cs => {
                  const meta = SKILL_CATEGORY_META[cs.category];
                  const CIcon = meta.icon;
                  return (
                    <div key={cs.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                      <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', meta.bg)}>
                        <CIcon className={cn('w-4 h-4', meta.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{cs.name}</p>
                        <p className="text-xs text-gray-500 truncate">{cs.description}</p>
                      </div>
                      <Badge variant="secondary" className="text-[10px] border bg-gray-100 text-gray-600 border-gray-200 flex-shrink-0">{cs.category}</Badge>
                      <Button size="sm" variant="outline" className="flex-shrink-0" onClick={() => handleAddFromCatalog(cs)}>
                        <Plus className="h-3.5 w-3.5 mr-1" />Add
                      </Button>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* Create tab */}
          {addTab === 'create' && (
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-sm">Skill Name</Label>
                <Input placeholder="e.g. Contract Review" value={newName} onChange={e => setNewName(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Description</Label>
                <Textarea placeholder="Describe what this skill does..." value={newDescription} onChange={e => setNewDescription(e.target.value)} rows={3} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm">Category</Label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value as SkillCategory)}
                  className="w-full h-9 rounded-md border border-gray-200 bg-white text-sm px-3 focus:outline-none focus:ring-2 focus:ring-gray-300"
                >
                  {(Object.keys(SKILL_CATEGORY_META) as SkillCategory[]).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" size="sm" onClick={() => setAddDialogOpen(false)}>Cancel</Button>
                <Button size="sm" onClick={handleCreateSkill} disabled={!newName.trim()}>
                  <Plus className="h-3.5 w-3.5 mr-1.5" />Create Skill
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ─── Main component ─── */
const AssistantProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [assistant, setAssistant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') { navigate('/login'); return; }

    const storedAssistants = JSON.parse(localStorage.getItem('aiAssistants') || '[]');
    const allAssistants = [...DEFAULT_ASSISTANTS, ...storedAssistants];
    const found = allAssistants.find(a => a.id.toString() === id);
    if (found) setAssistant(found);
    setLoading(false);
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(30,25%,97%)]">
        <Card className="text-center p-8 bg-white border-gray-200">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-gray-900 mx-auto" />
          <p className="mt-3 text-sm text-gray-500">Loading assistant...</p>
        </Card>
      </div>
    );
  }

  if (!assistant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(30,25%,97%)]">
        <Card className="text-center p-8 bg-white border-gray-200">
          <p className="text-gray-500 mb-4 text-sm">Assistant not found.</p>
          <Button onClick={() => navigate('/ai-employees')} size="sm">
            Back to AI Workers
          </Button>
        </Card>
      </div>
    );
  }

  const assistantId = Number(id);
  const employees = ASSISTANT_EMPLOYEES[assistantId] ?? [];
  const allTasks  = ASSISTANT_TASKS[assistantId]     ?? [];
  const activity  = ASSISTANT_ACTIVITY[assistantId]  ?? [];

  const stats = {
    totalTasks: allTasks.length,
    completed:  allTasks.filter(t => t.status === 'Completed').length,
    inProgress: allTasks.filter(t => t.status === 'In Progress' || t.status === 'Pending').length,
    failed:     allTasks.filter(t => t.status === 'Failed').length,
  };

  const initials = assistant.name.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(30,25%,97%)]">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <main className="flex-1 p-6 pb-20">

              {/* Back button */}
              <button
                onClick={() => navigate('/ai-employees')}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to AI Workers
              </button>

              {/* Profile header */}
              <Card className="bg-white border-gray-200/60 mb-6 p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* Avatar */}
                  <div className="h-[72px] w-[72px] flex-shrink-0 bg-gray-100 border border-gray-200 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl font-semibold text-gray-900">{initials}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2.5 mb-1">
                      <h1 className="text-2xl font-bold text-gray-900">{assistant.name}</h1>
                      <Badge variant="secondary" className={cn('text-xs border', STATUS_BADGE[assistant.status] ?? 'bg-gray-100 text-gray-500 border-gray-200')}>
                        {assistant.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{assistant.type} · {assistant.department}</p>

                    <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                      {[
                        { icon: Bot,      label: 'AI Worker'    },
                        { icon: Network,  label: assistant.department },
                        { icon: Activity, label: `${assistant.conversations} conversations` },
                      ].map(({ icon: Icon, label }) => (
                        <span key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0"
                    onClick={() => navigate(`/ai-assistants/${id}/configure`)}
                  >
                    <Settings className="h-3.5 w-3.5 mr-1.5" />
                    Configure
                  </Button>
                </div>
              </Card>

              {/* Stat row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Connected Employees', value: employees.length, icon: Users,      color: 'text-blue-600',   bg: 'bg-blue-100'  },
                  { label: 'Total Tasks',          value: stats.totalTasks, icon: CheckSquare, color: 'text-gray-600',   bg: 'bg-gray-100'  },
                  { label: 'In Progress',          value: stats.inProgress, icon: RefreshCw,   color: 'text-amber-600',  bg: 'bg-amber-100' },
                  { label: 'Completed',            value: stats.completed,  icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-100' },
                ].map(s => (
                  <Card key={s.label} className="bg-white border-gray-200/60 p-4 flex items-center gap-3">
                    <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0', s.bg)}>
                      <s.icon className={cn('w-4 h-4', s.color)} />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                      <p className="text-xl font-bold text-gray-900">{s.value}</p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Tab navigation */}
              <div className="flex border-b border-gray-200 mb-6">
                {PROFILE_TABS.map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={cn(
                      'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                      activeTab === tab.key
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    )}
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* ── Tab: Overview ── */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Assistant info */}
                    <Card className="bg-white border-gray-200/60 overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
                        <Bot className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Assistant Info</span>
                      </div>
                      <div className="p-5 space-y-3">
                        {[
                          { label: 'Name',          value: assistant.name       },
                          { label: 'Type',          value: assistant.type       },
                          { label: 'Department',    value: assistant.department },
                          { label: 'Status',        value: assistant.status     },
                          { label: 'Conversations', value: assistant.conversations },
                        ].map(row => (
                          <div key={row.label} className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">{row.label}</span>
                            <span className="text-sm font-medium text-gray-900">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* Task summary */}
                    <Card className="bg-white border-gray-200/60 overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Task Summary</span>
                      </div>
                      <div className="p-5 space-y-3">
                        {[
                          { label: 'Connected Employees', value: employees.length },
                          { label: 'Total Tasks',         value: stats.totalTasks },
                          { label: 'Completed',           value: stats.completed  },
                          { label: 'In Progress',         value: stats.inProgress },
                          { label: 'Failed',              value: stats.failed     },
                        ].map(row => (
                          <div key={row.label} className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">{row.label}</span>
                            <span className="text-sm font-medium text-gray-900">{row.value}</span>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Recent activity preview */}
                  <Card className="bg-white border-gray-200/60 overflow-hidden">
                    <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">Recent Activity</span>
                    </div>
                    <div className="overflow-x-auto">
                      {activity.length === 0 ? (
                        <p className="text-sm text-gray-400 py-10 text-center">No recent activity.</p>
                      ) : (
                        <table className="w-full text-sm">
                          <tbody>
                            {activity.slice(0, 4).map(entry => {
                              const meta = ACTIVITY_ICON_MAP[entry.type] ?? { icon: Activity, color: 'text-gray-400', bg: 'from-gray-100 to-gray-100' };
                              const Icon = meta.icon;
                              return (
                                <tr key={entry.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors">
                                  <td className="px-4 py-3">
                                    <div className="flex items-center space-x-3">
                                      <div className={`p-2 rounded-lg bg-gradient-to-br ${meta.bg} flex-shrink-0`}>
                                        <Icon className={`h-4 w-4 ${meta.color}`} />
                                      </div>
                                      <p className="text-gray-900">{entry.text}</p>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 hidden md:table-cell">
                                    <span className="flex items-center gap-1.5 text-gray-600 text-xs">
                                      <Users className="h-3.5 w-3.5 text-gray-400" />
                                      {entry.employee}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-right">
                                    <span className="text-xs text-gray-500">{entry.time}</span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </Card>
                </div>
              )}

              {/* ── Tab: Employees ── */}
              {activeTab === 'employees' && (
                <Card className="bg-white border-gray-200/60 overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Connected Employees</span>
                  </div>
                  {employees.length === 0 ? (
                    <div className="text-center py-12">
                      <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-400">No connected employees yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50/60">
                            <th className="text-left px-4 py-3 font-medium text-gray-600">Employee</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Active Tasks</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Completed</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Last Interaction</th>
                          </tr>
                        </thead>
                        <tbody>
                          {employees.map(emp => (
                            <tr key={emp.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors cursor-pointer" onClick={() => navigate(`/staff/${emp.id}`)}>
                              <td className="px-4 py-3">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex-shrink-0">
                                    <Users className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-medium text-gray-900">{emp.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{emp.department}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-gray-700">{emp.role}</td>
                              <td className="px-4 py-3">
                                <Badge variant="secondary" className={cn('text-xs border', EMPLOYEE_STATUS_BADGE[emp.status] ?? 'bg-gray-100 text-gray-500 border-gray-200')}>
                                  {emp.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 hidden md:table-cell text-gray-700">{emp.activeTasks}</td>
                              <td className="px-4 py-3 hidden md:table-cell text-gray-700">{emp.completedTasks}</td>
                              <td className="px-4 py-3 hidden lg:table-cell">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-gray-400" />
                                  {emp.lastInteraction}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              )}

              {/* ── Tab: Tasks ── */}
              {activeTab === 'tasks' && (
                allTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
                    <p className="text-gray-600">Tasks will appear here when employees assign work to this assistant.</p>
                  </div>
                ) : (
                  <AssistantTasksTable tasks={allTasks} />
                )
              )}

              {/* ── Tab: Skills ── */}
              {activeTab === 'skills' && (
                <AssistantSkillsPanel assistantId={assistantId} />
              )}

              {/* ── Tab: Activity ── */}
              {activeTab === 'activity' && (
                <Card className="bg-white border-gray-200/60 overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Activity Log</span>
                    <Badge variant="secondary" className="ml-auto bg-gray-100 text-gray-600 border-gray-200 text-xs">
                      {activity.length} entries
                    </Badge>
                  </div>
                  {activity.length === 0 ? (
                    <div className="text-center py-12">
                      <Activity className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-400">No recent activity.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50/60">
                            <th className="text-left px-4 py-3 font-medium text-gray-600">Event</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Employee</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">Time</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activity.map(entry => {
                            const meta = ACTIVITY_ICON_MAP[entry.type] ?? { icon: Activity, color: 'text-gray-400', bg: 'from-gray-100 to-gray-100' };
                            const Icon = meta.icon;
                            return (
                              <tr key={entry.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors">
                                <td className="px-4 py-3">
                                  <div className="flex items-center space-x-3">
                                    <div className={`p-2 rounded-lg bg-gradient-to-br ${meta.bg} flex-shrink-0`}>
                                      <Icon className={`h-4 w-4 ${meta.color}`} />
                                    </div>
                                    <p className="text-gray-900">{entry.text}</p>
                                  </div>
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                  <span className="flex items-center gap-1.5 text-gray-600 text-xs">
                                    <Users className="h-3.5 w-3.5 text-gray-400" />
                                    {entry.employee}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-gray-400" />
                                    {entry.time}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card>
              )}

            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default AssistantProfile;
