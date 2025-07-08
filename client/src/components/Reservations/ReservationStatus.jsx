import React from 'react';

const ReservationStatus = ({ status, response }) => {
  const getStatusColor = () => {
    switch (status) {
      case 'Approved': return 'text-green-600';
      case 'Declined': return 'text-red-600';
      default: return 'text-yellow-600';
    }
  };

  return (
    <div className="mt-3 p-3 bg-amber-100 rounded-xl shadow-inner">
      <p className={`font-semibold ${getStatusColor()}`}>
        Status: {status}
      </p>
      {response && (
        <p className="text-sm text-gray-700 mt-1">Admin: {response}</p>
      )}
    </div>
  );
};

export default ReservationStatus;
