import { Link } from 'react-router';
import { useModal } from '@/context/ModalContext'; // ✅ Added

const Footer = () => {
  const { setOpen } = useModal(); // ✅ Access modal control

  return (
    <footer className="footer belsy-footer sm:footer-horizontal bg-[#004030] text-[#FFF9E5] px-6 py-12">
      {/* Left/Logo */}
      <aside className="space-y-2">
        <div className="flex items-center gap-3">
          <img src="/images/belsy-logo.jpg" alt="Belsy Logo" className="w-12 h-12 object-cover rounded-full border border-[#DCD0A8]" />
          <span className="text-xl font-serif tracking-wide">Belsy Restaurant</span>
        </div>
        <p className="max-w-xs text-sm opacity-80">
          Exquisite oriental cuisine served in a luxury ambiance. Your table is always waiting.
        </p>
        <p className="text-xs opacity-70 mt-2">
          © {new Date().getFullYear()} Belsy – All rights reserved
        </p>
      </aside>

      {/* Center - Links */}
      <nav>
        <h6 className="footer-title text-[#DCD0A8]">Company</h6>
        <Link to="/about" className="link link-hover">About</Link>
        <Link to="/contact" className="link link-hover">Contact</Link>
      </nav>

      <nav>
        <h6 className="footer-title text-[#DCD0A8]">Menu</h6>
        <Link to="/menu" className="link link-hover">View Menu</Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="link link-hover text-left"
        >
          Book a Table
        </button>
      </nav>

      {/* Right - Social */}
      <nav>
        <h6 className="footer-title text-[#DCD0A8]">Social</h6>
        <div className="grid grid-flow-col gap-4">
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
