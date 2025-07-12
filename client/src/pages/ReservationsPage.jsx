import React, { useState, useEffect } from 'react';
import ReservationCard from '../components/Reservations/ReservationCard';
import ReservationForm from '../components/Reservations/ReservationForm';
import ReservationStatus from '../components/Reservations/ReservationStatus';

const ReservationsPage = () => {
  const handleNewReservation = (newRes) => {
    // Optional: show toast or confirmation
    console.log('Reservation success:', newRes);
  }

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
