import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { FIXTURES, loginAsOwner, mockBackend } from "./helpers";

const ROUTES = ["/telephony/login", "/telephony", "/telephony/calls", "/telephony/calls/CA-1", "/telephony/calls/live", "/telephony/calls/pending-approval", "/telephony/messages", "/telephony/planned", "/telephony/policies", "/telephony/settings"];

for (const route of ROUTES) {
  test(`axe: no serious or critical violations on ${route}`, async ({ page }) => {
    await mockBackend(page, {
      "/api/voice/calls/CA-1": { ...(FIXTURES["/api/voice/calls"] as Array<Record<string, unknown>>)[0], transcript: [], actions: [] },
    });
    if (route !== "/telephony/login") await loginAsOwner(page);
    await page.goto(route);
    await page.getByRole("heading").first().waitFor();
    // Scoped to what the owner app owns: the platform's shared sidebar carries
    // an unlabeled icon button (AppSidebar.tsx, the notification bell) that is
    // recorded in docs/app/FE0-audit.md §1 as an ask to the platform owner.
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa"])
      .exclude('[data-sidebar="sidebar"]')
      .analyze();
    const blocking = results.violations.filter((v) => v.impact === "serious" || v.impact === "critical");
    expect(blocking, JSON.stringify(blocking.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.html) })), null, 2)).toEqual([]);
  });
}
