import { createContext, useEffect, useState } from 'react';
import axiosInstance from '@/config/axiosConfig';
import { asyncHandler } from '@/utils';
import {
  // MENU + CATEGORY
  addMenuItem as menuAdder,
  updateMenuItem as menuUpdater,
  deleteMenuItem as menuDeleter,
  getMenu as fetchMenu,
  getCategories as fetchCategories,
  addCategory as categoryAdder,
  updateCategory as categoryUpdater,
  deleteCategory as categoryDeleter,

  // DUTY
  getAllDutyHours as fetchDutyHours,
  addDutyHour as addWorkingHour,
  updateDutyHour as updateWorkingHour,
  deleteDutyHour as deleteWorkingHour,

  // TABLES
  addTable as tableAdder,
  updateTable as tableUpdater,
  deleteTable as removeTable,
  getTables as fetchTable,

  // RESERVATIONS
  getAllReservations as getAdminReservations,
  approveReservation as approveRes,
  declineReservation as declineRes,

  // Address
  getAllAddress as fetchAddresses,
  deleteAddress as removeAddress,
  getAddress as fetchAddress,
  updateAddress as sendAddressUpdate,
} from '@/data';

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [checkSession, setCheckSession] = useState(false);

  useEffect(() => {
    // Placeholder if needed later
  }, [checkSession]);

  // ================== MENU ==================
  const createMenuItem = (data) => asyncHandler(() => menuAdder(data), 'Failed to create menu item');
  const updateMenuItem = (id, data) => asyncHandler(() => menuUpdater(id, data), 'Failed to update menu item');
  const deleteMenuItem = (id) => asyncHandler(() => menuDeleter(id), 'Failed to delete menu item');
  const getMenu = () => asyncHandler(() => fetchMenu(), 'Failed to fetch menu');
  const getCategories = () => asyncHandler(() => fetchCategories(), 'Failed to fetch categories');

  // ================== CATEGORY ==================
  const createCategory = (data) => asyncHandler(() => categoryAdder(data), 'Failed to create category');
  const updateCategory = (id, data) => asyncHandler(() => categoryUpdater(id, data), 'Failed to update category');
  const deleteCategory = (id) => asyncHandler(() => categoryDeleter(id), 'Failed to delete category');

  // ================== DUTY ==================
  const getAllDutyHours = () => asyncHandler(() => fetchDutyHours(), 'Failed to fetch duty hours');
  const createDuty = (data) => asyncHandler(() => addWorkingHour(data), 'Failed to create duty');
  const updateDuty = (id, data) => asyncHandler(() => updateWorkingHour(id, data), 'Failed to update duty');
  const deleteDuty = (id) => asyncHandler(() => deleteWorkingHour(id), 'Failed to delete duty');

  // ================== TABLE ==================
  const createTable = (data) => asyncHandler(() => tableAdder(data), 'Failed to create table');
  const updateTable = (id, data) => asyncHandler(() => tableUpdater(id, data), 'Failed to update table');
  const deleteTable = (id) => asyncHandler(() => removeTable(id), 'Failed to delete table');
  const getTables = () => asyncHandler(() => fetchTable(), 'Failed to fetch tables');

  // ================== RESERVATIONS ==================
  const getAllReservations = () => asyncHandler(() => getAdminReservations(), 'Failed to fetch reservations');
  const approveReservation = (id, response) =>
    asyncHandler(() => approveRes(id, response), 'Failed to approve reservation');
  const declineReservation = (id, response) =>
    asyncHandler(() => declineRes(id, response), 'Failed to decline reservation');

  // ================== Address ==================
  const getAllAddress = () => asyncHandler(() => fetchAddresses(), 'Failed to fetch addresses');
  const deleteAddress = (id) => asyncHandler(() => removeAddress(id), 'Failed to delete address');
  const getAddress = () => asyncHandler(() => fetchAddress(), 'Failed to fetch address');
  const updateAddress = (data) => asyncHandler(() => sendAddressUpdate(data), 'Failed to update address info');

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

        // Address
        getAllAddress,
        deleteAddress,
        getAddress,
        updateAddress,

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
