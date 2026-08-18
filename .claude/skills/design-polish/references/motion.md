# Motion — orchestrated page load

One well-orchestrated entrance > many scattered micro-interactions.

## Principles
- Animate **only `transform` and `opacity`** (GPU-composited, layout-stable). Never animate
  `width`/`height`/`top`/`left` for entrances.
- **Stagger** siblings by a small fixed step (60–90ms) so the eye reads a sequence, not a flash.
- Keep durations short: 400–600ms per element with an ease-out curve.
- Always honor `prefers-reduced-motion` — show final state instantly.

## Easing
Use a confident ease-out (or a gentle overshoot for hero elements):
```css
--ease-out-soft: cubic-bezier(0.22, 1, 0.36, 1);   /* fast in, soft settle */
--ease-overshoot: cubic-bezier(0.34, 1.56, 0.64, 1); /* subtle pop, use rarely */
```

## The repo already has entrance keyframes
`src/index.css` defines `fadeInUp`, `slideUp`, `scaleIn` and the `.animate-fade-in` /
`.animate-slide-up` / `.animate-scale-in` classes. Stagger them with an inline
`animationDelay` per child, or use the `useStagger` hook in `examples/StaggeredReveal.tsx`.

## Reduced-motion (add once to src/index.css)
```css
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in,
  .animate-slide-up,
  .animate-scale-in,
  [data-reveal] {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

## Stagger via CSS custom property (no JS)
```tsx
{items.map((item, i) => (
  <div
    key={item.id}
    className="animate-slide-up"
    style={{ animationDelay: `${i * 80}ms`, animationFillMode: "both" }}
  >
    {item.label}
  </div>
))}
```
`animationFillMode: "both"` keeps the element hidden before its delay elapses — without it the
items flash visible, then animate.
