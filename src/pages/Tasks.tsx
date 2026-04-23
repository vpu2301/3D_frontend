
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  CheckCircle, XCircle, Clock, Bot, AlertCircle, FileText, DollarSign,
  Users, PlayCircle, BookOpen, ClipboardList, Activity, BookMarked,
  Search, Filter, ArrowUpDown, MoreHorizontal, ChevronDown,
  ChevronLeft, ChevronRight, Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';

type TabKey = 'approvals' | 'active' | 'journal';

type JournalEntry = {
  id: number;
  title: string;
  assistant: string;
  description: string;
  status: string;
  category: string;
  completedDate: Date;
  duration: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
};

const JOURNAL_STATUS_STYLE: Record<string, string> = {
  Completed: 'bg-green-100 text-green-700 border-green-200',
  Failed:    'bg-red-100 text-red-700 border-red-200',
  Cancelled: 'bg-gray-100 text-gray-500 border-gray-200',
};

const JOURNAL_CATEGORIES = ['All Categories', 'Support', 'Research', 'Finance', 'HR', 'Marketing', 'Operations'];
const JOURNAL_STATUSES   = ['All', 'Completed', 'Failed', 'Cancelled'];

const JournalTable = ({
  journals,
  formatTimeAgo,
}: {
  journals: JournalEntry[];
  formatTimeAgo: (d: Date) => string;
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState<keyof JournalEntry>('completedDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filtered = journals
    .filter(j => {
      const q = search.toLowerCase();
      const matchSearch = !q || j.title.toLowerCase().includes(q) || j.assistant.toLowerCase().includes(q) || j.description.toLowerCase().includes(q);
      const matchCat    = categoryFilter === 'All Categories' || j.category === categoryFilter;
      const matchStatus = statusFilter === 'All' || j.status === statusFilter;
      return matchSearch && matchCat && matchStatus;
    })
    .sort((a, b) => {
      const av = String(a[sortField] ?? '').toLowerCase();
      const bv = String(b[sortField] ?? '').toLowerCase();
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const totalPages   = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage     = Math.min(page, totalPages);
  const paged        = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (field: keyof JournalEntry) => {
    if (sortField === field) setSortAsc(a => !a);
    else { setSortField(field); setSortAsc(true); }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: keyof JournalEntry }) => (
    <ArrowUpDown className={cn('h-3 w-3 ml-1 inline', sortField === field ? 'text-gray-900' : 'text-gray-400')} />
  );

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search journal…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 bg-white border-gray-200"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[140px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-gray-400" />
                {categoryFilter === 'All Categories' ? 'Category' : categoryFilter}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            {JOURNAL_CATEGORIES.map(c => (
              <DropdownMenuItem key={c} onClick={() => { setCategoryFilter(c); setPage(1); }} className={cn(categoryFilter === c && 'font-medium')}>
                {c}
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
            {JOURNAL_STATUSES.map(s => (
              <DropdownMenuItem key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={cn(statusFilter === s && 'font-medium')}>
                {s === 'All' ? 'All Statuses' : s}
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
                <th
                  className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900"
                  onClick={() => toggleSort('title')}
                >
                  Task <SortIcon field="title" />
                </th>
                <th
                  className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900"
                  onClick={() => toggleSort('status')}
                >
                  Status <SortIcon field="status" />
                </th>
                <th
                  className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900"
                  onClick={() => toggleSort('category')}
                >
                  Category <SortIcon field="category" />
                </th>
                <th
                  className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell"
                  onClick={() => toggleSort('assistant')}
                >
                  Assistant <SortIcon field="assistant" />
                </th>
                <th
                  className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden lg:table-cell"
                  onClick={() => toggleSort('completedDate')}
                >
                  Completed <SortIcon field="completedDate" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Duration</th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No journal entries match your filters.
                  </td>
                </tr>
              ) : (
                paged.map(task => (
                  <tr key={task.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${task.bgColor} flex-shrink-0`}>
                          <task.icon className={`h-4 w-4 ${task.iconColor}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{task.title}</p>
                          <p className="text-xs text-gray-500 truncate">{task.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', JOURNAL_STATUS_STYLE[task.status] ?? 'bg-gray-100 text-gray-500 border-gray-200')}>
                        {task.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{task.category}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="flex items-center gap-1.5 text-gray-600 text-xs">
                        <Bot className="h-3.5 w-3.5 text-gray-400" />
                        {task.assistant}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        {formatTimeAgo(task.completedDate)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">{task.duration}</td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-gray-100">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />View Report
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
            {(categoryFilter !== 'All Categories' || statusFilter !== 'All' || search) && (
              <button
                className="text-gray-500 hover:text-gray-900 underline underline-offset-2"
                onClick={() => { setSearch(''); setCategoryFilter('All Categories'); setStatusFilter('All'); setPage(1); }}
              >
                Clear filters
              </button>
            )}
            {totalPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline" size="icon"
                  className="h-7 w-7 !border-gray-200 hover:!bg-gray-100 hover:!text-gray-700"
                  disabled={safePage === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                  <Button
                    key={p}
                    variant={p === safePage ? 'default' : 'outline'}
                    size="icon"
                    className={cn('h-7 w-7 text-xs', p !== safePage && '!border-gray-200 text-gray-600 hover:!bg-gray-100 hover:!text-gray-700')}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline" size="icon"
                  className="h-7 w-7 !border-gray-200 hover:!bg-gray-100 hover:!text-gray-700"
                  disabled={safePage === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
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

type ActiveTask = {
  id: number;
  title: string;
  assistant: string;
  description: string;
  priority: string;
  category: string;
  progress: number;
  assignedDate: Date;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
};

type PendingTask = {
  id: number;
  title: string;
  assistant: string;
  description: string;
  priority: string;
  category: string;
  timestamp: Date;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
};

const PRIORITY_STYLE: Record<string, string> = {
  High:   'bg-red-100 text-red-700 border-red-200',
  Medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  Low:    'bg-green-100 text-green-700 border-green-200',
};

const TASK_CATEGORIES = ['All Categories', 'Finance', 'HR', 'Marketing', 'Support', 'Research', 'Operations'];
const PRIORITIES      = ['All', 'High', 'Medium', 'Low'];

const ActiveTasksTable = ({
  tasks,
  formatTimeAgo,
}: {
  tasks: ActiveTask[];
  formatTimeAgo: (d: Date) => string;
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortField, setSortField] = useState<keyof ActiveTask>('assignedDate');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filtered = tasks
    .filter(t => {
      const q = search.toLowerCase();
      const matchSearch = !q || t.title.toLowerCase().includes(q) || t.assistant.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      const matchCat  = categoryFilter === 'All Categories' || t.category === categoryFilter;
      const matchPri  = priorityFilter === 'All' || t.priority === priorityFilter;
      return matchSearch && matchCat && matchPri;
    })
    .sort((a, b) => {
      const av = String(a[sortField] ?? '').toLowerCase();
      const bv = String(b[sortField] ?? '').toLowerCase();
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (field: keyof ActiveTask) => {
    if (sortField === field) setSortAsc(a => !a);
    else { setSortField(field); setSortAsc(true); }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: keyof ActiveTask }) => (
    <ArrowUpDown className={cn('h-3 w-3 ml-1 inline', sortField === field ? 'text-gray-900' : 'text-gray-400')} />
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search tasks…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 bg-white border-gray-200"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[140px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-gray-400" />
                {categoryFilter === 'All Categories' ? 'Category' : categoryFilter}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            {TASK_CATEGORIES.map(c => (
              <DropdownMenuItem key={c} onClick={() => { setCategoryFilter(c); setPage(1); }} className={cn(categoryFilter === c && 'font-medium')}>
                {c}
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
            {PRIORITIES.map(p => (
              <DropdownMenuItem key={p} onClick={() => { setPriorityFilter(p); setPage(1); }} className={cn(priorityFilter === p && 'font-medium')}>
                {p === 'All' ? 'All Priorities' : p}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="bg-white border-gray-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('title')}>
                  Task <SortIcon field="title" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('priority')}>
                  Priority <SortIcon field="priority" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('category')}>
                  Category <SortIcon field="category" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('assistant')}>
                  Assistant <SortIcon field="assistant" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Progress</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden lg:table-cell" onClick={() => toggleSort('assignedDate')}>
                  Started <SortIcon field="assignedDate" />
                </th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No active tasks match your filters.
                  </td>
                </tr>
              ) : (
                paged.map(task => (
                  <tr key={task.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${task.bgColor} flex-shrink-0`}>
                          <task.icon className={`h-4 w-4 ${task.iconColor}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{task.title}</p>
                          <p className="text-xs text-gray-500 truncate">{task.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', PRIORITY_STYLE[task.priority] ?? 'bg-gray-100 text-gray-500 border-gray-200')}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{task.category}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="flex items-center gap-1.5 text-gray-600 text-xs">
                        <Bot className="h-3.5 w-3.5 text-gray-400" />
                        {task.assistant}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="flex items-center gap-2 min-w-[100px]">
                        <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${task.progress}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{task.progress}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        {formatTimeAgo(task.assignedDate)}
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
                            <PlayCircle className="h-4 w-4 mr-2" />View Progress
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />View Details
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
            {(categoryFilter !== 'All Categories' || priorityFilter !== 'All' || search) && (
              <button
                className="text-gray-500 hover:text-gray-900 underline underline-offset-2"
                onClick={() => { setSearch(''); setCategoryFilter('All Categories'); setPriorityFilter('All'); setPage(1); }}
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

const ApprovalsTable = ({
  tasks,
  formatTimeAgo,
  onApprove,
  onReject,
}: {
  tasks: PendingTask[];
  formatTimeAgo: (d: Date) => string;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}) => {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [sortField, setSortField] = useState<keyof PendingTask>('timestamp');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filtered = tasks
    .filter(t => {
      const q = search.toLowerCase();
      const matchSearch = !q || t.title.toLowerCase().includes(q) || t.assistant.toLowerCase().includes(q) || t.description.toLowerCase().includes(q);
      const matchCat  = categoryFilter === 'All Categories' || t.category === categoryFilter;
      const matchPri  = priorityFilter === 'All' || t.priority === priorityFilter;
      return matchSearch && matchCat && matchPri;
    })
    .sort((a, b) => {
      const av = String(a[sortField] ?? '').toLowerCase();
      const bv = String(b[sortField] ?? '').toLowerCase();
      return sortAsc ? av.localeCompare(bv) : bv.localeCompare(av);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage   = Math.min(page, totalPages);
  const paged      = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const toggleSort = (field: keyof PendingTask) => {
    if (sortField === field) setSortAsc(a => !a);
    else { setSortField(field); setSortAsc(true); }
    setPage(1);
  };

  const SortIcon = ({ field }: { field: keyof PendingTask }) => (
    <ArrowUpDown className={cn('h-3 w-3 ml-1 inline', sortField === field ? 'text-gray-900' : 'text-gray-400')} />
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search approvals…"
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="pl-9 bg-white border-gray-200"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[140px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-gray-400" />
                {categoryFilter === 'All Categories' ? 'Category' : categoryFilter}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44">
            {TASK_CATEGORIES.map(c => (
              <DropdownMenuItem key={c} onClick={() => { setCategoryFilter(c); setPage(1); }} className={cn(categoryFilter === c && 'font-medium')}>
                {c}
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
            {PRIORITIES.map(p => (
              <DropdownMenuItem key={p} onClick={() => { setPriorityFilter(p); setPage(1); }} className={cn(priorityFilter === p && 'font-medium')}>
                {p === 'All' ? 'All Priorities' : p}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="bg-white border-gray-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('title')}>
                  Task <SortIcon field="title" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('priority')}>
                  Priority <SortIcon field="priority" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('category')}>
                  Category <SortIcon field="category" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('assistant')}>
                  Assistant <SortIcon field="assistant" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden lg:table-cell" onClick={() => toggleSort('timestamp')}>
                  Received <SortIcon field="timestamp" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No pending approvals match your filters.
                  </td>
                </tr>
              ) : (
                paged.map(task => (
                  <tr key={task.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${task.bgColor} flex-shrink-0`}>
                          <task.icon className={`h-4 w-4 ${task.iconColor}`} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{task.title}</p>
                          <p className="text-xs text-gray-500 truncate">{task.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', PRIORITY_STYLE[task.priority] ?? 'bg-gray-100 text-gray-500 border-gray-200')}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{task.category}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="flex items-center gap-1.5 text-gray-600 text-xs">
                        <Bot className="h-3.5 w-3.5 text-gray-400" />
                        {task.assistant}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3 text-gray-400" />
                        {formatTimeAgo(task.timestamp)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Button onClick={() => onApprove(task.id)} size="sm" className="bg-green-600 hover:bg-green-700 text-white h-7 px-2.5 text-xs">
                          <CheckCircle className="h-3.5 w-3.5 mr-1" />Approve
                        </Button>
                        <Button onClick={() => onReject(task.id)} variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 h-7 px-2.5 text-xs">
                          <XCircle className="h-3.5 w-3.5 mr-1" />Reject
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/60 flex items-center justify-between gap-3 flex-wrap text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>
              {filtered.length > 0
                ? `Showing ${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filtered.length)} of ${filtered.length} approvals`
                : '0 approvals'}
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
            {(categoryFilter !== 'All Categories' || priorityFilter !== 'All' || search) && (
              <button
                className="text-gray-500 hover:text-gray-900 underline underline-offset-2"
                onClick={() => { setSearch(''); setCategoryFilter('All Categories'); setPriorityFilter('All'); setPage(1); }}
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

const Tasks = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('approvals');
  const [pendingTasks, setPendingTasks] = useState([
    {
      id: 1,
      title: 'Customer Refund Request - $150',
      assistant: 'Emma (Sales Assistant)',
      description: 'Customer requesting refund for Order #12345 due to product defect',
      priority: 'High',
      category: 'Finance',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      icon: DollarSign,
      iconColor: 'text-red-600',
      bgColor: 'from-red-100 to-pink-100'
    },
    {
      id: 2,
      title: 'New Employee Onboarding Approval',
      assistant: 'Aria (HR Assistant)',
      description: 'Approve onboarding checklist for John Smith starting Monday',
      priority: 'Medium',
      category: 'HR',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      icon: Users,
      iconColor: 'text-blue-600',
      bgColor: 'from-blue-100 to-cyan-100'
    }
  ]);

  const [activeTasks, setActiveTasks] = useState([
    {
      id: 3,
      title: 'Process Invoice #INV-2024-001',
      assistant: 'Felix (Finance Assistant)',
      description: 'Processing monthly vendor invoices for approval',
      priority: 'Medium',
      category: 'Finance',
      progress: 75,
      assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 2),
      icon: FileText,
      iconColor: 'text-green-600',
      bgColor: 'from-green-100 to-emerald-100'
    },
    {
      id: 4,
      title: 'Generate Marketing Report',
      assistant: 'Maya (Marketing Assistant)',
      description: 'Creating Q1 marketing performance analysis',
      priority: 'Low',
      category: 'Marketing',
      progress: 45,
      assignedDate: new Date(Date.now() - 1000 * 60 * 60 * 4),
      icon: DollarSign,
      iconColor: 'text-purple-600',
      bgColor: 'from-purple-100 to-violet-100'
    }
  ]);

  const [taskJournals, setTaskJournals] = useState([
    {
      id: 5,
      title: 'Customer Support Ticket #CS-001',
      assistant: 'Atlas (Support Assistant)',
      description: 'Resolved billing inquiry from premium customer',
      status: 'Completed',
      category: 'Support',
      completedDate: new Date(Date.now() - 1000 * 60 * 60 * 6),
      duration: '15 minutes',
      icon: Users,
      iconColor: 'text-blue-600',
      bgColor: 'from-blue-100 to-cyan-100'
    },
    {
      id: 6,
      title: 'Research Market Trends',
      assistant: 'Sage (Research Assistant)',
      description: 'Analyzed competitor pricing strategies for Q2 planning',
      status: 'Completed',
      category: 'Research',
      completedDate: new Date(Date.now() - 1000 * 60 * 60 * 24),
      duration: '2 hours',
      icon: BookOpen,
      iconColor: 'text-indigo-600',
      bgColor: 'from-indigo-100 to-purple-100'
    }
  ]);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') || sessionStorage.getItem('isAuthenticated');

    if (isAuthenticated !== 'true') {
      navigate('/login');
      return;
    }
  }, [navigate]);

  const handleApprove = (taskId: number) => {
    setPendingTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleReject = (taskId: number) => {
    setPendingTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else {
      const diffInHours = Math.floor(diffInMinutes / 60);
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(30,25%,97%)]">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col bg-white">
            <main className="flex-1 p-6 pb-20">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
                  <p className="text-gray-600">Manage tasks, approvals, and AI assistant activities</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    {pendingTasks.length} pending approvals
                  </Badge>
                  <Button variant="outline" size="sm">
                    <AlertCircle className="h-4 w-4 mr-2" />
                    View All Notifications
                  </Button>
                </div>
              </div>

              {/* Tab nav */}
              <div className="flex border-b border-gray-200 mb-6">
                {([
                  { key: 'approvals' as TabKey, label: `Approvals (${pendingTasks.length})`, icon: ClipboardList },
                  { key: 'active' as TabKey,    label: `Active Tasks (${activeTasks.length})`, icon: Activity },
                  { key: 'journal' as TabKey,   label: `Task Journal (${taskJournals.length})`, icon: BookMarked },
                ] as const).map(({ key, label, icon: Icon }) => (
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

              {activeTab === 'approvals' && (
                pendingTasks.length === 0 ? (
                  <div className="text-center py-12">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                    <p className="text-gray-600">No pending approvals at the moment</p>
                  </div>
                ) : (
                  <ApprovalsTable tasks={pendingTasks} formatTimeAgo={formatTimeAgo} onApprove={handleApprove} onReject={handleReject} />
                )
              )}

              {activeTab === 'active' && (
                <ActiveTasksTable tasks={activeTasks} formatTimeAgo={formatTimeAgo} />
              )}

              {activeTab === 'journal' && (
                <JournalTable journals={taskJournals} formatTimeAgo={formatTimeAgo} />
              )}
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Tasks;
