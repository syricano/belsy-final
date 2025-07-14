import React, { useState, useEffect } from 'react';
import { createReservation, suggestTables } from '@/data';
import { getAllDutyHours } from '@/data/duty';
import { getAvailableTimeSlots, asyncHandler, errorHandler } from '@/utils';
import { toast } from 'react-hot-toast';

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
  const [suggestionAttempted, setSuggestionAttempted] = useState(false);
  const [tablesCount, setTablesCount] = useState(null);

  const day = new Date(form.date).toLocaleDateString('en-US', { weekday: 'long' });
  const timeOptions = getAvailableTimeSlots(day, dutyHours);

  useEffect(() => {
    asyncHandler(getAllDutyHours, 'Failed to fetch working hours')
      .then(setDutyHours)
      .catch(errorHandler);
  }, []);

  const handleDateChange = (e) => {
    const date = e.target.value;
    setForm(prev => ({
      ...prev,
      date,
      reservationTime: date && prev.time ? `${date}T${prev.time}` : '',
      tableId: ''
    }));
  };

  const handleTimeChange = (e) => {
    const time = e.target.value;
    setForm(prev => ({
      ...prev,
      time,
      reservationTime: prev.date && time ? `${prev.date}T${time}` : '',
      tableId: ''
    }));
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!form.guests || !form.reservationTime) return;

      setSuggestionAttempted(true);

      asyncHandler(() =>
        suggestTables({
          guests: Number(form.guests),
          reservationTime: form.reservationTime,
        }),
        'Table suggestion failed'
      )
        .then(data => {
          if (data?.tables?.length > 0) {
            setForm(prev => ({ ...prev, tableId: data.tables[0] }));
            setTablesCount(data.tablesCount);
          } else {
            setForm(prev => ({ ...prev, tableId: '' }));
            setTablesCount(0);
          }
        })
        .catch(() => setTablesCount(null));
    }, 500);

    return () => clearTimeout(timeout);
  }, [form.guests, form.reservationTime]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      tableId: name === 'guests' ? '' : prev.tableId,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setSuggestionAttempted(false);

    asyncHandler(async () => {
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

      toast.success('🎉 Reservation successful!');
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
      setTablesCount(null);
    }, 'Booking failed. Please try again.')
      .catch(errorHandler)
      .finally(() => setLoading(false));
  };

  return (
    <form onSubmit={handleSubmit} className="bg-base-100 shadow-xl rounded-xl p-10 max-w-5xl space-y-6">
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

      {/* Submit Button + Status */}
      <div className="p-10">
        <button
          type="submit"
          className="w-full rounded-xl shadow-2xl bg-amber-800 text-white text-lg font-bold transition-all duration-300 hover:bg-amber-600 hover:-translate-y-1"
          disabled={loading}
        >
          {loading ? 'Booking...' : 'Book Now'}
        </button>

        {suggestionAttempted && !form.tableId && (
          <p className="text-red-500 text-sm mt-2 text-center">
            {tablesCount === 0
              ? `No available tables for ${form.guests} guests.`
              : `Only ${tablesCount} table(s) available — not enough for ${form.guests} guests.`}
          </p>
        )}
      </div>
    </form>
  );
};

export default ReservationForm;
