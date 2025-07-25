import React from 'react';
import {
  Pencil,
  Trash,
  Check,
  X,
  Reply,
  Plus,
  Eye,
} from 'lucide-react';

const icons = {
  edit: Pencil,
  delete: Trash,
  approve: Check,
  decline: X,
  reply: Reply,
  add: Plus,
  view: Eye,
};

const ActionButton = ({
  type = 'edit',
  onClick,
  label = '',
  className = '',
  disabled = false,
  iconClass = '',
}) => {
  const Icon = icons[type] || Pencil;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1 px-3 py-1 text-xs font-medium border rounded transition
        bg-[var(--bc)] text-[var(--b1)] border-[var(--border-color)]
        hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      <Icon size={14} className={iconClass || 'text-[var(--b1)]'} />
      {label && <span>{label}</span>}
    </button>
  );
};

export default ActionButton;
