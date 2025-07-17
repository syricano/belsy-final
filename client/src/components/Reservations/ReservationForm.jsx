import { useEffect, useState } from 'react';
import { updateReservation, suggestTables } from '@/data';
import { getAllDutyHours } from '@/data/duty';
import { getAvailableTimeSlots, asyncHandler, errorHandler } from '@/utils';
import { toast } from 'react-hot-toast';

const toMinutes = (str) => {
  const [h, m] = str.split(':').map(Number);
  return h * 60 + (isNaN(m) ? 0 : m);
};

const ReservationForm = ({ reservation, onSuccess, onClose }) => {
  const [form, setForm] = useState({
    guests: '',
    date: '',
    time: '',
    note: '',
    reservationTime: '',
    tableId: '',
  });
  const [dutyHours, setDutyHours] = useState([]);
  const [timeOptions, setTimeOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (reservation) {
      const date = reservation.reservationTime.slice(0, 10);
      const time = reservation.reservationTime.slice(11, 16);
      setForm({
        guests: reservation.guests,
        date,
        time,
        note: reservation.note || '',
        reservationTime: `${date}T${time}`,
        tableId: reservation.tableId,
      });
    }
  }, [reservation]);

  useEffect(() => {
    asyncHandler(getAllDutyHours, 'Failed to fetch working hours')
      .then(setDutyHours)
      .catch(() => setDutyHours([]));
  }, []);

  useEffect(() => {
    if (!form.date) return;
    const day = new Date(form.date).toLocaleString('en-US', { weekday: 'long' });
    const slots = getAvailableTimeSlots(form.date, day, dutyHours);
    setTimeOptions(slots);
  }, [form.date, dutyHours]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const { guests, date, time, note } = form;
    const reservationTime = `${date}T${time}`;
    const weekday = new Date(reservationTime).toLocaleDateString('en-US', { weekday: 'long' });
    const duty = dutyHours.find(d => d.dayOfWeek === weekday);

    if (!duty) return setErrorMsg(`No working hours set for ${weekday}`);
    if (!time.endsWith(':00')) return setErrorMsg('Time must be in full-hour format');

    const timeMinutes = toMinutes(time);
    const startMinutes = toMinutes(duty.startTime);
    const endMinutes = toMinutes(duty.endTime);
    if (timeMinutes < startMinutes || timeMinutes >= endMinutes) {
      return setErrorMsg(`Selected time is outside working hours (${duty.startTime}–${duty.endTime})`);
    }

    try {
      setLoading(true);
      const suggested = await suggestTables({ guests: Number(guests), reservationTime });
      if (!suggested.tables.length) throw new Error('No available tables for that time');

      const payload = {
        guests: Number(guests),
        reservationTime,
        note,
      };

      await updateReservation(reservation.id, payload);
      toast.success('Reservation updated');
      onSuccess();
      onClose();
    } catch (err) {
      errorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="number"
          name="guests"
          className="input input-bordered"
          value={form.guests}
          onChange={handleChange}
          placeholder="Guests"
        />
        <input
          type="date"
          name="date"
          className="input input-bordered"
          value={form.date}
          onChange={handleChange}
        />
        <select
          name="time"
          className="select select-bordered"
          value={form.time}
          onChange={handleChange}
        >
          <option value="">Select Time</option>
          {timeOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input
          type="text"
          name="note"
          className="input input-bordered"
          value={form.note}
          onChange={handleChange}
          placeholder="Optional Note"
        />
      </div>
      {errorMsg && <p className="text-error text-sm text-center">{errorMsg}</p>}
      <div className="text-center">
        <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Updating...' : 'Update Reservation'}
        </button>
      </div>
    </div>
  );
};

export default ReservationForm;
