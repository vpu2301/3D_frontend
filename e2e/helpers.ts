import type { Page } from "@playwright/test";

/**
 * The owner app talks to `auth.apiUrl + path`. For backend-free e2e the
 * magic link (or the stored session) points at MOCK_API and Playwright
 * answers every `/api/*` call from the fixtures below — deterministic, and
 * exactly the shapes of the pinned contract plus the FE1 asks.
 */
export const MOCK_API = "http://mock.pincer.local";

const NOW = new Date();
const iso = (minutesAgo: number) => new Date(NOW.getTime() - minutesAgo * 60_000).toISOString();

export const FIXTURES: Record<string, unknown> = {
  "/api/health": { status: "ok", version: "0.8.0" },
  "/api/voice/status": {
    enabled: true,
    engine: "conversation_relay",
    language: "de",
    consent_mode: "announce",
    outbound_enabled: true,
    voice_configured: true,
    webhook_base_configured: true,
    active_call_count: 1,
    listen_in_enabled: false,
    telephony: { mode: "forwarding", number_masked: "+49 5223 ••• 4521", sip_registered: null },
  },
  "/api/voice/active": [
    {
      call_sid: "CA-live-1",
      direction: "inbound",
      caller_number: "+4917112344521",
      target_number: "+495223000000",
      target_name: "",
      purpose: "Terminanfrage Jahresabschluss",
      engine: "conversation_relay",
      duration_seconds: 42,
      started_at: iso(0.7),
    },
  ],
  "/api/voice/calls": [
    { call_sid: "CA-1", direction: "inbound", status: "completed", from_number: "+4917112344521", to_number: "+495223000000", started_at: iso(30), ended_at: iso(28), duration_seconds: 120, inbound_intent: "appointment", appointment: { status: "calendar_created" } },
    { call_sid: "CA-2", direction: "inbound", status: "no-answer", from_number: "+4915112345678", to_number: "+495223000000", started_at: iso(90), ended_at: null, duration_seconds: 0, inbound_intent: "human", failure_code: "transfer_failed", failure_description: "Niemand hat abgenommen" },
    { call_sid: "CA-3", direction: "outbound", status: "completed", from_number: "+495223000000", to_number: "+4916012345678", started_at: iso(200), ended_at: iso(195), duration_seconds: 300 },
  ],
  // FE10: every spec can open a call detail; the GA scenario, roles, privacy-network and mobile specs rely on it.
  "/api/voice/calls/CA-1": {
    call_sid: "CA-1", direction: "inbound", status: "completed", from_number: "+4917112344521", to_number: "+495223000000", started_at: iso(30), ended_at: iso(28), duration_seconds: 120, inbound_intent: "appointment", language: "de",
    appointment: { status: "calendar_created", agreed_datetime: iso(-1440), duration_minutes: 30, calendar_event_link: null, retry_count: 0 },
    transcript: [{ speaker: "assistant", text: "Guten Tag, hier ist der digitale Assistent von Kanzlei Muster.", confidence: 1, state: "", timestamp: iso(30) }, { speaker: "caller", text: "Ich hätte gern einen Termin.", confidence: 0.97, state: "", timestamp: iso(29.8) }],
    actions: [{ action_type: "tool_execute", tool_name: "google__create_event", input_summary: "", output_summary: "Termin eingetragen", user_confirmed: null, timestamp: iso(29), tier: "W", approval_mode: "verbal", deny_reason: "", duration_ms: 420 }],
    tool_timeline: [{ tool: "google__create_event", tier: "W", outcome: "ok", ms: 420, approval: "verbal", reason: "", timestamp: iso(29) }],
  },
  "/api/voice/messages": [
    { id: 7, call_sid: "CA-4", caller_name: "Frau Müller", caller_name_unverified: false, callback_number: "+4917212345678", callback_unverified: false, matter: "Bitte um Rückruf wegen Steuerbescheid", urgent: true, created_at: iso(15), delivered_to_owner_at: null },
  ],
  "/api/voice/approvals/pending": [],
  "/api/voice/approvals": [],
  "/api/voice/threads": [],
  "/api/voice/residency": { mode: "eu_verified", ok: true, violations: [] },
  "/api/doctor": { score: 95, passed: true, warnings: 2, critical: 0, checks: [] },
  "/api/costs/today": { date: "2026-09-07", total_usd: 1.23, request_count: 14 },
  "/api/integrations": { integrations: [{ slug: "google", name: "Google Workspace", active: true }] },
};

export async function mockBackend(page: Page, overrides: Record<string, unknown | null> = {}) {
  await page.route(`${MOCK_API}/**`, async (route) => {
    const url = new URL(route.request().url());
    const path = url.pathname;
    if (path === "/api/approvals/stream") return route.abort();
    const body = path in overrides ? overrides[path] : FIXTURES[path];
    if (body === null) return route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ detail: "Not found" }) });
    if (body === undefined) return route.fulfill({ status: 404, contentType: "application/json", body: JSON.stringify({ detail: `no fixture for ${path}` }) });
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(body) });
  });
}

/** Start with an already-signed-in owner session (the magic-link flow has its own test). */
export async function loginAsOwner(page: Page) {
  await page.addInitScript(
    ({ apiUrl, token }: { apiUrl: string; token: string }) => {
      sessionStorage.setItem("isAuthenticated", "true");
      sessionStorage.setItem("userEmail", "owner");
      sessionStorage.setItem("pincer.web.auth", JSON.stringify({ apiUrl, token }));
    },
    { apiUrl: MOCK_API, token: "e2e-token" },
  );
}

/** The platform flag only — the owner app is then "not connected". */
export async function loginPlatformOnly(page: Page) {
  await page.addInitScript(() => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", "e2e@example.com");
  });
}
