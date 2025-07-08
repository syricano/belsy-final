import React from 'react';

const ReservationCard = ({ data }) => {
  const { tableId, reservationTime, note } = data;

  return (
    <div className="card border-b-amber-800 shadow-2xl rounded-xl overflow-hidden hover:scale-105 transition-transform duration-300 p-4 py-5 bg-base-100">
      <div className="space-y-2">
        <h2 className="font-serif text-xl font-semibold text-primary">Table #{tableId}</h2>
        <p className="text-gray-500 text-sm">
          Time: {new Date(reservationTime).toLocaleString()}
        </p>
        {note && (
          <p className="text-sm text-gray-600 italic">Note: {note}</p>
        )}
      </div>
    </div>
  );
};

export default ReservationCard;
