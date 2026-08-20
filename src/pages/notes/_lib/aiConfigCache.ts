/**
 * One fetch of the tenant's AI configuration per page load.
 *
 * The local-only indicator is mounted in the rail and inside the ask panel, and
 * the settings sheet wants the same answer. Without a shared cache that is three
 * requests for a value that changes about as often as the tenant's contract.
 *
 * It lives in `_lib` rather than beside the component so the component file
 * exports only a component — a module that mixes the two breaks Fast Refresh.
 */

import { aiConfig, type AiConfig } from '@/pages/notes/_lib/aiClient';

let cached: Promise<AiConfig | null> | null = null;

/**
 * Never rejects. A workspace that cannot report its configuration is not an
 * error state for the caller — it simply means no compliance claim can be made,
 * and `null` says exactly that.
 */
export function loadAiConfig(): Promise<AiConfig | null> {
  if (!cached) cached = aiConfig().catch(() => null);
  return cached;
}

/** Called after a successful config PATCH, and by tests. */
export function resetAiConfigCache(): void {
  cached = null;
}
