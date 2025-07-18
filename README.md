# Belsy Restaurant

A modern restaurant web application to showcase Belsy Restaurant's menu, drinks, and booking system with user authentication and admin management.

---

## Tech Stack

- **Frontend:**
  - JavaScript / React (powered by Vite)
  - TailwindCSS for styling
  - DaisyUI component library (built on TailwindCSS)
  - React Router for client-side routing

- **Backend:**
  - Express.js (Node.js framework) for RESTful API and server logic

- **Authentication:**
  - User signup and login system with session or token-based access
  - Admin login and role-based access control

---

## Project Overview

Belsy Restaurant aims to provide users a seamless online experience to:

- Explore the restaurant’s menu and drinks
- Register and login as users
- Book a table online
- (Admin) Manage bookings, menus, images, working hours, and contact information from a secure dashboard

This project is built incrementally, beginning with user-facing features and admin control. Future phases may include eCommerce-style online ordering.

---

## Project Plan & Features

### **Phase 1: Base Structure & Deployment**

- **Setup React Frontend with Vite**
- **Integrate TailwindCSS and DaisyUI**
- **Setup React Router for Navigation**
- **Setup Deployment Pipeline for Frontend and Backend**
- **Display Restaurant Menu and Drinks**
- **Implement Table Booking Feature**
- **Setup Error Handling and Notifications**
- **Implement User Profile Management**

### **Phase 2: Admin Dashboard & Management Features**

- **Create Admin Dashboard (View and Manage Bookings, Menu Management, Category Management, Image Upload, Stats, and Navigation)**
- **Enable Image Upload for Menu Items**
- **Add Category Management for Menu Items**
- **Design Admin Dashboard UI with Stats and Navigation**

### **Phase 3: Admin Dashboard Updates for Management**

- **Update Admin Dashboard to Manage Working Hours (CRUD for restaurant working hours)**
- **Update Admin Dashboard to Manage Contact Information (CRUD for restaurant contact details)**
- **Update Admin Dashboard to Manage Menu Items (CRUD for menu items and images)**

### **Phase 4: Future Enhancements**

- **Plan and Implement AI Assistance Features (Future)**
- **Add Loading Spinners and UX Feedback**
- **Optimize Performance and Accessibility**
- **Add Email Confirmation for Bookings**
- **Prepare for Future eCommerce Features**
- **Add Feedback and Review System**

---

## Tags / Keywords

`React` `Vite` `TailwindCSS` `DaisyUI` `React Router` `Express` `Node.js` `Authentication` `Admin Dashboard` `Booking System` `Restaurant Website`

---

## Getting Started

*(Instructions for installing dependencies, running the development server, and building the project will be added here once initial setup is done.)*

---

## Contribution

Contributions are not possible since it's a task project, but ideas are welcome!

---

## License

*(Specify your license here)*

---

**Belsy Restaurant** — Bringing fine dining online, with authentic Syrian flavor and seamless admin control.

---

## 📡 API Routes

All backend endpoints used in the Belsy Restaurant system, including authentication and admin features.

### 🔐 Authentication Routes

| Method | Endpoint                          | Description                              | Middleware                                             |
|--------|-----------------------------------|------------------------------------------|--------------------------------------------------------|
| GET    | `/api/auth/me`                    | Get current authenticated user info      | `verifyToken`                                          |
| POST   | `/api/auth/signup`                | Register a new user                      | `validateZod(userSchema.POST)`                         |
| POST   | `/api/auth/signin`                | Sign in and receive authentication token | `validateZod(signInSchema)`                            |
| PUT    | `/api/auth/update-profile`        | Update user profile                      | `verifyToken`, `validateZod(updateProfileSchema)`      |
| POST   | `/api/auth/delete-account`        | Delete the authenticated user's account  | `verifyToken`, `validateZod(deleteAccountSchema)`      |
| POST   | `/api/auth/signout`               | Sign out and clear session/token         | –                                                      |
| POST   | `/api/auth/forgot-password`       | Request password reset email/link        | `validateZod(forgotPasswordSchema)`                    |
| POST   | `/api/auth/reset-password/:token` | Reset user password using token          | `validateZod(resetPasswordSchema)`                     |

### 🛠️ Admin Routes

| Method | Endpoint               | Description              | Middleware                   |
|--------|------------------------|--------------------------|------------------------------|
| GET    | `/api/admin/dashboard` | Admin dashboard overview | `verifyToken`, `isAdmin`     |



### 📆 Duty (Working Hours) Routes

| Method | Endpoint                   | Description                         | Middleware                      |
|--------|----------------------------|-------------------------------------|---------------------------------|
| GET    | `/api/working-hours`       | Get all duty hours                  | –                               |
| POST   | `/api/working-hours`       | Create a new duty hour entry        | `verifyToken`, `isAdmin`        |
| PUT    | `/api/working-hours/:id`   | Update an existing duty hour entry  | `verifyToken`, `isAdmin`        |
| DELETE | `/api/working-hours/:id`   | Delete a duty hour entry            | `verifyToken`, `isAdmin`        |

### 📅 Reservation Routes

| Method | Endpoint                          | Description                                   | Middleware                              |
|--------|-----------------------------------|-----------------------------------------------|------------------------------------------|
| POST   | `/api/reservations`               | Create a new reservation (multi-table)        | `verifyToken`, `validateZod`             |
| GET    | `/api/reservations/mine`          | View reservations for logged-in user          | `verifyToken`                            |
| POST   | `/api/reservations/suggest-tables`| Suggest tables based on guest count & time    | `validateZod(suggestTablesSchema)`       |
| GET    | `/api/reservations/admin`         | Admin views all reservations                  | `verifyToken`, `isAdmin`                 |
| PATCH  | `/api/reservations/admin/:id/approve` | Admin approves a reservation              | `verifyToken`, `isAdmin`                 |
| PATCH  | `/api/reservations/admin/:id/decline` | Admin declines a reservation              | `verifyToken`, `isAdmin`                 |


🍽 Table Management Routes (Admin)
md
Copy
Edit
| Method | Endpoint           | Description                  | Middleware                                               |
|--------|--------------------|------------------------------|-----------------------------------------------------------|
| GET    | `/api/tables`      | Get all tables               | _Public_ (used in reservation system)                     |
| POST   | `/api/tables`      | Create new table             | `verifyToken`, `isAdmin`, `validateZod(tableSchema)`      |
| PUT    | `/api/tables/:id`  | Update existing table        | `verifyToken`, `isAdmin`, `validateZod(tableSchema)`      |
| DELETE | `/api/tables/:id`  | Delete table                 | `verifyToken`, `isAdmin`                                  |


Menu Management Routes (Admin)
md
Copy
Edit
| Method | Endpoint           | Description                          | Middleware                                              |
|--------|--------------------|--------------------------------------|----------------------------------------------------------|
| GET    | `/api/menu`        | Get all menu items (with category)   | _Public_                                                 |
| POST   | `/api/menu`        | Create new menu item                 | `verifyToken`, `isAdmin`, `validateZod(menuSchema)`      |
| PUT    | `/api/menu/:id`    | Update existing menu item            | `verifyToken`, `isAdmin`, `validateZod(menuSchema)`      |
| DELETE | `/api/menu/:id`    | Delete menu item                     | `verifyToken`, `isAdmin`            


| Method | Endpoint         | Description                          | Middleware                                              |
|--------|------------------|--------------------------------------|----------------------------------------------------------|
| GET    | `/api/contact`   | Get restaurant contact info          | _Public_                                                 |
| PUT    | `/api/contact`   | Update or create contact info        | `verifyToken`, `isAdmin`, `validateZod(contactInfoSchema)` |
