/**
 * Every user-facing string and colour the analytics surfaces use, in one file.
 *
 * The copy rule is the feature: these numbers describe **the call, not the
 * person**. So the phrasing is always "seemed", never "is"; an inferred number
 * is labelled inferred; and a missing reading says which kind of missing it is
 * rather than defaulting to "Neutral", which would be a fabricated verdict.
 *
 * No emoji faces anywhere — they read differently across cultures, and a face
 * is a judgement about a person. A dot plus a word is not.
 */
import type { Sentiment, SentimentReason, SentimentTrajectory } from '@/lib/api/voice';

export interface Bilingual {
  en: string;
  de: string;
}

const de = (lang?: string) => !!lang && lang.startsWith('de');

/** Picks the language of a bilingual string; English when nothing is set. */
export const t = (entry: Bilingual, lang?: string) => (de(lang) ? entry.de : entry.en);

export interface SentimentMeta {
  /** Tailwind-ish family name, kept so every surface tints identically. */
  color: 'emerald' | 'zinc' | 'sky' | 'amber';
  label: Bilingual;
  /** Two letters for the compact dot's tooltip. */
  short: Bilingual;
  /** The dot itself, and the tint behind a chip. */
  dotClass: string;
  chipClass: string;
  barClass: string;
}

export const SENTIMENT: Record<Sentiment, SentimentMeta> = {
  positive: {
    color: 'emerald',
    label: { en: 'Positive', de: 'Positiv' },
    short: { en: 'Po', de: 'Po' },
    dotClass: 'bg-emerald-500',
    chipClass: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    barClass: 'bg-emerald-400',
  },
  neutral: {
    color: 'zinc',
    label: { en: 'Neutral', de: 'Neutral' },
    short: { en: 'Ne', de: 'Ne' },
    dotClass: 'bg-zinc-400',
    chipClass: 'border-zinc-200 bg-zinc-50 text-zinc-700',
    barClass: 'bg-zinc-400',
  },
  mixed: {
    color: 'sky',
    label: { en: 'Mixed', de: 'Gemischt' },
    short: { en: 'Mi', de: 'Ge' },
    dotClass: 'bg-sky-500',
    chipClass: 'border-sky-200 bg-sky-50 text-sky-800',
    barClass: 'bg-sky-400',
  },
  negative: {
    color: 'amber',
    label: { en: 'Negative', de: 'Negativ' },
    short: { en: 'Ng', de: 'Ng' },
    dotClass: 'bg-amber-500',
    chipClass: 'border-amber-200 bg-amber-50 text-amber-800',
    barClass: 'bg-amber-400',
  },
};

export const SENTIMENTS = Object.keys(SENTIMENT) as Sentiment[];

export const isSentiment = (v: unknown): v is Sentiment =>
  typeof v === 'string' && v in SENTIMENT;

/** Direction of travel within the call. Arrows, because they are not faces. */
export const TRAJECTORY: Record<SentimentTrajectory, string> = {
  improving: '↗',
  stable: '→',
  declining: '↘',
};

export const TRAJECTORY_LABEL: Record<SentimentTrajectory, Bilingual> = {
  improving: { en: 'improved during the call', de: 'besserte sich im Gespräch' },
  stable: { en: 'stayed about the same', de: 'blieb etwa gleich' },
  declining: { en: 'got worse during the call', de: 'verschlechterte sich im Gespräch' },
};

export const isTrajectory = (v: unknown): v is SentimentTrajectory =>
  typeof v === 'string' && v in TRAJECTORY;

// ── Phrasing ─────────────────────────────────────────────────────────

/** "Caller seemed frustrated" — an impression of a call, not a diagnosis. */
export const seemed = (sentiment: Sentiment, lang?: string): string => {
  const label = t(SENTIMENT[sentiment].label, lang).toLowerCase();
  return de(lang) ? `Anrufer wirkte ${label}` : `Caller seemed ${label}`;
};

// ── Absence ──────────────────────────────────────────────────────────

export const NOT_ASSESSED: Bilingual = { en: 'Not assessed', de: 'Nicht bewertet' };

const TOO_SHORT: Bilingual = {
  en: 'Call too short to assess',
  de: 'Anruf zu kurz für eine Einschätzung',
};

export const NO_SPEECH: Bilingual = {
  en: 'No speech to analyze',
  de: 'Keine Sprachdaten',
};

export const RETENTION_REMOVED: Bilingual = {
  en: 'Details removed per retention policy',
  de: 'Details gemäß Aufbewahrungsrichtlinie entfernt',
};

/**
 * What to say when there is no reading. Every reason maps to a sentence —
 * "not assessed" is the honest default, and it is never "neutral".
 */
export function absenceCopy(reason: SentimentReason | string | null | undefined, lang?: string): string {
  return t(reason === 'too_short' ? TOO_SHORT : NOT_ASSESSED, lang);
}

// ── Method ───────────────────────────────────────────────────────────

export const ESTIMATED_MARK = '≈';

export const ESTIMATED_TOOLTIP: Bilingual = {
  en: 'Estimated from text length (ConversationRelay engine). Exact timing is available on the Media Streams engine.',
  de: 'Geschätzt aus der Textlänge (ConversationRelay-Engine). Exakte Zeitmessung gibt es mit der Media-Streams-Engine.',
};

export const isEstimated = (method: string | null | undefined) => method === 'estimated';

// ── Talk ratio ───────────────────────────────────────────────────────

export const TALK_LABEL = {
  agent: { en: 'Agent', de: 'Agent' } as Bilingual,
  caller: { en: 'Caller', de: 'Anrufer' } as Bilingual,
  silence: { en: 'silence', de: 'Stille' } as Bilingual,
  interruptions: { en: 'interruptions', de: 'Unterbrechungen' } as Bilingual,
};

/** "2:10 of 3:05 spoken" / "2:10 von 3:05 gesprochen". */
export const spokenOf = (spoken: string, total: string, lang?: string) =>
  de(lang) ? `${spoken} von ${total} gesprochen` : `${spoken} of ${total} spoken`;

// ── Distribution ─────────────────────────────────────────────────────

/**
 * Below this many assessed calls the distribution is not shown at all: three
 * calls make "33% negative" a sentence that sounds like a trend and is not.
 */
export const MIN_ASSESSED_FOR_DISTRIBUTION = 5;

export const NOT_ENOUGH_CALLS: Bilingual = {
  en: 'Not enough calls yet',
  de: 'Noch zu wenige Anrufe',
};

export const SENTIMENT_HEADING: Bilingual = {
  en: 'Caller sentiment',
  de: 'Stimmung der Anrufer',
};

// ── History filter ───────────────────────────────────────────────────

export const FILTER_ALL: Bilingual = { en: 'Any sentiment', de: 'Beliebige Stimmung' };
export const FILTER_UNASSESSED: Bilingual = { en: 'Not assessed', de: 'Nicht bewertet' };

/** Shown when the filter can only see what the browser has loaded. */
export const FILTER_PAGE_ONLY: Bilingual = {
  en: 'filters the calls loaded so far',
  de: 'filtert die bereits geladenen Anrufe',
};
