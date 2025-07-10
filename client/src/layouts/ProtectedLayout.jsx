import { Navigate, Outlet } from 'react-router';
import { useAuth } from '@/context';

const ProtectedLayout = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/signin" />;

  return <Outlet />;
};

export default ProtectedLayout;
