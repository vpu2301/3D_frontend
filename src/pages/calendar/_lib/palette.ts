import type { PaletteToken } from './types';

// Platform-aligned token map — every token is an existing Tailwind primitive
// the dashboard already uses (see PlatformAppsBar / KPI cards / MetricCard).
// Add/remove here only — do not hand-mix colors in components.
export const PALETTE: Record<
  PaletteToken,
  {
    chipBg: string;
    chipText: string;
    chipBorder: string;
    dot: string;
    ring: string;
    focusHatch: string;
  }
> = {
  blue: {
    chipBg: 'bg-blue-50',
    chipText: 'text-blue-900',
    chipBorder: 'border-blue-200',
    dot: 'bg-blue-500',
    ring: 'ring-[rgba(20,22,26,0.4)]',
    focusHatch: 'bg-[repeating-linear-gradient(45deg,theme(colors.blue.100)_0_6px,theme(colors.blue.50)_6px_12px)]',
  },
  violet: {
    chipBg: 'bg-violet-50',
    chipText: 'text-violet-900',
    chipBorder: 'border-violet-200',
    dot: 'bg-violet-500',
    ring: 'ring-[rgba(20,22,26,0.4)]',
    focusHatch: 'bg-[repeating-linear-gradient(45deg,theme(colors.violet.100)_0_6px,theme(colors.violet.50)_6px_12px)]',
  },
  emerald: {
    chipBg: 'bg-emerald-50',
    chipText: 'text-emerald-900',
    chipBorder: 'border-emerald-200',
    dot: 'bg-emerald-500',
    ring: 'ring-[rgba(20,22,26,0.4)]',
    focusHatch: 'bg-[repeating-linear-gradient(45deg,theme(colors.emerald.100)_0_6px,theme(colors.emerald.50)_6px_12px)]',
  },
  amber: {
    chipBg: 'bg-amber-50',
    chipText: 'text-amber-900',
    chipBorder: 'border-amber-200',
    dot: 'bg-amber-500',
    ring: 'ring-[rgba(20,22,26,0.4)]',
    focusHatch: 'bg-[repeating-linear-gradient(45deg,theme(colors.amber.100)_0_6px,theme(colors.amber.50)_6px_12px)]',
  },
  rose: {
    chipBg: 'bg-rose-50',
    chipText: 'text-rose-900',
    chipBorder: 'border-rose-200',
    dot: 'bg-rose-500',
    ring: 'ring-[rgba(20,22,26,0.4)]',
    focusHatch: 'bg-[repeating-linear-gradient(45deg,theme(colors.rose.100)_0_6px,theme(colors.rose.50)_6px_12px)]',
  },
  sky: {
    chipBg: 'bg-sky-50',
    chipText: 'text-sky-900',
    chipBorder: 'border-sky-200',
    dot: 'bg-sky-500',
    ring: 'ring-[rgba(20,22,26,0.4)]',
    focusHatch: 'bg-[repeating-linear-gradient(45deg,theme(colors.sky.100)_0_6px,theme(colors.sky.50)_6px_12px)]',
  },
  indigo: {
    chipBg: 'bg-indigo-50',
    chipText: 'text-indigo-900',
    chipBorder: 'border-indigo-200',
    dot: 'bg-indigo-500',
    ring: 'ring-[rgba(20,22,26,0.4)]',
    focusHatch: 'bg-[repeating-linear-gradient(45deg,theme(colors.indigo.100)_0_6px,theme(colors.indigo.50)_6px_12px)]',
  },
};
