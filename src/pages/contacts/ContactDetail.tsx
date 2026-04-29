import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Mail as MailIcon,
  Phone,
  CalendarPlus,
  Star,
  Trash2,
  Edit3,
  Sparkles,
  Loader2,
  Plus,
  X,
  ExternalLink,
  StickyNote,
  FileText,
  HardDrive,
  CalendarClock,
  Send,
  Bell,
  RefreshCw,
} from 'lucide-react';
import ContactsLayout from '@/pages/contacts/_components/shared/ContactsLayout';
import ContactsMiniRail from '@/pages/contacts/_components/sidebar/ContactsMiniRail';
import ContactAvatar from '@/components/contacts/ContactAvatar';
import ContactChip from '@/components/contacts/ContactChip';
import {
  useContactsStore,
  selectContactsMap,
  selectGroupsMap,
  displayName,
} from '@/pages/contacts/_hooks/use-contacts-store';
import { useDocsStore } from '@/pages/docs/_hooks/use-docs-store';
import { useNotesStore } from '@/pages/notes/_hooks/use-notes-store';
import { useDriveStore } from '@/pages/drive/_hooks/use-drive-store';
import { useTodoStore } from '@/pages/todo/_hooks/use-todo-store';
import {
  summarizeContact,
  askAboutContact,
  suggestContactNextActions,
  suggestContactEnrichment,
} from '@/pages/docs/_lib/mockAi';
import { computeRelationshipStrengthSync } from '@/pages/contacts/_lib/relationshipStrength';
import type { Contact, Interaction } from '@/pages/contacts/_lib/types';
import { newId } from '@/pages/contacts/_lib/storage';
import { cn } from '@/lib/utils';

type Tab = 'about' | 'mail' | 'meetings' | 'shared' | 'timeline' | 'activity';

const TYPE_ICON = {
  email: MailIcon,
  meeting: CalendarClock,
  'doc-share': FileText,
  'note-mention': StickyNote,
  'drive-share': HardDrive,
  'task-assign': CalendarPlus,
} as const;

export default function ContactDetail() {
  const load = useContactsStore((s) => s.load);
  const loadDocs = useDocsStore((s) => s.load);
  const loadNotes = useNotesStore((s) => s.load);
  const loadDrive = useDriveStore((s) => s.load);
  const loadTodo = useTodoStore((s) => s.load);
  const contactsMap = useContactsStore(selectContactsMap);
  const groupsMap = useContactsStore(selectGroupsMap);
  const updateContact = useContactsStore((s) => s.updateContact);
  const setAiSummary = useContactsStore((s) => s.setAiSummary);
  const setRelationshipStrength = useContactsStore((s) => s.setRelationshipStrength);
  const refreshStrength = useContactsStore((s) => s.refreshRelationshipStrength);
  const upsertEnrichment = useContactsStore((s) => s.upsertEnrichment);
  const acceptEnrichment = useContactsStore((s) => s.acceptEnrichment);
  const rejectEnrichment = useContactsStore((s) => s.rejectEnrichment);
  const enrichmentMap = useContactsStore((s) => s.enrichment);
  const trash = useContactsStore((s) => s.trashContact);
  const star = useContactsStore((s) => s.toggleStar);
  const getInteractions = useContactsStore((s) => s.getInteractionsForContact);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [tab, setTab] = useState<Tab>('about');
  const [editing, setEditing] = useState<{ field: string; value: string } | null>(null);
  const [summarizing, setSummarizing] = useState(false);
  const [enriching, setEnriching] = useState(false);
  const [askInput, setAskInput] = useState('');
  const [askMessages, setAskMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [askLoading, setAskLoading] = useState(false);
  const [actions, setActions] = useState<{ kind: string; reason: string }[]>([]);

  useEffect(() => {
    load();
    loadDocs();
    loadNotes();
    loadDrive();
    loadTodo();
  }, [load, loadDocs, loadNotes, loadDrive, loadTodo]);

  const contact = id ? contactsMap[id] : undefined;

  const interactions: Interaction[] = useMemo(() => {
    if (!contact) return [];
    return getInteractions(contact.id);
  }, [contact, getInteractions, contactsMap]);

  const interactionsForAi = useMemo(
    () =>
      interactions.map((i) => ({
        id: i.id,
        type: i.type,
        occurredAt: i.occurredAt,
        summary: i.summary,
      })),
    [interactions],
  );

  // Compute relationship strength deterministically on mount + when interactions change
  useEffect(() => {
    if (!contact) return;
    const strength = computeRelationshipStrengthSync(contact, interactions);
    if (
      contact.relationshipStrength?.score !== strength.score ||
      contact.relationshipStrength?.label !== strength.label
    ) {
      setRelationshipStrength(contact.id, strength);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contact?.id, interactions.length]);

  // Suggest next actions when contact loads
  useEffect(() => {
    if (!contact) return;
    let cancelled = false;
    (async () => {
      try {
        const out = await suggestContactNextActions(contactSummary(contact), interactionsForAi);
        if (!cancelled) setActions(out);
      } catch {
        /* mock failure */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [contact?.id, interactions.length]);

  if (!contact) {
    return (
      <ContactsLayout>
        <div className="flex flex-1 items-center justify-center text-sm text-gray-500">
          Contact not found.
        </div>
      </ContactsLayout>
    );
  }

  const onGenerateSummary = async () => {
    setSummarizing(true);
    try {
      const text = await summarizeContact(contactSummary(contact), interactionsForAi);
      await setAiSummary(contact.id, {
        text,
        generatedAt: Date.now(),
        citedInteractionIds: interactions.slice(0, 3).map((i) => i.id),
      });
    } catch {
      alert('Mock AI failed — try again.');
    } finally {
      setSummarizing(false);
    }
  };

  const onSuggestEnrichment = async () => {
    setEnriching(true);
    try {
      // Build mock enrichment signals from interactions and notes that mention them.
      const signals: Parameters<typeof suggestContactEnrichment>[1] = interactions
        .filter((i) => i.type === 'note-mention' || i.type === 'doc-share')
        .map((i) => ({
          module: i.sourceModule,
          sourceId: i.sourceId,
          snippet: i.summary,
        }))
        .slice(0, 5);
      // Add a synthetic email-signature signal for plausibility.
      if (contact.organization && !contact.title) {
        signals.unshift({
          module: 'mail',
          sourceId: 'mock-email',
          snippet: `${displayName(contact)} | Senior Engineer at ${contact.organization}`,
        });
      }
      const suggestions = await suggestContactEnrichment(contactSummary(contact), signals);
      for (const s of suggestions) {
        await upsertEnrichment({
          id: newId('enrich'),
          contactId: contact.id,
          field: s.field,
          value: s.value,
          source: s.source,
          confidence: s.confidence,
          status: 'pending',
        });
      }
      if (suggestions.length === 0) alert('No enrichment suggestions found.');
    } catch {
      alert('Mock AI failed.');
    } finally {
      setEnriching(false);
    }
  };

  const onAsk = async () => {
    if (!askInput.trim()) return;
    const userMsg = { role: 'user' as const, content: askInput.trim() };
    setAskMessages((m) => [...m, userMsg, { role: 'assistant', content: '' }]);
    setAskInput('');
    setAskLoading(true);
    let acc = '';
    try {
      for await (const chunk of askAboutContact(askInput.trim(), contactSummary(contact), interactionsForAi)) {
        acc += chunk.chunk;
        setAskMessages((m) => {
          const next = [...m];
          next[next.length - 1] = { role: 'assistant', content: acc };
          return next;
        });
      }
    } catch {
      setAskMessages((m) => {
        const next = [...m];
        next[next.length - 1] = { role: 'assistant', content: '⚠️ Mock AI failed.' };
        return next;
      });
    } finally {
      setAskLoading(false);
    }
  };

  const pendingEnrichment = Object.values(enrichmentMap).filter(
    (e) => e.contactId === contact.id && e.status === 'pending',
  );

  const groups = contact.groupIds.map((gid) => groupsMap[gid]).filter(Boolean);
  const primaryEmail = contact.emails.find((e) => e.primary) ?? contact.emails[0];

  return (
    <ContactsLayout>
      <div className="flex flex-1 overflow-hidden">
        <ContactsMiniRail />
        <main className="flex flex-1 overflow-hidden">
          {/* Main column */}
          <div className="flex flex-1 flex-col overflow-y-auto">
            <div className="border-b border-gray-200 px-6 py-4">
              <Link to="/contacts" className="inline-flex items-center gap-1 text-xs text-gray-500 hover:underline">
                <ArrowLeft className="h-3 w-3" /> Back to Contacts
              </Link>
              <div className="mt-3 flex items-start gap-4">
                <ContactAvatar contact={contact} size={72} />
                <div className="min-w-0 flex-1">
                  <InlineEditableText
                    value={displayName(contact)}
                    onSave={(v) => {
                      const parts = v.split(/\s+/);
                      updateContact(contact.id, {
                        firstName: parts[0] ?? '',
                        lastName: parts.slice(1).join(' '),
                        displayName: undefined,
                      });
                    }}
                    className="text-2xl font-light text-gray-900"
                  />
                  <div className="mt-1 flex items-center gap-2 text-sm text-gray-600">
                    <InlineEditableText
                      value={contact.title ?? ''}
                      placeholder="Title"
                      onSave={(v) => updateContact(contact.id, { title: v || undefined })}
                    />
                    {(contact.title || contact.organization) && <span>·</span>}
                    <InlineEditableText
                      value={contact.organization ?? ''}
                      placeholder="Organization"
                      onSave={(v) => updateContact(contact.id, { organization: v || undefined })}
                    />
                  </div>
                  {contact.pronouns && (
                    <div className="text-xs text-gray-500">{contact.pronouns}</div>
                  )}
                  {groups.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {groups.map((g) => (
                        <Link
                          key={g!.id}
                          to={`/contacts/group/${g!.id}`}
                          className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-700 hover:bg-gray-200"
                        >
                          {g!.emoji ? `${g!.emoji} ` : ''}
                          {g!.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {primaryEmail && (
                    <a
                      href={`mailto:${primaryEmail.value}`}
                      className="flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs hover:bg-gray-50"
                    >
                      <MailIcon className="h-3.5 w-3.5" /> Email
                    </a>
                  )}
                  <button
                    type="button"
                    className="flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1.5 text-xs hover:bg-gray-50"
                  >
                    <CalendarPlus className="h-3.5 w-3.5" /> Schedule
                  </button>
                  <button
                    type="button"
                    onClick={() => star(contact.id)}
                    className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100"
                    aria-label={contact.starred ? 'Unstar' : 'Star'}
                  >
                    <Star className={cn('h-4 w-4', contact.starred && 'fill-yellow-400 text-yellow-400')} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(`Move ${displayName(contact)} to trash?`)) {
                        trash(contact.id);
                        navigate('/contacts');
                      }
                    }}
                    className="rounded-md p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                    aria-label="Trash"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <IdentityCard contact={contact} />

            <div className="border-b border-gray-200 px-6">
              <div className="flex items-center gap-1">
                {(['about', 'mail', 'meetings', 'shared', 'timeline', 'activity'] as Tab[]).map(
                  (t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTab(t)}
                      className={cn(
                        'rounded-md px-3 py-2 text-sm capitalize transition-colors',
                        tab === t
                          ? 'border-b-2 border-rose-500 font-medium text-gray-900'
                          : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900',
                      )}
                    >
                      {t}
                    </button>
                  ),
                )}
              </div>
            </div>

            <div className="flex-1 px-6 py-5">
              {tab === 'about' && (
                <AboutTab
                  contact={contact}
                  onGenerateSummary={onGenerateSummary}
                  summarizing={summarizing}
                  askInput={askInput}
                  setAskInput={setAskInput}
                  askMessages={askMessages}
                  askLoading={askLoading}
                  onAsk={onAsk}
                />
              )}
              {tab === 'mail' && (
                <div className="rounded-md border border-dashed border-gray-200 px-4 py-12 text-center text-sm text-gray-500">
                  No Mail module wired yet — emails with this contact will land here when Mail
                  ships.
                </div>
              )}
              {tab === 'meetings' && (
                <InteractionList
                  interactions={interactions.filter((i) => i.type === 'meeting')}
                  empty="No meetings linked."
                />
              )}
              {tab === 'shared' && (
                <InteractionList
                  interactions={interactions.filter(
                    (i) => i.type === 'doc-share' || i.type === 'drive-share' || i.type === 'note-mention',
                  )}
                  empty="No shared docs, notes, or files yet."
                />
              )}
              {tab === 'timeline' && <InteractionList interactions={interactions} empty="No interactions yet." />}
              {tab === 'activity' && (
                <div className="text-xs italic text-gray-500">
                  Created {new Date(contact.createdAt).toLocaleString()} · Last updated{' '}
                  {new Date(contact.updatedAt).toLocaleString()} · Source:{' '}
                  <span className="font-medium">{contact.source}</span>
                </div>
              )}
            </div>
          </div>

          {/* Right rail */}
          <aside className="hidden w-80 shrink-0 flex-col gap-3 overflow-y-auto border-l border-gray-200 bg-gray-50 p-4 lg:flex">
            <RelationshipStrengthPanel
              contact={contact}
              onRefresh={() => refreshStrength(contact.id)}
            />
            <LastInteractionPanel interactions={interactions} />
            <SuggestedActionsPanel
              actions={actions}
              contact={contact}
              onRecompute={async () => {
                const out = await suggestContactNextActions(contactSummary(contact), interactionsForAi);
                setActions(out);
              }}
            />
            <EnrichmentPanel
              suggestions={pendingEnrichment}
              onSuggest={onSuggestEnrichment}
              onAccept={(id) => acceptEnrichment(id)}
              onReject={(id) => rejectEnrichment(id)}
              loading={enriching}
            />
            <LinkedContactsPanel contact={contact} />
          </aside>
        </main>
      </div>
    </ContactsLayout>
  );
}

function contactSummary(c: Contact) {
  return {
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    displayName: c.displayName,
    organization: c.organization,
    title: c.title,
    tags: c.tags,
    isExternal: c.isExternal,
  };
}

function InlineEditableText({
  value,
  onSave,
  placeholder,
  className,
}: {
  value: string;
  onSave: (next: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  useEffect(() => setDraft(value), [value]);
  if (editing) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft !== value) onSave(draft);
          setEditing(false);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') (e.target as HTMLInputElement).blur();
          if (e.key === 'Escape') {
            setDraft(value);
            setEditing(false);
          }
        }}
        placeholder={placeholder}
        className={cn(
          'rounded border border-rose-300 bg-white px-1.5 py-0.5 focus:outline-none',
          className,
        )}
      />
    );
  }
  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className={cn(
        'group inline-flex items-baseline gap-1 rounded px-1.5 py-0.5 text-left hover:bg-gray-100',
        className,
        !value && 'italic text-gray-400',
      )}
    >
      {value || placeholder || 'Add'}
      <Edit3 className="h-3 w-3 opacity-0 group-hover:opacity-100" />
    </button>
  );
}

function IdentityCard({ contact }: { contact: Contact }) {
  return (
    <div className="grid grid-cols-1 gap-2 border-b border-gray-100 bg-white px-6 py-3 text-sm md:grid-cols-2">
      <div className="space-y-1">
        {contact.emails.map((e) => (
          <div key={e.value} className="flex items-center gap-2">
            <MailIcon className="h-3.5 w-3.5 text-gray-400" />
            <a href={`mailto:${e.value}`} className="text-gray-900 hover:text-blue-700">
              {e.value}
            </a>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">{e.label}</span>
            {e.primary && <span className="rounded-full bg-blue-50 px-1.5 py-0.5 text-[10px] text-blue-700">primary</span>}
          </div>
        ))}
        {contact.phones.map((p) => (
          <div key={p.value} className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-gray-400" />
            <a href={`tel:${p.value}`} className="text-gray-900 hover:text-blue-700">
              {p.value}
            </a>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">{p.label}</span>
          </div>
        ))}
      </div>
      <div className="space-y-1">
        {contact.urls.map((u) => (
          <div key={u.value} className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
            <a href={u.value} target="_blank" rel="noreferrer" className="truncate text-gray-900 hover:text-blue-700">
              {u.value}
            </a>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">{u.label}</span>
          </div>
        ))}
        {contact.addresses.map((a, i) => (
          <div key={`${a.value}-${i}`} className="flex items-center gap-2">
            <span className="text-gray-900">{a.value}</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-400">{a.label}</span>
          </div>
        ))}
        {contact.importantDates.map((d, i) => (
          <div key={i} className="flex items-center gap-2 text-gray-900">
            <Bell className="h-3.5 w-3.5 text-gray-400" />
            {d.label}: {new Date(d.value).toLocaleDateString()}
          </div>
        ))}
      </div>
    </div>
  );
}

function AboutTab({
  contact,
  onGenerateSummary,
  summarizing,
  askInput,
  setAskInput,
  askMessages,
  askLoading,
  onAsk,
}: {
  contact: Contact;
  onGenerateSummary: () => void;
  summarizing: boolean;
  askInput: string;
  setAskInput: (v: string) => void;
  askMessages: { role: 'user' | 'assistant'; content: string }[];
  askLoading: boolean;
  onAsk: () => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">AI summary</h3>
          <button
            type="button"
            onClick={onGenerateSummary}
            disabled={summarizing}
            className="flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
          >
            {summarizing ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
            {contact.aiSummary ? 'Regenerate' : 'Generate'}
          </button>
        </div>
        {contact.aiSummary ? (
          <div className="rounded-md border border-blue-100 bg-blue-50/50 p-3 text-sm leading-relaxed text-blue-900">
            {contact.aiSummary.text}
            <div className="mt-2 text-[10px] italic text-blue-600">
              Generated {new Date(contact.aiSummary.generatedAt).toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-gray-200 px-3 py-6 text-center text-xs text-gray-500">
            No summary yet — click Generate to synthesize from interactions.
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium text-gray-900">Ask AI about this contact</h3>
        <div className="space-y-2">
          {askMessages.map((m, i) => (
            <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <div
                className={cn(
                  'max-w-[85%] rounded-lg px-3 py-2 text-sm',
                  m.role === 'user' ? 'bg-rose-600 text-white' : 'bg-gray-100 text-gray-900',
                )}
              >
                <div className="whitespace-pre-wrap">
                  {m.content || (m.role === 'assistant' ? 'Thinking…' : '')}
                </div>
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onAsk();
          }}
          className="mt-2 flex items-center gap-1"
        >
          <input
            value={askInput}
            onChange={(e) => setAskInput(e.target.value)}
            placeholder="What did we discuss last quarter?"
            className="flex-1 rounded-md border border-gray-200 bg-white px-2 py-1.5 text-sm focus:border-rose-400 focus:outline-none"
          />
          <button
            type="submit"
            disabled={askLoading || !askInput.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-md bg-rose-600 text-white hover:bg-rose-700 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

function InteractionList({
  interactions,
  empty,
}: {
  interactions: Interaction[];
  empty: string;
}) {
  if (interactions.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-gray-200 px-4 py-12 text-center text-sm text-gray-500">
        {empty}
      </div>
    );
  }
  return (
    <ul className="space-y-2">
      {interactions.map((i) => {
        const Icon = TYPE_ICON[i.type];
        return (
          <li key={i.id} className="flex items-start gap-3 rounded-md border border-gray-100 bg-white p-3">
            <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <div className="min-w-0 flex-1">
              <div className="text-sm text-gray-900">{i.summary}</div>
              <div className="text-[11px] text-gray-500">
                {new Date(i.occurredAt).toLocaleString()} · {i.sourceModule}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function RelationshipStrengthPanel({
  contact,
  onRefresh,
}: {
  contact: Contact;
  onRefresh: () => void;
}) {
  const s = contact.relationshipStrength;
  if (!s) return null;
  const color =
    s.label === 'strong'
      ? '#10b981'
      : s.label === 'active'
        ? '#3b82f6'
        : s.label === 'cooling'
          ? '#f59e0b'
          : '#9ca3af';
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          Relationship
        </div>
        <button
          type="button"
          onClick={onRefresh}
          className="rounded p-0.5 text-gray-400 hover:bg-gray-100"
          title="Recompute"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-light text-gray-900">{s.score}</span>
        <span
          className="rounded-full px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider text-white"
          style={{ backgroundColor: color }}
        >
          {s.label}
        </span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full transition-[width] duration-300"
          style={{ width: `${Math.max(2, s.score)}%`, backgroundColor: color }}
        />
      </div>
      <ul className="mt-3 space-y-1 text-[11px] text-gray-600">
        {s.factors.map((f) => (
          <li key={f.label} className="flex items-center justify-between">
            <span className="text-gray-500">{f.label}</span>
            <span className="text-gray-800">{f.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function LastInteractionPanel({ interactions }: { interactions: Interaction[] }) {
  const last = interactions[0];
  if (!last) {
    return (
      <div className="rounded-lg border border-dashed border-gray-200 p-3 text-xs italic text-gray-500">
        No interactions yet.
      </div>
    );
  }
  const Icon = TYPE_ICON[last.type];
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        Last interaction
      </div>
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-4 w-4 text-gray-400" />
        <div className="min-w-0 flex-1">
          <div className="text-sm text-gray-900">{last.summary}</div>
          <div className="text-[11px] text-gray-500">
            {new Date(last.occurredAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}

function SuggestedActionsPanel({
  actions,
  contact,
  onRecompute,
}: {
  actions: { kind: string; reason: string }[];
  contact: Contact;
  onRecompute: () => void;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          Suggested actions
        </div>
        <button
          type="button"
          onClick={onRecompute}
          className="rounded p-0.5 text-gray-400 hover:bg-gray-100"
          title="Recompute"
        >
          <RefreshCw className="h-3 w-3" />
        </button>
      </div>
      {actions.length === 0 ? (
        <div className="text-[11px] italic text-gray-500">
          Nothing suggested right now — relationship looks healthy.
        </div>
      ) : (
        <ul className="space-y-2">
          {actions.map((a, i) => (
            <li key={i} className="rounded-md border border-blue-100 bg-blue-50 px-2 py-1.5 text-xs text-blue-900">
              <div className="flex items-center gap-1 font-medium capitalize">
                <Sparkles className="h-3 w-3" /> {a.kind.replace('-', ' ')}
              </div>
              <div className="mt-0.5">{a.reason}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EnrichmentPanel({
  suggestions,
  onSuggest,
  onAccept,
  onReject,
  loading,
}: {
  suggestions: { id: string; field: string; value: string; source: { module: string; sourceId: string; snippet: string }; confidence: number }[];
  onSuggest: () => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  loading: boolean;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
          AI enrichment
        </div>
        <button
          type="button"
          onClick={onSuggest}
          disabled={loading}
          className="flex items-center gap-1 rounded-md border border-blue-200 bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700 hover:bg-blue-100 disabled:opacity-50"
        >
          {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
          Suggest
        </button>
      </div>
      {suggestions.length === 0 ? (
        <div className="text-[11px] italic text-gray-500">
          No pending suggestions. Sources stay platform-internal — no external lookup.
        </div>
      ) : (
        <ul className="space-y-2">
          {suggestions.map((s) => (
            <li key={s.id} className="rounded-md border border-blue-100 bg-blue-50/40 px-2 py-1.5 text-[11px]">
              <div className="font-medium text-gray-900">
                {s.field}: <span className="text-blue-700">{s.value}</span>
              </div>
              <div className="mt-0.5 italic text-gray-600">
                Source: {s.source.module} · "{s.source.snippet}"
              </div>
              <div className="mt-1 flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onAccept(s.id)}
                  className="rounded bg-blue-600 px-2 py-0.5 text-[10px] font-medium text-white hover:bg-blue-700"
                >
                  Accept
                </button>
                <button
                  type="button"
                  onClick={() => onReject(s.id)}
                  className="rounded border border-gray-200 px-2 py-0.5 text-[10px] text-gray-600 hover:bg-gray-100"
                >
                  Reject
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function LinkedContactsPanel({ contact }: { contact: Contact }) {
  const contactsMap = useContactsStore(selectContactsMap);
  const links = contact.linkedContactIds.map((l) => ({
    rel: l.relationship,
    contact: contactsMap[l.id],
  })).filter((l) => l.contact);
  if (links.length === 0) return null;
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-3">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
        Linked contacts
      </div>
      <ul className="space-y-1.5">
        {links.map((l) => (
          <li key={l.contact!.id} className="flex items-center justify-between gap-2 text-xs">
            <ContactChip contact={l.contact!} />
            <span className="text-[10px] text-gray-500">{l.rel}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
