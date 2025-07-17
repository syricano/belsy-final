import { Navigate, Outlet } from 'react-router';
import AdminContextProvider from '@/context/AdminProvider';
import { useAuth } from '@/context';

const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/signin" />;

  return (
    <AdminContextProvider>
      <Outlet />
    </AdminContextProvider>
  );
};

export default ProtectedLayout;
