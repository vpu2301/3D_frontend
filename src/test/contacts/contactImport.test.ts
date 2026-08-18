import { describe, it, expect } from 'vitest';
import {
  parseCsv,
  inferColumnMapping,
  csvRowsToContacts,
  parseVCards,
  contactToVCard,
  contactsToCsv,
} from '@/pages/contacts/_lib/contactImport';

describe('parseCsv', () => {
  it('parses simple CSV with quoted fields', () => {
    const text = 'first,last,email\n"A, B",X,a@x.com\nC,D,c@d.io';
    const r = parseCsv(text);
    expect(r.headers).toEqual(['first', 'last', 'email']);
    expect(r.rows).toHaveLength(2);
    expect(r.rows[0].first).toBe('A, B');
    expect(r.rows[0].email).toBe('a@x.com');
  });

  it('handles CRLF and trailing newline', () => {
    const text = 'a,b\r\n1,2\r\n';
    const r = parseCsv(text);
    expect(r.rows).toHaveLength(1);
  });
});

describe('inferColumnMapping', () => {
  it('maps common headers', () => {
    const m = inferColumnMapping(['First Name', 'Last Name', 'Email Address', 'Phone', 'Company', 'Job Title']);
    expect(m['First Name']).toBe('firstName');
    expect(m['Email Address']).toBe('email');
    expect(m['Company']).toBe('organization');
    expect(m['Job Title']).toBe('title');
  });
  it('falls back to ignore for unknown headers', () => {
    const m = inferColumnMapping(['Mystery']);
    expect(m['Mystery']).toBe('ignore');
  });
});

describe('csvRowsToContacts', () => {
  it('builds Contact objects from rows + mapping', () => {
    const rows = [
      { first: 'Sam', last: 'P', email: 'sam@3days.ai', phone: '+1', org: '3days.ai', title: 'EM' },
    ];
    const map = {
      first: 'firstName' as const,
      last: 'lastName' as const,
      email: 'email' as const,
      phone: 'phone' as const,
      org: 'organization' as const,
      title: 'title' as const,
    };
    const out = csvRowsToContacts(rows, map, '3days.ai');
    expect(out).toHaveLength(1);
    expect(out[0].firstName).toBe('Sam');
    expect(out[0].emails[0].value).toBe('sam@3days.ai');
    expect(out[0].emails[0].primary).toBe(true);
    expect(out[0].isExternal).toBe(false);
  });

  it('skips rows with no identifying field', () => {
    const out = csvRowsToContacts([{ first: '', last: '', email: '' }], { first: 'firstName' }, '3days.ai');
    expect(out).toHaveLength(0);
  });
});

describe('vCard parse + serialize', () => {
  it('parses a vCard 3.0 block', () => {
    const text = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Sarah Reyes',
      'N:Reyes;Sarah;;;',
      'EMAIL;TYPE=work:sarah@acme.com',
      'TEL;TYPE=mobile:+1 212 555 0299',
      'ORG:Acme Corp',
      'TITLE:Head of Design',
      'END:VCARD',
    ].join('\r\n');
    const out = parseVCards(text);
    expect(out).toHaveLength(1);
    expect(out[0].firstName).toBe('Sarah');
    expect(out[0].lastName).toBe('Reyes');
    expect(out[0].emails[0].value).toBe('sarah@acme.com');
    expect(out[0].phones[0].value).toContain('212');
    expect(out[0].organization).toBe('Acme Corp');
    expect(out[0].title).toBe('Head of Design');
  });

  it('round-trips through serializer', () => {
    const text = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      'FN:Sam P',
      'N:P;Sam;;;',
      'EMAIL;TYPE=work:sam@3days.ai',
      'END:VCARD',
    ].join('\r\n');
    const c = parseVCards(text)[0];
    const out = contactToVCard(c);
    expect(out).toContain('FN:Sam P');
    expect(out).toContain('EMAIL;TYPE=work:sam@3days.ai');
  });
});

describe('contactsToCsv', () => {
  it('emits a header row + rows', () => {
    const csv = contactsToCsv([
      {
        id: 'x',
        firstName: 'Sam',
        lastName: 'P',
        emails: [{ value: 'sam@3days.ai', label: 'work', primary: true }],
        phones: [],
        urls: [],
        addresses: [],
        importantDates: [],
        customFields: [],
        tags: ['eng'],
        groupIds: [],
        starred: false,
        isExternal: false,
        linkedContactIds: [],
        source: 'manual',
        trashed: false,
        createdAt: 0,
        updatedAt: 0,
      } as any,
    ]);
    expect(csv.split('\n')[0]).toMatch(/^firstName,/);
    expect(csv).toContain('Sam');
    expect(csv).toContain('sam@3days.ai');
  });
});
