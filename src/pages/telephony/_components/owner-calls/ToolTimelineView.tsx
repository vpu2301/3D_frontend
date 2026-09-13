/** Call detail → Aktionen (FE7 §1, de-badged): owner names, outcome, who approved, result summary. */
import { useVoiceT } from "@/i18n/voice";
import { useSession } from "@/stores/session";
import { formatTime } from "@/lib/format";
import { toolLabel } from "@/content/tool-labels";
import { outcomeOf, tierOf } from "@/pages/telephony/_lib/toolMeta";
import type { CallAction, ToolTimelineEntry } from "@/lib/api/voice";
import TierChip from "./TierChip";

const TONE: Record<string, string> = { done: "text-[var(--ok-fg)]", denied: "text-[var(--text-2)]", failed: "text-[var(--bad-fg)]", deferred: "text-[var(--warn-fg)]" };
const OUTCOME_BY_TYPE: Record<string, string> = { tool_execute: "ok", tool_denied: "denied", tool_deferred: "deferred" };

/** The timeline when the server sends one; otherwise derived from the actions (older backends). */
export function timelineOf(timeline: ToolTimelineEntry[] | undefined, actions: CallAction[]): ToolTimelineEntry[] {
  if (timeline && timeline.length) return timeline;
  return actions
    .filter((a) => a.action_type in OUTCOME_BY_TYPE)
    .map((a) => ({ tool: a.tool_name ?? "", tier: String(a.tier ?? ""), outcome: OUTCOME_BY_TYPE[a.action_type]!, ms: 0, approval: String(a.approval_mode ?? ""), reason: String(a.deny_reason ?? ""), timestamp: a.timestamp ?? "" }));
}

export default function ToolTimelineView({ timeline, actions }: { timeline?: ToolTimelineEntry[]; actions: CallAction[] }) {
  const t = useVoiceT("voice-tools");
  const locale = useSession((s) => s.locale);
  const lang = locale === "en" ? "en" : "de";
  const entries = timelineOf(timeline, actions);
  const summaries = new Map(actions.map((a) => [`${a.tool_name}@${a.timestamp}`, a.output_summary]));
  if (entries.length === 0) return <p className="text-sm text-[var(--text-2)]">{t("timeline.none")}</p>;
  return (
    <ol className="divide-y divide-[var(--line)]" data-testid="tool-timeline">
      {entries.map((e, i) => {
        const outcome = outcomeOf(e);
        const label = toolLabel(e.tool, lang);
        const summary = summaries.get(`${e.tool}@${e.timestamp}`);
        return (
          <li key={`${e.tool}-${i}`} data-outcome={outcome} className="flex flex-wrap items-start gap-2 py-2 text-sm">
            <span className="w-14 shrink-0 tabular-nums text-[var(--text-3)]">{e.timestamp ? formatTime(e.timestamp, { locale }) : ""}</span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-medium text-[var(--ink)]">{label.name}</span>
                <TierChip tier={tierOf(e)} />
                <span className={TONE[outcome]}>{t(`outcome.${outcome}`)}</span>
                {e.approval && <span className="text-xs text-[var(--text-3)]">{t(`approvalBy.${e.approval}`, { defaultValue: e.approval })}</span>}
                {e.ms > 0 && <span className="text-xs text-[var(--text-3)]">{t("timeline.duration", { ms: e.ms })}</span>}
              </span>
              {summary && <span className="block text-[var(--text-2)]">{summary}</span>}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
