import { wordDiff, type DiffSegment } from '@/pages/docs/_lib/diff';

export default function DiffView({ before, after }: { before: string; after: string }) {
  const segments: DiffSegment[] = wordDiff(before, after);
  return (
    <div className="whitespace-pre-wrap rounded-md border border-zinc-200 bg-white p-3 font-[ui-serif,Georgia,serif] text-[13px] leading-relaxed dark:border-zinc-700 dark:bg-zinc-950">
      {segments.map((s, i) => {
        if (s.type === 'added') {
          return (
            <span
              key={i}
              className="rounded-sm bg-green-100 px-0.5 text-green-900 dark:bg-green-900/40 dark:text-green-100"
            >
              {s.value}
            </span>
          );
        }
        if (s.type === 'removed') {
          return (
            <span
              key={i}
              className="rounded-sm bg-red-100 px-0.5 text-red-900 line-through dark:bg-red-900/40 dark:text-red-100"
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
