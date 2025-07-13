import React, { useEffect, useState } from 'react';
import { useAdmin } from '@/context';
import { errorHandler } from '@/utils/errorHandler';

const ReservationManager = () => {
  const {
    getAllReservations,
    approveReservation,
    declineReservation,
  } = useAdmin();

  const [reservations, setReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = () => {
    getAllReservations()
      .then((res) => setReservations(res))
      .catch((err) => errorHandler(err, 'Failed to fetch reservations'))
      .finally(() => setLoading(false));
  };

  const handleStatusUpdate = async (id, action) => {
    let adminResponse = prompt(`Enter a response to ${action} this reservation:`)?.trim();
    if (!adminResponse) adminResponse = action === 'approve' ? 'Approved' : 'Declined';

    const fn = action === 'approve' ? approveReservation : declineReservation;

    fn(id, adminResponse)
      .then((res) => {
        setReservations((prev) =>
          prev.map((r) => (r.id === id ? res.reservation : r))
        );
      })
      .catch((err) => errorHandler(err, `Failed to ${action} reservation`));
  };

  const filtered = statusFilter === 'All'
    ? reservations
    : reservations.filter((r) => r.status === statusFilter);

  if (loading) return <p className="text-center">Loading reservations...</p>;

  return (
    <section className="w-full bg-white dark:bg-base-100 text-[var(--text-color)] p-4 rounded-xl shadow">
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <label className="font-semibold">Filter by Status:</label>
        <select
          className="select select-bordered max-w-xs"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option>All</option>
          <option>Pending</option>
          <option>Approved</option>
          <option>Declined</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="table table-zebra w-full text-sm bg-white dark:bg-base-200">
          <thead className="bg-base-200 text-[var(--text-color)]">
            <tr>
              <th>ID</th>
              <th>Guest</th>
              <th>Time</th>
              <th>Table</th>
              <th>Status</th>
              <th>Note</th>
              <th>Response</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((res) => (
              <tr key={res.id}>
                <td>{res.id}</td>
                <td>{res.guestName || res.User?.username}</td>
                <td>{new Date(res.reservationTime).toLocaleString()}</td>
                <td>{res.Table?.number}</td>
                <td>{res.status}</td>
                <td>{res.note}</td>
                <td>{res.adminResponse}</td>
                <td>
                  {res.status === 'Pending' && (
                    <div className="flex flex-col md:flex-row gap-2">
                      <button
                        className="btn btn-sm md:btn-md btn-success"
                        onClick={() => handleStatusUpdate(res.id, 'approve')}
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="btn btn-sm md:btn-md btn-error"
                        onClick={() => handleStatusUpdate(res.id, 'decline')}
                      >
                        ❌ Decline
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ReservationManager;
