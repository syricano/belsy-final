import React, { useState } from 'react';
import ActionButton from '@/components/UI/ActionButton';
import MenuManagerFormModal from '@/components/Admin/MenuManagerFormModal';

const MenuManagerMobile = ({ menu, handleEdit, handleDelete }) => {
  const [editingItem, setEditingItem] = useState(null);

  return (
    <div className="space-y-3">
      {menu.map((item) => (
        <div
          key={item.id}
          className="p-4 border border-[var(--border-color)] rounded bg-[var(--b1)] text-[var(--bc)] shadow text-sm"
        >
          <div className="font-semibold text-base">{item.name}</div>
          <div className="text-sm">${parseFloat(item.price).toFixed(2)}</div>
          <div className="text-sm italic">{item.Category?.name || item.categoryId}</div>

          {item.image && (
            <div className="mt-2">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-24 object-cover rounded border border-[var(--border-color)]"
                onError={(e) => (e.target.src = '/images/fallback.jpg')}
              />
            </div>
          )}

          <div className="flex gap-2 mt-2">
            <ActionButton type="edit" onClick={() => setEditingItem(item)} />
            <ActionButton type="delete" onClick={() => handleDelete(item.id)} />
          </div>
        </div>
      ))}

      {editingItem && (
        <MenuManagerFormModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSubmit={(updatedItem) => {
            handleEdit(updatedItem);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

export default MenuManagerMobile;
