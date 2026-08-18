import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Radar, ListChecks, Send, ScrollText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '@/pages/accounting/_lib/types';
import {
  useAccountingStore,
  selectPendingCases,
  selectDraftRequests,
} from '@/pages/accounting/_hooks/use-accounting-store';
import { ACCOUNTING_LOCALES } from '@/pages/accounting/_lib/i18n';

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
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex w-full items-center gap-3 rounded-r-full py-2 pl-5 pr-4 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400',
        active ? 'bg-[#f0e9df] text-gray-900' : 'text-gray-700 hover:bg-gray-100',
      )}
    >
      <Icon className="h-4 w-4 shrink-0 text-gray-500" />
      <span className="flex-1 truncate">{label}</span>
      {badge}
    </button>
  );
}

function CountBadge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="flex h-4 min-w-[1rem] shrink-0 items-center justify-center rounded-full bg-amber-400 px-1 text-[9px] font-bold leading-none text-white">
      {count}
    </span>
  );
}

export default function AccountingRail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation('accounting');
  const path = location.pathname;

  const pendingCount = useAccountingStore(selectPendingCases).length;
  const draftCount = useAccountingStore(selectDraftRequests).length;
  const role = useAccountingStore((s) => s.role);
  const setRole = useAccountingStore((s) => s.setRole);

  const isActive = (href: string) => path === href || path.startsWith(href + '/');
  const lang = i18n.language.split('-')[0];

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col overflow-hidden border-r border-gray-100 bg-white">
      {/* Header */}
      <div className="px-5 pb-3 pt-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
          {t('appName')}
        </p>
        <p className="mt-0.5 text-[11px] text-gray-400">{t('tagline')}</p>
      </div>

      {/* Nav */}
      <nav aria-label={t('nav.workspace')} className="flex-1 overflow-y-auto pb-4 pr-3">
        <div className="space-y-0.5">
          <NavRow
            icon={Radar}
            label={t('nav.radar')}
            active={isActive('/accounting/radar') || path === '/accounting'}
            onClick={() => navigate('/accounting/radar')}
          />
          <NavRow
            icon={ListChecks}
            label={t('nav.queue')}
            active={isActive('/accounting/queue')}
            onClick={() => navigate('/accounting/queue')}
            badge={<CountBadge count={pendingCount} />}
          />
          <NavRow
            icon={Send}
            label={t('nav.requests')}
            active={isActive('/accounting/requests')}
            onClick={() => navigate('/accounting/requests')}
            badge={<CountBadge count={draftCount} />}
          />
          <NavRow
            icon={ScrollText}
            label={t('nav.audit')}
            active={isActive('/accounting/audit')}
            onClick={() => navigate('/accounting/audit')}
          />
        </div>
      </nav>

      {/* Role (mock permission switcher) */}
      <div className="border-t border-gray-100 px-5 py-3">
        <label htmlFor="acc-role" className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          {t('role.label')}
        </label>
        <select
          id="acc-role"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
        >
          <option value="operator">{t('role.operator')}</option>
          <option value="preparer">{t('role.preparer')}</option>
          <option value="approver">{t('role.approver')}</option>
        </select>
      </div>

      {/* Language + connection status */}
      <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-green-500" />
          <span role="status" className="text-xs text-gray-500">{t('connected')}</span>
        </div>
        <div className="flex gap-1">
          {ACCOUNTING_LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => i18n.changeLanguage(code)}
              className={cn(
                'rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400',
                lang === code ? 'bg-gray-900 text-white' : 'text-gray-400 hover:bg-gray-100',
              )}
            >
              {code}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
