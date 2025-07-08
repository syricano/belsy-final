import React, { useState } from 'react';

// Demo tables: 20 tables with 2 seats each
const tableOptions = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  seats: 2
}));

const ReservationForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    tableId: '',
    reservationTime: '',
    guests: '',
    note: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        onSuccess(data);
        setForm({
          firstName: '',
          lastName: '',
          phone: '',
          email: '',
          tableId: '',
          reservationTime: '',
          guests: '',
          note: ''
        });
      } else {
        console.error('Reservation error:', data);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-base-100 shadow-xl rounded-xl p-10 max-w-5xl  space-y-6"
    >
      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
        <div className="p-10">
          <label className="label font-semibold p-10">First Name</label>
          <input
            type="text"
            name="firstName"
            className="input input-bordered p-10"
            value={form.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="px-2">
          <label className="label font-semibold ml-5">Last Name</label>
          <input
            type="text"
            name="lastName"
            className="input input-bordered w-full font"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="px-2">
          <label className="label font-semibold mb-1">Phone Number</label>
          <input
            type="tel"
            name="phone"
            className="input input-bordered w-full"
            value={form.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="px-2">
          <label className="label font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            className="input input-bordered w-full"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      {/* Reservation Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
        <div className="px-2">
          <label className="label font-semibold mb-1">Table Number</label>
          <select
            name="tableId"
            className="select select-bordered w-full text-center"
            value={form.tableId}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select a table</option>
            {tableOptions.map((table) => (
              <option key={table.id} value={table.id}>
                Table {table.id} (Seats: {table.seats})
              </option>
            ))}
          </select>
        </div>

        <div className="px-2">
          <label className="label font-semibold mb-1">Number of Guests</label>
          <input
            type="number"
            name="guests"
            min="1"
            max="2"
            className="input input-bordered w-full"
            value={form.guests}
            onChange={handleChange}
            required
          />
        </div>

        <div className="px-2">
          <label className="label font-semibold mb-1">Reservation Time</label>
          <input
            type="datetime-local"
            name="reservationTime"
            className="input input-bordered text-center w-full"
            value={form.reservationTime}
            onChange={handleChange}
            required
          />
        </div>

        <div className="px-2">
          <label className="label font-semibold mb-1">Note (optional)</label>
          <textarea
            name="note"
            className="textarea textarea-bordered w-full min-h-[100px]"
            value={form.note}
            onChange={handleChange}
            placeholder="Add any special requests..."
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="p-10">
        <button
          type="submit"
          className="btn bg-amber-600 hover:bg-amber-700 text-white font-semibold text-lg px-10 py-3 rounded-xl shadow-xl transition-all"
          disabled={loading}
        >
          {loading ? 'Booking...' : 'Book Now'}
        </button>
      </div>
    </form>
  );
};

export default ReservationForm;
