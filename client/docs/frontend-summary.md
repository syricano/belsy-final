# Frontend Summary

## Architecture
- Vite + React with React Router (BrowserRouter) and DaisyUI/Tailwind styles; routes defined in `App.jsx` with `RootLayout` and nested pages.
- State via React context/hooks: `AuthContext` for auth user/session, `AdminContext` for admin mutations, `CartContext` for cart state, `ModalContext` for reservation modal; components rely on local `useState` for UI state.
- API layer centralized in `src/data/*` using a shared `axiosInstance` (`baseURL` from `VITE_API_BASE_URL`, `withCredentials` enabled). Auth relies on httpOnly cookies; Authorization header injection was removed.
- Forms and calls are mostly client-side controlled components with lightweight `asyncHandler`/`errorHandler` helpers; minimal client-side validation.

## Directory Overview
- `src/main.jsx` – bootstraps providers and renders `App` (Auth + Cart + Modal providers).
- `src/App.jsx` – router setup and main layout wiring; admin route guarded by `AdminRoute`.
- `src/layouts/` – `RootLayout` (navbar/footer, reservation modal), `ProtectedLayout` (auth gate), `AdminRoute` (admin-only gate).
- `src/pages/` – Home, Menu, About, Contact, Cart, Checkout, Orders (auth), Admin, User profile (with My Orders), Auth pages, 404.
- `src/components/` – UI atoms, menu cards (name/category/description/price + add-to-cart), reservation widgets, feedback widgets (public list), admin managers (reservations, tables, menu, duty hours, address, feedback, orders), overview cards, CartDrawer overlay.
- `src/context/` – AuthProvider, AdminProvider, CartProvider, ModalContext with exports from `index.js`.
- `src/data/` – API service wrappers per feature (auth, menu, duty, tables, address, reservations, upload, cart, orders); axios config in `config/axiosConfig.js`.
- `src/hooks/` – Custom hooks for menu fetching (derives categories from menu payload), feedback (public feed), reservations, tabs/toggle, image manager.
- `src/utils/` – async/error helpers, reservation utilities, time-slot helper.
- `src/i18n/` – Single `fr.json` translation dictionary (not wired into UI yet).

## Routing & State Flow
- Public routes: `/`, `/menu`, `/about`, `/contact`, `/cart`, `/checkout`, `/signin`, `/signup`, wildcard 404. Protected routes: `/profile`, `/orders`, `/orders/:id`, `/admin` (auth + admin gate).
- Auth flow: signin/signup call `/auth` endpoints via `AuthContext`; server sets cookies. No token persisted to localStorage; API relies on `withCredentials` cookies.
- Cart flow: `CartContext` loads cart from `/api/cart` (guest cookie or user). Add/update/remove/clear cart via `/api/cart/items` endpoints; totals computed server-side. CartDrawer overlays all content with backdrop/z-index and is triggered from navbar icon/badge.
- Checkout flow: `/checkout` shows summary + contact form; submits to `/api/orders/checkout`; on success clears cart and redirects (orders page for logged users, home for guests).
- Orders: `/orders` fetches authenticated user orders via `/api/orders`; detail view uses `/api/orders/:id`; profile page embeds “My Orders” view with a Pay Now control (method selector + button) when status is pending/unpaid and a paid badge once complete.
- Admin orders: `/admin` dashboard includes Orders tab managing status/payment via admin endpoints.
- Data flow examples: menu/category display uses `useGetMenu` with menu payload (Category included); admin menu/category management uses `AdminContext` calling `menu` service endpoints (admin-only categories endpoint). Reservations handled via `reservations` data service; feedback public list via `/feedback/public`, admin moderation via `/feedback`.

## Localization
- `src/i18n/fr.json` provides French strings (including placeholders for EN/NL labels) but no provider/utility consumes it. UI text remains hardcoded English across components and pages (including new payment flows). Future i18n work needed for EN/FR/NL.

## Product/Catalog UI Wiring
- Menu display uses `useGetMenu` to fetch menu items (with included Category), normalizes image URLs, and groups items by derived categories. Each card shows name/category/description/price and provides quantity + add-to-cart actions.
- Admin menu/category management uses `AdminContext` calling `menu` service endpoints for CRUD (admin-only categories endpoint).
- Reservations UI (forms/modals and admin manager) call `/reservations` services; tables and duty data pulled from respective services to build options/availability.
- Cart/checkout uses `/cart` and `/orders` services; order list/detail for authenticated users with payment update when allowed (Pending/Unpaid → Paid/Confirmed); admin orders tab for status/payment control.
