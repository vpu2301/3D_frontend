
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Search, Filter, Plus, Settings, Play, Pause, MoreVertical, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

/* Design-system helpers (see src/styles/platform.css) */
const PLAT_CARD = '!rounded-[14px] !border-[color:var(--line-soft)] !shadow-none';
const PLAT_ROW_CARD =
  '!rounded-none !border-x-0 !border-t-0 !border-b !border-[color:var(--line-soft)] !shadow-none !bg-transparent last:!border-b-0';
const PLAT_TAB =
  '!h-8 !rounded-full !px-3.5 !text-xs !font-medium !shadow-none border border-[color:var(--line)] text-[color:var(--text-2)] data-[state=active]:!bg-[color:var(--ink)] data-[state=active]:!text-white data-[state=active]:!border-transparent';

const AIAgentsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const agents = [
    {
      id: 1,
      name: 'Sales Lead Qualifier',
      type: 'Lead Generation',
      status: 'Active',
      tasksCompleted: 1247,
      successRate: 94,
      lastActive: '2 minutes ago',
      description: 'Automatically qualifies incoming sales leads using predefined criteria'
    },
    {
      id: 2,
      name: 'Invoice Processor',
      type: 'Document Processing',
      status: 'Active',
      tasksCompleted: 856,
      successRate: 99,
      lastActive: '5 minutes ago',
      description: 'Processes and validates incoming invoices for approval workflow'
    },
    {
      id: 3,
      name: 'Customer Onboarding',
      type: 'Customer Support',
      status: 'Paused',
      tasksCompleted: 423,
      successRate: 97,
      lastActive: '1 hour ago',
      description: 'Guides new customers through the onboarding process'
    },
    {
      id: 4,
      name: 'Report Generator',
      type: 'Analytics',
      status: 'Active',
      tasksCompleted: 234,
      successRate: 92,
      lastActive: '10 minutes ago',
      description: 'Generates weekly performance reports automatically'
    }
  ];

  const agentTypes = [
    { name: 'Lead Generation', count: 3, color: 'bg-blue-100 text-blue-800' },
    { name: 'Document Processing', count: 5, color: 'bg-green-100 text-green-800' },
    { name: 'Customer Support', count: 2, color: 'bg-purple-100 text-purple-800' },
    { name: 'Analytics', count: 4, color: 'bg-[#1b1b1b] text-orange-800' }
  ];

  const filteredAgents = agents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agent.status.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="plat flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="plat-crumb">3days.agents</p>
          <h1 className="text-3xl mt-1">AI Agents</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-4)' }}>Autonomous AI workers handling your business processes</p>
        </div>
        <Button className="plat-btn">
          <Plus className="h-4 w-4 mr-2" />
          Create Agent
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={PLAT_CARD}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Bot className="h-4 w-4" style={{ color: 'var(--text-5)' }} />
          </CardHeader>
          <CardContent>
            <div className="plat-num !text-[28px]">14</div>
            <p className="plat-stat-sub mt-1">+2 from last month</p>
          </CardContent>
        </Card>
        <Card className={PLAT_CARD}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasks Completed</CardTitle>
            <CheckCircle className="h-4 w-4" style={{ color: 'var(--text-5)' }} />
          </CardHeader>
          <CardContent>
            <div className="plat-num !text-[28px]">2,760</div>
            <p className="plat-stat-sub mt-1">+12% from last week</p>
          </CardContent>
        </Card>
        <Card className={PLAT_CARD}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4" style={{ color: 'var(--text-5)' }} />
          </CardHeader>
          <CardContent>
            <div className="plat-num !text-[28px]">95.7%</div>
            <p className="plat-stat-sub mt-1">+0.8% from last week</p>
          </CardContent>
        </Card>
        <Card className={PLAT_CARD}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Now</CardTitle>
            <Users className="h-4 w-4" style={{ color: 'var(--text-5)' }} />
          </CardHeader>
          <CardContent>
            <div className="plat-num !text-[28px]">11</div>
            <p className="plat-stat-sub mt-1">3 paused</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="agents" className="space-y-6">
        <TabsList className="!h-auto !bg-transparent !p-0 gap-1.5">
          <TabsTrigger value="agents" className={PLAT_TAB}>All Agents</TabsTrigger>
          <TabsTrigger value="types" className={PLAT_TAB}>By Type</TabsTrigger>
          <TabsTrigger value="performance" className={PLAT_TAB}>Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4" style={{ color: 'var(--text-5)' }} />
              <Input
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 !rounded-[10px] !border-[color:var(--line)] bg-white"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px] !rounded-[10px] !border-[color:var(--line)] bg-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agents List — one panel, hairline-separated rows */}
          <div className="plat-panel !p-0 overflow-hidden">
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className={PLAT_ROW_CARD}>
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="plat-item-icon !h-10 !w-10 !rounded-[10px]">
                        <Bot className="h-[18px] w-[18px]" strokeWidth={1.75} />
                      </div>
                      <div>
                        <CardTitle className="text-[15px] font-semibold">{agent.name}</CardTitle>
                        <Badge variant="outline" className="text-xs mt-1 !border-[color:var(--line-soft)] !font-medium" style={{ color: 'var(--text-4)' }}>{agent.type}</Badge>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Settings className="h-4 w-4 mr-2" />
                          Configure
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {agent.status === 'Active' ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Resume
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 p-5 pt-0">
                  <p className="text-sm" style={{ color: 'var(--text-3)' }}>{agent.description}</p>

                  <div className="flex items-center justify-between">
                    <span className={agent.status === 'Active' ? 'plat-pill plat-pill-ok' : 'plat-pill plat-pill-mute'}>
                      {agent.status}
                    </span>
                    <span className="text-xs flex items-center" style={{ color: 'var(--text-4)' }}>
                      <Clock className="h-3 w-3 mr-1" />
                      {agent.lastActive}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t" style={{ borderColor: 'var(--line-soft)' }}>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{agent.tasksCompleted}</div>
                      <div className="text-xs" style={{ color: 'var(--text-4)' }}>Tasks Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{agent.successRate}%</div>
                      <div className="text-xs" style={{ color: 'var(--text-4)' }}>Success Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="types" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agentTypes.map((type, index) => (
              <Card key={index} className={PLAT_CARD}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-[15px] font-semibold">{type.name}</h3>
                      <p className="plat-num !text-[28px] mt-2">{type.count}</p>
                      <p className="text-sm" style={{ color: 'var(--text-4)' }}>agents</p>
                    </div>
                    <span className="plat-pill plat-pill-mute shrink-0">Active</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card className={PLAT_CARD}>
            <CardHeader>
              <CardTitle className="text-lg">Performance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--text-5)' }} strokeWidth={1.5} />
                <p className="text-sm" style={{ color: 'var(--text-4)' }}>Performance analytics will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAgentsPage;
