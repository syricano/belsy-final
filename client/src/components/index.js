// Exporting all UI components
import Navbar from './UI/Navbar';
import Footer from './UI/Footer';
import ThemeToggle from './UI/ThemeToggle';
import Button from './UI/Button';  
import Card from './UI/Card';
import Modal from './UI/Modal';
import HeroSection from './UI/HeroSection';
import ImageSlider from './UI/ImageSlider';


// user interface components

// Exporting Auth components
import Signin from './auth/Signin';
import Signup from './auth/Signup';


// Exporting all Reservations components
import ReservationForm from './Reservations/ReservationForm';
import ReservationStatus from './Reservations/ReservationStatus';

// Exporting all Menus components
import MenuCard from './Menus/MenuCard';
import MenuItem from './Menus/MenuItem';
import MenuCategory from './Menus/MenuCategory';

// admin interface components

// Exporting all Admin components
import AdminDashboard from './Admin/AdminDashboard';
import ReservationManager from './Admin/ReservationManager';
import MenuManager from './Admin/MenuManager';
import DutyManager from './Admin/DutyManager';
import ContactManager from './Admin/ContactManager';
import TableManager from './Admin/TableManager'; 
import ReservationModal from './Reservations/ReservationModal';
//import BookReservationButton from './Reservations/BookReservationButton';

// Exporting Notifications component
import NotificationModal from './Notifications/NotificationModal';




// Export all components together for easy import
export {
  // UI components
  Navbar,
  Footer,
  ThemeToggle,
  Button,
  Card,
  Modal,
  HeroSection,
  ImageSlider,

  // Auth components
  Signin,
  Signup,

  // Reservations components
  ReservationForm,  
  ReservationStatus,
  ReservationModal,
//  BookReservationButton,

  // Menus components
  MenuCard,
  MenuItem,
  MenuCategory,

  // Admin components
  AdminDashboard,
  ReservationManager,
  MenuManager,
  DutyManager,
  ContactManager,
  TableManager,

  // Notifications component
  NotificationModal
};
