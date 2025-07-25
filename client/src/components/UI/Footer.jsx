import { Link, NavLink } from 'react-router';
import { useModal } from '@/context/ModalContext';

const Footer = () => {
  const { setOpen } = useModal();

  return (
    <footer className="footer belsy-footer sm:footer-horizontal bg-[var(--a)] text-[var(--ac)] px-6 py-12">
      {/* Left - Logo + Description */}
      <aside className="space-y-3 max-w-sm">
        <div className="flex items-center gap-3">
          <Link to='/'>
          <img
            src="/images/belsy-logo.jpg"
            alt="Belsy Logo"
            className="w-12 h-12 object-cover rounded-full border border-[var(--bc)]"
          />
          </Link>
          <span className="text-xl font-serif tracking-wide">Belsy Restaurant</span>
        </div>
        <p className="text-sm opacity-80">
          Exquisite oriental cuisine served in a luxury ambiance. Your table is always waiting.
        </p>
        <p className="text-xs opacity-70 mt-2">
          © {new Date().getFullYear()} Belsy – All rights reserved
        </p>
      </aside>

      {/* Middle - Navigation Links */}
      <nav>
        <h6 className="footer-title">Company</h6>
        <Link to="/about" className="link link-hover hover:text-[var(--p)] transition-all">About</Link>
        <Link to="/contact" className="link link-hover hover:text-[var(--p)] transition-all">Contact</Link>
      </nav>

      <nav>
        <h6 className="footer-title">Menu</h6>
        <Link to="/menu" className="link link-hover hover:text-[var(--p)] transition-all">View Menu</Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="link link-hover text-left hover:text-[var(--p)] transition-all"
        >
          Book a Table
        </button>
      </nav>

      {/* Right - Social (Empty Placeholder) */}
      <nav>
        <h6 className="footer-title">Social</h6>          
        <Link to='https://www.facebook.com/syriacano' target='_blank' className="link link-hover hover:text-[var(--p)] transition-all"> Facebook </Link>
        <Link to='https://github.com/syricano' target='_blank' className="link link-hover hover:text-[var(--p)] transition-all"> Github </Link>
        <Link to='https://linkedin.com/in/anass-muhammad-ali-737608ab' target='_blank' className="link link-hover hover:text-[var(--p)] transition-all"> LinkedIn </Link>
      </nav>
    </footer>
  );
};

export default Footer;
