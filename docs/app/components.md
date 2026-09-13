# Owner-app component foundation (T-FE0.5)

All primitives are shadcn/ui (`src/components/ui`) on Tailwind 3 with the `.plat` token family (`src/styles/platform.css`). Rules for owner-app use: radii ≤ 14 px, tokens only (`var(--ink)`, `var(--text-2)`, `var(--line)`, …), every string translated, keyboard reachable with a visible focus ring (`focus-visible:ring-[var(--blue)]`).

Screenshots: the per-component screenshots this document promises are produced by `npm run e2e` once FE1 lands a real surface using each primitive; FE0 has only placeholders, so none are committed yet.

| Component | File | Owner-app notes |
|---|---|---|
| Tokens (light) | `src/styles/platform.css` | `--ink`, `--paper`, `--sand`, `--sand-deep`, `--blue`, `--blue-100/200`, `--text-1…5`, `--ok/warn/bad-*`, `--line`, `--line-soft`. Dark set: FE10. |
| Typography | Sora (platform), `.plat-eyebrow` (spaced uppercase label), `.plat-num` (display numeral) | Headings `text-xl sm:text-2xl font-semibold tracking-tight`. |
| Card | `card.tsx` | Use `rounded-[14px] border border-[var(--line)]`. |
| Button | `button.tsx` | `rounded-[12px]`; `asChild` for links (see `VoiceAuthGuard`). |
| Input / Textarea | `input.tsx`, `textarea.tsx` (`AutoTextarea`) | Every input gets a `<Label>`; server `detail` renders under the field. |
| Select | `select.tsx`, `_components/shared/PlatSelect.tsx` | `PlatSelect` is the styled voice-app variant. |
| Switch, Tabs, Dialog | `switch.tsx`, `tabs.tsx`, `dialog.tsx` | — |
| Sheet (mobile) | `sheet.tsx` | Bottom sheet for "Mehr" (`MobileTabBar`), `rounded-t-[14px]`, safe-area padding. |
| Toast | `sonner.tsx` / `use-toast.ts` | Toasts carry the server's sentence verbatim. |
| Badge | `badge.tsx`; mock badge `components/voice/MockedBadge.tsx` | `MockedRouteBanner` takes `intro` for a translated lead sentence. |
| Skeleton | `skeleton.tsx` | Use for lists while `isLoading`; never a blank pane. |
| EmptyState | `empty-state.tsx` (FE0) | `icon`, `title`, `description`, `action`. Dashed 14 px card. |
| DataTable | `data-table.tsx` (FE0) | Generic `<DataTable rows columns rowKey labels>`: sortable columns (`sort` comparator, `aria-sort`), `filterBar` slot, sticky header, keyboard-activatable rows, and a card layout under `md` (`primary` column becomes the card title, `hideOnMobile` drops a column). All strings via `labels`. |
| ErrorBoundary | `_components/shared/ViewErrorBoundary.tsx` (FE0) | Per route, keyed on pathname; retry button; message shown in a `<pre>` for bug reports. |
| Auth state | `_components/shared/VoiceAuthGuard.tsx` (FE0) | "Nicht verbunden" card with a `returnTo`-carrying login link. |
| Navigation | `_components/sidebar/telephonyNav.tsx`, `TelephonyMiniRail.tsx`, `MobileTabBar.tsx` (FE0) | One nav model; capability-off items hidden; live badges with `aria-label`s; `aria-current="page"` on the active row. |
