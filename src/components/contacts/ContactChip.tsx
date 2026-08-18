import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Contact } from '@/pages/contacts/_lib/types';
import { displayName } from '@/pages/contacts/_hooks/use-contacts-store';
import ContactAvatar from './ContactAvatar';
import ContactCard from './ContactCard';
import { cn } from '@/lib/utils';

interface Props {
  contact: Contact;
  size?: 'sm' | 'md';
  /** Disable navigation on click — emit onClick instead. */
  onClick?: (c: Contact) => void;
  /** When false, hover-card is suppressed (e.g., inside other previews). */
  showCardOnHover?: boolean;
  className?: string;
}

/**
 * Avatar + name pill — used in every recipient/attendee/share UI across the
 * platform. Hover reveals the full ContactCard preview.
 */
export default function ContactChip({
  contact,
  size = 'md',
  onClick,
  showCardOnHover = true,
  className,
}: Props) {
  const navigate = useNavigate();
  const [hover, setHover] = useState(false);
  const [hoverDelay, setHoverDelay] = useState<number | null>(null);

  const onMouseEnter = () => {
    if (!showCardOnHover) return;
    const id = window.setTimeout(() => setHover(true), 400);
    setHoverDelay(id);
  };
  const onMouseLeave = () => {
    if (hoverDelay !== null) window.clearTimeout(hoverDelay);
    setHoverDelay(null);
    setHover(false);
  };

  const handleClick = () => {
    if (onClick) onClick(contact);
    else navigate(`/contacts/contact/${contact.id}`);
  };

  return (
    <span
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="relative inline-flex"
    >
      <button
        type="button"
        onClick={handleClick}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-1 py-0.5 text-xs hover:border-blue-300 hover:bg-blue-50',
          size === 'md' && 'pr-2',
          className,
        )}
      >
        <ContactAvatar contact={contact} size={size === 'sm' ? 16 : 20} />
        <span className="max-w-[180px] truncate text-gray-900">{displayName(contact)}</span>
      </button>
      {hover && showCardOnHover && (
        <div
          className="absolute left-0 top-full z-50 mt-1 w-80"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <ContactCard contact={contact} />
        </div>
      )}
    </span>
  );
}
