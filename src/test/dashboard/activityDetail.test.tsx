/**
 * "Actions per day" has to come from per-day counts, not from the page of
 * audit rows: `/api/audit` is newest-first, so on a busy agent 200 rows are
 * minutes of history and the 14-day chart renders as one bar and 13 gaps.
 */
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { lastDays, shortDay } from '@/components/dashboard/dashFormat';

const window14 = lastDays(14);

// Every row in the page is from today — what a live audit log looks like.
const entries = Array.from({ length: 200 }, (_, i) => ({
  id: String(i),
  timestamp: new Date().toISOString(),
  user_id: 'mcp:websearch',
  action: 'tool_call',
  tool: '_mcp_health:websearch',
  input_summary: '',
  output_summary: 'healthy',
  approved: true,
  cost_usd: 0,
  duration_ms: null,
}));

const daily = window14.map((date, i) => ({ date, total: (i + 1) * 100, failed: i }));

const auditDailySpy = vi.fn(() => ({ data: daily }));

vi.mock('@/lib/api/dashboard', () => ({
  useRecentAudit: () => ({ data: { entries, total: 32_000 } }),
  useAuditDaily: () => auditDailySpy(),
  useAuditStats: () => ({
    data: { total_entries: 32_000, by_action: { tool_call: 32_000 }, by_tool: {}, total_cost_usd: 0, failed_actions: 91 },
  }),
  useCostHistory: () => ({ data: null }),
  useCostsByModel: () => ({ data: null }),
  useCostsByTool: () => ({ data: null }),
  useTodayCosts: () => ({ data: null }),
  useAgentStatus: () => ({ data: null }),
  useSchedules: () => ({ data: null }),
  useSkills: () => ({ data: null }),
}));

const { ActivityDetail } = await import('@/components/dashboard/dashboardDetails');

// The plots lay themselves out in real pixels; jsdom measures everything as 0.
beforeAll(() => {
  Object.defineProperty(HTMLElement.prototype, 'clientWidth', { configurable: true, value: 640 });
});

describe('actions per day', () => {
  it('renders the counted days instead of the empty-chart placeholder', () => {
    auditDailySpy.mockReturnValue({ data: daily });
    render(<ActivityDetail />);

    expect(screen.queryByText('No actions recorded in this period')).toBeNull();
    const chart = screen.getByRole('img', { name: /actions per day/i });
    // Every day in the window is a bar, oldest tick first.
    expect(chart.querySelectorAll('path').length).toBeGreaterThanOrEqual(window14.length);
    expect(chart.textContent).toContain(shortDay(window14[0]));
  });

  it('falls back to bucketing the rows when the counts are unavailable', () => {
    auditDailySpy.mockReturnValue({ data: undefined });
    render(<ActivityDetail />);

    // The page of rows is all from today: one bar, and no crash.
    const chart = screen.getByRole('img', { name: /actions per day/i });
    expect(chart.querySelectorAll('path').length).toBe(1);
  });
});
