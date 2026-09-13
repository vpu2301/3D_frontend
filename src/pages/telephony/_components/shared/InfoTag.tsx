/**
 * A neutral fact chip (FE10): "berechnet im Browser", "nur in diesem Browser",
 * "Vorlagen aus der App". It marks *how* real data was produced — it is not a
 * mock badge and is not counted by `count-mocks`.
 */
export function InfoTag({ label, title, kind = "info" }: { label: string; title?: string; kind?: "info" | "computed" | "local" }) {
  return (
    <span data-info={kind} title={title} className="inline-flex shrink-0 items-center rounded-full border border-[var(--line)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[var(--text-3)]">
      {label}
    </span>
  );
}
