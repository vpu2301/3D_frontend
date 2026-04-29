import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CalendarRange } from 'lucide-react';
import ContactsLayout from '@/pages/contacts/_components/shared/ContactsLayout';
import ContactsMiniRail from '@/pages/contacts/_components/sidebar/ContactsMiniRail';
import ContactChip from '@/components/contacts/ContactChip';
import { useContactsStore, selectContactsMap } from '@/pages/contacts/_hooks/use-contacts-store';
import type { Interaction } from '@/pages/contacts/_lib/types';

export default function ContactsTimeline() {
  const load = useContactsStore((s) => s.load);
  const contactsMap = useContactsStore(selectContactsMap);
  const getInteractions = useContactsStore((s) => s.getInteractionsForContact);

  useEffect(() => {
    load();
  }, [load]);

  const events: (Interaction & { contactName: string; contactId: string })[] = useMemo(() => {
    const all: (Interaction & { contactName: string; contactId: string })[] = [];
    for (const c of Object.values(contactsMap)) {
      if (c.trashed) continue;
      const its = getInteractions(c.id);
      for (const i of its) {
        all.push({ ...i, contactId: c.id, contactName: `${c.firstName} ${c.lastName}`.trim() });
      }
    }
    return all.sort((a, b) => b.occurredAt - a.occurredAt).slice(0, 100);
  }, [contactsMap, getInteractions]);

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
              <CalendarRange className="h-5 w-5 text-blue-500" /> Recent interactions
            </h1>
            <p className="text-xs text-gray-500">{events.length} events across all contacts</p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {events.length === 0 ? (
              <div className="rounded-md border border-dashed border-gray-200 px-6 py-16 text-center text-sm text-gray-500">
                No interactions yet.
              </div>
            ) : (
              <ul className="space-y-2">
                {events.map((e) => {
                  const c = contactsMap[e.contactId];
                  if (!c) return null;
                  return (
                    <li key={e.id} className="flex items-center gap-3 rounded-md border border-gray-100 bg-white p-3">
                      <ContactChip contact={c} />
                      <div className="min-w-0 flex-1">
                        <div className="text-sm text-gray-900">{e.summary}</div>
                        <div className="text-[11px] text-gray-500">
                          {new Date(e.occurredAt).toLocaleString()} · {e.sourceModule}
                        </div>
                      </div>
                      <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-gray-500">
                        {e.type.replace('-', ' ')}
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </main>
      </div>
    </ContactsLayout>
  );
}
