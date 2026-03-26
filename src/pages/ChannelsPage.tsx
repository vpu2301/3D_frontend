import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import LoggedInHeader from '@/components/dashboard/LoggedInHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  MessageCircle,
  Globe,
  Shield,
  Send,
  Zap,
  Plus,
  X,
  TrendingUp,
  Clock,
  CheckCircle2,
  Users,
  BarChart3,
  Activity,
  Bot,
  Wifi,
  WifiOff,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AIWorker {
  id: number;
  name: string;
  department: string;
  status: 'Active' | 'Idle';
  iconColor: string;
  bgColor: string;
  initials: string;
}

interface ChannelMetrics {
  messagesToday: number;
  messagesWeek: number;
  avgResponseTime: string;
  resolutionRate: number;
  activeConversations: number;
  totalConversations: number;
  satisfactionScore: number;
  tasksSolved: number;
}

interface Channel {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgGradient: string;
  textColor: string;
  badgeColor: string;
  connected: boolean;
  assignedWorkers: number[];
  metrics: ChannelMetrics;
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const ALL_WORKERS: AIWorker[] = [
  { id: 1, name: 'Aria', department: 'Sales', status: 'Active', iconColor: 'text-pink-600', bgColor: 'from-pink-100 to-rose-100', initials: 'AR' },
  { id: 2, name: 'Atlas', department: 'Operations', status: 'Active', iconColor: 'text-blue-600', bgColor: 'from-blue-100 to-cyan-100', initials: 'AT' },
  { id: 3, name: 'Felix', department: 'Finance', status: 'Idle', iconColor: 'text-green-600', bgColor: 'from-green-100 to-emerald-100', initials: 'FX' },
  { id: 4, name: 'Maya', department: 'Marketing', status: 'Active', iconColor: 'text-purple-600', bgColor: 'from-purple-100 to-violet-100', initials: 'MY' },
];

const INITIAL_CHANNELS: Channel[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: 'Business messaging via WhatsApp Business API',
    icon: MessageCircle,
    color: '#25D366',
    bgGradient: 'from-green-400 to-emerald-500',
    textColor: 'text-green-700',
    badgeColor: 'bg-green-100 text-green-700',
    connected: true,
    assignedWorkers: [1, 2],
    metrics: {
      messagesToday: 342,
      messagesWeek: 2108,
      avgResponseTime: '1m 24s',
      resolutionRate: 87,
      activeConversations: 14,
      totalConversations: 1240,
      satisfactionScore: 94,
      tasksSolved: 318,
    },
  },
  {
    id: 'discord',
    name: 'Discord',
    description: 'Community & team communication via Discord bots',
    icon: Zap,
    color: '#5865F2',
    bgGradient: 'from-indigo-400 to-violet-500',
    textColor: 'text-indigo-700',
    badgeColor: 'bg-indigo-100 text-indigo-700',
    connected: true,
    assignedWorkers: [4],
    metrics: {
      messagesToday: 189,
      messagesWeek: 1034,
      avgResponseTime: '2m 10s',
      resolutionRate: 79,
      activeConversations: 7,
      totalConversations: 682,
      satisfactionScore: 88,
      tasksSolved: 204,
    },
  },
  {
    id: 'signal',
    name: 'Signal',
    description: 'Secure end-to-end encrypted messaging',
    icon: Shield,
    color: '#3A76F0',
    bgGradient: 'from-blue-400 to-sky-500',
    textColor: 'text-blue-700',
    badgeColor: 'bg-blue-100 text-blue-700',
    connected: false,
    assignedWorkers: [],
    metrics: {
      messagesToday: 0,
      messagesWeek: 0,
      avgResponseTime: '—',
      resolutionRate: 0,
      activeConversations: 0,
      totalConversations: 0,
      satisfactionScore: 0,
      tasksSolved: 0,
    },
  },
  {
    id: 'telegram',
    name: 'Telegram',
    description: 'Fast messaging via Telegram Bot API',
    icon: Send,
    color: '#2AABEE',
    bgGradient: 'from-sky-400 to-cyan-500',
    textColor: 'text-sky-700',
    badgeColor: 'bg-sky-100 text-sky-700',
    connected: true,
    assignedWorkers: [2, 3],
    metrics: {
      messagesToday: 276,
      messagesWeek: 1587,
      avgResponseTime: '0m 58s',
      resolutionRate: 91,
      activeConversations: 11,
      totalConversations: 945,
      satisfactionScore: 96,
      tasksSolved: 411,
    },
  },
  {
    id: 'web',
    name: 'Web Chat',
    description: 'Embeddable live-chat widget for your website',
    icon: Globe,
    color: '#F97316',
    bgGradient: 'from-[#5c939f] to-amber-500',
    textColor: 'text-[#3d6b75]',
    badgeColor: 'bg-[#1b1b1b] text-[#3d6b75]',
    connected: true,
    assignedWorkers: [1, 3, 4],
    metrics: {
      messagesToday: 521,
      messagesWeek: 3294,
      avgResponseTime: '0m 42s',
      resolutionRate: 93,
      activeConversations: 22,
      totalConversations: 2871,
      satisfactionScore: 97,
      tasksSolved: 763,
    },
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function MetricTile({
  icon: Icon,
  label,
  value,
  sub,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub?: string;
  color: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-xl border bg-white p-4 shadow-sm">
      <div className={`rounded-lg p-2 ${color}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500">{label}</p>
        <p className="text-xl font-semibold text-gray-900 leading-tight">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const ChannelsPage = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [selectedId, setSelectedId] = useState<string>('whatsapp');
  const [showAddWorker, setShowAddWorker] = useState(false);

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    const email = localStorage.getItem('userEmail');
    if (isAuthenticated !== 'true') {
      navigate('/login');
      return;
    }
    if (email) setUserEmail(email);
  }, [navigate]);

  const selected = channels.find((c) => c.id === selectedId)!;

  const toggleConnect = (id: string) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, connected: !c.connected } : c
      )
    );
  };

  const removeWorker = (channelId: string, workerId: number) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === channelId
          ? { ...c, assignedWorkers: c.assignedWorkers.filter((w) => w !== workerId) }
          : c
      )
    );
  };

  const addWorker = (workerId: number) => {
    setChannels((prev) =>
      prev.map((c) =>
        c.id === selectedId && !c.assignedWorkers.includes(workerId)
          ? { ...c, assignedWorkers: [...c.assignedWorkers, workerId] }
          : c
      )
    );
    setShowAddWorker(false);
  };

  const assignedWorkers = ALL_WORKERS.filter((w) =>
    selected.assignedWorkers.includes(w.id)
  );
  const availableWorkers = ALL_WORKERS.filter(
    (w) => !selected.assignedWorkers.includes(w.id)
  );

  const connectedCount = channels.filter((c) => c.connected).length;

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <LoggedInHeader userEmail={userEmail} />

        <div className="flex flex-col h-[calc(100vh-64px)]">
          {/* ── Page header ── */}
          <div className="border-b bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Channels</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  Manage messaging channels and assign AI workers
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs font-normal gap-1.5">
                  <Wifi className="h-3 w-3 text-green-500" />
                  {connectedCount} connected
                </Badge>
                <Badge variant="outline" className="text-xs font-normal gap-1.5">
                  <WifiOff className="h-3 w-3 text-gray-400" />
                  {channels.length - connectedCount} disconnected
                </Badge>
              </div>
            </div>
          </div>

          {/* ── Two-column body ── */}
          <div className="flex flex-1 overflow-hidden">

            {/* Left: channel list */}
            <div className="w-72 flex-shrink-0 border-r bg-gray-50 overflow-y-auto p-4 space-y-2">
              {channels.map((ch) => {
                const Icon = ch.icon;
                const isActive = ch.id === selectedId;
                return (
                  <button
                    key={ch.id}
                    onClick={() => setSelectedId(ch.id)}
                    className={`w-full text-left rounded-xl border p-3.5 transition-all ${
                      isActive
                        ? 'bg-white border-gray-300 shadow-sm'
                        : 'bg-white border-transparent hover:border-gray-200 hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-lg bg-gradient-to-br ${ch.bgGradient} flex items-center justify-center flex-shrink-0`}
                      >
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-sm font-medium text-gray-900 truncate">
                            {ch.name}
                          </span>
                          <span
                            className={`h-2 w-2 rounded-full flex-shrink-0 ${
                              ch.connected ? 'bg-green-400' : 'bg-gray-300'
                            }`}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {ch.connected
                            ? `${ch.assignedWorkers.length} worker${ch.assignedWorkers.length !== 1 ? 's' : ''} assigned`
                            : 'Not connected'}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: channel detail */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Channel header card */}
              <Card className="border-0 shadow-sm overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${selected.bgGradient} p-5`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                        <selected.icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white">
                          {selected.name}
                        </h2>
                        <p className="text-sm text-white/80">{selected.description}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => toggleConnect(selected.id)}
                      variant="secondary"
                      size="sm"
                      className={`gap-1.5 font-medium ${
                        selected.connected
                          ? 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                          : 'bg-white text-gray-900 hover:bg-white/90'
                      }`}
                    >
                      {selected.connected ? (
                        <>
                          <Wifi className="h-3.5 w-3.5" />
                          Disconnect
                        </>
                      ) : (
                        <>
                          <WifiOff className="h-3.5 w-3.5" />
                          Connect
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>

              {selected.connected ? (
                <>
                  {/* ── Metrics grid ── */}
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">
                      Business Metrics
                    </h3>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                      <MetricTile
                        icon={MessageCircle}
                        label="Messages today"
                        value={selected.metrics.messagesToday.toLocaleString()}
                        sub={`${selected.metrics.messagesWeek.toLocaleString()} this week`}
                        color="bg-blue-500"
                      />
                      <MetricTile
                        icon={Clock}
                        label="Avg response time"
                        value={selected.metrics.avgResponseTime}
                        sub="across all workers"
                        color="bg-purple-500"
                      />
                      <MetricTile
                        icon={Activity}
                        label="Active conversations"
                        value={selected.metrics.activeConversations}
                        sub={`${selected.metrics.totalConversations.toLocaleString()} total`}
                        color="bg-[#5c939f]"
                      />
                      <MetricTile
                        icon={CheckCircle2}
                        label="Tasks solved"
                        value={selected.metrics.tasksSolved.toLocaleString()}
                        sub="by AI workers"
                        color="bg-green-500"
                      />
                    </div>
                  </div>

                  {/* ── Rate bars ── */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card className="border shadow-sm">
                      <CardHeader className="pb-2 pt-4 px-4">
                        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          Resolution Rate
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-3xl font-bold text-gray-900">
                            {selected.metrics.resolutionRate}%
                          </span>
                          <span className="text-xs text-gray-400 mb-1">of conversations</span>
                        </div>
                        <Progress value={selected.metrics.resolutionRate} className="h-2" />
                      </CardContent>
                    </Card>

                    <Card className="border shadow-sm">
                      <CardHeader className="pb-2 pt-4 px-4">
                        <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-blue-500" />
                          Customer Satisfaction
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <div className="flex items-end gap-2 mb-2">
                          <span className="text-3xl font-bold text-gray-900">
                            {selected.metrics.satisfactionScore}%
                          </span>
                          <span className="text-xs text-gray-400 mb-1">CSAT score</span>
                        </div>
                        <Progress value={selected.metrics.satisfactionScore} className="h-2" />
                      </CardContent>
                    </Card>
                  </div>

                  {/* ── Assigned AI workers ── */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <Bot className="h-4 w-4 text-gray-500" />
                        Assigned AI Workers
                        <Badge variant="secondary" className="text-xs font-normal">
                          {assignedWorkers.length}
                        </Badge>
                      </h3>
                      {availableWorkers.length > 0 && (
                        <Button
                          size="sm"
                          className="h-7 gap-1.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white text-xs"
                          onClick={() => setShowAddWorker(true)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add Worker
                        </Button>
                      )}
                    </div>

                    {assignedWorkers.length === 0 ? (
                      <div className="rounded-xl border border-dashed p-8 text-center">
                        <Bot className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-400">No AI workers assigned yet</p>
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-3 gap-1.5 text-xs"
                          onClick={() => setShowAddWorker(true)}
                        >
                          <Plus className="h-3.5 w-3.5" />
                          Add first worker
                        </Button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {assignedWorkers.map((worker) => (
                          <div
                            key={worker.id}
                            className="flex items-center gap-3 rounded-xl border bg-white p-3.5 shadow-sm group"
                          >
                            <Avatar className="h-9 w-9">
                              <AvatarFallback
                                className={`bg-gradient-to-br ${worker.bgColor} ${worker.iconColor} text-xs font-semibold`}
                              >
                                {worker.initials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {worker.name}
                              </p>
                              <p className="text-xs text-gray-400">{worker.department}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  worker.status === 'Active'
                                    ? 'bg-green-400'
                                    : 'bg-yellow-400'
                                }`}
                              />
                              <button
                                onClick={() => removeWorker(selected.id, worker.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* ── Disconnected state ── */
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selected.bgGradient} flex items-center justify-center mb-4 opacity-40`}
                  >
                    <selected.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-1">
                    {selected.name} is not connected
                  </h3>
                  <p className="text-sm text-gray-400 max-w-xs mb-6">
                    Connect this channel to start assigning AI workers and tracking
                    business metrics in real time.
                  </p>
                  <Button
                    onClick={() => toggleConnect(selected.id)}
                    className="gap-1.5 bg-gradient-to-r from-[#5c939f] to-[#4e8491] hover:from-blue-600 hover:to-purple-600 text-white"
                  >
                    <Wifi className="h-4 w-4" />
                    Connect {selected.name}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Add Worker dialog ── */}
        <Dialog open={showAddWorker} onOpenChange={setShowAddWorker}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add AI Worker to {selected.name}</DialogTitle>
              <DialogDescription>
                Select a worker to handle conversations on this channel.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-2 pt-2">
              {availableWorkers.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">
                  All workers are already assigned to this channel.
                </p>
              ) : (
                availableWorkers.map((worker) => (
                  <button
                    key={worker.id}
                    onClick={() => addWorker(worker.id)}
                    className="w-full flex items-center gap-3 rounded-xl border p-3.5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarFallback
                        className={`bg-gradient-to-br ${worker.bgColor} ${worker.iconColor} text-sm font-semibold`}
                      >
                        {worker.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{worker.name}</p>
                      <p className="text-xs text-gray-400">{worker.department}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          worker.status === 'Active' ? 'bg-green-400' : 'bg-yellow-400'
                        }`}
                      />
                      <span
                        className={`text-xs ${
                          worker.status === 'Active' ? 'text-green-600' : 'text-yellow-600'
                        }`}
                      >
                        {worker.status}
                      </span>
                    </div>
                  </button>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default ChannelsPage;
