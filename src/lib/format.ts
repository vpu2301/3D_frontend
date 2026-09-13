/**
 * Formatters for the owner app (FE-BINDING: "Formatters").
 *
 * Every date, number, duration, amount and phone number an owner sees goes
 * through here, in the owner app's locale (`de-DE` by default, `en-GB` when
 * the session says English) via `Intl` — never hand-rolled. Times default to
 * the browser's zone; pass `timeZone` where the business's IANA zone is known
 * (the receptionist profile carries one), because open/closed is the
 * business's clock, not the viewer's.
 *
 * Phone numbers are masked in lists by default (Block I rule 5):
 * `+49 171 ••• 4521`. The full number is a deliberate, role-gated choice made
 * by the surface, not by the formatter.
 */
import { intlLocale } from "@/i18n/voice";
import type { VoiceLocale } from "@/stores/session";

export interface FormatOptions {
  locale?: VoiceLocale;
  timeZone?: string;
}

type DateInput = Date | string | number | null | undefined;

function toDate(value: DateInput): Date | null {
  if (value === null || value === undefined) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function tz(opts?: FormatOptions): { timeZone?: string } {
  return opts?.timeZone ? { timeZone: opts.timeZone } : {};
}

/** 06.09.2026 */
export function formatDate(value: DateInput, opts?: FormatOptions): string {
  const d = toDate(value);
  if (!d) return "";
  return new Intl.DateTimeFormat(intlLocale(opts?.locale), { dateStyle: "medium", ...tz(opts) }).format(d);
}

/** 14:05 */
export function formatTime(value: DateInput, opts?: FormatOptions): string {
  const d = toDate(value);
  if (!d) return "";
  return new Intl.DateTimeFormat(intlLocale(opts?.locale), {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...tz(opts),
  }).format(d);
}

/** 06.09.2026, 14:05 */
export function formatDateTime(value: DateInput, opts?: FormatOptions): string {
  const d = toDate(value);
  if (!d) return "";
  return new Intl.DateTimeFormat(intlLocale(opts?.locale), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    ...tz(opts),
  }).format(d);
}

/** "vor 5 Minuten" / "in 2 Stunden" — relative to `now`. */
export function formatRelative(value: DateInput, now: DateInput = Date.now(), opts?: FormatOptions): string {
  const d = toDate(value);
  const n = toDate(now);
  if (!d || !n) return "";
  const diffSec = Math.round((d.getTime() - n.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat(intlLocale(opts?.locale), { numeric: "auto" });
  const abs = Math.abs(diffSec);
  if (abs < 60) return rtf.format(diffSec, "second");
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), "minute");
  if (abs < 86_400) return rtf.format(Math.round(diffSec / 3600), "hour");
  if (abs < 86_400 * 30) return rtf.format(Math.round(diffSec / 86_400), "day");
  return formatDate(d, opts);
}

/**
 * Call durations. Under an hour: "4 Min. 12 Sek." (de) / "4 min 12 sec" (en);
 * an hour or more: "1 Std. 4 Min.". Zero or missing: "0 Sek.".
 */
export function formatDuration(totalSeconds: number | null | undefined, opts?: FormatOptions): string {
  const s = Math.max(0, Math.round(totalSeconds ?? 0));
  const locale = intlLocale(opts?.locale);
  const unit = (value: number, u: "hour" | "minute" | "second") =>
    new Intl.NumberFormat(locale, { style: "unit", unit: u, unitDisplay: "short" }).format(value);
  const hours = Math.floor(s / 3600);
  const minutes = Math.floor((s % 3600) / 60);
  const seconds = s % 60;
  if (hours > 0) return minutes > 0 ? `${unit(hours, "hour")} ${unit(minutes, "minute")}` : unit(hours, "hour");
  if (minutes > 0) return seconds > 0 ? `${unit(minutes, "minute")} ${unit(seconds, "second")}` : unit(minutes, "minute");
  return unit(seconds, "second");
}

/** Compact clock form for tables: 4:12, 1:04:12. */
export function formatClock(totalSeconds: number | null | undefined): string {
  const s = Math.max(0, Math.round(totalSeconds ?? 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const mm = h > 0 ? String(m).padStart(2, "0") : String(m);
  return `${h > 0 ? `${h}:` : ""}${mm}:${String(sec).padStart(2, "0")}`;
}

/** 1.234,56 € */
export function formatCurrency(amount: number | null | undefined, currency = "EUR", opts?: FormatOptions): string {
  if (amount === null || amount === undefined || Number.isNaN(amount)) return "";
  return new Intl.NumberFormat(intlLocale(opts?.locale), { style: "currency", currency }).format(amount);
}

/** 1.234 · 12,5 */
export function formatNumber(value: number | null | undefined, opts?: FormatOptions & { maximumFractionDigits?: number }): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "";
  return new Intl.NumberFormat(intlLocale(opts?.locale), {
    maximumFractionDigits: opts?.maximumFractionDigits ?? 1,
  }).format(value);
}

/** 0.335 → "34 %" (de) / "34%" (en). Input is a ratio, not a percentage. */
export function formatPercent(ratio: number | null | undefined, opts?: FormatOptions): string {
  if (ratio === null || ratio === undefined || Number.isNaN(ratio)) return "";
  return new Intl.NumberFormat(intlLocale(opts?.locale), { style: "percent", maximumFractionDigits: 0 }).format(ratio);
}

const MASK = "•••";

/**
 * Mask a phone number for lists: keep the country code and the first three
 * national digits for recognisability, hide the middle, keep the last four.
 *
 *   +4917112344521 → +49 171 ••• 4521
 *   017112344521   → 0171 ••• 4521
 *   short/unknown  → ••• 21 (never the whole number)
 */
export function maskPhone(raw: string | null | undefined): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 7) return `${MASK} ${digits.slice(-2)}`.trim();
  const last4 = digits.slice(-4);
  if (hasPlus) {
    const cc = digits.startsWith("1") ? digits.slice(0, 1) : digits.slice(0, 2);
    const national = digits.slice(cc.length);
    const head = national.slice(0, 3);
    return `+${cc} ${head} ${MASK} ${last4}`;
  }
  return `${digits.slice(0, 4)} ${MASK} ${last4}`;
}

/** +4917112344521 → +49 171 1234 4521 (grouped, unmasked — detail views only). */
export function formatPhone(raw: string | null | undefined): string {
  if (!raw) return "";
  const trimmed = raw.trim();
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (!digits) return trimmed;
  if (hasPlus) {
    const cc = digits.startsWith("1") ? digits.slice(0, 1) : digits.slice(0, 2);
    const national = digits.slice(cc.length);
    const groups = national.match(/^(\d{3})(\d{0,4})(\d*)$/);
    if (!groups) return `+${cc} ${national}`;
    return `+${cc} ${[groups[1], groups[2], groups[3]].filter(Boolean).join(" ")}`;
  }
  return digits.replace(/^(\d{4})(\d{0,4})(\d*)$/, (_m, a: string, b: string, c: string) =>
    [a, b, c].filter(Boolean).join(" "),
  );
}

/**
 * Call-row time (FE2 §1.1): "Heute 14:32" for today, otherwise "Mo 01.09. 09:05".
 * `todayLabel` comes from the caller's namespace.
 */
export function formatCallTime(value: DateInput, todayLabel: string, opts?: FormatOptions): string {
  const d = toDate(value);
  if (!d) return "";
  const locale = intlLocale(opts?.locale);
  const time = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit", hour12: false, ...tz(opts) }).format(d);
  const dayKey = (x: Date) => new Intl.DateTimeFormat("en-CA", { year: "numeric", month: "2-digit", day: "2-digit", ...tz(opts) }).format(x);
  if (dayKey(d) === dayKey(new Date())) return `${todayLabel} ${time}`;
  const day = new Intl.DateTimeFormat(locale, { weekday: "short", day: "2-digit", month: "2-digit", ...tz(opts) }).format(d);
  return `${day} ${time}`;
}
