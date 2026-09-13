import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { CallOutcome } from "@/lib/api/voice";
import { formatDate } from "@/lib/format";
import { useVoiceT } from "@/i18n/voice";

/** Summary card (FE2 §2): outcome paragraph, Zugesagt, Wichtige Fakten, nächste Schritte. */
const DOT = " · ";

export default function OutcomeSummary({ outcome }: { outcome: CallOutcome | null }) {
  const t = useVoiceT("voice-calls");
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      /* clipboard blocked */
    }
  };
  const when = (w: string | null) => {
    if (!w) return "";
    const d = new Date(w);
    return Number.isNaN(d.getTime()) ? w : formatDate(d);
  };

  return (
    <section aria-labelledby="summary-title" className="rounded-[14px] border border-[var(--line)] bg-[var(--paper)] p-4 sm:p-5">
      <h2 id="summary-title" className="mb-2 text-sm font-semibold text-[var(--ink)]">
        {t("summary.title")}
      </h2>
      {!outcome ? (
        <p className="text-sm text-[var(--text-2)]">{t("summary.none")}</p>
      ) : (
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-[var(--ink)]">{outcome.task_result || outcome.outcome}</p>
          {outcome.commitments && outcome.commitments.length > 0 && (
            <div>
              <h3 className="plat-eyebrow !text-[var(--text-3)] mb-1">{t("summary.commitments")}</h3>
              <ul className="space-y-1 text-sm text-[var(--text-1)]">
                {outcome.commitments.map((c, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="shrink-0 rounded-full bg-[var(--sand)] px-2 text-xs text-[var(--text-2)]">{t(`summary.who.${c.who}`, { defaultValue: c.who })}</span>
                    <span>
                      {c.what}
                      {c.when && <span className="text-[var(--text-3)]">{DOT}{when(c.when)}</span>}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {outcome.key_facts && outcome.key_facts.length > 0 && (
            <div>
              <h3 className="plat-eyebrow !text-[var(--text-3)] mb-1">{t("summary.facts")}</h3>
              <ul className="list-disc space-y-0.5 pl-5 text-sm text-[var(--text-1)]">
                {outcome.key_facts.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>
            </div>
          )}
          {outcome.follow_up_suggestions && outcome.follow_up_suggestions.length > 0 && (
            <div>
              <h3 className="plat-eyebrow !text-[var(--text-3)] mb-1">{t("summary.next")}</h3>
              <ul className="space-y-1.5">
                {outcome.follow_up_suggestions.map((s, i) => (
                  <li key={i} className="flex items-center justify-between gap-2 rounded-[10px] bg-[var(--sand)] px-3 py-2 text-sm">
                    <span className="min-w-0 text-[var(--text-1)]">{s.reason}</span>
                    <button
                      type="button"
                      onClick={() => copy(`s${i}`, s.reason)}
                      aria-label={copied === `s${i}` ? t("summary.copied") : t("summary.copy")}
                      className="shrink-0 rounded-[8px] p-1 text-[var(--text-3)] hover:text-[var(--ink)]"
                    >
                      {copied === `s${i}` ? <Check className="h-4 w-4 text-[var(--ok-fg)]" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
