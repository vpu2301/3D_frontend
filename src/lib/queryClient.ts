import { QueryClient } from '@tanstack/react-query';

/**
 * One QueryClient for every page that talks to the Pincer backend
 * (Dashboard, Telephony/Voice). Shared so their caches agree — the voice
 * status polled on /telephony is the same object a dashboard widget reads.
 * Still mounted per-page rather than in App.tsx: pages that never query
 * shouldn't pay for the provider.
 */
export const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 2_000 } },
});
