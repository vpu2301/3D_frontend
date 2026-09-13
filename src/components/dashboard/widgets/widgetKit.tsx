/**
 * Shared furniture for the dashboard widgets, so the small panels read as one
 * system: a compact number row, hairline fact rows, and the same quiet
 * placeholder whenever the backend has nothing to show yet.
 */
import type { ReactNode } from 'react';

/** Two or three numbers across the top of a widget. */
export function WidgetStats({
  items,
}: {
  items: { label: string; value: ReactNode; sub?: string }[];
}) {
  return (
    <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((s) => (
        <div key={s.label} className="min-w-0">
          <p
            className="text-[22px] font-semibold leading-none tracking-[-0.03em]"
            style={{ fontFamily: 'var(--display)', fontVariantNumeric: 'tabular-nums' }}
          >
            {s.value}
          </p>
          <p className="mt-1.5 truncate text-[11.5px] font-medium" style={{ color: 'var(--text-3)' }}>
            {s.label}
          </p>
          {s.sub && (
            <p className="truncate text-[10.5px]" style={{ color: 'var(--text-5)' }} title={s.sub}>
              {s.sub}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/** Label / value pairs under the numbers — the settings a widget reports. */
export function WidgetRows({ rows }: { rows: { label: string; value: ReactNode }[] }) {
  return (
    <dl className="mt-4 space-y-0">
      {rows.map((r, i) => (
        <div
          key={r.label}
          className="flex items-center justify-between gap-3 py-2 text-[12px]"
          style={i ? { borderTop: '1px solid var(--line-soft)' } : undefined}
        >
          <dt style={{ color: 'var(--text-4)' }}>{r.label}</dt>
          <dd className="min-w-0 truncate text-right font-medium" style={{ color: 'var(--text-1)' }}>
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Same voice everywhere: what is missing, not "no data". */
export function WidgetEmpty({ children }: { children: ReactNode }) {
  return (
    <p
      className="rounded-[10px] px-3 py-6 text-center text-[11.5px]"
      style={{ background: 'var(--sand)', color: 'var(--text-5)' }}
    >
      {children}
    </p>
  );
}

/** A caption above a small plot inside a widget. */
export function WidgetPlot({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="mt-4">
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <p className="text-[11.5px] font-semibold" style={{ color: 'var(--text-2)' }}>
          {title}
        </p>
        {hint && (
          <span className="text-[10.5px]" style={{ color: 'var(--text-5)' }}>
            {hint}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}
