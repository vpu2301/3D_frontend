import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { buildCsv, type OwnerCall } from "@/lib/api/owner/calls";
import { maskPhone } from "@/lib/format";
import { useVoiceT } from "@/i18n/voice";

/** Client-side CSV of the current filter, masked numbers only, PII-free file name (FE2 §1.4). */
export default function CsvExportButton({ calls }: { calls: OwnerCall[] }) {
  const t = useVoiceT("voice-calls");
  const { toast } = useToast();
  const onExport = () => {
    const csv = buildCsv(
      calls,
      {
        headers: t("export.headers", { returnObjects: true }) as unknown as string[],
        result: (g) => t(`result.${g}`),
        intent: (k) => t(`intent.${k}`),
        direction: (d) => t(`direction.${d}`),
      },
      maskPhone,
    );
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `anrufe-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: t("export.done", { count: calls.length }), description: t("export.hint") });
  };
  return (
    <button
      type="button"
      onClick={onExport}
      disabled={calls.length === 0}
      title={t("export.hint")}
      className="inline-flex min-h-11 items-center gap-1.5 rounded-[10px] border border-[var(--line)] px-3 py-1.5 text-xs font-medium text-[var(--text-2)] hover:bg-[var(--sand)] disabled:opacity-50 sm:min-h-0"
    >
      <Download className="h-3.5 w-3.5" aria-hidden="true" />
      {t("export.button")}
    </button>
  );
}
