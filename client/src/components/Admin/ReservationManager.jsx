import React, { useEffect, useState } from 'react';
import { 
  getAllReservations,
  approveReservation, 
  declineReservation, 
  updateReservation, 
  cancelReservation
} from '@/data';
import EditReservationModal from '../Reservations/EditReservationModal';
import { asyncHandler, errorHandler } from '@/utils';
import { toast } from 'react-hot-toast';
import AdminResponseModal from './AdminResponseModal';

const ReservationManager = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const [editingReservation, setEditingReservation] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);


  const fetchReservations = () => {
    setLoading(true);
    asyncHandler(getAllReservations, 'Failed to load reservations')
      .then(setReservations)
      .catch(errorHandler)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleActionClick = (id, action) => {
    setSelectedId(id);
    setSelectedAction(action);
    setModalOpen(true);
  };

  const handleAdminSubmit = (responseText) => {
    const service = selectedAction === 'approve' ? approveReservation : declineReservation;

    asyncHandler(() => service(selectedId, responseText), `Failed to ${selectedAction}`)
      .then(() => {
        toast.success(`Reservation ${selectedAction}d`);
        fetchReservations();
      })
      .catch(errorHandler);
  };

  const handleUpdate = (reservation) => {
    setEditingReservation(reservation);
    setShowEditModal(true);

  };

  const handleCancelation = (id) => {
    if(!confirm('Are you sure you want to cancel this reservation?'))
      return
    asyncHandler(()=> cancelReservation(id),'Cancelation failed')
    .then(()=>{
      toast.success('Reservation canceller');
      fetchReservations();
    })
    .catch(errorHandler);
  };

  const handleUpdateSuccess = ()=>{
    setShowEditModal(false);
    fetchReservations();
  };

  return (
    <section className="space-y-8">
      <h2 className="text-3xl font-serif font-semibold text-[var(--bc)] text-center">Reservations</h2>

      {loading ? (
        <p className="text-center text-[var(--bc)] opacity-60">Loading...</p>
      ) : reservations.length === 0 ? (
        <p className="text-center text-[var(--bc)] opacity-60">No reservations found.</p>
      ) : (
        <div className="space-y-6">
          {reservations.map((res) => (
            <div
              key={res.id}
              className="bg-[var(--b1)] text-[var(--bc)] p-6 rounded-xl shadow-md border border-[var(--border-color)] transition hover:shadow-lg"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="font-semibold text-lg">
                  {new Date(res.reservationTime).toLocaleString()}
                </div>
                <div className="text-sm opacity-70">Reservation ID: #{res.id}</div>
              </div>

              <div className="mt-4 space-y-1">
                <p><span className="font-medium">Guests:</span> {res.guests}</p>
                <p><span className="font-medium">Table:</span> {res.Table?.number || 'Not assigned'}</p>
                <p><span className="font-medium">Note:</span> {res.note || '—'}</p>
                <p>
                  <span className="font-medium">Status:</span>{' '}
                  <span className={`font-bold ${
                    res.status === 'Approved' ? 'text-green-600' :
                    res.status === 'Declined' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {res.status}
                  </span>
                </p>
                {res.adminResponse && (
                  <p className="italic text-sm text-[var(--bc)] opacity-60">“{res.adminResponse}”</p>
                )}
              </div>

              <div className="text-sm pt-4 mt-4 border-t border-[var(--border-color)] space-y-1">
                <p><span className="font-medium">Name:</span> {res.guestName || res.User?.firstName || 'Anonymous'}</p>
                <p><span className="font-medium">Email:</span> {res.guestEmail || res.User?.email || '—'}</p>
                <p><span className="font-medium">Phone:</span> {res.guestPhone || res.User?.phone || '—'}</p>
                <p><span className="font-medium">Created:</span> {new Date(res.createdAt).toLocaleString()}</p>
                <p><span className="font-medium">Updated:</span> {new Date(res.updatedAt).toLocaleString()}</p>
              </div>
     
              <div className="flex gap-4 mt-6 flex-wrap">
                {res.status === 'Pending' && (
                  <>
                    <button className="btn btn-success btn-sm" onClick={() => handleActionClick(res.id, 'approve')}>
                      Approve
                    </button>
                    <button className="btn btn-error btn-sm" onClick={() => handleActionClick(res.id, 'decline')}>
                      Decline
                    </button>
                  </>
                )}

                {res.status === 'Cancelled' ? (
                  <>
                    <button
                      className="btn btn-disabled btn-sm opacity-50 cursor-not-allowed"
                      title="Reservation is cancelled and cannot be updated"
                      disabled
                    >
                      Update
                    </button>
                    <button
                      className="btn btn-disabled btn-sm opacity-50 cursor-not-allowed"
                      title="Reservation is already cancelled"
                      disabled
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button className="btn btn-outline btn-sm" onClick={() => handleUpdate(res)}>
                      Update
                    </button>
                    <button className="btn btn-outline btn-error btn-sm" onClick={() => handleCancelation(res.id)}>
                      Cancel
                    </button>
                  </>
                )}
              </div>


            </div>
          ))}
        </div>
      )}

      <AdminResponseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAdminSubmit}
      />
      <EditReservationModal
        reservation={editingReservation}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSuccess={handleUpdateSuccess}
      />

    </section>
  );
};

export default ReservationManager;
