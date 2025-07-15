import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/context';
import { useLocation } from 'react-router';
import { asyncHandler } from '@/utils';

const Signin = () => {
  const [form, setForm] = useState({ identifier: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    asyncHandler(() => signin(form), 'Signin failed')
      .then(() => navigate(location.state?.next || '/profile'))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <div className="container mx-auto p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-black">
        Sign In
      </h2>
      {error && <p className="text-red-600 text-sm mb-3">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="input input-bordered w-full focus:ring-yellow-500 focus:border-yellow-500"
          name="identifier"
          placeholder="Email"
          type="email"
          onChange={handleChange}
        />
        <input
          className="input input-bordered w-full focus:ring-yellow-500 focus:border-yellow-500"
          name="password"
          placeholder="Password"
          type="password"
          onChange={handleChange}
        />
        <button className="btn btn-primary w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-black text-white hover:bg-yellow-500">
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Signin;
