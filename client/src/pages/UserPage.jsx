import { useState } from 'react';
import { useAuth } from '@/context';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { asyncHandler } from '@/utils';
import { errorHandler } from '@/utils';
import FetchUserReservations from '@/components/Reservations/FetchUserReservations';

const UserPage = () => {
  const { user, loading, updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();

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
      <div className="container mx-auto p-6 max-w-md text-center text-gray-500">
        Loading profile...
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

  const handleAccountCloser = async () => {
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

  return (
    <section className="main-section min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-12">
        
        {/* Profile Info */}
        <div className="p-8 rounded-2xl border border-[var(--border-color)] bg-[var(--n)] text-[var(--nc)] shadow-xl space-y-6">
          <h2 className="text-xl font-serif font-semibold text-center mb-4">
            My Profile
          </h2>

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
            <button
              onClick={handleUpdate}
              disabled={saving}
              className="flex-1 btn btn-primary"
            >
              {isEditing ? (saving ? 'Saving...' : 'Save') : 'Update'}
            </button>

            <button
              onClick={handleAccountCloser}
              className="flex-1 py-2 px-4 rounded-lg bg-red-600 hover:bg-red-500 text-white font-semibold shadow-md transition-all"
            >
              Delete
            </button>
          </div>

          {showDeleteInput && (
            <div className="mt-6 space-y-3 animate-fade-in">
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
              <button
                onClick={handleFinalDelete}
                className="w-full py-2 px-4 rounded-lg bg-red-700 hover:bg-red-600 text-white font-semibold shadow"
              >
                Confirm Delete
              </button>
            </div>
          )}
        </div>


        {/* Reservation History */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--b1)] text-[var(--bc)] shadow-lg p-6">
          <h3 className="text-2xl font-bold mb-4 text-[var(--bc)] text-center">My Reservations</h3>
          <FetchUserReservations />
        </div>
      </div>
    </section>
  );
};

export default UserPage;
