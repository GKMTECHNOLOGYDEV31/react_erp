// components/PublicRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PublicRouteProps {
  children: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // Si ya está logueado, redirige al dashboard (o cualquier ruta privada)
    return <Navigate to="/analytics" replace />;
  }

  return <>{children}</>;
};

export default PublicRoute;
