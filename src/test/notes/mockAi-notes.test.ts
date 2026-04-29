import { describe, it, expect } from 'vitest';
import {
  extractTasks,
  extractDecisions,
  suggestTags,
  suggestLinks,
  answerOverNotes,
  configureMockAi,
} from '@/pages/docs/_lib/mockAi';

configureMockAi({ failureRate: 0, minLatencyMs: 0, maxLatencyMs: 1 });

describe('extractTasks', () => {
  it('parses markdown checkbox tasks', async () => {
    const tasks = await extractTasks('- [ ] Send the comms\n- [x] Done thing');
    const sendItem = tasks.find((t) => t.text.toLowerCase().includes('send the comms'));
    expect(sendItem).toBeTruthy();
  });
  it('infers tasks from action verbs', async () => {
    const tasks = await extractTasks('We will draft the launch comms by Friday');
    expect(tasks.some((t) => /draft.*launch/i.test(t.text))).toBe(true);
  });
});

describe('extractDecisions', () => {
  it('finds sentences with decision verbs', async () => {
    const out = await extractDecisions('We decided to ship before broad rollout. Later we will sync.');
    expect(out.length).toBeGreaterThan(0);
    expect(out[0].text.toLowerCase()).toContain('ship');
  });
});

describe('suggestTags', () => {
  it('returns relevant tags and excludes existing', async () => {
    const tags = await suggestTags('Q2 kickoff meeting with action items', ['meeting']);
    expect(tags).not.toContain('meeting');
    expect(tags).toContain('q2-planning');
  });
});

describe('suggestLinks', () => {
  it('scores candidates by token overlap', async () => {
    const note = 'Discussion about the Q2 kickoff and the diff-accept rollout';
    const candidates = [
      { type: 'doc' as const, targetId: 'doc_meeting', label: 'Q2 kickoff — meeting notes' },
      { type: 'doc' as const, targetId: 'doc_unrelated', label: 'Cooking ideas' },
    ];
    const out = await suggestLinks(note, candidates);
    expect(out[0].targetId).toBe('doc_meeting');
  });
});

describe('answerOverNotes', () => {
  it('streams chunks and yields citations for matched notes', async () => {
    const stream = answerOverNotes('what about diff-accept', [
      { id: 'n1', title: 'Decisions log', text: 'We decided to ship diff-accept first.' },
      { id: 'n2', title: 'Cooking', text: 'Cacio e pepe technique.' },
    ]);
    let acc = '';
    const citations = new Set<string>();
    for await (const c of stream) {
      acc += c.chunk;
      c.citations?.forEach((id) => citations.add(id));
    }
    expect(acc.length).toBeGreaterThan(0);
    expect(citations.has('n1')).toBe(true);
  });
});
