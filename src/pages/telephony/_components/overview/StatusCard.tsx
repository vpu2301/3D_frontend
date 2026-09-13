import { useSearchParams } from "react-router-dom";
import { useVoiceStatus } from "@/lib/api/voice";
import {
  doctorHints,
  telephonyFacts,
  useCalendarConnection,
  useDoctorSummary,
} from "@/lib/api/owner/overview";
import { useVoiceT } from "@/i18n/voice";
import { OverviewCard } from "./OverviewCard";

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <dt className="text-sm text-[var(--text-3)]">{label}</dt>
      <dd className="text-right text-sm text-[var(--ink)]">{children}</dd>
    </div>
  );
}

export default function StatusCard() {
  const t = useVoiceT("voice-overview");
  const status = useVoiceStatus();
  const doctor = useDoctorSummary();
  const calendar = useCalendarConnection();
  const [params] = useSearchParams();
  const founder = params.has("debug");

  const facts = telephonyFacts(status.data);
  const configured = Boolean(status.data?.voice_configured);
  const hints = doctorHints(doctor.data);

  return (
    <OverviewCard title={t("status.title")} testId="card-status">
      <dl className="divide-y divide-[var(--line-soft)]">
        <Row label={t("status.number")}>{facts.numberMasked ?? (configured ? "—" : t("status.notConfigured"))}</Row>
        <Row label={t("status.mode")}>{t(`status.modes.${facts.mode}`)}</Row>
        <Row label={t("status.calendar")}>
          {calendar.calendar ? t("status.calendarConnected", { name: calendar.calendar.name ?? calendar.calendar.slug ?? "" }) : t("status.calendarMissing")}
        </Row>
        <Row label={t("status.check")}>
          {hints === null ? (
            <span className="text-[var(--text-3)]">{t("status.checkUnavailable")}</span>
          ) : hints === 0 ? (
            <span className="text-[var(--ok-fg)]">{t("status.checkOk")}</span>
          ) : (
            <span className="text-[var(--warn-fg)]">{t("status.checkHints", { count: hints })}</span>
          )}
          {founder && hints !== null && hints > 0 && (
            <span className="block text-xs text-[var(--text-3)]">{t("status.opsLink")}</span>
          )}
        </Row>
      </dl>
    </OverviewCard>
  );
}
