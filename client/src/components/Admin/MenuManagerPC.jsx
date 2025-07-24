import React from 'react';

const MenuManagerPC = ({ menu, handleEdit, handleDelete }) => {
  return (
    <div className="overflow-x-auto border border-[var(--border-color)] bg-[var(--b1)] text-[var(--bc)] rounded-xl shadow">
      <table className="table table-zebra w-full text-sm">
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
                    className="w-16 h-16 object-cover rounded"
                    onError={(e) => (e.target.src = '/images/fallback.jpg')}
                  />
                )}
              </td>
              <td className="space-x-1">
                <button className="btn btn-xs btn-info" onClick={() => handleEdit(item)}>Edit</button>
                <button className="btn btn-xs btn-error" onClick={() => handleDelete(item.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MenuManagerPC;
