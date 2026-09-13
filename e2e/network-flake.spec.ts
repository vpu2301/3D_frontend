/** FE10 §1 Reliability — a seeded 500 yields a retryable banner, never a blank page. */
import { expect, test } from "@playwright/test";
import { MOCK_API, loginAsOwner, mockBackend } from "./helpers";

const json = (body: unknown, status = 200) => ({ status, contentType: "application/json", body: JSON.stringify(body) });

test("a seeded 500 on the call list shows a retryable banner, and retry recovers", async ({ page }) => {
  let fail = true;
  await mockBackend(page);
  await page.route(`${MOCK_API}/api/voice/calls*`, (r) => (fail ? r.fulfill(json({ detail: "boom" }, 500)) : r.fulfill(json([{ call_sid: "CA-1", direction: "inbound", status: "completed", from_number: "+4917112344521", to_number: "+495223000000", started_at: new Date().toISOString(), ended_at: null, duration_seconds: 10 }]))));
  await loginAsOwner(page);
  await page.goto("/telephony/calls");
  const banner = page.getByTestId("list-error");
  await expect(banner).toBeVisible();
  await expect(page.getByRole("heading", { name: "Anrufe", level: 1 })).toBeVisible();
  fail = false;
  await banner.getByRole("button", { name: "Erneut laden" }).click();
  await expect(banner).toHaveCount(0);
  await expect(page.getByText("+49 171 ••• 4521").first()).toBeVisible();
});
