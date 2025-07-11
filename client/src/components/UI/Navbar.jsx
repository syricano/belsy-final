import { useState } from 'react';
import { NavLink } from 'react-router'; 
import ThemeToggle from './ThemeToggle';
import { useAuth } from '@/context';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, signout } = useAuth();
  const isLoggedIn = Boolean(user);

  const handleLogout = () => {
    signout();
    setIsOpen(false);
  };

  const linkClass =
    'btn btn-ghost text-[var(--navbar-text-color)] btn-sm md:btn-md px-4 rounded-md transition duration-200 hover:bg-primary/10 hover:text-[var(--accent-color)] hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 md:text-lg';

  const mobileLinkClass =
    'block btn btn-ghost w-full rounded-md text-[var(--navbar-text-color)] hover:text-[var(--accent-color)] hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition';

  return (
    <nav className="navbar-section shadow-md sticky top-0 z-50 backdrop-blur-md bg-opacity-90 transition-all duration-300 ease-in-out">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo + Toggle */}
        <div className="flex items-center gap-3 h-20">
          <img src="../public/images/belsy-logo.jpg" alt="Belsy Logo" className="w-10 h-10 object-cover rounded-full" />
          <NavLink
            to="/"
            className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-gray-800 hover:brightness-150 transition-all"
          >
            Belsy
          </NavLink>
          <ThemeToggle />
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center justify-center flex-grow gap-4">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/menu" className={linkClass}>Menu</NavLink>
          <NavLink to="/reservations" className={linkClass}>Reserve</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-4">
          {isLoggedIn ? (
            <>
              <NavLink to="/profile" className={linkClass}>Profile</NavLink>
              <button onClick={handleLogout} className={`${linkClass} font-semibold`}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/signin" className={linkClass}>Signin</NavLink>
              <NavLink to="/signup" className={linkClass}>Signup</NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[var(--navbar-text-color)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-base-100 px-4 py-3 space-y-2 shadow-inner border-t border-base-300">
          <NavLink to="/" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Home</NavLink>
          <NavLink to="/menu" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Menu</NavLink>
          <NavLink to="/reservations" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Reserve</NavLink>
          <NavLink to="/about" className={mobileLinkClass} onClick={() => setIsOpen(false)}>About</NavLink>

          {isLoggedIn ? (
            <>
              <NavLink to="/profile" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Profile</NavLink>
              <button onClick={() => { handleLogout(); setIsOpen(false); }} className={`${mobileLinkClass} font-semibold`}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/signin" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Signin</NavLink>
              <NavLink to="/signup" className={mobileLinkClass} onClick={() => setIsOpen(false)}>Signup</NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
