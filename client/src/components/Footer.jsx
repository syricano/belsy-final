import { Link } from 'react-router';

const Footer = () => {
  return (
    <footer className="footer text-base-content py-6 mt-16">
      <div className="footerContainer">
        <p className="footer__copyright text-sm select-none bg-center text-primary-700">&copy; {new Date().getFullYear()} Belsy Restaurant. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0 gap-4">
          <a
            href="https://facebook.com/syriacano"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link hover:text-accent-color transition duration-300"
          >
            Facebook
          </a>
          <a
            href="https://github.com/syricano"
            target="_blank"
            rel="noopener noreferrer"
            className="footer__link hover:text-accent-color transition duration-300"
          >
            GitHub
          </a>
          <Link to="/contact" className="footer__link hover:text-accent-color transition duration-300">Contact</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
