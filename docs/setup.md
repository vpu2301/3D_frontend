# Setup & Development

## Prerequisites

- [Bun](https://bun.sh/) (preferred) or Node.js 18+
- Git

## Install Dependencies

```bash
bun install
# or
npm install
```

## Start Dev Server

```bash
bun run dev
# or
npm run dev
```

Dev server runs at **http://localhost:8080**

## Available Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `vite` | Start dev server with HMR |
| `build` | `vite build` | Production build to `dist/` |
| `preview` | `vite preview` | Preview the production build locally |
| `lint` | `eslint .` | Run ESLint |

## Build

```bash
bun run build
```

Output is placed in `dist/`. The build uses SWC for fast TypeScript/JSX compilation.

## Preview Production Build

```bash
bun run preview
```

## Environment & Config Files

| File | Purpose |
|------|---------|
| `vite.config.ts` | Vite bundler config (dev server port, path aliases, plugins) |
| `tsconfig.json` | Base TypeScript config |
| `tsconfig.app.json` | App TypeScript config (ES2020 target, strict mode off) |
| `tailwind.config.ts` | Tailwind theme, dark mode, custom colors |
| `postcss.config.js` | PostCSS (used by Tailwind) |
| `eslint.config.js` | ESLint rules |
| `components.json` | shadcn/ui configuration (base color: slate) |

## Path Alias

The `@/` alias maps to `src/`. Use it for all imports:

```ts
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
```

## Authentication (Dev/Demo)

Authentication uses `localStorage`. To log in during development use the hardcoded demo credentials on the `/login` page:

- **Username:** `admin`
- **Password:** `admin`

The `ProtectedRoute` component checks `localStorage.getItem("isAuthenticated")`. Set it to `"true"` manually in DevTools to bypass the login page if needed.
