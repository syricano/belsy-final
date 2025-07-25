import { useState } from 'react';
import CreateReservationModal from '@/components/Reservations/CreateReservationModal';

const ReservationsPage = () => {
  const [showModal, setShowModal] = useState(false);

  const handleSuccess = (data) => {
    console.log('Reservation created:', data);
  };

  return (
    <section className="main-section min-h-screen py-20 px-4 animate-fade-in-up">
      <div className="max-w-3xl mx-auto text-center space-y-10">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--bc)]">
          Reserve Your Table
        </h1>

        <p className="text-lg max-w-xl mx-auto text-[var(--bc)] opacity-80">
          Book your place in just a few clicks. We’ll take care of the rest.
        </p>

        <button
          className="btn btn-primary text-lg px-8 py-3 shadow-md"
          onClick={() => setShowModal(true)}
        >
          Book Now
        </button>
      </div>

      {showModal && (
        <CreateReservationModal
          onClose={() => setShowModal(false)}
          onSuccess={handleSuccess}
        />
      )}
    </section>
  );
};

export default ReservationsPage;
