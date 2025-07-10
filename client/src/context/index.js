import { useContext } from 'react';
import { AuthContext } from './AuthProvider'; 
import AuthContextProvider from './AuthProvider';

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthContextProvider');
  return context;
};

export { useAuth, AuthContextProvider };
