/**
 * The small, repeated bits of call metadata: language flag, outcome/failure
 * chip, latency chip, cost, appointment marker, retry counter, and the
 * language-switch divider used inside transcripts.
 *
 * Every one of them renders `null` when the backend has not sent the field —
 * the page shows real data or nothing, never a placeholder zero.
 */
import { CalendarCheck2, Gauge, RefreshCw } from 'lucide-react';
import {
  LATENCY_TARGET_GOOD_MS,
  type AppointmentInfo,
  type CallLatency,
  type CallSummary,
} from '@/lib/api/voice';
import {
  CHIP_TONE_CLASS,
  fmtCostUsd,
  fmtMs,
  languageMeta,
  languageSwitchText,
  latencyTone,
  rowChip,
  type ChipTone,
  type LanguageSwitch,
} from '@/pages/telephony/_lib/voiceMeta';
import { cn } from '@/lib/utils';

// ── Language ─────────────────────────────────────────────────────────

export function LanguageFlag({ language }: { language: string | null | undefined }) {
  const meta = languageMeta(language);
  if (!meta) return null;
  return (
    <span
      className="inline-flex items-center gap-1 text-xs text-[var(--text-4)]"
      title={`Call conducted in ${meta.label}`}
    >
      <span aria-hidden className="text-[13px] leading-none">
        {meta.flag}
      </span>
      <span className="uppercase">{language?.slice(0, 2)}</span>
    </span>
  );
}

/** The SYSTEM entry a mid-call language switch leaves in the transcript. */
export function LanguageSwitchDivider({ sw }: { sw: LanguageSwitch }) {
  const meta = languageMeta(sw.to);
  return (
    <div className="flex items-center gap-3 py-1" role="separator">
      <span className="h-px flex-1 bg-[var(--line)]" />
      <span className="flex items-center gap-1.5 whitespace-nowrap text-[11px] italic text-[var(--text-4)]">
        {meta && (
          <span aria-hidden className="not-italic">
            {meta.flag}
          </span>
        )}
        {languageSwitchText(sw)}
      </span>
      <span className="h-px flex-1 bg-[var(--line)]" />
    </div>
  );
}

// ── Outcome / failure ────────────────────────────────────────────────

export function Chip({
  tone,
  title,
  children,
  className,
}: {
  tone: ChipTone;
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      title={title}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium',
        CHIP_TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function OutcomeChip({ call }: { call: CallSummary }) {
  const chip = rowChip(call);
  if (!chip) return null;
  return (
    <Chip tone={chip.tone} title={chip.title}>
      {chip.label}
    </Chip>
  );
}

// ── Latency ──────────────────────────────────────────────────────────

/** p50 turn latency for one call, coloured against the Sprint 5 targets. */
export function LatencyChip({ latency }: { latency: CallLatency | null | undefined }) {
  if (!latency || latency.p50_ms == null) return null;
  const p95 = latency.p95_ms == null ? '' : ` · p95 ${fmtMs(latency.p95_ms)}`;
  return (
    <Chip
      tone={latencyTone(latency.p50_ms)}
      title={`Median turn latency over ${latency.turns} turn${latency.turns === 1 ? '' : 's'}${p95} — target ≤ ${LATENCY_TARGET_GOOD_MS / 1000}s`}
      className="tabular-nums"
    >
      <Gauge className="h-3 w-3" />
      {fmtMs(latency.p50_ms)}
    </Chip>
  );
}

// ── Cost ─────────────────────────────────────────────────────────────

export function CostCell({ usd }: { usd: number | null | undefined }) {
  if (usd == null) return <span className="text-[var(--text-5)]">—</span>;
  return (
    <span className="font-mono text-xs tabular-nums text-[var(--text-3)]" title="Telephony + model cost for this call (call_costs)">
      {fmtCostUsd(usd)}
    </span>
  );
}

// ── Appointment ──────────────────────────────────────────────────────

export function AppointmentMark({ appointment }: { appointment: AppointmentInfo | null | undefined }) {
  if (!appointment) return null;
  const when = appointment.agreed_datetime
    ? new Date(appointment.agreed_datetime).toLocaleString()
    : 'no slot agreed yet';
  return (
    <span
      className="inline-flex"
      title={`Appointment · ${appointment.status.replace(/_/g, ' ')} · ${when}`}
      aria-label="Appointment call"
    >
      <CalendarCheck2
        className={cn(
          'h-3.5 w-3.5 shrink-0',
          appointment.agreed_datetime ? 'text-green-600' : 'text-[var(--text-5)]',
        )}
      />
    </span>
  );
}

/** "attempt 2/3" — only once a retry has actually happened. */
export function RetryCounter({
  appointment,
}: {
  appointment: (AppointmentInfo & { max_retries?: number | null }) | null | undefined;
}) {
  if (!appointment || !appointment.retry_count) return null;
  const attempt = appointment.retry_count + 1;
  const max = appointment.max_retries ? `/${appointment.max_retries + 1}` : '';
  return (
    <span
      className="inline-flex items-center gap-1 whitespace-nowrap text-[10px] font-medium text-amber-700"
      title="The scheduling job re-dialed after an unsuccessful attempt"
    >
      <RefreshCw className="h-3 w-3" />
      attempt {attempt}
      {max}
    </span>
  );
}
