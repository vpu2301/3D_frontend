
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Bot, Plus, Settings, Activity, Eye, Zap,
  Search, Filter, ArrowUpDown, ChevronDown,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import CreateAgentWizard from '@/components/dashboard/CreateAgentWizard';
import { cn } from '@/lib/utils';

type TabKey = 'groups' | 'activity';

/* ── Recent Activity data ── */
type ActivityEntry = {
  id: number;
  group: string;
  task: string;
  status: 'Completed' | 'Failed' | 'In Progress';
  category: string;
  date: Date;
  duration: string;
};

const ACTIVITY_STATUS_STYLE: Record<string, string> = {
  Completed:     'bg-green-100 text-green-700 border-green-200',
  Failed:        'bg-red-100 text-red-700 border-red-200',
  'In Progress': 'bg-blue-100 text-blue-700 border-blue-200',
};

const ACTIVITY_DATA: ActivityEntry[] = [
  { id: 1,  group: 'Data Processing Agent',   task: 'Run ETL pipeline for Q1 dataset',       status: 'Completed',   category: 'Data Analysis',      date: new Date(Date.now() - 1000*60*8),   duration: '4m 12s' },
  { id: 2,  group: 'Email Automation Agent',   task: 'Send weekly newsletter batch',           status: 'Completed',   category: 'Communication',      date: new Date(Date.now() - 1000*60*22),  duration: '1m 55s' },
  { id: 3,  group: 'Report Generation Agent',  task: 'Compile monthly sales summary',          status: 'In Progress', category: 'Reporting',          date: new Date(Date.now() - 1000*60*40),  duration: '—'      },
  { id: 4,  group: 'Invoice Processing Agent', task: 'Validate 34 pending invoices',           status: 'Completed',   category: 'Finance',            date: new Date(Date.now() - 1000*60*55),  duration: '3m 02s' },
  { id: 5,  group: 'Data Processing Agent',    task: 'Sync CRM records to data warehouse',     status: 'Completed',   category: 'Data Analysis',      date: new Date(Date.now() - 1000*60*80),  duration: '6m 44s' },
  { id: 6,  group: 'Email Automation Agent',   task: 'Re-engage cold leads sequence',          status: 'Failed',      category: 'Communication',      date: new Date(Date.now() - 1000*60*110), duration: '0m 31s' },
  { id: 7,  group: 'Report Generation Agent',  task: 'Generate compliance audit report',       status: 'Completed',   category: 'Reporting',          date: new Date(Date.now() - 1000*60*150), duration: '8m 20s' },
  { id: 8,  group: 'Invoice Processing Agent', task: 'Flag duplicate invoice #INV-4471',       status: 'Completed',   category: 'Finance',            date: new Date(Date.now() - 1000*60*200), duration: '0m 48s' },
  { id: 9,  group: 'Data Processing Agent',    task: 'Anonymise PII in uploaded CSVs',         status: 'Completed',   category: 'Data Analysis',      date: new Date(Date.now() - 1000*60*260), duration: '2m 37s' },
  { id: 10, group: 'Email Automation Agent',   task: 'Distribute onboarding email series',     status: 'Completed',   category: 'Communication',      date: new Date(Date.now() - 1000*60*320), duration: '2m 05s' },
];

const ACTIVITY_GROUPS    = ['All Groups', 'Data Processing Agent', 'Email Automation Agent', 'Report Generation Agent', 'Invoice Processing Agent'];
const ACTIVITY_STATUSES  = ['All', 'Completed', 'Failed', 'In Progress'];
const ACTIVITY_CATEGORIES = ['All Categories', 'Data Analysis', 'Communication', 'Reporting', 'Finance'];

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
  const [groupFilter, setGroupFilter]     = useState('All Groups');
  const [statusFilter, setStatusFilter]   = useState('All');
  const [catFilter, setCatFilter]         = useState('All Categories');
  const [sortField, setSortField]         = useState<keyof ActivityEntry>('date');
  const [sortAsc, setSortAsc]             = useState(false);
  const [page, setPage]                   = useState(1);
  const [pageSize, setPageSize]           = useState(5);

  const filtered = ACTIVITY_DATA
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
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[140px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5">
                <Bot className="h-3.5 w-3.5 text-gray-400" />
                {groupFilter === 'All Groups' ? 'Group' : groupFilter.replace(' Agent', '')}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {ACTIVITY_GROUPS.map(g => (
              <DropdownMenuItem key={g} onClick={() => { setGroupFilter(g); setPage(1); }} className={cn(groupFilter === g && 'font-medium')}>
                {g}
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
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[130px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-gray-400" />
                {catFilter === 'All Categories' ? 'Category' : catFilter}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {ACTIVITY_CATEGORIES.map(c => (
              <DropdownMenuItem key={c} onClick={() => { setCatFilter(c); setPage(1); }} className={cn(catFilter === c && 'font-medium')}>
                {c}
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
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('group')}>
                  Agent Group <SortIcon field="group" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('category')}>
                  Category <SortIcon field="category" />
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
                          <Zap className="h-3.5 w-3.5 text-gray-500" />
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
                        <div className="p-1 rounded bg-gray-100 flex-shrink-0">
                          <Bot className="h-3 w-3 text-gray-500" />
                        </div>
                        <span className="text-gray-700 text-xs">{entry.group}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-gray-600 text-xs">{entry.category}</span>
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
            {(search || groupFilter !== 'All Groups' || statusFilter !== 'All' || catFilter !== 'All Categories') && (
              <button
                className="text-gray-500 hover:text-gray-900 underline underline-offset-2"
                onClick={() => { setSearch(''); setGroupFilter('All Groups'); setStatusFilter('All'); setCatFilter('All Categories'); setPage(1); }}
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

/* ── Worker Groups grid ── */
const WorkerGroupsGrid = ({
  agents,
  onShowCreate,
}: {
  agents: any[];
  onShowCreate: () => void;
}) => (
  <>
    <div className="flex justify-end mb-5">
      <Button
        onClick={onShowCreate}
        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
      >
        <Plus className="h-4 w-4 mr-2" />
        Deploy Agent
      </Button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <Card key={agent.id} className="bg-white/80 border-gray-200/50 hover:shadow-lg transition-all duration-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${agent.bgColor}`}>
                  <Bot className={`h-4 w-4 ${agent.iconColor}`} />
                </div>
                <span className="font-medium">{agent.name}</span>
              </div>
              <Button variant="ghost" size="icon" className="hover:bg-muted">
                <Settings className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">{agent.purpose}</span>
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded bg-muted"><Activity className="h-3 w-3 text-blue-600" /></div>
                <span className="text-sm text-muted-foreground">Executions: {agent.executions}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="p-1 rounded bg-muted"><Zap className="h-3 w-3 text-green-600" /></div>
                <span className="text-sm text-muted-foreground">Efficiency: {agent.efficiency}</span>
              </div>
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

/* ── Page ── */
const AIAgents = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('groups');
  const [wizardOpen, setWizardOpen] = useState(false);
  const [agents, setAgents] = useState([
    { id: 1, name: 'Data Processing Agent',   purpose: 'Data Analysis',    executions: 1250, efficiency: '98%', iconColor: 'text-cyan-600',   bgColor: 'from-cyan-100 to-blue-100'     },
    { id: 2, name: 'Email Automation Agent',   purpose: 'Communication',    executions: 890,  efficiency: '95%', iconColor: 'text-violet-600', bgColor: 'from-violet-100 to-purple-100' },
    { id: 3, name: 'Report Generation Agent',  purpose: 'Reporting',        executions: 456,  efficiency: '97%', iconColor: 'text-emerald-600',bgColor: 'from-emerald-100 to-green-100' },
    { id: 4, name: 'Invoice Processing Agent', purpose: 'Finance',          executions: 234,  efficiency: '99%', iconColor: 'text-rose-600',   bgColor: 'from-rose-100 to-pink-100'     },
  ]);

  const colors = ['text-cyan-600', 'text-violet-600', 'text-emerald-600', 'text-rose-600', 'text-amber-600'];
  const bgs    = ['from-cyan-100 to-blue-100', 'from-violet-100 to-purple-100', 'from-emerald-100 to-green-100', 'from-rose-100 to-pink-100', 'from-amber-100 to-yellow-100'];

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') { navigate('/login'); return; }
  }, [navigate]);

  const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
    { key: 'groups',   label: 'Teams',   icon: Bot },
    { key: 'activity', label: 'Recent Activity', icon: Activity },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(30,25%,97%)]">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <main className="flex-1 p-6">

              {/* Page header */}
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Teams</h1>
                <p className="text-gray-600">Autonomous AI agents for task automation</p>
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
              {activeTab === 'groups' && (
                <WorkerGroupsGrid agents={agents} onShowCreate={() => setWizardOpen(true)} />
              )}
              {activeTab === 'activity' && <ActivityTable />}

            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>

      <CreateAgentWizard
        open={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onComplete={(agentConfig) => {
          const idx = agents.length;
          setAgents([...agents, {
            id: Date.now(),
            name: agentConfig.name,
            purpose: agentConfig.autonomyLevel.replace('-', ' '),
            executions: 0,
            efficiency: 'N/A',
            iconColor: colors[idx % colors.length],
            bgColor: bgs[idx % bgs.length],
          }]);
        }}
      />
    </div>
  );
};

export default AIAgents;
