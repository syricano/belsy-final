import React from 'react';
import ActionButton from '@/components/UI/ActionButton';

const ReservationManagerPC = ({
  reservations,
  onApprove,
  onDecline,
  onUpdate,
  onCancel,
  renderNote,
  filterActions,
  getStatusBadgeClasses,
}) => {
  return (
    <div className="w-full overflow-x-auto border border-[var(--border-color)] bg-[var(--b1)] text-[var(--bc)] rounded-xl shadow">
      <table className="min-w-[900px] table-auto w-full text-sm bg-[var(--b1)] text-[var(--bc)] 
  [&>thead>tr>th]:px-4 [&>thead>tr>th]:py-3 
  [&>tbody>tr>td]:px-4 [&>tbody>tr>td]:py-2">
        <thead className="text-[var(--bc)] font-semibold uppercase text-xs tracking-wide">
          <tr className="text-[var(--bc)] border-b align-middle">
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
          {reservations.map(res => {
            const actions = filterActions(res);
            return (
              <tr
                key={res.id}
                className={`border-b ${['Declined', 'Cancelled'].includes(res.status) ? 'opacity-50' : ''} align-middle`}
              >
                <td>{new Date(res.reservationTime).toLocaleString()}</td>
                <td>{res.guests}</td>
                <td>{res.Table?.number || '—'}</td>
                <td className="font-bold">
                  <span className={`badge text-xs ${getStatusBadgeClasses(res.status)}`}>
                    {res.status}
                  </span>
                </td>
                <td>{res.guestName || res.User?.firstName || '—'}</td>
                <td className="text-xs leading-tight">
                  <div>{res.guestEmail || res.User?.email || '—'}</div>
                  <div>{res.guestPhone || res.User?.phone || '—'}</div>
                </td>
                <td>{renderNote(res)}</td>
                <td>
                  <div className="flex flex-wrap gap-1 justify-center items-center">
                    {actions.showApprove && <ActionButton type="approve" onClick={() => onApprove(res.id)} />}
                    {actions.showDecline && <ActionButton type="decline" onClick={() => onDecline(res.id)} />}
                    {actions.showEdit && <ActionButton type="edit" onClick={() => onUpdate(res)} />}
                    {actions.showCancel && <ActionButton type="delete" onClick={() => onCancel(res.id)} />}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ReservationManagerPC;