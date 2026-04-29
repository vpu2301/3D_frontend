import { create } from 'zustand';
import type {
  Email,
  Thread,
  Label,
  Draft,
  SmartView,
  FilterRule,
  CategoryOverride,
  MailCategory,
  ContactRef,
  AttachmentRef,
  ContextRef,
  ThreadSummary,
} from '@/pages/mail/_lib/types';
import { mailStorage, newId } from '@/pages/mail/_lib/storage';
import { buildMailSeed } from '@/pages/mail/_lib/seed';
import { buildThreads } from '@/pages/mail/_lib/threading';

const SEED_FLAG = 'seed:v1';

interface MailState {
  emails: Record<string, Email>;
  threads: Record<string, Thread>;
  labels: Record<string, Label>;
  drafts: Record<string, Draft>;
  views: Record<string, SmartView>;
  rules: Record<string, FilterRule>;
  overrides: CategoryOverride[];
  loaded: boolean;

  load: () => Promise<void>;

  // Email mutations
  markRead: (id: string, value?: boolean) => Promise<void>;
  markThreadRead: (threadId: string, value?: boolean) => Promise<void>;
  toggleStar: (id: string) => Promise<void>;
  archive: (emailIds: string[]) => Promise<void>;
  unarchive: (emailIds: string[]) => Promise<void>;
  trash: (emailIds: string[]) => Promise<void>;
  restore: (emailIds: string[]) => Promise<void>;
  moveToSpam: (emailIds: string[]) => Promise<void>;
  notSpam: (emailIds: string[]) => Promise<void>;
  setCategory: (emailIds: string[], category: MailCategory, asOverride?: boolean) => Promise<void>;
  applyLabel: (emailIds: string[], labelId: string) => Promise<void>;
  removeLabel: (emailIds: string[], labelId: string) => Promise<void>;
  snooze: (emailIds: string[], until: number) => Promise<void>;
  unsnooze: (emailIds: string[]) => Promise<void>;
  setThreadSummary: (threadId: string, summary: ThreadSummary) => Promise<void>;

  // Drafts
  createDraft: (init?: Partial<Draft>) => Promise<Draft>;
  updateDraft: (id: string, patch: Partial<Draft>) => Promise<void>;
  deleteDraft: (id: string) => Promise<void>;

  // Send
  sendDraft: (draftId: string, opts?: { scheduleFor?: number }) => Promise<Email>;
  cancelScheduled: (emailId: string) => Promise<void>;

  // Body access
  getBody: (emailId: string) => Promise<string | undefined>;

  // Labels
  createLabel: (init: Omit<Label, 'id'>) => Promise<Label>;
  deleteLabel: (id: string) => Promise<void>;

  // Views
  upsertView: (view: SmartView) => Promise<void>;
  deleteView: (id: string) => Promise<void>;
  setViewEmailIds: (id: string, ids: string[]) => Promise<void>;

  // Rules
  upsertRule: (rule: FilterRule) => Promise<void>;
  deleteRule: (id: string) => Promise<void>;

  // Overrides (category training)
  addOverride: (override: CategoryOverride) => Promise<void>;
}

export const useMailStore = create<MailState>((set, get) => ({
  emails: {},
  threads: {},
  labels: {},
  drafts: {},
  views: {},
  rules: {},
  overrides: [],
  loaded: false,

  load: async () => {
    if (get().loaded) return;
    const seedFlag = await mailStorage.getMeta<string>(SEED_FLAG);
    if (!seedFlag) {
      const seed = buildMailSeed();
      await Promise.all([
        ...seed.emails.map((e) => mailStorage.putEmail(e)),
        ...Object.entries(seed.bodies).map(([id, body]) => mailStorage.putBody(id, body)),
        ...seed.threads.map((t) => mailStorage.putThread(t)),
        ...seed.labels.map((l) => mailStorage.putLabel(l)),
        ...seed.drafts.map((d) => mailStorage.putDraft(d)),
        ...seed.views.map((v) => mailStorage.putView(v)),
      ]);
      await mailStorage.setMeta(SEED_FLAG, '1');
    }

    const [emails, threads, labels, drafts, views, rules, overrides] = await Promise.all([
      mailStorage.listEmails(),
      mailStorage.listThreads(),
      mailStorage.listLabels(),
      mailStorage.listDrafts(),
      mailStorage.listViews(),
      mailStorage.listRules(),
      mailStorage.listOverrides(),
    ]);

    set({
      emails: indexBy(emails),
      threads: indexBy(threads),
      labels: indexBy(labels),
      drafts: indexBy(drafts),
      views: indexBy(views),
      rules: indexBy(rules),
      overrides,
      loaded: true,
    });
  },

  markRead: async (id, value = true) => {
    await mutateEmail(get, set, id, (e) => ({ ...e, isRead: value }));
    await refreshThread(get, set, id);
  },

  markThreadRead: async (threadId, value = true) => {
    const thread = get().threads[threadId];
    if (!thread) return;
    for (const eid of thread.emailIds) {
      await mutateEmail(get, set, eid, (e) => ({ ...e, isRead: value }));
    }
    await refreshThread(get, set, thread.emailIds[0]);
  },

  toggleStar: async (id) => {
    await mutateEmail(get, set, id, (e) => ({ ...e, isStarred: !e.isStarred }));
  },

  archive: async (emailIds) => {
    for (const id of emailIds) {
      await mutateEmail(get, set, id, (e) => ({
        ...e,
        folderOverride: 'archive',
        isRead: true,
      }));
    }
  },

  unarchive: async (emailIds) => {
    for (const id of emailIds) {
      await mutateEmail(get, set, id, (e) => ({ ...e, folderOverride: undefined }));
    }
  },

  trash: async (emailIds) => {
    for (const id of emailIds) {
      await mutateEmail(get, set, id, (e) => ({ ...e, isTrashed: true, isRead: true }));
    }
  },

  restore: async (emailIds) => {
    for (const id of emailIds) {
      await mutateEmail(get, set, id, (e) => ({ ...e, isTrashed: false }));
    }
  },

  moveToSpam: async (emailIds) => {
    for (const id of emailIds) {
      await mutateEmail(get, set, id, (e) => ({ ...e, isSpam: true, folderOverride: 'spam' }));
    }
  },

  notSpam: async (emailIds) => {
    for (const id of emailIds) {
      await mutateEmail(get, set, id, (e) => ({
        ...e,
        isSpam: false,
        folderOverride: e.folderOverride === 'spam' ? undefined : e.folderOverride,
      }));
    }
  },

  setCategory: async (emailIds, category, asOverride) => {
    for (const id of emailIds) {
      const e = get().emails[id];
      if (!e) continue;
      await mutateEmail(get, set, id, (cur) => ({ ...cur, category }));
      if (asOverride) {
        const override: CategoryOverride = {
          fromPattern: e.from.email,
          targetCategory: category,
          createdAt: Date.now(),
        };
        const next = [
          ...get().overrides.filter((o) => o.fromPattern !== override.fromPattern),
          override,
        ];
        set({ overrides: next });
        await mailStorage.setOverrides(next);
      }
    }
  },

  applyLabel: async (emailIds, labelId) => {
    for (const id of emailIds) {
      await mutateEmail(get, set, id, (e) =>
        e.labels.includes(labelId) ? e : { ...e, labels: [...e.labels, labelId] },
      );
    }
  },

  removeLabel: async (emailIds, labelId) => {
    for (const id of emailIds) {
      await mutateEmail(get, set, id, (e) => ({
        ...e,
        labels: e.labels.filter((l) => l !== labelId),
      }));
    }
  },

  snooze: async (emailIds, until) => {
    for (const id of emailIds) {
      await mutateEmail(get, set, id, (e) => ({ ...e, isSnoozed: true, snoozeUntil: until }));
    }
  },

  unsnooze: async (emailIds) => {
    for (const id of emailIds) {
      await mutateEmail(get, set, id, (e) => ({
        ...e,
        isSnoozed: false,
        snoozeUntil: undefined,
      }));
    }
  },

  setThreadSummary: async (threadId, summary) => {
    const thread = get().threads[threadId];
    if (!thread) return;
    const updated: Thread = { ...thread, summary };
    await mailStorage.putThread(updated);
    set({ threads: { ...get().threads, [threadId]: updated } });
  },

  // ---- Drafts ----

  createDraft: async (init = {}) => {
    const now = Date.now();
    const draft: Draft = {
      id: `draft_${newId()}`,
      subject: init.subject ?? '',
      to: init.to ?? [],
      cc: init.cc ?? [],
      bcc: init.bcc ?? [],
      bodyHtml: init.bodyHtml ?? '',
      attachments: init.attachments ?? [],
      contextRefs: init.contextRefs ?? [],
      threadId: init.threadId,
      replyToEmailId: init.replyToEmailId,
      scheduledFor: init.scheduledFor,
      createdAt: now,
      updatedAt: now,
    };
    await mailStorage.putDraft(draft);
    set({ drafts: { ...get().drafts, [draft.id]: draft } });
    return draft;
  },

  updateDraft: async (id, patch) => {
    const cur = get().drafts[id];
    if (!cur) return;
    const updated: Draft = { ...cur, ...patch, updatedAt: Date.now() };
    await mailStorage.putDraft(updated);
    set({ drafts: { ...get().drafts, [id]: updated } });
  },

  deleteDraft: async (id) => {
    await mailStorage.deleteDraft(id);
    const { [id]: _, ...rest } = get().drafts;
    set({ drafts: rest });
  },

  sendDraft: async (draftId, opts) => {
    const draft = get().drafts[draftId];
    if (!draft) throw new Error('Draft not found');

    const now = Date.now();
    const me: ContactRef = { name: 'You', email: 'me@3days.ai', contactId: 'me' };
    const threadId = draft.threadId ?? `t_${newId()}`;
    const emailId = `e_${newId()}`;

    const email: Email = {
      id: emailId,
      threadId,
      inReplyTo: draft.replyToEmailId,
      from: me,
      to: draft.to,
      cc: draft.cc,
      bcc: draft.bcc,
      subject: draft.subject,
      snippet: stripHtml(draft.bodyHtml).slice(0, 140),
      hasHtml: true,
      attachments: draft.attachments,
      contextRefs: draft.contextRefs,
      receivedAt: now,
      sentAt: opts?.scheduleFor ?? now,
      direction: 'outgoing',
      labels: [],
      isRead: true,
      isStarred: false,
      isSnoozed: false,
      isScheduled: !!opts?.scheduleFor,
      scheduledFor: opts?.scheduleFor,
      isDraft: false,
      isSpam: false,
      isTrashed: false,
    };

    await mailStorage.putEmail(email);
    await mailStorage.putBody(emailId, draft.bodyHtml);
    await mailStorage.deleteDraft(draftId);

    // Recompute thread for this id
    const allEmails = Object.values({ ...get().emails, [email.id]: email });
    const updatedThreads = buildThreads(allEmails);
    const threadByid = indexBy(updatedThreads);
    // Persist all changed threads
    await Promise.all(updatedThreads.map((t) => mailStorage.putThread(t)));

    const { [draftId]: _, ...remainingDrafts } = get().drafts;
    set({
      emails: { ...get().emails, [email.id]: email },
      threads: threadByid,
      drafts: remainingDrafts,
    });

    return email;
  },

  cancelScheduled: async (emailId) => {
    const e = get().emails[emailId];
    if (!e || !e.isScheduled) return;
    // Convert back to a draft
    await mailStorage.deleteEmail(emailId);
    const { [emailId]: _, ...rest } = get().emails;
    const draft: Draft = {
      id: `draft_${newId()}`,
      subject: e.subject,
      to: e.to,
      cc: e.cc,
      bcc: e.bcc,
      bodyHtml: (await mailStorage.getBody(emailId)) ?? '',
      attachments: e.attachments,
      contextRefs: e.contextRefs,
      threadId: e.threadId,
      replyToEmailId: e.inReplyTo,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await mailStorage.putDraft(draft);
    set({
      emails: rest,
      drafts: { ...get().drafts, [draft.id]: draft },
    });
  },

  getBody: async (emailId) => mailStorage.getBody(emailId),

  // ---- Labels ----

  createLabel: async (init) => {
    const label: Label = { id: `lbl_${newId()}`, ...init };
    await mailStorage.putLabel(label);
    set({ labels: { ...get().labels, [label.id]: label } });
    return label;
  },

  deleteLabel: async (id) => {
    await mailStorage.deleteLabel(id);
    const { [id]: _, ...rest } = get().labels;
    set({ labels: rest });
  },

  // ---- Views ----

  upsertView: async (view) => {
    await mailStorage.putView(view);
    set({ views: { ...get().views, [view.id]: view } });
  },

  deleteView: async (id) => {
    await mailStorage.deleteView(id);
    const { [id]: _, ...rest } = get().views;
    set({ views: rest });
  },

  setViewEmailIds: async (id, ids) => {
    const v = get().views[id];
    if (!v) return;
    const updated: SmartView = { ...v, emailIds: ids, lastComputedAt: Date.now() };
    await mailStorage.putView(updated);
    set({ views: { ...get().views, [id]: updated } });
  },

  // ---- Rules ----

  upsertRule: async (rule) => {
    await mailStorage.putRule(rule);
    set({ rules: { ...get().rules, [rule.id]: rule } });
  },

  deleteRule: async (id) => {
    await mailStorage.deleteRule(id);
    const { [id]: _, ...rest } = get().rules;
    set({ rules: rest });
  },

  // ---- Overrides ----

  addOverride: async (override) => {
    const next = [
      ...get().overrides.filter((o) => o.fromPattern !== override.fromPattern),
      override,
    ];
    await mailStorage.setOverrides(next);
    set({ overrides: next });
  },
}));

// ----- Helpers -----

function indexBy<T extends { id: string }>(list: T[]): Record<string, T> {
  const out: Record<string, T> = {};
  for (const item of list) out[item.id] = item;
  return out;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

async function mutateEmail(
  get: () => MailState,
  set: (s: Partial<MailState>) => void,
  id: string,
  patch: (e: Email) => Email,
) {
  const cur = get().emails[id];
  if (!cur) return;
  const updated = patch(cur);
  await mailStorage.putEmail(updated);
  set({ emails: { ...get().emails, [id]: updated } });
}

async function refreshThread(
  get: () => MailState,
  set: (s: Partial<MailState>) => void,
  emailId: string,
) {
  const e = get().emails[emailId];
  if (!e) return;
  const list = Object.values(get().emails).filter((m) => m.threadId === e.threadId);
  if (list.length === 0) return;
  const sorted = [...list].sort((a, b) => a.receivedAt - b.receivedAt);
  const last = sorted[sorted.length - 1];
  const t = get().threads[e.threadId];
  if (!t) return;
  const updated: Thread = {
    ...t,
    hasUnread: list.some((m) => !m.isRead && m.direction === 'incoming'),
    lastMessageAt: last.receivedAt,
    awaitingReplyFromUser: last.direction === 'incoming' && !last.isTrashed,
    awaitingReplyFromOthers:
      last.direction === 'outgoing' &&
      Date.now() - (last.sentAt ?? last.receivedAt) > 3 * 86_400_000,
  };
  await mailStorage.putThread(updated);
  set({ threads: { ...get().threads, [e.threadId]: updated } });
}

// ---- Selectors ----
export const selectEmails = (s: MailState) => s.emails;
export const selectThreads = (s: MailState) => s.threads;
export const selectLabels = (s: MailState) => s.labels;
export const selectDrafts = (s: MailState) => s.drafts;
export const selectViews = (s: MailState) => s.views;

/** Visible-emails predicate: hides snoozed, scheduled, spam (when not in those folders). */
export function isInInbox(e: Email): boolean {
  if (e.isTrashed) return false;
  if (e.isSpam) return false;
  if (e.folderOverride === 'archive') return false;
  if (e.folderOverride === 'spam') return false;
  if (e.isSnoozed && e.snoozeUntil && e.snoozeUntil > Date.now()) return false;
  if (e.isScheduled) return false;
  if (e.isDraft) return false;
  if (e.direction === 'outgoing') return false;
  return true;
}
