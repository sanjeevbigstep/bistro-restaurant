import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES, ROLES } from '../constants';
import Button from './Button';

export default function Navbar() {
  const { user, logout, isAdmin, isStaff } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.HOME);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link to={ROUTES.HOME} className="text-xl font-bold text-orange-500 tracking-tight">
              Bistro
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to={ROUTES.MENU} className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
                Menu
              </Link>
              <Link to={ROUTES.RESERVATIONS} className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
                Reserve a Table
              </Link>
              {user && (
                <Link to={ROUTES.MY_RESERVATIONS} className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
                  My Reservations
                </Link>
              )}
              {isStaff() && (
                <Link to={ROUTES.DASHBOARD} className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors">
                  Dashboard
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:block text-sm text-gray-500">
                  {user.name}
                  {isAdmin() && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                      Admin
                    </span>
                  )}
                  {user.role === ROLES.STAFF && (
                    <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      Staff
                    </span>
                  )}
                </span>
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.LOGIN)}>
                  Sign in
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate(ROUTES.REGISTER)}>
                  Sign up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
