# 3D Frontend — Documentation

This folder contains developer documentation for the 3D Frontend project — an enterprise AI workplace automation platform (internal codename: **workday-liberation-hub**).

## Contents

| File | Description |
|------|-------------|
| [setup.md](setup.md) | Local development setup, scripts, and environment |
| [architecture.md](architecture.md) | High-level app structure and technology stack |
| [routing.md](routing.md) | All routes, route groups, and authentication guards |
| [components.md](components.md) | Shared components, UI library, and dashboard components |
| [pages.md](pages.md) | Page inventory across all route groups |
| [styling.md](styling.md) | Tailwind config, theming, color system, and conventions |
| [state-management.md](state-management.md) | How state is handled across the app |
| [voice-app.md](voice-app.md) | Telephony Voice page: real `/api/voice/*` data and the mock-badge contract |

## Quick Reference

- **Framework:** React 18 + TypeScript + Vite
- **Routing:** React Router v6
- **UI Library:** shadcn/ui (Radix UI + Tailwind CSS)
- **Package Manager:** Bun (also compatible with npm)
- **Dev Server:** `localhost:8080`
- **Path Alias:** `@/` → `src/`
