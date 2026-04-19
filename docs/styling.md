# Styling

## Overview

Styling is done with **Tailwind CSS 3.4** using a class-based dark mode. All shadcn/ui components are styled via CSS custom properties (variables) defined in `src/index.css`.

## Color System

Colors are defined as CSS variables and mapped into Tailwind in `tailwind.config.ts`. The palette is warm and neutral, inspired by Anthropic's design language.

### Light Theme

| Variable | Value | Usage |
|----------|-------|-------|
| `--background` | `#e8e6dc` | Page background |
| `--foreground` | `#141413` | Primary text |
| `--card` | `#ede9df` | Card background |
| `--primary` | `#141413` | Primary action color |
| `--secondary` | `#d5d2c8` | Secondary surfaces |
| `--muted` | `#d5d2c8` | Muted backgrounds |
| `--muted-foreground` | `#706e67` | Muted text |
| `--border` | `#ccc9be` | Borders and dividers |
| `--ring` | `#141413` | Focus ring |

### Dark Theme

| Variable | Value | Usage |
|----------|-------|-------|
| `--background` | `#181512` | Page background |
| `--foreground` | `#ede8e3` | Primary text |
| `--card` | `#1f1c19` | Card background |
| `--primary` | `#ede8e3` | Primary action color |
| `--muted` | `#2a2520` | Muted backgrounds |
| `--muted-foreground` | `#9c9589` | Muted text |
| `--border` | `#2a2520` | Borders and dividers |

### Platform (Logged-in) Theme

The dashboard zone uses a slightly lighter warm beige (`#f8f3ee`) as the base background to visually separate it from the marketing site.

---

## Typography

- **Font:** Inter (Google Fonts)
- **Weights:** 300, 400, 500, 600, 700
- **Base size:** 16px (`text-base`)
- Headings use tight tracking (`tracking-tight`) and higher weight

---

## Dark Mode

Dark mode is enabled via the Tailwind `class` strategy. The `ThemeContext` toggles the `dark` class on the root `<html>` element.

```ts
// tailwind.config.ts
darkMode: ["class"]
```

To style dark mode variants:

```tsx
<div className="bg-background text-foreground dark:bg-card" />
```

---

## Custom Animations

Defined in `tailwind.config.ts` and `index.css`:

| Class | Effect |
|-------|--------|
| `animate-fadeInUp` | Fades in and slides up from below |
| `animate-slideUp` | Slides up |
| `animate-scaleIn` | Scales from 0.95 to 1 |
| `animate-pulse-slow` | Slow pulsing (slower than default `animate-pulse`) |

---

## Utility: `cn()`

All conditional or merged class names should use the `cn()` helper from `@/lib/utils`:

```tsx
import { cn } from "@/lib/utils";

<div className={cn("p-4 rounded", isActive && "bg-primary text-primary-foreground")} />
```

This prevents Tailwind class conflicts by running `tailwind-merge` before applying classes.

---

## Conventions

- Use **semantic color tokens** (`bg-background`, `text-foreground`, `border`) instead of literal colors (`bg-gray-100`) so that dark mode works automatically.
- Add component-level overrides with `className` props using `cn()`.
- Avoid inline `style` — use Tailwind utilities or CSS variables.
- For one-off values use Tailwind's arbitrary value syntax: `w-[42px]`, `top-[calc(100%+8px)]`.
