
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Workflow, Search, Plus, Play, Pause, Settings, MoreVertical, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

/* Design-system helpers (see src/styles/platform.css) */
const PLAT_CARD = '!rounded-[14px] !border-[color:var(--line-soft)] !shadow-none';
const PLAT_ROW_CARD =
  '!rounded-none !border-x-0 !border-t-0 !border-b !border-[color:var(--line-soft)] !shadow-none !bg-transparent last:!border-b-0';
const PLAT_TAB =
  '!h-8 !rounded-full !px-3.5 !text-xs !font-medium !shadow-none border border-[color:var(--line)] text-[color:var(--text-2)] data-[state=active]:!bg-[color:var(--ink)] data-[state=active]:!text-white data-[state=active]:!border-transparent';

const WorkflowsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const workflows = [
    {
      id: 1,
      name: 'Customer Onboarding Flow',
      description: 'Automated workflow for new customer registration and setup',
      status: 'Active',
      completedRuns: 156,
      successRate: 98,
      lastRun: '5 minutes ago',
      steps: 8,
      trigger: 'New customer signup'
    },
    {
      id: 2,
      name: 'Invoice Processing',
      description: 'Handles invoice receipt, validation, and approval routing',
      status: 'Active',
      completedRuns: 423,
      successRate: 95,
      lastRun: '12 minutes ago',
      steps: 6,
      trigger: 'Email attachment'
    },
    {
      id: 3,
      name: 'Lead Qualification',
      description: 'Scores and routes sales leads based on predefined criteria',
      status: 'Paused',
      completedRuns: 89,
      successRate: 92,
      lastRun: '2 hours ago',
      steps: 5,
      trigger: 'Form submission'
    },
    {
      id: 4,
      name: 'Weekly Report Generation',
      description: 'Compiles and sends weekly performance reports to stakeholders',
      status: 'Active',
      completedRuns: 24,
      successRate: 100,
      lastRun: '1 day ago',
      steps: 4,
      trigger: 'Schedule (Weekly)'
    }
  ];

  const templates = [
    {
      name: 'Customer Support Ticket Routing',
      description: 'Automatically route support tickets to the right department',
      category: 'Customer Support',
      complexity: 'Medium'
    },
    {
      name: 'Employee Onboarding',
      description: 'Complete workflow for new employee setup and training',
      category: 'HR',
      complexity: 'High'
    },
    {
      name: 'Document Approval',
      description: 'Multi-step document review and approval process',
      category: 'Operations',
      complexity: 'Low'
    },
    {
      name: 'Sales Pipeline Management',
      description: 'Automated lead nurturing and opportunity progression',
      category: 'Sales',
      complexity: 'High'
    }
  ];

  const filteredWorkflows = workflows.filter(workflow =>
    workflow.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="plat flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="plat-crumb">3days.workflows</p>
          <h1 className="text-3xl mt-1">Workflows</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--text-4)' }}>Automate your business processes with intelligent workflows</p>
        </div>
        <Button className="plat-btn">
          <Plus className="h-4 w-4 mr-2" />
          Create Workflow
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className={PLAT_CARD}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
            <Workflow className="h-4 w-4" style={{ color: 'var(--text-5)' }} />
          </CardHeader>
          <CardContent>
            <div className="plat-num !text-[28px]">12</div>
            <p className="plat-stat-sub mt-1">+3 this month</p>
          </CardContent>
        </Card>
        <Card className={PLAT_CARD}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Runs</CardTitle>
            <CheckCircle className="h-4 w-4" style={{ color: 'var(--text-5)' }} />
          </CardHeader>
          <CardContent>
            <div className="plat-num !text-[28px]">1,247</div>
            <p className="plat-stat-sub mt-1">+18% from last week</p>
          </CardContent>
        </Card>
        <Card className={PLAT_CARD}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4" style={{ color: 'var(--text-5)' }} />
          </CardHeader>
          <CardContent>
            <div className="plat-num !text-[28px]">96.4%</div>
            <p className="plat-stat-sub mt-1">+1.2% from last week</p>
          </CardContent>
        </Card>
        <Card className={PLAT_CARD}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Runs</CardTitle>
            <AlertTriangle className="h-4 w-4" style={{ color: 'var(--text-5)' }} />
          </CardHeader>
          <CardContent>
            <div className="plat-num !text-[28px]">8</div>
            <p className="plat-stat-sub mt-1">-3 from last week</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="workflows" className="space-y-6">
        <TabsList className="!h-auto !bg-transparent !p-0 gap-1.5">
          <TabsTrigger value="workflows" className={PLAT_TAB}>My Workflows</TabsTrigger>
          <TabsTrigger value="templates" className={PLAT_TAB}>Templates</TabsTrigger>
          <TabsTrigger value="builder" className={PLAT_TAB}>Workflow Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="workflows" className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4" style={{ color: 'var(--text-5)' }} />
            <Input
              placeholder="Search workflows..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 !rounded-[10px] !border-[color:var(--line)] bg-white"
            />
          </div>

          {/* Workflows List — one panel, hairline-separated rows */}
          <div className="plat-panel !p-0 overflow-hidden">
            {filteredWorkflows.map((workflow) => (
              <Card key={workflow.id} className={PLAT_ROW_CARD}>
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="plat-item-icon !h-10 !w-10 !rounded-[10px]">
                        <Workflow className="h-[18px] w-[18px]" strokeWidth={1.75} />
                      </div>
                      <div>
                        <CardTitle className="text-[15px] font-semibold">{workflow.name}</CardTitle>
                        <p className="text-xs mt-1" style={{ color: 'var(--text-4)' }}>{workflow.steps} steps</p>
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
                          Edit Workflow
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          {workflow.status === 'Active' ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 p-5 pt-0">
                  <p className="text-sm" style={{ color: 'var(--text-3)' }}>{workflow.description}</p>

                  <div className="flex items-center justify-between">
                    <span className={workflow.status === 'Active' ? 'plat-pill plat-pill-ok' : 'plat-pill plat-pill-mute'}>
                      {workflow.status}
                    </span>
                    <span className="text-xs flex items-center" style={{ color: 'var(--text-4)' }}>
                      <Clock className="h-3 w-3 mr-1" />
                      {workflow.lastRun}
                    </span>
                  </div>

                  <div className="text-xs p-2.5 rounded-[10px]" style={{ background: 'var(--sand)', color: 'var(--text-3)' }}>
                    <strong>Trigger:</strong> {workflow.trigger}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t" style={{ borderColor: 'var(--line-soft)' }}>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{workflow.completedRuns}</div>
                      <div className="text-xs" style={{ color: 'var(--text-4)' }}>Completed Runs</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold">{workflow.successRate}%</div>
                      <div className="text-xs" style={{ color: 'var(--text-4)' }}>Success Rate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template, index) => (
              <Card key={index} className={`${PLAT_CARD} hover:!border-[color:var(--line)] transition-colors cursor-pointer`}>
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <div className="plat-item-icon !h-10 !w-10 !rounded-[10px]">
                        <Workflow className="h-[18px] w-[18px]" strokeWidth={1.75} />
                      </div>
                      <div>
                        <CardTitle className="text-[15px] font-semibold">{template.name}</CardTitle>
                        <Badge variant="outline" className="text-xs mt-1 !border-[color:var(--line-soft)] !font-medium" style={{ color: 'var(--text-4)' }}>{template.category}</Badge>
                      </div>
                    </div>
                    <span
                      className={
                        template.complexity === 'High' ? 'plat-pill plat-pill-warn shrink-0' :
                        template.complexity === 'Medium' ? 'plat-pill plat-pill-mute shrink-0' :
                        'plat-pill plat-pill-ok shrink-0'
                      }
                    >
                      {template.complexity}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <p className="text-sm mb-4" style={{ color: 'var(--text-3)' }}>{template.description}</p>
                  <Button className="plat-btn-ghost w-full !justify-center !border-[color:var(--line)]" variant="outline">
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="builder" className="space-y-4">
          <Card className={PLAT_CARD}>
            <CardHeader>
              <CardTitle className="text-lg">Workflow Builder</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Workflow className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--text-5)' }} strokeWidth={1.5} />
                <p className="mb-4 text-sm" style={{ color: 'var(--text-4)' }}>Visual workflow builder coming soon</p>
                <Button className="plat-btn">Start Building</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default WorkflowsPage;
