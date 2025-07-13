import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { AdminContext } from './AdminProvider';

import AuthContextProvider from './AuthProvider';
import AdminContextProvider from './AdminProvider';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthContextProvider');
  return context;
};

const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminContextProvider');
  return context;
};

export {
  useAuth,
  AuthContextProvider,
  useAdmin,
  AdminContextProvider,
};
