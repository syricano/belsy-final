Belsy Restaurant Reservation System Documentation
Overview
The Reservation System allows users to book tables at Belsy Restaurant. Admins can approve, decline, and manage reservations with a detailed approval process. Each reservation can include additional notes for both users and admins. The system provides control over reservation status, with admin responses available for communication.

Additionally, the admin can manage key frontend elements, such as menus, images, working hours, and contact information.

Database Models and Structure
1. Users Model
Attributes:

id: Primary key (integer)

username: String (unique)

email: String (unique)

password: String (hashed password)

role: Enum (User, Admin)

createdAt: Timestamp

updatedAt: Timestamp

Associations:

One user can have many reservations.

2. Tables Model
Attributes:

id: Primary key (integer)

number: Table number (unique)

seats: Integer (fixed to 2 seats per table)

isAvailable: Boolean (indicates if the table is available for booking)

createdAt: Timestamp

updatedAt: Timestamp

Associations:

A table can have many reservations.

3. Reservations Model
Attributes:

id: Primary key (integer)

userId: Foreign key (references Users model)

tableId: Foreign key (references Tables model)

reservationTime: Timestamp (when the reservation is made)

status: Enum (Pending, Approved, Declined)

note: Text (user's request or comment during reservation)

adminResponse: Text (admin’s reply upon approval or decline)

createdAt: Timestamp

updatedAt: Timestamp

Associations:

A reservation belongs to a user and a table.

One table can have multiple reservations over time.

A user can have multiple reservations.

4. WorkingHours Model
Attributes:

id: Primary key (integer)

dayOfWeek: Enum (Monday, Tuesday, etc.)

startTime: Time (working start time)

endTime: Time (working end time)

createdAt: Timestamp

updatedAt: Timestamp

Associations:

Admin can manage working hours (CRUD operations).

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

Functionality Overview
1. Reservation Flow
User makes a reservation:

Users can choose a table and a time slot during working hours (admin-defined).

Once a reservation is made, it is automatically set to Pending.

Admin reviews reservations:

Admin can see all pending reservations in the admin dashboard.

Admin has the option to approve or decline a reservation:

Approve: The reservation status changes to Approved.

Decline: The reservation status changes to Declined.

Admin Response: The admin can add a response to the reservation explaining the decision (e.g., confirming, providing instructions, or explaining why the booking was declined).

User views the reservation status:

Users can view their reservation and any response from the admin (e.g., "Confirmed, please arrive at 6 PM" or "Declined, unfortunately, no tables are available").

2. Admin Dashboard
The admin dashboard allows the admin to manage various aspects of the restaurant, including reservations, menus, working hours, and contact information. The dashboard includes:

Manage Reservations:

Admin can view and manage bookings (approve, decline, or respond).

Admin can filter reservations by status (Pending, Approved, Declined).

Manage Menu:

Admin can add, update, or delete menu items.

Admin can upload images for menu items.

Admin can organize menu items by categories (e.g., appetizers, mains, drinks).

Manage Working Hours:

Admin can define the working hours for each day of the week.

Admin can edit or delete working hours as needed.

Manage Contact Information:

Admin can update the restaurant’s contact information, including email, phone number, and address.

3. Admin Response Feature
When the admin approves or declines a reservation, the admin can provide a response in the adminResponse field. This feature allows communication between the admin and the user. The admin’s response is displayed to the user when they view their reservation status.

4. Admin Interface for Frontend Management
In addition to managing reservations, the admin can manage frontend elements such as:

Menus:

Admin can create, edit, or delete menu items.

Admin can add images and descriptions for each menu item.

Working Hours:

Admin can define and manage the working hours for the restaurant, ensuring users can only book tables during open hours.

Contact Information:

Admin can update and manage the restaurant’s contact details to ensure users can reach out for inquiries or bookings.

Additional Features
Notes Field: Both users and admins can use the note field to provide or request additional details for the reservation (e.g., special requests, user preferences, etc.).

Pending Status: Reservations remain in Pending status until the admin either approves or declines them. This feature allows the restaurant to review and validate reservations before confirming them.

Process Flow Summary
User Flow:

User books a table.

Reservation is created and set to Pending.

Admin reviews the reservation, and either approves or declines it.

Admin adds a response in adminResponse.

User is notified of the status (Approved/Declined) and any comments from the admin.

Admin Flow:

Admin manages reservations via the admin dashboard.

Admin can approve or decline reservations and leave notes for users.

Admin can manage tables, working hours, and other frontend content.

Future Considerations
Email Notifications: Send email notifications for status updates (e.g., reservation approved or declined).

Online Ordering: Future features may include allowing users to place orders online.

Payment Integration: Add functionality to process payments with confirmed reservations.