import { useState } from 'react';
import ReservationModal from '@/components/Reservations/ReservationModal';

const ReservationsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const handleSuccess = (data) => {
    console.log('Reservation created:', data);
    // Optionally show toast or refresh UI
  };

  return (
    <section className="min-h-screen py-16 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">Reserve Your Table</h1>

      <div className="text-center">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Book Now
        </button>
      </div>

      {showModal && (
        <ReservationModal onClose={() => setShowModal(false)} onSuccess={handleSuccess} />
      )}
    </section>
  );
};

export default ReservationsPage;
