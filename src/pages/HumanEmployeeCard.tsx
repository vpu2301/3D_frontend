import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  ChevronLeft, ChevronRight, ChevronDown, Mail, Phone, Building2, Calendar, Bot,
  CheckCircle, Clock, XCircle, Activity, MessageSquare,
  Zap, AlertCircle, RefreshCw, CheckSquare, BarChart2,
  Search, Filter, ArrowUpDown, MoreHorizontal, Eye, FileText,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Shared employee data ─── */
const ALL_EMPLOYEES = [
  { id: 1,  name: 'Sarah Johnson',   email: 'sarah.j@company.com',    phone: '+1 555-0101', role: 'Sales Manager',        department: 'Sales',            status: 'Active',   joinDate: '2022-03-15' },
  { id: 2,  name: 'Michael Chen',    email: 'm.chen@company.com',     phone: '+1 555-0102', role: 'Marketing Lead',       department: 'Marketing',        status: 'Active',   joinDate: '2021-07-22' },
  { id: 3,  name: 'Emily Rodriguez', email: 'e.rodriguez@company.com',phone: '+1 555-0103', role: 'HR Specialist',        department: 'HR',               status: 'On Leave', joinDate: '2023-01-08' },
  { id: 4,  name: 'David Kim',       email: 'd.kim@company.com',      phone: '+1 555-0104', role: 'DevOps Engineer',      department: 'Engineering',      status: 'Active',   joinDate: '2020-11-03' },
  { id: 5,  name: 'Priya Patel',     email: 'p.patel@company.com',    phone: '+1 555-0105', role: 'Finance Analyst',      department: 'Finance',          status: 'Active',   joinDate: '2022-09-19' },
  { id: 6,  name: 'James Wilson',    email: 'j.wilson@company.com',   phone: '+1 555-0106', role: 'Customer Success Mgr', department: 'Customer Success', status: 'Remote',   joinDate: '2021-04-14' },
  { id: 7,  name: 'Lena Fischer',    email: 'l.fischer@company.com',  phone: '+49 89 0107', role: 'Legal Counsel',        department: 'Legal',            status: 'Active',   joinDate: '2023-05-02' },
  { id: 8,  name: 'Tomás Reyes',     email: 't.reyes@company.com',    phone: '+1 555-0108', role: 'Product Designer',     department: 'Design',           status: 'Active',   joinDate: '2022-12-07' },
  { id: 9,  name: 'Aisha Nkosi',     email: 'a.nkosi@company.com',    phone: '+27 11 0109', role: 'Operations Analyst',   department: 'Operations',       status: 'Inactive', joinDate: '2020-06-30' },
  { id: 10, name: 'Ryan Kowalski',   email: 'r.kowalski@company.com', phone: '+1 555-0110', role: 'Senior Engineer',      department: 'Engineering',      status: 'Active',   joinDate: '2019-08-12' },
];

const EMPLOYEE_AGENTS: Record<number, Array<{
  id: string; name: string; type: string; status: 'Active' | 'Idle';
  activeTasks: number; completedTasks: number; lastActivity: string; description: string;
}>> = {
  1: [
    { id: 'aria',  name: 'Aria',  type: 'Sales',   status: 'Active', activeTasks: 4, completedTasks: 38, lastActivity: '12m ago', description: 'Qualifies inbound leads and sends follow-ups' },
    { id: 'atlas', name: 'Atlas', type: 'Support', status: 'Idle',   activeTasks: 0, completedTasks: 12, lastActivity: '2h ago',  description: 'Handles tier-1 support ticket routing' },
  ],
  2: [
    { id: 'maya', name: 'Maya', type: 'Marketing', status: 'Active', activeTasks: 5, completedTasks: 27, lastActivity: '5m ago',  description: 'Generates content briefs and campaign summaries' },
  ],
  3: [],
  4: [
    { id: 'atlas', name: 'Atlas', type: 'Support', status: 'Active', activeTasks: 3, completedTasks: 51, lastActivity: '18m ago', description: 'Monitors deployment pipelines and alerts on anomalies' },
  ],
  5: [
    { id: 'felix', name: 'Felix', type: 'Finance', status: 'Active', activeTasks: 2, completedTasks: 44, lastActivity: '31m ago', description: 'Reconciles invoices and prepares financial summaries' },
  ],
  6: [
    { id: 'atlas', name: 'Atlas', type: 'Support', status: 'Active', activeTasks: 6, completedTasks: 89, lastActivity: '3m ago',  description: 'Handles escalated customer tickets and follow-ups' },
    { id: 'aria',  name: 'Aria',  type: 'Sales',   status: 'Idle',   activeTasks: 0, completedTasks: 15, lastActivity: '4h ago',  description: 'Monitors renewal pipeline and upsell signals' },
  ],
  7: [],
  8: [
    { id: 'maya', name: 'Maya', type: 'Marketing', status: 'Idle', activeTasks: 1, completedTasks: 8, lastActivity: '1h ago', description: 'Creates design request briefs from marketing requirements' },
  ],
  9: [],
  10: [
    { id: 'atlas', name: 'Atlas', type: 'Support', status: 'Active', activeTasks: 2, completedTasks: 63, lastActivity: '9m ago', description: 'Assists with on-call incident triage and runbooks' },
  ],
};

type TaskStatus = 'Completed' | 'In Progress' | 'Failed' | 'Pending';

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

type EmployeeTask = {
  id: number; title: string; agent: string; status: TaskStatus;
  priority: 'High' | 'Medium' | 'Low'; category: string;
  createdAt: string; duration?: string; notes?: string;
};

const EMPLOYEE_TASKS: Record<number, EmployeeTask[]> = {
  1: [
    { id: 1, title: 'Qualify 12 inbound leads from CRM',           agent: 'Aria',  status: 'Completed',   priority: 'High',   category: 'Lead Qualification', createdAt: '2026-04-12', duration: '3m 42s', notes: 'All leads scored and pushed to pipeline.' },
    { id: 2, title: 'Send follow-up emails to Q1 pipeline',          agent: 'Aria',  status: 'Completed',   priority: 'Medium', category: 'Outreach',           createdAt: '2026-04-11', duration: '1m 55s' },
    { id: 3, title: 'Escalate VIP deal #4472 to account executive',  agent: 'Atlas', status: 'In Progress', priority: 'High',   category: 'Escalation',         createdAt: '2026-04-12', notes: 'Awaiting executive availability.' },
    { id: 4, title: 'Update lead scoring model inputs',              agent: 'Aria',  status: 'Completed',   priority: 'Low',    category: 'Data Hygiene',       createdAt: '2026-04-10', duration: '2m 03s' },
    { id: 5, title: 'Generate pipeline forecast report',             agent: 'Aria',  status: 'Pending',     priority: 'Medium', category: 'Reporting',          createdAt: '2026-04-12' },
  ],
  2: [
    { id: 1, title: 'Generate April social media content brief',  agent: 'Maya', status: 'Completed',   priority: 'High',   category: 'Content',   createdAt: '2026-04-11', duration: '2m 18s' },
    { id: 2, title: 'Analyse Q1 campaign performance data',       agent: 'Maya', status: 'Completed',   priority: 'Medium', category: 'Analytics', createdAt: '2026-04-10', duration: '4m 10s' },
    { id: 3, title: 'Draft email newsletter for product launch',  agent: 'Maya', status: 'In Progress', priority: 'High',   category: 'Content',   createdAt: '2026-04-12' },
    { id: 4, title: 'Compile competitor ad spend summary',        agent: 'Maya', status: 'Pending',     priority: 'Low',    category: 'Research',  createdAt: '2026-04-12' },
  ],
  3: [],
  4: [
    { id: 1, title: 'Monitor CI/CD pipeline anomalies',            agent: 'Atlas', status: 'In Progress', priority: 'High',   category: 'DevOps',     createdAt: '2026-04-12' },
    { id: 2, title: 'Generate weekly infrastructure health report', agent: 'Atlas', status: 'Completed',   priority: 'Medium', category: 'Reporting',  createdAt: '2026-04-11', duration: '1m 47s' },
    { id: 3, title: 'Alert on memory spike in prod cluster',        agent: 'Atlas', status: 'Completed',   priority: 'High',   category: 'Monitoring', createdAt: '2026-04-10', duration: '0m 22s' },
  ],
  5: [
    { id: 1, title: 'Reconcile March invoices',         agent: 'Felix', status: 'In Progress', priority: 'High',   category: 'Finance',   createdAt: '2026-04-12' },
    { id: 2, title: 'Prepare Q1 expense report',        agent: 'Felix', status: 'Completed',   priority: 'High',   category: 'Finance',   createdAt: '2026-04-10', duration: '5m 30s' },
    { id: 3, title: 'Flag duplicate invoice #INV-4471', agent: 'Felix', status: 'Completed',   priority: 'Medium', category: 'Audit',     createdAt: '2026-04-09', duration: '0m 48s' },
    { id: 4, title: 'Generate budget variance summary', agent: 'Felix', status: 'Pending',     priority: 'Low',    category: 'Reporting', createdAt: '2026-04-12' },
  ],
  6: [
    { id: 1, title: 'Process 8 VIP support tickets',       agent: 'Atlas', status: 'In Progress', priority: 'High',   category: 'Support',    createdAt: '2026-04-12' },
    { id: 2, title: 'Generate weekly support digest',       agent: 'Atlas', status: 'Completed',   priority: 'Medium', category: 'Reporting',  createdAt: '2026-04-11', duration: '1m 47s' },
    { id: 3, title: 'Monitor renewal pipeline health',      agent: 'Aria',  status: 'Completed',   priority: 'Medium', category: 'Renewals',   createdAt: '2026-04-10', duration: '2m 05s' },
    { id: 4, title: 'Escalate at-risk account #CS-902',     agent: 'Atlas', status: 'Failed',      priority: 'High',   category: 'Escalation', createdAt: '2026-04-11', duration: '0m 44s', notes: 'Contact details were outdated.' },
    { id: 5, title: 'Send NPS survey follow-up batch',      agent: 'Atlas', status: 'Pending',     priority: 'Low',    category: 'Outreach',   createdAt: '2026-04-12' },
  ],
  7: [],
  8: [
    { id: 1, title: 'Create design request brief for landing page', agent: 'Maya', status: 'Completed',   priority: 'Medium', category: 'Design',   createdAt: '2026-04-10', duration: '1m 20s' },
    { id: 2, title: 'Summarise UX feedback from user interviews',   agent: 'Maya', status: 'In Progress', priority: 'High',   category: 'Research', createdAt: '2026-04-12' },
  ],
  9: [],
  10: [
    { id: 1, title: 'Triage on-call alert batch #38',          agent: 'Atlas', status: 'In Progress', priority: 'High',   category: 'On-Call',   createdAt: '2026-04-12' },
    { id: 2, title: 'Generate incident post-mortem draft',     agent: 'Atlas', status: 'Completed',   priority: 'High',   category: 'Reporting', createdAt: '2026-04-11', duration: '3m 15s' },
    { id: 3, title: 'Update runbook for memory-leak scenario', agent: 'Atlas', status: 'Pending',     priority: 'Medium', category: 'Docs',      createdAt: '2026-04-12' },
  ],
};

const EMPLOYEE_ACTIVITY: Record<number, Array<{
  id: number; type: 'task_completed' | 'task_failed' | 'message' | 'assignment' | 'escalation';
  agent: string; text: string; time: string;
}>> = {
  1: [
    { id: 1, type: 'task_completed', agent: 'Aria',  text: 'Completed lead qualification batch (12 leads scored)',   time: '12m ago'  },
    { id: 2, type: 'message',        agent: 'Atlas', text: 'Sent escalation summary for deal #4472 to inbox',         time: '1h ago'   },
    { id: 3, type: 'task_completed', agent: 'Aria',  text: 'Follow-up emails sent to 9 contacts in Q1 pipeline',     time: '3h ago'   },
    { id: 4, type: 'assignment',     agent: 'Aria',  text: 'New task assigned: Generate pipeline forecast report',     time: '4h ago'   },
    { id: 5, type: 'task_completed', agent: 'Aria',  text: 'Lead scoring model inputs updated successfully',          time: 'Yesterday'},
  ],
  2: [
    { id: 1, type: 'task_completed', agent: 'Maya', text: 'April social media content brief delivered',              time: '5m ago'   },
    { id: 2, type: 'task_completed', agent: 'Maya', text: 'Q1 campaign performance analysis ready for review',       time: '2h ago'   },
    { id: 3, type: 'assignment',     agent: 'Maya', text: 'Started drafting April product launch newsletter',         time: '3h ago'   },
    { id: 4, type: 'message',        agent: 'Maya', text: 'Shared competitor ad spend summary (draft) in workspace', time: 'Yesterday'},
  ],
  3: [],
  4: [
    { id: 1, type: 'message',        agent: 'Atlas', text: 'Memory spike alert triggered for prod cluster EU-2',     time: '9m ago' },
    { id: 2, type: 'task_completed', agent: 'Atlas', text: 'Weekly infrastructure health report generated',          time: '1h ago' },
    { id: 3, type: 'escalation',     agent: 'Atlas', text: 'Escalated CPU anomaly in cluster US-1 to on-call team',  time: '5h ago' },
  ],
  5: [
    { id: 1, type: 'task_completed', agent: 'Felix', text: 'Duplicate invoice #INV-4471 flagged and sent for review',time: '31m ago'},
    { id: 2, type: 'task_completed', agent: 'Felix', text: 'Q1 expense report completed and filed',                  time: '2d ago' },
    { id: 3, type: 'message',        agent: 'Felix', text: 'Budget variance summary draft available for review',     time: '3d ago' },
  ],
  6: [
    { id: 1, type: 'task_completed', agent: 'Atlas', text: 'Weekly support digest sent to CS team',                 time: '3m ago' },
    { id: 2, type: 'task_failed',    agent: 'Atlas', text: 'Failed to escalate account #CS-902 — stale contact',   time: '1d ago' },
    { id: 3, type: 'task_completed', agent: 'Aria',  text: 'Renewal pipeline health check completed (3 at-risk)',   time: '2d ago' },
    { id: 4, type: 'message',        agent: 'Atlas', text: 'NPS follow-up batch queued, waiting for approval',      time: '2d ago' },
  ],
  7: [],
  8: [
    { id: 1, type: 'task_completed', agent: 'Maya', text: 'Landing page design brief delivered to Figma workspace', time: '2d ago'},
    { id: 2, type: 'assignment',     agent: 'Maya', text: 'Started summarising UX research interview notes',        time: '4h ago'},
  ],
  9: [],
  10: [
    { id: 1, type: 'escalation',     agent: 'Atlas', text: 'On-call alert batch #38 triaged — 2 high priority',    time: '9m ago'},
    { id: 2, type: 'task_completed', agent: 'Atlas', text: 'Incident post-mortem draft for April 10 outage ready', time: '1d ago'},
    { id: 3, type: 'assignment',     agent: 'Atlas', text: 'Runbook update task queued for memory-leak scenario',   time: '2d ago'},
  ],
};

const ACTIVITY_ICON_MAP: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  task_completed: { icon: CheckCircle,   color: 'text-green-600', bg: 'from-green-100 to-emerald-100' },
  task_failed:    { icon: XCircle,       color: 'text-red-600',   bg: 'from-red-100 to-pink-100'      },
  message:        { icon: MessageSquare, color: 'text-blue-600',  bg: 'from-blue-100 to-cyan-100'     },
  assignment:     { icon: Zap,           color: 'text-amber-600', bg: 'from-amber-100 to-yellow-100'  },
  escalation:     { icon: AlertCircle,   color: 'text-orange-600',bg: 'from-orange-100 to-amber-100'  },
};

const STATUS_BADGE: Record<string, string> = {
  Active:     'bg-green-100 text-green-700 border-green-200',
  Inactive:   'bg-gray-100 text-gray-500 border-gray-200',
  'On Leave': 'bg-amber-100 text-amber-700 border-amber-200',
  Remote:     'bg-blue-100 text-blue-700 border-blue-200',
};

type ProfileTab = 'overview' | 'agents' | 'tasks' | 'activity';

const PROFILE_TABS: { key: ProfileTab; label: string; icon: React.ElementType }[] = [
  { key: 'overview',  label: 'Overview',  icon: BarChart2   },
  { key: 'agents',    label: 'Agents',    icon: Bot         },
  { key: 'tasks',     label: 'Tasks',     icon: CheckSquare },
  { key: 'activity',  label: 'Activity',  icon: Activity    },
];

const TASK_STATUSES  = ['All', 'Completed', 'In Progress', 'Pending', 'Failed'];
const TASK_PRIORITIES = ['All', 'High', 'Medium', 'Low'];

/* ─── Tasks table sub-component ─── */
const EmployeeTasksTable = ({ tasks }: { tasks: EmployeeTask[] }) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortField, setSortField] = useState<keyof EmployeeTask>('createdAt');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filtered = tasks
    .filter(t => {
      const q = search.toLowerCase();
      const matchSearch = !q || t.title.toLowerCase().includes(q) || t.agent.toLowerCase().includes(q) || t.category.toLowerCase().includes(q);
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

  const toggleSort = (field: keyof EmployeeTask) => {
    if (sortField === field) setSortAsc(a => !a);
    else { setSortField(field); setSortAsc(true); }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: keyof EmployeeTask }) => (
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
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('agent')}>
                  Agent <SortIcon field="agent" />
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
                        <Bot className="h-3.5 w-3.5 text-gray-400" />
                        {task.agent}
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

export default function HumanEmployeeCard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<ProfileTab>('overview');

  const empId = Number(id);
  const employee = ALL_EMPLOYEES.find(e => e.id === empId);

  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[hsl(30,25%,97%)]">
        <Card className="text-center p-8 bg-white border-gray-200">
          <p className="text-gray-500 mb-4 text-sm">Employee not found.</p>
          <Button onClick={() => navigate('/staff')} size="sm">
            Back to Staff
          </Button>
        </Card>
      </div>
    );
  }

  const agents   = EMPLOYEE_AGENTS[empId]   ?? [];
  const allTasks = EMPLOYEE_TASKS[empId]    ?? [];
  const activity = EMPLOYEE_ACTIVITY[empId] ?? [];

  const stats = {
    totalTasks: allTasks.length,
    completed:  allTasks.filter(t => t.status === 'Completed').length,
    inProgress: allTasks.filter(t => t.status === 'In Progress' || t.status === 'Pending').length,
    failed:     allTasks.filter(t => t.status === 'Failed').length,
  };

  const initials = employee.name.split(' ').map(n => n[0]).join('').slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(30,25%,97%)]">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <main className="flex-1 p-6 pb-20">

              {/* Back button */}
              <button
                onClick={() => navigate('/staff')}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors mb-6"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Staff
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
                      <h1 className="text-2xl font-bold text-gray-900">{employee.name}</h1>
                      <Badge variant="secondary" className={cn('text-xs border', STATUS_BADGE[employee.status] ?? 'bg-gray-100 text-gray-500 border-gray-200')}>
                        {employee.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{employee.role} · {employee.department}</p>

                    <div className="flex flex-wrap gap-x-5 gap-y-1.5">
                      {[
                        { icon: Mail,     label: employee.email  },
                        { icon: Phone,    label: employee.phone  },
                        { icon: Calendar, label: `Joined ${new Date(employee.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}` },
                      ].filter(i => i.label).map(({ icon: Icon, label }) => (
                        <span key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Icon className="h-3.5 w-3.5 flex-shrink-0" />
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" size="sm" className="flex-shrink-0">
                    <Mail className="h-3.5 w-3.5 mr-1.5" />
                    Message
                  </Button>
                </div>
              </Card>

              {/* Stat row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: 'Assigned Agents', value: agents.length,    icon: Bot,         color: 'text-blue-600',   bg: 'bg-blue-100'  },
                  { label: 'Total Tasks',      value: stats.totalTasks, icon: CheckSquare, color: 'text-gray-600',   bg: 'bg-gray-100'  },
                  { label: 'In Progress',      value: stats.inProgress, icon: RefreshCw,   color: 'text-amber-600',  bg: 'bg-amber-100' },
                  { label: 'Completed',        value: stats.completed,  icon: CheckCircle, color: 'text-green-600',  bg: 'bg-green-100' },
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

              {/* Tab navigation — Tasks-page style */}
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
                    {/* Employee info */}
                    <Card className="bg-white border-gray-200/60 overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-700">Employee Info</span>
                      </div>
                      <div className="p-5 space-y-3">
                        {[
                          { label: 'Department', value: employee.department },
                          { label: 'Role',        value: employee.role       },
                          { label: 'Email',       value: employee.email      },
                          { label: 'Phone',       value: employee.phone      },
                          { label: 'Joined',      value: new Date(employee.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) },
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
                          { label: 'Assigned Agents', value: agents.length    },
                          { label: 'Total Tasks',      value: stats.totalTasks },
                          { label: 'Completed',        value: stats.completed  },
                          { label: 'In Progress',      value: stats.inProgress },
                          { label: 'Failed',           value: stats.failed     },
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
                                      <Bot className="h-3.5 w-3.5 text-gray-400" />
                                      {entry.agent}
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

              {/* ── Tab: Agents ── */}
              {activeTab === 'agents' && (
                <Card className="bg-white border-gray-200/60 overflow-hidden">
                  <div className="px-5 py-3.5 border-b border-gray-100 bg-gray-50/60 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-gray-400" />
                    <span className="text-sm font-medium text-gray-700">Assigned AI Agents</span>
                  </div>
                  {agents.length === 0 ? (
                    <div className="text-center py-12">
                      <Bot className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-400">No agents assigned yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 bg-gray-50/60">
                            <th className="text-left px-4 py-3 font-medium text-gray-600">Agent</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Active</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Completed</th>
                            <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Last Active</th>
                          </tr>
                        </thead>
                        <tbody>
                          {agents.map(agent => (
                            <tr key={agent.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors">
                              <td className="px-4 py-3">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100 flex-shrink-0">
                                    <Bot className="h-4 w-4 text-blue-600" />
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-medium text-gray-900">{agent.name}</p>
                                    <p className="text-xs text-gray-500 truncate">{agent.description}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-gray-700">{agent.type}</td>
                              <td className="px-4 py-3">
                                <Badge variant="secondary" className={cn('text-xs border', agent.status === 'Active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-amber-100 text-amber-700 border-amber-200')}>
                                  {agent.status}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 hidden md:table-cell text-gray-700">{agent.activeTasks}</td>
                              <td className="px-4 py-3 hidden md:table-cell text-gray-700">{agent.completedTasks}</td>
                              <td className="px-4 py-3 hidden lg:table-cell">
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="h-3 w-3 text-gray-400" />
                                  {agent.lastActivity}
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
                    <p className="text-gray-600">Tasks will appear here when agents are assigned work.</p>
                  </div>
                ) : (
                  <EmployeeTasksTable tasks={allTasks} />
                )
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
                            <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Agent</th>
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
                                    <Bot className="h-3.5 w-3.5 text-gray-400" />
                                    {entry.agent}
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
}
