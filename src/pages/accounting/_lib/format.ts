// Locale-aware formatting — all dates/numbers/currency go through here (§2 i18n).

const LOCALE_MAP: Record<string, string> = {
  en: 'en-GB',
  de: 'de-DE',
  uk: 'uk-UA',
};

export function toIntlLocale(lang: string): string {
  return LOCALE_MAP[lang.split('-')[0]] ?? 'en-GB';
}

export function formatCurrency(lang: string, amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat(toIntlLocale(lang), {
    style: 'currency',
    currency,
  }).format(amount);
}

export function formatDate(lang: string, iso: string): string {
  return new Intl.DateTimeFormat(toIntlLocale(lang), {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(iso));
}

export function formatDateTime(lang: string, iso: string): string {
  return new Intl.DateTimeFormat(toIntlLocale(lang), {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso));
}

/** Whole days from today until the ISO date (negative = overdue). */
export function daysUntil(iso: string): number {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(iso);
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  return Math.round((targetDay.getTime() - today.getTime()) / 86_400_000);
}
