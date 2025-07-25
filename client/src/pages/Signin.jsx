import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth } from '@/context';
import { asyncHandler, errorHandler } from '@/utils';
import { toast } from 'react-hot-toast';

const Signin = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signin, forgotPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    asyncHandler(() => signin(form), 'Signin failed')
      .then(() => {
        toast.success('Signed in successfully');
        navigate(location.state?.next || '/profile');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) return setForgotMsg('Please enter your email');
    setForgotMsg('');
    setLoading(true);

    asyncHandler(() => forgotPassword(forgotEmail), 'Reset failed')
      .then(() => {
        toast.success('Reset link sent to your email');
        setForgotEmail('');
        setShowForgot(false);
      })
      .catch(err => setForgotMsg(err.message))
      .finally(() => setLoading(false));
  };

  return (
    <section className="main-section min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 rounded-xl shadow-xl bg-[var(--n)] text-[var(--nc)] border border-[var(--border-color)] animate-fade-in-up">
        <h2 className="text-3xl font-serif font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-black">
          Sign In
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4" aria-live="polite">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[{ label: 'Email', name: 'email', type: 'email' }, { label: 'Password', name: 'password', type: 'password' }].map(({ label, name, type }) => (
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
                Signing in...
              </span>
            ) : 'Sign In'}
          </button>

          <div className="text-sm text-right mt-1">
            <button
              type="button"
              onClick={() => setShowForgot(prev => !prev)}
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          </div>
        </form>

        {showForgot && (
          <div className="mt-6 space-y-4 border-t pt-4 border-[var(--border-color)] animate-fade-in-up">
            <label className="block text-sm font-medium opacity-90">
              Enter your email to reset password
            </label>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="input input-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
              placeholder="Your email"
            />
            <button
              onClick={handleForgotPassword}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-yellow-400 via-orange-500 to-black text-white font-semibold shadow-md hover:brightness-110 transition-all"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner text-white w-4 h-4" />
                  Sending...
                </span>
              ) : 'Send Reset Link'}
            </button>
            {forgotMsg && (
              <p className="text-sm text-center mt-2 text-red-500" aria-live="polite">{forgotMsg}</p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Signin;
