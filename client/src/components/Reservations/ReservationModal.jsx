// ReservationModal.jsx
import React, { useRef } from 'react';
import useReservationForm from './useReservationForm';

const ReservationModal = ({ onClose, onSuccess }) => {
  const {
    form,
    loading,
    upcomingDates,
    timeOptions,
    handleChange,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
    errorMsg,
  } = useReservationForm({ onSuccess, onClose });

  const dialogRef = useRef(null);

  return (
    <dialog ref={dialogRef} open className="modal">
      <form method="dialog" className="modal-box bg-[#FFF9E5] text-[#004030]">
        <button type="button" onClick={onClose} className="btn btn-sm btn-circle absolute right-2 top-2">
          ✕
        </button>

        <h3 className="font-bold text-xl mb-4 text-center">Book a Reservation</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleChange} placeholder="Full Name" className="input input-bordered" required />
          <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone" className="input input-bordered" required />
          <input name="email" value={form.email} onChange={handleChange} placeholder="Email" className="input input-bordered" required />
          <select name="guests" value={form.guests} onChange={handleChange} className="select select-bordered">
            <option value="">Guests</option>
            {[...Array(9)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <select name="date" value={form.date} onChange={handleDateChange} className="select select-bordered">
            <option value="">Select Date</option>
            {upcomingDates.map((date) => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>

          <select name="time" value={form.time} onChange={handleTimeChange} className="select select-bordered">
            <option value="">Select Time</option>
            {timeOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
            
          </select>
          {timeOptions.length === 0 && form.date && (
            <p className="text-sm text-error mt-1">
                No available working hours on this day. Please choose another.
            </p>
            )}
        </div>

        <textarea name="note" value={form.note} onChange={handleChange} className="textarea textarea-bordered w-full mt-4" placeholder="Optional Note" />

        {errorMsg && <p className="text-red-600 text-sm mt-2 text-center">{errorMsg}</p>}

        <div className="modal-action">
          <button type="button" className={`btn btn-primary w-full ${loading ? 'loading' : ''}`} onClick={handleSubmit}>
            {loading ? 'Booking...' : 'Submit Reservation'}
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default ReservationModal;
