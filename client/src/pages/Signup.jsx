import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '@/context';
import { asyncHandler, errorHandler } from '@/utils';
import { toast } from 'react-hot-toast';

const Signup = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    const { confirmPassword, ...formData } = form;

    try {
      await signup(formData);
      toast.success('Account created');
      navigate('/');
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.message ||
        'Signup failed';
      toast.error(msg);
      setError(msg); // Optional: display under form too
    } finally {
      setLoading(false);
    }
  };


  return (
    <section className="main-section min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 rounded-xl shadow-xl bg-[var(--n)] text-[var(--nc)] border border-[var(--border-color)]">
        <h2 className="text-3xl font-serif font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-black">
          Create Account
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: 'First Name', name: 'firstName' },
            { label: 'Last Name', name: 'lastName' },
            { label: 'Phone', name: 'phone', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Password', name: 'password', type: 'password' },
            { label: 'Confirm Password', name: 'confirmPassword', type: 'password' },
          ].map(({ label, name, type = 'text' }) => (
            <div key={name} className="space-y-2">
              <label htmlFor={name} className="block text-sm font-medium opacity-90">
                {label}
              </label>
              <input
                type={type}
                name={name}
                id={name}
                placeholder={label}
                onChange={handleChange}
                className="input input-bordered w-full rounded-md bg-[var(--b1)] text-[var(--bc)] placeholder-opacity-60"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-gradient-to-r from-yellow-400 via-orange-500 to-black text-white font-semibold shadow-md hover:brightness-110 transition-all"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loading loading-spinner text-white w-4 h-4" />
                Creating...
              </span>
            ) : 'Sign Up'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Signup;
