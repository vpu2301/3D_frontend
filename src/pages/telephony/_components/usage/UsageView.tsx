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
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">{label}</span>
        <div className={cn('rounded-lg p-2', accent ?? 'bg-gray-100')}>
          <Icon className="h-4 w-4 text-gray-600" />
        </div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-gray-400">{sub}</p>}
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
              className="w-full rounded-t-sm bg-[#bdd8ec] transition-all group-hover:bg-[#a5c8e0]"
              style={{ height: `${pct}%`, minHeight: pct > 0 ? 4 : 0 }}
            />
            <span className="hidden text-[8px] text-gray-400 group-hover:block absolute -top-5">
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
    budgetPct >= 95 ? 'bg-red-400' : budgetPct >= 75 ? 'bg-amber-400' : 'bg-[#bdd8ec]';

  const spendData = u.dailySpend.map((d) => ({ date: d.date, value: d.spend }));
  const maxSpend = Math.max(...spendData.map((d) => d.value), 0.01);

  const callData = u.callsByDay.map((d) => ({
    date: d.date,
    value: d.inbound + d.outbound,
  }));
  const maxCalls = Math.max(...callData.map((d) => d.value), 1);

  const agentMax = Math.max(...u.spendByAgent.map((a) => a.spend), 0.01);

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-6 pt-5 pb-4">
        <div>
          <h1 className="text-2xl font-light text-gray-900">Usage</h1>
          <p className="mt-0.5 text-xs text-gray-400">Current billing period · Europe/Berlin</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50"
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
            accent="bg-blue-50"
          />
          <StatCard
            label="Calls placed"
            value={String(u.callsPlaced)}
            sub="outbound"
            icon={Phone}
            accent="bg-green-50"
          />
          <StatCard
            label="Calls received"
            value={String(u.callsReceived)}
            sub="inbound"
            icon={PhoneIncoming}
            accent="bg-violet-50"
          />
          <StatCard
            label="Avg duration"
            value={`${Math.floor(u.avgDurationSec / 60)}m ${u.avgDurationSec % 60}s`}
            icon={Clock}
            accent="bg-amber-50"
          />
          <StatCard
            label="Avg cost/call"
            value={`€${u.avgCostEur.toFixed(3)}`}
            icon={TrendingUp}
            accent="bg-rose-50"
          />
        </div>

        {/* Budget bar */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Monthly budget</span>
            <span className="text-sm text-gray-500">
              €{u.budgetUsedEur.toFixed(2)} / €{u.budgetEur.toFixed(2)}
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
            <div
              className={cn('h-full rounded-full transition-all', budgetColor)}
              style={{ width: `${budgetPct}%` }}
            />
          </div>
          <p className="mt-1.5 text-[10px] text-gray-400">
            {(100 - budgetPct).toFixed(1)}% remaining · resets 1st of next month
          </p>
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Daily spend */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-1 text-sm font-medium text-gray-700">Daily spend (14d)</p>
            <p className="mb-4 text-xs text-gray-400">€ per day</p>
            <BarChart
              data={spendData}
              maxValue={maxSpend}
              label={(v) => `€${v.toFixed(2)}`}
            />
            <div className="mt-2 flex justify-between text-[9px] text-gray-400">
              <span>{spendData[0]?.date?.slice(5)}</span>
              <span>{spendData[spendData.length - 1]?.date?.slice(5)}</span>
            </div>
          </div>

          {/* Calls per day */}
          <div className="rounded-xl border border-gray-200 bg-white p-4">
            <p className="mb-1 text-sm font-medium text-gray-700">Calls per day (14d)</p>
            <p className="mb-4 text-xs text-gray-400">Total calls</p>
            <BarChart
              data={callData}
              maxValue={maxCalls}
              label={(v) => `${v} calls`}
            />
            <div className="mt-2 flex justify-between text-[9px] text-gray-400">
              <span>{callData[0]?.date?.slice(5)}</span>
              <span>{callData[callData.length - 1]?.date?.slice(5)}</span>
            </div>
          </div>
        </div>

        {/* Spend by agent */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <p className="mb-4 text-sm font-medium text-gray-700">Spend by agent persona</p>
          <div className="space-y-3">
            {u.spendByAgent.map((a) => {
              const pct = (a.spend / agentMax) * 100;
              return (
                <div key={a.name}>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-sm text-gray-700">{a.name}</span>
                    <span className="text-sm font-medium text-gray-900">€{a.spend.toFixed(2)}</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-[#bdd8ec]"
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
