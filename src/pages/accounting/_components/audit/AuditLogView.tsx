import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Download, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { AuditEntry, AuditOutcome } from '@/pages/accounting/_lib/types';
import { useAccountingStore } from '@/pages/accounting/_hooks/use-accounting-store';
import { formatDateTime } from '@/pages/accounting/_lib/format';
import ViewHeader from '@/pages/accounting/_components/shared/ViewHeader';

const OUTCOME_STYLE: Record<AuditOutcome, string> = {
  approved: 'bg-green-50 text-green-700',
  rejected: 'bg-red-50 text-red-700',
  sent: 'bg-[#f0e9df] text-gray-700',
};

function csvEscape(value: string): string {
  return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

function exportCsv(entries: AuditEntry[]) {
  const header = ['timestamp', 'action', 'detail', 'outcome', 'mandate', 'transaction', 'source', 'rule', 'model', 'approver', 'system_change', 'before', 'after'];
  const lines = entries.map((e) =>
    [
      e.timestamp,
      e.action,
      e.detail,
      e.outcome,
      e.payload.mandate,
      e.payload.transactionRef ?? '',
      e.payload.source ?? '',
      e.payload.ruleApplied ?? '',
      e.payload.modelVersion ?? '',
      e.payload.approver,
      e.payload.systemChange ?? '',
      e.payload.before ?? '',
      e.payload.after ?? '',
    ]
      .map(csvEscape)
      .join(','),
  );
  const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'pincer-close-audit-log.csv';
  a.click();
  URL.revokeObjectURL(url);
}

function PayloadRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="grid grid-cols-[8.5rem_1fr] gap-3 py-1">
      <dt className="text-[11px] font-medium text-gray-400">{label}</dt>
      <dd className="text-xs text-gray-700">{value}</dd>
    </div>
  );
}

function AuditRow({ entry }: { entry: AuditEntry }) {
  const { t, i18n } = useTranslation('accounting');
  const [expanded, setExpanded] = useState(false);
  const p = entry.payload;

  return (
    <li className="border-b border-gray-50 last:border-0">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-4 px-4 py-3 text-left hover:bg-gray-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gray-400"
      >
        <span className="w-28 shrink-0 text-xs text-gray-400">
          {formatDateTime(i18n.language, entry.timestamp)}
        </span>
        <span className="w-32 shrink-0 font-mono text-xs text-gray-500">{entry.action}</span>
        <span className="min-w-0 flex-1 truncate text-sm text-gray-700">{entry.detail}</span>
        <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold', OUTCOME_STYLE[entry.outcome])}>
          {t(`audit.outcome.${entry.outcome}`)}
        </span>
        <ChevronDown
          aria-hidden
          className={cn('h-3.5 w-3.5 shrink-0 text-gray-300 transition-transform', expanded && 'rotate-180')}
        />
      </button>
      {expanded && (
        <div className="mx-4 mb-3 rounded-xl bg-[#faf7f2] px-4 py-3">
          <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
            {t('audit.payload.show')}
          </p>
          <dl>
            <PayloadRow label={t('audit.payload.mandate')} value={p.mandate} />
            <PayloadRow label={t('audit.payload.transactionRef')} value={p.transactionRef} />
            <PayloadRow label={t('audit.payload.source')} value={p.source} />
            <PayloadRow label={t('audit.payload.ruleApplied')} value={p.ruleApplied} />
            <PayloadRow label={t('audit.payload.modelVersion')} value={p.modelVersion} />
            <PayloadRow label={t('audit.payload.approver')} value={p.approver} />
            <PayloadRow label={t('audit.payload.systemChange')} value={p.systemChange} />
            <PayloadRow label={t('audit.payload.before')} value={p.before} />
            <PayloadRow label={t('audit.payload.after')} value={p.after} />
          </dl>
        </div>
      )}
    </li>
  );
}

export default function AuditLogView() {
  const { t } = useTranslation('accounting');
  const audit = useAccountingStore((s) => s.audit);
  const [outcomeFilter, setOutcomeFilter] = useState<'all' | AuditOutcome>('all');

  const entries = useMemo(
    () => (outcomeFilter === 'all' ? audit : audit.filter((e) => e.outcome === outcomeFilter)),
    [audit, outcomeFilter],
  );

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      <ViewHeader
        title={t('audit.title')}
        subtitle={t('audit.subtitle')}
        right={
          <div className="flex items-center gap-2">
            <select
              value={outcomeFilter}
              onChange={(e) => setOutcomeFilter(e.target.value as 'all' | AuditOutcome)}
              aria-label={t('audit.columns.outcome')}
              className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            >
              <option value="all">{t('audit.filterAll')}</option>
              <option value="approved">{t('audit.outcome.approved')}</option>
              <option value="rejected">{t('audit.outcome.rejected')}</option>
              <option value="sent">{t('audit.outcome.sent')}</option>
            </select>
            <button
              type="button"
              onClick={() => exportCsv(entries)}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            >
              <Download aria-hidden className="h-3 w-3" />
              {t('audit.exportCsv')}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-600 hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400"
            >
              <FileText aria-hidden className="h-3 w-3" />
              {t('audit.exportPdf')}
            </button>
          </div>
        }
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="rounded-xl border border-gray-200 bg-white">
          {entries.length === 0 ? (
            <div className="py-14 text-center">
              <p className="text-sm font-medium text-gray-700">{t('audit.emptyTitle')}</p>
              <p className="mt-1 text-xs text-gray-400">{t('audit.emptyBody')}</p>
            </div>
          ) : (
            <ul aria-label={t('audit.title')} aria-live="polite">
              {entries.map((e) => (
                <AuditRow key={e.id} entry={e} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
