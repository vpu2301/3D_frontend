import { wordDiff, type DiffSegment } from '@/pages/docs/_lib/diff';

export default function DiffView({ before, after }: { before: string; after: string }) {
  const segments: DiffSegment[] = wordDiff(before, after);
  return (
    <div className="whitespace-pre-wrap rounded-[12px] border border-[var(--line-soft)] bg-white p-3 font-[ui-serif,Georgia,serif] text-[13px] leading-relaxed text-[var(--ink)]">
      {segments.map((s, i) => {
        if (s.type === 'added') {
          return (
            <span
              key={i}
              className="rounded-sm bg-[var(--ok-bg)] px-0.5 text-[var(--ok-fg)]"
            >
              {s.value}
            </span>
          );
        }
        if (s.type === 'removed') {
          return (
            <span
              key={i}
              className="rounded-sm bg-[rgba(179,56,46,0.12)] px-0.5 text-[var(--bad-fg)] line-through"
            >
              {s.value}
            </span>
          );
        }
        return <span key={i}>{s.value}</span>;
      })}
    </div>
  );
}
