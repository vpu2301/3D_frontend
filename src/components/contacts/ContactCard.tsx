import { Link } from 'react-router-dom';
import { Mail, Phone, ExternalLink, Star } from 'lucide-react';
import type { Contact } from '@/pages/contacts/_lib/types';
import { displayName } from '@/pages/contacts/_hooks/use-contacts-store';
import ContactAvatar from './ContactAvatar';

interface Props {
  contact: Contact;
  /** Optional tagline shown above the actions ("Last meeting on Apr 12"). */
  tagline?: string;
}

/**
 * Full hover-card preview. Used wherever a person is referenced. Designed for
 * 280–320px width.
 */
export default function ContactCard({ contact, tagline }: Props) {
  const primaryEmail = contact.emails.find((e) => e.primary) ?? contact.emails[0];
  const primaryPhone = contact.phones.find((p) => p.primary) ?? contact.phones[0];
  const role = contact.title && contact.organization
    ? `${contact.title} at ${contact.organization}`
    : contact.title ?? contact.organization;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3 shadow-lg">
      <div className="flex items-start gap-3">
        <ContactAvatar contact={contact} size={44} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1">
            <span className="truncate text-sm font-semibold text-gray-900">
              {displayName(contact)}
            </span>
            {contact.starred && (
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            )}
            {contact.isExternal && (
              <span className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-gray-500">
                external
              </span>
            )}
          </div>
          {role && <div className="truncate text-xs text-gray-600">{role}</div>}
          {contact.pronouns && (
            <div className="text-[10px] text-gray-500">{contact.pronouns}</div>
          )}
        </div>
      </div>

      {tagline && <div className="mt-2 text-[11px] italic text-gray-500">{tagline}</div>}

      {(primaryEmail || primaryPhone) && (
        <div className="mt-2 space-y-1 text-xs">
          {primaryEmail && (
            <a
              href={`mailto:${primaryEmail.value}`}
              className="flex items-center gap-1.5 truncate text-gray-700 hover:text-blue-700"
            >
              <Mail className="h-3 w-3 text-gray-400" />
              {primaryEmail.value}
            </a>
          )}
          {primaryPhone && (
            <a
              href={`tel:${primaryPhone.value}`}
              className="flex items-center gap-1.5 text-gray-700 hover:text-blue-700"
            >
              <Phone className="h-3 w-3 text-gray-400" />
              {primaryPhone.value}
            </a>
          )}
        </div>
      )}

      {contact.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {contact.tags.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-full bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-600"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {contact.aiSummary?.text && (
        <div className="mt-2 line-clamp-3 rounded-md bg-blue-50 px-2 py-1.5 text-[11px] italic text-blue-900">
          {contact.aiSummary.text}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-2 text-[11px]">
        <Link
          to={`/contacts/contact/${contact.id}`}
          className="inline-flex items-center gap-1 text-blue-700 hover:underline"
        >
          Open contact <ExternalLink className="h-3 w-3" />
        </Link>
        {contact.relationshipStrength && (
          <span className="text-gray-500">
            {contact.relationshipStrength.label} · {contact.relationshipStrength.score}
          </span>
        )}
      </div>
    </div>
  );
}
