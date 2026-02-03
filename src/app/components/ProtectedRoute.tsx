import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../utils/constants';
import { UserRole } from '../types';
import { PageLoadingSpinner } from './ui/PageLoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <PageLoadingSpinner />;
  }

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`${ROUTES.LOGIN}?redirect=${redirect}`} replace state={{ from: location }} />;
  }

  if (allowedRoles && allowedRoles.length > 0 && role && !allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  return <>{children}</>;
}
