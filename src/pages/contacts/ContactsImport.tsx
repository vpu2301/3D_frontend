import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Check, AlertTriangle, Sparkles } from 'lucide-react';
import ContactsLayout from '@/pages/contacts/_components/shared/ContactsLayout';
import ContactsMiniRail from '@/pages/contacts/_components/sidebar/ContactsMiniRail';
import {
  useContactsStore,
  selectContactsMap,
  displayName,
} from '@/pages/contacts/_hooks/use-contacts-store';
import {
  parseCsv,
  inferColumnMapping,
  csvRowsToContacts,
  parseVCards,
  type ContactField,
} from '@/pages/contacts/_lib/contactImport';
import { findDuplicateGroupsSync } from '@/pages/contacts/_lib/duplicateDetect';
import type { Contact } from '@/pages/contacts/_lib/types';
import { mapImportColumns } from '@/pages/docs/_lib/mockAi';
import { cn } from '@/lib/utils';

const FIELD_OPTIONS: (ContactField | 'ignore')[] = [
  'ignore',
  'firstName',
  'lastName',
  'displayName',
  'email',
  'phone',
  'organization',
  'title',
  'url',
  'address',
  'birthday',
  'pronouns',
  'notes',
  'tags',
];

const USER_DOMAIN = '3days.ai';

export default function ContactsImport() {
  const contactsMap = useContactsStore(selectContactsMap);
  const createContact = useContactsStore((s) => s.createContact);
  const navigate = useNavigate();
  const [step, setStep] = useState<'upload' | 'map' | 'review' | 'done'>('upload');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<Record<string, ContactField | 'ignore'>>({});
  const [aiReason, setAiReason] = useState<string>('');
  const [parsedContacts, setParsedContacts] = useState<Contact[]>([]);
  const [importedCount, setImportedCount] = useState(0);

  const onFile = async (file: File) => {
    const text = await file.text();
    if (file.name.toLowerCase().endsWith('.vcf')) {
      const contacts = parseVCards(text);
      setParsedContacts(contacts);
      setStep('review');
      return;
    }
    if (file.name.toLowerCase().endsWith('.json')) {
      try {
        const data = JSON.parse(text);
        const list = Array.isArray(data) ? data : data.contacts;
        if (!Array.isArray(list)) throw new Error('JSON must be an array of contacts');
        setParsedContacts(list as Contact[]);
        setStep('review');
        return;
      } catch (e: any) {
        alert(`Invalid JSON: ${e?.message ?? 'parse error'}`);
        return;
      }
    }
    // CSV path
    const { headers: hs, rows: rs } = parseCsv(text);
    setHeaders(hs);
    setRows(rs);
    // Use AI mock for the suggested mapping (with rule-based fallback)
    try {
      const r = await mapImportColumns(hs, rs.slice(0, 5));
      const m: Record<string, ContactField | 'ignore'> = {};
      for (const h of hs) {
        const v = (r.mapping[h] ?? 'ignore') as ContactField | 'ignore';
        m[h] = v;
      }
      setMapping(m);
      setAiReason(r.reasoning);
    } catch {
      setMapping(inferColumnMapping(hs));
      setAiReason('Mock AI failed; used rule-based inference.');
    }
    setStep('map');
  };

  const onConfirmMapping = () => {
    const built = csvRowsToContacts(rows, mapping, USER_DOMAIN);
    setParsedContacts(built);
    setStep('review');
  };

  const duplicateClashes = (() => {
    if (parsedContacts.length === 0) return [];
    const all = [...Object.values(contactsMap), ...parsedContacts];
    const groups = findDuplicateGroupsSync(all);
    const newIds = new Set(parsedContacts.map((c) => c.id));
    return groups.filter((g) => g.contactIds.some((id) => newIds.has(id)));
  })();

  const onCommit = async () => {
    let count = 0;
    for (const c of parsedContacts) {
      await createContact(c);
      count++;
    }
    setImportedCount(count);
    setStep('done');
  };

  return (
    <ContactsLayout>
      <div className="flex flex-1 overflow-hidden">
        <ContactsMiniRail />
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-[var(--line-soft)] px-6 py-4">
            <p className="plat-crumb">3days.contacts / import</p>
            <Link to="/contacts" className="mt-1.5 inline-flex items-center gap-1 text-xs text-[var(--text-4)] transition-colors hover:text-[var(--ink)]">
              <ArrowLeft className="h-3 w-3" /> Back to Contacts
            </Link>
            <h1 className="mt-1 flex items-center gap-2 text-[26px] leading-tight">
              <Upload className="h-5 w-5 text-[var(--text-4)]" /> Import contacts
            </h1>
            <p className="mt-1 text-xs text-[var(--text-4)]">CSV, vCard (.vcf), or JSON.</p>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            {step === 'upload' && (
              <UploadStep onFile={onFile} />
            )}
            {step === 'map' && (
              <MapStep
                headers={headers}
                rows={rows}
                mapping={mapping}
                onChange={setMapping}
                aiReason={aiReason}
                onConfirm={onConfirmMapping}
                onBack={() => setStep('upload')}
              />
            )}
            {step === 'review' && (
              <ReviewStep
                contacts={parsedContacts}
                duplicateClashes={duplicateClashes.map((g) => ({
                  id: g.id,
                  reason: g.reason,
                  ids: g.contactIds,
                }))}
                onBack={() => setStep('upload')}
                onCommit={onCommit}
              />
            )}
            {step === 'done' && (
              <div className="rounded-[14px] border border-[var(--line-soft)] bg-[var(--ok-bg)] px-4 py-6 text-center">
                <Check className="mx-auto mb-2 h-7 w-7 text-[var(--ok-fg)]" />
                <p className="text-sm text-[var(--ok-fg)]">
                  Imported {importedCount} contact{importedCount === 1 ? '' : 's'}.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/contacts')}
                  className="plat-btn mt-4"
                >
                  Open Contacts
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </ContactsLayout>
  );
}

function UploadStep({ onFile }: { onFile: (f: File) => void }) {
  return (
    <div className="rounded-[14px] border border-dashed border-[var(--line)] bg-white p-12 text-center">
      <Upload className="mx-auto mb-3 h-8 w-8 text-[var(--text-5)]" />
      <p className="text-sm text-[var(--text-2)]">Drop a file here or click to choose</p>
      <p className="mt-1 text-xs text-[var(--text-4)]">Supported: .csv, .vcf, .json</p>
      <label className="plat-btn mt-4 cursor-pointer">
        Choose file
        <input
          type="file"
          accept=".csv,.vcf,.json"
          onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])}
          className="hidden"
        />
      </label>
    </div>
  );
}

function MapStep({
  headers,
  rows,
  mapping,
  onChange,
  aiReason,
  onConfirm,
  onBack,
}: {
  headers: string[];
  rows: Record<string, string>[];
  mapping: Record<string, ContactField | 'ignore'>;
  onChange: (next: Record<string, ContactField | 'ignore'>) => void;
  aiReason: string;
  onConfirm: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-[12px] border border-[var(--line-soft)] bg-[var(--sand)] p-3 text-xs text-[var(--text-1)]">
        <div className="flex items-center gap-1.5 font-semibold">
          <Sparkles className="h-3 w-3" /> AI column mapping
        </div>
        <div className="mt-1 italic">{aiReason}</div>
      </div>
      <div className="plat-list">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--line-soft)]">
              <th className="plat-eyebrow px-4 py-2.5 text-left">CSV column</th>
              <th className="plat-eyebrow px-4 py-2.5 text-left">Maps to</th>
              <th className="plat-eyebrow px-4 py-2.5 text-left">Sample</th>
            </tr>
          </thead>
          <tbody>
            {headers.map((h) => (
              <tr key={h} className="border-t border-[var(--line-soft)]">
                <td className="px-4 py-2 font-medium text-[var(--ink)]">{h}</td>
                <td className="px-4 py-2">
                  <select
                    value={mapping[h]}
                    onChange={(e) => onChange({ ...mapping, [h]: e.target.value as any })}
                    className="rounded-[10px] border border-[var(--line)] bg-white px-2 py-1.5 text-xs text-[var(--ink)] focus:border-[var(--ink)] focus:outline-none"
                  >
                    {FIELD_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="truncate px-4 py-2 text-xs text-[var(--text-4)]">
                  {rows[0]?.[h] ?? ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-1">
        <button type="button" onClick={onBack} className="plat-btn-ghost h-9">
          Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="plat-btn"
        >
          <Check className="h-3.5 w-3.5" /> Apply mapping
        </button>
      </div>
    </div>
  );
}

function ReviewStep({
  contacts,
  duplicateClashes,
  onBack,
  onCommit,
}: {
  contacts: Contact[];
  duplicateClashes: { id: string; reason: string; ids: string[] }[];
  onBack: () => void;
  onCommit: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="rounded-[14px] border border-[var(--line-soft)] bg-white p-3.5 text-sm text-[var(--text-1)]">
        Ready to import <span className="font-semibold text-[var(--ink)]">{contacts.length}</span> contact
        {contacts.length === 1 ? '' : 's'}.
      </div>
      {duplicateClashes.length > 0 && (
        <div className="rounded-[12px] border border-[var(--line-soft)] bg-[var(--warn-bg)] p-3 text-xs text-[var(--warn-fg)]">
          <div className="flex items-center gap-1.5 font-semibold">
            <AlertTriangle className="h-3 w-3" /> Possible duplicates with existing contacts
          </div>
          <div className="mt-1">
            {duplicateClashes.length} group{duplicateClashes.length === 1 ? '' : 's'} flagged. After import, head to{' '}
            <Link to="/contacts/duplicates" className="underline">
              Duplicates
            </Link>{' '}
            to review and merge.
          </div>
        </div>
      )}
      <div className="plat-list">
        {contacts.slice(0, 30).map((c) => (
          <div key={c.id} className="flex items-center gap-3 border-b border-[var(--line-soft)] px-4 py-2.5 last:border-0 text-sm">
            <span className="truncate font-medium text-[var(--ink)]">
              {displayName(c)}
            </span>
            <span className="ml-auto truncate text-xs text-[var(--text-4)]">{c.emails[0]?.value ?? '—'}</span>
          </div>
        ))}
        {contacts.length > 30 && (
          <div className="border-t border-[var(--line-soft)] px-4 py-2 text-center text-xs text-[var(--text-4)]">
            +{contacts.length - 30} more
          </div>
        )}
      </div>
      <div className="flex items-center justify-end gap-1">
        <button type="button" onClick={onBack} className="plat-btn-ghost h-9">
          Back
        </button>
        <button
          type="button"
          onClick={onCommit}
          className="plat-btn"
        >
          <Check className="h-3.5 w-3.5" /> Confirm & import
        </button>
      </div>
    </div>
  );
}
