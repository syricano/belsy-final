// Exporting all UI components
import Navbar from './UI/Navbar';
import Footer from './UI/Footer';
import ThemeToggle from './UI/ThemeToggle';
import Button from './UI/Button';  // Example of a generic button component

// Exporting all Reservations components
import ReservationForm from './Reservations/ReservationForm';
import ReservationCard from './Reservations/ReservationCard';
import ReservationStatus from './Reservations/ReservationStatus';

// Exporting all Tables components
import TableList from './Tables/TableList';
import TableCard from './Tables/TableCard';
import TableAvailability from './Tables/TableAvailability';
import TableLocationFilter from './Tables/TableLocationFilter'; 

// Exporting all Menus components
import MenuCard from './Menus/MenuCard';
import MenuItem from './Menus/MenuItem';
import MenuCategory from './Menus/MenuCategory';

// Exporting all Admin components
import AdminDashboard from './Admin/AdminDashboard';
import BookingManagement from './Admin/BookingManagement';
import MenuManagement from './Admin/MenuManagement';
import WorkingHoursManagement from './Admin/WorkingHoursManagement';
import ContactInfoManagement from './Admin/ContactInfoManagement';
import TableManagement from './Admin/TableManagement'; // New component for managing tables

// Exporting Notifications component
import NotificationModal from './Notifications/NotificationModal';

// Export all components together for easy import
export {
  // UI components
  Navbar,
  Footer,
  ThemeToggle,
  Button,

  // Reservations components
  ReservationForm,
  ReservationCard,
  ReservationStatus,

  // Tables components
  TableList,
  TableCard,
  TableAvailability,
  TableLocationFilter,

  // Menus components
  MenuCard,
  MenuItem,
  MenuCategory,

  // Admin components
  AdminDashboard,
  BookingManagement,
  MenuManagement,
  WorkingHoursManagement,
  ContactInfoManagement,
  TableManagement,

  // Notifications component
  NotificationModal
};
