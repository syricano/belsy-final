import {Link} from 'react-router'

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content py-6 mt-16">
      <div className="footerContainer">
        <p className="text-sm select-non">&copy; {new Date().getFullYear()} Belsy Restaurant All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a
            href="https://facebook.com/syriacano" 
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-primary transition"
          >
            Facebook
          </a>
          <a
            href="https://github.com/syricano"
            target="_blank"
            rel="noopener noreferrer"
            className="footerLink"
          >
            GitHub
          </a>
          
          <Link to="/contact" className="footerLink">Contact</Link>
          
        </div>
      </div>
    </footer>
  )
}

export default Footer