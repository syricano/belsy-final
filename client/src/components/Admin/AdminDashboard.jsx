import React, { useState } from 'react';
import ReservationManager from './ReservationManager';
import TableManager from './TableManager';
import MenuManager from './MenuManager';
import DutyManager from './DutyManager';
import ContactManager from './ContactManager';

const sections = [
  { id: 'reservations', label: 'Reservations' },
  { id: 'tables', label: 'Tables' },
  { id: 'menu', label: 'Menu' },
  { id: 'duty', label: 'Working Hours' },
  { id: 'contact', label: 'Contact Info' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('reservations');

  const renderSection = () => {
    switch (activeTab) {
      case 'reservations': return <ReservationManager />;
      case 'tables': return <TableManager />;
      case 'menu': return <MenuManager  />;
      case 'duty': return <DutyManager />;
      case 'contact': return <ContactManager />; 
      default: return null;
    }
  };

  return (
    <section className="min-h-screen bg-[var(--main-bg-color)] text-[var(--text-color)] py-16 px-4">
      <div className="max-w-7xl mx-auto w-full space-y-12">
        {/* Title */}
        <div className="text-center">
          <h1 className="text-4xl font-serif font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-black">
            Admin Dashboard
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4">
          {sections.map((section) => (
            <button
              key={section.id}
              className={`tab tab-lg rounded-lg font-semibold transition-all px-6 py-2 shadow 
                ${activeTab === section.id ? 'bg-amber-600 text-white' : 'bg-white text-gray-700 hover:bg-amber-100'}`}
              onClick={() => setActiveTab(section.id)}
            >
              {section.label}
            </button>
          ))}
        </div>

        {/* Section Content */}
        <div className="bg-white dark:bg-neutral rounded-2xl shadow-xl p-8">
          {renderSection()}
        </div>
      </div>
    </section>
  );
};

export default AdminDashboard;
