import type { Contact, DuplicateGroup } from './types';
import { newId } from './storage';

/**
 * Lightweight duplicate detector. Two contacts are considered a candidate pair
 * if any of the following hold:
 *   - they share an email address (case-insensitive, normalized)
 *   - their normalized full names match (very high confidence)
 *   - their last name + first-letter-of-first-name match AND they share an org
 *
 * Returns one DuplicateGroup per cluster, with a `reason` string suitable for
 * display + a `confidence` 0–100. Deterministic.
 */
export function findDuplicateGroupsSync(contacts: Contact[]): DuplicateGroup[] {
  const active = contacts.filter((c) => !c.trashed);
  const byId = new Map(active.map((c) => [c.id, c]));

  // Build candidate edges between contact ids.
  type Edge = { a: string; b: string; reason: string; weight: number };
  const edges: Edge[] = [];

  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      const a = active[i];
      const b = active[j];

      const sharedEmail = a.emails.find((ea) =>
        b.emails.some((eb) => normalizeEmail(eb.value) === normalizeEmail(ea.value)),
      );
      if (sharedEmail) {
        edges.push({ a: a.id, b: b.id, reason: `Shared email ${sharedEmail.value}`, weight: 95 });
        continue;
      }

      const aName = fullNameKey(a);
      const bName = fullNameKey(b);
      if (aName && aName === bName) {
        edges.push({ a: a.id, b: b.id, reason: `Same name "${displayName(a)}"`, weight: 80 });
        continue;
      }

      const aShort = shortNameKey(a);
      const bShort = shortNameKey(b);
      const aOrg = (a.organization ?? '').trim().toLowerCase();
      const bOrg = (b.organization ?? '').trim().toLowerCase();
      if (aShort && aShort === bShort && aOrg && aOrg === bOrg) {
        edges.push({
          a: a.id,
          b: b.id,
          reason: `Similar name + same org "${a.organization}"`,
          weight: 65,
        });
        continue;
      }
    }
  }

  // Union-find on the edges to cluster.
  const parent = new Map<string, string>();
  active.forEach((c) => parent.set(c.id, c.id));
  const find = (x: string): string => {
    let cur = x;
    while (parent.get(cur) !== cur) cur = parent.get(cur)!;
    parent.set(x, cur);
    return cur;
  };
  const union = (x: string, y: string) => {
    const rx = find(x);
    const ry = find(y);
    if (rx !== ry) parent.set(rx, ry);
  };
  const reasonByPair = new Map<string, { reason: string; weight: number }>();
  for (const e of edges) {
    union(e.a, e.b);
    reasonByPair.set(`${e.a}|${e.b}`, { reason: e.reason, weight: e.weight });
  }

  // Group by root.
  const groups = new Map<string, string[]>();
  for (const id of parent.keys()) {
    const root = find(id);
    if (!groups.has(root)) groups.set(root, []);
    groups.get(root)!.push(id);
  }

  const out: DuplicateGroup[] = [];
  for (const ids of groups.values()) {
    if (ids.length < 2) continue;
    // Pick the strongest edge in the cluster as the headline reason.
    let bestReason = 'Likely duplicates';
    let bestWeight = 0;
    for (let i = 0; i < ids.length; i++) {
      for (let j = i + 1; j < ids.length; j++) {
        const k1 = `${ids[i]}|${ids[j]}`;
        const k2 = `${ids[j]}|${ids[i]}`;
        const r = reasonByPair.get(k1) ?? reasonByPair.get(k2);
        if (r && r.weight > bestWeight) {
          bestReason = r.reason;
          bestWeight = r.weight;
        }
      }
    }
    out.push({
      id: newId('dupe'),
      contactIds: ids.sort(),
      confidence: bestWeight,
      reason: bestReason,
      resolution: 'pending',
    });
  }
  return out;
}

function normalizeEmail(v: string): string {
  return v.trim().toLowerCase();
}

function fullNameKey(c: Contact): string {
  return `${(c.firstName ?? '').trim().toLowerCase()} ${(c.lastName ?? '').trim().toLowerCase()}`.trim();
}

function shortNameKey(c: Contact): string {
  const f = (c.firstName ?? '').trim().toLowerCase()[0] ?? '';
  const l = (c.lastName ?? '').trim().toLowerCase();
  return f && l ? `${f} ${l}` : '';
}

function displayName(c: Contact): string {
  return c.displayName?.trim() || `${c.firstName ?? ''} ${c.lastName ?? ''}`.trim() || 'Untitled contact';
}
