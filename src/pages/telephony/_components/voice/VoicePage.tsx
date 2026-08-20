/**
 * Voice app on REAL backend data (/api/voice/* on the connected Pincer server).
 *
 * This replaces the mocked calls view as the default telephony screen. Per the
 * de-mock task contract, sections the backend cannot serve yet stay visible but
 * are wrapped in <MockedSection> with the reason spelled out. Styling is ported
 * from the old mocked telephony views (white cards, gray hairlines, green live
 * dots) so the app still reads as one system.
 *
 * v2 surfaces what the backend caught up on: per-call language, outcome and
 * failure code, turn latency, real per-call cost (which is why the cost badge
 * is gone), appointment state, and the outbound guardrails in the header. Every
 * one of those fields is optional on the wire — a column, chip or panel appears
 * only once the connected backend actually sends it, so this page degrades to
 * exactly the v1 table against an older server instead of showing empty
 * furniture. Two sections remain badged: live listen-in and sentiment/talk
 * ratio; the count is pinned by src/test/voice/mockInventory.test.ts.
 */
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowDown,
  ArrowDownLeft,
  ArrowUp,
  ArrowUpRight,
  Ban,
  CalendarCheck2,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Copy,
  Download,
  Inbox,
  Maximize2,
  PhoneCall,
  PhoneOutgoing,
  Plug,
  RefreshCw,
  Search,
  X,
} from 'lucide-react';
import {
  type ActiveCall,
  CALL_HISTORY_CHUNK,
  useActiveCalls,
  useCallDetail,
  useCallHistoryAll,
  useContacts,
  useInitiateCall,
  useUnreadMessageCount,
  useUpdateVoiceConfig,
  useVoiceConfig,
  useVoiceConnected,
  useVoiceStatus,
  type CallSummary,
} from '@/lib/api/voice';
import { MockedSection } from '@/components/voice/MockedBadge';
import {
  AppointmentMark,
  CostCell,
  LanguageFlag,
  LanguageSwitchDivider,
  LatencyChip,
  OutcomeChip,
  RetryCounter,
} from '@/pages/telephony/_components/voice/CallChips';
import AppointmentPanel from '@/pages/telephony/_components/voice/AppointmentPanel';
import LatencyPanel from '@/pages/telephony/_components/voice/LatencyPanel';
import LimitsStrip from '@/pages/telephony/_components/voice/LimitsStrip';
import {
  CHIP_TONE_CLASS,
  fmtCostUsd,
  humanizeCode,
  intentMeta,
  langCode,
  parseLanguageSwitch,
} from '@/pages/telephony/_lib/voiceMeta';
import PlatSelect from '@/pages/telephony/_components/shared/PlatSelect';
import TranscriptModal from '@/pages/telephony/_components/voice/TranscriptModal';
import LiveCallModal from '@/pages/telephony/_components/voice/LiveCallModal';
import StartCallModal from '@/pages/telephony/_components/voice/StartCallModal';
import CallActionsTimeline from '@/pages/telephony/_components/voice/CallActionsTimeline';
import ReceptionistPanel from '@/pages/telephony/_components/voice/ReceptionistPanel';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

function fmtDuration(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

// ── Status header ────────────────────────────────────────────────────

function StatusHeader() {
  const { data: st } = useVoiceStatus();
  if (!st) return null;

  const neutral = (label: string) => (
    <span className="rounded-full border border-[var(--line)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-3)]">
      {label}
    </span>
  );
  const pill = (ok: boolean, label: string) => (
    <span
      className={cn(
        'flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium',
        ok ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600',
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', ok ? 'bg-green-500' : 'bg-red-400')} />
      {label}
    </span>
  );

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {neutral(st.engine || 'engine?')}
      {neutral(st.language || 'lang?')}
      {neutral(`consent: ${st.consent_mode || '?'}`)}
      {pill(st.outbound_enabled, 'outbound')}
      {pill(st.voice_configured, 'voice')}
      {pill(st.webhook_base_configured, 'webhook')}
      {st.active_call_count > 0 && (
        <span className="flex items-center gap-1 rounded-full bg-green-500 px-2 py-0.5 text-[10px] font-semibold text-white">
          {st.active_call_count} live
        </span>
      )}
      <TurnModelSelect />
    </div>
  );
}

/**
 * Runtime model picker for live voice turns (backend: PUT /api/voice/config).
 * The choice applies to the NEXT turn of any call — no restart — and is
 * persisted server-side. Options are gated on which API keys the backend has.
 */
function TurnModelSelect() {
  const { data: cfg } = useVoiceConfig();
  const update = useUpdateVoiceConfig();
  if (!cfg) return null;

  const known = cfg.choices.some((c) => c.value === cfg.voice_turn_model);
  return (
    <div
      className="flex items-center gap-1 rounded-full border border-[var(--line)] py-0.5 pl-2 pr-1 text-[10px] font-medium text-[var(--text-3)]"
      title="Model answering live voice turns — applies to the next turn immediately, persists across restarts"
    >
      <span className="text-[var(--text-5)]">turn model</span>
      <PlatSelect
        value={cfg.voice_turn_model}
        onChange={(v) => update.mutate(v)}
        disabled={update.isPending}
        ariaLabel="Model answering live voice turns"
        variant="bare"
      >
        {cfg.choices.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
        {!known && <option value={cfg.voice_turn_model}>{cfg.voice_turn_model}</option>}
      </PlatSelect>
      {update.isError && (
        <span className="text-red-600" title={update.error?.message}>
          !
        </span>
      )}
    </div>
  );
}

// ── Active calls ─────────────────────────────────────────────────────

function ActiveCallsSection() {
  const { data: calls } = useActiveCalls();
  const [selected, setSelected] = useState<ActiveCall | null>(null);
  return (
    <section className="rounded-[14px] border border-[var(--line)] bg-white p-5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
        <PhoneCall className="h-4 w-4 text-[var(--text-5)]" />
        Active calls
      </h3>
      {!calls?.length ? (
        <div className="text-sm text-[var(--text-5)]">No calls in progress.</div>
      ) : (
        <ul className="-mx-5 border-t border-[var(--line-soft)]">
          {calls.map((c) => (
            <li key={c.call_sid} className="border-b border-[var(--line-soft)] last:border-b-0">
              <button
                type="button"
                onClick={() => setSelected(c)}
                className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-[rgba(20,22,26,0.02)]"
                title="Open live call"
              >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-sm font-medium text-[var(--ink)]">
                  {c.direction === 'outbound' ? (
                    <ArrowUpRight className="h-3.5 w-3.5 text-[var(--text-5)]" />
                  ) : (
                    <ArrowDownLeft className="h-3.5 w-3.5 text-[var(--text-5)]" />
                  )}
                  <span className="truncate">
                    {c.target_name || c.target_number || c.caller_number}
                  </span>
                </div>
                <div className="truncate text-xs text-[var(--text-5)]">{c.purpose}</div>
              </div>
              <div className="ml-3 shrink-0 text-right text-xs">
                <div className="flex items-center justify-end gap-1.5 font-medium text-green-600">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
                  live · {fmtDuration(c.duration_seconds)}
                </div>
                <div className="text-[var(--text-5)]">{c.engine}</div>
              </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      {selected && <LiveCallModal call={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

// ── History ──────────────────────────────────────────────────────────
//
// The call history is the working surface of this page: it is a full-size
// table over the WHOLE history (see useCallHistoryAll — the API pages at 200
// and reports no total, so the rows are accumulated client side) with search,
// filters, sortable columns, per-page selection, pagination and CSV export.

type DirectionFilter = 'all' | 'inbound' | 'outbound';
type StatusFilter = 'all' | 'active' | 'completed';
type RangeFilter = 'all' | 'today' | '7d' | '30d' | '90d';
type MinDurFilter = 0 | 30 | 60 | 300;
type SortKey = 'when' | 'duration' | 'direction' | 'number' | 'status' | 'latency' | 'cost';

/**
 * Outcome and failure code share one control: a row has at most one of them
 * (a failed call has no extracted outcome), so two selects would mostly mean
 * two ways to get an empty table. Values are namespaced to keep them apart.
 */
type ResultFilter = 'all' | `o:${string}` | `f:${string}`;

const RANGE_MS: Record<Exclude<RangeFilter, 'all'>, number> = {
  today: 24 * 3600_000,
  '7d': 7 * 24 * 3600_000,
  '30d': 30 * 24 * 3600_000,
  '90d': 90 * 24 * 3600_000,
};

const PAGE_SIZES = [25, 50, 100, 200] as const;
const PAGE_SIZE_KEY = 'pincer.voice.historyPageSize';

function initialPageSize(): number {
  const stored = Number(localStorage.getItem(PAGE_SIZE_KEY));
  return (PAGE_SIZES as readonly number[]).includes(stored) ? stored : 25;
}

function fmtWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return { date: '—', time: '' };
  return {
    date: d.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
  };
}

function fmtRelative(iso: string) {
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return '';
  const s = Math.max(0, Math.round((Date.now() - t) / 1000));
  if (s < 60) return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86_400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86_400)} d ago`;
}

function fmtTalkTime(sec: number) {
  if (sec < 60) return `${sec}s`;
  const h = Math.floor(sec / 3600);
  const m = Math.round((sec % 3600) / 60);
  return h ? `${h} h ${m} min` : `${m} min`;
}

/** Number a row is "about": the far end of the call, whichever side that is. */
function peerNumber(c: CallSummary) {
  return c.direction === 'outbound' ? c.to_number : c.from_number;
}

function toCsv(rows: CallSummary[], nameFor: (n: string) => string | undefined) {
  const esc = (v: unknown) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const head = [
    'call_sid', 'direction', 'status', 'contact', 'from_number', 'to_number',
    'started_at', 'ended_at', 'duration_seconds',
    'language', 'outcome', 'failure_code', 'cost_total_usd',
    'latency_p50_ms', 'appointment_status', 'appointment_slot', 'appointment_retries',
  ];
  const body = rows.map((c) =>
    [
      c.call_sid, c.direction, c.status, nameFor(peerNumber(c)) ?? '',
      c.from_number, c.to_number, c.started_at, c.ended_at ?? '', c.duration_seconds,
      c.language ?? '', c.outcome?.outcome ?? '', c.failure_code ?? '',
      c.cost_total_usd ?? '', c.latency?.p50_ms ?? '',
      c.appointment?.status ?? '', c.appointment?.agreed_datetime ?? '',
      c.appointment?.retry_count ?? '',
    ]
      .map(esc)
      .join(','),
  );
  return [head.join(','), ...body].join('\n');
}

function downloadCsv(filename: string, csv: string) {
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Page numbers around the current page, with ellipses for the gaps. */
function pageItems(page: number, total: number): (number | '…')[] {
  return Array.from({ length: total }, (_, i) => i + 1)
    .filter((p) => p === 1 || p === total || Math.abs(p - page) <= 1)
    .reduce<(number | '…')[]>((acc, p, i, arr) => {
      if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('…');
      acc.push(p);
      return acc;
    }, []);
}

/**
 * A filter pill. Native `<select>` draws its open list through the OS, so it
 * lands as a grey system menu in the middle of the app; `PlatSelect` keeps the
 * same `<option>` children and renders it as styled DOM.
 */
function FilterSelect({
  value,
  onChange,
  children,
  ariaLabel,
}: {
  value: string | number;
  onChange: (v: string) => void;
  children: React.ReactNode;
  ariaLabel: string;
}) {
  return (
    <PlatSelect value={value} onChange={onChange} ariaLabel={ariaLabel} variant="pill">
      {children}
    </PlatSelect>
  );
}

/** Why an inbound call came in (S12 §11). Absent for outbound calls. */
function IntentChip({ intent }: { intent: string | null | undefined }) {
  const meta = intentMeta(intent);
  if (!meta) return null;
  return (
    <span
      title={meta.title}
      className={cn(
        'inline-block truncate rounded-full border px-2 py-0.5 text-[10px] font-medium',
        CHIP_TONE_CLASS[meta.tone],
      )}
    >
      {meta.label}
    </span>
  );
}

/**
 * One cell of the stats bar. `basis-0` is what shares the width evenly: sized
 * to content, a long label like "Cost (12 of 30 priced)" would take more than
 * its share and leave the short ones bunched at the left.
 */
function StatCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 flex-1 basis-0 px-4 py-2.5 first:pl-0">
      <p className="truncate text-[10px] uppercase tracking-wide text-[var(--text-5)]" title={label}>
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-semibold tabular-nums text-[var(--ink)]">{value}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const live = status === 'active';
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium',
        live
          ? 'border-green-200 bg-green-50 text-green-700'
          : 'border-[var(--line)] text-[var(--text-3)]',
      )}
    >
      {live && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />}
      {status}
    </span>
  );
}

function HistorySection({
  selected,
  onSelect,
  onExpand,
}: {
  selected: string | null;
  onSelect: (sid: string) => void;
  onExpand: (sid: string) => void;
}) {
  const {
    calls, isLoading, isLoadingMore, isError, error, isRefetching, refetch, cappedAt, loadMore,
  } = useCallHistoryAll();
  const { data: contacts } = useContacts();

  const nameFor = useMemo(() => {
    const byNumber = new Map((contacts ?? []).map((c) => [c.phone_number, c.name]));
    return (n: string) => byNumber.get(n);
  }, [contacts]);

  const [q, setQ] = useState('');
  const [direction, setDirection] = useState<DirectionFilter>('all');
  const [status, setStatus] = useState<StatusFilter>('all');
  const [range, setRange] = useState<RangeFilter>('all');
  const [minDur, setMinDur] = useState<MinDurFilter>(0);
  const [result, setResult] = useState<ResultFilter>('all');
  const [language, setLanguage] = useState('all');
  const [intent, setIntent] = useState('all');
  const [apptOnly, setApptOnly] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('when');
  const [sortAsc, setSortAsc] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [copiedSid, setCopiedSid] = useState<string | null>(null);

  /**
   * Filter options come from the data, not from a hardcoded taxonomy: the
   * backend owns the failure-code vocabulary and it grows. A select offering
   * codes that never occur in this history would be a list of dead ends.
   */
  const options = useMemo(() => {
    const outcomes = new Set<string>();
    const failures = new Set<string>();
    const languages = new Set<string>();
    const intents = new Set<string>();
    let hasCost = false;
    let hasLatency = false;
    let hasAppointment = false;
    for (const c of calls) {
      if (c.outcome?.outcome) outcomes.add(c.outcome.outcome);
      if (c.failure_code) failures.add(c.failure_code);
      const code = langCode(c.language);
      if (code) languages.add(code);
      if (c.inbound_intent) intents.add(String(c.inbound_intent));
      if (c.cost_total_usd != null) hasCost = true;
      if (c.latency?.p50_ms != null) hasLatency = true;
      if (c.appointment) hasAppointment = true;
    }
    return {
      outcomes: [...outcomes].sort(),
      failures: [...failures].sort(),
      languages: [...languages].sort(),
      intents: [...intents].sort(),
      hasIntent: intents.size > 0,
      hasCost,
      hasLatency,
      hasAppointment,
      hasLanguage: languages.size > 0,
      hasResult: outcomes.size > 0 || failures.size > 0,
    };
  }, [calls]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const now = Date.now();
    const rows = calls.filter((c) => {
      if (direction !== 'all' && c.direction !== direction) return false;
      if (status !== 'all' && c.status !== status) return false;
      if (range !== 'all' && now - new Date(c.started_at).getTime() > RANGE_MS[range]) return false;
      if (c.duration_seconds < minDur) return false;
      if (result !== 'all') {
        const [kind, value] = [result.slice(0, 1), result.slice(2)];
        if (kind === 'o' && c.outcome?.outcome !== value) return false;
        if (kind === 'f' && c.failure_code !== value) return false;
      }
      if (language !== 'all' && langCode(c.language) !== language) return false;
      if (intent !== 'all' && String(c.inbound_intent ?? '') !== intent) return false;
      if (apptOnly && !c.appointment) return false;
      if (needle) {
        const hay = `${c.from_number} ${c.to_number} ${c.call_sid} ${c.status} ${c.direction} ${nameFor(peerNumber(c)) ?? ''} ${c.failure_code ?? ''} ${c.outcome?.outcome ?? ''} ${c.language ?? ''}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    const cmpBy: Record<SortKey, (a: CallSummary, b: CallSummary) => number> = {
      when: (a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime(),
      duration: (a, b) => a.duration_seconds - b.duration_seconds,
      direction: (a, b) => a.direction.localeCompare(b.direction),
      status: (a, b) => a.status.localeCompare(b.status),
      number: (a, b) => peerNumber(a).localeCompare(peerNumber(b)),
      // Missing values sink to the bottom rather than pretending to be 0 —
      // "cheapest call" should not be a call whose cost nobody recorded.
      latency: (a, b) => (a.latency?.p50_ms ?? Infinity) - (b.latency?.p50_ms ?? Infinity),
      cost: (a, b) => (a.cost_total_usd ?? Infinity) - (b.cost_total_usd ?? Infinity),
    };
    rows.sort((a, b) => {
      const cmp = cmpBy[sortKey](a, b);
      return sortAsc ? cmp : -cmp;
    });
    return rows;
  }, [calls, q, direction, status, range, minDur, result, language, intent, apptOnly, sortKey, sortAsc, nameFor]);

  const stats = useMemo(() => {
    const talk = filtered.reduce((n, c) => n + c.duration_seconds, 0);
    const priced = filtered.filter((c) => c.cost_total_usd != null);
    return {
      total: filtered.length,
      inbound: filtered.filter((c) => c.direction === 'inbound').length,
      outbound: filtered.filter((c) => c.direction === 'outbound').length,
      active: filtered.filter((c) => c.status === 'active').length,
      talk,
      avg: filtered.length ? Math.round(talk / filtered.length) : 0,
      // Summed over the rows that HAVE a cost, and labelled with that count —
      // a total that silently skips unpriced calls reads as the whole bill.
      cost: priced.reduce((n, c) => n + (c.cost_total_usd ?? 0), 0),
      pricedCount: priced.length,
    };
  }, [filtered]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  // Filters or fresh data can shrink the list under the current page.
  const safePage = Math.min(page, totalPages);
  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  const start = (safePage - 1) * pageSize;
  const rows = filtered.slice(start, start + pageSize);

  const hasFilters =
    q !== '' ||
    direction !== 'all' ||
    status !== 'all' ||
    range !== 'all' ||
    minDur !== 0 ||
    result !== 'all' ||
    language !== 'all' ||
    apptOnly ||
    intent !== 'all';
  const clearFilters = () => {
    setQ('');
    setDirection('all');
    setStatus('all');
    setRange('all');
    setMinDur(0);
    setResult('all');
    setLanguage('all');
    setApptOnly(false);
    setPage(1);
  };

  // Any filter change restarts paging — page 4 of the old result set is
  // meaningless against the new one.
  const withReset = <T,>(set: (v: T) => void) => (v: T) => {
    set(v);
    setPage(1);
  };

  const changePageSize = (v: number) => {
    setPageSize(v);
    localStorage.setItem(PAGE_SIZE_KEY, String(v));
    // Keep the first row of the current page in view after the resize.
    setPage(Math.floor(start / v) + 1);
  };

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc((v) => !v);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
    setPage(1);
  };

  const copySid = (sid: string) => {
    void navigator.clipboard?.writeText(sid);
    setCopiedSid(sid);
    setTimeout(() => setCopiedSid((s) => (s === sid ? null : s)), 1200);
  };

  const SortHead = ({
    forKey,
    label,
    className,
  }: {
    forKey: SortKey;
    label: string;
    className?: string;
  }) => (
    <th className={cn('font-medium', className)}>
      <button
        type="button"
        onClick={() => toggleSort(forKey)}
        className="inline-flex items-center gap-1 transition-colors hover:text-[var(--text-3)]"
        aria-label={`Sort by ${label}`}
      >
        {label}
        {sortKey === forKey &&
          (sortAsc ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />)}
      </button>
    </th>
  );

  return (
    <section className="rounded-[14px] border border-[var(--line)] bg-white p-5">
      {/* Title row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-baseline gap-2">
          <h3 className="text-sm font-semibold text-[var(--ink)]">Call history</h3>
          <span className="text-[11px] text-[var(--text-5)]">
            {hasFilters
              ? `${filtered.length} of ${calls.length} calls`
              : `${calls.length} call${calls.length === 1 ? '' : 's'}`}
            {isLoadingMore && ' · loading older…'}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-full border border-[var(--line)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-3)] transition-colors hover:bg-[var(--sand)]"
            >
              Clear filters
            </button>
          )}
          <button
            type="button"
            onClick={() => downloadCsv('call-history.csv', toCsv(filtered, nameFor))}
            disabled={!filtered.length}
            className="flex items-center gap-1 rounded-full border border-[var(--line)] px-2.5 py-1 text-[11px] font-medium text-[var(--text-3)] transition-colors hover:bg-[var(--sand)] disabled:opacity-40"
            title="Export the filtered rows as CSV"
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </button>
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-full border border-[var(--line)] p-1.5 text-[var(--text-4)] transition-colors hover:bg-[var(--sand)] hover:text-[var(--ink)]"
            aria-label="Refresh call history"
            title="Refresh"
          >
            <RefreshCw className={cn('h-3.5 w-3.5', isRefetching && 'animate-spin')} />
          </button>
        </div>
      </div>

      {/* Stats strip */}
      <div className="mt-3 flex divide-x divide-[var(--line-soft)] border-y border-[var(--line-soft)]">
        <StatCell label="Calls" value={String(stats.total)} />
        <StatCell label="Inbound" value={String(stats.inbound)} />
        <StatCell label="Outbound" value={String(stats.outbound)} />
        <StatCell label="Live now" value={String(stats.active)} />
        <StatCell label="Talk time" value={fmtTalkTime(stats.talk)} />
        <StatCell label="Avg length" value={fmtDuration(stats.avg)} />
        {options.hasCost && (
          <StatCell
            label={
              stats.pricedCount === stats.total
                ? 'Cost'
                : `Cost (${stats.pricedCount} of ${stats.total} priced)`
            }
            value={fmtCostUsd(stats.cost)}
          />
        )}
      </div>

      {/* Filter bar */}
      <div className="my-3 flex flex-wrap items-center gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-5)]" />
          <Input
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
            placeholder="Number, name, sid, status…"
            className="h-8 w-56 pl-8 text-xs"
          />
        </div>

        <div className="flex items-center rounded-full border border-[var(--line)] bg-white p-0.5">
          {(['all', 'inbound', 'outbound'] as const).map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => withReset(setDirection)(d)}
              className={cn(
                'rounded-full px-2.5 py-1 text-[11px] font-medium capitalize transition-colors',
                direction === d ? 'bg-[var(--ink)] text-white' : 'text-[var(--text-4)] hover:text-[var(--ink)]',
              )}
            >
              {d === 'all' ? 'All' : d}
            </button>
          ))}
        </div>

        <FilterSelect
          value={status}
          onChange={(v) => withReset(setStatus)(v as StatusFilter)}
          ariaLabel="Filter by status"
        >
          <option value="all">Any status</option>
          <option value="active">Active</option>
          <option value="completed">Completed</option>
        </FilterSelect>

        <FilterSelect
          value={range}
          onChange={(v) => withReset(setRange)(v as RangeFilter)}
          ariaLabel="Filter by time range"
        >
          <option value="all">Any time</option>
          <option value="today">Last 24h</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </FilterSelect>

        <FilterSelect
          value={minDur}
          onChange={(v) => withReset(setMinDur)(Number(v) as MinDurFilter)}
          ariaLabel="Filter by minimum duration"
        >
          <option value={0}>Any duration</option>
          <option value={30}>≥ 30 sec</option>
          <option value={60}>≥ 1 min</option>
          <option value={300}>≥ 5 min</option>
        </FilterSelect>

        {options.hasResult && (
          <FilterSelect
            value={result}
            onChange={(v) => withReset(setResult)(v as ResultFilter)}
            ariaLabel="Filter by outcome or failure code"
          >
            <option value="all">Any result</option>
            {options.outcomes.length > 0 && (
              <optgroup label="Outcome">
                {options.outcomes.map((o) => (
                  <option key={o} value={`o:${o}`}>
                    {humanizeCode(o)}
                  </option>
                ))}
              </optgroup>
            )}
            {options.failures.length > 0 && (
              <optgroup label="Failure code">
                {options.failures.map((f) => (
                  <option key={f} value={`f:${f}`}>
                    {humanizeCode(f)}
                  </option>
                ))}
              </optgroup>
            )}
          </FilterSelect>
        )}

        {options.hasLanguage && (
          <FilterSelect
            value={language}
            onChange={(v) => withReset(setLanguage)(v)}
            ariaLabel="Filter by call language"
          >
            <option value="all">Any language</option>
            {options.languages.map((l) => (
              <option key={l} value={l}>
                {l.toUpperCase()}
              </option>
            ))}
          </FilterSelect>
        )}

        {options.hasIntent && (
          <FilterSelect
            value={intent}
            onChange={(v) => withReset(setIntent)(v)}
            ariaLabel="Filter by inbound intent"
          >
            <option value="all">Any intent</option>
            {options.intents.map((i) => (
              <option key={i} value={i}>
                {intentMeta(i)?.label ?? i}
              </option>
            ))}
          </FilterSelect>
        )}

        {options.hasAppointment && (
          <button
            type="button"
            onClick={() => withReset(setApptOnly)(!apptOnly)}
            aria-pressed={apptOnly}
            className={cn(
              'flex h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-medium transition-colors',
              apptOnly
                ? 'border-[var(--ink)] bg-[var(--ink)] text-white'
                : 'border-[var(--line)] text-[var(--text-3)] hover:bg-[var(--sand)]',
            )}
          >
            <CalendarCheck2 className="h-3.5 w-3.5" />
            Appointments only
          </button>
        )}
      </div>

      {isError ? (
        <div className="flex items-center justify-between gap-3 rounded-[10px] border border-red-200 bg-red-50 px-3 py-2.5 text-xs text-red-700">
          <span>Could not load call history — {error?.message}</span>
          <button
            type="button"
            onClick={() => void refetch()}
            className="rounded-full border border-red-200 px-2.5 py-1 font-medium hover:bg-white"
          >
            Retry
          </button>
        </div>
      ) : isLoading ? (
        <div className="space-y-1.5 py-1">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-9 animate-pulse rounded-[8px] bg-[var(--sand)]" />
          ))}
        </div>
      ) : !calls.length ? (
        <div className="flex flex-col items-center gap-1 py-12 text-center">
          <PhoneCall className="h-7 w-7 text-[var(--text-5)] opacity-40" />
          <p className="text-sm text-[var(--text-4)]">No calls yet.</p>
          <p className="text-xs text-[var(--text-5)]">Calls appear here as soon as the agent places or answers one.</p>
        </div>
      ) : !filtered.length ? (
        <div className="flex flex-col items-center gap-2 py-12 text-center">
          <p className="text-sm text-[var(--text-4)]">Nothing matches the current filters.</p>
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-full border border-[var(--line)] px-3 py-1 text-xs font-medium text-[var(--text-3)] hover:bg-[var(--sand)]"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <div className="-mx-1 overflow-x-auto">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="text-left text-[11px] uppercase tracking-wide text-[var(--text-5)] [&_th]:bg-[var(--sand)] [&_th]:px-2 [&_th]:py-2 [&_th:first-child]:rounded-l-[8px] [&_th:last-child]:rounded-r-[8px]">
                <tr>
                  <SortHead forKey="when" label="When" />
                  <SortHead forKey="direction" label="Dir" />
                  {options.hasLanguage && <th className="w-10 font-medium">Lang</th>}
                  <SortHead forKey="number" label="Contact / number" />
                  <SortHead forKey="status" label="Status" />
                  {options.hasResult && <th className="font-medium">Result</th>}
                  {options.hasIntent && <th className="font-medium">Intent</th>}
                  {options.hasLatency && <SortHead forKey="latency" label="Latency" />}
                  {options.hasCost && <SortHead forKey="cost" label="Cost" className="text-right" />}
                  <SortHead forKey="duration" label="Duration" className="text-right" />
                  <th className="hidden font-medium lg:table-cell">Ended</th>
                  <th className="hidden font-medium xl:table-cell">Call SID</th>
                  <th className="w-8" aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {rows.map((c: CallSummary) => {
                  const when = fmtWhen(c.started_at);
                  const peer = peerNumber(c);
                  const name = nameFor(peer);
                  return (
                    <tr
                      key={c.call_sid}
                      tabIndex={0}
                      onClick={() => onSelect(c.call_sid)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          onSelect(c.call_sid);
                        }
                      }}
                      className={cn(
                        'cursor-pointer border-t border-[var(--line-soft)] text-[var(--text-2)] outline-none hover:bg-[rgba(20,22,26,0.02)] focus-visible:bg-[rgba(20,22,26,0.04)] [&>td]:px-2',
                        selected === c.call_sid && 'bg-[rgba(20,22,26,0.05)]',
                      )}
                    >
                      <td className="py-2 whitespace-nowrap">
                        <div className="text-[13px] text-[var(--ink)]">
                          {when.date} · {when.time}
                        </div>
                        <div className="text-[10px] text-[var(--text-5)]">{fmtRelative(c.started_at)}</div>
                      </td>
                      <td>
                        <span className="flex items-center gap-1 text-xs capitalize">
                          {c.direction === 'outbound' ? (
                            <ArrowUpRight className="h-3.5 w-3.5 text-[var(--text-5)]" />
                          ) : (
                            <ArrowDownLeft className="h-3.5 w-3.5 text-[var(--text-5)]" />
                          )}
                          {c.direction}
                        </span>
                      </td>
                      {options.hasLanguage && (
                        <td>
                          <LanguageFlag language={c.language} />
                        </td>
                      )}
                      <td className="max-w-[220px]">
                        <div className="flex items-center gap-1.5">
                          <AppointmentMark appointment={c.appointment} />
                          <span className="min-w-0">
                            {name && <span className="block truncate text-[13px] text-[var(--ink)]">{name}</span>}
                            <span className="block truncate font-mono text-xs text-[var(--text-4)]">{peer || '—'}</span>
                          </span>
                        </div>
                        <RetryCounter appointment={c.appointment} />
                      </td>
                      <td>
                        <StatusPill status={c.status} />
                      </td>
                      {options.hasResult && (
                        <td className="max-w-[160px]">
                          <OutcomeChip call={c} />
                        </td>
                      )}
                      {options.hasIntent && (
                        <td className="max-w-[120px]">
                          <IntentChip intent={c.inbound_intent} />
                        </td>
                      )}
                      {options.hasLatency && (
                        <td>
                          <LatencyChip latency={c.latency} />
                        </td>
                      )}
                      {options.hasCost && (
                        <td className="text-right">
                          <CostCell usd={c.cost_total_usd} />
                        </td>
                      )}
                      <td className="text-right font-mono text-xs tabular-nums">
                        {fmtDuration(c.duration_seconds)}
                      </td>
                      <td className="hidden whitespace-nowrap text-xs text-[var(--text-4)] lg:table-cell">
                        {c.ended_at ? fmtWhen(c.ended_at).time : '—'}
                      </td>
                      <td className="hidden xl:table-cell">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            copySid(c.call_sid);
                          }}
                          className="flex max-w-[160px] items-center gap-1 font-mono text-[11px] text-[var(--text-5)] transition-colors hover:text-[var(--ink)]"
                          title="Copy call SID"
                        >
                          <span className="truncate">{c.call_sid}</span>
                          {copiedSid === c.call_sid ? (
                            <Check className="h-3 w-3 shrink-0 text-green-600" />
                          ) : (
                            <Copy className="h-3 w-3 shrink-0" />
                          )}
                        </button>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onExpand(c.call_sid);
                          }}
                          className="rounded-full p-1 text-[var(--text-5)] transition-colors hover:bg-[var(--sand-deep)] hover:text-[var(--ink)]"
                          aria-label="Open full transcript"
                          title="Open full transcript"
                        >
                          <Maximize2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line-soft)] pt-3">
            <div className="flex items-center gap-2 text-[11px] text-[var(--text-5)]">
              <span>
                {start + 1}–{Math.min(start + pageSize, filtered.length)} of {filtered.length}
              </span>
              <FilterSelect
                value={pageSize}
                onChange={(v) => changePageSize(Number(v))}
                ariaLabel="Rows per page"
              >
                {PAGE_SIZES.map((n) => (
                  <option key={n} value={n}>
                    {n} / page
                  </option>
                ))}
              </FilterSelect>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setPage(1)}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--line)] text-[var(--text-4)] transition-colors hover:bg-[var(--sand)] disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="First page"
              >
                <ChevronsLeft className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--line)] text-[var(--text-4)] transition-colors hover:bg-[var(--sand)] disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
              </button>

              {pageItems(safePage, totalPages).map((p, i) =>
                p === '…' ? (
                  <span key={`gap-${i}`} className="px-1 text-[11px] text-[var(--text-5)]">
                    …
                  </span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p)}
                    aria-current={safePage === p ? 'page' : undefined}
                    className={cn(
                      'flex h-7 min-w-7 items-center justify-center rounded-full px-1.5 text-[11px] font-medium transition-colors',
                      safePage === p
                        ? 'bg-[var(--ink)] text-white'
                        : 'text-[var(--text-4)] hover:bg-[var(--sand)] hover:text-[var(--ink)]',
                    )}
                  >
                    {p}
                  </button>
                ),
              )}

              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--line)] text-[var(--text-4)] transition-colors hover:bg-[var(--sand)] disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Next page"
              >
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setPage(totalPages)}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-[var(--line)] text-[var(--text-4)] transition-colors hover:bg-[var(--sand)] disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Last page"
              >
                <ChevronsRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {cappedAt !== null && (
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-[var(--text-5)]">
              <span>Loaded the {cappedAt} most recent calls — older ones are on the server.</span>
              <button
                type="button"
                onClick={loadMore}
                className="rounded-full border border-[var(--line)] px-2.5 py-1 font-medium text-[var(--text-3)] hover:bg-[var(--sand)]"
              >
                Load {CALL_HISTORY_CHUNK} older
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

function TranscriptPanel({
  callSid,
  onClose,
  onExpand,
}: {
  callSid: string;
  onClose: () => void;
  onExpand: () => void;
}) {
  const { data: d, isLoading } = useCallDetail(callSid);
  return (
    <aside className="rounded-[14px] border border-[var(--line)] bg-white p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="truncate text-sm font-semibold text-[var(--ink)]">
          Transcript · <span className="font-mono text-xs text-[var(--text-4)]">{callSid}</span>
        </h3>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onExpand}
            className="rounded-full p-1 text-[var(--text-5)] hover:bg-[var(--sand-deep)] hover:text-[var(--text-3)]"
            aria-label="Open full transcript"
            title="Open full transcript"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[var(--text-5)] hover:bg-[var(--sand-deep)] hover:text-[var(--text-3)]"
            aria-label="Close transcript"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
      {isLoading && <div className="text-sm text-[var(--text-5)]">Loading…</div>}
      {d && (
        <>
          {d.appointment && (
            <div className="mb-3">
              <AppointmentPanel appointment={d.appointment} />
            </div>
          )}
          {d.latency && (
            <div className="mb-3">
              <LatencyPanel latency={d.latency} />
            </div>
          )}
          <div className="max-h-96 space-y-2 overflow-y-auto pr-2">
            {d.transcript.length === 0 && (
              <div className="text-sm text-[var(--text-5)]">No transcript recorded.</div>
            )}
            {d.transcript.map((t, i) => {
              // A SYSTEM language-switch entry is not a line anyone said — it
              // reads as a divider between the two halves of the conversation.
              const sw = parseLanguageSwitch(t);
              if (sw) return <LanguageSwitchDivider key={i} sw={sw} />;
              return (
                <div key={i}>
                  <span
                    className={cn(
                      'mr-2 text-[10px] font-semibold uppercase tracking-wide',
                      t.speaker === 'agent' ? 'text-[var(--blue)]' : 'text-[var(--text-5)]',
                    )}
                  >
                    {t.speaker}
                  </span>
                  <span className={cn('text-sm', t.speaker === 'agent' ? 'text-[var(--text-2)]' : 'text-[var(--ink)]')}>
                    {t.text}
                  </span>
                  {t.state === 'undelivered' && (
                    <span className="ml-2 text-[10px] text-amber-600">⚠ not delivered as audio</span>
                  )}
                </div>
              );
            })}
          </div>
          <CallActionsTimeline actions={d.actions} compact />
        </>
      )}
    </aside>
  );
}

// ── Contacts ─────────────────────────────────────────────────────────

function ContactsSection() {
  const { data: contacts } = useContacts();
  if (!contacts?.length) return null;
  const optedOut = contacts.filter((c) => c.opted_out).length;
  return (
    <section className="rounded-[14px] border border-[var(--line)] bg-white p-5">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
        Contacts
        {optedOut > 0 && (
          <span className="flex items-center gap-1 rounded-full border border-[var(--line)] px-2 py-0.5 text-[10px] font-medium text-[var(--text-4)]">
            <Ban className="h-3 w-3 text-red-500" />
            {optedOut} opted out
          </span>
        )}
      </h3>
      <ul className="space-y-1.5 text-sm">
        {contacts.map((c) => (
          <li key={c.phone_number} className="flex items-baseline justify-between gap-3">
            <span className={cn('flex items-center gap-1.5', c.opted_out ? 'text-[var(--text-5)]' : 'text-[var(--ink)]')}>
              {c.opted_out && (
                <span title="On the do-not-call list — the agent will not dial this number">
                  <Ban className="h-3 w-3 shrink-0 text-red-500" />
                </span>
              )}
              {c.name}
            </span>
            <span className="font-mono text-xs text-[var(--text-5)]">{c.phone_number}</span>
          </li>
        ))}
      </ul>
      {optedOut > 0 && (
        <p className="mt-3 border-t border-[var(--line-soft)] pt-2.5 text-[11px] text-[var(--text-5)]">
          Opt-outs are recorded by the backend when someone declines on a call, and are read-only
          here.
        </p>
      )}
    </section>
  );
}

// ── Not-connected prompt ─────────────────────────────────────────────

function ConnectPrompt() {
  return (
    <div className="mx-auto mt-16 max-w-md rounded-[14px] border border-[var(--line)] bg-white p-8 text-center">
      <Plug className="mx-auto mb-3 h-8 w-8 text-[var(--text-5)]" />
      <h2 className="text-sm font-semibold text-[var(--ink)]">Not connected to a Pincer backend</h2>
      <p className="mt-2 text-xs leading-relaxed text-[var(--text-5)]">
        The Voice app reads live data from your Pincer server. Connect this browser with the
        shared bearer token and it will start polling <span className="font-mono">/api/voice/*</span>.
      </p>
      <Link
        to="/login"
        className="mt-4 inline-block rounded-full bg-[var(--ink)] px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-85"
      >
        Connect (Login → Token)
      </Link>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────

export default function VoicePage() {
  const connected = useVoiceConnected();
  const navigate = useNavigate();
  const unreadMessages = useUnreadMessageCount();
  const [selected, setSelected] = useState<string | null>(null);
  const [modalSid, setModalSid] = useState<string | null>(null);
  const [startOpen, setStartOpen] = useState(false);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line-soft)] px-6 pt-5 pb-4">
        <div>
          <p className="plat-crumb" style={{ color: 'var(--text-4)' }}>3days.telephony</p>
          <h1 className="mt-1 text-[26px] text-[var(--ink)]">Voice</h1>
          <p className="mt-1 text-xs text-[var(--text-4)]">
            Live agent calls · real data from /api/voice
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {connected && <LimitsStrip />}
          {connected && <StatusHeader />}
          {connected && (
            <button
              type="button"
              onClick={() => navigate('/telephony/messages')}
              className="flex h-9 items-center gap-1.5 rounded-full border border-[var(--line)] px-3.5 text-xs font-medium text-[var(--text-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
              title="Messages the receptionist took for you"
            >
              <Inbox className="h-3.5 w-3.5" />
              Messages
              {unreadMessages > 0 && (
                <span className="ml-0.5 rounded-full bg-[var(--blue)] px-1.5 py-0.5 text-[10px] font-bold leading-none text-white">
                  {unreadMessages}
                </span>
              )}
            </button>
          )}
          {connected && (
            <button
              type="button"
              onClick={() => setStartOpen(true)}
              className="flex h-9 items-center gap-1.5 rounded-full bg-[var(--ink)] px-3.5 text-xs font-medium text-white transition-colors hover:opacity-85"
            >
              <PhoneOutgoing className="h-3.5 w-3.5" />
              New call
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {!connected ? (
          <ConnectPrompt />
        ) : (
          <div className="space-y-4">
            <ActiveCallsSection />

            {/* Profile, inbound stats, blocklist. One quiet line when off. */}
            <ReceptionistPanel />

            <div className={selected ? 'grid gap-4 xl:grid-cols-[minmax(0,1fr)_380px]' : ''}>
              <HistorySection
                selected={selected}
                onSelect={setSelected}
                onExpand={setModalSid}
              />
              {selected && (
                <TranscriptPanel
                  callSid={selected}
                  onClose={() => setSelected(null)}
                  onExpand={() => setModalSid(selected)}
                />
              )}
            </div>

            <ContactsSection />

            {startOpen && <StartCallModal onClose={() => setStartOpen(false)} />}

            {modalSid && (
              <TranscriptModal
                callSid={modalSid}
                open={!!modalSid}
                onClose={() => setModalSid(null)}
              />
            )}

            {/* ─────────── Still mocked — visibly badged per task contract ─────────── */}
            <MockedSection
              title="Live listen-in"
              reason="No audio streaming to the browser exists yet — requires a media proxy (follow-up task)."
            >
              <div className="flex h-16 items-center justify-center rounded-[10px] border border-[var(--line-soft)] bg-white text-xs text-[var(--text-5)]">
                waveform placeholder
              </div>
            </MockedSection>

            {/* Per-call cost lost its badge in v2: `call_costs` (Sprint 9 T9.1)
                makes it real, and it now lives in the history table and the
                stats strip. What is left here is what is still not computed. */}
            <MockedSection
              title="Sentiment & talk ratio"
              reason="Neither is computed anywhere in the pipeline yet — no sentiment model runs on the transcript, and speaking time is not measured per speaker."
            >
              <div className="text-xs text-[var(--text-5)]">sentiment — · talk ratio —:—</div>
            </MockedSection>
          </div>
        )}
      </div>
    </div>
  );
}
