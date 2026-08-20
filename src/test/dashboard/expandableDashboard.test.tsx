/**
 * The expand-on-demand contract: a card's detail view stays unmounted (and so
 * does not fetch) until someone expands it, and then shows both halves of the
 * layout, charts on top and tables below.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const costHistory = {
  period_days: 30,
  data: [
    { date: '2026-08-18', total_usd: 1.2, request_count: 12 },
    { date: '2026-08-19', total_usd: 2.4, request_count: 20 },
    { date: '2026-08-20', total_usd: 0.9, request_count: 7 },
  ],
  totals: { total_usd: 4.5, total_requests: 39, avg_daily_usd: 1.5 },
};

const models = {
  models: [
    { model: 'claude-opus-5', total_usd: 3.1, request_count: 21, total_tokens: 90_000, avg_cost_per_request: 0.147 },
    { model: 'claude-haiku-4-5', total_usd: 1.4, request_count: 18, total_tokens: 40_000, avg_cost_per_request: 0.077 },
  ],
};

const tools = { tools: [{ tool: 'send_email', total_usd: 0.8, call_count: 6, avg_cost: 0.13 }] };

const today = {
  date: '2026-08-20',
  total_usd: 0.9,
  by_model: { 'claude-opus-5': 0.7 },
  by_tool: { send_email: 0.2 },
  request_count: 7,
  budget: { daily_limit: 10, spent_today: 0.9, spent_pct: 9, remaining: 9.1, is_downgraded: false },
};

const historySpy = vi.fn(() => ({ data: costHistory }));

vi.mock('@/lib/api/dashboard', () => ({
  useCostHistory: () => historySpy(),
  useCostsByModel: () => ({ data: models }),
  useCostsByTool: () => ({ data: tools }),
  useTodayCosts: () => ({ data: today }),
  useRecentAudit: () => ({ data: { entries: [], total: 0 } }),
  useAuditStats: () => ({ data: { total_entries: 0, by_action: {}, by_tool: {}, total_cost_usd: 0, failed_actions: 0 } }),
  useAgentStatus: () => ({ data: null }),
  useSchedules: () => ({ data: null }),
  useSkills: () => ({ data: null }),
}));

const { Expandable } = await import('@/components/dashboard/DetailView');
const { SpendDetail } = await import('@/components/dashboard/dashboardDetails');

function Card() {
  return (
    <Expandable trigger="card" title="Spend" subtitle="Where the money goes" detail={<SpendDetail />}>
      <div className="plat-stat">
        <p className="plat-num">$0.90</p>
        <p className="plat-stat-label">Spent today</p>
      </div>
    </Expandable>
  );
}

describe('dashboard expand on demand', () => {
  it('does not mount (or fetch for) the detail until it is expanded', () => {
    historySpy.mockClear();
    render(<Card />);

    expect(screen.queryByRole('dialog')).toBeNull();
    expect(historySpy).not.toHaveBeenCalled();
  });

  it('opens a detail view with diagrams on top and data tables below', async () => {
    const user = userEvent.setup();
    render(<Card />);

    await user.click(screen.getByRole('button', { name: /expand spend/i }));

    const dialog = await screen.findByRole('dialog');
    // Top half — the diagrams.
    expect(dialog).toHaveTextContent('Diagrams');
    expect(dialog).toHaveTextContent('Spend per day');
    expect(dialog).toHaveTextContent('Cost by model');
    // Bottom half — the tables, with the real rows in them.
    expect(dialog).toHaveTextContent('Data');
    expect(dialog).toHaveTextContent('By model');
    expect(dialog).toHaveTextContent('Day by day');
    expect(screen.getAllByRole('table').length).toBeGreaterThanOrEqual(3);
    expect(screen.getAllByText('claude-opus-5').length).toBeGreaterThan(0);
    expect(screen.getByText('2026-08-19')).toBeInTheDocument();
  });
});

/**
 * The header's second affordance: the same detail, moved out of the modal and
 * into a new browser tab. jsdom has no window.open, so we hand it one whose
 * document we can then read the rendered detail out of.
 */
describe('dashboard detail pop-out', () => {
  it('moves the detail into a new tab and closes the modal', async () => {
    const popoutDoc = document.implementation.createHTMLDocument('popout');
    const fakeWindow = {
      document: popoutDoc,
      closed: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      close: vi.fn(),
    } as unknown as Window;
    const open = vi.spyOn(window, 'open').mockReturnValue(fakeWindow);
    // Vitest never injects the app's CSS, so stand one sheet in for it.
    const sheet = document.createElement('style');
    sheet.dataset.appSheet = 'true';
    document.head.appendChild(sheet);

    try {
      const user = userEvent.setup();
      render(<Card />);
      await user.click(screen.getByRole('button', { name: /expand spend/i }));

      await user.click(await screen.findByRole('button', { name: /open spend in a new tab/i }));

      // No feature string: that is the difference between a tab in the browser
      // the user is already in and a detached popup window.
      expect(open).toHaveBeenCalledWith('', '_blank');
      // The modal is gone — the window is now the detail view…
      expect(screen.queryByRole('dialog')).toBeNull();
      // …carrying the same header and the same rows.
      expect(popoutDoc.body.textContent).toContain('3days.spend');
      expect(popoutDoc.body.textContent).toContain('Spend per day');
      expect(popoutDoc.body.textContent).toContain('claude-opus-5');
      // Styles come along, or the window paints unstyled markup.
      expect(popoutDoc.head.querySelector('style[data-app-sheet]')).not.toBeNull();
    } finally {
      sheet.remove();
      open.mockRestore();
    }
  });
});

describe('detail export menu', () => {
  it('turns screen text into values a BI tool can aggregate', async () => {
    const { normalizeCell, nodeToText } = await import('@/components/dashboard/DetailMenu');

    expect(normalizeCell('1,284')).toBe(1284);
    expect(normalizeCell('$12.50')).toBe(12.5);
    expect(normalizeCell('412%')).toBe(412);
    expect(normalizeCell('—')).toBe('');
    // Anything ambiguous stays exactly as it reads on screen.
    expect(normalizeCell('<$0.01')).toBe('<$0.01');
    expect(normalizeCell('claude-opus-5')).toBe('claude-opus-5');

    expect(nodeToText(<span className="x">claude-opus-5</span>)).toBe('claude-opus-5');
    expect(nodeToText(<span>{['a', <b key="b">b</b>]}</span>)).toBe('ab');
  });

  it('offers export actions counting the rows actually on screen', async () => {
    const user = userEvent.setup();
    render(<Card />);
    await user.click(screen.getByRole('button', { name: /expand spend/i }));
    await screen.findByRole('dialog');

    await user.click(screen.getByRole('button', { name: /data options for spend/i }));
    const menu = await screen.findByRole('menu');

    // 2 models + 1 tool + 3 days = 6 rows across the three tables.
    expect(menu).toHaveTextContent('6 rows · 3 tables');
    for (const label of [/download csv/i, /download json/i, /copy for excel/i, /print/i, /refresh data/i]) {
      expect(screen.getByRole('menuitem', { name: label })).toBeEnabled();
    }
  });
});
