import { expect, test } from "@playwright/test";
import { FIXTURES, MOCK_API, loginAsOwner, mockBackend } from "./helpers";

const DETAIL = {
  ...(FIXTURES["/api/voice/calls"] as Array<Record<string, unknown>>)[0],
  language: "de",
  cost: { total_usd: 0.42 },
  appointment: { status: "calendar_created", agreed_datetime: "2026-09-09T09:30:00+02:00", duration_minutes: 30, calendar_event_link: "https://calendar.example/e/1", retry_count: 0, candidates: [], attempts: [] },
  transcript: [
    { speaker: "system", text: "[DISCLOSURE] AI disclosure announced", confidence: 1, state: "", timestamp: "2026-09-07T08:00:00Z" },
    { speaker: "agent", text: "Guten Tag, hier ist der Assistent der Kanzlei.", confidence: 1, state: "delivered", timestamp: "2026-09-07T08:00:01Z" },
    { speaker: "caller", text: "Ich hätte gern einen Termin. Meine Nummer ist 0171 1234 4521.", confidence: 0.9, state: "", timestamp: "2026-09-07T08:00:04Z" },
  ],
  actions: [
    { action_type: "tool", tool_name: "calendar_create_event", input_summary: "09.09. 09:30", output_summary: "created", user_confirmed: null, timestamp: "2026-09-07T08:01:00Z", tier: "W", approval_mode: "auto" },
  ],
};

test.describe("Anrufe (FE2)", () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page, { "/api/voice/calls/CA-1": DETAIL, "/api/voice/contacts": [{ name: "Erika Muster", phone_number: "+4917112344521", notes: "" }] });
    await loginAsOwner(page);
  });

  test("history → filter Termin gebucht → detail with appointment tab → mark handled", async ({ page, isMobile }) => {
    await page.goto("/telephony/calls");
    await expect(page.getByRole("heading", { name: "Anrufe", level: 1 })).toBeVisible();
    // Chips, never raw codes.
    await expect(page.locator("[data-result=booked]").first()).toHaveText("Termin gebucht");
    await expect(page.locator("[data-result=failed]").first()).toHaveText("Fehlgeschlagen");
    await expect(page.getByText("transfer_failed")).toHaveCount(0);
    // Contact name resolves; unknown numbers are masked.
    await expect(page.getByText("Erika Muster").locator("visible=true").first()).toBeVisible();
    await expect(page.getByText("+49 151 ••• 5678").locator("visible=true").first()).toBeVisible();
    await expect(page.getByText("+4915112345678")).toHaveCount(0);

    await page.getByLabel("Ergebnis", { exact: true }).selectOption("booked");
    await expect(page).toHaveURL(/result=booked/);
    await expect(page.locator("[data-result=failed]")).toHaveCount(0);

    const row = isMobile ? page.getByRole("button", { name: /Erika Muster/ }).first() : page.getByRole("row", { name: /Erika Muster/ }).first();
    await row.click();
    await expect(page).toHaveURL(/\/telephony\/calls\/CA-1$/);
    await expect(page.getByRole("heading", { name: "Erika Muster", level: 1 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Zusammenfassung", level: 2 })).toBeVisible();
    // Transcript: owner labels, masked number, SYSTEM line as event.
    await expect(page.getByText("KI-Hinweis vorgelesen")).toBeVisible();
    await expect(page.getByText("••• 21")).toBeVisible();
    await expect(page.getByText("0171 1234 4521")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "Vollständig anzeigen" })).toHaveCount(0);

    if (isMobile) await page.getByRole("button", { name: "Termin" }).click();
    else await page.getByRole("tab", { name: "Termin" }).click();
    await expect(page.getByText("Im Kalender eingetragen")).toBeVisible();
    await expect(page.getByText("09.09.2026, 09:30")).toBeVisible();

    await page.getByRole("button", { name: "Als erledigt markieren" }).click();
    await expect(page.getByRole("button", { name: "Wieder öffnen" })).toBeVisible();
    await expect(page.getByText("nur dieser Browser").first()).toBeVisible();
  });

  test("live call shows listen-in only as a link to the ops console", async ({ page }) => {
    await mockBackend(page, { "/api/voice/active": [{ ...(FIXTURES["/api/voice/active"] as Array<Record<string, unknown>>)[0], listen_available: true }] });
    await page.goto("/telephony/calls");
    const live = page.getByRole("region", { name: "Gerade im Gespräch" });
    await expect(live).toBeVisible();
    await expect(live.getByRole("link", { name: "Mithören" })).toHaveAttribute("href", `${MOCK_API}/voiceops`);
  });

  test("a11y-free regression: no horizontal scroll on the calls list at 390 px", async ({ page, isMobile }) => {
    test.skip(!isMobile);
    await page.goto("/telephony/calls");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});
