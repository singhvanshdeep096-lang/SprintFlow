import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AdminRoute() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.role?.toLowerCase();
  const isAdmin = role === 'admin' || user?.is_superuser === true;

  if (!isAdmin) {
    // If authenticated user is not an admin, redirect them to standard user dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
