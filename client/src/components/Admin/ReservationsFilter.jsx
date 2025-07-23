import React, { useState } from 'react';

const ReservationsFilter = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
  });

  const handleChange = (field, value) => {
    const updated = { ...filters, [field]: value };
    setFilters(updated);
    onSearch(updated);
  };

  const handleClear = () => {
    const cleared = { name: '', email: '', phone: '', date: '' };
    setFilters(cleared);
    onSearch(cleared);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full">
      <input
        type="text"
        placeholder="Name"
        className="input input-sm input-bordered w-full min-w-0"
        value={filters.name}
        onChange={(e) => handleChange('name', e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        className="input input-sm input-bordered w-full min-w-0"
        value={filters.email}
        onChange={(e) => handleChange('email', e.target.value)}
      />
      <input
        type="text"
        placeholder="Phone"
        className="input input-sm input-bordered w-full min-w-0"
        value={filters.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
      />
      <input
        type="date"
        className="input input-sm input-bordered w-full min-w-0"
        value={filters.date}
        onChange={(e) => handleChange('date', e.target.value)}
      />
      <button
        type="button"
        className="btn btn-sm btn-accent w-full min-w-0"
        onClick={handleClear}
      >
        Clear
      </button>
    </div>
  );
};

export default ReservationsFilter;
