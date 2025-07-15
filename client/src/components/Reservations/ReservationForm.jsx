import React, { useState, useEffect, useRef } from 'react';
import { createReservation, suggestTables } from '@/data';
import { getAllDutyHours } from '@/data/duty';
import { getAvailableTimeSlots, asyncHandler, errorHandler } from '@/utils';
import { toast } from 'react-hot-toast';

const ReservationForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', guests: '', date: '', time: '', note: '', tableId: '' });
  const [dutyHours, setDutyHours] = useState([]);
  const [tablesCount, setTablesCount] = useState(null);
  const [loading, setLoading] = useState(false);
  const dialogRef = useRef(null);

  const day = new Date(form.date).toLocaleDateString('en-US', { weekday: 'long' });
  const timeOptions = getAvailableTimeSlots(day, dutyHours);

  useEffect(() => {
    asyncHandler(getAllDutyHours, 'Failed to fetch working hours')
      .then(setDutyHours)
      .catch(errorHandler);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!form.guests || !form.date || !form.time) return;
      asyncHandler(() =>
        suggestTables({ guests: Number(form.guests), reservationTime: `${form.date}T${form.time}` }),
        'Table suggestion failed'
      )
        .then(data => {
          setForm(prev => ({ ...prev, tableId: data.tables?.[0] || '' }));
          setTablesCount(data.tablesCount);
        })
        .catch(() => setTablesCount(null));
    }, 500);
    return () => clearTimeout(timeout);
  }, [form.guests, form.date, form.time]);

  const handleChange = e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value, ...(e.target.name === 'guests' ? { tableId: '' } : {}) }));

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        ...form,
        guests: Number(form.guests),
        reservationTime: `${form.date}T${form.time}`,
        tableIds: [Number(form.tableId)]
      };
      const selectedDate = new Date(payload.reservationTime);
      const weekday = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
      const timeStr = selectedDate.toTimeString().slice(0,5);
      const duty = dutyHours.find(d => d.dayOfWeek === weekday);
      if (!duty || !form.tableId || timeStr < duty.startTime || timeStr > duty.endTime)
        throw new Error('Invalid date/time or no available table');

      const data = await createReservation(payload);
      onSuccess(data);
      toast.success('🎉 Reservation successful!');
      dialogRef.current.close();
      setForm({ name: '', email: '', phone: '', guests: '', date: '', time: '', note: '', tableId: '' });
      setTablesCount(null);
    } catch (err) {
      errorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button className="btn btn-primary" onClick={() => dialogRef.current.showModal()}>
        Book Now
      </button>

      <dialog ref={dialogRef} className="modal">
        <form method="dialog" className="modal-box">
          <button type="button" className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2" onClick={() => dialogRef.current.close()}>
            ✕
          </button>
          <h3 className="text-lg font-bold mb-4">Reserve a Table</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {['name','phone','email','guests','date','time'].map(name =>
              <div key={name}>
                <label className="label"><span className="label-text capitalize">{name.replace(/([A-Z])/g, ' $1')}</span></label>
                {['date','time','guests'].includes(name) ? (
                  <input type={name === 'guests' ? 'number' : name} name={name} min={name==='guests'?1:null}
                    className="input input-bordered w-full" value={form[name]} onChange={handleChange} required />
                ) : (
                  <input type="text" name={name} className="input input-bordered w-full" value={form[name]} onChange={handleChange} required />
                )}
                {name === 'time' && tablesCount !== null && !form.tableId && (
                  <p className="text-sm text-error mt-1">
                    {tablesCount === 0 ? 'No tables' : `Only ${tablesCount} table(s)`} available
                  </p>
                )}
              </div>
            )}
          </div>

          <label className="label mt-4"><span className="label-text">Note (optional)</span></label>
          <textarea name="note" className="textarea textarea-bordered w-full" rows={3} value={form.note} onChange={handleChange} />

          <div className="modal-action">
            <button type="submit" className={`btn btn-primary ${loading && 'loading'}`} onClick={handleSubmit}>
              {loading ? 'Booking...' : 'Submit'}
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
};

export default ReservationForm;
