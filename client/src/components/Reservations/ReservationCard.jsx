import React from 'react';

const ReservationCard = ({ reservation }) => {
  const {
    id,
    reservationTime,
    guests,
    note,
    status,
    adminResponse,
    Table,
    guestName,
    guestEmail,
    guestPhone,
    User
  } = reservation;

  const readableDate = new Date(reservationTime).toLocaleString();

  const displayName = guestName || User?.username || 'Anonymous';
  const displayEmail = guestEmail || User?.email || '—';
  const displayPhone = guestPhone || User?.phone || '—';

  return (
    <div className="bg-white dark:bg-base-100 p-4 rounded-xl shadow border space-y-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <div className="font-semibold text-lg text-amber-900">{readableDate}</div>
        <div className="text-sm text-gray-500">Reservation ID: #{id}</div>
      </div>

      <div className="text-gray-700 dark:text-gray-300">
        <p><span className="font-medium">Guests:</span> {guests}</p>
        <p><span className="font-medium">Table:</span> {Table?.number || 'Not assigned'}</p>
        <p><span className="font-medium">Note:</span> {note || '—'}</p>
        <p><span className="font-medium">Status:</span>{' '}
          <span className={`font-bold ${
            status === 'Approved' ? 'text-green-600' :
            status === 'Declined' ? 'text-red-600' :
            'text-yellow-600'
          }`}>
            {status}
          </span>
        </p>
        {adminResponse && (
          <p className="italic text-sm text-gray-500">“{adminResponse}”</p>
        )}
      </div>

      {/* Optional Guest Info */}
      <div className="text-sm text-gray-600 pt-2 border-t">
        <p><span className="font-medium">Name:</span> {displayName}</p>
        <p><span className="font-medium">Email:</span> {displayEmail}</p>
        <p><span className="font-medium">Phone:</span> {displayPhone}</p>
      </div>
    </div>
  );
};

export default ReservationCard;
