/**
 * DistinctiveCard — a card with real character (not a generic bordered box).
 *
 * Demonstrates:
 *  - context-specific character: oversized index numeral, diagonal accent rule
 *  - crafted edge (.border-crafted) + layered hover shadow (.shadow-layered)
 *  - hierarchy from case/tracking contrast
 *  - layout-stable hover (transform only)
 *
 * Uses utilities from references/textures.css and the repo's token classes.
 */
interface DistinctiveCardProps {
  index: number;          // shown as an oversized, faded numeral — gives the card identity
  eyebrow: string;        // UPPERCASE tracked-out label
  title: string;          // lowercase tight display headline
  body: string;
}

export default function DistinctiveCard({ index, eyebrow, title, body }: DistinctiveCardProps) {
  return (
    <article
      className="border-crafted rule-diagonal group relative overflow-hidden rounded-2xl bg-card p-7 transition-transform duration-300 ease-out hover:-translate-y-1.5 hover:[box-shadow:0_24px_48px_rgba(20,20,19,0.1)]"
      style={{ transitionTimingFunction: "cubic-bezier(0.22,1,0.36,1)" }}
    >
      {/* Oversized index numeral — grid-breaking, low-opacity, sits behind content */}
      <span
        aria-hidden
        className="font-display pointer-events-none absolute -right-2 -top-6 select-none text-8xl font-bold leading-none text-foreground/[0.04] transition-colors group-hover:text-foreground/[0.07]"
      >
        {String(index).padStart(2, "0")}
      </span>

      <div className="relative z-10 space-y-3">
        <span className="text-[0.7rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          {eyebrow}
        </span>
        <h3 className="font-display text-2xl font-bold lowercase tracking-tight text-foreground">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
      </div>
    </article>
  );
}

/* ── Usage (asymmetric, grid-breaking layout) ─────────────────────────────────
   import { Stagger } from "./StaggeredReveal";

   <Stagger className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" step={70}>
     <DistinctiveCard index={1} eyebrow="Research" title="reads everything"
       body="Digests docs, tickets, and the web so your team doesn't have to." />
     <DistinctiveCard index={2} eyebrow="Outreach" title="never drops a thread"
       body="Personalized follow-ups that actually sound like you." />
     {/* offset the third card to break the grid: className="lg:translate-y-8" */}
     <DistinctiveCard index={3} eyebrow="Ops" title="closes the loop"
       body="Triages, routes, and resolves while you sleep." />
   </Stagger>
   ──────────────────────────────────────────────────────────────────────────── */
