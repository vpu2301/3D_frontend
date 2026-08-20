/**
 * The ⋮ menu on a detail view: getting the data out.
 *
 * Every table registers itself here, so an export is exactly what is on screen
 * (same columns, same order, same filtering). CSV for BI tools, TSV for a
 * paste into Excel, JSON for a script, print for a PDF.
 *
 * Hand-rolled rather than a Radix dropdown: a detail view can be popped out
 * into its own tab, where a portalled menu renders into the parent document.
 */
import {
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Check, Copy, Download, FileJson, MoreVertical, Printer, RefreshCw } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';

// ── Registry: every table on screen, as plain values ─────────────────

export interface Dataset {
  id: string;
  title: string;
  columns: string[];
  rows: (string | number)[][];
}

interface Registry {
  register: (d: Dataset) => void;
  unregister: (id: string) => void;
  datasets: Dataset[];
}

const DetailDataContext = createContext<Registry | null>(null);

export function DetailDataProvider({ children }: { children: ReactNode }) {
  const [datasets, setDatasets] = useState<Dataset[]>([]);

  const register = useCallback((d: Dataset) => {
    // Append order is mount order, which is the order on screen.
    setDatasets((prev) => [...prev.filter((x) => x.id !== d.id), d]);
  }, []);

  const unregister = useCallback((id: string) => {
    setDatasets((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const value = useMemo(() => ({ register, unregister, datasets }), [register, unregister, datasets]);
  return <DetailDataContext.Provider value={value}>{children}</DetailDataContext.Provider>;
}

/** Called by <DataTable> to publish its plain values to the menu. */
export function useRegisterDataset(dataset: Dataset | null) {
  const ctx = useContext(DetailDataContext);
  const key = dataset ? JSON.stringify(dataset) : null;

  useEffect(() => {
    if (!ctx || !key) return;
    const d = JSON.parse(key) as Dataset;
    ctx.register(d);
    return () => ctx.unregister(d.id);
    // Keyed off the serialised content: re-registering every render would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, ctx?.register, ctx?.unregister]);
}

/**
 * "1,284" is a number to a person and a string to Power BI, and "—" is a
 * placeholder, not data. Only unambiguously numeric text is converted.
 */
export function normalizeCell(text: string): string | number {
  const t = text.trim();
  if (t === '' || t === '—' || t === '–' || t === '-') return '';
  const m = /^(-?)\$?(\d{1,3}(?:,\d{3})+|\d+)(\.\d+)?(%?)$/.exec(t);
  if (!m) return t;
  const n = Number(`${m[1]}${m[2].replace(/,/g, '')}${m[3] ?? ''}`);
  return Number.isFinite(n) ? n : t;
}

/**
 * React nodes to the text a spreadsheet should receive. Cells are usually a
 * primitive in a <span>, so walking children covers most of it; a column can
 * override with its own `value`.
 */
export function nodeToText(node: ReactNode): string {
  if (node == null || node === false || node === true) return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeToText).join('');
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return nodeToText(props.children);
  }
  return '';
}

// ── Serialisers ──────────────────────────────────────────────────────

const escapeCsv = (v: string | number) => {
  const s = String(v ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

const toCsv = (d: Dataset) =>
  [d.columns.map(escapeCsv).join(','), ...d.rows.map((r) => r.map(escapeCsv).join(','))].join('\n');

/** Several tables in one file, each under its own title line. */
const toCsvBundle = (datasets: Dataset[]) =>
  datasets.map((d) => `# ${d.title}\n${toCsv(d)}`).join('\n\n');

const toTsv = (datasets: Dataset[]) =>
  datasets
    .map((d) => [d.title, d.columns.join('\t'), ...d.rows.map((r) => r.join('\t'))].join('\n'))
    .join('\n\n');

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

function download(doc: Document, name: string, mime: string, body: string) {
  const url = URL.createObjectURL(new Blob([body], { type: `${mime};charset=utf-8` }));
  const a = doc.createElement('a');
  a.href = url;
  a.download = name;
  doc.body.appendChild(a);
  a.click();
  a.remove();
  // Give the download a tick to start before the blob goes away.
  setTimeout(() => URL.revokeObjectURL(url), 4_000);
}

// ── The menu ─────────────────────────────────────────────────────────

interface Item {
  key: string;
  label: string;
  icon: typeof Download;
  hint?: string;
  disabled?: boolean;
  onSelect: () => void;
}

export function DetailMenu({ title }: { title: string }) {
  const ctx = useContext(DetailDataContext);
  const datasets = ctx?.datasets ?? [];
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // The element's own document, so this still works in a popped-out tab.
  useEffect(() => {
    const el = rootRef.current;
    if (!open || !el) return;
    const doc = el.ownerDocument;
    const onDown = (e: Event) => {
      if (!el.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    doc.addEventListener('pointerdown', onDown, true);
    doc.addEventListener('keydown', onKey);
    return () => {
      doc.removeEventListener('pointerdown', onDown, true);
      doc.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const flash = (key: string) => {
    setDone(key);
    setTimeout(() => setDone((k) => (k === key ? null : k)), 1600);
  };

  const stamp = new Date().toISOString().slice(0, 10);
  const base = `3days-${slug(title)}-${stamp}`;
  const rowCount = datasets.reduce((n, d) => n + d.rows.length, 0);
  const empty = rowCount === 0;

  const doc = () => rootRef.current?.ownerDocument ?? document;
  const view = () => doc().defaultView ?? window;

  const copyTsv = async () => {
    const text = toTsv(datasets);
    try {
      await (view().navigator.clipboard ?? navigator.clipboard).writeText(text);
    } catch {
      // Clipboard API needs a secure context; the textarea trick does not.
      const d = doc();
      const ta = d.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      d.body.appendChild(ta);
      ta.select();
      d.execCommand('copy');
      ta.remove();
    }
    flash('copy');
  };

  const items: Item[] = [
    {
      key: 'csv',
      label: datasets.length > 1 ? `Download CSV · ${datasets.length} tables` : 'Download CSV',
      icon: Download,
      hint: empty ? 'no rows yet' : `${rowCount} rows`,
      disabled: empty,
      onSelect: () => {
        download(doc(), `${base}.csv`, 'text/csv', toCsvBundle(datasets));
        flash('csv');
      },
    },
    {
      key: 'json',
      label: 'Download JSON',
      icon: FileJson,
      hint: 'structured',
      disabled: empty,
      onSelect: () => {
        const payload = {
          view: title,
          generated_at: new Date().toISOString(),
          source: view().location.origin,
          tables: datasets.map((d) => ({
            title: d.title,
            columns: d.columns,
            rows: d.rows.map((r) => Object.fromEntries(d.columns.map((c, i) => [c, r[i]]))),
          })),
        };
        download(doc(), `${base}.json`, 'application/json', JSON.stringify(payload, null, 2));
        flash('json');
      },
    },
    {
      key: 'copy',
      label: 'Copy for Excel / Sheets',
      icon: Copy,
      hint: 'TSV',
      disabled: empty,
      onSelect: copyTsv,
    },
    {
      key: 'print',
      label: 'Print / Save as PDF',
      icon: Printer,
      onSelect: () => view().print(),
    },
    {
      key: 'refresh',
      label: 'Refresh data',
      icon: RefreshCw,
      hint: 'refetch now',
      onSelect: () => {
        queryClient.invalidateQueries({ queryKey: ['dash'] });
        flash('refresh');
      },
    },
  ];

  return (
    <div className="plat-menu" ref={rootRef}>
      <button
        type="button"
        className="plat-detail-close"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={`Data options for ${title}`}
        title="Export & data options"
        onClick={() => setOpen((v) => !v)}
      >
        <MoreVertical className="h-4 w-4" />
      </button>

      {open && (
        <div className="plat-menu-panel" role="menu">
          <p className="plat-menu-label">
            {empty ? 'Nothing to export yet' : `${rowCount} rows · ${datasets.length} table${datasets.length === 1 ? '' : 's'}`}
          </p>
          {items.map(({ key, label, icon: Icon, hint, disabled, onSelect }) => (
            <button
              key={key}
              type="button"
              role="menuitem"
              className="plat-menu-item"
              disabled={disabled}
              onClick={() => {
                onSelect();
                if (key !== 'copy') setOpen(false);
              }}
            >
              {done === key ? (
                <Check className="h-3.5 w-3.5" style={{ color: 'var(--ok-fg)' }} />
              ) : (
                <Icon className="h-3.5 w-3.5" />
              )}
              <span className="flex-1 text-left">{label}</span>
              {hint && <span className="plat-menu-hint">{hint}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
