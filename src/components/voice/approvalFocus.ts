/**
 * Which call currently has a screen of its own.
 *
 * The live-call modal shows its approvals inline, next to the transcript that
 * explains them; the floating card exists for when the owner is elsewhere.
 * With both on screen the same decision appears twice, so the modal claims its
 * call while it is open and the host skips it.
 */
import { useEffect, useSyncExternalStore } from 'react';

const focused = new Set<string>();
const listeners = new Set<() => void>();
/** Stable reference, or useSyncExternalStore loops. */
let snapshot: readonly string[] = [];

function publish() {
  snapshot = [...focused];
  listeners.forEach((fn) => fn());
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** Claim a call while a screen dedicated to it is open. */
export function useClaimCallApprovals(callSid: string | null | undefined) {
  useEffect(() => {
    if (!callSid) return;
    focused.add(callSid);
    publish();
    return () => {
      focused.delete(callSid);
      publish();
    };
  }, [callSid]);
}

/** Call sids that already have their approvals on screen somewhere. */
export function useClaimedCalls(): readonly string[] {
  return useSyncExternalStore(
    subscribe,
    () => snapshot,
    () => snapshot,
  );
}
