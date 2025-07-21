import React, { useState } from 'react';
import ReservationManager from './ReservationManager';
import TableManager from './TableManager';
import MenuManager from './MenuManager';
import DutyManager from './DutyManager';
import ContactManager from './ContactManager';
import FeedbackManager from './FeedbackManager';

const sections = [
  { id: 'reservations', label: 'Reservations' },
  { id: 'tables', label: 'Tables' },
  { id: 'menu', label: 'Menu' },
  { id: 'duty', label: 'Working Hours' },
  { id: 'contact', label: 'Contact Info' },
  { id: 'feedback', label: 'Feedback' },
];

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('reservations');

  const renderSection = () => {
    switch (activeTab) {
      case 'reservations': return <ReservationManager />;
      case 'tables': return <TableManager />;
      case 'menu': return <MenuManager />;
      case 'duty': return <DutyManager />;
      case 'contact': return <ContactManager />;
      case 'feedback': return <FeedbackManager />;
      default: return null;
    }
  };

  return (
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
            className={`rounded-full px-6 py-2 text-sm font-semibold shadow-md transition-all duration-300 border
              ${activeTab === section.id
                ? 'bg-[var(--p)] text-white border-[var(--p)]'
                : 'bg-[var(--b1)] text-[var(--bc)] hover:bg-[var(--accent-color)] hover:text-white'}`}
            onClick={() => setActiveTab(section.id)}
          >
            {section.label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      <div className="bg-[var(--n)] text-[var(--nc)] rounded-2xl shadow-xl p-8 border border-[var(--border-color)]">
        {renderSection()}
      </div>
    </div>
  );
};

export default AdminDashboard;
