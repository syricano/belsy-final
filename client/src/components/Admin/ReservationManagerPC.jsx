import React from 'react';

const ReservationManagerPC = ({ reservations, onApprove, onDecline, onUpdate, onCancel, renderNote }) => {
  return (
    <div className="w-full overflow-x-auto border border-[var(--border-color)] bg-[var(--b1)] text-[var(--bc)] rounded-xl shadow">
      <table className="min-w-[800px] table-auto w-full text-sm bg-[var(--b1)] text-[var(--bc)]">
        <thead>
          <tr className="text-[var(--bc)] border-b">
            <th>Date</th>
            <th>Guests</th>
            <th>Table</th>
            <th>Status</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Note</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reservations.map(res => (
            <tr
              key={res.id}
              className={`border-b ${res.status === 'Declined' ? 'opacity-50' : ''}`}
            >
              <td>{new Date(res.reservationTime).toLocaleString()}</td>
              <td>{res.guests}</td>
              <td>{res.Table?.number || '—'}</td>
              <td className="font-bold">
                <span className={`btn btn-xs ${
                  res.status === 'Approved' ? 'btn-accent' :
                  res.status === 'Declined' ? 'btn-error' : 'btn-warning'
                }`}>
                  {res.status}
                </span>
              </td>
              <td>{res.guestName || res.User?.firstName || '—'}</td>
              <td>
                <div>{res.guestEmail || res.User?.email || '—'}</div>
                <div>{res.guestPhone || res.User?.phone || '—'}</div>
              </td>
              <td>{renderNote(res)}</td>
              <td>
                <div className="flex flex-wrap gap-1 justify-center items-center">
                  {res.status === 'Pending' && (
                    <>
                      <button className="btn btn-accent btn-xs" onClick={() => onApprove(res.id)}>Approve</button>
                      <button className="btn btn-error btn-xs" onClick={() => onDecline(res.id)}>Decline</button>
                    </>
                  )}
                  <button className="btn btn-info btn-xs" onClick={() => onUpdate(res)}>Update</button>
                  <button className="btn btn-error btn-xs" onClick={() => onCancel(res.id)}>Cancel</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationManagerPC;
