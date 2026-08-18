import type { Contact, Interaction, RelationshipStrength } from './types';

const DAY = 86_400_000;

/**
 * Deterministic relationship-strength heuristic.
 *
 * Score (0–100) is a weighted combination of:
 *   - frequency: interactions in last 90 days
 *   - recency: days since last interaction (decays exponentially)
 *   - reply ratio: outgoing replies vs incoming for emails
 *   - meeting attendance: meetings attended in last 90 days
 *
 * Same inputs → same output. The streaming "explanation" lives in mockAi;
 * the score itself is intentionally not AI.
 */
export function computeRelationshipStrengthSync(
  _contact: Contact,
  interactions: Interaction[],
  reference: number = Date.now(),
): RelationshipStrength {
  const window90 = reference - 90 * DAY;
  const recent = interactions.filter((i) => i.occurredAt >= window90);

  // Frequency (0..1) — saturates at ~30 interactions in 90 days.
  const frequencyRaw = Math.min(1, recent.length / 30);

  // Recency (0..1) — exponential decay with half-life of 14 days.
  const lastAt = interactions.reduce((m, i) => Math.max(m, i.occurredAt), 0);
  const daysSinceLast = lastAt > 0 ? (reference - lastAt) / DAY : Infinity;
  const recency = lastAt === 0 ? 0 : Math.pow(0.5, daysSinceLast / 14);

  // Reply ratio — only mail interactions.
  const mails = recent.filter((i) => i.type === 'email');
  const incoming = mails.filter((i) => i.direction === 'incoming').length;
  const outgoing = mails.filter((i) => i.direction === 'outgoing').length;
  const replied = mails.filter((i) => i.replied).length;
  const replyRatio = incoming === 0 ? (outgoing > 0 ? 0.7 : 0) : Math.min(1, replied / incoming);

  // Meeting attendance (0..1) — saturates at 6 meetings in window.
  const meetings = recent.filter((i) => i.type === 'meeting').length;
  const meetingScore = Math.min(1, meetings / 6);

  const weights = {
    frequency: 30,
    recency: 35,
    replyRatio: 15,
    meetings: 20,
  };

  const score = Math.round(
    weights.frequency * frequencyRaw +
      weights.recency * recency +
      weights.replyRatio * replyRatio +
      weights.meetings * meetingScore,
  );

  const label: RelationshipStrength['label'] =
    score >= 75 ? 'strong' : score >= 50 ? 'active' : score >= 25 ? 'cooling' : 'quiet';

  return {
    score,
    label,
    computedAt: reference,
    factors: [
      {
        label: 'Frequency',
        weight: weights.frequency,
        value: `${recent.length} interactions in 90 days`,
      },
      {
        label: 'Recency',
        weight: weights.recency,
        value:
          lastAt === 0
            ? 'no interaction recorded'
            : daysSinceLast < 1
              ? 'today'
              : daysSinceLast < 2
                ? 'yesterday'
                : `${Math.round(daysSinceLast)} days ago`,
      },
      {
        label: 'Reply ratio',
        weight: weights.replyRatio,
        value:
          mails.length === 0
            ? 'no mail in window'
            : `${replied}/${incoming || 1} replies (${Math.round(replyRatio * 100)}%)`,
      },
      {
        label: 'Meetings',
        weight: weights.meetings,
        value: `${meetings} meetings in 90 days`,
      },
    ],
  };
}
