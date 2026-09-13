import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { CallDetail } from "@/lib/api/voice";
import { outcomeOf } from "@/pages/telephony/_lib/outcome";
import { isLive } from "@/lib/api/owner/calls";
import { useVoiceT } from "@/i18n/voice";

/** Auftrag tab (outbound only): the verbatim briefing plus an adherence line from the outcome. */
const COLON = ": ";

export default function BriefingSummary({ call }: { call: CallDetail }) {
  const t = useVoiceT("voice-calls");
  const [copied, setCopied] = useState(false);
  const briefing = call.briefing ?? null;
  if (!briefing?.task) return <p className="text-sm text-[var(--text-2)]">{t("briefing.none")}</p>;
  const task = briefing.task;
  const outcome = outcomeOf(call);
  const happened = call.duration_seconds > 0 || isLive(call);
  const adherence = !happened ? t("briefing.adherenceNone") : outcome?.task_result ? t("briefing.adherenceDone", { result: outcome.task_result }) : t("briefing.adherenceMissing");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(task);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked */
    }
  };
  return (
    <div className="space-y-3">
      <blockquote className="whitespace-pre-wrap rounded-[12px] bg-[var(--sand)] p-3 text-sm text-[var(--ink)]">{briefing.task}</blockquote>
      <div className="flex flex-wrap items-center gap-3 text-xs text-[var(--text-3)]">
        {briefing.source && (
          <span>
            {t("briefing.source")}{COLON}{briefing.source}
          </span>
        )}
        <button type="button" onClick={copy} className="inline-flex items-center gap-1 rounded-[8px] border border-[var(--line)] px-2 py-1 text-[var(--text-2)] hover:bg-[var(--sand)]">
          {copied ? <Check className="h-3.5 w-3.5 text-[var(--ok-fg)]" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
          {copied ? t("briefing.copied") : t("briefing.copy")}
        </button>
      </div>
      <p className={happened && outcome?.task_result ? "text-sm text-green-800" : "text-sm text-amber-800"}>{adherence}</p>
    </div>
  );
}
