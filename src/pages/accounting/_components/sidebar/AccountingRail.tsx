import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Radar,
  ListChecks,
  Send,
  ScrollText,
  Workflow,
  Plus,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Role } from '@/pages/accounting/_lib/types';
import {
  useAccountingStore,
  selectPendingCases,
  selectDraftRequests,
} from '@/pages/accounting/_hooks/use-accounting-store';
import { useWorkflowsStore } from '@/pages/accounting/_hooks/use-workflows-store';
import { ACCOUNTING_LOCALES } from '@/pages/accounting/_lib/i18n';

interface NavRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
}

// Platform nav row: 10px radius, quiet ink-tinted active fill, count as plain text.
function NavRow({ icon: Icon, label, active, onClick, count }: NavRowProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex w-full items-center gap-3 rounded-[10px] py-2 pl-3 pr-3 text-left text-[13.5px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/25',
        active
          ? 'bg-[rgba(20,22,26,0.07)] font-semibold text-[var(--ink)]'
          : 'font-medium text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.04)] hover:text-[var(--ink)]',
      )}
    >
      <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-[var(--ink)]' : 'text-[var(--text-4)]')} />
      <span className="flex-1 truncate">{label}</span>
      {count !== undefined && count > 0 && (
        <span className="shrink-0 text-[11px] font-medium leading-tight text-[var(--text-4)]">
          {count}
        </span>
      )}
    </button>
  );
}

function SectionHeader({
  label,
  open,
  onToggle,
}: {
  label: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-1.5 mt-6 flex items-center justify-between px-3">
      <button type="button" onClick={onToggle} className="plat-eyebrow flex items-center gap-1">
        {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
        {label}
      </button>
    </div>
  );
}

export default function AccountingRail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation('accounting');
  const path = location.pathname;

  const pendingCount = useAccountingStore((s) => selectPendingCases(s).length);
  const draftCount = useAccountingStore((s) => selectDraftRequests(s).length);
  const role = useAccountingStore((s) => s.role);
  const setRole = useAccountingStore((s) => s.setRole);
  const workflowCount = useWorkflowsStore((s) => s.workflows.length);
  const createWorkflow = useWorkflowsStore((s) => s.createWorkflow);

  const [automationOpen, setAutomationOpen] = useState(true);
  const [manageOpen, setManageOpen] = useState(true);

  const isActive = (href: string) => path === href || path.startsWith(href + '/');
  const lang = i18n.language.split('-')[0];

  const onNewWorkflow = () => {
    const id = createWorkflow(t('workflows.untitled'));
    navigate(`/accounting/workflows/${id}`);
  };

  return (
    <aside className="flex h-full w-60 shrink-0 flex-col overflow-hidden border-r border-[var(--line-soft)]">
      {/* Header */}
      <div className="px-5 pb-1 pt-5">
        <p className="plat-eyebrow">{t('appName')}</p>
        <p className="mt-1 text-[11.5px] text-[var(--text-4)]">{t('tagline')}</p>
      </div>

      {/* Primary action */}
      <div className="px-4 pb-4 pt-3">
        <button
          type="button"
          onClick={onNewWorkflow}
          className="plat-btn w-full justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/25"
        >
          <Plus className="h-4 w-4" /> {t('workflows.newWorkflow')}
        </button>
      </div>

      {/* Nav */}
      <nav aria-label={t('nav.workspace')} className="flex-1 overflow-y-auto px-3 pb-4">
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
            count={pendingCount}
          />
          <NavRow
            icon={Send}
            label={t('nav.requests')}
            active={isActive('/accounting/requests')}
            onClick={() => navigate('/accounting/requests')}
            count={draftCount}
          />
        </div>

        <SectionHeader
          label={t('nav.automation')}
          open={automationOpen}
          onToggle={() => setAutomationOpen((o) => !o)}
        />
        {automationOpen && (
          <div className="space-y-0.5">
            <NavRow
              icon={Workflow}
              label={t('nav.workflows')}
              active={isActive('/accounting/workflows')}
              onClick={() => navigate('/accounting/workflows')}
              count={workflowCount}
            />
          </div>
        )}

        <SectionHeader
          label={t('nav.manage')}
          open={manageOpen}
          onToggle={() => setManageOpen((o) => !o)}
        />
        {manageOpen && (
          <div className="space-y-0.5">
            <NavRow
              icon={ScrollText}
              label={t('nav.audit')}
              active={isActive('/accounting/audit')}
              onClick={() => navigate('/accounting/audit')}
            />
          </div>
        )}
      </nav>

      {/* Role (mock permission switcher) */}
      <div className="border-t border-[var(--line-soft)] px-5 py-3">
        <label htmlFor="acc-role" className="plat-eyebrow mb-1.5 block">
          {t('role.label')}
        </label>
        <select
          id="acc-role"
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="w-full rounded-[10px] border border-[var(--line)] bg-white px-2 py-1.5 text-xs text-[var(--text-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/25"
        >
          <option value="operator">{t('role.operator')}</option>
          <option value="preparer">{t('role.preparer')}</option>
          <option value="approver">{t('role.approver')}</option>
        </select>
      </div>

      {/* Language + connection status */}
      <div className="flex items-center justify-between border-t border-[var(--line-soft)] px-5 py-3">
        <div className="flex items-center gap-2">
          <span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-[var(--ok-fg)]" />
          <span role="status" className="text-xs text-[var(--text-3)]">{t('connected')}</span>
        </div>
        <div className="flex gap-1">
          {ACCOUNTING_LOCALES.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => i18n.changeLanguage(code)}
              className={cn(
                'rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/25',
                lang === code
                  ? 'bg-[var(--ink)] text-white'
                  : 'text-[var(--text-5)] hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--ink)]',
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
