
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Activity, CheckCircle, AlertCircle, Clock, Eye,
  MessageCircle, FileText, Settings, Users, ExternalLink,
  Search, Filter, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityDetail {
  timestamp: string;
  description: string;
  metadata?: Record<string, any>;
}

interface ActivityItem {
  id: string;
  action: string;
  time: string;
  status: 'completed' | 'pending' | 'failed' | 'in_progress';
  category: 'communication' | 'task' | 'system' | 'collaboration';
  priority: 'low' | 'medium' | 'high';
  details: ActivityDetail[];
  participants?: string[];
  relatedConnections?: string[];
}

interface EnhancedActivityLogProps {
  activities: ActivityItem[];
}

const STATUS_STYLE: Record<string, string> = {
  completed:   'bg-green-100 text-green-700 border-green-200',
  failed:      'bg-red-100 text-red-700 border-red-200',
  pending:     'bg-orange-100 text-orange-700 border-orange-200',
  in_progress: 'bg-blue-100 text-blue-700 border-blue-200',
};

const PRIORITY_STYLE: Record<string, string> = {
  high:   'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low:    'bg-green-100 text-green-700 border-green-200',
};

const CATEGORIES = ['all', 'communication', 'task', 'system', 'collaboration'] as const;
const STATUSES   = ['all', 'completed', 'failed', 'pending', 'in_progress'] as const;
const PRIORITIES = ['all', 'high', 'medium', 'low'] as const;

type SortField = keyof ActivityItem;

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'communication': return <MessageCircle className="h-3.5 w-3.5" />;
    case 'task':          return <FileText className="h-3.5 w-3.5" />;
    case 'system':        return <Settings className="h-3.5 w-3.5" />;
    case 'collaboration': return <Users className="h-3.5 w-3.5" />;
    default:              return <Activity className="h-3.5 w-3.5" />;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed':   return <CheckCircle className="h-3.5 w-3.5 text-green-600" />;
    case 'failed':      return <AlertCircle className="h-3.5 w-3.5 text-red-600" />;
    case 'pending':     return <Clock className="h-3.5 w-3.5 text-orange-600" />;
    case 'in_progress': return <Activity className="h-3.5 w-3.5 text-blue-600" />;
    default:            return <Activity className="h-3.5 w-3.5 text-gray-600" />;
  }
};

const EnhancedActivityLog = ({ activities }: EnhancedActivityLogProps) => {
  const [search, setSearch]           = useState('');
  const [catFilter, setCatFilter]     = useState<typeof CATEGORIES[number]>('all');
  const [statusFilter, setStatusFilter] = useState<typeof STATUSES[number]>('all');
  const [priorityFilter, setPriorityFilter] = useState<typeof PRIORITIES[number]>('all');
  const [sortField, setSortField]     = useState<SortField>('time');
  const [sortAsc, setSortAsc]         = useState(false);
  const [page, setPage]               = useState(1);
  const [pageSize, setPageSize]       = useState(5);

  const filtered = activities
    .filter(a => {
      const q = search.toLowerCase();
      const matchSearch  = !q || a.action.toLowerCase().includes(q);
      const matchCat     = catFilter === 'all' || a.category === catFilter;
      const matchStatus  = statusFilter === 'all' || a.status === statusFilter;
      const matchPri     = priorityFilter === 'all' || a.priority === priorityFilter;
      return matchSearch && matchCat && matchStatus && matchPri;
    })
    .sort((a, b) => {
      const av = String((a as any)[sortField] ?? '').toLowerCase();
      const bv = String((b as any)[sortField] ?? '').toLowerCase();
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortAsc(a => !a);
    else { setSortField(field); setSortAsc(true); }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: SortField }) => (
    <ArrowUpDown className={cn('h-3 w-3 ml-1 inline', sortField === field ? 'text-gray-900' : 'text-gray-400')} />
  );

  const hasFilters = search || catFilter !== 'all' || statusFilter !== 'all' || priorityFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Activity className="h-5 w-5 text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
      </div>

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
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[120px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-gray-400" />
                {catFilter === 'all' ? 'Category' : catFilter.charAt(0).toUpperCase() + catFilter.slice(1)}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {CATEGORIES.map(c => (
              <DropdownMenuItem key={c} onClick={() => { setCatFilter(c); setPage(1); }} className={cn(catFilter === c && 'font-medium')}>
                {c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[110px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-gray-400" />
                {statusFilter === 'all' ? 'Status' : statusFilter.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {STATUSES.map(s => (
              <DropdownMenuItem key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={cn(statusFilter === s && 'font-medium')}>
                {s === 'all' ? 'All Statuses' : s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[110px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-gray-400" />
                {priorityFilter === 'all' ? 'Priority' : priorityFilter.charAt(0).toUpperCase() + priorityFilter.slice(1)}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {PRIORITIES.map(p => (
              <DropdownMenuItem key={p} onClick={() => { setPriorityFilter(p); setPage(1); }} className={cn(priorityFilter === p && 'font-medium')}>
                {p === 'all' ? 'All Priorities' : p.charAt(0).toUpperCase() + p.slice(1)}
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
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('action')}>
                  Action <SortIcon field="action" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('status')}>
                  Status <SortIcon field="status" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('category')}>
                  Category <SortIcon field="category" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('priority')}>
                  Priority <SortIcon field="priority" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden lg:table-cell" onClick={() => toggleSort('time')}>
                  Time <SortIcon field="time" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Participants</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No activity matches your filters.
                  </td>
                </tr>
              ) : (
                paged.map(activity => (
                  <tr key={activity.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded bg-gray-100 flex-shrink-0 text-gray-500">
                          {getCategoryIcon(activity.category)}
                        </div>
                        <span className="font-medium text-gray-900 truncate max-w-[220px]">{activity.action}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border', STATUS_STYLE[activity.status])}>
                        {getStatusIcon(activity.status)}
                        {activity.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-gray-600 text-xs capitalize">{activity.category}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', PRIORITY_STYLE[activity.priority])}>
                        {activity.priority.charAt(0).toUpperCase() + activity.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">{activity.time}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">
                      {activity.participants ? `${activity.participants.length} participant${activity.participants.length !== 1 ? 's' : ''}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-xs h-7">
                            <Eye className="h-3 w-3 mr-1" />
                            Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              {getCategoryIcon(activity.category)}
                              <span>{activity.action}</span>
                            </DialogTitle>
                          </DialogHeader>
                          <Tabs defaultValue="details" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                              <TabsTrigger value="details">Details</TabsTrigger>
                              <TabsTrigger value="timeline">Timeline</TabsTrigger>
                              <TabsTrigger value="connections">Connections</TabsTrigger>
                            </TabsList>
                            <TabsContent value="details" className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium text-gray-600 mb-1">Status</p>
                                  <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', STATUS_STYLE[activity.status])}>
                                    {activity.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600 mb-1">Priority</p>
                                  <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', PRIORITY_STYLE[activity.priority])}>
                                    {activity.priority.charAt(0).toUpperCase() + activity.priority.slice(1)}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Category</p>
                                  <p className="text-sm capitalize">{activity.category}</p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-600">Time</p>
                                  <p className="text-sm">{activity.time}</p>
                                </div>
                              </div>
                              {activity.participants && (
                                <div>
                                  <p className="text-sm font-medium text-gray-600 mb-2">Participants</p>
                                  <div className="flex flex-wrap gap-2">
                                    {activity.participants.map((p, i) => (
                                      <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs border border-gray-200 bg-gray-50 text-gray-700">{p}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </TabsContent>
                            <TabsContent value="timeline" className="space-y-3">
                              {activity.details.map((detail, i) => (
                                <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                  <div className="flex-1">
                                    <p className="text-sm font-medium">{detail.description}</p>
                                    <p className="text-xs text-gray-500">{detail.timestamp}</p>
                                    {detail.metadata && (
                                      <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                                        {JSON.stringify(detail.metadata, null, 2)}
                                      </pre>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </TabsContent>
                            <TabsContent value="connections" className="space-y-2">
                              {activity.relatedConnections?.length ? (
                                activity.relatedConnections.map((conn, i) => (
                                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <span className="text-sm">{conn}</span>
                                    <Button variant="outline" size="sm">
                                      <ExternalLink className="h-3 w-3 mr-1" />
                                      View
                                    </Button>
                                  </div>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500 italic">No related connections</p>
                              )}
                            </TabsContent>
                          </Tabs>
                        </DialogContent>
                      </Dialog>
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
            {hasFilters && (
              <button
                className="text-gray-500 hover:text-gray-900 underline underline-offset-2"
                onClick={() => { setSearch(''); setCatFilter('all'); setStatusFilter('all'); setPriorityFilter('all'); setPage(1); }}
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

export default EnhancedActivityLog;
