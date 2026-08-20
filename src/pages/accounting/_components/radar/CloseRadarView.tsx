import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowUpDown, Building2, CheckCircle2, CircleAlert, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Mandate, MandateReadiness, RiskLevel } from '@/pages/accounting/_lib/types';
import {
  useAccountingStore,
  mandateReadiness,
  openItemCount,
} from '@/pages/accounting/_hooks/use-accounting-store';
import { daysUntil, formatDate } from '@/pages/accounting/_lib/format';
import ViewHeader from '@/pages/accounting/_components/shared/ViewHeader';

type SortKey = 'open' | 'client' | 'deadline' | 'risk';

const RISK_ORDER: Record<RiskLevel, number> = { high: 0, medium: 1, low: 2 };

const READINESS_STYLE: Record<MandateReadiness, { dot: string; text: string; icon: typeof CheckCircle2 }> = {
  ready: { dot: 'bg-[var(--ok-fg)]', text: 'text-[var(--ok-fg)]', icon: CheckCircle2 },
  open_items: { dot: 'bg-amber-400', text: 'text-[var(--warn-fg)]', icon: CircleAlert },
  blocked: { dot: 'bg-[var(--bad-fg)]', text: 'text-[var(--bad-fg)]', icon: CircleAlert },
};

const CONTROL_CLS =
  'rounded-[10px] border border-[var(--line)] bg-white px-3 py-2 text-xs text-[var(--text-2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/25';

function Tile({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="plat-stat">
      <p className={cn('plat-num', accent && 'text-[var(--warn-fg)]')}>{value}</p>
      <p className="plat-stat-label">{label}</p>
    </div>
  );
}

function DeadlineCell({ mandate }: { mandate: Mandate }) {
  const { t, i18n } = useTranslation('accounting');
  const days = daysUntil(mandate.deadline);
  const urgent = days <= 4;
  const label =
    days < 0 ? t('radar.overdue') : days === 0 ? t('radar.dueToday') : t('radar.dueIn', { count: days });
  return (
    <div>
      <p className={cn('text-sm', urgent ? 'font-semibold text-[var(--ink)]' : 'text-[var(--text-1)]')}>
        {formatDate(i18n.language, mandate.deadline)}
      </p>
      <p
        className={cn(
          'text-[11px]',
          days < 0
            ? 'font-semibold text-[var(--bad-fg)]'
            : urgent
              ? 'text-[var(--warn-fg)]'
              : 'text-[var(--text-4)]',
        )}
      >
        {label}
      </p>
    </div>
  );
}

export default function CloseRadarView() {
  const { t } = useTranslation('accounting');
  const navigate = useNavigate();
  const store = useAccountingStore();

  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState<'all' | RiskLevel>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | MandateReadiness>('all');
  const [period, setPeriod] = useState<'current' | 'previous'>('current');
  const [sortKey, setSortKey] = useState<SortKey>('open');
  const [sortAsc, setSortAsc] = useState(false);

  const rows = useMemo(() => {
    const enriched = store.mandates.map((m) => ({
      mandate: m,
      open: openItemCount(store, m.id),
      readiness: mandateReadiness(store, m),
    }));
    const filtered = enriched.filter(({ mandate, readiness }) => {
      if (riskFilter !== 'all' && mandate.risk !== riskFilter) return false;
      if (statusFilter !== 'all' && readiness !== statusFilter) return false;
      if (search && !mandate.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    const dir = sortAsc ? 1 : -1;
    return filtered.sort((a, b) => {
      switch (sortKey) {
        case 'client':
          return dir * a.mandate.name.localeCompare(b.mandate.name);
        case 'deadline':
          return dir * a.mandate.deadline.localeCompare(b.mandate.deadline);
        case 'risk':
          return dir * (RISK_ORDER[b.mandate.risk] - RISK_ORDER[a.mandate.risk]);
        case 'open':
        default:
          return dir * (a.open - b.open);
      }
    });
  }, [store, search, riskFilter, statusFilter, sortKey, sortAsc]);

  const total = store.mandates.length;
  const ready = store.mandates.filter((m) => mandateReadiness(store, m) === 'ready').length;

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortAsc((v) => !v);
    } else {
      setSortKey(key);
      setSortAsc(key === 'client' || key === 'deadline');
    }
  };

  const headerCell = (key: SortKey, label: string) => (
    <th scope="col" className="px-4 py-3 text-left">
      <button
        type="button"
        onClick={() => toggleSort(key)}
        className="plat-eyebrow inline-flex items-center gap-1 hover:text-[var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/25"
      >
        {label}
        <ArrowUpDown className={cn('h-3 w-3', sortKey === key ? 'text-[var(--ink)]' : 'text-[var(--text-5)]')} />
      </button>
    </th>
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <ViewHeader title={t('radar.title')} subtitle={t('radar.subtitle')} />

      <div className="flex-1 overflow-y-auto p-6">
        {/* Summary tiles */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <Tile label={t('radar.tiles.mandates')} value={total} />
          <Tile label={t('radar.tiles.ready')} value={ready} />
          <Tile label={t('radar.tiles.openItems')} value={total - ready} accent />
        </div>

        {/* Filters */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search aria-hidden className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-4)]" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('radar.searchPlaceholder')}
              aria-label={t('common.search')}
              className="w-56 rounded-[10px] border border-[var(--line)] bg-white py-2 pl-9 pr-3 text-sm text-[var(--text-1)] placeholder:text-[var(--text-5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/25"
            />
          </div>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as 'current' | 'previous')}
            aria-label={t('radar.filters.period')}
            className={CONTROL_CLS}
          >
            <option value="current">{t('radar.period.current')}</option>
            <option value="previous">{t('radar.period.previous')}</option>
          </select>
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value as 'all' | RiskLevel)}
            aria-label={t('radar.filters.risk')}
            className={CONTROL_CLS}
          >
            <option value="all">{t('common.all')} · {t('radar.filters.risk')}</option>
            <option value="high">{t('risk.high')}</option>
            <option value="medium">{t('risk.medium')}</option>
            <option value="low">{t('risk.low')}</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as 'all' | MandateReadiness)}
            aria-label={t('radar.filters.status')}
            className={CONTROL_CLS}
          >
            <option value="all">{t('common.all')} · {t('radar.filters.status')}</option>
            <option value="ready">{t('readiness.ready')}</option>
            <option value="open_items">{t('readiness.open_items')}</option>
            <option value="blocked">{t('readiness.blocked')}</option>
          </select>
        </div>

        {/* Mandate table — one panel, hairline-divided rows */}
        <div className="mt-4 overflow-hidden rounded-[14px] border border-[var(--line-soft)] bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead className="border-b border-[var(--line-soft)] bg-[var(--sand)]">
                <tr>
                  {headerCell('client', t('radar.columns.client'))}
                  <th scope="col" className="plat-eyebrow px-4 py-3 text-left">
                    {t('radar.columns.missing')}
                  </th>
                  {headerCell('deadline', t('radar.columns.deadline'))}
                  {headerCell('risk', t('radar.columns.risk'))}
                  <th scope="col" className="plat-eyebrow px-4 py-3 text-left">
                    {t('radar.columns.status')}
                  </th>
                  <th scope="col" className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.map(({ mandate, open, readiness }) => {
                  const style = READINESS_STYLE[readiness];
                  return (
                    <tr
                      key={mandate.id}
                      className="border-b border-[var(--line-soft)] last:border-0 hover:bg-[rgba(20,22,26,0.02)]"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--sand)]">
                            <Building2 aria-hidden className="h-3.5 w-3.5 text-[var(--ink)]" />
                          </span>
                          <div>
                            <p className="font-medium text-[var(--ink)]">{mandate.name}</p>
                            {open > 0 && (
                              <p className="text-[11px] text-[var(--warn-fg)]">{t('radar.openCount', { count: open })}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-2)]">{mandate.missing}</td>
                      <td className="px-4 py-3"><DeadlineCell mandate={mandate} /></td>
                      <td className="px-4 py-3 text-[var(--text-2)]">{t(`risk.${mandate.risk}`)}</td>
                      <td className="px-4 py-3">
                        <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium', style.text)}>
                          <span aria-hidden className={cn('h-2 w-2 rounded-full', style.dot)} />
                          {t(`readiness.${readiness}`)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {open > 0 && (
                          <button
                            type="button"
                            onClick={() => navigate(`/accounting/queue?mandate=${mandate.id}`)}
                            className="plat-btn-ghost h-8 px-3.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ink)]/25"
                          >
                            {t('radar.review')}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {rows.length === 0 && (
            <div className="py-14 text-center">
              <p className="text-sm font-semibold text-[var(--ink)]">{t('radar.emptyTitle')}</p>
              <p className="mt-1 text-xs text-[var(--text-4)]">{t('radar.emptyBody')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
