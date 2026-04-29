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
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="flex flex-col overflow-hidden h-screen bg-white">
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-14 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center h-7 w-7 rounded-lg bg-[#bdd8ec]">
              <SettingsIcon className="h-4 w-4 text-gray-700" />
            </div>
            <span className="text-sm font-semibold text-gray-800">Settings</span>
          </div>
        </div>

        {/* Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="max-w-5xl mx-auto py-10 px-4 flex gap-8">

            {/* Sticky section navigator */}
            <aside className="hidden lg:block w-56 shrink-0">
              <nav className="sticky top-0">
                <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-2 px-2">
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
                          className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            active
                              ? 'bg-[#bdd8ec]/40 text-gray-900'
                              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                          }`}
                        >
                          <Icon className={`h-3.5 w-3.5 ${active ? 'text-gray-800' : 'text-gray-400'}`} />
                          <span className="truncate">{s.label}</span>
                          {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#5ea7d4]" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>
            </aside>

            <div className="flex-1 max-w-2xl space-y-6 min-w-0">

            {/* Profile */}
            <section id="profile" className="scroll-mt-4 rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
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
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-900 text-white hover:bg-gray-700 transition-all"
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
            <section id="api-keys" className="scroll-mt-4 rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
              <SectionHeader icon={Key} title="API keys & tokens" />

              {/* Generator */}
              <div className="rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3 mb-4">
                <div className="text-[11px] font-medium text-gray-500 uppercase tracking-wide mb-2">
                  Generate new
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-2">
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={e => setNewKeyName(e.target.value)}
                    placeholder="e.g., Production API Key"
                    className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#8fc4e4] transition-colors"
                  />
                  <select
                    value={newKeyType}
                    onChange={e => setNewKeyType(e.target.value)}
                    className="h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:border-[#8fc4e4] transition-colors"
                  >
                    {KEY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <button
                    onClick={generateKey}
                    className="flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg text-xs font-medium bg-gray-900 text-white hover:bg-gray-700 transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Generate
                  </button>
                </div>
              </div>

              {/* Existing keys */}
              <div className="space-y-2.5">
                {apiKeys.map(k => (
                  <div key={k.id} className="rounded-xl border border-gray-200 bg-gray-50/60 px-4 py-3">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-800 truncate">{k.name}</div>
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-gray-500 mt-0.5">
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full border border-gray-200 bg-white text-gray-600">
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
                    <div className="font-mono text-xs text-gray-700 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 truncate">
                      {showKeys[k.id] ? k.key : maskKey(k.key)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50/60 px-4 py-3">
                <div className="text-[11px] font-medium text-blue-900 uppercase tracking-wide mb-1">
                  Security notice
                </div>
                <p className="text-xs text-blue-800 leading-relaxed">
                  Keep your keys secure and never share them publicly. If a key is compromised, regenerate it immediately.
                </p>
              </div>
            </section>

            {/* Notifications */}
            <section id="notifications" className="scroll-mt-4 rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
              <SectionHeader icon={Bell} title="Notifications" />
              <ToggleRow label="Email notifications" hint="Receive email notifications for important updates" />
              <ToggleRow label="Task completion alerts" hint="Get notified when AI tasks are completed" />
              <ToggleRow label="System maintenance" hint="Receive alerts about scheduled maintenance" />
            </section>

            {/* Security */}
            <section id="security" className="scroll-mt-4 rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
              <SectionHeader icon={Shield} title="Security" />
              <div className="space-y-3">
                <FieldInput label="Current password" type="password" placeholder="Enter current password" value="" onChange={() => {}} />
                <FieldInput label="New password" type="password" placeholder="Enter new password" value="" onChange={() => {}} />
                <FieldInput label="Confirm new password" type="password" placeholder="Confirm new password" value="" onChange={() => {}} />
              </div>
              <div className="mt-3">
                <ToggleRow label="Two-factor authentication" hint="Add an extra layer of security to your account" />
              </div>
              <div className="mt-2">
                <button
                  onClick={() => toast({ title: 'Security settings updated' })}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-900 text-white hover:bg-gray-700 transition-all"
                >
                  Update security
                </button>
              </div>
            </section>

            {/* Appearance */}
            <section id="appearance" className="scroll-mt-4 rounded-2xl border border-gray-200 bg-white shadow-sm p-5">
              <SectionHeader icon={Palette} title="Appearance" />
              <ToggleRow label="Dark mode" hint="Switch to dark theme" />
              <ToggleRow label="Compact layout" hint="Use a more compact interface layout" />
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
      <Icon className="h-4 w-4 text-gray-500" />
      <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
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
      <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="mt-1 w-full h-9 px-3 rounded-lg border border-gray-200 bg-white text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#8fc4e4] transition-colors disabled:bg-gray-50 disabled:text-gray-500"
      />
    </label>
  );
}

function ToggleRow({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <div className="text-sm text-gray-800">{label}</div>
        <div className="text-xs text-gray-500 mt-0.5">{hint}</div>
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
      className={`flex items-center justify-center h-7 w-7 rounded-lg border border-gray-200 bg-white transition-colors ${
        danger
          ? 'text-red-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200'
          : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  );
}

export default Settings;
