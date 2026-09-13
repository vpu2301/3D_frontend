import { useCostsToday } from "@/lib/api/owner/overview";
import { formatCurrency } from "@/lib/format";
import { useCan } from "@/stores/session";
import { useVoiceT } from "@/i18n/voice";
import { OverviewCard } from "./OverviewCard";

// The cost tracker bills in US dollars; the currency is data, not copy.
const COST_CURRENCY = "USD";

/** One number, hidden entirely when the API is not exposed to this session. */
export default function CostsCard() {
  const t = useVoiceT("voice-overview");
  const allowed = useCan("view_costs");
  const costs = useCostsToday(allowed);
  if (!allowed || costs.isLoading || costs.isError || !costs.data) return null;
  const total = costs.data.total_usd ?? 0;
  return (
    <OverviewCard title={t("costs.title")} testId="card-costs">
      <p className="plat-num text-2xl font-semibold text-[var(--ink)]">{formatCurrency(total, COST_CURRENCY)}</p>
      <p className="mt-1 text-xs text-[var(--text-3)]">
        {typeof costs.data.request_count === "number" ? `${t("costs.requests", { count: costs.data.request_count })} · ` : ""}
        {t("costs.hint")}
      </p>
    </OverviewCard>
  );
}
