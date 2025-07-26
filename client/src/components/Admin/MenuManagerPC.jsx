import React from 'react';
import ActionButton from '@/components/UI/ActionButton';

const MenuManagerPC = ({ menu, handleEdit, handleDelete }) => {
  return (
    <div className="overflow-x-auto border border-[var(--border-color)] bg-[var(--b1)] text-[var(--bc)] rounded-xl shadow">
      <table className="table w-full text-sm">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {menu.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>${parseFloat(item.price).toFixed(2)}</td>
              <td>{item.Category?.name || item.categoryId}</td>
              <td>
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded border border-[var(--border-color)]"
                    onError={(e) => (e.target.src = '/images/fallback.jpg')}
                  />
                )}
              </td>
              <td className="space-x-1">
                <ActionButton type="edit" onClick={() => handleEdit(item)} />
                <ActionButton type="delete" onClick={() => handleDelete(item.id)} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MenuManagerPC;
