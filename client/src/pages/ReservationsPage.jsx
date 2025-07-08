import React, { useState, useEffect } from 'react';
import ReservationCard from '../components/Reservations/ReservationCard';
import ReservationForm from '../components/Reservations/ReservationForm';
import ReservationStatus from '../components/Reservations/ReservationStatus';

const ReservationsPage = () => {
  const [reservations, setReservations] = useState([]);
  const [statusFilter, setStatusFilter] = useState(null); // Pending / Approved / Declined
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const res = await fetch('/api/reservations', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        const data = await res.json();
        setReservations(data);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleNewReservation = (newRes) => {
    setReservations(prev => [newRes, ...prev]);
  };

  const filtered = statusFilter
    ? reservations.filter(r => r.status === statusFilter)
    : reservations;

  const statuses = ['Pending', 'Approved', 'Declined'];

  return (
    <section className="min-h-screen max-w-full flex justify-center">
      <div className="px-6 py-16 max-w-7xl mx-auto ">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-serif text-center text-primary font-semibold bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-black">
            Reserve Your Table
          </h1>
        </div>

        {/* Form */}
        <div className='mb-10 text-center mx-auto'>
          <ReservationForm onSuccess={handleNewReservation}  />
        </div>

       
      
      </div>
    </section>
  );
};

export default ReservationsPage;
