import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface ViewHeaderProps {
  title: string;
  subtitle: string;
  right?: ReactNode;
}

export default function ViewHeader({ title, subtitle, right }: ViewHeaderProps) {
  const { t } = useTranslation('accounting');
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[var(--line-soft)] px-6 pb-5 pt-5">
      <div className="min-w-0">
        <p className="plat-crumb mb-1.5 text-[12px] text-[var(--text-4)]">3days.close</p>
        <h1 className="text-[26px] leading-tight text-[var(--ink)]">{title}</h1>
        <p className="mt-1 text-[13px] text-[var(--text-4)]">{subtitle}</p>
      </div>
      <div className="flex shrink-0 items-center gap-3 pt-1">
        {right}
        <span className="plat-pill plat-pill-ok">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-[var(--ok-fg)]" />
          {t('connected')}
        </span>
      </div>
    </div>
  );
}
