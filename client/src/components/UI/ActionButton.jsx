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
  update: Pencil,
};

const typeStyles = {
  edit: 'bg-amber-600 hover:bg-amber-800 text-white',
  delete: 'bg-red-600 hover:bg-red-800 text-white',
  decline: 'bg-gray-600 hover:bg-gray-800 text-white',
  approve: 'bg-emerald-800 hover:bg-green-900 text-white',
  reply: 'bg-emerald-800 hover:bg-emerald-900 text-white',
  add: 'bg-amber-600 text-center hover:bg-amber-800 text-[var(--pc)]',
  view: 'bg-indigo-600 hover:bg-indigo-700 text-white',
  update:'bg-amber-600 text-center hover:bg-amber-800 text-[var(--pc)]',
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
  const baseStyle = `flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-semibold rounded-lg shadow 
  transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[var(--p)]`;
  const finalClass = `${baseStyle} ${typeStyles[type] || ''} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`;

  return (
    <button
      onClick={(onClick)}
      disabled={disabled}
      className={finalClass}
    >
      <Icon size={16} className={iconClass || 'text-inherit'} />
      {label && <span>{label}</span>}
    </button>
  );
};

export default ActionButton;
