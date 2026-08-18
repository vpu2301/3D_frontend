import Avatar from 'boring-avatars';
import type { Contact } from '@/pages/contacts/_lib/types';
import { displayName, initialsOf } from '@/pages/contacts/_hooks/use-contacts-store';
import { cn } from '@/lib/utils';

interface Props {
  contact: Pick<Contact, 'firstName' | 'lastName' | 'displayName' | 'photoUrl'>;
  size?: number;
  className?: string;
  /** When true, render initials instead of the boring-avatar fallback. */
  preferInitials?: boolean;
}

const PALETTE = ['#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f472b6'];

/**
 * Image-or-initials avatar with deterministic boring-avatar fallback.
 * Used by every module that renders a person.
 */
export default function ContactAvatar({
  contact,
  size = 32,
  className,
  preferInitials,
}: Props) {
  const name = displayName(contact as any) || 'Contact';

  if (contact.photoUrl) {
    return (
      <img
        src={contact.photoUrl}
        alt={name}
        width={size}
        height={size}
        className={cn('shrink-0 rounded-full object-cover', className)}
        style={{ width: size, height: size }}
      />
    );
  }

  if (preferInitials) {
    const initials = initialsOf(contact as any);
    return (
      <div
        role="img"
        aria-label={`${name} initials`}
        className={cn(
          'flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-blue-500 font-medium text-white',
          className,
        )}
        style={{
          width: size,
          height: size,
          fontSize: Math.max(10, size * 0.4),
        }}
      >
        {initials}
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={`Generated avatar for ${name}`}
      className={cn('shrink-0 overflow-hidden rounded-full', className)}
      style={{ width: size, height: size }}
    >
      <Avatar size={size} name={name} variant="beam" colors={PALETTE} />
    </div>
  );
}
