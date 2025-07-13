import React, { useState, useEffect } from 'react';
import { createReservation, suggestTables } from '@/data';
import { getAllDutyHours } from '@/data/duty';
import { getAvailableTimeSlots } from '@/utils';
import { asyncHandler, errorHandler } from '@/utils';

const ReservationForm = ({ onSuccess }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '',
    date: '',
    time: '',
    reservationTime: '',
    note: '',
    tableId: '',
  });

  const [dutyHours, setDutyHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const day = new Date(form.date).toLocaleDateString('en-US', { weekday: 'long' });
  const timeOptions = getAvailableTimeSlots(day, dutyHours);

  // 🕐 Fetch duty hours once
  useEffect(() => {
    asyncHandler(getAllDutyHours, 'Failed to fetch working hours')
      .then(setDutyHours)
      .catch(errorHandler);
  }, []);

  // 📅 Watch date/time changes to update reservationTime
  const handleDateChange = (e) => {
    const date = e.target.value;
    setForm(prev => ({
      ...prev,
      date,
      reservationTime: date && form.time ? `${date}T${form.time}` : ''
    }));
  };

  const handleTimeChange = (e) => {
    const time = e.target.value;
    setForm(prev => ({
      ...prev,
      time,
      reservationTime: form.date && time ? `${form.date}T${time}` : ''
    }));
  };

  // 🪑 Suggest table when guests + time is selected
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!form.guests || !form.reservationTime) return;

      asyncHandler(() => suggestTables({
        guests: Number(form.guests),
        reservationTime: form.reservationTime,
      }), 'Table suggestion failed')
        .then(data => {
          if (data?.tables?.length > 0) {
            setForm(prev => ({ ...prev, tableId: data.tables[0] }));
            setMessage('');
          } else {
            setForm(prev => ({ ...prev, tableId: '' }));
            setMessage('No available tables for the selected time.');
            setMessageType('error');
          }
        })
        .catch(errorHandler);
    }, 500);

    return () => clearTimeout(timeout);
  }, [form.guests, form.reservationTime]);

  // ✏️ Input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const selectedDate = new Date(form.reservationTime);
      const weekday = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
      const timeStr = selectedDate.toTimeString().slice(0, 5);

      const duty = dutyHours.find(d => d.dayOfWeek === weekday);
      if (!duty) throw new Error(`No working hours set for ${weekday}`);
      if (timeStr < duty.startTime || timeStr > duty.endTime)
        throw new Error(`Selected time ${timeStr} is outside working hours (${duty.startTime} – ${duty.endTime})`);

      if (!form.tableId) throw new Error('No table available for the selected time.');

      const payload = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        guests: Number(form.guests),
        reservationTime: form.reservationTime,
        note: form.note,
        tableIds: [Number(form.tableId)],
      };

      const data = await createReservation(payload);
      onSuccess(data);

      setMessage('🎉 Reservation successful!');
      setMessageType('success');

      setForm({
        name: '',
        email: '',
        phone: '',
        guests: '',
        date: '',
        time: '',
        reservationTime: '',
        note: '',
        tableId: ''
      });
    } catch (err) {
      setMessage(err.message || 'Booking failed. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-base-100 shadow-xl rounded-xl p-10 max-w-5xl space-y-6">
      {message && (
        <div className={`alert ${messageType === 'success' ? 'alert-success' : 'alert-error'} shadow-lg mb-6`}>
          <span>{message}</span>
        </div>
      )}

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
        <div className="px-2">
          <label className="label font-semibold mb-1">Full Name</label>
          <input type="text" name="name" className="input input-bordered w-full" value={form.name} onChange={handleChange} required />
        </div>
        <div className="px-2">
          <label className="label font-semibold mb-1">Phone Number</label>
          <input type="tel" name="phone" className="input input-bordered w-full" value={form.phone} onChange={handleChange} required />
        </div>
        <div className="px-2">
          <label className="label font-semibold mb-1">Email</label>
          <input type="email" name="email" className="input input-bordered w-full" value={form.email} onChange={handleChange} required />
        </div>
      </div>

      {/* Reservation Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-6 gap-x-4">
        <div className="px-2">
          <label className="label font-semibold mb-1">Number of Guests</label>
          <input type="number" name="guests" min="1" className="input input-bordered w-full" value={form.guests} onChange={handleChange} required />
        </div>
        <div className="px-2">
          <label className="label font-semibold mb-1">Reservation Time</label>
          <input type="date" name="date" className="input input-bordered w-full" value={form.date} onChange={handleDateChange} required />
          <select name="time" className="select select-bordered w-full mt-2" value={form.time} onChange={handleTimeChange} required>
            <option value="" disabled>Select Time</option>
            {timeOptions.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div className="px-2">
          <label className="label font-semibold mb-1">Note (optional)</label>
          <textarea name="note" className="textarea textarea-bordered w-full min-h-[100px]" value={form.note} onChange={handleChange} />
        </div>
      </div>

      <div className="p-10">
        <button
          type="submit"
          className="w-full rounded-xl shadow-2xl bg-amber-800 text-white text-lg font-bold transition-all duration-300 hover:bg-amber-600 hover:-translate-y-1"
          disabled={loading}
        >
          {loading ? 'Booking...' : 'Book Now'}
        </button>
      </div>
    </form>
  );
};

export default ReservationForm;
