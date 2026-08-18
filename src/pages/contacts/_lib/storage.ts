import { get, set, del, keys, createStore } from 'idb-keyval';
import type {
  Contact,
  Group,
  ContactSmartView,
  EnrichmentSuggestion,
  DuplicateGroup,
} from './types';

export { newId } from '@/pages/docs/_lib/storage';

const contactsStore = createStore('ai-contacts-contacts', 'kv');
const groupsStore = createStore('ai-contacts-groups', 'kv');
const smartViewsStore = createStore('ai-contacts-smart', 'kv');
const enrichmentStore = createStore('ai-contacts-enrichment', 'kv');
const duplicatesStore = createStore('ai-contacts-dupes', 'kv');
const metaStore = createStore('ai-contacts-meta', 'kv');

export const contactsStorage = {
  async putContact(c: Contact) {
    return set(c.id, c, contactsStore);
  },
  async deleteContact(id: string) {
    return del(id, contactsStore);
  },
  async listContacts(): Promise<Contact[]> {
    const ks = await keys(contactsStore);
    const list = await Promise.all(ks.map((k) => get<Contact>(k as string, contactsStore)));
    return list.filter((c): c is Contact => Boolean(c));
  },

  async putGroup(g: Group) {
    return set(g.id, g, groupsStore);
  },
  async deleteGroup(id: string) {
    return del(id, groupsStore);
  },
  async listGroups(): Promise<Group[]> {
    const ks = await keys(groupsStore);
    const list = await Promise.all(ks.map((k) => get<Group>(k as string, groupsStore)));
    return list.filter((g): g is Group => Boolean(g));
  },

  async putSmartView(v: ContactSmartView) {
    return set(v.id, v, smartViewsStore);
  },
  async deleteSmartView(id: string) {
    return del(id, smartViewsStore);
  },
  async listSmartViews(): Promise<ContactSmartView[]> {
    const ks = await keys(smartViewsStore);
    const list = await Promise.all(ks.map((k) => get<ContactSmartView>(k as string, smartViewsStore)));
    return list.filter((v): v is ContactSmartView => Boolean(v));
  },

  async putEnrichment(e: EnrichmentSuggestion) {
    return set(e.id, e, enrichmentStore);
  },
  async deleteEnrichment(id: string) {
    return del(id, enrichmentStore);
  },
  async listEnrichment(): Promise<EnrichmentSuggestion[]> {
    const ks = await keys(enrichmentStore);
    const list = await Promise.all(ks.map((k) => get<EnrichmentSuggestion>(k as string, enrichmentStore)));
    return list.filter((e): e is EnrichmentSuggestion => Boolean(e));
  },

  async putDuplicate(d: DuplicateGroup) {
    return set(d.id, d, duplicatesStore);
  },
  async deleteDuplicate(id: string) {
    return del(id, duplicatesStore);
  },
  async listDuplicates(): Promise<DuplicateGroup[]> {
    const ks = await keys(duplicatesStore);
    const list = await Promise.all(ks.map((k) => get<DuplicateGroup>(k as string, duplicatesStore)));
    return list.filter((d): d is DuplicateGroup => Boolean(d));
  },

  async getMeta<T>(key: string): Promise<T | undefined> {
    return get<T>(key, metaStore);
  },
  async setMeta<T>(key: string, value: T): Promise<void> {
    return set(key, value, metaStore);
  },

  async clearAll() {
    const stores = [contactsStore, groupsStore, smartViewsStore, enrichmentStore, duplicatesStore, metaStore];
    for (const s of stores) {
      const ks = await keys(s);
      await Promise.all(ks.map((k) => del(k as string, s)));
    }
  },
};
