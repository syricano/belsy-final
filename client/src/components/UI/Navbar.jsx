import { useState } from 'react';
import { NavLink } from 'react-router';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/context';

const Navbar = () => {
  const { user, signout } = useAuth();
  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === 'Admin';

  const handleLogout = () => signout();

  const linkClass = ({ isActive }) =>
    `px-4 py-2 font-medium transition text-xl ${
      isActive
        ? 'underline text-[var(--p)]'
        : 'hover:text-[var(--accent-color)] hover:underline'
    }`;

  return (
    <div className="navbar belsy-navbar bg-[var(--n)] text-[var(--nc)] shadow-sm sticky top-0 z-50 transition-colors duration-300">

      {/* Navbar Start (Logo & Mobile) */}
      <div className="navbar-start">
        <img
          src="/images/belsy-logo.jpg"
          alt="Belsy Logo"
          className="w-12 h-12 object-cover rounded-full mr-2 border border-[var(--bc)]"
        />

        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-4 shadow bg-[var(--n)] text-[var(--nc)] rounded-box w-56 space-y-2">
            <li><NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink></li>
            <li><NavLink to="/menu" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Menu</NavLink></li>
            <li><NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About</NavLink></li>
            {isLoggedIn && (
              <>
                {isAdmin && <li><NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Admin</NavLink></li>}
                <li><NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Profile</NavLink></li>
                <li>
                  <button onClick={handleLogout} className={linkClass({ isActive: false })}>
                    Logout
                  </button>
                </li>
              </>
            )}
            {!isLoggedIn && (
              <>
                <li><NavLink to="/signin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Signin</NavLink></li>
                <li><NavLink to="/signup" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Signup</NavLink></li>
              </>
            )}
          </ul>
        </div>

        <NavLink to="/" className="btn btn-ghost normal-case text-4xl font-serif tracking-wider ml-2">
          Belsy
        </NavLink>
      </div>

      {/* Navbar Center (Desktop Links) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li><NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Home</NavLink></li>
          <li><NavLink to="/menu" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Menu</NavLink></li>
          <li><NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>About</NavLink></li>
        </ul>
      </div>

      {/* Navbar End (Theme + Auth) */}
      <div className="navbar-end gap-3 pr-4">
        <ThemeToggle />
        <div className="hidden lg:flex items-center gap-2">
          {isLoggedIn ? (
            <>
              {isAdmin && <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Admin</NavLink>}
              <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Profile</NavLink>
              <NavLink onClick={handleLogout} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Logout</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/signin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Signin</NavLink>
              <NavLink to="/signup" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>Signup</NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
