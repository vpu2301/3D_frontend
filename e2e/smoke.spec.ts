import { expect, test } from "@playwright/test";
import { MOCK_API, loginAsOwner, loginPlatformOnly, mockBackend } from "./helpers";

test.describe("marketing and login stay untouched", () => {
  test("home renders", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("platform login page renders its form", async ({ page }) => {
    await page.goto("/login");
    await expect(page.getByRole("button", { name: /log in|sign in|anmelden/i }).first()).toBeVisible();
  });
});

test.describe("owner login (FE1)", () => {
  test("magic link signs in, scrubs the token from the address bar, and lands on the home screen", async ({ page }) => {
    await mockBackend(page);
    await page.goto(`/telephony/login?t=magic-token-123&api=${encodeURIComponent(MOCK_API)}`);
    await expect(page).toHaveURL(/\/telephony$/);
    // Token never in the address bar after load, and the scrub replaced the
    // history entry rather than adding one (Back does not resurface it).
    expect(page.url()).not.toContain("magic-token-123");
    expect(await page.evaluate(() => window.location.href)).not.toContain("magic-token-123");
    expect(await page.evaluate(() => history.length)).toBe(2);
    await expect(page.getByRole("heading", { name: "Übersicht", level: 1 })).toBeVisible();
  });

  test("a rejected magic link shows the error and the manual form", async ({ page }) => {
    await page.route(`${MOCK_API}/**`, (route) => route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ detail: "Invalid token" }) }));
    await page.goto(`/telephony/login?t=bad&api=${encodeURIComponent(MOCK_API)}`);
    await expect(page.getByRole("status")).toContainText("ungültig oder abgelaufen");
    expect(page.url()).not.toContain("t=bad");
    await expect(page.getByLabel("Zugangsschlüssel")).toBeVisible();
    await expect(page.getByLabel("Dieses Gerät merken")).not.toBeChecked();
  });

  test("manual key with a rejected token stays on the page with the server's verdict", async ({ page }) => {
    await page.route(`${MOCK_API}/**`, (route) => route.fulfill({ status: 401, contentType: "application/json", body: JSON.stringify({ detail: "nope" }) }));
    await page.goto("/telephony/login");
    await page.getByRole("button", { name: "Erweitert" }).click();
    await page.getByLabel("Server-Adresse").fill(MOCK_API);
    await page.getByLabel("Zugangsschlüssel").fill("wrong");
    await page.getByRole("button", { name: "Anmelden" }).click();
    await expect(page.getByRole("alert")).toHaveText("Der Schlüssel wurde vom Server abgelehnt.");
  });
});

test.describe("owner app shell", () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
    await loginAsOwner(page);
  });

  test("home shows today, live calls, attention, status and costs on real (mocked) endpoints", async ({ page }) => {
    await page.goto("/telephony");
    await expect(page.getByRole("heading", { name: "Übersicht", level: 1 })).toBeVisible();
    const today = page.getByTestId("card-today");
    await expect(today.getByText("berechnet im Browser")).toBeVisible();
    await expect(today.getByText("Eingehend").locator("..").getByText("2")).toBeVisible();
    await expect(today.getByText("Termine").locator("..").getByText("1")).toBeVisible();
    const now = page.getByTestId("card-now");
    await expect(now).toContainText("Terminanfrage Jahresabschluss");
    await expect(now).toContainText("+49 171 ••• 4521");
    await expect(now).not.toContainText("conversation_relay");
    const attention = page.getByTestId("card-attention");
    await expect(attention).toContainText("Dringende Nachricht");
    await expect(attention).toContainText("Weiterleitung fehlgeschlagen");
    const status = page.getByTestId("card-status");
    await expect(status).toContainText("Rufumleitung");
    await expect(status).toContainText("EU (verifiziert)");
    await expect(status).toContainText("2 Hinweise");
    await expect(status).toContainText("Verbunden (Google Workspace)");
    await expect(page.getByTestId("card-costs")).toContainText("1,23");
    await expect(page.locator("[data-banner-state=active]")).toContainText("+49 5223 ••• 4521");
  });

  test("navigates between primary areas", async ({ page, isMobile }) => {
    await page.goto("/telephony");
    const nav = isMobile ? page.getByRole("navigation", { name: "Ihr Empfang" }) : page.getByRole("complementary", { name: "Telefonie" });
    await expect(nav).toBeVisible();
    await nav.getByRole("button", { name: "Aufmerksamkeit" }).click();
    await expect(page).toHaveURL(/\/telephony\/attention$/);
    await expect(page.getByRole("heading", { name: "Aufmerksamkeit", level: 1 })).toBeVisible();
    await nav.getByRole("button", { name: "Übersicht" }).click();
    await expect(page).toHaveURL(/\/telephony$/);
  });

  test("the 'Mehr' sheet reaches setup areas, language and logout on a phone", async ({ page, isMobile }) => {
    test.skip(!isMobile, "bottom tabs only exist under md");
    await page.goto("/telephony");
    await page.getByRole("button", { name: "Mehr" }).click();
    const sheet = page.getByRole("dialog");
    await expect(sheet.getByText("Alle Bereiche")).toBeVisible();
    await sheet.getByRole("button", { name: "Datenschutz" }).click();
    await expect(page).toHaveURL(/\/telephony\/settings\/privacy$/);
    await page.getByRole("button", { name: "Mehr" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Abmelden" }).click();
    await expect(page).toHaveURL(/\/telephony\/login$/);
  });

  test("desktop rail collapses and the setup submenu expands", async ({ page, isMobile }) => {
    test.skip(isMobile);
    await page.goto("/telephony");
    const rail = page.getByRole("complementary", { name: "Telefonie" });
    await rail.getByRole("button", { name: "Einrichtung" }).click();
    await expect(rail.getByRole("button", { name: "Unternehmensprofil" })).toBeVisible();
    await rail.getByRole("button", { name: "Navigation einklappen" }).click();
    await expect(rail).toHaveAttribute("data-collapsed", "true");
    await expect(rail.getByRole("button", { name: "Anrufe", exact: true })).toBeVisible();
  });

  test("status banner reports a lost connection after two failed health polls", async ({ page, isMobile }) => {
    test.skip(isMobile, "the poll cadence is not viewport-specific; one project is enough");
    test.slow(); // two real 30 s health polls — the spec's "within 60 s" is what is measured
    await page.goto("/telephony");
    await expect(page.locator("[data-banner-state=active]")).toBeVisible();
    await page.route(`${MOCK_API}/api/health`, (route) => route.abort("connectionrefused"));
    await expect(page.locator("[data-banner-state=offline]")).toContainText("Verbindung zum Server unterbrochen", { timeout: 90_000 });
  });

  test("language switch to English is persisted", async ({ page, isMobile }) => {
    test.skip(isMobile);
    await page.goto("/telephony");
    await page.getByRole("button", { name: "Konto und Sprache" }).click();
    await page.getByRole("menuitemradio", { name: "Englisch" }).click();
    await expect(page.getByRole("heading", { name: "Overview", level: 1 })).toBeVisible();
    await page.reload();
    await expect(page.getByRole("heading", { name: "Overview", level: 1 })).toBeVisible();
  });

  test("never scrolls horizontally at 390 px", async ({ page, isMobile }) => {
    test.skip(!isMobile);
    await page.goto("/telephony");
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
  });
});

test.describe("owner app without a backend session", () => {
  test("shows the not-connected state instead of a blank screen", async ({ page }) => {
    await loginPlatformOnly(page);
    await page.goto("/telephony/calls");
    await expect(page.getByText("Nicht mit Ihrem Assistenten verbunden")).toBeVisible();
    await expect(page.getByRole("link", { name: "Zur Anmeldung" })).toHaveAttribute("href", /\/telephony\/login\?returnTo=%2Ftelephony%2Fcalls/);
  });
});
