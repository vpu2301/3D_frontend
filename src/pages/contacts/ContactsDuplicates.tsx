import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, GitMerge, RefreshCw, Sparkles, X, Check } from 'lucide-react';
import ContactsLayout from '@/pages/contacts/_components/shared/ContactsLayout';
import ContactsMiniRail from '@/pages/contacts/_components/sidebar/ContactsMiniRail';
import ContactAvatar from '@/components/contacts/ContactAvatar';
import {
  useContactsStore,
  selectContactsMap,
  displayName,
} from '@/pages/contacts/_hooks/use-contacts-store';
import type { Contact, DuplicateGroup, LabeledValue } from '@/pages/contacts/_lib/types';
import type { MergeChoices } from '@/pages/contacts/_hooks/use-contacts-store';
import { cn } from '@/lib/utils';

export default function ContactsDuplicates() {
  const load = useContactsStore((s) => s.load);
  const recompute = useContactsStore((s) => s.recomputeDuplicates);
  const merge = useContactsStore((s) => s.mergeContacts);
  const markNotDup = useContactsStore((s) => s.markNotDuplicate);
  const contactsMap = useContactsStore(selectContactsMap);
  const duplicates = useContactsStore((s) => s.duplicates);

  useEffect(() => {
    load();
  }, [load]);

  const pending = useMemo(
    () =>
      Object.values(duplicates)
        .filter((d) => d.resolution === 'pending')
        .sort((a, b) => b.confidence - a.confidence),
    [duplicates],
  );

  return (
    <ContactsLayout>
      <div className="flex flex-1 overflow-hidden">
        <ContactsMiniRail />
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <Link to="/contacts" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:underline">
                <ArrowLeft className="h-3 w-3" /> Back to Contacts
              </Link>
              <h1 className="mt-1 flex items-center gap-2 text-2xl font-light text-gray-900">
                <GitMerge className="h-5 w-5 text-violet-500" /> Duplicates
              </h1>
              <p className="text-xs text-gray-500">
                {pending.length} group{pending.length === 1 ? '' : 's'} pending review
              </p>
            </div>
            <button
              type="button"
              onClick={recompute}
              className="flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs hover:bg-gray-50"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Recompute
            </button>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {pending.length === 0 ? (
              <div className="rounded-md border border-dashed border-gray-200 px-6 py-16 text-center">
                <Sparkles className="mx-auto mb-3 h-7 w-7 text-blue-400" />
                <p className="text-sm text-gray-700">No duplicates pending review.</p>
                <p className="mt-1 text-xs text-gray-500">Click Recompute to scan again.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pending.map((group) => (
                  <DuplicateRow
                    key={group.id}
                    group={group}
                    contactsMap={contactsMap}
                    onMerge={(survivorId, mergedId, choices) =>
                      merge(survivorId, mergedId, choices)
                    }
                    onNotDup={() => markNotDup(group.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ContactsLayout>
  );
}

function DuplicateRow({
  group,
  contactsMap,
  onMerge,
  onNotDup,
}: {
  group: DuplicateGroup;
  contactsMap: Record<string, Contact>;
  onMerge: (
    survivorId: string,
    mergedId: string,
    choices: MergeChoices,
  ) => Promise<Contact>;
  onNotDup: () => void;
}) {
  const contacts = group.contactIds.map((id) => contactsMap[id]).filter(Boolean);
  if (contacts.length < 2) return null;
  const [a, b] = contacts;
  const [choices, setChoices] = useState<MergeChoices>(() => ({
    firstName: pickPreferred(a.firstName, b.firstName),
    lastName: pickPreferred(a.lastName, b.lastName),
    organization: pickPreferred(a.organization, b.organization),
    title: pickPreferred(a.title, b.title),
    pronouns: pickPreferred(a.pronouns, b.pronouns),
    photoUrl: pickPreferred(a.photoUrl, b.photoUrl),
    emails: 'union',
    phones: 'union',
    urls: 'union',
    addresses: 'union',
    tags: 'union',
    groupIds: 'union',
    notes: a.notes ? 'a' : 'b',
  }));

  const setF = (k: keyof MergeChoices, v: any) => setChoices((c) => ({ ...c, [k]: v }));

  const apply = async () => {
    await onMerge(a.id, b.id, choices);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-gray-900">
            <span className="rounded-full bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
              {group.confidence}% confidence
            </span>{' '}
            <span className="ml-2 italic text-gray-600">{group.reason}</span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onNotDup}
            className="rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-50"
          >
            Not a duplicate
          </button>
          <button
            type="button"
            onClick={apply}
            className="flex items-center gap-1 rounded-md bg-violet-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-violet-700"
          >
            <Check className="h-3 w-3" /> Merge into {displayName(a)}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <ContactCompareColumn label="A · survivor" contact={a} />
        <ContactCompareColumn label="B · merged" contact={b} />
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 border-t border-gray-100 pt-3 md:grid-cols-2">
        <FieldChoice
          label="First name"
          a={a.firstName}
          b={b.firstName}
          value={choices.firstName}
          onChange={(v) => setF('firstName', v)}
        />
        <FieldChoice
          label="Last name"
          a={a.lastName}
          b={b.lastName}
          value={choices.lastName}
          onChange={(v) => setF('lastName', v)}
        />
        <FieldChoice
          label="Organization"
          a={a.organization}
          b={b.organization}
          value={choices.organization}
          onChange={(v) => setF('organization', v)}
        />
        <FieldChoice
          label="Title"
          a={a.title}
          b={b.title}
          value={choices.title}
          onChange={(v) => setF('title', v)}
        />
        <MultiFieldChoice
          label="Emails"
          a={a.emails}
          b={b.emails}
          value={choices.emails}
          onChange={(v) => setF('emails', v)}
        />
        <MultiFieldChoice
          label="Phones"
          a={a.phones}
          b={b.phones}
          value={choices.phones}
          onChange={(v) => setF('phones', v)}
        />
      </div>
    </div>
  );
}

function pickPreferred<T>(a: T | undefined, b: T | undefined): 'a' | 'b' {
  if (!a && b) return 'b';
  return 'a';
}

function ContactCompareColumn({ label, contact }: { label: string; contact: Contact }) {
  return (
    <div className="rounded-md border border-gray-200 p-3">
      <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">{label}</div>
      <div className="flex items-start gap-2">
        <ContactAvatar contact={contact} size={36} />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-medium text-gray-900">{displayName(contact)}</div>
          <div className="truncate text-xs text-gray-500">
            {contact.title && contact.organization
              ? `${contact.title} · ${contact.organization}`
              : contact.organization ?? contact.title ?? '—'}
          </div>
          <div className="mt-1 truncate text-xs text-gray-700">
            {contact.emails[0]?.value ?? '—'}
          </div>
          {contact.phones[0] && (
            <div className="truncate text-xs text-gray-700">{contact.phones[0].value}</div>
          )}
          <div className="mt-1 text-[10px] text-gray-400">
            Last updated {new Date(contact.updatedAt).toLocaleDateString()}
          </div>
        </div>
      </div>
    </div>
  );
}

function FieldChoice({
  label,
  a,
  b,
  value,
  onChange,
}: {
  label: string;
  a: string | undefined;
  b: string | undefined;
  value: 'a' | 'b' | undefined;
  onChange: (v: 'a' | 'b') => void;
}) {
  return (
    <div className="rounded-md border border-gray-100 p-2">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">{label}</div>
      <div className="flex items-center gap-1 text-xs">
        <button
          type="button"
          onClick={() => onChange('a')}
          className={cn(
            'flex-1 truncate rounded px-2 py-1 text-left',
            value === 'a' ? 'bg-violet-100 text-violet-900' : 'bg-gray-50 hover:bg-gray-100',
          )}
        >
          A: {a ?? '—'}
        </button>
        <button
          type="button"
          onClick={() => onChange('b')}
          className={cn(
            'flex-1 truncate rounded px-2 py-1 text-left',
            value === 'b' ? 'bg-violet-100 text-violet-900' : 'bg-gray-50 hover:bg-gray-100',
          )}
        >
          B: {b ?? '—'}
        </button>
      </div>
    </div>
  );
}

function MultiFieldChoice({
  label,
  a,
  b,
  value,
  onChange,
}: {
  label: string;
  a: LabeledValue[];
  b: LabeledValue[];
  value: 'union' | 'a' | 'b' | undefined;
  onChange: (v: 'union' | 'a' | 'b') => void;
}) {
  return (
    <div className="rounded-md border border-gray-100 p-2">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">{label}</div>
      <div className="flex items-center gap-1 text-xs">
        {(['a', 'b', 'union'] as const).map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={cn(
              'flex-1 rounded px-2 py-1',
              value === opt ? 'bg-violet-100 text-violet-900' : 'bg-gray-50 hover:bg-gray-100',
            )}
          >
            {opt === 'a' ? 'A only' : opt === 'b' ? 'B only' : 'Both'}
          </button>
        ))}
      </div>
      <div className="mt-1 flex flex-wrap gap-1 text-[10px] text-gray-500">
        {[...a, ...b].map((v, i) => (
          <span key={`${v.value}-${i}`} className="rounded-full bg-gray-100 px-1.5 py-0.5">
            {v.value}
          </span>
        ))}
      </div>
    </div>
  );
}
