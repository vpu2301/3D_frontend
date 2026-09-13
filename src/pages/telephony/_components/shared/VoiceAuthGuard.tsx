/**
 * Owner-app auth guard (T-FE0.2).
 *
 * The platform's ProtectedRoute checks the local login; this guard checks the
 * thing the owner app actually needs — a connection to the Pincer backend.
 * Not connected → a full-view state with the one action that helps. A 401
 * mid-session (the session store's `lastDisconnect`) → redirect to /login
 * with `returnTo`, so the person lands back on the view they were in.
 */
import { useEffect, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import { PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, safeReturnTo } from "@/stores/session";
import { useVoiceT } from "@/i18n/voice";
import { ROUTES } from "@/pages/telephony/_lib/routes";

export default function VoiceAuthGuard({ children }: { children: ReactNode }) {
  const connected = useSession((s) => s.connected);
  const lastDisconnect = useSession((s) => s.lastDisconnect);
  const refresh = useSession((s) => s.refresh);
  const location = useLocation();
  const t = useVoiceT("voice-common");

  // Another tab (or the login page) may have connected since this mounted.
  useEffect(() => {
    refresh();
    const onStorage = () => refresh();
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [refresh]);

  if (connected) return <>{children}</>;

  const here = safeReturnTo(location.pathname + location.search) ?? ROUTES.HOME;
  const loginHref = `${ROUTES.LOGIN}?returnTo=${encodeURIComponent(here)}`;

  if (lastDisconnect === "unauthorized") {
    return <Navigate to={loginHref} replace />;
  }

  return (
    <div className="flex flex-1 items-center justify-center p-6" role="status">
      <div className="max-w-md text-center">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[14px] bg-[var(--sand)]">
          <PhoneOff className="h-5 w-5 text-[var(--text-3)]" aria-hidden="true" />
        </span>
        <h2 className="text-base font-semibold text-[var(--ink)]">{t("auth.title")}</h2>
        <p className="mt-2 text-sm text-[var(--text-2)]">{t("auth.body")}</p>
        <Button asChild className="mt-5 rounded-[12px]">
          <Link to={loginHref}>{t("auth.action")}</Link>
        </Button>
      </div>
    </div>
  );
}
