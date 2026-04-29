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
          <div className="border-b border-gray-200 px-6 py-4">
            <Link to="/contacts" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:underline">
              <ArrowLeft className="h-3 w-3" /> Back to Contacts
            </Link>
            <h1 className="mt-1 flex items-center gap-2 text-2xl font-light text-gray-900">
              <Upload className="h-5 w-5 text-emerald-500" /> Import contacts
            </h1>
            <p className="text-xs text-gray-500">CSV, vCard (.vcf), or JSON.</p>
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
              <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-6 text-center">
                <Check className="mx-auto mb-2 h-7 w-7 text-emerald-600" />
                <p className="text-sm text-emerald-900">
                  Imported {importedCount} contact{importedCount === 1 ? '' : 's'}.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/contacts')}
                  className="mt-3 rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800"
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
    <div className="rounded-lg border-2 border-dashed border-gray-200 bg-white p-12 text-center">
      <Upload className="mx-auto mb-3 h-8 w-8 text-gray-400" />
      <p className="text-sm text-gray-700">Drop a file here or click to choose</p>
      <p className="mt-1 text-xs text-gray-500">Supported: .csv, .vcf, .json</p>
      <label className="mt-4 inline-flex cursor-pointer items-center gap-1 rounded-md bg-gray-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-800">
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
      <div className="rounded-md border border-blue-100 bg-blue-50 p-3 text-xs text-blue-900">
        <div className="flex items-center gap-1 font-medium">
          <Sparkles className="h-3 w-3" /> AI column mapping
        </div>
        <div className="mt-1 italic">{aiReason}</div>
      </div>
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-[11px] uppercase tracking-wider text-gray-500">CSV column</th>
              <th className="px-3 py-2 text-left text-[11px] uppercase tracking-wider text-gray-500">Maps to</th>
              <th className="px-3 py-2 text-left text-[11px] uppercase tracking-wider text-gray-500">Sample</th>
            </tr>
          </thead>
          <tbody>
            {headers.map((h) => (
              <tr key={h} className="border-t border-gray-100">
                <td className="px-3 py-2 text-gray-900">{h}</td>
                <td className="px-3 py-2">
                  <select
                    value={mapping[h]}
                    onChange={(e) => onChange({ ...mapping, [h]: e.target.value as any })}
                    className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs"
                  >
                    {FIELD_OPTIONS.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="truncate px-3 py-2 text-xs text-gray-500">
                  {rows[0]?.[h] ?? ''}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-end gap-1">
        <button type="button" onClick={onBack} className="rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50">
          Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
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
      <div className="rounded-md border border-gray-200 bg-white p-3 text-sm">
        Ready to import <span className="font-medium">{contacts.length}</span> contact
        {contacts.length === 1 ? '' : 's'}.
      </div>
      {duplicateClashes.length > 0 && (
        <div className="rounded-md border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
          <div className="flex items-center gap-1 font-medium">
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
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {contacts.slice(0, 30).map((c) => (
          <div key={c.id} className="flex items-center gap-3 border-b border-gray-100 px-3 py-2 last:border-0 text-sm">
            <span className="truncate font-medium text-gray-900">
              {displayName(c)}
            </span>
            <span className="ml-auto truncate text-xs text-gray-500">{c.emails[0]?.value ?? '—'}</span>
          </div>
        ))}
        {contacts.length > 30 && (
          <div className="border-t border-gray-100 px-3 py-2 text-center text-xs text-gray-500">
            +{contacts.length - 30} more
          </div>
        )}
      </div>
      <div className="flex items-center justify-end gap-1">
        <button type="button" onClick={onBack} className="rounded-md border border-gray-200 px-3 py-1.5 text-sm hover:bg-gray-50">
          Back
        </button>
        <button
          type="button"
          onClick={onCommit}
          className="flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-emerald-700"
        >
          <Check className="h-3.5 w-3.5" /> Confirm & import
        </button>
      </div>
    </div>
  );
}
