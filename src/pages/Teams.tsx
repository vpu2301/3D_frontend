
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  UserPlus, Upload,
  Search, ChevronDown, MoreHorizontal, Mail, Phone, Building2,
  Filter, ArrowUpDown, Trash2, Pencil, CheckSquare, Eye,
  ChevronLeft, ChevronRight, Users, Bot, Crown, Settings, Plus
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import AddEmployeeDialog, { type Employee } from '@/components/AddEmployeeDialog';
import ImportEmployeesDialog from '@/components/ImportEmployeesDialog';
import CreateTeamDialog from '@/components/CreateTeamDialog';
import { cn } from '@/lib/utils';

/* ──────────────────────────────────────────────
   Shared presentation classes (platform design system)
────────────────────────────────────────────── */
/** shadcn <Card> neutralised to the .plat-panel look. */
const PANEL = '!rounded-[14px] !border !border-[color:var(--line-soft)] !bg-white !shadow-none';
/** shadcn <Button variant="outline"> softened to the .plat-btn-ghost look. */
const GHOST =
  'plat-btn-ghost !rounded-full !bg-transparent !border-[color:var(--line)] !text-[color:var(--text-2)] hover:!bg-transparent hover:!border-[color:var(--ink)] hover:!text-[color:var(--ink)]';

/* ──────────────────────────────────────────────
   Tab type
────────────────────────────────────────────── */
type TeamsPageTab = 'teams' | 'employees';

const TEAMS_PAGE_SIZE = 6;

/* ──────────────────────────────────────────────
   Teams tab (one panel, hairline-separated rows)
────────────────────────────────────────────── */
const TeamsTabContent = ({ onShowCreate }: { onShowCreate: () => void }) => {
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
      <div className="plat-list">
        {pagedTeams.map(team => (
          <div key={team.id} className="plat-row !items-start !gap-4 !px-5 !py-4">
            <span className="plat-item-icon !h-10 !w-10 !rounded-[10px]">
              <Users className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="plat-row-title">{team.name}</p>
              <p className="mt-0.5 text-xs" style={{ color: 'var(--text-4)' }}>{team.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs" style={{ color: 'var(--text-3)' }}>
                <span className="inline-flex items-center gap-1.5">
                  <Crown className="h-3 w-3" style={{ color: 'var(--text-5)' }} />Leader: {team.leader}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-3 w-3" style={{ color: 'var(--text-5)' }} />Human Workers: {team.humanMembers}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Bot className="h-3 w-3" style={{ color: 'var(--text-5)' }} />AI Workers: {team.aiWorkers}
                </span>
              </div>
            </div>
            <div className="ml-auto flex flex-shrink-0 items-center gap-1.5">
              <Button variant="ghost" size="icon" className="h-8 w-8 !rounded-[10px]" onClick={() => handleViewTeam(team.id)}><Eye className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 !rounded-[10px]"><Settings className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" className={cn(GHOST, '!h-8 !px-3.5 !text-xs')} onClick={() => handleViewTeam(team.id)}><Eye className="h-3 w-3 mr-1" />View Team</Button>
              <Button variant="outline" size="sm" className={cn(GHOST, '!h-8 !px-3 !text-xs')}><UserPlus className="h-3 w-3" /></Button>
            </div>
          </div>
        ))}
      </div>
      {totalTeamsPages > 1 && (
        <div className="flex items-center justify-between mt-6 text-sm" style={{ color: 'var(--text-4)' }}>
          <span>Showing {(teamsPage - 1) * TEAMS_PAGE_SIZE + 1}–{Math.min(teamsPage * TEAMS_PAGE_SIZE, teams.length)} of {teams.length} teams</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className={cn(GHOST, 'h-8 w-8')} disabled={teamsPage === 1} onClick={() => setTeamsPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button>
            {Array.from({ length: totalTeamsPages }, (_, i) => i + 1).map(p => <Button key={p} variant={p === teamsPage ? 'default' : 'outline'} size="icon" className={cn('h-8 w-8 text-xs', p !== teamsPage && GHOST)} onClick={() => setTeamsPage(p)}>{p}</Button>)}
            <Button variant="outline" size="icon" className={cn(GHOST, 'h-8 w-8')} disabled={teamsPage === totalTeamsPages} onClick={() => setTeamsPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>
      )}
    </>
  );
};

/* ──────────────────────────────────────────────
   Types & static data
────────────────────────────────────────────── */

const INITIAL_EMPLOYEES: Employee[] = [
  { id: 1,  name: 'Sarah Johnson',    email: 'sarah.j@company.com',    phone: '+1 555-0101', role: 'Sales Manager',          department: 'Sales',            status: 'Active',   joinDate: '2022-03-15' },
  { id: 2,  name: 'Michael Chen',     email: 'm.chen@company.com',     phone: '+1 555-0102', role: 'Marketing Lead',         department: 'Marketing',        status: 'Active',   joinDate: '2021-07-22' },
  { id: 3,  name: 'Emily Rodriguez',  email: 'e.rodriguez@company.com',phone: '+1 555-0103', role: 'HR Specialist',          department: 'HR',               status: 'On Leave', joinDate: '2023-01-08' },
  { id: 4,  name: 'David Kim',        email: 'd.kim@company.com',      phone: '+1 555-0104', role: 'DevOps Engineer',        department: 'Engineering',      status: 'Active',   joinDate: '2020-11-03' },
  { id: 5,  name: 'Priya Patel',      email: 'p.patel@company.com',    phone: '+1 555-0105', role: 'Finance Analyst',        department: 'Finance',          status: 'Active',   joinDate: '2022-09-19' },
  { id: 6,  name: 'James Wilson',     email: 'j.wilson@company.com',   phone: '+1 555-0106', role: 'Customer Success Mgr',   department: 'Customer Success', status: 'Remote',   joinDate: '2021-04-14' },
  { id: 7,  name: 'Lena Fischer',     email: 'l.fischer@company.com',  phone: '+49 89 0107', role: 'Legal Counsel',          department: 'Legal',            status: 'Active',   joinDate: '2023-05-02' },
  { id: 8,  name: 'Tomás Reyes',      email: 't.reyes@company.com',    phone: '+1 555-0108', role: 'Product Designer',       department: 'Design',           status: 'Active',   joinDate: '2022-12-07' },
  { id: 9,  name: 'Aisha Nkosi',      email: 'a.nkosi@company.com',    phone: '+27 11 0109', role: 'Operations Analyst',     department: 'Operations',       status: 'Inactive', joinDate: '2020-06-30' },
  { id: 10, name: 'Ryan Kowalski',    email: 'r.kowalski@company.com', phone: '+1 555-0110', role: 'Senior Engineer',        department: 'Engineering',      status: 'Active',   joinDate: '2019-08-12' },
];

const STATUS_STYLE: Record<Employee['status'], string> = {
  Active:   'plat-pill-ok',
  Inactive: 'plat-pill-mute',
  'On Leave': 'plat-pill-warn',
  Remote:   'bg-[color:var(--blue-100)] text-[color:var(--blue)]',
};

const DEPARTMENTS = ['All Departments', 'Engineering', 'Sales', 'Marketing', 'HR', 'Finance', 'Operations', 'Legal', 'Customer Success', 'Design', 'Product'];
const STATUSES: Array<Employee['status'] | 'All'> = ['All', 'Active', 'Inactive', 'On Leave', 'Remote'];

/* ──────────────────────────────────────────────
   Employees tab
────────────────────────────────────────────── */

const EmployeesTab = ({ showAddDialog, setShowAddDialog }: { showAddDialog: boolean; setShowAddDialog: (v: boolean) => void }) => {
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
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const deleteSelected = () => {
    setEmployees(prev => prev.filter(e => !selected.has(e.id)));
    setSelected(new Set());
  };

  const deleteOne = (id: number) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    setSelected(prev => { const n = new Set(prev); n.delete(id); return n; });
  };

  const stats = {
    total:   employees.length,
    active:  employees.filter(e => e.status === 'Active').length,
    onLeave: employees.filter(e => e.status === 'On Leave').length,
    remote:  employees.filter(e => e.status === 'Remote').length,
  };

  const SortIcon = ({ field }: { field: keyof Employee }) => (
    <ArrowUpDown className="h-3 w-3 ml-1 inline" style={{ color: sortField === field ? 'var(--ink)' : 'var(--text-5)' }} />
  );

  return (
    <div className="space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total',    value: stats.total   },
          { label: 'Active',   value: stats.active  },
          { label: 'On Leave', value: stats.onLeave },
          { label: 'Remote',   value: stats.remote  },
        ].map(s => (
          <div key={s.label} className="plat-stat !px-5 !py-4">
            <p className="plat-num !text-[28px]">{s.value}</p>
            <p className="plat-stat-label !mt-1.5 !text-[13px]">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 pointer-events-none" style={{ color: 'var(--text-5)' }} />
          <Input
            placeholder="Search employees…"
            value={search}
            onChange={e => { setSearch(e.target.value); setEmpPage(1); }}
            className="pl-9 !rounded-[10px] !bg-white !border-[color:var(--line)]"
          />
        </div>

        {/* Department filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className={cn(GHOST, '!h-9 min-w-[150px] justify-between !text-xs')}>
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5" style={{ color: 'var(--text-5)' }} />
                {deptFilter === 'All Departments' ? 'Department' : deptFilter}
              </span>
              <ChevronDown className="h-3.5 w-3.5 ml-2" style={{ color: 'var(--text-5)' }} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            {DEPARTMENTS.map(d => (
              <DropdownMenuItem key={d} onClick={() => { setDeptFilter(d); setEmpPage(1); }} className={cn(deptFilter === d && 'font-medium')}>
                {d}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status filter */}
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
            {STATUSES.map(s => (
              <DropdownMenuItem key={s} onClick={() => { setStatusFilter(s); setEmpPage(1); }} className={cn(statusFilter === s && 'font-medium')}>
                {s === 'All' ? 'All Statuses' : s}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex-1" />

        {/* Bulk delete */}
        {selected.size > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={deleteSelected}
            className={cn(GHOST, '!h-9 !px-4 !text-xs !text-[color:var(--bad-fg)] hover:!border-[color:var(--bad-fg)] hover:!text-[color:var(--bad-fg)]')}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Delete {selected.size}
          </Button>
        )}

        {/* Import */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowImportDialog(true)}
          className={cn(GHOST, '!h-9 !px-4 !text-xs')}
        >
          <Upload className="h-3.5 w-3.5 mr-1.5" />
          Import
        </Button>

      </div>

      {/* Table */}
      <Card className={cn(PANEL, 'overflow-hidden')}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'var(--sand)', borderBottom: '1px solid var(--line-soft)' }}>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.size === pagedEmployees.length && pagedEmployees.length > 0}
                    onChange={toggleAll}
                    className="rounded cursor-pointer"
                    style={{ borderColor: 'var(--line)' }}
                  />
                </th>
                <th
                  className="text-left px-4 py-3 font-medium cursor-pointer select-none"
                  style={{ color: 'var(--text-3)' }}
                  onClick={() => toggleSort('name')}
                >
                  Employee <SortIcon field="name" />
                </th>
                <th
                  className="text-left px-4 py-3 font-medium cursor-pointer select-none"
                  style={{ color: 'var(--text-3)' }}
                  onClick={() => toggleSort('status')}
                >
                  Status <SortIcon field="status" />
                </th>
                <th
                  className="text-left px-4 py-3 font-medium cursor-pointer select-none"
                  style={{ color: 'var(--text-3)' }}
                  onClick={() => toggleSort('role')}
                >
                  Role <SortIcon field="role" />
                </th>
                <th
                  className="text-left px-4 py-3 font-medium cursor-pointer select-none hidden md:table-cell"
                  style={{ color: 'var(--text-3)' }}
                  onClick={() => toggleSort('department')}
                >
                  Department <SortIcon field="department" />
                </th>
                <th className="text-left px-4 py-3 font-medium hidden lg:table-cell" style={{ color: 'var(--text-3)' }}>Contact</th>
                <th className="w-10 px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-sm" style={{ color: 'var(--text-5)' }}>
                    No employees match your filters.
                  </td>
                </tr>
              ) : (
                pagedEmployees.map(emp => (
                  <tr
                    key={emp.id}
                    className="last:border-b-0 transition-colors hover:bg-[rgba(20,22,26,0.02)]"
                    style={{
                      borderBottom: '1px solid var(--line-soft)',
                      background: selected.has(emp.id) ? 'rgba(20,22,26,0.04)' : undefined,
                    }}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selected.has(emp.id)}
                        onChange={() => toggleOne(emp.id)}
                        className="rounded cursor-pointer"
                        style={{ borderColor: 'var(--line)' }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className="bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 text-xs font-semibold">
                            {emp.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="font-medium truncate" style={{ color: 'var(--ink)' }}>{emp.name}</p>
                          <p className="text-xs truncate" style={{ color: 'var(--text-4)' }}>{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('plat-pill', STATUS_STYLE[emp.status])}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: 'var(--text-2)' }}>{emp.role}</td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--text-3)' }}>
                        <Building2 className="h-3 w-3" style={{ color: 'var(--text-5)' }} />
                        {emp.department}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <div className="space-y-0.5">
                        <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-4)' }}>
                          <Mail className="h-3 w-3" style={{ color: 'var(--text-5)' }} />{emp.email}
                        </p>
                        {emp.phone && (
                          <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-4)' }}>
                            <Phone className="h-3 w-3" style={{ color: 'var(--text-5)' }} />{emp.phone}
                          </p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 !rounded-[10px]">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />View profile
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Pencil className="h-4 w-4 mr-2" />Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckSquare className="h-4 w-4 mr-2" />Assign to team
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => deleteOne(emp.id)}>
                            <Trash2 className="h-4 w-4 mr-2" />Remove
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
        <div
          className="px-4 py-3 flex items-center justify-between gap-3 flex-wrap text-xs"
          style={{ color: 'var(--text-4)', background: 'var(--sand)', borderTop: '1px solid var(--line-soft)' }}
        >
          <div className="flex items-center gap-3">
            <span>
              {filtered.length > 0
                ? `Showing ${(safePage - 1) * pageSize + 1}–${Math.min(safePage * pageSize, filtered.length)} of ${filtered.length} employees`
                : '0 employees'}
              {selected.size > 0 ? ` · ${selected.size} selected` : ''}
            </span>
            <div className="flex items-center gap-1.5">
              <span style={{ color: 'var(--text-5)' }}>Rows:</span>
              <select
                value={pageSize}
                onChange={e => { setPageSize(Number(e.target.value)); setEmpPage(1); }}
                className="h-6 rounded-[8px] bg-white text-xs px-1 focus:outline-none cursor-pointer"
                style={{ border: '1px solid var(--line)', color: 'var(--text-2)' }}
              >
                {[5, 10, 15].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(deptFilter !== 'All Departments' || statusFilter !== 'All' || search) && (
              <button
                className="underline underline-offset-2"
                style={{ color: 'var(--text-3)' }}
                onClick={() => { setSearch(''); setDeptFilter('All Departments'); setStatusFilter('All'); setEmpPage(1); }}
              >
                Clear filters
              </button>
            )}
            {totalEmpPages > 1 && (
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(GHOST, 'h-7 w-7')}
                  disabled={safePage === 1}
                  onClick={() => setEmpPage(p => p - 1)}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                {Array.from({ length: totalEmpPages }, (_, i) => i + 1).map(p => (
                  <Button
                    key={p}
                    variant={p === safePage ? 'default' : 'outline'}
                    size="icon"
                    className={cn('h-7 w-7 text-xs', p !== safePage && GHOST)}
                    onClick={() => setEmpPage(p)}
                  >
                    {p}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  size="icon"
                  className={cn(GHOST, 'h-7 w-7')}
                  disabled={safePage === totalEmpPages}
                  onClick={() => setEmpPage(p => p + 1)}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </Card>

      <AddEmployeeDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onEmployeeAdded={emp => setEmployees(prev => [emp, ...prev])}
      />
      <ImportEmployeesDialog
        open={showImportDialog}
        onOpenChange={setShowImportDialog}
        onImported={emps => setEmployees(prev => [...emps, ...prev])}
      />
    </div>
  );
};

/* ──────────────────────────────────────────────
   Page
────────────────────────────────────────────── */

const Teams = () => {
  const navigate = useNavigate();
  const [showCreateTeamDialog, setShowCreateTeamDialog] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') { navigate('/login'); return; }
  }, [navigate]);

  return (
    <div className="plat min-h-screen flex flex-col">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col bg-transparent">
            <main className="flex-1 p-6">
              <div className="mb-8 flex items-center justify-between">
                <div>
                  <p className="plat-crumb">3days.teams</p>
                  <h1 className="mt-1 text-3xl">Teams</h1>
                  <p className="mt-1 text-sm" style={{ color: 'var(--text-4)' }}>Manage hybrid teams of human workers and AI assistants</p>
                </div>
                <Button size="icon" onClick={() => setShowCreateTeamDialog(true)} className="plat-btn !h-9 !w-9 !p-0">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <TeamsTabContent onShowCreate={() => setShowCreateTeamDialog(true)} />
              <CreateTeamDialog open={showCreateTeamDialog} onOpenChange={setShowCreateTeamDialog} onTeamCreated={() => {}} />
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Teams;
