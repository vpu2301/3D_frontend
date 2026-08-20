/**
 * Where this answer was computed (FE-5 §6).
 *
 * Small, permanent, on every answer — and deliberately not a tooltip. For a
 * firm handling privileged material, "which company's machine saw this file"
 * is not a detail to be discovered on hover; it is the question that decides
 * whether the feature may be used at all. A hover target also does not exist
 * on a phone and does not survive a screenshot into a compliance review.
 *
 * §9.4 hands the visual treatment back as design debt: this is muted small
 * text, and it should end up reassuring rather than legalistic.
 */

import { ShieldCheck } from 'lucide-react';
import { describeMeta, type AnswerMeta } from '@/pages/notes/_lib/aiClient';
import { cn } from '@/lib/utils';

interface Props {
  meta?: AnswerMeta;
  /** Marks an answer whose stream ended early; see `AnswerIncomplete`. */
  incomplete?: boolean;
  className?: string;
}

export default function AnswerFooter({ meta, incomplete, className }: Props) {
  // No meta means the backend did not say. Guessing "Anthropic · EU" because it
  // usually is would be the single most damaging thing this component could do,
  // so an unknown provenance says exactly that.
  const provenance = meta ? describeMeta(meta) : 'provider not reported';
  const local = meta?.region === 'local';

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-x-2 gap-y-0.5 pt-1.5 text-[10px] text-[var(--text-4)]',
        className,
      )}
    >
      {local && <ShieldCheck aria-hidden className="h-3 w-3" style={{ color: 'var(--ok-fg)' }} />}
      <span
        className={cn(!meta && 'italic text-[var(--text-5)]')}
        style={local ? { color: 'var(--ok-fg)' } : undefined}
      >
        {provenance}
      </span>
      {meta?.model && <span className="font-mono text-[var(--text-5)]">{meta.model}</span>}
      {incomplete && (
        <span className="plat-pill plat-pill-warn !px-1.5 !py-0 !text-[10px]">incomplete</span>
      )}
    </div>
  );
}
