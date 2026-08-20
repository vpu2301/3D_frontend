import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import {
  Search,
  X,
  Sparkles,
  Printer,
  UploadCloud,
  MoreHorizontal,
  Star,
  Pencil,
  Share2,
  Trash2,
  Download,
} from 'lucide-react';
import ContactsLayout from '@/pages/contacts/_components/shared/ContactsLayout';
import ContactsMiniRail from '@/pages/contacts/_components/sidebar/ContactsMiniRail';
import ContactAvatar from '@/components/contacts/ContactAvatar';
import {
  useContactsStore,
  selectContactsMap,
  selectGroupsMap,
  displayName,
} from '@/pages/contacts/_hooks/use-contacts-store';
import { useContactsUiStore } from '@/pages/contacts/_hooks/use-contacts-ui-store';
import { askAcrossContacts } from '@/pages/docs/_lib/mockAi';
import { contactsToCsv, contactToVCard } from '@/pages/contacts/_lib/contactImport';
import type { Contact } from '@/pages/contacts/_lib/types';
import { cn } from '@/lib/utils';

export default function ContactsHome() {
  const load = useContactsStore((s) => s.load);
  const contactsMap = useContactsStore(selectContactsMap);
  const groupsMap = useContactsStore(selectGroupsMap);
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { query, setQuery } = useContactsUiStore();
  const tagFilter = searchParams.get('tag');

  const [aiAnswer, setAiAnswer] = useState('');
  const [aiCited, setAiCited] = useState<string[]>([]);
  const [showAi, setShowAi] = useState(false);
  const PAGE_SIZE = 25;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    load();
  }, [load]);

  const isGroupView = location.pathname.startsWith('/contacts/group/') && !!params.id;

  const visible = useMemo(() => {
    let arr = Object.values(contactsMap).filter((c) => !c.trashed);

    if (isGroupView) {
      const g = groupsMap[params.id!];
      if (g) arr = arr.filter((c) => g.contactIds.includes(c.id));
    }
    if (tagFilter) arr = arr.filter((c) => c.tags.includes(tagFilter));

    if (query) {
      const q = query.toLowerCase();
      arr = arr.filter((c) => {
        if (displayName(c).toLowerCase().includes(q)) return true;
        if (c.emails.some((e) => e.value.toLowerCase().includes(q))) return true;
        if (c.organization?.toLowerCase().includes(q)) return true;
        if (c.title?.toLowerCase().includes(q)) return true;
        if (c.tags.some((t) => t.includes(q))) return true;
        return false;
      });
    }

    arr.sort((a, b) => displayName(a).localeCompare(displayName(b)));
    return arr;
  }, [contactsMap, groupsMap, params.id, query, tagFilter, isGroupView]);

  // Reset pagination whenever the underlying filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [query, tagFilter, isGroupView, params.id]);

  const heading = isGroupView
    ? `${groupsMap[params.id!]?.emoji ?? ''} ${groupsMap[params.id!]?.name ?? 'Group'}`
    : 'Contacts';

  const onAskAi = async () => {
    if (!query.trim()) return;
    setShowAi(true);
    setAiAnswer('');
    setAiCited([]);
    let acc = '';
    const cited = new Set<string>();
    try {
      const summaries = visible.map((c) => ({
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        displayName: c.displayName,
        organization: c.organization,
        title: c.title,
        tags: c.tags,
        isExternal: c.isExternal,
      }));
      for await (const chunk of askAcrossContacts(query, summaries, [])) {
        acc += chunk.chunk;
        chunk.citedContactIds?.forEach((id) => cited.add(id));
        setAiAnswer(acc);
        setAiCited([...cited]);
      }
    } catch {
      setAiAnswer('⚠️ Mock AI failed.');
    }
  };

  const onExport = () => {
    const csv = contactsToCsv(visible);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contacts-export.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <ContactsLayout>
      <div className="flex flex-1 overflow-hidden">
        <ContactsMiniRail />
        <main className="flex flex-1 flex-col overflow-hidden">
          {/* Top search bar */}
          <div className="flex items-center gap-3 border-b border-[var(--line-soft)] px-6 pt-4 pb-3">
            <div className="relative flex-1 max-w-3xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-5)]" />
              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowAi(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && query.trim()) onAskAi();
                }}
                placeholder="Search"
                className="h-10 w-full rounded-[10px] border border-[var(--line-soft)] bg-white pl-11 pr-10 text-sm text-[var(--ink)] placeholder:text-[var(--text-5)] transition-colors focus:border-[var(--ink)] focus:outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setShowAi(false);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-[var(--text-4)] hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--ink)]"
                  aria-label="Clear"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {query && (
              <button
                type="button"
                onClick={onAskAi}
                className="plat-btn h-9 shrink-0 px-4"
                title="Ask AI across contacts"
              >
                <Sparkles className="h-3.5 w-3.5" /> Ask
              </button>
            )}
          </div>

          {/* AI answer panel */}
          {showAi && aiAnswer && (
            <div className="border-b border-[var(--line-soft)] px-6 py-3.5">
              <div className="plat-eyebrow mb-1.5 flex items-center gap-1.5">
                <Sparkles className="h-3 w-3" /> AI answer
              </div>
              <div className="whitespace-pre-wrap text-sm text-[var(--text-1)]">{aiAnswer}</div>
              {aiCited.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {aiCited.map((id) => {
                    const c = contactsMap[id];
                    if (!c) return null;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => navigate(`/contacts/contact/${id}`)}
                        className="inline-flex items-center gap-1 rounded-full border border-[var(--line-soft)] bg-white px-2 py-0.5 text-[10px] font-medium text-[var(--text-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
                      >
                        <ContactAvatar contact={c} size={14} />
                        {displayName(c)}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Page heading */}
          <div className="px-6 pt-6 pb-4">
            <p className="plat-crumb">3days.contacts</p>
            <h1 className="mt-1 text-[26px] leading-tight">
              {heading} <span style={{ color: 'var(--text-5)' }}>({visible.length})</span>
            </h1>
            {tagFilter && (
              <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                <span style={{ color: 'var(--text-4)' }}>Filtered by</span>
                <span className="rounded-full bg-[var(--sand-deep)] px-2 py-0.5 text-[var(--text-2)]">
                  #{tagFilter}
                </span>
                <button
                  type="button"
                  onClick={() => navigate('/contacts')}
                  className="font-semibold text-[var(--ink)] hover:underline"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            {/* One panel, hairline-divided rows. `overflow: visible` undoes the
                .plat-list clip so a row's More-actions menu is not cut off. */}
            <div className="plat-list" style={{ overflow: 'visible' }}>
              <div className="plat-eyebrow grid grid-cols-[minmax(0,1.5fr)_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)_148px] items-center gap-4 border-b border-[var(--line-soft)] px-4 py-2.5">
                <span>Name</span>
                <span>Email</span>
                <span>Phone number</span>
                <span>Job title &amp; company</span>
                <span>Labels</span>
                <span className="flex items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="rounded-full p-1.5 text-[var(--text-4)] hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--ink)]"
                    title="Print"
                  >
                    <Printer className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onExport}
                    className="rounded-full p-1.5 text-[var(--text-4)] hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--ink)]"
                    title="Export CSV"
                  >
                    <UploadCloud className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/contacts/timeline')}
                    className="rounded-full p-1.5 text-[var(--text-4)] hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--ink)]"
                    title="More"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </span>
              </div>

              {visible.length === 0 ? (
                <div className="px-4 py-16 text-center text-sm text-[var(--text-4)]">
                  No contacts here yet.
                </div>
              ) : (
                <>
                  <div className="plat-eyebrow border-b border-[var(--line-soft)] px-4 py-2">Contacts</div>
                  <div>
                    {visible.slice(0, visibleCount).map((c) => (
                      <ContactTableRow key={c.id} contact={c} />
                    ))}
                  </div>
                  {visibleCount < visible.length && (
                    <div className="flex flex-col items-center gap-1.5 border-t border-[var(--line-soft)] py-6">
                      <button
                        type="button"
                        onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                        className="plat-btn-ghost"
                      >
                        Load more
                      </button>
                      <span className="text-[11px] text-[var(--text-5)]">
                        Showing {visibleCount} of {visible.length}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </main>
      </div>
    </ContactsLayout>
  );
}

function ContactTableRow({ contact }: { contact: Contact }) {
  const navigate = useNavigate();
  const star = useContactsStore((s) => s.toggleStar);
  const trash = useContactsStore((s) => s.trashContact);
  const updateContact = useContactsStore((s) => s.updateContact);
  const groupsMap = useContactsStore(selectGroupsMap);
  const [menuOpen, setMenuOpen] = useState(false);

  const labels = useMemo(() => {
    const groupNames = contact.groupIds
      .map((id) => groupsMap[id]?.name)
      .filter(Boolean) as string[];
    return [...groupNames, ...contact.tags];
  }, [contact.groupIds, contact.tags, groupsMap]);

  const phone = contact.phones.find((p) => p.primary)?.value ?? contact.phones[0]?.value;
  const email = contact.emails.find((e) => e.primary)?.value ?? contact.emails[0]?.value;
  const role = contact.title && contact.organization
    ? `${contact.title}, ${contact.organization}`
    : contact.title ?? contact.organization ?? '';

  const onRename = () => {
    const next = window.prompt('Rename contact', displayName(contact));
    if (!next || !next.trim()) return;
    const parts = next.trim().split(/\s+/);
    updateContact(contact.id, {
      firstName: parts[0] ?? '',
      lastName: parts.slice(1).join(' '),
      displayName: undefined,
    });
  };

  const onShare = async () => {
    const vcard = contactToVCard(contact);
    try {
      if (navigator.share) {
        await navigator.share({
          title: displayName(contact),
          text: `${displayName(contact)}${email ? ` · ${email}` : ''}`,
        });
        return;
      }
      await navigator.clipboard.writeText(vcard);
      alert('vCard copied to clipboard.');
    } catch {
      // user-cancelled share or clipboard unavailable — silent
    }
  };

  const onPrint = () => {
    window.print();
  };

  const onExport = () => {
    const vcard = contactToVCard(contact);
    const safeName = displayName(contact).replace(/[^a-z0-9-_]+/gi, '-').toLowerCase() || 'contact';
    const blob = new Blob([vcard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeName}.vcf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const onDelete = () => {
    if (!confirm(`Move ${displayName(contact)} to trash?`)) return;
    trash(contact.id);
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/contacts/contact/${contact.id}`)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') navigate(`/contacts/contact/${contact.id}`);
      }}
      className="group relative grid cursor-pointer grid-cols-[minmax(0,1.5fr)_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1.4fr)_minmax(0,1fr)_148px] items-center gap-4 border-b border-[var(--line-soft)] px-4 py-2.5 transition-colors last:border-b-0 hover:bg-[rgba(20,22,26,0.02)]"
    >
      <div className="flex min-w-0 items-center gap-3">
        <ContactAvatar contact={contact} size={32} />
        <span className="truncate text-sm font-medium text-[var(--ink)]">{displayName(contact)}</span>
      </div>
      <div className="truncate text-sm text-[var(--text-2)]">{email ?? ''}</div>
      <div className="truncate text-sm text-[var(--text-2)]">{phone ?? ''}</div>
      <div className="truncate text-sm text-[var(--text-2)]">{role}</div>
      <div className="flex flex-wrap items-center gap-1 truncate">
        {labels.slice(0, 2).map((l) => (
          <span
            key={l}
            className="inline-flex max-w-full truncate rounded-full bg-[var(--sand-deep)] px-2 py-0.5 text-[11px] text-[var(--text-3)]"
          >
            {l}
          </span>
        ))}
        {labels.length > 2 && (
          <span className="text-[10px] text-[var(--text-5)]">+{labels.length - 2}</span>
        )}
      </div>
      <div className="flex items-center justify-end gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            star(contact.id);
          }}
          className="rounded-full p-1.5 text-[var(--text-5)] hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--ink)]"
          aria-label={contact.starred ? 'Unstar' : 'Star'}
          title={contact.starred ? 'Unstar' : 'Star'}
        >
          <Star
            className={cn(
              'h-4 w-4',
              contact.starred ? 'fill-amber-400 text-amber-400' : '',
            )}
          />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRename();
          }}
          className="rounded-full p-1.5 text-[var(--text-5)] hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--ink)]"
          aria-label="Rename"
          title="Rename"
        >
          <Pencil className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onShare();
          }}
          className="rounded-full p-1.5 text-[var(--text-5)] hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--ink)]"
          aria-label="Share"
          title="Share"
        >
          <Share2 className="h-4 w-4" />
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((o) => !o);
            }}
            className="rounded-full p-1.5 text-[var(--text-5)] hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--ink)]"
            aria-label="More actions"
            title="More"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {menuOpen && (
            <div
              className="absolute right-0 top-full z-20 mt-1 w-44 rounded-[12px] border border-[var(--line)] bg-white p-1 shadow-lg"
              onClick={(e) => e.stopPropagation()}
              onMouseLeave={() => setMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onPrint();
                }}
                className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left text-[13px] text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
              >
                <Printer className="h-3.5 w-3.5" /> Print
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onExport();
                }}
                className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left text-[13px] text-[var(--text-2)] hover:bg-[rgba(20,22,26,0.05)] hover:text-[var(--ink)]"
              >
                <Download className="h-3.5 w-3.5" /> Export vCard
              </button>
              <div className="my-1 border-t border-[var(--line-soft)]" />
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false);
                  onDelete();
                }}
                className="flex w-full items-center gap-2 rounded-[8px] px-2 py-1.5 text-left text-[13px] text-[var(--bad-fg)] hover:bg-[rgba(179,56,46,0.07)]"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
