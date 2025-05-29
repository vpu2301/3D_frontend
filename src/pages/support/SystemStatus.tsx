
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, AlertTriangle, XCircle, Clock, Activity, Server, Database, Globe, Shield, Zap } from 'lucide-react';

const SystemStatus = () => {
  const currentStatus = {
    overall: 'operational',
    lastUpdated: '2024-01-15 14:30 UTC'
  };

  const services = [
    {
      name: 'API Gateway',
      status: 'operational',
      uptime: '99.98%',
      responseTime: '142ms',
      icon: Server
    },
    {
      name: 'Workflow Engine',
      status: 'operational',
      uptime: '99.99%',
      responseTime: '89ms',
      icon: Zap
    },
    {
      name: 'Database',
      status: 'operational',
      uptime: '100%',
      responseTime: '23ms',
      icon: Database
    },
    {
      name: 'Authentication',
      status: 'operational',
      uptime: '99.97%',
      responseTime: '156ms',
      icon: Shield
    },
    {
      name: 'File Storage',
      status: 'operational',
      uptime: '99.95%',
      responseTime: '78ms',
      icon: Database
    },
    {
      name: 'Web Application',
      status: 'operational',
      uptime: '99.99%',
      responseTime: '234ms',
      icon: Globe
    },
    {
      name: 'Email Service',
      status: 'degraded',
      uptime: '98.76%',
      responseTime: '890ms',
      icon: Globe
    },
    {
      name: 'Notification Service',
      status: 'operational',
      uptime: '99.94%',
      responseTime: '167ms',
      icon: Activity
    }
  ];

  const incidents = [
    {
      title: 'Email Service Performance Degradation',
      status: 'investigating',
      severity: 'minor',
      startTime: '2024-01-15 13:45 UTC',
      description: 'We are currently investigating reports of slower than normal email delivery times.',
      updates: [
        {
          time: '2024-01-15 14:30 UTC',
          message: 'We have identified the root cause and are implementing a fix. Email delivery times are improving.'
        },
        {
          time: '2024-01-15 14:00 UTC',
          message: 'Our team is actively investigating reports of delayed email notifications.'
        }
      ]
    }
  ];

  const pastIncidents = [
    {
      title: 'Scheduled Maintenance - Database Optimization',
      date: '2024-01-10',
      duration: '2 hours',
      severity: 'maintenance'
    },
    {
      title: 'API Rate Limiting Issues',
      date: '2024-01-05',
      duration: '45 minutes',
      severity: 'minor'
    },
    {
      title: 'Workflow Engine Timeout Issues',
      date: '2023-12-28',
      duration: '1.5 hours',
      severity: 'major'
    }
  ];

  const metrics = [
    { label: 'Overall Uptime (30 days)', value: '99.96%' },
    { label: 'Average Response Time', value: '178ms' },
    { label: 'Total Requests Served', value: '2.4M' },
    { label: 'Active Workflows', value: '15,847' }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'degraded':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'outage':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'investigating':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      operational: 'default',
      degraded: 'secondary',
      outage: 'destructive',
      investigating: 'outline',
      maintenance: 'outline'
    };
    
    return (
      <Badge variant={variants[status] || 'default'} className="ml-auto">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen pt-20 bg-gradient-to-b from-slate-50 to-white">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-light text-gray-900 mb-6 tracking-tight">
              System Status
            </h1>
            <p className="text-xl text-gray-600 mb-8 font-light">
              Real-time status and performance metrics for all our services
            </p>
            
            {/* Overall Status */}
            <div className="flex items-center justify-center mb-8">
              <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
              <span className="text-2xl font-medium text-gray-900">All Systems Operational</span>
            </div>
            
            <p className="text-sm text-gray-500">
              Last updated: {currentStatus.lastUpdated}
            </p>
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {metrics.map((metric, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-light text-blue-600 mb-2">{metric.value}</div>
                <div className="text-gray-600">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Status */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Service Status</h2>
            <p className="text-xl text-gray-600">Current status of all our services and components</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <Card key={index} className="shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <service.icon className="h-6 w-6 text-gray-600 mr-3" />
                      <h3 className="text-lg font-medium text-gray-900">{service.name}</h3>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(service.status)}
                      {getStatusBadge(service.status)}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Uptime (30 days)</span>
                      <div className="font-medium text-gray-900">{service.uptime}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Avg Response</span>
                      <div className="font-medium text-gray-900">{service.responseTime}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Current Incidents */}
      {incidents.length > 0 && (
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-light text-gray-900 mb-6">Current Incidents</h2>
              <p className="text-xl text-gray-600">Active incidents and their resolution progress</p>
            </div>

            {incidents.map((incident, index) => (
              <Card key={index} className="mb-6 shadow-lg">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl text-gray-900 mb-2">{incident.title}</CardTitle>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-2" />
                        Started: {incident.startTime}
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      {getStatusBadge(incident.status)}
                      <Badge variant="outline" className="mt-2">
                        {incident.severity}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-6">{incident.description}</p>
                  <div className="space-y-4">
                    <h4 className="font-medium text-gray-900">Updates:</h4>
                    {incident.updates.map((update, idx) => (
                      <div key={idx} className="border-l-2 border-blue-200 pl-4">
                        <div className="text-sm text-gray-500 mb-1">{update.time}</div>
                        <div className="text-gray-700">{update.message}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Incident History */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-light text-gray-900 mb-6">Recent Incidents</h2>
            <p className="text-xl text-gray-600">History of past incidents and maintenance</p>
          </div>

          <div className="space-y-4">
            {pastIncidents.map((incident, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-2xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">{incident.title}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{incident.date}</span>
                      <span className="mx-2">•</span>
                      <span>Duration: {incident.duration}</span>
                    </div>
                  </div>
                  {getStatusBadge(incident.severity)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-light text-gray-900 mb-6">Stay Informed</h2>
          <p className="text-xl text-gray-600 mb-8">
            Get real-time notifications about service status and scheduled maintenance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full">
              Subscribe to Updates
            </button>
            <button className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-full">
              RSS Feed
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SystemStatus;
