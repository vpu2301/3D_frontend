
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Users, Crown, Bot, Settings, Mail, Phone, Building2, Plus, UserPlus, Activity,
  MoreHorizontal, ArrowUpDown, Zap
} from 'lucide-react';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

/* Shared presentation classes (platform design system). */
const PANEL = '!rounded-[14px] !border !border-[color:var(--line-soft)] !bg-white !shadow-none';
const GHOST =
  'plat-btn-ghost !rounded-full !bg-transparent !border-[color:var(--line)] !text-[color:var(--text-2)] hover:!bg-transparent hover:!border-[color:var(--ink)] hover:!text-[color:var(--ink)]';

const TeamDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const team = {
    id: parseInt(id || '1'),
    name: 'Sales Hybrid Team',
    description: 'Human sales representatives working alongside AI assistants for maximum efficiency',
    leader: 'John Doe',
    aiWorkers: [
      { id: 1, name: 'Emma', role: 'Lead Qualification AI', status: 'Active', efficiency: '95%', bgColor: 'from-pink-500 to-rose-500'     },
      { id: 2, name: 'Maya', role: 'Customer Outreach AI',  status: 'Active', efficiency: '92%', bgColor: 'from-purple-500 to-violet-500' },
      { id: 3, name: 'Nova', role: 'Data Analysis AI',      status: 'Idle',   efficiency: '98%', bgColor: 'from-blue-500 to-cyan-500'     },
    ],
    humanMembers: [
      { id: 1, name: 'John Doe',      email: 'john@company.com',  phone: '+1 555-0201', role: 'Team Lead',        department: 'Sales', status: 'Active',   assignedAgentIds: [1, 3] },
      { id: 2, name: 'Sarah Johnson', email: 'sarah@company.com', phone: '+1 555-0202', role: 'Senior Sales Rep', department: 'Sales', status: 'Active',   assignedAgentIds: [1]    },
      { id: 3, name: 'Mike Wilson',   email: 'mike@company.com',  phone: '+1 555-0203', role: 'Sales Rep',        department: 'Sales', status: 'Remote',   assignedAgentIds: [2]    },
      { id: 4, name: 'Lisa Chen',     email: 'lisa@company.com',  phone: '+1 555-0204', role: 'Sales Rep',        department: 'Sales', status: 'On Leave', assignedAgentIds: [2, 3] },
    ],
    stats: {
      activeTasks: 14,
      monthlyGoal: 100000,
      currentRevenue: 85000,
    },
  };

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') || sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') { navigate('/login'); return; }
  }, [navigate]);

  const humanStatusStyle: Record<string, string> = {
    Active:     'plat-pill-ok',
    Inactive:   'plat-pill-mute',
    'On Leave': 'plat-pill-warn',
    Remote:     'bg-[color:var(--blue-100)] text-[color:var(--blue)]',
  };

  const aiStatusStyle: Record<string, string> = {
    Active: 'plat-pill-ok',
    Idle:   'plat-pill-mute',
    Error:  'bg-[color:var(--warn-bg)] text-[color:var(--bad-fg)]',
  };

  return (
    <div className="plat min-h-screen flex flex-col">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col bg-transparent">
            <main className="flex-1 p-6 space-y-6">

              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="plat-crumb">3days.teams.detail</p>
                  <h1 className="mt-1 text-3xl">{team.name}</h1>
                  <p className="mt-1 text-sm" style={{ color: 'var(--text-4)' }}>{team.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" className={cn(GHOST, '!h-9 !px-4 !text-xs')}>
                    <UserPlus className="h-4 w-4 mr-2" />Add Workers
                  </Button>
                  <Button className="plat-btn !h-9 !px-5 !text-xs">
                    <Settings className="h-4 w-4 mr-2" />Team Settings
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Human Workers', value: team.humanMembers.length },
                  { label: 'AI Workers',    value: team.aiWorkers.length    },
                  { label: 'Active Tasks',  value: team.stats.activeTasks   },
                  { label: 'Goal Progress', value: `${Math.round((team.stats.currentRevenue / team.stats.monthlyGoal) * 100)}%` },
                ].map(s => (
                  <div key={s.label} className="plat-stat !px-5 !py-4">
                    <p className="plat-num !text-[28px]">{s.value}</p>
                    <p className="plat-stat-label !mt-1.5 !text-[13px]">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Human Workers table */}
              <Card className={cn(PANEL, 'overflow-hidden')}>
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ background: 'var(--sand)', borderBottom: '1px solid var(--line-soft)' }}
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" style={{ color: 'var(--text-4)' }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>Human Workers</span>
                    <span className="text-xs" style={{ color: 'var(--text-5)' }}>({team.humanMembers.length})</span>
                  </div>
                  <Button size="sm" variant="outline" className={cn(GHOST, '!h-8 !px-3.5 !text-xs')}>
                    <Plus className="h-3.5 w-3.5 mr-1.5" />Add Human
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'var(--sand)', borderBottom: '1px solid var(--line-soft)' }}>
                        <th className="text-left px-4 py-3 font-medium cursor-pointer select-none" style={{ color: 'var(--text-3)' }}>
                          Employee <ArrowUpDown className="h-3 w-3 ml-1 inline" style={{ color: 'var(--text-5)' }} />
                        </th>
                        <th className="text-left px-4 py-3 font-medium cursor-pointer select-none" style={{ color: 'var(--text-3)' }}>
                          Status <ArrowUpDown className="h-3 w-3 ml-1 inline" style={{ color: 'var(--text-5)' }} />
                        </th>
                        <th className="text-left px-4 py-3 font-medium cursor-pointer select-none" style={{ color: 'var(--text-3)' }}>
                          Role <ArrowUpDown className="h-3 w-3 ml-1 inline" style={{ color: 'var(--text-5)' }} />
                        </th>
                        <th className="text-left px-4 py-3 font-medium hidden md:table-cell cursor-pointer select-none" style={{ color: 'var(--text-3)' }}>
                          Department <ArrowUpDown className="h-3 w-3 ml-1 inline" style={{ color: 'var(--text-5)' }} />
                        </th>
                        <th className="text-left px-4 py-3 font-medium hidden lg:table-cell" style={{ color: 'var(--text-3)' }}>Contact</th>
                        <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--text-3)' }}>Assigned AI</th>
                        <th className="w-10 px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {team.humanMembers.map(member => (
                        <tr
                          key={member.id}
                          className="last:border-b-0 transition-colors hover:bg-[rgba(20,22,26,0.02)]"
                          style={{ borderBottom: '1px solid var(--line-soft)' }}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarFallback className="bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 text-xs font-semibold">
                                  {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className="font-medium truncate" style={{ color: 'var(--ink)' }}>{member.name}</p>
                                  {member.name === team.leader && <Crown className="h-3.5 w-3.5 flex-shrink-0" style={{ color: 'var(--text-4)' }} />}
                                </div>
                                <p className="text-xs truncate" style={{ color: 'var(--text-4)' }}>{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn('plat-pill', humanStatusStyle[member.status] ?? 'plat-pill-mute')}>
                              {member.status}
                            </span>
                          </td>
                          <td className="px-4 py-3" style={{ color: 'var(--text-2)' }}>{member.role}</td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--text-3)' }}>
                              <Building2 className="h-3 w-3" style={{ color: 'var(--text-5)' }} />{member.department}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <div className="space-y-0.5">
                              <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-4)' }}>
                                <Mail className="h-3 w-3" style={{ color: 'var(--text-5)' }} />{member.email}
                              </p>
                              <p className="text-xs flex items-center gap-1" style={{ color: 'var(--text-4)' }}>
                                <Phone className="h-3 w-3" style={{ color: 'var(--text-5)' }} />{member.phone}
                              </p>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              {member.assignedAgentIds.map(agentId => {
                                const agent = team.aiWorkers.find(a => a.id === agentId);
                                if (!agent) return null;
                                return (
                                  <div
                                    key={agentId}
                                    title={agent.name}
                                    className="h-6 w-6 rounded-full flex items-center justify-center"
                                    style={{ background: 'var(--sand-deep)', color: 'var(--ink)' }}
                                  >
                                    <Bot className="h-3 w-3" strokeWidth={1.75} />
                                  </div>
                                );
                              })}
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
                                <DropdownMenuItem>View profile</DropdownMenuItem>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

              {/* AI Workers table */}
              <Card className={cn(PANEL, 'overflow-hidden')}>
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{ background: 'var(--sand)', borderBottom: '1px solid var(--line-soft)' }}
                >
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" style={{ color: 'var(--text-4)' }} />
                    <span className="text-sm font-semibold" style={{ color: 'var(--ink)' }}>AI Workers</span>
                    <span className="text-xs" style={{ color: 'var(--text-5)' }}>({team.aiWorkers.length})</span>
                  </div>
                  <Button size="sm" variant="outline" className={cn(GHOST, '!h-8 !px-3.5 !text-xs')}>
                    <Plus className="h-3.5 w-3.5 mr-1.5" />Deploy AI
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ background: 'var(--sand)', borderBottom: '1px solid var(--line-soft)' }}>
                        <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--text-3)' }}>
                          <span className="flex items-center gap-1">Worker <ArrowUpDown className="h-3 w-3" style={{ color: 'var(--text-5)' }} /></span>
                        </th>
                        <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--text-3)' }}>Role</th>
                        <th className="text-left px-4 py-3 font-medium" style={{ color: 'var(--text-3)' }}>Status</th>
                        <th className="text-left px-4 py-3 font-medium hidden md:table-cell" style={{ color: 'var(--text-3)' }}>Efficiency</th>
                        <th className="w-10 px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {team.aiWorkers.map(ai => (
                        <tr
                          key={ai.id}
                          className="last:border-b-0 transition-colors hover:bg-[rgba(20,22,26,0.02)]"
                          style={{ borderBottom: '1px solid var(--line-soft)' }}
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div
                                className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0"
                                style={{ background: 'var(--sand-deep)', color: 'var(--ink)' }}
                              >
                                <Bot className="h-4 w-4" strokeWidth={1.75} />
                              </div>
                              <p className="font-medium" style={{ color: 'var(--ink)' }}>{ai.name}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3" style={{ color: 'var(--text-2)' }}>{ai.role}</td>
                          <td className="px-4 py-3">
                            <span className={cn('plat-pill', aiStatusStyle[ai.status] ?? 'plat-pill-mute')}>
                              {ai.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="inline-flex items-center gap-1 text-xs" style={{ color: 'var(--text-2)' }}>
                              <Zap className="h-3 w-3" style={{ color: 'var(--text-5)' }} />{ai.efficiency}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 !rounded-[10px]">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>View profile</DropdownMenuItem>
                                <DropdownMenuItem><Activity className="h-4 w-4 mr-2" />Activity</DropdownMenuItem>
                                <DropdownMenuItem>Configure</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">Remove</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>

            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default TeamDetail;
