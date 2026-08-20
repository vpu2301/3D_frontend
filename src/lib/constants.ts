/**
 * Shared polling cadences for TanStack Query hooks, in milliseconds.
 *
 * Kept in one place so "how stale can this page be" is a product decision,
 * not something each hook re-invents. Live sections may poll faster locally
 * (see `useActiveCalls`), but the default cadence comes from here.
 */
export const REFETCH_INTERVALS = {
  /** Voice status / call history — near-live is enough. */
  VOICE: 5_000,
} as const;
