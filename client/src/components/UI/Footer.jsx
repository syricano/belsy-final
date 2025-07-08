import { Link } from 'react-router'; // Ensure you're using 'react-router-dom' for navigation

const Footer = () => {
  return (
    <footer>
      <div className="p-4 gap-4 text:sm w-full">
        <p className="footer__copyright text-sm select-none bg-center text-primary-700 w-full">
          &copy; {new Date().getFullYear()} Belsy Restaurant. All rights reserved.
        </p>
        <div className="footer__social-links">
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
          <Link
            to="/contact"
            className="footer__link hover:text-accent-color transition duration-300"
          >
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
