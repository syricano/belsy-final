import React, { useEffect, useState } from 'react';
import { getMyReservations } from '@/data';
import { asyncHandler, errorHandler } from '@/utils';

const ReservationStatus = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    asyncHandler(getMyReservations, 'Failed to load your reservations')
      .then(setReservations)
      .catch(errorHandler)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return <p className="text-center text-[var(--bc)]">Loading your reservations...</p>;

  if (reservations.length === 0)
    return <p className="text-center text-gray-500">No reservations found.</p>;

  return (
    <section className="mt-8 space-y-6">
      {reservations.map((res) => (
        <div
          key={res.id}
          className="bg-[var(--b1)] text-[var(--bc)] p-5 rounded-xl shadow border border-[var(--border-color)] flex flex-col md:flex-row justify-between items-start md:items-center"
        >
          {/* Left block: details */}
          <div className="space-y-1">
            <p className="font-semibold text-lg">
              {new Date(res.reservationTime).toLocaleString()}
            </p>
            <p className="text-sm opacity-90">Guests: {res.guests}</p>
            <p className="text-sm opacity-90">Note: {res.note || 'None'}</p>
          </div>

          {/* Right block: status */}
          <div className="mt-4 md:mt-0 text-right">
            <p
              className={`font-bold ${
                res.status === 'Approved'
                  ? 'text-green-600'
                  : res.status === 'Declined'
                  ? 'text-red-600'
                  : 'text-yellow-600'
              }`}
            >
              {res.status}
            </p>
            {res.adminResponse && (
              <p className="text-sm italic text-gray-500 mt-1">
                “{res.adminResponse}”
              </p>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default ReservationStatus;
