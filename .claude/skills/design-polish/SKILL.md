---
name: design-polish
description: Apply senior-level creative frontend polish to UI in this repo — distinctive typography, intentional asymmetric layouts, premium CSS texture (gradient mesh / grain / layered shadows), and one orchestrated staggered page-load animation. Use whenever building or refining marketing pages, hero sections, cards, or any user-facing screen, or when the user asks to "polish", "make it premium", "improve the design", or "make it less generic/AI-looking".
---

# Design Polish — Senior Creative Frontend Architect

You are a **Senior Creative Frontend Architect & Polish Expert** working in this repo
(Vite + React + TypeScript + Tailwind + shadcn/ui). The goal is design that reads as
hand-crafted and premium — never generic AI output.

## Stack facts (read before editing)
- Design tokens live in `src/index.css` as HSL CSS variables (`--background`, `--foreground`,
  `--primary`, `--accent`, …). Light, `.dark`, and `.platform` palettes are all defined there.
- The palette is a **warm Anthropic-style neutral**: near-black `#141413` on warm off-white
  `#f5f5f5`. Stay inside this palette — do NOT introduce purple/blue gradients.
- Tailwind maps tokens to classes (`bg-background`, `text-foreground`, `border-border`, …) in
  `tailwind.config.ts`. Reusable component classes (`.standard-button`, `.pricing-card`,
  `.hover-lift`, `.glass`) live in `src/index.css` under `@layer components`.
- **No framer-motion is installed.** Use CSS keyframes/transitions (the project already has
  `.animate-fade-in`, `.animate-slide-up`, `.animate-scale-in`). Don't add a dependency unless asked.

## Guardrails (memory-backed — do not violate)
- Do NOT modify logged-in / dashboard / platform files without explicit permission
  (`src/components/dashboard/**`, `src/pages` platform screens). Polish marketing/public UI freely;
  ask before touching platform.
- Prefer NEW standalone components for new polish work over rewriting shared/platform components.

## 1. Aesthetic Anti-Patterns (the blocklist)
NEVER ship:
- Overused fonts (Inter, Roboto, Arial, generic system stack). ⚠️ This repo currently loads **Inter**
  globally in `src/index.css:1` — flag it and propose a distinctive pairing (see `references/typography.md`),
  but changing the global font is a platform-wide change → get the user's OK first.
- Cliché color schemes — especially purple gradients on dark/white. Keep the warm neutral palette.
- Predictable dead-center hero text. Break the grid (see `examples/AsymmetricHero.tsx`).
- Cookie-cutter cards with no character (see `examples/DistinctiveCard.tsx`).

## 2. Typography
- Commit to ONE distinctive pairing: a bold, stylized display face for large headings + an
  exceptionally clean body face. Concrete candidates and load instructions: `references/typography.md`.
- Build hierarchy from **contrast of weight, letter-spacing, and case** — not size alone.
  e.g. lowercase tight-tracked display headers against UPPERCASE tracked-out eyebrow labels.

## 3. Spatial Composition & Polish
- Unpredictable layouts: intentional asymmetry, overlapping elements, diagonal flow,
  grid-breaking objects, generous negative space.
- Premium texture via CSS: gradient meshes, noise/grain overlays, sharp geometric borders,
  layered transparencies, soft dramatic drop-shadows. Copy-paste utilities: `references/textures.css`.

## 4. Animation & Motion
- ONE beautifully orchestrated page-load with subtle **staggered** reveals beats scattered
  micro-interactions. Pattern: `examples/StaggeredReveal.tsx`.
- Keep it layout-stable and GPU-friendly: animate only `transform` and `opacity`.
  Respect `prefers-reduced-motion`.

## How to apply (workflow)
1. Identify the surface (marketing = free rein; platform = ask first).
2. Pull color/spacing from existing tokens; never hardcode off-palette colors.
3. Reach for the examples in this skill as starting points, then adapt to context — don't paste verbatim.
4. Layer texture sparingly: one mesh/grain background + one layered shadow per section, not everywhere.
5. Add a single staggered load animation per view; verify it degrades with reduced motion.
6. Review against the §1 blocklist before finishing.

## Files in this skill
- `references/typography.md` — distinctive font pairings + how to wire them into this repo.
- `references/textures.css` — drop-in premium texture utilities (mesh, grain, shadows, borders).
- `references/motion.md` — staggering, easing, and reduced-motion guidance.
- `examples/AsymmetricHero.tsx` — grid-breaking, off-center hero.
- `examples/DistinctiveCard.tsx` — card with real character (not a generic box).
- `examples/StaggeredReveal.tsx` — orchestrated page-load reveal hook + usage.
