import { useState } from 'react';
import { useAuth } from '@/context';
import { useNavigate, useLocation } from 'react-router';
import { toast  } from 'react-hot-toast';


const UserProfile = () => {
  const { user, loading, updateProfile, deleteAccount, signout, setCheckSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
      <div className="container mx-auto p-6 max-w-md">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 max-w-md">
        <p className="text-red-500">User not found. Please sign in again.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    try {
      setSaving(true);
      await updateProfile(formData);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAccountCloser = async () => {
    const confirmed = window.confirm('Are you sure you want to delete your account? This action is irreversible.');
    if (confirmed) {
      setShowDeleteInput(true); // Reveal password input
    }
    
  };

  const handleFinalDelete = async () => {
    if (!password) {
      alert('Please enter your password to confirm account deletion.');
      return;
    }

    try {
      await deleteAccount({ password });
      toast.success('Account deleted successfully');
      navigate('/');
    } catch (err) {
      toast.error('Failed to delete account');
    }
  };

  return (
    <section className="min-h-screen flex justify-center items-center bg-[var(--bg-color)] text-[var(--text-color)] px-4">
      <div className="card shadow-xl bg-white dark:bg-neutral-900 p-8 w-full max-w-xl rounded-2xl border border-[var(--border-color)]">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-black">
          My Profile
        </h2>

        <div className="grid gap-4">
          <input
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={!isEditing}
            className="input input-bordered w-full"
            placeholder="First Name"
          />
          <input
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={!isEditing}
            className="input input-bordered w-full"
            placeholder="Last Name"
          />
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            className="input input-bordered w-full"
            placeholder="Email"
          />
          <input
            name="phone"
            value={formData.phone || ''}
            onChange={handleChange}
            disabled={!isEditing}
            className="input input-bordered w-full"
            placeholder="Phone"
          />
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="flex-1 py-2 px-4 rounded-lg bg-amber-700 hover:bg-amber-600 text-white font-semibold shadow-md transition-all"
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
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input input-bordered w-full"
              placeholder="Confirm your password"
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
    </section>
  );
};

export default UserProfile;
