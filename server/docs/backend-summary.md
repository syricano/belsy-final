# Backend Summary

## Architecture
- Express + Sequelize (PostgreSQL) API with JWT auth (cookies or Authorization header) and Passport Google OAuth; sessions enabled for social login.
- Validation via Zod middleware; async wrapper and custom ErrorResponse for errors.
- File uploads handled by multer to local `uploads/`; SendGrid email helpers used for notifications (reservations, feedback, auth).
- Admin boundaries enforced via `verifyToken` + `isAdmin` on admin dashboards, menu categories, uploads, feedback listing, and admin orders; public feedback served via `/api/feedback/public`.
- Server bootstraps in `index.js`, loads route map, applies associations, and runs `sequelize.sync({ alter: true })` on startup.

## Directory Overview
- `index.js` – Express app setup, CORS/cookies/session/passport, route mounting, prod static serving, error handling, DB sync.
- `config/passport.js` – Google OAuth strategy and serialization.
- `db/` – Sequelize instance (`db/index.js`) and model associations (`db/associations.js`).
- `models/` – Sequelize models: User, Reservation, Table, Duty, Menu, Category, Feedback, AddressInfo, Cart, CartItem, Order, OrderItem.
- `controllers/` – Route handlers for auth, reservations, duty hours, menu, tables, address info, feedback (public + admin), uploads, cart, and orders/checkout/admin order controls.
- `routes/` – Express routers per feature plus `routeMap` aggregator; static `/uploads` mount.
- `middleware/` – JWT verification, optional auth, admin guard, Zod validator, upload middleware, error handler.
- `utils/` – Async handler, error helper, email templates & sender.
- `zod/` – Validation schemas for auth, reservations, duty, tables, menu, categories, address, feedback, cart, orders, payments.
- `uploads/` – Uploaded images stored locally and served statically (admin-only operations for listing/upload/delete).
- `tests/` – Minimal node:test coverage for auth/admin guards, guest cancellation, cart operations, checkout totals, and payment updates.

## Data Model Overview
- **User**: first/last name, phone, email (unique), password (hashed), role (User/Admin), reset token fields; has many Reservations, Feedback.
- **Reservation**: reservationTime, status (Pending/Approved/Declined/Cancelled), note/adminResponse, guestName/guestEmail/guestPhone; belongs to User (optional) and Table.
- **Table**: number (unique), seats, isAvailable, location enum (`inRestaurant`/`inHall`); has many Reservations.
- **Duty**: working hours per weekday (startTime/endTime).
- **Menu**: name/description/price/image, categoryId; belongs to Category.
- **Category**: name (unique); has many Menu items.
- **Feedback**: name/message/rating/adminReply, optional userId; belongs to User.
- **AddressInfo**: email/phone/address (single record used as contact info).
- **Cart**: ties to user or guestId cookie; holds CartItems linked to Menu snapshots (name/price/quantity).
- **Order**: references user or guestId; stores customer contact, note, status (Pending/Confirmed/Cancelled), paymentMethod (cash/card/paypal), paymentStatus (Unpaid/Paid/Refunded/Failed), paidAt, total; has OrderItems snapshotting menuId/name/price/qty/lineTotal. Card/PayPal payments run through simulated multi-step flows; cash stays Unpaid until an admin marks it Paid.

## Request Lifecycle
1. Incoming request hits Express app (CORS allows `CLIENT_URL`, JSON parser, cookies, session/passport for OAuth).
2. Route matched via `routeMap`; per-route middleware applied (verifyToken, optionalAuth, isAdmin, validateZod, multer upload).
3. Controller executes business logic and DB operations through Sequelize models (associations applied in `applyAssociations`).
4. Responses serialized directly as JSON (no DTO layer); errors propagated to custom `errorHandler` which formats Zod or generic errors.
5. On startup, `sequelize.sync({ alter: true })` mutates DB schema to match models (retained for now).

## Dev Connectivity
- Backend dev server listens on port `3000` (default). Vite dev server runs separately and proxies `/api` to `http://localhost:3000`.
- Frontend axios uses a relative `baseURL` (`/api`) in development with `withCredentials` for cookie auth; set `VITE_API_BASE_URL` only for production builds if needed.
