import { useState } from 'react';
import CreateReservationModal from '@/components/Reservations/CreateReservationModal';

const ReservationsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const handleSuccess = (data) => {
    console.log('Reservation created:', data);
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
        <CreateReservationModal onClose={() => setShowModal(false)} onSuccess={handleSuccess} />
      )}
    </section>
  );
};

export default ReservationsPage;
