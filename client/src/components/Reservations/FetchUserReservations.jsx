import React, { useState, useEffect } from 'react';
import { getMyReservations, cancelReservation, updateReservation } from '@/data';
import { useAuth } from '@/context';
import { asyncHandler, errorHandler } from '@/utils';
import EditReservationModal from './EditReservationModal';


const FetchUserReservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);


  const fetchReservations = () => {
    asyncHandler(getMyReservations, 'Failed to fetch reservations')
      .then((res) => setReservations(res))
      .catch(errorHandler)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) fetchReservations();
  }, [user]);

  const handleCancel = (id) => {
    if (confirm('Are you sure you want to cancel this reservation?')) {
      asyncHandler(() => cancelReservation(id), 'Cancel failed')
        .then(() => fetchReservations())
        .catch(errorHandler);
    }
  };

  const handleUpdate = (res) => setEditing(res);

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
                <th>Actions</th>
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
                  <td className="space-x-2">
                    {res.status === 'Pending' && (
                      <>
                        <button className="btn btn-xs btn-warning" onClick={() => handleUpdate(res)}>Update</button>
                        <button className="btn btn-xs btn-error" onClick={() => handleCancel(res.id)}>Cancel</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editing && (
            <EditReservationModal
              reservation={editing}
              isOpen={true}
              onClose={() => setEditing(null)}
              onSuccess={() => {
                fetchReservations(); // refresh list
                setEditing(null);    // close modal
              }}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default FetchUserReservations;
