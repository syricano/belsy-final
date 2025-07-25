import { useState } from 'react';
import { NavLink } from 'react-router';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/context';

const Navbar = () => {
  const { user, signout } = useAuth();
  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === 'Admin';

  const handleLogout = () => signout();

  return (
    <div className="navbar belsy-navbar bg-[var(--n)]/80 text-[var(--nc)] shadow-sm sticky top-0 z-50 backdrop-blur-md transition-colors duration-300">
      {/* Navbar Start */}
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
            <li><NavLink to="/" className="nav-link">Home</NavLink></li>
            <li><NavLink to="/menu" className="nav-link">Menu</NavLink></li>
            <li><NavLink to="/about" className="nav-link">About</NavLink></li>
            {isLoggedIn && (
              <>
                {isAdmin && <li><NavLink to="/admin" className="nav-link">Admin</NavLink></li>}
                <li><NavLink to="/profile" className="nav-link">Dashboard</NavLink></li>
                <li>
                  <button onClick={handleLogout} className="nav-link">
                    Logout
                  </button>
                </li>
              </>
            )}
            {!isLoggedIn && (
              <>
                <li><NavLink to="/signin" className="nav-link">Signin</NavLink></li>
                <li><NavLink to="/signup" className="nav-link">Signup</NavLink></li>
              </>
            )}
          </ul>
        </div>

        <NavLink to="/" className="btn btn-ghost normal-case text-4xl font-serif tracking-wider ml-2">
          Belsy
        </NavLink>
      </div>

      {/* Navbar Center */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li><NavLink to="/" className="nav-link">Home</NavLink></li>
          <li><NavLink to="/menu" className="nav-link">Menu</NavLink></li>
          <li><NavLink to="/about" className="nav-link">About</NavLink></li>
        </ul>
      </div>

      {/* Navbar End */}
      <div className="navbar-end gap-3 pr-4">
        <ThemeToggle />
        <div className="hidden lg:flex items-center gap-6">
          {isLoggedIn ? (
            <>
              {isAdmin && <NavLink to="/admin" className="nav-link">Admin</NavLink>}
              <NavLink to="/profile" className="nav-link">Dashboard</NavLink>
              <NavLink onClick={handleLogout} className="nav-link">Logout</NavLink>
            </>
          ) : (
            <>
              <NavLink to="/signin" className="nav-link">Signin</NavLink>
              <NavLink to="/signup" className="nav-link">Signup</NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
