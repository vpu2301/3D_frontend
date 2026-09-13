import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The card frame every Übersicht section uses; the title is the h2. */
export function OverviewCard({
  title,
  badge,
  action,
  children,
  className,
  testId,
}: {
  title: string;
  badge?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  testId?: string;
}) {
  return (
    <section
      data-testid={testId}
      aria-labelledby={testId ? `${testId}-title` : undefined}
      className={cn("rounded-[14px] border border-[var(--line)] bg-[var(--paper)] p-4 sm:p-5", className)}
    >
      <header className="mb-3 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <h2 id={testId ? `${testId}-title` : undefined} className="truncate text-sm font-semibold text-[var(--ink)]">
            {title}
          </h2>
          {badge}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
