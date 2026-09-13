/**
 * The compact sentiment mark for a list row: a dot, and the word behind it in
 * the tooltip. A call with no reading renders nothing at all — a grey dot in
 * an empty cell would read as "neutral", which is a verdict nobody made.
 */
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { SENTIMENT, isSentiment, seemed, t } from './sentimentCopy';

export default function SentimentDot({
  sentiment,
  className,
}: {
  sentiment: string | null | undefined;
  className?: string;
}) {
  const { i18n } = useTranslation();
  if (!isSentiment(sentiment)) return null;

  const meta = SENTIMENT[sentiment];
  const label = t(meta.label, i18n.language);
  return (
    <span
      className={cn('inline-flex items-center gap-1', className)}
      title={seemed(sentiment, i18n.language)}
      aria-label={label}
    >
      <span className={cn('h-2 w-2 shrink-0 rounded-full', meta.dotClass)} />
      {/* The two letters keep it readable without colour (and in a screenshot). */}
      <span className="font-mono text-[9.5px] uppercase tracking-wide text-[var(--text-5)]">
        {t(meta.short, i18n.language)}
      </span>
    </span>
  );
}
