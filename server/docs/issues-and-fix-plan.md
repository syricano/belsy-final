# Issues & Fix Plan

## 1. Key Issues & Mismatches
- **Backend (addressed in PHASE 0 fixes)**
  - Admin-only protections added to dashboard, feedback list, menu categories, and upload list/upload/delete.
  - Guest reservation lifecycle now supports update/cancel with contact proof (email/phone) via optional auth.
  - Reset-password accepts URL token (body token still accepted but deprecated) and routes allow optional token param.
  - Address DELETE implemented (admin-only) and upload operations locked to admins.
- **Frontend (addressed in PHASE 0 fixes)**
  - Admin guard added for `/admin`; menu categories fetched publicly no longer needed (derived from menu data).
  - Token handling standardized to cookie-based auth (Authorization header injection removed).
  - Reset password call updated to URL token contract; reservation cancel spelling aligned; cancel API accepts contact info payload.
- **Cross-cutting**
  - Admin/public boundary tightened; feedback public feed now served via `/api/feedback/public` while admin list remains protected.
  - Guest cancellation/update requires matching email/phone; alias `/api/reservations/:id/cancelled` retained for compatibility.

## 2. Risky or Fragile Areas
- `sequelize.sync({ alter: true })` still runs on startup (migration risk) – unchanged.
- Guest identity for cancellation/update is verified only via provided email/phone; stronger tokens or reservation codes would be safer.
- Uploads remain local disk; deletion/listing now admin-only but lacks rate limits/virus scanning.

## 3. Fix Plan (Prioritized)
- **P0 – Critical (completed in PHASE 0)**
  - Harden admin-only routes (feedback list, menu categories, uploads, admin dashboard).
  - Align API/frontend contracts (reset-password URL token, reservation cancel spelling, address DELETE, guest update/cancel support).
  - Add client-side admin guard and clarify cookie-based auth.
- **P1 – Important (current phase: cart/checkout implemented)**
  - Cart + checkout + orders implemented end-to-end (guest/user carts, checkout to orders, admin order listing/status updates).
  - Remaining items: add rate limiting/validation for contact/uploads/auth, reservation codes for guests, and i18n infrastructure.
- **P2 – Nice-to-have**
  - Expand automated tests (auth, reservation overlap, feedback permissions, order lifecycles) and structured logging/observability.
  - Formal DTO/serializer layer to decouple DB schema from responses.

## 4. Suggestions
- **Testing**: Extend node:test coverage to admin-only endpoints and reservation time rules; add frontend e2e for admin gate, guest cancel, cart/checkout UX.
- **Observability**: Add request logging middleware and monitor email failures; disable verbose Sequelize logging in prod.
- **Documentation**: Add env var reference (SENDGRID, DB_URL, CLIENT_URL, SESSION_SECRET), OAuth setup, reservation contact-proof expectations for guests.
- **i18n**: Choose library and extraction strategy; ensure backend emails are localizable.
- **Security/Auth**: Consider CSRF protection for cookie auth, rate limits on public POSTs, signed reservation tokens for guests, and delivery/pickup flow hardening when payments are added.

### PHASE 1 – Cart/Checkout (implemented)
- Simple cart tied to user or guest cookie; menu price/name snapshotted into cart items.
- Checkout creates orders with contact info, totals computed server-side; statuses Pending/Confirmed/Cancelled with admin status updates.
- No payments, promos, delivery/pickup modes, or modifiers yet. Guest order history requires auth; consider guest order lookup tokens later.

### PHASE 1.1 – Cart Drawer & Dev Connectivity
- Dev `/api` connection refused resolved by using relative `/api` baseURL in development and Vite proxy to backend on `http://localhost:3000`.
- Cart drawer added (navbar toggle) reusing CartProvider state; keeps existing /cart route.
- Browser console errors `getAllPromptList`, `content-all.js`, `installHook.js` traced to browser extensions, not project code.

### Orders & Payments – Admin and User flows
- Payment model added: paymentMethod (cash/card/paypal), paymentStatus (Unpaid/Paid/Refunded/Failed), paidAt timestamp. Defaults to Unpaid on checkout; card/PayPal flow now simulates multi-step payments, while cash stays Unpaid until an admin updates it.
- Pay Now UI now renders in both `/orders` and profile “My Orders”, showing method selector + button when status is pending/unpaid and a paid badge otherwise.
- TODOs: integrate real payment gateway, enforce stricter state-machine transitions, send notifications/receipts, support delivery/pickup modes and refunds workflows.
- UI strings for payments/orders are English-only and should be localized in the upcoming i18n phase.

## Non-project console noise
- Messages referencing `getAllPromptList`, `content-all.js`, or `installHook.js` originate from browser extensions (e.g., AI tooling) and are not part of this codebase.
