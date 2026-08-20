import { useNavigate, useLocation } from 'react-router-dom';
import {
  CalendarClock,
  PhoneCall,
  Radio,
  Clock,
  Hash,
  BarChart2,
  Shield,
  ScrollText,
  Settings2,
  Inbox,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  useActiveCalls,
  usePendingApprovals,
  useUnreadMessageCount,
  useVoiceConnected,
} from '@/lib/api/voice';
import { loadPlanned } from '@/pages/telephony/_lib/planned';

// ─── NavRow ───────────────────────────────────────────────────────────────────

interface NavRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
  badge?: React.ReactNode;
}

function NavRow({ icon: Icon, label, active, onClick, badge }: NavRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'mx-2 flex w-[calc(100%-1rem)] items-center gap-3 rounded-[10px] px-3 py-2 text-left text-sm transition-colors',
        active
          ? 'bg-[rgba(20,22,26,0.07)] font-semibold text-[var(--ink)]'
          : 'text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.04)]',
      )}
    >
      <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-[var(--ink)]' : 'text-[var(--text-4)]')} />
      <span className="flex-1 truncate">{label}</span>
      {badge}
    </button>
  );
}

// ─── Badge variants ──────────────────────────────────────────────────────────

function LiveBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="relative flex h-4 w-4 shrink-0 items-center justify-center">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
      <span className="relative inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-green-500 text-[9px] font-bold leading-none text-white">
        {count}
      </span>
    </span>
  );
}

function AmberBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="flex h-4 min-w-[1rem] shrink-0 items-center justify-center rounded-full bg-amber-400 px-1 text-[9px] font-bold leading-none text-white">
      {count}
    </span>
  );
}

// ─── TelephonyMiniRail ────────────────────────────────────────────────────────

export default function TelephonyMiniRail() {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;

  // Real counts from the backend; nothing shown while disconnected. The old
  // mock counts implied live traffic that did not exist.
  const connected = useVoiceConnected();
  const { data: activeCalls } = useActiveCalls();
  const liveCount = activeCalls?.length ?? 0;
  // Real since v3: /api/voice/approvals/pending, kept live by the same shared
  // SSE connection the global approval card uses (ref-counted, one socket).
  const { approvals } = usePendingApprovals();
  const pendingCount = approvals.length;
  const unreadMessages = useUnreadMessageCount();
  const plannedCount = loadPlanned().length; // local demo store

  const isActive = (href: string) => path === href || path.startsWith(href + '/');

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col overflow-hidden border-r border-[var(--line-soft)]">
      {/* Header */}
      <div className="px-5 pb-3 pt-5">
        <p className="plat-eyebrow">
          Telefonie
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto pb-4">
        <div className="space-y-0.5">
          <NavRow
            icon={PhoneCall}
            label="All Calls"
            active={isActive('/telephony/calls') && !path.includes('/live') && !path.includes('/pending')}
            onClick={() => navigate('/telephony/calls')}
          />
          <NavRow
            icon={Radio}
            label="Live"
            active={isActive('/telephony/calls/live')}
            onClick={() => navigate('/telephony/calls/live')}
            badge={liveCount > 0 ? <LiveBadge count={liveCount} /> : undefined}
          />
          <NavRow
            icon={Clock}
            label="Pending Approval"
            active={isActive('/telephony/calls/pending-approval')}
            onClick={() => navigate('/telephony/calls/pending-approval')}
            badge={pendingCount > 0 ? <AmberBadge count={pendingCount} /> : undefined}
          />
          <NavRow
            icon={Inbox}
            label="Messages"
            active={isActive('/telephony/messages')}
            onClick={() => navigate('/telephony/messages')}
            badge={unreadMessages > 0 ? <AmberBadge count={unreadMessages} /> : undefined}
          />
          <NavRow
            icon={CalendarClock}
            label="Planned"
            active={isActive('/telephony/planned')}
            onClick={() => navigate('/telephony/planned')}
            badge={plannedCount > 0 ? <AmberBadge count={plannedCount} /> : undefined}
          />
        </div>

        <div className="plat-eyebrow mb-2 mt-6 px-5">
          Manage
        </div>
        <div className="space-y-0.5">
          <NavRow
            icon={Hash}
            label="Numbers"
            active={isActive('/telephony/numbers')}
            onClick={() => navigate('/telephony/numbers')}
          />
          <NavRow
            icon={BarChart2}
            label="Usage"
            active={isActive('/telephony/usage')}
            onClick={() => navigate('/telephony/usage')}
          />
          <NavRow
            icon={Shield}
            label="Policies"
            active={isActive('/telephony/policies')}
            onClick={() => navigate('/telephony/policies')}
          />
          <NavRow
            icon={ScrollText}
            label="Audit Log"
            active={isActive('/telephony/audit')}
            onClick={() => navigate('/telephony/audit')}
          />
          <NavRow
            icon={Settings2}
            label="Settings"
            active={isActive('/telephony/settings')}
            onClick={() => navigate('/telephony/settings')}
          />
        </div>
      </nav>

      {/* Connection status */}
      <div className="border-t border-[var(--line-soft)] px-5 py-3">
        <div className="flex items-center gap-2">
          <span className={cn('h-2 w-2 shrink-0 rounded-full', connected ? 'bg-[var(--ok-fg)]' : 'bg-[var(--text-5)]')} />
          <span className="text-xs text-[var(--text-4)]">{connected ? 'Connected' : 'Not connected'}</span>
        </div>
      </div>
    </aside>
  );
}
