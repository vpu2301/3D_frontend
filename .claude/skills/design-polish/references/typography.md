# Typography — distinctive pairings for this repo

The repo currently loads **Inter** globally (`src/index.css:1`, and `body { font-family: 'Inter' … }`).
Inter is on the blocklist. Below are pairings that fit the warm, near-black Anthropic-style palette.
Each pairing = one **display** face (big headings) + one **body** face (everything else).

> ⚠️ Swapping the global font touches every page including platform screens. Propose, then get the
> user's OK before editing `src/index.css`. For a single new marketing section you can scope the font
> locally with a wrapper class instead of changing the global default.

## Recommended pairings

1. **Editorial / confident** (default recommendation)
   - Display: **Fraunces** (opsz, soft serif with character) — lowercase, tight tracking.
   - Body: **Söhne** (paid) or free fallback **Geist** / **Hanken Grotesk**.

2. **Modern grotesque, high contrast**
   - Display: **Clash Display** (Fontshare, free) — bold, geometric.
   - Body: **Satoshi** (Fontshare, free).

3. **Warm humanist**
   - Display: **Bricolage Grotesque** (Google) — quirky, distinctive.
   - Body: **Newsreader** (Google) for long-form, or **Hanken Grotesk** for UI.

## Wiring it in (Fontshare example — Clash Display + Satoshi)

### 1. Load fonts (replace the Inter `@import` at top of `src/index.css`)
```css
@import url('https://api.fontshare.com/v2/css?f[]=clash-display@600,700&f[]=satoshi@400,500,700&display=swap');
```

### 2. Expose them as Tailwind families (`tailwind.config.ts` → theme.extend)
```ts
fontFamily: {
  display: ['"Clash Display"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
  sans: ['Satoshi', 'ui-sans-serif', 'system-ui', 'sans-serif'],
},
```

### 3. Update body default (`src/index.css`)
```css
body {
  font-family: 'Satoshi', ui-sans-serif, system-ui, sans-serif;
  letter-spacing: -0.015em;
}
```

### 4. Use the display face on headings
```tsx
<h1 className="font-display text-6xl font-bold tracking-tight lowercase">
  intelligence, on demand
</h1>
```

## Hierarchy from contrast, not just size
```tsx
{/* eyebrow: uppercase, tracked out, small, muted */}
<span className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">
  Platform
</span>
{/* headline: display face, heavy, tight, lowercase */}
<h2 className="font-display text-5xl font-bold tracking-tight lowercase text-foreground">
  built for teams that move
</h2>
{/* body: clean, relaxed line-height, reduced opacity */}
<p className="mt-4 max-w-prose text-lg leading-relaxed text-muted-foreground">
  …
</p>
```
The eyebrow (UPPERCASE, wide tracking) vs. headline (lowercase, tight) contrast is what makes it
feel designed — even before you change a single size.
