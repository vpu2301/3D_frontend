
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  GitBranch, 
  Network, 
  Shield, 
  Zap, 
  MessageSquare, 
  Database, 
  ArrowRight, 
  Lock, 
  Activity, 
  Cpu, 
  Globe,
  Code,
  Settings,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3
} from 'lucide-react';

const Flows = () => {
  const protocolFeatures = [
    {
      icon: Network,
      title: 'Distributed Network Architecture',
      description: 'Decentralized communication protocol enabling direct agent-to-agent messaging across organizational boundaries.',
      status: 'Active'
    },
    {
      icon: Shield,
      title: 'End-to-End Encryption',
      description: 'Military-grade encryption ensures all cross-company communications remain secure and private.',
      status: 'Active'
    },
    {
      icon: Zap,
      title: 'Real-Time Synchronization',
      description: 'Instant data synchronization and workflow coordination with sub-second latency guarantees.',
      status: 'Active'
    },
    {
      icon: MessageSquare,
      title: 'Protocol Translation',
      description: 'Automatic translation between different business protocols and data formats.',
      status: 'Beta'
    }
  ];

  const infrastructureComponents = [
    {
      name: 'Message Routing Layer',
      description: 'Intelligent routing engine that directs messages between agents based on capabilities and availability.',
      metrics: { throughput: '50K msg/sec', latency: '<10ms', uptime: '99.9%' }
    },
    {
      name: 'Authentication Service',
      description: 'OAuth 2.0 and JWT-based authentication with role-based access control for cross-org security.',
      metrics: { requests: '1M/day', responseTime: '<5ms', accuracy: '100%' }
    },
    {
      name: 'Data Transformation Engine',
      description: 'Real-time data format conversion and schema mapping between different business systems.',
      metrics: { transformations: '100K/hour', formats: '50+', accuracy: '99.8%' }
    },
    {
      name: 'Workflow Orchestrator',
      description: 'Coordinates complex multi-agent workflows spanning multiple organizations and platforms.',
      metrics: { workflows: '10K active', completion: '98.5%', avgTime: '2.3min' }
    }
  ];

  const communicationFlows = [
    {
      title: 'Supply Chain Coordination',
      participants: ['Supplier Agent', 'Manufacturer Agent', 'Logistics Agent', 'Retailer Agent'],
      description: 'Automated coordination of inventory, production schedules, and delivery logistics across the supply chain.',
      flowType: 'Multi-party'
    },
    {
      title: 'Financial Settlement',
      participants: ['Bank Agent', 'Merchant Agent', 'Payment Processor Agent'],
      description: 'Real-time payment processing and settlement between financial institutions and merchants.',
      flowType: 'Secure Transaction'
    },
    {
      title: 'Compliance Reporting',
      participants: ['Legal Agent', 'Audit Agent', 'Regulatory Agent', 'Compliance Agent'],
      description: 'Automated compliance monitoring and reporting across regulated industries.',
      flowType: 'Regulatory'
    },
    {
      title: 'Cross-Platform Integration',
      participants: ['CRM Agent', 'ERP Agent', 'Analytics Agent', 'Support Agent'],
      description: 'Seamless data synchronization and workflow coordination between different business platforms.',
      flowType: 'System Integration'
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1">
          <div className="p-6 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-[color:var(--ink)] mb-2">Communication Flows</h1>
                <p className="text-[color:var(--text-2)]">Infrastructure and protocols for cross-company agentic communication</p>
              </div>
              <Button className="bg-[color:var(--blue)] hover:bg-[color:var(--blue)]">
                <Code className="h-4 w-4 mr-2" />
                View API Docs
              </Button>
            </div>

            {/* Protocol Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GitBranch className="h-5 w-5 mr-2 text-[color:var(--blue)]" />
                  Protocol Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {protocolFeatures.map((feature, index) => (
                    <div key={index} className="border rounded-[16px] p-4">
                      <div className="flex items-center justify-between mb-3">
                        <feature.icon className="h-6 w-6 text-[color:var(--blue)]" />
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          feature.status === 'Active' ? 'bg-[color:var(--blue-100)] text-[color:var(--blue)]' : 'bg-[color:var(--blue-100)] text-[color:var(--blue)]'
                        }`}>
                          {feature.status}
                        </span>
                      </div>
                      <h3 className="font-medium text-[color:var(--ink)] mb-2">{feature.title}</h3>
                      <p className="text-sm text-[color:var(--text-2)]">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Infrastructure Components */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Cpu className="h-5 w-5 mr-2 text-[color:var(--blue)]" />
                  Infrastructure Components
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {infrastructureComponents.map((component, index) => (
                    <div key={index} className="border rounded-[16px] p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-[color:var(--ink)] mb-2">{component.name}</h3>
                          <p className="text-[color:var(--text-2)] mb-4">{component.description}</p>
                        </div>
                        <div className="flex items-center">
                          <Activity className="h-4 w-4 text-[color:var(--blue)] mr-1" />
                          <span className="text-sm text-[color:var(--blue)]">Online</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 bg-[color:var(--sand)] rounded-[16px] p-4">
                        {Object.entries(component.metrics).map(([key, value]) => (
                          <div key={key} className="text-center">
                            <div className="text-lg font-semibold text-[color:var(--ink)]">{value}</div>
                            <div className="text-xs text-[color:var(--text-2)] capitalize">{key.replace(/([A-Z])/g, ' $1')}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Communication Flows */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Network className="h-5 w-5 mr-2 text-[color:var(--blue)]" />
                  Active Communication Flows
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {communicationFlows.map((flow, index) => (
                    <div key={index} className="border rounded-[16px] p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-[color:var(--ink)]">{flow.title}</h3>
                        <span className="px-3 py-1 bg-[color:var(--blue-100)] text-[color:var(--blue)] text-xs rounded-full">
                          {flow.flowType}
                        </span>
                      </div>
                      <p className="text-[color:var(--text-2)] mb-4">{flow.description}</p>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-[color:var(--ink)]">Participating Agents:</p>
                        <div className="grid grid-cols-2 gap-2">
                          {flow.participants.map((participant, idx) => (
                            <div key={idx} className="flex items-center">
                              <div className="w-2 h-2 bg-[color:var(--blue)] rounded-full mr-2"></div>
                              <span className="text-sm text-[color:var(--text-2)]">{participant}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="mt-4 w-full">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        View Flow Analytics
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Protocol Security */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-[color:var(--blue)]" />
                    Security Protocols
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[color:var(--blue)] mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-[color:var(--ink)]">TLS 1.3 Encryption</h4>
                        <p className="text-sm text-[color:var(--text-2)]">All communications encrypted in transit</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[color:var(--blue)] mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-[color:var(--ink)]">Zero-Trust Architecture</h4>
                        <p className="text-sm text-[color:var(--text-2)]">Every connection verified and authenticated</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-[color:var(--blue)] mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-[color:var(--ink)]">Message Integrity</h4>
                        <p className="text-sm text-[color:var(--text-2)]">Cryptographic signatures prevent tampering</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-[color:var(--blue)] mr-3 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-[color:var(--ink)]">Threat Monitoring</h4>
                        <p className="text-sm text-[color:var(--text-2)]">Real-time detection of anomalous behavior</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-[color:var(--blue)]" />
                    Performance Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-[color:var(--text-2)]">Message Throughput</span>
                      <span className="font-semibold text-[color:var(--ink)]">50,000 msg/sec</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[color:var(--text-2)]">Average Latency</span>
                      <span className="font-semibold text-[color:var(--ink)]">8.5ms</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[color:var(--text-2)]">Success Rate</span>
                      <span className="font-semibold text-[color:var(--blue)]">99.95%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[color:var(--text-2)]">Active Connections</span>
                      <span className="font-semibold text-[color:var(--ink)]">1,247</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[color:var(--text-2)]">Partner Organizations</span>
                      <span className="font-semibold text-[color:var(--ink)]">89</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[color:var(--text-2)]">Daily Transactions</span>
                      <span className="font-semibold text-[color:var(--ink)]">2.3M</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Integration Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2 text-[color:var(--text-2)]" />
                  Integration Guide
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[color:var(--blue-100)] rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-semibold text-[color:var(--blue)]">1</span>
                    </div>
                    <h3 className="font-medium text-[color:var(--ink)] mb-2">Connect API</h3>
                    <p className="text-sm text-[color:var(--text-2)]">Integrate your agents with our communication protocol</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[color:var(--blue-100)] rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-semibold text-[color:var(--blue)]">2</span>
                    </div>
                    <h3 className="font-medium text-[color:var(--ink)] mb-2">Configure Security</h3>
                    <p className="text-sm text-[color:var(--text-2)]">Set up authentication and access permissions</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[color:var(--blue-100)] rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-semibold text-[color:var(--blue)]">3</span>
                    </div>
                    <h3 className="font-medium text-[color:var(--ink)] mb-2">Define Workflows</h3>
                    <p className="text-sm text-[color:var(--text-2)]">Create communication patterns and data flows</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-[color:var(--blue-100)] rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-lg font-semibold text-[color:var(--blue)]">4</span>
                    </div>
                    <h3 className="font-medium text-[color:var(--ink)] mb-2">Go Live</h3>
                    <p className="text-sm text-[color:var(--text-2)]">Deploy and monitor cross-company communications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Flows;
