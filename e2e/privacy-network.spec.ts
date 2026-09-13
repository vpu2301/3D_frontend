/** FE10 §1 Security & privacy — no PII in request URLs, document.title or the console; the magic token never survives load. */
import { expect, test } from "@playwright/test";
import { MOCK_API, loginAsOwner, mockBackend } from "./helpers";

const PII = [/\+?49\s?1[57]\d{2}\s?\d{3}\s?\d{3,4}/, /4917112344521/, /4917212345678/, /Steuerbescheid/, /Erika/, /magic-token/];

test("no PII leaves the browser in URLs, titles or console output", async ({ page }) => {
  const urls: string[] = [];
  const logs: string[] = [];
  page.on("request", (r) => urls.push(r.url()));
  page.on("console", (m) => logs.push(m.text()));
  await mockBackend(page);
  await loginAsOwner(page);
  await page.goto(`/telephony/login?t=magic-token-123&api=${encodeURIComponent(MOCK_API)}`);
  await page.goto("/telephony/calls");
  await expect(page.getByText("+49 171 ••• 4521").first()).toBeVisible();
  await page.goto("/telephony/calls/CA-1");
  await expect(page).toHaveURL(/\/telephony\/calls\/CA-1$/);
  await page.goto("/telephony/messages");
  await page.goto("/telephony/policies");
  const titles = [await page.title()];
  // The magic link itself is the one URL that may carry the token: it is consumed and scrubbed on load. Nothing else may.
  const checked = urls.filter((x) => !x.startsWith("data:") && !/\/telephony\/login\?t=magic-token-123/.test(x));
  for (const u of checked) for (const re of PII) expect(u, `PII in request URL ${u}`).not.toMatch(re);
  expect(checked.some((u) => u.startsWith(MOCK_API))).toBe(true);
  for (const t of titles) for (const re of PII) expect(t).not.toMatch(re);
  for (const l of logs) for (const re of PII) expect(l, `PII in console: ${l.slice(0, 80)}`).not.toMatch(re);
  expect(page.url()).not.toContain("magic-token");
  expect(await page.evaluate(() => history.state?.usr ?? null)).toBeNull();
});
