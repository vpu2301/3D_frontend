import { get, set, del, keys, createStore } from 'idb-keyval';
import type {
  Email,
  Thread,
  Label,
  Draft,
  SmartView,
  FilterRule,
  CategoryOverride,
} from './types';

export { newId } from '@/pages/docs/_lib/storage';

const emailsStore = createStore('ai-mail-emails', 'kv');
const bodiesStore = createStore('ai-mail-bodies', 'kv');
const threadsStore = createStore('ai-mail-threads', 'kv');
const labelsStore = createStore('ai-mail-labels', 'kv');
const draftsStore = createStore('ai-mail-drafts', 'kv');
const viewsStore = createStore('ai-mail-views', 'kv');
const rulesStore = createStore('ai-mail-rules', 'kv');
const overridesStore = createStore('ai-mail-overrides', 'kv');
const metaStore = createStore('ai-mail-meta', 'kv');

async function listAll<T>(store: ReturnType<typeof createStore>): Promise<T[]> {
  const ks = await keys(store);
  const items = await Promise.all(ks.map((k) => get<T>(k as string, store)));
  return items.filter((x): x is T => Boolean(x));
}

export const mailStorage = {
  async getEmail(id: string) {
    return get<Email>(id, emailsStore);
  },
  async putEmail(email: Email) {
    return set(email.id, email, emailsStore);
  },
  async deleteEmail(id: string) {
    await del(id, emailsStore);
    await del(id, bodiesStore);
  },
  async listEmails() {
    return listAll<Email>(emailsStore);
  },

  async getBody(emailId: string) {
    return get<string>(emailId, bodiesStore);
  },
  async putBody(emailId: string, html: string) {
    return set(emailId, html, bodiesStore);
  },

  async getThread(id: string) {
    return get<Thread>(id, threadsStore);
  },
  async putThread(thread: Thread) {
    return set(thread.id, thread, threadsStore);
  },
  async deleteThread(id: string) {
    return del(id, threadsStore);
  },
  async listThreads() {
    return listAll<Thread>(threadsStore);
  },

  async getLabel(id: string) {
    return get<Label>(id, labelsStore);
  },
  async putLabel(label: Label) {
    return set(label.id, label, labelsStore);
  },
  async deleteLabel(id: string) {
    return del(id, labelsStore);
  },
  async listLabels() {
    return listAll<Label>(labelsStore);
  },

  async getDraft(id: string) {
    return get<Draft>(id, draftsStore);
  },
  async putDraft(draft: Draft) {
    return set(draft.id, draft, draftsStore);
  },
  async deleteDraft(id: string) {
    return del(id, draftsStore);
  },
  async listDrafts() {
    return listAll<Draft>(draftsStore);
  },

  async getView(id: string) {
    return get<SmartView>(id, viewsStore);
  },
  async putView(view: SmartView) {
    return set(view.id, view, viewsStore);
  },
  async deleteView(id: string) {
    return del(id, viewsStore);
  },
  async listViews() {
    return listAll<SmartView>(viewsStore);
  },

  async getRule(id: string) {
    return get<FilterRule>(id, rulesStore);
  },
  async putRule(rule: FilterRule) {
    return set(rule.id, rule, rulesStore);
  },
  async deleteRule(id: string) {
    return del(id, rulesStore);
  },
  async listRules() {
    return listAll<FilterRule>(rulesStore);
  },

  async listOverrides(): Promise<CategoryOverride[]> {
    const v = await get<CategoryOverride[]>('overrides', overridesStore);
    return v ?? [];
  },
  async setOverrides(list: CategoryOverride[]) {
    return set('overrides', list, overridesStore);
  },

  async getMeta<T>(key: string) {
    return get<T>(key, metaStore);
  },
  async setMeta<T>(key: string, value: T) {
    return set(key, value, metaStore);
  },

  async clearAll() {
    const stores = [
      emailsStore,
      bodiesStore,
      threadsStore,
      labelsStore,
      draftsStore,
      viewsStore,
      rulesStore,
      overridesStore,
      metaStore,
    ];
    for (const s of stores) {
      const ks = await keys(s);
      await Promise.all(ks.map((k) => del(k as string, s)));
    }
  },
};
