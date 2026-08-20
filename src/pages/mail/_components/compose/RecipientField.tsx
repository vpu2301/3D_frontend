import { useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { useContactsStore, selectContactsMap } from '@/pages/contacts/_hooks/use-contacts-store';
import type { ContactRef } from '@/pages/mail/_lib/types';
import Avatar from '../list/Avatar';
import { cn } from '@/lib/utils';

interface Props {
  label: string;
  value: ContactRef[];
  onChange: (v: ContactRef[]) => void;
  placeholder?: string;
}

const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export default function RecipientField({ label, value, onChange, placeholder }: Props) {
  const contactsMap = useContactsStore(selectContactsMap);
  const [text, setText] = useState('');
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const suggestions = useMemo(() => {
    const q = text.trim().toLowerCase();
    if (!q) return [];
    const list = Object.values(contactsMap)
      .filter((c) => !c.trashed)
      .map((c) => {
        const name = c.displayName || `${c.firstName} ${c.lastName}`.trim();
        const email = c.emails[0]?.value;
        return email ? { id: c.id, name, email } : null;
      })
      .filter((x): x is { id: string; name: string; email: string } => Boolean(x));
    return list
      .filter((c) => {
        const hay = `${c.name} ${c.email}`.toLowerCase();
        return hay.includes(q);
      })
      .filter((c) => !value.some((v) => v.email === c.email))
      .slice(0, 6);
  }, [text, contactsMap, value]);

  const commit = (ref: ContactRef) => {
    onChange([...value, ref]);
    setText('');
    setOpen(false);
    inputRef.current?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const trimmed = text.trim().replace(/,$/, '');
      if (suggestions.length > 0) {
        const s = suggestions[0];
        commit({ contactId: s.id, name: s.name, email: s.email });
      } else if (isEmail(trimmed)) {
        commit({ name: trimmed, email: trimmed });
      }
    } else if (e.key === 'Backspace' && !text && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div className="relative flex items-center gap-2 border-b border-[var(--line-soft)] px-3 py-1.5 text-sm">
      <span className="shrink-0 text-xs text-[var(--text-4)]">{label}</span>
      <div className="flex flex-1 flex-wrap items-center gap-1">
        {value.map((r) => (
          <span
            key={r.email}
            className="inline-flex items-center gap-1 rounded-full bg-[var(--sand-deep)] px-2 py-0.5 text-xs"
          >
            <Avatar name={r.name} email={r.email} size={16} />
            <span className="font-medium text-[var(--ink)]">{r.name}</span>
            <button
              type="button"
              onClick={() => onChange(value.filter((v) => v.email !== r.email))}
              className="text-[var(--text-4)] transition-colors hover:text-[var(--ink)]"
              aria-label={`Remove ${r.name}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          placeholder={value.length === 0 ? placeholder : ''}
          className="min-w-[80px] flex-1 bg-transparent text-sm text-[var(--ink)] outline-none placeholder:text-[var(--text-5)]"
        />
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute left-12 right-3 top-full z-10 mt-1 max-h-60 overflow-y-auto rounded-[12px] border border-[var(--line)] bg-white py-1 shadow-lg">
          {suggestions.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                commit({ contactId: s.id, name: s.name, email: s.email });
              }}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-1.5 text-left text-sm hover:bg-[rgba(20,22,26,0.04)]',
                i === 0 && 'bg-[rgba(20,22,26,0.04)]',
              )}
            >
              <Avatar name={s.name} email={s.email} size={20} />
              <span className="font-medium text-[var(--ink)]">{s.name}</span>
              <span className="text-xs text-[var(--text-4)]">&lt;{s.email}&gt;</span>
            </button>
          ))}
          {text && isEmail(text.trim()) && !suggestions.some((s) => s.email === text.trim()) && (
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                commit({ name: text.trim(), email: text.trim() });
              }}
              className="flex w-full items-center gap-2 border-t border-[var(--line-soft)] px-3 py-1.5 text-left text-sm font-medium text-[var(--ink)] hover:bg-[rgba(20,22,26,0.04)]"
            >
              Use “{text.trim()}”
            </button>
          )}
        </div>
      )}
    </div>
  );
}
