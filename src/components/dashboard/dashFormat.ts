/** Formatting shared by the dashboard cards and their expanded detail views. */

/**
 * Money here is for orientation, not accounting: always two decimals, and a
 * real sub-cent amount shows as "<$0.01" rather than a misleading "$0.00".
 */
export const fmtUsd = (v: number | null | undefined) => {
  if (v == null) return '—';
  if (v > 0 && v < 0.01) return '<$0.01';
  return `$${v.toFixed(2)}`;
};

/** Tick money: no "<$0.01" noise, cents only when they matter. */
export const fmtUsdTick = (v: number) => (v >= 10 ? `$${Math.round(v)}` : `$${v.toFixed(2)}`);

export const fmtNum = (v: number | null | undefined) =>
  v == null ? '—' : v.toLocaleString('en-US');

export const fmtMs = (v: number | null | undefined) => {
  if (v == null) return '—';
  return v < 1000 ? `${Math.round(v)} ms` : `${(v / 1000).toFixed(1)} s`;
};

export function timeAgo(iso: string): string {
  const t = new Date(iso).getTime();
  if (isNaN(t)) return iso;
  const s = Math.max(0, Math.floor((Date.now() - t) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86_400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86_400)}d ago`;
}

export const todayIso = () => new Date().toISOString().slice(0, 10);

/** "2026-08-14" to "08-14", for an axis tick. */
export const shortDay = (iso: string) => iso.slice(5);

/** "2026-08-14" to "Thu 14 Aug", for a tooltip. */
export const longDay = (iso: string) => {
  const d = new Date(`${iso}T00:00:00`);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
};

export const dateTime = (iso: string | null | undefined) => {
  if (!iso) return '—';
  const d = new Date(iso);
  return isNaN(d.getTime()) ? iso : d.toLocaleString();
};

/** Audit rows bucket by the day the user saw them, so the key is local. */
export const dayKey = (d: Date) => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

/** Day keys for the last `n` days, oldest first: the x-axis of every trend. */
export function lastDays(n: number): string[] {
  const out: string[] = [];
  const now = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    out.push(dayKey(d));
  }
  return out;
}
