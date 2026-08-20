/**
 * Expand-on-demand shell for the dashboard cards. <Expandable> wraps a card and
 * opens a detail view with the same layout every time: charts on top, the rows
 * behind them underneath, so people learn it once.
 */
import { useId, useMemo, useState, type ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Expand, SquareArrowOutUpRight, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PopoutWindow } from './PopoutWindow';
import {
  DetailDataProvider,
  DetailMenu,
  nodeToText,
  normalizeCell,
  useRegisterDataset,
} from './DetailMenu';

// ── Expandable card wrapper ──────────────────────────────────────────

export function Expandable({
  title,
  subtitle,
  detail,
  children,
  className,
  /** `card` for cards with no controls of their own; `corner` for the rest. */
  trigger = 'corner',
}: {
  title: string;
  subtitle?: string;
  /** Rendered only while open — its hooks stay unmounted until then. */
  detail: ReactNode;
  children: ReactNode;
  className?: string;
  trigger?: 'card' | 'corner';
}) {
  const [open, setOpen] = useState(false);

  const dialog = (
    <DetailDialog open={open} onOpenChange={setOpen} title={title} subtitle={subtitle}>
      {detail}
    </DetailDialog>
  );

  if (trigger === 'card') {
    return (
      <>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={cn('plat-expandable plat-expandable-card', className)}
          aria-label={`Expand ${title}`}
        >
          {children}
          <span className="plat-expand" aria-hidden="true">
            <Expand className="h-3.5 w-3.5" strokeWidth={2} />
          </span>
        </button>
        {dialog}
      </>
    );
  }

  return (
    <div className={cn('plat-expandable', className)}>
      {children}
      <button
        type="button"
        className="plat-expand"
        onClick={() => setOpen(true)}
        aria-label={`Expand ${title}`}
        title={`Expand ${title}`}
      >
        <Expand className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
      {dialog}
    </div>
  );
}

/** For cards that already own their top-right corner (a header row, a tag). */
export function ExpandTrigger({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button type="button" className="plat-expand-link" onClick={onClick} aria-label={`Expand ${label}`}>
      Expand
      <Expand className="h-3 w-3" strokeWidth={2} />
    </button>
  );
}

/** Pairs the trigger with its dialog: one goes in the header, one at the end. */
export function useDetail(title: string, subtitle: string | undefined, detail: ReactNode) {
  const [open, setOpen] = useState(false);
  return {
    open,
    setOpen,
    trigger: <ExpandTrigger onClick={() => setOpen(true)} label={title} />,
    dialog: (
      <DetailDialog open={open} onOpenChange={setOpen} title={title} subtitle={subtitle}>
        {detail}
      </DetailDialog>
    ),
  };
}

// ── The detail dialog ────────────────────────────────────────────────

export function DetailDialog({
  open,
  onOpenChange,
  title,
  subtitle,
  children,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  /** The same detail, moved into its own browser tab. */
  const [poppedOut, setPoppedOut] = useState(false);
  const crumb = `3days.${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

  // Popped out, the tab is the detail view: same header and body, no chrome.
  if (poppedOut) {
    return (
      <PopoutWindow title={crumb} onClose={() => setPoppedOut(false)}>
        <DetailDataProvider>
          <header className="plat-detail-head plat-popout-head">
            <div className="min-w-0">
              <p className="plat-crumb block truncate">{crumb}</p>
              <p className="mt-1 truncate text-sm" style={{ color: 'var(--text-4)' }}>
                {subtitle ?? title}
              </p>
            </div>
            <div className="plat-detail-actions">
              <DetailMenu title={title} />
            </div>
          </header>
          <div className="plat-detail-body plat-popout-body">{children}</div>
        </DetailDataProvider>
      </PopoutWindow>
    );
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="plat-detail-overlay" />
        <DialogPrimitive.Content className="plat plat-detail" aria-describedby={undefined}>
          <DetailDataProvider>
          <header className="plat-detail-head">
            <div className="min-w-0">
              <DialogPrimitive.Title className="plat-crumb block truncate">
                {crumb}
              </DialogPrimitive.Title>
              <p className="mt-1 truncate text-sm" style={{ color: 'var(--text-4)' }}>
                {subtitle ?? title}
              </p>
            </div>
            <div className="plat-detail-actions">
              <DetailMenu title={title} />
              <button
                type="button"
                className="plat-detail-close"
                onClick={() => {
                  setPoppedOut(true);
                  onOpenChange(false);
                }}
                aria-label={`Open ${title} in a new tab`}
                title="Open in a new tab"
              >
                <SquareArrowOutUpRight className="h-4 w-4" />
              </button>
              <DialogPrimitive.Close className="plat-detail-close" aria-label="Close" title="Close">
                <X className="h-4 w-4" />
              </DialogPrimitive.Close>
            </div>
          </header>
          <div className="plat-detail-body">{children}</div>
          </DetailDataProvider>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

// ── Layout helpers used by every detail body ─────────────────────────

/** Headline numbers for the expanded view. */
export function DetailStats({ items }: { items: { label: string; value: ReactNode; sub?: ReactNode }[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((s) => (
        <div key={s.label} className="plat-panel !px-5 !py-4">
          <p className="plat-eyebrow">{s.label}</p>
          <p
            className="mt-2 text-[26px] font-semibold leading-none tracking-[-0.03em]"
            style={{ fontFamily: 'var(--display)', fontVariantNumeric: 'tabular-nums' }}
          >
            {s.value}
          </p>
          {s.sub && (
            <p className="mt-1.5 text-[11.5px]" style={{ color: 'var(--text-4)' }}>
              {s.sub}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

/** Top half: the diagrams. */
export function DetailCharts({ children, cols = 2 }: { children: ReactNode; cols?: 1 | 2 }) {
  return (
    <div className={cn('grid grid-cols-1 gap-4', cols === 2 && 'lg:grid-cols-2')}>{children}</div>
  );
}

/** Bottom half: the tables. */
export function DetailTables({ children, cols = 1 }: { children: ReactNode; cols?: 1 | 2 }) {
  return (
    <div className={cn('grid grid-cols-1 gap-4', cols === 2 && 'xl:grid-cols-2')}>{children}</div>
  );
}

export function DetailDivider({ label, hint }: { label: string; hint?: string }) {
  return (
    <div className="flex items-baseline gap-3">
      <h3 className="plat-eyebrow">{label}</h3>
      {hint && (
        <span className="text-[11px]" style={{ color: 'var(--text-5)' }}>
          {hint}
        </span>
      )}
      <div className="h-px flex-1" style={{ background: 'var(--line-soft)' }} />
    </div>
  );
}

// ── Data table ───────────────────────────────────────────────────────

export interface Column<T> {
  key: string;
  label: string;
  /** Right-aligns and switches to tabular mono. Use it for every number. */
  num?: boolean;
  width?: string;
  render: (row: T) => ReactNode;
  /**
   * What the cell is worth in an export. Defaults to the text of `render`; set
   * it where the screen shows something lossy ("2h ago" for a timestamp).
   */
  value?: (row: T) => string | number;
}

export function DataTable<T>({
  title,
  hint,
  columns,
  rows,
  rowKey,
  empty = 'Nothing to show yet',
  maxHeight = 360,
  exportTitle,
}: {
  title?: string;
  hint?: ReactNode;
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T, i: number) => string;
  empty?: string;
  maxHeight?: number;
  /** Overrides the sheet name this table exports under. */
  exportTitle?: string;
}) {
  // Same rows, same order, to the ⋮ export menu. Memoised: flattening 200
  // audit rows on every poll is wasted work.
  const id = useId();
  const dataset = useMemo(
    () => ({
      id,
      title: exportTitle ?? title ?? 'Table',
      columns: columns.map((c) => c.label),
      rows: rows.map((row) =>
        columns.map((c) => (c.value ? c.value(row) : normalizeCell(nodeToText(c.render(row))))),
      ),
    }),
    // Callers rebuild `columns` inline each render; only its labels matter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [id, exportTitle, title, rows],
  );
  useRegisterDataset(dataset);

  return (
    <div className="plat-panel !p-0 overflow-hidden">
      {title && (
        <div className="flex flex-wrap items-baseline justify-between gap-2 px-5 pb-3 pt-4">
          <p className="text-[13px] font-semibold">{title}</p>
          {hint && (
            <span className="text-[11px]" style={{ color: 'var(--text-5)' }}>
              {hint}
            </span>
          )}
        </div>
      )}
      {!rows.length ? (
        <p className="px-5 py-8 text-center text-xs" style={{ color: 'var(--text-5)' }}>
          {empty}
        </p>
      ) : (
        <div className="overflow-auto" style={{ maxHeight }}>
          <table className="plat-table">
            <thead>
              <tr>
                {columns.map((c) => (
                  <th key={c.key} className={c.num ? 'num' : undefined} style={{ width: c.width }}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr key={rowKey(row, i)}>
                  {columns.map((c) => (
                    <td key={c.key} className={c.num ? 'num' : undefined}>
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
