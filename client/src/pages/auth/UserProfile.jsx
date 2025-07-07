import { useEffect, useState } from 'react';
import axios from 'axios';

const UserProfile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    axios.get('/api/auth/profile', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setUser(res.data);
    }).catch(err => {
      console.error(err);
    });
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-primary-700">My Profile</h2>
      {user ? (
        <div className="space-y-2">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      ) : (
        <p className="text-gray-500">Loading profile...</p>
      )}
    </div>
  );
};

export default UserProfile;
