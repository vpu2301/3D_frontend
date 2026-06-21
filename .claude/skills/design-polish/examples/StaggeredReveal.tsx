/**
 * StaggeredReveal — orchestrated page-load entrance.
 *
 * Pattern, not a drop-in import: copy into your page and adapt. Demonstrates the
 * skill's motion rule — ONE staggered reveal per view, animating only transform/opacity,
 * degrading cleanly under prefers-reduced-motion.
 *
 * Uses the repo's existing `.animate-slide-up` keyframe (defined in src/index.css).
 */
import { Children, isValidElement, cloneElement, ReactNode, ReactElement } from "react";

/**
 * Wrap a list of children; each direct child reveals in sequence.
 * @param step  delay between siblings in ms (60–90 reads well)
 * @param start initial delay before the first child, ms
 */
export function Stagger({
  children,
  step = 80,
  start = 0,
  className,
}: {
  children: ReactNode;
  step?: number;
  start?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {Children.map(children, (child, i) => {
        if (!isValidElement(child)) return child;
        const el = child as ReactElement<{ className?: string; style?: React.CSSProperties }>;
        return cloneElement(el, {
          "data-reveal": true,
          className: ["animate-slide-up", el.props.className].filter(Boolean).join(" "),
          style: {
            ...el.props.style,
            animationDelay: `${start + i * step}ms`,
            animationFillMode: "both", // stay hidden until the delay elapses
          },
        } as Partial<typeof el.props> & Record<string, unknown>);
      })}
    </div>
  );
}

/* ── Usage ──────────────────────────────────────────────────────────────────
   Add the reduced-motion guard from references/motion.md to src/index.css once.

   <Stagger className="space-y-6" step={80} start={120}>
     <span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
       Platform
     </span>
     <h1 className="font-display text-6xl font-bold tracking-tight lowercase">
       intelligence, on demand
     </h1>
     <p className="max-w-prose text-lg leading-relaxed text-muted-foreground">
       Deploy AI teammates that actually ship work.
     </p>
     <div className="flex gap-3">
       <button className="standard-button">Get started</button>
       <button className="standard-button variant-outline">See how it works</button>
     </div>
   </Stagger>
   ──────────────────────────────────────────────────────────────────────────── */
