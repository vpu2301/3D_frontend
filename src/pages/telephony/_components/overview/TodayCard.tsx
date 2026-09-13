import { useTodayStats } from "@/lib/api/owner/overview";
import { formatNumber } from "@/lib/format";
import { useVoiceT } from "@/i18n/voice";
import { Skeleton } from "@/components/ui/skeleton";
import { ComputedBadge } from "./ComputedBadge";
import { OverviewCard } from "./OverviewCard";

export default function TodayCard() {
  const t = useVoiceT("voice-overview");
  const { stats, isLoading, isError } = useTodayStats();

  const cells: Array<[string, number]> = [
    [t("today.inbound"), stats.inbound],
    [t("today.outbound"), stats.outbound],
    [t("today.answered"), stats.answered],
    [t("today.missed"), stats.missed],
    [t("today.afterHours"), stats.afterHours],
    [t("today.bookings"), stats.bookings],
    [t("today.messages"), stats.messages],
  ];

  return (
    <OverviewCard title={t("today.title")} badge={<ComputedBadge />} testId="card-today">
      {isLoading ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7">
          {cells.map(([label]) => (
            <Skeleton key={label} className="h-14 rounded-[10px]" />
          ))}
        </div>
      ) : isError ? (
        <p className="text-sm text-[var(--text-3)]">{t("loadError")}</p>
      ) : (
        <>
          <dl className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-7">
            {cells.map(([label, value]) => (
              <div key={label} className="rounded-[10px] bg-[var(--sand)] px-3 py-2">
                <dt className="truncate text-[11px] text-[var(--text-3)]">{label}</dt>
                <dd className="plat-num text-xl font-semibold text-[var(--ink)]">{formatNumber(value, { maximumFractionDigits: 0 })}</dd>
              </div>
            ))}
          </dl>
          {stats.total === 0 && stats.messages === 0 && <p className="mt-3 text-xs text-[var(--text-3)]">{t("today.empty")}</p>}
        </>
      )}
    </OverviewCard>
  );
}
