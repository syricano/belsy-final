import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useAuth, useLang } from '@/context';
import { asyncHandler, errorHandler } from '@/utils';
import { toast } from 'react-hot-toast';

const Signin = () => {
  const cachedEmail = localStorage.getItem('cachedEmail') || '';
  const [form, setForm] = useState({ email: cachedEmail, password: '' });
  const [remember, setRemember] = useState(true);
  const [forgotEmail, setForgotEmail] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [forgotMsg, setForgotMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signin, forgotPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLang();


  const handleChange = e =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    asyncHandler(() => signin(form), t('auth.signin_error'))
      .then(() => {
        if (remember) localStorage.setItem('cachedEmail', form.email);
        toast.success(t('auth.signed_in_success'));
        navigate(location.state?.next || '/profile');
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  const handleForgotPassword = async () => {
    if (!forgotEmail) return setForgotMsg(t('auth.enter_email_reset'));
    setForgotMsg('');
    setLoading(true);

    asyncHandler(() => forgotPassword(forgotEmail), t('auth.reset_error'))
      .then(() => {
        toast.success(t('auth.reset_link_sent'));
        setForgotEmail('');
        setShowForgot(false);
      })
      .catch(err => setForgotMsg(err.message))
      .finally(() => setLoading(false));
  };

  const handleSocialLogin = () => {
    const isDev = window.location.hostname === 'localhost';
    const backend = isDev
      ? 'http://localhost:3000'
      : 'https://belsy-final.onrender.com'; 

    window.location.href = `${backend}/api/auth/google`;
  };

  return (
    <section className="main-section min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full p-8 rounded-xl shadow-xl bg-[var(--n)] text-[var(--nc)] border border-[var(--border-color)] animate-fade-in-up">
        <h2 className="text-3xl font-serif font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-black">
          {t('auth.signin')}
        </h2>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4" aria-live="polite">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[{ label: t('auth.email'), name: 'email', type: 'email' }, { label: t('auth.password'), name: 'password', type: 'password' }].map(({ label, name, type }) => (
            <div key={name} className="space-y-2">
              <label htmlFor={name} className="block text-sm font-medium opacity-90">
                {label}
              </label>
              <input
                type={type}
                name={name}
                id={name}
                value={form[name]}
                placeholder={label}
                onChange={handleChange}
                className="input input-bordered w-full rounded-md bg-[var(--b1)] text-[var(--bc)] placeholder-opacity-60"
              />
            </div>
          ))}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={remember}
              onChange={() => setRemember(!remember)}
              id="remember"
              className="checkbox checkbox-sm"
            />
            <label htmlFor="remember" className="text-sm">{t('auth.remember_email')}</label>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="loading loading-spinner text-white w-4 h-4" />
                {t('auth.signing_in')}
              </span>
            ) : t('auth.signin')}
          </button>

          <div className="text-sm text-right mt-1">
            <button
              type="button"
              onClick={() => setShowForgot(prev => !prev)}
              className="text-blue-500 hover:underline"
            >
              {t('auth.forgot_password')}
            </button>
          </div>
        </form>
            
        {/* 🔐 Google Sign-in */}
        <div className="mt-6 space-y-3 border-t border-[var(--border-color)] pt-4 text-sm text-center">
          <p className="opacity-70">{t('auth.or_signin_with')}</p>
          <button
            type="button"
            onClick={handleSocialLogin}
            className="btn btn-primary w-full"
          >
            <span className="flex items-center justify-center gap-2">
              <img src="/icons/google.svg" alt="Google" className="w-5 h-5 rounded-full" />
              {t('auth.signin_google')}
            </span>
          </button>
        </div>

        {showForgot && (
          <div className="mt-6 space-y-4 border-t pt-4 border-[var(--border-color)] animate-fade-in-up">
            <label className="block text-sm font-medium opacity-90">
              {t('auth.enter_email_reset')}
            </label>
            <input
              type="email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
              className="input input-bordered w-full bg-[var(--b1)] text-[var(--bc)]"
              placeholder={t('auth.your_email')}
            />
            <button
              onClick={handleForgotPassword}
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="loading loading-spinner text-white w-4 h-4" />
                  {t('auth.sending')}
                </span>
              ) : t('auth.send_reset_link')}
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
