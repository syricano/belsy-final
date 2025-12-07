import { Navigate } from 'react-router';
import { useAuth } from '@/context';

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div className="w-full flex justify-center py-16"><span className="loading loading-spinner" /></div>;
  if (!user) return <Navigate to="/signin" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
};

export default AdminRoute;
