import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Search,
  Sparkles,
  Package,
  Server,
  Bot,
  Code,
  Upload,
  Download,
  Star,
  Zap,
  FileText,
  Database,
  BarChart3,
  Shield,
  Globe,
  MessageSquare,
  Brain,
  Mail,
  Calendar,
  ShoppingCart,
  Headphones,
  Workflow,
  GitBranch,
  Plug,
  CheckCircle,
  TrendingUp,
  Users,
} from 'lucide-react';

type ItemKind = 'skill' | 'plugin' | 'mcp' | 'agent';

type HubItem = {
  id: string;
  kind: ItemKind;
  name: string;
  tagline: string;
  author: string;
  verified?: boolean;
  official?: boolean;
  category: string;
  installs: string;
  rating: number;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
};

const items: HubItem[] = [
  // Skills
  {
    id: 'skill-email-triage',
    kind: 'skill',
    name: 'Email Triage',
    tagline: 'Classify, prioritise and draft replies for incoming email in seconds.',
    author: '3Days.ai',
    official: true,
    category: 'Productivity',
    installs: '24.1k',
    rating: 4.9,
    icon: Mail,
    tags: ['gmail', 'outlook', 'classification'],
  },
  {
    id: 'skill-meeting-notes',
    kind: 'skill',
    name: 'Meeting Notes',
    tagline: 'Turn transcripts into decisions, action items and follow-up drafts.',
    author: '3Days.ai',
    official: true,
    category: 'Productivity',
    installs: '18.7k',
    rating: 4.8,
    icon: FileText,
    tags: ['transcripts', 'summaries'],
  },
  {
    id: 'skill-sales-research',
    kind: 'skill',
    name: 'Account Research',
    tagline: 'Pre-call intel on target accounts — funding, tech stack, people, news.',
    author: 'reva.dev',
    verified: true,
    category: 'Sales',
    installs: '11.4k',
    rating: 4.7,
    icon: Search,
    tags: ['prospecting', 'sales'],
  },
  {
    id: 'skill-invoice-extract',
    kind: 'skill',
    name: 'Invoice Extractor',
    tagline: 'Extract line items, totals and VAT from PDFs and scanned invoices.',
    author: 'ledgerly',
    verified: true,
    category: 'Finance',
    installs: '9.2k',
    rating: 4.6,
    icon: FileText,
    tags: ['ocr', 'accounting'],
  },
  {
    id: 'skill-support-reply',
    kind: 'skill',
    name: 'Support Reply Writer',
    tagline: 'Generate on-brand replies backed by your help-centre articles.',
    author: '3Days.ai',
    official: true,
    category: 'Support',
    installs: '15.6k',
    rating: 4.8,
    icon: Headphones,
    tags: ['helpdesk', 'rag'],
  },
  {
    id: 'skill-social-scheduler',
    kind: 'skill',
    name: 'Social Scheduler',
    tagline: 'Plan a month of posts across LinkedIn, X and Instagram from one brief.',
    author: 'loop.studio',
    category: 'Marketing',
    installs: '6.8k',
    rating: 4.5,
    icon: Calendar,
    tags: ['content', 'social'],
  },

  // Plugins
  {
    id: 'plugin-slack-bridge',
    kind: 'plugin',
    name: 'Slack Bridge',
    tagline: 'Bi-directional Slack integration — receive mentions, post replies, run commands.',
    author: '3Days.ai',
    official: true,
    category: 'Channels',
    installs: '32.4k',
    rating: 4.9,
    icon: MessageSquare,
    tags: ['slack', 'channel'],
  },
  {
    id: 'plugin-notion-sync',
    kind: 'plugin',
    name: 'Notion Sync',
    tagline: 'Two-way sync of tasks, pages and databases with Notion workspaces.',
    author: 'stacks.co',
    verified: true,
    category: 'Productivity',
    installs: '12.3k',
    rating: 4.6,
    icon: FileText,
    tags: ['notion', 'sync'],
  },
  {
    id: 'plugin-hubspot',
    kind: 'plugin',
    name: 'HubSpot CRM',
    tagline: 'Read contacts, update deals and log activity directly from agent chat.',
    author: '3Days.ai',
    official: true,
    category: 'Sales',
    installs: '21.5k',
    rating: 4.8,
    icon: Users,
    tags: ['crm', 'hubspot'],
  },
  {
    id: 'plugin-stripe',
    kind: 'plugin',
    name: 'Stripe',
    tagline: 'Create customers, generate invoices and reconcile payouts in one flow.',
    author: '3Days.ai',
    official: true,
    category: 'Finance',
    installs: '17.9k',
    rating: 4.9,
    icon: ShoppingCart,
    tags: ['payments', 'stripe'],
  },
  {
    id: 'plugin-jira',
    kind: 'plugin',
    name: 'Jira Bridge',
    tagline: 'Create, assign and transition issues — with AI-generated descriptions.',
    author: 'ops.dev',
    verified: true,
    category: 'Developer',
    installs: '8.4k',
    rating: 4.5,
    icon: GitBranch,
    tags: ['jira', 'atlassian'],
  },

  // MCP Servers
  {
    id: 'mcp-postgres',
    kind: 'mcp',
    name: 'Postgres MCP',
    tagline: 'Native MCP server for secure, read-scoped Postgres access with audit logs.',
    author: '3Days.ai',
    official: true,
    category: 'Data',
    installs: '14.2k',
    rating: 4.9,
    icon: Database,
    tags: ['sql', 'postgres', 'native'],
  },
  {
    id: 'mcp-filesystem',
    kind: 'mcp',
    name: 'Filesystem MCP',
    tagline: 'Sandboxed filesystem read/write — permission-scoped with path allowlists.',
    author: '3Days.ai',
    official: true,
    category: 'Developer',
    installs: '19.8k',
    rating: 4.8,
    icon: FileText,
    tags: ['files', 'native'],
  },
  {
    id: 'mcp-browser',
    kind: 'mcp',
    name: 'Browser MCP',
    tagline: 'Headless browser automation with screenshots, DOM queries and form fill.',
    author: '3Days.ai',
    official: true,
    category: 'Web',
    installs: '22.7k',
    rating: 4.9,
    icon: Globe,
    tags: ['browser', 'automation', 'native'],
  },
  {
    id: 'mcp-github',
    kind: 'mcp',
    name: 'GitHub MCP',
    tagline: 'Repo, PR and issue access with fine-grained token scopes.',
    author: '3Days.ai',
    official: true,
    category: 'Developer',
    installs: '16.3k',
    rating: 4.8,
    icon: GitBranch,
    tags: ['git', 'github', 'native'],
  },
  {
    id: 'mcp-analytics',
    kind: 'mcp',
    name: 'Analytics MCP',
    tagline: 'Query GA4, Mixpanel and Amplitude through a unified MCP surface.',
    author: 'quant.lab',
    verified: true,
    category: 'Data',
    installs: '5.1k',
    rating: 4.6,
    icon: BarChart3,
    tags: ['analytics', 'bi'],
  },

  // Agents
  {
    id: 'agent-sdr',
    kind: 'agent',
    name: 'SDR Agent',
    tagline: 'Outbound prospector — researches, drafts, sends and handles replies.',
    author: '3Days.ai',
    official: true,
    category: 'Sales',
    installs: '9.6k',
    rating: 4.7,
    icon: TrendingUp,
    tags: ['outbound', 'sales'],
  },
  {
    id: 'agent-recruiter',
    kind: 'agent',
    name: 'Recruiter Agent',
    tagline: 'Screens applicants, schedules interviews and drafts candidate scorecards.',
    author: 'talent.hq',
    verified: true,
    category: 'HR',
    installs: '4.3k',
    rating: 4.6,
    icon: Users,
    tags: ['hiring', 'hr'],
  },
  {
    id: 'agent-researcher',
    kind: 'agent',
    name: 'Deep Researcher',
    tagline: 'Multi-source research with citations, structured notes and confidence scores.',
    author: '3Days.ai',
    official: true,
    category: 'Knowledge',
    installs: '11.2k',
    rating: 4.8,
    icon: Brain,
    tags: ['research', 'citations'],
  },
  {
    id: 'agent-devops',
    kind: 'agent',
    name: 'DevOps Copilot',
    tagline: 'Triages incidents, correlates logs and drafts postmortems automatically.',
    author: 'rootly.sh',
    verified: true,
    category: 'Developer',
    installs: '7.5k',
    rating: 4.7,
    icon: Shield,
    tags: ['incidents', 'ops'],
  },
];

const kindMeta: Record<ItemKind, { label: string; icon: React.ComponentType<{ className?: string }>; desc: string }> = {
  skill: { label: 'Skills', icon: Sparkles, desc: 'Reusable AI capabilities for specific tasks' },
  plugin: { label: 'Plugins', icon: Plug, desc: 'Connectors that link agents to external tools' },
  mcp: { label: 'MCP Servers', icon: Server, desc: 'Native Model Context Protocol servers' },
  agent: { label: 'Agents', icon: Bot, desc: 'Pre-built autonomous agents for your workforce' },
};

const stats = [
  { value: '1,200+', label: 'Skills published' },
  { value: '400+', label: 'Native MCP servers' },
  { value: '180+', label: 'Developers shipping' },
  { value: '98%', label: 'Installs verified' },
];

const SkillsHub = () => {
  const [tab, setTab] = useState<'all' | ItemKind>('all');
  const [category, setCategory] = useState<string>('all');
  const [query, setQuery] = useState('');

  const categories = useMemo(() => {
    const set = new Set(items.map(i => i.category));
    return ['all', ...Array.from(set)];
  }, []);

  const filtered = useMemo(() => {
    let list = items;
    if (tab !== 'all') list = list.filter(i => i.kind === tab);
    if (category !== 'all') list = list.filter(i => i.category === category);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.tagline.toLowerCase().includes(q) ||
        i.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return list;
  }, [tab, category, query]);

  const counts = useMemo(() => ({
    all: items.length,
    skill: items.filter(i => i.kind === 'skill').length,
    plugin: items.filter(i => i.kind === 'plugin').length,
    mcp: items.filter(i => i.kind === 'mcp').length,
    agent: items.filter(i => i.kind === 'agent').length,
  }), []);

  const featured = items.filter(i => i.official).slice(0, 3);

  return (
    <div className="min-h-screen bg-white dark:bg-[#181512]">
      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1e4a7a]/8 border border-[#1e4a7a]/15 text-[#1e4a7a] text-xs font-medium mb-6 dark:bg-[#7ab3dc]/10 dark:border-[#7ab3dc]/20 dark:text-[#7ab3dc]" style={{ borderRadius: '100px' }}>
            <Sparkles className="w-3 h-3" />
            Skills Hub — open marketplace for agentic building blocks
          </div>
          <h1 className="text-5xl md:text-6xl font-light text-[#141413] tracking-tight mb-6 dark:text-white">
            One hub for skills, plugins,<br />
            <span className="font-semibold">MCP servers and agents.</span>
          </h1>
          <p className="text-lg text-[#141413]/55 max-w-2xl mx-auto mb-10 leading-relaxed dark:text-white/50">
            Extend your AI workforce with community-built and official capabilities. Browse, install in one click, or publish your own and ship to thousands of teams.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#browse">
              <button className="px-7 py-3.5 bg-[#141413] hover:bg-[#2a2a28] text-white text-sm font-medium transition-all duration-200 flex items-center gap-2 dark:bg-white dark:text-[#141413] dark:hover:bg-white/90" style={{ borderRadius: '6px' }}>
                Explore the hub
                <ArrowRight className="w-4 h-4" />
              </button>
            </a>
            <a href="#publish">
              <button className="px-7 py-3.5 border border-[#141413]/15 text-[#141413]/70 hover:text-[#141413] hover:border-[#141413]/30 text-sm font-medium transition-all duration-200 flex items-center gap-2 dark:border-white/15 dark:text-white/60 dark:hover:text-white" style={{ borderRadius: '6px' }}>
                <Code className="w-4 h-4" />
                Publish as a developer
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#141413]/8 dark:border-white/8">
        <div className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-light text-[#141413] dark:text-white mb-1">{s.value}</div>
              <div className="text-sm text-[#141413]/45 dark:text-white/40">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Kind overview */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-light text-[#141413] dark:text-white mb-3">Four building blocks</h2>
            <p className="text-[#141413]/50 dark:text-white/45">Mix and match to compose the AI teammate your workflow needs.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.keys(kindMeta) as ItemKind[]).map(k => {
              const meta = kindMeta[k];
              const Icon = meta.icon;
              return (
                <button
                  key={k}
                  onClick={() => { setTab(k); document.getElementById('browse')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className="text-left p-6 bg-white border border-[#141413]/10 hover:border-[#141413]/25 hover:shadow-md hover:-translate-y-0.5 transition-all dark:bg-white/4 dark:border-white/10 dark:hover:border-white/25"
                  style={{ borderRadius: '14px' }}
                >
                  <div className="w-11 h-11 bg-[#141413]/6 border border-[#141413]/10 flex items-center justify-center mb-4 dark:bg-white/6 dark:border-white/12" style={{ borderRadius: '10px' }}>
                    <Icon className="w-5 h-5 text-[#141413]/70 dark:text-white/70" />
                  </div>
                  <div className="text-[#141413] font-semibold mb-1 dark:text-white">{meta.label}</div>
                  <div className="text-xs text-[#141413]/50 leading-relaxed dark:text-white/40">{meta.desc}</div>
                  <div className="mt-4 text-xs text-[#141413]/40 dark:text-white/35">{counts[k]} available</div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="py-16 px-6 bg-[#f5ede3]/40 dark:bg-white/3">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-[10px] font-semibold tracking-widest uppercase text-[#1e4a7a] mb-2 dark:text-[#7ab3dc]">Featured</div>
              <h2 className="text-2xl font-light text-[#141413] dark:text-white">Handpicked by our team</h2>
            </div>
            <a href="#browse" className="text-sm text-[#141413]/60 hover:text-[#141413] flex items-center gap-1 dark:text-white/55 dark:hover:text-white">
              Browse all <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {featured.map(item => {
              const Icon = item.icon;
              return (
                <div key={item.id} className="p-6 bg-white border border-[#141413]/10 hover:border-[#141413]/25 transition-all dark:bg-[#1c1916] dark:border-white/10 dark:hover:border-white/25" style={{ borderRadius: '14px' }}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 bg-[#1e4a7a]/8 border border-[#1e4a7a]/15 flex items-center justify-center dark:bg-[#7ab3dc]/10 dark:border-[#7ab3dc]/20" style={{ borderRadius: '10px' }}>
                      <Icon className="w-5 h-5 text-[#1e4a7a] dark:text-[#7ab3dc]" />
                    </div>
                    <span className="text-[10px] font-semibold tracking-wide uppercase px-2 py-0.5 bg-[#1e4a7a]/10 text-[#1e4a7a] dark:bg-[#7ab3dc]/12 dark:text-[#7ab3dc]" style={{ borderRadius: '100px' }}>Official</span>
                  </div>
                  <div className="text-[#141413] font-semibold mb-1.5 dark:text-white">{item.name}</div>
                  <p className="text-sm text-[#141413]/55 leading-relaxed mb-5 dark:text-white/50">{item.tagline}</p>
                  <div className="flex items-center justify-between text-xs text-[#141413]/45 dark:text-white/38">
                    <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" /> {item.installs}</span>
                    <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-current text-[#d6a84a]" /> {item.rating}</span>
                    <span>{kindMeta[item.kind].label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Browse */}
      <section id="browse" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-light text-[#141413] dark:text-white mb-3">Browse the hub</h2>
            <p className="text-[#141413]/50 dark:text-white/45">Find exactly what fits your stack.</p>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto mb-8 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#141413]/35 dark:text-white/30" />
            <input
              type="text"
              placeholder="Search skills, plugins, MCP servers, agents…"
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#141413]/10 text-[#141413] text-sm placeholder:text-[#141413]/35 focus:outline-none focus:border-[#141413]/25 transition-colors dark:bg-white/6 dark:border-white/10 dark:text-white dark:placeholder:text-white/30 dark:focus:border-white/25"
              style={{ borderRadius: '8px' }}
            />
          </div>

          {/* Kind tabs */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <button
              onClick={() => setTab('all')}
              className={`px-4 py-1.5 text-xs font-medium transition-all duration-150 ${
                tab === 'all'
                  ? 'bg-[#141413] text-white dark:bg-white dark:text-[#141413]'
                  : 'bg-[#141413]/6 text-[#141413]/60 hover:bg-[#141413]/10 hover:text-[#141413] dark:bg-white/6 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white'
              }`}
              style={{ borderRadius: '100px' }}
            >
              All · {counts.all}
            </button>
            {(Object.keys(kindMeta) as ItemKind[]).map(k => {
              const meta = kindMeta[k];
              const Icon = meta.icon;
              return (
                <button
                  key={k}
                  onClick={() => setTab(k)}
                  className={`px-4 py-1.5 text-xs font-medium transition-all duration-150 flex items-center gap-1.5 ${
                    tab === k
                      ? 'bg-[#141413] text-white dark:bg-white dark:text-[#141413]'
                      : 'bg-[#141413]/6 text-[#141413]/60 hover:bg-[#141413]/10 hover:text-[#141413] dark:bg-white/6 dark:text-white/50 dark:hover:bg-white/10 dark:hover:text-white'
                  }`}
                  style={{ borderRadius: '100px' }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {meta.label} · {counts[k]}
                </button>
              );
            })}
          </div>

          {/* Category chips */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`px-3 py-1 text-[11px] font-medium transition-all duration-150 ${
                  category === c
                    ? 'bg-[#1e4a7a]/12 text-[#1e4a7a] border border-[#1e4a7a]/20 dark:bg-[#7ab3dc]/15 dark:text-[#7ab3dc] dark:border-[#7ab3dc]/25'
                    : 'bg-transparent text-[#141413]/45 border border-[#141413]/10 hover:text-[#141413]/70 hover:border-[#141413]/20 dark:text-white/35 dark:border-white/10 dark:hover:text-white/65 dark:hover:border-white/20'
                }`}
                style={{ borderRadius: '100px' }}
              >
                {c === 'all' ? 'All categories' : c}
              </button>
            ))}
          </div>

          {/* Results grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-[#141413]/40 dark:text-white/30">
              Nothing matched your filters.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(item => {
                const Icon = item.icon;
                const kindMetaItem = kindMeta[item.kind];
                const KindIcon = kindMetaItem.icon;
                return (
                  <div
                    key={item.id}
                    className="group p-5 bg-white border border-[#141413]/10 hover:border-[#141413]/25 hover:shadow-md transition-all cursor-pointer dark:bg-[#1c1916] dark:border-white/10 dark:hover:border-white/25"
                    style={{ borderRadius: '12px' }}
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-10 h-10 bg-[#141413]/6 border border-[#141413]/10 flex items-center justify-center flex-shrink-0 dark:bg-white/6 dark:border-white/12" style={{ borderRadius: '9px' }}>
                        <Icon className="w-5 h-5 text-[#141413]/70 dark:text-white/70" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                          <span className="text-[#141413] font-semibold text-[15px] truncate dark:text-white">{item.name}</span>
                          {item.official && (
                            <span className="text-[9px] font-semibold tracking-wide uppercase px-1.5 py-0.5 bg-[#1e4a7a]/10 text-[#1e4a7a] dark:bg-[#7ab3dc]/12 dark:text-[#7ab3dc]" style={{ borderRadius: '100px' }}>Official</span>
                          )}
                          {item.verified && !item.official && (
                            <span className="text-[9px] font-semibold tracking-wide uppercase px-1.5 py-0.5 bg-[#141413]/8 text-[#141413]/60 flex items-center gap-0.5 dark:bg-white/10 dark:text-white/55" style={{ borderRadius: '100px' }}>
                              <CheckCircle className="w-2.5 h-2.5" /> Verified
                            </span>
                          )}
                        </div>
                        <div className="text-[11px] text-[#141413]/45 dark:text-white/38">by {item.author}</div>
                      </div>
                    </div>
                    <p className="text-[13px] text-[#141413]/60 leading-relaxed mb-4 dark:text-white/50">{item.tagline}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] font-medium px-2 py-0.5 bg-[#141413]/5 text-[#141413]/55 dark:bg-white/5 dark:text-white/45" style={{ borderRadius: '100px' }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#141413]/8 text-[11px] text-[#141413]/50 dark:border-white/8 dark:text-white/40">
                      <span className="flex items-center gap-1"><KindIcon className="w-3 h-3" /> {kindMetaItem.label}</span>
                      <span className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Download className="w-3 h-3" /> {item.installs}</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-current text-[#d6a84a]" /> {item.rating}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Developer CTA */}
      <section id="publish" className="py-20 px-6 border-t border-[#141413]/8 dark:border-white/8">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#141413]/6 border border-[#141413]/10 text-[#141413]/60 text-xs font-medium mb-5 dark:bg-white/6 dark:border-white/10 dark:text-white/50" style={{ borderRadius: '100px' }}>
                <Code className="w-3 h-3" />
                For developers
              </div>
              <h2 className="text-4xl font-light text-[#141413] tracking-tight mb-5 dark:text-white">
                Ship a skill,<br /><span className="font-semibold">reach every team.</span>
              </h2>
              <p className="text-[#141413]/55 leading-relaxed mb-8 dark:text-white/50">
                Publish your skill, plugin, native MCP server or agent to the hub. Use our open SDK, test in a sandbox, and get paid per install with transparent revenue share.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  { icon: Zap, text: 'Open SDK in TypeScript, Python and Go' },
                  { icon: Shield, text: 'Sandboxed runtime with permission scoping' },
                  { icon: Workflow, text: 'Automated compatibility checks on every release' },
                  { icon: TrendingUp, text: 'Revenue share from day one — no gatekeeping' },
                ].map((row, i) => {
                  const Icon = row.icon;
                  return (
                    <div key={i} className="flex items-start gap-3">
                      <div className="w-7 h-7 bg-[#141413]/6 flex items-center justify-center flex-shrink-0 mt-0.5 dark:bg-white/6" style={{ borderRadius: '7px' }}>
                        <Icon className="w-3.5 h-3.5 text-[#141413]/65 dark:text-white/60" />
                      </div>
                      <span className="text-sm text-[#141413]/70 dark:text-white/60">{row.text}</span>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/signup">
                  <button className="px-7 py-3.5 bg-[#141413] hover:bg-[#2a2a28] text-white text-sm font-medium transition-all duration-200 flex items-center gap-2 dark:bg-white dark:text-[#141413] dark:hover:bg-white/90" style={{ borderRadius: '6px' }}>
                    <Upload className="w-4 h-4" />
                    Publish your first skill
                  </button>
                </Link>
                <Link to="/support/documentation">
                  <button className="px-7 py-3.5 border border-[#141413]/15 text-[#141413]/70 hover:text-[#141413] hover:border-[#141413]/30 text-sm font-medium transition-all duration-200 dark:border-white/15 dark:text-white/60 dark:hover:text-white" style={{ borderRadius: '6px' }}>
                    Read the SDK docs
                  </button>
                </Link>
              </div>
            </div>

            {/* Code preview */}
            <div className="bg-[#0f0e0c] p-6 shadow-2xl shadow-black/20 dark:shadow-black/60 overflow-hidden" style={{ borderRadius: '14px' }}>
              <div className="flex items-center gap-1.5 mb-4">
                <span className="w-2.5 h-2.5 bg-[#ff5f57]" style={{ borderRadius: '100px' }} />
                <span className="w-2.5 h-2.5 bg-[#febc2e]" style={{ borderRadius: '100px' }} />
                <span className="w-2.5 h-2.5 bg-[#28c840]" style={{ borderRadius: '100px' }} />
                <span className="ml-3 text-[11px] text-white/35 font-mono">skill.ts</span>
              </div>
              <pre className="text-[12px] leading-relaxed font-mono text-white/85 overflow-x-auto">
{`import { defineSkill } from '@3days/sdk';

export default defineSkill({
  name: 'email-triage',
  version: '1.0.0',
  description: 'Classify and draft replies',
  permissions: ['gmail:read', 'gmail:draft'],

  async run(ctx, { message }) {
    const intent = await ctx.llm.classify(message);
    if (intent === 'support') {
      return ctx.draft({ tone: 'warm' });
    }
    return ctx.route('sales-inbox');
  },
});`}
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-[#f5ede3]/40 dark:bg-white/3">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-light text-[#141413] dark:text-white mb-3">From install to running in minutes</h2>
            <p className="text-[#141413]/50 dark:text-white/45">Every capability on the hub follows the same install flow.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Pick your building block', desc: 'Skill, plugin, MCP server or agent — filter by category and ratings.' },
              { step: '02', title: 'Review permissions', desc: 'Every item declares the scopes it needs. Approve what it can read and write.' },
              { step: '03', title: 'Install and wire in', desc: 'One click and it appears in your workspace — available to humans and agents alike.' },
            ].map((step, i) => (
              <div key={i} className="relative">
                <div className="text-[10px] font-semibold text-[#141413]/25 dark:text-white/20 tracking-widest uppercase mb-4">{step.step}</div>
                <h3 className="text-lg font-medium text-[#141413] dark:text-white mb-2">{step.title}</h3>
                <p className="text-sm text-[#141413]/50 dark:text-white/45 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-light text-[#141413] tracking-tight mb-5 dark:text-white">
            The hub grows <span className="font-semibold">every week.</span>
          </h2>
          <p className="text-[#141413]/55 mb-10 dark:text-white/50">
            Join the developers and teams building the next generation of agentic software on 3Days.ai.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/signup">
              <button className="px-7 py-3.5 bg-[#141413] hover:bg-[#2a2a28] text-white text-sm font-medium transition-all duration-200 flex items-center gap-2 dark:bg-white dark:text-[#141413] dark:hover:bg-white/90" style={{ borderRadius: '6px' }}>
                Start for free
                <ArrowRight className="w-4 h-4" />
              </button>
            </Link>
            <Link to="/schedule-demo">
              <button className="px-7 py-3.5 border border-[#141413]/15 text-[#141413]/70 hover:text-[#141413] hover:border-[#141413]/30 text-sm font-medium transition-all duration-200 dark:border-white/15 dark:text-white/60 dark:hover:text-white" style={{ borderRadius: '6px' }}>
                Talk to us
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SkillsHub;
