/**
 * EmptyState (T-FE0.5) — the "nothing here, and that is fine" card.
 *
 * Text comes from the caller (already translated); the component owns only
 * layout. `action` is the one thing the person can do from here.
 */
import type { ComponentType, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  icon?: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-[14px] border border-dashed border-[var(--line)] px-6 py-10 text-center",
        className,
      )}
    >
      {Icon && (
        <span className="mb-3 flex h-10 w-10 items-center justify-center rounded-[12px] bg-[var(--sand)]">
          <Icon className="h-5 w-5 text-[var(--text-3)]" aria-hidden="true" />
        </span>
      )}
      <p className="text-sm font-semibold text-[var(--ink)]">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-[var(--text-3)]">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
