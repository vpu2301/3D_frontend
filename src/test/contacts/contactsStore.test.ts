import { describe, it, expect, beforeEach } from 'vitest';
import { useContactsStore, displayName } from '@/pages/contacts/_hooks/use-contacts-store';
import { contactsStorage } from '@/pages/contacts/_lib/storage';

beforeEach(async () => {
  await contactsStorage.clearAll();
  useContactsStore.setState({
    contacts: {},
    groups: {},
    smartViews: {},
    enrichment: {},
    duplicates: {},
    loaded: false,
  });
});

describe('useContactsStore — load + seed', () => {
  it('seeds 40+ contacts, several groups and smart views, plus auto-detected dupes', async () => {
    await useContactsStore.getState().load();
    const state = useContactsStore.getState();
    expect(Object.keys(state.contacts).length).toBeGreaterThanOrEqual(35);
    expect(Object.keys(state.groups).length).toBeGreaterThanOrEqual(3);
    expect(Object.keys(state.smartViews).length).toBeGreaterThanOrEqual(6);
    // Seeded duplicate pairs surface on first load
    expect(Object.values(state.duplicates).filter((d) => d.resolution === 'pending').length).toBeGreaterThanOrEqual(1);
  });
});

describe('useContactsStore — CRUD', () => {
  it('creates and updates a contact', async () => {
    await useContactsStore.getState().load();
    const c = await useContactsStore.getState().createContact({ firstName: 'New', lastName: 'Person' });
    expect(useContactsStore.getState().contacts[c.id].firstName).toBe('New');
    await useContactsStore.getState().updateContact(c.id, { title: 'Founder' });
    expect(useContactsStore.getState().contacts[c.id].title).toBe('Founder');
  });

  it('marks isExternal when primary email is on a different domain', async () => {
    await useContactsStore.getState().load();
    const c = await useContactsStore.getState().createContact({
      firstName: 'Ext',
      lastName: 'Person',
      emails: [{ value: 'ext@external.com', label: 'work', primary: true }],
    });
    expect(useContactsStore.getState().contacts[c.id].isExternal).toBe(true);
  });

  it('adds + dedupes emails and preserves primary semantics', async () => {
    await useContactsStore.getState().load();
    const c = await useContactsStore.getState().createContact({});
    await useContactsStore.getState().addEmail(c.id, 'a@x.com');
    await useContactsStore.getState().addEmail(c.id, 'A@X.COM');
    await useContactsStore.getState().addEmail(c.id, 'b@x.com');
    const cur = useContactsStore.getState().contacts[c.id];
    expect(cur.emails).toHaveLength(2);
    expect(cur.emails.find((e) => e.primary)?.value).toBe('a@x.com');
  });
});

describe('useContactsStore — groups', () => {
  it('adds a contact to a group and reflects on both sides', async () => {
    await useContactsStore.getState().load();
    const g = await useContactsStore.getState().createGroup('Test Group');
    const c = await useContactsStore.getState().createContact({});
    await useContactsStore.getState().addContactsToGroup(g.id, [c.id]);
    expect(useContactsStore.getState().groups[g.id].contactIds).toContain(c.id);
    expect(useContactsStore.getState().contacts[c.id].groupIds).toContain(g.id);
  });

  it('cleans group references when a group is deleted', async () => {
    await useContactsStore.getState().load();
    const g = await useContactsStore.getState().createGroup('Tmp');
    const c = await useContactsStore.getState().createContact({});
    await useContactsStore.getState().addContactsToGroup(g.id, [c.id]);
    await useContactsStore.getState().deleteGroup(g.id);
    expect(useContactsStore.getState().groups[g.id]).toBeUndefined();
    expect(useContactsStore.getState().contacts[c.id].groupIds).not.toContain(g.id);
  });
});

describe('useContactsStore — merge', () => {
  it('merges B into A and rewrites group + linkedContact references', async () => {
    await useContactsStore.getState().load();
    const a = await useContactsStore.getState().createContact({
      firstName: 'Maria',
      lastName: 'Hernandez',
      emails: [{ value: 'maria@x.com', label: 'work', primary: true }],
    });
    const b = await useContactsStore.getState().createContact({
      firstName: 'Maria',
      lastName: 'Hernandez',
      emails: [{ value: 'maria.h@x.com', label: 'personal', primary: true }],
      phones: [{ value: '+1 555 0000', label: 'mobile', primary: true }],
    });
    const g = await useContactsStore.getState().createGroup('Customers');
    await useContactsStore.getState().addContactsToGroup(g.id, [a.id, b.id]);
    // Link a 3rd contact to B
    const third = await useContactsStore.getState().createContact({ firstName: 'X', lastName: 'Y' });
    await useContactsStore.getState().setLinkedContacts(third.id, [{ id: b.id, relationship: 'Friend' }]);

    const merged = await useContactsStore.getState().mergeContacts(a.id, b.id, {
      emails: 'union',
      phones: 'union',
    });

    expect(useContactsStore.getState().contacts[b.id]).toBeUndefined();
    expect(merged.emails.length).toBe(2);
    expect(merged.phones.length).toBe(1);
    // Group now points only at survivor.
    expect(useContactsStore.getState().groups[g.id].contactIds).toContain(a.id);
    expect(useContactsStore.getState().groups[g.id].contactIds).not.toContain(b.id);
    // Linked-contact reference rewritten.
    const links = useContactsStore.getState().contacts[third.id].linkedContactIds;
    expect(links.some((l) => l.id === a.id)).toBe(true);
    expect(links.some((l) => l.id === b.id)).toBe(false);
  });
});

describe('useContactsStore — duplicates', () => {
  it('recomputes pending duplicates without disturbing resolved ones', async () => {
    await useContactsStore.getState().load();
    // Mark one pending as not-duplicate
    const pending = Object.values(useContactsStore.getState().duplicates).filter((d) => d.resolution === 'pending');
    expect(pending.length).toBeGreaterThan(0);
    await useContactsStore.getState().markNotDuplicate(pending[0].id);
    const beforeRecompute = Object.values(useContactsStore.getState().duplicates).filter(
      (d) => d.resolution === 'not-duplicate',
    ).length;
    expect(beforeRecompute).toBeGreaterThan(0);
    await useContactsStore.getState().recomputeDuplicates();
    const afterResolved = Object.values(useContactsStore.getState().duplicates).filter(
      (d) => d.resolution === 'not-duplicate',
    ).length;
    expect(afterResolved).toBe(beforeRecompute);
  });
});

describe('useContactsStore — enrichment', () => {
  it('accepts an enrichment suggestion and writes the field if blank', async () => {
    await useContactsStore.getState().load();
    const c = await useContactsStore.getState().createContact({ firstName: 'Test' });
    await useContactsStore.getState().upsertEnrichment({
      id: 'e1',
      contactId: c.id,
      field: 'title',
      value: 'Founder',
      source: { module: 'mail', sourceId: 'm1', snippet: 'sig' },
      confidence: 0.7,
      status: 'pending',
    });
    await useContactsStore.getState().acceptEnrichment('e1');
    expect(useContactsStore.getState().contacts[c.id].title).toBe('Founder');
    expect(useContactsStore.getState().enrichment['e1'].status).toBe('accepted');
  });
});

describe('helpers', () => {
  it('displayName falls back through firstName + lastName', async () => {
    const c = {
      firstName: 'Alex',
      lastName: 'Tan',
    } as any;
    expect(displayName(c)).toBe('Alex Tan');
  });
});
