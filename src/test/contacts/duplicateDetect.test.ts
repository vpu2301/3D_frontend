import { describe, it, expect } from 'vitest';
import { findDuplicateGroupsSync } from '@/pages/contacts/_lib/duplicateDetect';
import type { Contact } from '@/pages/contacts/_lib/types';

const blank = (over: Partial<Contact>): Contact => ({
  id: over.id ?? 'c',
  firstName: '',
  lastName: '',
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
  createdAt: 0,
  updatedAt: 0,
  ...over,
});

describe('findDuplicateGroupsSync', () => {
  it('groups contacts that share an email', () => {
    const a = blank({ id: 'a', firstName: 'Chris', lastName: 'Wells', emails: [{ value: 'chris@example.com', label: 'work', primary: true }] });
    const b = blank({ id: 'b', firstName: 'Christopher', lastName: 'Wells', emails: [{ value: 'chris@example.com', label: 'work', primary: true }] });
    const groups = findDuplicateGroupsSync([a, b]);
    expect(groups).toHaveLength(1);
    expect(groups[0].confidence).toBeGreaterThanOrEqual(90);
    expect(new Set(groups[0].contactIds)).toEqual(new Set(['a', 'b']));
  });

  it('groups by exact name match', () => {
    const a = blank({ id: 'a', firstName: 'Maria', lastName: 'Hernandez', emails: [{ value: 'a@x.com', label: 'work', primary: true }] });
    const b = blank({ id: 'b', firstName: 'Maria', lastName: 'Hernandez', emails: [{ value: 'b@x.com', label: 'work', primary: true }] });
    const groups = findDuplicateGroupsSync([a, b]);
    expect(groups).toHaveLength(1);
    expect(groups[0].reason.toLowerCase()).toContain('name');
  });

  it('groups by short-name + same org', () => {
    const a = blank({ id: 'a', firstName: 'Sofia', lastName: 'Russo', organization: 'Stripe', emails: [{ value: 'sofia@stripe.com', label: 'work', primary: true }] });
    const b = blank({ id: 'b', firstName: 'S', lastName: 'Russo', organization: 'Stripe', emails: [{ value: 's.russo@stripe.com', label: 'work', primary: true }] });
    const groups = findDuplicateGroupsSync([a, b]);
    expect(groups).toHaveLength(1);
    expect(groups[0].reason.toLowerCase()).toContain('org');
  });

  it('skips trashed contacts', () => {
    const a = blank({ id: 'a', firstName: 'X', lastName: 'Y', trashed: true, emails: [{ value: 'shared@x.com', label: 'work', primary: true }] });
    const b = blank({ id: 'b', firstName: 'X', lastName: 'Y', emails: [{ value: 'shared@x.com', label: 'work', primary: true }] });
    expect(findDuplicateGroupsSync([a, b])).toHaveLength(0);
  });

  it('returns no groups when nothing matches', () => {
    const a = blank({ id: 'a', firstName: 'Alice', lastName: 'A' });
    const b = blank({ id: 'b', firstName: 'Bob', lastName: 'B' });
    expect(findDuplicateGroupsSync([a, b])).toHaveLength(0);
  });
});
