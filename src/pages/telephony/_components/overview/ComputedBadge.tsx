import { InfoTag } from "@/pages/telephony/_components/shared/InfoTag";
import { useVoiceT } from "@/i18n/voice";

/** "berechnet im Browser" — real data the app derived itself (FE1 §3, FE10: a fact chip, not a mock badge). */
export function ComputedBadge() {
  const t = useVoiceT("voice-overview");
  return <InfoTag kind="computed" label={t("computed")} title={t("computedHint")} />;
}
