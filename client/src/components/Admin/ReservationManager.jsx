import React, { useState } from 'react';
import useReservationManager from '@/hooks/useReservationManager';
import ReservationsFilter from './ReservationsFilter';
import AdminResponseModal from './AdminResponseModal';
import EditReservationModal from '../Reservations/EditReservationModal';

const ReservationManager = () => {
  const {
    reservations,
    loading,
    filteredReservations,
    filterActive,
    modalOpen,
    selectedAction,
    selectedId,
    editingReservation,
    showEditModal,
    handleActionClick,
    handleAdminSubmit,
    handleUpdate,
    handleCancelation,
    handleUpdateSuccess,
    handleSearch,
    setModalOpen,
    setShowEditModal,
  } = useReservationManager();

  const [currentPage, setCurrentPage] = useState(1);
  const [activeNote, setActiveNote] = useState(null);
  const reservationsPerPage = 10;

  const visibleReservations = (filterActive && filteredReservations.length > 0
    ? filteredReservations
    : reservations).sort((a, b) => {
      const order = { Pending: 0, Approved: 1, Declined: 2 };
      return order[a.status] - order[b.status] || new Date(a.reservationTime) - new Date(b.reservationTime);
    });

  const indexOfLast = currentPage * reservationsPerPage;
  const indexOfFirst = indexOfLast - reservationsPerPage;
  const currentReservations = visibleReservations.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(visibleReservations.length / reservationsPerPage);

  const renderNote = (res) => {
    if (!res.note) return '—';
    const words = res.note.split(' ');
    return (
      <>
        {words.slice(0, 6).join(' ')}{words.length > 6 ? '...' : ''}
        {words.length > 6 && (
          <button
            onClick={() => setActiveNote(res.note)}
            className="ml-2 btn btn-xs btn-outline"
          >
            Read more »
          </button>
        )}
      </>
    );
  };

  return (
    <section className="space-y-8 relative">
      <h2 className="text-3xl font-serif font-semibold text-[var(--bc)] text-center">
        Reservations
      </h2>

      <ReservationsFilter onSearch={handleSearch} />

      {loading ? (
        <div className="w-full flex justify-center py-10">
          <span className="loading loading-spinner text-[var(--bc)] w-10 h-10" />
        </div>
      ) : currentReservations.length === 0 ? (
        <p className="text-center text-[var(--bc)] opacity-60">No reservations found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full text-sm bg-gray-50 dark:bg-base-200">
            <thead>
              <tr className="text-[var(--bc)] border-b">
                <th>Date</th>
                <th>Guests</th>
                <th>Table</th>
                <th>Status</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentReservations.map(res => (
                <tr
                  key={res.id}
                  className={`border-b ${res.status === 'Declined' ? 'opacity-50' : ''}`}
                >
                  <td>{new Date(res.reservationTime).toLocaleString()}</td>
                  <td>{res.guests}</td>
                  <td>{res.Table?.number || '—'}</td>
                  <td className="font-bold">
                    <span className={`btn btn-xs ${
                      res.status === 'Approved' ? 'btn-success' :
                      res.status === 'Declined' ? 'btn-error' : 'btn-warning'
                    }`}>
                      {res.status}
                    </span>
                  </td>
                  <td>{res.guestName || res.User?.firstName || '—'}</td>
                  <td>
                    <div>{res.guestEmail || res.User?.email || '—'}</div>
                    <div>{res.guestPhone || res.User?.phone || '—'}</div>
                  </td>
                  <td>{renderNote(res)}</td>
                  <td className="flex flex-wrap gap-2">
                    {res.status === 'Pending' && (
                      <>
                        <button className="btn btn-success btn-xs" onClick={() => handleActionClick(res.id, 'approve')}>Approve</button>
                        <button className="btn btn-error btn-xs" onClick={() => handleActionClick(res.id, 'decline')}>Decline</button>
                      </>
                    )}
                    <button className="btn btn-info btn-xs" onClick={() => handleUpdate(res)}>Update</button>
                    <button className="btn btn-error btn-xs" onClick={() => handleCancelation(res.id)}>Cancel</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center items-center mt-4 gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`btn btn-sm ${currentPage === i + 1 ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeNote && (
        <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-base-100 text-[var(--bc)] shadow-xl border border-[var(--border-color)] max-w-md w-full rounded-xl p-6 z-50">
          <h3 className="text-lg font-bold mb-2">Reservation Note</h3>
          <p className="mb-4 whitespace-pre-wrap">{activeNote}</p>
          <div className="flex justify-end">
            <button className="btn btn-sm btn-outline" onClick={() => setActiveNote(null)}>Close</button>
          </div>
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
