
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Network, 
  Shield, 
  Activity, 
  Globe, 
  Server, 
  Zap,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Plus,
  Settings,
  Eye,
  BarChart3,
  Clock,
  Users,
  Lock,
  Wifi,
  Database,
  Router,
  Signal
} from 'lucide-react';

const Networks = () => {
  const navigate = useNavigate();
  const [userEmail] = useState(localStorage.getItem('userEmail') || '');

  const networks = [
    {
      id: 1,
      name: 'Corporate Internal Network',
      networkId: 'corp-internal-001',
      status: 'active',
      type: 'internal',
      region: 'US-East',
      connectedAgents: 24,
      throughput: 1247,
      latency: 12,
      uptime: 99.9,
      bandwidth: 1000,
      lastActivity: '2 minutes ago',
      securityLevel: 'high',
      encryption: 'AES-256',
      protocol: 'HTTPS/WSS',
      description: 'Primary internal network for all corporate AI employees'
    },
    {
      id: 2,
      name: 'Partner Ecosystem Hub',
      networkId: 'partner-eco-002',
      status: 'active',
      type: 'partner',
      region: 'Global',
      connectedAgents: 15,
      throughput: 892,
      latency: 25,
      uptime: 99.7,
      bandwidth: 500,
      lastActivity: '5 minutes ago',
      securityLevel: 'high',
      encryption: 'AES-256',
      protocol: 'HTTPS/WSS',
      description: 'Secure network for partner organization collaboration'
    },
    {
      id: 3,
      name: 'Financial Services Gateway',
      networkId: 'finserv-gw-003',
      status: 'maintenance',
      type: 'external',
      region: 'US-West',
      connectedAgents: 8,
      throughput: 324,
      latency: 45,
      uptime: 98.2,
      bandwidth: 250,
      lastActivity: '1 hour ago',
      securityLevel: 'ultra-high',
      encryption: 'AES-256 + PQC',
      protocol: 'HTTPS/WSS',
      description: 'High-security network for financial institution integrations'
    },
    {
      id: 4,
      name: 'Development Sandbox',
      networkId: 'dev-sandbox-004',
      status: 'idle',
      type: 'internal',
      region: 'EU-Central',
      connectedAgents: 3,
      throughput: 45,
      latency: 8,
      uptime: 99.5,
      bandwidth: 100,
      lastActivity: '3 hours ago',
      securityLevel: 'medium',
      encryption: 'AES-128',
      protocol: 'HTTPS/WSS',
      description: 'Testing environment for new AI agent deployments'
    }
  ];

  const networkStats = {
    totalNetworks: networks.length,
    activeNetworks: networks.filter(n => n.status === 'active').length,
    totalAgents: networks.reduce((sum, n) => sum + n.connectedAgents, 0),
    averageLatency: Math.round(networks.reduce((sum, n) => sum + n.latency, 0) / networks.length),
    totalThroughput: networks.reduce((sum, n) => sum + n.throughput, 0),
    averageUptime: (networks.reduce((sum, n) => sum + n.uptime, 0) / networks.length).toFixed(1)
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'maintenance': return 'bg-yellow-100 text-yellow-700';
      case 'idle': return 'bg-gray-100 text-gray-700';
      case 'error': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'maintenance': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'idle': return <Clock className="h-4 w-4 text-gray-500" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'internal': return 'bg-blue-100 text-blue-700';
      case 'external': return 'bg-purple-100 text-purple-700';
      case 'partner': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getSecurityColor = (level: string) => {
    switch (level) {
      case 'ultra-high': return 'bg-red-100 text-red-700';
      case 'high': return 'bg-orange-100 text-orange-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'low': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      <SidebarProvider>
        <div className="flex w-full flex-1">
          <AppSidebar />
          <SidebarInset className="flex-1 flex flex-col">
            <LoggedInHeader userEmail={userEmail} />
            
            <main className="flex-1 p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500">
                    <Network className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-light text-gray-900">Network Management</h1>
                    <p className="text-gray-600">Monitor and manage communication networks</p>
                  </div>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Network
                </Button>
              </div>

              {/* Network Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Networks</p>
                        <p className="text-2xl font-light text-gray-900">{networkStats.totalNetworks}</p>
                      </div>
                      <Network className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Networks</p>
                        <p className="text-2xl font-light text-gray-900">{networkStats.activeNetworks}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Connected Agents</p>
                        <p className="text-2xl font-light text-gray-900">{networkStats.totalAgents}</p>
                      </div>
                      <Users className="h-8 w-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg Latency</p>
                        <p className="text-2xl font-light text-gray-900">{networkStats.averageLatency}ms</p>
                      </div>
                      <Zap className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Throughput</p>
                        <p className="text-2xl font-light text-gray-900">{networkStats.totalThroughput}</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Avg Uptime</p>
                        <p className="text-2xl font-light text-gray-900">{networkStats.averageUptime}%</p>
                      </div>
                      <Activity className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content */}
              <Tabs defaultValue="networks" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="networks">Networks</TabsTrigger>
                  <TabsTrigger value="topology">Topology</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                  <TabsTrigger value="analytics">Analytics</TabsTrigger>
                </TabsList>

                <TabsContent value="networks" className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    {networks.map((network) => (
                      <Card key={network.id} className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="p-2 rounded-lg bg-blue-50">
                                <Server className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{network.name}</CardTitle>
                                <p className="text-sm text-gray-600 font-mono">{network.networkId}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline" className={getTypeColor(network.type)}>
                                {network.type}
                              </Badge>
                              <Badge variant="outline" className={getStatusColor(network.status)}>
                                {getStatusIcon(network.status)}
                                <span className="ml-1 capitalize">{network.status}</span>
                              </Badge>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 mb-6">{network.description}</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Region</p>
                              <p className="font-medium">{network.region}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Agents</p>
                              <p className="font-medium">{network.connectedAgents}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Throughput</p>
                              <p className="font-medium">{network.throughput} msg/s</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Latency</p>
                              <p className="font-medium">{network.latency}ms</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Uptime</p>
                              <p className="font-medium">{network.uptime}%</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Bandwidth</p>
                              <p className="font-medium">{network.bandwidth} Mbps</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Security</p>
                              <Badge variant="outline" className={getSecurityColor(network.securityLevel)}>
                                {network.securityLevel}
                              </Badge>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 uppercase tracking-wide">Last Activity</p>
                              <p className="font-medium text-sm">{network.lastActivity}</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <Lock className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">{network.encryption}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Wifi className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-600">{network.protocol}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                <Settings className="h-4 w-4 mr-2" />
                                Configure
                              </Button>
                              <Button variant="outline" size="sm">
                                <Activity className="h-4 w-4 mr-2" />
                                Monitor
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="topology" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <Router className="h-5 w-5 mr-2" />
                        Network Topology
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-8 rounded-lg text-center">
                        <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Network Topology View</h3>
                        <p className="text-gray-600">Interactive network topology visualization would be displayed here showing connections between AI agents, networks, and data flows.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Shield className="h-5 w-5 mr-2" />
                          Security Overview
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Encrypted Networks</span>
                          <span className="font-medium">4/4 (100%)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Failed Auth Attempts</span>
                          <span className="font-medium">0 (24h)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Security Incidents</span>
                          <span className="font-medium">0 (7d)</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Compliance Score</span>
                          <span className="font-medium">98%</span>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Lock className="h-5 w-5 mr-2" />
                          Encryption Standards
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-3">
                          <div className="p-3 bg-green-50 rounded-lg">
                            <p className="font-medium text-green-800">AES-256 Encryption</p>
                            <p className="text-sm text-green-600">3 networks using this standard</p>
                          </div>
                          <div className="p-3 bg-red-50 rounded-lg">
                            <p className="font-medium text-red-800">AES-256 + PQC</p>
                            <p className="text-sm text-red-600">1 network with quantum-resistant encryption</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="analytics" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2" />
                        Network Analytics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-8 rounded-lg text-center">
                        <Signal className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Network Performance Analytics</h3>
                        <p className="text-gray-600">Detailed charts and metrics for network performance, traffic patterns, and usage statistics would be displayed here.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </main>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default Networks;
