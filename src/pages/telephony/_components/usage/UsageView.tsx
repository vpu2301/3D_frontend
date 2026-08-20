import { MOCK_USAGE } from '@/pages/telephony/_lib/mock-data';
import { TrendingUp, Phone, PhoneIncoming, Clock, Euro, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  accent?: string;
}) {
  return (
    <div className="rounded-[14px] border border-[var(--line-soft)] bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="plat-eyebrow">{label}</span>
        <div className={cn('rounded-[10px] p-2', accent ?? 'bg-[var(--sand)]')}>
          <Icon className="h-4 w-4 text-[var(--ink)]" />
        </div>
      </div>
      <p className="plat-num" style={{ fontSize: 28 }}>{value}</p>
      {sub && <p className="plat-stat-sub mt-1">{sub}</p>}
    </div>
  );
}

function BarChart({
  data,
  maxValue,
  label,
}: {
  data: { date: string; value: number }[];
  maxValue: number;
  label: (v: number) => string;
}) {
  return (
    <div className="flex h-32 items-end gap-1">
      {data.map((d) => {
        const pct = maxValue > 0 ? (d.value / maxValue) * 100 : 0;
        return (
          <div key={d.date} className="group relative flex flex-1 flex-col items-center gap-1">
            <div
              className="w-full rounded-t-sm bg-[var(--ink)] transition-all group-hover:opacity-85"
              style={{ height: `${pct}%`, minHeight: pct > 0 ? 4 : 0 }}
            />
            <span className="hidden text-[8px] text-[var(--text-5)] group-hover:block absolute -top-5">
              {label(d.value)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default function UsageView() {
  const u = MOCK_USAGE;
  const budgetPct = Math.min((u.budgetUsedEur / u.budgetEur) * 100, 100);
  const budgetColor =
    budgetPct >= 95 ? 'bg-red-400' : budgetPct >= 75 ? 'bg-amber-400' : 'bg-[var(--ink)]';

  const spendData = u.dailySpend.map((d) => ({ date: d.date, value: d.spend }));
  const maxSpend = Math.max(...spendData.map((d) => d.value), 0.01);

  const callData = u.callsByDay.map((d) => ({
    date: d.date,
    value: d.inbound + d.outbound,
  }));
  const maxCalls = Math.max(...callData.map((d) => d.value), 1);

  const agentMax = Math.max(...u.spendByAgent.map((a) => a.spend), 0.01);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--line-soft)] px-6 pt-5 pb-4">
        <div>
          <p className="plat-crumb" style={{ color: 'var(--text-4)' }}>3days.telephony</p>
          <h1 className="mt-1 text-[26px] text-[var(--ink)]">Usage</h1>
          <p className="mt-1 text-xs text-[var(--text-4)]">Current billing period · Europe/Berlin</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-[var(--line)] px-3 py-1.5 text-xs text-[var(--text-3)] hover:bg-[var(--sand)]"
        >
          <Download className="h-3.5 w-3.5" /> Export report
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Stat strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <StatCard
            label="This month"
            value={`€${u.thisMonthSpend.toFixed(2)}`}
            sub={`of €${u.budgetEur} budget`}
            icon={Euro}
            accent="bg-[var(--sand)]"
          />
          <StatCard
            label="Calls placed"
            value={String(u.callsPlaced)}
            sub="outbound"
            icon={Phone}
            accent="bg-[var(--sand)]"
          />
          <StatCard
            label="Calls received"
            value={String(u.callsReceived)}
            sub="inbound"
            icon={PhoneIncoming}
            accent="bg-[var(--sand)]"
          />
          <StatCard
            label="Avg duration"
            value={`${Math.floor(u.avgDurationSec / 60)}m ${u.avgDurationSec % 60}s`}
            icon={Clock}
            accent="bg-[var(--sand)]"
          />
          <StatCard
            label="Avg cost/call"
            value={`€${u.avgCostEur.toFixed(3)}`}
            icon={TrendingUp}
            accent="bg-[var(--sand)]"
          />
        </div>

        {/* Budget bar */}
        <div className="rounded-[14px] border border-[var(--line-soft)] bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-[var(--text-2)]">Monthly budget</span>
            <span className="text-sm text-[var(--text-4)]">
              €{u.budgetUsedEur.toFixed(2)} / €{u.budgetEur.toFixed(2)}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[var(--sand-deep)]">
            <div
              className={cn('h-full rounded-full transition-all', budgetColor)}
              style={{ width: `${budgetPct}%` }}
            />
          </div>
          <p className="mt-1.5 text-[10px] text-[var(--text-5)]">
            {(100 - budgetPct).toFixed(1)}% remaining · resets 1st of next month
          </p>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Daily spend */}
          <div className="rounded-[14px] border border-[var(--line-soft)] bg-white p-4">
            <p className="mb-1 text-sm font-medium text-[var(--text-2)]">Daily spend (14d)</p>
            <p className="mb-4 text-xs text-[var(--text-5)]">€ per day</p>
            <BarChart
              data={spendData}
              maxValue={maxSpend}
              label={(v) => `€${v.toFixed(2)}`}
            />
            <div className="mt-2 flex justify-between text-[9px] text-[var(--text-5)]">
              <span>{spendData[0]?.date?.slice(5)}</span>
              <span>{spendData[spendData.length - 1]?.date?.slice(5)}</span>
            </div>
          </div>

          {/* Calls per day */}
          <div className="rounded-[14px] border border-[var(--line-soft)] bg-white p-4">
            <p className="mb-1 text-sm font-medium text-[var(--text-2)]">Calls per day (14d)</p>
            <p className="mb-4 text-xs text-[var(--text-5)]">Total calls</p>
            <BarChart
              data={callData}
              maxValue={maxCalls}
              label={(v) => `${v} calls`}
            />
            <div className="mt-2 flex justify-between text-[9px] text-[var(--text-5)]">
              <span>{callData[0]?.date?.slice(5)}</span>
              <span>{callData[callData.length - 1]?.date?.slice(5)}</span>
            </div>
          </div>
        </div>

        {/* Spend by agent */}
        <div className="rounded-[14px] border border-[var(--line-soft)] bg-white p-4">
          <p className="mb-4 text-sm font-medium text-[var(--text-2)]">Spend by agent persona</p>
          <div className="space-y-3">
            {u.spendByAgent.map((a) => {
              const pct = (a.spend / agentMax) * 100;
              return (
                <div key={a.name}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm text-[var(--text-2)]">{a.name}</span>
                    <span className="text-sm font-medium text-[var(--ink)]">€{a.spend.toFixed(2)}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--sand-deep)]">
                    <div
                      className="h-full rounded-full bg-[var(--ink)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
