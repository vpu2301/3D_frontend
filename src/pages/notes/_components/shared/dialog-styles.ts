/**
 * Shared modal styling for the Notes app, matching the platform dialog
 * language: `.plat-btn` ink pill actions, `.plat-field` inputs, ink primary.
 *
 * Separate from `NotesDialog.tsx` so that file exports components only — a
 * module that mixes components and constants opts out of Fast Refresh.
 */

export const dialogButton = {
  primary:
    'plat-btn !h-9 !px-4 justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(20,22,26,0.25)] disabled:cursor-not-allowed',
  danger:
    'inline-flex h-9 items-center justify-center gap-1.5 rounded-full px-4 text-[13px] font-semibold text-white transition-opacity hover:opacity-86 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(179,56,46,0.35)] disabled:cursor-not-allowed disabled:opacity-40 bg-[var(--bad-fg)]',
  ghost:
    'plat-btn-ghost !h-9 justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(20,22,26,0.2)]',
} as const;

/* `.plat-field` carries the frame, radius, fill and the blue active border —
   the same definition every other field in the app uses. */
export const dialogField = 'plat-field w-full px-3 py-2 text-sm';

/** Field label above an input inside a notes modal. */
export const dialogLabel = 'plat-eyebrow block';
