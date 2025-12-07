# Endpoints

## Auth
| METHOD | PATH | CATEGORY | HANDLER | MIDDLEWARES | SOURCE |
| --- | --- | --- | --- | --- | --- |
| GET | /api/auth/me | authenticated | me | verifyToken | routes/authRouter.js |
| POST | /api/auth/signup | public | signup | validateZod(userSchema.POST) | routes/authRouter.js |
| POST | /api/auth/signin | public | signin | validateZod(signInSchema) | routes/authRouter.js |
| POST | /api/auth/signout | public | signout | (none) | routes/authRouter.js |
| PUT | /api/auth/update-profile | authenticated | updateProfile | verifyToken, validateZod(updateProfileSchema) | routes/authRouter.js |
| POST | /api/auth/delete-account | authenticated | deleteAccount | verifyToken, validateZod(deleteAccountSchema) | routes/authRouter.js |
| POST | /api/auth/forgot-password | public | forgotPassword | validateZod(forgotPasswordSchema) | routes/authRouter.js |
| POST | /api/auth/reset-password/:token? | public | resetPassword | validateZod(resetPasswordSchema) | routes/authRouter.js |
| PUT | /api/auth/change-password | authenticated | inline change password handler | verifyToken, validateZod(changePasswordSchema) | routes/authRouter.js |
| GET | /api/auth/google | public | passport.authenticate | passport google middleware | routes/authRouter.js |
| GET | /api/auth/google/callback | public | oauth callback redirect | passport.authenticate(session), cookie set | routes/authRouter.js |

## Admin
| METHOD | PATH | CATEGORY | HANDLER | MIDDLEWARES | SOURCE |
| --- | --- | --- | --- | --- | --- |
| GET | /api/admin/dashboard | admin | inline welcome response | verifyToken, isAdmin | routes/adminRouter.js |
| GET | /api/admin/users | admin | getAllUsers | verifyToken, isAdmin | routes/adminRouter.js |
| GET | /api/admin/users/:id | admin | getUserById | verifyToken, isAdmin | routes/adminRouter.js |
| PUT | /api/admin/users/:id/role | admin | updateUserRole | verifyToken, isAdmin, validateZod(userRoleSchema) | routes/adminRouter.js |
| GET | /api/admin/orders | admin | adminListOrders | verifyToken, isAdmin | routes/orderAdminRouter.js |
| GET | /api/admin/orders/:id | admin | getOrderById | verifyToken, isAdmin | routes/orderAdminRouter.js |
| PATCH | /api/admin/orders/:id/status | admin | adminUpdateStatus | verifyToken, isAdmin, validateZod(orderStatusSchema) | routes/orderAdminRouter.js |
| PATCH | /api/admin/orders/:id/payment | admin | adminUpdatePayment | verifyToken, isAdmin, validateZod(adminPaymentUpdateSchema) | routes/orderAdminRouter.js |

## Reservations
| METHOD | PATH | CATEGORY | HANDLER | MIDDLEWARES | SOURCE |
| --- | --- | --- | --- | --- | --- |
| POST | /api/reservations | public (guest/user) | createReservation | optionalAuth, validateZod(reservationSchema) | routes/reservationRouter.js |
| GET | /api/reservations/mine | authenticated | getMyReservations | verifyToken | routes/reservationRouter.js |
| PATCH | /api/reservations/:id | authenticated or guest with contact proof | updateReservation | optionalAuth | routes/reservationRouter.js |
| PATCH | /api/reservations/:id/cancel | authenticated or guest with contact proof | cancelReservation | optionalAuth | routes/reservationRouter.js |
| PATCH | /api/reservations/:id/cancelled | authenticated or guest with contact proof (alias) | cancelReservation | optionalAuth | routes/reservationRouter.js |
| POST | /api/reservations/suggest-tables | public | suggestTables | optionalAuth, validateZod(suggestTablesSchema) | routes/reservationRouter.js |
| GET | /api/reservations/admin | admin | getAllReservations | verifyToken, isAdmin | routes/reservationRouter.js |
| PATCH | /api/reservations/admin/:id/approve | admin | approveReservation | verifyToken, isAdmin, validateZod(adminResponseSchema) | routes/reservationRouter.js |
| PATCH | /api/reservations/admin/:id/decline | admin | declineReservation | verifyToken, isAdmin, validateZod(adminResponseSchema) | routes/reservationRouter.js |

## Duty Hours
| METHOD | PATH | CATEGORY | HANDLER | MIDDLEWARES | SOURCE |
| --- | --- | --- | --- | --- | --- |
| GET | /api/duty | public | getAllDuties | (none) | routes/dutyRouter.js |
| POST | /api/duty | admin | createDuty | verifyToken, isAdmin, validateZod(dutySchema) | routes/dutyRouter.js |
| PUT | /api/duty/:id | admin | updateDuty | verifyToken, isAdmin, validateZod(dutySchema) | routes/dutyRouter.js |
| DELETE | /api/duty/:id | admin | deleteDuty | verifyToken, isAdmin | routes/dutyRouter.js |

## Menu & Categories
| METHOD | PATH | CATEGORY | HANDLER | MIDDLEWARES | SOURCE |
| --- | --- | --- | --- | --- | --- |
| GET | /api/menu | public | getAllMenuItems | (none) | routes/menuRouter.js |
| POST | /api/menu | admin | createMenuItem | verifyToken, isAdmin, validateZod(menuSchema) | routes/menuRouter.js |
| PUT | /api/menu/:id | admin | updateMenuItem | verifyToken, isAdmin, validateZod(menuSchema) | routes/menuRouter.js |
| DELETE | /api/menu/:id | admin | deleteMenuItem | verifyToken, isAdmin | routes/menuRouter.js |
| GET | /api/menu/categories | admin | getAllCategories | verifyToken, isAdmin | routes/menuRouter.js |
| POST | /api/menu/categories | admin | createCategory | verifyToken, isAdmin, validateZod(categorySchema) | routes/menuRouter.js |
| PUT | /api/menu/categories/:id | admin | updateCategory | verifyToken, isAdmin, validateZod(categorySchema) | routes/menuRouter.js |
| DELETE | /api/menu/categories/:id | admin | deleteCategory | verifyToken, isAdmin | routes/menuRouter.js |

## Tables
| METHOD | PATH | CATEGORY | HANDLER | MIDDLEWARES | SOURCE |
| --- | --- | --- | --- | --- | --- |
| GET | /api/tables | public | getAllTables | (none) | routes/tableRouter.js |
| POST | /api/tables | admin | createTable | verifyToken, isAdmin, validateZod(tableSchema) | routes/tableRouter.js |
| PUT | /api/tables/:id | admin | updateTable | verifyToken, isAdmin, validateZod(tableSchema) | routes/tableRouter.js |
| DELETE | /api/tables/:id | admin | deleteTable | verifyToken, isAdmin | routes/tableRouter.js |

## Cart
| METHOD | PATH | CATEGORY | HANDLER | MIDDLEWARES | SOURCE |
| --- | --- | --- | --- | --- | --- |
| GET | /api/cart | public (guest/user) | getCart | optionalAuth | routes/cartRouter.js |
| POST | /api/cart/items | public (guest/user) | addItemToCart | optionalAuth, validateZod(addCartItemSchema) | routes/cartRouter.js |
| PATCH | /api/cart/items/:id | public (guest/user) | updateCartItem | optionalAuth, validateZod(updateCartItemSchema) | routes/cartRouter.js |
| DELETE | /api/cart/items/:id | public (guest/user) | removeCartItem | optionalAuth | routes/cartRouter.js |
| DELETE | /api/cart | public (guest/user) | clearCart | optionalAuth | routes/cartRouter.js |

## Orders / Checkout
| METHOD | PATH | CATEGORY | HANDLER | MIDDLEWARES | SOURCE |
| --- | --- | --- | --- | --- | --- |
| POST | /api/orders/checkout | public (guest/user) | checkout | optionalAuth, validateZod(checkoutSchema) | routes/orderRouter.js |
| GET | /api/orders | authenticated | getMyOrders | verifyToken | routes/orderRouter.js |
| GET | /api/orders/:id | authenticated | getOrderById | verifyToken | routes/orderRouter.js |
| PATCH | /api/orders/:id/payment | authenticated (owner) | userUpdatePayment | verifyToken, validateZod(paymentUpdateSchema) | routes/orderRouter.js |

## Address Info
| METHOD | PATH | CATEGORY | HANDLER | MIDDLEWARES | SOURCE |
| --- | --- | --- | --- | --- | --- |
| GET | /api/address | public | getAddress | (none) | routes/addressRouter.js |
| PUT | /api/address | admin | updateAddress | verifyToken, isAdmin, validateZod(addressSchema) | routes/addressRouter.js |
| DELETE | /api/address/:id | admin | deleteAddress | verifyToken, isAdmin | routes/addressRouter.js |

## Uploads
| METHOD | PATH | CATEGORY | HANDLER | MIDDLEWARES | SOURCE |
| --- | --- | --- | --- | --- | --- |
| GET | /api/upload/list | admin | inline directory reader | verifyToken, isAdmin | routes/uploadRouter.js |
| POST | /api/upload | admin | inline upload handler | verifyToken, isAdmin, multer single('image') | routes/uploadRouter.js |
| DELETE | /api/upload/:filename | admin | inline delete handler | verifyToken, isAdmin | routes/uploadRouter.js |
| GET | /uploads/* | public static | express.static | (none) | routes/index.js |

## Feedback
| METHOD | PATH | CATEGORY | HANDLER | MIDDLEWARES | SOURCE |
| --- | --- | --- | --- | --- | --- |
| POST | /api/feedback | public (guest/user) | addFeedback | optionalAuth, validateZod(feedbackSchema) | routes/feedbackRouter.js |
| GET | /api/feedback/public | public | getPublicFeedback | (none) | routes/feedbackRouter.js |
| GET | /api/feedback/my | authenticated | getMyFeedback | verifyToken | routes/feedbackRouter.js |
| PUT | /api/feedback/:id | authenticated (owner) or admin for replies | updateFeedback | verifyToken, conditional validateZod | routes/feedbackRouter.js |
| DELETE | /api/feedback/:id | authenticated owner/admin | deleteFeedback | verifyToken | routes/feedbackRouter.js |
| GET | /api/feedback | admin | getFeedback | verifyToken, isAdmin | routes/feedbackRouter.js |

## Contact
| METHOD | PATH | CATEGORY | HANDLER | MIDDLEWARES | SOURCE |
| --- | --- | --- | --- | --- | --- |
| POST | /api/contact/message | public | inline sendEmail handler | (none) | routes/contactRouter.js |

## Notable gaps / TODOs
- Menu categories remain admin-only; public menu UI derives categories from menu responses. If public categories are needed, add a read-only route later.
- Checkout assumes offline payment; no delivery/pickup differentiation yet.
- Guest orders are placed via checkout but viewing past orders requires authentication; consider guest order lookup tokens later.
- Cancel endpoints accept `/cancel` (canonical) and `/cancelled` (alias); legacy body-token reset-password calls remain deprecated.
- Payment transitions are simple; real gateways/receipts not implemented.
