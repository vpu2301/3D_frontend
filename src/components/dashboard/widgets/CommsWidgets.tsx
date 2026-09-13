/**
 * What the agent handles besides talking: written messages across its
 * channels, and the images it generates. Both read endpoints that already
 * exist — messages from `/api/voice/messages`, images from the audit log,
 * which is the only place image work is currently recorded.
 */
import { useMemo } from 'react';
import { useMessages } from '@/lib/api/voice';
import { useAuditStats } from '@/lib/api/dashboard';
import { RankBars } from '../DashCharts';
import { fmtNum, timeAgo } from '../dashFormat';
import { WidgetEmpty, WidgetPlot, WidgetRows, WidgetStats } from './widgetKit';

/** Tools that produce or handle pictures, however the skill happens to be named. */
const IMAGE_TOOL = /image|photo|picture|vision|render|dalle|flux|sdxl/i;

// ── Text: messages the agent took and chats it answered ──────────────

export function MessagesWidget() {
  const { data: page } = useMessages({ limit: 50 });
  const { data: stats } = useAuditStats();

  const messages = page?.messages ?? [];
  const urgent = messages.filter((m) => m.urgency === 'urgent').length;
  const chats = stats?.by_action?.message_received ?? 0;

  return (
    <>
      <WidgetStats
        items={[
          { label: 'Messages taken', value: fmtNum(page?.total ?? messages.length), sub: urgent ? `${fmtNum(urgent)} marked urgent` : 'on the phone line' },
          { label: 'Unread', value: fmtNum(page?.unread ?? 0), sub: page?.unread ? 'waiting for you' : 'nothing waiting' },
          { label: 'Chats answered', value: fmtNum(chats), sub: 'inbound messages, all time' },
        ]}
      />

      {messages.length ? (
        <div className="mt-4 space-y-0">
          {messages.slice(0, 4).map((m, i) => (
            <div
              key={m.id}
              className="flex items-baseline justify-between gap-3 py-2 text-[12px]"
              style={i ? { borderTop: '1px solid var(--line-soft)' } : undefined}
            >
              <span className="min-w-0 flex-1 truncate">
                <span className="font-medium">{m.caller_name || m.caller_number || 'Unknown caller'}</span>
                <span style={{ color: 'var(--text-4)' }}> · {m.matter}</span>
              </span>
              <span className="shrink-0 font-mono text-[11px]" style={{ color: 'var(--text-5)' }}>
                {timeAgo(m.created_at)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <WidgetEmpty>
          No messages taken yet — the receptionist writes one whenever a caller leaves word.
        </WidgetEmpty>
      )}
    </>
  );
}

// ── Images ───────────────────────────────────────────────────────────

export function ImagesWidget() {
  const { data: stats } = useAuditStats();

  const tools = useMemo(
    () =>
      Object.entries(stats?.by_tool ?? {})
        .filter(([name]) => IMAGE_TOOL.test(name))
        .sort((a, b) => b[1] - a[1]),
    [stats],
  );
  const total = tools.reduce((n, [, count]) => n + count, 0);

  return (
    <>
      <WidgetStats
        items={[
          { label: 'Images made', value: fmtNum(total), sub: 'generation calls, all time' },
          { label: 'Generators', value: fmtNum(tools.length), sub: tools.length ? 'tools in use' : 'none used yet' },
        ]}
      />
      <WidgetPlot title="By generator" hint="calls per tool">
        {tools.length ? (
          <RankBars
            rows={tools.slice(0, 5).map(([label, value]) => ({ label, value }))}
            format={(n) => fmtNum(Math.round(n))}
          />
        ) : (
          <WidgetEmpty>
            Nothing generated yet. Image spend is recorded separately from tool calls and the
            backend does not expose it, so this counts generation calls.
          </WidgetEmpty>
        )}
      </WidgetPlot>
      <WidgetRows rows={[{ label: 'Cost per image', value: 'not reported by the API' }]} />
    </>
  );
}
