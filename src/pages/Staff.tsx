
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  Bot, Plus, Settings, Activity, Eye, MessageCircle, Users, Building,
  Search, Filter, ArrowUpDown, MoreHorizontal, ChevronDown,
  ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock,
  Zap, Crown, UserPlus, Upload, Building2, Mail, Phone,
  Trash2, Pencil, CheckSquare,
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import CreateAgentWizard from '@/components/dashboard/CreateAgentWizard';
import CreateTeamDialog from '@/components/CreateTeamDialog';
import AddEmployeeDialog, { type Employee } from '@/components/AddEmployeeDialog';
import ImportEmployeesDialog from '@/components/ImportEmployeesDialog';
import { cn } from '@/lib/utils';

/* ═══════════════════════════════════════════════════════
   TOP-LEVEL SECTION TYPE
════════════════════════════════════════════════════════ */
type Section = 'ai-workers' | 'human-teams' | 'worker-groups';

/* ═══════════════════════════════════════════════════════
   SHARED HELPERS
════════════════════════════════════════════════════════ */
function formatTimeAgo(date: Date) {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const ACTIVITY_STATUS_STYLE: Record<string, string> = {
  Completed:     'bg-green-100 text-green-700 border-green-200',
  Failed:        'bg-red-100 text-red-700 border-red-200',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
};

/* ═══════════════════════════════════════════════════════
   AI WORKERS SECTION
════════════════════════════════════════════════════════ */
type WorkerActivityEntry = {
  id: number;
  worker: string;
  task: string;
  status: 'Completed' | 'Failed' | 'In Progress';
  type: string;
  date: Date;
  duration: string;
};

const WORKER_ACTIVITY_DATA: WorkerActivityEntry[] = [
  { id: 1,  worker: 'Aria',  task: 'Qualify inbound leads from CRM',     status: 'Completed',   type: 'Sales',     date: new Date(Date.now() - 1000*60*12),  duration: '3m 42s' },
  { id: 2,  worker: 'Atlas', task: 'Process support ticket batch #1142',  status: 'Completed',   type: 'Support',   date: new Date(Date.now() - 1000*60*28),  duration: '7m 05s' },
  { id: 3,  worker: 'Felix', task: 'Reconcile monthly invoices',          status: 'In Progress', type: 'Finance',   date: new Date(Date.now() - 1000*60*45),  duration: '—'      },
  { id: 4,  worker: 'Maya',  task: 'Generate social media content brief', status: 'Completed',   type: 'Marketing', date: new Date(Date.now() - 1000*60*60),  duration: '2m 18s' },
  { id: 5,  worker: 'Aria',  task: 'Send follow-up emails to pipeline',   status: 'Completed',   type: 'Sales',     date: new Date(Date.now() - 1000*60*90),  duration: '1m 55s' },
  { id: 6,  worker: 'Atlas', task: 'Escalate VIP ticket #9023',           status: 'Failed',      type: 'Support',   date: new Date(Date.now() - 1000*60*120), duration: '0m 44s' },
  { id: 7,  worker: 'Felix', task: 'Prepare Q1 expense report',           status: 'Completed',   type: 'Finance',   date: new Date(Date.now() - 1000*60*180), duration: '5m 30s' },
  { id: 8,  worker: 'Maya',  task: 'Analyse campaign performance data',   status: 'Completed',   type: 'Marketing', date: new Date(Date.now() - 1000*60*240), duration: '4m 10s' },
  { id: 9,  worker: 'Aria',  task: 'Update lead scoring model inputs',    status: 'Completed',   type: 'Sales',     date: new Date(Date.now() - 1000*60*300), duration: '2m 03s' },
  { id: 10, worker: 'Atlas', task: 'Generate weekly support digest',      status: 'Completed',   type: 'Support',   date: new Date(Date.now() - 1000*60*360), duration: '1m 47s' },
];

const W_WORKERS  = ['All Workers', 'Aria', 'Atlas', 'Felix', 'Maya'];
const W_STATUSES = ['All', 'Completed', 'Failed', 'In Progress'];
const W_TYPES    = ['All Types', 'Sales', 'Support', 'Finance', 'Marketing'];

const WorkerActivityTable = () => {
  const [search, setSearch]             = useState('');
  const [workerFilter, setWorkerFilter] = useState('All Workers');
  const [statusFilter, setStatusFilter] = useState('All');
  const [typeFilter, setTypeFilter]     = useState('All Types');
  const [sortField, setSortField]       = useState<keyof WorkerActivityEntry>('date');
  const [sortAsc, setSortAsc]           = useState(false);
  const [page, setPage]                 = useState(1);
  const [pageSize, setPageSize]         = useState(5);

  const filtered = WORKER_ACTIVITY_DATA
    .filter(a => {
      const q = search.toLowerCase();
      const matchSearch = !q || a.task.toLowerCase().includes(q) || a.worker.toLowerCase().includes(q);
      const matchWorker = workerFilter === 'All Workers' || a.worker === workerFilter;
      const matchStatus = statusFilter === 'All' || a.status === statusFilter;
      const matchType   = typeFilter === 'All Types' || a.type === typeFilter;
      return matchSearch && matchWorker && matchStatus && matchType;
    })
    .sort((a, b) => {
      const av = String(a[sortField] ?? '').toLowerCase();
      const bv = String(b[sortField] ?? '').toLowerCase();
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (field: keyof WorkerActivityEntry) => {
    if (sortField === field) setSortAsc(a => !a);
    else { setSortField(field); setSortAsc(true); }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: keyof WorkerActivityEntry }) => (
    <ArrowUpDown className={cn('h-3 w-3 ml-1 inline', sortField === field ? 'text-gray-900' : 'text-gray-400')} />
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input placeholder="Search activity…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9 bg-white border-gray-200" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[130px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5"><Bot className="h-3.5 w-3.5 text-gray-400" />{workerFilter === 'All Workers' ? 'Worker' : workerFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            {W_WORKERS.map(w => <DropdownMenuItem key={w} onClick={() => { setWorkerFilter(w); setPage(1); }} className={cn(workerFilter === w && 'font-medium')}>{w}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[110px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5"><Filter className="h-3.5 w-3.5 text-gray-400" />{statusFilter === 'All' ? 'Status' : statusFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {W_STATUSES.map(s => <DropdownMenuItem key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={cn(statusFilter === s && 'font-medium')}>{s === 'All' ? 'All Statuses' : s}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[110px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-gray-400" />{typeFilter === 'All Types' ? 'Type' : typeFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {W_TYPES.map(t => <DropdownMenuItem key={t} onClick={() => { setTypeFilter(t); setPage(1); }} className={cn(typeFilter === t && 'font-medium')}>{t}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Card className="bg-white border-gray-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('task')}>Task <SortIcon field="task" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('status')}>Status <SortIcon field="status" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('worker')}>Worker <SortIcon field="worker" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('type')}>Type <SortIcon field="type" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden lg:table-cell" onClick={() => toggleSort('date')}>Time <SortIcon field="date" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Duration</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">No activity matches your filters.</td></tr>
              ) : paged.map(entry => (
                <tr key={entry.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="p-1.5 rounded bg-gray-100 flex-shrink-0"><Activity className="h-3.5 w-3.5 text-gray-500" /></div><span className="font-medium text-gray-900 truncate max-w-[220px]">{entry.task}</span></div></td>
                  <td className="px-4 py-3"><span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', ACTIVITY_STATUS_STYLE[entry.status])}>{entry.status}</span></td>
                  <td className="px-4 py-3 hidden md:table-cell"><div className="flex items-center gap-2"><div className="h-6 w-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0"><span className="text-xs font-semibold text-gray-600">{entry.worker[0]}</span></div><span className="text-gray-700">{entry.worker}</span></div></td>
                  <td className="px-4 py-3 hidden md:table-cell"><span className="text-gray-600 text-xs">{entry.type}</span></td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">{formatTimeAgo(entry.date)}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">{entry.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between gap-3 flex-wrap text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>{filtered.length > 0 ? `Showing ${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filtered.length)} of ${filtered.length} entries` : '0 entries'}</span>
            <div className="flex items-center gap-1.5"><span className="text-gray-400">Rows:</span><select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} className="h-6 rounded border border-gray-200 bg-white text-gray-700 text-xs px-1 focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer">{[5, 10, 15].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
          </div>
          <div className="flex items-center gap-2">
            {(search || workerFilter !== 'All Workers' || statusFilter !== 'All' || typeFilter !== 'All Types') && (
              <button className="text-gray-500 hover:text-gray-900 underline underline-offset-2" onClick={() => { setSearch(''); setWorkerFilter('All Workers'); setStatusFilter('All'); setTypeFilter('All Types'); setPage(1); }}>Clear filters</button>
            )}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-7 w-7 !border-gray-200 hover:!bg-gray-100 hover:!text-gray-700" disabled={safePage === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => <Button key={p} variant={p === safePage ? 'default' : 'outline'} size="icon" className={cn('h-7 w-7 text-xs', p !== safePage && '!border-gray-200 text-gray-600 hover:!bg-gray-100 hover:!text-gray-700')} onClick={() => setPage(p)}>{p}</Button>)}
                <Button variant="outline" size="icon" className="h-7 w-7 !border-gray-200 hover:!bg-gray-100 hover:!text-gray-700" disabled={safePage === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

const WorkersGrid = ({ employees, onViewEmployee, onShowCreate }: { employees: any[]; onViewEmployee: (id: string | number) => void; onShowCreate: () => void }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {employees.map(employee => (
        <Card key={employee.id} className="bg-white/80 border-gray-200/50 hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback className={`bg-gradient-to-br ${employee.bgColor} ${employee.iconColor} font-medium`}>{employee.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 p-1 rounded-full bg-gradient-to-br ${employee.bgColor}`}>
                    <Bot className={`h-3 w-3 ${employee.iconColor}`} />
                  </div>
                </div>
                <div>
                  <span className="font-medium">{employee.name}</span>
                  {employee.isAssistant && <span className="block text-xs text-gray-600 font-normal">AI Assistant</span>}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" className="hover:bg-gray-100 h-8 w-8" onClick={() => onViewEmployee(employee.id)}><Eye className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100 h-8 w-8"><Settings className="h-4 w-4" /></Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">{employee.type || employee.department}</Badge>
                <div className="flex items-center space-x-1">
                  {employee.scope === 'team' ? <Building className="h-3 w-3 text-gray-600" /> : <Users className="h-3 w-3 text-gray-600" />}
                  <span className="text-xs text-gray-600 capitalize">{employee.scope}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded bg-gray-100"><Activity className="h-3 w-3 text-gray-600" /></div>
                <span className={`text-sm font-medium ${employee.status === 'Active' ? 'text-green-700' : 'text-amber-700'}`}>{employee.status}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded bg-gray-100"><MessageCircle className="h-3 w-3 text-gray-600" /></div>
                <span className="text-sm text-gray-700">Conversations: {employee.conversations}</span>
              </div>
              <p className="text-sm text-gray-700">Active Tasks: {employee.tasks}</p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs bg-gray-50 hover:bg-gray-100 border-gray-200" onClick={() => onViewEmployee(employee.id)}><Eye className="h-3 w-3 mr-1" />View Details</Button>
                <Button variant="outline" size="sm" className="text-xs bg-gray-50 hover:bg-gray-100 border-gray-200"><Settings className="h-3 w-3" /></Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
    {employees.length === 0 && (
      <div className="text-center py-12">
        <Bot className="h-16 w-16 text-black/50 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No AI employees yet</h3>
        <p className="text-gray-600 mb-4">Create your first AI employee to get started</p>
        <Button onClick={onShowCreate} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"><Plus className="h-4 w-4 mr-2" />Add AI Employee</Button>
      </div>
    )}
  </>
);

/* ─── AI Workers — list/table tab ─────────────────────────── */
type AIWorkerEntry = {
  id: string | number;
  name: string;
  type: string;
  status: string;
  tasks: number;
  conversations: number;
  scope: string;
};

const AW_STATUS_STYLE: Record<string, string> = {
  Active: 'bg-green-100 text-green-700 border-green-200',
  Idle:   'bg-amber-100 text-amber-700 border-amber-200',
};

const AW_TYPES    = ['All Types', 'Sales', 'Support', 'Finance', 'Marketing'];
const AW_STATUSES = ['All', 'Active', 'Idle'];
const AW_SCOPES   = ['All Scopes', 'team', 'personal'];

const AIWorkersListTab = ({ employees, onViewEmployee, onShowCreate }: {
  employees: any[];
  onViewEmployee: (id: string | number) => void;
  onShowCreate: () => void;
}) => {
  const [search, setSearch]           = useState('');
  const [typeFilter, setTypeFilter]   = useState('All Types');
  const [statusFilter, setStatusFilter] = useState('All');
  const [scopeFilter, setScopeFilter] = useState('All Scopes');
  const [sortField, setSortField]     = useState<keyof AIWorkerEntry>('name');
  const [sortAsc, setSortAsc]         = useState(true);
  const [page, setPage]               = useState(1);
  const [pageSize, setPageSize]       = useState(5);
  const [selected, setSelected]       = useState<Set<string | number>>(new Set());

  const filtered = employees
    .filter(e => {
      const q = search.toLowerCase();
      const matchSearch = !q || e.name.toLowerCase().includes(q) || (e.type || e.department || '').toLowerCase().includes(q);
      const matchType   = typeFilter === 'All Types'   || (e.type || e.department) === typeFilter;
      const matchStatus = statusFilter === 'All'       || e.status === statusFilter;
      const matchScope  = scopeFilter === 'All Scopes' || e.scope === scopeFilter;
      return matchSearch && matchType && matchStatus && matchScope;
    })
    .sort((a, b) => {
      const av = String((a as any)[sortField] ?? '').toLowerCase();
      const bv = String((b as any)[sortField] ?? '').toLowerCase();
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (field: keyof AIWorkerEntry) => {
    if (sortField === field) setSortAsc(a => !a);
    else { setSortField(field); setSortAsc(true); }
    setPage(1);
  };

  const toggleAll = () => {
    if (selected.size === paged.length) setSelected(new Set());
    else setSelected(new Set(paged.map(e => e.id)));
  };
  const toggleOne = (id: string | number) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const stats = {
    total:  employees.length,
    active: employees.filter(e => e.status === 'Active').length,
    idle:   employees.filter(e => e.status === 'Idle').length,
    tasks:  employees.reduce((s, e) => s + (e.tasks || 0), 0),
  };

  const SortIcon = ({ field }: { field: keyof AIWorkerEntry }) => (
    <ArrowUpDown className={cn('h-3 w-3 ml-1 inline', sortField === field ? 'text-gray-900' : 'text-gray-400')} />
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total',      value: stats.total,  color: 'text-gray-900',  bg: 'bg-gray-100' },
          { label: 'Active',     value: stats.active, color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Idle',       value: stats.idle,   color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Total Tasks',value: stats.tasks,  color: 'text-blue-700',  bg: 'bg-blue-50'  },
        ].map(s => (
          <Card key={s.label} className={cn('border-gray-200/60', s.bg)}>
            <CardContent className="p-4"><p className="text-xs text-gray-500 mb-1">{s.label}</p><p className={cn('text-2xl font-semibold', s.color)}>{s.value}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input placeholder="Search AI workers…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9 bg-white border-gray-200" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[120px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-gray-400" />{typeFilter === 'All Types' ? 'Type' : typeFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            {AW_TYPES.map(t => <DropdownMenuItem key={t} onClick={() => { setTypeFilter(t); setPage(1); }} className={cn(typeFilter === t && 'font-medium')}>{t}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[110px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5"><Filter className="h-3.5 w-3.5 text-gray-400" />{statusFilter === 'All' ? 'Status' : statusFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {AW_STATUSES.map(s => <DropdownMenuItem key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={cn(statusFilter === s && 'font-medium')}>{s === 'All' ? 'All Statuses' : s}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[110px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5"><Users className="h-3.5 w-3.5 text-gray-400" />{scopeFilter === 'All Scopes' ? 'Scope' : scopeFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {AW_SCOPES.map(s => <DropdownMenuItem key={s} onClick={() => { setScopeFilter(s); setPage(1); }} className={cn(scopeFilter === s && 'font-medium')}>{s === 'All Scopes' ? 'All Scopes' : s.charAt(0).toUpperCase() + s.slice(1)}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex-1" />
        <Button size="sm" onClick={onShowCreate} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
          <Plus className="h-3.5 w-3.5 mr-1.5" />Add AI Worker
        </Button>
      </div>

      <Card className="bg-white border-gray-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="w-10 px-4 py-3"><input type="checkbox" checked={selected.size === paged.length && paged.length > 0} onChange={toggleAll} className="rounded border-gray-300 cursor-pointer" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('name')}>Worker <SortIcon field="name" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('status')}>Status <SortIcon field="status" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('type')}>Type <SortIcon field="type" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('tasks')}>Tasks <SortIcon field="tasks" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('conversations')}>Conversations <SortIcon field="conversations" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('scope')}>Scope <SortIcon field="scope" /></th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400 text-sm">No AI workers match your filters.</td></tr>
              ) : paged.map(emp => (
                <tr key={emp.id} className={cn('border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors', selected.has(emp.id) && 'bg-blue-50/40')}>
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.has(emp.id)} onChange={() => toggleOne(emp.id)} className="rounded border-gray-300 cursor-pointer" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={emp.avatar} alt={emp.name} />
                        <AvatarFallback className={cn('text-xs font-semibold bg-gradient-to-br', emp.bgColor, emp.iconColor)}>{emp.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0"><p className="font-medium text-gray-900 truncate">{emp.name}</p>{emp.isAssistant && <p className="text-xs text-gray-500">AI Assistant</p>}</div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', AW_STATUS_STYLE[emp.status] ?? 'bg-gray-100 text-gray-500 border-gray-200')}>{emp.status}</span></td>
                  <td className="px-4 py-3 hidden md:table-cell"><span className="text-gray-600 text-xs">{emp.type || emp.department}</span></td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-700">{emp.tasks}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-700">{emp.conversations}</td>
                  <td className="px-4 py-3 hidden lg:table-cell"><span className="text-gray-600 text-xs capitalize">{emp.scope}</span></td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-gray-100"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewEmployee(emp.id)}><Eye className="h-4 w-4 mr-2" />View profile</DropdownMenuItem>
                        <DropdownMenuItem><Settings className="h-4 w-4 mr-2" />Configure</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600"><Trash2 className="h-4 w-4 mr-2" />Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between gap-3 flex-wrap text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>{filtered.length > 0 ? `Showing ${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filtered.length)} of ${filtered.length} workers` : '0 workers'}{selected.size > 0 ? ` · ${selected.size} selected` : ''}</span>
            <div className="flex items-center gap-1.5"><span className="text-gray-400">Rows:</span><select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} className="h-6 rounded border border-gray-200 bg-white text-gray-700 text-xs px-1 focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer">{[5, 10, 15].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
          </div>
          <div className="flex items-center gap-2">
            {(search || typeFilter !== 'All Types' || statusFilter !== 'All' || scopeFilter !== 'All Scopes') && (
              <button className="text-gray-500 hover:text-gray-900 underline underline-offset-2" onClick={() => { setSearch(''); setTypeFilter('All Types'); setStatusFilter('All'); setScopeFilter('All Scopes'); setPage(1); }}>Clear filters</button>
            )}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-7 w-7 !border-gray-200 hover:!bg-gray-100 hover:!text-gray-700" disabled={safePage === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => <Button key={p} variant={p === safePage ? 'default' : 'outline'} size="icon" className={cn('h-7 w-7 text-xs', p !== safePage && '!border-gray-200 text-gray-600 hover:!bg-gray-100 hover:!text-gray-700')} onClick={() => setPage(p)}>{p}</Button>)}
                <Button variant="outline" size="icon" className="h-7 w-7 !border-gray-200 hover:!bg-gray-100 hover:!text-gray-700" disabled={safePage === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

type AIWorkersTabKey = 'workers' | 'activity';

const AIWorkersSection = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AIWorkersTabKey>('workers');
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Aria',  department: 'Sales',      status: 'Active', tasks: 12, conversations: 89,  type: 'Sales',     iconColor: 'text-pink-600',   bgColor: 'from-pink-100 to-rose-100',     scope: 'team',     avatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face' },
    { id: 2, name: 'Atlas', department: 'Operations', status: 'Active', tasks: 8,  conversations: 145, type: 'Support',   iconColor: 'text-blue-600',   bgColor: 'from-blue-100 to-cyan-100',     scope: 'team',     avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face' },
    { id: 3, name: 'Felix', department: 'Finance',    status: 'Idle',   tasks: 5,  conversations: 34,  type: 'Finance',   iconColor: 'text-green-600',  bgColor: 'from-green-100 to-emerald-100', scope: 'team',     avatar: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop&crop=face' },
    { id: 4, name: 'Maya',  department: 'Marketing',  status: 'Active', tasks: 15, conversations: 67,  type: 'Marketing', iconColor: 'text-purple-600', bgColor: 'from-purple-100 to-violet-100', scope: 'personal', avatar: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=400&fit=crop&crop=face' },
  ]);

  useEffect(() => {
    const storedAssistants = JSON.parse(localStorage.getItem('aiAssistants') || '[]');
    if (storedAssistants.length > 0) {
      const assistantEmployees = storedAssistants.map((assistant: any) => ({
        id: `assistant-${assistant.id}`,
        name: assistant.name,
        department: assistant.department,
        status: assistant.status || 'Active',
        tasks: Math.floor(Math.random() * 20) + 1,
        conversations: assistant.conversations || Math.floor(Math.random() * 100) + 1,
        type: assistant.type,
        iconColor: assistant.iconColor || 'text-indigo-600',
        bgColor: assistant.bgColor || 'from-indigo-100 to-blue-100',
        scope: assistant.scope || 'team',
        avatar: assistant.avatar || 'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=400&h=400&fit=crop&crop=face',
        isAssistant: true,
      }));
      setEmployees(prev => {
        const existingIds = new Set(prev.map(emp => emp.id));
        const newEmployees = assistantEmployees.filter((emp: any) => !existingIds.has(emp.id));
        return [...prev, ...newEmployees];
      });
    }
  }, []);

  const TABS: { key: AIWorkersTabKey; label: string; icon: React.ElementType }[] = [
    { key: 'workers',  label: 'Workers',        icon: Bot },
    { key: 'activity', label: 'Recent Activity', icon: Activity },
  ];

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">AI Workers</h2>
        <p className="text-sm text-gray-500">Manage your artificial intelligence workforce and assistants</p>
      </div>

      <div className="flex items-center border-b border-gray-200 mb-6">
        <div className="flex flex-1">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)} className={cn('flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors', activeTab === key ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>
        <Button size="sm" onClick={() => navigate('/staff/create-ai-worker')} className="mb-px bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
          <Plus className="h-3.5 w-3.5 mr-1.5" />New AI Employee
        </Button>
      </div>

      {activeTab === 'workers'  && <WorkersGrid employees={employees} onViewEmployee={id => navigate(`/ai-assistants/${id}`)} onShowCreate={() => navigate('/staff/create-ai-worker')} />}
      {activeTab === 'activity' && <WorkerActivityTable />}
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   HUMAN TEAMS SECTION
════════════════════════════════════════════════════════ */
const INITIAL_EMPLOYEES: Employee[] = [
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

const EMP_STATUS_STYLE: Record<Employee['status'], string> = {
  Active:   'bg-green-100 text-green-700 border-green-200',
  Inactive: 'bg-gray-100 text-gray-500 border-gray-200',
  'On Leave': 'bg-amber-100 text-amber-700 border-amber-200',
  Remote:   'bg-blue-100 text-blue-700 border-blue-200',
};

const DEPARTMENTS = ['All Departments', 'Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Legal', 'Customer Success', 'Design', 'Product'];
const EMP_STATUSES: Array<Employee['status'] | 'All'> = ['All', 'Active', 'Inactive', 'On Leave', 'Remote'];

const EmployeesTab = ({ showAddDialog, setShowAddDialog }: { showAddDialog: boolean; setShowAddDialog: (v: boolean) => void }) => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All Departments');
  const [statusFilter, setStatusFilter] = useState<Employee['status'] | 'All'>('All');
  const [sortField, setSortField] = useState<keyof Employee>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [empPage, setEmpPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filtered = employees
    .filter(e => {
      const q = search.toLowerCase();
      const matchSearch = !q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.role.toLowerCase().includes(q);
      const matchDept = deptFilter === 'All Departments' || e.department === deptFilter;
      const matchStatus = statusFilter === 'All' || e.status === statusFilter;
      return matchSearch && matchDept && matchStatus;
    })
    .sort((a, b) => {
      const av = String(a[sortField] ?? '').toLowerCase();
      const bv = String(b[sortField] ?? '').toLowerCase();
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const totalEmpPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(empPage, totalEmpPages);
  const pagedEmployees = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (field: keyof Employee) => {
    if (sortField === field) setSortAsc(a => !a);
    else { setSortField(field); setSortAsc(true); }
    setEmpPage(1);
  };

  const toggleAll = () => {
    if (selected.size === pagedEmployees.length) setSelected(new Set());
    else setSelected(new Set(pagedEmployees.map(e => e.id)));
  };

  const toggleOne = (id: number) => {
    setSelected(prev => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
  };

  const deleteSelected = () => { setEmployees(prev => prev.filter(e => !selected.has(e.id))); setSelected(new Set()); };
  const deleteOne = (id: number) => { setEmployees(prev => prev.filter(e => e.id !== id)); setSelected(prev => { const n = new Set(prev); n.delete(id); return n; }); };

  const stats = {
    total:   employees.length,
    active:  employees.filter(e => e.status === 'Active').length,
    onLeave: employees.filter(e => e.status === 'On Leave').length,
    remote:  employees.filter(e => e.status === 'Remote').length,
  };

  const SortIcon = ({ field }: { field: keyof Employee }) => (
    <ArrowUpDown className={cn('h-3 w-3 ml-1 inline', sortField === field ? 'text-gray-900' : 'text-gray-400')} />
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total',    value: stats.total,   color: 'text-gray-900',  bg: 'bg-gray-100' },
          { label: 'Active',   value: stats.active,  color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'On Leave', value: stats.onLeave, color: 'text-amber-700', bg: 'bg-amber-50' },
          { label: 'Remote',   value: stats.remote,  color: 'text-blue-700',  bg: 'bg-blue-50' },
        ].map(s => (
          <Card key={s.label} className={cn('border-gray-200/60', s.bg)}>
            <CardContent className="p-4"><p className="text-xs text-gray-500 mb-1">{s.label}</p><p className={cn('text-2xl font-semibold', s.color)}>{s.value}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input placeholder="Search employees…" value={search} onChange={e => { setSearch(e.target.value); setEmpPage(1); }} className="pl-9 bg-white border-gray-200" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[150px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5"><Building2 className="h-3.5 w-3.5 text-gray-400" />{deptFilter === 'All Departments' ? 'Department' : deptFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {DEPARTMENTS.map(d => <DropdownMenuItem key={d} onClick={() => { setDeptFilter(d); setEmpPage(1); }} className={cn(deptFilter === d && 'font-medium')}>{d}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[110px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5"><Filter className="h-3.5 w-3.5 text-gray-400" />{statusFilter === 'All' ? 'Status' : statusFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {EMP_STATUSES.map(s => <DropdownMenuItem key={s} onClick={() => { setStatusFilter(s); setEmpPage(1); }} className={cn(statusFilter === s && 'font-medium')}>{s === 'All' ? 'All Statuses' : s}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex-1" />
        {selected.size > 0 && (
          <Button variant="outline" size="sm" onClick={deleteSelected} className="border-red-200 text-red-600 hover:bg-red-50">
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />Delete {selected.size}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={() => setShowImportDialog(true)} className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
          <Upload className="h-3.5 w-3.5 mr-1.5" />Import
        </Button>
      </div>

      <Card className="bg-white border-gray-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="w-10 px-4 py-3"><input type="checkbox" checked={selected.size === pagedEmployees.length && pagedEmployees.length > 0} onChange={toggleAll} className="rounded border-gray-300 cursor-pointer" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('name')}>Employee <SortIcon field="name" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('status')}>Status <SortIcon field="status" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('role')}>Role <SortIcon field="role" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('department')}>Department <SortIcon field="department" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Contact</th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">No employees match your filters.</td></tr>
              ) : pagedEmployees.map(emp => (
                <tr key={emp.id} className={cn('border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors', selected.has(emp.id) && 'bg-blue-50/40')}>
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.has(emp.id)} onChange={() => toggleOne(emp.id)} className="rounded border-gray-300 cursor-pointer" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8 flex-shrink-0"><AvatarFallback className="bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 text-xs font-semibold">{emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</AvatarFallback></Avatar>
                      <div className="min-w-0"><p className="font-medium text-gray-900 truncate">{emp.name}</p><p className="text-xs text-gray-500 truncate">{emp.email}</p></div>
                    </div>
                  </td>
                  <td className="px-4 py-3"><span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', EMP_STATUS_STYLE[emp.status])}>{emp.status}</span></td>
                  <td className="px-4 py-3 text-gray-700">{emp.role}</td>
                  <td className="px-4 py-3 hidden md:table-cell"><span className="inline-flex items-center gap-1 text-gray-600 text-xs"><Building2 className="h-3 w-3 text-gray-400" />{emp.department}</span></td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <div className="space-y-0.5">
                      <p className="text-xs text-gray-500 flex items-center gap-1"><Mail className="h-3 w-3 text-gray-400" />{emp.email}</p>
                      {emp.phone && <p className="text-xs text-gray-500 flex items-center gap-1"><Phone className="h-3 w-3 text-gray-400" />{emp.phone}</p>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-gray-100"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/staff/human/${emp.id}`)}><Eye className="h-4 w-4 mr-2" />View profile</DropdownMenuItem>
                        <DropdownMenuItem><Pencil className="h-4 w-4 mr-2" />Edit</DropdownMenuItem>
                        <DropdownMenuItem><CheckSquare className="h-4 w-4 mr-2" />Assign to team</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => deleteOne(emp.id)}><Trash2 className="h-4 w-4 mr-2" />Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between gap-3 flex-wrap text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>{filtered.length > 0 ? `Showing ${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filtered.length)} of ${filtered.length} employees` : '0 employees'}{selected.size > 0 ? ` · ${selected.size} selected` : ''}</span>
            <div className="flex items-center gap-1.5"><span className="text-gray-400">Rows:</span><select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setEmpPage(1); }} className="h-6 rounded border border-gray-200 bg-white text-gray-700 text-xs px-1 focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer">{[5, 10, 15].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
          </div>
          <div className="flex items-center gap-2">
            {(deptFilter !== 'All Departments' || statusFilter !== 'All' || search) && (
              <button className="text-gray-500 hover:text-gray-900 underline underline-offset-2" onClick={() => { setSearch(''); setDeptFilter('All Departments'); setStatusFilter('All'); setEmpPage(1); }}>Clear filters</button>
            )}
            {totalEmpPages > 1 && (
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-7 w-7 !border-gray-200 hover:!bg-gray-100 hover:!text-gray-700" disabled={safePage === 1} onClick={() => setEmpPage(p => p - 1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
                {Array.from({ length: totalEmpPages }, (_, i) => i + 1).map(p => <Button key={p} variant={p === safePage ? 'default' : 'outline'} size="icon" className={cn('h-7 w-7 text-xs', p !== safePage && '!border-gray-200 text-gray-600 hover:!bg-gray-100 hover:!text-gray-700')} onClick={() => setEmpPage(p)}>{p}</Button>)}
                <Button variant="outline" size="icon" className="h-7 w-7 !border-gray-200 hover:!bg-gray-100 hover:!text-gray-700" disabled={safePage === totalEmpPages} onClick={() => setEmpPage(p => p + 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <AddEmployeeDialog open={showAddDialog} onOpenChange={setShowAddDialog} onEmployeeAdded={emp => setEmployees(prev => [emp, ...prev])} />
      <ImportEmployeesDialog open={showImportDialog} onOpenChange={setShowImportDialog} onImported={emps => setEmployees(prev => [...emps, ...prev])} />
    </div>
  );
};

const TEAMS_PAGE_SIZE = 6;

const TeamsTab = ({ onShowCreate }: { onShowCreate: () => void }) => {
  const navigate = useNavigate();
  const [teamsPage, setTeamsPage] = useState(1);
  const [teams] = useState([
    { id: 1, name: 'Sales Hybrid Team',    humanMembers: 5, aiWorkers: 3, leader: 'John Doe',     iconColor: 'text-orange-600', bgColor: 'from-orange-100 to-amber-100',  description: 'Human sales reps working alongside AI assistants' },
    { id: 2, name: 'Marketing Automation', humanMembers: 3, aiWorkers: 4, leader: 'Jane Smith',   iconColor: 'text-pink-600',   bgColor: 'from-pink-100 to-fuchsia-100', description: 'Content creation and campaign management team' },
    { id: 3, name: 'Operations Support',   humanMembers: 6, aiWorkers: 8, leader: 'Mike Johnson', iconColor: 'text-blue-600',   bgColor: 'from-blue-100 to-indigo-100',  description: 'Process automation and workflow optimization' },
    { id: 4, name: 'Customer Success',     humanMembers: 4, aiWorkers: 2, leader: 'Sarah Wilson', iconColor: 'text-green-600',  bgColor: 'from-green-100 to-teal-100',   description: '24/7 customer support with AI escalation' },
  ]);

  const handleViewTeam = (id: number) => navigate(`/teams/${id}`);

  const totalTeamsPages = Math.max(1, Math.ceil(teams.length / TEAMS_PAGE_SIZE));
  const pagedTeams = teams.slice((teamsPage - 1) * TEAMS_PAGE_SIZE, teamsPage * TEAMS_PAGE_SIZE);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pagedTeams.map(team => (
          <Card key={team.id} className="bg-white/80 border-gray-200/50 hover:shadow-lg transition-all duration-200">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${team.bgColor}`}><Users className={`h-4 w-4 ${team.iconColor}`} /></div>
                  <div><span className="font-medium">{team.name}</span><p className="text-xs text-gray-500 font-normal mt-1">{team.description}</p></div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100 h-8 w-8" onClick={() => handleViewTeam(team.id)}><Eye className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" className="hover:bg-gray-100 h-8 w-8"><Settings className="h-4 w-4" /></Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center space-x-2"><div className="p-1 rounded bg-gray-100"><Crown className="h-3 w-3 text-amber-600" /></div><span className="text-sm text-gray-700">Leader: {team.leader}</span></div>
                <div className="flex items-center space-x-2"><div className="p-1 rounded bg-gray-100"><Users className="h-3 w-3 text-blue-600" /></div><span className="text-sm text-gray-700">Human Workers: {team.humanMembers}</span></div>
                <div className="flex items-center space-x-2"><div className="p-1 rounded bg-gray-100"><Bot className="h-3 w-3 text-green-600" /></div><span className="text-sm text-gray-700">AI Workers: {team.aiWorkers}</span></div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 text-xs bg-gray-50 hover:bg-gray-100 border-gray-200" onClick={() => handleViewTeam(team.id)}><Eye className="h-3 w-3 mr-1" />View Team</Button>
                  <Button variant="outline" size="sm" className="text-xs bg-gray-50 hover:bg-gray-100 border-gray-200"><UserPlus className="h-3 w-3" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      {totalTeamsPages > 1 && (
        <div className="flex items-center justify-between mt-6 text-sm text-gray-500">
          <span>Showing {(teamsPage - 1) * TEAMS_PAGE_SIZE + 1}–{Math.min(teamsPage * TEAMS_PAGE_SIZE, teams.length)} of {teams.length} teams</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8 border-gray-200" disabled={teamsPage === 1} onClick={() => setTeamsPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            {Array.from({ length: totalTeamsPages }, (_, i) => i + 1).map(p => <Button key={p} variant={p === teamsPage ? 'default' : 'outline'} size="icon" className={cn('h-8 w-8', p !== teamsPage && 'border-gray-200 text-gray-600')} onClick={() => setTeamsPage(p)}>{p}</Button>)}
            <Button variant="outline" size="icon" className="h-8 w-8 border-gray-200" disabled={teamsPage === totalTeamsPages} onClick={() => setTeamsPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </>
  );
};

const HumanTeamsSection = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Humans</h2>
          <p className="text-sm text-gray-500">Manage hybrid teams of human workers and AI assistants</p>
        </div>
        <Button size="sm" onClick={() => setShowAddDialog(true)} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
          <UserPlus className="h-3.5 w-3.5 mr-1.5" />Add Employee
        </Button>
      </div>
      <EmployeesTab showAddDialog={showAddDialog} setShowAddDialog={setShowAddDialog} />
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   WORKER GROUPS SECTION
════════════════════════════════════════════════════════ */
type AgentActivityEntry = {
  id: number;
  group: string;
  task: string;
  status: 'Completed' | 'Failed' | 'In Progress';
  category: string;
  date: Date;
  duration: string;
};

const AGENT_ACTIVITY_DATA: AgentActivityEntry[] = [
  { id: 1,  group: 'Data Processing Agent',   task: 'Run ETL pipeline for Q1 dataset',   status: 'Completed',   category: 'Data Analysis', date: new Date(Date.now() - 1000*60*8),   duration: '4m 12s' },
  { id: 2,  group: 'Email Automation Agent',   task: 'Send weekly newsletter batch',       status: 'Completed',   category: 'Communication', date: new Date(Date.now() - 1000*60*22),  duration: '1m 55s' },
  { id: 3,  group: 'Report Generation Agent',  task: 'Compile monthly sales summary',      status: 'In Progress', category: 'Reporting',     date: new Date(Date.now() - 1000*60*40),  duration: '—'      },
  { id: 4,  group: 'Invoice Processing Agent', task: 'Validate 34 pending invoices',       status: 'Completed',   category: 'Finance',       date: new Date(Date.now() - 1000*60*55),  duration: '3m 02s' },
  { id: 5,  group: 'Data Processing Agent',    task: 'Sync CRM records to data warehouse', status: 'Completed',   category: 'Data Analysis', date: new Date(Date.now() - 1000*60*80),  duration: '6m 44s' },
  { id: 6,  group: 'Email Automation Agent',   task: 'Re-engage cold leads sequence',      status: 'Failed',      category: 'Communication', date: new Date(Date.now() - 1000*60*110), duration: '0m 31s' },
  { id: 7,  group: 'Report Generation Agent',  task: 'Generate compliance audit report',   status: 'Completed',   category: 'Reporting',     date: new Date(Date.now() - 1000*60*150), duration: '8m 20s' },
  { id: 8,  group: 'Invoice Processing Agent', task: 'Flag duplicate invoice #INV-4471',   status: 'Completed',   category: 'Finance',       date: new Date(Date.now() - 1000*60*200), duration: '0m 48s' },
  { id: 9,  group: 'Data Processing Agent',    task: 'Anonymise PII in uploaded CSVs',     status: 'Completed',   category: 'Data Analysis', date: new Date(Date.now() - 1000*60*260), duration: '2m 37s' },
  { id: 10, group: 'Email Automation Agent',   task: 'Distribute onboarding email series', status: 'Completed',   category: 'Communication', date: new Date(Date.now() - 1000*60*320), duration: '2m 05s' },
];

const A_GROUPS     = ['All Groups', 'Data Processing Agent', 'Email Automation Agent', 'Report Generation Agent', 'Invoice Processing Agent'];
const A_STATUSES   = ['All', 'Completed', 'Failed', 'In Progress'];
const A_CATEGORIES = ['All Categories', 'Data Analysis', 'Communication', 'Reporting', 'Finance'];

const AgentActivityTable = () => {
  const [search, setSearch]           = useState('');
  const [groupFilter, setGroupFilter] = useState('All Groups');
  const [statusFilter, setStatusFilter] = useState('All');
  const [catFilter, setCatFilter]     = useState('All Categories');
  const [sortField, setSortField]     = useState<keyof AgentActivityEntry>('date');
  const [sortAsc, setSortAsc]         = useState(false);
  const [page, setPage]               = useState(1);
  const [pageSize, setPageSize]       = useState(5);

  const filtered = AGENT_ACTIVITY_DATA
    .filter(a => {
      const q = search.toLowerCase();
      const matchSearch = !q || a.task.toLowerCase().includes(q) || a.group.toLowerCase().includes(q);
      const matchGroup  = groupFilter === 'All Groups'     || a.group    === groupFilter;
      const matchStatus = statusFilter === 'All'           || a.status   === statusFilter;
      const matchCat    = catFilter === 'All Categories'   || a.category === catFilter;
      return matchSearch && matchGroup && matchStatus && matchCat;
    })
    .sort((a, b) => {
      const av = String(a[sortField] ?? '').toLowerCase();
      const bv = String(b[sortField] ?? '').toLowerCase();
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (field: keyof AgentActivityEntry) => {
    if (sortField === field) setSortAsc(a => !a);
    else { setSortField(field); setSortAsc(true); }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: keyof AgentActivityEntry }) => (
    <ArrowUpDown className={cn('h-3 w-3 ml-1 inline', sortField === field ? 'text-gray-900' : 'text-gray-400')} />
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input placeholder="Search activity…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9 bg-white border-gray-200" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[140px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5"><Bot className="h-3.5 w-3.5 text-gray-400" />{groupFilter === 'All Groups' ? 'Group' : groupFilter.replace(' Agent', '')}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {A_GROUPS.map(g => <DropdownMenuItem key={g} onClick={() => { setGroupFilter(g); setPage(1); }} className={cn(groupFilter === g && 'font-medium')}>{g}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[110px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5"><Filter className="h-3.5 w-3.5 text-gray-400" />{statusFilter === 'All' ? 'Status' : statusFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {A_STATUSES.map(s => <DropdownMenuItem key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={cn(statusFilter === s && 'font-medium')}>{s === 'All' ? 'All Statuses' : s}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[130px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-gray-400" />{catFilter === 'All Categories' ? 'Category' : catFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {A_CATEGORIES.map(c => <DropdownMenuItem key={c} onClick={() => { setCatFilter(c); setPage(1); }} className={cn(catFilter === c && 'font-medium')}>{c}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Card className="bg-white border-gray-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('task')}>Task <SortIcon field="task" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('status')}>Status <SortIcon field="status" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('group')}>Agent Group <SortIcon field="group" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('category')}>Category <SortIcon field="category" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden lg:table-cell" onClick={() => toggleSort('date')}>Time <SortIcon field="date" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Duration</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">No activity matches your filters.</td></tr>
              ) : paged.map(entry => (
                <tr key={entry.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><div className="p-1.5 rounded bg-gray-100 flex-shrink-0"><Zap className="h-3.5 w-3.5 text-gray-500" /></div><span className="font-medium text-gray-900 truncate max-w-[220px]">{entry.task}</span></div></td>
                  <td className="px-4 py-3"><span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', ACTIVITY_STATUS_STYLE[entry.status])}>{entry.status}</span></td>
                  <td className="px-4 py-3 hidden md:table-cell"><div className="flex items-center gap-2"><div className="p-1 rounded bg-gray-100 flex-shrink-0"><Bot className="h-3 w-3 text-gray-500" /></div><span className="text-gray-700 text-xs">{entry.group}</span></div></td>
                  <td className="px-4 py-3 hidden md:table-cell"><span className="text-gray-600 text-xs">{entry.category}</span></td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">{formatTimeAgo(entry.date)}</td>
                  <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">{entry.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between gap-3 flex-wrap text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>{filtered.length > 0 ? `Showing ${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filtered.length)} of ${filtered.length} entries` : '0 entries'}</span>
            <div className="flex items-center gap-1.5"><span className="text-gray-400">Rows:</span><select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} className="h-6 rounded border border-gray-200 bg-white text-gray-700 text-xs px-1 focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer">{[5, 10, 15].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
          </div>
          <div className="flex items-center gap-2">
            {(search || groupFilter !== 'All Groups' || statusFilter !== 'All' || catFilter !== 'All Categories') && (
              <button className="text-gray-500 hover:text-gray-900 underline underline-offset-2" onClick={() => { setSearch(''); setGroupFilter('All Groups'); setStatusFilter('All'); setCatFilter('All Categories'); setPage(1); }}>Clear filters</button>
            )}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-7 w-7 !border-gray-200 hover:!bg-gray-100 hover:!text-gray-700" disabled={safePage === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => <Button key={p} variant={p === safePage ? 'default' : 'outline'} size="icon" className={cn('h-7 w-7 text-xs', p !== safePage && '!border-gray-200 text-gray-600 hover:!bg-gray-100 hover:!text-gray-700')} onClick={() => setPage(p)}>{p}</Button>)}
                <Button variant="outline" size="icon" className="h-7 w-7 !border-gray-200 hover:!bg-gray-100 hover:!text-gray-700" disabled={safePage === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

/* ─── Worker Groups — list/table tab ──────────────────────── */
type AgentEntry = {
  id: number;
  name: string;
  purpose: string;
  executions: number;
  efficiency: string;
};

const AG_PURPOSES = ['All Purposes', 'Data Analysis', 'Communication', 'Reporting', 'Finance'];

const AgentsListTab = ({ agents, onShowCreate }: { agents: any[]; onShowCreate: () => void }) => {
  const [search, setSearch]             = useState('');
  const [purposeFilter, setPurposeFilter] = useState('All Purposes');
  const [sortField, setSortField]       = useState<keyof AgentEntry>('name');
  const [sortAsc, setSortAsc]           = useState(true);
  const [page, setPage]                 = useState(1);
  const [pageSize, setPageSize]         = useState(5);
  const [selected, setSelected]         = useState<Set<number>>(new Set());

  const filtered = agents
    .filter(a => {
      const q = search.toLowerCase();
      const matchSearch  = !q || a.name.toLowerCase().includes(q) || a.purpose.toLowerCase().includes(q);
      const matchPurpose = purposeFilter === 'All Purposes' || a.purpose === purposeFilter;
      return matchSearch && matchPurpose;
    })
    .sort((a, b) => {
      const av = String((a as any)[sortField] ?? '').toLowerCase();
      const bv = String((b as any)[sortField] ?? '').toLowerCase();
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (field: keyof AgentEntry) => {
    if (sortField === field) setSortAsc(a => !a);
    else { setSortField(field); setSortAsc(true); }
    setPage(1);
  };

  const toggleAll = () => {
    if (selected.size === paged.length) setSelected(new Set());
    else setSelected(new Set(paged.map(a => a.id)));
  };
  const toggleOne = (id: number) => {
    setSelected(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  };

  const totalExec = agents.reduce((s, a) => s + (a.executions || 0), 0);
  const avgEff    = agents.length
    ? Math.round(agents.reduce((s, a) => s + (parseFloat(a.efficiency) || 0), 0) / agents.length) + '%'
    : '—';

  const SortIcon = ({ field }: { field: keyof AgentEntry }) => (
    <ArrowUpDown className={cn('h-3 w-3 ml-1 inline', sortField === field ? 'text-gray-900' : 'text-gray-400')} />
  );

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Agents',      value: agents.length, color: 'text-gray-900',  bg: 'bg-gray-100' },
          { label: 'Total Executions',  value: totalExec,     color: 'text-blue-700',  bg: 'bg-blue-50'  },
          { label: 'Avg Efficiency',    value: avgEff,        color: 'text-green-700', bg: 'bg-green-50' },
          { label: 'Categories',        value: new Set(agents.map(a => a.purpose)).size, color: 'text-violet-700', bg: 'bg-violet-50' },
        ].map(s => (
          <Card key={s.label} className={cn('border-gray-200/60', s.bg)}>
            <CardContent className="p-4"><p className="text-xs text-gray-500 mb-1">{s.label}</p><p className={cn('text-2xl font-semibold', s.color)}>{s.value}</p></CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input placeholder="Search agent groups…" value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} className="pl-9 bg-white border-gray-200" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[130px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5"><Activity className="h-3.5 w-3.5 text-gray-400" />{purposeFilter === 'All Purposes' ? 'Purpose' : purposeFilter}</span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {AG_PURPOSES.map(p => <DropdownMenuItem key={p} onClick={() => { setPurposeFilter(p); setPage(1); }} className={cn(purposeFilter === p && 'font-medium')}>{p}</DropdownMenuItem>)}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex-1" />
        <Button size="sm" onClick={onShowCreate} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white">
          <Plus className="h-3.5 w-3.5 mr-1.5" />Deploy Agent
        </Button>
      </div>

      <Card className="bg-white border-gray-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="w-10 px-4 py-3"><input type="checkbox" checked={selected.size === paged.length && paged.length > 0} onChange={toggleAll} className="rounded border-gray-300 cursor-pointer" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('name')}>Agent Group <SortIcon field="name" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('purpose')}>Purpose <SortIcon field="purpose" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('executions')}>Executions <SortIcon field="executions" /></th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden lg:table-cell" onClick={() => toggleSort('efficiency')}>Efficiency <SortIcon field="efficiency" /></th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">No agent groups match your filters.</td></tr>
              ) : paged.map(agent => (
                <tr key={agent.id} className={cn('border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors', selected.has(agent.id) && 'bg-blue-50/40')}>
                  <td className="px-4 py-3"><input type="checkbox" checked={selected.has(agent.id)} onChange={() => toggleOne(agent.id)} className="rounded border-gray-300 cursor-pointer" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className={cn('p-2 rounded-lg bg-gradient-to-br flex-shrink-0', agent.bgColor)}><Bot className={cn('h-4 w-4', agent.iconColor)} /></div>
                      <span className="font-medium text-gray-900">{agent.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell"><span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{agent.purpose}</span></td>
                  <td className="px-4 py-3 hidden md:table-cell text-gray-700">{agent.executions.toLocaleString()}</td>
                  <td className="px-4 py-3 hidden lg:table-cell">
                    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', agent.efficiency === 'N/A' ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-green-100 text-green-700 border-green-200')}>{agent.efficiency}</span>
                  </td>
                  <td className="px-4 py-3">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-gray-100"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem><Settings className="h-4 w-4 mr-2" />Configure</DropdownMenuItem>
                        <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />Monitor</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600"><Trash2 className="h-4 w-4 mr-2" />Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between gap-3 flex-wrap text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>{filtered.length > 0 ? `Showing ${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filtered.length)} of ${filtered.length} agents` : '0 agents'}{selected.size > 0 ? ` · ${selected.size} selected` : ''}</span>
            <div className="flex items-center gap-1.5"><span className="text-gray-400">Rows:</span><select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} className="h-6 rounded border border-gray-200 bg-white text-gray-700 text-xs px-1 focus:outline-none focus:ring-1 focus:ring-gray-300 cursor-pointer">{[5, 10, 15].map(n => <option key={n} value={n}>{n}</option>)}</select></div>
          </div>
          <div className="flex items-center gap-2">
            {(search || purposeFilter !== 'All Purposes') && (
              <button className="text-gray-500 hover:text-gray-900 underline underline-offset-2" onClick={() => { setSearch(''); setPurposeFilter('All Purposes'); setPage(1); }}>Clear filters</button>
            )}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className="h-7 w-7 !border-gray-200 hover:!bg-gray-100 hover:!text-gray-700" disabled={safePage === 1} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-3.5 w-3.5" /></Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => <Button key={p} variant={p === safePage ? 'default' : 'outline'} size="icon" className={cn('h-7 w-7 text-xs', p !== safePage && '!border-gray-200 text-gray-600 hover:!bg-gray-100 hover:!text-gray-700')} onClick={() => setPage(p)}>{p}</Button>)}
                <Button variant="outline" size="icon" className="h-7 w-7 !border-gray-200 hover:!bg-gray-100 hover:!text-gray-700" disabled={safePage === totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-3.5 w-3.5" /></Button>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

const WorkerGroupsGrid = ({ agents }: { agents: any[] }) => (
  <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map(agent => (
        <Card key={agent.id} className="bg-white/80 border-gray-200/50 hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${agent.bgColor}`}><Bot className={`h-4 w-4 ${agent.iconColor}`} /></div>
                <span className="font-medium">{agent.name}</span>
              </div>
              <Button variant="ghost" size="icon" className="hover:bg-muted"><Settings className="h-4 w-4" /></Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{agent.purpose}</span>
              <div className="flex items-center space-x-2"><div className="p-1 rounded bg-muted"><Activity className="h-3 w-3 text-blue-600" /></div><span className="text-sm text-muted-foreground">Executions: {agent.executions}</span></div>
              <div className="flex items-center space-x-2"><div className="p-1 rounded bg-muted"><Zap className="h-3 w-3 text-green-600" /></div><span className="text-sm text-muted-foreground">Efficiency: {agent.efficiency}</span></div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1 text-xs">Configure</Button>
                <Button variant="outline" size="sm" className="flex-1 text-xs">Monitor</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </>
);

type WorkerGroupsTabKey = 'groups' | 'activity';

const WorkerGroupsSection = () => {
  const [activeTab, setActiveTab] = useState<WorkerGroupsTabKey>('groups');
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false);

  const TABS: { key: WorkerGroupsTabKey; label: string; icon: React.ElementType }[] = [
    { key: 'groups',   label: 'Teams',          icon: Users },
    { key: 'activity', label: 'Recent Activity', icon: Activity },
  ];

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Teams</h2>
        <p className="text-sm text-gray-500">Manage hybrid teams of human workers and AI assistants</p>
      </div>
      <div className="flex items-center justify-between border-b border-gray-200 mb-6">
        <div className="flex">
          {TABS.map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveTab(key)} className={cn('flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors', activeTab === key ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>
        {activeTab === 'groups' && (
          <Button size="icon" onClick={() => setShowCreateTeamDialog(true)} className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 mb-1 h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>
      {activeTab === 'groups'   && <TeamsTab onShowCreate={() => setShowCreateTeamDialog(true)} />}
      {activeTab === 'activity' && <AgentActivityTable />}
      <CreateTeamDialog open={showCreateTeamDialog} onOpenChange={setShowCreateTeamDialog} onTeamCreated={() => {}} />
    </>
  );
};

/* ═══════════════════════════════════════════════════════
   STAFF PAGE — combined switcher
════════════════════════════════════════════════════════ */

const SECTIONS: { key: Section; label: string; icon: React.ElementType }[] = [
  { key: 'ai-workers',    label: 'AI Workers',    icon: Bot },
  { key: 'human-teams',   label: 'Humans',   icon: Users },
  { key: 'worker-groups', label: 'Teams', icon: Zap },
];

const Staff = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<Section>('ai-workers');
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') || sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') { navigate('/login'); }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(30,25%,97%)]">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col bg-white">
            <main className="flex-1 p-6">

              {/* Page header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Staff</h1>
                <p className="text-gray-600">Manage your entire workforce — AI workers, human teams, and agent groups</p>
              </div>

              {/* Section switcher */}
              <div className="inline-flex items-center bg-gray-100 rounded-xl p-1 mb-8 gap-1">
                {SECTIONS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveSection(key)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                      activeSection === key
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Section content */}
              {activeSection === 'ai-workers'    && <AIWorkersSection />}
              {activeSection === 'human-teams'   && <HumanTeamsSection />}
              {activeSection === 'worker-groups' && <WorkerGroupsSection />}

            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
      <CreateTeamDialog
        open={showCreateTeamDialog}
        onOpenChange={setShowCreateTeamDialog}
        onTeamCreated={() => setActiveSection('human-teams')}
      />
    </div>
  );
};

export default Staff;
