// src/components/UI/ActionButton.jsx
import React from 'react';
import {
  Pencil, Trash, Check, X, Reply, Plus, Eye
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

const colors = {
  edit: 'btn-info',
  delete: 'btn-error',
  approve: 'btn-success',
  decline: 'btn-warning',
  reply: 'btn-secondary',
  add: 'btn-primary',
  view: 'btn-accent',
};

const ActionButton = ({ type, onClick, size = 'xs', label = '', className = '', disabled = false }) => {
  const Icon = icons[type] || Pencil;
  const color = colors[type] || 'btn-outline';

  return (
    <button
      className={`btn btn-${size} ${color} flex items-center gap-1 ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon size={14} />
      {label && <span>{label}</span>}
    </button>
  );
};

export default ActionButton;
