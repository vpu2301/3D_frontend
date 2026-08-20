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
          <div className="border-b border-[var(--line-soft)] px-6 py-4">
            <p className="plat-crumb">3days.contacts / trash</p>
            <Link to="/contacts" className="mt-1.5 inline-flex items-center gap-1 text-xs text-[var(--text-4)] transition-colors hover:text-[var(--ink)]">
              <ArrowLeft className="h-3 w-3" /> Back to Contacts
            </Link>
            <h1 className="mt-1 text-[26px] leading-tight">Trash</h1>
            <p className="mt-1 text-xs text-[var(--text-4)]">Soft-deleted contacts.</p>
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-5">
            {trashed.length === 0 ? (
              <div className="plat-panel py-16 text-center">
                <Trash2 className="mx-auto mb-3 h-7 w-7 text-[var(--text-5)]" />
                <p className="text-sm text-[var(--text-4)]">Trash is empty.</p>
              </div>
            ) : (
              <ul className="plat-list">
                {trashed.map((c) => (
                  <li
                    key={c.id}
                    className="flex items-center gap-3 border-b border-[var(--line-soft)] px-4 py-3 last:border-0"
                  >
                    <ContactAvatar contact={c} size={32} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-[var(--ink)]">{displayName(c)}</div>
                      <div className="text-[11px] text-[var(--text-4)]">
                        Trashed {new Date(c.updatedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => restore(c.id)}
                      className="plat-btn-ghost h-8"
                    >
                      <RotateCcw className="h-3.5 w-3.5" /> Restore
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Permanently delete ${displayName(c)}?`)) remove(c.id);
                      }}
                      className="flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-semibold text-[var(--bad-fg)] transition-colors hover:bg-[rgba(179,56,46,0.07)]"
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
