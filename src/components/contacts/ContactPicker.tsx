import { useEffect, useMemo, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import type { Contact } from '@/pages/contacts/_lib/types';
import {
  useContactsStore,
  selectContactsMap,
  displayName,
} from '@/pages/contacts/_hooks/use-contacts-store';
import ContactAvatar from './ContactAvatar';
import { cn } from '@/lib/utils';

interface Props {
  value: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
  /** Allow inline "+ create new contact from this email" when input looks like an email. */
  allowCreate?: boolean;
  /** Limit the candidate pool. Default: all non-trashed contacts. */
  filter?: (c: Contact) => boolean;
}

/**
 * Type-ahead contact picker. Used by Mail compose, Calendar attendees, Drive
 * share, Notes mention, Docs share, Todo assignee.
 */
export default function ContactPicker({
  value,
  onChange,
  placeholder = 'Add a contact…',
  allowCreate = true,
  filter,
}: Props) {
  const contactsMap = useContactsStore(selectContactsMap);
  const createContact = useContactsStore((s) => s.createContact);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const all = useMemo(() => {
    let arr = Object.values(contactsMap).filter((c) => !c.trashed);
    if (filter) arr = arr.filter(filter);
    return arr;
  }, [contactsMap, filter]);

  const candidates = useMemo(() => {
    const selected = new Set(value);
    let arr = all.filter((c) => !selected.has(c.id));
    if (query.trim()) {
      const q = query.toLowerCase();
      arr = arr.filter((c) => {
        const name = displayName(c).toLowerCase();
        const emails = c.emails.map((e) => e.value.toLowerCase()).join(' ');
        return name.includes(q) || emails.includes(q) || (c.organization ?? '').toLowerCase().includes(q);
      });
    }
    return arr.slice(0, 8);
  }, [all, value, query]);

  useEffect(() => setActive(0), [query, open]);

  const looksLikeEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(query.trim());

  const select = (id: string) => {
    if (value.includes(id)) return;
    onChange([...value, id]);
    setQuery('');
    inputRef.current?.focus();
  };

  const onCreate = async () => {
    const email = query.trim();
    if (!email) return;
    const localPart = email.split('@')[0];
    const c = await createContact({
      firstName: localPart,
      lastName: '',
      emails: [{ value: email, label: 'work', primary: true }],
      source: 'manual',
    });
    select(c.id);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(candidates.length - 1, a + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (candidates[active]) select(candidates[active].id);
      else if (allowCreate && looksLikeEmail) onCreate();
    } else if (e.key === 'Backspace' && !query && value.length > 0) {
      onChange(value.slice(0, -1));
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex flex-wrap items-center gap-1 rounded-md border border-gray-200 bg-white p-1 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
        {value.map((id) => {
          const c = contactsMap[id];
          if (!c) return null;
          return (
            <span
              key={id}
              className="inline-flex items-center gap-1 rounded-full bg-gray-100 py-0.5 pl-1 pr-1.5 text-xs"
            >
              <ContactAvatar contact={c} size={16} />
              <span>{displayName(c)}</span>
              <button
                type="button"
                onClick={() => onChange(value.filter((x) => x !== id))}
                className="text-gray-400 hover:text-red-500"
                aria-label={`Remove ${displayName(c)}`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          );
        })}
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[120px] bg-transparent px-1 py-0.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
        />
      </div>

      {open && (candidates.length > 0 || (allowCreate && looksLikeEmail)) && (
        <div className="absolute left-0 top-full z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg">
          {candidates.map((c, i) => (
            <button
              key={c.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                select(c.id);
              }}
              onMouseEnter={() => setActive(i)}
              className={cn(
                'flex w-full items-center gap-2 rounded px-2 py-1.5 text-left',
                i === active ? 'bg-gray-100' : 'hover:bg-gray-50',
              )}
            >
              <ContactAvatar contact={c} size={24} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm text-gray-900">{displayName(c)}</div>
                <div className="truncate text-[11px] text-gray-500">
                  {c.emails[0]?.value ?? '—'}
                  {c.organization ? ` · ${c.organization}` : ''}
                </div>
              </div>
            </button>
          ))}
          {allowCreate && looksLikeEmail && candidates.length === 0 && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onCreate();
              }}
              className="flex w-full items-center gap-2 rounded bg-blue-50 px-2 py-1.5 text-left text-sm text-blue-700 hover:bg-blue-100"
            >
              <Plus className="h-3.5 w-3.5" />
              Create new contact: <span className="font-medium">{query}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}
