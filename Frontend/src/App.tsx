import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import { ROUTES, ROLES } from './constants';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import MenuListPage from './pages/menu/MenuListPage';
import ReservationFormPage from './pages/reservations/ReservationFormPage';
import MyReservationsPage from './pages/reservations/MyReservationsPage';
import AdminDashboard from './pages/dashboard/AdminDashboard';
import AdminMenuPage from './pages/dashboard/AdminMenuPage';
import AdminReservationsPage from './pages/dashboard/AdminReservationsPage';
import AdminUsersPage from './pages/dashboard/AdminUsersPage';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path={ROUTES.HOME} element={<HomePage />} />
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
            <Route path={ROUTES.MENU} element={<MenuListPage />} />
            <Route path={ROUTES.RESERVATIONS} element={<ReservationFormPage />} />
            <Route
              path={ROUTES.MY_RESERVATIONS}
              element={
                <ProtectedRoute>
                  <MyReservationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.STAFF]}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.DASHBOARD_MENU}
              element={
                <ProtectedRoute roles={[ROLES.ADMIN]}>
                  <AdminMenuPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.DASHBOARD_RESERVATIONS}
              element={
                <ProtectedRoute roles={[ROLES.ADMIN, ROLES.STAFF]}>
                  <AdminReservationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.DASHBOARD_USERS}
              element={
                <ProtectedRoute roles={[ROLES.ADMIN]}>
                  <AdminUsersPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
