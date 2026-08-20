
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
  ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import CreateAssistantDialog from '@/components/CreateAssistantDialog';
import { cn } from '@/lib/utils';

/* Shared presentation classes (platform design system). */
const PANEL = '!rounded-[14px] !border !border-[color:var(--line-soft)] !bg-white !shadow-none';
const GHOST =
  'plat-btn-ghost !rounded-full !bg-transparent !border-[color:var(--line)] !text-[color:var(--text-2)] hover:!bg-transparent hover:!border-[color:var(--ink)] hover:!text-[color:var(--ink)]';

type TabKey = 'workers' | 'activity';

/* ── Recent Activity data ── */
type ActivityEntry = {
  id: number;
  worker: string;
  task: string;
  status: 'Completed' | 'Failed' | 'In Progress';
  type: string;
  date: Date;
  duration: string;
};

const ACTIVITY_STATUS_STYLE: Record<string, string> = {
  Completed:   'plat-pill-ok',
  Failed:      'bg-[color:var(--warn-bg)] text-[color:var(--bad-fg)]',
  'In Progress': 'bg-[color:var(--blue-100)] text-[color:var(--blue)]',
};

const ACTIVITY_DATA: ActivityEntry[] = [
  { id: 1,  worker: 'Aria',  task: 'Qualify inbound leads from CRM',    status: 'Completed',   type: 'Sales',      date: new Date(Date.now() - 1000*60*12),   duration: '3m 42s' },
  { id: 2,  worker: 'Atlas', task: 'Process support ticket batch #1142', status: 'Completed',   type: 'Support',    date: new Date(Date.now() - 1000*60*28),   duration: '7m 05s' },
  { id: 3,  worker: 'Felix', task: 'Reconcile monthly invoices',         status: 'In Progress', type: 'Finance',    date: new Date(Date.now() - 1000*60*45),   duration: '—'      },
  { id: 4,  worker: 'Maya',  task: 'Generate social media content brief',status: 'Completed',   type: 'Marketing',  date: new Date(Date.now() - 1000*60*60),   duration: '2m 18s' },
  { id: 5,  worker: 'Aria',  task: 'Send follow-up emails to pipeline',  status: 'Completed',   type: 'Sales',      date: new Date(Date.now() - 1000*60*90),   duration: '1m 55s' },
  { id: 6,  worker: 'Atlas', task: 'Escalate VIP ticket #9023',          status: 'Failed',      type: 'Support',    date: new Date(Date.now() - 1000*60*120),  duration: '0m 44s' },
  { id: 7,  worker: 'Felix', task: 'Prepare Q1 expense report',          status: 'Completed',   type: 'Finance',    date: new Date(Date.now() - 1000*60*180),  duration: '5m 30s' },
  { id: 8,  worker: 'Maya',  task: 'Analyse campaign performance data',  status: 'Completed',   type: 'Marketing',  date: new Date(Date.now() - 1000*60*240),  duration: '4m 10s' },
  { id: 9,  worker: 'Aria',  task: 'Update lead scoring model inputs',   status: 'Completed',   type: 'Sales',      date: new Date(Date.now() - 1000*60*300),  duration: '2m 03s' },
  { id: 10, worker: 'Atlas', task: 'Generate weekly support digest',     status: 'Completed',   type: 'Support',    date: new Date(Date.now() - 1000*60*360),  duration: '1m 47s' },
];

const ACTIVITY_WORKERS  = ['All Workers', 'Aria', 'Atlas', 'Felix', 'Maya'];
const ACTIVITY_STATUSES = ['All', 'Completed', 'Failed', 'In Progress'];
const ACTIVITY_TYPES    = ['All Types', 'Sales', 'Support', 'Finance', 'Marketing'];

function formatTimeAgo(date: Date) {
  const mins = Math.floor((Date.now() - date.getTime()) / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const ActivityTable = () => {
  const [search, setSearch]               = useState('');
  const [workerFilter, setWorkerFilter]   = useState('All Workers');
  const [statusFilter, setStatusFilter]   = useState('All');
  const [typeFilter, setTypeFilter]       = useState('All Types');
  const [sortField, setSortField]         = useState<keyof ActivityEntry>('date');
  const [sortAsc, setSortAsc]             = useState(false);
  const [page, setPage]                   = useState(1);
  const [pageSize, setPageSize]           = useState(5);

  const filtered = ACTIVITY_DATA
    .filter(a => {
      const q = search.toLowerCase();
      const matchSearch = !q || a.task.toLowerCase().includes(q) || a.worker.toLowerCase().includes(q);
      const matchWorker = workerFilter === 'All Workers' || a.worker === workerFilter;
      const matchStatus = statusFilter === 'All' || a.status === statusFilter;
      const matchType   = typeFilter === 'All Types'    || a.type   === typeFilter;
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

  const toggleSort = (field: keyof ActivityEntry) => {
    if (sortField === field) setSortAsc(a => !a);
    else { setSortField(field); setSortAsc(true); }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: keyof ActivityEntry }) => (
    <ArrowUpDown className="h-3 w-3 ml-1 inline" style={{ color: sortField === field ? 'var(--ink)' : 'var(--text-5)' }} />
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: 'var(--text-5)' }} />
          <Input
            placeholder="Search activity…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 !rounded-[10px] !bg-white !border-[color:var(--line)]"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={cn(GHOST, '!h-9 min-w-[130px] justify-between !text-xs')}>
              <span className="flex items-center gap-1.5">
                <Bot className="h-3.5 w-3.5" style={{ color: 'var(--text-5)' }} />
                {workerFilter === 'All Workers' ? 'Worker' : workerFilter}
              </span>
              <ChevronDown className="h-3.5 w-3.5 ml-2" style={{ color: 'var(--text-5)' }} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            {ACTIVITY_WORKERS.map(w => (
              <DropdownMenuItem key={w} onClick={() => { setWorkerFilter(w); setPage(1); }} className={cn(workerFilter === w && 'font-medium')}>
                {w}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={cn(GHOST, '!h-9 min-w-[110px] justify-between !text-xs')}>
              <span className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5" style={{ color: 'var(--text-5)' }} />
                {statusFilter === 'All' ? 'Status' : statusFilter}
              </span>
              <ChevronDown className="h-3.5 w-3.5 ml-2" style={{ color: 'var(--text-5)' }} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {ACTIVITY_STATUSES.map(s => (
              <DropdownMenuItem key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={cn(statusFilter === s && 'font-medium')}>
                {s === 'All' ? 'All Statuses' : s}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={cn(GHOST, '!h-9 min-w-[110px] justify-between !text-xs')}>
              <span className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5" style={{ color: 'var(--text-5)' }} />
                {typeFilter === 'All Types' ? 'Type' : typeFilter}
              </span>
              <ChevronDown className="h-3.5 w-3.5 ml-2" style={{ color: 'var(--text-5)' }} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {ACTIVITY_TYPES.map(t => (
              <DropdownMenuItem key={t} onClick={() => { setTypeFilter(t); setPage(1); }} className={cn(typeFilter === t && 'font-medium')}>
                {t}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <Card className={cn(PANEL, 'overflow-hidden')}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--sand)', borderBottom: '1px solid var(--line-soft)' }}>
                <th className="text-left px-4 py-3 font-medium cursor-pointer select-none" style={{ color: 'var(--text-3)' }} onClick={() => toggleSort('task')}>
                  Task <SortIcon field="task" />
                </th>
                <th className="text-left px-4 py-3 font-medium cursor-pointer select-none" style={{ color: 'var(--text-3)' }} onClick={() => toggleSort('status')}>
                  Status <SortIcon field="status" />
                </th>
                <th className="text-left px-4 py-3 font-medium cursor-pointer select-none hidden md:table-cell" style={{ color: 'var(--text-3)' }} onClick={() => toggleSort('worker')}>
                  Worker <SortIcon field="worker" />
                </th>
                <th className="text-left px-4 py-3 font-medium cursor-pointer select-none hidden md:table-cell" style={{ color: 'var(--text-3)' }} onClick={() => toggleSort('type')}>
                  Type <SortIcon field="type" />
                </th>
                <th className="text-left px-4 py-3 font-medium cursor-pointer select-none hidden lg:table-cell" style={{ color: 'var(--text-3)' }} onClick={() => toggleSort('date')}>
                  Time <SortIcon field="date" />
                </th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell" style={{ color: 'var(--text-3)' }}>Duration</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--text-5)' }}>
                    No activity matches your filters.
                  </td>
                </tr>
              ) : (
                paged.map(entry => (
                  <tr
                    key={entry.id}
                    className="last:border-b-0 transition-colors hover:bg-[rgba(20,22,26,0.02)]"
                    style={{ borderBottom: '1px solid var(--line-soft)' }}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="p-1.5 rounded-[8px] flex-shrink-0"
                          style={{ background: 'var(--sand)', color: 'var(--text-4)' }}
                        >
                          <Activity className="h-3.5 w-3.5" strokeWidth={1.75} />
                        </div>
                        <span className="font-medium truncate max-w-[220px]" style={{ color: 'var(--ink)' }}>{entry.task}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('plat-pill', ACTIVITY_STATUS_STYLE[entry.status])}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: 'var(--sand-deep)' }}
                        >
                          <span className="text-xs font-semibold" style={{ color: 'var(--text-2)' }}>{entry.worker[0]}</span>
                        </div>
                        <span style={{ color: 'var(--text-2)' }}>{entry.worker}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs" style={{ color: 'var(--text-3)' }}>{entry.type}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs" style={{ color: 'var(--text-4)' }}>
                      {formatTimeAgo(entry.date)}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs" style={{ color: 'var(--text-4)' }}>
                      {entry.duration}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          className="px-4 py-3 flex items-center justify-between gap-3 flex-wrap text-xs"
          style={{ color: 'var(--text-4)', background: 'var(--sand)', borderTop: '1px solid var(--line-soft)' }}
        >
          <div className="flex items-center gap-3">
            <span>
              {filtered.length > 0
                ? `Showing ${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filtered.length)} of ${filtered.length} entries`
                : '0 entries'}
            </span>
            <div className="flex items-center gap-1.5">
              <span style={{ color: 'var(--text-5)' }}>Rows:</span>
              <select
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }}
                className="h-6 rounded-[8px] bg-white text-xs px-1 focus:outline-none cursor-pointer"
                style={{ border: '1px solid var(--line)', color: 'var(--text-2)' }}
              >
                {[5, 10, 15].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(search || workerFilter !== 'All Workers' || statusFilter !== 'All' || typeFilter !== 'All Types') && (
              <button
                className="underline underline-offset-2"
                style={{ color: 'var(--text-3)' }}
                onClick={() => { setSearch(''); setWorkerFilter('All Workers'); setStatusFilter('All'); setTypeFilter('All Types'); setPage(1); }}
              >
                Clear filters
              </button>
            )}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button variant="outline" size="icon" className={cn(GHOST, 'h-7 w-7')} disabled={safePage === 1} onClick={() => setPage(p => p - 1)}>
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Button key={p} variant={p === safePage ? 'default' : 'outline'} size="icon" className={cn('h-7 w-7 text-xs', p !== safePage && GHOST)} onClick={() => setPage(p)}>
                    {p}
                  </Button>
                ))}
                <Button variant="outline" size="icon" className={cn(GHOST, 'h-7 w-7')} disabled={safePage === totalPages} onClick={() => setPage(p => p + 1)}>
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

/* ── Workers list — one panel, hairline-separated rows ── */
const WorkersGrid = ({
  employees,
  onViewEmployee,
  onShowCreate,
}: {
  employees: any[];
  onViewEmployee: (id: string | number) => void;
  onShowCreate: () => void;
}) => (
  <>
    <div className="plat-list">
      {employees.map((employee) => (
        <div key={employee.id} className="plat-row !items-center !gap-4 !px-5 !py-4">
          <div className="relative flex-shrink-0">
            <Avatar className="h-12 w-12">
              <AvatarImage src={employee.avatar} alt={employee.name} />
              <AvatarFallback className={`bg-gradient-to-br ${employee.bgColor} ${employee.iconColor} font-medium`}>
                {employee.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div
              className="absolute -bottom-1 -right-1 p-1 rounded-full"
              style={{ background: 'var(--sand-deep)', color: 'var(--ink)', boxShadow: '0 0 0 2px var(--paper)' }}
            >
              <Bot className="h-3 w-3" strokeWidth={1.75} />
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="plat-row-title">{employee.name}</span>
              {employee.isAssistant && (
                <span className="text-xs" style={{ color: 'var(--text-4)' }}>AI Assistant</span>
              )}
              <span className={cn('plat-pill', employee.status === 'Active' ? 'plat-pill-ok' : 'plat-pill-warn')}>
                {employee.status}
              </span>
            </div>
            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--text-3)' }}>
              <Badge
                variant="outline"
                className="text-xs !rounded-full !border-[color:var(--line)] !bg-transparent !text-[color:var(--text-3)] !font-medium"
              >
                {employee.type || employee.department}
              </Badge>
              <span className="inline-flex items-center gap-1.5">
                {employee.scope === 'team' ? (
                  <Building className="h-3 w-3" style={{ color: 'var(--text-5)' }} />
                ) : (
                  <Users className="h-3 w-3" style={{ color: 'var(--text-5)' }} />
                )}
                <span className="capitalize">{employee.scope}</span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MessageCircle className="h-3 w-3" style={{ color: 'var(--text-5)' }} />
                Conversations: {employee.conversations}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Activity className="h-3 w-3" style={{ color: 'var(--text-5)' }} />
                Active Tasks: {employee.tasks}
              </span>
            </div>
          </div>

          <div className="ml-auto flex flex-shrink-0 items-center gap-1.5">
            <Button variant="ghost" size="icon" className="h-8 w-8 !rounded-[10px]" onClick={() => onViewEmployee(employee.id)}>
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 !rounded-[10px]">
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className={cn(GHOST, '!h-8 !px-3.5 !text-xs')}
              onClick={() => onViewEmployee(employee.id)}
            >
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </Button>
            <Button variant="outline" size="sm" className={cn(GHOST, '!h-8 !px-3 !text-xs')}>
              <Settings className="h-3 w-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>

    {employees.length === 0 && (
      <div className="text-center py-12">
        <Bot className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--text-5)' }} strokeWidth={1.25} />
        <h3 className="text-lg mb-2">No AI employees yet</h3>
        <p className="mb-4 text-sm" style={{ color: 'var(--text-4)' }}>Create your first AI employee to get started</p>
        <Button
          onClick={onShowCreate}
          className="plat-btn"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add AI Employee
        </Button>
      </div>
    )}
  </>
);

/* ── Page ── */
const AIEmployees = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('workers');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [employees, setEmployees] = useState([
    { id: 1, name: 'Aria',  department: 'Sales',     status: 'Active', tasks: 12, conversations: 89,  type: 'Sales',     iconColor: 'text-pink-600',   bgColor: 'from-pink-100 to-rose-100',     scope: 'team',     avatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face' },
    { id: 2, name: 'Atlas', department: 'Operations',status: 'Active', tasks: 8,  conversations: 145, type: 'Support',   iconColor: 'text-blue-600',   bgColor: 'from-blue-100 to-cyan-100',     scope: 'team',     avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face' },
    { id: 3, name: 'Felix', department: 'Finance',   status: 'Idle',   tasks: 5,  conversations: 34,  type: 'Finance',   iconColor: 'text-green-600',  bgColor: 'from-green-100 to-emerald-100', scope: 'team',     avatar: 'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop&crop=face' },
    { id: 4, name: 'Maya',  department: 'Marketing', status: 'Active', tasks: 15, conversations: 67,  type: 'Marketing', iconColor: 'text-purple-600', bgColor: 'from-purple-100 to-violet-100', scope: 'personal', avatar: 'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=400&fit=crop&crop=face' },
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') { navigate('/login'); return; }

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
        isAssistant: true
      }));
      setEmployees(prev => {
        const existingIds = new Set(prev.map(emp => emp.id));
        const newEmployees = assistantEmployees.filter((emp: any) => !existingIds.has(emp.id));
        return [...prev, ...newEmployees];
      });
    }
  }, [navigate]);

  const handleEmployeeCreated = (newEmployee: any) => {
    const gradientOptions = [
      { iconColor: 'text-violet-600', bgColor: 'from-violet-100 to-purple-100' },
      { iconColor: 'text-emerald-600', bgColor: 'from-emerald-100 to-teal-100' },
      { iconColor: 'text-amber-600', bgColor: 'from-amber-100 to-yellow-100' },
      { iconColor: 'text-rose-600', bgColor: 'from-rose-100 to-pink-100' },
      { iconColor: 'text-cyan-600', bgColor: 'from-cyan-100 to-blue-100' },
    ];
    const avatarOptions = [
      'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1535268647677-300dbf3d78d1?w=400&h=400&fit=crop&crop=face',
      'https://images.unsplash.com/photo-1501286353178-1ec881214838?w=400&h=400&fit=crop&crop=face',
    ];
    const colorScheme = gradientOptions[employees.length % gradientOptions.length];
    const selectedAvatar = avatarOptions[employees.length % avatarOptions.length];
    const employeeWithGradient = {
      ...newEmployee,
      ...colorScheme,
      avatar: selectedAvatar,
      tasks: Math.floor(Math.random() * 20) + 1,
      conversations: Math.floor(Math.random() * 100) + 1,
    };
    setEmployees(prev => [...prev, employeeWithGradient]);
    const storedAssistants = JSON.parse(localStorage.getItem('aiAssistants') || '[]');
    localStorage.setItem('aiAssistants', JSON.stringify([...storedAssistants, employeeWithGradient]));
  };

  const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'workers',  label: 'Workers',         icon: Bot },
    { key: 'activity', label: 'Recent Activity',  icon: Activity },
  ];

  return (
    <div className="plat min-h-screen flex flex-col">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col bg-transparent">
            <main className="flex-1 p-6">

              {/* Page header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="plat-crumb">3days.employees</p>
                  <h1 className="mt-1 text-3xl">AI Workers</h1>
                  <p className="mt-1 text-sm" style={{ color: 'var(--text-4)' }}>Manage your artificial intelligence workforce and assistants</p>
                </div>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="plat-btn"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add AI Worker
                </Button>
              </div>

              {/* Horizontal tab nav */}
              <div className="flex mb-6" style={{ borderBottom: '1px solid var(--line-soft)' }}>
                {TABS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className="flex items-center gap-2 px-5 py-3 text-sm font-medium -mb-px transition-colors"
                    style={{
                      borderBottom: `2px solid ${activeTab === key ? 'var(--ink)' : 'transparent'}`,
                      color: activeTab === key ? 'var(--ink)' : 'var(--text-4)',
                    }}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              {activeTab === 'workers' && (
                <WorkersGrid
                  employees={employees}
                  onViewEmployee={id => navigate(`/ai-assistants/${id}`)}
                  onShowCreate={() => setShowCreateDialog(true)}
                />
              )}
              {activeTab === 'activity' && <ActivityTable />}

            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>

      <CreateAssistantDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        onAssistantCreated={handleEmployeeCreated}
      />
    </div>
  );
};

export default AIEmployees;
