import { useState } from 'react';
import { useAuth } from '@/context';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { asyncHandler } from '@/utils';
import { errorHandler } from '@/utils';
import FetchUserReservations from '@/components/Reservations/FetchUserReservations';
import UserFeedbackList from '@/components/Feedback/UserFeedbackList';
import ActionButton from '@/components/UI/ActionButton';

const UserPage = () => {
  const { user, loading, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('reservations');

  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  const [password, setPassword] = useState('');
  const [showDeleteInput, setShowDeleteInput] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-16">
        <span className="loading loading-spinner text-[var(--bc)] w-10 h-10" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-md text-center text-red-500">
        User not found. Please sign in again.
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = () => {
    if (!isEditing) return setIsEditing(true);

    setSaving(true);
    asyncHandler(() => updateProfile(formData), 'Update failed')
      .then(() => {
        toast.success('Profile updated successfully');
        setIsEditing(false);
      })
      .catch(errorHandler)
      .finally(() => setSaving(false));
  };

  const handleAccountCloser = () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action is irreversible.');
    if (confirmed) setShowDeleteInput(true);
  };

  const handleFinalDelete = () => {
    if (!password) {
      alert('Please enter your password to confirm account deletion.');
      return;
    }

    asyncHandler(() => deleteAccount({ password }), 'Delete failed')
      .then(() => {
        toast.success('Account deleted successfully');
        navigate('/');
      })
      .catch(errorHandler);
  };

  const renderSection = () => {
    switch (activeTab) {
      case 'reservations': return <FetchUserReservations />;
      case 'feedback': return <UserFeedbackList />;
      case 'profile':
        return (
          <div className="space-y-6">
            <form className="space-y-5">
              {['firstName', 'lastName', 'email', 'phone'].map((field) => (
                <div key={field} className="space-y-2">
                  <label htmlFor={field} className="block text-sm font-medium opacity-90 capitalize">
                    {field.replace('Name', ' Name')}
                  </label>
                  <input
                    type={field === 'email' ? 'email' : 'text'}
                    name={field}
                    id={field}
                    value={formData[field]}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className="w-full input input-bordered rounded-lg bg-[var(--b1)] text-[var(--bc)] placeholder-opacity-60"
                    placeholder={field.replace('Name', ' Name')}
                  />
                </div>
              ))}
            </form>

            <div className="flex justify-between gap-4 pt-2">
              <ActionButton
                type={isEditing ? 'edit' : 'add'}
                label={isEditing ? (saving ? 'Saving...' : 'Save') : 'Update'}
                onClick={handleUpdate}
                className="flex-1"
                disabled={saving}
              />
              <ActionButton
                type="delete"
                label="Delete"
                onClick={handleAccountCloser}
                className="flex-1"
              />
            </div>

            {showDeleteInput && (
              <div className="mt-6 space-y-3 animate-fade-in-up">
                <label className="block text-sm font-medium opacity-90">
                  Confirm Deletion (Password)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input input-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
                  placeholder="Enter your password"
                />
                <ActionButton
                  type="delete"
                  label="Confirm Delete"
                  onClick={handleFinalDelete}
                  className="w-full"
                />
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  const sections = [
    { id: 'reservations', label: 'My Reservations' },
    { id: 'feedback', label: 'My Feedback' },
    { id: 'profile', label: 'My Profile' },
  ];

  return (
    <section className="main-section min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="text-3xl font-serif font-semibold text-center text-[var(--bc)] mb-6">
          User Dashboard
        </h1>

        <div className="flex flex-wrap justify-center gap-4">
          {sections.map((section) => (
            <button
              key={section.id}
              aria-label={`Go to ${section.label}`}
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

        <div className="bg-[var(--n)] text-[var(--nc)] rounded-2xl shadow-xl p-8 border border-[var(--border-color)] animate-fade-in-up">
          {renderSection()}
        </div>
      </div>
    </section>
  );
};

export default UserPage;
