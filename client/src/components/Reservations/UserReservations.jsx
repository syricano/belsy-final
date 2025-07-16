import React, { useState, useEffect } from 'react';
import { getMyReservations } from '@/data';
import { useAuth } from '@/context';
import { asyncHandler, errorHandler } from '@/utils';

const UserReservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchReservations = async () => {
      
      asyncHandler(getMyReservations, 'Failed to fetch reservations')
        .then((res) => setReservations(res))
        .catch(errorHandler)
        .finally(() => setLoading(false));
    };

    fetchReservations();
  }, [user]);

  if (!user) return null;

  return (
    <div className="mt-10 w-full max-w-4xl">
      <h3 className="text-2xl font-semibold mb-4 text-center">My Reservations</h3>
      {loading ? (
        <p className="text-center">Loading...</p>
      ) : reservations.length === 0 ? (
        <p className="text-center text-gray-500">No reservations found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Table</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id}>
                  <td>{new Date(res.reservationTime).toLocaleDateString()}</td>
                  <td>{new Date(res.reservationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{res.guests}</td>
                  <td>{res.Table?.number || '-'}</td>
                  <td className="capitalize">{res.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserReservations;
