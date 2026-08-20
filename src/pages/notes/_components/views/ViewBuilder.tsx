/**
 * The view builder — deliberately small.
 *
 * Stacked rows of "field + value", an AND/OR switch, and a live count. No
 * query-builder library: BE-2's DSL has eleven clause types, which is smaller
 * than any library's API surface, and a library would let a user express things
 * the closed schema rejects — an invalid query the UI happily composed is worse
 * than a UI that cannot compose it.
 *
 * The builder is for **editing**. The primary way a view comes into existence is
 * "I just searched for this, keep it" — a button on the search results. Someone
 * who opens this is refining something that already works.
 *
 * The preview is the honest part: a debounced, aborted `POST /v1/views/preview`
 * that reports how many notes the query finds *now*. A builder without one lets
 * people save a view that matches nothing and find out a week later.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Plus, X } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useNotesTags } from '@/pages/notes/_hooks/use-notes-tags';
import { useSavedViewsStore } from '@/pages/notes/_hooks/use-saved-views-store';
import { notesApi, type NoteQuery, type QueryClause, type SavedView } from '@/pages/notes/_lib/apiClient';
import { NotesApiError } from '@/pages/notes/_lib/apiClient';
import {
  CLAUSE_LABELS,
  DATE_WINDOWS,
  clauseKind,
  offendingKey,
  type ClauseKind,
} from '@/pages/notes/_lib/queryDsl';
import { cn } from '@/lib/utils';

const PREVIEW_DEBOUNCE_MS = 400;

interface Props {
  view: SavedView;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/** A row in the builder. Kept flat — nesting is what turns this into a language. */
interface Row {
  kind: ClauseKind;
  value: string;
}

const ROW_KINDS: ClauseKind[] = [
  'text',
  'tag',
  'notebook',
  'hasOutcome',
  'hasAttachment',
  'hasReminder',
  'updated',
  'created',
  'derived',
  'pinned',
  'daily',
];

/** Clauses that are simply true when present — no value to collect. */
const BOOLEAN_KINDS: ClauseKind[] = ['hasOutcome', 'hasAttachment', 'hasReminder', 'pinned', 'daily'];

function toRows(query: NoteQuery): { rows: Row[]; join: 'all' | 'any' } {
  const join: 'all' | 'any' = query.any ? 'any' : 'all';
  const nodes = query.any ?? query.all ?? [];
  const rows: Row[] = [];
  for (const node of nodes) {
    const kind = clauseKind(node) as ClauseKind;
    if (!ROW_KINDS.includes(kind)) continue; // nested groups are shown, not edited
    const raw = (node as Record<string, unknown>)[kind];
    if (kind === 'text') rows.push({ kind, value: (raw as { text: string }).text });
    else if (kind === 'updated' || kind === 'created')
      rows.push({ kind, value: (raw as { after?: string }).after ?? '-30d' });
    else if (BOOLEAN_KINDS.includes(kind)) rows.push({ kind, value: '' });
    else rows.push({ kind, value: String(raw) });
  }
  return { rows, join };
}

function toQuery(rows: Row[], join: 'all' | 'any'): NoteQuery {
  const clauses: QueryClause[] = [];
  for (const row of rows) {
    switch (row.kind) {
      case 'text':
        if (row.value.trim()) clauses.push({ text: { text: row.value.trim(), mode: 'hybrid' } });
        break;
      case 'tag':
        if (row.value) clauses.push({ tag: row.value });
        break;
      case 'notebook':
        if (row.value) clauses.push({ notebook: row.value });
        break;
      case 'derived':
        if (row.value.trim()) clauses.push({ derived: row.value.trim() });
        break;
      case 'updated':
        clauses.push({ updated: { after: row.value } });
        break;
      case 'created':
        clauses.push({ created: { after: row.value } });
        break;
      case 'hasOutcome':
        clauses.push({ hasOutcome: { kind: 'task', status: 'open' } });
        break;
      case 'hasAttachment':
        clauses.push({ hasAttachment: true });
        break;
      case 'hasReminder':
        clauses.push({ hasReminder: true });
        break;
      case 'pinned':
        clauses.push({ pinned: true });
        break;
      case 'daily':
        clauses.push({ daily: true });
        break;
    }
  }
  return join === 'any' ? { any: clauses } : { all: clauses };
}

export default function ViewBuilder({ view, open, onOpenChange }: Props) {
  const update = useSavedViewsStore((s) => s.update);
  const rename = useSavedViewsStore((s) => s.rename);
  const notebooks = useNotesStore((s) => s.notebooks);
  const { tags } = useNotesTags();

  const initial = useMemo(() => toRows(view.query), [view.query]);
  const [rows, setRows] = useState<Row[]>(initial.rows);
  const [join, setJoin] = useState<'all' | 'any'>(initial.join);
  const [name, setName] = useState(view.name);
  const [count, setCount] = useState<number | null>(null);
  const [previewing, setPreviewing] = useState(false);
  const [fieldError, setFieldError] = useState<{ key: string; message: string } | null>(null);
  const [saving, setSaving] = useState(false);

  const inFlight = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) return;
    setRows(initial.rows);
    setJoin(initial.join);
    setName(view.name);
    setFieldError(null);
  }, [open, initial, view.name]);

  const query = useMemo(() => toQuery(rows, join), [rows, join]);

  /**
   * One request in flight, ever.
   *
   * Every keystroke aborts the previous preview before starting the next, so a
   * fast typist produces one answer rather than a queue of stale ones landing
   * out of order. The 400 ms is long enough that a word is finished first.
   */
  const preview = useCallback(async (next: NoteQuery) => {
    inFlight.current?.abort();
    const controller = new AbortController();
    inFlight.current = controller;
    setPreviewing(true);
    try {
      const result = await notesApi.previewQuery(next, controller.signal);
      if (!controller.signal.aborted) {
        setCount(result.total);
        setFieldError(null);
      }
    } catch (error) {
      if (controller.signal.aborted) return;
      if (error instanceof NotesApiError && error.status === 422) {
        // The server names the offending key; put the message on that row
        // rather than showing "invalid query" over the whole form.
        setFieldError({ key: offendingKey(error.message) ?? '', message: error.message });
        setCount(null);
        return;
      }
      setCount(null);
    } finally {
      if (!controller.signal.aborted) setPreviewing(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => void preview(query), PREVIEW_DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [open, query, preview]);

  useEffect(() => () => inFlight.current?.abort(), []);

  const save = async () => {
    setSaving(true);
    try {
      if (name.trim() && name.trim() !== view.name) await rename(view.id, name.trim());
      await update(view.id, query);
      onOpenChange(false);
    } catch {
      /* the store toasted; the sheet stays open so the query is not lost */
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        /* Radix portals to <body>, outside `.platform` — `plat` re-declares the
           design tokens so the vars below resolve inside the portal. */
        className="plat flex w-full flex-col gap-0 border-[var(--line)] sm:max-w-md"
        style={{ background: 'var(--paper)' }}
      >
        <SheetHeader className="pb-3 text-left">
          <SheetTitle className="plat-display text-[19px] text-[var(--ink)]">Edit view</SheetTitle>
          <SheetDescription className="text-xs text-[var(--text-4)]">
            A standing query. It re-runs every time you open it, so notes written later appear on
            their own.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 space-y-3 overflow-y-auto">
          <label className="block">
            <span className="plat-eyebrow mb-1 block">Name</span>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-9 w-full rounded-[10px] border border-[var(--line)] bg-[var(--paper)] px-2.5 text-sm text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none"
            />
          </label>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-[var(--text-4)]">Match</span>
            {(['all', 'any'] as const).map((option) => (
              <button
                key={option}
                type="button"
                data-command-exempt="switches this builder between AND and OR; part of composing the query"
                onClick={() => setJoin(option)}
                className={cn(
                  'rounded-full px-2.5 py-0.5 text-[11px] transition-colors',
                  join === option
                    ? 'bg-[var(--ink)] font-semibold text-white'
                    : 'bg-[var(--sand-deep)] text-[var(--text-3)] hover:text-[var(--ink)]',
                )}
              >
                {option === 'all' ? 'all of these' : 'any of these'}
              </button>
            ))}
          </div>

          <ul className="space-y-1.5">
            {rows.map((row, index) => (
              <li key={index} className="flex items-center gap-1.5">
                <select
                  value={row.kind}
                  aria-label="Field"
                  onChange={(event) =>
                    setRows((current) =>
                      current.map((entry, i) =>
                        i === index ? { kind: event.target.value as ClauseKind, value: '' } : entry,
                      ),
                    )
                  }
                  className="h-8 shrink-0 rounded-[10px] border border-[var(--line)] bg-[var(--paper)] px-1.5 text-xs text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none"
                >
                  {ROW_KINDS.map((kind) => (
                    <option key={kind} value={kind}>
                      {CLAUSE_LABELS[kind]}
                    </option>
                  ))}
                </select>

                <RowValue
                  row={row}
                  tags={tags.map((tag) => tag.name)}
                  notebooks={Object.values(notebooks)}
                  onChange={(value) =>
                    setRows((current) =>
                      current.map((entry, i) => (i === index ? { ...entry, value } : entry)),
                    )
                  }
                />

                <button
                  type="button"
                  data-command-exempt="removes one row from the query being composed"
                  aria-label="Remove this condition"
                  onClick={() => setRows((current) => current.filter((_, i) => i !== index))}
                  className="shrink-0 rounded-[8px] p-1 text-[var(--text-4)] transition-colors hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--bad-fg)]"
                >
                  <X className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>

          {fieldError && (
            <p
              className="rounded-[10px] border px-2.5 py-1.5 text-[11px]"
              style={{
                borderColor: 'rgba(179,56,46,0.3)',
                background: 'rgba(179,56,46,0.06)',
                color: 'var(--bad-fg)',
              }}
            >
              {fieldError.key ? `“${fieldError.key}”: ` : ''}
              {fieldError.message}
            </p>
          )}

          <button
            type="button"
            data-command-exempt="adds a row to the query being composed"
            onClick={() => setRows((current) => [...current, { kind: 'text', value: '' }])}
            className="flex items-center gap-1 rounded-full border border-dashed border-[var(--line)] px-2.5 py-1 text-[11px] text-[var(--text-3)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
          >
            <Plus className="h-3 w-3" /> Add a condition
          </button>
        </div>

        <footer className="flex items-center gap-2 border-t border-[var(--line-soft)] pt-3">
          <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-4)]">
            {previewing ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" /> counting…
              </>
            ) : count === null ? (
              'no preview'
            ) : (
              `${count} note${count === 1 ? '' : 's'} right now`
            )}
          </span>
          <button
            type="button"
            data-command-exempt="saves the query composed in this sheet"
            disabled={saving}
            onClick={() => void save()}
            className="plat-btn !h-8 !px-4 !text-xs ml-auto"
          >
            Save
          </button>
        </footer>
      </SheetContent>
    </Sheet>
  );
}

function RowValue({
  row,
  tags,
  notebooks,
  onChange,
}: {
  row: Row;
  tags: string[];
  notebooks: Array<{ id: string; name: string }>;
  onChange: (value: string) => void;
}) {
  if (BOOLEAN_KINDS.includes(row.kind)) {
    return <span className="flex-1 text-[11px] text-[var(--text-5)]">— nothing to fill in</span>;
  }

  if (row.kind === 'tag') {
    return (
      <select
        value={row.value}
        aria-label="Tag"
        onChange={(event) => onChange(event.target.value)}
        className="h-8 min-w-0 flex-1 rounded-[10px] border border-[var(--line)] bg-[var(--paper)] px-1.5 text-xs text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none"
      >
        <option value="">choose a tag…</option>
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>
    );
  }

  if (row.kind === 'notebook') {
    return (
      <select
        value={row.value}
        aria-label="Notebook"
        onChange={(event) => onChange(event.target.value)}
        className="h-8 min-w-0 flex-1 rounded-[10px] border border-[var(--line)] bg-[var(--paper)] px-1.5 text-xs text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none"
      >
        <option value="">choose a notebook…</option>
        {notebooks.map((notebook) => (
          <option key={notebook.id} value={notebook.id}>
            {notebook.name}
          </option>
        ))}
      </select>
    );
  }

  if (row.kind === 'updated' || row.kind === 'created') {
    return (
      <select
        value={row.value || '-30d'}
        aria-label="Time window"
        onChange={(event) => onChange(event.target.value)}
        className="h-8 min-w-0 flex-1 rounded-[10px] border border-[var(--line)] bg-[var(--paper)] px-1.5 text-xs text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none"
      >
        {DATE_WINDOWS.map((window) => (
          <option key={window.value} value={window.value}>
            {window.label}
          </option>
        ))}
      </select>
    );
  }

  return (
    <input
      value={row.value}
      aria-label="Value"
      onChange={(event) => onChange(event.target.value)}
      placeholder={row.kind === 'derived' ? 'a word from a document…' : 'what it should contain…'}
      className="h-8 min-w-0 flex-1 rounded-[10px] border border-[var(--line)] bg-[var(--paper)] px-2 text-xs text-[var(--ink)] placeholder:text-[var(--text-5)] focus:border-[var(--ink)] focus:outline-none"
    />
  );
}
