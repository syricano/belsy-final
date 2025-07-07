import { useState } from 'react';
import { NavLink } from 'react-router';
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="navbar bg-base-100 shadow-md sticky top-0 z-50 backdrop-blur-md bg-opacity-90 transition-colors duration-300">
      {/* Main Navbar */}
      <div className="container mx-auto flex justify-between items-center p-4">
        {/* Logo */}
        <div className="flex items-center gap-5">
          <NavLink to="/" className="navbar__logo text-2xl font-semibold text-primary-700 hover:text-accent-color transition duration-300">
            Belsy Restaurant
          </NavLink>
          <ThemeToggle />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4">
          <NavLink to="/" className="navbar__link text-primary-700 hover:text-accent-color transition duration-300">Home</NavLink>
          <NavLink to="/menu" className="navbar__link text-primary-700 hover:text-accent-color transition duration-300">Menu</NavLink>
          <NavLink to="/reservations" className="navbar__link text-primary-700 hover:text-accent-color transition duration-300">Reserve a Table</NavLink>
          <NavLink to="/about" className="navbar__link text-primary-700 hover:text-accent-color transition duration-300">About</NavLink>
        </div>

        {/* Mobile Burger Button */}
        <button
          className="md:hidden flex flex-col justify-center items-center space-y-2 p-3"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span
            className={`w-8 h-1 bg-primary-700 rounded-lg transform transition duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}
          ></span>
          <span
            className={`w-8 h-1 bg-primary-700 rounded-lg transition duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}
          ></span>
          <span
            className={`w-8 h-1 bg-primary-700 rounded-lg transform transition duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}
          ></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden p-4 space-y-4 transition-transform duration-300 ease-in-out transform translate-y-0">
          <NavLink
            to="/"
            onClick={() => setIsOpen(false)}
            className="navbar__mobile-link block text-primary-700 hover:text-accent-color transition duration-300"
          >
            Home
          </NavLink>
          <NavLink
            to="/menu"
            onClick={() => setIsOpen(false)}
            className="navbar__mobile-link block text-primary-700 hover:text-accent-color transition duration-300"
          >
            Menu
          </NavLink>
          <NavLink
            to="/reservations"
            onClick={() => setIsOpen(false)}
            className="navbar__mobile-link block text-primary-700 hover:text-accent-color transition duration-300"
          >
            Reserve a Table
          </NavLink>
          <NavLink
            to="/about"
            onClick={() => setIsOpen(false)}
            className="navbar__mobile-link block text-primary-700 hover:text-accent-color transition duration-300"
          >
            About
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
