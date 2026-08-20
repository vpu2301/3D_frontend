/**
 * The de-mock contract, enforced.
 *
 * The rule for this page is "real data or a visible MOCK badge", and the
 * failure mode it guards against is silent drift in both directions: a badge
 * left on a section the backend now serves (the page lies about being fake),
 * or a badge quietly deleted from something still mocked (the page lies about
 * being real). Both are one-line edits nobody notices in review, so the
 * inventory is pinned here and de-mocking something means deliberately
 * changing this list.
 *
 * v2 removed exactly one entry — per-call cost, real since Sprint 9 T9.1's
 * `call_costs` — leaving two: live listen-in and sentiment/talk ratio.
 *
 * v3 removed the approval queue: Sprint 11 §6.5 parks `user`-mode gates and
 * `/api/voice/approvals/pending` lists them, so that screen renders real
 * approvals and its badge is gone. The two on the Voice page are unchanged —
 * v3 added no new mocked sections.
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

const VOICE_PAGE = path.resolve(__dirname, '../../pages/telephony/_components/voice/VoicePage.tsx');
const MOCKED_BADGE = path.resolve(__dirname, '../../components/voice/MockedBadge.tsx');
const PENDING_APPROVAL = path.resolve(
  __dirname,
  '../../pages/telephony/_components/voice/PendingApprovalView.tsx',
);
const RECEPTIONIST = path.resolve(
  __dirname,
  '../../pages/telephony/_components/voice/ReceptionistPanel.tsx',
);
const MESSAGES = path.resolve(__dirname, '../../pages/telephony/_components/voice/MessagesView.tsx');

/** Title props of every <MockedSection> in a source file, in page order. */
function mockedSectionTitles(file: string): string[] {
  const src = readFileSync(file, 'utf8');
  return [...src.matchAll(/<MockedSection\s+title="([^"]+)"/g)].map((m) => m[1]);
}

describe('Voice page mock inventory', () => {
  it('badges exactly the two sections the backend still cannot serve', () => {
    expect(mockedSectionTitles(VOICE_PAGE)).toEqual([
      'Live listen-in',
      'Sentiment & talk ratio',
    ]);
  });

  it('no longer badges per-call cost — call_costs makes it real', () => {
    const src = readFileSync(VOICE_PAGE, 'utf8');
    const badged = src.slice(src.indexOf('<MockedSection'));
    expect(badged).not.toMatch(/<MockedSection[^>]*title="[^"]*[Cc]ost/);
    // …and the real cost is on the page instead.
    expect(src).toContain('<CostCell');
  });

  it('no longer badges the approval queue — approvals/pending makes it real', () => {
    expect(mockedSectionTitles(PENDING_APPROVAL)).toEqual([]);
    const src = readFileSync(PENDING_APPROVAL, 'utf8');
    expect(src).toContain('usePendingApprovals');
  });

  it('adds no badged sections with the v3 receptionist surfaces', () => {
    // Both are backend-gated instead: no endpoint means the surface says so,
    // which is the same contract without a badge to forget to remove.
    expect(mockedSectionTitles(RECEPTIONIST)).toEqual([]);
    expect(mockedSectionTitles(MESSAGES)).toEqual([]);
  });

  it('every badged container is greppable as data-mock="true"', () => {
    const src = readFileSync(MOCKED_BADGE, 'utf8');
    // On the rendered element, not just described in the docstring: one for
    // <MockedSection>, one for <MockedRouteBanner>.
    expect(src.match(/\sdata-mock="true"\s+className/g)).toHaveLength(2);
  });
});
