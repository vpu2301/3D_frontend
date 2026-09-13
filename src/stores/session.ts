/**
 * Owner-app session (FE-BINDING: "Session store"; FE-ADR-003 phase 1).
 *
 * zustand holds only session/UI state: the backend connection, the tenant
 * (null until C3), the role (`owner` in phase 1), the per-browser user id,
 * the owner app's locale and where to return after a re-login. Server state
 * stays in TanStack Query.
 *
 * Token handling (FE1 §1): the token lives in memory + sessionStorage;
 * "remember this device" moves it to localStorage. Both are cleared on
 * logout. It never appears in a URL after load — `consumeMagicLink` scrubs
 * the address bar before anything else runs — and `safeReturnTo` rejects a
 * return path that carries one.
 *
 * A 401 from any request (see `onUnauthorized` in the API client) disconnects
 * the session and records the current owner-app path as `returnTo`, so the
 * auth guard can send the person to the login and the login can bring them
 * back.
 */
import { create } from "zustand";
import {
  clearAuth,
  getAuth,
  getUserId,
  isAuthPersisted,
  normalizeApiUrl,
  setAuth,
  type PincerAuth,
} from "@/lib/pincerClient";
import { ApiError, onUnauthorized, request } from "@/lib/api/client";
import { setTenantId } from "@/lib/api/tenant";
import i18n from "@/i18n";

export type VoiceLocale = "de" | "en";

/** Phase 1: everyone is the owner. Phase 2 (C3) adds `staff`. */
/** C3 roles: `owner`, `staff` (wire `viewer`), `admin` (operator acting as owner, impersonation audited). */
export type Role = "owner" | "staff" | "admin";

/**
 * Actions the UI gates on. Nav rows and buttons ask `can()` from day one so
 * C3's roles need no refactor — only this table changes.
 */
export type OwnerAction =
  | "view_full_number"
  | "copy_full_number"
  | "view_transcript_full"
  | "change_settings"
  | "view_costs"
  | "manage_team"
  | "start_call"
  | "handle_attention"
  | "add_knowledge"
  | "view_reports"
  | "start_campaign"
  | "erase_data";

const ROLE_ACTIONS: Record<Role, ReadonlySet<OwnerAction>> = {
  owner: new Set<OwnerAction>([
    "view_full_number",
    "copy_full_number",
    "view_transcript_full",
    "change_settings",
    "view_costs",
    "manage_team",
    "start_call",
    "handle_attention",
    "add_knowledge",
    "view_reports",
    "start_campaign",
    "erase_data",
  ]),
  staff: new Set<OwnerAction>(["start_call", "handle_attention", "add_knowledge", "view_reports"]),
  admin: new Set<OwnerAction>([
    "view_full_number",
    "copy_full_number",
    "view_transcript_full",
    "change_settings",
    "view_costs",
    "manage_team",
    "start_call",
    "handle_attention",
    "add_knowledge",
    "view_reports",
    "start_campaign",
    "erase_data",
  ]),
};

/** The wire role names C3 uses → the app's. */
export function roleFromWire(raw: string | null | undefined): Role | null {
  const k = (raw ?? "").toLowerCase();
  if (k === "owner" || k === "admin") return k;
  if (k === "viewer" || k === "staff") return "staff";
  return null;
}

export function canRole(role: Role | null, action: OwnerAction): boolean {
  if (!role) return false;
  return ROLE_ACTIONS[role].has(action);
}

const LOCALE_KEY = "voice.locale";
const RETURN_TO_KEY = "voice.returnTo";
const PLATFORM_FLAG = "isAuthenticated";
const PLATFORM_EMAIL = "userEmail";

export type DisconnectReason = "unauthorized" | "user";

export interface LoginInput {
  token: string;
  /** Defaults to the build's `VITE_PINCER_API_URL`, else the page origin. */
  apiUrl?: string;
  remember?: boolean;
}

export interface SessionState {
  apiUrl: string | null;
  connected: boolean;
  remembered: boolean;
  tenantId: string | null;
  tenantName: string | null;
  role: Role | null;
  /** C3 §3.5: an instance admin acting inside this tenant (banner + audit). */
  impersonating: boolean;
  userId: string;
  locale: VoiceLocale;
  returnTo: string | null;
  lastDisconnect: DisconnectReason | null;

  /** Validate a token against the backend, then store it. Throws ApiError. */
  login(input: LoginInput): Promise<void>;
  /** Store an already-validated connection (legacy /login page path). */
  connect(auth: PincerAuth, opts?: { remember?: boolean }): void;
  logout(): void;
  disconnect(reason?: DisconnectReason): void;
  can(action: OwnerAction): boolean;
  setTenant(id: string | null): void;
  setRole(role: Role | null): void;
  /** Phase 2 session facts from `POST /api/auth/session` (or `/api/status.tenancy`). */
  setSessionInfo(info: { tenantId: string | null; tenantName?: string | null; role: Role | null; impersonating?: boolean }): void;
  setLocale(locale: VoiceLocale): void;
  setReturnTo(path: string | null): void;
  /** Re-read the persisted connection (after another tab or the login page changed it). */
  refresh(): void;
}

/** German unless the browser (or an explicit choice) says English. */
export function resolveVoiceLocale(language: string | undefined = i18n.language): VoiceLocale {
  try {
    const stored = localStorage.getItem(LOCALE_KEY);
    if (stored === "de" || stored === "en") return stored;
  } catch {
    /* storage unavailable */
  }
  return language?.toLowerCase().startsWith("en") ? "en" : "de";
}

function readReturnTo(): string | null {
  try {
    return sessionStorage.getItem(RETURN_TO_KEY);
  } catch {
    return null;
  }
}

function writeReturnTo(path: string | null) {
  try {
    if (path) sessionStorage.setItem(RETURN_TO_KEY, path);
    else sessionStorage.removeItem(RETURN_TO_KEY);
  } catch {
    /* storage unavailable */
  }
}

/** Only owner-app paths are worth returning to; never a URL with a token in it. */
export function safeReturnTo(path: string | null | undefined): string | null {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return null;
  if (/[?&#](t|token|access_token|key)=/i.test(path)) return null;
  return path;
}

/** The backend this build talks to when the login does not say otherwise. */
export function defaultApiUrl(): string {
  const env = (import.meta.env.VITE_PINCER_API_URL as string | undefined)?.trim();
  if (env) return normalizeApiUrl(env);
  if (typeof window !== "undefined" && window.location?.origin) return normalizeApiUrl(window.location.origin);
  return "";
}

/**
 * Magic link (FE1 §1.1): read `t` (and an optional `api`) from the address,
 * then rewrite the URL **without them** before anything else can see it —
 * no token in history, referrer, or the address bar. Returns null when the
 * address carries no token.
 */
export function consumeMagicLink(
  search: string = typeof window !== "undefined" ? window.location.search : "",
): { token: string; apiUrl?: string } | null {
  const params = new URLSearchParams(search);
  const token = params.get("t")?.trim();
  if (!token) return null;
  const apiUrl = params.get("api")?.trim() || undefined;
  params.delete("t");
  params.delete("api");
  if (typeof window !== "undefined" && typeof history?.replaceState === "function") {
    const rest = params.toString();
    const clean = window.location.pathname + (rest ? `?${rest}` : "") + window.location.hash;
    history.replaceState(history.state, "", clean);
  }
  return { token, apiUrl };
}

function setPlatformFlag(remember: boolean) {
  // The platform's ProtectedRoute gates on this flag; keep it in the same
  // storage as the token so both expire together.
  try {
    const target = remember ? localStorage : sessionStorage;
    const other = remember ? sessionStorage : localStorage;
    target.setItem(PLATFORM_FLAG, "true");
    target.setItem(PLATFORM_EMAIL, "owner");
    other.removeItem(PLATFORM_FLAG);
    other.removeItem(PLATFORM_EMAIL);
  } catch {
    /* storage unavailable */
  }
}

function clearPlatformFlag() {
  for (const s of [localStorage, sessionStorage]) {
    try {
      s.removeItem(PLATFORM_FLAG);
      s.removeItem(PLATFORM_EMAIL);
    } catch {
      /* ignore */
    }
  }
}

export const useSession = create<SessionState>((set, get) => {
  const auth = getAuth();
  return {
    apiUrl: auth?.apiUrl ?? null,
    connected: auth !== null,
    remembered: isAuthPersisted(),
    tenantId: null,
    tenantName: null,
    role: auth ? "owner" : null,
    impersonating: false,
    userId: getUserId(),
    locale: resolveVoiceLocale(),
    returnTo: safeReturnTo(readReturnTo()),
    lastDisconnect: null,

    async login({ token, apiUrl, remember = false }) {
      const cleanToken = token.trim();
      const url = normalizeApiUrl((apiUrl ?? "").trim() || defaultApiUrl());
      if (!cleanToken) throw new ApiError("empty token", 0);
      // Validate before storing anything durable: a rejected token must not
      // linger in localStorage and bounce every later request.
      const previous = getAuth();
      setAuth({ apiUrl: url, token: cleanToken }, { persist: false });
      try {
        await request("/api/voice/status");
      } catch (err) {
        clearAuth();
        if (previous) setAuth(previous, { persist: isAuthPersisted() });
        throw err;
      }
      setAuth({ apiUrl: url, token: cleanToken }, { persist: remember });
      setPlatformFlag(remember);
      set({ apiUrl: url, connected: true, remembered: remember, role: "owner", lastDisconnect: null });
    },

    connect(next, opts = {}) {
      const remember = opts.remember ?? true;
      setAuth(next, { persist: remember });
      setPlatformFlag(remember);
      set({ apiUrl: getAuth()?.apiUrl ?? next.apiUrl, connected: true, remembered: remember, role: "owner", lastDisconnect: null });
    },

    logout() {
      clearAuth();
      clearPlatformFlag();
      writeReturnTo(null);
      set({ apiUrl: null, connected: false, remembered: false, role: null, tenantId: null, tenantName: null, impersonating: false, returnTo: null, lastDisconnect: "user" });
      setTenantId(null);
    },

    disconnect(reason = "user") {
      const here = typeof window !== "undefined" ? window.location.pathname + window.location.search : "";
      const returnTo = reason === "unauthorized" ? safeReturnTo(here) : null;
      clearAuth();
      clearPlatformFlag();
      writeReturnTo(returnTo);
      set({ apiUrl: null, connected: false, remembered: false, role: null, lastDisconnect: reason, returnTo });
    },

    can(action) {
      return canRole(get().role, action);
    },

    setTenant(id) {
      setTenantId(id);
      set({ tenantId: id });
    },

    setRole(role) {
      set({ role });
    },

    setSessionInfo(info) {
      setTenantId(info.tenantId);
      set({ tenantId: info.tenantId, tenantName: info.tenantName ?? null, role: info.role ?? get().role, impersonating: Boolean(info.impersonating) });
    },

    setLocale(locale) {
      try {
        localStorage.setItem(LOCALE_KEY, locale);
      } catch {
        /* storage unavailable */
      }
      set({ locale });
    },

    setReturnTo(path) {
      const safe = safeReturnTo(path);
      writeReturnTo(safe);
      set({ returnTo: safe });
    },

    refresh() {
      const current = getAuth();
      set({
        apiUrl: current?.apiUrl ?? null,
        connected: current !== null,
        remembered: isAuthPersisted(),
        role: current ? (get().role ?? "owner") : null,
        lastDisconnect: current !== null ? null : get().lastDisconnect,
      });
    },
  };
});

/** Hook form of `can()` that re-renders when the role changes. */
export function useCan(action: OwnerAction): boolean {
  return useSession((s) => canRole(s.role, action));
}

// One subscription for the life of the app: a rejected token logs out.
onUnauthorized(() => {
  if (useSession.getState().connected) useSession.getState().disconnect("unauthorized");
});
