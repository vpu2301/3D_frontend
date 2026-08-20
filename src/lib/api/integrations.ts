/**
 * Integrations client — everything here is REAL backend state.
 *
 * GET /api/integrations returns one flat list whose `source` field separates
 * three very different things, which is what the page has to make legible:
 *
 *   source: "builtin"      core tools (shell/python/file/browser/…). Always on,
 *                          nothing to connect.
 *   source: "integration"  the two services Pincer can actually authorize:
 *                          Google Workspace (OAuth consent) and Slack (bot
 *                          token). `status` is derived server-side from whether
 *                          the credential files exist, so "active" literally
 *                          means the token is on disk and usable.
 *   source: "mcp"          MCP tool servers from the agent's config; `status`
 *                          follows the server's `enabled` flag.
 *
 * GET /api/integrations/{slug} (google | slack only) adds the per-category tool
 * catalog and real call counts pulled from the audit log.
 *
 * Authorization itself runs on the machine hosting the agent — `pincer
 * setup-google` opens the Google consent screen, `pincer setup-slack` takes a
 * bot token. There is no browser-facing OAuth endpoint, so the UI reports state
 * and hands over the exact command instead of pretending to start a flow.
 */
import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api/voice";
import { isConnected, PincerError } from "@/lib/pincerClient";

export interface IntegrationEntry {
  name: string;
  description: string;
  status: "active" | "disabled" | string;
  source: "builtin" | "integration" | "mcp" | string;
  version?: string;
  author?: string;
  slug?: string;
  tools?: string[];
  permissions?: string[] | boolean;
  approval_required?: boolean;
}

export interface IntegrationDetail {
  slug: string;
  name: string;
  author: string;
  description: string;
  status: "active" | "disabled" | string;
  tool_count: number;
  categories: Array<{ name: string; tools: Array<{ name: string; description: string }> }>;
  usage: { total_calls: number; by_tool: Record<string, number> };
}

/** Everything the agent has: built-in tools, authorizable services, MCP servers. */
export function useIntegrations() {
  return useQuery<{ integrations: IntegrationEntry[] }, PincerError>({
    queryKey: ["integrations", "list"],
    queryFn: () => apiFetch<{ integrations: IntegrationEntry[] }>("/api/integrations"),
    refetchInterval: 30_000,
    enabled: isConnected(),
  });
}

/** Tool catalog + real usage counts. Only `google` and `slack` have a detail route. */
export function useIntegrationDetail(slug: string | null) {
  return useQuery<IntegrationDetail, PincerError>({
    queryKey: ["integrations", "detail", slug],
    queryFn: () => apiFetch<IntegrationDetail>(`/api/integrations/${slug}`),
    enabled: isConnected() && !!slug,
  });
}

/**
 * The services Pincer can authorize, and how. Kept beside the client because
 * the backend reports *whether* a service is connected but not *how* to
 * connect it — that knowledge lives in the CLI (`pincer setup-*`).
 */
export const AUTHORIZABLE: Record<
  string,
  { command: string; method: string; docs: string; prerequisite: string }
> = {
  google: {
    command: "pincer setup-google",
    method: "OAuth 2.0 — opens Google's consent screen",
    docs: "https://console.cloud.google.com/apis/credentials",
    prerequisite: "An OAuth client (Desktop app) saved as google_credentials.json",
  },
  slack: {
    command: "pincer setup-slack",
    method: "Bot token from a Slack App you install to the workspace",
    docs: "https://api.slack.com/apps",
    prerequisite: "A Slack App with the bot scopes the setup command lists",
  },
};

/** Split the flat list into the three questions the page answers. */
export function groupIntegrations(entries: IntegrationEntry[] | undefined) {
  const all = entries ?? [];
  const services = all.filter((e) => e.source === "integration");
  return {
    /** Authorized right now — token on disk, tools live. */
    connected: services.filter((e) => e.status === "active"),
    /** Pincer supports it, no credentials yet. */
    connectable: services.filter((e) => e.status !== "active"),
    /** MCP tool servers from the agent's config. */
    mcp: all.filter((e) => e.source === "mcp"),
    /** Core tools — always on, nothing to authorize. */
    builtin: all.filter((e) => e.source === "builtin"),
  };
}
