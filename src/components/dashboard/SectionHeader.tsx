/** Spaced-mono eyebrow + hairline — one consistent way to start a section. */
import type { ReactNode } from 'react';

export function SectionHeader({
  label,
  hint,
  action,
}: {
  label: string;
  hint?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-baseline gap-3">
      <h2 className="plat-eyebrow">{label}</h2>
      {hint && (
        <span className="text-[11px]" style={{ color: 'var(--text-5)' }}>
          {hint}
        </span>
      )}
      <div className="h-px flex-1" style={{ background: 'var(--line-soft)' }} />
      {action}
    </div>
  );
}

export default SectionHeader;
