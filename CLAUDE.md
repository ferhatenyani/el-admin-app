# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based admin dashboard for an e-commerce bookstore application. The frontend communicates with a backend API (typically at `http://localhost:8080`) and uses Keycloak for authentication via Resource Owner Password Grant flow.

## Development Commands

```bash
# Start development server (opens browser on localhost:5173)
npm run dev

# Build for production (outputs to dist/ with sourcemaps)
npm run build

# Run ESLint
npm run lint

# Preview production build
npm run preview
```

## Authentication Architecture

This application uses **Keycloak with Resource Owner Password Grants** (Direct Access Grants). Key points:

- **Authentication Flow**: Users enter username/password in React form → Frontend calls Keycloak token endpoint directly → Tokens stored in localStorage → Backend validates JWT tokens
- **Token Storage**: Access tokens, refresh tokens, and ID tokens are stored in `localStorage`
- **Token Transmission**: All API calls include `Authorization: Bearer <token>` header via axios interceptors
- **CSRF Protection**: CSRF tokens are read from `XSRF-TOKEN` cookie and sent as `X-XSRF-TOKEN` header (some endpoints like `/api/orders` are exempt)
- **Session Cookies**: All API calls use `withCredentials: true` to enable session cookie transmission

### Authentication Files

- [src/contexts/AuthContext.jsx](src/contexts/AuthContext.jsx) - Central authentication state management
- [src/services/authApi.js](src/services/authApi.js) - Keycloak authentication API calls
- [src/components/ProtectedRoute.jsx](src/components/ProtectedRoute.jsx) - Route guard component
- [src/utils/cookies.js](src/utils/cookies.js) - Cookie reading utility for CSRF tokens

### Environment Variables

Required environment variables (create `.env` file):

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_KEYCLOAK_URL=http://localhost:9080
VITE_KEYCLOAK_REALM=jhipster
VITE_KEYCLOAK_CLIENT_ID=web_app
```

Refer to [KEYCLOAK_SETUP.md](KEYCLOAK_SETUP.md) for detailed Keycloak configuration steps.

## API Service Architecture

All API services follow a consistent pattern:

1. **Axios Instance Creation**: Each service creates an axios instance with:
   - `baseURL: VITE_API_BASE_URL` (defaults to `http://localhost:8080`)
   - `withCredentials: true` for session cookies
   - Content-Type auto-detection (JSON or FormData)

2. **Request Interceptor**: Automatically adds:
   - Bearer token from localStorage (`Authorization: Bearer <token>`)
   - CSRF token from cookies (`X-XSRF-TOKEN` header)
   - Proper Content-Type (skipped for FormData to allow browser to set multipart boundary)

3. **Response Interceptor**: Handles 401/403 errors by redirecting to `/admin/login`

### API Services

All services are in [src/services/](src/services/):

- [booksApi.js](src/services/booksApi.js) - Book CRUD, search, filtering, pagination, image uploads
- [authorsApi.js](src/services/authorsApi.js) - Author management with image uploads
- [ordersApi.js](src/services/ordersApi.js) - Order management and status updates
- [usersApi.js](src/services/usersApi.js) - User management
- [categoriesApi.js](src/services/categoriesApi.js) - Category/tag management
- [etiquettesApi.js](src/services/etiquettesApi.js) - Etiquette/label management
- [packsApi.js](src/services/packsApi.js) - Marketing pack management
- [mainDisplayApi.js](src/services/mainDisplayApi.js) - Main display section management
- [tagsApi.js](src/services/tagsApi.js) - Tag operations
- [dashboardApi.js](src/services/dashboardApi.js) - Dashboard statistics
- [adminApi.js](src/services/adminApi.js) - Admin-specific operations

## Application Structure

### Routing

- [src/router/AdminRoutes.jsx](src/router/AdminRoutes.jsx) - Main routing configuration
- All admin routes are under `/admin/*` path
- Protected routes wrapped in `<ProtectedRoute>` component
- Layout component wraps all authenticated pages

### Pages

Located in [src/pages/](src/pages/):

- [Dashboard.jsx](src/pages/Dashboard.jsx) - Admin dashboard with statistics
- [Books.jsx](src/pages/Books.jsx) - Book management with search, filter, pagination
- [Orders.jsx](src/pages/Orders.jsx) - Order management and tracking
- [Users.jsx](src/pages/Users.jsx) - User management
- [Marketing.jsx](src/pages/Marketing.jsx) - Marketing features (book sections and packs)
- [Profile.jsx](src/pages/Profile.jsx) - User profile page
- [Login.jsx](src/pages/Login.jsx) - Keycloak authentication form
- [NotFound.jsx](src/pages/NotFound.jsx) - 404 page

### Components

Components are organized by feature in [src/components/](src/components/):

- **common/** - Reusable UI components (Sidebar, Topbar, Pagination, Toast, Modals, ColorPicker, etc.)
- **layout/** - Layout components
- **books/** - Book-specific components (BookForm, BooksTable)
- **authors/** - Author management components
- **orders/** - Order components (OrdersTable, OrderStatusBadge, CreateOrderModal)
- **users/** - User management components
- **marketing/** - Marketing features (BookSectionManager, PackManager, modals)
- **categories/** - Category management components
- **etiquettes/** - Etiquette management components
- **dashboard/** - Dashboard-specific components
- **profile/** - Profile page components

### Custom Hooks

Located in [src/hooks/](src/hooks/):

- [useToast.js](src/hooks/useToast.js) - Toast notification management
- [usePagination.js](src/hooks/usePagination.js) - Pagination state management
- [useScrollLock.js](src/hooks/useScrollLock.js) - Scroll locking for modals
- [useDebounce.js](src/hooks/useDebounce.js) - Input debouncing

## Key Patterns

### Image Uploads

When uploading images (books, authors, packs), use FormData with multipart/form-data:

```javascript
const formData = new FormData();
const dataBlob = new Blob([JSON.stringify(data)], { type: 'application/json' });
formData.append('book', dataBlob);  // or 'author', 'pack', etc.
formData.append('coverImage', imageFile);  // or 'image'
```

The axios interceptor automatically detects FormData and omits Content-Type header to let the browser set the multipart boundary.

### Image URL Normalization

API services normalize image URLs returned from backend:
- Relative URLs are converted to absolute URLs using `API_BASE_URL`
- See `normalizeImageUrl()` function in [booksApi.js](src/services/booksApi.js)

### Server-Side Pagination

Books and other resources use server-side pagination with these query params:
- `page` - Zero-indexed page number
- `size` - Page size (typically 20)
- `search` - Search query
- `sort` - Sort parameter (e.g., `title,asc` or `price,desc`)
- Additional filters vary by resource (categoryId, author, price range, etc.)

### CSRF Token Handling

CSRF tokens are read from the `XSRF-TOKEN` cookie and sent as `X-XSRF-TOKEN` header on all mutating requests (POST, PUT, DELETE, PATCH). The `/api/orders` endpoint is exempt to allow guest checkout.

See [src/utils/cookies.js](src/utils/cookies.js) for cookie reading logic.

## Tech Stack

- **Framework**: React 19 with Vite 7
- **Styling**: Tailwind CSS 4 (with @tailwindcss/vite plugin)
- **Routing**: React Router v7
- **State Management**: React Context (AuthContext)
- **Data Fetching**: TanStack React Query + Axios
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Charts**: Recharts
- **Color Picker**: react-colorful
- **Linting**: ESLint 9 with React Hooks plugin

## ESLint Configuration

ESLint is configured in [eslint.config.js](eslint.config.js):
- Extends recommended configs for JS, React Hooks, and React Refresh
- Targets ES2020 with JSX support
- Custom rule: `no-unused-vars` allows uppercase variables (constants)
- Ignores `dist/` directory

## Common Gotchas

1. **Keycloak Setup**: Ensure "Direct Access Grants" is enabled in Keycloak client settings (see [KEYCLOAK_SETUP.md](KEYCLOAK_SETUP.md))

2. **CORS Configuration**: Backend and Keycloak must allow `http://localhost:5173` in Web Origins

3. **Token Expiry**: Access tokens expire after 5 minutes by default. Implement token refresh if needed.

4. **FormData Uploads**: Never manually set Content-Type for FormData requests - let the browser set it with the boundary parameter

5. **Authentication Redirects**: The axios response interceptor automatically redirects to `/admin/login` on 401/403 errors

6. **Image URLs**: Always use the normalized image URLs from API responses, which handle both relative and absolute URLs

7. **Route Protection**: All admin routes (except login) must be wrapped in `<ProtectedRoute>` component
