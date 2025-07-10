import { useState } from 'react';
import { NavLink } from 'react-router'; // Ensure you are using 'react-router-dom' for navigation
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

  return (
    <nav className="navbar-section shadow-md sticky top-0 z-50 backdrop-blur-md bg-opacity-90 transition-all duration-300 ease-in-out w-full p-5">
      <div className="flex items-center justify-between">
        {/* Logo with padding-left */}
        <div className="flex items-center gap-3 h-20">
          <img src='../public/images/belsy-logo.jpg' alt="Belsy Logo" className="w-10 h-10 object-cover rounded-full"></img>
          <NavLink
            to="/"
            className="text-3xl py-5 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-500 to-gray-800 hover:brightness-150 transition-all duration-300"
          >
            Belsy Restaurant
          </NavLink>
          <ThemeToggle />
        </div>

        {/* Desktop Menu (Center-aligned) */}
        <div className="hidden md:flex items-center justify-center flex-grow gap-5 space-x-6">
          <NavLink
            to="/"
            className="btn btn-ghost btn-sm md:btn-md px-4 rounded-md transition duration-200 hover:bg-primary/10 hover:text-[var(--accent-color)] hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 md:text-lg"
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            className="btn btn-ghost btn-sm md:btn-md px-4 rounded-md transition duration-200 hover:bg-primary/10 hover:text-[var(--accent-color)] hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 md:text-lg"
          >
            Menu
          </NavLink>
          <NavLink
            to="/reservations"
            className="btn btn-ghost btn-sm md:btn-md px-4 rounded-md transition duration-200 hover:bg-primary/10 hover:text-[var(--accent-color)] hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 md:text-lg"
          >
            Reserve a Table
          </NavLink>
          <NavLink
            to="/about"
            className="btn btn-ghost btn-sm md:btn-md px-4 rounded-md transition duration-200 hover:bg-primary/10 hover:text-[var(--accent-color)] hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 md:text-lg"
          >
            About
          </NavLink>
        </div>

        {/* Auth Menu (Right-aligned) */}
        <div className="hidden md:flex items-center gap-5">
          {isLoggedIn ? (

            <>
              <NavLink
                to="/profile"
                className="btn btn-ghost btn-sm md:btn-md px-4 rounded-md transition duration-200 hover:bg-primary/10 hover:text-[var(--accent-color)] hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 md:text-lg">
                Profile
              </NavLink>
              
              <button
                onClick={handleLogout}
                className="btn btn-ghost btn-sm md:btn-md px-4 rounded-md transition duration-200 hover:bg-primary/10 hover:text-[var(--accent-color)] hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 md:text-lg">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/signin"
                className="btn btn-ghost btn-sm md:btn-md px-4 rounded-md transition duration-200 hover:bg-primary/10 hover:text-[var(--accent-color)] hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 md:text-lg">
                Signin
              </NavLink>
              <NavLink
                to="/signup"
                className="btn btn-ghost btn-sm md:btn-md px-4 rounded-md transition duration-200 hover:bg-primary/10 hover:text-[var(--accent-color)] hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 md:text-lg">
                Signup
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Burger Button */}
        <button
          className="md:hidden btn btn-ghost btn-square p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition hover:shadow-md"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-base-200 px-4 py-3 space-y-2 shadow-inner border-t border-base-300 transition-all duration-300 transform ease-in-out">
          <NavLink
            to="/"
            className="block btn btn-ghost w-full rounded-md hover:text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition"
            onClick={() => setIsOpen(false)}
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            className="block btn btn-ghost w-full rounded-md hover:text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition"
            onClick={() => setIsOpen(false)}
          >
            Menu
          </NavLink>
          <NavLink
            to="/reservations"
            className="block btn btn-ghost w-full rounded-md hover:text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition"
            onClick={() => setIsOpen(false)}
          >
            Reserve a Table
          </NavLink>
          <NavLink
            to="/about"
            className="block btn btn-ghost w-full rounded-md hover:text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition"
            onClick={() => setIsOpen(false)}
          >
            About
          </NavLink>

          {/* Auth Links in Mobile */}
          {isLoggedIn ? (
            <>
              <NavLink
                to="/profile"
                className="btn btn-ghost btn-sm md:btn-md px-4 rounded-md transition duration-200 hover:bg-primary/10 hover:text-[var(--accent-color)] hover:shadow-md hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 md:text-lg">
                Profile
              </NavLink>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="btn btn-ghost w-full rounded-md text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/signin"
                className="block btn btn-ghost w-full rounded-md hover:text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition"
                onClick={() => setIsOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/signup"
                className="block btn btn-ghost w-full rounded-md hover:text-primary hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1 transition"
                onClick={() => setIsOpen(false)}
              >
                Signup
              </NavLink>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
