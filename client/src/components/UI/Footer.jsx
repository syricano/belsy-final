import { Link, NavLink } from 'react-router';
import { useModal } from '@/context/ModalContext';
import { useLang } from '@/context';

const Footer = () => {
  const { setOpen } = useModal();
  const { t } = useLang();

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
          {t('footer.description')}
        </p>
        <p className="text-xs opacity-70 mt-2">
          © {new Date().getFullYear()} Belsy – {t('footer.rights_reserved')}
        </p>
      </aside>

      {/* Middle - Navigation Links */}
      <nav>
        <h6 className="footer-title">{t('footer.company')}</h6>
        <Link to="/about" className="link link-hover hover:text-[var(--p)] transition-all">{t('nav.about')}</Link>
        <Link to="/contact" className="link link-hover hover:text-[var(--p)] transition-all">{t('nav.contact')}</Link>
      </nav>

      <nav>
        <h6 className="footer-title">{t('footer.menu')}</h6>
        <Link to="/menu" className="link link-hover hover:text-[var(--p)] transition-all">{t('footer.view_menu')}</Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="link link-hover text-left hover:text-[var(--p)] transition-all"
        >
          {t('footer.book_table')}
        </button>
      </nav>

      {/* Right - Social (Empty Placeholder) */}
      <nav>
        <h6 className="footer-title">{t('footer.social')}</h6>          
        <Link to='https://www.facebook.com/syriacano' target='_blank' className="link link-hover hover:text-[var(--p)] transition-all"> Facebook </Link>
        <Link to='https://github.com/syricano' target='_blank' className="link link-hover hover:text-[var(--p)] transition-all"> Github </Link>
        <Link to='https://linkedin.com/in/anass-muhammad-ali-737608ab' target='_blank' className="link link-hover hover:text-[var(--p)] transition-all"> LinkedIn </Link>
      </nav>
    </footer>
  );
};

export default Footer;
