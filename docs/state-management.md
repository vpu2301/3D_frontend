# State Management

The app uses a lightweight, pragmatic approach to state — no global Redux or Zustand store. State is scoped to the smallest appropriate layer.

## Layers

### 1. Local Component State — `useState` / `useReducer`

The primary state mechanism. UI state (open/closed modals, form inputs, active tabs, loading flags) lives as `useState` in the component that owns it.

```tsx
const [isOpen, setIsOpen] = useState(false);
const [tab, setTab] = useState<"overview" | "settings">("overview");
```

### 2. URL State — React Router

Route-level state (which page, which entity is selected) is encoded in the URL via React Router v6 params and search params.

```tsx
// Dynamic route: /ai-assistants/:id
const { id } = useParams();
```

### 3. Theme Context — `ThemeContext`

The global theme (light / dark / system) is held in a React context so any component can read and toggle it.

```tsx
// src/contexts/ThemeContext.tsx
const { theme, setTheme } = useTheme();
```

The context persists the theme choice to `localStorage` under the key `theme`.

### 4. Persisted State — `localStorage`

Used for auth status and theme preference. Keys:

| Key | Values | Description |
|-----|--------|-------------|
| `isAuthenticated` | `"true"` / not set | Whether the user is logged in |
| `userEmail` | string | The logged-in user's email |
| `theme` | `"light"` / `"dark"` / `"system"` | Active theme |

Read/write directly:
```ts
localStorage.setItem("isAuthenticated", "true");
localStorage.getItem("isAuthenticated");
localStorage.removeItem("isAuthenticated");
```

### 5. Server State — TanStack React Query

`@tanstack/react-query` is installed and a `QueryClient` is provided at the app root. Use it for any real API calls to avoid manual loading/error state.

```tsx
import { useQuery } from "@tanstack/react-query";

const { data, isLoading } = useQuery({
  queryKey: ["agents"],
  queryFn: () => fetch("/api/agents").then(r => r.json()),
});
```

Currently the app uses mock/static data in most pages. When real endpoints are wired up, migrate those pages to `useQuery`.

---

## What Lives Where

| Type of State | Where to put it |
|---------------|-----------------|
| Open/closed modal | `useState` in parent |
| Form values | `useForm` (React Hook Form) |
| Currently selected item | `useState` or URL param |
| Theme | `ThemeContext` + localStorage |
| Auth status | `localStorage` |
| API data (future) | TanStack React Query |
| Shared page-level data | Prop drilling or co-located context |

---

## Authentication Flow

1. User submits login form on `/login`
2. Credentials are checked (currently hardcoded: `admin` / `admin`)
3. On success: `localStorage.setItem("isAuthenticated", "true")` + `localStorage.setItem("userEmail", email)`
4. User is redirected to `/dashboard`
5. `ProtectedRoute` reads `localStorage` on every protected render — if not set, redirects to `/login`
6. Logout clears both localStorage keys and navigates to `/login`
