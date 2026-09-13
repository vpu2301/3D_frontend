# 3Days.ai — frontend

React + TypeScript + Vite front end for the Pincer platform: a sign-in flow, the
platform screens (Dashboard, Chat, Tasks, Company Brain, Integrations), the
Notes app, and the Telephony owner app.

Every screen in here reads an endpoint the backend actually serves. Surfaces
whose API does not exist were removed rather than left rendering demo data —
`npm run count-mocks` holds that line in CI.

## Requirements

- Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

## Getting started

```sh
npm install
npm run dev
```

The dev server runs on **:3000** (`strictPort`).

### Backends

| App       | Service                                   | Configure with           |
| --------- | ----------------------------------------- | ------------------------ |
| Platform  | `pincer` (`/api/*`)                        | set at sign-in           |
| Telephony | `pincer` (`/api/voice/*`)                  | set at sign-in           |
| Notes     | `pincer_extensions/notes_app` (`:8000`)    | `VITE_NOTES_API_URL`     |

Notes calls are same-origin-proxied in dev: point `VITE_NOTES_API_URL` at
`/notes-api` in `.env.local` to use the proxy, and override the upstream with
`NOTES_API_TARGET` if the service is not on `:8000`.

## Scripts

| Command                  | What it does                                             |
| ------------------------ | -------------------------------------------------------- |
| `npm run dev`            | Dev server on :3000                                       |
| `npm run build`          | Production build                                          |
| `npm test`               | Unit tests (vitest)                                       |
| `npm run e2e`            | End-to-end tests (playwright)                             |
| `npm run lint`           | ESLint over the repo                                      |
| `npm run type-check`     | `tsc --noEmit` over the app                               |
| `npm run i18n:check`     | Owner-app translations complete in de/en, no unused keys  |
| `npm run count-mocks`    | Fails if a mocked surface appears without its badge       |
| `npm run check:api`      | Frontend contract vs. the pinned pincer commit            |
| `npm run check:bundle`   | Owner-app initial JS budget                               |
| `npm run ci:voice`       | The full gate, in CI order                                |

## Tech

Vite · TypeScript · React · shadcn-ui · Tailwind CSS · TanStack Query · i18next
