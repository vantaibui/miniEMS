# Frontend Architecture Refactor & Fix Report

## 1. List of Fixed Errors

1. **Routing Files Extension (`.ts` to `.tsx`)**:
   - Fixed TS errors relating to untyped JSX in routing module definitions for `auth`, `roles`, `users`, and `device` modules by renaming the `routes.ts` files to `.tsx`.
2. **Invalid `useAuthStore` Imports & Zustand Store Split**:
   - Fixed the recursive missing `useAuthStore` export by fully regenerating `KeycloakAuthState` into `auth.store.ts` along with the lost login/logout Keycloak bindings.
   - Refactored imports pointing to deep internals (e.g., `import {...} from '@modules/auth/store/auth.store'`) replacing them with standard `@modules/auth` public API exports.
3. **MUI and Generic Component Types**:
   - Fixed `@typescript-eslint/no-explicit-any` errors in `<UiSelect />`, `<SidebarNav />`, and `<TableDemo />`.
   - Updated `<SidebarNav />` to use conditional render patterns (`React.createElement`) instead of unsafe `ReactNode` rendering for `ComponentType` icons.
   - Removed undefined variants from `<UiBadge />` and refined generic bindings for `SelectChangeEvent`.
4. **Vite Alias Bugs and Missing Paths**:
   - Resolved vite build plugin errors where imports of the format `@modules/auth` were failing at Rollup level due to erroneous trailing `/*` matches in `vite.config.ts`.
5. **Axios Interceptor Returns & ApiError Wrapping**:
   - Fixed `unwrapResponse` data passing conflicts between standard `AxiosResponse` types and custom API Service layer responses (`axiosInstance` versus `httpClient`). 
   - Typed internal `httpClient` errors to map to standardized `ApiError`.
6. **Layout Adjustments & Fast Refresh**:
   - Cleaned up obsolete props like `withFooter` from `<AppShellLayout />`.
   - Disabled strict Fast Refresh rules for route components using `export const router` exports.

---

## 2. Files Changed

* `src/modules/roles/routes.tsx` (renamed)
* `src/modules/users/routes.tsx` (renamed)
* `src/modules/auth/routes.tsx` (renamed)
* `src/modules/device/routes.tsx` (renamed)
* `vite.config.ts`: Cleaned up glob alias arrays for Rollup validation.
* `src/app/layouts/shell/components/SidebarNav.tsx`: Improved React elements rendering and typings.
* `src/modules/auth/store/auth.store.ts`: Restored `useAuthStore` bindings and separated from RBAC initialization.
* `src/modules/auth/components/guards/PermissionGuard.tsx`: Adjusted Auth State mappings and resolved directory imports.
* `src/modules/auth/hooks/useAuth.ts`: Adjusted contexts index mapping.
* `src/modules/auth/hooks/usePermission.ts`: Re-linked RBAC utils correctly.
* `src/modules/auth/pages/LoginPage.tsx`: Linked valid alias path to relative `libs/assets`.
* `src/modules/auth/services/auth.service.ts`: Migrated to `httpClient` for unified interception.
* `src/modules/users/services/user.service.ts`: Migrated to `httpClient`.
* `src/services/http/httpClient.ts`: Introduced `ApiError` bindings.
* `src/app/router/index.tsx`: Cleaned unused modules and adjusted TS Lazy constraints.
* `src/libs/ui/select/UiSelect.tsx`: Removed wildcard any assertions correctly.
* `src/modules/HomePage/components/TableDemo.tsx`: Fixed array types and Badge properties.

---

## 3. Remaining Risks

1. **Build Chunking Limitation**:
   - Out of the box, `vite build` bundles almost everything into `index-DogQknCm.js` (645kB min+gzip chunk size limit crossed). Manual chunks in `vite.config.ts` might be necessary down the road to handle performance as the application grows.
2. **Federation Plugin Dependency**:
   - We did not spot `@module-federation/vite` in `package.json` though Federation mapping is ready. The project may need the official module federation plugin installed and added to plugins if external host configurations are built.
3. **Environment Defaults**:
   - The fallback URL for Axios (`http://localhost:3000/api`) will trigger unauthorized calls against actual staging Keycloak servers if the environment variable `VITE_API_BASE_URL` is omitted.

---

## 4. Migration Notes

- **HTTP Requests:**
  Always use `import http from '@services/http/httpClient'` instead of `axiosInstance` directly. It returns `TData` directly from `.data` interceptors reducing duplicated `res.data` logic.
- **Micro-Frontend Architecture:**
  The structure is completely strict now. Domain boundaries (`@modules/users`, `@modules/auth`) are preserved through `index.ts` public APIs without flattening directories. Deep imports from layouts to nested module components will fail strict `no-restricted-imports` linting. Next layers should stick to API barrels.

---

## 5. Next Steps for Nx Conversion

1. **Create Nx Workspace**: Map the root with `npx create-nx-workspace --preset=npm` keeping the existing setup but adopting `project.json` cache structures.
2. **Setup Remotes Setup**: Install `@nx/react` to auto-generate Next/Vite module federation host and remote configurations based on paths like `src/modules`.
3. **Isolate Libraries**: Convert `src/libs/*` into internal packages (`@tma/libs-ui`, `@tma/libs-types`) with explicit `package.json` exports to guarantee full code isolation using Nx Dependency Graph (`nx graph`).
4. **Target Configurations**: Add targets (`lint`, `build`, `test`) to Nx graph so tasks can run sequentially in CI for incremental caching.
