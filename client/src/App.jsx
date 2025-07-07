import { BrowserRouter, Routes, Route } from 'react-router';
import { RootLayout, ProtectedLayout } from '@/layouts';
import { HomePage, Signin, Signup, UserProfile, ReservationsPage, MenuPage, NotFoundPage, AdminPage, About } from '@/pages';
import './App.css'; 


const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="signin" element={<Signin />} />
          <Route path="signup" element={<Signup />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="about" element={<About />} />
        </Route>
        {/* Protected Routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="profile" element={<UserProfile />} />
          <Route path="admin" element={<AdminPage />} />
        </Route>

        {/* Catch-all route for 404 pages */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App