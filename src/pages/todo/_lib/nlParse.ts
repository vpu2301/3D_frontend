import * as chrono from 'chrono-node';
import type { ParsedTask, Priority, Project, List } from './types';

const PRIORITY_RX = /(?:^|\s)(?:!|p)([1-4])\b/i;
const TAG_RX = /(?:^|\s)#([a-zA-Z][\w-]{0,31})/g;
const PROJECT_RX = /(?:^|\s)\+([a-zA-Z][\w-]{0,31})/g;
const LIST_RX = /(?:^|\s)>([a-zA-Z][\w-]{0,31})/g;
const ASSIGNEE_RX = /(?:^|\s)@([a-zA-Z][\w-]{0,31})/g;
const ESTIMATE_RX = /(?:^|\s)~(\d+(?:\.\d+)?)(m|h)\b/i;

const URGENCY_WORDS = /\b(urgent|asap|critical|today|now|important)\b/i;

interface ParseContext {
  projects?: Project[];
  lists?: List[];
}

/**
 * Synchronous, fast NL parser used by the quick-add bar.
 * Side-effect-free; returns the extracted task plus the cleaned title.
 */
export function parseQuickAdd(input: string, context: ParseContext = {}): ParsedTask {
  let working = input;
  const tags: string[] = [];
  let projectId: string | undefined;
  let listId: string | undefined;
  let assignee: string | undefined;
  let priority: Priority | undefined;
  let estimate: number | undefined;
  let dueAt: number | undefined;

  // Tags
  working = working.replace(TAG_RX, (_m, t) => {
    tags.push(t.toLowerCase());
    return '';
  });

  // Project (+name)
  working = working.replace(PROJECT_RX, (_m, name) => {
    const p = (context.projects ?? []).find(
      (x) => x.name.toLowerCase().replace(/\s+/g, '-') === name.toLowerCase(),
    );
    if (p) projectId = p.id;
    return '';
  });

  // List (>name)
  working = working.replace(LIST_RX, (_m, name) => {
    const l = (context.lists ?? []).find(
      (x) => x.name.toLowerCase().replace(/\s+/g, '-') === name.toLowerCase(),
    );
    if (l) listId = l.id;
    return '';
  });

  // Assignee
  working = working.replace(ASSIGNEE_RX, (_m, name) => {
    assignee = name.toLowerCase();
    return '';
  });

  // Priority
  const pm = working.match(PRIORITY_RX);
  if (pm) {
    priority = Number(pm[1]) as Priority;
    working = working.replace(PRIORITY_RX, ' ');
  }

  // Estimate
  const em = working.match(ESTIMATE_RX);
  if (em) {
    const n = parseFloat(em[1]);
    estimate = em[2].toLowerCase() === 'h' ? Math.round(n * 60) : Math.round(n);
    working = working.replace(ESTIMATE_RX, ' ');
  }

  // Date — use chrono-node on the remaining text so we don't get confused by
  // numbers in priority/estimate tokens.
  const refDate = new Date();
  const results = chrono.parse(working, refDate, { forwardDate: true });
  if (results.length > 0) {
    const r = results[0];
    dueAt = r.date().getTime();
    working = working.replace(r.text, ' ');
  } else if (URGENCY_WORDS.test(working) && priority === undefined) {
    // Implicit urgency → P2 unless a priority was set explicitly
    priority = 2;
  }

  // Final cleanup of the title
  const title = working.replace(/\s{2,}/g, ' ').trim();

  return { title, dueAt, priority, tags, projectId, listId, assignee, estimate };
}

/** Returns true if a string parses to ANY natural-language date. */
export function looksLikeNlDate(s: string): boolean {
  const r = chrono.parse(s, new Date(), { forwardDate: true });
  return r.length > 0;
}

/** Parse a single date string (used by detail pane date picker). */
export function parseDate(s: string): Date | null {
  const refDate = new Date();
  const r = chrono.parse(s, refDate, { forwardDate: true });
  if (r.length === 0) return null;
  return r[0].date();
}
