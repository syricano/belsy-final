import { BrowserRouter, Routes, Route } from 'react-router';
import { RootLayout, ProtectedLayout } from '@/layouts';
import {
  AdminPage,
  UserPage,
  HomePage,  
  ReservationsPage,
  MenuPage,
  NotFoundPage,
  About,
} from '@/pages';
import {
  Signin,
  Signup
} from '@/components'
import './App.css';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root Layout wraps everything */}
        <Route path="/" element={<RootLayout />}>
          {/* Public Pages */}
          <Route index element={<HomePage />} />
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="about" element={<About />} />

          {/* Protected Pages nested inside RootLayout */}
          <Route element={<ProtectedLayout />}>
            <Route path="profile" element={<UserPage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>

          {/* Catch-all for 404 (inside RootLayout to show Navbar/Footer) */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
