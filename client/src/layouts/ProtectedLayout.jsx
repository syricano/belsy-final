import { Navigate, Outlet } from 'react-router';
import AdminContextProvider from '@/context/AdminProvider';
import { useAuth, useLang } from '@/context';

const ProtectedLayout = () => {
  const { user, loading } = useAuth();
  const { t } = useLang();

  if (loading) return <div>{t('common.loading')}</div>;
  if (!user) return <Navigate to="/signin" />;

  return (
    <AdminContextProvider>
      <Outlet />
    </AdminContextProvider>
  );
};

export default ProtectedLayout;
