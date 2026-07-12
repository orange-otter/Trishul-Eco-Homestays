import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader } from './ui/Loader';

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader size="lg" className="text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
