/**
 * Übersicht v1 (FE1 §3): Heute · Jetzt · Braucht Sie · Status · Kosten heute.
 * Stacked on phones, two columns from `md`. No charts, no developer
 * vocabulary; the `?debug` flag reveals engine chips and the ops link.
 */
import { useVoiceT } from "@/i18n/voice";
import TodayCard from "./TodayCard";
import ActiveCallsCard from "./ActiveCallsCard";
import AttentionCard from "./AttentionCard";
import StatusCard from "./StatusCard";
import CostsCard from "./CostsCard";

export default function OverviewView() {
  const t = useVoiceT("voice-overview");
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6 md:px-8">
        <h1 className="mb-4 text-xl font-semibold tracking-tight text-[var(--ink)] sm:text-2xl">{t("title")}</h1>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <TodayCard />
          </div>
          <ActiveCallsCard />
          <AttentionCard />
          <StatusCard />
          <CostsCard />
        </div>
      </div>
    </div>
  );
}
