import type { Contact, LabeledValue } from './types';
import { newId } from './storage';

/** Minimal CSV parser — handles quoted strings, commas inside quotes, and CRLF. */
export function parseCsv(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = splitCsvLines(text);
  if (lines.length === 0) return { headers: [], rows: [] };
  const headers = splitCsvRow(lines[0]).map((h) => h.trim());
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const cells = splitCsvRow(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((h, j) => {
      row[h] = (cells[j] ?? '').trim();
    });
    rows.push(row);
  }
  return { headers, rows };
}

function splitCsvLines(text: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '"') {
      inQuote = !inQuote;
      cur += ch;
      continue;
    }
    if ((ch === '\n' || ch === '\r') && !inQuote) {
      if (ch === '\r' && text[i + 1] === '\n') i++;
      out.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  if (cur) out.push(cur);
  return out;
}

function splitCsvRow(line: string): string[] {
  const out: string[] = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuote && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuote = !inQuote;
      }
      continue;
    }
    if (ch === ',' && !inQuote) {
      out.push(cur);
      cur = '';
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

/** Detect the most likely Contact field for a CSV header. */
export function inferColumnMapping(headers: string[]): Record<string, ContactField | 'ignore'> {
  const out: Record<string, ContactField | 'ignore'> = {};
  for (const h of headers) {
    const k = h.toLowerCase().replace(/[\s_-]/g, '');
    if (/^(firstname|givenname|first)$/.test(k)) out[h] = 'firstName';
    else if (/^(lastname|familyname|surname|last)$/.test(k)) out[h] = 'lastName';
    else if (/(displayname|fullname|name)$/.test(k)) out[h] = 'displayName';
    else if (/^(email|emailaddress|mail)$/.test(k)) out[h] = 'email';
    else if (/^(phone|telephone|mobile|cell)$/.test(k)) out[h] = 'phone';
    else if (/^(organization|organisation|company|employer|org)$/.test(k))
      out[h] = 'organization';
    else if (/^(title|jobtitle|role|position)$/.test(k)) out[h] = 'title';
    else if (/^(url|website|link)$/.test(k)) out[h] = 'url';
    else if (/^(address|location)$/.test(k)) out[h] = 'address';
    else if (/^(birthday|dob)$/.test(k)) out[h] = 'birthday';
    else if (/^(pronouns)$/.test(k)) out[h] = 'pronouns';
    else if (/^(notes?)$/.test(k)) out[h] = 'notes';
    else if (/^(tags?)$/.test(k)) out[h] = 'tags';
    else out[h] = 'ignore';
  }
  return out;
}

export type ContactField =
  | 'firstName'
  | 'lastName'
  | 'displayName'
  | 'email'
  | 'phone'
  | 'organization'
  | 'title'
  | 'url'
  | 'address'
  | 'birthday'
  | 'pronouns'
  | 'notes'
  | 'tags';

/** Build Contact objects from CSV rows + a column mapping. */
export function csvRowsToContacts(
  rows: Record<string, string>[],
  mapping: Record<string, ContactField | 'ignore'>,
  userDomain: string,
): Contact[] {
  const out: Contact[] = [];
  for (const row of rows) {
    const c = blankContact();
    for (const [header, field] of Object.entries(mapping)) {
      if (field === 'ignore') continue;
      const value = (row[header] ?? '').trim();
      if (!value) continue;
      applyField(c, field, value);
    }
    if (!c.firstName && !c.lastName && !c.displayName && c.emails.length === 0) continue;
    finalizeContact(c, userDomain);
    out.push(c);
  }
  return out;
}

function applyField(c: Contact, field: ContactField, value: string) {
  switch (field) {
    case 'firstName':
      c.firstName = value;
      break;
    case 'lastName':
      c.lastName = value;
      break;
    case 'displayName':
      c.displayName = value;
      break;
    case 'email':
      c.emails.push({ value, label: 'work', primary: c.emails.length === 0 });
      break;
    case 'phone':
      c.phones.push({ value, label: 'mobile', primary: c.phones.length === 0 });
      break;
    case 'organization':
      c.organization = value;
      break;
    case 'title':
      c.title = value;
      break;
    case 'url':
      c.urls.push({ value, label: 'website' });
      break;
    case 'address':
      c.addresses.push({ value, label: 'home' });
      break;
    case 'birthday': {
      const d = Date.parse(value);
      if (!Number.isNaN(d)) c.importantDates.push({ value: d, label: 'Birthday' });
      break;
    }
    case 'pronouns':
      c.pronouns = value;
      break;
    case 'notes':
      c.notes = {
        type: 'doc',
        content: [{ type: 'paragraph', content: [{ type: 'text', text: value }] }],
      };
      break;
    case 'tags':
      c.tags = value.split(/[,;]\s*/).map((t) => t.toLowerCase()).filter(Boolean);
      break;
  }
}

function blankContact(): Contact {
  return {
    id: newId('contact'),
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
    source: 'import',
    trashed: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function finalizeContact(c: Contact, userDomain: string) {
  // Mark external if primary email's domain differs from user's domain.
  const primary = c.emails.find((e) => e.primary) ?? c.emails[0];
  if (primary?.value) {
    const domain = primary.value.split('@')[1]?.toLowerCase() ?? '';
    c.isExternal = !!domain && domain !== userDomain.toLowerCase();
  }
}

/** Minimal vCard parser — supports v3/v4 base props (FN/N/EMAIL/TEL/ORG/TITLE/URL/ADR/BDAY/NOTE). */
export function parseVCards(text: string): Contact[] {
  const out: Contact[] = [];
  const blocks = text.split(/BEGIN:VCARD/i).slice(1);
  for (const raw of blocks) {
    const body = raw.split(/END:VCARD/i)[0];
    const lines = unfoldVCardLines(body);
    const c = blankContact();
    for (const line of lines) {
      const colon = line.indexOf(':');
      if (colon < 0) continue;
      const prop = line.slice(0, colon).trim();
      const value = line.slice(colon + 1);
      const propName = prop.split(';')[0].toUpperCase();
      const params = prop.split(';').slice(1);
      const labelOf = (def: string) => {
        const t = params.find((p) => p.toUpperCase().startsWith('TYPE='));
        if (!t) return def;
        return t.split('=')[1].toLowerCase();
      };
      switch (propName) {
        case 'FN':
          c.displayName = value.trim();
          break;
        case 'N': {
          const parts = value.split(';');
          c.lastName = (parts[0] ?? '').trim();
          c.firstName = (parts[1] ?? '').trim();
          break;
        }
        case 'EMAIL':
          c.emails.push({ value: value.trim(), label: labelOf('work'), primary: c.emails.length === 0 });
          break;
        case 'TEL':
          c.phones.push({ value: value.trim(), label: labelOf('mobile'), primary: c.phones.length === 0 });
          break;
        case 'ORG':
          c.organization = value.split(';')[0].trim();
          break;
        case 'TITLE':
          c.title = value.trim();
          break;
        case 'URL':
          c.urls.push({ value: value.trim(), label: labelOf('website') });
          break;
        case 'ADR':
          c.addresses.push({ value: value.replace(/;/g, ', ').replace(/, ,/g, ',').trim(), label: labelOf('home') });
          break;
        case 'BDAY': {
          const d = Date.parse(value);
          if (!Number.isNaN(d)) c.importantDates.push({ value: d, label: 'Birthday' });
          break;
        }
        case 'NOTE':
          c.notes = {
            type: 'doc',
            content: [{ type: 'paragraph', content: [{ type: 'text', text: value }] }],
          };
          break;
      }
    }
    if (c.firstName || c.lastName || c.displayName || c.emails.length) {
      finalizeContact(c, 'placeholder.local');
      out.push(c);
    }
  }
  return out;
}

function unfoldVCardLines(text: string): string[] {
  const raw = text.split(/\r?\n/);
  const out: string[] = [];
  for (const line of raw) {
    if (/^[ \t]/.test(line) && out.length) {
      out[out.length - 1] += line.slice(1);
    } else if (line.trim()) {
      out.push(line);
    }
  }
  return out;
}

/** Serialize a single contact into a vCard 3.0 string. */
export function contactToVCard(c: Contact): string {
  const lines: string[] = ['BEGIN:VCARD', 'VERSION:3.0'];
  const dn = c.displayName?.trim() || `${c.firstName} ${c.lastName}`.trim();
  if (dn) lines.push(`FN:${dn}`);
  if (c.firstName || c.lastName) lines.push(`N:${c.lastName};${c.firstName};;;`);
  if (c.organization) lines.push(`ORG:${c.organization}`);
  if (c.title) lines.push(`TITLE:${c.title}`);
  for (const e of c.emails) lines.push(`EMAIL;TYPE=${e.label}:${e.value}`);
  for (const p of c.phones) lines.push(`TEL;TYPE=${p.label}:${p.value}`);
  for (const u of c.urls) lines.push(`URL;TYPE=${u.label}:${u.value}`);
  for (const a of c.addresses) lines.push(`ADR;TYPE=${a.label}:;;${a.value};;;;`);
  for (const d of c.importantDates)
    lines.push(`BDAY:${new Date(d.value).toISOString().slice(0, 10)}`);
  lines.push('END:VCARD');
  return lines.join('\r\n');
}

export function contactsToCsv(contacts: Contact[]): string {
  const headers = [
    'firstName',
    'lastName',
    'displayName',
    'email',
    'phone',
    'organization',
    'title',
    'pronouns',
    'tags',
    'birthday',
  ];
  const escape = (v: string) => {
    if (v == null) return '';
    if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
    return v;
  };
  const lines = [headers.join(',')];
  for (const c of contacts) {
    const row = [
      c.firstName,
      c.lastName,
      c.displayName ?? '',
      c.emails[0]?.value ?? '',
      c.phones[0]?.value ?? '',
      c.organization ?? '',
      c.title ?? '',
      c.pronouns ?? '',
      c.tags.join(';'),
      c.importantDates.find((d) => d.label.toLowerCase() === 'birthday')
        ? new Date(
            c.importantDates.find((d) => d.label.toLowerCase() === 'birthday')!.value,
          )
            .toISOString()
            .slice(0, 10)
        : '',
    ];
    lines.push(row.map((v) => escape(String(v))).join(','));
  }
  return lines.join('\n');
}
