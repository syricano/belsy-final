import { createContext, useEffect, useState } from 'react';
import axiosInstance from '@/config/axiosConfig';
import { asyncHandler } from '@/utils';
import {
  // MENU + CATEGORY
  addMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenu as fetchMenu,
  getCategories as fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,

  // DUTY
  getAllDutyHours as fetchDutyHours,
  addDutyHour,
  updateDutyHour,
  deleteDutyHour,

  // TABLES
  addTable,
  updateTable,
  deleteTable as removeTable,
  getTables,

  // RESERVATIONS
  getAllReservations as getAdminReservations,
  approveReservation as approveRes,
  declineReservation as declineRes,

  // CONTACT
  getAllContacts as fetchContacts,
  deleteContact as removeContact,
  getContactInfo as fetchContactInfo,
  updateContactInfo as sendContactUpdate,
} from '@/data';

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [checkSession, setCheckSession] = useState(false);

  useEffect(() => {
    // Placeholder if needed later
  }, [checkSession]);

  // ================== MENU ==================
  const createMenuItem = (data) => asyncHandler(() => addMenuItem(data), 'Failed to create menu item');
  const updateMenuItem = (id, data) => asyncHandler(() => updateMenuItem(id, data), 'Failed to update menu item');
  const deleteMenuItem = (id) => asyncHandler(() => deleteMenuItem(id), 'Failed to delete menu item');
  const getMenu = () => asyncHandler(() => fetchMenu(), 'Failed to fetch menu');
  const getCategories = () => asyncHandler(() => fetchCategories(), 'Failed to fetch categories');

  // ================== CATEGORY ==================
  const createCategory = (data) => asyncHandler(() => addCategory(data), 'Failed to create category');
  const updateCategory = (id, data) => asyncHandler(() => updateCategory(id, data), 'Failed to update category');
  const deleteCategory = (id) => asyncHandler(() => deleteCategory(id), 'Failed to delete category');

  // ================== DUTY ==================
  const getAllDutyHours = () => asyncHandler(() => fetchDutyHours(), 'Failed to fetch duty hours');
  const createDuty = (data) => asyncHandler(() => addDutyHour(data), 'Failed to create duty');
  const updateDuty = (id, data) => asyncHandler(() => updateDutyHour(id, data), 'Failed to update duty');
  const deleteDuty = (id) => asyncHandler(() => deleteDutyHour(id), 'Failed to delete duty');

  // ================== TABLE ==================
  const createTable = (data) => asyncHandler(() => addTable(data), 'Failed to create table');
  const updateTable = (id, data) => asyncHandler(() => updateTable(id, data), 'Failed to update table');
  const deleteTable = (id) => asyncHandler(() => removeTable(id), 'Failed to delete table');
  const getTables = () => asyncHandler(() => axiosInstance.get('/tables'), 'Failed to fetch tables');

  // ================== RESERVATIONS ==================
  const getAllReservations = () => asyncHandler(() => getAdminReservations(), 'Failed to fetch reservations');
  const approveReservation = (id, response) =>
    asyncHandler(() => approveRes(id, response), 'Failed to approve reservation');
  const declineReservation = (id, response) =>
    asyncHandler(() => declineRes(id, response), 'Failed to decline reservation');

  // ================== CONTACT ==================
  const getAllContacts = () => asyncHandler(() => fetchContacts(), 'Failed to fetch contacts');
  const deleteContact = (id) => asyncHandler(() => removeContact(id), 'Failed to delete contact');
  const getContactInfo = () => asyncHandler(() => fetchContactInfo(), 'Failed to fetch contact info');
  const updateContactInfo = (data) => asyncHandler(() => sendContactUpdate(data), 'Failed to update contact info');

  return (
    <AdminContext.Provider
      value={{
        // Menu
        createMenuItem,
        updateMenuItem,
        deleteMenuItem,
        getMenu,
        getCategories,

        // Categories
        createCategory,
        updateCategory,
        deleteCategory,

        // Duty
        getAllDutyHours, // ✅ Exposed now
        createDuty,
        updateDuty,
        deleteDuty,

        // Tables
        createTable,
        updateTable,
        deleteTable,
        getTables,

        // Reservations
        getAllReservations,
        approveReservation,
        declineReservation,

        // Contact
        getAllContacts,
        deleteContact,
        getContactInfo,
        updateContactInfo,

        // Session checker (optional)
        checkSession,
        setCheckSession
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
