import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import { Switch } from '@/components/ui/switch';
import {
  Settings as SettingsIcon, User, Bell, Shield, Palette, Key,
  Copy, Plus, Trash2, Eye, EyeOff, RefreshCw, Check, MessageSquare,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import CommunicationSettings from '@/components/dashboard/CommunicationSettings';

const NAV_SECTIONS = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'communication', label: 'Communication', icon: MessageSquare },
  { id: 'api-keys', label: 'API keys', icon: Key },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

interface ApiKey {
  id: number;
  name: string;
  key: string;
  type: string;
  created: string;
  lastUsed: string;
  status: 'active' | 'revoked';
}

const KEY_TYPES = ['API Key', 'Access Token', 'Webhook Token', 'Integration Key'];

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [userEmail, setUserEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    { id: 1, name: 'Production API Key', key: 'sk-abc123def456ghi789jkl012mno345pqr678stu901', type: 'API Key', created: '2024-01-15', lastUsed: '2024-01-30', status: 'active' },
    { id: 2, name: 'Development Token', key: 'dev-token-xyz789abc123def456ghi789jkl012', type: 'Access Token', created: '2024-01-20', lastUsed: '2024-01-29', status: 'active' },
  ]);
  const [showKeys, setShowKeys] = useState<Record<number, boolean>>({});
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyType, setNewKeyType] = useState('API Key');

  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<string>('profile');

  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') !== 'true') {
      navigate('/login');
      return;
    }
    const email = localStorage.getItem('userEmail');
    if (email) setUserEmail(email);
  }, [navigate]);

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
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el || !scrollRef.current) return;
    const top = el.offsetTop - 16;
    scrollRef.current.scrollTo({ top, behavior: 'smooth' });
    setActiveSection(id);
  };

  const generateKey = () => {
    if (!newKeyName.trim()) {
      toast({ title: 'Missing name', description: 'Enter a name for your API key.', variant: 'destructive' });
      return;
    }
    const prefix = newKeyType === 'API Key' ? 'sk-' : 'at-';
    const random = Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
    setApiKeys(p => [
      ...p,
      {
        id: Date.now(),
        name: newKeyName,
        key: prefix + random + Math.random().toString(36).slice(2, 15),
        type: newKeyType,
        created: new Date().toISOString().split('T')[0],
        lastUsed: 'Never',
        status: 'active',
      },
    ]);
    setNewKeyName('');
    toast({ title: 'API key generated', description: `${newKeyType} "${newKeyName}" created.` });
  };

  const copyToClipboard = (key: string, name: string) => {
    navigator.clipboard.writeText(key);
    toast({ title: 'Copied', description: `${name} copied to clipboard.` });
  };

  const toggleKeyVisibility = (id: number) =>
    setShowKeys(p => ({ ...p, [id]: !p[id] }));

  const deleteKey = (id: number, name: string) => {
    setApiKeys(p => p.filter(k => k.id !== id));
    toast({ title: 'API key deleted', description: `${name} permanently deleted.`, variant: 'destructive' });
  };

  const regenerateKey = (id: number) => {
    const key = apiKeys.find(k => k.id === id);
    if (!key) return;
    const prefix = key.type === 'API Key' ? 'sk-' : 'at-';
    const random = Math.random().toString(36).slice(2, 15) + Math.random().toString(36).slice(2, 15);
    setApiKeys(p =>
      p.map(k =>
        k.id === id
          ? { ...k, key: prefix + random + Math.random().toString(36).slice(2, 15), created: new Date().toISOString().split('T')[0], lastUsed: 'Never' }
          : k,
      ),
    );
    toast({ title: 'API key regenerated', description: `${key.name} has a new value.` });
  };

  const maskKey = (k: string) => {
    if (k.length <= 8) return k;
    return k.slice(0, 8) + '•'.repeat(Math.max(k.length - 12, 4)) + k.slice(-4);
  };

  return (
    <SidebarProvider className="plat">
      <AppSidebar />
      <SidebarInset className="flex flex-col overflow-hidden h-screen bg-transparent">
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-14 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="flex items-center justify-center h-7 w-7 rounded-[10px]" style={{ background: 'var(--sand)', color: 'var(--ink)' }}>
              <SettingsIcon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="text-sm font-semibold">Settings</span>
          </div>
        </div>

        {/* Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto py-10 px-4 flex gap-8">

            {/* Sticky section navigator */}
            <aside className="hidden lg:block w-56 shrink-0">
              <nav className="sticky top-0">
                <div className="plat-eyebrow mb-2 px-2">
                  Settings
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
              <p className="plat-crumb">3days.settings</p>
              <p className="mt-1 text-sm" style={{ color: 'var(--text-4)' }}>
                Account, keys, notifications and appearance
              </p>
            </div>

            {/* Profile */}
            <section id="profile" className="scroll-mt-4 plat-panel !p-5">
              <SectionHeader icon={User} title="Profile" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FieldInput label="First name" value={firstName} onChange={setFirstName} placeholder="Enter your first name" />
                <FieldInput label="Last name" value={lastName} onChange={setLastName} placeholder="Enter your last name" />
              </div>
              <div className="mt-3">
                <FieldInput label="Email" value={userEmail} onChange={() => {}} disabled />
              </div>
              <div className="mt-4">
                <button
                  onClick={() => toast({ title: 'Profile saved' })}
                  className="plat-btn !h-9 !px-4 !text-xs"
                >
                  Save profile
                </button>
              </div>
            </section>

            {/* Communication settings (external component, kept as-is) */}
            <div id="communication" className="scroll-mt-4">
              <CommunicationSettings />
            </div>

            {/* API keys */}
            <section id="api-keys" className="scroll-mt-4 plat-panel !p-5">
              <SectionHeader icon={Key} title="API keys & tokens" />

              {/* Generator */}
              <div className="rounded-[12px] px-4 py-3 mb-4" style={{ background: 'var(--sand)', border: '1px solid var(--line-soft)' }}>
                <div className="plat-eyebrow mb-2">
                  Generate new
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2">
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={e => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production API Key"
                    className="h-9 px-3 rounded-[10px] bg-white text-sm transition-colors focus:outline-none focus:border-[color:var(--ink)]"
                    style={{ border: '1px solid var(--line)', color: 'var(--ink)' }}
                  />
                  <select
                    value={newKeyType}
                    onChange={e => setNewKeyType(e.target.value)}
                    className="h-9 px-3 rounded-[10px] bg-white text-sm transition-colors focus:outline-none focus:border-[color:var(--ink)]"
                    style={{ border: '1px solid var(--line)', color: 'var(--ink)' }}
                  >
                    {KEY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button
                    onClick={generateKey}
                    className="plat-btn !h-9 !px-4 !text-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Generate
                  </button>
                </div>
              </div>

              {/* Existing keys — one block, hairline-separated */}
              <div className="rounded-[12px] overflow-hidden" style={{ border: '1px solid var(--line-soft)' }}>
                {apiKeys.map((k, i) => (
                  <div key={k.id} className="px-4 py-3" style={i > 0 ? { borderTop: '1px solid var(--line-soft)' } : undefined}>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium truncate">{k.name}</div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] mt-0.5" style={{ color: 'var(--text-4)' }}>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full" style={{ border: '1px solid var(--line)', color: 'var(--text-3)' }}>
                            {k.type}
                          </span>
                          <span>Created {k.created}</span>
                          <span>Last used {k.lastUsed}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <IconBtn title={showKeys[k.id] ? 'Hide' : 'Show'} onClick={() => toggleKeyVisibility(k.id)}>
                          {showKeys[k.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </IconBtn>
                        <IconBtn title="Copy" onClick={() => copyToClipboard(k.key, k.name)}>
                          <Copy className="h-3.5 w-3.5" />
                        </IconBtn>
                        <IconBtn title="Regenerate" onClick={() => regenerateKey(k.id)}>
                          <RefreshCw className="h-3.5 w-3.5" />
                        </IconBtn>
                        <IconBtn title="Delete" danger onClick={() => deleteKey(k.id, k.name)}>
                          <Trash2 className="h-3.5 w-3.5" />
                        </IconBtn>
                      </div>
                    </div>
                    <div className="font-mono text-xs rounded-[10px] px-2.5 py-1.5 truncate" style={{ background: 'var(--sand)', color: 'var(--text-2)' }}>
                      {showKeys[k.id] ? k.key : maskKey(k.key)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-[12px] px-4 py-3" style={{ background: 'var(--sand)', border: '1px solid var(--line-soft)' }}>
                <div className="plat-eyebrow mb-1">
                  Security notice
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--text-2)' }}>
                  Keep your keys secure and never share them publicly. If a key is compromised, regenerate it immediately.
                </p>
              </div>
            </section>

            {/* Notifications */}
            <section id="notifications" className="scroll-mt-4 plat-panel !p-5">
              <SectionHeader icon={Bell} title="Notifications" />
              <div>
                <ToggleRow label="Email notifications" hint="Receive email notifications for important updates" />
                <ToggleRow label="Task completion alerts" hint="Get notified when AI tasks are completed" divided />
                <ToggleRow label="System maintenance" hint="Receive alerts about scheduled maintenance" divided />
              </div>
            </section>

            {/* Security */}
            <section id="security" className="scroll-mt-4 plat-panel !p-5">
              <SectionHeader icon={Shield} title="Security" />
              <div className="space-y-3">
                <FieldInput label="Current password" type="password" placeholder="Enter current password" value="" onChange={() => {}} />
                <FieldInput label="New password" type="password" placeholder="Enter new password" value="" onChange={() => {}} />
                <FieldInput label="Confirm new password" type="password" placeholder="Confirm new password" value="" onChange={() => {}} />
              </div>
              <div className="mt-3">
                <ToggleRow label="Two-factor authentication" hint="Add an extra layer of security to your account" divided />
              </div>
              <div className="mt-3">
                <button
                  onClick={() => toast({ title: 'Security settings updated' })}
                  className="plat-btn !h-9 !px-4 !text-xs"
                >
                  Update security
                </button>
              </div>
            </section>

            {/* Appearance */}
            <section id="appearance" className="scroll-mt-4 plat-panel !p-5">
              <SectionHeader icon={Palette} title="Appearance" />
              <div>
                <ToggleRow label="Dark mode" hint="Switch to dark theme" />
                <ToggleRow label="Compact layout" hint="Use a more compact interface layout" divided />
              </div>
            </section>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

function SectionHeader({ icon: Icon, title }: { icon: typeof User; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Icon className="h-4 w-4" style={{ color: 'var(--text-5)' }} />
      <h2 className="text-sm font-semibold">{title}</h2>
    </div>
  );
}

function FieldInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="plat-eyebrow">{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="mt-1 w-full h-9 px-3 rounded-[10px] bg-white text-sm transition-colors focus:outline-none focus:border-[color:var(--ink)] disabled:bg-[var(--sand)] disabled:text-[color:var(--text-4)]"
        style={{ border: '1px solid var(--line)', color: 'var(--ink)' }}
      />
    </label>
  );
}

function ToggleRow({ label, hint, divided }: { label: string; hint: string; divided?: boolean }) {
  return (
    <div
      className="flex items-center justify-between gap-3 py-3"
      style={divided ? { borderTop: '1px solid var(--line-soft)' } : undefined}
    >
      <div className="min-w-0">
        <div className="text-sm">{label}</div>
        <div className="text-xs mt-0.5" style={{ color: 'var(--text-4)' }}>{hint}</div>
      </div>
      <Switch />
    </div>
  );
}

function IconBtn({
  children,
  onClick,
  title,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex items-center justify-center h-7 w-7 rounded-[10px] bg-white transition-colors ${
        danger
          ? 'text-[color:var(--bad-fg)] hover:bg-[rgba(179,56,46,0.08)]'
          : 'text-[color:var(--text-4)] hover:text-[color:var(--ink)] hover:bg-[rgba(20,22,26,0.05)]'
      }`}
      style={{ border: '1px solid var(--line)' }}
    >
      {children}
    </button>
  );
}

export default Settings;
