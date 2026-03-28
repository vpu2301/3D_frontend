
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Network, Search, Filter, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Connection {
  id: string;
  name: string;
  type: string;
  department: string;
  location: 'internal' | 'external';
  company?: string;
  avatar?: string;
  status: 'active' | 'inactive';
  lastInteraction: string;
}

interface AIEmployeeConnectionsProps {
  connections: Connection[];
}

const STATUS_STYLE: Record<string, string> = {
  active:   'bg-green-100 text-green-700 border-green-200',
  inactive: 'bg-gray-100 text-gray-500 border-gray-200',
};

const LOCATION_STYLE: Record<string, string> = {
  internal: 'bg-blue-100 text-blue-700 border-blue-200',
  external: 'bg-purple-100 text-purple-700 border-purple-200',
};

type SortField = keyof Connection;

const AIEmployeeConnections = ({ connections }: AIEmployeeConnectionsProps) => {
  const [search, setSearch]           = useState('');
  const [locationFilter, setLocationFilter] = useState<'all' | 'internal' | 'external'>('all');
  const [statusFilter, setStatusFilter]   = useState<'all' | 'active' | 'inactive'>('all');
  const [sortField, setSortField]     = useState<SortField>('name');
  const [sortAsc, setSortAsc]         = useState(true);
  const [page, setPage]               = useState(1);
  const [pageSize, setPageSize]       = useState(5);

  const filtered = connections
    .filter(c => {
      const q = search.toLowerCase();
      const matchSearch = !q || c.name.toLowerCase().includes(q) || c.department.toLowerCase().includes(q) || c.type.toLowerCase().includes(q) || (c.company ?? '').toLowerCase().includes(q);
      const matchLoc    = locationFilter === 'all' || c.location === locationFilter;
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      return matchSearch && matchLoc && matchStatus;
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

  const hasFilters = search || locationFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Network className="h-5 w-5 text-gray-700" />
        <h2 className="text-lg font-semibold text-gray-900">AI Employee Connections</h2>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            placeholder="Search connections…"
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
                {locationFilter === 'all' ? 'Location' : locationFilter.charAt(0).toUpperCase() + locationFilter.slice(1)}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {(['all', 'internal', 'external'] as const).map(l => (
              <DropdownMenuItem key={l} onClick={() => { setLocationFilter(l); setPage(1); }} className={cn(locationFilter === l && 'font-medium')}>
                {l === 'all' ? 'All Locations' : l.charAt(0).toUpperCase() + l.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white !border-gray-200 text-gray-700 min-w-[110px] justify-between hover:!bg-gray-50 hover:!text-gray-700">
              <span className="flex items-center gap-1.5">
                <Filter className="h-3.5 w-3.5 text-gray-400" />
                {statusFilter === 'all' ? 'Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {(['all', 'active', 'inactive'] as const).map(s => (
              <DropdownMenuItem key={s} onClick={() => { setStatusFilter(s); setPage(1); }} className={cn(statusFilter === s && 'font-medium')}>
                {s === 'all' ? 'All Statuses' : s.charAt(0).toUpperCase() + s.slice(1)}
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
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('name')}>
                  Name <SortIcon field="name" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900" onClick={() => toggleSort('status')}>
                  Status <SortIcon field="status" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('location')}>
                  Location <SortIcon field="location" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden md:table-cell" onClick={() => toggleSort('type')}>
                  Type <SortIcon field="type" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900 hidden lg:table-cell" onClick={() => toggleSort('department')}>
                  Department <SortIcon field="department" />
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Last Interaction</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
              </tr>
            </thead>
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No connections match your filters.
                  </td>
                </tr>
              ) : (
                paged.map(conn => (
                  <tr key={conn.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={conn.avatar} alt={conn.name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-600 text-xs font-medium">
                            {conn.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-gray-900">{conn.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', STATUS_STYLE[conn.status])}>
                        {conn.status.charAt(0).toUpperCase() + conn.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', LOCATION_STYLE[conn.location])}>
                        {conn.location.charAt(0).toUpperCase() + conn.location.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-gray-600 text-xs">{conn.type}</td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-600 text-xs">
                      {conn.department}{conn.company && <span className="text-gray-400"> · {conn.company}</span>}
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-500 text-xs">{conn.lastInteraction}</td>
                    <td className="px-4 py-3">
                      <Button variant="outline" size="sm" className="text-xs h-7">View</Button>
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
                onClick={() => { setSearch(''); setLocationFilter('all'); setStatusFilter('all'); setPage(1); }}
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

export default AIEmployeeConnections;
