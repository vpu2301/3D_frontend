/**
 * What the AI cost, by day and by source (FE-5 §6).
 *
 * This ships in the same sprint as the features that spend, not after. The
 * first time a firm sees an AI bill should not be on an invoice.
 *
 * Form: a stacked bar per day. The question is "how much, split by what" over
 * time — magnitude over an ordered axis — and stacking answers both the daily
 * total and its composition in one read. A line chart would imply the days
 * interpolate, and they do not.
 *
 * Colors are a neutral ink-to-sand ramp, assigned by source in a fixed
 * sequence and never cycled: a source keeps its shade when a filter removes
 * another one, so the eye can follow "answers" across two different views.
 */

import { useMemo } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { AiSpendSummary, SpendRange } from '@/pages/notes/_lib/aiClient';

/**
 * Slots 1–5 of the platform's neutral ramp, darkest first. A sixth source folds
 * into "Other" rather than getting a generated shade — a step nobody checked is
 * a step two readers will disagree about.
 */
const SERIES_COLORS = ['#14161a', '#4a5057', '#6b7178', '#9aa0a6', '#c3c7cc'];
const OTHER_COLOR = '#e9ebef';
const MAX_SERIES = 5;

interface Props {
  summary: AiSpendSummary;
  range: SpendRange;
}

function money(usd: number): string {
  if (usd === 0) return '$0.00';
  return usd < 0.01 ? '<$0.01' : `$${usd.toFixed(2)}`;
}

export default function AiSpendChart({ summary, range }: Props) {
  const { data, sources } = useMemo(() => buildSeries(summary), [summary]);

  // Today's single bar is a number, not a chart. One bar with an axis around it
  // is a worse way of showing one number.
  if (range === 'today' || data.length <= 1) {
    return <SourceBreakdown summary={summary} />;
  }

  return (
    <div>
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -18 }}>
            <CartesianGrid strokeDasharray="2 2" stroke="rgba(20,22,26,0.07)" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: '#7a8087' }}
              tickLine={false}
              axisLine={{ stroke: 'rgba(20,22,26,0.1)' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#7a8087' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => (value === 0 ? '0' : `$${value.toFixed(2)}`)}
              width={52}
            />
            <Tooltip
              cursor={{ fill: 'rgba(20,22,26,0.04)' }}
              contentStyle={{
                borderRadius: 10,
                border: '1px solid rgba(20,22,26,0.1)',
                fontSize: 11,
                padding: '6px 8px',
              }}
              formatter={(value: number, name: string) => [money(value), name]}
            />
            {sources.map((source, index) => (
              <Bar
                key={source}
                dataKey={source}
                stackId="spend"
                fill={index >= MAX_SERIES ? OTHER_COLOR : SERIES_COLORS[index]}
                // 2px surface gap between stacked segments, and rounded ends on
                // the topmost segment only — the stack reads as one bar.
                stroke="#ffffff"
                strokeWidth={2}
                radius={index === sources.length - 1 ? [3, 3, 0, 0] : 0}
                maxBarSize={28}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/*
        The legend is always present for ≥2 series, and it carries visible text
        labels — the lighter steps of the ramp sit below 3:1 on white, so
        identity must never rest on shade alone.
      */}
      <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {sources.map((source, index) => (
          <li key={source} className="flex items-center gap-1 text-[10px] text-[var(--text-3)]">
            <span
              aria-hidden
              className="h-2 w-2 shrink-0 rounded-[2px]"
              style={{ background: index >= MAX_SERIES ? OTHER_COLOR : SERIES_COLORS[index] }}
            />
            {source}
          </li>
        ))}
      </ul>
    </div>
  );
}

/** The today view, and the fallback when the backend sends no daily series. */
function SourceBreakdown({ summary }: { summary: AiSpendSummary }) {
  const entries = Object.entries(summary.byKind).sort((a, b) => b[1] - a[1]);
  if (entries.length === 0) {
    return <p className="py-3 text-xs text-[var(--text-4)]">No AI calls in this period.</p>;
  }
  const total = entries.reduce((sum, [, count]) => sum + count, 0);

  return (
    <ul className="space-y-1.5">
      {entries.map(([kind, count], index) => (
        <li key={kind} className="flex items-center gap-2 text-xs">
          <span
            aria-hidden
            className="h-2 w-2 shrink-0 rounded-[2px]"
            style={{ background: index >= MAX_SERIES ? OTHER_COLOR : SERIES_COLORS[index] }}
          />
          <span className="w-24 shrink-0 truncate text-[var(--text-2)]">{kind}</span>
          <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--sand-deep)]">
            <span
              className="block h-full rounded-full"
              style={{
                width: `${total > 0 ? (count / total) * 100 : 0}%`,
                background: index >= MAX_SERIES ? OTHER_COLOR : SERIES_COLORS[index],
              }}
            />
          </span>
          <span className="w-8 shrink-0 text-right tabular-nums text-[var(--text-4)]">{count}</span>
        </li>
      ))}
    </ul>
  );
}

interface Row {
  label: string;
  [source: string]: string | number;
}

/**
 * Reshapes `series[{date, byKind}]` into one row per day with a column per
 * source, which is the shape recharts stacks. Sources are ordered by total
 * spend so the biggest contributor takes slot 1 and keeps it across ranges.
 */
function buildSeries(summary: AiSpendSummary): { data: Row[]; sources: string[] } {
  const series = summary.series ?? [];
  if (series.length === 0) return { data: [], sources: [] };

  const totals = new Map<string, number>();
  for (const day of series) {
    for (const [kind, cost] of Object.entries(day.byKind ?? {})) {
      totals.set(kind, (totals.get(kind) ?? 0) + cost);
    }
  }

  const ranked = [...totals.entries()].sort((a, b) => b[1] - a[1]).map(([kind]) => kind);
  const named = ranked.slice(0, MAX_SERIES);
  const folded = ranked.slice(MAX_SERIES);
  const sources = folded.length > 0 ? [...named, 'Other'] : named;

  const data = series.map((day) => {
    const row: Row = {
      label: new Date(day.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    };
    for (const source of named) row[source] = day.byKind?.[source] ?? 0;
    if (folded.length > 0) {
      row.Other = folded.reduce((sum, kind) => sum + (day.byKind?.[kind] ?? 0), 0);
    }
    // A day with no calls but a total still shows its total, so the chart never
    // claims a quiet day was a free one.
    if (Object.keys(day.byKind ?? {}).length === 0 && day.costUsd > 0) {
      row[sources[0] ?? 'other'] = day.costUsd;
    }
    return row;
  });

  return { data, sources };
}
