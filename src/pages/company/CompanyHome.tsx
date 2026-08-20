/**
 * Company — the memento knowledge-brain console. An operating surface, not a
 * page: mini-rail app in the platform pattern (like Telephony).
 *
 *   Search   REAL   agent runs memento `search`, answers with sources
 *   Memory   REAL   store / inspect / forget keys via memento tools
 *                    (key inventory is local — memento has no list tool)
 *   Library  DEMO   document browser needs a REST proxy for MCP tools
 *   Photos   DEMO   image similarity search needs the same proxy
 *   Sync     REAL-ish  health check runs memento `sync_status` via the agent
 */
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/dashboard/AppSidebar';
import {
  Brain,
  Database,
  FolderOpen,
  Image,
  RefreshCw,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { queryClient } from '@/lib/queryClient';
import { isConnected } from '@/lib/pincerClient';
import { findMemento, useIntegrations } from '@/lib/api/company';
import BrainSearchView from '@/pages/company/_components/BrainSearchView';
import BrainMemoryView from '@/pages/company/_components/BrainMemoryView';
import BrainLibraryView from '@/pages/company/_components/BrainLibraryView';
import BrainPhotosView from '@/pages/company/_components/BrainPhotosView';
import BrainSyncView from '@/pages/company/_components/BrainSyncView';

const NAV = [
  { href: '/company-brain', label: 'Search', icon: Search, exact: true },
  { href: '/company-brain/memory', label: 'Memory', icon: Database },
  { href: '/company-brain/library', label: 'Library', icon: FolderOpen },
  { href: '/company-brain/photos', label: 'Photos', icon: Image },
  { href: '/company-brain/sync', label: 'Sync', icon: RefreshCw },
];

function CompanyRail() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const connected = isConnected();
  const { data } = useIntegrations();
  const memento = findMemento(data?.integrations);

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col overflow-hidden border-r border-[var(--line-soft)]">
      <div className="px-5 pb-3 pt-5">
        <p className="plat-eyebrow flex items-center gap-1.5">
          <Brain className="h-3.5 w-3.5" />
          Company Brain
        </p>
      </div>
      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        <div className="space-y-0.5">
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = exact ? pathname === href : pathname.startsWith(href);
            return (
              <button
                key={href}
                type="button"
                onClick={() => navigate(href)}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-[10px] px-3 py-2 text-left text-[13.5px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/25',
                  active
                    ? 'bg-[rgba(20,22,26,0.07)] font-semibold text-[var(--ink)]'
                    : 'font-medium text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.04)] hover:text-[var(--ink)]',
                )}
              >
                <Icon className={cn('h-4 w-4', active ? 'text-[var(--ink)]' : 'text-[var(--text-4)]')} />
                <span className="flex-1 truncate">{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
      <div className="border-t border-[var(--line-soft)] px-5 py-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'h-2 w-2 shrink-0 rounded-full',
              connected && memento?.status === 'active'
                ? 'bg-[var(--ok-fg)]'
                : connected && memento
                  ? 'bg-amber-400'
                  : 'bg-[var(--text-5)]',
            )}
          />
          <span className="truncate text-xs text-[var(--text-3)]">
            {!connected
              ? 'Not connected'
              : memento
                ? `memento ${memento.status}`
                : 'memento not configured'}
          </span>
        </div>
      </div>
    </aside>
  );
}

const CompanyHomeInner = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const isAuthenticated =
      localStorage.getItem('isAuthenticated') || sessionStorage.getItem('isAuthenticated');
    if (isAuthenticated !== 'true') navigate('/login');
  }, [navigate]);

  const renderView = () => {
    if (pathname === '/company-brain/memory') return <BrainMemoryView />;
    if (pathname === '/company-brain/library') return <BrainLibraryView />;
    if (pathname === '/company-brain/photos') return <BrainPhotosView />;
    if (pathname === '/company-brain/sync') return <BrainSyncView />;
    return <BrainSearchView />;
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <SidebarProvider>
        <div className="flex min-h-0 w-full flex-1 overflow-hidden">
          <AppSidebar />
          <SidebarInset className="flex min-h-0 flex-1 flex-col overflow-hidden bg-transparent">
            <div className="flex min-h-0 flex-1 overflow-hidden">
              <CompanyRail />
              <div className="flex min-h-0 flex-1 overflow-hidden">{renderView()}</div>
            </div>
          </SidebarInset>
        </div>
      </SidebarProvider>
    </div>
  );
};

const CompanyHome = () => (
  <QueryClientProvider client={queryClient}>
    <CompanyHomeInner />
  </QueryClientProvider>
);

export default CompanyHome;
