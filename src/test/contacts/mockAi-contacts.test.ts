import { describe, it, expect } from 'vitest';
import {
  summarizeContact,
  suggestContactEnrichment,
  suggestContactGroups,
  askAcrossContacts,
  detectContactStaleness,
  mapImportColumns,
  parseContactNlSearch,
  populateContactSmartView,
  configureMockAi,
  type MockContactSummary,
} from '@/pages/docs/_lib/mockAi';

configureMockAi({ failureRate: 0, minLatencyMs: 0, maxLatencyMs: 1 });

const day = 86_400_000;
const c = (over: Partial<MockContactSummary>): MockContactSummary => ({
  id: 'c',
  firstName: 'A',
  lastName: 'B',
  tags: [],
  isExternal: false,
  ...over,
});

describe('summarizeContact', () => {
  it('returns a sentence-like summary based on interactions', async () => {
    const text = await summarizeContact(c({ id: 'a', firstName: 'Sam', lastName: 'P', organization: '3days.ai', title: 'EM' }), [
      { id: 'i1', type: 'email', occurredAt: Date.now() - day, summary: 'Re: Q2 launch' },
      { id: 'i2', type: 'meeting', occurredAt: Date.now() - 2 * day, summary: 'Q2 sync' },
    ]);
    expect(text.toLowerCase()).toContain('sam');
  });
});

describe('suggestContactEnrichment', () => {
  it('extracts a title from a "Senior X" snippet', async () => {
    const out = await suggestContactEnrichment(c({}), [
      { module: 'mail', sourceId: 's', snippet: 'Senior Engineer at Acme' },
    ]);
    expect(out.some((s) => s.field === 'title')).toBe(true);
  });
});

describe('suggestContactGroups', () => {
  it('clusters by organization (3+ shared)', async () => {
    const out = await suggestContactGroups(
      [
        c({ id: '1', organization: 'Acme' }),
        c({ id: '2', organization: 'Acme' }),
        c({ id: '3', organization: 'Acme' }),
        c({ id: '4', organization: 'Other' }),
      ],
      [],
    );
    expect(out.some((g) => g.contactIds.length >= 3)).toBe(true);
  });
});

describe('askAcrossContacts', () => {
  it('streams an answer with citedContactIds', async () => {
    const stream = askAcrossContacts(
      'who is at Acme',
      [c({ id: 'sa', firstName: 'Sarah', organization: 'Acme' })],
      [],
    );
    let acc = '';
    const cited = new Set<string>();
    for await (const chunk of stream) {
      acc += chunk.chunk;
      chunk.citedContactIds?.forEach((id) => cited.add(id));
    }
    expect(acc.length).toBeGreaterThan(0);
    expect(cited.has('sa')).toBe(true);
  });
});

describe('detectContactStaleness', () => {
  it('returns null when last interaction is within cadence', async () => {
    const out = await detectContactStaleness(c({}), [
      { id: 'i', type: 'email', occurredAt: Date.now() - 5 * day, summary: '' },
    ], 60);
    expect(out).toBeNull();
  });
  it('flags when last interaction is older than cadence', async () => {
    const out = await detectContactStaleness(c({}), [
      { id: 'i', type: 'email', occurredAt: Date.now() - 90 * day, summary: '' },
    ], 60);
    expect(out).not.toBeNull();
    expect(out!.daysSinceLast).toBeGreaterThan(60);
  });
});

describe('mapImportColumns', () => {
  it('proposes a sensible mapping', async () => {
    const r = await mapImportColumns(['First Name', 'Email'], []);
    expect(r.mapping['First Name']).toBe('firstName');
    expect(r.mapping['Email']).toBe('email');
  });
});

describe('parseContactNlSearch', () => {
  it('extracts an org from "at <Name>"', async () => {
    const r = await parseContactNlSearch('who at Acme');
    expect(r.organization?.toLowerCase()).toContain('acme');
  });
  it('extracts a #tag', async () => {
    const r = await parseContactNlSearch('contacts tagged #investor');
    expect(r.tag).toBe('investor');
  });
});

describe('populateContactSmartView', () => {
  it('returns ids whose tokens match the definition', async () => {
    const ids = await populateContactSmartView(
      'designer',
      [c({ id: 'd', title: 'Designer', tags: ['design'] }), c({ id: 'e', title: 'Engineer' })],
      [],
    );
    expect(ids[0]).toBe('d');
  });
});
