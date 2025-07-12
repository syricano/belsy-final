// context/AuthProvider.jsx
import { createContext, useEffect, useState } from 'react';
import {
  profile,
  signout as signoutService,
  signin as signinService,
  signup as signupService,
  forgotPassword as forgotService,
  resetPassword as resetService,
  updateProfile as updateService,
  deleteAccount as deleteAccountService,
} from '@/data';

export const AuthContext = createContext();

const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkSession, setCheckSession] = useState(false); // ✅ added

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await profile();
        console.log("message", data.user)
        setUser(data.user || null);
        setIsAdmin(data.user?.role === 'Admin');
      } catch {
        setUser(null);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [checkSession]); // ✅ runs again when checkSession changes

  const signout = async () => {
    await signoutService();
    setUser(null);
    setIsAdmin(false);
  };

  const signin = async (credentials) => {
    const data = await signinService(credentials);
    setUser(data.user || null);
    setIsAdmin(data.user?.role === 'Admin');
    setCheckSession(prev => !prev); // ✅ trigger refresh
    return data;
  };

  const signup = async (userInfo) => {
    const data = await signupService(userInfo);
    setUser(data.user || null);
    setIsAdmin(data.user?.role === 'Admin');
    setCheckSession(prev => !prev); // ✅ trigger refresh
    return data;
  };

  const forgotPassword = async (email) => {
    return await forgotService(email);
  };

  const resetPassword = async (token, newPassword) => {
    return await resetService(token, newPassword);
  };

  const updateProfile = async (updatedData) => {
    const data = await updateService(updatedData);
    //setUser(data.user || null);
    setCheckSession(prev => !prev); // ✅ optional session re-check
    return data;
  };

  const deleteAccount = async (credentials) => {
    await deleteAccountService(credentials);
    setUser(null);
    setIsAdmin(false);
    setCheckSession(prev => !prev); // optional
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        loading,
        checkSession,
        setCheckSession,
        signin,
        signup,
        signout,
        forgotPassword,
        resetPassword,
        updateProfile,
        setUser,
        deleteAccount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
