/**
 * FE0 §6 — the API client: auth header, tenant header, 401 contract, 422
 * field mapping, 204 handling, and the SPA-fallthrough-as-404 rule.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { setAuth, clearAuth } from "@/lib/pincerClient";
import { ApiError, api, normalizeErrorBody, onUnauthorized, request, qs } from "@/lib/api/client";
import { setTenantId } from "@/lib/api/tenant";

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { "content-type": "application/json" },
    ...init,
  });
}

describe("api client", () => {
  const fetchMock = vi.fn<typeof fetch>();

  beforeEach(() => {
    setAuth({ apiUrl: "http://api.test", token: "secret-token" });
    setTenantId(null);
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    clearAuth();
    vi.unstubAllGlobals();
  });

  it("sends the bearer token and the per-browser user id, never a tenant header without a tenant", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ ok: true }));
    await api.get("/api/voice/status");
    const [url, init] = fetchMock.mock.calls[0]!;
    expect(url).toBe("http://api.test/api/voice/status");
    const headers = init!.headers as Record<string, string>;
    expect(headers.Authorization).toBe("Bearer secret-token");
    expect(headers["X-Pincer-User"]).toBeTruthy();
    expect(headers["X-Tenant-Id"]).toBeUndefined();
  });

  it("adds X-Tenant-Id only when the session has a tenant", async () => {
    setTenantId("kanzlei-42");
    fetchMock.mockResolvedValue(jsonResponse({}));
    await api.get("/api/voice/status");
    const headers = fetchMock.mock.calls[0]![1]!.headers as Record<string, string>;
    expect(headers["X-Tenant-Id"]).toBe("kanzlei-42");
  });

  it("JSON-encodes bodies for post/put/patch and uses the verb", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: 1 }, { status: 201 }));
    await api.post("/api/voice/calls", { to: "+49", task: "x" });
    const init = fetchMock.mock.calls[0]![1]!;
    expect(init.method).toBe("POST");
    expect(init.body).toBe(JSON.stringify({ to: "+49", task: "x" }));
  });

  it("returns undefined on 204 instead of failing to parse", async () => {
    fetchMock.mockResolvedValue(new Response(null, { status: 204 }));
    await expect(api.del("/api/voice/do-not-call/%2B49")).resolves.toBeUndefined();
  });

  it("notifies unauthorized listeners on 401 and still throws", async () => {
    fetchMock.mockResolvedValue(jsonResponse({ detail: "Invalid token" }, { status: 401 }));
    const listener = vi.fn();
    const off = onUnauthorized(listener);
    await expect(request("/api/voice/status")).rejects.toMatchObject({ status: 401, message: "Invalid token" });
    expect(listener).toHaveBeenCalledTimes(1);
    off();
    fetchMock.mockResolvedValue(jsonResponse({ detail: "Invalid token" }, { status: 401 }));
    await expect(request("/api/voice/status")).rejects.toBeInstanceOf(ApiError);
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("maps FastAPI 422 bodies to per-field messages and a verbatim joined detail", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(
        {
          detail: [
            { loc: ["body", "phone_number"], msg: "Ungültige Rufnummer", type: "value_error" },
            { loc: ["body", "hours", "mon", 0], msg: "Endzeit liegt vor Startzeit", type: "value_error" },
          ],
        },
        { status: 422 },
      ),
    );
    let caught: ApiError | null = null;
    try {
      await api.post("/api/voice/receptionist/profile", {});
    } catch (e) {
      caught = e as ApiError;
    }
    expect(caught).toBeInstanceOf(ApiError);
    expect(caught!.status).toBe(422);
    expect(caught!.detail).toBe("Ungültige Rufnummer · Endzeit liegt vor Startzeit");
    expect(caught!.fields).toEqual({
      phone_number: "Ungültige Rufnummer",
      "hours.mon.0": "Endzeit liegt vor Startzeit",
    });
  });

  it("treats an HTML answer (SPA fallthrough) as a missing endpoint", async () => {
    fetchMock.mockResolvedValue(new Response("<!doctype html>", { status: 200, headers: { "content-type": "text/html" } }));
    await expect(api.get("/api/voice/nope")).rejects.toMatchObject({ status: 404 });
  });

  it("names the address when the request never leaves the browser", async () => {
    fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
    await expect(api.get("/api/voice/status")).rejects.toMatchObject({
      status: 0,
      message: expect.stringContaining("http://api.test/api/voice/status"),
    });
  });

  it("refuses to call without a connection", async () => {
    clearAuth();
    await expect(api.get("/api/voice/status")).rejects.toMatchObject({ status: 0 });
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe("normalizeErrorBody", () => {
  it("keeps a string detail verbatim", () => {
    expect(normalizeErrorBody({ detail: "Nummer steht auf der Sperrliste" }, 409)).toEqual({
      detail: "Nummer steht auf der Sperrliste",
    });
  });
  it("falls back to the status when the body is not JSON-shaped", () => {
    expect(normalizeErrorBody(null, 502)).toEqual({ detail: "HTTP 502" });
    expect(normalizeErrorBody("oops", 500)).toEqual({ detail: "HTTP 500" });
  });
  it("accepts the legacy {error} shape", () => {
    expect(normalizeErrorBody({ error: "boom" }, 500).detail).toBe("boom");
  });
});

describe("qs", () => {
  it("drops empty values and encodes the rest", () => {
    expect(qs({ limit: 200, offset: 0, unread: true, q: "", nothing: undefined })).toBe("?limit=200&offset=0&unread=true");
    expect(qs({})).toBe("");
  });
});
