import { Link } from 'react-router'; // Ensure you're using 'react-router-dom' for navigation

const Footer = () => {
  return (
    <footer className='footer-section' >
      <div className="px-4">
        <aside className="text-center sm:text-left">
          <p className='text-center '>
            Copyright © {new Date().getFullYear()} Belsy Restaurant – All rights reserved
          </p>
        </aside>
      </div>
    </footer>
  );
};

export default Footer;

