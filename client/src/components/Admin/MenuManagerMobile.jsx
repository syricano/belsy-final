import React from 'react';

const MenuManagerMobile = ({ menu, handleEdit, handleDelete }) => {
  return (
    <div className="space-y-3">
      {menu.map((item) => (
        <div
          key={item.id}
          className="p-4 border rounded bg-base-100 shadow text-sm space-y-1"
        >
          <div className="font-semibold">{item.name}</div>
          <div className="text-sm text-gray-600">${parseFloat(item.price).toFixed(2)}</div>
          <div className="flex gap-2 mt-2">
            <button className="btn btn-xs btn-info" onClick={() => handleEdit(item)}>Edit</button>
            <button className="btn btn-xs btn-error" onClick={() => handleDelete(item.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuManagerMobile;
