import { useEffect, useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { useMailStore } from '@/pages/mail/_hooks/use-mail-store';
import { summarizeThread } from '@/pages/docs/_lib/mockAi';
import type { Email, Thread, ThreadSummary as ThreadSummaryType } from '@/pages/mail/_lib/types';

interface Props {
  thread: Thread;
  emails: Email[];
}

export default function ThreadSummary({ thread, emails }: Props) {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState<ThreadSummaryType | undefined>(thread.summary);
  const setThreadSummary = useMailStore((s) => s.setThreadSummary);

  useEffect(() => {
    setSummary(thread.summary);
  }, [thread.id, thread.summary]);

  const generate = async () => {
    setLoading(true);
    try {
      const sum = await summarizeThread(
        { id: thread.id, subject: thread.subject, participantEmails: thread.participants.map((p) => p.email), emailIds: thread.emailIds },
        emails.map((e) => ({
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
        })),
      );
      const next: ThreadSummaryType = { ...sum, generatedAt: Date.now() };
      setSummary(next);
      await setThreadSummary(thread.id, next);
    } catch {
      /* mock failure */
    } finally {
      setLoading(false);
    }
  };

  if (emails.length < 3) return null;

  return (
    <div className="mx-6 my-3 rounded-[12px] border border-[var(--line-soft)] bg-[var(--sand)] px-4 py-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="plat-eyebrow flex items-center gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          AI summary
        </div>
        <button
          type="button"
          onClick={generate}
          disabled={loading}
          className="flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium text-[var(--text-3)] transition-colors hover:bg-white hover:text-[var(--ink)] disabled:opacity-50"
        >
          <RefreshCw className={loading ? 'h-3 w-3 animate-spin' : 'h-3 w-3'} />
          {summary ? 'Regenerate' : 'Generate'}
        </button>
      </div>

      {!summary ? (
        <p className="text-sm text-[var(--text-4)]">
          Click <span className="font-medium">Generate</span> to summarize this {emails.length}-message thread.
        </p>
      ) : (
        <div className="space-y-2">
          <p className="text-sm text-[var(--text-1)]">{summary.paragraph}</p>
          {summary.keyPoints.length > 0 && (
            <div>
              <p className="plat-eyebrow">Key points</p>
              <ul className="mt-1 list-disc pl-5 text-sm text-[var(--text-1)]">
                {summary.keyPoints.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
          {summary.openQuestions.length > 0 && (
            <div>
              <p className="plat-eyebrow">Open questions</p>
              <ul className="mt-1 list-disc pl-5 text-sm text-[var(--text-1)]">
                {summary.openQuestions.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
