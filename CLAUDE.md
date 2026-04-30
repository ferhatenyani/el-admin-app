# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

React-based admin dashboard for an Algerian e-commerce bookstore. UI and error messages are in **French**. Currency is DZA (Algerian Dinar). Communicates with a backend API at `http://localhost:8080` and uses Keycloak for authentication via Resource Owner Password Grant flow.

## Development Commands

```bash
npm run dev       # Start dev server at localhost:5174
npm run build     # Production build (dist/ with sourcemaps)
npm run lint      # ESLint
npm run preview   # Preview production build
```

No test suite exists in this project.

## Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_KEYCLOAK_URL=http://localhost:9080
VITE_KEYCLOAK_REALM=jhipster
VITE_KEYCLOAK_CLIENT_ID=web_app
```

## Authentication Architecture

- **Flow**: React form → Keycloak token endpoint (Direct Access Grants) → tokens in `localStorage` → `Authorization: Bearer` on every request
- **Token refresh**: `apiClient.js` interceptor silently refreshes on 401 (or network error with a token present, since the backend drops CORS headers on 401). If refresh fails, redirects to `/admin/login` and returns a never-resolving promise so no toast/alert fires during navigation.
- **CSRF**: `XSRF-TOKEN` cookie → `X-XSRF-TOKEN` header on mutating requests. Pass exempt URLs to `createApiClient({ csrfExempt: ['/api/orders'] })`.

Key auth files: [src/contexts/AuthContext.jsx](src/contexts/AuthContext.jsx), [src/services/authApi.js](src/services/authApi.js), [src/components/ProtectedRoute.jsx](src/components/ProtectedRoute.jsx).

## API Service Architecture

All services share one factory: `createApiClient()` from [src/services/apiClient.js](src/services/apiClient.js). Each service instantiates it once at module level:

```javascript
import { createApiClient } from './apiClient';
const api = createApiClient();             // standard
const api = createApiClient({ csrfExempt: ['/api/orders'] }); // CSRF-exempt URLs
```

The factory wires: Bearer token injection, CSRF header, automatic token refresh + one-time retry on 401, redirect to login on 403 or second auth failure.

### Services ([src/services/](src/services/))

- **booksApi.js** — Book CRUD, search/filter/pagination, image uploads, `normalizeImageUrl()`
- **authorsApi.js** — Author management with image uploads
- **ordersApi.js** — Order management and status updates; CSRF-exempt
- **usersApi.js** — User management
- **tagsApi.js** — Base tag CRUD (type: `CATEGORY`, `ETIQUETTE`, `MAIN_DISPLAY`); includes book/pack add-remove and color-change helpers
- **categoriesApi.js** / **etiquettesApi.js** — Thin wrappers around `tagsApi.js` that hard-code `type='CATEGORY'` / `type='ETIQUETTE'`; never call `tagsApi` directly from components
- **packsApi.js** — Marketing pack management; maps frontend `name/image` ↔ backend `title/coverUrl`
- **mainDisplayApi.js** — Main display section management; `getMainDisplays()` auto-fetches books & packs for every section in parallel and sorts by `displayOrder`
- **relayPointsApi.js** — Delivery relay points (Yalidine / ZR Express providers); exports `WILAYA_ID_MAP`
- **dashboardApi.js** — Dashboard statistics; maps French UI labels (`Aujourd'hui`) to backend enums (`TODAY`)
- **adminApi.js** — Admin profile, picture (blob + token-param URL), and password change
- **pixelApi.js** — Pixel tracking events (`getPixelEvents()`)

## Key Utilities ([src/utils/](src/utils/))

- **apiErrors.js** — `getApiErrorMessage(error, fallback)` maps backend error codes (e.g. `'error.emailexists'`) to French strings. Use this on every API call's catch block.
- **format.js** — `formatCurrency(amount)` (DZA), `formatDate(date)`, `formatDateTime(date)` — all use `fr-FR` locale.
- **cookies.js** — `getCookie(name)` for CSRF token reads.
- **wilayaData.js** — Algeria wilaya → municipalities map (69 wilayas as of Nov 2025 reform).

## Application Structure

### Routing

[src/router/AdminRoutes.jsx](src/router/AdminRoutes.jsx) — all routes under `/admin/*`, protected by `<ProtectedRoute>`, wrapped in `<Layout>`.

### Pages ([src/pages/](src/pages/))

Dashboard, Books, Orders, Users, Marketing, Profile, Login, NotFound.

### Component Organization ([src/components/](src/components/))

Feature folders: `books/`, `authors/`, `orders/`, `users/`, `marketing/`, `categories/`, `etiquettes/`, `dashboard/`, `profile/`, `layout/`.

Shared components in `common/`: Sidebar, Topbar, Pagination, Toast, ConfirmDeleteModal, CustomSelect, ColorPicker, UploadImageInput, **InlineMDInput** (inline markdown editor using `@uiw/react-md-editor` with bold/italic/strikethrough/code toolbar), OrderDetailsModal, StatsCard.

### Custom Hooks ([src/hooks/](src/hooks/))

- **useToast.js** — toast notifications
- **usePagination.js** — pagination state
- **useScrollLock.js** — lock scroll when modals are open
- **useDebounce.js** — debounce inputs
- **useIsDesktop.js** — `matchMedia('(min-width: 1024px)')` reactive breakpoint

## Key Patterns

### Image Uploads (FormData)

```javascript
const formData = new FormData();
formData.append('book', new Blob([JSON.stringify(data)], { type: 'application/json' }));
formData.append('coverImage', imageFile);
```

Never set `Content-Type` manually for FormData — the interceptor omits it so the browser sets the multipart boundary.

### Server-Side Pagination

Query params: `page` (0-indexed), `size` (typically 20), `search`, `sort` (e.g. `title,asc`). Additional filters vary by resource.

### Error Handling

Always use `getApiErrorMessage` from `utils/apiErrors.js` to surface backend errors in French:

```javascript
} catch (err) {
  showToast(getApiErrorMessage(err, 'Une erreur est survenue'), 'error');
}
```

## Tech Stack

- React 19, Vite 7, Tailwind CSS 4
- React Router v7, TanStack React Query v5, Axios
- Framer Motion, Lucide React, Recharts, react-colorful
- **@dnd-kit** (core + sortable + modifiers) — drag-and-drop reordering used in Marketing page sections
- ESLint 9 — `no-unused-vars` allows uppercase identifiers (constants)

## React Query Patterns

React Query is used for all server state. Follow existing patterns:
- `staleTime: 5 * 60 * 1000`, `gcTime: 10 * 60 * 1000` (10 min cache)
- Pass `signal` from `useQuery`'s `queryFn` argument to service functions for request cancellation
- Invalidate query keys after mutations with `queryClient.invalidateQueries`
