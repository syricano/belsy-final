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
      className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium border rounded-lg 
        bg-[var(--bc)] text-[var(--b1)] border-[var(--border-color)]
        hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-[var(--p)]
        disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${className}`}
    >
      <Icon size={16} className={iconClass || 'text-[var(--b1)]'} />
      {label && <span>{label}</span>}
    </button>
  );
};

export default ActionButton;
