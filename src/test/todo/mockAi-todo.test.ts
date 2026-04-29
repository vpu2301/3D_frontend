import { describe, it, expect } from 'vitest';
import {
  triageInbox,
  generateDailyPlan,
  suggestPriorityBump,
  breakDownTask,
  estimateTask,
  askAcrossTasks,
  populateSmartList,
  suggestSnoozeTime,
  nextBestTask,
  configureMockAi,
  type MockTaskMeta,
} from '@/pages/docs/_lib/mockAi';

configureMockAi({ failureRate: 0, minLatencyMs: 0, maxLatencyMs: 1 });

const mk = (over: Partial<MockTaskMeta>): MockTaskMeta => ({
  id: 't1',
  title: 'something',
  completed: false,
  priority: 3,
  projectId: null,
  listId: null,
  tags: [],
  parentId: null,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  ...over,
});

describe('triageInbox', () => {
  it('routes urgent tasks to today with P1', async () => {
    const r = await triageInbox(
      [mk({ id: 'a', title: 'urgent: send the comms' })],
      { projects: [], lists: [] },
    );
    expect(r[0].priority).toBe(1);
    expect(r[0].dueAt).toBeDefined();
  });
  it('routes by topic into the matching project', async () => {
    const r = await triageInbox(
      [mk({ id: 'a', title: 'design review notes' })],
      {
        projects: [{ id: 'p_design', name: 'Design Review' }],
        lists: [],
      },
    );
    expect(r[0].projectId).toBe('p_design');
  });
});

describe('generateDailyPlan', () => {
  it('orders by priority and lays out blocks in free time', async () => {
    const tasks = [
      mk({ id: 'low', priority: 4, estimate: 30 }),
      mk({ id: 'high', priority: 1, estimate: 45 }),
      mk({ id: 'mid', priority: 2, estimate: 60 }),
    ];
    const plan = await generateDailyPlan(tasks, [], { startHour: 9, endHour: 17 });
    expect(plan.orderedTaskIds[0]).toBe('high');
    expect(plan.orderedTaskIds[1]).toBe('mid');
    expect(plan.blocks.length).toBeGreaterThan(0);
  });
});

describe('suggestPriorityBump', () => {
  it('bumps to P2 if due in < 36h and currently lower', async () => {
    const t = mk({ id: 'a', priority: 4, dueAt: Date.now() + 12 * 3600_000 });
    const r = await suggestPriorityBump(t, undefined);
    expect(r?.newPriority).toBe(2);
  });
  it('returns null if no bump warranted', async () => {
    const t = mk({ id: 'a', priority: 1, dueAt: Date.now() + 12 * 3600_000 });
    const r = await suggestPriorityBump(t, undefined);
    expect(r).toBeNull();
  });
});

describe('breakDownTask', () => {
  it('returns subtasks tailored to the title', async () => {
    const subs = await breakDownTask(mk({ id: 'a', title: 'Write the launch blog draft' }));
    expect(subs.length).toBeGreaterThan(0);
    expect(subs[0].title.toLowerCase()).toContain('outline');
  });
});

describe('estimateTask', () => {
  it('returns reasonable estimate with confidence', async () => {
    const r = await estimateTask(mk({ title: 'review pr' }), [
      mk({ estimate: 25, completed: true }),
      mk({ estimate: 35, completed: true }),
    ]);
    expect(r.minutes).toBeGreaterThan(0);
    expect(r.confidence).toBeGreaterThan(0);
  });
});

describe('askAcrossTasks', () => {
  it('streams an answer with citedTaskIds', async () => {
    const tasks = [mk({ id: 'a', title: 'urgent design review' })];
    const stream = askAcrossTasks('design review', tasks);
    let acc = '';
    const cited = new Set<string>();
    for await (const c of stream) {
      acc += c.chunk;
      c.citedTaskIds?.forEach((id) => cited.add(id));
    }
    expect(acc.length).toBeGreaterThan(0);
    expect(cited.has('a')).toBe(true);
  });
});

describe('populateSmartList', () => {
  it('returns ids ranked by definition match', async () => {
    const tasks = [
      mk({ id: 'a', title: 'write essay', tags: ['writing'] }),
      mk({ id: 'b', title: 'pick up coffee', tags: ['errand'] }),
    ];
    const ids = await populateSmartList('writing tasks', tasks);
    expect(ids[0]).toBe('a');
  });
});

describe('suggestSnoozeTime', () => {
  it('suggests later for low-priority tasks', async () => {
    const r = await suggestSnoozeTime(mk({ priority: 4 }), []);
    expect(r.snoozeUntil).toBeGreaterThan(Date.now());
    expect(r.reason).toMatch(/low priority/i);
  });
});

describe('nextBestTask', () => {
  it('returns the best task that fits in remaining free time', async () => {
    const tasks = [
      mk({ id: 'big', priority: 1, estimate: 120 }),
      mk({ id: 'small', priority: 1, estimate: 15 }),
    ];
    const r = await nextBestTask(tasks, { now: Date.now(), freeUntilMs: Date.now() + 30 * 60_000 });
    expect(r?.id).toBe('small');
  });
});
