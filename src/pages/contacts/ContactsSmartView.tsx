import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Sparkles } from 'lucide-react';
import ContactsLayout from '@/pages/contacts/_components/shared/ContactsLayout';
import ContactsMiniRail from '@/pages/contacts/_components/sidebar/ContactsMiniRail';
import ContactAvatar from '@/components/contacts/ContactAvatar';
import {
  useContactsStore,
  selectContactsMap,
  selectSmartViewsMap,
  displayName,
} from '@/pages/contacts/_hooks/use-contacts-store';
import { populateContactSmartView } from '@/pages/docs/_lib/mockAi';
import type { Contact } from '@/pages/contacts/_lib/types';

export default function ContactsSmartView() {
  const load = useContactsStore((s) => s.load);
  const contactsMap = useContactsStore(selectContactsMap);
  const smartViews = useContactsStore(selectSmartViewsMap);
  const setSmartViewContacts = useContactsStore((s) => s.setSmartViewContacts);
  const upsertSmartView = useContactsStore((s) => s.upsertSmartView);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    load();
  }, [load]);

  const view = id ? smartViews[id] : undefined;

  const contacts = useMemo(() => {
    if (!view) return [];
    if (!view.precomputed && view.id !== 'sv_external' && view.id !== 'sv_new' && view.id !== 'sv_vip') {
      // Already populated externally (custom or precomputed view)
      return view.contactIds.map((cid) => contactsMap[cid]).filter(Boolean) as Contact[];
    }
    // Compute the synchronous predicates here so the system views always reflect live data.
    let arr = Object.values(contactsMap).filter((c) => !c.trashed);
    switch (view.id) {
      case 'sv_external':
        arr = arr.filter((c) => c.isExternal);
        break;
      case 'sv_new':
        arr = arr.filter((c) => Date.now() - c.createdAt < 30 * 86_400_000);
        break;
      case 'sv_vip':
        arr = arr
          .filter((c) => (c.relationshipStrength?.score ?? 0) >= 70)
          .sort((a, b) => (b.relationshipStrength?.score ?? 0) - (a.relationshipStrength?.score ?? 0));
        break;
      case 'sv_top':
        arr = arr.sort((a, b) => (b.relationshipStrength?.score ?? 0) - (a.relationshipStrength?.score ?? 0)).slice(0, 12);
        break;
      case 'sv_collab':
        arr = arr.filter((c) => c.tags.some((t) => /design|engineering|product|q2/.test(t)));
        break;
      case 'sv_stale':
        arr = arr.filter((c) => Date.now() - c.updatedAt > 60 * 86_400_000);
        break;
    }
    return arr;
  }, [view, contactsMap]);

  if (!view) {
    return (
      <ContactsLayout>
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
          Smart view not found.
        </div>
      </ContactsLayout>
    );
  }

  const onRecompute = async () => {
    if (view.precomputed) {
      const ids = await populateContactSmartView(
        view.definition,
        Object.values(contactsMap)
          .filter((c) => !c.trashed)
          .map((c) => ({
            id: c.id,
            firstName: c.firstName,
            lastName: c.lastName,
            displayName: c.displayName,
            organization: c.organization,
            title: c.title,
            tags: c.tags,
            isExternal: c.isExternal,
          })),
        [],
      );
      await setSmartViewContacts(view.id, ids);
    }
  };

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
                <Sparkles className="h-5 w-5 text-blue-500" />
                {view.emoji ? `${view.emoji} ` : ''}
                {view.name}
              </h1>
              <p className="text-xs italic text-gray-500">"{view.definition}"</p>
            </div>
            {view.precomputed && (
              <button
                type="button"
                onClick={onRecompute}
                className="flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs hover:bg-gray-50"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Recompute
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {contacts.length === 0 ? (
              <div className="rounded-md border border-dashed border-gray-200 px-6 py-16 text-center text-sm text-gray-500">
                No matches.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {contacts.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => navigate(`/contacts/contact/${c.id}`)}
                    className="flex flex-col items-center rounded-lg border border-gray-200 bg-white p-4 text-center transition-all hover:-translate-y-0.5 hover:border-rose-300 hover:shadow-md"
                  >
                    <ContactAvatar contact={c} size={56} />
                    <div className="mt-2 truncate text-sm font-medium text-gray-900">{displayName(c)}</div>
                    <div className="truncate text-xs text-gray-500">
                      {c.title ?? c.organization ?? '—'}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </ContactsLayout>
  );
}
