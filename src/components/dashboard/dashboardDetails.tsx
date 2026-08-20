/**
 * The expanded views behind the dashboard cards: diagrams on top, the tables
 * behind them underneath. They pull a wider window of the same endpoints the
 * cards use (30 days, 200 audit rows) and only while the detail is open.
 */
import { useMemo } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import {
  useAgentStatus,
  useAuditStats,
  useCostHistory,
  useCostsByModel,
  useCostsByTool,
  useRecentAudit,
  useSchedules,
  useSkills,
  useTodayCosts,
  type AuditEntry,
  type ScheduledTask,
} from '@/lib/api/dashboard';
import {
  DataTable,
  DetailCharts,
  DetailDivider,
  DetailStats,
  DetailTables,
  type Column,
} from './DetailView';
import { Figure, Legend, RankBars, StatusBars, TimeSeries, type Point } from './DashCharts';
import {
  dateTime,
  dayKey,
  fmtMs,
  fmtNum,
  fmtUsd,
  fmtUsdTick,
  lastDays,
  longDay,
  shortDay,
  timeAgo,
  todayIso,
} from './dashFormat';

const HISTORY_DAYS = 30;

/** Sorted pairs out of the `by_*` maps the API returns. */
function ranked(map: Record<string, number> | undefined, limit = 8) {
  return Object.entries(map ?? {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, value]) => ({ label, value }));
}

/** Audit rows bucketed per day, split approved / failed. */
function bucketAudit(entries: AuditEntry[], days: number) {
  const keys = lastDays(days);
  const acc = new Map(keys.map((k) => [k, { ok: 0, bad: 0 }]));
  for (const e of entries) {
    const d = new Date(e.timestamp);
    if (isNaN(d.getTime())) continue;
    const slot = acc.get(dayKey(d));
    if (!slot) continue;
    if (e.approved) slot.ok += 1;
    else slot.bad += 1;
  }
  return keys.map((k) => ({ label: shortDay(k), full: longDay(k), ...acc.get(k)! }));
}

function ResultPill({ ok }: { ok: boolean }) {
  return (
    <span className={`plat-pill ${ok ? 'plat-pill-ok' : ''}`} style={ok ? undefined : { background: 'var(--warn-bg)', color: 'var(--bad-fg)' }}>
      {ok ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
      {ok ? 'approved' : 'failed'}
    </span>
  );
}

// ── Spend ────────────────────────────────────────────────────────────

export function SpendDetail() {
  const { data: history } = useCostHistory(HISTORY_DAYS);
  const { data: models } = useCostsByModel(HISTORY_DAYS);
  const { data: tools } = useCostsByTool(HISTORY_DAYS);
  const { data: today } = useTodayCosts();

  const series: Point[] = useMemo(
    () =>
      (history?.data ?? []).map((d) => ({
        label: shortDay(d.date),
        full: longDay(d.date),
        value: d.total_usd,
        sub: `${fmtNum(d.request_count)} requests`,
      })),
    [history],
  );

  const topModel = models?.models?.[0];
  const dailyRows = useMemo(() => [...(history?.data ?? [])].reverse(), [history]);

  return (
    <>
      <DetailStats
        items={[
          { label: `Last ${HISTORY_DAYS}d`, value: fmtUsd(history?.totals.total_usd), sub: `${fmtNum(history?.totals.total_requests)} requests` },
          { label: 'Average day', value: fmtUsd(history?.totals.avg_daily_usd), sub: 'across the window' },
          {
            label: 'Today',
            value: fmtUsd(today?.total_usd),
            sub: today ? `${Math.round(today.budget.spent_pct)}% of ${fmtUsd(today.budget.daily_limit)} budget` : 'waiting for data',
          },
          {
            label: 'Costliest model',
            value: <span className="font-mono text-[15px]">{topModel ? topModel.model : '—'}</span>,
            sub: topModel ? `${fmtUsd(topModel.total_usd)} · ${fmtNum(topModel.request_count)} requests` : undefined,
          },
        ]}
      />

      <DetailDivider label="Diagrams" hint={`last ${HISTORY_DAYS} days`} />
      <DetailCharts>
        <Figure title="Spend per day" hint={history ? fmtUsd(history.totals.total_usd) + ' total' : undefined}>
          <TimeSeries data={series} kind="area" height={210} format={fmtUsdTick} yLabel="spend per day in USD" />
        </Figure>
        <Figure title="Cost by model" hint="share of spend">
          <div className="pt-1">
            <RankBars
              rows={(models?.models ?? []).slice(0, 6).map((m) => ({
                label: m.model,
                value: m.total_usd,
                sub: `${fmtNum(m.request_count)} req`,
              }))}
              format={fmtUsd}
              color="var(--blue)"
              emptyLabel="No model costs recorded yet"
            />
          </div>
        </Figure>
        <Figure title="Cost by tool" hint="what the agent spends money doing">
          <div className="pt-1">
            <RankBars
              rows={(tools?.tools ?? []).slice(0, 6).map((t) => ({
                label: t.tool,
                value: t.total_usd,
                sub: `${fmtNum(t.call_count)} calls`,
              }))}
              format={fmtUsd}
              emptyLabel="No tool costs recorded yet"
            />
          </div>
        </Figure>
        <Figure title="Requests per day" hint="volume behind the spend">
          <TimeSeries
            data={series.map((p, i) => ({
              ...p,
              value: history?.data[i]?.request_count ?? 0,
              sub: fmtUsd(history?.data[i]?.total_usd),
            }))}
            kind="bar"
            height={210}
            format={(n) => fmtNum(Math.round(n))}
            yLabel="requests per day"
          />
        </Figure>
      </DetailCharts>

      <DetailDivider label="Data" hint="every row behind the charts" />
      <DetailTables cols={2}>
        <DataTable
          title="By model"
          hint={`${models?.models.length ?? 0} models`}
          rows={models?.models ?? []}
          rowKey={(m) => m.model}
          columns={[
            { key: 'model', label: 'Model', render: (m) => <span className="font-mono">{m.model}</span> },
            { key: 'req', label: 'Requests', num: true, render: (m) => fmtNum(m.request_count) },
            { key: 'tok', label: 'Tokens', num: true, render: (m) => fmtNum(m.total_tokens) },
            { key: 'avg', label: 'Avg / req', num: true, render: (m) => fmtUsd(m.avg_cost_per_request) },
            { key: 'total', label: 'Total', num: true, render: (m) => fmtUsd(m.total_usd) },
          ]}
          empty="No model costs recorded yet"
        />
        <DataTable
          title="By tool"
          hint={`${tools?.tools.length ?? 0} tools`}
          rows={tools?.tools ?? []}
          rowKey={(t) => t.tool}
          columns={[
            { key: 'tool', label: 'Tool', render: (t) => <span className="font-mono">{t.tool}</span> },
            { key: 'calls', label: 'Calls', num: true, render: (t) => fmtNum(t.call_count) },
            { key: 'avg', label: 'Avg', num: true, render: (t) => fmtUsd(t.avg_cost) },
            { key: 'total', label: 'Total', num: true, render: (t) => fmtUsd(t.total_usd) },
          ]}
          empty="No tool costs recorded yet"
        />
      </DetailTables>
      <DataTable
        title="Day by day"
        hint="newest first"
        rows={dailyRows}
        rowKey={(d) => d.date}
        maxHeight={320}
        columns={[
          { key: 'date', label: 'Date', render: (d) => <span className="font-mono">{d.date}</span> },
          { key: 'req', label: 'Requests', num: true, render: (d) => fmtNum(d.request_count) },
          {
            key: 'avg',
            label: 'Avg / req',
            num: true,
            render: (d) => fmtUsd(d.total_usd / Math.max(d.request_count, 1)),
          },
          { key: 'spend', label: 'Spend', num: true, render: (d) => fmtUsd(d.total_usd) },
        ]}
        empty="No spend recorded yet"
      />
    </>
  );
}

// ── Requests ─────────────────────────────────────────────────────────

export function RequestsDetail() {
  const { data: history } = useCostHistory(HISTORY_DAYS);
  const { data: models } = useCostsByModel(HISTORY_DAYS);
  const { data: today } = useTodayCosts();

  const bars: Point[] = useMemo(
    () =>
      (history?.data ?? []).map((d) => ({
        label: shortDay(d.date),
        full: longDay(d.date),
        value: d.request_count,
        sub: fmtUsd(d.total_usd),
      })),
    [history],
  );

  const busiest = useMemo(
    () => [...(history?.data ?? [])].sort((a, b) => b.request_count - a.request_count)[0],
    [history],
  );

  return (
    <>
      <DetailStats
        items={[
          { label: 'Today', value: fmtNum(today?.request_count), sub: today ? `${fmtUsd(today.total_usd / Math.max(today.request_count, 1))} average each` : 'waiting for data' },
          { label: `Last ${HISTORY_DAYS}d`, value: fmtNum(history?.totals.total_requests), sub: `${fmtUsd(history?.totals.total_usd)} spent` },
          {
            label: 'Busiest day',
            value: busiest ? fmtNum(busiest.request_count) : '—',
            sub: busiest ? longDay(busiest.date) : undefined,
          },
          { label: 'Models in use', value: fmtNum(models?.models.length), sub: 'over the window' },
        ]}
      />

      <DetailDivider label="Diagrams" hint={`last ${HISTORY_DAYS} days`} />
      <DetailCharts>
        <Figure title="Requests per day" hint={history ? `${fmtNum(history.totals.total_requests)} total` : undefined}>
          <TimeSeries data={bars} kind="bar" height={210} format={(n) => fmtNum(Math.round(n))} yLabel="requests per day" />
        </Figure>
        <Figure title="Requests by model" hint="who is answering">
          <div className="pt-1">
            <RankBars
              rows={(models?.models ?? []).slice(0, 6).map((m) => ({
                label: m.model,
                value: m.request_count,
                sub: fmtUsd(m.avg_cost_per_request) + ' / req',
              }))}
              format={(n) => fmtNum(Math.round(n))}
              color="var(--blue)"
              emptyLabel="No requests recorded yet"
            />
          </div>
        </Figure>
      </DetailCharts>

      <DetailDivider label="Data" />
      <DetailTables cols={2}>
        <DataTable
          title="By model"
          rows={models?.models ?? []}
          rowKey={(m) => m.model}
          columns={[
            { key: 'model', label: 'Model', render: (m) => <span className="font-mono">{m.model}</span> },
            { key: 'req', label: 'Requests', num: true, render: (m) => fmtNum(m.request_count) },
            { key: 'tok', label: 'Tokens', num: true, render: (m) => fmtNum(m.total_tokens) },
            { key: 'avg', label: 'Avg / req', num: true, render: (m) => fmtUsd(m.avg_cost_per_request) },
          ]}
          empty="No requests recorded yet"
        />
        <DataTable
          title="Today by model"
          hint={todayIso()}
          rows={Object.entries(today?.by_model ?? {}).sort((a, b) => b[1] - a[1])}
          rowKey={([model]) => model}
          columns={[
            { key: 'model', label: 'Model', render: ([model]) => <span className="font-mono">{model}</span> },
            { key: 'usd', label: 'Spent today', num: true, render: ([, usd]) => fmtUsd(usd) },
          ]}
          empty="Nothing spent today yet"
        />
      </DetailTables>
    </>
  );
}

// ── Actions / activity log ───────────────────────────────────────────

export function ActivityDetail() {
  const { data: audit } = useRecentAudit(200);
  const { data: allStats } = useAuditStats();
  const { data: todayStats } = useAuditStats(todayIso());

  const entries = audit?.entries ?? [];
  const buckets = useMemo(() => bucketAudit(audit?.entries ?? [], 14), [audit]);
  const failed = allStats?.failed_actions ?? 0;
  const total = allStats?.total_entries ?? 0;

  const auditColumns: Column<AuditEntry>[] = [
    {
      key: 'when',
      label: 'When',
      width: '132px',
      render: (e) => (
        <span title={dateTime(e.timestamp)} className="whitespace-nowrap font-mono text-[11.5px]">
          {timeAgo(e.timestamp)}
        </span>
      ),
      value: (e) => e.timestamp,
    },
    { key: 'action', label: 'Action', render: (e) => <span className="font-medium" style={{ color: 'var(--ink)' }}>{e.action}</span> },
    { key: 'tool', label: 'Tool', render: (e) => <span className="font-mono text-[11.5px]">{e.tool ?? '—'}</span> },
    {
      key: 'summary',
      label: 'Detail',
      render: (e) => (
        <span className="line-clamp-2 max-w-[420px]">
          {e.input_summary || e.output_summary || '—'}
        </span>
      ),
    },
    { key: 'result', label: 'Result', render: (e) => <ResultPill ok={e.approved} /> },
    { key: 'dur', label: 'Duration', num: true, render: (e) => fmtMs(e.duration_ms) },
    { key: 'cost', label: 'Cost', num: true, render: (e) => fmtUsd(e.cost_usd) },
  ];

  return (
    <>
      <DetailStats
        items={[
          { label: 'All time', value: fmtNum(total), sub: `${fmtUsd(allStats?.total_cost_usd)} spent on actions` },
          { label: 'Today', value: fmtNum(todayStats?.total_entries), sub: todayStats ? `${todayStats.failed_actions} failed` : 'waiting for data' },
          {
            label: 'Failures',
            value: fmtNum(failed),
            sub: total ? `${((failed / total) * 100).toFixed(1)}% of all actions` : undefined,
          },
          { label: 'Distinct tools', value: fmtNum(Object.keys(allStats?.by_tool ?? {}).length), sub: 'used at least once' },
        ]}
      />

      <DetailDivider label="Diagrams" hint="last 14 days · newest 200 actions" />
      <DetailCharts>
        <Figure
          title="Actions per day"
          hint={<Legend items={[{ color: 'var(--ink)', label: 'approved' }, { color: 'var(--bad-fg)', label: 'failed' }]} />}
        >
          <StatusBars data={buckets} height={210} />
        </Figure>
        <Figure title="Most used tools" hint="all time">
          <div className="pt-1">
            <RankBars
              rows={ranked(allStats?.by_tool, 6)}
              format={(n) => fmtNum(Math.round(n))}
              emptyLabel="No tool calls recorded yet"
            />
          </div>
        </Figure>
        <Figure title="Actions by type" hint="all time" className="lg:col-span-2">
          <div className="pt-1">
            <RankBars
              rows={ranked(allStats?.by_action, 8)}
              format={(n) => fmtNum(Math.round(n))}
              color="var(--blue)"
              emptyLabel="No actions recorded yet"
            />
          </div>
        </Figure>
      </DetailCharts>

      <DetailDivider label="Data" hint="full audit log" />
      <DataTable
        title="Audit log"
        hint={audit ? `${fmtNum(entries.length)} of ${fmtNum(audit.total)} actions` : undefined}
        rows={entries}
        rowKey={(e) => String(e.id)}
        columns={auditColumns}
        maxHeight={420}
        empty="Nothing yet — actions your agent takes will appear here"
      />
    </>
  );
}

// ── Agent ────────────────────────────────────────────────────────────

export function AgentDetail() {
  const { data: st } = useAgentStatus();
  const { data: audit } = useRecentAudit(60);
  const { data: stats } = useAuditStats();

  const channels = Object.entries(st?.channels ?? {});
  const online = channels.filter(([, on]) => on).length;
  const entries = audit?.entries ?? [];
  const buckets = useMemo(() => bucketAudit(audit?.entries ?? [], 14), [audit]);

  return (
    <>
      <DetailStats
        items={[
          { label: 'Runtime', value: st ? (st.agent_running ? 'Running' : 'Stopped') : '—', sub: st ? `version ${st.version}` : 'waiting for data' },
          { label: 'Channels on', value: `${online}/${channels.length || 0}`, sub: channels.length ? channels.map(([n]) => n).join(', ') : undefined },
          { label: 'Actions all time', value: fmtNum(stats?.total_entries), sub: `${fmtNum(stats?.failed_actions)} failed` },
          { label: 'Tools available', value: fmtNum(Object.keys(stats?.by_tool ?? {}).length), sub: 'seen in the audit log' },
        ]}
      />

      <DetailDivider label="Diagrams" />
      <DetailCharts>
        <Figure
          title="Agent activity"
          hint={<Legend items={[{ color: 'var(--ink)', label: 'approved' }, { color: 'var(--bad-fg)', label: 'failed' }]} />}
        >
          <StatusBars data={buckets} height={200} emptyLabel="No recent agent activity" />
        </Figure>
        <Figure title="What it spends its time on" hint="tool calls, all time">
          <div className="pt-1">
            <RankBars rows={ranked(stats?.by_tool, 6)} format={(n) => fmtNum(Math.round(n))} emptyLabel="No tool calls yet" />
          </div>
        </Figure>
      </DetailCharts>

      <DetailDivider label="Data" />
      <DetailTables cols={2}>
        <DataTable
          title="Channels"
          hint={`${online} online`}
          rows={channels}
          rowKey={([name]) => name}
          columns={[
            { key: 'name', label: 'Channel', render: ([name]) => <span className="capitalize">{name}</span> },
            {
              key: 'state',
              label: 'State',
              render: ([, on]) => (
                <span className={`plat-pill ${on ? 'plat-pill-ok' : 'plat-pill-mute'}`}>{on ? 'on' : 'off'}</span>
              ),
            },
          ]}
          empty="No channel information from the backend"
        />
        <DataTable
          title="Latest actions"
          rows={entries.slice(0, 25)}
          rowKey={(e) => String(e.id)}
          columns={[
            {
              key: 'when',
              label: 'When',
              render: (e) => <span className="font-mono text-[11.5px]">{timeAgo(e.timestamp)}</span>,
              value: (e) => e.timestamp,
            },
            { key: 'tool', label: 'Tool / action', render: (e) => <span className="font-mono text-[11.5px]">{e.tool ?? e.action}</span> },
            { key: 'result', label: 'Result', render: (e) => <ResultPill ok={e.approved} /> },
            { key: 'cost', label: 'Cost', num: true, render: (e) => fmtUsd(e.cost_usd) },
          ]}
          empty="No actions yet"
        />
      </DetailTables>
    </>
  );
}

// ── Automation: schedules + skills ───────────────────────────────────

export function AutomationDetail() {
  const { data: schedules } = useSchedules(true);
  const { data: skills } = useSkills();

  const tasks = schedules?.tasks ?? [];

  /** Upcoming runs bucketed into the next 14 days. */
  const upcoming = useMemo(() => {
    const keys = lastDays(1).concat(
      Array.from({ length: 13 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() + i + 1);
        return dayKey(d);
      }),
    );
    const acc = new Map(keys.map((k) => [k, 0]));
    for (const t of schedules?.tasks ?? []) {
      if (!t.enabled || !t.next_run_at) continue;
      const d = new Date(t.next_run_at);
      if (isNaN(d.getTime())) continue;
      const k = dayKey(d);
      if (acc.has(k)) acc.set(k, (acc.get(k) ?? 0) + 1);
    }
    return keys.map((k) => ({ label: shortDay(k), full: longDay(k), value: acc.get(k) ?? 0 }));
  }, [schedules]);

  const byChannel = useMemo(() => {
    const acc: Record<string, number> = {};
    for (const t of schedules?.tasks ?? []) acc[t.channel || 'unknown'] = (acc[t.channel || 'unknown'] ?? 0) + 1;
    return ranked(acc, 6);
  }, [schedules]);

  const taskColumns: Column<ScheduledTask>[] = [
    { key: 'name', label: 'Task', render: (t) => <span className="font-medium" style={{ color: 'var(--ink)' }}>{t.name}</span> },
    { key: 'kind', label: 'Kind', render: (t) => <span className="font-mono text-[11.5px]">{t.kind}</span> },
    { key: 'cron', label: 'Schedule', render: (t) => <span className="font-mono text-[11.5px]">{t.cron_expr}</span> },
    { key: 'tz', label: 'Timezone', render: (t) => <span className="text-[11.5px]">{t.timezone}</span> },
    { key: 'channel', label: 'Channel', render: (t) => <span className="capitalize">{t.channel}</span> },
    {
      key: 'enabled',
      label: 'State',
      render: (t) => <span className={`plat-pill ${t.enabled ? 'plat-pill-ok' : 'plat-pill-mute'}`}>{t.enabled ? 'enabled' : 'paused'}</span>,
    },
    {
      key: 'last',
      label: 'Last run',
      render: (t) => <span className="whitespace-nowrap text-[11.5px]">{t.last_run_at ? timeAgo(t.last_run_at) : '—'}</span>,
      value: (t) => t.last_run_at ?? '',
    },
    {
      key: 'next',
      label: 'Next run',
      render: (t) => <span className="whitespace-nowrap text-[11.5px]">{dateTime(t.next_run_at)}</span>,
      value: (t) => t.next_run_at ?? '',
    },
  ];

  return (
    <>
      <DetailStats
        items={[
          { label: 'Scheduled', value: fmtNum(schedules?.total), sub: `${fmtNum(schedules?.future_count)} still to run` },
          { label: 'Enabled', value: fmtNum(tasks.filter((t) => t.enabled).length), sub: `${tasks.filter((t) => !t.enabled).length} paused` },
          { label: 'Already run', value: fmtNum(schedules?.past_count), sub: 'in this window' },
          { label: 'Skills installed', value: fmtNum(skills?.skills.length), sub: 'extend what agents can do' },
        ]}
      />

      <DetailDivider label="Diagrams" hint="next 14 days" />
      <DetailCharts>
        <Figure title="Upcoming runs" hint="enabled tasks only">
          <TimeSeries
            data={upcoming}
            kind="bar"
            height={200}
            format={(n) => String(Math.round(n))}
            emptyLabel="Nothing scheduled"
            yLabel="scheduled runs per day"
          />
        </Figure>
        <Figure title="Tasks by channel" hint="where automation lands">
          <div className="pt-1">
            <RankBars rows={byChannel} format={(n) => String(Math.round(n))} emptyLabel="No scheduled tasks yet" />
          </div>
        </Figure>
      </DetailCharts>

      <DetailDivider label="Data" />
      <DataTable
        title="Scheduled tasks"
        hint={`${tasks.length} total`}
        rows={tasks}
        rowKey={(t) => String(t.id)}
        columns={taskColumns}
        maxHeight={340}
        empty="No scheduled tasks yet"
      />
      <DataTable
        title="Skills"
        hint={`${skills?.skills.length ?? 0} installed`}
        rows={skills?.skills ?? []}
        rowKey={(s) => s.dir}
        maxHeight={300}
        columns={[
          { key: 'name', label: 'Skill', render: (s) => <span className="font-mono text-[11.5px]" style={{ color: 'var(--ink)' }}>{s.name}</span> },
          { key: 'desc', label: 'What it does', render: (s) => <span className="line-clamp-2 max-w-[520px]">{s.description}</span> },
          { key: 'status', label: 'Status', render: (s) => <span className="plat-pill plat-pill-mute">{s.status}</span> },
          { key: 'source', label: 'Source', render: (s) => <span className="text-[11.5px]">{s.source}</span> },
        ]}
        empty="No skills installed"
      />
    </>
  );
}

// ── Workforce (still mocked — kept visibly demo) ─────────────────────

const WORKFORCE_MONTHS = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
const WORKFORCE_AI = [11, 14, 17, 19, 22, 24];
const WORKFORCE_HUMAN = [9, 9, 8, 9, 9, 9];
const WORKFORCE_TEAMS = [
  { team: 'Support', ai: 9, human: 3, tasks: 1284, productivity: '412%' },
  { team: 'Sales', ai: 7, human: 4, tasks: 863, productivity: '337%' },
  { team: 'Finance', ai: 5, human: 1, tasks: 402, productivity: '288%' },
  { team: 'Operations', ai: 3, human: 1, tasks: 219, productivity: '241%' },
];

export function WorkforceDetail() {
  return (
    <>
      <div className="rounded-[10px] border border-dashed border-amber-300/70 bg-amber-50/60 px-4 py-2.5 text-[11.5px] text-amber-800">
        Demo data — there is no workforce/teams API on the backend yet, so every number below is
        illustrative.
      </div>

      <DetailStats
        items={[
          { label: 'AI workers', value: '24', sub: '73% of the workforce' },
          { label: 'Human workers', value: '9', sub: 'across 4 teams' },
          { label: 'Productivity', value: '340%', sub: '+23% this month' },
          { label: 'Tasks this month', value: '2,768', sub: '88% handled by AI' },
        ]}
      />

      <DetailDivider label="Diagrams" hint="last 6 months" />
      <DetailCharts>
        <Figure title="AI headcount" hint="workers deployed">
          <TimeSeries
            data={WORKFORCE_MONTHS.map((m, i) => ({ label: m, value: WORKFORCE_AI[i], sub: 'AI workers' }))}
            kind="area"
            height={200}
            format={(n) => String(Math.round(n))}
          />
        </Figure>
        <Figure title="Human headcount" hint="workers on payroll">
          <TimeSeries
            data={WORKFORCE_MONTHS.map((m, i) => ({ label: m, value: WORKFORCE_HUMAN[i], sub: 'human workers' }))}
            kind="bar"
            height={200}
            format={(n) => String(Math.round(n))}
            color="var(--ink)"
          />
        </Figure>
      </DetailCharts>

      <DetailDivider label="Data" />
      <DataTable
        title="Teams"
        rows={WORKFORCE_TEAMS}
        rowKey={(t) => t.team}
        columns={[
          { key: 'team', label: 'Team', render: (t) => <span className="font-medium" style={{ color: 'var(--ink)' }}>{t.team}</span> },
          { key: 'ai', label: 'AI workers', num: true, render: (t) => t.ai },
          { key: 'human', label: 'Humans', num: true, render: (t) => t.human },
          { key: 'tasks', label: 'Tasks / mo', num: true, render: (t) => fmtNum(t.tasks) },
          { key: 'prod', label: 'Productivity', num: true, render: (t) => t.productivity },
        ]}
      />
    </>
  );
}
