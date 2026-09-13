import type { IntentKey } from "@/lib/api/owner/calls";
import { useVoiceT } from "@/i18n/voice";

export function IntentChip({ intent }: { intent: IntentKey }) {
  const t = useVoiceT("voice-calls");
  if (intent === "unknown") return <span className="text-xs text-[var(--text-3)]">{t("intent.unknown")}</span>;
  return <span className="inline-flex rounded-full border border-[var(--line)] px-2 py-0.5 text-xs text-[var(--text-2)]">{t(`intent.${intent}`)}</span>;
}
