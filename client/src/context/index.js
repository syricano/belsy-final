import { useContext } from 'react';
import { AuthContext } from './AuthProvider';
import { AdminContext } from './AdminProvider';
import { CartContext } from './CartProvider';
import { LangProvider, useLang } from './LangProvider';

import AuthContextProvider from './AuthProvider';
import AdminContextProvider from './AdminProvider';
import CartProvider from './CartProvider';

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

const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export {
  useAuth,
  AuthContextProvider,
  useAdmin,
  AdminContextProvider,
  useCart,
  CartProvider,
  LangProvider,
  useLang,
};
