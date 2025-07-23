import React, { useState, useEffect } from 'react';
import { getMyReservations, cancelReservation } from '@/data';
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
    <div className="w-full">
      <h3 className="text-2xl font-semibold mb-4 text-center">My Reservations</h3>

      {loading ? (
        <div className="w-full flex justify-center py-10">
          <span className="loading loading-spinner text-[var(--bc)] w-10 h-10" />
        </div>
      ) : reservations.length === 0 ? (
        <p className="text-center text-gray-500">No reservations found.</p>
      ) : (
        <>
          {/* Mobile View */}
          <div className="sm:hidden space-y-4">
            {reservations.map((res) => (
              <div key={res.id} className="border border-[var(--border-color)] rounded-lg p-4 bg-[var(--b1)] text-[var(--bc)] shadow">
                <div className="flex justify-between">
                  <span className="font-medium">Date:</span>
                  <span>{new Date(res.reservationTime).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Time:</span>
                  <span>{new Date(res.reservationTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Table:</span>
                  <span>{res.Table?.number || '-'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className="capitalize">{res.status}</span>
                </div>

                {res.status === 'Pending' && (
                  <div className="flex flex-col gap-2 mt-4">
                    <button className="btn btn-sm btn-warning" onClick={() => handleUpdate(res)}>
                      Update
                    </button>
                    <button className="btn btn-sm btn-error" onClick={() => handleCancel(res.id)}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Desktop View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="table w-full text-sm">
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
                    <td>
                      {res.status === 'Pending' && (
                        <div className="flex gap-2">
                          <button className="btn btn-xs btn-warning" onClick={() => handleUpdate(res)}>
                            Update
                          </button>
                          <button className="btn btn-xs btn-error" onClick={() => handleCancel(res.id)}>
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {editing && (
            <EditReservationModal
              reservation={editing}
              isOpen={true}
              onClose={() => setEditing(null)}
              onSuccess={() => {
                fetchReservations();
                setEditing(null);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default FetchUserReservations;
