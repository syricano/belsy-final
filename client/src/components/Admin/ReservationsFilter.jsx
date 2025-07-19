import React, { useState } from 'react';

const ReservationsFilter = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleClear = () => {
    const cleared = { name: '', email: '', phone: '', date: '' };
    setFilters(cleared);
    onSearch(cleared);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 w-full"
    >
      <input
        type="text"
        placeholder="Name"
        className="input input-sm input-bordered w-full min-w-0"
        value={filters.name}
        onChange={(e) => setFilters({ ...filters, name: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        className="input input-sm input-bordered w-full min-w-0"
        value={filters.email}
        onChange={(e) => setFilters({ ...filters, email: e.target.value })}
      />
      <input
        type="text"
        placeholder="Phone"
        className="input input-sm input-bordered w-full min-w-0"
        value={filters.phone}
        onChange={(e) => setFilters({ ...filters, phone: e.target.value })}
      />
      <input
        type="date"
        className="input input-sm input-bordered w-full min-w-0"
        value={filters.date}
        onChange={(e) => setFilters({ ...filters, date: e.target.value })}
      />
      <button className="btn btn-sm btn-primary w-full min-w-0" type="submit">
        Search
      </button>
      <button
        type="button"
        className="btn btn-sm btn-accent w-full min-w-0"
        onClick={handleClear}
      >
        Clear
      </button>
    </form>
  );
};

export default ReservationsFilter;
