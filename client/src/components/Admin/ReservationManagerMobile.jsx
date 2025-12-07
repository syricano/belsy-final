import React from 'react';
import ActionButton from '@/components/UI/ActionButton';
import { useLang } from '@/context';

const ReservationManagerMobile = ({
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
    <div className="space-y-4 bg-[var(--b1)] text-[var(--bc)]">
      {reservations.map(res => {
        const actions = filterActions(res);
        return (
          <div
            key={res.id}
            className="p-4 border border-[var(--border-color)] rounded-md bg-[var(--b1)] text-[var(--bc)] shadow-sm text-sm"
          >
            <div className="font-semibold">
              {new Date(res.reservationTime).toLocaleString()}
            </div>

            <div className="mt-1">
              <span className="font-medium">{t('admin.reservations.status')}: </span>
              <span className={`badge ${getStatusBadgeClasses(res.status)}`}>
                {t(`admin.reservations.status_label.${(res.status || '').toLowerCase()}`) || res.status}
              </span>
            </div>

            <div className="mt-1">
              <span className="font-medium">{t('admin.reservations.note')}: </span>{renderNote(res)}
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              {actions.showApprove && <ActionButton type="approve" onClick={() => onApprove(res.id)} />}
              {actions.showDecline && <ActionButton type="decline" onClick={() => onDecline(res.id)} />}
              {actions.showEdit && <ActionButton type="edit" onClick={() => onUpdate(res)} />}
              {actions.showCancel && <ActionButton type="delete" onClick={() => onCancel(res.id)} />}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ReservationManagerMobile;
