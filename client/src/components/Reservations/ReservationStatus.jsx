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

  if (loading) return <p className="text-center">Loading your reservations...</p>;

  if (reservations.length === 0)
    return <p className="text-center text-gray-500">No reservations found.</p>;

  return (
    <section className="mt-8 space-y-6">
      {reservations.map((res) => (
        <div
          key={res.id}
          className="bg-white dark:bg-base-100 p-4 rounded-xl shadow border flex flex-col md:flex-row justify-between items-start md:items-center"
        >
          <div>
            <p className="font-semibold text-lg">
              {new Date(res.reservationTime).toLocaleString()}
            </p>
            <p>Guests: {res.guests}</p>
            <p>Note: {res.note || 'None'}</p>
          </div>

          <div className="mt-4 md:mt-0 text-right">
            <p className={`font-bold ${
              res.status === 'Approved' ? 'text-green-600' :
              res.status === 'Declined' ? 'text-red-600' :
              'text-yellow-600'
            }`}>
              {res.status}
            </p>
            {res.adminResponse && (
              <p className="text-sm italic text-gray-500 mt-1">“{res.adminResponse}”</p>
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default ReservationStatus;
