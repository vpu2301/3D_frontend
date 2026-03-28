
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
  Completed:   'bg-green-100 text-green-700 border-green-200',
  Failed:      'bg-red-100 text-red-700 border-red-200',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
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
    <ArrowUpDown className={cn('h-3 w-3 ml-1 inline', sortField === field ? 'text-gray-900' : 'text-gray-400')} />
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search activity…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 bg-white border-gray-200"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[130px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5">
                <Bot className="h-3.5 w-3.5 text-gray-400" />
                {workerFilter === 'All Workers' ? 'Worker' : workerFilter}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
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
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[110px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-gray-400" />
                {statusFilter === 'All' ? 'Status' : statusFilter}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
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
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[110px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-gray-400" />
                {typeFilter === 'All Types' ? 'Type' : typeFilter}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
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
      <Card className="bg-white border-gray-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('task')}>
                  Task <SortIcon field="task" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('status')}>
                  Status <SortIcon field="status" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('worker')}>
                  Worker <SortIcon field="worker" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('type')}>
                  Type <SortIcon field="type" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden lg:table-cell" onClick={() => toggleSort('date')}>
                  Time <SortIcon field="date" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Duration</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No activity matches your filters.
                  </td>
                </tr>
              ) : (
                paged.map(entry => (
                  <tr key={entry.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded bg-gray-100 flex-shrink-0">
                          <Activity className="h-3.5 w-3.5 text-gray-500" />
                        </div>
                        <span className="font-medium text-gray-900 truncate max-w-[220px]">{entry.task}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', ACTIVITY_STATUS_STYLE[entry.status])}>
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-semibold text-gray-600">{entry.worker[0]}</span>
                        </div>
                        <span className="text-gray-700">{entry.worker}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-gray-600 text-xs">{entry.type}</span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">
                      {formatTimeAgo(entry.date)}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">
                      {entry.duration}
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
            {(search || workerFilter !== 'All Workers' || statusFilter !== 'All' || typeFilter !== 'All Types') && (
              <button
                className="text-gray-500 hover:text-gray-900 underline underline-offset-2"
                onClick={() => { setSearch(''); setWorkerFilter('All Workers'); setStatusFilter('All'); setTypeFilter('All Types'); setPage(1); }}
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

/* ── Workers grid ── */
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {employees.map((employee) => (
        <Card key={employee.id} className="bg-white/80 border-gray-200/50 hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={employee.avatar} alt={employee.name} />
                    <AvatarFallback className={`bg-gradient-to-br ${employee.bgColor} ${employee.iconColor} font-medium`}>
                      {employee.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className={`absolute -bottom-1 -right-1 p-1 rounded-full bg-gradient-to-br ${employee.bgColor}`}>
                    <Bot className={`h-3 w-3 ${employee.iconColor}`} />
                  </div>
                </div>
                <div>
                  <span className="font-medium">{employee.name}</span>
                  {employee.isAssistant && (
                    <span className="block text-xs text-gray-600 font-normal">AI Assistant</span>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" className="hover:bg-gray-100 h-8 w-8" onClick={() => onViewEmployee(employee.id)}>
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="hover:bg-gray-100 h-8 w-8">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-xs">
                  {employee.type || employee.department}
                </Badge>
                <div className="flex items-center space-x-1">
                  {employee.scope === 'team' ? (
                    <Building className="h-3 w-3 text-gray-600" />
                  ) : (
                    <Users className="h-3 w-3 text-gray-600" />
                  )}
                  <span className="text-xs text-gray-600 capitalize">{employee.scope}</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded bg-gray-100">
                  <Activity className="h-3 w-3 text-gray-600" />
                </div>
                <span className={`text-sm font-medium ${employee.status === 'Active' ? 'text-green-700' : 'text-amber-700'}`}>
                  {employee.status}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded bg-gray-100">
                  <MessageCircle className="h-3 w-3 text-gray-600" />
                </div>
                <span className="text-sm text-gray-700">Conversations: {employee.conversations}</span>
              </div>
              <p className="text-sm text-gray-700">Active Tasks: {employee.tasks}</p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 text-xs bg-gray-50 hover:bg-gray-100 border-gray-200"
                  onClick={() => onViewEmployee(employee.id)}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="text-xs bg-gray-50 hover:bg-gray-100 border-gray-200">
                  <Settings className="h-3 w-3" />
                </Button>
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
        <Button
          onClick={onShowCreate}
          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
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
    <div className="min-h-screen flex flex-col bg-[hsl(30,25%,97%)]">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <main className="flex-1 p-6">

              {/* Page header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">AI Workers</h1>
                  <p className="text-gray-600">Manage your artificial intelligence workforce and assistants</p>
                </div>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add AI Worker
                </Button>
              </div>

              {/* Horizontal tab nav */}
              <div className="flex border-b border-gray-200 mb-6">
                {TABS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => setActiveTab(key)}
                    className={cn(
                      'flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 -mb-px transition-colors',
                      activeTab === key
                        ? 'border-gray-900 text-gray-900'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    )}
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
