/**
 * Per-route error boundary (Block I rule 11: never a blank screen).
 *
 * A render error in one view shows a small recoverable card inside the
 * shell; the rail, tabs and every other route keep working. `key` it on the
 * pathname so navigating away resets it.
 */
import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useVoiceT } from "@/i18n/voice";

interface Props {
  children: ReactNode;
}

interface State {
  error: Error | null;
}

function Fallback({ error, onRetry }: { error: Error; onRetry: () => void }) {
  const t = useVoiceT("voice-common");
  return (
    <div className="flex flex-1 items-center justify-center p-6" role="alert">
      <div className="max-w-md rounded-[14px] border border-[var(--line)] bg-[var(--paper)] p-5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-[var(--warn-fg)]" aria-hidden="true" />
          <h2 className="text-sm font-semibold text-[var(--ink)]">{t("errors.boundary")}</h2>
        </div>
        <p className="mt-2 text-sm text-[var(--text-2)]">{t("errors.boundaryHint")}</p>
        {/* The message is technical and not translated on purpose — it is what goes into the bug report. */}
        <pre className="mt-3 max-h-32 overflow-auto rounded-[10px] bg-[var(--sand)] p-3 text-[11px] text-[var(--text-3)]">
          {error.message}
        </pre>
        <Button variant="outline" size="sm" className="mt-4 rounded-[10px]" onClick={onRetry}>
          {t("errors.retry")}
        </Button>
      </div>
    </div>
  );
}

export default class ViewErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // No PII travels here: React component stacks and the message only.
    console.error("[voice] view crashed", error, info.componentStack);
  }

  render() {
    if (this.state.error) {
      return <Fallback error={this.state.error} onRetry={() => this.setState({ error: null })} />;
    }
    return this.props.children;
  }
}
