import { useState } from 'react';
import { NavLink } from 'react-router';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/context';

const Navbar = () => {
  const { user, signout } = useAuth();
  const isLoggedIn = Boolean(user);
  const isAdmin = user?.role === 'Admin';

  const handleLogout = () => signout();

  const dropdownLinkClass = 'text-sm py-1 px-2 hover:bg-[#4A9782]/10 rounded';
  const linkClass = 'px-4 py-2 font-medium transition hover:text-[var(--accent-color)] hover:underline';


  return (
    <div className="navbar belsy-navbar bg-[var(--bg-page)] text-[var(--text-color)] shadow-sm sticky top-0 z-50 transition-colors duration-300">

      {/* Navbar Start (Logo & Mobile) */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
            </svg>
          </div>
          <ul className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-[var(--bg-page)] text-[var(--text-color)] rounded-box w-52 transition-colors">
            <li><NavLink to="/">Home</NavLink></li>
            <li><NavLink to="/menu">Menu</NavLink></li>
            <li><NavLink to="/about">About</NavLink></li>
            {isLoggedIn && (
              <>
                {isAdmin && <li><NavLink to="/admin">Admin</NavLink></li>}
                <li><NavLink to="/profile">Profile</NavLink></li>
                <li><button onClick={handleLogout}>Logout</button></li>
              </>
            )}
            {!isLoggedIn && (
              <>
                <li><NavLink to="/signin">Signin</NavLink></li>
                <li><NavLink to="/signup">Signup</NavLink></li>
              </>
            )}
          </ul>
        </div>
        <NavLink to="/" className="btn btn-ghost normal-case text-xl font-serif tracking-wider">Belsy</NavLink>
      </div>

      {/* Navbar Center (Desktop Links) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">
          <li><NavLink to="/" className={linkClass}>Home</NavLink></li>
          <li><NavLink to="/menu" className={linkClass}>Menu</NavLink></li>
          <li><NavLink to="/about" className={linkClass}>About</NavLink></li>
        </ul>
      </div>

      {/* Navbar End (Theme + Auth) */}
      <div className="navbar-end gap-3 pr-4">
        <ThemeToggle />
        <div className="hidden lg:flex items-center gap-2 text-sm">
          {isLoggedIn ? (
            <>
              {isAdmin && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
              <NavLink to="/profile" className={linkClass}>Profile</NavLink>
              <button onClick={handleLogout} className={linkClass}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/signin" className={linkClass}>Signin</NavLink>
              <NavLink to="/signup" className={linkClass}>Signup</NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
