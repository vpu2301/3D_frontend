import type { Email, Thread, ContactRef } from './types';

/** Reconstruct threads from an email list using inReplyTo / references and subject normalization. */
export function buildThreads(emails: Email[]): Thread[] {
  // Map email id -> threadId. If email has explicit threadId, trust it; otherwise group by normalized subject.
  const byId = new Map(emails.map((e) => [e.id, e]));
  const threadMap = new Map<string, Email[]>();
  for (const e of emails) {
    const tid = e.threadId;
    if (!threadMap.has(tid)) threadMap.set(tid, []);
    threadMap.get(tid)!.push(e);
  }

  const threads: Thread[] = [];
  for (const [tid, list] of threadMap) {
    list.sort((a, b) => a.receivedAt - b.receivedAt);
    const last = list[list.length - 1];
    const participantsByEmail = new Map<string, ContactRef>();
    for (const m of list) {
      participantsByEmail.set(m.from.email, m.from);
      for (const r of [...m.to, ...m.cc]) participantsByEmail.set(r.email, r);
    }
    const hasUnread = list.some((m) => !m.isRead && m.direction === 'incoming');
    const hasAttachments = list.some((m) => m.attachments.length > 0);

    // Awaiting reply heuristic: last message direction tells us who owes a reply.
    const awaitingReplyFromUser = last.direction === 'incoming' && !last.isTrashed;
    const awaitingReplyFromOthers =
      last.direction === 'outgoing' &&
      Date.now() - (last.sentAt ?? last.receivedAt) > 3 * 86_400_000;

    threads.push({
      id: tid,
      subject: stripReplyPrefix(list[0].subject),
      participants: Array.from(participantsByEmail.values()),
      emailIds: list.map((e) => e.id),
      lastMessageAt: last.receivedAt,
      hasUnread,
      hasAttachments,
      awaitingReplyFromUser,
      awaitingReplyFromOthers,
    });
  }

  threads.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  return threads;
}

export function stripReplyPrefix(subject: string): string {
  return subject.replace(/^(re|fwd?|fw):\s*/i, '').trim() || '(no subject)';
}

export function emailsForThread(thread: Thread, byId: Record<string, Email>): Email[] {
  return thread.emailIds
    .map((id) => byId[id])
    .filter((e): e is Email => Boolean(e))
    .sort((a, b) => a.receivedAt - b.receivedAt);
}
