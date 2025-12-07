import React from 'react';
import ActionButton from '@/components/UI/ActionButton';
import { useLang } from '@/context';

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
  const { t } = useLang();
  return (
    <div className="w-full overflow-x-auto border border-[var(--border-color)] bg-[var(--b1)] text-[var(--bc)] rounded-xl shadow">
      <table className="min-w-[900px] table-auto w-full text-sm bg-[var(--b1)] text-[var(--bc)] 
  [&>thead>tr>th]:px-4 [&>thead>tr>th]:py-3 
  [&>tbody>tr>td]:px-4 [&>tbody>tr>td]:py-2">
        <thead className="text-[var(--bc)] font-semibold uppercase text-xs tracking-wide">
          <tr className="text-[var(--bc)] border-b align-middle">
            <th>{t('admin.reservations.date')}</th>
            <th>{t('admin.reservations.guests')}</th>
            <th>{t('admin.reservations.table')}</th>
            <th>{t('admin.reservations.status')}</th>
            <th>{t('admin.reservations.name')}</th>
            <th>{t('admin.reservations.contact')}</th>
            <th>{t('admin.reservations.note')}</th>
            <th>{t('common.edit')}</th>
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
                    {t(`admin.reservations.status_label.${(res.status || '').toLowerCase()}`) || res.status}
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
