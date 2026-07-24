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
    <div className="flex items-start justify-between gap-4 border-b border-gray-100 px-6 pb-4 pt-5">
      <div>
        <h1 className="font-display text-2xl font-light text-gray-900">{title}</h1>
        <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3 pt-1">
        {right}
        <span className="flex items-center gap-1.5 rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700">
          <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-green-500" />
          {t('connected')}
        </span>
      </div>
    </div>
  );
}
