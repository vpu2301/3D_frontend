/**
 * AsymmetricHero — a grid-breaking, off-center hero.
 *
 * Demonstrates the skill's composition rules:
 *  - intentional asymmetry (7/5 split, not centered)
 *  - overlapping + grid-breaking objects (offset panel, floating chip)
 *  - generous negative space + diagonal flow
 *  - premium texture (mesh background, layered shadow, grain) — all on-palette
 *  - hierarchy from weight/case/tracking contrast, not size alone
 *
 * Relies on utilities from references/textures.css (.mesh-warm, .grain, .shadow-layered,
 * .border-crafted) and the repo's .standard-button. Display font assumes a `font-display`
 * family is configured (see references/typography.md); falls back gracefully if not.
 */
import { Stagger } from "./StaggeredReveal";

export default function AsymmetricHero() {
  return (
    <section className="mesh-warm grain relative overflow-hidden">
      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-28 lg:grid-cols-12 lg:py-40">
        {/* Left: text, weighted to 7 cols, deliberately not centered */}
        <Stagger className="space-y-7 lg:col-span-7" step={80} start={120}>
          <span className="inline-block text-xs font-medium uppercase tracking-[0.28em] text-muted-foreground">
            AI Workforce
          </span>

          <h1 className="font-display text-5xl font-bold lowercase leading-[0.95] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            hire intelligence,
            <br />
            <span className="text-muted-foreground">not headcount</span>
          </h1>

          <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
            Autonomous AI teammates that handle the work your team keeps putting off —
            briefed in minutes, shipping by lunch.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button className="standard-button">Start free</button>
            <button className="standard-button variant-ghost">Watch the demo →</button>
          </div>
        </Stagger>

        {/* Right: overlapping panel that breaks the grid and bleeds past the gutter */}
        <div className="relative lg:col-span-5">
          <div className="shadow-layered border-crafted relative z-10 rounded-2xl bg-card p-6 lg:translate-x-8 lg:-rotate-1">
            <div className="flex items-center gap-3 border-b border-border pb-4">
              <div className="h-9 w-9 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-semibold text-foreground">Ada — Research Agent</p>
                <p className="text-xs text-muted-foreground">active · 3 tasks running</p>
              </div>
            </div>
            <div className="space-y-3 pt-4 text-sm text-muted-foreground">
              <p>✓ Compiled Q3 competitor brief</p>
              <p>✓ Drafted 14 outreach emails</p>
              <p className="text-foreground">→ Summarizing 240 support tickets…</p>
            </div>
          </div>

          {/* Floating grid-breaking chip, overlaps the panel corner */}
          <div className="glass-strong absolute -left-6 -top-6 z-20 hidden rounded-xl px-4 py-3 lg:block">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">saved / wk</p>
            <p className="font-display text-2xl font-bold text-foreground">37 hrs</p>
          </div>
        </div>
      </div>
    </section>
  );
}
