import React, { useState, useEffect } from 'react';
import useReservationManager from '@/hooks/useReservationManager';
import ReservationsFilter from './ReservationsFilter';
import AdminResponseModal from './AdminResponseModal';
import EditReservationModal from '../Reservations/EditReservationModal';
import ReservationManagerPC from './ReservationManagerPC';
import ReservationManagerMobile from './ReservationManagerMobile';

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
  const [activeNoteY, setActiveNoteY] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const reservationsPerPage = 10;

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const visibleReservations = (filterActive && filteredReservations.length > 0
    ? filteredReservations
    : reservations).sort((a, b) => {
    const order = { Pending: 0, Approved: 1, Declined: 2, Cancelled: 3 };
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
        {words.slice(0, 3).join(' ')}{words.length > 3 ? '...' : ''}
        {words.length > 3 && (
          <button
            onClick={(e) => {
              const y = e.target.getBoundingClientRect().top + window.scrollY;
              setActiveNote(res.note);
              setActiveNoteY(y);
            }}
            className="ml-2 btn btn-xs btn-outline"
          >
            Read more »
          </button>
        )}
      </>
    );
  };

  const filteredActions = (res) => {
    const isInactive = ['Declined', 'Cancelled'].includes(res.status);
    return {
      showApprove: res.status === 'Pending',
      showDecline: res.status === 'Pending',
      showEdit: !isInactive,
      showCancel: !isInactive,
    };
  };

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-[var(--a)] text-[var(--ac)]';
      case 'Declined':
        return 'bg-[var(--bc)] text-[var(--b1)]';
      case 'Cancelled':
        return 'bg-[var(--n)] text-[var(--nc)]';
      case 'Pending':
        return 'bg-transparent border border-[var(--bc)] text-[var(--bc)]';
      default:
        return '';
    }
  };

  return (
    <section className="space-y-6 overflow-x-auto rounded-lg">
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
      ) : isMobile ? (
        <ReservationManagerMobile
          reservations={currentReservations}
          onApprove={(id) => handleActionClick(id, 'approve')}
          onDecline={(id) => handleActionClick(id, 'decline')}
          onUpdate={handleUpdate}
          onCancel={handleCancelation}
          renderNote={renderNote}
          filterActions={filteredActions}
          getStatusBadgeClasses={getStatusBadgeClasses}
        />
      ) : (
        <ReservationManagerPC
          reservations={currentReservations}
          onApprove={(id) => handleActionClick(id, 'approve')}
          onDecline={(id) => handleActionClick(id, 'decline')}
          onUpdate={handleUpdate}
          onCancel={handleCancelation}
          renderNote={renderNote}
          filterActions={filteredActions}
          getStatusBadgeClasses={getStatusBadgeClasses}
        />
      )}

      {totalPages > 1 && (
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
      )}

      {activeNote && (
        <div
          className="absolute left-1/2 transform -translate-x-1/2 bg-base-100 text-[var(--bc)] shadow-xl border border-[var(--border-color)] max-w-md w-full rounded-xl p-6 z-50"
          style={{ top: `${activeNoteY}px` }}
        >
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
