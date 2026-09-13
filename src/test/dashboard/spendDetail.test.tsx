/**
 * The spend detail must not leave a diagram empty: the day charts cover the
 * whole window even though the API only returns days that had spend, and the
 * tool panel falls back to audit activity when the backend cannot price a
 * tool call.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { fillDays, lastDays } from '@/components/dashboard/dashFormat';

const HISTORY_DAYS = 30;
const window30 = lastDays(HISTORY_DAYS);

const costHistory = {
  period_days: HISTORY_DAYS,
  data: [
    { date: window30[HISTORY_DAYS - 2], total_usd: 2.4, request_count: 20 },
    { date: window30[HISTORY_DAYS - 1], total_usd: 0.9, request_count: 7 },
  ],
  totals: { total_usd: 3.3, total_requests: 27, avg_daily_usd: 1.65 },
};

const models = {
  models: [
    { model: 'claude-opus-5', total_usd: 3.3, request_count: 27, total_tokens: 90_000, avg_cost_per_request: 0.122 },
  ],
};

// What the backend actually returns today: per-tool cost is not tracked.
const auditStats = {
  total_entries: 40,
  by_action: { tool_call: 40 },
  by_tool: { '_mcp_health:websearch': 3677, send_email: 6, get_weather: 2 },
  total_cost_usd: 0,
  failed_actions: 0,
};

vi.mock('@/lib/api/dashboard', () => ({
  useCostHistory: () => ({ data: costHistory }),
  useCostsByModel: () => ({ data: models }),
  useCostsByTool: () => ({ data: { tools: [] } }),
  useTodayCosts: () => ({ data: null }),
  useRecentAudit: () => ({ data: { entries: [], total: 0 } }),
  useAuditStats: () => ({ data: auditStats }),
  useAgentStatus: () => ({ data: null }),
  useSchedules: () => ({ data: null }),
  useSkills: () => ({ data: null }),
}));

const { SpendDetail } = await import('@/components/dashboard/dashboardDetails');

describe('spend detail data coverage', () => {
  it('fills the quiet days so the axis covers the whole window', () => {
    const filled = fillDays(costHistory.data, HISTORY_DAYS);

    expect(filled).toHaveLength(HISTORY_DAYS);
    expect(filled[0]).toEqual({ date: window30[0], total_usd: 0, request_count: 0 });
    expect(filled.at(-1)).toEqual(costHistory.data[1]);
  });

  it('keeps a day the API returned from outside the local window', () => {
    const older = { date: '2020-01-01', total_usd: 1, request_count: 1 };
    const filled = fillDays([older, ...costHistory.data], HISTORY_DAYS);

    expect(filled).toHaveLength(HISTORY_DAYS + 1);
    expect(filled[0]).toEqual(older);
  });

  it('averages spend over every day in the window, not only the busy ones', () => {
    render(<SpendDetail />);

    // 3.3 spread over 30 days, not over the 2 days that had rows.
    expect(screen.getByText(`across ${HISTORY_DAYS} days`)).toBeInTheDocument();
    expect(screen.getByText('$0.11')).toBeInTheDocument();
  });

  it('falls back to tool call counts when the backend prices nothing per tool', () => {
    render(<SpendDetail />);

    expect(screen.getByText('Tool calls')).toBeInTheDocument();
    expect(screen.getAllByText('send_email').length).toBeGreaterThan(0);
    expect(screen.getAllByText('get_weather').length).toBeGreaterThan(0);
    // The runtime's own health probes are bookkeeping, not work the agent did.
    expect(screen.queryByText('_mcp_health:websearch')).toBeNull();
  });
});
