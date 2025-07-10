import { useAuth } from '@/context';

const UserProfile = () => {
  const { user, loading } = useAuth();


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

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-black">
        My Profile
      </h2>
      <div className="space-y-4">
        <input
          className="input input-bordered w-full"
          value={user.firstName}
          disabled
          placeholder="First Name"
        />
        <input
          className="input input-bordered w-full"
          value={user.lastName}
          disabled
          placeholder="Last Name"
        />
        <input
          className="input input-bordered w-full"
          value={user.username}
          disabled
          placeholder="Username"
        />
        <input
          className="input input-bordered w-full"
          value={user.email}
          disabled
          placeholder="Email"
        />
        <input
          className="input input-bordered w-full"
          value={user.phone || ''}
          disabled
          placeholder="Phone"
        />
        <input
          className="input input-bordered w-full"
          value={user.role}
          disabled
          placeholder="Role"
        />
      </div>
    </div>
  );
};

export default UserProfile;
