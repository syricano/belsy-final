# Routes and Pages

| PATH | COMPONENT | PURPOSE | BACKEND DEPENDENCIES |
| --- | --- | --- | --- |
| / | src/pages/HomePage.jsx | Landing: hero, image slider, public feedback carousel and feedback form | GET `/api/feedback/public`, POST `/api/feedback` |
| /menu | src/pages/MenuPage.jsx | Browse menu categories/items with accordion, add to cart | GET `/api/menu` (categories derived from payload), POST `/api/cart/items` |
| /about | src/pages/About.jsx | About/brand story (static) | none |
| /contact | src/pages/ContactPage.jsx | Contact form with toast feedback | POST `/api/contact/message` |
| /cart | src/pages/CartPage.jsx | View cart items, update quantities/remove, proceed to checkout | GET `/api/cart`, PATCH `/api/cart/items/:id`, DELETE `/api/cart/items/:id` |
| /checkout | src/pages/CheckoutPage.jsx | Order summary + customer info form; submit checkout | POST `/api/orders/checkout` |
| /signin | src/pages/Signin.jsx | User login + forgot password trigger + Google OAuth redirect | POST `/api/auth/signin`, POST `/api/auth/forgot-password`, GET `/api/auth/google` |
| /signup | src/pages/Signup.jsx | User registration form | POST `/api/auth/signup` |
| /profile | src/pages/UserPage.jsx (protected) | User dashboard: reservations, orders (embedded OrdersPage with Pay Now selector/button), feedback list, profile edit, password change, delete account | GET `/api/auth/me`, GET `/api/reservations/mine`, PATCH `/api/reservations/:id`, PATCH `/api/reservations/:id/cancel`, GET `/api/feedback/my`, PUT `/api/feedback/:id`, DELETE `/api/feedback/:id`, PUT `/api/auth/update-profile`, PUT `/api/auth/change-password`, POST `/api/auth/delete-account`, GET `/api/orders`, PATCH `/api/orders/:id/payment` |
| /orders | src/pages/OrdersPage.jsx (protected) | List user orders and view details, pending/unpaid orders render method selector + Pay Now button | GET `/api/orders`, GET `/api/orders/:id`, PATCH `/api/orders/:id/payment` |
| /orders/:id | src/pages/OrdersPage.jsx (protected) | View specific order detail | GET `/api/orders/:id`, PATCH `/api/orders/:id/payment` |
| /admin | src/pages/AdminPage.jsx (protected + admin gate) | Admin dashboard tabs: reservations, tables, menu items/categories, duty hours, address, feedback, orders | GET/PATCH `/api/reservations/admin/...`, GET/POST/PUT/DELETE `/api/tables`, GET/POST/PUT/DELETE `/api/menu`, GET/POST/PUT/DELETE `/api/menu/categories`, GET/PUT/DELETE `/api/address`, GET `/api/feedback`, PUT `/api/feedback/:id`, DELETE `/api/feedback/:id`, uploads, GET/PATCH `/api/admin/orders`, `/api/admin/orders/:id/status`, `/api/admin/orders/:id/payment` |
| * | src/pages/NotFoundPage.jsx | 404 fallback | none |

## Route Importance
- Browse/search/catalog: `/`, `/menu` (menu + categories derived from menu payload).
- Cart/checkout: `/cart`, `/checkout`, `/orders`, `/orders/:id`, profile "My Orders" tab (with pay-now control).
- Account/profile: `/signin`, `/signup`, `/profile`.
- Admin area: `/admin` (client-side admin guard + backend isAdmin enforcement) with orders management tab.

## Localization Coverage
- Translations file exists only for French (`src/i18n/fr.json`), but no provider/hooks consume it. All pages/components render hardcoded English strings (including new payment flows). Future i18n work needed for EN/FR/NL.

## Cart Access Points
- Cart is reachable via `/cart` page and via the navbar CartDrawer (slide-out) which reuses CartContext state/actions; drawer provides quick quantity controls and links to checkout/full cart.
