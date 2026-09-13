import { defineConfig, devices } from "@playwright/test";

/**
 * FE0 T-FE0.4 — e2e against the Vite dev server. Chromium desktop plus an
 * iPhone 12 (390 px, WebKit) so every core flow is exercised at phone width.
 *
 * The smoke suite needs no backend: it covers the marketing entry, the login
 * page and the owner-app shell. Backend-dependent flows (FE1+) are tagged
 * @backend and skipped unless PINCER_E2E_URL and PINCER_E2E_TOKEN are set —
 * see docs/app/FE0-audit.md §7 for the `make demo-seed` ask.
 */
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
    locale: "de-DE",
    timezoneId: "Europe/Berlin",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-safari", use: { ...devices["iPhone 12"] } },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
