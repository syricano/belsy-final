Belsy Restaurant Reservation System Documentation
Overview
The Reservation System allows users to book tables at Belsy Restaurant. Admins can approve, decline, and manage reservations with a detailed approval process. Each reservation can include additional notes for both users and admins. The system provides control over reservation status, with admin responses available for communication.

Additionally, the admin can manage key frontend elements, such as menus, images, working hours, and contact information.

Database Models and Structure
1. Users Model
Attributes:

id: Primary key (integer)

firstName: String

lastName: String

email: String (unique)

password: String (hashed)

role: Enum (User, Admin)

createdAt: Timestamp

updatedAt: Timestamp

Associations:

One user can have many reservations

2. Tables Model
Attributes:

id: Primary key (integer)

number: Table number (unique)

seats: Integer (default = 2)

isAvailable: Boolean (available for booking)

location: Enum (inRestaurant, inHall)

createdAt: Timestamp

updatedAt: Timestamp

Associations:

A table can have many reservations

3. Reservations Model
Attributes:

id: Primary key (integer)

userId: Nullable FK to Users

tableId: FK to Tables

reservationTime: Timestamp

status: Enum (Pending, Approved, Declined)

note: Text (user note)

adminResponse: Text (admin reply)

guestName: Nullable string

guestEmail: Nullable string

guestPhone: Nullable string

createdAt: Timestamp

updatedAt: Timestamp

Associations:

Belongs to a user (nullable)

Belongs to a table

4. Duty Model (Replaces WorkingHours)
Attributes:

id: Primary key (integer)

dayOfWeek: Enum (Monday through Sunday)

startTime: Time (e.g., 17:00)

endTime: Time (e.g., 23:00)

createdAt: Timestamp

updatedAt: Timestamp

Purpose:

Defines booking availability windows per weekday

Used to validate reservation requests

5. Menu Model
Attributes:

id: Primary key (integer)

name: String (name of the menu item)

description: Text (description of the menu item)

price: Decimal (price of the menu item)

image: String (URL or path to the image)

createdAt: Timestamp

updatedAt: Timestamp

Associations:

Admin can manage menu items (add, edit, delete).

6. Contact Information Model
Attributes:

id: Primary key (integer)

email: String (restaurant email)

phone: String (restaurant phone number)

address: String (restaurant address)

createdAt: Timestamp

updatedAt: Timestamp

Associations:

Admin can manage contact information (update).


🔁 Reservation Functionality Overview
1. Smart Booking & Protection Features
✅ Users can book multiple tables at once

✅ Admins can book for:

Registered users (auto-detected by email/phone)

Guests (no user account)

✅ Guests can book without signing in

✅ System automatically suggests tables based on guest count (guests / 2)

✅ Uses transactions to prevent partial booking

✅ Prevents:

Overlapping reservations (double-booking)

Spam (max 10 active reservations per user)

2. Reservation Flow
For Users / Guests:
Select guest count → system suggests tables

Select reservation time

Submit reservation

Automatically set to Pending

Await admin approval or decline

For Admins:
Book for guests or users by providing name/phone/email

Approve or decline bookings

Add admin notes (adminResponse)

View all reservations and filter by status

Use bulk reservation logic internally

3. Smart Table Suggestion API
Route: POST /api/reservations/suggest-tables

Input: { guests, reservationTime }

Output: tables: [ids]

Logic: Suggests ceil(guests / 2) available tables not already booked at that time

4. Reservation API Enhancements
POST /api/reservations

Accepts array of tableIds

Validates guest info or logged-in user

Auto-fills userId or guestName/email/phone

Checks before saving:

Valid time window (via Duty model)

Table availability

Max active reservations

Transactional insert to protect group booking

5. Admin Dashboard Supports:
Table and reservation management

Booking for walk-in guests or phone reservations

Table grouping & selection by guest count

Smart validations based on duty hours

Guest information storage for non-users

Future Enhancements
✅ Email notifications for approval/decline

🔄 Table proximity scoring (suggest best grouping)

🔐 Rate limiting or CAPTCHA for guest bookings

🧠 AI-based peak load prediction

💰 Payment & deposit integration

📱 Admin mobile booking interface