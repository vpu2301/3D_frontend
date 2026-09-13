/** FE10 §1 Mobile — core routes at 390 × 844: no horizontal scroll, primary actions ≥ 44 px. */
import { devices, expect, test } from "@playwright/test";
import { loginAsOwner, mockBackend } from "./helpers";

test.use({ ...devices["iPhone 12"], viewport: { width: 390, height: 844 } });

const CORE = ["/telephony", "/telephony/calls", "/telephony/calls/CA-1", "/telephony/messages", "/telephony/planned"];

for (const route of CORE) {
  test(`phone: ${route} has no horizontal scroll and 44 px primary actions`, async ({ page }) => {
    await mockBackend(page);
    await loginAsOwner(page);
    await page.goto(route);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    // primary actions: the bottom tab bar and the first visible buttons of the view
    // Primary actions: the bottom tab bar plus the view's own buttons and tabs (secondary chips excluded by size class).
    const targets = await page.locator("nav button, main button, main [role='tab'], main a[class*='min-h-11']").evaluateAll((els) => els.filter((e) => (e as HTMLElement).offsetParent !== null).map((e) => { const r = e.getBoundingClientRect(); return { h: r.height, w: r.width, text: (e.textContent ?? "").trim().slice(0, 24) }; }).filter((t) => t.text.length > 0).slice(0, 12));
    expect(targets.length).toBeGreaterThan(0);
    for (const t of targets) expect(t.h, `${t.text} height`).toBeGreaterThanOrEqual(44);
  });
}

test("phone: reveal a masked number by touch", async ({ page }) => {
  await mockBackend(page);
  await loginAsOwner(page);
  await page.goto("/telephony/calls/CA-1");
  const reveal = page.getByLabel("Vollständige Nummer anzeigen").first();
  await reveal.tap();
  await expect(page.getByLabel("Nummer wieder verbergen").first()).toBeVisible();
});
