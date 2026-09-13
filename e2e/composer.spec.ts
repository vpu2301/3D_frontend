/**
 * The call composer's mode control, in a real browser.
 *
 * The three modes used to be three pills; they are a split button now — the
 * active mode showing, the other two behind a chevron. The bug that made this
 * worth an e2e test: the wrapper that rounds the pill's ends was
 * `overflow-hidden`, which also clipped the menu — an absolutely-positioned
 * descendant — down to the height of the button. In jsdom the menu was present,
 * correctly roled and perfectly testable; on screen it was a sliver.
 *
 * So these assertions are deliberately about pixels, not the DOM: that the
 * panel is painted where it claims to be, and that a click lands on the row the
 * user aimed at.
 */
import { expect, test } from "@playwright/test";
import { loginAsOwner, mockBackend } from "./helpers";

async function openComposer(page: import("@playwright/test").Page) {
  await mockBackend(page);
  await loginAsOwner(page);
  await page.goto("/telephony/calls/ops");
  await page.getByRole("button", { name: /start call|new call/i }).first().click();
  await expect(page.getByTestId("call-mode")).toBeVisible();
}

test("opens on Call now, with the other modes behind the chevron", async ({ page }) => {
  await openComposer(page);
  await expect(page.getByTestId("call-mode")).toHaveText(/Call now/);

  await page.getByRole("button", { name: /change call type/i }).click();
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(page.getByRole("menuitem")).toHaveCount(3);
});

test("the open menu is actually painted, not clipped by the button", async ({ page }) => {
  await openComposer(page);
  await page.getByRole("button", { name: /change call type/i }).click();
  const menu = page.getByRole("menu");
  await expect(menu).toBeVisible();

  // The fade-in ends at opacity 1; a mid-animation read is not the steady state.
  await expect(menu).toHaveCSS("opacity", "1");
  // An opaque panel: the form behind it must not show through.
  await expect(menu).toHaveCSS("background-color", "rgb(255, 255, 255)");

  const box = (await menu.boundingBox())!;
  expect(box.height).toBeGreaterThan(90); // a clipped panel collapses to ~32px

  // Every row is painted where its box says it is. `elementFromPoint` returns
  // whatever the user would actually hit, so a clipped panel fails here even
  // though the node exists and reports a bounding box.
  for (const name of [/call now/i, /schedule a call/i, /schedule appointment/i]) {
    const item = page.getByRole("menuitem", { name });
    const b = (await item.boundingBox())!;
    const onTop = await page.evaluate(
      ([x, y]) => {
        const el = document.elementFromPoint(x as number, y as number);
        return el?.closest('[role="menu"]') !== null;
      },
      [b.x + b.width / 2, b.y + b.height / 2],
    );
    expect(onTop, `${name} is covered or clipped`).toBe(true);
  }
});

test("picking a mode moves the button and swaps the form", async ({ page }) => {
  await openComposer(page);
  await page.getByRole("button", { name: /change call type/i }).click();
  // Playwright verifies the hit target before clicking, so a clipped or
  // covered row fails this line rather than silently doing nothing.
  await page.getByRole("menuitem", { name: /schedule appointment/i }).click();

  await expect(page.getByTestId("call-mode")).toHaveText(/Schedule appointment/);
  await expect(page.getByRole("button", { name: "Today" })).toBeVisible();
});

test("every mode label fits on one line", async ({ page }) => {
  await openComposer(page);
  await page.getByRole("button", { name: /change call type/i }).click();
  for (const item of await page.getByRole("menuitem").all()) {
    const lines = await item.evaluate((el) => {
      const cs = getComputedStyle(el);
      return el.getBoundingClientRect().height / parseFloat(cs.lineHeight || "20");
    });
    expect(lines).toBeLessThan(2.4); // padding included; a wrapped row is ~3
  }
});

test("offers every language the backend accepts, in its own script", async ({ page }) => {
  await openComposer(page);
  await page.getByRole("button", { name: /change call type/i }).click();
  await page.getByRole("menuitem", { name: /schedule appointment/i }).click();

  const trigger = page.getByLabel("Call language");
  await trigger.click();
  // The backend's KNOWN_LANGUAGES is ("en", "de", "uk") and ConversationRelay
  // has a locale and a voice for each; the picker must not be a shorter list.
  // Endonyms, matching how the call history spells the same languages.
  await expect(page.getByRole("option")).toHaveText([
    "Auto — follow the callee",
    "English",
    "Deutsch",
    "Українська",
  ]);

  await page.getByRole("option", { name: "Українська" }).click();
  await expect(trigger).toHaveText(/Українська/);
});
