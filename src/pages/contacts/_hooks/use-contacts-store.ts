import { create } from 'zustand';
import type {
  Contact,
  Group,
  ContactSmartView,
  EnrichmentSuggestion,
  DuplicateGroup,
  Interaction,
  RelationshipStrength,
  AiSummary,
  StalenessState,
  Cadence,
  LinkedContact,
  LabeledValue,
} from '@/pages/contacts/_lib/types';
import { contactsStorage, newId } from '@/pages/contacts/_lib/storage';
import { buildContactsSeed, SEED_USER_DOMAIN } from '@/pages/contacts/_lib/seed';
import { findDuplicateGroupsSync } from '@/pages/contacts/_lib/duplicateDetect';
import { computeRelationshipStrengthSync } from '@/pages/contacts/_lib/relationshipStrength';
import { aggregateInteractionsForContact } from '@/pages/contacts/_lib/interactions';

const SEED_FLAG = 'seed:v1';

interface ContactsState {
  contacts: Record<string, Contact>;
  groups: Record<string, Group>;
  smartViews: Record<string, ContactSmartView>;
  enrichment: Record<string, EnrichmentSuggestion>;
  duplicates: Record<string, DuplicateGroup>;
  loaded: boolean;

  load: () => Promise<void>;

  // ---- CRUD ----
  createContact: (init?: Partial<Contact>) => Promise<Contact>;
  updateContact: (id: string, patch: Partial<Contact>) => Promise<void>;
  trashContact: (id: string) => Promise<void>;
  restoreContact: (id: string) => Promise<void>;
  permanentlyDelete: (id: string) => Promise<void>;
  toggleStar: (id: string) => Promise<void>;

  /** Multi-value field helpers — preserve `primary` semantics. */
  addEmail: (id: string, value: string, label?: string) => Promise<void>;
  removeEmail: (id: string, value: string) => Promise<void>;
  setPrimaryEmail: (id: string, value: string) => Promise<void>;
  addPhone: (id: string, value: string, label?: string) => Promise<void>;

  addTag: (id: string, tag: string) => Promise<void>;
  removeTag: (id: string, tag: string) => Promise<void>;
  setLinkedContacts: (id: string, links: LinkedContact[]) => Promise<void>;

  // ---- Groups ----
  createGroup: (name: string, init?: Partial<Group>) => Promise<Group>;
  updateGroup: (id: string, patch: Partial<Group>) => Promise<void>;
  deleteGroup: (id: string) => Promise<void>;
  addContactsToGroup: (groupId: string, contactIds: string[]) => Promise<void>;
  removeContactFromGroup: (groupId: string, contactId: string) => Promise<void>;

  // ---- Smart views ----
  upsertSmartView: (v: ContactSmartView) => Promise<void>;
  setSmartViewContacts: (id: string, contactIds: string[]) => Promise<void>;
  deleteSmartView: (id: string) => Promise<void>;

  // ---- Enrichment ----
  upsertEnrichment: (e: EnrichmentSuggestion) => Promise<void>;
  acceptEnrichment: (id: string) => Promise<void>;
  rejectEnrichment: (id: string) => Promise<void>;

  // ---- Duplicates ----
  recomputeDuplicates: () => Promise<void>;
  markNotDuplicate: (id: string) => Promise<void>;
  /** Merge B into A — A is the survivor. Returns the surviving contact. */
  mergeContacts: (
    survivorId: string,
    mergedId: string,
    fieldChoices: MergeChoices,
  ) => Promise<Contact>;

  // ---- AI side-effects (write to the contact record) ----
  setAiSummary: (id: string, summary: AiSummary) => Promise<void>;
  setRelationshipStrength: (id: string, s: RelationshipStrength) => Promise<void>;
  setStaleness: (id: string, s: StalenessState) => Promise<void>;

  /** Recompute the relationship strength for a single contact from the live
   * cross-module interaction view. Cheap and deterministic. */
  refreshRelationshipStrength: (id: string) => Promise<void>;

  /** Aggregated interactions for a contact, derived from the other module
   * stores (Docs/Notes/Drive/Todo). Mail is ready to consume but the Mail
   * module doesn't exist in this build. */
  getInteractionsForContact: (id: string) => Interaction[];

  clearAll: () => Promise<void>;
}

export interface MergeChoices {
  firstName?: 'a' | 'b';
  lastName?: 'a' | 'b';
  displayName?: 'a' | 'b';
  organization?: 'a' | 'b';
  title?: 'a' | 'b';
  pronouns?: 'a' | 'b';
  photoUrl?: 'a' | 'b';
  /** For multi-value fields, default is union. */
  emails?: 'union' | 'a' | 'b';
  phones?: 'union' | 'a' | 'b';
  urls?: 'union' | 'a' | 'b';
  addresses?: 'union' | 'a' | 'b';
  tags?: 'union' | 'a' | 'b';
  groupIds?: 'union' | 'a' | 'b';
  notes?: 'a' | 'b' | 'concat';
}

export const useContactsStore = create<ContactsState>((set, get) => ({
  contacts: {},
  groups: {},
  smartViews: {},
  enrichment: {},
  duplicates: {},
  loaded: false,

  load: async () => {
    if (get().loaded) return;
    const flag = await contactsStorage.getMeta<string>(SEED_FLAG);
    if (!flag) {
      const seed = buildContactsSeed();
      await Promise.all([
        ...seed.contacts.map((c) => contactsStorage.putContact(c)),
        ...seed.groups.map((g) => contactsStorage.putGroup(g)),
        ...seed.smartViews.map((v) => contactsStorage.putSmartView(v)),
      ]);
      await contactsStorage.setMeta(SEED_FLAG, '1');
    }
    const [contactsList, groupsList, smartViewsList, enrichmentList, duplicatesList] = await Promise.all([
      contactsStorage.listContacts(),
      contactsStorage.listGroups(),
      contactsStorage.listSmartViews(),
      contactsStorage.listEnrichment(),
      contactsStorage.listDuplicates(),
    ]);
    const contacts: Record<string, Contact> = {};
    for (const c of contactsList) contacts[c.id] = c;
    const groups: Record<string, Group> = {};
    for (const g of groupsList) groups[g.id] = g;
    const smartViews: Record<string, ContactSmartView> = {};
    for (const v of smartViewsList) smartViews[v.id] = v;
    const enrichment: Record<string, EnrichmentSuggestion> = {};
    for (const e of enrichmentList) enrichment[e.id] = e;
    const duplicates: Record<string, DuplicateGroup> = {};
    for (const d of duplicatesList) duplicates[d.id] = d;
    set({ contacts, groups, smartViews, enrichment, duplicates, loaded: true });
    // Seed auto-detected duplicates on first load.
    if (Object.keys(duplicates).length === 0) {
      await get().recomputeDuplicates();
    }
  },

  createContact: async (init) => {
    const c: Contact = {
      id: newId('contact'),
      firstName: '',
      lastName: '',
      emails: [],
      phones: [],
      urls: [],
      addresses: [],
      importantDates: [],
      customFields: [],
      tags: [],
      groupIds: [],
      starred: false,
      isExternal: false,
      linkedContactIds: [],
      source: 'manual',
      trashed: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...init,
    };
    // Mark external if applicable
    const primary = c.emails.find((e) => e.primary) ?? c.emails[0];
    if (primary?.value && c.isExternal === false) {
      const domain = primary.value.split('@')[1]?.toLowerCase() ?? '';
      c.isExternal = !!domain && domain !== SEED_USER_DOMAIN;
    }
    await contactsStorage.putContact(c);
    set((s) => ({ contacts: { ...s.contacts, [c.id]: c } }));
    return c;
  },

  updateContact: async (id, patch) => {
    const cur = get().contacts[id];
    if (!cur) return;
    const next: Contact = { ...cur, ...patch, updatedAt: Date.now() };
    await contactsStorage.putContact(next);
    set((s) => ({ contacts: { ...s.contacts, [id]: next } }));
  },

  trashContact: async (id) => {
    await get().updateContact(id, { trashed: true });
  },
  restoreContact: async (id) => {
    await get().updateContact(id, { trashed: false });
  },
  permanentlyDelete: async (id) => {
    await contactsStorage.deleteContact(id);
    set((s) => {
      const { [id]: _, ...rest } = s.contacts;
      return { contacts: rest };
    });
  },

  toggleStar: async (id) => {
    const cur = get().contacts[id];
    if (!cur) return;
    await get().updateContact(id, { starred: !cur.starred });
  },

  addEmail: async (id, value, label = 'work') => {
    const cur = get().contacts[id];
    if (!cur) return;
    const v = value.trim();
    if (!v || cur.emails.some((e) => e.value.toLowerCase() === v.toLowerCase())) return;
    const next: LabeledValue[] = [
      ...cur.emails,
      { value: v, label, primary: cur.emails.length === 0 },
    ];
    await get().updateContact(id, { emails: next });
  },
  removeEmail: async (id, value) => {
    const cur = get().contacts[id];
    if (!cur) return;
    const next = cur.emails.filter((e) => e.value !== value);
    if (next.length > 0 && !next.some((e) => e.primary)) next[0].primary = true;
    await get().updateContact(id, { emails: next });
  },
  setPrimaryEmail: async (id, value) => {
    const cur = get().contacts[id];
    if (!cur) return;
    await get().updateContact(id, {
      emails: cur.emails.map((e) => ({ ...e, primary: e.value === value })),
    });
  },
  addPhone: async (id, value, label = 'mobile') => {
    const cur = get().contacts[id];
    if (!cur) return;
    const next: LabeledValue[] = [
      ...cur.phones,
      { value, label, primary: cur.phones.length === 0 },
    ];
    await get().updateContact(id, { phones: next });
  },

  addTag: async (id, tag) => {
    const cur = get().contacts[id];
    if (!cur) return;
    const t = tag.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (!t || cur.tags.includes(t)) return;
    await get().updateContact(id, { tags: [...cur.tags, t] });
  },
  removeTag: async (id, tag) => {
    const cur = get().contacts[id];
    if (!cur) return;
    await get().updateContact(id, { tags: cur.tags.filter((x) => x !== tag) });
  },
  setLinkedContacts: async (id, links) => {
    await get().updateContact(id, { linkedContactIds: links });
  },

  createGroup: async (name, init) => {
    const g: Group = {
      id: newId('group'),
      name,
      contactIds: [],
      ...init,
    };
    await contactsStorage.putGroup(g);
    set((s) => ({ groups: { ...s.groups, [g.id]: g } }));
    return g;
  },
  updateGroup: async (id, patch) => {
    const cur = get().groups[id];
    if (!cur) return;
    const next = { ...cur, ...patch };
    await contactsStorage.putGroup(next);
    set((s) => ({ groups: { ...s.groups, [id]: next } }));
  },
  deleteGroup: async (id) => {
    await contactsStorage.deleteGroup(id);
    set((s) => {
      const { [id]: _, ...rest } = s.groups;
      return { groups: rest };
    });
    // Clean group ref from contacts
    for (const c of Object.values(get().contacts)) {
      if (c.groupIds.includes(id)) {
        await get().updateContact(c.id, {
          groupIds: c.groupIds.filter((x) => x !== id),
        });
      }
    }
  },
  addContactsToGroup: async (groupId, contactIds) => {
    const g = get().groups[groupId];
    if (!g) return;
    const next = { ...g, contactIds: Array.from(new Set([...g.contactIds, ...contactIds])) };
    await contactsStorage.putGroup(next);
    set((s) => ({ groups: { ...s.groups, [groupId]: next } }));
    for (const cid of contactIds) {
      const c = get().contacts[cid];
      if (!c) continue;
      if (c.groupIds.includes(groupId)) continue;
      await get().updateContact(cid, { groupIds: [...c.groupIds, groupId] });
    }
  },
  removeContactFromGroup: async (groupId, contactId) => {
    const g = get().groups[groupId];
    if (!g) return;
    const next = { ...g, contactIds: g.contactIds.filter((x) => x !== contactId) };
    await contactsStorage.putGroup(next);
    set((s) => ({ groups: { ...s.groups, [groupId]: next } }));
    const c = get().contacts[contactId];
    if (c) {
      await get().updateContact(contactId, {
        groupIds: c.groupIds.filter((x) => x !== groupId),
      });
    }
  },

  upsertSmartView: async (v) => {
    await contactsStorage.putSmartView(v);
    set((s) => ({ smartViews: { ...s.smartViews, [v.id]: v } }));
  },
  setSmartViewContacts: async (id, contactIds) => {
    const cur = get().smartViews[id];
    if (!cur) return;
    const next = { ...cur, contactIds, lastComputedAt: Date.now() };
    await contactsStorage.putSmartView(next);
    set((s) => ({ smartViews: { ...s.smartViews, [id]: next } }));
  },
  deleteSmartView: async (id) => {
    await contactsStorage.deleteSmartView(id);
    set((s) => {
      const { [id]: _, ...rest } = s.smartViews;
      return { smartViews: rest };
    });
  },

  upsertEnrichment: async (e) => {
    await contactsStorage.putEnrichment(e);
    set((s) => ({ enrichment: { ...s.enrichment, [e.id]: e } }));
  },
  acceptEnrichment: async (id) => {
    const e = get().enrichment[id];
    if (!e) return;
    const c = get().contacts[e.contactId];
    if (!c) return;
    // Apply the field if not already set.
    const patch: Partial<Contact> = {};
    if (e.field === 'organization' && !c.organization) patch.organization = e.value;
    else if (e.field === 'title' && !c.title) patch.title = e.value;
    else if (e.field === 'pronouns' && !c.pronouns) patch.pronouns = e.value;
    if (Object.keys(patch).length > 0) {
      await get().updateContact(c.id, patch);
    }
    const next: EnrichmentSuggestion = { ...e, status: 'accepted' };
    await contactsStorage.putEnrichment(next);
    set((s) => ({ enrichment: { ...s.enrichment, [id]: next } }));
  },
  rejectEnrichment: async (id) => {
    const e = get().enrichment[id];
    if (!e) return;
    const next: EnrichmentSuggestion = { ...e, status: 'rejected' };
    await contactsStorage.putEnrichment(next);
    set((s) => ({ enrichment: { ...s.enrichment, [id]: next } }));
  },

  recomputeDuplicates: async () => {
    const found = findDuplicateGroupsSync(Object.values(get().contacts));
    // Preserve previously resolved groups (merged or marked not-duplicate).
    const existing = Object.values(get().duplicates);
    const resolvedKeyset = new Set<string>();
    for (const e of existing) {
      if (e.resolution !== 'pending') {
        resolvedKeyset.add(e.contactIds.slice().sort().join('|'));
      }
    }
    // Clear previously pending dupes; keep resolved ones.
    for (const e of existing) {
      if (e.resolution === 'pending') {
        await contactsStorage.deleteDuplicate(e.id);
      }
    }
    set((s) => ({
      duplicates: Object.fromEntries(
        Object.entries(s.duplicates).filter(([, d]) => d.resolution !== 'pending'),
      ),
    }));
    for (const g of found) {
      const key = g.contactIds.slice().sort().join('|');
      if (resolvedKeyset.has(key)) continue;
      await contactsStorage.putDuplicate(g);
      set((s) => ({ duplicates: { ...s.duplicates, [g.id]: g } }));
    }
  },
  markNotDuplicate: async (id) => {
    const cur = get().duplicates[id];
    if (!cur) return;
    const next: DuplicateGroup = { ...cur, resolution: 'not-duplicate' };
    await contactsStorage.putDuplicate(next);
    set((s) => ({ duplicates: { ...s.duplicates, [id]: next } }));
  },

  mergeContacts: async (survivorId, mergedId, choices) => {
    const a = get().contacts[survivorId];
    const b = get().contacts[mergedId];
    if (!a || !b) throw new Error('Contacts not found for merge');

    const pick = <T,>(field: 'a' | 'b' | undefined, av: T, bv: T): T => {
      if (field === 'a') return av;
      if (field === 'b') return bv;
      // Default: prefer truthy value, falling back to A.
      return av || bv;
    };
    const union = (
      sel: 'union' | 'a' | 'b' | undefined,
      av: LabeledValue[],
      bv: LabeledValue[],
    ): LabeledValue[] => {
      if (sel === 'a') return av;
      if (sel === 'b') return bv;
      const map = new Map<string, LabeledValue>();
      for (const x of [...av, ...bv]) {
        map.set(x.value.toLowerCase(), x);
      }
      const arr = Array.from(map.values());
      // Re-mark primary
      if (!arr.some((x) => x.primary) && arr[0]) arr[0].primary = true;
      return arr;
    };
    const unionStrings = (sel: 'union' | 'a' | 'b' | undefined, av: string[], bv: string[]): string[] => {
      if (sel === 'a') return av;
      if (sel === 'b') return bv;
      return Array.from(new Set([...av, ...bv]));
    };

    const merged: Contact = {
      ...a,
      firstName: pick(choices.firstName, a.firstName, b.firstName),
      lastName: pick(choices.lastName, a.lastName, b.lastName),
      displayName: pick(choices.displayName, a.displayName, b.displayName),
      organization: pick(choices.organization, a.organization, b.organization),
      title: pick(choices.title, a.title, b.title),
      pronouns: pick(choices.pronouns, a.pronouns, b.pronouns),
      photoUrl: pick(choices.photoUrl, a.photoUrl, b.photoUrl),
      emails: union(choices.emails, a.emails, b.emails),
      phones: union(choices.phones, a.phones, b.phones),
      urls: union(choices.urls, a.urls, b.urls),
      addresses: union(choices.addresses, a.addresses, b.addresses),
      tags: unionStrings(choices.tags, a.tags, b.tags),
      groupIds: unionStrings(choices.groupIds, a.groupIds, b.groupIds),
      notes:
        choices.notes === 'b'
          ? b.notes
          : choices.notes === 'concat' && a.notes && b.notes
            ? { type: 'doc', content: [...((a.notes as any).content ?? []), ...((b.notes as any).content ?? [])] }
            : a.notes ?? b.notes,
      importantDates: [...a.importantDates, ...b.importantDates],
      customFields: [...a.customFields, ...b.customFields],
      linkedContactIds: [...a.linkedContactIds, ...b.linkedContactIds].filter(
        (l, i, arr) => arr.findIndex((x) => x.id === l.id) === i && l.id !== mergedId,
      ),
      source: 'merged',
      updatedAt: Date.now(),
    };

    // Update groups: replace mergedId with survivorId.
    for (const g of Object.values(get().groups)) {
      if (g.contactIds.includes(mergedId)) {
        const next: Group = {
          ...g,
          contactIds: Array.from(
            new Set(g.contactIds.map((x) => (x === mergedId ? survivorId : x))),
          ),
        };
        await contactsStorage.putGroup(next);
        set((s) => ({ groups: { ...s.groups, [g.id]: next } }));
      }
    }
    // Update other contacts' linkedContactIds
    for (const c of Object.values(get().contacts)) {
      if (c.id === mergedId || c.id === survivorId) continue;
      if (c.linkedContactIds.some((l) => l.id === mergedId)) {
        await get().updateContact(c.id, {
          linkedContactIds: c.linkedContactIds
            .map((l) => (l.id === mergedId ? { ...l, id: survivorId } : l))
            .filter((l, i, arr) => arr.findIndex((x) => x.id === l.id) === i),
        });
      }
    }
    // Update smart views
    for (const v of Object.values(get().smartViews)) {
      if (v.contactIds.includes(mergedId)) {
        const next: ContactSmartView = {
          ...v,
          contactIds: Array.from(
            new Set(v.contactIds.map((x) => (x === mergedId ? survivorId : x))),
          ),
        };
        await contactsStorage.putSmartView(next);
        set((s) => ({ smartViews: { ...s.smartViews, [v.id]: next } }));
      }
    }
    // Mark any duplicate group containing this pair as merged.
    for (const d of Object.values(get().duplicates)) {
      if (d.contactIds.includes(mergedId) && d.contactIds.includes(survivorId)) {
        const next: DuplicateGroup = { ...d, resolution: 'merged' };
        await contactsStorage.putDuplicate(next);
        set((s) => ({ duplicates: { ...s.duplicates, [d.id]: next } }));
      }
    }

    // Persist survivor and remove merged
    await contactsStorage.putContact(merged);
    await contactsStorage.deleteContact(mergedId);
    set((s) => {
      const { [mergedId]: _, ...rest } = s.contacts;
      return { contacts: { ...rest, [survivorId]: merged } };
    });
    return merged;
  },

  setAiSummary: async (id, summary) => {
    await get().updateContact(id, { aiSummary: summary });
  },
  setRelationshipStrength: async (id, s) => {
    await get().updateContact(id, { relationshipStrength: s });
  },
  setStaleness: async (id, staleness) => {
    await get().updateContact(id, { staleness });
  },
  refreshRelationshipStrength: async (id) => {
    const c = get().contacts[id];
    if (!c) return;
    const interactions = get().getInteractionsForContact(id);
    const strength = computeRelationshipStrengthSync(c, interactions);
    await get().updateContact(id, { relationshipStrength: strength });
  },

  getInteractionsForContact: (id) => {
    const c = get().contacts[id];
    if (!c) return [];
    const emails = c.emails.map((e) => e.value);
    return aggregateInteractionsForContact(id, emails);
  },

  clearAll: async () => {
    await contactsStorage.clearAll();
    set({
      contacts: {},
      groups: {},
      smartViews: {},
      enrichment: {},
      duplicates: {},
      loaded: false,
    });
  },
}));

export const selectContactsMap = (s: ContactsState) => s.contacts;
export const selectGroupsMap = (s: ContactsState) => s.groups;
export const selectSmartViewsMap = (s: ContactsState) => s.smartViews;

export function deriveContactTags(contacts: Contact[]): { name: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const c of contacts) {
    if (c.trashed) continue;
    for (const t of c.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

export function displayName(c: Contact): string {
  return c.displayName?.trim() || `${c.firstName} ${c.lastName}`.trim() || 'Untitled contact';
}

export function initialsOf(c: Contact): string {
  const f = c.firstName?.[0] ?? '';
  const l = c.lastName?.[0] ?? '';
  return (f + l).toUpperCase() || (c.displayName?.[0] ?? '?').toUpperCase();
}
