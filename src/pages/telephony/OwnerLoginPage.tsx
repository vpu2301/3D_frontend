/**
 * Owner login (FE1 §1) at /telephony/login — outside the platform's
 * ProtectedRoute, because it is what creates the session.
 *
 * Magic link: `?t=<token>` (optionally `&api=<url>`) is consumed and scrubbed
 * from the address bar before the first render commits, then validated
 * against `GET /api/voice/status`. Manual fallback: paste the key. "Remember
 * this device" is opt-in and off by default (shared reception PCs).
 */
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, KeyRound, ShieldCheck } from "lucide-react";
import "@/i18n/voice";
import "@/styles/platform.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ApiError } from "@/lib/api/client";
import { consumeMagicLink, defaultApiUrl, safeReturnTo, useSession } from "@/stores/session";
import { useVoiceT } from "@/i18n/voice";
import { ROUTES } from "@/pages/telephony/_lib/routes";

type MagicState = "none" | "checking" | "invalid" | "unreachable";

function readReturnTo(): string {
  const fromQuery = new URLSearchParams(window.location.search).get("returnTo");
  return safeReturnTo(fromQuery) ?? useSession.getState().returnTo ?? ROUTES.HOME;
}

export default function OwnerLoginPage() {
  const t = useVoiceT("voice-auth");
  const tc = useVoiceT("voice-common");
  const navigate = useNavigate();
  const login = useSession((s) => s.login);
  const connected = useSession((s) => s.connected);
  const lastDisconnect = useSession((s) => s.lastDisconnect);

  // Consumed synchronously on first render so the token is gone from the
  // address bar before anything (analytics, a screenshot) can see it.
  const magic = useRef(consumeMagicLink());
  const [magicState, setMagicState] = useState<MagicState>(magic.current ? "checking" : "none");
  const [token, setToken] = useState("");
  const [apiUrl, setApiUrl] = useState("");
  const [remember, setRemember] = useState(false);
  const [advanced, setAdvanced] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const returnTo = useRef(readReturnTo());

  const finish = () => {
    setDone(true);
    useSession.getState().setReturnTo(null);
    navigate(returnTo.current, { replace: true });
  };

  useEffect(() => {
    const link = magic.current;
    if (!link) return;
    let cancelled = false;
    (async () => {
      try {
        await login({ token: link.token, apiUrl: link.apiUrl, remember: false });
        if (!cancelled) finish();
      } catch (err) {
        if (cancelled) return;
        setMagicState(err instanceof ApiError && err.status === 401 ? "invalid" : "unreachable");
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!token.trim()) {
      setError(t("form.errorEmpty"));
      return;
    }
    setBusy(true);
    try {
      await login({ token, apiUrl: advanced ? apiUrl : undefined, remember });
      finish();
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) setError(t("form.errorRejected"));
      else if (err instanceof ApiError && err.status === 0) setError(t("form.errorUnreachable", { url: apiUrl.trim() || defaultApiUrl() }));
      else setError(err instanceof Error ? err.message : tc("errors.network"));
    } finally {
      setBusy(false);
    }
  };

  const notice =
    magicState === "checking"
      ? t("magic.checking")
      : magicState === "invalid"
        ? t("magic.invalid")
        : magicState === "unreachable"
          ? t("magic.unreachable")
          : lastDisconnect === "unauthorized"
            ? t("sessionExpired")
            : null;

  return (
    <main className="plat flex min-h-screen items-center justify-center bg-[var(--sand)] px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[14px] bg-[var(--paper)] shadow-sm">
            <KeyRound className="h-5 w-5 text-[var(--blue)]" aria-hidden="true" />
          </span>
          <h1 className="text-xl font-semibold tracking-tight text-[var(--ink)]">{t("title")}</h1>
          <p className="mt-1 text-sm text-[var(--text-3)]">{t("subtitle")}</p>
        </div>

        {notice && (
          <p
            role="status"
            aria-live="polite"
            className={
              magicState === "checking"
                ? "mb-4 rounded-[12px] border border-[var(--line)] bg-[var(--paper)] px-3 py-2 text-sm text-[var(--text-2)]"
                : "mb-4 rounded-[12px] border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900"
            }
          >
            {notice}
          </p>
        )}

        {connected && magicState === "none" && !done && (
          <p className="mb-4 text-center text-sm text-[var(--text-3)]">
            <Link to={returnTo.current} className="underline">
              {tc("auth.action")}
            </Link>
          </p>
        )}

        <form onSubmit={onSubmit} className="rounded-[14px] border border-[var(--line)] bg-[var(--paper)] p-5 shadow-sm" aria-busy={busy || magicState === "checking"}>
          <div className="space-y-1.5">
            <Label htmlFor="owner-token">{t("form.tokenLabel")}</Label>
            <Input
              id="owner-token"
              type="password"
              autoComplete="off"
              spellCheck={false}
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder={t("form.tokenPlaceholder")}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "owner-token-error" : undefined}
              className="rounded-[10px]"
            />
            {error && (
              <p id="owner-token-error" role="alert" className="text-xs text-[var(--bad-fg)]">
                {error}
              </p>
            )}
          </div>

          <Collapsible className="mt-3">
            <CollapsibleTrigger className="flex items-center gap-1 text-xs text-[var(--text-3)] underline-offset-2 hover:underline">
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
              {t("form.whereTitle")}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-3)]">{t("form.whereBody")}</p>
            </CollapsibleContent>
          </Collapsible>

          <div className="mt-4 flex items-start justify-between gap-3">
            <div>
              <Label htmlFor="owner-remember" className="text-sm">
                {t("form.rememberLabel")}
              </Label>
              <p id="owner-remember-hint" className="mt-0.5 text-xs leading-relaxed text-[var(--text-3)]">
                {t("form.rememberHint")}
              </p>
            </div>
            <Switch id="owner-remember" checked={remember} onCheckedChange={setRemember} aria-describedby="owner-remember-hint" />
          </div>

          <Collapsible className="mt-4" open={advanced} onOpenChange={setAdvanced}>
            <CollapsibleTrigger className="flex items-center gap-1 text-xs text-[var(--text-3)] underline-offset-2 hover:underline">
              <ChevronDown className="h-3 w-3" aria-hidden="true" />
              {t("form.advanced")}
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 space-y-1.5">
                <Label htmlFor="owner-api-url">{t("form.apiUrlLabel")}</Label>
                <Input
                  id="owner-api-url"
                  inputMode="url"
                  autoComplete="off"
                  value={apiUrl}
                  onChange={(e) => setApiUrl(e.target.value)}
                  placeholder={defaultApiUrl()}
                  className="rounded-[10px]"
                />
                <p className="text-xs text-[var(--text-3)]">{t("form.apiUrlHint")}</p>
              </div>
            </CollapsibleContent>
          </Collapsible>

          <Button type="submit" disabled={busy || magicState === "checking"} className="mt-5 w-full rounded-[12px]">
            {busy ? t("form.submitting") : t("form.submit")}
          </Button>
        </form>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-[var(--text-3)]">
          <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
          {tc("app.name")}
        </p>
      </div>
    </main>
  );
}
