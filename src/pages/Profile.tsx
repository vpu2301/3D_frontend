import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  User, Link2, Unlink, Copy, Check, RefreshCw, LogOut,
  Loader2, AlertCircle, Mail, KeyRound, Server, Hash,
  MessageCircle, Phone, Mic, MessageSquare,
} from 'lucide-react';

const NAV_SECTIONS = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'pincer', label: 'Pincer connection', icon: Server },
  { id: 'session', label: 'Session', icon: Hash },
];
import { useToast } from '@/hooks/use-toast';
import {
  isConnected as pincerConnected,
  getAuth,
  clearAuth,
  getUserId,
  resetUserId,
} from '@/lib/pincerClient';

interface PincerStatus {
  version: string;
  agent_running: boolean;
  channels: Record<string, boolean>;
}

const CHANNEL_ICONS: Record<string, typeof MessageCircle> = {
  telegram: MessageCircle,
  whatsapp: Phone,
  discord: Hash,
  voice: Mic,
  signal: MessageSquare,
};

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [auth, setLocalAuth] = useState(() => getAuth());
  const [pincerOn, setPincerOn] = useState<boolean>(() => pincerConnected());
  const [userId, setUserId] = useState<string>(() => getUserId());
  const [status, setStatus] = useState<PincerStatus | null>(null);
  const [statusLoading, setStatusLoading] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const userEmail =
    localStorage.getItem('userEmail') ||
    sessionStorage.getItem('userEmail') ||
    'unknown';
  const authSource =
    localStorage.getItem('isAuthenticated') === 'true'
      ? 'localStorage (persistent)'
      : sessionStorage.getItem('isAuthenticated') === 'true'
        ? 'sessionStorage (this tab only)'
        : 'none';

  const fetchStatus = async () => {
    const a = getAuth();
    if (!a) {
      setStatus(null);
      setStatusError('Not connected to Pincer.');
      return;
    }
    setStatusLoading(true);
    setStatusError(null);
    try {
      const res = await fetch(`${a.apiUrl}/api/status`, {
        headers: { Authorization: `Bearer ${a.token}` },
      });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = (await res.json()) as PincerStatus;
      setStatus(data);
    } catch (err) {
      setStatusError(
        err instanceof Error ? err.message : 'Could not reach the server.',
      );
      setStatus(null);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    if (pincerOn) void fetchStatus();
  }, [pincerOn]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>('account');

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const computeActive = () => {
      const scrollTop = root.scrollTop;
      const atBottom = scrollTop + root.clientHeight >= root.scrollHeight - 4;
      if (atBottom) {
        setActiveSection(NAV_SECTIONS[NAV_SECTIONS.length - 1].id);
        return;
      }
      const threshold = scrollTop + 96;
      let current = NAV_SECTIONS[0].id;
      for (const s of NAV_SECTIONS) {
        const el = document.getElementById(s.id);
        if (!el) continue;
        if (el.offsetTop <= threshold) current = s.id;
        else break;
      }
      setActiveSection(current);
    };

    computeActive();
    root.addEventListener('scroll', computeActive, { passive: true });
    window.addEventListener('resize', computeActive);
    return () => {
      root.removeEventListener('scroll', computeActive);
      window.removeEventListener('resize', computeActive);
    };
  }, [pincerOn, status]);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el || !scrollRef.current) return;
    const top = el.offsetTop - 16;
    scrollRef.current.scrollTo({ top, behavior: 'smooth' });
    setActiveSection(id);
  };

  const initials = userEmail
    .split('@')[0]
    .split(/[._-]/)
    .map(p => p[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join('') || 'U';

  const maskToken = (t: string) => {
    if (t.length <= 8) return '••••' + t.slice(-2);
    return '••••••••' + t.slice(-4);
  };

  const copy = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(label);
      setTimeout(() => setCopied(null), 1500);
    } catch {
      toast({ title: 'Copy failed', variant: 'destructive' });
    }
  };

  const handleResetUserId = () => {
    const next = resetUserId();
    setUserId(next);
    toast({
      title: 'Conversation reset',
      description: 'A new Pincer user_id was generated.',
    });
  };

  const handleDisconnect = () => {
    clearAuth();
    setLocalAuth(null);
    setPincerOn(false);
    setStatus(null);
    toast({ title: 'Disconnected from Pincer' });
  };

  const handleLogout = () => {
    clearAuth();
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userEmail');
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userEmail');
    navigate('/login');
  };

  const pincerBadge = (
    <span
      className={`plat-pill ${pincerOn ? 'plat-pill-ok' : 'plat-pill-mute'}`}
    >
      {pincerOn ? <Link2 className="h-3 w-3" /> : <Unlink className="h-3 w-3" />}
      {pincerOn ? 'Pincer connected' : 'Demo mode'}
    </span>
  );

  return (
    <SidebarProvider className="plat">
      <AppSidebar />
      <SidebarInset className="flex flex-col overflow-hidden h-screen bg-transparent">
        {/* Header — mirrors Chat active-state header */}
        <div className="flex items-center justify-between px-5 h-14 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center h-7 w-7 rounded-[10px]" style={{ background: 'var(--sand)', color: 'var(--ink)' }}>
              <User className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="text-sm font-semibold">Profile</span>
            {pincerBadge}
          </div>
        </div>

        {/* Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto py-10 px-4 flex gap-8">

            {/* Sticky section navigator */}
            <aside className="hidden lg:block w-56 shrink-0">
              <nav className="sticky top-0">
                <div className="plat-eyebrow mb-2 px-2">
                  Profile
                </div>
                <ul className="space-y-0.5">
                  {NAV_SECTIONS.map(s => {
                    const Icon = s.icon;
                    const active = activeSection === s.id;
                    return (
                      <li key={s.id}>
                        <button
                          onClick={() => scrollToSection(s.id)}
                          className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-[10px] text-xs font-medium transition-colors hover:bg-[rgba(20,22,26,0.04)]"
                          style={{
                            background: active ? 'rgba(20,22,26,0.06)' : 'transparent',
                            color: active ? 'var(--ink)' : 'var(--text-3)',
                            fontWeight: active ? 600 : 500,
                          }}
                        >
                          <Icon className="h-3.5 w-3.5" style={{ color: active ? 'var(--ink)' : 'var(--text-5)' }} />
                          <span className="truncate">{s.label}</span>
                          {active && <span className="ml-auto h-1.5 w-1.5 rounded-full" style={{ background: 'var(--ink)' }} />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>

            <div className="flex-1 max-w-2xl space-y-6 min-w-0">

            {/* Page header */}
            <div>
              <p className="plat-crumb">3days.profile</p>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-4)' }}>
                Account, backend connection and session
              </p>
            </div>

            {/* Account card */}
            <section id="account" className="scroll-mt-4 plat-panel !p-5">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="text-base font-medium" style={{ background: 'var(--sand-deep)', color: 'var(--ink)' }}>
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="text-base font-semibold truncate">{userEmail}</div>
                  <div className="text-xs mt-0.5" style={{ color: 'var(--text-4)' }}>Signed in via {authSource}</div>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-1 gap-2.5">
                <ProfileField
                  icon={Mail}
                  label="Email"
                  value={userEmail}
                  onCopy={() => copy('email', userEmail)}
                  copied={copied === 'email'}
                />
              </div>
            </section>

            {/* Pincer connection card */}
            <section id="pincer" className="scroll-mt-4 plat-panel !p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4" style={{ color: 'var(--text-5)' }} />
                  <h2 className="text-sm font-semibold">Pincer connection</h2>
                </div>
                {pincerOn && (
                  <button
                    onClick={fetchStatus}
                    disabled={statusLoading}
                    className="plat-btn-ghost !h-8 !px-3 !text-xs disabled:opacity-50"
                  >
                    {statusLoading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    Refresh
                  </button>
                )}
              </div>

              {!pincerOn ? (
                <div className="text-sm" style={{ color: 'var(--text-3)' }}>
                  Not connected. Sign in with a token from the{' '}
                  <button
                    onClick={() => navigate('/login')}
                    className="font-medium underline underline-offset-2"
                    style={{ color: 'var(--ink)' }}
                  >
                    login page
                  </button>{' '}
                  to enable real chat.
                </div>
              ) : (
                <div className="space-y-2.5">
                  <ProfileField
                    icon={Server}
                    label="API URL"
                    value={auth?.apiUrl ?? '—'}
                    onCopy={auth ? () => copy('apiUrl', auth.apiUrl) : undefined}
                    copied={copied === 'apiUrl'}
                  />
                  <ProfileField
                    icon={KeyRound}
                    label="Token"
                    value={auth ? maskToken(auth.token) : '—'}
                    mono
                    onCopy={auth ? () => copy('token', auth.token) : undefined}
                    copied={copied === 'token'}
                  />

                  {/* Live status block */}
                  <div className="rounded-[12px] px-4 py-3 mt-1" style={{ background: 'var(--sand)', border: '1px solid var(--line-soft)' }}>
                    {statusLoading && !status ? (
                      <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-3)' }}>
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        Pinging server…
                      </div>
                    ) : statusError ? (
                      <div className="flex items-start gap-2 text-sm" style={{ color: 'var(--bad-fg)' }}>
                        <AlertCircle className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                        <span>{statusError}</span>
                      </div>
                    ) : status ? (
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between text-sm">
                          <span style={{ color: 'var(--text-3)' }}>Version</span>
                          <span className="font-mono">{status.version}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span style={{ color: 'var(--text-3)' }}>Agent</span>
                          <span
                            className="flex items-center gap-1.5 text-xs font-medium"
                            style={{ color: status.agent_running ? 'var(--ok-fg)' : 'var(--text-4)' }}
                          >
                            <span
                              className="h-1.5 w-1.5 rounded-full"
                              style={{ background: status.agent_running ? 'var(--ok-fg)' : 'var(--sand-deep)' }}
                            />
                            {status.agent_running ? 'running' : 'stopped'}
                          </span>
                        </div>
                        <div className="pt-2" style={{ borderTop: '1px solid var(--line-soft)' }}>
                          <div className="plat-eyebrow mb-2">
                            Channels
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(status.channels).map(([name, on]) => {
                              const Icon = CHANNEL_ICONS[name] ?? Hash;
                              return (
                                <span
                                  key={name}
                                  className={`plat-pill !py-0.5 ${on ? 'plat-pill-ok' : 'plat-pill-mute'}`}
                                >
                                  <Icon className="h-3 w-3" />
                                  {name}
                                </span>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </section>

            {/* Session card */}
            <section id="session" className="scroll-mt-4 plat-panel !p-5">
              <div className="flex items-center gap-2 mb-4">
                <Hash className="h-4 w-4" style={{ color: 'var(--text-5)' }} />
                <h2 className="text-sm font-semibold">Session</h2>
              </div>
              <ProfileField
                icon={Hash}
                label="Pincer user_id"
                value={userId}
                mono
                onCopy={() => copy('userId', userId)}
                copied={copied === 'userId'}
              />
              <p className="text-xs mt-3 leading-relaxed" style={{ color: 'var(--text-4)' }}>
                The backend keys conversation state by this id. Resetting it starts a fresh thread.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={handleResetUserId}
                  className="plat-btn-ghost"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Reset user_id
                </button>
                {pincerOn && (
                  <button
                    onClick={handleDisconnect}
                    className="plat-btn-ghost"
                  >
                    <Unlink className="h-3.5 w-3.5" />
                    Disconnect Pincer
                  </button>
                )}
                <button
                  onClick={handleLogout}
                  className="plat-btn-ghost"
                  style={{ color: 'var(--bad-fg)' }}
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Log out
                </button>
              </div>
            </section>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

function ProfileField({
  icon: Icon,
  label,
  value,
  mono,
  onCopy,
  copied,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  mono?: boolean;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 px-3 py-2.5 rounded-[12px]" style={{ background: 'var(--sand)', border: '1px solid var(--line-soft)' }}>
      <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--text-5)' }} />
      <div className="flex-1 min-w-0">
        <div className="plat-eyebrow">{label}</div>
        <div
          className={`text-sm truncate ${mono ? 'font-mono' : ''}`}
          title={value}
        >
          {value}
        </div>
      </div>
      {onCopy && (
        <button
          onClick={onCopy}
          className="flex items-center justify-center h-7 w-7 rounded-[10px] transition-colors shrink-0 hover:bg-[rgba(20,22,26,0.05)]"
          style={{ color: 'var(--text-5)' }}
          title={copied ? 'Copied' : 'Copy'}
        >
          {copied ? <Check className="h-3.5 w-3.5" style={{ color: 'var(--ok-fg)' }} /> : <Copy className="h-3.5 w-3.5" />}
        </button>
      )}
    </div>
  );
}

export default Profile;
