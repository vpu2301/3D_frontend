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
 *
 * S16 removed sentiment & talk ratio: both are computed per call now and the
 * numbers are on the call-detail analytics panel, the history chips and the
 * receptionist strip.
 *
 * S15 removed the last two badges — and NOT because listening now works. The
 * placeholder waveform is gone and the real player took its place, and that
 * player renders only where `/api/voice/active` says a call can be listened
 * to. On a backend without the monitor fork the field is absent, so there is
 * no button, no panel and nothing claimed: the same contract the receptionist
 * surfaces use, without a badge to forget to remove.
 *
 * So zero badges means "nothing on this page pretends", not "everything is
 * built". The assertions below are what keeps the difference honest: a
 * placeholder coming back must bring its badge with it.
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
const CALL_DETAIL_BODY = path.resolve(
  __dirname,
  '../../pages/telephony/_components/voice/CallDetailBody.tsx',
);
const LIVE_VIEW = path.resolve(__dirname, '../../pages/telephony/_components/voice/LiveView.tsx');
const LISTEN_IN = path.resolve(__dirname, '../../components/voice/listen/ListenIn.tsx');
const POLICIES = path.resolve(__dirname, '../../pages/telephony/_components/policies/PoliciesView.tsx');

/** Title props of every <MockedSection> in a source file, in page order. */
function mockedSectionTitles(file: string): string[] {
  const src = readFileSync(file, 'utf8');
  return [...src.matchAll(/<MockedSection\s+title="([^"]+)"/g)].map((m) => m[1]);
}

describe('Voice page mock inventory', () => {
  it('badges nothing: every section is either real or absent', () => {
    expect(mockedSectionTitles(VOICE_PAGE)).toEqual([]);
    expect(mockedSectionTitles(LIVE_VIEW)).toEqual([]);
  });

  it('replaced the listen-in placeholder with a gated player, not a promise', () => {
    const page = readFileSync(VOICE_PAGE, 'utf8');
    const live = readFileSync(LIVE_VIEW, 'utf8');
    for (const src of [page, live]) {
      expect(src).toContain('<ListenIn call={c} />');
      expect(src).not.toContain('waveform placeholder');
    }
    // …and the player itself shows nothing unless the backend says it can.
    const player = readFileSync(LISTEN_IN, 'utf8');
    expect(player).toContain('if (!call.listen_available) return null;');
  });

  it('no longer badges sentiment or talk ratio — analytics make them real', () => {
    const src = readFileSync(VOICE_PAGE, 'utf8');
    expect(src).not.toMatch(/<MockedSection[^>]*title="[^"]*[Ss]entiment/);
    // …and the real thing is on the page instead.
    expect(src).toContain('<SentimentDot');
    expect(readFileSync(CALL_DETAIL_BODY, 'utf8')).toContain('<AnalyticsPanel');
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

  it('FE10: no badged policy blocks — the documented-defaults sections show only when the backend declares limits_api', () => {
    // The knobs are real and enforced; what is missing is any way to read or
    // set them from here, so the page shows the documented defaults under a
    // badge rather than implying they are this deployment's values.
    expect(mockedSectionTitles(POLICIES)).toEqual([]);
    expect(readFileSync(POLICIES, 'utf8')).toContain("isDeclared('limits_api')");
    const src = readFileSync(POLICIES, 'utf8');
    // …while the do-not-call list next to them is real CRUD.
    expect(src).toContain('useAddDoNotCall');
    expect(src).toContain('useRemoveDoNotCall');
  });

  it('every badged container is greppable as data-mock="true"', () => {
    const src = readFileSync(MOCKED_BADGE, 'utf8');
    // On the rendered element, not just described in the docstring: one for
    // <MockedSection>, one for <MockedRouteBanner>.
    expect(src.match(/\sdata-mock="true"\s+className/g)).toHaveLength(2);
  });
});
