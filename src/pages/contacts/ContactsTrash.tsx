import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, RotateCcw, Trash2 } from 'lucide-react';
import ContactsLayout from '@/pages/contacts/_components/shared/ContactsLayout';
import ContactsMiniRail from '@/pages/contacts/_components/sidebar/ContactsMiniRail';
import ContactAvatar from '@/components/contacts/ContactAvatar';
import {
  useContactsStore,
  selectContactsMap,
  displayName,
} from '@/pages/contacts/_hooks/use-contacts-store';

export default function ContactsTrash() {
  const load = useContactsStore((s) => s.load);
  const contactsMap = useContactsStore(selectContactsMap);
  const restore = useContactsStore((s) => s.restoreContact);
  const remove = useContactsStore((s) => s.permanentlyDelete);

  useEffect(() => {
    load();
  }, [load]);

  const trashed = useMemo(
    () =>
      Object.values(contactsMap)
        .filter((c) => c.trashed)
        .sort((a, b) => b.updatedAt - a.updatedAt),
    [contactsMap],
  );

  return (
    <ContactsLayout>
      <div className="flex flex-1 overflow-hidden">
        <ContactsMiniRail />
        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="border-b border-gray-200 px-6 py-4">
            <Link to="/contacts" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:underline">
              <ArrowLeft className="h-3 w-3" /> Back to Contacts
            </Link>
            <h1 className="mt-1 text-2xl font-light text-gray-900">Trash</h1>
            <p className="text-xs text-gray-500">Soft-deleted contacts.</p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {trashed.length === 0 ? (
              <div className="rounded-md border border-gray-200 bg-white py-16 text-center">
                <Trash2 className="mx-auto mb-3 h-7 w-7 text-gray-300" />
                <p className="text-sm text-gray-500">Trash is empty.</p>
              </div>
            ) : (
              <ul className="overflow-hidden rounded-md border border-gray-200 bg-white">
                {trashed.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center gap-3 border-b border-gray-100 px-4 py-3 last:border-0"
                  >
                    <ContactAvatar contact={c} size={32} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm text-gray-900">{displayName(c)}</div>
                      <div className="text-[11px] text-gray-500">
                        Trashed {new Date(c.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => restore(c.id)}
                      className="flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-700 hover:bg-gray-50"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Restore
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Permanently delete ${displayName(c)}?`)) remove(c.id);
                      }}
                      className="flex items-center gap-1 rounded-md px-2.5 py-1 text-xs text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete forever
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </main>
      </div>
    </ContactsLayout>
  );
}
