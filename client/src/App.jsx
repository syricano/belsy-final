import { BrowserRouter, Routes, Route } from 'react-router';
import { RootLayout, ProtectedLayout } from '@/layouts';
import {
  AdminPage,
  UserPage,
  HomePage,  
  MenuPage,
  NotFoundPage,
  Signin,
  Signup,
  About,
  CartPage,
  CheckoutPage,
  OrdersPage,
} from '@/pages';

import './App.css';
import ContactPage from './pages/ContactPage';
import AdminRoute from './layouts/AdminRoute';

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
          <Route path="about" element={<About />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />

          {/* Protected Pages nested inside RootLayout */}
          <Route element={<ProtectedLayout />}>
            <Route path="profile" element={<UserPage />} />
            <Route
              path="admin"
              element={
                <AdminRoute>
                  <AdminPage />
                </AdminRoute>
              }
            />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:id" element={<OrdersPage />} />
          </Route>

          {/* Catch-all for 404 (inside RootLayout to show Navbar/Footer) */}
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
