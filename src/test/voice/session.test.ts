/**
 * FE1 §7 — session store: magic-link parse + URL scrub, remember-device
 * storage, 401 logout, and `can()` gating.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { clearAuth, getAuth, isAuthPersisted } from "@/lib/pincerClient";
import { ApiError } from "@/lib/api/client";
import { canRole, consumeMagicLink, defaultApiUrl, useSession } from "@/stores/session";

// A fresh Response per call: a body can only be read once.
const jsonResponse = (body: unknown, status = 200) => () =>
  Promise.resolve(new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } }));

describe("consumeMagicLink", () => {
  it("reads t (and api) and scrubs them from the address bar", () => {
    const replace = vi.spyOn(history, "replaceState");
    window.history.pushState({}, "", "/telephony/login?t=abc123&api=https%3A%2F%2Fapi.example&returnTo=%2Ftelephony%2Fcalls");
    const link = consumeMagicLink();
    expect(link).toEqual({ token: "abc123", apiUrl: "https://api.example" });
    expect(window.location.search).toBe("?returnTo=%2Ftelephony%2Fcalls");
    expect(window.location.href).not.toContain("abc123");
    expect(replace).toHaveBeenCalled();
    replace.mockRestore();
  });

  it("returns null when there is no token", () => {
    window.history.pushState({}, "", "/telephony/login");
    expect(consumeMagicLink()).toBeNull();
    expect(consumeMagicLink("?returnTo=%2Fx")).toBeNull();
  });
});

describe("login", () => {
  const fetchMock = vi.fn<typeof fetch>();
  beforeEach(() => {
    clearAuth();
    localStorage.clear();
    sessionStorage.clear();
    useSession.getState().refresh();
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    clearAuth();
  });

  it("keeps the token in sessionStorage by default and in localStorage when remembered", async () => {
    fetchMock.mockImplementation(jsonResponse({ enabled: true }));
    await useSession.getState().login({ token: "tok", apiUrl: "http://api.test" });
    expect(getAuth()).toEqual({ apiUrl: "http://api.test", token: "tok" });
    expect(isAuthPersisted()).toBe(false);
    expect(sessionStorage.getItem("pincer.web.auth")).toContain("tok");
    expect(localStorage.getItem("pincer.web.auth")).toBeNull();
    expect(sessionStorage.getItem("isAuthenticated")).toBe("true");
    expect(useSession.getState().connected).toBe(true);
    expect(useSession.getState().role).toBe("owner");

    await useSession.getState().login({ token: "tok2", apiUrl: "http://api.test", remember: true });
    expect(isAuthPersisted()).toBe(true);
    expect(localStorage.getItem("pincer.web.auth")).toContain("tok2");
    expect(sessionStorage.getItem("pincer.web.auth")).toBeNull();
    expect(localStorage.getItem("isAuthenticated")).toBe("true");
  });

  it("validates against /api/voice/status and stores nothing on 401", async () => {
    fetchMock.mockImplementation(jsonResponse({ detail: "Invalid token" }, 401));
    await expect(useSession.getState().login({ token: "bad", apiUrl: "http://api.test" })).rejects.toMatchObject({ status: 401 });
    expect(fetchMock.mock.calls[0]![0]).toBe("http://api.test/api/voice/status");
    expect(getAuth()).toBeNull();
    expect(useSession.getState().connected).toBe(false);
    expect(sessionStorage.getItem("isAuthenticated")).toBeNull();
  });

  it("logs out on a 401 from any later request and remembers where to return", async () => {
    fetchMock.mockImplementation(jsonResponse({ ok: true }));
    await useSession.getState().login({ token: "tok", apiUrl: "http://api.test", remember: true });
    window.history.pushState({}, "", "/telephony/calls?view=table");
    fetchMock.mockImplementation(jsonResponse({ detail: "expired" }, 401));
    const { request } = await import("@/lib/api/client");
    await expect(request("/api/voice/calls")).rejects.toBeInstanceOf(ApiError);
    const s = useSession.getState();
    expect(s.connected).toBe(false);
    expect(s.lastDisconnect).toBe("unauthorized");
    expect(s.returnTo).toBe("/telephony/calls?view=table");
    expect(getAuth()).toBeNull();
    expect(localStorage.getItem("isAuthenticated")).toBeNull();
  });

  it("logout clears both storages and the platform flag", async () => {
    fetchMock.mockImplementation(jsonResponse({}));
    await useSession.getState().login({ token: "tok", apiUrl: "http://api.test", remember: true });
    useSession.getState().logout();
    expect(getAuth()).toBeNull();
    expect(localStorage.getItem("pincer.web.auth")).toBeNull();
    expect(sessionStorage.getItem("pincer.web.auth")).toBeNull();
    expect(localStorage.getItem("isAuthenticated")).toBeNull();
    expect(useSession.getState().role).toBeNull();
  });

  it("falls back to the build's API URL, then the page origin", () => {
    expect(defaultApiUrl()).toBe(window.location.origin);
  });
});

describe("can()", () => {
  it("gates by role with owner as the phase-1 default", () => {
    expect(canRole("owner", "view_full_number")).toBe(true);
    expect(canRole("owner", "view_costs")).toBe(true);
    expect(canRole("staff", "view_full_number")).toBe(false);
    expect(canRole("staff", "start_call")).toBe(true);
    expect(canRole(null, "start_call")).toBe(false);
  });
});
