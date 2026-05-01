import { useNavigate, useLocation } from 'react-router-dom';
import {
  PhoneCall,
  Radio,
  Clock,
  Hash,
  BarChart2,
  Shield,
  ScrollText,
  Settings2,
} from 'lucide-react';
import { MOCK_CALLS, MOCK_PENDING_APPROVALS } from '@/pages/telephony/_lib/mock-data';
import { cn } from '@/lib/utils';

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
        'flex w-full items-center gap-3 rounded-r-full py-2 pl-5 pr-4 text-left text-sm transition-colors',
        active ? 'bg-[#dde9f4] text-gray-900' : 'text-gray-700 hover:bg-gray-100',
      )}
    >
      <Icon className="h-4 w-4 shrink-0 text-gray-500" />
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

  const liveCount = MOCK_CALLS.filter((c) => c.status === 'live').length;
  const pendingCount = MOCK_PENDING_APPROVALS.length;

  const isActive = (href: string) => path === href || path.startsWith(href + '/');

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col overflow-hidden border-r border-gray-100 bg-white">
      {/* Header */}
      <div className="px-5 pb-3 pt-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          Telefonie
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto pb-4 pr-3">
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
            badge={<LiveBadge count={liveCount} />}
          />
          <NavRow
            icon={Clock}
            label="Pending Approval"
            active={isActive('/telephony/calls/pending-approval')}
            onClick={() => navigate('/telephony/calls/pending-approval')}
            badge={<AmberBadge count={pendingCount} />}
          />
        </div>

        <div className="mb-1.5 mt-5 px-5 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
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
      <div className="border-t border-gray-100 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
          <span className="text-xs text-gray-500">Connected</span>
        </div>
      </div>
    </aside>
  );
}
