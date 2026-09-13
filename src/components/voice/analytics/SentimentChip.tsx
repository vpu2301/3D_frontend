/**
 * How the caller seemed, with the reasoning attached.
 *
 * The rationale is on screen, not in a tooltip: a bare "Negative" invites the
 * owner to trust a label they cannot check, and the whole point of the line is
 * that they can. When retention has taken the transcript the rationale goes
 * with it, and the chip says so rather than going quiet.
 */
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { CallAnalytics } from '@/lib/api/voice';
import {
  RETENTION_REMOVED,
  SENTIMENT,
  TRAJECTORY,
  TRAJECTORY_LABEL,
  absenceCopy,
  isSentiment,
  isTrajectory,
  seemed,
  t,
} from './sentimentCopy';

export default function SentimentChip({ analytics }: { analytics: CallAnalytics | null | undefined }) {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const sentiment = analytics?.sentiment;

  // No reading: say which kind of nothing this is. Never "Neutral".
  if (!isSentiment(sentiment)) {
    return (
      <p className="text-[12px] text-[var(--text-5)]">
        {absenceCopy(analytics?.sentiment_reason, lang)}
      </p>
    );
  }

  const meta = SENTIMENT[sentiment];
  const trajectory = analytics?.sentiment_trajectory;
  const rationale = analytics?.sentiment_rationale?.trim();

  return (
    <div>
      <span
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium',
          meta.chipClass,
        )}
      >
        {/* Colour is never the only carrier: dot, word, and arrow all agree. */}
        <span className={cn('h-2 w-2 rounded-full', meta.dotClass)} />
        {t(meta.label, lang)}
        {isTrajectory(trajectory) && (
          <span title={t(TRAJECTORY_LABEL[trajectory], lang)} aria-label={t(TRAJECTORY_LABEL[trajectory], lang)}>
            {TRAJECTORY[trajectory]}
          </span>
        )}
      </span>

      <p className="mt-1.5 text-[12px] leading-relaxed text-[var(--text-3)]">
        {rationale ? (
          <>
            <span className="text-[var(--text-2)]">{seemed(sentiment, lang)}:</span> {rationale}
          </>
        ) : (
          // Sentiment survived the purge; the sentence behind it did not.
          <span className="text-[var(--text-5)]">{t(RETENTION_REMOVED, lang)}</span>
        )}
      </p>
    </div>
  );
}
