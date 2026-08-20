import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';
import {
  useMailStore,
  selectEmails,
  selectThreads,
} from '@/pages/mail/_hooks/use-mail-store';
import { useMailUiStore } from '@/pages/mail/_hooks/use-mail-ui-store';
import { generateDailyDigest, type MockMailDigest } from '@/pages/docs/_lib/mockAi';

export default function DailyDigestCard() {
  const emailsMap = useMailStore(selectEmails);
  const threadsMap = useMailStore(selectThreads);
  const dismissed = useMailUiStore((s) => s.digestDismissed);
  const dismiss = useMailUiStore((s) => s.dismissDigest);
  const setSelectedThreadId = useMailUiStore((s) => s.setSelectedThreadId);
  const navigate = useNavigate();
  const [digest, setDigest] = useState<MockMailDigest | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    const since = Date.now() - 86_400_000; // 24h
    const emails = Object.values(emailsMap).map((e) => ({
      id: e.id,
      threadId: e.threadId,
      fromName: e.from.name,
      fromEmail: e.from.email,
      toEmails: e.to.map((r) => r.email),
      subject: e.subject,
      snippet: e.snippet,
      receivedAt: e.receivedAt,
      direction: e.direction,
      hasAttachment: e.attachments.length > 0,
      category: e.category,
      labels: e.labels,
    }));
    const threads = Object.values(threadsMap).map((t) => ({
      id: t.id,
      subject: t.subject,
      participantEmails: t.participants.map((p) => p.email),
      emailIds: t.emailIds,
    }));
    setLoading(true);
    generateDailyDigest(emails, threads, since)
      .then(setDigest)
      .catch(() => setDigest(null))
      .finally(() => setLoading(false));
  }, [emailsMap, threadsMap, dismissed]);

  if (dismissed) return null;
  if (loading || !digest) {
    return (
      <div className="mx-3 mt-2 mb-1 rounded-[12px] border border-[var(--line-soft)] bg-white px-4 py-3">
        <div className="plat-eyebrow flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Daily digest
        </div>
        <p className="mt-1 text-xs text-[var(--text-4)]">{loading ? 'Reading your last 24 hours…' : 'Nothing new since yesterday.'}</p>
      </div>
    );
  }

  if (digest.totalImportant === 0 && digest.meetings === 0) return null;

  return (
    <div className="mx-3 mt-2 mb-1 rounded-[12px] border border-[var(--line-soft)] bg-white px-4 py-3">
      <div className="mb-1 flex items-center justify-between">
        <div className="plat-eyebrow flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Since yesterday
        </div>
        <button
          type="button"
          onClick={dismiss}
          className="rounded-[6px] p-0.5 text-[var(--text-4)] transition-colors hover:bg-[rgba(20,22,26,0.06)] hover:text-[var(--ink)]"
          aria-label="Dismiss"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
      <p className="text-sm text-[var(--text-1)]">
        <span className="font-medium">{digest.totalImportant}</span> important
        {digest.needReplyToday > 0 && <> · <span className="font-medium">{digest.needReplyToday}</span> need replies</>}
        {digest.meetings > 0 && <> · <span className="font-medium">{digest.meetings}</span> calendar</>}
        {digest.fyi > 0 && <> · <span className="font-medium">{digest.fyi}</span> FYI</>}
      </p>
      {digest.highlights.length > 0 && (
        <ul className="mt-1.5 space-y-0.5">
          {digest.highlights.map((h, i) => (
            <li key={i}>
              <button
                type="button"
                onClick={() => {
                  setSelectedThreadId(h.threadId);
                  navigate(`/mail/thread/${h.threadId}`);
                }}
                className="text-left text-xs text-[var(--text-2)] transition-colors hover:text-[var(--ink)] hover:underline"
              >
                · {h.reason}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
