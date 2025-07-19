import React, { useRef } from 'react';
import useReservationForm from '../../hooks/useReservationForm';

const EditReservationModal = ({ reservation, isOpen, onClose, onSuccess }) => {
  const {
    form,
    loading,
    validDates,
    timeOptions,
    handleChange,
    handleDateChange,
    handleTimeChange,
    handleSubmit,
    errorMsg,
  } = useReservationForm({
    initialData: reservation,
    onSuccess,
    onClose,
  });

  const dialogRef = useRef(null);
  const isContactMissing = !form.name && !form.phone;

  if (!isOpen || !reservation) return null;

  return (
    <dialog ref={dialogRef} open className="modal">
      <form
        method="dialog"
        className="modal-box bg-[var(--b1)] text-[var(--bc)] border border-[var(--border-color)]"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="btn btn-sm btn-circle absolute right-2 top-2"
        >
          ✕
        </button>

        {/* Title */}
        <h3 className="font-bold text-xl mb-4 text-center font-serif">
          Update Your Reservation
        </h3>

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p className="md:col-span-2 text-sm opacity-70">
            You must provide at least your <strong>name</strong> or <strong>phone</strong>
          </p>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="input input-bordered"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="input input-bordered"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email (Optional)"
            className="input input-bordered"
          />
          <select
            name="guests"
            value={form.guests}
            onChange={handleChange}
            className="select select-bordered"
          >
            <option value="">Guests</option>
            {[...Array(9)].map((_, i) => (
              <option key={i + 1} value={i + 1}>{i + 1}</option>
            ))}
          </select>
        </div>

        {/* Date/Time Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <select
            name="date"
            value={form.date}
            onChange={handleDateChange}
            className="select select-bordered"
          >
            <option value="">Select Date</option>
            {validDates.map((date) => (
              <option key={date} value={date}>{date}</option>
            ))}
          </select>

          <select
            name="time"
            value={form.time}
            onChange={handleTimeChange}
            className="select select-bordered"
          >
            <option value="">Select Time</option>
            {timeOptions.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          {form.date && timeOptions.length === 0 && (
            <p className="text-sm text-error mt-1 md:col-span-2">
              No available working hours on this day. Please choose another.
            </p>
          )}
        </div>

        {/* Note */}
        <textarea
          name="note"
          value={form.note}
          onChange={handleChange}
          className="textarea textarea-bordered w-full mt-4"
          placeholder="Optional Note"
        />

        {/* Errors */}
        {errorMsg && (
          <p className="text-red-600 text-sm mt-2 text-center">
            {errorMsg}
          </p>
        )}
        {isContactMissing && (
          <p className="text-error text-sm text-center mt-2">
            Please provide at least your name or phone number.
          </p>
        )}

        {/* Submit */}
        <div className="modal-action">
          <button
            type="button"
            className="btn btn-primary w-full"
            onClick={handleSubmit}
            disabled={loading || isContactMissing}
          >
            {loading ? 'Updating...' : 'Update Reservation'}
          </button>
        </div>
      </form>
    </dialog>
  );
};

export default EditReservationModal;
