/**
 * Building BE-2 queries, and reading them back.
 *
 * The DSL is a closed contract — an unknown key is a 422 naming the key — so
 * everything that constructs one goes through here rather than assembling object
 * literals at call sites. That is the same rule the backend applies to itself
 * (one filter builder, a second is a review rejection); this is its half.
 *
 * The functions are deliberately dumb: no normalisation, no clever merging, no
 * inference. A query is a list of clauses the user chose, in the order they
 * chose them, and the server is the thing that decides whether it is valid.
 */

import type { NoteQuery, QueryClause, QueryNode, TextMode } from '@/pages/notes/_lib/apiClient';

/** The clause kinds the view builder and the search filters expose. */
export type ClauseKind =
  | 'text'
  | 'tag'
  | 'notebook'
  | 'hasOutcome'
  | 'hasAttachment'
  | 'hasReminder'
  | 'state'
  | 'updated'
  | 'created'
  | 'derived'
  | 'pinned'
  | 'daily';

export const CLAUSE_LABELS: Record<ClauseKind, string> = {
  text: 'Text contains',
  tag: 'Tagged',
  notebook: 'In notebook',
  hasOutcome: 'Has an open obligation',
  hasAttachment: 'Has an attachment',
  hasReminder: 'Has a reminder',
  state: 'State is',
  updated: 'Updated',
  created: 'Created',
  derived: 'Document text contains',
  pinned: 'Pinned',
  daily: 'Is a daily note',
};

/**
 * Relative windows, in the server's own `-90d` notation.
 *
 * Offered as a fixed list rather than a date picker because "in the last month"
 * is what people mean, and a saved view built on an absolute date stops being
 * true the week after it is saved.
 */
export const DATE_WINDOWS: Array<{ value: string; label: string }> = [
  { value: '-7d', label: 'in the last 7 days' },
  { value: '-30d', label: 'in the last 30 days' },
  { value: '-90d', label: 'in the last 90 days' },
  { value: '-365d', label: 'in the last year' },
];

export function textClause(text: string, mode: TextMode = 'hybrid'): QueryClause {
  return { text: { text, mode } };
}

export function tagClause(tag: string): QueryClause {
  return { tag };
}

export function notebookClause(notebookId: string): QueryClause {
  return { notebook: notebookId };
}

export function openObligationClause(): QueryClause {
  return { hasOutcome: { kind: 'task', status: 'open' } };
}

export function attachmentClause(): QueryClause {
  return { hasAttachment: true };
}

export function updatedWithinClause(window: string): QueryClause {
  return { updated: { after: window } };
}

/** An AND of clauses — the shape both the search page and the builder produce. */
export function andQuery(clauses: QueryNode[], extra: Partial<NoteQuery> = {}): NoteQuery {
  return { all: clauses, ...extra };
}

/** Which single key a clause carries. Clauses have exactly one by contract. */
export function clauseKind(clause: QueryNode): string {
  return Object.keys(clause)[0] ?? '';
}

/**
 * A one-line description of a query, for a saved view's subtitle and for the
 * "you searched for this" line above results. Not a serialiser — it is prose,
 * and a query it cannot describe falls back to naming its clauses.
 */
export function describeQuery(query: NoteQuery): string {
  const nodes = query.all ?? query.any ?? [];
  const joiner = query.any ? ' or ' : ' and ';
  const parts = nodes.map(describeNode).filter(Boolean);
  if (parts.length === 0) return 'Everything';
  return parts.join(joiner);
}

function describeNode(node: QueryNode): string {
  if ('all' in node) return `(${(node.all as QueryNode[]).map(describeNode).join(' and ')})`;
  if ('any' in node) return `(${(node.any as QueryNode[]).map(describeNode).join(' or ')})`;
  if ('not' in node) return `not ${describeNode(node.not as QueryNode)}`;

  const clause = node as Record<string, unknown>;
  if ('text' in clause) {
    const value = clause.text as { text: string; mode?: TextMode };
    return `“${value.text}”`;
  }
  if ('tag' in clause) return `#${clause.tag as string}`;
  if ('notebook' in clause) return 'in a notebook';
  if ('hasOutcome' in clause) return 'with an open obligation';
  if ('hasAttachment' in clause) return 'with an attachment';
  if ('hasReminder' in clause) return 'with a reminder';
  if ('state' in clause) return `state ${clause.state as string}`;
  if ('updated' in clause) {
    const value = clause.updated as { after?: string };
    const window = DATE_WINDOWS.find((entry) => entry.value === value.after);
    return `updated ${window?.label ?? (value.after ?? '')}`;
  }
  if ('created' in clause) {
    const value = clause.created as { after?: string };
    const window = DATE_WINDOWS.find((entry) => entry.value === value.after);
    return `created ${window?.label ?? (value.after ?? '')}`;
  }
  if ('derived' in clause) return `document text “${clause.derived as string}”`;
  if ('pinned' in clause) return 'pinned';
  if ('daily' in clause) return 'daily notes';
  return clauseKind(node);
}

/**
 * The server's 422 names the offending key. Turning that into an inline error
 * on the right row is the difference between "invalid query" and "this line".
 */
export function offendingKey(message: string): string | null {
  const match = /(?:unknown|invalid|unexpected)[^'"`]*['"`]([a-zA-Z.]+)['"`]/i.exec(message);
  return match?.[1] ?? null;
}
