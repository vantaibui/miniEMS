# SonicVista UI

---

## Tech Stack

| Category          | Technology                       | Version    |
| ----------------- | -------------------------------- | ---------- |
| UI Framework      | React                            | 19.x       |
| Build Tool        | Vite                             | 7.x        |
| Language          | TypeScript                       | ~5.9       |
| Component Library | MUI (Material UI)                | 7.x        |
| Styling           | Tailwind CSS v4                  | 4.x        |
| Routing           | React Router DOM                 | v7         |
| Server State      | TanStack React Query             | v5         |
| Client State      | Zustand                          | v5         |
| Auth              | Keycloak JS                      | v26        |
| Forms             | React Hook Form + Yup            | 7.x / 1.x  |
| HTTP              | Axios                            | 1.x        |
| Notifications     | React Toastify                   | 11.x       |
| Testing           | Jest + ts-jest + Testing Library | 30.x       |
| Linting           | ESLint 9 (flat config)           | 9.x        |
| Formatting        | Prettier                         | 3.x        |
| Git Hooks         | Husky + lint-staged              | 9.x / 16.x |

---

## Features

- **User Management** — Create, view, edit, and delete users
- **Role & Permission Management** — Define roles with granular CRUD permission matrices per sub-module
- **Device Inventory** — Manage network/infrastructure devices with connection testing, protocol configuration, and credential management
- **RBAC-driven UI** — Sidebar navigation and routes are dynamically filtered based on the authenticated user's permissions
- **Keycloak SSO** — Authentication via Keycloak with PKCE S256 and silent SSO

---

## Prerequisites

- Node.js >= 18
- npm >= 9

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example below into a `.env` file in the project root:

```env
VITE_API_BASE_URL=https://<your-api-host>/api
VITE_KEYCLOAK_URL=https://<your-keycloak-host>/auth
VITE_KEYCLOAK_REALM=<realm-name>
VITE_KEYCLOAK_CLIENT_ID=<client-id>
```

For local development with a local Keycloak instance, see [README-auth.md](./README-auth.md).

### 3. Start the dev server

```bash
npm run dev
```

The app runs at `http://localhost:3000`.

---

## Available Scripts

| Script                  | Description                           |
| ----------------------- | ------------------------------------- |
| `npm run dev`           | Start Vite dev server on port 3000    |
| `npm run build`         | Type-check + production build         |
| `npm run preview`       | Preview the production build          |
| `npm run test`          | Run unit tests                        |
| `npm run test:watch`    | Run tests in watch mode               |
| `npm run test:coverage` | Run tests with coverage report        |
| `npm run lint`          | Lint all `.ts` / `.tsx` files         |
| `npm run lint:fix`      | Lint and auto-fix                     |
| `npm run format`        | Format all source files with Prettier |

---

## Project Structure

```
src/
├── app/                    # Application shell
│   ├── layouts/            # RootLayout, AuthLayout, AppShellLayout (header, sidebar, footer)
│   ├── navigation/         # Sidebar nav config and types
│   ├── providers/          # AppCoreProvider, AppInitializer, QueryProvider
│   └── router/             # Centralized route registry + ProtectedRoute
├── modules/                # Feature modules (vertical slices)
│   ├── auth/               # Keycloak client, AuthProvider, RBAC store, route guards
│   ├── users/              # User CRUD pages, components, API hooks
│   ├── roles/              # Role & permission management
│   ├── devices/            # Device inventory CRUD + connection testing
│   └── dashboard/          # Dashboard / demo components
├── libs/                   # Shared infrastructure
│   ├── ui/                 # 20+ shared UI components (UiButton, UiTable, UiModal, etc.)
│   ├── hooks/              # useDataTable, useToast, useApiErrorDialog, etc.
│   ├── types/              # Shared TypeScript types
│   ├── utils/              # General utilities, date utils, cn() helper
│   ├── configs/            # Keycloak config, Day.js, env
│   ├── constants/          # App-wide constants (APP_NAME, PAGE_TITLES)
│   ├── query/              # queryKeys registry
│   └── pages/              # Shared pages (NotFoundPage, 403, etc.)
└── services/
    └── http/               # Axios instance, interceptors, typed HTTP client, CRUD factory
```

### Module Boundaries

Each feature module exposes a **public API** via its `index.ts`. ESLint enforces that modules cannot import each other directly — only the application shell (`src/app`) may depend on multiple modules.

---

## Authentication & Authorization

Authentication uses a two-layer approach:

1. **Keycloak (Identity / SSO)** — `keycloak-js` with Authorization Code Flow + PKCE S256. Tokens are stored in `localStorage` and proactively refreshed before expiry. Silent SSO is enabled via `/silent-check-sso.html`.

2. **Backend RBAC (Authorization)** — After login, the app fetches the current user's role and its associated permissions from the API (`/me` → `/roles/{roleId}/permissions`). Permissions are stored in Zustand and used to guard routes and hide nav items.

**Route guards:**

- `ProtectedRoute` — redirects to `/login` if not authenticated
- `RouteGuard` — checks a specific sub-module + action; redirects to `/403` if denied

For local Keycloak setup (Docker + PostgreSQL + custom theme), see [README-auth.md](./README-auth.md).

---

## Path Aliases

| Alias       | Resolves to     |
| ----------- | --------------- |
| `@`         | `src/`          |
| `@app`      | `src/app/`      |
| `@modules`  | `src/modules/`  |
| `@libs/*`   | `src/libs/*/`   |
| `@services` | `src/services/` |

---

## Code Quality

- **ESLint 9** (flat config) with TypeScript, React Hooks, import ordering, and module boundary rules
- **Prettier** for consistent formatting
- **Husky** pre-commit hook runs `eslint --fix` + `prettier --write` on staged files via `lint-staged`
- **Jest** + **ts-jest** + **Testing Library** for unit and component tests

---

## Environment Variables Reference

| Variable                  | Description                       |
| ------------------------- | --------------------------------- |
| `VITE_API_BASE_URL`       | Base URL for the backend REST API |
| `VITE_KEYCLOAK_URL`       | Keycloak server URL               |
| `VITE_KEYCLOAK_REALM`     | Keycloak realm name               |
| `VITE_KEYCLOAK_CLIENT_ID` | Keycloak client ID                |
