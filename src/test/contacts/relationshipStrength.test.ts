import { describe, it, expect } from 'vitest';
import { computeRelationshipStrengthSync } from '@/pages/contacts/_lib/relationshipStrength';
import type { Contact, Interaction } from '@/pages/contacts/_lib/types';

const day = 86_400_000;
const REFERENCE = new Date('2026-04-29T12:00:00Z').getTime();

const blank = (): Contact => ({
  id: 'c',
  firstName: 'C',
  lastName: 'X',
  emails: [],
  phones: [],
  urls: [],
  addresses: [],
  importantDates: [],
  customFields: [],
  tags: [],
  groupIds: [],
  starred: false,
  isExternal: false,
  linkedContactIds: [],
  source: 'manual',
  trashed: false,
  createdAt: REFERENCE - 90 * day,
  updatedAt: REFERENCE,
});

function int(over: Partial<Interaction>): Interaction {
  return {
    id: 'i',
    contactId: 'c',
    type: 'email',
    direction: 'incoming',
    occurredAt: REFERENCE - day,
    summary: '',
    sourceModule: 'mail',
    sourceId: '',
    ...over,
  };
}

describe('computeRelationshipStrengthSync', () => {
  it('returns score 0 / quiet for an empty interaction list', () => {
    const r = computeRelationshipStrengthSync(blank(), [], REFERENCE);
    expect(r.score).toBe(0);
    expect(r.label).toBe('quiet');
  });

  it('is deterministic for the same input', () => {
    const interactions = [
      int({ id: 'a', occurredAt: REFERENCE - 1 * day, type: 'email', direction: 'incoming', replied: true }),
      int({ id: 'b', occurredAt: REFERENCE - 3 * day, type: 'meeting', direction: 'neutral' }),
      int({ id: 'c', occurredAt: REFERENCE - 7 * day, type: 'email', direction: 'outgoing' }),
    ];
    const r1 = computeRelationshipStrengthSync(blank(), interactions, REFERENCE);
    const r2 = computeRelationshipStrengthSync(blank(), interactions, REFERENCE);
    expect(r1.score).toBe(r2.score);
    expect(r1.label).toBe(r2.label);
    expect(r1.factors.map((f) => f.value)).toEqual(r2.factors.map((f) => f.value));
  });

  it('rewards recency', () => {
    const recent = computeRelationshipStrengthSync(
      blank(),
      [int({ occurredAt: REFERENCE - 1 * day, replied: true })],
      REFERENCE,
    );
    const old = computeRelationshipStrengthSync(
      blank(),
      [int({ occurredAt: REFERENCE - 80 * day, replied: true })],
      REFERENCE,
    );
    expect(recent.score).toBeGreaterThan(old.score);
  });

  it('saturates frequency', () => {
    const many = Array.from({ length: 200 }, (_, i) =>
      int({ id: `m${i}`, occurredAt: REFERENCE - (i % 60) * day, type: 'email', direction: 'incoming', replied: i % 3 === 0 }),
    );
    const r = computeRelationshipStrengthSync(blank(), many, REFERENCE);
    expect(r.score).toBeLessThanOrEqual(100);
    expect(r.score).toBeGreaterThan(0);
  });

  it('labels strong / active / cooling / quiet by score', () => {
    const make = (count: number, daysAgo: number) =>
      Array.from({ length: count }, (_, i) =>
        int({
          id: `m${i}`,
          occurredAt: REFERENCE - daysAgo * day,
          type: i % 2 === 0 ? 'meeting' : 'email',
          direction: 'incoming',
          replied: true,
        }),
      );
    expect(computeRelationshipStrengthSync(blank(), make(20, 1), REFERENCE).label).toMatch(/strong|active/);
    expect(computeRelationshipStrengthSync(blank(), make(2, 80), REFERENCE).label).toMatch(/quiet|cooling/);
  });
});
