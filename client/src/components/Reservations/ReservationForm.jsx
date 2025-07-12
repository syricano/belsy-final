
import React, { useState, useEffect } from 'react';
import { createReservation, suggestTables } from '@/data';
import axiosInstance from '@/config/axiosConfig';
import { getAllDutyHours } from '@/data/duty';
import { getAvailableTimeSlots } from '@/utils/getAvailableTimeSlots';

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

  const [loading, setLoading] = useState(false);

  const [dutyHours, setDutyHours] = useState([]);
  const day = new Date(form.date).toLocaleDateString('en-US', { weekday: 'long' });
  const timeOptions = getAvailableTimeSlots(day, dutyHours);

  useEffect(() => {
  const fetchDutyHours = async () => {
    try {
      const res = await getAllDutyHours();
      setDutyHours(res.data);
    } catch (err) {
      console.error('Duty fetch error:', err);
    }
  };

  fetchDutyHours();
  }, []);
  const handleDateChange = (e) => {
    setForm(prev => ({
      ...prev,
      date: e.target.value,
      reservationTime: e.target.value && form.time
        ? `${e.target.value}T${form.time}`
        : ''
    }));
  };

  const handleTimeChange = (e) => {
    setForm(prev => ({
      ...prev,
      time: e.target.value,
      reservationTime: form.date && e.target.value
        ? `${form.date}T${e.target.value}`
        : ''
    }));
  };



  useEffect(() => {
    const fetchSuggestedTables = async () => {
      if (!form.guests || !form.reservationTime) return;

      try {
        const data = await suggestTables({
          guests: Number(form.guests),
          reservationTime: form.reservationTime,
        });

        if (data.tables && Array.isArray(data.tables)) {
          setForm((prev) => ({
            ...prev,
            tableId: data.tables[0], // or join multiple if needed
          }));
        }
      } catch (err) {
        console.error('Suggestion error:', err.message);
      }
    };

    fetchSuggestedTables();
  }, [form.guests, form.reservationTime]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      guests: Number(form.guests),
      reservationTime: form.reservationTime,
      note: form.note,
      tableIds: Array.isArray(form.tableId) ? form.tableId : [form.tableId],
    };

    try {
      const selectedDate = new Date(form.reservationTime);
      const weekday = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
      const timeStr = selectedDate.toTimeString().slice(0, 5);

      const duty = dutyHours.find(d => d.dayOfWeek === weekday);
      if (!duty) throw new Error(`No working hours set for ${weekday}`);
      if (timeStr < duty.startTime || timeStr > duty.endTime)
        throw new Error(`Selected time ${timeStr} is outside working hours (${duty.startTime} – ${duty.endTime})`);

      const data = await createReservation(payload);
      onSuccess(data);

      setForm({
        name: '',
        email: '',
        phone: '',
        guests: '',
        reservationTime: '',
        note: '',
        tableId: ''
      });
    } catch (err) {
      console.error('Error:', err.message);
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
        <div className="px-2">
          <label className="label font-semibold mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            className="input input-bordered w-full"
            value={form.name}
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
          <label className="label font-semibold mb-1">Number of Guests</label>
          <input
            type="number"
            name="guests"
            min="1"
            className="input input-bordered w-full"
            value={form.guests}
            onChange={handleChange}
            required
          />
        </div>

        <div className="px-2">
          <label className="label font-semibold mb-1">Reservation Time</label>
          <input
            type="date"
            name="date"
            className="input input-bordered w-full"
            value={form.date}
            onChange={handleDateChange}
            required
          />

          <select
            name="time"
            className="select select-bordered w-full mt-2"
            value={form.time}
            onChange={handleTimeChange}
            required
          >
            <option value="" disabled>Select Time</option>
            {timeOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
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
          className="
            flex items-center justify-center
            w-full
            rounded-xl shadow-2xl
            bg-amber-800
            text-white text-lg font-bold
            cursor-pointer
            transition-all duration-300
            hover:bg-amber-600
            hover:-translate-y-1
          "
          disabled={loading}
        >
          {loading ? 'Booking...' : 'Book Now'}
        </button>
      </div>
    </form>
  );
};

export default ReservationForm;
