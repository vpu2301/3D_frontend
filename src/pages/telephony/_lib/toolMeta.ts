/**
 * Tool vocabulary the call detail needs — the two pure helpers that survived
 * the removal of the Werkzeuge screen.
 *
 * The screen itself is gone because `/api/voice/tool-policy` is not served, but
 * a finished call still carries `tool_timeline` and `actions` on
 * `GET /api/voice/calls/{sid}`, so the Aktionen list stays real. These are the
 * only bits of the old tool-policy module that read that payload rather than
 * the missing endpoint.
 */

/** R = read-only, W = writes, X = never on the phone. */
export type Tier = "R" | "W" | "X";

/** Anything the backend did not label as R or W is treated as off-limits. */
export function tierOf(t: { tier: Tier | string | null | undefined }): Tier {
  const k = String(t.tier ?? "").toUpperCase();
  return k === "R" || k === "W" ? k : "X";
}

/** Owner-facing status for a timeline entry (FE7 §1 Aktionen). */
export type ToolOutcome = "done" | "denied" | "failed" | "deferred";

export function outcomeOf(e: { outcome: string; reason?: string }): ToolOutcome {
  if (e.outcome === "ok") return "done";
  if (e.outcome === "deferred") return "deferred";
  if (e.reason === "tool_error" || e.reason === "tool_timeout") return "failed";
  return "denied";
}
