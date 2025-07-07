import { useState } from 'react'
import { Link } from 'react-router'
import ThemeToggle from './ThemeToggle'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav>
      {/* Main Navbar */}
      <div className="flex justify-between items-center p-4">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Link to="/">Belsy Restaurant</Link>
          <ThemeToggle />
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-4">
          <Link to="/">Home</Link>
          <Link to="/menu">Menu</Link>
          <Link to="/reservations">Reserve a Table</Link>
          <Link to="/about">About</Link>
        </div>

        {/* Mobile Burger Button */}
        <button className="md:hidden flex flex-col justify-center items-center space-y-1 p-2" onClick={() => setIsOpen(!isOpen)} aria-label="Toggle menu">
          <span className={`w-6 h-1 rounded-lg transform transition duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} style={{ backgroundColor: 'currentColor' }}></span>
          <span className={`w-6 h-1 rounded-lg ${isOpen ? 'opacity-0' : 'opacity-100'}`} style={{ backgroundColor: 'currentColor' }}></span>
          <span className={`w-6 h-1 rounded-lg transform transition duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} style={{ backgroundColor: 'currentColor' }}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden p-4 space-y-4">
          <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/menu" onClick={() => setIsOpen(false)}>Menu</Link>
          <Link to="/reservations" onClick={() => setIsOpen(false)}>Reserve a Table</Link>
          <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar
