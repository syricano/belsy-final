import React from 'react';
import ActionButton from '@/components/UI/ActionButton'


const ReservationManagerMobile = ({ reservations, onApprove, onDecline, onUpdate, onCancel, renderNote }) => {
  return (
    <div className="space-y-4 bg-[var(--b1)] text-[var(--bc)]">
      {reservations.map(res => (
        <div
          key={res.id}
          className="p-4 border rounded-md bg-[var(--b1)] text-[var(--bc)] shadow-sm text-sm"
        >
          <div className="font-semibold text-[var(--bc)]">
            {new Date(res.reservationTime).toLocaleString()}
          </div>

          <div className="mt-1">
            <span className="font-medium">Status: </span>
            <span className={`badge ${
              res.status === 'Approved' ? 'badge-accent' :
              res.status === 'Declined' ? 'badge-error' : 'badge-warning'
            }`}>
              {res.status}
            </span>
          </div>

          <div className="mt-1">
            <span className="font-medium">Note: </span>{renderNote(res)}
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {res.status === 'Pending' && (
              <>
                <button className="btn btn-xs btn-accent" onClick={() => onApprove(res.id)}>Approve</button>
                <button className="btn btn-xs btn-error" onClick={() => onDecline(res.id)}>Decline</button>
              </>
            )}
            <button onClick={() => onUpdate(res)}>Update</button>
            <button className="btn btn-xs btn-error" onClick={() => onCancel(res.id)}>Cancel</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReservationManagerMobile;
