import { NavLink } from 'react-router';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { useAuth, useCart, useLang } from '@/context';
import CartDrawer from '../Cart/CartDrawer';
import LanguageSwitcher from './LanguageSwitcher';

const Navbar = () => {
  const { user, signout } = useAuth();
  const { cart } = useCart();
  const { t } = useLang();
  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === 'Admin';
  const [cartOpen, setCartOpen] = useState(false);

  const handleLogout = () => signout();

  const renderAuthLinks = () => {
    if (isLoggedIn) {
      return (
        <>
          {isAdmin && (
            <NavLink to="/admin" className="nav-link">
              {t('nav.admin')}
            </NavLink>
          )}
          <NavLink to="/profile" className="nav-link">
            {t('nav.dashboard')}
          </NavLink>
          <button onClick={handleLogout} className="nav-link w-full text-left block">
            {t('nav.logout')}
          </button>
        </>
      );
    } else {
      return (
        <>
          <NavLink to="/signin" className="nav-link">
            {t('nav.signin')}
          </NavLink>
          <NavLink to="/signup" className="nav-link">
            {t('nav.signup')}
          </NavLink>
        </>
      );
    }
  };

  const cartButton = (
    <button
      className="btn btn-ghost relative text-[var(--nc)]"
      onClick={() => setCartOpen(true)}
      aria-label={t('nav.cart')}
    >
      <span role="img" aria-hidden="true">🛒</span>
      <span className="badge badge-sm bg-[var(--p)] text-[var(--pc)] absolute -top-2 -right-2">
        {cart.items?.length || 0}
      </span>
    </button>
  );

  return (
    <>
    <div className="navbar belsy-navbar bg-[var(--n)]/80 text-[var(--nc)] shadow-sm sticky top-0 z-50 backdrop-blur-md transition-colors duration-300">
      {/* Navbar Start */}
      <div>
        <NavLink to="/">
          <img
            src="/images/belsy-logo.jpg"
            alt="Belsy Logo"
            className="w-10 h-10 object-cover rounded-full mr-2 border border-[var(--bc)]"
          />
        </NavLink>
      </div>

      <nav className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <div className="menu menu-sm dropdown-content mt-3 z-[1] p-4 shadow bg-[var(--n)] text-[var(--nc)] rounded-box w-56 space-y-2">
            <NavLink to="/" className="nav-link">
              {t('nav.home')}
            </NavLink>
            <NavLink to="/menu" className="nav-link">
              {t('nav.menu')}
            </NavLink>
            <NavLink to="/about" className="nav-link">
              {t('nav.about')}
            </NavLink>
            <NavLink to="/contact" className="nav-link">
              {t('nav.contact')}
            </NavLink>
            {renderAuthLinks()}
          </div>
        </div>

        <NavLink
          to="/"
          className="btn btn-ghost normal-case text-4xl font-serif tracking-wider ml-2"
        >
          Belsy
        </NavLink>
      </nav>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li>
            <NavLink to="/" className="nav-link">
              {t('nav.home')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/menu" className="nav-link">
              {t('nav.menu')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className="nav-link">
              {t('nav.about')}
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className="nav-link">
              {t('nav.contact')}
            </NavLink>
          </li>
        </ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end gap-3 pr-4">
        <div className="hidden lg:flex items-center gap-4">
          {cartButton}
          <ThemeToggle />
          <LanguageSwitcher />
          {renderAuthLinks()}
        </div>
        <div className="lg:hidden flex items-center gap-2">
          {cartButton}
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </div>
    <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Navbar;
