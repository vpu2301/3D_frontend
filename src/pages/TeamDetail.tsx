
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
    Active:     'bg-green-100 text-green-700 border-green-200',
    Inactive:   'bg-gray-100 text-gray-500 border-gray-200',
    'On Leave': 'bg-amber-100 text-amber-700 border-amber-200',
    Remote:     'bg-blue-100 text-blue-700 border-blue-200',
  };

  const aiStatusStyle: Record<string, string> = {
    Active: 'bg-green-100 text-green-700 border-green-200',
    Idle:   'bg-gray-100 text-gray-500 border-gray-200',
    Error:  'bg-red-100 text-red-700 border-red-200',
  };

  return (
    <div className="min-h-screen flex flex-col bg-[hsl(30,25%,97%)]">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <main className="flex-1 p-6 space-y-6">

              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{team.name}</h1>
                  <p className="text-gray-600">{team.description}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <UserPlus className="h-4 w-4 mr-2" />Add Workers
                  </Button>
                  <Button>
                    <Settings className="h-4 w-4 mr-2" />Team Settings
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Human Workers', value: team.humanMembers.length, color: 'text-blue-600',   bg: 'bg-blue-50'   },
                  { label: 'AI Workers',    value: team.aiWorkers.length,    color: 'text-green-600',  bg: 'bg-green-50'  },
                  { label: 'Active Tasks',  value: team.stats.activeTasks,   color: 'text-orange-600', bg: 'bg-orange-50' },
                  { label: 'Goal Progress', value: `${Math.round((team.stats.currentRevenue / team.stats.monthlyGoal) * 100)}%`, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map(s => (
                  <Card key={s.label} className={cn('border-gray-200/60', s.bg)}>
                    <CardContent className="p-4">
                      <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                      <p className={cn('text-2xl font-semibold', s.color)}>{s.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Human Workers table */}
              <Card className="bg-white border-gray-200/60 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/60">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Human Workers</span>
                    <span className="text-xs text-gray-400">({team.humanMembers.length})</span>
                  </div>
                  <Button size="sm" variant="outline" className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
                    <Plus className="h-3.5 w-3.5 mr-1.5" />Add Human
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/60">
                        <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900">
                          Employee <ArrowUpDown className="h-3 w-3 ml-1 inline text-gray-400" />
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900">
                          Status <ArrowUpDown className="h-3 w-3 ml-1 inline text-gray-400" />
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600 cursor-pointer select-none hover:text-gray-900">
                          Role <ArrowUpDown className="h-3 w-3 ml-1 inline text-gray-400" />
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell cursor-pointer select-none hover:text-gray-900">
                          Department <ArrowUpDown className="h-3 w-3 ml-1 inline text-gray-400" />
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Contact</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Assigned AI</th>
                        <th className="w-10 px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {team.humanMembers.map(member => (
                        <tr key={member.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8 flex-shrink-0">
                                <AvatarFallback className="bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 text-xs font-semibold">
                                  {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className="font-medium text-gray-900 truncate">{member.name}</p>
                                  {member.name === team.leader && <Crown className="h-3.5 w-3.5 text-amber-500 flex-shrink-0" />}
                                </div>
                                <p className="text-xs text-gray-500 truncate">{member.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', humanStatusStyle[member.status] ?? 'bg-gray-100 text-gray-500 border-gray-200')}>
                              {member.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{member.role}</td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="inline-flex items-center gap-1 text-gray-600 text-xs">
                              <Building2 className="h-3 w-3 text-gray-400" />{member.department}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden lg:table-cell">
                            <div className="space-y-0.5">
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Mail className="h-3 w-3 text-gray-400" />{member.email}
                              </p>
                              <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Phone className="h-3 w-3 text-gray-400" />{member.phone}
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
                                    className={cn('h-6 w-6 rounded-full bg-gradient-to-br flex items-center justify-center', agent.bgColor)}
                                  >
                                    <Bot className="h-3 w-3 text-white" />
                                  </div>
                                );
                              })}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-7 w-7 hover:bg-gray-100">
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
              <Card className="bg-white border-gray-200/60 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/60">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">AI Workers</span>
                    <span className="text-xs text-gray-400">({team.aiWorkers.length})</span>
                  </div>
                  <Button size="sm" variant="outline" className="bg-white border-gray-200 text-gray-700 hover:bg-gray-50">
                    <Plus className="h-3.5 w-3.5 mr-1.5" />Deploy AI
                  </Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50/40">
                        <th className="text-left px-4 py-3 font-medium text-gray-600">
                          <span className="flex items-center gap-1">Worker <ArrowUpDown className="h-3 w-3 text-gray-400" /></span>
                        </th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                        <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Efficiency</th>
                        <th className="w-10 px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody>
                      {team.aiWorkers.map(ai => (
                        <tr key={ai.id} className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50/80 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                                <Bot className="h-4 w-4 text-white" />
                              </div>
                              <p className="font-medium text-gray-900">{ai.name}</p>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-gray-700">{ai.role}</td>
                          <td className="px-4 py-3">
                            <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border', aiStatusStyle[ai.status] ?? 'bg-gray-100 text-gray-500 border-gray-200')}>
                              {ai.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 hidden md:table-cell">
                            <span className="inline-flex items-center gap-1 text-xs text-gray-700">
                              <Zap className="h-3 w-3 text-amber-500" />{ai.efficiency}
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
